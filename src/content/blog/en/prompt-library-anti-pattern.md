---
title: "A Prompt Library Is an Anti-Pattern. Yes, the 200-Line One"
description: "If you copy prompts from a document, you have a phase-4 problem, not a phase-3 one. Why prompt fetishism is a symptom of stalled evolution, and how to break a 200-line prompt down into custom instructions and project context."
date: 2026-05-27
tags: ["ai", "prompt-engineering", "holak-scale", "anti-patterns"]
lang: en
readingTime: 7
author: GH
---

I have a picture in my head I see in every other engagement:

An engineer with two monitors. On the left, Confluence with a folder *"Golden prompts."* On the right, Claude. Copy — paste — fill in `{project_name}`, `{requirements}`, `{output_format}` — Enter. Waits. Unhappy with the result, returns to Confluence, copies *"Golden prompt v2 — extended context (FINAL)."* Pastes, tweaks. Notes to themselves *"need to update v3."*

I want to convince this person of one thing: **this isn't success. It's a symptom.**

## What a prompt library is really about

Looking at the [Holak Scale](/en/blog/holak-scale/) — a 200-line prompt library isn't level 3 (frameworks), it's level 3 with **failure to cross to 4**. Why?

Because you have a library when:

- you repeat the same role / style / constraints in every prompt
- you re-paste the project context every time
- you manage prompt versions by hand
- you create conventions like *"v1 — basic, v2 — with tests, v3 — with tests and security"*

All of these are **things that should live higher up**. In model settings (level 4), in context files (level 5), in advanced instructions (level 6).

A prompt library is a debt you take on because you don't want to move higher.

## Why it works short-term

Honest: it works in a sprint. A boilerplate 200-line prompt yields a boilerplate output. Output is repeatable. The team has a "shared language." All nice.

After three months you see:

- **Model drift.** Anthropic / OpenAI ship a new model version — your prompts suddenly produce different outputs because they relied on specific regularities.
- **No transfer.** A new project = rewrite all prompts with the new project context. The work scales linearly with project count.
- **Team divergence.** Two engineers have "their v3" of the same prompt — out of sync. A third wrote their own from scratch because *"those are stale."*
- **No evolution.** Six months in, you're still at 3. Your industry has been at 5–6 for ages.

## How to break down a 200-line prompt

A concrete move. I took a real prompt from a bank (anonymised). It looked like:

```
You are a senior software engineer with 15 years of Python experience.
You work for the Risk Engine team, which runs the credit-limit system for
12 million customers. Stack: Python 3.11, FastAPI, PostgreSQL 15, Redis.
Conventions:
- type hints everywhere
- Google-style docstrings
- pytest with unittest.mock
- structlog logging
- error handling: never `except Exception`, always specific types
- never use print
- no global state
- ...

[150 more lines]

Your task:
Write an endpoint to create a credit limit for a customer. Requirements:
- POST /limits
- body: customer_id, amount, currency, expires_at
- validation: amount > 0, currency in ['PLN', 'EUR', 'USD']
- ...
```

Three operations:

### Operation 1: into custom instructions

Everything about you and your style. Goes into `Settings → Custom Instructions` in ChatGPT/Claude:

```
I'm a senior software engineer with 15 years of Python experience.
Stack: Python 3.11, FastAPI, PostgreSQL, Redis.
Prefer: type hints everywhere, Google-style docstrings, pytest,
structlog logging, specific exception types (never bare Exception).
Avoid: print, global state, magic numbers.
Reply concisely; comment code only where the WHY isn't obvious.
```

20 lines instead of 80. Set once, used always.

### Operation 2: into the project context file

Everything about your project. Goes into `CLAUDE.md` in the repo (or `AGENTS.md`, [details in a separate post](/en/blog/agents-md-for-test-automation/)):

```markdown
# Risk Engine

Credit-limit system for 12 million customers.

## Stack

FastAPI + PostgreSQL 15 + Redis. Migrations via Alembic. Auth via internal JWT service.

## Test conventions

- pytest, fixtures in conftest.py per module
- mock external calls, not internal
- integration tests against PostgreSQL Docker (`make test-int`)

## What we avoid

No Alembic auto-generated migrations - always manual review before merge.
No schema changes to `customers` without KYC team review.
```

30 lines of project context the agent has every time you launch Claude Code in that repo.

### Operation 3: prompt becomes minimal

Only the task goal remains. From 200 lines down to 5:

```
Endpoint POST /limits to create a credit limit.
Body: customer_id, amount (>0), currency (PLN/EUR/USD), expires_at.
Validation via Pydantic. Audit log via structlog.
```

That's it. The model knows your style (custom instructions), knows the project (CLAUDE.md), executes the task (prompt). You're at 4–5, the library is unnecessary.

## "But I have 50 different tasks, not one"

The most common library defence. Also solvable:

- **Repeatable task patterns (report, review, refactor, migration)** → [Claude Code skills](/en/blog/prompt-master-skill-claude-code/) or dedicated subagents
- **End-to-end workflows** → [a custom subagent](/en/blog/custom-subagent-claude-code-example/) with a designed system prompt
- **Experiments / one-offs** → these can be ad-hoc prompts; they are ad-hoc

A 200-line prompt library tries to substitute level 3 for levels 4, 5, 6 and 7 at once. Each of those levels has its own tool. A library doesn't replace any of them well.

## Exception: ad-hoc experiments

The point isn't to never write long prompts. The point is that a long prompt **shouldn't be a permanent fixture of your workflow**.

Trying a new technique? A long prompt is fine. Onboarding the model to an unfamiliar project? Fine. A one-off thing once a year? Fine.

But if a prompt has a last-modified date from 3 months ago and you still copy it — it's not an experiment. It's level 3 with the anti-pattern.

## A test for whether you're in the trap

Three questions:

1. **When did you last change your custom instructions?** If "never" or "six months ago" — trap.
2. **How much time do you spend in the AI tool weekly vs how much time writing / updating prompts?** If >20% is the latter — trap.
3. **Does a new team member start by asking "give me your prompt library"?** Yes = systemic trap.

If you answered "yes" to any — pick one prompt from the library, run the three operations above, use it for a week, see.

## What's next

[5 prompts that will change your AI work](/en/blog/ai-prompts/) is a good start. But if six months in those 5 prompts have become 50 and all live in Confluence — that's the signal to promote to a higher level, not write another prompt.

A library isn't success. It's a necessary stage — and a symptom that it's time to move on.
