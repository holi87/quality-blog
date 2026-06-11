---
title: "AI in Smart Home, Part 5: A Home That Talks - A Voice Assistant with a Local LLM"
description: "The fifth part of the AI in smart home mini-series. We build a voice assistant on Home Assistant Assist with a local language model: the chain from wake word to speech synthesis, hardware choices, and an honest comparison with commercial assistants."
date: 2026-07-06
tags: ["ai", "smart home", "home assistant", "voice assistant", "llm"]
lang: en
readingTime: 10
author: [JS, GH]
---

A voice assistant does not have to send your voice to a big corporation's cloud. The entire chain - from the microphone, through speech recognition, to the answer - can run in your utility closet. In this part of the series, we show how to build an assistant on Home Assistant Assist with a local language model, what works surprisingly well, and where a local LLM still loses to commercial assistants.

## Why local at all?

Commercial smart speakers are convenient, but they have two traits that are hard to ignore in a bedroom or a kitchen. First, an always-listening microphone is a device you have to trust. Second, the assistant stops working the moment the internet goes down - or the moment the manufacturer decides to sunset the service.

A local assistant flips that arrangement. The audio never leaves the house, the command history stays with you, and "turn off the kitchen light" works even when the fiber line is dead. The price of that comfort is your own hardware, your own configuration, and a few compromises we will describe honestly below.

> The command "turn off the kitchen light" does not need a data center on the other side of the ocean. It needs a microphone, a few seconds of work from a local processor, and a bit of trust in your own hardware.

## The voice chain in Home Assistant

Home Assistant has a built-in Assist layer that ties the entire voice processing pipeline together. It is worth understanding it as five links, because each one can be swapped out independently:

1. **Wake word** - the device listens for a phrase like "Hey Nabu". In practice this is handled by openWakeWord on the server or by microWakeWord directly on an ESP32-S3 chip.
2. **Speech to text** - the recorded fragment goes to a Whisper model (the faster-whisper variant), which returns the command as text.
3. **Intent recognition** - Home Assistant tries to match the text against built-in commands: turn on, turn off, set the temperature, run a scene.
4. **LLM as the extended path** - if the built-in intents do not match, the question is taken over by a language model, for example a local model via Ollama.
5. **Spoken response** - the answer text is read by Piper, a lightweight local speech synthesizer with a choice of voices.

Communication between the links runs over the Wyoming protocol, so Whisper and Piper can run on a different machine than Home Assistant itself. That matters, because a home server on weak hardware does not have to carry everything alone.

## What the home listens with: voice satellites

A laptop microphone is not enough - the assistant needs ears in the rooms. Two approaches worked well for Julia. The first is the Home Assistant Voice Preview Edition, the official device with two microphones and hardware audio processing, which for around 60 euros gives the best quality-to-effort ratio. The second is ESPHome flashed yourself onto cheap ESP32-S3 boards, from the little M5Stack ATOM Echo ball costing pocket change to kits with a screen.

The difference is audible, literally. A cheap satellite with a single microphone catches commands from a meter away, in silence. The Voice Preview Edition understands commands from the other end of the kitchen, with the range hood running. If you are planning one listening point per room, do not skimp on microphones - they are the most common source of frustration, not the language model.

## Speech to text: Whisper in your language

Whisper is today's standard for local speech recognition and handles Polish well, but model size matters. The tiny variant can turn "turn off the living room light" into something barely recognizable, the small variant is already decent, and medium understands even sloppy pronunciation with a radio playing in the background.

Cost grows together with quality. On a Raspberry Pi 4, only tiny or base make sense, with a processing time of 1-2 seconds for a short command. A mini PC in the N100 class handles small in about a second. The medium model without a graphics card becomes noticeably slow. Our recommendation for Polish: small as the minimum, medium if the hardware allows it.

## The brain: intents first, then the LLM

The most important architectural decision of the whole project is this: do not make the language model handle everything. Home Assistant lets you set a mode in which built-in intent recognition takes priority and the LLM only receives what cannot be matched. The command "turn on the bedroom lamp" then executes in a fraction of a second, deterministically, without a single token.

The LLM comes into play with open questions: "is there a window open anywhere in the house?", "what is the temperature in the kid's room and is that normal?", "remind me tonight to water the plants". The model only sees the entities we have deliberately exposed to the assistant - which is both a safeguard and a way to reduce context usage. The principle from [earlier parts of this series](/en/blog/ai-smart-home-automations/) applies here too: the model interprets and answers, but high-risk actions, like locks or the alarm, stay out of its reach.

