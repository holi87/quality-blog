---
title: "Heatwave Automations: Blinds, Air Conditioning and Sensors Before the House Heats Up"
description: "Heat mode in Home Assistant: forecast as the trigger, blinds driven by sun position per facade, night ventilation and air conditioning without automation wars - with yaml."
date: 2026-08-17
tags: ["smart-home", "home-assistant", "heatwave", "blinds", "air-conditioning", "automations"]
lang: en
readingTime: 17
author: GH
---

Air conditioning switched on by hand at 3 p.m., when the living room is already at thirty degrees, is not an automation - it's an expensive panic button. A house that has been allowed to heat up will keep radiating that heat until late at night, no matter how much electricity you pump into the compressor. The core of any heat defence is to keep the heat out in the first place, and that requires decisions made in the morning, when nobody is thinking about the heat yet. I'll show a complete setup in Home Assistant: the forecast as the trigger for a heat mode, blinds driven by the sun's position separately for each facade, night ventilation based on the temperature difference, and air conditioning that enters the game last.

## Prevention beats reaction

Physics plays against latecomers. Walls, ceilings and furniture have thermal mass: through a hot day they store energy, and in the evening they release it back into the rooms like a storage heater. That's why a house sitting at twenty-nine degrees at 5 p.m. will not cool down from a draught at 10 p.m. - it will keep heating itself from the inside well past midnight. Air conditioning can remove that heat, but it removes it after the fact, paying in electricity for every kilowatt-hour that walked in through a window a few hours earlier.

And a lot walks in. An unshaded window on the south or west side admits several hundred watts per square metre of glass on a sunny day. Three such windows in a living room add up to a heater with the power draw of an electric kettle, running from morning to evening, that nobody ordered. An external roller shutter or facade blind reflects that radiation before it ever touches the glass - which is why it works many times better than an internal curtain, where the heat is already in the room and stays there.

This is exactly where automation beats humans, and not through strength but through timing. A person reacts to a sensation: they lower the blinds once it has become hot, which is too late. The automation lowers them at nine in the morning on a day that is merely going to be hot, because the forecast already says so. The rest of this article is one principle unpacked: every cooling decision must be made before the heat gets in, not after.

## Input data: forecast, sun position and temperatures

Start with a central heat mode switch - a helper input_boolean entity that the forecast turns on and every other automation checks. In the evening, an automation pulls the daily forecast from your weather integration and, if tomorrow's maximum crosses the threshold, arms the house for the next day:

```yaml
triggers:
  - trigger: time
    at: "21:30:00"
actions:
  - action: weather.get_forecasts
    target:
      entity_id: weather.home
    data:
      type: daily
    response_variable: forecast_data
  - if: "{{ forecast_data['weather.home'].forecast[1].temperature >= 29 }}"
    then:
      - action: input_boolean.turn_on
        target:
          entity_id: input_boolean.heat_mode
```

The `forecast[1]` index is tomorrow (index zero is usually the current day - verify this in your integration, because providers differ). Handle switching off in a separate automation and with a margin: heat mode only disarms once the forecast maximum drops below twenty-six degrees, not twenty-nine. That gap between thresholds saves you from a house that changes its mind every other day.

The second data source is the sun's position. The `sun.sun` entity exposes azimuth and elevation attributes - exactly what the blinds need in order to know which facade is currently under fire. The details are in the [sun integration documentation](https://www.home-assistant.io/integrations/sun/). Azimuth tells you which direction the sun is shining from; elevation tells you whether it heats at all: a low sun at 7 a.m. on the east facade can push more heat through a window than the midday sun overhead, because it reaches deep into the room.

The third group is temperatures, and here the pair matters, not a single number: the indoor temperature of every room you care about, and the outdoor temperature measured in the shade, ideally on the north facade. An outdoor sensor in direct sun reports the temperature of the sensor, not of the air, and overstates the reading by several degrees. If you want to tell a hot sunny day apart from a hot overcast one, add an illuminance sensor on the facade or use cloud coverage from the weather integration - that's the condition that will save you from shutting the blinds on a day when the sun isn't doing any heating anyway.

## Blinds by facade and sun position

