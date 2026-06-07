---
title: "The /goal command in Claude Code - a session contract that won't let the agent give up"
description: "How /goal in Claude Code enforces completion through a session-scoped Stop hook. Pros, cons, when to use it, how to phrase the condition, and why it matters for QA."
date: 2026-06-10
tags: ["claude-code", "ai", "workflow", "qa"]
lang: en
readingTime: 8
author: GH
---

Anyone working with AI agents for more than a couple of weeks knows the moment: you hand Claude a list of five things, it does three, says "done", and waits. Two tasks vanish somewhere between context drift, history compression, and the agent's eagerness to close the turn. The `/goal` command in Claude Code is a direct answer to that.

This post unpacks what `/goal` actually is under the hood, where it helps, where it hurts, and how to phrase the condition so the agent genuinely finishes the work instead of looping forever.

## A hook that won't let the agent quit

After you type `/goal "<condition>"`, Claude Code activates a **session-scoped Stop hook**. The mechanism: every time the agent tries to end its turn, the hook checks the condition. Not satisfied → blocks the stop, the agent keeps going. Satisfied → auto-clear, the hook disappears on its own without any manual cleanup.

Three properties matter:

- **The hook lives for the entire session**, not just one turn. Once set, it persists until the condition is met or you run `/goal clear`.
- **It survives context compaction** (`/compact`). After history is collapsed the agent still knows what you want, because the condition is injected into every turn as a directive.
- **It doesn't compete with TodoWrite.** Todos are the agent's roadmap - what's still to do. `/goal` is an external contract - when the work counts as finished. Two different tools, not alternatives.

For contrast: an ordinary prompt says "do X". `/goal` says "you cannot stop until X is done and verified". That's the difference between a guideline and a contract.

## Lifecycle in three steps

1. You type `/goal "all tests green and PR open with a description"`.
2. The agent works. Every "I'm done" attempt → hook checks the condition → blocks if not met. The agent receives the feedback and continues.
3. The condition is satisfied → auto-clear. The session returns to normal mode.

You can interrupt at any time via `/goal clear`. You can also inspect the active goal - the system surfaces it in hook messages.

## Pros

**Anti-drift in long sessions.** A 12-file refactor, a batch publication of 6 posts in two languages, a schema migration with tests - these are classic situations where the agent gives up after the first few items. With `/goal`, it doesn't.

**Definition of Done in one line.** You stop asking "did you also do X?". The condition is the contract; either met or not. Less negotiation, less follow-up.

**Survives compaction.** Classic problem: longer session → history compression → agent forgets why it's there. `/goal` is injected into every turn regardless of compaction, so the goal outlives even very long conversations.

**Zero configuration ceremony.** One command, works immediately. No hook authoring, no `settings.json`, no skill loading. It's a built-in Claude Code mechanism.

**It works while you go for lunch.** One of the most practical use cases: set the goal, give auto-approve for safe tools, leave. Come back, see what got done. Without `/goal`, the risk of finding the agent halfway through, waiting for confirmation, is real.

**It pairs naturally with other CC features.** `/compact` for long sessions, `ScheduleWakeup` for polling external systems, `Agent` for parallel work - all work alongside an active `/goal` that holds the definition of completion.

## Cons and pitfalls

**Vague goal = infinite loop.** The most brutal downside. "Fix this properly" with no metric is a recipe for an agent that never considers the work done. The hook has no way to evaluate "properly", so after every stop attempt it returns "not satisfied" and the agent keeps tinkering.

**Padding work.** The related problem: if the agent senses the condition is not clearly satisfied, it appends unnecessary steps just to avoid the stop. A refactor starts to drift into cosmetic edits because the agent is hunting for something to file under "done".

**Invisibility.** An active goal is not loud. It's easy to forget it's there. Classic scene: you want to end the conversation, hit Ctrl+C, and on the next prompt the agent goes back to working on the old goal. You have to remember to `/goal clear`.

**Session-scoped.** Restart the CLI and the goal is gone. This is not a persistence mechanism. Do not rely on it across sessions.

**No edit-in-place.** To change the condition you have to clear and set anew. There is no `/goal update`.

**Conflict with conversational mode.** Q&A, debugging, code exploration - all require frequent stops. A goal only gets in the way there.

## When to use it

- **Multi-step migrations and refactors** with a known end state. "All files use the new import and `npm test` is green."
- **Content production in batches.** "Three posts in PL and EN, consistent frontmatter, clean build, commit and push."
- **Dev → review → ship sequences.** "Feature done, tests green, PR open with description and checklist."
- **Work under a timer.** Long-running CI, deploy, queue. Pair with `ScheduleWakeup` for polling.
- **Work while you step away from the keyboard.** One of the strongest use cases.

## When not to use it

- **Single edit.** Typo, one file, small change - overhead isn't worth it.
- **Debugging and exploration.** You don't know the end state; you can't describe it.
- **Q&A about code.** Question, answer, done.
- **Goals without a measurable metric.** "Better", "elegant", "more idiomatic" are judgments, not conditions.

## How to phrase a goal - a QA checklist

This is where it gets interesting from a tester's angle. A goal is essentially **the session's acceptance criterion**. The rules we know from BDD and test design apply one-to-one.

