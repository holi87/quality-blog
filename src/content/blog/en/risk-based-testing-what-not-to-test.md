---
title: "Risk-Based Testing in Practice: How to Decide What NOT to Test"
description: "A simple impact-times-probability matrix, a real release walkthrough where half the scope shipped without tests, and how to communicate those decisions to the business."
date: 2026-07-08
tags: ["qa", "risk", "testing", "strategy"]
lang: en
readingTime: 9
author: GH
---

You will never test everything. That is not an opinion, it is arithmetic: the number of combinations of data, configurations and paths in an average web application exceeds any team's time budget by several orders of magnitude. The real question is different: what do you consciously let go of, and can you defend that decision in front of the team and the business. In this article I show a simple model I have used for years - the impact and probability matrix - and a real release walkthrough in which half the scope shipped without tests. Deliberately, and with stakeholder sign-off.

## Full coverage is an illusion nobody will be held to

Let's start with the math. A synthetic online store, ShopDemo: 38 screens, 4 user roles, 3 payment methods, 2 languages, 5 supported browsers. The combinatorics of purchase paths alone yields well over ten thousand variants. At 10 minutes per manual check of a single variant, we are talking about years of work for one person - per release.

Teams that declare "we test everything" in practice test whatever came to mind first. That is the worst possible scope selection: random, undocumented and impossible to defend when something breaks in production. Because it will break - the only question is whether it breaks in a place you consciously let go of, or in a place nobody thought about.

> Untested deliberately and untested by accident are two different states. The first is a management decision with a signature. The second is negligence that will surface at the least convenient moment.

## The model: impact times probability

Risk-based testing boils down to two questions asked of every item in scope. First: what happens if this does not work (impact)? Second: how likely is it not to work (probability)? The product of these two assessments determines the testing priority.

I assess impact along three axes: money (does the bug stop revenue or generate cost), users (how many and how badly are they affected), legal compliance (invoices, personal data, regulations). Probability along four: code novelty (fresh code breaks more often than old code), complexity (boundary conditions, concurrency, dates), change history (a module that broke three times will break a fourth) and the number of integrations (every external system is additional risk).

A three-level scale is enough: low, medium, high. I have seen teams with ten-point scales and weighted scores - the discussion about whether something is "a 7 or an 8" ate more time than the tests. Three levels can be assessed in a minute, and that is enough for a decision.

| Probability \ Impact | High impact | Medium impact | Low impact |
|---|---|---|---|
| **High** | Test in depth: scenarios, boundaries, automated regression | Test main paths + the most dangerous boundaries | Quick smoke test, the rest let go |
| **Medium** | Test main paths, monitor after release | Smoke test + one negative scenario | No tests, monitoring |
| **Low** | Smoke test + a monitoring alert | No tests, monitoring | No tests, deliberately |

The entire value of the matrix sits in the three bottom-right cells. They are the ones that say outright: we are not testing this. Without those cells, the matrix is just documentation decoration.

## Mapping onto features: ShopDemo release 2.14

Theory only works on a concrete scope. ShopDemo release 2.14 contained eight changes. The risk assessment session took 40 minutes with a developer, the product owner and me. The result:

- **New payment provider** - high impact (revenue), high probability (new integration). Full scope: positive scenarios, declines, timeouts, refunds, automated tests.
- **Change to cart discount calculation** - high impact (money, complaints), high probability (conditional logic, bug history). Full scope + boundary tests on discount thresholds.
- **Rebuild of the "about us" page** - low impact, low probability. One glance, zero scenarios.
- **New promotional banners in the admin panel** - low impact (seen by 6 people internally), medium probability. No tests, admin reports as the signal.
- **Event logging library update** - medium impact, low probability (patch version change). Smoke test: are logs flowing at all.
- **Sorting the product list by popularity** - medium impact, low probability. One scenario, no boundaries.
- **Typo fixes in email templates** - low impact, low probability. No tests.
- **Button color change in the cart** - low impact, low probability. No tests.

