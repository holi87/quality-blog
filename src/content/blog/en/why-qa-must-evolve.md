---
title: "Why QA can't stand still while the product and team move forward"
description: "Quality assurance must evolve with the product, the technology and the team. Here's why old QA approaches stop working as systems grow."
date: 2026-06-12
tags: ["qa", "process", "maturity", "shift-left", "shift-right"]
lang: en
readingTime: 17
author: GH
---

At the start of a project, quality often rests on simple actions. The tester checks new features, the developer fixes bugs, the team ships releases. For a while it works. Trouble begins when the product grows, dependencies multiply, regression takes longer, and bugs start appearing in places nobody anticipated. That's the point where QA **can no longer operate the same way**.

This is the third article in the "Mature QA in practice" series. Earlier:

- [why not skip QA](/en/blog/why-not-skip-qa-in-projects/) — broader value context,
- [when to automate tests](/en/blog/when-to-automate-tests/) — tooling decisions.

Now back to process: how to recognize that QA is no longer keeping up, and how to evolve it step by step without descending into chaos.

## QA that worked back then may not work today

A typical product evolution in which QA doesn't change:

- in the beginning **one application** — tester clicks, ships, works,
- then **a few modules** — first cross-regressions appear,
- later **integrations** with external systems — bugs in "not my component",
- then **roles, permissions, configurations** — combinatorics grows,
- finally **multiple teams, environments and dependencies** — nobody really knows what works.

Testing methods need to keep pace with that complexity. If the team is trying to test a system 50× larger using the same methods as a year ago, regression will take 5 days, bugs will recur, and releases will be stressful.

## What does evolving QA mean?

It's not just **more tests**. Mature QA evolves on many axes.

It can mean:

- better **risk analysis** — we know where to look,
- a better **test strategy** — we know what to test at which level,
- **automation where it makes sense** — not everywhere,
- **API and integration tests** — shifting weight away from the UI,
- **test data control** — fixtures, state reset, seeds,
- **stable environments** — tests aren't suspect by default,
- a better **bug reporting process** — faster diagnosis, better prioritisation,
- **QA involvement in requirements analysis** — gaps surfaced before code,
- **production monitoring** — feedback into the test suite,
- **post-release defect analysis** — learning from every incident,
- **quality standards in the team** — definition of done, quality-aware code review.

Each of those can be evolved separately. Together they form a mature process.

## Signs that QA isn't keeping up

A practical list of warning signs. If you recognise 3+, take a hard look at the process.

- **Regression takes too long** — days instead of hours.
- Tests are **repeated manually without reflection** — "we always did it that way".
- **Automation is unstable** — the team ignores red builds.
- **Nobody trusts test results** — releases are decided "on a feeling".
- **Bugs keep coming back** — regression is missing or ineffective.
- **Requirements are vague** — QA only finds details during testing.
- **QA enters too late** — after implementation.
- **Releases are stressful** — the last week is chaos.
- **Test environments are constantly broken** — diagnosis takes half a day.
- **Production bugs are a surprise** — nobody saw them coming.
- **The team doesn't know what was actually tested** — testing lives in the tester's head.

Each in isolation is survivable. Together they mean the QA process has been outgrown by the product.

## Why just adding more testers doesn't solve it

One of the most important insights in mature QA.

If the process is weak, **adding more people only adds chaos**. What's needed is strategy, priorities and a better risk approach, not more hands.

Example.

Regression takes 5 days and consists of manually clicking through the same scenarios. Hiring a second tester might cut it to 3 days. But it **does not solve** the fact that the team still gets slow feedback, that tests aren't in the pipeline, that regression isn't repeatable, and that releases are decided without data.

What would actually solve it:

- automating critical paths (5 days → 2 hours of regression),
- shifting tests to API level (faster, more stable),
- risk-based selective regression,
- production monitoring as an early-warning system.

A second tester in the old process is **an investment in preserving the state**. Process change is an investment in a step change in effectiveness.

## QA should shift both left and right

Two directions of modern QA evolution. Both matter.

### Shift left — earlier in the cycle

QA participates in:

- **requirement analysis** — surfacing gaps, inconsistencies, unhandled scenarios,
- **refinements** — asking about risk, edge data, integrations,
- **acceptance criteria design** — definition of done with a QA lens,
- **technical conversations** — testability of architecture, observability,
- **risk analysis** — before the sprint, not after.

Effect: fewer bugs get created. The ones that do are caught faster.

