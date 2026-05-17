---
title: "MCP and Connectors — When It Helps, When It's Overengineering"
description: "MCP is a tool, not a status. Each connector is maintenance, risk, and attack surface. Criteria for when MCP pays off, when it beats a coded integration, and a decision tree before adding one."
date: 2026-06-01
tags: ["ai", "mcp", "claude-code", "tooling", "holak-scale"]
lang: en
readingTime: 8
author: GH
---

I've written about [the first MCP for QA](/en/blog/first-mcp-for-qa-search-fetch/) and about [context7](/en/blog/context7-mcp-up-to-date-docs-llm/). Those pieces are enthusiastic — because MCP changes how you work with agents and for many tasks it's a game-changer.

This post is the counter-take. Because I see too many teams that added 15 MCP servers in three weeks and got stuck with a pile of unused connectors.

**Thesis:** MCP is not a status — it's a tool. Each connector is maintenance burden, risk, and attack surface. Add intentionally or pay the debt.

## When MCP pays off

Four conditions. Check each before adding a connector:

### 1. 3+ uses per week

If the functionality is used once a month — not MCP, just ad-hoc command. The 3x/week threshold is roughly when automation savings exceed maintenance cost.

### 2. Repeatability > 80%

The action has to be regular enough. *"Post an update to Slack #release"* — yes. *"Check what's going on in our infrastructure"* — no, too undefined.

### 3. Manual step costs >10 minutes

Average over the last 3 weeks. If each manual task takes 3 minutes — MCP isn't worth it. 15 minutes — worth considering.

### 4. Result needs an audit trail

If the action must be logged (compliance, security, debugging) — MCP gives that for free. Manual steps leave no systematic trace.

All four? **Add MCP.** Fewer than three? **Don't add.**

## When MCP is overengineering

Signals you shouldn't:

- **One-off task.** Migration, audit, single report. A script + cron beats MCP.
- **Experimental.** You're checking if it makes sense at all. Script first; MCP only after it runs stably.
- **One user.** Don't build infrastructure for yourself alone. A terminal custom command is enough.
- **Production data with no governance.** If MCP would write to a prod DB and you have no permissions framework — don't do it.
- **No ownership.** If you don't know who maintains this MCP six months from now — don't add it.

Simple test: *"Will anyone besides me use this MCP in the next month?"* — if no, probably overengineering.

## ROI accounting

A concrete model. Suppose you're considering an MCP that creates Jira tickets.

**Cost:**

- MCP implementation: 6 hours (using Anthropic's official SDK)
- Team onboarding: 1 hour × N people
- Maintenance: ~2 hours / month (updates, edge cases, debug)
- Risk premium: depends on scope (RBAC misconfiguration → potential compliance exposure)

**Savings:**

- Manual ticket creation: 4 minutes
- Tickets / week: 25
- = 100 minutes / week = ~7 hours / month saved

**Break-even:** 1 month for a 3-person team. After a year: 70 net hours.

Same math for an MCP that *"checks deployment status"* (1 use / week, 2 minutes manually):

- Savings: 8 minutes / month
- Maintenance cost: 2 hours / month

**Break-even: never.** Don't build.

## Security — checklist before turning on

Regardless of ROI, every MCP needs a security review. Five questions:

1. **What data does it read?** A list of specific resources (tables, channels, repos). "Everything" = red flag.
2. **What actions does it write?** Read-only vs write vs destructive operations. Each level needs a different framework.
3. **What's the blast radius on a wrong action?** Max harm scope (1 ticket vs the whole DB). If > "we'll fix in an hour" → needs a sandbox.
4. **Does the MCP have its own token / credentials?** Dedicated credential per MCP, not shared with user accounts.
5. **Do I have an audit log of every action?** Not CloudWatch nobody reads — a system with alerts on anomalies.

Fewer than 5 "yes" answers → no prod connection. Sandbox first.

## Anti-pattern: "we have 15 MCP"

I see it often. Team added 15 connectors in two months. Six months in:

- 4 are used regularly
- 5 are used sporadically
- 6 are dead (nobody remembers why)

Each of the 15 needs: version updates, CVE patching, documentation. Maintenance burden is **15x**, value is **4x**.

**Way out:**

1. Quarterly audit. Per MCP: invocation count / 30 days, owner, actively used?
2. If <10 invocations / 30 days and no owner — remove.
3. Duplicates functionality of another — consolidate.
4. Used by 1 person — consider whether it should be personal config.

Target: <8 MCP per team, each with an owner, each with a usage metric.

## Decision tree — before adding MCP

Walk through it before you click "install":

```
1. Will I use this 3x/week?
   no → STOP, don't add
   yes → next

2. Does it take me >10 minutes manually?
   no → STOP, MCP won't pay off
   yes → next

3. Do I have an owner (name, surname)?
   no → STOP, find an owner first
   yes → next

4. Do I have a permissions framework for the scope (data read, actions written)?
   no → STOP, build the framework first
   yes → next

5. Is there already an MCP that does ~80% of what I need?
   no → build a new one
   yes → use the existing one (even if "not perfect")

6. Can I start read-only?
   yes → START READ-ONLY, write in phase 2
   no → write-from-day-one needs sandbox testing
```

## What "small MCP" means

A point worth making: not every MCP has to be a big project. "Small MCP" — one tool, one endpoint, one specific use case — typically:

- 200 lines of code
- 1 owner
- 1 type of action
- audit log per call

This is **a better pattern** than "we have a general-purpose MCP for everything." That latter quickly becomes responsible for everything and nothing.

## What's next

If you're considering your first MCP — start with [the first MCP for QA: search/fetch for evidence](/en/blog/first-mcp-for-qa-search-fetch/). The simplest pair of tools with an owner and an audit log.

If you have several MCP and don't know which to keep — audit against the decision tree. Keep those that pass all 6 steps.

If your team boasts *"we have 15 MCP"* — that's a sign of getting stuck at level 7–8 with the [skill-bloat / MCP-everything anti-pattern](/en/blog/ai-adoption-anti-patterns/). Tool count is not a maturity measure. Count of well-chosen, well-maintained ones — yes.
