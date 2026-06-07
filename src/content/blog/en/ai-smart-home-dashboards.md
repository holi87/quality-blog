---
title: "AI in Smart Home, Part 3: A Home That Shows What Matters - Dashboards Designed with AI"
description: "The third part of the AI in smart home mini-series. We use AI to design Home Assistant dashboards: from information architecture and view structure to cards, status summaries, technical dashboards, and readable labels."
date: 2026-06-22
tags: ["ai", "smart home", "home assistant", "dashboards", "ux"]
lang: en
readingTime: 13
author: [JS, GH]
---

In the first part of the series, the home learned to see better. In the second, it learned to translate intentions into automations more effectively. In the third, we reach the layer humans interact with most directly: dashboards.

A smart home dashboard is very easy to ruin. Just show everything. Every light, every sensor, every switch, every graph, every battery, every temperature, every mode. It looks impressive for the first five minutes, and then it becomes a digital cable cabinet: everything is technically there, but it is hard to find what matters.

A good dashboard is not a list of entities. A good dashboard answers questions. Is everything OK? Is the home safe? Does anything require my reaction? How much energy am I using? Is the car charging? Are the windows open? Did the cat get food? Is the system healthy?

AI can help here not because it can “place tiles nicely.” The biggest value of AI is that it can structure information, propose view architecture, name sections in user language, generate phone and wall-tablet variants, and help build a technical dashboard for the home administrator. In other words: AI helps move from “I have many entities” to “I have an interface that makes sense.”

## A dashboard is a product, not decoration

A smart home dashboard should be treated like a small product. It has users, goals, usage contexts, and constraints. A phone dashboard is different from a wall tablet dashboard. A technical user needs something different from a guest.

A phone is usually used for quick reaction. You want to check home status, open a gate, turn off a light, check the alarm, change mode, or start the vacuum. A wall tablet is more of a shared home panel: lights, scenes, temperature, media, entrance status. A technical dashboard is for the administrator: batteries, unavailable entities, automation errors, Zigbee/Z-Wave/Wi-Fi status, updates, backups, and logs.

If all of these needs are thrown into one view, the result is chaos. The first question is not “which cards should I add?” It is “who will use this, and why?”

AI is excellent at this stage. You can give it a list of entities and ask for information architecture before drawing anything.

## Home Assistant: views, sections, cards

Home Assistant dashboards are based on views and cards. A view is like a tab or page, while cards display status, controls, graphs, lists, buttons, or grouped information. The newer sections-based approach helps visually group related cards, organize a view, and move elements between sections. Home Assistant documentation also describes section visibility conditions and options such as backgrounds and section themes.

This means we do not need to design one huge screen. We can design in layers:

```text
Main dashboard
  ├─ View: Home / status
  ├─ View: Security
  ├─ View: Energy
  ├─ View: Climate
  ├─ View: Rooms
  ├─ View: Cat / Pet
  └─ View: Technical / Admin
```

Each view can have sections. For example, the main view:

```text
Home
  ├─ Is everything OK?
  ├─ Quick actions
  ├─ Important alerts
  ├─ Energy now
  ├─ Comfort
  └─ Recent events
```

This is a perfect place for AI. The model can propose hierarchy, names, priorities, and variants. Then the human decides what truly fits the home.

## First prompt: from entities to information architecture

Instead of asking AI to “make a nice dashboard,” start with architecture.

```text
You are a UX designer and Home Assistant architect.
Based on the entity list below, propose a dashboard structure.

Context:
- single-family house,
- one person works remotely,
- one cat,
- photovoltaic system and home battery planned or available,
- one electric car,
- Home Assistant is the smart home hub,
- dashboard will be used on a phone and wall tablet.

Task:
1. propose dashboard views,
2. propose sections for each view,
3. classify critical and secondary information,
4. propose a mobile-first version,
5. propose a separate technical dashboard,
6. do not generate YAML yet.

Entity list:
[paste entity list]
```

This prompt changes the conversation. AI does not choose cards immediately. It designs meaning first. This is similar to application design: before selecting UI components, we need to know the user flow.

## Rule number one: dashboards should show exceptions

The best dashboard does not show everything. It shows what requires attention. In a smart home, most things are normal most of the time. Doors are closed, windows are closed, lights are off or automated, temperature is within range, batteries are fine, internet works.

