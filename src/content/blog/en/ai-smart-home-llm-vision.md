---
title: "AI in Smart Home, Part 1: A Home That Can See - LLM Vision in Practice"
description: "The first part of a mini-series about connecting AI with smart home systems. We move from simple motion detection to visual interpretation: who is at the gate, what happened on the driveway, and when a notification is actually worth sending."
date: 2026-06-08
tags: ["ai", "smart home", "home assistant", "llm vision", "computer vision"]
lang: en
readingTime: 13
author: [JS, GH]
---

For years, the smart home has behaved like a very diligent but fairly literal automation engine. A motion sensor detected movement, so a light turned on. A contact sensor reported an open window, so a notification was sent. A temperature sensor crossed a threshold, so heating, cooling, or ventilation reacted. That kind of home can respond to signals, but it does not really understand the situation.

AI changes this model. Not because every light bulb should suddenly be controlled by a chatbot. That would be flashy, but not very practical. The real value appears where traditional smart home logic loses context. Motion at the gate may mean a courier, a neighbor, a cat, a tree shadow, a passing car, or a child coming home from school. For a classic automation, all of this is often the same event: “motion detected.” For a vision-capable model, these can be very different situations.

This first article in the mini-series focuses exactly on that step: connecting AI and smart home through visual understanding. We are not going to build a house that “magically knows everything.” We are going to design a sensible interpretation layer that can look at an image from a camera, describe the situation, classify the event, and help Home Assistant make a better decision.

In the next parts, we will move to creating automations with AI and designing dashboards. Here, we start with the foundation: a home can see, but it must see responsibly.

## From sensor data to interpretation

The simplest smart home automation is event-based: something changed, so do something. This works very well for unambiguous events. If a leak sensor detects water, we do not need AI to philosophize. The notification should be immediate. If the temperature in a room falls below a threshold, a normal rule is usually enough.

The problem starts with ambiguous events. A camera detects motion, but motion alone does not tell us whether the situation deserves attention. A person detector may detect a silhouette, but it will not always tell us whether that person is carrying a package, standing at the gate, leaving the door, looking through a window, or simply walking along the sidewalk. In practice, these nuances determine whether a notification is useful or just another piece of noise on your phone.

LLM Vision, meaning the use of multimodal language models for image or video analysis, lets us ask more human questions:

- Is there a person, animal, vehicle, or package in the image?
- Is the person on the property, at the gate, or outside the property?
- Is there a parcel near the door?
- Is the gate open?
- Is the garage light on even though nobody is home?
- Is the cat actually waiting near the food bowl, or did it just pass through the frame?

The important point is that AI does not replace sensors. The best results come from combining both worlds. Sensors and traditional detectors are fast, cheap, and predictable. AI is slower and more expensive, but it handles context better. A good pattern looks like this: a classic sensor triggers a potential event, and AI helps decide what that event means.

## Where does Home Assistant fit?

Home Assistant is a natural hub for this kind of setup because it connects devices, entities, automations, notifications, dashboards, and voice assistance. The official OpenAI integration adds a conversation agent that can access Home Assistant through the Assist API and interact only with the entities we deliberately expose. The official Ollama integration can connect a local model server in a similar way, although controlling Home Assistant through a local model is marked as experimental. Home Assistant also has an AI Task layer that can be used for text generation, summaries, or structured data generation.

For visual analysis, a popular practical option is the LLM Vision integration installed through HACS. According to the project documentation, it can analyze images, videos, live camera streams, and Frigate events using multimodal large language models. It supports multiple providers, including OpenAI, Google Gemini, Anthropic, OpenRouter, Ollama, and OpenAI-compatible endpoints. It can also keep a timeline of analyzed events and update sensors based on data extracted from visual input.

In practice, the architecture looks like this:

```text
camera / Frigate / motion sensor
        ↓
event in Home Assistant
        ↓
snapshot, short clip, or stream analysis
        ↓
LLM Vision / multimodal model
        ↓
response: text or JSON
        ↓
automation: notification, event log, dashboard, helper action
```

It is important to keep AI as only one component of the chain. It should not directly make critical decisions, such as unlocking a door, disabling an alarm, or opening a gate. The model can help describe what is happening, but high-risk actions should require additional conditions, confirmation, or deterministic logic.

## Cloud or local?

The first architecture decision is whether you send visual data to a cloud model or analyze it locally. There is no single correct answer, but there are several criteria worth considering before implementation.

A cloud model usually gives better response quality, an easier start, and fewer local performance problems. It is a good solution at the beginning, especially when you want to quickly validate whether a use case makes sense. The downsides are clear: request cost, internet dependency, and privacy. Camera images from the front door, garage, or garden may contain faces, license plates, children, guests, or neighbors. Even if the provider offers reasonable safeguards, you still need to consciously decide whether that material may leave your local network.