On the model side (Grzegorz speaking here): locally via Ollama, models in the 7-8 billion parameter class in quantized versions work well. Smaller models, 3-4 billion, can be surprisingly capable at simple questions about the state of the house, but in Polish they more often mangle inflection and lose the conversation context after two or three exchanges.

## The assistant is only as good as your entity names

This is a lesson that returns in every part of this series, but with voice it hurts the most. The entity `light.salon_sufit` with the alias "living room light" will work on the first try. The entity `switch.sonoff_0a3f` will never work, because nobody speaks like that. Before connecting the assistant, go through the list of exposed entities and give each one a name you actually say out loud - in your language, short, with no technical jargon.

The second quality multiplier is areas. A satellite assigned to the kitchen knows that "turn off the light" means the kitchen light - without naming the room. It is a small detail in configuration, and in practice the difference between an assistant you talk to and one you recite formulas at. It is also worth adding aliases for household members: if the kid says "lamp" and you say "night lamp", both variants should be recorded.

Finally, a tester's approach, which this series could not do without: write down 20 commands you actually use and test them under three conditions - silence, TV in the background, speaking from the other end of the room. A results table will show you whether the problem is the microphone, speech recognition, or intent matching. Each of the three is fixed differently, and guessing is not worth it.

## The voice of the answer: Piper

The last link is the least problematic. Piper generates speech faster than real time even on a Raspberry Pi and offers several voices to choose from. The sound is clearly synthetic but fully intelligible - for answers like "I turned on the light, the living room temperature is 22 degrees" it is entirely sufficient. If you care about the naturalness known from commercial assistants, this is the only place in the chain where the class difference is audible from the first sentence.

## What works and what falls behind

After a few months of using a local assistant, the picture is fairly clear. The comparison below puts it against the typical experience with a commercial assistant.

| Area | Local chain | Commercial assistant |
|---|---|---|
| Entity commands (lights, scenes) | Very good, 1-2 s | Very good, about 1 s |
| Open questions about the house | Good, 3-6 s with an LLM on a GPU | Poor - it does not know your entities that well |
| General knowledge, conversation | Average, depending on the model | Very good |
| Language quality of answers | Correct, sometimes wooden | Natural |
| Working without internet | Full | None |
| Audio privacy | Audio never leaves the house | Depends on the provider's terms |

The biggest advantage of the local solution is not obvious: the assistant knows your home. A commercial speaker knows everything about the world and almost nothing about your sensors. A local LLM with access to entities will answer "has the washing machine finished yet?", because it sees the washing machine's energy sensor. A general-purpose cloud assistant will not give you that comfort without extra integrations.

The biggest weakness is also concrete: multi-turn conversation. "Turn on the living room light. Now dim it to half" - that second sentence requires context memory, which smaller models handle unevenly. After two or three exchanges, a local assistant can lose the thread, while a commercial one keeps the conversation going. In practice this bothers you less than demos suggest - 90% of interactions with a home assistant are single commands and single questions, not dialogues.

## Hardware realistically, without marketing

Requirements depend on where you draw the line of ambition. Three realistic tiers:

- **Raspberry Pi 4/5** - Whisper tiny/base, Piper, built-in intents. It works, entity commands run smoothly, but no LLM. A good start for little money.
- **Mini PC in the N100 class, 16 GB RAM** - Whisper small in about a second, a small LLM with 3-4 billion parameters on the CPU with a response time of 8-15 seconds. Great for commands, patience required for conversation.
- **A computer with a graphics card with 8-12 GB VRAM** - Whisper medium plus a 7-8 billion parameter model, first response in 2-4 seconds. This is the level at which a local assistant stops being a curiosity and starts being a tool.

Plus satellites: one listening point per room where you actually give commands. Three were enough for us: kitchen, living room, bedroom.

## Summary

A local voice assistant in 2026 is no longer a project for enthusiasts with a soldering iron - the Assist, Whisper, LLM, Piper chain comes together in a weekend. Device commands work almost as well as with the commercial competition, and questions about the state of your own home work better, because the assistant knows your entities. The weak points are latency on open questions without a GPU, the wooden language of smaller models, and the synthetic voice. If you already have Home Assistant, start with one satellite and built-in intents without an LLM - it is an hour of work, and you will immediately feel whether this direction is for you.