If the dashboard constantly shows the full list of everything, the user must find exceptions manually. That is tiring. A better model is:

```text
First: overall status.
Then: alerts and exceptions.
Then: quick actions.
Only then: details.
```

Example “Is everything OK?” section:

- alarm: armed / disarmed;
- doors and windows: everything closed or list of open ones;
- presence: household members home / away;
- energy: current usage, production, battery, car charging;
- system: unavailable entities, low batteries, backup status.

AI can help create a text summary for such a section, for example in a Markdown card:

```text
Everything is OK. The home is in day mode. All doors and windows are closed.
The Tesla is not connected. PV production covers current consumption.
```

Or when something requires attention:

```text
Attention: the office window is open and the forecast shows rain.
The utility room sensor battery is at 8%. The car is connected, but charging has not started.
```

This layer can be built with classic template sensors, while AI can help generate text, labels, conditions, and priority logic.

## Main dashboard: less means faster

The main view should answer: “Do I need to do anything?” It does not need every device. A proposed structure:

| Section | Goal | Example elements |
| --- | --- | --- |
| Home status | One-glance situation | alarm, presence, home mode, alerts |
| Quick actions | Most frequent manual actions | night mode, guest mode, all lights off, vacuum |
| Security | Entrances and events | doors, windows, gate, latest motion |
| Comfort | Climate and light | temperature, humidity, scenes |
| Energy | Now, not all details | consumption, production, battery, car |
| Recent AI events | Context from part 1 | package, person at gate, garden motion |

AI can propose which elements should be highest on mobile and which should move lower. On a phone, large buttons and short statuses matter most. On a tablet, you can show more context, charts, and sections side by side.

## Security dashboard: safety without panic

The security view should be calm and specific. It is not about a red alert for every movement. It is about clear information:

- which doors and windows are open;
- what the alarm state is;
- whether the gate is closed;
- when motion was last detected at the gate;
- whether AI camera analysis detected something relevant;
- whether there are events requiring action.

AI can help design event categories:

```text
critical: alarm, leak, smoke, open door while away
warning: open window, low sensor battery, gate open too long
info: package delivered, motion at gate, cat in garden
```

This is better than one generic “notifications” bucket. The dashboard should communicate event severity. If everything is an alarm, nothing is an alarm.

It is also worth separating the household view from the technical view. A household member does not need to see every binary sensor. They should see “open: office window.” The administrator can have the detailed entity list.

## Energy dashboard: AI as a data translator

Energy is an area where smart home dashboards easily become overloaded with charts. Consumption, production, self-consumption, battery, grid import, export, car charging, tariffs, weather forecast - all are interesting, but not all belong on the main screen.

A well-designed energy view should answer:

- how much power is the home using right now?
- where is energy coming from: PV, battery, grid?
- is the car charging?
- does charging make sense now, or later?
- will the home battery cover the next few hours?
- is today’s result normal?

AI can help name these insights in human language. Instead of just a graph, we can show a short summary:

```text
The home is using 1.2 kW now. PV is producing 2.8 kW, so the surplus is charging the battery.
The Tesla is not connected. Today’s production is above the 7-day average.
```

Of course, such a sentence must be based on real sensors and template logic. AI should not invent data. It can, however, help write templates, select thresholds, and design the presentation layer.

## Technical dashboard: observability for the home

This is my favorite dashboard because it connects smart home with quality thinking. Every larger Home Assistant installation needs an admin view. It does not have to be beautiful. It has to be useful.

Technical dashboard sections:

| Section | What it shows |
| --- | --- |
| Health | unavailable entities, restart, uptime, HA version |
| Batteries | sensors below 20%, below 10%, last update |
| Network | router, AP, critical device status |
| Automations | recently triggered, disabled, errors, traces to review |
| Integrations | Zigbee, Z-Wave, MQTT, Shelly, UniFi, HACS |
| Backup | last backup, status, disk space |
| AI | analysis count, cost, latency, response errors |

AI can help design this dashboard like an observability panel. You can ask:

```text
Design a technical Home Assistant dashboard for an administrator.
Priority: detect problems before a household member notices them.
Include: batteries, unavailable entities, automations, backup,
network, integrations, critical devices, AI vision.
For each section provide: goal, example sensors, alert threshold,
card proposal, and a test that confirms the section works.
```

