---
title: "Is it worth growing in QA if you 'already know how to test'?"
description: "Growth in QA isn't just automation. It's better understanding of the product, risk, technology, business and how a team works together."
date: 2026-06-26
tags: ["qa", "growth", "career", "competencies"]
lang: en
readingTime: 16
author: GH
---

In QA it's easy to reach the point where the day-to-day starts to look the same. Pick up a task, write cases, test, report bugs, regression, release. From there it's tempting to conclude that, since "we know how to test", further growth is optional. The catch is that **products, technologies, architectures and team expectations keep changing**. A tester who doesn't grow their perspective can still run tests, but over time will see less and less.

This is the fifth article in the "Mature QA in practice" series. Earlier: [skipping QA](/en/blog/why-not-skip-qa-in-projects/), [automation](/en/blog/when-to-automate-tests/), [evolving QA](/en/blog/why-qa-must-evolve/), [experience](/en/blog/why-qa-experience-matters/).

## Growing in QA isn't only automation

Many people equate a tester's growth purely with learning to code. That narrowing costs careers.

QA is a **very broad field**. Areas where you can grow:

- **requirement analysis** - questions, acceptance criteria, definition of done,
- **testing techniques** - boundary, equivalence, decision tables, state machines,
- **exploratory testing** - heuristics, charters, session-based testing,
- **API testing** - contracts, mocks, integrations, idempotency,
- **database basics** - SQL strong enough to read and modify test data,
- **logs and monitoring** - reading what the system says after the fact,
- **automation** - UI, API, e2e, contract,
- **CI/CD** - pipelines, how tests should live in them,
- **security** - OWASP basics, common vulnerabilities, attack paths,
- **performance** - load testing, profiling, observability,
- **communication** - writing tickets, reporting risk, talking to the business,
- **business domain** - how the system **actually lives** in the real world,
- **system architecture** - to know what to test at which level,
- **working with risk** - prioritisation, conscious acceptance of known issues.

Just choosing which of those to grow in is a **strategic decision**, not only a technique drill.

## Why practice alone isn't always enough

Practice is **essential**, but without reflection it can lock you into repeating the same patterns. You can test for ten years and not learn what a deliberate tester picks up in three.

Example.

A tester spends years mostly on the UI. They're great at forms, messages, user flows. When the team moves to a **microservice architecture** with many asynchronous integrations, clicking the app is no longer enough. Most of the risk now lives in a layer they can't inspect - because they never trained that muscle.

Practice without deliberate growth gives **depth in one area**, but doesn't **prepare you for a context change**. And context changes in IT regularly.

## Technical knowledge increases QA's autonomy

Not every tester has to be a programmer. But **technical basics dramatically increase autonomy**.

Practical competencies that pay off:

- **reading requests and responses** - you know whether the bug is on the front or back,
- **understanding HTTP codes** - 401 vs 403, 422 vs 400, when a 200 is suspicious,
- **basic SQL** - `SELECT`, `JOIN`, `WHERE`, simple aggregates,
- **log analysis** - searching by `traceId`, correlating events,
- **understanding the CI/CD pipeline** - why the test failed in CI but not locally,
- **basic Git** - branches, rebase, cherry-pick (useful for your own fixes),
- **Postman or similar** - API tests without waiting for the frontend,
- **understanding the difference** between frontend, backend and database - where which problem can arise.

The effect isn't abstract. A tester with those skills doesn't have to **bring every problem to a developer**. They can narrow the source themselves, save the team hours, and file a bug in a state that lets it be fixed immediately.

## Business knowledge matters as much as technical

Often undervalued. QA that knows the domain is **dramatically more effective**.

Example.

In a **financial system**, a small rounding bug can be critical - accruing interest with a 0.001% error over 10 years on a billion-dollar book is a real problem. In a **content app** the same bug type can be entirely irrelevant.

Without domain knowledge it's hard to judge **actual risk**. A tester who understands how the business works can say "this looks technically fine, but it hits the billing model" - and the business will value that information far more than 200 automated tests.

Domain isn't an encyclopaedic list. It's **understanding what the product really does for users and for the company**. It builds over time through conversations with POs, analysts, support and customers.

## Growth helps you ask better questions

Possibly the most important effect.

A less experienced tester asks:

> Does this work?

A more deliberate QA asks:

> Who does it work for?
> Under what conditions?
> With what data?
> What if the integration doesn't respond?
> What if the user lacks permissions?
> What if the process has been partially executed already?

The quality of the questions is usually a **better indicator of QA maturity** than the quality of the answers anyone can produce. Because someone will answer - but only asked questions will get checked.

## Growth increases impact on the project

A tester who grows isn't just finding bugs. They can influence:

- **requirements quality** - through questions at analysis,
- **test architecture** - through choice of testing levels,
- **release process** - through readiness criteria,
- **automation strategy** - through cost/value analysis,
- **test data quality** - by building fixtures and resets,
- **production monitoring** - by working with DevOps/SRE,
- **risk decisions** - through deliberate prioritisation,
- **team's way of working** - through code review, mentoring, documentation.

The bigger the impact, the **less the person is a "clicker" and the more a team member shaping the product**. That changes job satisfaction, career trajectory and pay.

## How to grow smart, not chaotic

Deliberate growth isn't signing up for every course that flashes by.

### One area at a time

Example annual schedule:

- for two months **API** - Postman, contract tests, OpenAPI,
- then **SQL** - joins, aggregates, basics of execution plans,
- then **basic automation** - Playwright or your chosen framework,
- then **performance testing** - k6, Locust, profiling basics.

Four areas in a year. Enough to see a difference. Not so many that you scatter yourself.

### Learn from project problems

The best growth comes from **real problems** you're solving.

Examples:

- Test data is constantly painful? → SQL and seed/reset mechanisms.
- Bugs cluster on integrations? → API and contract testing.
- Regression takes too long? → automation or risk-based test selection.
- Environments are flaky? → infra basics, Docker, light DevOps.

Growth tied to project pain **almost always pays off** - because the effect is visible immediately.

### Don't learn everything at once

This text isn't meant to be a source of pressure. Growth should be **deliberate, not panicked**. Better to know three areas well than ten superficially.

Surface knowledge of ten areas often looks good on a CV, but **doesn't save the product** in a crisis. Deep knowledge of three areas - saves it.

## Do certificates matter?

A balanced view.

A certificate (ISTQB Foundation, Advanced, ISTQB AI, tool certs like Playwright/Cypress) **can help** when it:

- **organises knowledge** - especially for those entering the field,
- **provides a shared language** - across teams from different companies,
- **eases entry to the industry** - when project experience isn't there yet,
- **supports learning the fundamentals** - exam prep forces structure.

But a certificate by itself **doesn't replace practice, thinking and experience**. A tester with ISTQB Advanced who has never debugged a real outage is weaker than a tester without certificates who has lived through three production incidents.

A certificate is **a tool, not a goal**. If it helps your career (employer requires it, gives a benefit, eases interviews) - go for it. If it's just a CV bullet - invest in practice first.

## Does every QA have to become an automation engineer?

No. This is **important** to say outright.

Possible QA career paths:

- **QA Engineer** - manual tester with strong technical and business sides,
- **Test Automation Engineer** - primarily automation, programming the tests,
- **QA Lead** - managing a QA team, process, reporting,
- **Test Architect** - strategy, test architecture, mentoring,
- **Performance Tester** - load, stress, profiling,
- **Security Tester** - penetration testing, OWASP, threat modeling,
- **Business-oriented QA** - deep domain, acceptance criteria, analysis,
- **Quality Coach** - supporting dev teams on quality,
- **Release / Quality Engineer** - release process, observability, SRE-adjacent,
- **domain specialist** - fintech, healthcare, gaming, e-commerce.

Path choice depends on **your strengths, your interests, and the market**. There isn't one right answer. The worst answer is: "I have to become an automation engineer because everyone does".

If you enjoy talking to the business, analysing requirements, identifying process gaps - a business-oriented or Quality Coach path may be **better for you and better for the company** than forcing yourself to learn Playwright.

## What you don't need to learn (yet)

A short counter-list. Things that look appealing but in 90% of cases are better left for later:

- **another shiny new framework** that's the hype of the week without a stable ecosystem yet,
- **deep theory** that doesn't map to your daily work,
- **technologies that aren't in your project nor in a realistic move target**,
- **AI in QA** - start with general prompting and a single skill before chasing multi-agent dreams.

This doesn't mean "never learn those". It means: **set priorities**. Learning has an opportunity cost too - those hours don't come back.

## Summary

Growth in QA is worth the effort, but it **shouldn't be a blind chase after trends**. The best growth raises your effectiveness in real projects - yours, today, in the area that hurts most.

Pick one area that, today, most limits your effectiveness on the project. **Don't learn everything.** Learn what solves a concrete problem.

## Next in the series

The final article: [continuous growth in QA - curse or gain](/en/blog/continuous-growth-curse-or-gain/) - a reflective close on the pressure of constant growth.

Earlier: [skipping QA](/en/blog/why-not-skip-qa-in-projects/), [automation](/en/blog/when-to-automate-tests/), [evolving QA](/en/blog/why-qa-must-evolve/), [experience](/en/blog/why-qa-experience-matters/).
