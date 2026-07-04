---
title: "Vacation Mode in Home Assistant: Presence Simulation and a House That Watches Itself"
description: "One input_boolean master switch, randomized presence simulation, layered alerts, a connectivity watchdog and trusted-person access - with yaml examples and a checklist."
date: 2026-08-14
tags: ["smart-home", "home-assistant", "vacation", "presence-simulation", "security"]
lang: en
readingTime: 16
author: GH
---

A house that stands empty for two weeks is not the house you live in every day - it's a different operating mode with different priorities. Everyday automations optimize for comfort; during a vacation they're supposed to pretend someone is inside, watch over what you can't see, and know who to call when something goes wrong. I'll show how I built vacation mode in Home Assistant around a single central switch: presence simulation that doesn't look like a simulation, layered alerts with escalation, supervision of the system itself, and an entrance for the person who comes to water the plants.

## Leaving is a mode change, not a ritual of fifteen toggles

Before I built vacation mode, every departure started with a ritual: lower the heating, switch off the water heater, arm the alarm, silence the speaker announcements, reshuffle the notifications, disable the lawn watering. Fifteen manual changes in the app, performed in a hurry somewhere between packing suitcases and locking the door. Something always slipped through - one year the water heater kept heating water for nobody for two weeks, another time the hallway motion sensor dutifully lit the light for every draft. The third time Julia and I sat in the car already packed, reconstructing from memory whether the water heater was really off, it became clear that a list kept in your head doesn't scale to a vacation.

The problem is structural, not a matter of discipline. An empty house has different priorities than an inhabited one: comfort stops mattering because there's nobody to be comfortable for, and security, economy and information move to the top of the list. Some everyday automations become useless in this mode (motion-triggered lighting), some become harmful (the heating schedule), and some change weight: a window open during the day is normally a journal entry, during a vacation it's an alarm event. If the entire operating context of the system changes, that change should be one decision, not fifteen.

## One switch: input_boolean as the source of truth

