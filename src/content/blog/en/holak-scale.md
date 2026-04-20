---
title: "The Holak Scale — An Expanded AI Adoption Maturity Model"
description: "11 levels from resistance to orchestration — with self-diagnosis, anti-patterns, and the organisational dimension. An expansion of the original maturity model."
date: 2026-04-21T00:00:00+02:00
tags: ["ai", "adoption", "teams", "strategy"]
lang: en
readingTime: 12
---

A few days ago I published a short [AI adoption maturity model](/en/blog/ai-maturity-model/) — 11 levels from resistance to orchestration. After conversations with readers and teams I've been helping with adoption, it became clear the model needed to be expanded. It lacked diagnostic tools, concrete examples, honest anti-patterns, and a clear separation between the individual and the organisational perspective. This version — **the Holak Scale** — closes those gaps.

## How to read this scale

The scale has **11 positions (0–10)**, but *level 0* describes the state *before* adoption, not the first rung of maturity. Counting from zero is deliberate — refusal is a position worth naming.

Each level is described through the same triangle:

- **Barrier** — what you need to overcome to move up.
- **Success** — what stable operation at this level looks like.
- **Trap** — what causes people and companies to get stuck.

The scale operates in **two dimensions**:

- **Individual** — where you are as a user.
- **Organisational** — where your team / company is as a system.

These two often diverge. A single engineer may sit at level 9 while their company is at level 3. Any adoption strategy has to account for both.

## Level map

