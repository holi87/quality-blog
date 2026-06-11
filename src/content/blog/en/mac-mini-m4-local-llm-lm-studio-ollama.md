---
title: "Mac mini M4 16 GB as a local LLM workstation - LM Studio vs Ollama"
description: "Does the cheapest M4 Mac make sense as a machine for local language models? Hardware reality check, LM Studio vs Ollama comparison, and where the sanity line is."
date: 2026-05-06
tags: ["ai", "llm", "ollama", "lm-studio", "mac", "local-models"]
lang: en
readingTime: 10
author: GH
---

Late in March I closed the internal debate and bought a Mac mini M4 with 16 GB of memory. It sits next to my main Mac, which handles regular dev work - this one has a single purpose: local LLMs. Experiments, private data, saving on the API bill, finding out where a cheap, off-the-shelf config breaks. After a month I have my own conclusions - and a few things I didn't expect before buying.

This isn't a hardware review. It's an engineer's note about **what you can sensibly do with 16 GB of unified memory on M4**, what won't run despite the marketing buzz, and when to pick LM Studio over Ollama. If you're considering the same path, or already have a Mac and want to know whether investing time in a local stack is worth it - read on.

## Why local at all

The first question I get from friends: "you have a Claude subscription and an API key, why bother?". The answer has four parts.

**Privacy.** Client code, incident logs, fragments of internal documents - none of that should hit any cloud provider. A local model running on your own machine sends nothing outside. This isn't paranoia, it's compliance with the security policy of most companies I work for.

**No per-token cost.** You pay once, for electricity. For people generating hundreds of prompts a day (testing skills, agents, RAG over documentation), that's a real difference.

**Offline.** It doesn't take much to understand the value of a local model - just take one train ride with patchy Wi-Fi while needing help with a regex.

**Control.** You can change system prompts, context, quantization, sampling parameters. You can fine-tune on your own data. You can disable refusals. Frontier models won't give you that - and it's right that they don't, but for research it matters.

A local stack isn't *instead of* Claude or GPT-4. It's *alongside*, for tasks where a frontier model is overkill and overpriced.

## Hardware reality check - what 16 GB unified memory on M4 actually delivers

Apple Silicon has one feature that changes the math vs PCs: **unified memory**. CPU and GPU share the same RAM pool. There's no separate VRAM, no PCIe tensor copying. That's a big plus for LLMs, because model weights load once and serve directly via Metal/MLX.

The downside is mundane but brutal: what you have is what you've got. 16 GB is the **total** for OS, apps and the model. After macOS, Safari, Slack and an editor you realistically have ~10-12 GB for the model. Anything that exceeds that budget will either swap to SSD and crawl, or fail to start.

Practical memory map for 16 GB:

- **3B - 4B models in q4** (~2-3 GB) - fits comfortably, you have headroom for context, an embedder and a reasonable list of open apps.
- **7B - 8B models in q4** (~5-6 GB) - sweet spot. Works, leaves room for 32k - 128k context, M4 hits 30-50 tokens per second.
- **13B - 14B models in q4** (~9-10 GB) - borderline. Works if you close other heavy processes. ~12-18 t/s. Comfort drops, but it's not awful.
- **20B models in MXFP4** (e.g. gpt-oss-20b) - this is a 2026 development; MXFP4 quantization gives 4.25 bits per parameter. OpenAI designed this model to run on 16 GB of memory. It works, though it's near the ceiling.
- **27B+ dense models** - forget it. Q4 weighs 16+ GB, Q3 ugly-degrades quality.
- **30B+ total MoE models** - depends on details. Qwen3-Coder-Next (80B total / 3B active) sounds promising on paper, but full weights have to live in memory or offload to SSD, so realistically - no. Mac Studio with 64+ GB is a different story.

What about speed? For orientation, on M4 with the 10-core GPU variant:

- 3B q4 → ~80-100 t/s (instant feel)
- 7B q4 → ~30-50 t/s (real-time chat)
- 13B q4 → ~12-18 t/s (readable, but you feel it)
- 20B MXFP4 → ~15-25 t/s (surprisingly good)

Conclusions? 16 GB is a **starter pack**, not a workshop. It satisfies daily chat, RAG over documents, light embeddings, an autocomplete-grade code assistant. For agentic workflows where the same prompt loops 50 times, or for batch processing of large datasets - it'll hurt. That's when you look at a Mac Studio with 64-128 GB or a cloud GPU.

## LM Studio - GUI-first, sweet spot for non-technical users

