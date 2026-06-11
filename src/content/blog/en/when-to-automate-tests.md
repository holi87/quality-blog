---
title: "When to automate tests, and when automation is a waste of time"
description: "Test automation isn't always the right answer. Here's when it's worth automating, what to leave manual, and how to make conscious QA decisions."
date: 2026-06-18
tags: ["qa", "automation", "testing", "strategy"]
lang: en
readingTime: 18
author: GH
---

Test automation is often framed as the natural next step in QA's evolution. If we test something manually a few times, surely we can "just automate it" and the problem disappears. In practice the picture is more complicated. Automation can be a huge help to a team - and it can also become a **costly, unstable, hard-to-maintain liability**. The right question isn't "can we automate this?" but **"will automating this particular area deliver real value?"**

This is the second article in the "Mature QA in practice" series. The first - [why skipping QA almost always costs more than it seems](/en/blog/why-not-skip-qa-in-projects/) - set the wider context. This one zooms in on a decision many teams make on autopilot: "we automate because automation is good."

## Test automation is a tool, not a goal

Automation by itself **does not improve product quality**. It helps you detect problems faster, shortens the feedback loop, and gives you more confidence when changing things. But only when the tests are stable, meaningful, and actually read by people.

Four truths worth accepting before writing the first line of automated test code:

- **Automation doesn't replace test thinking.** You can own 5,000 tests and still not understand the risks in your product.
- **An automated test is code.** It has to be maintained, debugged, updated with every API change.
- **Automation has both an entry cost and a maintenance cost.** The first is one-off. The second grows with every test added.
- **A good automated test should give value more often than it generates work.** If it breaks every week and never finds a real bug - that's not a test, that's noise.

> An automated test that breaks more often due to environment hiccups than it catches real bugs is not a team support. It's an extra source of noise.

This isn't an argument against automation. It's an argument for **conscious** automation.

## When automation pays off

Five situations where the investment almost always pays back.

### When the scenario is repeatable

Typical candidates:

- login,
- core purchase paths,
- order creation,
- form submission,
- a basic API flow,
- document generation from data.

The more often the scenario shows up in regression, the more sense automation makes. My rule of thumb: if the scenario is checked at least once per sprint and is stable, it qualifies.

### When the test is executed frequently

Automation is especially valuable when the test must be run:

- on every pull request,
- after every deploy,
- daily on the test environment,
- before a production release.

The logic is simple: every manual repeat of the same steps by a human is wasted time and error-prone.

### When the cost of a bug is high

Examples:

- payments,
- accounting and financial reporting,
- banking systems,
- logistics (parcels, shipping),
- integrations with external systems (critical APIs),
- pricing, discounts, commissions, taxes.

Automation doesn't have to cover everything, but it should **protect the most important business areas**. One API test on the commission-calculation path can be worth more than 50 UI tests for less critical screens.

### When the scenario is stable

Automation makes sense when requirements and interfaces don't change every day. If a screen, API or business rule is **still being built and frequently reworked**, premature automation generates a lot of rework.

A practical rule: if a scenario has survived 2-3 releases without major changes, it's probably ready to automate.

### When the manual test is boring, long, and error-prone

Example. The tester has to check 20 data combinations, 5 user roles and several validation variants. Manually it's easy to miss something, easy to mistype data, easy to get fatigued after the first hour. Automation does this **faster and more consistently** - and will keep doing it the same way six months from now.

This is the point where automation saves not only time but also **human attention** - which you can then point at things automation can't do.

## What not to automate

This is the most under-discussed half of the conversation. Many teams can list what they automate. Few teams explicitly define what they don't.

### Tests you run once

A one-off migration, a one-off audit, a one-off configuration check - not automation candidates. Better to do an exploratory pass, capture lessons, and write down a checklist. If the situation returns in a year, decide then.

### Unstable features in their early days

If the product, screen or API is changing daily, automation will need constant rewrites. Writing automation against an MVP that will be redesigned in a month is a conscious form of waste - unless these are very low-level tests that don't depend on the UI.

### Visual tests that need human judgement

Not everything is well captured by an assertion. Judging whether a screen is readable, intuitive, aesthetic or logical for the user still often requires a human.

Visual regression tools (Percy, Chromatic, Argos) exist and help - but they require **smart use**. Visual regression without the ability to triage false alarms can generate more noise than value.

### Complex scenarios with low value

If automating one scenario takes several days, but the test runs **once a quarter**, ask: is this really the best use of the team's time?

Often the answer is: build a good manual checklist and revisit when the frequency goes up.

### Tests that aren't understood

