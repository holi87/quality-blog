---
title: "Context Engineering: Why Your Agent Gets Dumber in a Long Session"
description: "Three mechanisms of context degradation (lost in the middle, instruction dilution, growing cost) and four habits that keep the token budget under control: compacting, clean starts, subagents, and pointers instead of data."
date: 2026-07-16
tags: ["ai", "context-engineering", "agents", "claude-code", "tokens"]
lang: en
readingTime: 9
author: GH
---

Anyone who works with an agent for more than an hour knows the moment: the model that sparkled in the morning is mixing up file names by the afternoon, ignoring decisions made fifteen minutes ago, and proposing solutions it had itself rejected earlier. That is not model degradation. It is context degradation - and you can manage it just as deliberately as a project budget.

## The context window is a budget, not a container

The context window - everything the model "sees" at a given moment: system instructions, conversation history, pasted files, tool outputs - has a hard limit counted in tokens. A token is a unit of text, roughly three quarters of an English word on average. A 200-thousand-token window sounds like infinity, but the arithmetic is brutal: one larger source file is 5-15 thousand tokens, a log dump from a failed CI/CD pipeline can eat 40 thousand, and the output of `git diff` after a bigger refactor - another 20.

The problem is that most people treat the window like a container: "it fits, so in it goes". It should be treated like a budget: every token spent on noise is a token that will be missing for signal. And - worse - noise is not neutral. It actively degrades answers long before you run out of space.

## Three mechanisms of degradation

It is worth understanding exactly why a session "gets dumber", because each mechanism has a different antidote.

**Lost in the middle.** Models make the best use of information at the beginning and at the end of the context, and the worst use of what sits in the middle. This is a phenomenon confirmed by measurements, not an anecdote. In practice: a decision from the middle of a long session - "we use the test database, not production" - has physically less chance of influencing the answer than the same sentence written a moment ago. The longer the session, the more important things land in the dead zone.

**Instruction dilution.** Your key instruction competes for the model's attention with everything else in the window. When the instruction "return the result in JSON format" is 20 words against 2 thousand tokens of context, it is followed almost always. The same 20 words against 150 thousand tokens - no longer. In my experience, the first symptom of dilution is precisely the loss of format requirements and naming conventions: the model still solves the task, but it stops solving it your way.

**Cost and time.** In token-billed models, every subsequent answer in a long session is more expensive, because the model processes the entire history from scratch every time. A session that has grown to 100 thousand tokens pays that tax on every sentence of yours - including when you ask about a trifle. Latency grows too. You pay more for worse answers: the worst tariff I know.

## What you really spend tokens on

Before we get to the habits, a short examination of conscience. Here are the typical budget eaters I see most often in my own work and in teams:

- **Logs pasted in full.** 300 lines of stack trace, of which three matter. The rest is pure noise that will stay in the window until the end of the session.
- **Whole files instead of fragments.** The agent reads an 800-line file to change one function. Those 800 lines travel with you forever.
- **Old threads.** The morning's debugging of problem A still sits in the context when you work on feature B in the afternoon. The model tries to honor decisions from both - and mixes them up.
- **Repeated attempts.** Three failed versions of the same solution in the history. The model sees them all and statistically gravitates toward what it has already written, mistakes included.

> An agent does not get dumber from hard tasks. It gets dumber from the cheap noise we pour into its window ourselves.

## Habit 1: compact before it gets bad

Compacting means replacing the history so far with a concise summary - Claude Code does it with the `/compact` command, but you can perform the same maneuver manually in any tool: "summarize our findings, decisions, and open threads in 15 points", then a new session with that summary at the start. The timing is key: compact after closing a stage, when you know what was important - not when the window is already overflowing and an automatic mechanism does it for you at a random spot, cutting the context off mid-thought.

My alarm threshold is roughly 60-70% window occupancy. Above that line I do not start new threads - housekeeping first.

## Habit 2: one session, one task

The cheapest technique on the list: a clean start. New feature - new session. New problem to debug - new session. The project's permanent context (conventions, architecture, commands) should live in a CLAUDE.md file or its equivalent, where it loads automatically and costs once, rather than being dragged manually from conversation to conversation.

The resistance to a clean start is usually emotional: "we have already settled so much, a shame to lose it". That is the sunk-cost trap. If the decisions are worth keeping - they deserve to be written to a file, not to drift in the chat history, where they will end up lost in the middle anyway. After forcing this rule on myself, my sessions shortened by half on average, and the number of "wait, we agreed otherwise" replies dropped noticeably.

## Habit 3: delegate the dirty work to subagents

A subagent - a helper agent with its own separate context window - is a mechanism I have written about separately, but in the context of a token budget it has one killer practical property: it isolates noise. The task "search the repository and find every place where we validate an email address" performed in the main session will pull dozens of file fragments into the window. The same task delegated to a subagent costs the main session only its final answer: five paths with line numbers.

Rule of thumb: everything that requires reading many files but ends in a short conclusion - searching, reconnaissance of unfamiliar code, log analysis - delegate. The main session should hold decisions and the current work, not the raw material.

## Habit 4: pointers instead of data

Instead of pasting a file - give the path and let the agent read a targeted fragment. Instead of 300 lines of log - paste the 10 lines around the error plus one sentence of context. Instead of the entire specification - the point the task concerns. A model with tools will fetch what it is missing by itself, and it will do so more precisely than your wholesale pasting.

This habit also has an output variant: ask for brevity where the full result is not needed. "Print only the changed lines", "answer with a table, no commentary". The model's output also stays in the window and also counts against the budget of the next steps.

## Anatomy of one burned-out session

So as not to leave this in theory, let us trace a typical run I have seen dozens of times - in my own work too. 9:00 a.m.: session start, task "fix the registration form validation". The agent reads three files, proposes a change, works great. 9:40 a.m.: along the way a test failure surfaces, I paste the full test output - 280 lines, of which one failure matters. 10:30 a.m.: "since we are here anyway", I ask for a refactor of the neighboring module. The agent reads another five files. 11:15 a.m.: I come back to the morning's validation - and the agent proposes a solution contradicting the one it had itself implemented two hours earlier, because that decision drowned in the middle of the window, crushed under the test log and the refactor.

The bill for that session: three different tasks, one large log dump, about 120 thousand tokens of history. Each of those tasks on its own would have taken a shorter, cheaper, and smarter session. The conclusion is not revelatory, but worth writing down: sessions do not break from the difficulty of tasks, but from their number and from the raw material that falls into the window along the way.

Since I started keeping a simple session journal - date, task, whether I finished in one session or had to rescue myself with compacting - I see a clear pattern: single-thread sessions end in success almost always, three-thread sessions need rescuing in most cases. That statistic from my own backyard persuades more effectively than any article, including this one.

## How to tell a session is dying

Four signals after which I decide to compact or start clean: the model mixes up names of files or functions it knew earlier; it returns to a solution rejected half an hour ago; it stops using the answer format I asked for at the beginning; it answers ever more slowly and ever more generically. Two out of four at once - the session gets replaced. I do not negotiate with a dying context, because every next answer will only be worse, and I will pay full price for it.

## Summary

The context window is a budget: noise crowds out signal, and the degradation mechanisms - lost in the middle, instruction dilution, growing cost - operate long before the hard limit. Four habits keep the budget under control: compacting after stages instead of in a panic, a clean start for every new task with permanent context in a file, delegating searches to subagents, and giving pointers instead of wholesale pasting of data. For one week, write down what you actually pasted into your sessions - the mere awareness of the bill changes habits faster than any tool.
