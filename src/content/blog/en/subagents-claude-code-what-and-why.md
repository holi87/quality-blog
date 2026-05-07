---
title: "Subagents in Claude Code: why orchestrate instead of writing in one window"
description: "One Claude vs many specialists invoked through Agent. Why subagents, how Claude picks which one to use, when NOT to use them, and why this isn't 'one window with more context'."
date: 2026-05-12
tags: ["ai", "claude-code", "subagents", "automation"]
lang: en
readingTime: 7
---

Claude Code in the terminal answers with a single model by default. One context window, one history, one session. That works until the task needs things that don't fit in one context — research across ten files, fixing four bugs in parallel, a second opinion from a stronger model. That's when delegation kicks in: Claude calls a **subagent**.

A subagent isn't "another model to chat with." It's a separate LLM with a fresh context, a tools list different from yours, its own system prompt, and no memory of what happened in the main session. It gets a brief, does its job, returns a single summary. That changes how Claude can run a task.

## Why subagents at all

Three concrete reasons.

**Context isolation.** Your main Claude chat already has 50k tokens of history — files, edits, decisions. If you now ask "scan the entire test folder and find duplicates," Claude pulls thousands of lines of test code into its context. After that task the context is polluted and Claude doesn't remember what the conversation half an hour ago was about. A subagent with a separate context does the same work and returns a 200-word summary; your context stays clean.

**Parallelization.** In a single response Claude can fire four subagents in parallel (four `Agent` tool uses in one message). Four independent tasks finish in the time of the slowest — API research, test sanity check, security audit, TODO list. This is where subagents deliver the biggest value.

**Specialization.** The built-in `code-reviewer` agent has a prompt focused on finding bugs. `tech-lead-orchestrator` looks at architectural decisions. Each is "better" at its niche than the default Claude because the system prompt is sharper and doesn't compete with 50 other roles.

## Built-in: Explore, Plan, general-purpose

Three you probably know:

- **`Explore`** — read-only, fast agent for locating code ("where is X defined," "which files reference Y"). Use instead of `grep` + 3 retries when you don't know what the function is called
- **`Plan`** — architect agent, designs implementation plans. Step-by-step, with trade-offs. Use before writing code for a non-obvious problem
- **`general-purpose`** — everything else. Multi-step research, open questions, "I don't know where to start"

Plus dozens of dedicated ones: `code-reviewer`, `frontend-developer`, `python-expert`, `django-backend-expert`, `gsd-*` (if you have the GSD plugin), and so on. The list depends on installed plugins and marketplaces.

## How Claude picks which one to use

Every subagent has a `description` field in its definition. Claude reads the descriptions of all available subagents and matches them against your task. Sometimes it helps to be explicit: the `Agent` tool use accepts a `subagent_type` parameter. If you don't pass it, Claude picks one (usually `general-purpose`).

In practice: if you see Claude calling a different agent than you wanted, two things may be off:

- Bad `description` in the agent definition — too broad ("everything") or too narrow ("only when the file is named foo.ts")
- Your task is ambiguous — Claude can't tell whether it's research or implementation

## Sequential or parallel

The rule from the Claude Code docs: if several tasks are independent, fire them in one response (multiple tool uses simultaneously). If one depends on the other (research → decision based on result → implementation), fire them sequentially.

Concrete example.

**Sequential** (bad, wastes time):
1. Spawn agent "find all auth middleware"
2. (waits)
3. Spawn agent "find DB connection code"
4. (waits)
5. Spawn agent "list TODO comments"

**Parallel** (good, single response):

```
Agent("auth middleware") + Agent("DB connection code") + Agent("TODO comments")
```

All three start together and finish in the time of the slowest.

## When NOT to use a subagent

A subagent costs. Each = a new context window to fill, each = latency, each = token cost. Don't use one when:

- You know exactly which file you want to read. Just call `Read` in the main thread
- You're searching for a specific symbol. `grep` via Bash is faster than `Explore`
- You're doing a short 1–2 step task. A subagent only adds overhead here
- You need the full output to drive the next decision. The subagent returns a summary; the raw output is gone

The anti-pattern I see most often: spawning a subagent for "find all .ts files." `find . -name "*.ts"` via Bash does the same thing in 10 ms instead of 30 seconds.

## Trade-offs and limits

Three things worth remembering:

- **The subagent doesn't see your conversation.** You have to write the brief from scratch. If you assume "it knows what we're talking about" — it doesn't. Brief = task + relevant context + expected output format
- **The result is text, not a diff.** A subagent returns a summary, not the full output. If you told it to write code, verify the file actually got written (trust but verify)
- **Background agents are convenient but invisible until done.** `run_in_background: true` lets you fire an agent and continue — but until it finishes, you don't know how it's going. Good fit for long tasks with a clear deliverable

## End-to-end example

Task: "add tests to function X and check that they don't break anything else."

Main Claude:

1. `Read` X (not a subagent — single file, known path)
2. Spawn an `Explore` agent: "find how X is used in tests and production code" (subagent — I don't know how many files there are)
3. Based on the result: write the new test (`Edit`, in the main thread, because the decision depends on the previous step)
4. Spawn a `general-purpose` agent: "run `npm test` and return only failing tests with the reason" (subagent — `npm test` output can be tens of kB)
5. If it fails → fix → go to 4

Three subagents, each with its role, each returning only what's needed, your context stays clean.

## What's next

This post showed why and when to call subagents. The second post in the series (Friday) shows **how to write your own** — frontmatter, prompt, deployment, anti-patterns when writing `description`. If you use Claude Code and often repeat the same type of task (e.g. "review the diff before the PR and tell me what to improve"), a custom subagent with a sharp prompt pays for itself after the third invocation.

Tomorrow: the [`prompt-master`](/en/blog/prompt-master-skill-claude-code/) skill — instead of writing a prompt to MJ/Sora/Cursor by hand, you have a prompt generator inside Claude Code. More from the series: [prompting basics](/en/blog/ai-prompts/), [first MCP for QA](/en/blog/first-mcp-for-qa-search-fetch/).
