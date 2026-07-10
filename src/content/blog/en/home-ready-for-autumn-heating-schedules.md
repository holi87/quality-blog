---
title: "A Home Ready for Autumn: Heating Schedules in Home Assistant Before It Gets Cold"
description: "Heating schedules in Home Assistant: an inventory of what you control, zones with TRVs, presence-based setbacks, sensor calibration and a September dry run before the season."
date: 2026-08-28
tags: ["smart-home", "home-assistant", "heating", "schedules", "energy"]
lang: en
readingTime: 16
author: GH
---

Late August is a strange time to write about heating - it's still summer outside, and I've just finished a service round of my thermostatic radiator valves. That's deliberate: heating schedules built now get a calm shakedown in September, instead of being thrown together in a panic during the first frosts, when every mistake means cold mornings. Two weeks ago I was still tuning [heatwave automations](/en/blog/heatwave-automations-blinds-air-conditioning/), but the smart home season turns faster than the weather does. In this post I walk through the whole process: an inventory of what you can actually control, splitting the house into zones, a weekly schedule with a setback temperature, presence instead of fixed hours, sensor calibration and a September dry run - with yaml examples and a list of first-season mistakes.

## Why late August, not October

The first reason is purely technical: a heating system that has sat idle since April has every right not to work. After five months without movement, TRVs can have a stuck valve pin, batteries half drained, and a Zigbee pairing lost somewhere along the way after a power cut. Discovering that now costs ten minutes with the entity list; discovering it in November costs a cold evening and a hunt for batteries through the drawers. I run a test heating cycle at the end of August precisely so that failures reveal themselves with the windows open, not at minus five.

The second reason is shopping and calibration without pressure. If the inventory shows gaps - a valve for the bedroom radiator, a temperature sensor for the office, a relay for the electric heater in the garage - you order them in September at your leisure and install them on a free evening. In October, when everyone remembers winter at once, popular models vanish from shops or sit in delivery queues for weeks. Sensor calibration, in turn, needs stable conditions and several iterations spread over days - that's not something you can cram into a single weekend.

The third reason is a proving ground you cannot simulate: the first cool week of September. Nights below ten degrees, days still warm - the heating genuinely kicks in, the schedule runs a full daily cycle, and the cost of every mistake is close to zero, because nobody freezes. It's the best test window of the entire year, and you only get it once.

## Inventory: what heats your home and what you can control

Before any schedule exists, write down two layers: the heat source and the control points. The source may be a gas boiler, a heat pump, electric heaters or underfloor heating - and each imposes different constraints. A gas boiler usually listens to a single main thermostat: through a dry contact, meaning a plain relay, or - better - through the OpenTherm protocol with power modulation. A heat pump has its own control logic and heating curve; Home Assistant should nudge it, not replace it, because switching a pump on and off frequently from the outside shortens its life and hurts its efficiency. Electric heaters are the simplest case: a relay with energy metering plus a temperature sensor. Water underfloor heating responds with an inertia measured in hours, so controlling it feels like steering a tanker - more on that below.

The second layer is the control points as Home Assistant sees them. The main thermostat shows up as a single climate entity and governs the whole circuit. Zigbee TRVs are a separate climate entity per radiator - and they are what makes zones possible. A relay paired with a temperature sensor can be wired into a virtual thermostat with the `generic_thermostat` integration, which turns a switch-plus-sensor pair into a fully fledged climate entity with hysteresis. The output of the inventory should be a plain table: room, radiator, controlled by what, which entity. Mine came out at eleven radiators, eight of them controllable - I ordered the three missing valves in early September, unhurried and without overpaying.

## Zones instead of one temperature for the whole house

One temperature for the entire house wastes energy in both directions: the bedroom overheated at night, when you want it cool for sleeping, and the office underheated during exactly the hours you sit in it. The zone model assigns each room its own pair of temperatures - comfort and setback - plus the time windows when comfort applies. My starting point for this season looks like this:

| Zone | Comfort | Setback | Comfort window |
| --- | --- | --- | --- |
| Bedroom | 19.0 | 17.0 | 20:00-22:30 |
| Office | 21.5 | 18.0 | Mon-Fri 7:00-16:00 |
| Bathroom | 22.5 | 19.0 | 6:00-8:00 and 20:00-22:00 |
| Living room with kitchen | 21.0 | 18.5 | 14:00-22:30 |
| Hallway | 18.5 | 18.5 | no window, constant temperature |

TRVs implement zones physically, but the hydraulic design must not depend on Home Assistant entities alone. With valves on all radiators, the source needs a correct demand signal, minimum flow, and protection against running into closed valves. Depending on the installation, this may require a radiator without a TRV, an automatic bypass valve, a buffer, or another manufacturer-approved design. A thermostat in the coolest room or automation reading TRV positions does not replace an installer and the boiler or heat pump's own safeguards.

Zones don't make sense everywhere. An open-plan living room with a kitchen and a staircase is one zone regardless of how many radiators it has - air mixes faster than the valves can differentiate, and two different targets in the same air end with one radiator doing the work of both. Underfloor heating, in turn, tolerates time-based zones poorly: with hours of inertia, the comfort window would have to start in the middle of the night for the morning to be warm. It is better served by a constant low target and weather compensation on the source side.

## The weekly schedule and the setback temperature

Schedules in Home Assistant need nothing from outside the box: the built-in schedule helper (Settings, Devices and services, Helpers) lets you draw the weekly blocks with a mouse and exposes a `schedule.*` entity with an on/off state. An automation maps that state onto temperatures: on means comfort, off means the setback. If you prefer adjusting targets straight from the dashboard, HACS has a popular scheduler card that drives climate entities without writing automations - but the helper variant is transparent, keeps the logic in one place and versions cleanly.