If the tester doesn't know exactly what they're checking, **automation only freezes the chaos in place**. First understand the business rule, the risk, and the expected outcome. Automating something you don't understand is the worst form of technical debt - it looks like work done, but it's a trap.

## How to decide: automate or not?

A simple checklist before writing an automated test. The more "yes", the stronger the candidate.

- [ ] Will this test be run **3+ times per sprint**?
- [ ] Is the scenario **stable** (interface/API doesn't change weekly)?
- [ ] Does the test protect an **important business process** or critical path?
- [ ] Does the manual execution take **more than 5 minutes**?
- [ ] Will automation take **less than 2× manual execution × frequency over a year**?
- [ ] Will the test be maintained - **is there an owner**?
- [ ] Will the test run in a **pipeline** (CI/CD, nightly)?
- [ ] Will the team **react** to a red result?

Fewer than 5 "yes" answers - probably don't automate. Stick to a manual checklist.

## Good candidates

**Login and basic roles.** Frequently used mechanism. If login is broken, most of the app is useless. The first automated test I'd write on any project.

**Critical business path.** Order placement, booking, payment, data import, document generation. Automation protects what matters most against regression.

**APIs with clear contracts.** API tests are **faster, more stable and cheaper to maintain** than UI tests. If you can verify the logic at the API level, that's almost always where to start.

**Backend regression.** If the business logic has many conditions (discounts, commissions, pricing), automation can sweep through data variants very effectively. This is the area where manual testing always falls short.

## Weak candidates

**A screen that changes every day.** Wait, or test at a lower level - for example via API.

**A one-off data migration.** Validation scripts or a checklist usually suffice. A classic automated test has no long-term value here.

**A scenario that needs subjective UX judgement.** The automation will check the button exists. It won't check whether the whole process makes sense to a user.

**A test that depends on external state you can't reset.** Without control over the test environment the test will be flaky regardless of code quality.

## Common mistakes in automation

A practical list worth walking through at quarterly test-strategy reviews.

- **Automating everything without priorities.** No risk hierarchy → 500 tests where only 100 are really important.
- **Starting at the UI instead of the API or service layer.** UI is the most expensive, the most brittle, the slowest. People start there because "you can see the effect" - but it's an expensive road long-term.
- **No test data strategy.** Tests are only as good as the data they run on. Without a plan for fixtures and state reset - flakiness is guaranteed.
- **Unstable test environments.** If the environment is unreliable, every test is suspect - and the team stops trusting results.
- **Nobody owns the tests.** "Everyone" means "no one". Every test needs an owner.
- **Ignoring flaky tests.** One unstable test poisons the whole suite, because the team starts ignoring red.
- **Writing tests nobody reads.** A test that turns red and nobody looks at is worse than no test.
- **Treating test count as a success metric.** "We have 3,000 tests" means nothing if you don't know what they protect or how many false alarms they raise.

## Automation and the test pyramid

The classic pyramid (unit → integration → API → UI) works, but doesn't need to be treated as gospel.

Practical takeaways:

- **Unit tests** are fast and cheap. They should cover logic where every edge condition counts. Written by developers.
- **Integration tests** check how components work together - often the best level for business logic.
- **API tests** give the **best value/cost ratio** in many projects. Fast, stable, closer to the contract.
- **UI tests** are valuable but expensive and brittle. Keep their count under control - a handful to a dozen for critical paths.

The point isn't theoretical pyramid purity. The point is the conscious **distribution of cost and value** across the test suite.

## Test architecture has no substitute

One observation that rarely makes it into the textbooks: the quality of automation depends more on **test architecture** than on the count of cases you write.

In practice:

- one shared **page object / API client** per area,
- **fixtures** owning state, not inlined into tests,
- a **stable data strategy** - tests don't pollute the test environment's database,
- **naming and organisation conventions** - tests are readable for someone seeing them for the first time,
- **retry only for known environment weaknesses**, not flaky logic.

Without this hygiene, a suite of 1,000 tests turns into a problem faster than you'd expect.

## Summary

Automation is good **when it's conscious**. The goal isn't "have as many automated tests as possible." The goal is to have tests that genuinely help the team ship faster and more safely - and that someone actually reads when they turn red.

Before you automate the next scenario, ask one question: **will this test really help the team make decisions?** If the answer is "I don't know", first sharpen the test strategy. Code comes after.

## Next in the series

Next: [why QA must evolve as the product and team move forward](/en/blog/why-qa-must-evolve/) - where I show why automation alone isn't enough when the process around it doesn't evolve with the product.

Earlier in the series: [why not skip QA on projects](/en/blog/why-not-skip-qa-in-projects/).
