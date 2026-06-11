---
title: "AI in Smart Home, Part 7: A Home That Plans - Energy Optimization with Forecasts"
description: "The seventh part of the AI in smart home mini-series. We build an energy planner: electricity prices, solar production forecasts, and the calendar as inputs, an LLM as a constrained planner, a decision log, and an honest profitability calculation."
date: 2026-07-20
tags: ["ai", "smart home", "home assistant", "energy", "optimization"]
lang: en
readingTime: 9
author: [JS, GH]
---

Your home knows the weather forecast, tomorrow's electricity prices, and your calendar. That is enough for AI to lay out a daily plan for the water heater, car charging, and heating - and to be able to explain every decision. In this part, we build an energy planner: from input data, through a decision log, to an honest calculation of when it pays off at all.

## Three data sources the home already has or can easily get

Energy planning stands on three legs. The first is the **price of electricity over time**. With a dynamic tariff based on exchange prices, the home knows tomorrow's hourly price list by the afternoon of the previous day. With a regular time-of-use tariff, it is even simpler - the cheap hours are fixed and written into the contract.

The second leg is the **production forecast**, if you have photovoltaics. Integrations like Forecast.Solar convert the solar irradiance forecast into the expected kilowatt-hours from your installation - roughly, but well enough to distinguish a day when the water heater warms up for free from the roof from a day when energy has to be bought at night.

The third leg is the **calendar and household patterns**. Leaving at 6:30 means the water has to be hot by 6:00 and the car charged in the evening, not in the early morning. Working from home means a higher temperature in the office during hours when the home would normally be saving.

## What can really be shifted

Here comes the first dose of realism: most of your consumption cannot be shifted. The fridge, lighting, stove, TV - those happen when they happen. What can be shifted are appliances that store the effect of their work:

- **the water heater** - it stores hot water, so it can heat at 2:00 AM instead of 6:00 PM;
- **the electric car** - it stores energy, and it sits outside the house an average of 12 hours a day;
- **heating with thermal inertia** - underfloor heating or a well-insulated house allows overheating the building by 1 degree during a cheap hour and waiting out the expensive one;
- **the washing machine, dishwasher, dryer** - a cycle can be delayed by a few hours with no loss of comfort at all.

These four categories are usually 30-60% of the bill in a home with an electric car, and considerably less without one. That proportion will decide the profitability of the whole project, which we will return to with the numbers.

## Architecture: the LLM plans, the automation executes

The pattern known from [earlier parts of this series](/en/blog/ai-smart-home-automations/) applies here too, in its purest form. The language model is a constrained planner: once a day, for example at 9:00 PM, it receives tomorrow's price list, the production forecast from the roof, the car's state of charge, the calendar, and a list of hard conditions. It returns a plan in structured form - a schedule with appliance start times plus a justification for each item.

Execution is handled by a classic, deterministic automation that knows the non-negotiable conditions and checks them independently of the plan: water at minimum 50 degrees by 6:00, the car at minimum 60% before the first departure in the calendar, the house temperature never below 19 degrees. If the model's plan violates a boundary condition, the condition wins, not the plan. The model can be wrong - the guardrails cannot.

Why an LLM at all, when off-the-shelf optimization algorithms exist? Honestly: for the water heater schedule alone, a plain "pick the 3 cheapest hours of the night" is enough. The language model brings two things: it combines sources a rigid algorithm does not know (the calendar, unusual situations, your notes about plans), and it explains decisions in human language. That second thing turned out to be more important for us than we expected.

## The planner prompt: constraints matter more than the goal

From Grzegorz's experience with agents at work comes one principle that transfers to the home one-to-one: a model optimizing without explicit constraints will optimize your life in a way you do not want. A planner told to "minimize energy cost" will happily leave you with cold water at 6:00 AM, because not heating was cheaper.

That is why the planner prompt consists mostly of constraints, not of the goal:

- water at minimum 50 degrees between 5:30 and 7:00 and between 20:00 and 22:00;
- the car charged at minimum to the level from the calendar one hour before the first departure;
- room temperature never below 19 degrees, in the kid's room never below 20;
- the washing machine and dishwasher do not start between 22:00 and 7:00 (noise), the dryer only when someone is home;
- at most 3 high-power appliances at the same time (grid connection limit);
- if the input data is incomplete, plan the safe variant and note it in the justification.

Only after the list of constraints comes the goal: within the remaining freedom, minimize cost and prefer your own production from the roof over buying from the grid. That order sounds pedantic, but it is what decides whether the plan is helpful or a nuisance.

