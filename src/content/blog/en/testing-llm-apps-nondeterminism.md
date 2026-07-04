---
title: "Testing Applications with an LLM Inside: How QA Handles Non-Determinism"
description: "How to test apps with an LLM inside: mocks for the deterministic code, structure contracts, property assertions, pass-rate evaluations and a calibrated LLM judge."
date: 2026-08-19
tags: ["ai", "qa", "llm", "testing", "non-determinism"]
lang: en
readingTime: 16
author: GH
---

For two decades test automation rested on one foundation: the same input produces the same output, so the assertion "actual equals expected" settles any argument about quality in a millisecond. Put a language model inside the application and that foundation cracks. The same prompt sent twice can return two different answers - both correct, both different from yesterday's - and that is not a defect to report, it is a property of the technology someone deliberately chose. I have watched teams react to this discovery in two ways: either they compared the full response text and lived with a permanently red pipeline, or they switched the assertions off and kept up a theater of testing. Both roads lead nowhere. Here is the approach that works for me: slice the application into layers, hard contracts where you can, statistics where you cannot.

## Non-determinism is a feature, not a fault

Start with the mental shift without which nothing else makes sense. A language model samples successive tokens from a probability distribution; temperature and the other parameters steer that sampling, but even at temperature zero vendors do not guarantee full repeatability - across model versions, and sometimes across two calls to the same endpoint. That variability is the price of the very capabilities the model was hired for: paraphrase, synthesis, adjusting tone to the context of a conversation. If you could zero it out with no loss, you would have a lookup table of canned answers, not a model.

A concrete case from a project: the returns assistant in ShopDemo, asked about a parcel status, answered once with "Your parcel is on its way and will arrive on Thursday" and once with "The shipment will reach you on Thursday - it is already with the courier". A classic text-comparison test saw two different answers and reported a defect, although both were correct. The same test would not have noticed the Thursday-delivery answer sent to the wrong customer, as long as the text happened to match the template. Text comparison measures the wrong thing: it punishes acceptable variety of form and does not protect against real errors of content.

So the QA task is not "eliminate the variability" but "confine it to the places where it is acceptable, and measure it where it remains". That changes the toolbox: fewer text comparisons, more validators, thresholds and statistics. It also changes the definition of a regression. A regression is not an answer different from yesterday's - a regression is a drop in the percentage of answers that meet the criteria.

## Most of the application is still ordinary code

Before you touch non-determinism, measure how much of it there actually is. A typical "AI-powered" application is roughly eighty percent plain, deterministic code: parsing user input, request routing, permissions, integrations with external systems, assembling the prompt from a template and data, validating and transforming the model's response, error handling, retries, rate limits. You test that code exactly the way you always have - with one change: you replace the model with a mock.

The mock returns recorded responses: a correct one, broken JSON, a refusal, a response over the length limit, a timeout, a 429 error. That lets you check the entire edge-case handling deterministically: does the application survive an unclosed bracket in the response, does a refusal leak to the user as a blank screen, does a retry duplicate a write operation. In my experience most defects in LLM applications live exactly here - in the code around the model, not in the model itself. The island of non-determinism is small; the mistake is letting it flood your thinking about the whole test plan.

## The contract at the model boundary

The first line of tests that touch the real model does not judge content at all. It judges structure. If the model is supposed to return JSON, the schema of that JSON is a contract: required fields, types, numeric ranges, allowed enum values, length limits. The content of a field may differ on every call - the structure must be identical every time. These are still one hundred percent deterministic assertions:

```json
{
  "category": "one of: refund | complaint | question | other",
  "summary": "string, at most 400 characters",
  "confidence": "number between 0 and 1",
  "requires_human": "boolean, required field"
}
```

The contract catches a whole class of failures that in practice happen more often than a drop in content quality: the vendor updated the model and the formatting changed, someone "improved" the prompt and a field fell out of the response, the structured-output mode got accidentally disabled in configuration. The same validation should run in production as a gate on the model's output, and the CI test additionally verifies that the gate really rejects what it is supposed to reject - you feed it deliberately broken responses from the mock and expect a rejection.

## Properties instead of equality

One floor up, content evaluation begins, and here classic equality gives way to property assertions. I do not know exactly how the model will phrase the answer, but I know the invariants every correct answer must satisfy:

- **It contains what it must.** An answer about an order contains that order's number and the right customer's name, and a document summary contains every decision marked as binding in the source.
- **It contains nothing it must not.** No other customers' data, no amounts that do not appear in the source document, no promises the support process does not actually offer.
- **It stays within bounds.** The length limit, the answer's language matching the question's language, the date format matching the locale.
- **It passes a domain validator.** The line items in a generated invoice summary add up to the total; every referenced identifier exists in the database; every link points to a resource that responds.

This is a frame of thinking borrowed from property-based testing: instead of one expected result you define the space of acceptable results and check membership in it. The more quality criteria you manage to express as ordinary validator code, the less remains for the most expensive and least reliable tool, which is judgment by another model. In practice a surprising amount can be expressed in code - including catching fabricated numbers by comparing every value in the answer against the source data.

## Evaluation sets and pass rates

A single run of a test against a non-deterministic system tells you almost nothing: it passes today, fails tomorrow, and both results are "correct". The unit of measurement stops being the test and becomes the evaluation - a set of test cases run in full, with a passing threshold instead of a demand for perfection. Fifty to a few hundred cases, each with an input and evaluation criteria, and the result is a pass rate: ninety-five percent instead of one hundred.