### Shift right — later in the cycle

QA cares about what happens **after release**:

- **monitoring** — alerts, business metrics, SLOs,
- **logs** — what is actually happening in production,
- **production bugs** — root-cause analysis, postmortems,
- **user feedback** — support tickets, store ratings,
- **incident analysis** — what went wrong, how to prevent it,
- **observability** — being able to see what the system is doing.

Effect: faster reaction to real problems. Every incident is fuel for the next iteration of the process.

In mature teams QA is at **both ends simultaneously** — not only in the middle when "code is ready".

## Evolving QA and automation

Automation should be **part of QA evolution**, not the only part. A common mistake: teams equate "QA growth" with building an automation framework.

Practical rules:

- **Strategy first, tools second.** Choosing Playwright isn't a test strategy.
- **Stable scenarios first, automation second.** Automating an unstable product = flaky tests.
- **Value first, count second.** 50 well-chosen tests > 500 repeats.
- **Trust in results first, framework expansion second.** If the team ignores red builds, a new framework won't help.

For a deeper take: [when to automate tests](/en/blog/when-to-automate-tests/).

## QA evolution and team culture

Quality can't only be a tester's responsibility. This is one of the biggest cultural shifts mature QA requires.

Good QA cultivates a culture where:

- **developers care about unit tests** — they don't push them "for later",
- **POs sharpen requirements** — because vague requirements are a known risk,
- **QA surfaces risk** — and speaks it out loud,
- **the team jointly decides on releases** — not "the tester said it's fine",
- **bugs are analysed without blame** — a learning culture, not a witch hunt,
- **definition of done includes quality criteria** — not just "code merged".

A team that shares responsibility for quality ships **measurably higher-quality products** than a team where quality is "QA's problem".

## How to evolve QA step by step

A practical five-step model. Works on almost any project — from a two-person team to a platform with ten teams.

### Step 1: Map the current process

Where do the biggest problems show up? Questions worth answering:

- How long does regression take?
- How many production bugs in the last quarter?
- How long does it take to analyse a ticket?
- How long is the feedback cycle (commit → quality signal)?
- How many tests are flaky?

Without those numbers, every QA-evolution conversation is opinion-level.

### Step 2: Identify the biggest risks

What hurts the project the most **today**? Most often:

- recurring bugs (insufficient regression),
- integration problems (no API tests),
- pre-release chaos (no regression strategy),
- long bug-to-diagnosis time (no observability).

Pick **one** that hurts most.

### Step 3: Fix one area

Don't change everything at once. Start with the biggest constraint.

Example: if the biggest pain is long regression → priority is automating critical paths + running them in the pipeline. You don't buy new test-management tools. You don't write guidelines. You do **one thing** that solves the specific problem.

### Step 4: Measure the effect

After 4–8 weeks check measurably:

- shorter regression time? (5 days → 1 day?)
- fewer production bugs in the area?
- faster feedback from the pipeline?
- fewer flaky tests?
- better requirements quality (fewer last-minute questions)?

If the effect is there — solidify. If not — understand why before trying something new.

### Step 5: Repeat the cycle

QA evolution is a **process, not a one-off reorganisation**. One new area per quarter. After a year the team is in a different place than it started.

This pattern doesn't burn the team out. Changing 10 things at once always ends with none of them sticking.

## Anti-patterns in QA evolution

A short list of common pitfalls:

- **Big-bang reorganisation.** "From Monday it's all different." Usually ends with a return to the old.
- **A new tool instead of a new process.** We bought Allure, therefore we have mature QA. We don't.
- **Metrics without action.** We measure 30 indicators, none of which influences a decision.
- **"Everyone is QA".** Without specific roles and accountability, quality falls between chairs.
- **Automation as the only answer.** Automation solves the test problem, but not the outdated-requirements problem or the bad-environment problem.

## Summary

QA must evolve because **the product, the technology and the organization also evolve**. Standing still isn't stability. It's slow loss of control over quality — invisible sprint by sprint, and obvious only when regression takes a week and the customer reports something that "used to work".

Check which element of QA on your project most lags behind the current scale of the product. That's probably where to start — with one, measurable step.

## Next in the series

Next: [why QA experience is more than years on a CV](/en/blog/why-qa-experience-matters/) — moving from process to the human running it.

Earlier in the series: [skipping QA](/en/blog/why-not-skip-qa-in-projects/), [automation](/en/blog/when-to-automate-tests/).
