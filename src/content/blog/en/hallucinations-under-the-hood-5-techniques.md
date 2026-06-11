---
title: "Hallucinations Under the Hood: Where They Come From and Five Techniques That Actually Reduce Them"
description: "Why a model makes things up by design rather than by malfunction, and five everyday defense techniques with before/after examples: forcing sources, a sanctioned \"I don't know\", task splitting, second-model verification, and grounding in documents."
date: 2026-08-06
tags: ["ai", "hallucinations", "llm", "prompt-engineering", "qa"]
lang: en
readingTime: 9
author: GH
---

A model does not lie, because lying requires knowing the truth. A model continues the text with the most probable next part - and sometimes that continuation is true, and sometimes merely probable. From that one difference follow all the effective defense techniques. I use five of them daily, and I will show each with a before-and-after example.

## The mechanics of making things up

A language model essentially does one thing: given the text so far, it predicts the next tokens so that the whole is as probable as possible against the training data. When you ask about something that appeared frequently and consistently in the training data - the capital of France, loop syntax in Python - the most probable continuation is also true. When you ask about something rare, niche, or nonexistent, the mechanism works identically: it produces text that looks like a true answer. A library name that sounds like library names. A statute article number that has the format of an article number. An API parameter that fits the naming convention of the other parameters.

That is why hallucinations are so convincing: they are not random errors, but textbook-correct answers with false content. And that is why "precise but false" details - which I wrote about when discussing how to assess agent output - are more dangerous than generalities. The more specifically the model states something, the more it looks like knowledge, even though the production mechanism is exactly the same as for a fabrication.

The second part of the mechanics: the model's default behavior rewards answering. Models are trained to be helpful, and refusing to answer is rarely "helpful" in the training data. If you do not open an emergency exit for the model, it will plow ahead with an answer even where it has no basis. These two facts - continuing with the probable and the reward for answering - are the entire theory you need. The rest is technique.

> A hallucination is not a defect of the mechanism, but the mechanism working as designed on a question it has no coverage for. That is why you cannot "turn it off" - you can only take its space away.

## Technique 1: forcing sources

The simplest lever: every factual statement must indicate where it comes from. Making up an answer is easy; making up an answer together with a coherent, checkable source - much harder, and above all: a fabricated source can be verified in 30 seconds, a fabricated "fact" without a source often cannot.

**Before:** "What are the request limits of this API?" - the model answers with a specific number that may come from an old version of the documentation, from a different product, or from nowhere.

**After:** "What are the request limits of this API? For each value, give the exact place in the attached documentation (section heading) you took it from. If a value is not in the documentation, say so explicitly." An answer with references gets spot-checked; an answer without references goes back for revision. In a team this also works psychologically - the reviewer stops judging the confidence of the tone and starts clicking through to the sources.

## Technique 2: a sanctioned "I don't know"

Since the model has a built-in reward for answering, you have to explicitly build and price an emergency exit for it. One sentence in the prompt changes the distribution of behaviors surprisingly strongly.

**Before:** "Which of our plugins supports format X?" - the model will point to one, because the question assumes that one does.

**After:** "Which of our plugins supports format X? If none does, or you do not have sufficient information, answer exactly: I DON'T KNOW - and list what is missing to be able to answer. The answer I DON'T KNOW is fully acceptable and better than guessing." Two nuances from practice: first, give the model a concrete refusal formula (it is easier for it to hit that than a vague "caution"); second - say outright that refusal is rewarded. Without that second sentence, some models will still prefer to guess.

## Technique 3: task splitting

Hallucinations multiply in complex tasks, because the model builds a long chain in which every next sentence must fit the previous ones - including the ones already fabricated. One early falsehood becomes a "fact" to which the rest of the answer loyally conforms. Splitting the task into stages with verification between them breaks that chain.

**Before:** "Analyze this log dump and write a fix for the bug" - the model diagnoses and repairs in a single pass, and if the diagnosis is fabricated, the fix is a very self-assured change in the wrong place.

