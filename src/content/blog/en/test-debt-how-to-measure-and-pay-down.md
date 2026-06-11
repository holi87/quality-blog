---
title: "Test Debt: How to Measure It, Show It to the Business, and Pay It Down Without Stopping the Team"
description: "An operational definition of test debt, six measurable signals, pricing in hours and risk, and a repayment strategy that does not require halting delivery for a fix-it sprint."
date: 2026-07-22
tags: ["qa", "test-debt", "testing", "metrics", "process"]
lang: en
readingTime: 9
author: GH
---

Every team I have worked with had tests disabled "temporarily" - for eight months on average - and a coverage metric nobody believed. That is test debt: the gap between what your tests promise and what they actually verify. In this article I give an operational definition, a list of measurable signals, a way to price the debt in hours and risk, and a repayment strategy that does not require halting delivery for a "fix-it sprint".

## An operational definition: debt you can count

I define test debt like this: the sum of gaps between the declared and the actual protection of the system by tests, expressed in the work hours needed to remove the gap or in the risk the gap conceals. The key word: gap. A lack of tests in a deliberately skipped area (I wrote about this in the context of risk-based testing) is not debt - it is a decision. Debt is a test that exists and lies, and a hole nobody knows about.

This definition immediately cuts off the sterile discussion of "we have too few tests". Maybe you have just the right amount. The problem is that a third of them are disabled, another chunk passes regardless of the state of the code, and coverage of the critical payment path is 12%, even though the overall report shows a proud 78%.

## Where the debt comes from: three honest answers

Before I start measuring, I name the sources - because repayment without turning off the tap makes no sense. Source one: deadline pressure. A test disabled "for a moment" to make the release, plus no mechanism to remind anyone about it. The intention was honest; the debt comes from the missing repayment date.

Source two: change without updating the tests. The system evolves, the tests stay. A scenario written for the old order process keeps passing because it checks things that stopped mattering - a green light with no information value. This is the most dangerous source, because it is invisible: nothing is disabled, the metrics look fine.

Source three: tests written for the metric, not for the risk. When the organization holds the team accountable for a coverage percentage, the team delivers a coverage percentage - with tests of trivial paths, because those are the cheapest. The critical paths stay thin, because they are the most expensive to test. The metric grows, the protection does not.

## Signals: how to spot the debt in your project

Test debt leaves measurable traces. Six signals I collect first:

| Signal | How to measure | Alarm threshold |
|---|---|---|
| Skipped tests | number of disabling annotations in test code + age of the oldest (from repository history) | >5% of the suite or a skip older than 3 months |
| Flaky tests | percentage of runs in which a test changes its result without a code change | >2% of the suite behaves randomly |
| Critical-path coverage gaps | coverage measured separately for critical modules, not the overall average | critical module <60% with an average >75% |
| Stale test data | age of dumps and reference records relative to schema changes | data older than 2 schema versions |
| Growing manual regression | hours of manual regression per release, quarterly trend | growth >20% quarter over quarter |
| Zero-trust tests | tests with no assertions, tests that are always green (check by mutation: break the code, does the test fail?) | every one found |

Collecting these six numbers for a medium project takes a day, two at most. Most of it can be pulled by script from the repository and the CI/CD pipeline reports. It is a cheap audit with an indecently high return.

## Pricing: hours and risk, not percentages

Raw signals have to be converted into two currencies. The first: repayment hours. For each item, a repair estimate - unblocking and fixing a skipped test averages 1-3 hours, stabilizing a flaky one 2-6 hours, covering a gap in a critical path 4-16 hours per scenario. In the synthetic ShopDemo project the bill came out like this: 34 skipped tests (~70 hours), 18 flaky ones (~70 hours), a gap in the returns module (~60 hours), refreshing test data (~40 hours). About 240 hours in total - six weeks of one person.

The second currency: concealed risk. Each item gets one sentence: what bug could slip through unnoticed and what happens then. "The disabled tests of the returns module mean a bug in refund calculation will be detected by the first customer, not by us; the last such incident cost 11 days of complaint handling." That sentence does more in a conversation with the business than any coverage chart.