A local model, for example through Ollama, gives you more control over data and better matches the local-first philosophy. However, it requires stronger hardware, more configuration effort, and acceptance that smaller models may make more mistakes. The official Ollama documentation for Home Assistant recommends limiting the number of entities exposed to control because smaller models may lose context more easily. The same idea applies to visual analysis: the more precise the prompt and the narrower the use case, the better the chance of stable results.

My preferred starting point is a hybrid approach. Choose one low-risk use case first, such as gate notifications or package detection. Test it with a cloud model to quickly evaluate quality. Only then decide whether it is worth moving part of the analysis locally.

## The best first use case: smarter camera notifications

The worst way to use AI in a smart home is to analyze everything all the time. The best way is to analyze small, well-defined situations. That is why a great first project is a “smart camera notification.”

Imagine a camera at the gate or front door. A traditional automation sends a notification every time motion is detected. After a few days, you start ignoring your phone because there are too many alerts. AI can help, but only if you ask the right question.

Instead of asking the model to “describe the image,” ask:

```text
Analyze the image from the front gate camera.
Answer briefly and specifically.
Determine:
1. Is a person visible?
2. Is the person on the property, at the gate, or outside the property?
3. Is a package, bag, or parcel visible?
4. Does the situation require notifying the owner?
5. What short notification title fits the situation?

Do not guess. If something is not visible, say "uncertain".
```

An even better approach is to request a structured response, for example JSON:

```json
{
  "person_visible": true,
  "package_visible": false,
  "location": "at_gate",
  "risk_level": "low",
  "notify": true,
  "title": "Someone is standing at the gate",
  "summary": "One person is visible at the gate. No package is visible."
}
```

This format is less elegant for humans, but far better for automation. Home Assistant can check `notify`, `risk_level`, or `package_visible` and only then perform an action. That is the difference between “AI as a gadget” and “AI as a system component.”

## How to start step by step

The first step is to clean up Home Assistant. AI will not fix a messy entity model. If your camera is called `camera.192_168_1_43_stream_2`, your motion sensor is `binary_sensor.motion_7`, and your helper is `input_boolean.test`, even the best prompt becomes harder to reason about. It is worth using human-readable names such as `camera.front_gate`, `binary_sensor.front_gate_motion`, `input_boolean.guest_mode`, and `person.grzegorz`.

The second step is preparing the event source. It can be a motion sensor, camera person detection, a Frigate event, or even a scheduled check. The key is to avoid unnecessary AI analysis. Something cheap should detect a potential event first; only then should the model receive a snapshot or a short clip.

The third step is configuring the AI provider. In LLM Vision, you add a provider such as OpenAI, OpenRouter, Gemini, or local Ollama. Treat the model choice as a technical parameter. The same prompt may behave differently across models. For camera notifications, a fast and good-enough model is often more valuable than the largest and most expensive one.

The fourth step is designing the prompt. The prompt should be short, specific, and tied to a concrete camera. Do not ask the model for a “beautiful description of the scene” if the automation only needs one decision: notify or not. It is also worth forbidding guessing and forcing values from a closed list, such as `none`, `person`, `vehicle`, `animal`, or `package`.

The fifth step is testing. This is where a tester mindset is extremely useful. Do not test only the happy path. Test night, rain, shadows, reflections, animals, different clothes, packages in different locations, guests, cars, and people outside the property. AI can sound very convincing even when it is wrong, so tests must be practical.

The sixth step is limiting the impact of mistakes. At the beginning, AI should only send notifications or log events. If the model mistakes a plastic bag for a parcel, you only get a useless notification. Do not start with automations where the model unlocks a gate, opens a door, or disables an alarm.

## A conceptual automation example

The example below is not a universal copy-paste YAML because service names and fields may depend on the integration version and provider. It shows the pattern.

```yaml
alias: AI - analyze front gate event
description: >
  When the front gate camera or sensor detects motion, analyze an image
  and notify only if the situation matters.
trigger:
  - platform: state
    entity_id: binary_sensor.front_gate_motion
    to: "on"

condition:
  - condition: state
    entity_id: input_boolean.ai_camera_notifications
    state: "on"

action:
  - service: llmvision.image_analyzer
    data:
      provider: "YOUR_LLM_VISION_PROVIDER"
      image_entity: camera.front_gate
      response_format: json
      message: >
        Analyze the image from the front gate camera.
        Return JSON only.
        Decide whether the owner should be notified.
        Do not guess. If uncertain, set confidence below 60.
        Fields: notify, title, summary, object_type, confidence.

  - choose:
      - conditions:
          - condition: template
            value_template: "{{ ai_result.notify == true and ai_result.confidence >= 70 }}"
        sequence:
          - service: notify.mobile_app_phone
            data:
              title: "{{ ai_result.title }}"
              message: "{{ ai_result.summary }}"
mode: single
```

