---
title: "AI for Flaky Test Analysis: From CI Chaos to a List of Root Causes"
description: "A workflow where an agent collects CI run history, groups failures by error signatures, classifies the root causes of flaky tests, and sets the order of fixes."
date: 2026-07-24
tags: ["ai", "qa", "flaky-tests", "ci-cd", "test-automation"]
lang: en
readingTime: 9
author: GH
---

Flaky tests are the most expensive noise in software engineering: every team has them, everyone knows about them, and almost nobody has time to analyze them systematically. Restarting the run is always cheaper than an investigation - until the moment the team stops trusting CI altogether. In this post I show a workflow where an agent does that investigation for us: it collects run history, groups failures by signatures, classifies root causes, and proposes the order of fixes.

## Why manual analysis never happens

A single flaky test is a trifle. The problem is that flakiness analysis requires looking at dozens of runs at once - and the data is scattered across CI reports, each report takes a minute to read, and from the perspective of any single day there is always something more urgent. On a team I worked with on an online store (let us call it ShopDemo), 40 out of 600 e2e tests showed flakiness, and restarting the pipeline was so ritualized that it had its own button on the team dashboard.

The cost of this state is bigger than the restart counter shows. First, machine and human time: every restart of a forty-minute pipeline is forty minutes of deployment delay plus a context switch for the person waiting. Second, the erosion of trust: a team that has learned "red is probably flaky again" stops reading reports - and one day restarts a run with a real regression inside. That second cost is invisible in any metric until the day the regression surfaces in production.

At the same time, this is exactly the kind of work where an agent has a structural advantage: boring, repetitive, requiring reading hundreds of similar documents and finding patterns in them. A human does it once a quarter and gets exhausted. An agent does it every night and never gets bored.

## Step 1: run history as input data

The foundation is raw history: for each test, all runs from the last 30 days with the result, duration, error message, and CI job identifier. Most CI servers expose this through an API; if not, archiving Playwright JSON reports or JUnit XML into a single directory is enough. Thirty days is a deliberate compromise: a shorter window misses rare signatures, a longer one mixes in data from before major application changes, which invalidates some of the conclusions.

The first thing the agent computes is the flakiness rate: the ratio of runs where a test failed and then passed without any code change, to all runs. A test that always fails is not flaky - it is broken, and that is a different queue. We are interested in the one that fails in 5 to 40 percent of cases, at random.

## Step 2: error signatures instead of test names

The key move of the whole analysis: group not by test name, but by normalized error signature. One root problem can knock over twenty different tests, and one test can fail for three different reasons. A signature is the error message with the variable parts removed: identifiers, timestamps, ports, random data.

A synthetic example from a ShopDemo-style project - three raw messages:

```
TimeoutError: locator.click: element "#cart-item-8841" not visible
TimeoutError: locator.click: element "#cart-item-1207" not visible
Error: expect(received).toBe(expected) - coupon "SUMMER26" already used
```

After normalization, the first two merge into a single signature `locator.click: element "#cart-item-N" not visible`, and the third forms its own. Out of 312 failures in a month you suddenly get 14 signatures - and that is a number a human can work with. The agent writes the normalization itself as a set of regular expressions, but the grouping results are worth reviewing once: overly aggressive normalization will glue two different problems into one.

## Step 3: root cause classification

For each signature, the agent gets a sample of full reports (with traces and context) and classifies the cause into one of the categories. I use four basic ones plus an "unknown" category, which is more important than it seems - an agent forced to classify everything starts to confabulate.

