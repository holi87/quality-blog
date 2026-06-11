---
title: "AI in Smart Home, Part 8: A Home That Keeps Watch - Cameras, Privacy, and Local Event Analysis"
description: "The eighth part of the AI in smart home mini-series. We assemble local monitoring: Frigate for detection, a vision model for event descriptions, Home Assistant for notifications - and we draw the privacy boundaries a camera should never cross."
date: 2026-07-27
tags: ["ai", "smart home", "home assistant", "cameras", "privacy", "monitoring"]
lang: en
readingTime: 9
author: [JS, GH]
---

Monitoring with AI analysis does not have to mean sending footage of your garden to the camera manufacturer's cloud. A local stack - Frigate for detection, LLM Vision for event descriptions, Home Assistant for notifications - gives you monitoring that says "the courier left a package" instead of "motion detected", with recordings that never leave the house. In this part, we put it all together and draw the boundaries a camera should not cross.

## Frigate: eyes that send nothing outside

In the [first part of the series](/en/blog/ai-smart-home-llm-vision/), we showed how a vision model interprets images. Here we close the architecture from the source side. Frigate is a local recorder with object detection: it reads camera streams, recognizes people, cars, animals, and packages, records events, and exposes everything to Home Assistant. The whole process happens on your hardware.

The condition for sensible operation is an accelerator for detection. On the CPU alone, Frigate will handle one or two cameras and eat half the server doing it. With a Coral accelerator for about 60 euros, or with an Intel GPU and OpenVINO, the same server analyzes several streams effortlessly. It is the best-spent money in the whole project - cheap detection at the edge means the more expensive vision model analysis only kicks in when there is something worth analyzing.

## Zones and masks: the camera looks only where it should

The biggest quality gain in monitoring comes not from a better model, but from framing the problem well. Frigate lets you draw zones and masks on the image. The "driveway" zone and the "gate" zone are different events with different weights. A mask over the sidewalk and the street means pedestrians and passing cars simply do not exist for the system - not for detection and not for event recordings.

This is not only a matter of peace of mind, but also of the neighbors' privacy. A camera aimed at your own property, with a mask over the fragment of someone else's space in the frame, is a standard worth adopting before anyone asks for it. A good notification starts with a well-defined "where": "a person in the gate zone for more than 10 seconds" is a completely different signal than "a person anywhere in the frame".

## From "motion detected" to "the courier left a package"

The event chain looks like this: Frigate detects an object in a zone and reports the event to Home Assistant. An automation decides whether the event deserves analysis - a person at the gate yes, a cat on the driveway no. If yes, the best frame of the event goes to a vision model (local or cloud - we described the trade-offs in part one), which returns a structured answer: who, where, with what, whether to notify.

The effect is felt in your phone. Instead of thirty "motion detected" notifications a day, you get three: "the courier left a package at the door", "an unknown person has been standing at the gate for 30 seconds", "the gate is open and there is no car in the driveway". At Julia's, the number of camera notifications dropped more than tenfold, and trust in them grew enough that they stopped being muted. That is the right measure of success: a notification nobody mutes.

> Monitoring is not there so the home can see everything. It is there to tell you about three things a day you actually want to know - and nothing more.

## Retention: how much the home remembers

Recordings are sensitive data, so the minimization principle from part one applies to the disk as well. Frigate separates the retention of continuous recordings and events, which allows a reasonable compromise: continuous recordings 2 days, events with objects 14 days, event snapshots 30 days.

Numbers help with the decision: one 1080p camera at a 3 Mb/s stream is about 30 GB of continuous recordings per day. Four cameras with two-day continuous retention and two-week event retention fit on a 1 TB disk with room to spare. Longer memory rarely justifies itself: if an event was important, you knew about it from a notification the same day. A "just in case" archive is mostly risk, not value.

Retention is also a question of access: who in the home can view recordings, and from which device. Our rule is simple - live view from the outdoor cameras is available to all household members on the dashboard, the event archive requires logging into the administrator account, and exporting a recording outside the home (for example for the police after an incident) is a deliberate, manual action, not a feature in an app. Monitoring that everyone has full access to from their phone turns too easily into a tool for spying on the family's daily life.

