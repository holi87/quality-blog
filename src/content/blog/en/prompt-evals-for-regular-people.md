---
title: "Evals for Regular People: How Do You Know Your Prompt Works at All?"
description: "A minimal prompt evaluation process without a framework: a golden set of ten cases, binary criteria, an A/B comparison table, and three traps that ruin the measurement."
date: 2026-07-23
tags: ["ai", "prompt-engineering", "evals", "qa", "testing"]
lang: en
readingTime: 9
author: GH
---

You improved the prompt, pasted in one example, the result looked better - and you considered the matter closed. That is how most people I know work with prompts, including me two years ago. The problem is that "looked better" on one example is not measurement, it is fortune-telling. And a small golden set of examples plus a table is all it takes for prompt changes to stop being a lottery.

## Why eyeballing fails

Language models are non-deterministic: the same prompt can give different answers in two consecutive runs. Judging a change on one example, you do not know whether you are seeing the effect of your fix or ordinary sampling noise. The second trap is sneakier: regression. The addition that fixed case X quietly broke cases Y and Z - and those you did not check, because you were looking only at X. In software testing, nobody in their right mind ships a fix without regression tests. In prompt work, we do it all the time.

An evaluation - in plain terms: a systematic check of how a prompt performs on a fixed set of cases - is exactly that missing regression test. And contrary to what platform vendors suggest, you do not need any framework for it. You need a file with examples, evaluation criteria, and an hour of work.

## Step 1: the golden set, i.e. 10 cases

A golden set is a list of test cases with an established correct answer. For classification tasks: an input plus the expected label. For text generation: an input plus a list of properties a good answer must have. I always start with ten cases, chosen by a simple key:

- **4-5 typical cases** - the everyday traffic the prompt must handle flawlessly.
- **3-4 edge cases** - ambiguous, incomplete, with a trap. This is where prompts really differ.
- **1-2 negative cases** - inputs for which the correct reaction is a refusal or the category "other", not a forced answer.

Where to get cases? Best from real life: real tickets, real questions, anonymized. If you do not have them, generate candidates with a model, but assign the labels by hand - a golden set no human has verified measures model-to-model agreement, not quality.

## Step 2: criteria, i.e. what "works" means

For classification the criterion is obvious: the label matches the expected one. For generative tasks, break the assessment into 2-4 binary criteria - yes/no, no rating scales. "Does the answer contain all required fields?", "Does the format match the template?", "Does it avoid making up data not present in the input?". Binary criteria are less convenient than 1-to-5 stars, but two evaluators will produce the same results - and an assessment that depends on the evaluator's mood measures nothing.

## Step 3: the table, i.e. the entire "framework"

Let me show it on a synthetic example. ShopDemo, an online store with moderate traffic, wants a prompt to classify customer tickets into four categories: *return*, *complaint*, *delivery*, *other*. Prompt A is the basic version ("assign the ticket to one of the categories"). Prompt B adds category definitions and two examples of borderline rulings. The golden set - ten tickets, criterion: label match.

| No. | Ticket (abridged) | Expected | Prompt A | Prompt B |
|---|---|---|---|---|
| 1 | "I want to send back the shoes, too small" | return | return | return |
| 2 | "Package stuck at the sorting facility for a week" | delivery | delivery | delivery |
| 3 | "The espresso machine stopped working after 2 weeks" | complaint | complaint | complaint |
| 4 | "The courier left the package at the door, it disappeared" | delivery | complaint | delivery |
| 5 | "Product does not match the description, I want to give it back" | complaint | return | complaint |
| 6 | "What is the status of order 4412?" | other | delivery | other |
| 7 | "The invoice has a wrong tax ID" | other | other | other |
| 8 | "I received a different color than I ordered" | complaint | complaint | complaint |
| 9 | "Can I change the delivery address?" | delivery | delivery | other |
| 10 | "The refund for order 8821 has not reached my account" | return | return | return |

