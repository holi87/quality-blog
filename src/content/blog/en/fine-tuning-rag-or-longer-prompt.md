---
title: "Fine-tuning, RAG, or a Longer Prompt? A Decision Tree Without the Marketing"
description: "A five-step decision tree for teams without an ML department: when a prompt with examples is enough, when you need RAG, and when fine-tuning genuinely pays off - with a table of cost, time, and risk."
date: 2026-07-30
tags: ["ai", "rag", "fine-tuning", "prompt-engineering", "llm"]
lang: en
readingTime: 9
author: GH
---

At conferences, every model problem gets solved with fine-tuning - it sounds serious, looks good on slides, and justifies a budget. In the practice of teams that have no ML department, nine times out of ten a solid prompt with examples or RAG is enough. Below: a decision tree, a cost calculation, and a list of things that break in each of the three approaches.

## Three approaches in three sentences

**A longer prompt** means delivering knowledge and patterns to the model directly in the query: instructions, definitions, 3-10 input-output examples. Zero infrastructure, a change in five minutes, instant effect.

**RAG** (retrieval-augmented generation) means appending fragments of your documents to the prompt, retrieved automatically for the specific question. The model does not have to "remember" anything - it receives the right paragraphs from the knowledge base at query time.

**Fine-tuning** means further training an existing model on your examples to change its default behavior: style, format, or how it performs a narrow task. The required number depends on the model, provider, and task. Some services technically accept tens of examples, but stable gains often require tens or hundreds of high-quality examples plus a separate evaluation set. The result is a new model variant that has to be maintained like any production artifact.

The key misunderstanding where most bad decisions start: fine-tuning is poorly suited to injecting knowledge. A model fine-tuned on your documentation does not become a reliable source of it - it can still make things up, only now it makes them up in your style and your jargon. Knowledge that needs to be recalled faithfully and with a source is a job for RAG. Fine-tuning changes behavior, not the stock of facts.

## The decision tree

I walk through it with teams in this order:

1. **Does the problem occur with a solid prompt containing 5+ examples?** You do not know because you have not tried - go back and try; it is an hour of work. You tried and it works - done, stay with the prompt. It almost works, but the examples keep piling up - go to point 2. It does not work at all - go to point 3.
2. **Are there already so many examples and rules that the prompt is swelling beyond a few thousand tokens?** If the growing prompt still works and call volume is low - leave it; an ugly working prompt is cheaper than pretty architecture. If cost and latency hurt at high volume - consider fine-tuning as prompt compression (point 5).
3. **Is the model missing knowledge of your data: documents, products, procedures?** Yes - that is RAG, point 4. No, the model has the knowledge but answers in the wrong style or format, or fails to stick to a narrow convention - point 5.
4. **RAG:** start with the minimal variant - good keyword search plus appending the retrieved fragments to the prompt. A vector database, embeddings, and query rewriting are the second stage, needed only when the simple variant measurably falls short (see the post on evals - without a golden set you will not find out whether it falls short).
5. **Fine-tuning:** you enter here only when you have enough verified examples for the selected model, the problem is stable over time, and prompt and RAG measurably fail to close the quality gap or do so too expensively at your volume. Start with the provider's recommended minimum, measure on a separate evaluation set, and only then expand the data. Fewer than three "yes" answers - go back to points 1-4.

## The bill: cost, time, risk

| Dimension | Longer prompt | RAG | Fine-tuning |
|---|---|---|---|
| Time to first effect | hours | days to 2 weeks | 2-6 weeks |
| Upfront cost | ~0 | days of work + search infrastructure | data preparation (the biggest cost) + training |
| Running cost | more tokens per call | index maintenance + tokens for appended context | hosting/pricing for the fine-tuned model + retraining |
| Knowledge update | edit the prompt, minutes | add a document to the index, minutes | new training run, days |
| Required data | 3-10 examples | documents you already have | usually tens to hundreds of clean pairs, depending on model and task |
| Required skills | anyone on the team | a developer + search basics | someone who understands evals and data preparation |
| Main risk | instruction dilution in a long prompt | bad retrieval = confidently wrong answers | regressions after a base model change, overfitting |
| Reversibility of the decision | full | high | low - an investment in a specific model |