My entire vacation mode hangs on a single entity - an [input_boolean](https://www.home-assistant.io/integrations/input_boolean/) helper:

```yaml
input_boolean:
  vacation_mode:
    name: Vacation mode
    icon: mdi:airplane
```

The switch does nothing by itself - it's the source of truth that every other automation consults. One automation reacts to it being turned on and reconfigures the house:

```yaml
automation:
  - alias: "Vacation mode: enter"
    triggers:
      - trigger: state
        entity_id: input_boolean.vacation_mode
        to: "on"
    actions:
      - action: climate.set_preset_mode
        target:
          entity_id: climate.home
        data:
          preset_mode: away
      - action: switch.turn_off
        target:
          entity_id: switch.water_heater
      - action: alarm_control_panel.alarm_arm_away
        target:
          entity_id: alarm_control_panel.home
```

A second, mirrored automation reacts to it being turned off and restores the everyday state. Every other automation in the house gets a condition on the switch: presence simulation runs only when it's on, motion-triggered hallway lighting only when it's off, notifications about open windows change layers. The payoff of this architecture shows on the way back: instead of reconstructing a fifteen-item list from memory, I flip one switch while still at the airport and walk into a house that is already warming up.

I flip the switch manually on the way out, though nothing stops you from wiring it to a vacation calendar or having it turn itself on when both phones have been away for more than a day. I deliberately don't automate that part: entering vacation mode is a high-stakes decision and I prefer to make it consciously, with one tap, rather than explain to the house after a weekend trip why it spent two days simulating my presence for an empty street.

## Presence simulation: irregularity is a feature, not a bug

Burglars don't watch houses through binoculars around the clock, but dark windows evening after evening for a week is a signal legible to anyone who walks past regularly. Presence simulation has one goal: from the outside, the house should look inhabited. And here's the first trap, the one I fell into myself: a perfectly regular simulation betrays emptiness just as effectively as dark windows do. A living room light coming on at 19:00:00 sharp every evening and going off at 22:30:00 to the second is the signature of a timer, not of a human. People are irregular - and that irregularity is exactly what you need to reproduce. The good news: you don't need to simulate the whole house. The rooms visible from the street and the yard are enough - in my case the living room, the bedroom and the bathroom; nobody judges your basement from the outside.

There are two approaches. The first: history replay - you take the recorded light states from a week or a month ago and play them back with an offset, like a tape. It's the solution closest to the truth, because it reproduces your real habits with all their irregularity; the Home Assistant community has ready-made integrations doing exactly this. The second approach, the one I use: randomness within time windows. You define windows that match the real rhythm of the house and randomize the start moment and the duration within them:

```yaml
automation:
  - alias: "Vacation: evening light in the living room"
    triggers:
      - trigger: sun
        event: sunset
        offset: "-00:20:00"
    conditions:
      - condition: state
        entity_id: input_boolean.vacation_mode
        state: "on"
    actions:
      - delay:
          minutes: "{{ range(0, 40) | random }}"
      - action: light.turn_on
        target:
          entity_id: light.living_room
      - delay:
          hours: "{{ range(2, 4) | random }}"
          minutes: "{{ range(0, 59) | random }}"
      - action: light.turn_off
        target:
          entity_id: light.living_room
```

The bedroom (a later window, shorter duration) and the bathroom (short episodes) get analogous automations. The key: the windows must match your actual habits. If your kitchen light normally goes off at nine, a simulation glowing until midnight is as fake as darkness.

Blinds make a bigger difference than lights, because they're visible during the day too. Blinds closed for two weeks straight are the loudest possible "nobody's home" announcement - so during a vacation mine keep moving in their daily rhythm: up in the morning (with a random offset), down after dusk. The third element is occasional media: a TV or a speaker switched on two or three evenings a week for an hour produces flicker and sound that can't be told apart from actual presence through the curtains. Occasional, not daily - again: regularity betrays you.

Test the simulation the way it will be judged: from the street. A week before departure I turn vacation mode on for one trial evening and go for a walk around the house - the cheapest review I know. From the pavement you immediately see things the app never shows: the bedroom lighting up at an odd hour, a lamp behind a thin curtain illuminating an empty room far too theatrically, the hallway glowing for an hour even though nobody ever spends an hour in a hallway. Two such walks were enough for me to rework half of my time windows.

## Sensors and escalation: the house reports in layers

Simulation is theatre for the outside; inward, the house watches through sensors. The set is standard - opening sensors on windows and doors, motion sensors, leak sensors under the dishwasher, the washing machine and the water heater, a smoke detector, cameras - but during a vacation the weights of events shift. I've written about the layered notification model (alarm, info, journal) [in a separate piece](/en/blog/notifications-that-dont-fatigue-home-assistant/); vacation mode is, in practice, a mass reassignment between layers. The front door opening, a journal entry on a normal day, becomes a critical event with the alarm armed and the house empty: the notification breaks through mute and the hallway camera attaches a picture to it (cameras and privacy get [their own article](/en/blog/ai-smart-home-cameras-privacy/)). Motion inside without a prior door opening is the highest priority of all, because it means there's someone in the house who didn't come in through the door. It's worth adding a temperature sensor with an alarm threshold to the set: a heating failure in an empty house in winter means burst pipes, and in summer a dead fridge greets you on return with a smell beyond description - both scenarios are caught by one cheap sensor and one threshold automation.

The second shift: escalation stops being optional and becomes a duty, because the fallback plan of "I'll go downstairs and check" doesn't exist. A leak with the house empty is handled in three steps at my place. A critical notification to my phone and the water shut-off valve closing immediately - the house doesn't wait for my approval, because the cost of a needlessly closed valve in an empty house is zero. No acknowledgement from me within five minutes - a notification to Julia's phone. No reaction from either of us - a message to the trusted person with the keys, asking them to check. Note the inversion of the everyday logic: normally the house asks before it acts; with the house empty, it acts first and reports after.

## Failures: silence is ambiguous

The hardest problem of vacation mode isn't technical, it's epistemic: from the perspective of a phone on the other side of Europe, a power cut, a dead internet connection and a crashed server look exactly like two weeks of peace - silence. A house with nothing to report and a house unable to report anything send exactly the same thing: nothing. Without an extra mechanism, you'll learn about the failure from the first thing that goes wrong after it.

The solution is a watchdog: a service outside the house that expects a regular heartbeat from Home Assistant and raises an alert when the heartbeat stops coming. The implementation is trivial - an automation pings the URL of an external monitoring service every five minutes, and the service messages you when the house has been silent for more than a quarter of an hour. The direction is the crucial part: the "house lost connectivity" notification cannot be sent by the house, because a house without connectivity sends nothing; it has to come from someone watching the house from the outside. One step further is a router with an LTE fallback link: when the main line fails, the house loses fast internet but can still push notifications - which is exactly what this mode is about.

The second element is power backup: a UPS on the server and the router buys the fifteen-odd minutes that cover most short outages, and a UPS integration provides a battery sensor - a "house running on battery" notification sent before everything goes dark is worth more than silence after the fact. The third: unattended restart. Before you leave, verify that after cutting and restoring power the server boots on its own, Home Assistant starts without asking for anything, and the input_boolean restores its pre-restart state (it does - helper entity states are persisted). And make a fresh backup with tested recovery - I've described the [backup strategy separately](/en/blog/home-assistant-backup-recovery-strategy/); a disk is perfectly capable of dying on day eight of a vacation too.

## The trusted person: entry without disarming the fortress

The plants need watering, the mailbox needs emptying - and suddenly the fortress project needs a guest gate. The worst solution: giving someone the master alarm code and switching sensors off for the duration. A good solution has three parts. First, a time-boxed code: the keypad lock and the alarm panel get a separate code for the trusted person, valid exclusively for the vacation period - in my case additionally only between 8 a.m. and 8 p.m., because watering plants at three in the morning is not a scenario I want to support. I create the code before leaving and it expires automatically once we're back. If you don't have a keypad lock, the minimal variant is an ordinary key plus a separate code for the alarm panel - the sequence stays the same, only the entry is detected by the door opening sensor instead of the lock.

Second, handling the visit. The door opening with the guest code triggers a sequence: the alarm disarms for the ground-floor zone, presence simulation suspends (so the automation doesn't switch lights off over anyone's head), and I get an info-layer notification - "Kate entered, 6:42 p.m." - info, not alarm, because this is an expected event. Third, closing the loop: once the door is shut and the motion sensors see nobody for fifteen minutes, the house re-arms the alarm and resumes the simulation on its own. The trusted person needs no app, no account and no Home Assistant training - they get a four-digit code and the assurance that the house will take care of them.

## The pre-departure checklist

Vacation mode reconfigures the house with one switch, but a few things need checking by hand. My list, in execution order:

- **Sensor batteries** - replace everything below 30%. An opening sensor that dies on day three punches a hole in the system exactly where you can't see it.
- **Backup** - fresh, made after the last configuration changes, stored outside the house.
- **Sensor test** - open a window with the alarm armed, short a leak sensor with a wet finger. The notifications must arrive in exactly the form you expect them in.
- **Watchdog test** - stop Home Assistant for twenty minutes and check that the connectivity-loss alert actually arrived.
- **Water valve** - if you don't have a motorized shut-off valve, close the main valve by hand; the washing machine and the dishwasher don't need pressure for two weeks.
- **Trusted person's code** - created, tested with one real entry, expiry date set.
- **No updates** - no Home Assistant, add-on or device firmware updates in the final days before departure. Stability beats novelty; the experiments will wait for you.
- **The switch** - turn vacation mode on at the door and spend two minutes verifying in the app: heating in away mode, water heater off, alarm armed.

## Summary

Vacation mode isn't a set of gadgets, it's a change of contract between you and the house: on a normal day the house optimizes your comfort, during a vacation it's supposed to impersonate you, guard itself and know who to call. The architectural foundation is one input_boolean as the source of truth, with every behavioural change hanging off it. Presence simulation works exactly to the degree that it reproduces real habits with real irregularity. Sensors shift the weights of events, escalation acts first and reports after, and a watchdog solves the problem of ambiguous silence. Add a time-boxed code for the plant person and a checklist for the last evening. The whole thing took me a week to build, and it pays off in a single moment: when, on a deck chair, you realize you haven't once in three days wondered whether the house is all right.
