---
title: "Local LLM models in 2026 - what actually runs on a Mac mini M4 16 GB"
description: "A review of the current models worth pulling onto 16 GB unified memory: gpt-oss-20b, Gemma 4 e4b, Qwen3-Coder, Phi-4. What works, what doesn't, and why."
date: 2026-05-07
tags: ["ai", "llm", "ollama", "models", "coding", "local-models"]
lang: en
readingTime: 11
author: GH
---

In the [previous post](/en/blog/mac-mini-m4-local-llm-lm-studio-ollama) I described the workstation: Mac mini M4 16 GB, LM Studio and Ollama as the runtime. Container without content. Today the content - that is, **specific models worth pulling in 2026**, where what was a top pick yesterday is dead weight on disk today.

The local model ecosystem has changed dramatically in the first quarter of 2026. Six months ago I was writing about Qwen2.5-Coder, Gemma 3 and Llama 3.2 as fresh news. Today each of these has a successor, and OpenAI - for the first time since GPT-2 - has released an open-weight model designed to fit in 16 GB of memory. If you're planning to pull something onto a freshly-set-up Mac, **don't follow tutorials from six months ago**. The list has changed.

This post is my own review after a month of testing. It's not a synthetic ranking. It's more of a "if I had to start today, here's what I'd pull and in what order".

## What changed since autumn 2025

Three big moves:

**OpenAI entered open-weight.** The model `gpt-oss-20b` (and the larger `gpt-oss-120b`), released in August 2025, is the first public OpenAI model since GPT-2. The engineers deliberately quantized MoE weights to MXFP4 (4.25 bits per parameter) so the model would fit in 16 GB of memory. This isn't something the vendor bought from competitors - it's a deliberate "run on a laptop" product.

**Qwen rolled out hybrid architecture.** `Qwen3-Coder-Next` (February 2026) and the flagship `Qwen3.6-27B` (April 2026) reset the coding benchmarks. Qwen3.6-27B hits **77.2% on SWE-bench Verified**, almost as much as Claude Opus 4.6 (80.8%). It's a dense model, so you won't run it on 16 GB, but its smaller siblings - yes.

**Gemma 4 with multimodal at the edge.** Gemma 4 e4b has 4.5 billion effective parameters (8B with embeddings), 128k context, **takes text, image and audio**, and weighs about 5 GB after q4. The successor to Gemma 3 4B - and a real daily driver for "deal with what you see" tasks.

Less critical but worth noting:

- Kimi K2.5 and K2.6 are the flagship open-source coding models in 2026, but they **require 240+ GB of memory**. For a 16 GB Mac mini - out of reach. I mention them because some online tutorials write enthusiastically about them and you can get fooled.
- DeepSeek V4 Pro (1.6T MoE) and V4 Flash (284B) - same thing. Extreme classes, not for our ceiling.
- Llama 4 Scout and Maverick (both 17B in MoE with different expert counts) work, but they're right at the 16 GB threshold. With a less-loaded machine - fine. With Slack and five Safari tabs - swap city.

## The hard 16 GB ceiling - what fits, what doesn't

Repeating the rule from the previous post, because it's foundational: after the OS and open apps, you have ~10–12 GB. In that budget you have to fit **the model + context + optionally an embedder**, if you're using RAG.

What you won't run on 16 GB (saves download time):

- Qwen3.6-27B dense (~17 GB in q4)
- Qwen3.6-35B-A3B MoE (~22 GB in q4) - even though active params are 3B, total weights have to live in memory.
- Llama 4 Maverick (17B with 128 experts in MoE - borderline)
- Anything 30B+ dense
- Kimi K2.5/K2.6, DeepSeek V4 (Flash and Pro)

What fits comfortably:

- Gemma 4 e2b and e4b
- Llama 3.2 1B / 3B
- Qwen2.5-Coder 7B
- Phi-4 14B (q4) - borderline, but works
- gpt-oss-20b (with native MXFP4)
- Embedders: nomic-embed-text, mxbai-embed-large, bge-m3

