---
title: "LLM as a Judge: Can a Model Evaluate Test Results, and When Not to Trust It"
description: "The LLM-as-judge pattern in testing: a rubric instead of a 1-10 scale, calibration on golden examples, three working modes, and four judge biases you need to know before rollout."
date: 2026-08-05
tags: ["ai", "qa", "llm", "llm-as-judge", "evaluation"]
lang: en
readingTime: 9
author: GH
---

Some assertions cannot be written in code. "Is this error description understandable to the user", "is the chatbot's reply polite and on topic", "does the generated summary avoid twisting the facts" - these are real quality requirements for which the classic `expect` has no syntax. The LLM-as-judge pattern promises that a model will evaluate them. The promise is defensible, but only under the conditions I break down in this post: a rubric instead of an impression, calibration on golden examples, and knowing the judge's biases.

## Where this problem comes from in the first place

As long as we tested deterministic systems, an assertion was simple: the value equals the expected one or it does not. Systems with a generative component break this model in two places. First, there are infinitely many correct answers - the chatbot of the NoteApp application can refuse unauthorized access in a hundred polite ways. Second, some quality criteria are soft by nature: clarity, tone, relevance.

The traditional escapes from this trap are two, and both are bad. Keyword assertions ("the response contains 'sorry'") are brittle and measure the wrong thing. Manual evaluation is good, but it does not scale to a thousand test cases per regression run. The model as a judge is an attempt at a third way: a machine evaluates, but against soft criteria.

## The rubric, or the end of the question "is this good"

The most common rollout mistake looks like this: "rate this answer on a scale of 1-10". Such a judge is useless, because a scale without definitions measures the model's mood, not the quality of the answer. The same input can get a 6 and a 9 in two runs, and the number says nothing about what to improve.

The working alternative is a rubric: breaking the evaluation into dimensions, each with an explicit criterion and a narrow scale. A sample rubric I use to evaluate system-generated error messages:

- **Clarity (0-2):** 0 - requires technical knowledge (codes, stack traces); 1 - understandable, but uses jargon; 2 - understandable to a user with no preparation.
- **Actionability (0-2):** 0 - does not say what to do next; 1 - suggests an action vaguely; 2 - points to a concrete next step.
- **Factual correctness (0-1):** 0 - describes the cause in a way inconsistent with the system state; 1 - consistent. A binary dimension, because a "somewhat true" message does not exist.
- **Tone (0-1):** 0 - blames the user or scares them; 1 - neutral or helpful.

For each dimension the judge must return not only a score but also a quote from the evaluated text that justifies it. The quote is a control mechanism: a judge scoring without justification gets caught exactly the same way as a student guessing answers.

Note the narrow scales. A 0-2 dimension instead of 1-10 is not asceticism, it is statistics: the fewer levels, the easier they are to define unambiguously and the higher the repeatability of scores between runs. A rubric with four narrow dimensions also gives you something a single number never will - a diagnosis. A result of "clarity 2, actionability 0" tells you immediately what to fix.

## Calibration on golden examples

A rubric without calibration is still a lottery, just with a nicer description. Calibration means a set of 20-40 examples scored by a human - the gold standard - and regularly comparing the judge's scores against those. I measure two things: agreement (in what percentage of cases the judge gives the same score as the human) and the direction of the gap (whether the judge is systematically more lenient or harsher).

A practical threshold: below 80 percent agreement on the golden set, the judge does not enter the pipeline. Importantly, calibration is repeated after every change to the judge's prompt and after every model version change - a new model is a new judge, even if the prompt stayed the same. I treat the golden set like any other test asset: it has an owner, versioning, and a quarterly review.

## Three working modes and the place in the pipeline

