---
title: "Energy Monitoring in Home Assistant: What Really Eats Your Electricity and Whether a Smart Home Pays for Itself"
description: "Energy measurement from a single plug to the main meter, the energy dashboard with electricity prices, alert thresholds, night-tariff automations and an honest return-on-investment calculation for a realistic home."
date: 2026-08-03
tags: ["smart-home", "home-assistant", "energy", "savings", "automations"]
lang: en
readingTime: 9
author: GH
---

The energy dashboard in Home Assistant answers the question every household member dreads when the bill arrives: why does it cost this much. I'll show how to build up measurements from a single plug to the main meter, which alert thresholds make sense, which automations actually save money - and I'll calculate, on a synthetic but realistic home, whether this hobby pays for itself at all.

## Three levels of measurement

Energy monitoring is built in layers, and you don't have to buy everything at once. Level one: a **smart plug with power metering** - a Shelly Plug S or a Zigbee plug with metering. You plug a suspicious appliance into it for a week and you have your answer: how much the fridge draws, how much the TV in standby, how much the old freezer in the basement. Cost: 60-120 zlotys apiece; two or three are enough to start, because you can move them around.

Level two: **circuit-level measurement**. A Shelly module with power metering installed behind a switch or in a junction box measures all the lighting, the kitchen or the water heater - things you can't plug into a smart plug. It requires work on the electrical installation, so if you don't feel confident, it's a job for an electrician; the module itself costs 80-150 zlotys.

Level three: **the main meter**. A three-phase meter (for example the Shelly Pro 3EM) in the distribution board measures the whole house's consumption with per-second precision. It's the most expensive element (400-600 zlotys with installation), but it ties everything together: the meter total minus the measured circuits shows how much electricity disappears into the "rest" you haven't identified yet.

All three levels connect to Home Assistant locally - Shelly over Wi-Fi, Zigbee plugs through the coordinator. The simplest input is an energy sensor in kWh with the correct device class and cumulative state. Home Assistant can also accept a compatible instantaneous power sensor in W or kW on the Energy dashboard. When energy is needed from power alone, create a Riemann-sum integral sensor. Always check the entities of the exact model because not every plug reports both measurements correctly.

## The energy dashboard in half an hour

Dashboard configuration lives in `Settings → Dashboards → Energy`. You point it at the grid consumption sensor (the main meter or the sum of circuits), optionally at solar production, and then add individual appliances in the individual device monitoring section. After a few hours data starts flowing in, after a day you have the first full chart, after a week - a picture of the household's habits.

Add the electricity price right away: the dashboard lets you enter a static rate per kWh or point to an entity with the tariff if you're on a multi-zone tariff. Only money, not kilowatt-hours, makes an impression on household members. Field-tested: nobody cares about a chart in kWh, the same chart in currency sparks a discussion over dinner.

> The energy dashboard by itself doesn't save a single zloty. The saving comes from the decision you make when you see the numbers for the first time.

## Data traps that will skew your math

Before you start drawing conclusions from the charts, a few things that corrupt the data and that most first analyses crash into. First, **meter resets**: after a firmware update or a power outage, some devices zero their energy counter. The energy dashboard handles this correctly if the sensor has the proper cumulative total class - but cheap plugs from exotic integrations can report it wrong, and then absurd spikes appear on the chart. A single day with 4000 kWh of consumption in the history can ruin any average.

Second, **gaps in the data**: a device offline for a few hours means a few hours of unmeasured energy. With plugs that's negligible, with the main meter it's not - which is why the meter in the distribution board should sit on the most stable Wi-Fi in the house, not at the edge of coverage. Third, **accuracy**: cheap plugs measure with an error of two or three percent and under-report very small loads. For household decisions that's entirely sufficient; for a complaint to your electricity provider - it's not.

And fourth, **seasonality**: a week of measuring the fridge in July gives a different result than in January, and the heating circulation pump doesn't exist in summer data at all. Draw conclusions about annual costs from at least a month of data and apply a seasonal correction. For billing-cycle accounting, the built-in utility meter helper is useful - it slices consumption into days and months and splits it into tariff zones, so you see daytime and nighttime electricity separately without any manual calculations.

## What the measurements showed in the DemoDom house

Instead of manufacturer promises - numbers. The DemoDom house is synthetic, but assembled from typical values you'll see at your own place: four people, a 120-square-metre house, an electric water heater, annual consumption around 4800 kWh, a flat tariff of 1.15 zł/kWh.