[LM Studio](https://lmstudio.ai/) is a desktop app that looks like something between iTunes and Visual Studio Code. After download you have, in one place: a model browser (from Hugging Face), download with a progress bar, model chat, parameter settings, context sliders, and - most important for a developer - an **OpenAI-compatible server** launched with one click on `localhost:1234`.

What I particularly value on M4:

- **Native MLX support.** MLX is Apple's format, simply faster than classic GGUF on Apple Silicon. Newer models often appear in MLX before other formats, and LM Studio loads them with no configuration.
- **Sliders, not config files.** Context, temperature, top-p, penalty - all in the UI. Zero `Modelfile`, zero YAML parsing.
- **Multi-model serving.** You can have several models queued, switch between them at runtime, share the same endpoint across different apps.
- **Chat with files.** Drag & drop a PDF onto the window and ask - LM Studio does an in-memory RAG. Enough for "summarize this paper".

What's missing: a real CLI. You can launch models from the command line (`lms`), but it's an add-on, not the main mode. If you want models in scripts, in CI, in cron - Ollama will be more comfortable.

LM Studio is my pick when someone asks "how do I start". I download, click one model (e.g. Gemma 4 e4b), turn on the server, paste the URL into something like Open WebUI - works in 10 minutes. Sunday tinkering, a workshop demo, exploring new models - those are my use cases.

## Ollama - CLI-first, ideal for automation

[Ollama](https://ollama.com/) has the opposite DNA. It's a Go-based CLI tool that runs a daemon on `localhost:11434` and gives you a REST API. UIs are community add-ons; the project itself targets scriptability.

```bash
ollama pull qwen2.5-coder:7b
ollama run qwen2.5-coder:7b
```

That's it. Two commands to your first conversation. To change behavior, you write a `Modelfile`:

```
FROM qwen2.5-coder:7b
SYSTEM "You are a senior QA engineer. Reply concisely, no preambles."
PARAMETER temperature 0.3
PARAMETER num_ctx 32768
```

```bash
ollama create qa-coder -f ./Modelfile
ollama run qa-coder
```

Custom model ready. Same can happen in a deployment script, in a devcontainer, in Docker, in a GitHub Action.

The REST API is minimal, but in 2026 the ecosystem has grown an **OpenAI-compatible layer** (`/v1/chat/completions`), so any library written against the OpenAI SDK works after swapping `base_url`. That matters - most apps like Cursor, Continue, Open WebUI have a single field "OpenAI base URL", and there you put `http://localhost:11434/v1`. End of config.

The official Ollama README lists models "supported first": gpt-oss, Qwen3, Gemma 4, DeepSeek, Kimi-K2.5, GLM-5, MiniMax. That's a healthy ecosystem signal - the project doesn't lag behind releases.

Ollama is my pick for actual work. Claude Code skills call the local endpoint. A cron job rebuilds embeddings nightly. CI in a sandbox spins up Ollama and runs prompt tests against my own models. All of this can be done in LM Studio, but uncomfortably. Here, it's native.

## When to use which

After a month of running both in parallel, a simple heuristic:

- **Exploring a new model, demo, workshop** → LM Studio. Sliders, UI, one click.
- **Dev workflow, app integration, CI, skills** → Ollama. CLI, API, scriptability.
- **Apple Silicon with MLX needs** → LM Studio. Ollama is still adding native MLX.
- **Multi-platform stack (Mac + Linux server)** → Ollama. LM Studio is desktop-heavy.
- **Don't know what to pick** → start with LM Studio for a week, then add Ollama for the automation pieces.

These two tools don't exclude each other. They can run side by side on different ports (1234 and 11434). One API for the desktop app, one for scripts - no memory conflict, since models load on demand.

## Sanity line

This bit is awkward but needs saying: **a local LLM in the 7B - 14B class is not Claude or GPT-4**. It's closer to Claude 3 Haiku or GPT-3.5 from two years ago - with a real quality threshold you won't jump over with quantization or a better prompt. For many tasks it's enough. For many - it isn't.

What 7B q4 on M4 in 2026 actually does:

- Text summarization, classification, data extraction - very well.
- Q&A over your own documentation (RAG) - very well, if embeddings are sensible.
- Code completion in the IDE - well, at the level of a sensible autocomplete.
- Writing Playwright/pytest tests from a function spec - decent, but needs review.
- Complex refactors, architecture planning, cross-file debugging - weakly.
- Mathematical reasoning, multi-step logic - Phi-4 14B makes a difference, but it's far from frontier.
- Generating production code "on first try" - no. Hallucinates APIs, mixes versions, invents libraries.

After a month of work my rule is: **local model for tasks where the cost of an error is low or instantly visible**. Suggesting a value for a form field? OK. Writing a pytest stub? OK, I'll review it. Classifying a ticket priority? OK. Writing production code in a back-and-forth with an agent? No, that's where I switch back to Claude.

## What's next

The next post shows specific models worth pulling and what I compared them against. The third in the series - Open WebUI as a frontend that turns this local stack into something the whole household can use without reading documentation.

For context - this local setup lands [on the Holak Scale](/en/blog/holak-scale) somewhere around layers six and seven: it integrates tools (LM Studio/Ollama as model providers), builds custom context (RAG, system prompts), but isn't a full agent yet. It's the middle level of maturity, where you stop treating an LLM as a black box and start consciously picking **which model for which task**.

Final thought: a 16 GB Mac mini M4 is a machine that **won't replace** your main workstation, but **complements** it sensibly. For the price of a mid-range laptop you get a local AI station that runs quietly, sips power, and lets you experiment without watching the token meter. Worth it? If you generate a lot of LLM calls a day or work with private data - yes. If you use LLMs occasionally - sticking with the subscription is cheaper.
