---
title: "Open WebUI - a ChatGPT-like frontend for your local LLM"
description: "Local Ollama only gives you a CLI. LM Studio is single-user. Open WebUI is the missing piece: a ChatGPT-like UI with RAG, web search and tools - running in one Docker command."
date: 2026-05-08
tags: ["ai", "llm", "ollama", "open-webui", "rag", "local-models"]
lang: en
readingTime: 10
author: GH
---

Third post in the series on local LLM on a Mac mini M4 16 GB. In the [first one](/en/blog/mac-mini-m4-local-llm-lm-studio-ollama) I set up the workstation. In the [second](/en/blog/llm-models-2026-mac-mini-m4) I pulled the right models. Today I'm tying it all together with a frontend that turns raw CLI into a tool someone other than me can use without a tutorial.

The problem is mundane. After installing Ollama I have a daemon humming on `localhost:11434`. I can talk to it from the terminal. But if I want to show my wife that this Mac mini blinking on the desk is actually useful for something - showing her `ollama run gemma4:e4b` is a hard sell. LM Studio from the previous posts has a GUI, but it's single-user and there's no sensible history sync between devices. Something between CLI and a desktop app is missing.

That something is **Open WebUI**.

## Open WebUI in one sentence

It's an open-source frontend written in Svelte that you wire up to any OpenAI-compatible endpoint. Looks and feels exactly like ChatGPT - a sidebar with conversation history, a model picker, chat with markdown and syntax highlighting, side-by-side comparison of answers from different models, a prompt library. Except the whole thing lives on your hardware and talks to your models.

The project is actively developed, has tens of thousands of GitHub stars, and - importantly - its commercial licensing is clear (BSD-3 for the base, plus a model designed for self-hosting in companies). For a home setup, zero cost.

## Setup in one Docker command

Online tutorials sometimes overcomplicate. The simplest version that works on Mac mini M4 with Docker Desktop installed:

```bash
docker run -d \
  -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

After it starts, you go to `http://localhost:3000`. The first account you create is admin. Open WebUI auto-detects Ollama on `localhost:11434` (via `host.docker.internal`) and the model list appears in the UI.

If you prefer native, no Docker:

```bash
pip install open-webui
open-webui serve
```

Works, but Docker gives cleaner isolation, persistent volume, automatic restart after Mac reboot. I recommend Docker.

First conversation: pick a model from the list, type a question, get an answer. Exactly like ChatGPT, except Gemma 4 e4b or gpt-oss-20b is running underneath.

## What you get out of the box

A list of features that work right after installation, with no configuration:

**Chat history.** Everything saved locally in the Docker volume. You can tag, archive, organize into folders, search by title. Open WebUI auto-generates conversation titles after the first exchange.

**Multi-model in one chat.** You pick two models at once, ask the same question, see two answers side-by-side. This is a feature sorely missing from ChatGPT and Claude - comparing models is especially valuable when you're testing which local model handles a specific task type best.

**Markdown, code highlighting, mermaid.** Diagrams, tables, code blocks - everything rendered like in modern documentation. Code blocks copy with one click.

**Prompt library.** Save a good prompt with a parameter (`{{text}}`, `{{code}}`), invoke it later by name. Great for repeatable workflows like "turn this ticket into a full test plan".

**Multi-user.** Accounts, admin/user roles, share models and prompts between users. Realistically suitable for a QA team on one host - several people working, each with their own history.

## RAG without coding

This is the moment Open WebUI stops being "a nice frontend" and starts being a tool.

In the "Knowledge" panel you create a collection. You drop in PDFs, MDs, docx, txt. Open WebUI in the background:

1. Chunks the files (configurable - default ~1000 tokens per chunk with overlap).
2. Generates embeddings via the chosen model (best `bge-m3` or `nomic-embed-text` running through Ollama - that stays local).
3. Saves vectors in a local DB (ChromaDB underneath).

Now in the chat you pick a model + attach the collection. The model sees citations from documents and answers with references. **Zero coding.** Setup of an entire simple RAG over your own project's documentation - 10 minutes.

Practical use cases I actually have running:

- **Knowledge bases of client projects.** I drop in technical documentation, attach to a model, ask about specific components.
- **Conference and training notes.** PDFs from conferences, slides, my own notes. "Who at the last conference talked about test pyramid?" - the model finds and cites.
- **Personal knowledge management.** Markdown files from my Obsidian pulled into a collection. Question in English, answer with references to specific notes.

A small pitfall: first-time chunking of a large collection (a few hundred PDFs) on M4 16 GB can take an hour and chew through RAM, since the embedder runs in parallel with chat. I recommend embedding offline, with no active chat in another tab.

## Web search as a tool

A local model doesn't know current events. Open WebUI adds **search engine integration**: DuckDuckGo, SearXNG (self-hosted), Brave, Google CSE, Tavily. You enable it in the admin panel, pick the engine, optionally add an API key (DuckDuckGo doesn't need one).

During a chat you flip the "Web Search" toggle and on each question the model can hit the search engine, pick a few results, fetch page content, and inject it into context. Citations appear as links in the answer.

This solves the fundamental problem of local LLMs: lack of awareness of the current state of the world. It also gives access to library documentation the model doesn't have in training data - though here a dedicated MCP like [Context7](/en/blog/context7-mcp-up-to-date-docs-llm) is often more convenient.

