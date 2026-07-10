---
title: "An Agent Fixes E2E Tests: A Playwright + Claude Code Workflow Step by Step"
description: "How to build a workflow where an agent diagnoses failed e2e tests and opens a PR with a fix - plus the four agent mistake patterns you need to know before you trust it."
date: 2026-07-10
tags: ["ai", "qa", "playwright", "agents", "test-automation", "ci-cd"]
lang: en
readingTime: 9
author: GH
---

An e2e test failed on CI at three in the morning. By eight, a pull request is waiting in the repository with a root-cause diagnosis, a screenshot from the point of failure, and a fix ready for review. This workflow has been running for me for several months, and you can build it in a single day. In this post I show how, step by step - and I show just as carefully where the agent gets it wrong, because without that second part the whole thing is dangerous.

## What the agent needs as input

Most failed attempts at automating test repair die on the same thing: the agent gets too little context. An error message like `TimeoutError: locator.click: Timeout 30000ms exceeded` on its own tells you next to nothing. Based on that alone, the agent guesses - and a guessing agent is worse than no agent at all.

On failure, Playwright can collect three kinds of evidence when the relevant artifacts are explicitly enabled in configuration:

- **Trace** - the full sequence of test actions with DOM snapshots before and after every step. This is the most valuable source: the agent sees how the page actually looked at the moment of failure, not how it was supposed to look.
- **Screenshot** from the moment of failure - cheap to analyze and often enough to tell "the element did not load" apart from "the element is there, but covered by a cookie consent banner".
- **DOM context** - element-tree snapshots stored in the trace. The agent compares the selector from the test against the actual page structure and sees whether the element changed attributes, disappeared, or merely moved.

On top of that I add two things from outside the Playwright report: the diff of application changes since the last green run, and the history of that specific test from the last two weeks. The first lets you tie the failure to a code change; the second distinguishes a fresh regression from a test that has been flaking for ages.

## Step by step: building the workflow

The whole workflow consists of five steps. I assume Playwright on GitHub Actions and Claude Code as the agent, but the mechanics carry over to other tools.

1. **Enable artifacts on failure.** In the Playwright config, set traces and screenshots to be produced only for failed tests - otherwise CI will start churning out gigabytes.
2. **Trigger the agent after a red run.** A separate job in the CI pipeline runs conditionally when tests fail, downloads the artifacts, and launches the agent with read-only access to the repository plus the right to create a branch.
3. **Give the agent a diagnostic instruction, not a repair instruction.** The prompt says: "determine the cause, classify it as an application regression, a test problem, or an environment problem, and only then propose a change". The ordering matters - an agent asked to fix things right away will fix things, even when what needs fixing is the application.
4. **The agent opens a PR, never merges.** The output is a branch with the fix, a diagnosis written into the PR description, and a label distinguishing agent fixes from human ones.
5. **A human approves.** There is a separate section on this below, because it is not a formality.

