---
title: "Multi-Agent Orchestration - When One Agent Is Enough"
description: "Level 10 on the Holak Scale is attractive for a CV, expensive to maintain. A skeptical take on agent teams: when you actually need many, when one well-configured agent wins, and how to spot orchestrating mediocrity."
date: 2026-06-03
tags: ["ai", "agents", "claude-code", "holak-scale", "orchestration"]
lang: en
readingTime: 8
author: GH
---

In the [Holak Scale](/en/blog/holak-scale/), level 10 is *"multi-agent orchestration - a team of agents with a coordinator."* Sounds sexy. Looks great in decks. Fits a CV.

And it's a level most teams enter too early - paying the cost without the benefit.

This post is the skeptical take on level 10. Because I believe in orchestration - but only when the alternative (one good agent) genuinely isn't enough.

## Why everyone wants an agent team

Four reasons, ordered by frequency:

1. **Signal / status.** *"We have a multi-agent setup"* sounds better than *"we have one agent"*. CVs, decks, networking.
2. **Hype.** Every framework brags about a 5-agent collaboration demo. AutoGPT, BabyAGI, CrewAI, LangGraph, Autogen - all pull this way.
3. **Framework marketing.** Many tools sell themselves as *"designed for multi-agent."* Vendors talk about what they can do, not what's worth doing.
4. **Actual need.** The smallest category. It exists, but it's smaller than the first three.

If you (or your team) land in 1, 2, 3 - think before you start.

## What multi-agent actually costs

A list I see in every multi-agent setup after six months:

### Design cost

You can't just *"write agents."* You have to design:

- communication protocol (what agent A says to agent B and in what format)
- handoff state (how to pass context between steps without loss)
- conflicts (what when A and B disagree)
- timeouts (what when one doesn't respond)
- failure mode (what when one hallucinates - does the rest catch it?)

Each decision is hours of design. For a single agent - none of these exist.

### Maintenance cost

A change in one agent = a need to check it doesn't break the protocol with others. Model update (Claude 4.7 → 4.8) = retest the whole orchestration.

Real observation: a team with 5 agents spends **70% of maintenance time on interactions**, only 30% on individual agents.

### Token cost

Every handoff = passing context. Each agent has its system prompt. Each discussion round = N × tokens.

Numbers: a single agent solving a task = 5–10K tokens. A five-agent orchestration of the same task = 40–80K tokens. That's **8x the cost** for a marginally better result (usually 10–20%, sometimes worse).

### Debug cost

When things go wrong:

- one agent: read the transcript, you know where the error is
- five agents: reconstruct the whole conversation, trace handoffs, check who convinced whom

A debug session grows from 15 minutes to 2 hours.

## When one agent is enough (most cases)

If the task meets these conditions, one agent with good context wins:

- **Clearly defined output.** You know what should be produced (code, report, ticket, email).
- **Single context.** Everything needed for the decision fits in one session.
- **No handoff.** You don't need state passed between phases.
- **One permission domain.** Agent acts within one scope (one repo, one system, one DB).

Concrete examples:

- **Code review** - one agent reads the PR, writes comments. Multi-agent (one reads, another writes, a third reviews) brings 5% value at 4x cost.
- **Release notes generation** - one agent reads commits, drafts. Multi-agent is overkill.
- **Refactor of one module** - one agent in agentic mode. Multi-agent delays it by hours.
- **Ticket triage** - one agent with a good CLAUDE.md classifies 95% of cases.

## When you actually need many (small set)

Four situations where multi-agent is **actually better** than a single agent:

### 1. Independent parallel paths

The task naturally splits into N independent paths that can run in parallel. *"Search 10 repos for X"* - 10 agents, each in one repo, coordinator aggregates results. Makes sense because parallelism gives 8x faster execution.

### 2. Different permissions per step

Workflow requires actions across systems with **different security domains**. Agent A reads Slack (low risk), Agent B writes Jira (medium risk), Agent C deploys (high risk). Each with its own permission scope and separate audit log. Multi-agent here doesn't just help - it's **required by governance**.

### 3. Specialisation requires different models

Part of the task needs Claude Opus (reasoning), part Claude Haiku (fast fills), part a local model (sensitive data). Multi-agent lets you pick a model per step.

### 4. Audit trail requires separation

Compliance requires that each decision's trail be separate per action type. One agent in full logic = one log. Five agents = five separate logs, each signed off by the owner per action type.

If your use case is none of the above - go back to one agent.

## The "orchestrating mediocrity" anti-pattern

Quote from the [Holak Scale](/en/blog/holak-scale/): *"Three agents none of which handle a single goal well. Orchestrating mediocrity produces greater mediocrity."*

Signals:

- Each agent achieves <60% solo success
- Orchestrated results aren't better than the best solo agent
- Orchestration runtime > 3x solo agent
- Token cost > 5x solo agent

**Way out:**

1. Stop the multi-agent project.
2. Pick the weakest agent.
3. Make it succeed at 80% as solo.
4. Repeat for each.
5. **After all that** come back to the question: is multi-agent still needed?

Often the answer is no. Because along the way you built 4 good agents each handling their range independently.

## Readiness test for orchestration

Four questions. All must be "yes":

1. **Does each planned agent (as solo) achieve ≥80% success in its domain?**
2. **Do I have a documented inter-agent communication protocol?**
3. **Do I have a plan for each of the 5 failure modes (timeout, hallucination, conflict, bias, loop)?**
4. **Can I show the value of orchestration vs single agents in numbers (time saved, quality, availability)?**

All yes → level 10 is real. Any no → back to 9.

## What's next

I wrote about [Claude Code subagents](/en/blog/subagents-claude-code-what-and-why/) - a good intro to orchestration in practice. [A custom subagent](/en/blog/custom-subagent-claude-code-example/) shows how to build one. Those two posts are about **mechanics**.

This post is about **strategy**. Most teams don't need level 10. They need a good level 9 - an autonomous single agent that handles its 80% of cases.

Level 10 makes sense when level 9 is *"not enough."* Not earlier. Most of the time *"not enough"* is an illusion - from hype, not real need.

If despite that you still want multi-agent - walk through the 4 readiness questions. If you answer all "yes" - build, but honestly. If any "no" - stop, finish the earlier level.