Four of the eight items went to production without a single executed scenario. Half the scope. And it was the best decision of that release, because the two days saved went into the boundaries of discount calculation - where we found a rounding bug that, at the 199.99 PLN threshold, calculated the discount on the amount before shipping costs were added. In production it would have cost real money and trust.

## Communication: a decision without a signature does not exist

The most common mistake of teams adopting risk-based testing: the matrix gets created but stays in QA's notes. Then something breaks in a "no tests" cell and the blame hunt begins. The tester defends themselves alone, because formally the decision was theirs.

That is why I write up the risk assessment result on a single page and send it to the product owner asking for explicit confirmation. The format is trivial: a list of items, assessment, decision, consequence. For "no tests" items, one sentence about what happens in the worst case and how we will detect it (monitoring, reports, alerts). The product owner replies "accepted" or moves something up the matrix - and then we decide together what moves down, because the time budget does not stretch.

That one page changes the dynamics of the post-incident conversation. Instead of "why didn't you test this" you get "we accepted this risk together, we detected it in 20 minutes via an alert, the fix is on its way". That is the difference between QA as a scapegoat and QA as a risk management function.

## "We don't test it" does not mean "we ignore it"

The "no tests" cell in the matrix has its safeguards. First, monitoring: if I skip testing the panel banners, I make sure JavaScript errors from that panel actually flow somewhere. Second, feature flags: a new, untested feature is better shipped with the ability to switch it off without a deployment. Third, a reporting channel: ShopDemo's administrators knew the banners were going out untested and had a designated place to report issues.

Skipping a test means moving bug detection from the testing phase to production - deliberately and more cheaply, as long as the cost of a production bug is low and detection is fast. If either condition does not hold, the item should never have landed in the "no tests" cell. The matrix is lying then, and it needs to be fixed, not bypassed.

## Where to get data so the assessment is not guesswork

The matrix is only as good as the assessments you feed into it. The good news: you already have most of the data. I read failure probability from three sources. Issue history: the modules with the highest defect counts over the last six months are the first candidates for "high". Change statistics from the repository: files changed most often and by the largest number of people break statistically more often - a single command over the repository history gives you a list of hot spots. Change size in the release: a 40-file change carries a different risk than a 3-file change, regardless of the developer's declaration that "it's just a refactoring".

Impact, in turn, I read from business data: which features generate revenue (the store's analytics will tell you that 92% of orders in ShopDemo go through 3 of the 11 purchase paths), which areas carry contractual or regulatory obligations, how much the last incident in a given module cost. An hour with analytics once a quarter sets impact assessments for a long time - impact changes slowly; it is probability that jumps from release to release.

## Pitfalls I have seen most often

Three recurring mistakes. First: everything lands in the "high risk" cell, because nobody wants to take responsibility for lowering an assessment. A matrix in which 80% of items have the highest priority makes no decision at all. The cure: a forced distribution - at most one third of the scope can be "high".

Second: an assessment done once, at the start of the project, never updated. Risk lives - a module stable for a year drops down, a module after a major rebuild jumps up. Assess per release, not per project; 30-40 minutes per release is the entire cost.

Third: QA assesses alone. A tester usually has a good feel for failure probability, but the product owner knows the business impact, and the developer knows the fragility of the code. A solo assessment yields a matrix tilted toward what the tester knows best.

There is also a fourth, subtler pitfall: the matrix treated as a document instead of a conversation. Most of the value of a risk assessment session does not come from the filled-in table, but from the moments when the developer says "oh, by the way, this change also touches the invoicing module" - which was in no task description. The assessment session is the cheapest risk knowledge exchange meeting I know. The table is merely the minutes of that conversation.

## Summary

Risk-based testing is not an optimization technique - it is honesty about the fact that resources are finite. A three-level impact and probability matrix is enough to decide a release's scope in 40 minutes. The "no tests" cells are the key: they must be explicit, safeguarded by monitoring, and signed off by the business. If after your next release you cannot point to what you deliberately did not test, you are not managing risk - you are just hoping. Try it at your next release: one table, three levels, the product owner's signature.
