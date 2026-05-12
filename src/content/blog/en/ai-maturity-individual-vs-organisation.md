---
title: "Individual 9, Company 2 — What to Do About AI Maturity Gaps"
description: "Most companies measure the maximum instead of the median. How to detect a gap between individual and organisational maturity, how to compute the median, and what to actually do if you're a level-9 engineer in a level-2 company."
date: 2026-05-25
tags: ["ai", "adoption", "holak-scale", "teams", "governance"]
lang: en
readingTime: 9
author: GH
---

The [Holak Scale](/en/blog/holak-scale/) has a section on the two dimensions: individual and organisation. It was one of the most-cited parts after publication — because everyone sees the gap between themselves and their employer.

This article expands on it. For **managers** — how to actually measure your organisation. For **engineers at 9 in a company at 2** — how not to burn out. For **AI ambassadors** — how to run conversations with compliance and the board.

## Why the gap appears

Two systems learn at different speeds:

- **The individual** learns in 2–6 weeks. Custom instructions, CLAUDE.md, MCP — tools are public, tutorials are free, feedback is instant.
- **The organisation** learns in 12–24 months. Every new stack needs security review, RBAC, data policy, training, change management, budget.

The gap is natural. The problem starts when both sides **pretend it isn't there**.

## Three typical patterns

### Pattern A: individual 9, organisation 2

The engineer runs autonomous agents on pet projects. At work they fire up ChatGPT in a vanilla window because internal tooling doesn't allow anything else. "Compliance hasn't approved."

**Cost:** wasted talent. The engineer loses motivation, leaves within a year for a company at 5.

**Signal:** conversations like *"that won't fly here"*, *"maybe in two years"*. Silence in retros around "how we work."

### Pattern B: individual 3, organisation 7

The company rolled out AGENTS.md, stood up MCP servers, hired an AI ambassador. But the average engineer still copies prompts from Confluence — because they don't know skills built by the platform team exist.

**Cost:** wasted infrastructure. ROI drops to 10% because only 5% of the team uses it.

**Signal:** internal dashboards show high token consumption from a small handful of users. *"We have great tools, just nobody uses them."*

### Pattern C: individual 5, organisation 5 (aligned)

A rare, healthy state. The company invests in education, engineers have a voice in tooling, the weekly AI sync isn't a hype demo — it's a reflection on *"what's working."*

**Signal:** retros include *"does our CLAUDE.md / AGENTS.md match practice?"*

## How to compute the organisational median

**Most common mistake:** measuring only leaders. *"Our AI ambassador is at 9, so the company is at 9."* No. The company is at the median of the sample.

**Method:**

1. **Sample.** Randomly pick 15–30 people across all org levels. Not volunteers — random.
2. **Diagnosis.** Use the [30-minute protocol](/en/blog/ai-maturity-diagnosis-30-minutes/) per person. Yes, that's 7–15 hours total.
3. **Distribution.** Record all levels in a sheet. Histogram. Median, not average.
4. **Spread.** Median + min + max + p25 and p75. Spread shows whether the company is homogenous.

**Red flags in the results:**

- Spread > 5 (e.g., min 1, max 9) — divided company, polarisation risk
- Median < 3 — most of the team is at chat level
- p25 = 0 or 1 — every fourth person is in resistance, check whether it's a choice or fear

## What a level-9 engineer in a level-2 company does

A common real-world situation. Five options, from least to most radical.

### Option 1: safe channels

Use what the company allows in maximum scope. Custom instructions in the tool you have officially. Context files in a private branch (not the prod repo). Skills locally.

**Limit:** you'll get to 4–5 at work. Full 9 stays in pet projects.

### Option 2: be a greyhound

Propose a pilot to leadership. 1 team, 1 project, 3 months, defined success. Show the numbers. Win the pilot — and expand.

**Limit:** requires political energy. Works if you have a director-level sponsor.

### Option 3: an education channel

Brown bag weekly, internal newsletter, demo days. Don't push tools — show value. After a few months adoption grows organically.

**Limit:** slow, months until impact. Requires patience.

### Option 4: AI ambassador role

Negotiate a formal role with your manager. 20% time on adoption, measurable goals, tooling budget. Requires political capital.

**Limit:** the role only exists in companies that commit to AI. Others won't even let you define it.

### Option 5: change jobs

Sounds radical, but in 2026 it's a real option. Level 5–6 companies actively recruit from level-2 ones. Market check is simple: if your job regularly blocks you from tools juniors at other companies are learning — it's time to leave.

**Limit:** personal decision, not tactical.

## What a manager in a level-7 company with median 3 does

The other side: great infrastructure, nobody uses it.

**What works:**

1. **Internal champions.** Pick 1–2 people per team, give them 10% time to be "guides." Measure usage growth in their team.
2. **Buddy programs.** Pair a new user with a champion for 2 weeks. Critical metric: prompts/day before and after.
3. **Use case library.** Specific short recordings *"how Iwona saves 45 minutes a week on X."* Not generic *"AI boosts productivity."*
4. **Defaults.** Team-level custom instructions pre-defined. Skills visible in the UI. CLAUDE.md in every repo with a template to fill in.

**What does NOT work:**

- A leadership mandate — *"everyone must use it."* Increases resistance.
- A single training — training doesn't change levels, behaviour does.
- A dashboard with numbers and no context — *"we burned 5M tokens"* means nothing.

## Governance — who decides

Three decisions that need an owner:

1. **What can be deployed (tools, MCP, agents).** Owner: CISO + Head of Engineering.
2. **What is forbidden (data class, production actions).** Owner: Compliance + DPO.
3. **What is measured (levels, usage, ROI).** Owner: AI ambassador / Head of Productivity.

Without an owner per category, every new MCP triggers a 3-week from-scratch discussion. With an owner — decisions in hours.

## What's next

Measure the organisation quarterly. Three diagnoses a year show the trajectory. Trajectory matters more than a point estimate.

If you're a level-9 engineer in a level-2 company — pick **one** of the five options. Don't try all at once. Measure the result after 3 months. Adapt.

If you're a manager of a level-7 company with median 3 — pick **two** champions. Give them 10% time. Measure delta usage in their teams after a quarter.

Everything else is theory nobody remembers in production.
