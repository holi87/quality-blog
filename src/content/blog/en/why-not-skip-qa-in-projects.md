---
title: "Why skipping QA on a project almost always costs more than it seems"
description: "QA isn't an add-on. Skipping quality assurance leads to delays, bugs, chaos and lost user trust. Here's why it almost never pays off."
date: 2026-06-11
tags: ["qa", "quality", "process", "team"]
lang: en
readingTime: 17
author: GH
---

On many projects, QA shows up too late - sometimes only when "everything is ready and just needs testing." The problem is that, by that point, many decisions have already been made, many bugs have already been baked in, and the cost of fixing them is much higher. Skipping QA can look like a saving, but more often than not it's just **shifting cost forward in time** - with a bigger multiplier and a tighter deadline.

This is the first article in the series "Mature QA in practice". The rest of the series - automation, process evolution, experience, individual growth, and reflection on continuous growth - builds on the same starting point: quality starts **before** implementation, not after it.

## QA isn't just clicking through a finished app

The most popular myth about QA says the tester is a person who "checks at the end whether it works." That definition is comfortable for the project plan - you can slot a "testing" block between "development" and "release." It's uncomfortable for reality - because it leaves the team with a very narrow window to fix anything.

Good QA participates in the project much earlier. The full list of areas of influence looks like this:

- analysis of requirements and business scenarios,
- identifying risks and critical areas,
- asking hard questions in refinements,
- clarifying acceptance criteria,
- planning the test strategy,
- exploratory testing during development,
- automation where it makes sense,
- release support and readiness assessment,
- post-release defect analysis and feedback into the next cycle.

Almost all of those areas are cheaper when QA shows up early. Almost all of them get more expensive when QA shows up last.

## What does skipping QA really mean?

It's not just the absence of someone with the title "tester" on the team. Skipping QA usually means the absence of:

- **an independent perspective** - nobody is looking at the product from the user's, risk's and process's point of view, only implementation,
- **critical requirement analysis** - requirements land in code as they were written, even if they have gaps,
- **regression control** - no systematic check that old features still work,
- **a consistent risk approach** - different people assess risk inconsistently,
- **knowledge of product quality** - before release nobody can really say what state the app is in,
- **a clear signal whether it's safe to deploy** - the release decision is an opinion, not a sum of verified facts.

Each of those bullets in isolation looks survivable. Together, they form a gap that someone has to plug - usually in emergency mode after production.

## The cost of a bug grows over time

Probably the most studied rule in software engineering, and at the same time the most consistently ignored in project planning.

- A bug found in requirements during analysis can be fixed with **a conversation**.
- A bug found after implementation requires **a code change**, sometimes tests and documentation.
- A bug found after deployment can mean **a complaint, a lost customer, a hotfix, team stress, longer meetings and weeks of related rework**.

A concrete example.

Requirement: "The user can change the delivery address."

QA questions worth asking during analysis:

- Can they change the address after they've paid?
- Can they change the country?
- What about delivery cost if the region changes?
- What about the invoice if the recipient changes?
- What if the parcel is already with the courier?
- What if the customer changes the address but the warehouse system can't handle the update?

Without those questions, the team will build a feature that **works technically** but doesn't fit the real business process. After go-live the first customers who try to change the address after shipping will get mixed-up invoices - and the team will spend a week on a hotfix and a call with the business.

Each of those questions could have taken 5 minutes at refinement. Each unasked question costs hours or days after the fact.

## QA helps surface gaps in requirements

This is the role hardest to capture in a story point estimate. And yet it's often the most valuable thing QA does.

QA should be asking, before anything is built:

- What happens when the user enters invalid data?
- What happens when an external integration doesn't respond?
- How does the system behave when permissions are missing?
- What about duplicate data?
- What about historical data created before this change?
- What about performance at 10× the traffic?
- What about exception handling that doesn't exist yet?
- What about migration from the previous version?

Each of those questions usually surfaces something nobody else noticed. Sometimes it's a missing edge-case scenario. Sometimes an unhandled error state. Sometimes a fundamental gap in the design that wasn't visible yet.

On teams where QA asks questions during analysis, **the number of defects found after release drops noticeably**. Not because more people are testing - because fewer bugs are being created in the first place.

## No QA leads to false confidence