The most common beginner mistake: a single automation saying "heat = all blinds down at ten". The house turns into a bunker for twelve hours, the household rebels, and within a week the whole heat mode ends up in the bin. The sun doesn't heat all facades at once, so the blinds should work in shifts: the east facade defends itself in the morning, the south one in the middle of the day, the west one in the afternoon and evening. One automation per facade, triggered by the sun's azimuth:

```yaml
triggers:
  - trigger: numeric_state
    entity_id: sun.sun
    attribute: azimuth
    above: 120
conditions:
  - condition: state
    entity_id: input_boolean.heat_mode
    state: "on"
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    above: 20
actions:
  - action: cover.set_cover_position
    target:
      entity_id: cover.living_room_south
    data:
      position: 15
```

A mirror automation raises the blind once the azimuth leaves the facade's sector - the sun has moved on, the room can have its daylight back. You can map the sectors in a single day of observation: note the azimuth at which the sun starts and stops entering a given window, and enter those numbers as thresholds. At my place the east facade works roughly between azimuth 70 and 130, the south one between 120 and 220, the west one from 210 until sunset.

Match the closing percentage to the room's function. Bedrooms and rooms unused during the day: fully closed, darkness bothers nobody there. The living room and workspaces: position 10-20 percent, which cuts off direct radiation but leaves daylight gaps. If you have facade blinds with slats, control the angle instead of the position via `cover.set_cover_tilt_position` - slats angled against the sun block the direct rays while letting diffuse light through, and that's the best compromise between cool and bright that I know of.

## Air conditioning and ventilation with a plan

In this setup air conditioning is the last line of defence, not the first - but when it does act, let it act early. Waiting until the temperature crosses the comfort threshold repeats the blinds mistake: the compressor gets the whole accumulated heat load at once, at the hottest time of day, at peak grid load. Instead, on a day with heat mode active I start cooling before noon, when the living room is at a mere twenty-four and a half degrees, via `climate.set_temperature` with cooling mode and a target of twenty-four. Holding a low temperature costs less than beating down a high one, because the compressor runs steadily at low power instead of in bursts at full. If you're on a time-of-use tariff, shift this pre-cooling into the cheaper window - cooling the house one extra degree before noon builds a store of cold in the walls that you spend during the expensive afternoon peak.

The other half of this section costs zero per kilowatt-hour: night ventilation. After a hot day, the outside air becomes cooler than the house in the evening - and that is the only time of day when open windows cool instead of heat. An automation watches the temperature difference and speaks up when ventilating starts to make sense:

```yaml
triggers:
  - trigger: template
    value_template: >
      {{ states('sensor.garden_temperature') | float(30)
         < states('sensor.living_room_temperature') | float(0) - 2 }}
conditions:
  - condition: time
    after: "20:00:00"
  - condition: state
    entity_id: input_boolean.heat_mode
    state: "on"
actions:
  - action: notify.mobile_app_phone_gh
    data:
      message: "It's 2 degrees cooler outside than in the living room - time to open the windows."
```

A two-degree delta is the minimum at which a draught genuinely cools; below that, the air exchange is cosmetic. If you have a heat recovery ventilation unit with a summer bypass, the same logic works without opening anything: at the right delta the ventilation switches to bypass and pumps cool air in all night. The closing move is the mirror automation in the morning: once the outdoor temperature catches up with the indoor one, the phone reminds you to shut the windows, and heat mode drops the east facade's blinds. The night dumped the heat; in the morning we lock it outside.

## Human versus automation

The fastest way to make your household hate heat mode: a blind raised by hand, because someone wants to look at the garden, slides back down five minutes later. Raised again - down it goes again. The human always wins that war, but only by flipping the master switch of the whole automation, so it's better if there is no war. A manual position change must be a "I know what I'm doing" signal to the system, respected for several hours.

The pattern is simple: a helper timer entity per facade. An automation listens for blind state changes; if a change happened and no blind automation ran within the last minute, it counts as manual and starts the timer for four hours. Every automation for that facade carries the condition: act only while the timer is idle. After four hours the system quietly resumes guarding the facade, with no grudge and no memory. Four hours is my compromise: long enough for the override to mean something, short enough that a forgotten blind doesn't bake the room until evening.