In a real implementation, you must adapt how the service result is captured to the specific integration version. The principle matters more than the syntax: AI produces structure, and the automation makes decisions based on explicit fields.

## The prompt is part of the system

In a classic smart home, we configure entities, triggers, and conditions. In an AI-enabled smart home, the prompt becomes an additional system artifact. Treat it like code: version it, test it, shorten it, simplify it, and document it.

Weak prompt:

```text
What is happening here?
```

Better prompt:

```text
You are an image analysis module for a smart home.
You analyze the front gate camera.
Answer only for automation purposes.
Do not describe the background unless it affects the decision.
Return JSON matching the schema.
If uncertain, lower the confidence score.
```

A good prompt limits the interpretation space. The model should not write a story, judge a person’s intentions, or create dramatic descriptions. It should answer questions that are useful for the home.

Closed lists also help. Instead of asking “what do you see?”, ask the model to choose one category: `person`, `vehicle`, `animal`, `package`, `no_relevant_activity`. Instead of asking “is this suspicious?”, ask about observable features: “is the person on the property?”, “are they holding a tool?”, “are they trying to open the door?”, “does the camera show only someone walking along the sidewalk?” This reduces false alarms.

## Privacy and safety

AI vision at home sounds attractive, but it touches a sensitive area: images from private spaces. It is worth adopting a few rules from the beginning.

First, do not analyze the inside of the home unless there is a real need. A camera in the living room, child’s room, or bedroom is a completely different level of risk than a camera at the gate. If the use case can be solved with a motion sensor, contact sensor, or presence sensor, visual analysis may be unnecessary.

Second, minimize data. If a single snapshot is enough, do not send video. If a cropped area is enough, do not send the entire frame. If a local model is enough, do not send data to the cloud. If you need the cloud, choose only scenarios where that data flow is acceptable.

Third, separate interpretation from control. The model may say: “a courier probably left a package.” That does not mean the system should automatically unlock the gate. Good safety rules should be boring, predictable, and resilient to model mistakes.

Fourth, consider household members and guests. A smart home should help, not create the feeling of constant surveillance. It is worth having guest mode, privacy mode, clear retention rules for images, and a simple way to disable analysis.

## How do we know whether it works?

AI in smart home is easy to judge by the wow effect, but it is better to use simple quality metrics. If the system is supposed to help, measure whether it actually helps.

The first metric is notification count. If AI reduces useless alerts, that is a good sign. The second metric is false negatives: cases where the system should have notified but did not. The third metric is latency. A notification about a person at the gate after two minutes is far less useful than one after a few seconds. The fourth metric is cost. Analyzing every motion event with a large model can become unnecessarily expensive.

In practice, a good result is not “AI is never wrong.” A good result is a system that is noticeably more useful than simple motion detection while making mistakes that do not have serious consequences.

## What can you build next?

After the first use case, expand in small steps. Examples:

- notify only if a person remains at the gate for more than 10 seconds;
- detect a package and remind you if it is still near the door after an hour;
- distinguish cats, dogs, cars, and people in the garden;
- generate a daily summary of camera events;
- build a dashboard showing what happened around the house today;
- automatically tag events as package, person, vehicle, animal, or no relevant activity.

All of these scenarios lead naturally to the next part of the series. Once the home can describe the world better, we can design better automations. The goal is not to let AI do everything by itself. The goal is to move from simple rules to context-aware rules.

## Summary

LLM Vision is one of the most practical ways to connect AI and smart home because it solves a real problem: traditional sensors detect events, but they do not always understand situations. A camera with AI can help distinguish a courier from a cat, a package from a shadow, and a relevant event from background noise.

The main rules are simple. Start with small, low-risk scenarios. Do not analyze everything. Do not give the model full control. Design prompts as part of the system. Force structured responses. Test with real cases. Protect privacy.

A well-designed AI smart home is not a home that accidentally became a chatbot. It is a home that still works predictably, but has gained a new layer of interpretation.

In the second part of the mini-series, we will move to automations: how to use AI to design, generate, review, and document rules in Home Assistant.

## Sources and further reading

- [Home Assistant - OpenAI integration](https://www.home-assistant.io/integrations/openai_conversation/)
- [Home Assistant - Ollama integration](https://www.home-assistant.io/integrations/ollama/)
- [Home Assistant - AI Task integration](https://www.home-assistant.io/integrations/ai_task/)
- [Home Assistant Developer Docs - API for Large Language Models](https://developers.home-assistant.io/docs/core/llm/)
- [Home Assistant - Exposing entities to Assist](https://www.home-assistant.io/voice_control/voice_remote_expose_devices/)
- [LLM Vision for Home Assistant - GitHub repository](https://github.com/valentinfrlch/ha-llmvision)
