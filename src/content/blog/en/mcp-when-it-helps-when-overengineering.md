---
title: "MCP, CLI or hook — which tool when, and when MCP is overengineering"
description: "MCP is a tool, not a status. Each connector is maintenance, risk and attack surface. Criteria for when MCP pays off, when CLI / slash command / hook is better, a decision tree, and the CLI → MCP migration path."
date: 2026-06-01
tags: ["ai", "mcp", "cli", "claude-code", "tooling", "holak-scale"]
lang: en
readingTime: 13
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

## Before you reach for MCP — consider CLI

MCP isn't the only path. In half the cases where teams add a connector, a **slash command or a CLI script** does the same job at a fraction of the maintenance cost.

Three concrete forms:

- **Slash commands in Claude Code / Codex / Cursor** — a markdown file with an instruction, invoked as `/name`. Zero infrastructure, distributed via the repo (`.claude/commands/`).
- **CLI wrappers in the Bash tool** — `gh`, `jira-cli`, `slack-cli`, `curl + jq`, `aws`, `kubectl`, a custom script in `~/.local/bin/`. The agent calls it via Bash; we see it in shell history.
- **Python / Node scripts** — `scripts/release-notes.py`, `scripts/jira-triage.ts`. Live in the repo, versioned, testable.

### When CLI beats MCP

- **Single user.** No point standing up a server for yourself. `~/.local/bin/jira-create` + an alias does the same.
- **Experiment.** You're checking whether automation makes sense at all. Script → a week of use → decision. MCP forces a setup you don't want to throw away.
- **Read-only audit / one-shot.** "Pull the list of PRs from last week" — `gh pr list --json ...` + `jq`. Don't bolt a server onto that.
- **Works everywhere.** A CLI runs in Claude Code, Codex, Cursor, vanilla terminal, in CI, on someone else's laptop. MCP needs per-client config.
- **Low blast radius.** A `--dry-run`-aware script with a clear scope (one user, one command) has a smaller attack surface than a constantly-listening MCP server.
- **Audit for free.** Shell history + `script` + a central `~/.zsh_history` backup. Or logging inside the script itself. You don't need CloudWatch.

### When CLI is worse than MCP

- **Many users, the same workflow.** Each one has to install the script, set up credentials, track the version. MCP solves that centrally.
- **Write actions on prod + compliance.** Shell history per laptop won't cut it — you need a central log with attribution.
- **Forced agent behavior.** If the agent must ALWAYS use this function in a specific way — an MCP in the allowlist beats a script the agent can ignore.
- **Complex data schemas.** If a tool returns a structured response the agent has to parse further — MCP with a schema beats raw JSON from `curl`.

### Concrete CLI ↔ MCP pairs

| Use case | CLI / script | MCP — when |
|---|---|---|
| Creating Jira tickets | `jira create -p PROJ -t Bug --summary "..."` | when 3+ people, write + audit |
| Sending to Slack | `curl -X POST webhook ... \| jq` | when you need controlled channels + DLP |
| Deploy status | `gh run list --workflow=deploy.yml --limit=5` | rarely — read-only, low ROI |
| Docs search | `rg`, `grep`, `context7` (itself an MCP) | for external knowledge bases with auth |
| Generating release notes | `scripts/release-notes.py` | when it must read from 5+ sources with different auth |
| PR review | `gh pr view 123 --json ...` | when team-wide policy with guardrails |

**Heuristic:** start with CLI. Migrate to MCP only when the criteria in the "Migration" section are met.

## Trade-off: CLI vs MCP vs Hook

Each targets something different. Keeping them separate simplifies decisions.

| Dimension | CLI / script / slash command | MCP server | Hook |
|---|---|---|---|
| Invoked by | agent (via Bash) or user | agent (allowlisted tool) | runtime (auto, before/after action) |
| Initiative | model decides when to fire | model decides when to fire | forced — the agent can't skip it |
| Audit | shell history / script log | structured log per call | built into the runtime |
| Scope | per user, per repo, per box | per team / org, centralized | per session / per action |
| Setup | 5 min — a file in the repo | 2–6h — server, deploy, auth | an hour — config |
| Maintenance | minimal, edit the file | regular — versions, CVEs, auth | minimal, but needs tests |
| Blast radius | bounded by script scope | depends on permissions; misconfigured — large | small — hooks don't carry state |
| Distribution | git, brew, npm | MCP registry, docs, onboarding | repo, `.claude/settings.json` |
| Best for | personal workflows, prototypes, audits, one-shot | team-wide write actions with governance | enforcing policy: tests, lints, blocks, audit |
| Anti-use | forcing agent behavior across many people | personal automation for one user | autonomy (hooks don't replace agent workflows) |

In practice **all three coexist in a mature setup**. CLI for 80% of personal work. MCP for team-wide write with audit. Hooks for deterministic guardrails around all of it.

## Migration CLI → MCP — when to promote

A script becomes an MCP candidate when 3+ of these are true:

1. **3+ users regularly.** Everyone has their own copy. Versions drift. Onboarding a new person = half a day.
2. **Write actions with compliance.** The action changes state in a prod / client / regulated system, and after-the-fact audit isn't enough.
3. **Central audit required.** Shell history per laptop isn't enough — security, SOC2, ISO want a single logging point.
4. **Stable contract.** Input/output schema doesn't change every week. MCP is not a good place to experiment with an API.
5. **Allowlist in team policy.** You want to enforce that the agent uses THIS tool, not something it improvised.
6. **Cross-tooling use.** The same workflow must run in Claude Code, Codex, Cursor, Open WebUI. MCP gives you one implementation, many consumers.

If 0–2 are true — stay with the CLI. If 3+ — write the MCP.

**Stepwise migration:**

1. Stabilize the CLI script (tests, README, semver).
2. Identify `tools` in the MCP: each CLI command = one tool, with a clear input schema.
3. The MCP wrapper calls the same CLI underneath. No duplicated logic.
4. Both coexist for the first month. You monitor usage.
5. Disable the CLI in team config; leave it on the owner's laptop.

Anti-pattern: **MCP instead of CLI** when nobody on the team but you uses it. That costs 4× more and delivers 0× more value.

## What's next

If you're considering your first MCP — start with [the first MCP for QA: search/fetch for evidence](/en/blog/first-mcp-for-qa-search-fetch/). The simplest pair of tools with an owner and an audit log.

If you have several MCP and don't know which to keep — audit against the decision tree. Keep those that pass all 6 steps.

If your team boasts *"we have 15 MCP"* — that's a sign of getting stuck at level 7–8 with the [skill-bloat / MCP-everything anti-pattern](/en/blog/ai-adoption-anti-patterns/). Tool count is not a maturity measure. Count of well-chosen, well-maintained ones — yes.
