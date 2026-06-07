---
title: "AI in Smart Home, Part 2: A Home That Thinks in Scenarios - Automations with AI"
description: "The second part of the AI in smart home mini-series. We explore how to use language models to design, generate, review, and document Home Assistant automations - without giving them full control over the house."
date: 2026-06-15
tags: ["ai", "smart home", "home assistant", "automations", "yaml"]
lang: en
readingTime: 13
author: [JS, GH]
---

In the first part of this series, I showed how AI can add a visual interpretation layer to a smart home. A camera no longer has to report only motion. It can help recognize whether a person is standing at the gate, whether a cat ran through the garden, or whether a package is lying near the door. But that is only the beginning.

The real value of smart home appears when observation becomes action. Not chaotic, random, or “magical” action. A well-designed automation knows when it should run, when it should do nothing, which conditions it must check, and exactly what it should execute.

AI can help a lot here. Not as an autonomous home manager that invents rules and deploys them immediately. More as an analyst, architect, reviewer, and first-draft generator. A good language model can turn a natural language description into a table of triggers, conditions, and actions. It can identify missing edge cases. It can propose a YAML structure. It can also explain an existing automation so that three months later you still understand why it behaves the way it does.

This part of the mini-series is about creating automations with AI in a practical and safe way.

## Automation is not magic; it is a contract

In Home Assistant, automation has a very logical structure. The official documentation describes a trigger as the thing that wakes an automation up. When the trigger fires, Home Assistant checks the conditions and, if they pass, runs the actions. This simple model is powerful because it lets us describe most home behaviors as a contract:

```text
WHEN X happens
IF conditions Y are true
DO actions Z
```

AI does not change this model. AI helps us design it better.

This matters because many people start with a request like: “write me an automation for the hallway light.” The model will usually generate something. The problem is that without context it does not know whether the home has children, night mode, guest mode, an illuminance sensor, adaptive lighting, different scenes, delays, household presence, a sleep schedule, or a dog that triggers the motion sensor at 3 a.m.

Better work with AI does not begin with YAML generation. It begins with behavior design.

## The role of AI in creating automations

The most practical AI roles are four.

The first role is requirements analyst. You describe what you want to achieve, and the model helps break it down into scenarios. For example: “the hallway light should turn on when motion is detected, but not during the day, not when the home is in night mode, and not at full brightness after 10 p.m.” AI can ask about missing details: how long the light should stay on, what happens with continuous motion, whether it should ignore motion when someone is asleep, or whether night brightness should differ.

The second role is logic designer. The model can propose a table of triggers, conditions, and actions. Such a table is easier to review than code and works very well before implementation.

The third role is draft generator. AI can prepare YAML, but it should not be deployed without review. The draft is a starting point, not an oracle.

The fourth role is reviewer. This is often the most valuable scenario. You give the model an existing automation and ask it to find risks, edge cases, conflicting conditions, unclear names, missing modes, overly aggressive actions, possible loops, and restart-related problems.

In practice, AI is best when treated as a fast pair-design partner. We do not delegate responsibility, but we use its ability to structure thinking.

## Before you ask AI for YAML

The most important work happens before the first prompt. It is worth preparing a short description of the home, entities, and rules.

A minimal context for the model could look like this:

```text
Platform: Home Assistant.
Room: ground floor hallway.
Entities:
- binary_sensor.hall_motion
- light.hall_ceiling
- sensor.hall_illuminance
- input_boolean.guest_mode
- input_boolean.night_mode
- person.grzegorz

Goal:
The light should turn on automatically when motion is detected, but only
when it is dark. At night it should use low brightness. In guest mode,
the light should work normally but should not turn off aggressively.

Constraints:
Do not control locks, gate, or alarm.
Do not use entities that are not listed.
Propose the logic in a table first, then generate YAML.
```

This format has two advantages. First, it forces us to name the intention. Second, it limits the model’s room for guessing. If we do not provide a list of entities, AI may invent ones that look plausible but do not exist. This is a common issue when generating configuration.

A good rule is: AI may design within the provided context. If the model needs more information, it should ask questions instead of hallucinating.

## Prompt 1: requirements analysis

The first prompt should not ask for code. It should ask for analysis.

```text
You are a Home Assistant automation architect.
Based on the description below, propose the automation logic.
Do not generate YAML yet.

Return:
1. automation goal,
2. triggers,
3. conditions,
4. actions,
5. edge cases,
6. questions to clarify before implementation.

Description:
[paste scenario and entity list here]
```

This prompt gives better results than “write the automation.” The model starts with structure, and we can review it. Often, missing pieces appear already at this stage: there is no illuminance sensor, night mode is not defined, the timeout is unclear, or there is no entity indicating whether anyone is home.

Only after accepting the logic should we move to code.