The result: prompt A - 7/10, prompt B - 9/10. And right away, two observations I would never have made by eyeballing. First, B wins precisely on the borderline cases (4, 5, 6) - the category definitions did their job. Second, B introduced a regression in case 9, which A classified correctly. Without the table, I would have seen only the improvement where I was looking, and the regression would have surfaced in production, in a conversation with a customer.

> One example tells you the prompt can work. Ten examples tell you when it does not work - and that is the information you pay for.

## Step 4: A/B comparison without fooling yourself

Three rules I carried over wholesale from QA. First: one change at a time. If between version A and B you changed the category definitions, the section order, and added examples, then all you know is that "something" helped - and at the next regression you will not know what to roll back. Second: run each case 2-3 times if the task is even slightly non-deterministic. A case that passes once and fails once is a separate, valuable piece of information - the equivalent of a flaky test, one that reveals the prompt is balancing on the edge. Third: record the result with the date and the prompt version. An `evals.md` file in the repo is enough; in three months it will be worth its weight in gold when someone asks why the prompt looks so odd.

## How it grows with you

Ten cases is a start, not a ceiling. My maintenance rhythm is simple: every prompt error found in production or reported by a user goes into the set as a new case. It is exactly the same practice as writing a regression test for every fixed defect. After a quarter, the set has 25-30 entries and covers the real, not the imagined, distribution of problems.

When there are more cases than you can comfortably check by hand, it is time for a simple script: a loop over a CSV file, an API call, a label comparison, a percentage result. That is still one afternoon of work, not a project. Evaluation frameworks make sense when sets run into hundreds of cases, multiple people are scoring, and you need history over time - which is later than the marketing suggests, and often never.

There is also the model-as-judge variant - a second model scores the first one's answers against your criteria. I use it as a preliminary filter for generative criteria, but with a rule of limited trust: the judge also has to be evaluated once, on a sample scored by a human. Otherwise you are automating not the assessment, but the illusion of assessment.

## Three traps that ruin an evaluation

**Overfitting to the set.** If you keep tweaking the prompt until it passes all ten cases, you risk having optimized it for those specific ten sentences rather than for the problem. The symptom: 10/10 on the set, while users keep reporting errors. The defense is simple: keep 2-3 cases in reserve that you do not look at while improving the prompt, and check them only at the end, like a control set. Or every few weeks swap part of the cases for fresh ones from production.

**Example leakage.** If in prompt B you placed as examples the same tickets you have in the golden set, then you are not measuring generalization, only the model's ability to copy. The examples in the prompt and the cases in the set must be disjoint - it is the equivalent of the iron rule of separating training data from test data, just in the version for regular people.

**A set that differentiates nothing.** If both prompt versions score 10/10, it does not mean both are excellent - it means the set is too easy and has stopped measuring anything. A healthy golden set should be failable: the best prompt version should score 80-90% on it, not a perfect score. It sounds perverse, but a set with a perfect score is a measuring instrument with a clipped scale - exactly like a test suite that always shines green and that nobody reads anymore.

## This is QA thinking, not data science

Notice that nowhere in this process did the words statistics, F1 metrics, or validation sets appear. Deliberately. Evaluating a prompt in a product team is in essence an acceptance test: a fixed set of cases, unambiguous criteria, a before/after comparison, a record of results. Every tester has done this hundreds of times - only the object under test changes. And just as in testing, the greatest value is not in the number that comes out at the end, but in the cases that failed: they tell you what specifically to improve in the next version of the prompt.

## Summary

Improving prompts without evaluation is fortune-telling from one example, where the regressions surface in production. The minimal process costs an hour: ten cases with hand-assigned labels (typical, edge, negative), binary evaluation criteria, a table comparing versions A/B, and one prompt change at a time. Every error from production gets added to the set, and you buy the script and the frameworks only when manual checking genuinely stops keeping up. Take your most-used prompt and build ten cases for it this week - the first table is usually enough to never want to go back to eyeballing.
