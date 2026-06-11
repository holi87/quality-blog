---
title: "Where the Holak Scale Fails - Self-Criticism"
description: "Every model is a tool, not a truth. Six places where the Holak Scale actually fails when working with teams, plus reader feedback to address in version 3."
date: 2026-06-05
tags: ["ai", "adoption", "holak-scale", "self-criticism"]
lang: en
readingTime: 6
author:
  - GH
  - KG
---

The v2 [Holak Scale](/en/blog/holak-scale/) had a section *"Where this model fails"* - four points, each in 2 sentences. After dozens of diagnoses and conversations with readers, we see it's not enough. Version v2.1e changed the structure of the scale (12 levels, agentic OS at 11), but the self-criticism is about issues no cosmetic iteration solves - which is why we're moving it into a dedicated post.

This article expands the self-criticism. Because every model is a tool, not a truth - and there are places where this scale consistently misleads people.

We're writing this together because each of us sees different cracks. Konrad observes delivery teams where the scale gets used as a label. Grzegorz wrote it originally and sees its boundaries from the author's perspective.

## 1. Linearity that doesn't exist in the world

The scale looks linear: 0 → 1 → 2 → 10. It suggests maturity is a scalar.

In real teams it isn't:

- In coding the engineer is at 8.
- In writing emails - at 1 (vanilla window, single question).
- In data analysis - at 4 (custom instructions for R/Python, no skills).
- In customer support - at 0 (doesn't use AI at all).

Same person. Four different levels in four different days.

**What the scale lacks:** a task × domain dimension. Version 3 will have a matrix, not just a scale.

## 2. Unequal value across levels

The scale treats every step the same. *"From 1 to 2"* looks like *"from 9 to 10"*. Visually and structurally.

In practice the value curve is heavily front-loaded:

- The 1 → 4 jump: 50-70% of maximum adoption value. Cheap, fast, sufficient for most users.
- The 4 → 8 jump: another 25%. Requires organisational discipline, much longer.
- The 8 → 10 jump: the last 5%. Expensive, risky, sensible for a very narrow set of use cases.

For 90% of teams **aiming at 4-5 yields more ROI** than aiming at 10. The scale doesn't show this.

**What's missing:** a value/cost map per jump. Version 3 will have this curve as a diagram beside the scale.

## 3. Tools age

The scale describes the *kind* of capability, but when people read it - they think *tools*. *"Level 8 is MCP"* - true in 2025, different in 2026.

Concrete ageing:

- Level 5 in 2025 = writing `.cursorrules`. In 2026 = AGENTS.md / CLAUDE.md / .cursorrules - three formats, [each for something different](/en/blog/agents-md-claude-md-cursorrules-comparison/).
- Level 7 in 2025 = your own skills. In 2026 = plugin marketplace + community-shared skills - different economics.
- Level 8 in 2025 = first MCP in use. In 2026 = the question isn't "do I have MCP" but "[do I have too many](/en/blog/mcp-when-it-helps-when-overengineering/)".
- Level 10 in 2025 = autonomous agents demo. In 2026 = the skeptical question ["isn't one agent enough"](/en/blog/multi-agent-orchestration-when-one-agent-is-enough/).

**What's missing:** scale versioning. Version 3 will carry a date and a list of reference tools per level, explicitly tagged *"as of Q2 2026, check whether still current"*.

## 4. No ethics

The scale measures technical capability. It doesn't address what that capability is *used for*.

You can be at level 10 and:

- generate disinformation at scale
- automate decisions that exclude groups of people
- build systems that bypass regulations
- amplify bias nobody audits

Technical maturity ≠ moral maturity. And the scale suggests "higher" is always *better*.

**What's missing:** an ethics / governance axis as a separate dimension. Version 3 may introduce a 2D scale - *technical maturity* × *ethical maturity*. Or a sixth phase. Open question.

## 5. People identify with a level

Not a model bug - a usage bug. But the scale enables it.

Konrad's observation from delivery: interviewees say *"I'm at 5"* the way they say *"I'm an extrovert."* That means: identification, not diagnosis.

Consequences:

- Harder to step back - *"but I was at 5, how do I admit I'm now at 4?"*
- The scale becomes a ranking, not a tool.
- Teams argue who's at 7 and who's at 6 instead of asking *"what next?"*

**What's missing:** clearer framing of the scale as a state, not a trait. Version 3 will say explicitly *"a level is a temporal, context-dependent state, not an identity."*

## 6. No feedback loop after publication

The original scale had no mechanism to gather experience. *"Version 3 will appear when I have enough material"* sounds good, but there's no channel.

In the weeks after publication we received ~30 deployment stories by email. Each contained something the scale doesn't cover. But 30 inbox emails ≠ structured feedback.

**What's missing:** a survey / form for diagnoses. Version 3 may have a dedicated GitHub repo with case-study templates, or a simple page collecting entries.

## Reader feedback - recurring themes

In the emails we received:

- **"What about those who had to step back?"** - e.g., a company at 8 returns to 4 after an incident. The scale has no downward path.
- **"What if an organisation has 3 levels at once across teams?"** - Sales at 1, Engineering at 7. Does it make sense as one rating?
- **"Are there industries where level 8 doesn't make sense?"** - medicine, law, education. Sometimes a regulatory cap exists.
- **"Is level 0 really a position?"** - ethical arguments for refusal. No shame in it.
- **"Missing the team dimension between individual and organisation"** - squad / domain / vertical.

We'll address all in v3.

## What "self-criticism" means

The point isn't to show the scale doesn't work - it does, we use it weekly. The point is to show **where** it doesn't work, because without that section the reader falls into treating the model as truth.

Every model is a tool. A tool has a sharp edge but also a blunt end. Knowing which end is which - that's the difference between using and injuring.

Version 3 will address at least four of the six points above. If you see **a seventh** we haven't listed - [get in touch](https://holak.net.pl). We're actively collecting material.

This ends the series expanding the scale. Nine posts, from the [30-minute diagnosis](/en/blog/ai-maturity-diagnosis-30-minutes/) to this self-criticism. The next iteration will be version 3 - with fixes from this self-criticism and material gathered from your deployments.