Both currencies are needed, because they answer different questions. Hours answer "how much does it cost to fix" and allow planning. Risk answers "why are we fixing this at all" and allows prioritizing. A list sorted by hours alone starts with the cheapest items; a list sorted by risk alone, with the scariest. I sort by the ratio of risk to hours: first the items that remove a lot of risk for little work.

> Coverage nobody believes is worse than no coverage. No coverage at least does not give you false peace of mind before a release.

## How to talk about it to the business

A mistake I made for years: reporting test debt in engineering language. "We have 18 flaky tests and 54% coverage in module X" - for the person deciding the budget, that is noise. What works is the language of risk and money, in three steps.

Step one: the consequence. "We are unable to detect a bug in refund calculation before the customer does." Step two: the cost of inaction based on history. "The last two such bugs cost a total of 19 team-days and an intervention from accounting." Step three: the price of the solution with a range. "Closing this gap is 60 hours spread over three sprints, without pausing delivery." Consequence, cost, price - in that order. Coverage percentages go in the appendix for those interested.

And one negotiating rule: never ask for "time to improve quality". That sounds like asking for a vacation from work. Ask for a decision between two risks: we pay it down piece by piece now, or we accept in writing that a class-X bug gets detected by the customer.

## Repayment strategy: piece by piece, without stopping the team

The big "test fix sprint" is the worst repayment strategy: it halts delivery, so the business never agrees to it, so the debt keeps growing. What works is streaming repayment, on three mechanisms.

**The boy scout rule**: leave the campsite cleaner than you found it. In practice: you touch a module - you fix one related skipped or flaky test, within the same task. No separate ticket, no asking for permission. It raises task estimates by 5-10%, but it pays the debt down exactly where the code is alive - dead modules are not worth cleaning first anyway.

**A 10-15% sprint budget** for items from the debt list, chosen by the risk calculation, not by convenience. A fixed budget has one crucial property: it is predictable for the business and is not renegotiated every week. In ShopDemo, 12% of sprint capacity paid down those 240 hours in five months - without a single day of halted delivery.

**Quarantine with an expiry date**: a flaky test goes into a separate group that does not block the pipeline but has a hard deadline - 30 days to fix it or consciously delete it. Quarantine without a deadline is not a repayment mechanism, just a cemetery with a nicer name. The deadline polices itself if once a week the quarantine list lands on the team channel with the age of each item.

Plus one protective rule: the debt must not grow at the front. New code without tests, or with a test skipped "for a moment", does not pass code review. Paying down at the back while borrowing at the front is running on a treadmill.

## What not to do

Three repayment anti-patterns. First: rewriting the entire suite from scratch because "the old one is hopeless" - six months later you have two suites, both half-trustworthy. Second: raising the coverage threshold in the pipeline as "motivation" - the team will add tests without assertions, the metric will rise, and the debt along with it. Third: delegating the entire repayment to one "test person" - the debt was created by the whole team and only the whole team will stop producing it.

And a fourth, the newest: bulk-generating tests with an AI agent as debt "repayment". The agent will add hundreds of tests in a week, the metrics will shoot up - but if you do not verify that those tests fail on broken code, you have just converted visible debt into invisible debt. Agent-assisted generation works great as a repayment tool, on one condition: every generated test goes through the same mutation trial as hand-written tests. Break the code, check whether the test notices. Without that, you are buying peace of mind, not protection.

## Summary

Test debt is the gap between what tests promise and what they verify - and it can be measured in one or two days with six signals: skips, flakiness, critical-path gaps, stale data, growing manual regression, worthless tests. Price it in hours and risk, report it to the business in the consequence-cost-price sequence, pay it down with the boy scout rule plus a fixed 10-15% sprint budget, with deadline-bound quarantine. And guard the one threshold that truly blocks: no new debt gets in. This week, count even just the first signal - the age of the oldest skipped test in your project may be argument enough to start.