| Phase | Level | Name | In one sentence |
|-------|-------|------|-----------------|
| Start | [0](#level-0) | [Resistance](#level-0) | No contact with AI |
| Start | [1](#level-1) | [Basic chat](#level-1) | Question → answer |
| Intentional use | [2](#level-2) | [Intentional prompting](#level-2) | Input quality = output quality |
| Intentional use | [3](#level-3) | [Frameworks](#level-3) | CRISP, CoT, few-shot |
| Intentional use | [4](#level-4) | [Custom instructions](#level-4) | The model knows you without being reminded |
| Context and knowledge | [5](#level-5) | [Context files](#level-5) | README, AGENTS.md, claude.md |
| Context and knowledge | [6](#level-6) | [Advanced instructions](#level-6) | Rules for behaviour and boundaries |
| Context and knowledge | [7](#level-7) | [Skills and knowledge bases](#level-7) | Domain knowledge + capabilities |
| Context and knowledge | [8](#level-8) | [Tools and MCP](#level-8) | Integration with systems |
| Autonomy | [9](#level-9) | [Agentic workflow](#level-9) | Goal → autonomous execution |
| Autonomy | [10](#level-10) | [Orchestration](#level-10) | A team of agents + a coordinator |

## Phase 0–1: Start

### Level 0

**Resistance / no adoption.** The user doesn't use AI — due to lack of knowledge, fear, ethical decision, or company policy. Often accompanied by anxiety about job loss or distrust of the technology.

- **Barrier:** emotions and professional identity.
- **Success:** an honest, informed decision (not avoidance).
- **Trap:** rationalising resistance with technical arguments ("it hallucinates", "there's no compliance") instead of admitting the real issue is fear.

### Level 1

**Basic chat — question → answer.** First interaction. The user treats the model like a search engine: types a question, gets an answer, sometimes follows up.

> Even experts come back here — and that's fine. Simple chat isn't shameful, it's a tool.

- **Barrier:** breaking through the first contact.
- **Success:** naturally reaching for AI when small questions come up.
- **Trap:** staying here for years with the belief "I use AI every day" — because you're using 2% of what it can do.

**Start phase self-check:** you're here if you don't have your own account in any AI tool, or you only use it when someone shows you. The signal that you're moving up: you start noticing that answers vary in quality depending on *how* you ask.

## Phase 2–4: Intentional use

### Level 2

**Intentional prompting — input quality drives output quality.** The user assigns a role ("you are a QA engineer, write tests"), provides context, sets constraints. Starts iterating instead of accepting the first answer.

- **Barrier:** the instinct "I write like I'm talking to a person" instead of "I write like I'm briefing a system that needs context".
- **Success:** prompts include role, goal, context, and output format — without a framework, from experience.
- **Trap:** the belief that "just being precise is enough" — without systemisation, every prompt has to be reinvented.

### Level 3

**Frameworks and prompt engineering.** CRISP, chain-of-thought, few-shot learning, ReAct. Structured templates, repeatable processes, personal prompt libraries.

> This is where most AI-adopting organisations plateau. Frameworks give great results — but this is only the beginning of the road.

- **Barrier:** learning the techniques and disciplining their use.
- **Success:** repeatable, high-quality results; the team shares a common prompting language.
- **Trap:** prompt fetishism — prompts get longer and more baroque, instead of moving the repeated content into custom instructions.

### Level 4

**Custom instructions — the model knows you without being reminded.** Custom instructions, system prompts, per-project settings. You no longer repeat every session "I'm a tester, I write in English, I like concise answers".

**A typical day at level 4:** you open ChatGPT / Claude, type *"review this PR"*, and the model already knows which language to reply in, what style you use, and what to pay attention to — because you told it once, in the settings.

- **Barrier:** the time investment in a setup that won't pay off until next week.
- **Success:** short prompts, long default context; consistency across sessions.
- **Trap:** instructions balloon into a novel because you keep piling on after every problem — without review or pruning.

**Intentional-use phase self-check:** you're here if you can tell a good prompt from a bad one when you see someone else's, and you have your own templates or custom instructions. The signal to move up: you start feeling you're copying the same context between projects and wish it lived "next to the code".

## Phase 5–8: Context and knowledge

### Level 5

**Context files — per-project context.** `README.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`. AI agents get files that describe the project: what we're building, how it's structured, which conventions apply. You run the agent in a directory — it already knows what to do.

- **Barrier:** accepting that writing documentation for AI is engineering work, not "overhead".
- **Success:** a new team member (human or agent) is productive within an hour.
- **Trap:** `CLAUDE.md` written once and never updated — it becomes mythology.

### Level 6

**Advanced instructions — behaviour, rules, and boundaries.** Not "what to do" but "how to behave": when to ask, when to act autonomously, how to report back, what to avoid. The difference between a README and a full role specification.

- **Barrier:** articulating norms that used to live only in your head.
- **Success:** the agent operates in line with the team's culture without your presence.
- **Trap:** rigid rules where a good example would work better — overfitting to one scenario.

### Level 7

**Skills and knowledge bases — specialised capabilities and domain knowledge.** Dedicated skills (generating reports, analysing logs, migrations), knowledge bases (documentation, standards, decision history). We don't reinvent the wheel — knowledge is organised.

- **Barrier:** information architecture and the decision of *what* to wrap into a skill versus leaving ad hoc.
- **Success:** the agent reaches for the right tool by itself, without hand-holding.
- **Trap:** multiplying skills "just in case" — no one uses them and no one remembers they exist.

### Level 8

**Tools, MCP and connectors — integration with external systems.** The agent doesn't just write — it searches Slack, creates Jira tickets, reads emails, calls APIs, runs tests. MCP (Model Context Protocol) and connectors let it act in the world.

- **Barrier:** security and permissions — *what* the agent can actually do, and *where*.
- **Success:** the agent behaves like a new team member with access to the systems.
- **Trap:** wiring everything to everything without audit — the first incident costs more than a year of savings.

**Context-and-knowledge phase self-check:** you're here if your projects have context files you actually honour, and an agent can perform a task end-to-end without step-by-step instructions. The signal to move up: you start formulating high-level goals and are surprised you still have to break them into steps.

## Between phase 8 and 9: the trust boundary

This is **the single biggest jump in the scale** — and the one most weakly described in popular models. Up to and including level 8, the human leads and the agent executes. From level 9, the human defines the goal and the agent decides on the steps.

The boundary isn't technical — the tools have existed for a while. The boundary is **organisational and psychological**: agreeing that something will happen without your per-decision involvement. Companies get stuck at 8 not for lack of MCP, but for lack of readiness to give up control. Engineers get stuck at 8 because they like steering.

Crossing requires two things: **verifiability** (it's easy to check what the agent did) and **reversibility** (it's easy to undo if it was wrong). Without them, level 9 is irresponsible. With them, it becomes the obvious next step.

## Phase 9–10: Autonomy

### Level 9

**Agentic workflow — goal → autonomous planning and execution.** The agent gets a high-level goal and plans the steps itself. *"Prepare release notes from the latest commits"* — the agent checks the repo, analyses the changes, writes the notes, proposes a draft.

> Paradox: the user returns to the "simple question" of level 1 — but the machinery underneath is entirely different.

- **Barrier:** trust and verification systems.
- **Success:** you delegate goals, not tasks; the agent flags you when it gets stuck.
- **Trap:** the illusion of autonomy — the agent *seems* to work alone, but in practice 60% of your time is spent fixing things that "almost worked".

### Level 10

**Multi-agent orchestration — a team of agents with a coordinator.** Multiple agents, each specialised: one analyses, another codes, a third reviews, a fourth writes tests. The orchestrator coordinates order, resolves conflicts, aggregates results.

- **Barrier:** designing a system of agents, not writing prompts.
- **Success:** complex goals are delivered without micromanagement; the human sets direction and verifies outcomes.
- **Trap:** overengineering — three agents where one well-configured agent would do, because "it's trendy to have a team".

**Autonomy phase self-check:** you're here if in the last week you delegated a goal whose execution you only reviewed at the end — and it was correct. The signal you're "past 10": you start designing systems in which an individual agent is an implementation detail.

## Anti-patterns — where people get stuck

From observation:

- **Stuck at 1 with the "I use AI" myth.** Daily Q&A creates the feeling of adoption while skill growth is zero. Test: have you tried anything new in the last month?
- **Stuck at 3 with prompt fetishism.** Libraries of "golden prompts" 200 lines each, instead of moving repeated content into instructions. Symptom: you copy a prompt from a document every time.
- **False maturity at 8.** The company has MCP, integrations, and dashboards — but every workflow requires a human to approve every step. That's still level 6–7 dressed up as 8.
- **Jumping from 4 to 9.** "Let's install an agent and let it run" — skipping the context-and-knowledge phase. The agent hallucinates, the team loses trust, they drop back to level 2 and declare that "AI doesn't work".
- **Level 10 without level 9.** A team of agents where none handles a single goal well. Orchestrating mediocrity produces greater mediocrity.

## Organisation vs individual

The **individual** scale measures skill. The **organisational** scale measures the system: processes, institutional knowledge, governance, tools.

Typical mismatches:

- **Individual 9, organisation 2.** A single engineer uses agents autonomously at home, but has to turn them off at work "for compliance". A waste of talent.
- **Individual 3, organisation 7.** The company has great context files, skills, MCP — but users copy prompts from Confluence because they don't understand what's available. A waste of infrastructure.
- **Individual 5, organisation 5 (aligned).** A rare, healthy state. Usually means the company is actively investing in education and engineers have a voice in tooling.

When measuring an organisation, look at the **median**, not the maximum. One leader at level 9 does not make the company mature.

## Where this model fails

Honestly:

- **The scale is linear; the world isn't.** In practice you jump between levels depending on the task. In writing emails you're at 1, in code you're at 8. That's normal.
- **Not all levels are equally valuable.** The jump from 1 to 4 yields more than from 8 to 10. The model shows a trajectory, not a priority.
- **Tools move faster than the scale.** Level 8 in 2024 (MCP) is not level 8 in 2026. The scale describes the *kind* of capability, not specific products.
- **There's no ethics here.** You can be at level 10 and still be doing something harmful. Technical maturity isn't moral maturity.

## What's next

If this scale helps you in a conversation with your team — use it, cite it, adapt it. If you see gaps, get in touch via [holak.net.pl](https://holak.net.pl) or the contact channel on this blog. Version 3 will appear once I collect enough concrete material from your deployments.

A follow-up in this series — *"How to diagnose a team's maturity level in 30 minutes"* — is in the works.

---

*By Grzegorz Holak — AI Ambassador, SCIB. Originally published at [holak.net.pl](https://holak.net.pl). Version 1 of the model: [AI Adoption Maturity Model](/en/blog/ai-maturity-model/).*