## The decision log, or trusting the machine

A home that switches appliances on and off by itself at night breeds distrust - right up to the moment it starts explaining itself. Every item of the plan goes into our decision log: a simple log on the dashboard, one sentence per decision.

```
21:04 PLAN for Tuesday 21.07:
- Water heater: 02:00-04:00 (price 0.34 zl/kWh, weak PV forecast: 2.1 kWh,
  calendar: departure 6:30, water ready before 6:00)
- Car: 01:00-05:30 to 80% (cheapest window of the night, 90 km tomorrow per calendar)
- Dishwasher: start 13:00 (PV forecast peak, 3.4 kW from the roof)
- Heating: +1 deg C 05:00-07:00, setback 18:00-20:00 (price peak 1.12 zl/kWh)
```

The log serves three functions. It builds household trust, because "why did the washing machine start at 1 PM?" has an answer on the dashboard. It makes debugging easier, because a bad plan is visible together with the data it was built on. And it disciplines the prompt - if the model cannot briefly justify a decision, that is usually a sign the decision is random.

Deviations should also be written into the log: every manual override of the plan by a household member becomes an entry "the plan called for X, the human chose Y". A "heat now" button on the dashboard must exist and work without argument - a home where you cannot take a hot shower outside the schedule is a badly designed home, regardless of the savings. And if the deviations keep repeating, it is not the household that is the problem, but the constraints in the prompt that need fixing.

## Let's do the math: the synthetic DemoHouse

Take a made-up but realistic DemoHouse: a 2+2 family, an electric car, an electric water heater, a dynamic tariff with an average price of 0.35 zl/kWh in the cheap hours and 1.10 zl/kWh during the 17:00-21:00 peak. Without planning, the household does what everyone does: charges the car after coming home from work and heats water in the evening, that is, during the peak.

| Appliance | Energy per year | Without a plan (avg. price) | With a plan (avg. price) | Savings |
|---|---|---|---|---|
| Car (15,000 km, 18 kWh/100 km) | 2700 kWh | 0.85 zl/kWh | 0.38 zl/kWh | approx. 1270 zl |
| Water heater (6 kWh/day) | 2190 kWh | 0.80 zl/kWh | 0.40 zl/kWh | approx. 880 zl |
| Washing machine and dishwasher (450 cycles at 1.1 kWh) | 495 kWh | 0.75 zl/kWh | 0.45 zl/kWh | approx. 150 zl |

If DemoHouse also has photovoltaics, a second lever appears: self-consumption of your own production. Every kilowatt-hour of the dishwasher shifted from the evening to noon, when the roof is producing, is energy you do not have to buy in the evening or feed into the grid for a fraction of the purchase price. In a 5 kWp installation, such shifts can raise self-consumption by 10-15 percentage points, which under today's settlement rules can be worth as much again as the price game itself.

Altogether around 2300 zl per year in the variant without photovoltaics. On the cost side: a relay with energy metering for the water heater (about 150 zl), possibly a controllable charger, a few evenings of configuration, and pennies for model queries - one plan per day is a negligible cost, and a local model does it for free. In this variant, the project pays for itself within the first months.

## The limits of profitability

Now the second dose of realism. Cross the car out of the table - about 1000 zl per year remains. Cross out the dynamic tariff and keep a regular flat-rate tariff with a single price - zero remains, because there is nothing to optimize on price (only self-consumption of PV production remains, if you have it). A home without an electric car, without photovoltaics, and without a time-of-use or dynamic tariff does not need an energy planner - at most it needs [part six of this series](/en/blog/ai-smart-home-anomaly-detection/), that is, detecting that something is consuming too much.

A simple test before you start: calculate how many kilowatt-hours per year you will realistically shift, multiply by the price difference between your cheap and expensive hour, and subtract 20% for the days when life wins over the plan. If the result does not exceed a few hundred zloty, let it go, or limit yourself to a single water heater automation on a fixed schedule - no forecasts, no model, no log.

## Summary

Energy planning is the most measurable part of this series: the effect shows up on the bill, not just in comfort. There are three ingredients - prices over time, the production forecast, the calendar - and the architecture pattern is unchanged: the model proposes and justifies, the deterministic automation executes within hard conditions. The decision log turns a suspicious machine into an understandable housemate. Calculate your shifting potential before you start - with an electric car and a dynamic tariff the game is worth the candle, without them a single water heater schedule is often enough. And if the numbers come out positive, start with the water heater this coming weekend: it is one appliance, one relay, and an immediately visible effect.