This approach is very close to software testing and system monitoring. A home is also a production system - its users just happen to sit at the kitchen table.

## Prompt for cards and labels

When the dashboard structure is ready, you can ask AI for concrete cards. It is better not to generate the whole dashboard at once. Work section by section.

```text
Based on the Home Assistant dashboard section below, propose cards.
Do not use custom cards unless you mark them as optional.
Prefer built-in solutions.
For each card provide:
- goal,
- entities,
- card type,
- short user-facing name,
- visibility conditions,
- whether the card is important on mobile.

Section:
Security / Open entrances and recent events

Entities:
[paste entities]
```

This prompt forces product thinking. A card is not a visual extra. It answers a specific need.

You can also ask for labels:

```text
Propose short, natural names for Home Assistant cards.
Style: simple English, no technical jargon.
Instead of "binary_sensor.front_door_contact", use a name a household member understands.
```

This small detail changes the dashboard experience. “Front door contact” is a technical name. “Front door” is a human name.

## Mobile-first and wall tablet

AI can also help create two variants of the same dashboard.

Mobile-first variant:

- maximum 3-5 key sections;
- large buttons;
- few charts;
- status and action before details;
- conditional cards that show only problems;
- quick mode toggles.

Wall tablet variant:

- more context;
- room view;
- lighting scenes;
- weather;
- energy;
- media;
- security status;
- visual style matching the home.

These are different products. The phone is a remote control and alert system. The tablet is a home panel. The admin dashboard is a diagnostic tool. If AI receives this context, it usually proposes a much better layout.

## AI-generated dashboard: what to watch out for

The biggest risk with AI-generated dashboards is false confidence. A model can generate YAML that looks professional but uses non-existing entities, unsupported options, or custom cards that are not installed. It may also overfocus on aesthetics and forget usability.

Use these rules:

- information architecture first, cards second;
- one view first, full dashboard later;
- built-in cards first, custom cards only deliberately;
- every card needs a purpose;
- every entity must exist;
- test the dashboard on phone and tablet;
- high-risk elements such as locks and gates require caution;
- guest views should not expose technical or sensitive information.

In practice, an AI-assisted dashboard should go through review just like an automation. Ask: is it readable? Does it work on a small screen? Can a non-technical person understand the messages? Are the most important items at the top? Is anything critical hidden too deeply?

## AI as a summary writer

One interesting direction is a dashboard that does not only show cards but also generates short summaries. For example, in the morning:

```text
Good morning. The home is at 22°C and humidity is normal.
All windows are closed. Rain is forecast after 4 p.m.
The Tesla battery is at 68%. There were no important gate events overnight.
```

Or in the evening:

```text
The home is ready for night mode. Only the bedroom window is open.
The living room light is still on downstairs. Last gate motion was at 19:42.
```

Such summaries can be generated through classic templates or AI Task, depending on whether you only need data composition or more natural language. The important rule: data must come from sensors, and AI describes it rather than inventing it.

## Summary

AI can help a lot with dashboards, but it should not start with colors and tiles. It should first help answer: who uses the dashboard, in what situation, why, on which device, and what information truly matters.

A good smart home dashboard does not show the entire house at once. It shows meaning. First status and exceptions. Then quick actions. Then details. It separates household needs from administrator needs. It looks different on a phone, a tablet, and a technical view.

The same principle runs through the whole mini-series: AI works best as a layer that supports humans and the system, not as an uncontrolled home operator. In LLM Vision, it helps understand images. In automations, it helps design behavior. In dashboards, it helps structure information.

An AI-powered smart home does not have to be a futuristic gadget. It can simply be more understandable, less noisy, and more useful.

## Sources and further reading

- [Home Assistant - Dashboard views](https://www.home-assistant.io/dashboards/views/)
- [Home Assistant - Sections view](https://www.home-assistant.io/dashboards/sections/)
- [Home Assistant - Introduction to templating](https://www.home-assistant.io/docs/templating/introduction/)
- [Home Assistant - AI Task integration](https://www.home-assistant.io/integrations/ai_task/)
- [Home Assistant Developer Docs - API for Large Language Models](https://developers.home-assistant.io/docs/core/llm/)
- [LLM Vision for Home Assistant - GitHub repository](https://github.com/valentinfrlch/ha-llmvision)
