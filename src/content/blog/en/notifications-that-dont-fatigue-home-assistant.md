---
title: "Notifications That Don't Fatigue: a Notification Strategy for Home Assistant"
description: "A layered notification model (alarm, info, journal), actionable notifications with buttons, escalation for critical events, plus quiet hours and grouping - with yaml examples."
date: 2026-08-10
tags: ["smart-home", "home-assistant", "notifications", "automations", "ux"]
lang: en
readingTime: 9
author: GH
---

Three weeks after rolling out a smart home, most people turn notifications off, because the house spams about everything: the washing machine finished, a sensor came back online, the temperature dropped half a degree. And then they miss that one notification about a leak under the dishwasher. I'll show a layered notification model, patterns for actionable notifications and escalation, and a few short yaml examples you can implement in one evening.

## How the house teaches its residents to ignore it

The mechanism is well known from IT operations teams: an alarm that rings too often stops being an alarm. At work we call it alert fatigue and treat it as a serious defect of the monitoring system - and then we come home and build ourselves exactly the same defect with our own hands. Every new automation gets a "just in case" notification, after a month the phone buzzes fifteen times a day, and after two months all Home Assistant notifications are muted system-wide.

The problem isn't the number of notifications, it's the lack of distinction in their weight. When "water detected under the dishwasher" looks and sounds identical to "laundry finished", the recipient has no way to learn to react differently. The cure is an explicit layer model.

## Three layers: alarm, info, journal

Every notification in my house must have one of three layers assigned before the automation even gets written:

| Layer | Criterion | Channel | Examples |
| --- | --- | --- | --- |
| Alarm | Requires action now; cost of missing it is high | High-priority notification configured and tested on that phone | Water leak, smoke, carbon monoxide, gate open at night, burglar alarm |
| Info | Useful to know today; action optional | A regular silent push to the phone | Laundry finished, package at the door, guest on the way, low sensor battery |
| Journal | Might be useful someday; no action | Only an entry in the HA logbook, zero pushes | Sensor came back online, automation executed, door opened during the day |

The qualifying test is brutally simple: what happens if I see this notification tomorrow? If nothing - it's journal. If I lose a bit of convenience - info. If I lose money, health or a sense of security - alarm. In my house six events qualify for the alarm layer. Six, not sixty - and that's exactly why, when the phone rings with the alarm sound, everyone knows it's not a drill.

Technically, the Home Assistant mobile app supports critical notifications on iOS and channels, priorities, and alarm streams on Android. Behavior depends on the operating system, permissions, channel settings, and focus mode, so do not assume it will bypass every mute state automatically. Configure and test the alarm layer on every phone; an autonomous smoke or carbon monoxide alarm must still alert locally without Home Assistant.

The info layer has one more useful variant: the **morning summary**. Instead of sending every piece of information immediately, some of it can be collected and delivered once a day in a single message: the forecast, sensor battery levels, what the house did overnight, whether there are outstanding matters like the basement window open since yesterday. One message at 7:30 replaces six to eight individual notifications for me, and it reads better than all of them separately.

## Actionable notifications: a question instead of an announcement

Half of my info notifications disappeared when I understood that the house shouldn't report - it should ask. Instead of "gate open for 10 minutes" (and what am I supposed to do about that, standing in a checkout queue?), the phone gets a question with two buttons:

```yaml
actions:
  - action: notify.mobile_app_phone_gh
    data:
      title: "Gate open for 10 minutes"
      message: "Close it?"
      data:
        actions:
          - action: "CLOSE_GATE"
            title: "Close"
          - action: "LEAVE_OPEN"
            title: "Leave for 30 min"
```

A second automation listens for the button press event and performs the action. One thumb tap instead of opening the app, finding the right card and the right switch. This pattern fits everywhere the reaction is binary: close the gate, water the garden despite the rain forecast, run the dishwasher now or on the cheap tariff, arm the alarm despite an open upstairs window.