## Prompt 2: YAML generation

When the logic is clear, you can ask for an automation draft.

```text
Based on the accepted logic, generate a Home Assistant YAML automation.
Requirements:
- use only the listed entities,
- add description,
- use readable aliases,
- add trigger IDs if there is more than one trigger,
- use choose if there are different behavior paths,
- set mode and explain the choice,
- do not add integrations or entities I did not provide,
- after YAML, add a short explanation.
```

It is worth requiring `description` because automations live for a long time. Months later, the hardest part is often not understanding what the YAML does, but why someone made a specific decision. Description is cheap documentation.

## Example: hallway light

Let us assume we want a simple but sensible light automation.

Business requirement:

```text
When someone enters the hallway and it is dark, turn on the light.
After 10 p.m., turn it on only at 20% so it does not blind anyone.
When motion stops, turn the light off after 2 minutes.
In guest mode, do not turn it off automatically, because guests may stay
near the entrance longer.
```

AI should propose logic similar to this:

| Element | Decision |
| --- | --- |
| Trigger 1 | Hall motion changes to `on` |
| Trigger 2 | Hall motion remains `off` for 2 minutes |
| Turn-on condition | Illuminance below threshold, e.g. 60 lx |
| Day/evening action | Turn light on at 80% |
| Night action | Turn light on at 20% |
| Turn-off action | Turn light off if guest mode is off |
| Automation mode | `restart` or `queued`, depending on how repeated motion is handled |

A draft YAML could look like this:

```yaml
alias: Hall - motion light with night brightness
description: >
  Turns on the hall light when motion is detected and it is dark.
  Uses lower brightness at night. Does not auto-turn-off in guest mode.
trigger:
  - id: motion_on
    platform: state
    entity_id: binary_sensor.hall_motion
    to: "on"
  - id: motion_off
    platform: state
    entity_id: binary_sensor.hall_motion
    to: "off"
    for:
      minutes: 2

action:
  - choose:
      - conditions:
          - condition: trigger
            id: motion_on
          - condition: numeric_state
            entity_id: sensor.hall_illuminance
            below: 60
          - condition: time
            after: "22:00:00"
            before: "06:00:00"
        sequence:
          - service: light.turn_on
            target:
              entity_id: light.hall_ceiling
            data:
              brightness_pct: 20

      - conditions:
          - condition: trigger
            id: motion_on
          - condition: numeric_state
            entity_id: sensor.hall_illuminance
            below: 60
        sequence:
          - service: light.turn_on
            target:
              entity_id: light.hall_ceiling
            data:
              brightness_pct: 80

      - conditions:
          - condition: trigger
            id: motion_off
          - condition: state
            entity_id: input_boolean.guest_mode
            state: "off"
        sequence:
          - service: light.turn_off
            target:
              entity_id: light.hall_ceiling

mode: restart
```

Is this a perfect automation? Not necessarily. That is the point. AI created a draft that must be reviewed. We can ask: what happens if the light is already on at 80% after 10 p.m.? Should the automation lower brightness? What if `sensor.hall_illuminance` is unavailable? Should guest mode block only turn-off or also change brightness? Are night hours crossing midnight handled correctly? AI can help identify these questions, but decisions belong to us.

## Prompt 3: automation review

The most test-oriented prompt in the process is:

```text
Perform a code review of this Home Assistant automation.
Look for:
- logical bugs,
- edge cases,
- missing or suspicious entities,
- problems after Home Assistant restart,
- possible loops,
- safety risks,
- automation mode problems,
- places worth documenting in description.

Do not change the code yet.
First list observations in a table: problem, impact, recommendation.
```

This works well because the model stops being only a generator and starts acting like a reviewer. In smart home automations, review matters because mistakes have physical effects. A bad rule can turn on lights at night, drain batteries, heat while windows are open, or send dozens of notifications.

## AI and blueprints

Home Assistant also has blueprints: reusable automation templates that can be imported and configured with your own entities. The documentation describes them as one of the easiest ways to add automations because someone has already prepared the logic and you only plug in your devices.

AI is useful with blueprints in two scenarios.

First: choosing a blueprint. You can paste descriptions of several blueprints and ask the model to compare them against your goal. Second: creating your own blueprint from an automation that already works well. This is especially useful when you have similar logic in multiple rooms: motion lights, sensor notifications, button actions, humidity-based ventilation.

A good path is:

1. build one automation manually or with AI;
2. test it for several days;
3. fix issues;
4. only then ask AI to turn it into a blueprint;
5. check whether blueprint inputs are human-readable;
6. add description and constraints.

Do not create a blueprint from an automation you do not understand yet. A blueprint replicates both good decisions and mistakes.

## Jinja templates: where AI helps a lot