## Tools - function calling through the UI

The strongest, but most underrated, Open WebUI feature. In the admin panel you can define a **Python tool** that the model can call. Looks like this:

```python
class Tools:
    def get_jenkins_build_status(self, job_name: str) -> dict:
        """
        Returns the status of the latest Jenkins build for given job.
        :param job_name: Name of the Jenkins job
        :return: dict with status, duration, build number
        """
        import requests
        r = requests.get(f"http://jenkins.local/job/{job_name}/lastBuild/api/json")
        return r.json()
```

Paste it into the UI. The model gets the tool description in its system prompt and knows when to call it. Question "what's the status of the latest `nightly-tests` build" → the model calls Python, gets JSON back, formulates an answer.

For a QA tester this means the ability to **build your own diagnostic agent** in 30 minutes. Tools I've actually written:

- `get_test_run_status(run_id)` - fetches the result from our TestRail.
- `read_log_lines(file_path, n=100)` - reads the last N lines of a log on the local machine.
- `query_grafana(panel, time_range)` - queries a metric from a dashboard.
- `create_jira_ticket(project, summary, description)` - opens a bug in Jira.

It's not complex. Each tool is ~30 lines of Python. But added together they give a local chat where I can ask "why was nightly-tests yellow yesterday at 22:00?" - and the model gathers the data on its own.

## Open WebUI vs the alternatives

Quick ABC of alternatives, in case you're considering other options:

**[AnythingLLM](https://anythingllm.com/)** - more "enterprise-y", has built-in workspaces, multi-tenant, built-in agent builder. Heavier install, more configuration. I'd pick this for a team of 10+.

**[LibreChat](https://www.librechat.ai/)** - multi-provider (OpenAI, Anthropic, Google, Azure, local), great for people who want one UI for cloud and local. Open WebUI is narrower in this - it focuses on local/Ollama.

**[LobeChat](https://lobechat.com/)** - prettiest interface, plugin ecosystem, but fewer RAG and tool-calling features. More "chat with AI" than "local AI platform".

**Open WebUI** - works fastest on a local Ollama stack. Documentation is straightforward, community is large, plugins land quickly. My default.

## Pitfalls and gotchas

A few things that bit me.

**SSL.** The default Docker setup has no HTTPS. If you expose `:3000` externally (e.g. to log in from a phone at home over Tailscale or publicly) - you **must** add a reverse proxy (Caddy, Traefik, nginx) with a certificate. **Never expose port 3000 publicly raw.** The first bot will scan, find the login panel, try brute-force.

**Embedder + LLM in parallel.** On 16 GB of RAM, if you run chat with gpt-oss-20b (~10 GB) and simultaneously embed a large RAG collection (`bge-m3`, ~1 GB), the system starts swapping. Embed offline.

**Version migrations.** Open WebUI has frequent releases. Usually backward-compatible, but occasionally the Docker volume needs a script-driven migration. Always check release notes before `docker pull`.

**Per-model contexts.** Each model has its own default context, which isn't always the largest it supports. For Gemma 4 e4b (128k), Open WebUI defaults to 4k. You have to go into model settings and bump it - otherwise you lose most of the model's capability in long conversations.

**Auth.** By default Open WebUI has its own login system. You can wire up OAuth (Google, GitHub) or LDAP. For a home setup - single user is enough. For a team - OAuth massively simplifies onboarding.

## Practical integration with the rest of the stack

How it looks for me, in short:

```
┌─────────────────┐
│  Open WebUI     │ ← UI for me and household
│  :3000          │
└────────┬────────┘
         │ OpenAI-compatible REST
         ↓
┌─────────────────┐
│  Ollama         │ ← model runtime
│  :11434         │
└────────┬────────┘
         │
   ┌─────┴──────┬───────────┐
   ↓            ↓           ↓
gpt-oss-20b  Gemma 4 e4b  bge-m3
```

Open WebUI talks to Ollama. Ollama holds models and embedders. Everything local, on Mac mini M4 16 GB, in Docker or directly.

On the other side, other apps connect to the same Ollama endpoint - Claude Code skills (on the bigger Mac), Continue in VS Code, custom Python scripts. Each has its own use case, but all share the same models loaded once into memory.

## Conclusions - why it's worth it

Three sentences:

First, **Open WebUI turns Ollama from a developer tool into a tool for the home or team**. Without it, a local LLM is a personal hobby; with it, it's a real alternative to ChatGPT for many daily tasks.

Second, **RAG and tools without coding is a game changer**. The ability to drop in your own documentation and ask about it in English, without writing a line of Python, is what convinces non-technical people on a team that this actually works.

Third - and most important - **the local stack stops being an academic exercise**. Mac mini M4 16 GB + Ollama + Open WebUI + well-chosen models is a functioning personal AI assistant that sends nothing to the cloud and generates no per-token bill. It won't replace Claude in professional work, but for a large chunk of daily use it's **enough** - and that word makes all the difference here.

If you're starting with a local LLM - my recommended path:

1. Pull Ollama.
2. `ollama pull gemma4:e4b`.
3. Stand up Open WebUI in one Docker command.
4. After a week of use, add gpt-oss-20b and your first RAG collection.
5. After a month, once you've got the flow, add your first custom tool.

That's a small time investment (a few hours total) for a tool that stays for months. And - crucially - **it doesn't need ongoing maintenance**. Set up and runs.
