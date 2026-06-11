---
title: "AI Adoption Anti-Patterns - 7 Ways to Get Stuck"
description: "Most teams don't get stuck because of missing tools - they get stuck on specific patterns of thinking. The seven most common anti-patterns from the Holak Scale, a recognition test, who gets caught, and how to get out."
date: 2026-05-25
tags: ["ai", "adoption", "holak-scale", "anti-patterns", "teams"]
lang: en
readingTime: 8
author:
  - KG
  - GH
---

The [Holak Scale](/en/blog/holak-scale/) lists five anti-patterns in a single section. After dozens of conversations with teams we see it's not enough - and that the "one line + bullet" format doesn't help anyone get out of them.

This article expands the list to seven, adds a recognition test per pattern, describes who gets stuck most often, and shows a concrete way out.

We wrote it together because each of us sees a different side of these stories. Konrad - from a delivery-team perspective at Sii. Grzegorz - from an AI-ambassador perspective at banks and fintechs.

## 1. "I use AI daily" - stuck at 1

**What it is:** daily questions to ChatGPT or Claude, but always in *"ask - receive an answer"* mode. Nothing more. No iteration, no context, no settings.

**Test:** *"What's new in your AI workflow from the last month?"* - if the answer is "nothing, but I use it daily" → stuck at 1.

**Who gets stuck:** most often managers who decided adoption = usage. Also engineers who tried a few models and picked one.

**Way out:**

1. Note 5 recurring question types from the last week.
2. Build one prompt template per type - with role, context, format.
3. For a week, use only the templates. After a week you're at 2-3.

## 2. Prompt fetishism - stuck at 3

**What it is:** a library of "golden prompts" in Confluence or Notion. Each is 100-300 lines. You copy from the doc, substitute variables, send.

**Test:** *"Show me the prompt you use daily. Where do you copy it from?"* - if from a document, if it's long, if you're proud of the structure → prompt fetishism.

**Who gets stuck:** teams that started with a prompt-engineering workshop and never moved past it. Also individual engineers who built their own "golden set" solo.

**Way out:**

1. Pick the prompt you use most often.
2. Extract the content that doesn't change (role, style, constraints) - move it to custom instructions.
3. Extract project-specific knowledge - move it to [AGENTS.md / CLAUDE.md](/en/blog/agents-md-for-test-automation/).
4. Leave only the task goal in the prompt. It should fit in 3-5 lines. You're at 4+.

## 3. Documentation graveyard - stuck at 5

**What it is:** the project has `AGENTS.md` or `CLAUDE.md` - written once, six months ago. Nobody remembers what's in there. The agent still works, but "more from memory than from the file."

**Test:** *"Open CLAUDE.md and tell me what changed in the last month."* - silence → graveyard. Edit once a month or after any significant project change.

**Who gets stuck:** teams that introduced context files enthusiastically but never put them in retros / weekly reviews. Also seniors who wrote the file and moved on to other topics.

**Way out:**

1. Add a retro question: "does CLAUDE.md still match how we actually work?"
2. Every meaningful workflow change = PR to the context file.
3. Every quarter, review with the agent: *"list things in CLAUDE.md that don't match the current code."*

## 4. Skill bloat - stuck at 7

**What it is:** dozens of skills, dedicated agents, per-task config files. Nobody remembers what each does. The agent rarely picks the right one.

**Test:** *"Name 5 skills you use weekly and describe how they differ."* - no fluent answer → bloat.

**Who gets stuck:** teams enamoured with "we have our own skills." Also team leads who wanted to demonstrate internal output.

**Way out:**

1. Audit: for each skill, count invocations over the last 30 days.
2. Skills with <5 invocations - delete or merge.
3. Skill with no owner - delete.
4. Skill with overlapping functionality - consolidate.

Target: <8 skills, each described in 1 sentence, each with an owner.

## 5. False maturity 8 - faking 8 from 6-7

**What it is:** the company boasts: *"we have MCP, we have connectors, we have 15 integrations."* But every agent action requires a manual click to approve. A human is still leading step by step.

**Test:** *"Show me one agent action from the last week that ran in a real system without your click."* - no such example → false 8.

**Who gets stuck:** companies with strict security/compliance who added MCP without a permissions framework. Also teams chasing hype - they want to say "we have MCP" in slides.

**Way out:**

1. Pick **one** low-risk action (e.g., creating a Jira ticket).
2. Build the [verifiability + reversibility framework](/en/blog/trust-boundary-from-8-to-9/).
3. Enable autonomous execution for that one action.
4. Monitor for a week. Scale to the next action.

## 6. The 4→9 jump - an agent with no context

**What it is:** *"We'll install an agent and let it run."* No context files, no skills, no MCP. The agent hallucinates, the team loses trust, drops to 2 with the *"AI doesn't work"* motto.

**Test:** *"How does the agent know your repo's conventions?"* - if the answer is "it figures it out" → 4→9.

**Who gets stuck:** teams under deadline pressure. Also managers who saw a demo at a conference and bought the tool the same day.

**Way out:**

1. **Step back** to level 5. This isn't failure - it's discipline.
2. Write CLAUDE.md / AGENTS.md in one weekend.
3. Give the agent 5 tasks in a sandbox and compare with manual.
4. Only then enable autonomy on one chosen task.

## 7. Orchestrating mediocrity - faking 10 without 9

**What it is:** three or five agents collaborate. None of them handles a single task end-to-end. Result: three times the errors, three times the cost, same outcome as with one agent.

**Test:** *"Does a single agent handle 80% of tasks in this domain?"* - if no → don't build a team, fix the individual.

**Who gets stuck:** teams inspired by multi-agent frameworks. Also companies that want to write "we have orchestration" in their deck.

**Way out:**

1. Stop the multi-agent project.
2. Pick the weakest agent on the team.
3. Make it succeed at 80% of its domain as a solo unit.
4. Repeat for each.
5. Only then return to orchestration - and check whether it's still needed.

## What they have in common

All seven share the same root: **confusing activity with maturity**.

- "I use it daily" ≠ I'm advanced
- "I have a prompt library" ≠ I'm at 4
- "I wrote AGENTS.md" ≠ I work with context
- "I have 15 skills" ≠ I have a strategy
- "I have MCP" ≠ I have autonomy
- "I have an agent" ≠ I delegated a goal
- "I have many agents" ≠ I orchestrate

A test that catches them all: *"show me a concrete output from the last week and tell me how much time it saved vs the old workflow."*

No answer = one of the patterns.

## What's next

In the [Holak Scale](/en/blog/holak-scale/), anti-patterns were a starting point. Here they have exits. Version 3 of the scale will collect these into a single table linked to checklists (we're still gathering material - if you see one of them in your team, [get in touch](https://holak.net.pl)).

In practice: the biggest gain comes from **admitting you're in one of the patterns**. The rest is discipline.
