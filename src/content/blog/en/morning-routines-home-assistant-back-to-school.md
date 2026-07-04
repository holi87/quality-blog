---
title: "Morning Routines in Home Assistant: Back to School and Work Without the Chaos"
description: "Wake-up light, an event-driven morning sequence, per-person routines and a single leaving automation - taking the chaos out of school-year mornings."
date: 2026-08-31
tags: ["smart-home", "home-assistant", "routines", "automations", "family"]
lang: en
readingTime: 14
author: GH
---

September is the biggest rhythm reset in a household's calendar. After two months in which breakfast sometimes happened at ten and evenings had no clear end, the regime returns: up at 6:30, bus at 7:40, first meeting at 9:00. In most families the first weeks of that transition are pure chaos - groggy kids, a hunt for the second shoe, leaving without breakfast and with the feeling that the day was lost before eight. A smart home can absorb part of that friction, but on one condition: the automations must be designed around people and their habits, not people drilled to fit the automations. I'll walk through the set of morning routines in Home Assistant that has survived more than one September at our place: wake-up light, an event-driven sequence instead of rigid times, separate paths for kids and adults, and exit control with a single automation.

## Waking with light instead of sound

An audible alarm yanks you out of whatever sleep phase you're in within half a second and puts the body into alert mode - hence that unpleasant sensation of your heart beating faster before your eyes are even open. Light works differently: brightness rising gradually in the bedroom over the 15-30 minutes before the alarm nudges sleep towards its shallower phases, so the ringtone - if it's still needed at all - finds you near the surface rather than at the bottom. It's the same mechanism that dedicated wake-up lamps sell, except in Home Assistant you build it out of a bulb you already have in the bedroom. At our place, after two weeks of dawn simulation the kids started coming down to breakfast before their alarms went off, which had previously never happened.

The minimal version is one automation and a bulb with adjustable brightness and colour temperature:

```yaml
alias: "Bedroom dawn simulation"
triggers:
  - trigger: time
    at: "06:10:00"
actions:
  - action: light.turn_on
    target:
      entity_id: light.bedroom_lamp
    data:
      brightness_pct: 1
      color_temp_kelvin: 2000
  - action: light.turn_on
    target:
      entity_id: light.bedroom_lamp
    data:
      brightness_pct: 85
      color_temp_kelvin: 4000
      transition: 1200
```

Two notes from practice. First, not every bulb renders a twenty-minute transition smoothly - some make visible brightness jumps, some simply ignore values that long. If yours chokes, replace the single call with a script that raises brightness by a few percent every minute; same effect, and the control stays on the Home Assistant side. Second, the blinds. Opening them in stages works beautifully in late August and September, when it's already light outside at 6:30: first 30 percent alongside the bulb's artificial dawn, full open only after a confirmed wake-up. In winter the order reverses - the lamp does all the work and the blinds wait for the actual sunrise.

## The phone's alarm, not a hardcoded hour

The hardcoded-time version breaks on the first day the alarm rings at a different hour: a school trip at 6:00, a day off work, an earlier train. The Home Assistant companion app on Android exposes a next-alarm sensor - an entity that always knows the time of the nearest alarm set on the phone. Instead of syncing automations with the family calendar, you attach a time trigger with a negative offset:

```yaml
triggers:
  - trigger: time
    at:
      entity_id: sensor.gh_phone_next_alarm
      offset: "-00:20:00"
conditions:
  - condition: state
    entity_id: binary_sensor.workday_sensor
    state: "on"
```

A condition on the workday sensor takes care of distinguishing a school day from the weekend - the Workday integration knows public holidays, so on a bank holiday the house drags nobody out of bed. On iOS there is no next-alarm sensor; the workaround is a helper entity holding the wake-up time, set in the evening by hand or via a system shortcut. Less elegant, but it works, and as a side effect it forces the evening decision "what time am I getting up tomorrow", which by itself puts order into the rhythm.

The second phase of the morning shouldn't start from a clock but from an event: the first movement in the kitchen. A motion sensor by the entrance triggers the counter light, the kettle's smart plug and a quiet radio station - but only once someone has actually made it there. The difference is fundamental: an event-driven house reacts to what is really happening, while a schedule-driven house performs a show for empty rooms on the day everyone overslept. I tie each next step of the routine to the event that precedes it, not to the hour when it was supposed to happen.

## A separate path for each person

A shared routine for the whole family falls apart at the first difference: I leave at 7:10, the kids at 7:40, and the person working from home doesn't have to leave at all. So instead of one sequence for everyone - detection of who is already up, and a separate path per person. The simplest wake signal is a phone taken off its charger: the companion app exposes a charging sensor, and a teenager reaches for the phone within a minute of opening their eyes, which makes it a surprisingly reliable indicator. A more precise signal comes from per-room presence - a motion sensor in a child's bedroom, or a presence sensor that can tell an empty bed from a person still sleeping in it.

The kids' routine differs from the adults' in content and tone. For the kids: the light in their room starts after their own simulated dawn, the speaker says one short sentence about the weather and the first lesson, and fifteen minutes before departure the hallway lamp turns yellow - the "shoes and backpack" signal that nobody has to shout across the house. For the adults: the coffee machine and a briefing of the day instead of parenting announcements. The crucial part is that the phases stay independent - my earlier departure must not switch the lights off on kids who are still eating breakfast.

