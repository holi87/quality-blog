---
title: "The Trust Boundary - How to Actually Cross from 8 to 9 on the Holak Scale"
description: "The hardest jump on the Holak Scale isn't technical. Verifiability and reversibility as a framework, a readiness checklist, and two case studies - one team that made it, one that dropped back to 2."
date: 2026-05-22
tags: ["ai", "agents", "adoption", "holak-scale", "governance"]
lang: en
readingTime: 9
author: GH
---

The "Between phase 8 and 9: the trust boundary" section in the [Holak Scale](/en/blog/holak-scale/) describes it in four paragraphs. Four paragraphs is too few, because this is **the hardest jump on the entire scale** - and the one teams trip on most often.

Up to and including level 8, the human leads and the agent executes. From level 9 onward, the human defines the goal and the agent decides the steps. The jump looks technical - *"add agentic mode"* - but it's organisational and psychological.

This article is the framework I use with teams crossing 8→9.

## Why it's not a technical problem

The tools exist. Claude Code agentic mode, Cursor agent, Codex, Aider - all can take a goal and iterate. MCP gives access to systems. Sandboxes are cheap.

And yet most level-8 teams don't move to 9. Why?

- **Humans like to steer.** Every agent step invites "stop, let me suggest something."
- **No owner for errors.** Who's accountable if the agent changes a prod config? Nobody volunteers.
- **Fear of unjustified action.** "What if it does something costly?"
- **Compliance doesn't know what to say.** Because nobody asked anything specific.

All four come down to the same thing: no framework that says *"these actions can run autonomously, these need approval, these are forbidden."*

## Framework: verifiability + reversibility

Two dimensions you have to win on to cross 8.

### Verifiability

Can you easily check what the agent did?

**Mechanisms:**

- **Audit log** of every agent action - who, when, what, why. PostgreSQL or a dedicated log service. *Not* a text file.
- **Dry-run mode** - agent says "I want to do X, Y, Z" and only executes after approval. Default at the start, later relaxed per action class.
- **Diff before apply** - agent shows a diff before changing state. Standard in tools like Terraform plan/apply.
- **Replay** - ability to re-run the same action against the same input state. Requires deterministic snapshots.
- **Evidence trail** - what the agent read before deciding. Helps evaluate decision quality, not just the fact of it.

Without verifiability you don't know whether the agent is good - only that nothing crashed.

### Reversibility

How fast can you undo if the agent went wrong?

**Mechanisms:**

- **Git revert** - all code and config changes in a versioned repo, never a direct edit to production.
- **Snapshot before action** - for data changes: point-in-time backup, snapshot ID in the audit log.
- **Sandbox** - the first action always lands in a test environment; on success, promote to prod.
- **RBAC** - the agent has access only to resources it's ready to handle. Not root, not admin, not *.
- **Kill switch** - one keystroke stops the agent and blocks further actions. Where is it? Everyone on the team needs to know.
- **Blast radius** - before prod: how many records / files / minutes can the agent break in the worst case? If the answer is "I don't know" - you don't ship to 9.

Without reversibility, a single error costs more than a year of savings. You drop back to 2.

## Readiness checklist - 10 questions

Before you grant the agent autonomy in area X, answer each:

1. **Do I have a full action log for area X?** (yes / no / partial)
2. **Can I restore the state from before a change in <5 minutes?**
3. **Do I know which actions are in scope - and that everything else is forbidden?**
4. **Do I have an alert (Slack/PagerDuty) if the agent acts out of scope?**
5. **Do I know who owns errors in area X - name, surname, not "the team"?**
6. **Have I run 5 sandbox tests with real data and compared the output to manual?**
7. **Do I have a kill switch, and has someone on the team already used it in a drill?**
8. **Do I know the maximum cost of a single agent action (money, time, data)?**
9. **Do I have a "manual-correction-required" metric and watch it weekly?**
10. **Is the compliance / security review of this setup documented and signed off?**

Fewer than 8 "yes" answers → you're not at 9. Pushing anyway = the "4→9 jump" anti-pattern.

## Case A: a team that made it

Mid-sized fintech. Stack: GitHub, AWS, in-house microservices. Goal: agent owns the full release-notes lifecycle with a senior-engineer approval gate.

What they built over 6 weeks:

- Audit log in PostgreSQL - every commit the agent read, every decision
- Dry-run: agent says *"I plan to generate the RN draft for version X.Y.Z, covering Q topics, here's a sample"* - senior approves
- Per-component owner: agent knows who to tag in the draft PR
- Sandbox: first 50 release notes generated in sandbox next to the manual ones, compared by hand
- Kill switch: `AGENT_DISABLED=true` env var, agent checks every 30s

After 3 months: 95% of release notes generated autonomously, 3% require minor edits, 2% rejected and regenerated. Trust earned.

## Case B: a team that dropped to 2

Different company, similar size. Goal: agent handles all first-line customer support. Rollout in 2 weeks, "because every hour is savings."

What they didn't have:

- Audit log: agent logs to CloudWatch, nobody reads it
- No dry-run: agent replies to the customer immediately
- No sandbox: day one was production
- No owner: "support team"
- No kill switch: you have to disable the whole integration

Day three the agent promised a customer a refund larger than company policy allows. Customer screenshotted it, posted on LinkedIn. The team disabled the agent for six months, people went back to manual workflow with the *"AI doesn't work"* anti-pattern. 4→9 jump → actual position 2.

## Anti-pattern: "we have MCP, so we're at 9"

The most common illusion. Having [MCP](/en/blog/first-mcp-for-qa-search-fetch/) and connectors is **level 8**. If every agent action requires manual approval by a human, you're at 7 dressed up as 8 - not 9.

Signs you're really at 9:

- The agent starts and finishes tasks without your presence
- Your first interaction with it = a result, not a question
- The human sees the outcome, the agent sees the process
- 80%+ of tasks go through without correction

## What to do tomorrow

If you're at 8 and aiming for 9 this quarter:

1. **Pick one area** - narrowest, lowest-risk, with a clear success signal
2. **Build the audit log + dry-run** - that's the first 60% of the work
3. **Assign an owner** - name, surname, contact channel
4. **Run 20 sandbox attempts** - compare to manual
5. **Ship to prod with a kill switch** - first action must be one click away from being undone
6. **Monitor for a week** - track "actions requiring correction"
7. **Scale to area #2** - only when #1 is stable

Crossing 8→9 isn't a weekend job. It's 6-12 disciplined weeks. But after the first successful crossing the next ones go faster, because the framework already exists.

Earlier sketch - in the [Holak Scale](/en/blog/holak-scale/). This is the framework. In [Evaluating agent output](/en/blog/evaluating-agent-output/) - how to validate the result once you're actually at 9.