| Category | Typical signature | Mechanism | Typical fix |
|---|---|---|---|
| Synchronization / timing | element not visible, stale element, timeout on an action | The test outruns the application: a click before an animation ends, an assertion before the API responds | Explicit waits for state instead of hard pauses, assertions with built-in retries |
| Test data | already used, duplicate entry, missing record | Tests share data: a coupon consumed by a parallel run, a user modified by another test | Data created per test, isolation through unique identifiers |
| Environment | connection refused, 502/503, DNS, out of disk space | Test infrastructure weaker than production: a dependent service restarts, a container did not come up in time | Environment readiness checks before the run, separate monitoring of the test environment |
| Test ordering | test passes solo, fails in the suite; fails only after test X | A test leaves state that breaks the next one: an uncleaned session, changed configuration | Cleanup after each test, randomized execution order as a detector |

The best diagnostic signal for the fourth category is free: if a test fails only when it runs after one specific other test, the agent will find that correlation in the run history in seconds. A human will never find it, because nobody cross-references execution order with results by hand.

## Step 4: fix priorities, or the economics of noise

A list of fourteen signatures with causes is only half the value. The other half is the ordering. For each signature the agent computes a simple cost: the number of failures per month times the average cost of one failure (a pipeline restart, team waiting time, possibly a manual investigation). In ShopDemo, two signatures out of fourteen accounted for 61 percent of all red runs - both in the test data category, both fixable in a single day.

> Test flakiness has a parasitic distribution: a handful of root causes generates most of the noise. Without signature grouping you fix tests. With it - you fix causes, and tests fix themselves in herds.

The agent's report that reaches the team is one page: fourteen signatures, the cause, the monthly cost, the proposed fix, an effort estimate. It is a document you can make a decision on during sprint planning - unlike the generic "we have a lot of flaky tests, we need to do something".

## Quarantine and a weekly rhythm

Root cause analysis is one leg of the process; the other is the policy for handling a test we already know is flaky. This is where quarantine works: a test marked as flaky still runs and reports its result, but its failure does not block the pipeline. It is an honest compromise - the team does not lose the signal, and the red stops being the background against which nobody will notice a real regression.

Quarantine without exit criteria, however, degenerates into a test graveyard. Hence two hard rules. First: a test enters quarantine only with an assigned signature and a cause category from the agent's analysis - "it is flaky" is not a reason, "fails on a shared coupon, test data category" is. Second: a test leaves quarantine after two weeks of stable runs, or it gets deleted by a conscious decision. A quarantine capacity limit (for us: 15 tests) forces the fixes to actually happen.

I tie the whole thing together with a weekly rhythm. Every Monday morning the agent generates a fresh report: new signatures, changes in the flakiness rate, the state of the quarantine, two fix recommendations for the week. The report lands on the team channel and takes five minutes to review. After two months of this rhythm, the flakiness rate in ShopDemo dropped from 11 to 3 percent of runs - not because someone got assigned a "fix the flaky tests" project, but because every week two causes disappeared from the top of the list.

## What the agent will not do in this workflow

Honesty requires a list of limitations. First, the agent classifies based on traces - if the test environment does not log service restarts, the "environment" category will be systematically underestimated and timeouts will take the blame. Second, fix proposals for the synchronization category tend to be superficial: "add a wait" is not an analysis of why the application responds in one second one time and in ten the next. Third, the fix itself is still engineering work - the workflow shortens the investigation from days to minutes, but it does not write the data isolation patches for us.

And fourth: a one-off analysis goes stale in weeks. The real change happens when the report generates itself weekly and the flakiness rate becomes a team metric alongside coverage and build time.

## Summary

The flaky test analysis workflow has four steps: 30 days of run history, normalizing messages into error signatures, classifying causes into four categories (synchronization, data, environment, ordering) plus an honest "unknown", and prioritization by monthly cost. Grouping by signatures instead of test names is the most important design decision - it turns hundreds of failures into a dozen or so root problems. The agent wins here not through intelligence but through patience: it reads all the reports, correlates execution order with results, and does not get bored at the five hundredth trace. A starter experiment: take the history of your most hated pipeline from the last month and ask an agent just for the signature grouping - that list alone is usually enough to turn the flakiness conversation from complaining into a plan.