Then there's the bathroom, the classic morning bottleneck. Instead of negotiations through a closed door: a presence sensor in the bathroom and small lamps in the bedrooms that glow orange when it's occupied and green when it frees up. Add staggered dawns - each person wakes ten minutes after the previous one - and the queue forms itself. It sounds trivial, but this one automation removed the most repeatable conflict from our mornings.

## Morning information: one serving, not a stream

The morning is the worst possible time to be scanning five apps and ten notifications. Everything a family needs before leaving fits into three sentences: what's the weather, what's on today, when to leave. A forecast with a single condition on precipitation probability turns data into a decision: "take an umbrella" carries more weight than a rain map. Today's calendar can be read out by TTS on the kitchen speaker, triggered by the first movement in the kitchen - I covered wiring that up in the piece on the [voice assistant](/en/blog/ai-smart-home-voice-assistant/) - or it can sit on a [wall dashboard](/en/blog/ai-smart-home-dashboards/), next to the departure time.

The departure time itself doesn't have to be guesswork: a travel-time integration (Waze, for instance) computes the commute with live traffic and turns "we should probably go" into "leave before 8:05, the ring road is jammed". One number, refreshed every few minutes, displayed where you're already looking.

All of this information follows one hard rule: it is delivered once, in one serving, at the moment the morning is already underway - not as a series of pushes to the phone. A morning summary instead of a stream of individual messages is the same pattern I described in the [notification strategy](/en/blog/notifications-that-dont-fatigue-home-assistant/): a phone buzzing through breakfast teaches everyone to ignore it, while information spoken once in the kitchen or sitting on the dashboard does the same job without the attention tax.

## One "we're leaving" instead of ten chores

The last five minutes before leaving are the worst possible moment to have to remember anything. That's why exit control is a single automation, fired by a button at the door or automatically when the last person leaves the home zone. What it does:

- **Lights** - all of them go off, including that basement lamp nobody ever remembers.
- **Heating** - thermostats switch to an away profile; nobody heats an empty house to 22 degrees.
- **Media** - speakers and the TV shut down, the kitchen radio stops playing to empty chairs.
- **Empty-house mode** - motion sensors switch from comfort to vigilance, and the robot vacuum gets the signal that the floor is clear.

The second half of this automation is a check, not an action: the house inspects the group of contact sensors, and if any window or door was left open, it sends an actionable notification before you've driven off: "Bathroom window open. Coming back, or leave it?". This is the one moment of the morning when a push to the phone is justified - because it demands a decision now, and missing it costs money or peace of mind.

Button versus geofencing: the button gives determinism and a ritual, the home zone gives a safety net. What works for us is a hybrid - the button by the door is the official end of the morning, and if nobody pressed it and the home zone has been empty for ten minutes, the house switches to away mode by itself, quietly.

## The evening makes the morning

The best morning automations fire the previous evening. At 21:30 the house does a short review: are the kids' phones on their chargers - without a charged phone the next-alarm sensor won't work, and the whole routine hangs on it - and was the washing machine or dishwasher that's supposed to finish before morning actually switched on. If something's off, one reminder on the speaker while everyone is still up. In the evening that nudge costs ten seconds; in the morning it costs a missed bus.

We moved tomorrow's forecast to the evening too. The "jacket or bike" and "PE kit or umbrella" decisions get made at dinner, not at 7:20 in the hallway. The evening summary has three lines: tomorrow's weather, the first calendar event for each household member, and unfinished business - a basement window still open, a phone not charging. The morning starts the day before; the morning itself is just execution.

Finally, night mode closes out the day: lights drop to a warm, low brightness, heating goes to its night setpoint, and the house checks the locks and windows. It's the mirror image of the leaving automation - and the second of exactly two moments in the day when the house is allowed to want something from me.

## Automation the family will accept

Most morning automations die for social reasons, not technical ones: somebody in the house doesn't want them. The principle that keeps our system alive is this: an automation should be invisible when it works and easy to bypass when it gets in the way. Invisible, meaning nobody thinks "I need to start the routine now" - things simply happen in the right order. Easy to bypass, meaning the physical switch always beats the automation, and turning the lamp off mid-dawn interrupts the sequence instead of stubbornly resuming it.

On top of that, two safety valves. First: a "day off" helper toggle that silences the entire morning sequence with one tap - a sick child, a holiday, simply a rough day. Without it, the first exceptional situation ends with a sensor ripped out of its socket. Second: new automations arrive one at a time, one per week, and each has to survive a trial period without a single complaint from the household. If you have to explain how an automation works to the same person twice, it's too clever and needs simplifying.

The measure of a morning routine's success is not the number of automations but the number of decisions and reminders that have disappeared from the morning. If after a month nobody is shouting "where are the keys", nobody goes back to check the iron and nobody asks about the weather - the system works, even if technically it's mundane.

## Summary

Getting back into the school rhythm doesn't take heroics, just removing friction from a few predictable spots in the morning. Waking with light instead of sound, because a gentle glide through the sleep phases does more than a louder ringtone. An event-driven sequence - the phone's alarm, the first movement in the kitchen - instead of rigid times that break at the first deviation. Separate paths for kids and adults, with detection of who is already up. One serving of morning information instead of a stream of notifications, one leaving automation instead of ten chores, and an evening that prepares the morning before anyone falls asleep. And above it all, the overriding rule: the house adapts to the family, not the other way round. The best morning automation is the one nobody remembers exists by mid-September - because it simply works.
