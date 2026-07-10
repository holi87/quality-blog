---
title: "Presence Sensors 2026: PIR, mmWave or Bluetooth Tracking - What to Pick for Which Room"
description: "A comparison of three human-detection technologies: price, sensitivity, false alarms, privacy and power consumption, plus concrete room-by-room recommendations and mmWave tuning."
date: 2026-08-07
tags: ["smart-home", "home-assistant", "sensors", "mmwave", "presence"]
lang: en
readingTime: 9
author: GH
---

The light goes out while you're sitting motionless at your desk? That's a classic PIR sensor, which detects motion, not presence - and it's the most common reason people get disappointed with lighting automations. I compare three human-detection technologies: price, sensitivity, false alarms, privacy and power consumption, and then I go room by room and say what I'd hang where.

## Why your light goes out while you're reading

A PIR (passive infrared) sensor doesn't see you - it sees a change in the heat distribution within its field of view. When you walk across the room, a warm blob moves between the lens zones and the sensor reports motion. When you sit motionless over a book or a keyboard, to a PIR you're a piece of furniture. The automation counts down five minutes without motion and turns off the light - exactly as programmed, just against your intent.

This problem has two honest solutions. The first: extending the hold time, which is treating the symptoms - the light in an empty room then burns for twenty minutes. The second: a technology that actually detects presence, not motion. And this is where mmWave sensors come in, and, for a different class of tasks, bluetooth signal tracking.

## Three technologies in five minutes

**PIR** is the veteran: cheap, instant, frugal. It runs on a battery for years, reacts in a fraction of a second and costs from 40 zlotys. One fundamental weakness, but a defining one: stillness means no detection.

**mmWave** is millimetre-wave radar - the sensor emits radio waves and analyses reflections. It is good at detecting small movements from a seated person, while selected models and modes are designed to detect breathing as well. Not every mmWave sensor will reliably detect a person sleeping under bedding. The price of that sensitivity is usually mains power, higher cost (150-400 zlotys), and a tendency toward false alarms because a moving curtain, fan, or plant in a draught also reflects waves.

**Bluetooth tracking** answers a different question. PIR and mmWave say that "someone" is in the room; tracking the signal of a band, a phone or a watch says that it's specifically you. You place receivers in rooms (cheapest: ESP32 modules running ESPresense, or plain ESPHome devices acting as bluetooth proxies plus the Bermuda integration in HA), and the system estimates from signal strength which room a given device is in. This is not presence detection for switching lights off - latencies run into tens of seconds - but for personal scenes there is no better tool.

Two practical notes on the bluetooth layer. Phones randomize BLE addresses, so you cannot rely on a normal hardware address. On Android, the Home Assistant app can transmit an iBeacon; an iPhone can be resolved through the Private BLE Device integration using its IRK. A keyfob or band with a stable identifier is another option. Expect calibration: signal strength depends on walls, furniture, and which pocket holds the phone. One receiver per room where personalization matters is a useful starting point, not an accuracy guarantee.

| Criterion | PIR | mmWave | Bluetooth |
| --- | --- | --- | --- |
| Detects stillness | No | Yes; breathing only with suitable models and conditions | Yes (device presence) |
| Reaction time | Under a second | 1-3 seconds | 10-60 seconds |
| False alarms | Rare (pets, sunlight) | Frequent without tuning (curtains, fans, plants) | Rare, but drifts between rooms |
| Recognizes who | No | No | Yes |
| Power | Battery, 1-2 years | Mains (USB) | Mains (receivers) |
| Price per room | 40-90 zł | 150-400 zł | 60-100 zł per receiver |
| Privacy | No concerns | No camera, but maps position within the room | Tracks specific people - requires household consent |

Privacy deserves an extra sentence. None of these technologies records images, and that's their great advantage over cameras with person detection. But bluetooth tracking by definition builds a history of who was in which room and when - before you enable it, talk to your household. At our place the consent was conditional: we track phones, not people, and everyone can turn theirs off.

## Room by room

**Office and workspaces: mmWave, no debate.** This is exactly the scenario where PIR loses - hours of stillness at a desk. An mmWave sensor aimed at the desk zone keeps the light and presence automations alive for as long as you sit there. Proven models: Aqara FP2 (Wi-Fi, zones defined in the app - you can exclude the window with the curtain), Everything Presence Lite (ESPHome, fully local, great for tuning in HA) or one of the cheaper sensors built on the LD2410 chip.

