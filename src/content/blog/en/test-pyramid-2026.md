---
title: "The Test Pyramid in 2026: What's Left of It After a Decade of Microservices and Agent-Written E2E"
description: "Which floors of the classic test pyramid still make sense, where the drawing plainly lies, and what a healthy test distribution looks like in a typical web project - no dogma, just heuristics."
date: 2026-07-15
tags: ["qa", "testing", "automation", "test-pyramid", "strategy"]
lang: en
readingTime: 9
author: GH
---

The test pyramid is well over a decade old and was born in a world that barely exists anymore: a monolith, a single database, a server-rendered interface. Today, between unit tests and end-to-end tests sits a thick layer the classic drawing never anticipated: contract tests, container-based integration tests, API tests. I examine which floors of the pyramid still make sense, where the drawing plainly lies, and what a healthy test distribution looks like in a typical web project - no dogma, just heuristics.

## Where the pyramid came from and what it actually said

The original pyramid carried two observations. First: the lower in the stack you catch a bug, the cheaper it is - a unit test runs in milliseconds and points to the guilty function, a UI test runs in minutes and points to "something doesn't work". Second: cheap tests should be plentiful, expensive ones scarce, hence the shape - a wide unit base, a narrow tip of tests through the interface.

Both observations were made in an architecture where a "unit" had access to all the logic, because all the logic lived in one process. A unit test covered a real slice of system behavior. That assumption died first.

It is worth saying right away what survived of the pyramid, because this is not an article claiming "the pyramid doesn't work". The economics of the levels still hold: a unit test is still two to three orders of magnitude faster and cheaper to diagnose than a browser test. What died is the shape - the rigid three floors and proportions drawn without looking at the project's architecture.

## What a decade changed: three new floors in the middle

In a microservice architecture, business logic falls apart into processes talking over the network. A unit test of the orders service will tell you the service sums correctly - but it will not tell you that the payments service changed its response format and the whole thing is down. The most interesting bugs moved from the inside of functions to the boundaries between services, and there the classic pyramid had a blind spot.

Three kinds of tests filled that spot. **Contract tests** (e.g. with Pact) check whether services honor the agreed exchange format - the consumer records expectations, the provider verifies them, each tests on their own side, without standing up the whole environment. **Container-based integration tests** (e.g. Testcontainers) spin up a real database or queue in a container for the duration of the test - no more database mocks that let SQL query bugs slip through. **API tests** hit a service's endpoints over HTTP, bypassing the graphical interface - they check the whole service's logic at a fraction of the cost of a browser test.

On top of that came a change at the very tip: e2e tests (running through the whole system, from browser to database) written and repaired with the help of AI agents. Playwright plus an agent writing selectors and scenarios cut the cost of creating an e2e test several-fold. And that is a trap I will come back to - because cheap creation does not change the cost of maintenance or execution time.

## AI agents at the tip: cheaper writing, same physics

A separate paragraph for the phenomenon that is reshaping test distributions fastest in 2026. An agent hooked up to Playwright can take the description "user adds a product to the cart and pays by card" and generate a working test in fifteen minutes, and after a UI change propose a selector fix. The barrier to entry for browser tests dropped so low that teams started covering everything with them - because "the agent will write it anyway".

Except the agent lowered only the cost of creating a test. It did not change the three remaining components of the equation: execution time (a browser test still takes half a minute to several minutes), flakiness (it still depends on the environment, data and network) and diagnosis cost (a red e2e test still says "something somewhere doesn't work", not "this function returns the wrong value"). A team that generated 200 browser tests in a month has, six months later, a forty-minute pipeline and a morning ritual of restarting red runs. The ice cream cone in an accelerated version - an anti-pattern I will return to in a moment, only reached ten times faster than it used to be.

## Where the pyramid lies

The drawing assumes every project has the same distribution of logic. Not true - and hence two typical cases where blindly sticking to the pyramid does harm.