Repeatable runs are part of the deal. Since a single call is random, a case worth measuring gets run several times - three to five repetitions per case is a reasonable start - and you look at the stability of the result, not at a single shot. A case that passes five runs out of five is stable; one that passes three out of five is the most interesting material for analysis, because it shows the limit of what the prompt can do. It also matters that consecutive runs of the whole evaluation are comparable with each other: the same set, the same parameters, the model version recorded in the report. Without that hygiene you cannot tell a regression after a prompt change from ordinary noise.

The threshold itself is a business decision, not a technical one. For summaries of internal notes ninety percent may be fine; for answers that touch payments, a threshold below ninety-nine simply means scheduled incidents. The most important part, though, is process discipline: every change to the prompt, the model or the parameters goes through an evaluation before merging, exactly the way a code change goes through tests. The prompt is versioned in the repository, its diff gets reviewed, and the evaluation result is part of that review. Without this, a "minor prompt tweak" on Friday afternoon is a regression you will learn about from customers. I described how to assemble such a process from scratch in the post on [prompt evals for regular people](/en/blog/prompt-evals-for-regular-people/), and where to get cases when production data is off limits in the post on [synthetic test data](/en/blog/synthetic-test-data-with-llm/).

The case set is alive. Every bug reported from production becomes a new evaluation case, exactly the way a code defect becomes a regression test. After a year, that set is the most valuable quality artifact in the project - more valuable than the prompt itself, because a prompt can be rewritten from scratch and a case set with history cannot.

## The LLM judge needs calibration

For open-ended answers - summaries, support replies, free-form text - some criteria cannot be expressed as a validator: "is the answer polite", "does the summary omit a key decision". This is where the LLM judge (LLM-as-judge) comes in: a second model grades the first model's answer against a rubric. It is a genuinely useful and genuinely treacherous tool at the same time, because the judge has its own well-documented biases: it prefers longer answers, favors a style similar to its own, and in pairwise comparisons it can flip its verdict when you merely swap the order of the candidates.

That is why I treat the judge like any measuring instrument: it needs calibration before use. You take a sample of fifty to a hundred answers, grade them by hand, run the judge on them and measure how well its verdicts agree with the human ones. If the agreement is low, you fix the rubric - preferably by breaking the assessment into binary questions ("does the answer contain the decision from the note: yes/no") instead of point scales, which a judge interprets however it likes. You repeat the calibration after every change of the judge model. I take this topic apart in a separate post on the [LLM as a judge](/en/blog/llm-as-judge-evaluating-test-results/). The minimal rule: the judge is never the sole guardian of a critical criterion - sensitive data, amounts and permissions are protected by validators in code.

## CI and the budget: per commit versus nightly

A full evaluation with a real model and a judge costs real money and real time, so firing it on every commit is waste. The pyramid that works for me:

| Layer | When it runs | Model | Cost |
|---|---|---|---|
| Code tests with a mocked model | every commit | none (mock) | seconds, zero tokens |
| Structure contracts on a small sample | every change to the prompt, model or parameters | real, a dozen or so calls | minutes, pennies |
| Full evaluation with validators and the judge | nightly and before a release | real, the whole set | tens of minutes, a budgeted token spend |

Two notes from practice. First, temperature zero and a fixed random seed reduce variability, and they are worth using in evaluations for comparability of results - but they do not promise full repeatability, especially across model versions, so do not build your strategy on the illusion of "it is deterministic now". Second, distinguish infrastructure flakiness from model variability. Timeouts and 429 errors are infrastructure problems - retrying with a bounded attempt count is honest there. An answer that sometimes meets the criteria and sometimes does not is a measurement signal - retrying it until it passes is falsifying the result, because that failure frequency is precisely what you want to know.

Plan the token budget for evaluations explicitly, the way you plan the time budget of a CI pipeline: set size times average response length times the number of repetitions. When the cost grows, cut deliberately - a random sample on changes, the full set nightly - instead of quietly giving up on measurement altogether.

## QA designs oracles, not steps

The deepest change is not about tools but about the role. In classic automation most of the work went into steps: click, type, check. The test oracle - the definition of what "correct" means - was trivial, because a deterministic system provided it. With LLM applications the proportions flip: the steps are boring (send a prompt, receive a response), and all the difficulty sits in the oracle. What exactly does a "good summary" mean? Which omission is a critical error and which is an acceptable shortcut? These are domain questions and QA does not settle them alone - but it is QA that has to ask them, write the answers down as rubrics and validators, and then keep them from rotting.

In practice this means a new set of competences: designing case sets, statistics at the level of "what sample justifies what conclusion", reading and reviewing prompts the way you review code. And one competence as old as testing itself: distrust of the color green. I do not consider this a degradation of the craft. It is a return to its core - testing has always been oracle design; deterministic software just allowed us to forget it.

## Summary

You do not test an application with a language model inside using one technique, but in layers. Most of the system is ordinary code - test it classically, with a mocked model and recorded responses for the edge cases. At the model boundary, put up deterministic structure contracts: schema, types, limits. Judge content with property assertions, and where properties are not enough, with evaluations over case sets, a pass-rate threshold and an LLM judge calibrated against human grades. In CI, spread the cost as a pyramid: mocks on every commit, contracts on prompt changes, full evaluations nightly and before releases. And if you want to start tomorrow morning: take one LLM-backed feature in your application, write down five properties every correct answer must satisfy, and turn them into assertions. That is your first evaluation - the rest is scaling.
