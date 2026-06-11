---
title: "AI in Smart Home, Part 6: A Home That Notices - Anomaly Detection Instead of Fixed Thresholds"
description: "The sixth part of the AI in smart home mini-series. We teach the home to recognize deviations from its own baseline: from the statistics built into Home Assistant, through domain rules, to a language model acting as a periodic data analyst."
date: 2026-07-13
tags: ["ai", "smart home", "home assistant", "anomaly detection", "monitoring"]
lang: en
readingTime: 9
author: [JS, GH]
---

A fixed threshold like "temperature above 28 degrees" will detect a fire, but it will not detect a fridge that is dying slowly, or a pump that runs 20% longer than a month ago. In this part, we show how to teach the home to recognize deviations from its own baseline - from simple statistics in Home Assistant to periodic data analysis with a language model.

## What a fixed threshold cannot see

Thresholds are great for binary events: flooding, smoke, a door open after 11 PM. There is nothing to interpret there, and we wrote about this in the [part about automations](/en/blog/ai-smart-home-automations/) - a simple rule wins.

The problem is that most household failures do not look like a spike. They look like a trend. Julia's fridge raised its daily consumption from 0.7 kWh to 1.0 kWh over six weeks - it never crossed any threshold along the way, because any reasonable threshold would have been set higher. The compressor simply ran in longer and longer cycles until it finally could not keep up. If the home had compared the current week against its own baseline, the alarm would have come a month before the spoiled groceries.

> The right question is not "did the value cross a threshold" but "is this normal for this home, at this hour, in this season".

## The home's baseline, or the reference line

To detect deviations, the home first has to know what normal is. The good news: if you have Home Assistant with energy and temperature sensors, you are already collecting historical data. The bad news: the baseline is not a single number. Energy consumption in January and in July are two different worlds, Monday differs from Sunday, and a week with guests differs from a week away.

That is why a sensible reference line compares like with like: today against the average of the last 30 days, the appliance's current cycle against the average length of its cycles, Tuesday's consumption against the consumption of previous Tuesdays. The narrower the comparison, the fewer false alarms.

## Level 1: statistics without AI

Before you reach for a language model, squeeze out what Home Assistant has built in. The statistics integration computes a moving average and standard deviation from any sensor, the derivative sensor shows the rate of change, and the trend sensor turns the direction of change into a simple binary state.

An example for the fridge: a daily consumption sensor plus a 30-day moving average and one automation comparing the two values.

```yaml
sensor:
  - platform: statistics
    name: "Fridge - 30 day daily average"
    entity_id: sensor.fridge_energy_daily
    state_characteristic: mean
    max_age:
      days: 30
```

The automation sends a notification when today's consumption exceeds the average by more than 25% for three days in a row. Those three days matter - a single hot day when the fridge door kept opening is not an anomaly, it is life. Requiring the deviation to persist is the cheapest false alarm filter we know.

The same pattern works for a circulation pump. Our hot water pump historically ran an average of 4.5 hours per day. When it started running 5.5 hours - 20% longer with the same weather and the same household habits - the statistics flagged the deviation after four days. The cause turned out to be air trapped in the system, fixed in fifteen minutes. Without a baseline comparison, nobody would have noticed, because the pump was running, the water was hot, and the difference was not yet visible on the bill.

There is one entry requirement for this level: measurement. An energy-monitoring plug costing pocket change on the fridge, pump, or water heater provides the data that statistics can only then read something from. No sensor, no baseline; no baseline, no anomaly.

## Level 2: comparisons over time and simple domain rules

The second level is rules that combine two signals and a bit of knowledge about the physics of the house. The classic: an open window versus heating. No single threshold will catch it, but the rule "the thermostatic valve is heating at 100% and the room temperature drops by more than 1.5 degrees in 20 minutes" catches it flawlessly - and along the way it also detects a window tilted open by a kid, which the contact sensor knows nothing about, because there is no contact sensor on it.

Likewise the water heater: if the time to heat water from 40 to 55 degrees has stretched from 50 to 70 minutes at the same heater power, it is almost certainly limescale on the heating element. The home does not have to understand chemistry - it is enough that it compares the current heating time against its own history and notices an upward trend sustained over several weeks.