The most commonly overlooked row is knowledge update. The price list changed? In a prompt and in RAG you fix the document and you are done. In a fine-tuned model the old price list is baked into the weights - and it will keep coming back in answers until the next training run.

## What breaks in each approach

**In prompts**, discipline breaks. The prompt grows for half a year, every addition patched something, nobody knows which sentences still do any work. Instructions begin to dilute one another, and sometimes openly contradict each other. Hygiene: the prompt in the repository, changes through review, a golden eval set as the regression test.

**In RAG**, retrieval breaks, not generation. In my experience, the vast majority of bad answers from RAG systems are cases where the model received the wrong fragments - badly chunked documents, outdated versions next to current ones, a question phrased differently from the content. A model with the wrong context answers fluently and confidently, so the problem shows up only at source verification. Hygiene: test the retrieval itself separately ("do the right fragments come back for these 20 questions?") before you start tuning anything else, and keep the index fresh.

**In fine-tuning**, the foundations break. The vendor retires the base model - you train from scratch. The domain has shifted - the model confidently answers according to the world of half a year ago. The training data had a bias - the model amplified it. All of this is manageable, but it requires process: dataset versioning, evaluation after every training run, drift monitoring. If you are reading this and thinking "we do not have the people for that" - that is precisely the answer to the question in the title.

> Fine-tuning is not a higher level of team development, just a different kind of commitment: you buy a percentage point of quality for the fixed cost of a process that has to keep running for as long as the product lives.

## When fine-tuning genuinely wins

Lest anyone think I am a fanatic of one side - three scenarios in which fine-tuning is the right answer. First: rigid format and style at enormous volume. Classifying millions of records a month by stable rules - a fine-tuned small model does it cheaper and faster than a large model with a long prompt on every call. Second: a narrow convention that cannot be described. A brand's specific tone of voice, a report format with dozens of nuances - sometimes it is easier to show a thousand examples than to write the instructions. Third: latency and privacy. A small model fine-tuned to a single task, running on your own infrastructure, where the data cannot leave the premises.

Note the common denominator: all three are optimizations of something that already works on a prompt or RAG. Fine-tuning as the first attempt at solving a problem you do not yet understand - that is burning budget.

## What about combined approaches?

In practice, these three options rarely occur in pure form. A prompt with examples is an ingredient of every solution - RAG is, after all, a "longer prompt", only assembled automatically from retrieved fragments. The combination of RAG with fine-tuning exists too: a model fine-tuned to the style and format of answers, fed facts from retrieval. It makes sense in organizations with high volume and a department able to carry it - which is outside the scope of this post.

For a team without an ML department, the practical advice is: treat these approaches as layers, not alternatives. First squeeze everything out of the prompt layer, because it stays with you regardless of further decisions. Then add retrieval if knowledge is missing. Fine-tuning, if it ever arrives, will also need a good prompt and a good eval set - none of the earlier work is wasted. The reverse order wastes everything: training without evaluation and without checking the cheaper options is an investment in solving a problem that may not exist.

## The perspective of a team without an ML department

A real scenario from my surroundings: a team maintaining an internal knowledge base wanted "our own model trained on our documentation". After walking through the decision tree, it ended with simple RAG: a keyword index, appending the three best fragments, a requirement to cite the source in the answer. Implementation took a week, quality on their golden set rose from 60% to 88%, and "our own model" stopped being a topic - because the problem was never a lack of training, but the model's lack of access to current documents.

That is the typical course of events. Teams without an ML department usually have problems with knowledge and format, not with the model's fundamental capabilities - and the answer to knowledge and format is the prompt and RAG, tools within reach of any developer.

## Summary

The order of attempts is fixed: first a solid prompt with examples (hours, low reversal cost), then RAG when the model lacks your knowledge (days, risk concentrated mainly in retrieval), finally fine-tuning - when you have enough clean examples, a stable problem, and measurable proof that cheaper approaches are not enough. Fine-tuning can affect model knowledge too, but it is a poor source for fresh, faithfully retrieved, citable facts; RAG fits that need better. Every decision in this tree requires a golden eval set - without measurement you are not choosing an architecture, you are listening to marketing. Before you plan a training run, spend an hour on a prompt with five examples and measure the difference: it is the cheapest experiment in all of AI.