A developer can test their own code. They usually look at it from the perspective of the implementation: "does this do what I wrote?" QA looks from the perspective of risk, the user, and the process: "does this make sense in the context of how it will be used?"

It's not about not trusting developers. It's a different perspective.

> A developer often checks whether the solution works the way it was built. QA checks whether the solution makes sense in how it will be used.

On projects without QA it's very easy to reach release feeling that "everything is tested." Usually what was tested is the **happy path and a few of the developer's assumptions**. What happens at the edges - nobody knows.

## QA protects the product and the team

Good QA is a buffer against concrete, easily counted costs:

- fewer **emergency hotfixes** after deploy,
- less **chaos in the last week of the sprint**,
- calmer **release planning**, because the team knows what's ready,
- fewer **misunderstandings** between business and tech,
- less **after-hours stress** because problems are surfaced early.

There are also soft costs - burnout, turnover, frustration - that are harder to count but immediately visible when they appear.

## "We don't have time for testing" - a paradox worth defusing

The "no time for QA" argument shows up on almost every tight project. It's worth defusing with a concrete tally.

The team has no time for QA, but later finds time for:

- analysing production errors from logs,
- rushed fixes with on-call sessions running late,
- emergency crisis meetings,
- explaining to the customer,
- rolling deployments back,
- manually patching data after a hotfix,
- planning an unplanned "recovery" sprint.

The sum of those hours is almost always larger than the hours the team "saved" by skipping QA. The difference: time for QA is **predictable and planned**. Time for hotfixes is chaotic and burns people under pressure.

## QA doesn't block the project. QA shows the risk

A weak QA model looks like this: the tester says "no release approval." The rest of the team feels blocked.

A good QA model looks different: QA delivers information.

- What works.
- What doesn't.
- What is risky.
- What can be consciously accepted as a known issue.
- What needs to be fixed before deploy.
- What the consequences of each option are.

The release decision still belongs to the team and the business. But it's made on the basis of facts, not hope.

## When should QA enter the project?

The best answer: as early as possible. Practically, it means involvement at every stage of the cycle, with different weight.

### Discovery / analysis

QA helps ask questions and identify ambiguity. They don't write tests yet. They write questions.

### Solution design

QA helps think about edge cases, data, integrations and risks. Early sketches of the test strategy often start here.

### Implementation

QA tests incrementally. Supports developers, prepares test data, writes automation for what's stable. They don't wait for "the build."

### Release

QA assesses readiness. They produce a list of known limitations, risks and untested areas. They inform, not block.

### Production

QA analyses bugs, user feedback, monitoring. They feed lessons into the next cycle - what should go into automation, where requirements need sharpening, what to add to the release checklist.

## The myth that "testing slows the project down"

I hear it a lot. Usually on projects where nobody can estimate how long fixing production bugs takes, how many hours hotfixes consume, or how much turnover comes from "constant firefighting."

On projects where QA enters early, the actual delivery pace is **more predictable**. Not always faster in the first sprint. But stable in the 5th, 10th and 20th. Same team, same scope - different "friction" in delivery.

That's the biggest value of mature QA: not short-term speed, but **sustained predictability**.

## What if the team is small and there's no dedicated QA?

This is real for many teams. The absence of someone with the title "tester" doesn't remove responsibility for quality.

What works in small teams without dedicated QA:

- **QA as a competency, not a role** - a developer rotating into the QA role, aware of test strategy and risk thinking,
- **QA coaching from outside** - an expert who periodically audits the process without writing day-to-day tests,
- **built-in practices** - code review with a QA lens, refinement with a checklist of questions, mandatory definition of done with quality criteria.

It doesn't replace dedicated QA on a larger team, but it avoids the worst state: no quality thinking at all.

## Summary

Skipping QA rarely means a real saving. Usually it means **shifting risk forward**, where the cost of fixing it is bigger and the pressure much higher. That's not just more hours - it's more stress, less user trust, and less control over the state of the product.

If QA on your project only shows up at the end, treat that as a warning sign. Quality isn't built in the last week before release. It's built starting with the first conversations about requirements.

## Next in the series

This is the first article of the "Mature QA in practice" series. Next up: [when it's worth automating tests and when automation is a waste of time](/en/blog/when-to-automate-tests/) - the natural continuation from QA value to concrete tooling decisions.
