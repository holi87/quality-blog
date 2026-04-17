---
title: "AI Adoption Maturity Model"
description: "From resistance to orchestration — 11 levels of AI utilisation in an organisation. Find out where you and your team stand."
date: 2026-04-15
tags: ["ai", "adoption", "teams"]
lang: en
readingTime: 7
---

From resistance to orchestration — 11 levels of AI utilisation in an organisation. Find out where you and your team stand.

## Level map

| Phase | Level | Name | In one sentence |
|-------|-------|------|-----------------|
| Start | 0 | Resistance | No contact with AI |
| Start | 1 | Basic chat | Question → answer |
| Intentional use | 2 | Intentional prompting | Input quality = output quality |
| Intentional use | 3 | Frameworks | CRISP, CoT, few-shot |
| Intentional use | 4 | Custom instructions | System prompts, per-project settings |
| Context & knowledge | 5 | Context files | README, AGENTS.md, claude.md |
| Context & knowledge | 6 | Advanced instructions | Behaviour rules & boundaries |
| Context & knowledge | 7 | Skills & knowledge bases | Domain knowledge + capabilities |
| Context & knowledge | 8 | Tools & MCP | System integration |
| Autonomy | 9 | Agentic workflow | Goal → autonomous execution |
| Autonomy | 10 | Orchestration | Agent team + coordinator |

## Phase 0–1: Getting started

### Level 0 — Resistance / no adoption

**No contact with AI tools.**

The user does not engage with AI — whether due to lack of awareness, fear, or a conscious decision. Often accompanied by concerns about job security or distrust of the technology. This is a natural starting point — the key is education and building trust, not forcing adoption.

### Level 1 — Basic chat

**Question → answer.**

First interaction with AI in a simple Q&A format. The user treats the model like a search engine — types a question, gets an answer. The value is already real, but the potential is barely tapped.

> Even experts come back here — and that's perfectly fine. A simple chat isn't a step down, it's a tool.

**What defines this phase:**

- First contact with the technology — from zero to "oh, this actually works".
- The key barrier is **emotional**, not technical.
- Success = overcoming resistance and having a first positive experience.

## Phase 2–4: Intentional use

### Level 2 — Intentional prompting

**Input quality drives output quality.**

The user notices that how a question is phrased matters. Role assignment appears ("you are a QA engineer, write test cases"), along with context and expectations. This is a breakthrough moment — the realisation that AI is a tool that needs to be instructed well.

### Level 3 — Frameworks & prompt engineering

**Systematic approach to prompting.**

Application of proven frameworks (e.g. CRISP, chain-of-thought, few-shot learning). Structured prompt templates, repeatable processes. This produces significant results already.

> This is where most organisations implementing AI plateau. Frameworks yield great results — but the journey is just beginning.

### Level 4 — Custom instructions

**Personalisation & token efficiency.**

Custom instructions, system prompts, per-project settings. The user no longer repeats the same instructions every time — the model "knows" who they are, how to write, and what to avoid. The beginning of conscious context management and cost optimisation.

**What defines this phase:**

- Shift from "click and see" to **consciously steering** the model.
- The key barrier is **knowledge** — learning prompting techniques.
- Success = repeatable, high-quality AI outputs.

## Phase 5–8: Context & knowledge

### Level 5 — Context files

**README, AGENTS.md, claude.md — per-project context.**

AI agents receive files describing the project: what we're building, the structure, the conventions in place. You launch an agent in a given directory and it already knows what to do. Knowledge is separated from the prompt — context lives with the project, not in the user's head.

### Level 6 — Advanced agent instructions

**Defining behaviours, rules, and boundaries.**

Not just "what to do" but "how to behave". The agent has defined rules: when to ask, when to act autonomously, how to report, what not to do. This is the difference between a simple README and a full role specification — like onboarding a new team member.

### Level 7 — Skills & knowledge bases

**Specialised capabilities and domain knowledge.**

The agent has access to dedicated skills (e.g. generating reports in a specific format) and knowledge bases (documentation, company standards, historical data). We don't reinvent the wheel every session — knowledge is organised and available.

### Level 8 — Tools, MCP & connectors

**Integration with external systems.**

The agent doesn't just "write" — it uses tools: searches Slack, creates Jira tickets, reads emails, queries APIs. MCP (Model Context Protocol) and connectors enable interaction with the outside world. This is the leap from "chat assistant" to "team member with system access".

**What defines this phase:**

- Shift from one-off prompts to **persistent knowledge** living with the project.
- The key barrier is **architecture** — how to organise context, skills, and tools.
- Success = an agent that understands the project without repeating instructions.

## Phase 9–10: Autonomy

### Level 9 — Agentic workflow

**Goal → autonomous planning & execution.**

The agent receives a high-level goal and plans the steps to achieve it on its own. "Prepare release notes based on the latest commits" — and the agent checks the repo, analyses the changes, and writes the notes by itself.

> Paradox: the user returns to the "simple question" from level 1 — but the entire machinery underneath is completely different.

### Level 10 — Multi-agent orchestration

**A team of agents with a coordinator.**

Multiple agents, each with their own specialisation: one analyses, another codes, a third does review, a fourth writes tests. An orchestrator coordinates their work, manages sequencing, and resolves conflicts. This is a teamwork model — but with AI agents as team members.

**What defines this phase:**

- Shift from "I use AI" to **"AI works as a team"**.
- The key barrier is **trust** — letting go of control requires maturity.
- Success = an autonomous agent system delivering on complex goals.

---

*Author: Grzegorz Holak — AI Ambassador, SCIB. Originally published at [holak.net.pl](https://holak.net.pl).*