## What AI gets wrong - and how to live with it

After a year with local monitoring, we have an honest list of mistakes. Tree shadows at sunset can walk like people. Rain on the lens turns a streetlamp into "a person with an umbrella". A spider strolling across the housing at night looks in infrared like a monster worth a hundred notifications. A cat can be a dog, a dog can be a person at a low confidence threshold, and a flag in the wind is an eternal source of motion.

Three defense mechanisms, in order of effectiveness:

- **A confidence threshold and a minimum presence time** - a "person" object with confidence below 70% or present for less than a few seconds does not generate an event;
- **verification by a second pair of eyes** - a low-confidence event goes to the vision model with a closed question ("is there a human in the image - yes, no, uncertain") before anything reaches the phone;
- **physical hygiene** - a clean lens, lighting for the entrance zone, and a camera mounted so car headlights do not shine straight into the lens accomplish more than many a configuration change.

You will not zero out the mistakes. Design the system so a false alarm costs one unnecessary notification, not a siren at 3:00 AM. And keep a simple log of mistakes for the first month - after ten entries you will see that 80% of false alarms have one or two causes that can be removed with a single mask or a single threshold.

## Face recognition: why we let it go

The technical temptation is obvious: since the home recognizes a person, let it recognize which one. The notification "Julia is back" instead of "person detected" sounds like the natural next step. After testing, we deliberately backed away from it, for three reasons.

First, reliability: face recognition on an outdoor camera, at an angle, in a hat, and at dusk, is wrong often enough that automations conditioned on identity become a lottery. Second, you achieve the same effect with cheaper and more certain signals - a household member's phone on the home network and a door sensor say "Julia is back" with more certainty than any vision model. Third, a database of household members' and guests' faces is the most sensitive dataset a home can store, and maintaining it for a notification you already have from elsewhere is risk without reward.

It is a good exercise in thinking about AI at home in general: before you add another layer of intelligence, check whether a boring sensor gives you the same information more cheaply, more reliably, and without sensitive data.

## Privacy boundaries: where a camera should not be at all

The most important decision in monitoring is not technical. It is: where we do not hang a camera, no matter how cheap and easy to install it is. Our map looks like this:

| Place | Camera? | Rationale |
|---|---|---|
| Gate, front door, driveway | Yes | A real purpose: deliveries, guests, the car |
| Garden, patio | Yes, with masks | A mask over the neighbor's property and the sidewalk |
| Garage, boiler room | Yes | Technical space, low privacy cost |
| Living room, kitchen | Only deliberately | If at all, then with a physical shutter and a presence mode |
| Bedrooms, bathrooms, kids' rooms | Never | No scenario justifies the risk |

Plus three soft rules. First, household members know about every camera and have veto power - monitoring that someone in the house does not know about is surveillance, not security. Second, guests deserve to be informed, and the guest mode familiar from [earlier parts of the series](/en/blog/ai-smart-home-automations/) can simply pause indoor analysis, if you have any. Third, treat audio more strictly than video - recording conversations is a different category of intrusion, and in many situations simply turn it off.

On the network side: the cameras get a separate VLAN with no internet access, they talk exclusively to the Frigate server, and remote access to the live view goes through Home Assistant, not through the manufacturer's app. Then the promise "the footage does not leave the house" stops depending on the privacy policy of the company whose camera you bought and starts depending on your configuration.

## Summary

Local monitoring with AI closes the thread we started in part one: Frigate detects cheaply, the vision model describes wisely, Home Assistant notifies only about what matters. Good zones and masks give you more than a stronger model, short retention is safer than an eternal archive, and AI mistakes are neutralized with confidence thresholds and closed questions. Draw the privacy boundaries before buying the first camera, not after: bedrooms and kids' rooms are beyond discussion, and household members and guests should know what the home is looking at. If you already have one camera at the entrance, a weekend with Frigate and a single zone at the gate will show you how much peace of mind comes from monitoring that speaks up three times a day - and always with a point.