Home Assistant uses Jinja2 for templating. The official documentation correctly describes templates as a more technical area, close to light programming. Templates are useful when you need to calculate a value, build dynamic text, check several entity states, or process API data.

AI helps a lot with Jinja because many errors come from details: data types, `unknown` states, comparing text with numbers, rounding, and empty values. We can ask the model not only to write a template but also to make it robust against unavailable entities.

Example prompt:

```text
Write a Jinja template for Home Assistant.
Goal: return true if more than 3 windows are open.
Entities:
- binary_sensor.window_living_room
- binary_sensor.window_kitchen
- binary_sensor.window_bedroom
- binary_sensor.window_office
Requirements:
- handle unknown/unavailable,
- add a short explanation,
- show how to test it in Developer Tools > Template.
```

AI may generate a cleaner template, but you should still test it in the template editor. It is a fast way to verify that the result is what you expect.

## High-risk automations

Not all automations are equal. A hallway light can make a mistake and at worst annoy someone. But a lock, gate, alarm, heating system, EV charging, pump, water valve, or high-power device requires a different level of caution.

In high-risk automations, AI should be an advisor at most. A good pattern is:

```text
AI may:
- prepare a design,
- list risks,
- suggest conditions,
- prepare documentation,
- generate test cases.

AI should not:
- deploy changes on its own,
- decide to unlock a door,
- disable an alarm,
- bypass user confirmation,
- ignore emergency states.
```

If AI analyzes an image and detects a “known person at the gate,” that still does not mean it should open the door. It can send a notification with a manual confirmation button. It can suggest that someone is waiting. It can turn on outdoor lighting. But access decisions should be protected more strongly than a model-generated description.

## Automation documentation

One underrated AI role is documentation. After a year, a smart home starts to look like a small production system. There are dependencies, exceptions, modes, workarounds, and historical decisions. If we do not document automations, we become afraid to change them.

You can ask AI:

```text
Based on this automation, prepare documentation:
- goal,
- used entities,
- step-by-step behavior,
- modes and exceptions,
- known limitations,
- regression test ideas,
- a short description for YAML.
```

This is especially useful before refactoring. First document existing behavior, then change it. This software quality approach works very well in Home Assistant too.

## Testing automations like software

Smart home automations should be tested like small system functions. Each has inputs, conditions, and expected outputs.

For the hallway light, test cases may look like this:

| Case | Input | Expected result |
| --- | --- | --- |
| Day, bright | motion = on, lux = 200 | light does not turn on |
| Evening, dark | motion = on, lux = 20, time 19:00 | light 80% |
| Night | motion = on, lux = 10, time 23:30 | light 20% |
| No motion | motion off for 2 min | light turns off |
| Guest mode | motion off for 2 min, guest mode on | light stays on |
| Lux sensor unavailable | lux = unavailable | system behaves predictably |

AI can generate such test cases. This is a very useful exercise because it often exposes gaps faster than reading YAML. It is also worth using Home Assistant traces to see which path the automation selected and why.

## A minimal workflow

My recommended workflow is:

1. Describe the scenario in natural language.
2. List entities, modes, and constraints.
3. Ask AI for analysis, without YAML.
4. Approve the logic.
5. Ask AI for a YAML draft.
6. Paste YAML into a test environment or editor, not directly into a critical system.
7. Ask AI for review.
8. Test edge cases.
9. Add description and comments.
10. Monitor behavior for a few days.
11. Only then generalize it as a blueprint.

This may sound slower than “generate and paste,” but in practice it saves time. Less debugging, fewer random behaviors, fewer automations nobody understands.

## Summary

AI does not remove the need to think about automations. It helps us think faster, wider, and more structurally. The greatest value is not YAML generation itself, but requirements analysis, edge-case discovery, logic review, and decision documentation.

Used well, AI helps build a smart home that is not a pile of random rules, but a coherent system of behaviors. The classic model still applies: trigger, condition, action. What changes is the design process. Instead of starting with code, we start with intention and scenarios.

In the third part of the mini-series, we will move to dashboards. Because even the best automations need a good interface: one that does not show everything, but shows what truly matters at the moment.

## Sources and further reading

- [Home Assistant - Automation triggers](https://www.home-assistant.io/docs/automation/trigger/)
- [Home Assistant - Using automation blueprints](https://www.home-assistant.io/docs/automation/using_blueprints/)
- [Home Assistant - Introduction to templating](https://www.home-assistant.io/docs/templating/introduction/)
- [Home Assistant - OpenAI integration](https://www.home-assistant.io/integrations/openai_conversation/)
- [Home Assistant - Ollama integration](https://www.home-assistant.io/integrations/ollama/)
- [Home Assistant Developer Docs - API for Large Language Models](https://developers.home-assistant.io/docs/core/llm/)