| Appliance | Daily consumption | Annual cost | Comment |
| --- | --- | --- | --- |
| Electric water heater | 6.0 kWh | 2519 zł | The largest single appliance in a home without electric heating |
| Fridge-freezer | 1.1 kWh | 462 zł | An old model; a new one would drop to ~0.6 kWh |
| Standby modes combined | 1.4 kWh | 588 zł | TV, console, printer, chargers, set-top box - a constant ~60 W |
| Washing machine + dishwasher | 1.5 kWh | 630 zł | Depends on the number of cycles, here one each per day |
| HA server + network + NAS | 0.7 kWh | 294 zł | The smart home costs money too - worth knowing |

Two things in this table surprise almost everyone. First, standby modes: 60 W of continuous draw is almost 600 zlotys a year for nothing. Second, the water heater: more than half the bill in a single appliance that heats water at random times, including during peak pricing - and that's the single biggest savings lever.

## Alert thresholds and automations that save money

Sensible alerts are the ones that lead to action. Three patterns that have stayed with me for good. First: a **consumption anomaly** - if the fridge draws power continuously for two hours (normally it works in cycles), something is wrong with the door or the compressor. Second: **end of cycle** - a washing machine whose power dropped below 5 W for five minutes has finished the wash; the notification doesn't save electricity, it saves you hanging wet laundry at midnight. Third: a **daily budget** - if the house has used more than a set threshold by 6 p.m., I get a quiet heads-up and in the evening I know to look at the dashboard.

Concrete thresholds to start from (you'll tune them to your home later): fridge - power above 50 W continuously for two hours means an alarm; washing machine - end of cycle is a drop below 5 W for five minutes, but only after it previously exceeded 10 W (otherwise the notification also fires right after you merely switch the power on); daily budget - the average of the last thirty days times 1.3. A threshold set too low generates noise and teaches you to ignore it, a threshold set too high never fires - better to start loose and tighten weekly than the other way around.

The largest opportunity may be moving the water heater into the cheaper tariff zone. Hours and all-in rates depend on the network operator, supplier, and contract. Compare energy price together with variable distribution charges, tax, and any higher rate in the expensive zone. The hours below are only an example - replace them with the windows in your own agreement:

```yaml
automation:
  - alias: "Water heater on night tariff"
    triggers:
      - trigger: time
        at: "22:05:00"
        id: start
      - trigger: time
        at: "05:55:00"
        id: stop
    actions:
      - action: "switch.turn_{{ 'on' if trigger.id == 'start' else 'off' }}"
        target:
          entity_id: switch.water_heater
```

Add a safety override so the heater can run when water drops below the comfort threshold. The simple `2190 kWh × rate difference` is only a theoretical ceiling: not all consumption can move, standing losses may rise, and the expensive zone and fixed charges affect the whole-home result. A second move is cutting only devices whose manufacturers permit hard power-off. Removing a constant 30 W for a full year saves 263 kWh; its monetary value depends on the all-in rate, not just the energy component.

## Does it pay off - an honest calculation

The cost of the measurement side for DemoDom: a distribution board meter with installation 550 zł, three metering plugs 270 zł, a water heater module with installation 250 zł. A total of 1070 zlotys one-off, assuming you already have a Home Assistant server.

The DemoDom calculation shows a ceiling, not a promise. At an assumed 0.40 zł/kWh difference, shifting every water-heater kilowatt-hour would be worth 876 zł, while removing a constant 30 W at 1.15 zł/kWh would be about 302 zł. Calculate the real result by simulating two full annual bills for the complete load profile, including tariff windows, distribution, and energy that cannot move. Only then divide the difference by equipment cost; without that comparison, an eleven-month payback cannot be claimed honestly.

An honest caveat: this calculation rests on the electric water heater. If you heat water with gas, the biggest lever disappears, and the purchase may take much longer to pay back or may never pay back. In that case I'd start with just the plugs for ~270 zł and a hunt for standby modes, and buy the main meter only if measurements show a real savings opportunity.

Solar may improve the result because shifting loads into production increases self-consumption, but the scale depends on the home's load profile, array size, and storage. With dynamic tariffs, prices change in the time blocks defined by the contract and market - in 2026 these are not always whole hours - and automation helps react to them. It does not guarantee that a dynamic tariff is cheapest once distribution and the full load profile are included.

## Summary

Energy monitoring can recover money, but measurement alone does not create savings. The path: start with two or three metering plugs and a week of measuring suspects, add the energy dashboard with the electricity price in real currency, then the main meter and measurement of the biggest consumer. Set alerts only where they lead to action, and look for the biggest money in shifting water heating to the cheap tariff and cutting standby modes. Calculate payback from your own measurements and full tariff - it may take months, years, or never happen. A starter experiment: plug a metering plug into the oldest appliance in your house tonight and check in a week whether you're not running a small power plant.