**A logic-heavy frontend.** A spreadsheet-style application or an editor, where 70% of the logic lives in the browser: validations, calculations, interface states. The pyramid tells you to write mostly unit tests "at the bottom" - but the bottom is thin here; the real complexity sits in the interface components and their interactions. A healthy distribution for such a project has a thick layer of component tests running in the browser, and that is fine, even though the drawing gets pot-bellied.

**A microservice with no interface.** A service processing events and exposing an API, zero screens. The tip of the pyramid does not exist, and the highest sensible level is an API test plus a contract. Teams that "for completeness" add browser tests running through someone else's interface that consumes their service are buying themselves the most expensive and most unstable tests in the company - for someone else's code.

> The pyramid is not a goal to strive for. It is a side effect of good decisions about which level is the cheapest place to catch a specific kind of bug. If your distribution looks different from the drawing, first check whether your architecture looks different from a 2009 monolith.

## Two anti-patterns you need to recognize

**The ice cream cone** (inverted pyramid): a mass of manual and browser tests on top, a thin stick of unit tests at the bottom. That is what a project looks like when automation started "from what the user sees". Symptoms: a full regression run takes all night, 10-15% of tests fail randomly, the team has a full-time "test caretaker" who tests nothing and only restarts red runs. Maintenance cost grows faster than coverage.

**The hourglass**: lots of unit tests at the bottom, lots of e2e tests on top, an empty middle. Common in teams where developers write unit tests "because you're supposed to" and QA builds browser tests "because that's the only thing they control". Symptoms: both groups report green, and bugs still surface at integration - because nobody tests the boundaries between modules. The middle of the hourglass is exactly where API and contract tests belong.

## A healthy distribution in a typical web project

A synthetic example: NotkaApp, a team note-taking application. React frontend, three backend services, PostgreSQL, an event queue. The distribution I would consider healthy for such a project:

| Level | Share | Run time | What it catches | When it runs |
|---|---|---|---|---|
| Unit | ~55% | seconds | function logic, calculations, validations | every code save |
| Container-based integration | ~15% | 2-4 min | database queries, queues, transactions | every branch change |
| Contract | ~10% | seconds | format compatibility between services | every branch change |
| API | ~12% | 1-3 min | service logic over HTTP, permissions, errors | every branch change |
| Browser e2e | ~8% | 5-15 min | critical user paths, end-to-end glue | before merge + nightly |

The percentages are orientation, not an audit norm. Two thresholds matter more: the full change-validation pipeline should fit within 10-15 minutes, and the number of e2e tests should match the number of critical user paths - in NotkaApp eight, not eighty.

## Heuristics instead of dogma

Instead of policing the shape of the drawing, I police four rules. First: catch every bug at the lowest level where it can be reliably reproduced - a rounding bug is a unit test, a response format bug is a contract, a "cart disappears after logout" bug is e2e. Second: if an e2e test fails for a reason an API test would catch, rewrite it downward and delete the original. Third: cheap to write does not mean cheap to own - an AI agent will generate 50 browser tests in an hour, but you will be running and maintaining each of them for years; count the lifecycle cost, not the creation cost. Fourth: an empty middle hurts last, but hurts most - the investment in API and contract tests pays off exactly when the system starts splitting into services.

And if your project already looks like an ice cream cone today? Do not rewrite everything. The order that works: first measure which e2e tests fail most often and which take the longest - those are the candidates for pushing down. Then for each of them answer the question of what bug it really catches: if service logic, rewrite it as an API test; if an exchange format, as a contract; if the actual glue between the screen and the system, leave it. Finally delete the original - rewriting without deleting grows the suite instead of healing it. A pace of two or three tests per sprint is enough: after two quarters the distribution looks different, and the team never stood still for a day.

## Summary

Both fundamental ideas of the classic pyramid survived: catch bugs as low as possible, keep expensive tests scarce. The drawing itself did not survive - the middle of the pyramid has grown contract, container-based integration and API tests, and the shape of a healthy distribution today depends on where the logic lives in your architecture. You will recognize the anti-patterns by their symptoms: the ice cream cone by the overnight regression and the full-time restarter, the hourglass by green reports and red integration. Draw your project's test distribution in a table like the one above - the shape alone will tell you more than many an audit.