**After:** step 1 - "list only the facts from the log: timestamps, error messages, module names; no interpretation". Step 2 - "give three possible causes ranked by probability, each with the log fragment that supports it". Step 3 - only after I accept a cause: "propose a fix". Each stage is short, verifiable, and does not let a fabrication from stage one survive into stage three. The cost: two extra conversation steps. The gain: a wrong diagnosis dies at step two, not in code review.

## Technique 4: verification with a second model

A fresh context window inherits no commitments. The model that generated an answer will defend it - that is, again, conforming to text it has already produced. But a second model (or the same one in a new, clean session) does not have that answer in its context as "its own" and judges it coldly.

**Before:** "Is your answer correct?" asked in the same session - almost always ends in a polite confirmation with minor cosmetics.

**After:** a new session, the reviewer role: "You receive an answer prepared by another system and the source material. List every factual statement and classify it: confirmed in the source / contradicting the source / no coverage. Do not fix anything, only classify." The "no coverage" category is the most valuable - that is where the hallucinations live. In my workflow this verification is a preliminary filter before human review, exactly like automated tests before manual ones: it does not replace the human, but it directs their attention to where things crack.

## Technique 5: grounding in documents

Grounding reverses the default situation: instead of asking the model for knowledge from training, you supply the source material and narrow the task to working on it. It is the most effective single technique on the list, because it changes the nature of the task from "recall" to "read and process" - and at the latter, models are radically more reliable.

**Before:** "How do I configure authentication in the NotkaAuth library?" - the model will answer from training: possibly about an old version, possibly about a different library with a similar name, possibly about an imagined library.

**After:** "Below is the current NotkaAuth documentation. Answer exclusively on its basis. If something is not in it, say so explicitly instead of filling in from your own knowledge." The same closing sentence as in technique 2 - without it, the model will gladly "fill in" the missing parts of the documentation. In the systemic variant this is exactly RAG, which I wrote about a week ago; in the manual variant it is simply the habit of pasting the right fragment of the source instead of counting on the model's memory.

## How you know the defense works

The techniques are worth not only applying but also measuring - otherwise you are left with an impression of improvement, which is exactly what they defend against. The simplest measurement: to your golden eval set (I wrote about it two posts ago) add bait cases, that is, questions for which the correct answer is a refusal or "not in the source". A question about a function the library does not have. A request for a limit that is not in the documentation. A ticket about a product that is not in the catalog.

You run the prompt version from before and after introducing the techniques through the same set and count two things: how many baits the model swallowed and - equally important - how many ordinary questions it started refusing overzealously. Because an overeager "I don't know" to every question is also a regression, just in the other direction: a model that is safe but useless. A good setup balances both measures, and without the table you will not see that balance.

## What these techniques will not fix

Honesty requires two caveats. First, none of the techniques brings the risk to zero - they narrow the space for fabrications and make them easier to detect, but the last line of defense is still human verification, proportional to the cost of an error. Meeting notes will tolerate more risk than an answer sent to a customer. Second, the techniques cost: sources and task splitting lengthen prompts and conversations, a second model doubles the calls, grounding requires having up-to-date documents. That is why I do not apply all five everywhere - for quick brainstorming, the awareness that the result may be fabricated is enough; for a report someone will base a decision on, the full set goes in.

## Summary

The model continues with the most probable next part - when it has coverage in the data, truth comes out; when it does not, something comes out that imitates truth perfectly. Five techniques take the space away from fabrications: forcing sources makes them checkable, a sanctioned "I don't know" removes the reward for guessing, task splitting breaks the error chain, a second model judges without commitments to its own text, and grounding in documents turns recalling into reading. You match the intensity to the cost of an error, and a human remains the final gate. Pick one task where the model recently made something up and run it through the "after" version of two techniques from this list - you will see the difference in the first answer.