## Escalation: a house that doesn't let go when it matters

The alarm layer has one more duty: not to let itself be missed. The escalation pattern looks like this - send the notification, wait a set time for a reaction, and if there's no reaction, raise the level:

```yaml
      - wait_for_trigger:
          - trigger: event
            event_type: mobile_app_notification_action
            event_data:
              action: "ACKNOWLEDGE_LEAK"
        timeout: "00:03:00"
      - if: "{{ wait.trigger is none }}"
        then:
          - action: notify.mobile_app_julia_phone
          - action: media_player.play_media
            target:
              entity_id: media_player.home_speakers
```

In practice, a leak sensor sends an alert to my phone; without acknowledgement it goes to a second phone and the speakers. Add automatic valve closure only after testing false alerts, the valve itself, and the effects of isolation on heating, irrigation, or fire protection. Reserve escalation for genuinely urgent events.

> Every notification that doesn't change your behaviour teaches you to ignore all the others - including the one that will someday be truly important.

## Quiet hours, grouping and addressing

Three finishing touches that make the difference between a tolerable system and a good one. First: **quiet hours for the info layer**. Notifications about finished laundry have no right to exist between 10 p.m. and 7 a.m. - a time condition in the automation, or a central notification script that checks the hour before sending. The alarm layer has no quiet hours by definition: a leak at three in the morning is supposed to wake you up.

Second: **grouping**. Five sensors reporting low battery is one consolidated notification once a week, on Saturday at ten, with the list of sensors - not five separate buzzes at random moments. Same with reports: one morning "house today" message instead of a trickle of trivia.

Third: **addressing the right person**. A notification about an open gate should go to whoever is at home or closest - not to everyone. A presence zone condition does the job, and as a side effect it halves the number of notifications per person. The common denominator of these three touches: instead of scattering logic across dozens of automations, build one central notification script with parameters (layer, content, recipient) and call it from everywhere. Changing the quiet hours then means editing a single place.

## Channels beyond the phone: light, speakers, tablet

The phone is the default channel, but not the only one - and some notifications shouldn't land on it at all, because better carriers exist. **Light as a signal**: a hallway sconce glowing green when the laundry is done, or orange when a window is open while the heating is on. The information is visible exactly when you walk past, requires no reaching for the phone and doesn't bother you when you're away. For household members who don't want any apps, this is often the only accepted interface.

**Speakers and voice announcements** work well for events relevant to everyone present: a guest at the gate, water under the dishwasher, a reminder to leave for school. The hygiene rule: voice announcements only when someone is home (a presence zone condition) and never during quiet hours, except for the alarm layer. A speaker talking to an empty house is a waste; one talking at 11:30 p.m. is sabotage.

A **wall tablet** with a dashboard is a good place for an intermediate layer: persistent notifications inside Home Assistant that stay on the view until someone acknowledges them - a list of household matters instead of a stream of pushes. That's where things like "air purifier filter due for replacement" live at my place - not urgent enough for the phone, too important for the journal alone.

## The audit and the promotion rule

A notification strategy is not a one-off project - it degrades with every new automation. The first control is a quarterly audit of your own sent-message log or the operating-system history where available. The app does not guarantee one complete archive of every notification on every platform. For each message, ask whether it led to action and whether you want it again. The second control is a promotion rule: a new automation starts in the journal and moves higher only when evidence shows that the notification is useful.

## Summary

Good notifications are not a feature, they're a strategy: three layers (alarm, info, journal) with a hard qualifying test, actionable notifications instead of reports wherever the reaction is binary, escalation exclusively for events that must not be missed, quiet hours and grouping for everything else. Start with an audit: review the last week's notifications and assign each one to a layer - whatever doesn't fit any, delete without regret. My result from such an audit a year ago: out of twenty-three notifications a day, five remained, and the sense of control over the house went up instead of down. A phone that buzzes rarely is a phone whose buzzing means something.