The minimal piece of Playwright configuration everything depends on:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  reporter: [['html'], ['json', { outputFile: 'results.json' }]],
});
```

The JSON report is for the agent, the HTML for the human. Same failure, two audiences, two formats.

## The diagnostic instruction in practice

The content of the agent's instruction is half the success of this workflow, so let me spell it out in more detail. My version has four parts. The first defines the role and scope: "you are an engineer diagnosing an e2e test failure; your job is the diagnosis, not a green run at any cost". That sentence sounds banal, but it genuinely changes behavior - without it the agent optimizes for the test passing, with it for the diagnosis being true.

The second part enforces an output format: cause classification (application regression / test problem / environment problem / unknown), supporting evidence with concrete references (a trace line, a DOM fragment, a commit hash from the diff), the proposed change, and a confidence level. The "unknown" category is mandatory in the vocabulary - an agent deprived of that option will always invent something, and an invented diagnosis is worse than admitting a lack of data. A PR classified as "unknown" still has value: it is pre-filtered material for a human, with the context already gathered.

The third part is the prohibitions: do not change expected assertion values without pointing to an intentional change in the application, do not raise timeouts, do not remove steps, do not touch files outside the test directory. The fourth is resource limits - a time budget and an attempt budget. An agent that has no diagnosis after two attempts ends with a report of what it found, instead of grinding tokens until something gives.

The "application regression" classification deserves its own sentence: in that case the agent does not propose a test change at all. It opens a bug report with the diagnosis and evidence, and the test stays red - because it should be red. This is the moment the workflow stops being "test fixing" and becomes what it is really supposed to be: shortening the path from signal to decision.

## The hard rule: the agent proposes, a human approves

In my workflow the agent has no write access to the main branch and no right to approve its own PR. This is not temporary caution for the rollout period - it is a permanent design element. The reason is simple: a failed e2e test is a signal. Automatically "fixing" the test without understanding the signal is muting the fire alarm because it beeped at night.

> A red test is a signal, not a diagnosis. Its cause may be an application regression, a broken or stale test, test data, the environment, or genuine flakiness. In my workflow the agent classifies roughly eighty percent of cases correctly. The entire value of the human in this workflow lives in the remaining twenty.

Reviewing a PR from the agent usually takes me five minutes, because a good diagnosis in the description does most of the work. I check three things: whether the cause classification matches the application diff, whether the fix changes the test rather than its meaning, and whether the agent has not loosened any assertions.

## Where the agent gets it wrong - four patterns

After several months of reviewing these PRs, I have a catalog of typical mistakes. Each of them looks like a fix and is actually damage.

| Agent mistake | What it looks like in the PR | How to catch it |
|---|---|---|
| Fixes the assertion instead of the application | The expected value in the test changed to whatever the broken application returns, e.g. price 89.99 swapped for 99.89 | Confront every expected-value change with the requirement or the diff - was the application change intentional? |
| Masks a regression with a selector | The element disappeared because a feature stopped working, and the agent "fixed" the locator to point at a different, similar element | Compare the screenshot against the expected state - should the element really be there? |
| Treats the symptom with a timeout | Timeout raised from 30 to 90 seconds, test green, application three times slower | A timeout change in an agent PR is always a yellow flag - ask what caused the slowdown |
| Removes a "redundant" step | The step that was failing simply vanished from the test, along with the assertion it was setting up | Read the test diff for coverage loss, not just for changes |

The first pattern is the most dangerous, because it looks the most innocent. The test expected the message "Order accepted", after a regression the application shows "Order was accepted", the agent decides the difference is a typo in the test and fixes the assertion. Except it was the application that changed - and possibly changed by accident, in a refactoring reflex nobody noticed. That is why my agent prompt contains an explicit prohibition: "do not change expected assertion values without pointing to the commit that intentionally changed this behavior".

## What to measure to know it works

Three numbers are enough. First: the share of agent PRs accepted without modifications - for me, around 70 percent after tuning the prompt. Second: the share of wrong diagnoses caught in review - 1 in 4 at the start, 1 in 10 now. Third, and most important: time from a red run to a green one. Before the agent, our median was a day and a half, because fixing a test waited in the queue behind "real" work. Now it is an hour, of which 55 minutes is waiting for a human with their morning coffee.

There is also a fourth, unmeasurable observation: the team stopped ignoring red e2e tests. When the diagnosis arrives on its own, the barrier to entry for a fix drops to nearly zero - and suddenly it turns out that the "permanent red" on CI was not a law of nature, just a consequence of the cost of analysis.

## Summary

The "agent fixes e2e tests" workflow consists of five steps: artifacts on failure, conditional agent trigger, an instruction that says diagnose first then propose, a PR instead of direct writes, and human approval. The value comes from the complete set of inputs - trace, screenshot, DOM context, application diff, and test history - and the safety comes from the hard rule that the agent merges nothing on its own. Four mistake patterns are worth knowing by heart: a fixed assertion instead of the application, a masked regression, timeout medicine, and quiet step removal. If you want to start, enable `trace: 'retain-on-failure'` today and feed the artifacts to the agent manually for a week - before you automate the trigger, you will learn what its good and bad diagnoses look like.