- ✅ **Measurable.** "Clean build and zero new warnings" beats "fix the build". The first can be verified with one command; the second can't.
- ✅ **End state, not action.** "PR open with a description" > "open the PR". An action can be performed sloppily; an end state is verifiable.
- ✅ **Falsifiable.** You can disprove it with a single check. If your wording forces a judgment call, rephrase.
- ✅ **Conjunction, not disjunction.** "A and B and C" is precise. "A or B" gives the agent a choice that may not match yours.
- ❌ **Adjectives without thresholds.** "Faster", "better", "cleaner" - drop them or replace with a threshold ("< 200 ms", "no duplicates", "lint passes").
- ❌ **Imperative without verification.** "Write tests" is weaker than "line coverage ≥ 80% for file X".

This is literally the same test design problem we solve in functional specifications. `/goal` gives us a DSL to address it at the session level with an agent.

## `/goal` next to other CC tools

| Tool | Scope | Purpose |
|---|---|---|
| `/goal` | session, contract | enforces definition of done |
| `TaskCreate` | session, map | tracks the agent's internal progress |
| Plan mode | one-shot | aligns on the approach before work |
| `ScheduleWakeup` | repeating, timed | polls external state |
| `CronCreate` | persistent | autonomous loop across sessions |

These tools combine, they don't replace each other. Plan mode → alignment. `TaskCreate` → steps. `/goal` → contract. `ScheduleWakeup` → polling.

## QA angle - agent acceptance testing

From the [test architect's perspective](/en/blog/10-ai-workflows-for-test-architect/), `/goal` is a mechanism that directly addresses one of the most painful problems when working with agents: **false success**. The agent claims it's done but isn't, because it stopped before verification or because "done" means something different to it than to us.

If the `/goal` condition is verifiable - driven by `npm test`, `lint`, `gh pr view`, anything deterministic - false success becomes much harder. The agent can try shortcuts, but the hook won't let it stop until the actual check passes.

For [evaluating agent output](/en/blog/evaluating-agent-output/) this has a practical consequence: we don't rely on the declaration, we rely on the condition. The goal is less a productivity tool and more a **runtime validation tool**.

On a team where I'm rolling Claude Code into the QA process, I treat `/goal` as an enforced Definition of Done at the session level. Every serious workflow (regression suite update, bug fix flow, content publication pipeline) has its own goal template - the same way a testing framework has assertion templates.

## Mini case study - this article

Concrete from this session. The goal said: "fix the blog title and write a post about `/goal`". Without a contract the typical path would be:

1. Change the title in one file.
2. "Done, what next?"
3. The human pushes back, the agent picks up the second part.

With an active goal the path was different:

1. Title change across six files (JSON-LD + two indexes + three homepage `<title>` tags).
2. Build verify (153 pages).
3. Pivot to the second part of the goal - propose bullets.
4. Wait for acceptance (because that's literally part of the condition: "after acceptance").
5. Full article, build, commit, push.

The hook didn't let me stop after the first step. Importantly, mid-flight an extra requirement surfaced (Tuesdays reserved for another author), which without the goal would have slipped between tasks - with the goal it got written into memory and addressed before further work.

## Pitfalls seen in practice

- **Imperative-phrased goal** ("do X") - the agent reads it as an action, not an end state. Easy to satisfy with a superficial change. Reword to a state: "X is done and verified".
- **Goal with disjunction** ("A or B") - the agent picks the easier one.
- **Goal conflicting with user feedback** - you want to interrupt, the hook blocks. Use `/goal clear` deliberately.
- **Goal that cannot be satisfied** - the agent will try forever. Check the realism of the condition before setting it.
- **Goal in auto-approve mode with no supervision** - dangerous. An agent with a strong condition and full tool access can do things you didn't want. Keep a human in the loop for destructive steps.

## Practical tips

- **Write the goal as a Definition of Done.** If you can verbalize it for a code review, you can verbalize it for `/goal`.
- **Combine with `TaskCreate`.** Todos = WHAT, goal = DONE. Two layers, both needed for longer workflows.
- **Long tasks → phase them.** Set a goal at the end of each phase, clear at the end of the session. Easier than cramming everything into one condition.
- **Leave a breadcrumb at the end.** After the condition is met, summarize what's next in one sentence. Helps when you come back after a break.
- **Pair with `verification-before-completion`** (skill from Superpowers). The skill tells you how to verify; `/goal` tells you that you must.

## Takeaways

`/goal` is one of the most underrated Claude Code features. It looks like a small convenience but it's a runtime validation mechanism. It lets you swap the declaration "I'm done" for a verifiable end state.

Success depends entirely on the quality of the condition. That's not a tooling problem, it's a test design problem. If you can write good assertions, you can write good goals.

For [test architects and people rolling AI into QA processes](/en/blog/holak-scale/), `/goal` is a real governance tool - it builds confidence that the session ends where we wanted, not where the agent decided was enough.

Next time you start a multi-step task with Claude Code, try to phrase a one-sentence Definition of Done. Type `/goal "..."`. The rest of the session looks different.

---

## Addendum: `/goal` is in Codex too

`/goal` has also shown up in Codex. That matters: the session contract stops being one tool's quirk and becomes a pattern portable across agents. The idea itself doesn't change - it's still a runtime-enforced Definition of Done. If you work in both tools, the same goal templates carry over no matter which agent you're in.