The judge can work in three modes, and the choice of mode is a design decision, not a detail. Pointwise mode - scoring a single output against the rubric - suits quality gates in the CI pipeline: every output gets a score, a threshold decides on red. Pairwise mode - "which of two answers is better" - is statistically more stable and great for generative regression testing: you compare the outputs of a new prompt or model version against the previous one on the same set of inputs. Reference mode - comparison against a golden answer - is the cheapest to calibrate, but it requires having the reference, so it only works where we know how to write one.

In practice it looks like this for me: pairwise mode for the decision "is the new version of the production prompt better", pointwise mode as a regression gate on a set of one hundred fixed cases, reference mode for a narrow class of extraction tasks where the reference is unambiguous.

The cost question tends to be a surprise at first rollout. Every evaluation is a model call, and scoring a thousand cases across four dimensions on every CI run can cost more than the rest of the pipeline combined. Three techniques keep it in check: a smaller, cheaper model as the first-line judge (calibrated the same way - a small model with a good rubric regularly beats a big model without one), sampling instead of the full set on working branches with the full set only before a release, and a verdict cache for unchanged input-output pairs.

## The judge's biases you need to know

The model as a judge has documented, repeatable biases. They are not exotic - they show up in the first week of use, if you know where to look.

- **Preference for long answers.** A longer answer gets higher marks regardless of content. An error message bloated to three paragraphs beats an accurate one-sentence one, even though it is worse for the user. Defense: an explicit conciseness dimension in the rubric and golden pairs in which the shorter answer is the better one.
- **Position bias.** In pairwise comparisons ("which answer is better: A or B") the answer shown first wins more often. Defense: run every comparison twice with the order swapped; if the verdicts differ, treat the result as a tie.
- **Preference for its own style.** The model rates texts that sound like its own more highly - and if the evaluated text is also generated by a model from the same family, the scores inflate. Defense: a judge from a different model family than the generator, at least in the control set.
- **Leniency drift.** Without calibration, scores shift up the scale over time, especially after model version changes. Defense: golden examples and an alarm on a drop in agreement.

## When it is a tool, and when it is an alibi

The model as a judge is a tool when it evaluates things that are soft by nature, has a rubric, is calibrated, and its verdicts are subject to human spot checks. It becomes an alibi in three situations I see regularly.

First: the judge evaluates something that can be asserted in code. If the criterion is "the response contains the invoice amount", that is a string comparison, not a quality evaluation - the judge here is an expensive and unstable replacement for a free assertion. Second: the judge's scores go into a report, but nobody has defined a failure threshold. A test that cannot be red is not a test - it is a decoration. Third: the judge becomes the only line of quality control for a generative component, because "AI is checking AI, after all". Without golden examples and a human control sample, that is not quality control, just the appearance of it.

> The LLM judge does not relieve the team of responsibility for defining quality. It enforces that definition at a scale a human cannot handle - but the definition, the rubric, and the golden examples must come from people who understand the product.

A practical mechanism that keeps the judge on the tool side: a fixed control sample. Every week I draw ten of the judge's verdicts and score the same cases myself, without peeking at its scores. A mismatch in one case out of ten is normal; a mismatch in three is a signal to recalibrate before anyone makes a decision based on those numbers. Fifteen minutes a week - that is the cost of keeping the right to say "we trust these scores" and mean it. A team that does not spend that quarter of an hour has quietly moved from the tool category to the alibi category, even if the rubric and the initial calibration were exemplary.

## Summary

The model as a judge solves a real problem: assertions on soft quality criteria at a scale manual evaluation cannot carry. There are three boundary conditions: a rubric with narrow, defined dimensions and a required quote instead of a generic scale; calibration on 20-40 golden examples with an 80 percent agreement threshold, repeated after every model or prompt change; and awareness of the biases - length, position, own style, drift - with defense mechanisms for each. The alibi red flags: evaluating things assertable in code, no failure threshold, the judge as the only control. A good first experiment: take ten error messages from your product, score them yourself with the rubric from this post, then give the same rubric to a model and compute the agreement - the result will tell you more about the maturity of this pattern than any marketing material.