The second classic human-versus-machine collision: an open window next to running air conditioning. Contact sensors on the windows of cooled rooms, plus one plain rule: a window open for longer than three minutes switches off cooling in that room and sends a notification asking whether to restore it after closing. The three-minute delay matters - a brief opening to hand something through the window should trigger no reaction at all. When the window closes, the cooling comes back on its own. Without this rule you pay to cool the garden while the compressor runs flat out without a break.

## Comfort versus energy cost

It's worth putting numbers on the stakes. The air conditioner in my living room draws about 0.8 kW on average while actively cooling. A reactive day - starting at 3 p.m., running almost continuously until 11 p.m. - peaks at 6 kWh for a single room. A day with full heat mode, meaning blinds from the morning, night ventilation and a short pre-cool before noon, closes at around 1.5-2 kWh, and the peak temperature is lower, not higher. You'll only see these numbers for your own house once you measure them - I described how to assemble that in the post on [energy monitoring in Home Assistant](/en/blog/energy-monitoring-home-assistant/). Without measurement, any discussion of cooling costs is guesswork.

The same measurements led me to a conclusion that initially surprised me: for most of a Central European summer, the air conditioning is simply unnecessary. With maximums up to thirty degrees and nights below twenty, blinds alone plus proper night ventilation keep the house under twenty-six. The compressor only enters the game during multi-day heatwaves, when the nights stop cooling and the house never gets a chance to shed its heat. That inverts the default intuition: air conditioning is not the plan for summer, it's the plan for the exceptions.

> The cheapest kilowatt-hour of cooling is the one you never had to produce, because the heat never got inside.

Set your comfort thresholds deliberately, because every extra degree downward costs disproportionately much: holding twenty-two degrees against thirty-five outside can double the consumption compared to holding twenty-five. My compromise: twenty-five in the daytime rooms, twenty-four in the bedroom for the hour before sleep. If you want to go further and hand the thresholds and schedules over to algorithms, a starting point is in the post on [AI-driven energy optimization](/en/blog/ai-smart-home-energy-optimization/).

## Common mistakes

A few rakes I've stepped on myself or watched others step on - all avoidable with a single fix.

- **Automations at war with each other.** Heat mode lowers a blind, and an older "raise on high brightness" automation raises it back. Symptom: blinds shuttling up and down every few minutes, motors overheating, household members tapping their foreheads. Cure: during the heat season one automation owns the device - every other one gets an excluding condition on `input_boolean.heat_mode`.
- **Thresholds without hysteresis.** Cool above 25.0, stop below 25.0 - the compressor cycles every few minutes, which shortens its life and cools nothing. Leave at least a degree and a half between the on and off thresholds, and add the `for` parameter to the numeric trigger so a momentary draught doesn't flip modes.
- **Ignoring the forecast.** Automations that react only to the current temperature start systematically too late, because the indoor temperature lags the sun. The forecast is the only signal that runs ahead of physics - which is why heat mode arms on the evening of the previous day, not at noon of the hot one.
- **One threshold for the whole house.** The attic heats up faster and harder than the ground floor; a west-facing room heats later but more violently than an east-facing one. Set thresholds and schedules per room, otherwise the automation will be simultaneously too jumpy downstairs and too lazy upstairs.
- **Closing the blinds on an overcast hot day.** The forecast says thirty degrees, the blinds roll down, and a thick cloud deck hangs there all day - the house stands dark for zero gain. A condition on an illuminance sensor, or on cloud coverage from the weather integration, fixes this in one line.

## Summary

Heat defence is a sequence in which each element plays for a different time of day: the forecast arms heat mode in the evening, the blinds defend successive facades from the morning onward according to the sun's position, night ventilation dumps the accumulated heat for free, and the air conditioning closes only the gap the others couldn't. On top of that, two rules of peaceful coexistence with the household: a manual override respected for several hours, and cooling that refuses to fight an open window. Don't roll it all out at once - start with the heat mode switch and the blinds of your single sunniest facade, because they deliver the biggest effect for the least work. After the first heatwave, compare a day with and without the automation in your energy data; that one difference will convince you more effectively than this article. A house that never let the heat in doesn't have to remove it - everything else is a footnote to that sentence.