```yaml
automation:
  - alias: "Heating - office by schedule"
    triggers:
      - trigger: state
        entity_id: schedule.office_work_hours
    actions:
      - if: "{{ is_state('schedule.office_work_hours', 'on') }}"
        then:
          - action: climate.set_temperature
            target:
              entity_id: climate.office
            data:
              temperature: 21.5
        else:
          - action: climate.set_temperature
            target:
              entity_id: climate.office
            data:
              temperature: 18.0
```

How much does a night setback save? It depends on insulation, weather, duration, and heat source, so a universal percentage per degree would mislead. In a well-insulated house with a heat pump, a deep setback may reduce efficiency during recovery. Start with a small change or none and compare weather-normalized consumption rather than two consecutive days.

## Presence instead of fixed hours

The schedule describes the week as it should be; presence corrects the week as it actually is. Three automations do most of the work here. First: **empty house, everything to setback**. When the person count in the home zone drops to zero for longer than half an hour, every zone gets its setback temperature, regardless of what the schedule says at that moment. The half-hour delay matters - a trip to the shop should not cool the house down.

Second: **raising before the return**. Measure warm-up time for the room and weather. A commute zone can restore the schedule earlier, but geolocation can be delayed or wrong, so do not use it as the only freeze safeguard or proof of presence. I use the [presence sensors described separately](/en/blog/presence-sensors-2026-pir-mmwave-bluetooth/) with a safe behavior for missing data.

Third: **an open window turns the radiator down**. A contact sensor on the window, a two-minute delay so a brief tilt doesn't trigger anything, and the valve switches off until the window closes. Some TRVs have their own open-window detection based on a sudden temperature drop, but an external sensor is faster and doesn't produce false reactions from an ordinary draught.

```yaml
  - alias: "Bedroom - window open, pause heating"
    triggers:
      - trigger: state
        entity_id: binary_sensor.bedroom_window
        to: "on"
        for: "00:02:00"
    actions:
      - action: climate.set_hvac_mode
        target:
          entity_id: climate.bedroom
        data:
          hvac_mode: "off"

  - alias: "Bedroom - window closed, resume heating"
    triggers:
      - trigger: state
        entity_id: binary_sensor.bedroom_window
        to: "off"
        for: "00:01:00"
    actions:
      - action: script.restore_bedroom_heating
```

The restore script must remember the mode and target from before the window opened and re-check the schedule. Do not hardcode `heat`, because that can start heating that a person or another safeguard had already disabled.

## Calibration: the TRV's built-in sensor lies

A thermostatic valve measures temperature at the radiator, often in a niche or behind a curtain, so its reading may differ from the occupied part of the room. The direction and size of the error depend on mounting and airflow - it is not always two or three degrees or always an over-reading.

A separate sensor in a representative location, away from heat sources, windows, and electronics, can be the reference. Some TRVs expose a calibration offset, but not every device does and its range varies. Check the manual and compare readings after stabilization. Frequently rewriting the offset can increase network traffic, battery use, and control instability; use dynamic correction only after testing, with rate and change limits.

## Costs and tariffs: close the feedback loop

A schedule without measurement is guesswork. The minimum worth having before the season: consumption metering at the source - pulses from the gas meter, or energy measurement on the pump and the heaters - plus temperature history per zone. I described how to put that together in the post on [energy monitoring in Home Assistant](/en/blog/energy-monitoring-home-assistant/); here it's enough to say that without this data you cannot answer whether the night setback in your house does anything at all, or which zones heat the longest.

Tariffs enter the picture with electric heating, but shifting a heat pump does not always reduce cost or energy. Raising the target may lower efficiency and comfort, while dynamic prices may use intervals shorter than an hour. Simulate the complete bill and adjust the curve or target only within manufacturer guidance, measuring the result.

## A September dry run

Pick the first week when nights drop below ten degrees and stage a full dress rehearsal. The scenario: raise the targets two or three degrees above the current room temperatures, so the heating genuinely starts, and watch the history for two or three days - does every valve open, does each zone reach its target and how long does it take, does the boiler receive a heat request exactly when it should. Then restore the normal targets and let the schedule run a full weekly cycle untouched. Everything that needs fixing gets fixed while the weather window is still open, not in the frost.

> A heating schedule that runs for the first time in November gets debugged in a woolly hat, with an unhappy household watching.

The list of typical first-season mistakes - I have made every one of them in my own house:

- **Uncalibrated valves** - rooms consistently two degrees below target, household members turning dials blindly, and the schedule loses its meaning. Calibrate before the season, not during it.
- **The schedule fighting manual changes** - someone raises the temperature on the dial, and ten minutes later the automation reverts it. Add a toggle helper acting as a manual mode that suspends the zone's automations for a few hours after a manual change.
- **No airing mode** - a radiator may run under an open window. A contact sensor is one option, but resume logic must remember the previous mode and respect source safeguards.
- **Stuck valves** - the TRV reports open while the valve physically stays shut. Before the season, cycle every valve a few times from fully open to fully closed.
- **All zones starting at the same hour** - this may increase peak demand, but behavior depends on source control and modulation. Stagger starts only when measurements show a problem and comfort is preserved.

## Summary

A home ready for autumn is not a gadget, it's a sequence: an inventory of the heat source and control points, zones with a comfort-setback temperature pair, a weekly schedule on the built-in helper, presence as the correction for exceptions, valve calibration against external sensors, and consumption measurement as the feedback loop. The order matters - a schedule built on uncalibrated valves is built on sand. Start this weekend with the inventory and a test heating run, and leave September for calibration and the dry run. When the first real cold arrives in mid-October, the house will simply do its job - and the most you'll do is open the history to confirm everything played out as designed.
