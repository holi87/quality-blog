---
title: "How to Diagnose a Team's AI Maturity in 30 Minutes"
description: "A concrete protocol for scoring a team on the Holak Scale — 8 calibration questions, 5 minutes of live observation and a one-page report. No surveys, no workshops, no slides."
date: 2026-05-21
tags: ["ai", "adoption", "diagnosis", "teams", "holak-scale"]
lang: en
readingTime: 10
author: GH
---

The [Holak Scale](/en/blog/holak-scale/) describes 11 levels of AI adoption, from resistance to orchestration. The question that comes up in every conversation with a manager is: **"OK, but how do I know where my team is?"**

The answer is simple: in 30 minutes. No surveys, no full-day workshop, no slides. Below is the protocol I use with clients.

## What you walk away with

A single A4 page:

- the individual's level
- the organisation's level as the individual sees it
- the gap, if any
- two "what next" recommendations
- one thing to **avoid**

That's it. Nothing more is required to plan the first step.

## Session format

30 minutes, 1:1, camera optional. Better to do it in a tool that already has a chat panel — so you can ask them to show something live.

Schedule:

| Time | What | Goal |
|------|------|------|
| 0–5 min | Context | Role, industry, tools, time using AI |
| 5–20 min | 8 calibration questions | Data for scoring |
| 20–25 min | Live observation | Validation of claims |
| 25–30 min | Feedback | Spoken summary + one written recommendation |

## Calibration questions

Eight questions, two per phase. Don't ask "which level are you on?" — the answers are distorted. Ask about behaviour.

### Start phase (level 0–1)

1. *"Show me how you usually start a session with AI. What do you actually type?"* — looking for: no account vs one-off try vs habit. No account = below 1.
2. *"When did AI last surprise you — good or bad?"* — no such moment = level 0–1. A fresh surprise = at least 2.

### Intentional use phase (level 2–4)

3. *"Do you have a prompt template you use more than once a month? Show me one."* — none = level 1–2. A "cite 3 sources" template = 3. A template with role, goal, constraints, output format = 3.
4. *"What's in your custom instructions / model settings?"* — "nothing, never touched it" = level 1–3. A few lines about yourself = 4. Half a page reviewed quarterly = solid 4.

### Context and knowledge phase (level 5–8)

5. *"Show me an AGENTS.md or CLAUDE.md from any project of yours."* — no such file = level 4 or below. File exists, last touched six months ago = level 5 with the documentation-graveyard anti-pattern. File touched this week = 6.
6. *"Do you use any MCP / connectors / AI plugins? If so, name three and tell me when each last didn't disappoint you."* — none = 5–7. Names + concrete stories = 8. List with no stories = 6–7 dressed up as 8.

### Autonomy phase (level 9–10)

7. *"Tell me about the most recent task an agent did end-to-end — without you intervening in the middle."* — none = below 9. Short anecdote = 9. "I have one daily" + example = solid 9.
8. *"In the last month, have you designed a system of multiple agents collaborating? What was it?"* — no = not above 9. Yes + a coherent description = 10.

## Live observation (5 minutes)

The most important part. It typically corrects the self-assessment downward by 1–2 levels.

Ask: *"Open your favourite AI tool and do something you do once a week. Think out loud."*

Signals:

- **Opens a clean window with no settings** — level 1–2, regardless of what they said earlier.
- **Pastes a prompt from a document** — prompt fetishism, level 3 with the anti-pattern.
- **The model already knows the context, the prompt is short** — level 4+.
- **Invokes a skill / project / configured workspace** — level 5–7.
- **Performs MCP actions (writes a file, pushes, posts to Slack)** — level 8.
- **Types a goal and walks away from the screen** — level 9.

## Scoring

For each question, record a level 0–10. Then:

- **Individual level** = median across 8 questions + observation. Median, not maximum. The most common beginner error: "I have custom instructions, so I'm at 4" — but every other answer says 2.
- **Organisational level** = inferred through questions 5, 6, 8. Probe: *"Is this your personal setup or the official company stack?"* If personal, the organisation is lower.

## Red flags in answers

Signals that the self-assessment is inflated:

- **"We have MCP" with no answer to "who authorises actions"** — still level 6–7 dressed up as 8.
- **"I use it daily" with no distinction between tasks** — daily Q&A is still level 1.
- **"The whole team is at X" with no sample** — an average in a management memo is not a diagnosis.
- **"We had a prompt-engineering training"** — training doesn't change levels, behaviour does.
- **"We have it all in Confluence"** — Confluence is documentation for humans, not context for agents.

## Report — one-page format

Email after the session:

```
Interviewee: Name Surname, role, company
Session date: YYYY-MM-DD, duration: 30 min

Individual level: [X / 10]
Organisational level per interviewee: [Y / 10]
Gap: [description or "none"]

Recommendations:
1. [concrete action for 1-2 weeks, e.g. "write a CLAUDE.md for the main repo, max one page, review in two weeks"]
2. [concrete action for 1 month, e.g. "pick one MCP server, install it, use it 10 times in real work"]

What to avoid:
- [concrete warning, e.g. "don't buy a multi-agent framework subscription until a single agent handles 80% of tasks"]
```

## What I usually see

From the last few dozen diagnoses:

- Median in engineering teams: **3** (frameworks, prompt libraries).
- Median in management teams: **2** (chat, occasional use).
- Most common gap: individual 4–5, organisation 2. *"I'm at 5, but at work I have to stick to vanilla ChatGPT because nothing else is approved."*
- Most common inflated self-assessment: by 2 levels. *"I'm at 7"* → actually 4–5 after observation.

## What's next

Diagnosis is a start, not a goal. After the session, pick **one** level to cross in the next quarter. Not two, not three. One — with a concrete crossing signal (e.g. "CLAUDE.md in the main repo updated within the last week").

Come back to the same interviewee every quarter. Three diagnoses a year show a trajectory — which matters more than a point estimate.

Version 3 of the Holak Scale will ship this protocol as a PDF template with scoring. If you use it now and see gaps — [get in touch](https://holak.net.pl).