## Presence patterns: an anomaly is not always a failure

Deviations from the baseline concern not only appliances but also the rhythm of the home. The home knows the typical hours of returns, lights being switched on, doors being opened. The garage gate open at 3:20 AM, the basement light on for 14 hours, the patio door opening on a workday when nobody should be home - none of these events crosses a threshold, because there is no threshold for "weirdness". All of them are deviations from a pattern.

Here, though, caution has to be greater than with the fridge. Presence patterns concern people, and people have a right to spontaneity. A late return from a party should not trigger an alarm like a break-in. That is why for presence we recommend exclusively low-priority informational notifications, and only for events that combine two signals: a door open plus all household members away from home is a sensible signal, while "an unusually late light" on its own is already overreach.

## Level 3: the LLM as a periodic analyst

This is where the AI layer begins (Grzegorz speaking). A language model should not watch every reading live - that is expensive, slow, and unnecessary. The best pattern is periodic summaries: once a day or once a week, an automation collects aggregated data (daily consumption, the number and length of appliance cycles, heating times, presence patterns) and sends it to the model with a question about deviations.

The prompt should force specifics: compare the current week with the previous four, list at most three observations, each with a number and a possible explanation, do not guess at causes that are not visible in the data. The result lands as a notification or an entry on the dashboard we wrote about in the [part about dashboards](/en/blog/ai-smart-home-dashboards/).

An example from our weekly report: "Night standby consumption has risen from 95 W to 128 W for 12 days. Water heater: heating time stable. Fridge: within norm. Suggestion: something was switched on permanently around July 1 - check the outlets in the office and the garage". The culprit turned out to be a forgotten soldering station. 33 W for half a year is roughly 20 euros and one real fire risk fewer - and no threshold rule saw it, because 128 W is still very little.

The model's advantage over the rules from levels 1-2 is exactly where we did not write the rules. The model gets the whole picture and can notice that the washing machine ran at night, which it had never done before, or that the home's standby consumption rose by 30 W since last week - meaning something was switched on and forgotten. A rule detects what we anticipated. The model can be good at what we did not anticipate.

## The gradation of approaches in one table

| Level | Tool | What it detects | Cost and effort |
|---|---|---|---|
| Threshold | Plain automation | Sharp events: flooding, frost, power loss | Minutes, zero cost |
| Statistics | Moving average, deviation, trend | Slow trends of a single appliance | An hour per appliance |
| Domain rules | Comparing two signals | Open window during heating, limescale in the heater | Requires an idea, not hardware |
| LLM periodically | Daily/weekly summaries | Deviations you did not anticipate | Pennies per query or a local model |

The order is not accidental. Each level filters data for the next one - a language model reading raw readings every minute is an anti-pattern, while a model reading a weekly aggregate is a cheap, sensible analyst.

## False alarms: the biggest enemy of trust

An anomaly detection system dies not when it misses something, but when the household stops reading its notifications. Three principles that kept our system alive:

- **The deviation must persist.** One odd day is noise. Three days in a row, or three cycles in a row, is a signal.
- **Context mutes.** Guest mode and vacation mode are familiar from earlier parts of the series - here they should raise thresholds or mute comparisons, because a home with guests has a different baseline.
- **Season matters.** Compare July with June, not with January. The simplest approach: a comparison window of at most 4-6 weeks back.

And one overriding principle: an anomaly notification should be a question, not a verdict. "The fridge is consuming 28% more than its monthly norm, for the third day in a row - worth checking the gasket and frost buildup" is useful. Automatically shutting off the fridge because the model deemed it broken would be exactly the kind of autonomy we warn against throughout this series.

## Summary

We leave fixed thresholds to sharp events and catch degradation by comparing against the home's baseline. Start with one appliance with a measurable cycle - the fridge and the water heater are grateful patients - and with the statistics built into Home Assistant, with no AI at all. Add domain rules where you know the physics of the problem, and hire the language model only as a periodic analyst of aggregates, one that catches what you did not anticipate. The measure of success is not the number of alarms, but catching the first real one a month before the failure.