**Bathroom: a PIR plus mmWave duo.** A PIR by the entrance turns the light on instantly (mmWave can be a second too slow, and in a bathroom every second in the dark is annoying), while mmWave maintains presence during a bath, when there's almost no movement. The automation: turn on from PIR, turn off only when mmWave reports emptiness. A practical note: steam and moving water can generate false reflections - aim the sensor at the sink and bathtub zone, not at the shower spray.

**Living room with a cat: mmWave with zones, or a conscious compromise.** The marketing "pet immunity" in PIR sensors usually means reduced sensitivity below a certain height - with a cat walking along the back of the sofa it works poorly. An mmWave sensor with zones (the FP2 is strong here) lets you cut the floor and the scratching post out of the detection zone and keep the sofa and armchairs. It will work nine times out of ten; the tenth is a cat sleeping exactly in your spot on the sofa - no technology will tell that apart from a human based on the radar reflection alone.

**Bedroom: specialized mmWave or a pressure sensor.** Radar with a breathing mode can help estimate bed occupancy, but results depend on the model, mounting, bedding, and air movement. Do not treat it as a medical device or a sole safety signal. A fan by the bed is a first-class source of false presence, and the sensor should face the bed rather than the window. A pressure sensor measures occupancy more directly, but it also needs calibration and may react to a pet, luggage, or shifted weight.

**Hallway and stairs: a plain PIR.** Nobody stands motionless on the stairs. Here only reaction speed and price matter - a 50-zloty PIR (Sonoff SNZB-03P, Aqara P1) does the job, and the battery lasts well over a year. Spending money on mmWave here is burning the budget.

**Kitchen: usually a PIR is enough.** Cooking is constant motion, so stillness is rare. The exception: if you also work or eat at the kitchen counter and the light is to be presence-controlled, treat the kitchen like an office and add an mmWave aimed at the table zone.

> PIR says: someone moved. mmWave says: someone is here. Bluetooth says: this is Grzegorz. A good presence system uses all three sentences, each where it makes sense.

## Tuning mmWave before you declare it broken

mmWave sensors have a deserved reputation for being temperamental and an equally deserved reputation for being excellent - the difference lies in tuning. Four steps that resolve most problems. First: **limit the maximum range to the room's dimensions**. Millimetre waves penetrate thin partition walls, and a sensor with the factory eight-metre range detects movement in the hallway behind the wall. That's the most common cause of "ghosts", right after curtains.

Second: **set the hold time in one place** - either in the sensor or in the automation, never in both. Two overlapping delays produce unpredictable behaviour that can't be sensibly diagnosed. Third: **placement matters** - the sensor should look at the zone where people are, not at a window, a door or an air vent. A height of about one and a half metres and a slight downward angle is a good starting point for most models. Fourth: **watch the diagnostic entities** - better sensors report target distance and energy, so instead of guessing what triggers false presence, you open a chart and see that the target always appears 3.2 metres from the sensor. Exactly where the monstera stands.

Give yourself a week of observation for every new sensor before you wire whole-zone light switching to it. An untuned mmWave controlling the lights is the fastest road to the household losing trust in the entire system.

## Home Assistant integration and combining sensors

All the device classes mentioned integrate locally: Zigbee sensors through the coordinator (ZHA or Zigbee2MQTT), the Aqara FP2 over Wi-Fi via the HomeKit integration, ESPHome devices natively, bluetooth tracking via ESPresense (publishes over MQTT) or Bermuda. Every sensor ends up as a binary presence or motion entity - and that's where the real work begins.

The best results come from combining sensors into one logical presence entity per room: a group helper in "any reports presence" mode, or a template along the lines of "turn on when PIR *or* mmWave; turn off when both have been silent for two minutes". PIR provides the speed of switching on, mmWave the certainty of holding - each is flawed on its own, together they create the impression of a house that simply knows. Start with the one room where the current system annoys you the most, add an mmWave there next to the existing PIR, and give yourself a week of sensitivity tuning before you buy more.

## Summary

There is no single best presence sensor - there is the right technology for the right room. PIR where people move through (hallways, stairs, the pantry), mmWave where they stay still (office, living room, bedroom, bathroom), bluetooth tracking where you want to know who, not just whether (personal scenes, coming-home automations). Budget-wise: start with PIRs for a few dozen zlotys, add mmWave selectively to the stillness rooms, and treat bluetooth as the personalization layer at the end. And one tuning tip worth more than many a purchase: before you declare an mmWave sensor faulty, exclude curtains, fans and plants from the detection zone - they are the "ghosts" in ninety percent of the reports.