Now, in order, what for what.

## Daily driver chat - Gemma 4 e4b

My default model for "think with me" today is Gemma 4 e4b. Reasons:

- **Multimodal natively.** I drop a Playwright error screenshot in, the model sees and comments. Previously this required a separate vision model (e.g. LLaVA), which added another 4–5 GB to RAM.
- **128k context** - enough to push in several project files and ask a cross-file question.
- **Audio on input** - a novelty I haven't tested in production yet, but it sounds promising for transcribing voice notes.
- **~5 GB in q4** - leaves room for context and embeddings.
- **Speed ~50–60 t/s on M4** - feels like a normal chat.

What I dislike: it loses threads in long conversations. After 30 exchanges it starts forgetting system prompt instructions. For "answer a question, summarize, propose" tasks - flawless. For multi-step planning - I switch to something larger.

Alternative: **Llama 3.2 3B** for very lightweight router/classifier tasks (~80 t/s, 2 GB RAM). **Gemma 4 e2b** if e4b doesn't fit for other reasons.

## Coding - sweet spot for 16 GB

Here the math gets harder, because flagship coding models are huge. Realistically you have three tiers.

**Light tier - Qwen2.5-Coder 7B q4** (~5 GB)

Tested, stable, broadly supported. Fill-in-middle (FIM) - meaning the model understands "insert code between these two lines", which makes it useful for IDE autocomplete. On M4 it gives 30–40 t/s. Realistically it can:

- write a correct pytest/Playwright test from a function spec,
- propose a refactor of a single function,
- suggest endpoint implementation from an OpenAPI contract.

What it won't do: it can't handle large cross-file refactoring, hallucinates APIs of less popular libraries. For that you still need better models (Claude/GPT-4) or larger local ones.

My default for autocomplete in Continue/Codeium-style integrations.

**Mid tier - gpt-oss-20b in MXFP4**

This is the model that surprised me most. Spec:

- 20B parameters, MoE (~3.6B active)
- MXFP4 gives 4.25 bits per parameter (vs ~4.5 in classic Q4_K_M)
- Reasoning effort levels: `low` / `medium` / `high` - you can steer how deeply the model "thinks" before answering
- Function calling, web browsing, structured outputs natively
- Full access to the reasoning trace (you see the model's "thoughts", not just the answer)

On M4 16 GB it gives **15–25 t/s**, sometimes faster on `low` reasoning. Ollama supports MXFP4 natively, no extra conversion. Coding quality is meaningfully higher than Qwen2.5-Coder 7B - closer to GPT-3.5/4-Mini than to a local 7B alternative.

What I dislike: the first version of `gpt-oss-20b` has moments where it over-censors (typical for OpenAI). Workable around with a system prompt, but doesn't fully disappear. For some research tasks that may be a deal-breaker.

My new default for more complex offline coding tasks.

**Heavy tier - is there any point trying?**

Qwen3-Coder-Next (80B total, 3B active in MoE) looks phenomenal on paper: SWE-bench 58.7%, 70%+ with scaffolding. Problem: 80B total weights, even in q4, is ~40 GB. Won't fit in 16 GB of memory. You can theoretically offload to SSD, but then you drop to 1–2 t/s and it stops being a tool.

For this class of model you really need a Mac Studio with 64+ GB. If you're considering an upgrade and coding is your main use case - this is the argument.

## Reasoning and math - Phi-4 14B

Microsoft still holds the "strong reasoning in a small model" niche. Phi-4 14B q4 (~9 GB) is surprisingly good at:

- Explaining regexes,
- Translating complex SQL,
- Step-by-step mathematical derivations,
- Formal logic and simple proofs.

In daily work I use it for "explain to me what this function does step by step". It's slower (~12 t/s), but for a task that requires reasoning precision, worth it.

Alternative: **Qwen3 with `/think` mode** - when the model gets a signal to "think", you see noticeably better results on reasoning tasks. The trade-off is longer answers, more tokens generated.

## Embeddings - the foundation of RAG

Embeddings aren't LLMs. They're much smaller models (50M–500M parameters) that turn text into a numeric vector. Without them there's no sensible RAG, no semantic search over documents, no decent clustering.

Three models I recommend in 2026:

- **`nomic-embed-text`** (137M, ~270 MB) - sweet spot. Fast, 8k context, good English quality, weaker Polish.
- **`mxbai-embed-large`** (335M, ~670 MB) - higher quality, slower. For smaller corpora.
- **`bge-m3`** (560M, ~1 GB) - multilingual including Polish. My pick for PL projects.

All three are in Ollama (`ollama pull nomic-embed-text`) and all three have OpenAI-compatible endpoints, so they plug into Open WebUI, AnythingLLM, LangChain with no coding.

## Quantizations - q4 vs MXFP4 vs the rest

Quick ABC, because the naming is sometimes confusing:

- **q4_K_M** - sweet spot for most models. 4-bit weights with mixed precision for more important layers. ~50% q8 quality at 25% size.
- **q5_K_M / q6_K** - a step up, for the demanding. 7B models still fit in 16 GB at q5, so worth considering.
- **q8** - "almost fp16". Nearly no quality loss, but 2x size. Realistic only for small models (1B–3B).
- **q2_K / q3_K** - desperation. Heavy quality loss. Only when there's no other option.
- **MXFP4** - a 2026 novelty from OpenAI. 4.25 bits per parameter in "microscaling FP4". Better quality than classic 4-bit at similar size. Natively supported in Ollama for gpt-oss.

My default: **q4_K_M for everything ≥7B, q5_K_M for 3B–4B, MXFP4 for gpt-oss**. I drop lower only if there's no other option.

## My daily driver setup on 16 GB

After a month of testing, the list I keep installed:

```bash
ollama pull gemma4:e4b              # daily chat, multimodal
ollama pull gpt-oss:20b             # coding, reasoning
ollama pull qwen2.5-coder:7b        # IDE autocomplete, FIM
ollama pull phi4:14b-q4_K_M         # reasoning, regex/SQL explain
ollama pull llama3.2:3b             # router/classifier
ollama pull bge-m3                  # PL embeddings
```

Total disk size: ~30 GB. Memory - models load on demand, so never more than one large at a time. Ollama auto-unloads a model after 5 minutes of inactivity.

## A simple benchmark for your own comparison

If you want to see the difference between models on your own machine, I recommend a small, repeatable test:

1. **Prompt 1 (coding)**: "Write a Playwright test in TypeScript that logs into the app at `https://example.com/login`, types email and password from a fixture, clicks submit, asserts the redirect URL."
2. **Prompt 2 (reasoning)**: "Explain in three steps what this regex does: `^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$`."
3. **Prompt 3 (multimodal)**: for Gemma 4 e4b - drop a console error screenshot, ask "what error is this and what most often causes it".

Measure: response time, peak RAM, quality (compiles? works? hallucinates?). After two or three rounds you know which model fits which task **on your machine**, not on cherry-picked benchmark charts from Twitter.

## Conclusions 2026

Three sentences:

First, **the default on 16 GB Mac mini M4 has shifted from "Qwen2.5-Coder + Gemma 3" to "gpt-oss-20b + Gemma 4 e4b"**. If you pulled something a year ago and didn't refresh - refresh.

Second, **a local LLM is no longer a toy**. gpt-oss-20b with reasoning effort levels really helps on real tasks. Hallucinations are noticeably fewer than in the 7B class six months ago. It won't replace Claude in agentic coding, but for a large chunk of daily work it's enough.

Third - and most important - **16 GB is still a ceiling, not "always enough"**. 27B+ dense models, Kimi K2.5, DeepSeek V4 are out of reach and that won't change. If you need that class locally for work - look at 64–128 GB Mac Studio. If "good 7B–20B" is enough - Mac mini M4 16 GB makes sense.

In the [next post](/en/blog/open-webui-frontend-for-local-llm) - Open WebUI as a frontend that turns these models into a "local ChatGPT" for the whole household or team, without writing a single line of code.
