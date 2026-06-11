---
title: "Advisor in Claude Code: a second opinion from a stronger model before you commit to a path"
description: "The advisor() tool forwards the full transcript to a stronger model and returns an opinion. When to call it before work, when NOT for every step, how not to turn it into endless consultation."
date: 2026-05-14
tags: ["ai", "claude-code", "advisor", "workflow"]
lang: en
readingTime: 7
author: GH
---

Claude in your terminal writes a solution. How does it know it's good? By default: it guesses. First shot, sometimes second. If it cements an incorrect interpretation of the problem - you find out an hour later when debugging starts creaking. The `advisor()` tool breaks that loop: Claude calls a stronger model, gets a second opinion, decides based on both.

## What it actually is

Advisor is a tool built into Claude Code (formerly in beta, stable in 2026). It works like this:

- Claude calls `advisor()` with no parameters
- Your entire transcript (task, every tool call, every result, every piece of reasoning) goes to a stronger model (usually Opus from the reviewer pool)
- Advisor reads it all and replies - diagnosis, suggestion, warning
- The output comes back as a tool result to the main Claude

There is no `prompt:` or parameters. Context forwarding is automatic. That's intentional - so the advisor sees exactly what someone reading the transcript would see, with no "summarized" brief that could skip details.

## When to call it

The Claude Code docs name four moments:

1. **BEFORE substantive work.** Before you write the solution or cement an interpretation of the problem. This is the crucial moment - cheapest to correct direction here, most expensive after a week of work
2. **When you're stuck.** Errors recurring, approach not converging, results that don't fit the hypothesis
3. **When changing approach.** Before abandoning the current path - maybe a smaller correction is enough
4. **Before declaring "done".** Final check that nothing important is missing

In my workflow: on tasks longer than a few steps, I call advisor at least twice - before committing to an approach and before declaring done. Short reactive tasks ("run the test, fix it, recommit") can skip it.

## When NOT to call it

Advisor isn't an oracle. Don't call it:

- **For every step.** Each call forwards the full context - expensive and slow. If your plan is clear and the next step is an obvious "run the test," advisor won't help
- **After a short 1-2 step task.** Call overhead > value of a second opinion
- **When you know exactly what to do.** If the problem is obvious (typo, missing import), advisor adds nothing
- **As a substitute for writing code.** Advisor won't solve it for you - it gives an opinion, the decision stays with you

## Cost

Advisor burns the stronger model's context on the entire conversation history. That's expensive. Specifically:

- All messages + tool results are forwarded (your transcript)
- The advisor's output is one response (usually a few pages of text)
- Price = (transcript tokens + response tokens) × stronger model's cost

For long sessions (50k+ tokens of history) one call costs noticeably. Three calls in a session = three times that cost. Two well-aimed calls beat ten scattered ones.

## Best practice: save before you call

A subtle thing worth internalizing. An advisor call takes minutes (not seconds - it's long generation on the reviewer model side). The session can die during that window (network glitch, terminal close, runtime error). If your deliverable lives only in a transient message - it's gone.

Rule: **commit / Write / save BEFORE advisor()**. The actual file persists. The advisor's tool result is a bonus, not the deliverable.

In practice:

1. Implementation done
2. `Write` the final file
3. `git commit` (no push yet - something might still surface)
4. `advisor()` - wait a few minutes
5. Read the opinion → if OK, push. If it flagged something, fix → go to 2

## Trust but verify

Advisor sometimes gets it wrong. It has the full transcript but didn't run the code - opinion, not result. Three patterns where you should ignore it:

- **Empirical contradiction.** You ran the step, the result differed from what the advisor predicted. Stick with the evidence; the advisor may have under-weighted your tool results
- **Primary source contradiction.** Advisor says "this function doesn't exist in library X," but you just read the documentation showing it. Docs > opinion
- **Passing self-test ≠ advisor is wrong.** The reverse case: if your test passes but the advisor says "you have a bug" - that doesn't mean the advisor is wrong. Your test may not be checking what the advisor is pointing at. Look more carefully

Rule: if you have primary-source evidence contradicting the advisor, stick with the evidence, but consider one more reconcile call: "I found X, you suggest Y - which constraint breaks the tie?"

## A real workflow example

Task: refactor an auth middleware class with a feature flag toggle.

```
1. Read the current code (Read x3)
2. advisor() - "Here's my plan: extract interface, two implementations,
   factory. Do you see a problem before I write?"
3. Advisor: "Watch the request lifecycle. The factory has to be
   per-request, not per-app, otherwise the feature flag won't switch
   between requests"
4. Adjust plan, write code
5. Run tests
6. Tests pass
7. advisor() - "I'm done. Any risk before I merge?"
8. Advisor: "Migration: the old class is still referenced in 3 places.
   Either remove the references or leave a deprecation warning"
9. Fix references → re-test → commit → push
```

Two advisor calls, both on decision boundaries. I didn't call advisor between steps 4-5 or 5-6 because that part was mechanical.

## Anti-patterns

- **Advisor instead of thinking.** "What should I do" → advisor → I copy the suggestion → I get stuck on an implementation I don't understand. Advisor points to the direction; you understand the road
- **Advisor after every tool use.** Expensive, slow, pointless. Most tool calls don't need a second opinion
- **Treating advisor as an oracle.** It gives an opinion based on text, not on execution. Verify against reality

## When advisor really pays off

If the task has the trait "source of truth is complex and easy to misinterpret," advisor at point 1 (before substantive work) pays for itself many times over. Examples: refactoring an existing system, debugging a complex error, an architectural decision. Here the first shot has big consequences, and a second opinion catches interpretation errors early.

For mechanical tasks ("run the test, fix lint," "add tests to a simple function") advisor is overkill.

## Crosslinks

[Subagents](/en/blog/subagents-claude-code-what-and-why/) - a different delegation mechanism. [`prompt-master`](/en/blog/prompt-master-skill-claude-code/) - yesterday's skill. Tomorrow: [writing your own subagent](/en/blog/custom-subagent-claude-code-example/) - series finale.
