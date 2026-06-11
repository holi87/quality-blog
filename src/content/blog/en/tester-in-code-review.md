---
title: "A Tester in Code Review: What You Can Contribute Even If You Don't Write Code Every Day"
description: "What a tester should look for in submitted changes, a checklist for your first reviews, and a plan for joining the process without stepping on developers' toes or slowing the team down."
date: 2026-07-29
tags: ["qa", "code-review", "tester-role", "collaboration"]
lang: en
readingTime: 9
author: GH
---

Code review is the cheapest moment to catch a bug after it has been written: the change is small, the context fresh, the fix costs minutes. And yet testers almost never take part in reviews - "because they don't write code". That is a misunderstanding costing teams real bugs. I show what a tester should look for in submitted changes, give a checklist for your first reviews, and describe how to join the process without stepping into anyone's competence and without slowing the team down.

## Why it is the cheapest moment - and why you are not there

The math is simple. A bug found in code review: the developer fixes it in the same change, cost 10-30 minutes. The same bug found in testing: a ticket, reproduction, the developer's context switch, the fix, a retest - half a day to two days. In production: add incident and customer handling on top. Every shift of detection to the left divides the cost by a factor of several to a dozen or more.

The tester is absent from reviews for two reasons. The first is the tester's own belief: "I won't write it better, so what would I do there". The second is the team's belief: code review is for assessing implementation quality. Both are wrong in the same way - they confuse code review with a coding contest. A review is the last cheap opportunity for a second pair of eyes to look at the change with a different question in mind. The developer-reviewer asks "is this well written". The tester asks "what will break here and how will we know". These are different questions and both are needed.

## What a tester looks for in a change - five areas

**Edge cases.** You do not need to understand every line to see in the condition `if (amount > 100)` the question: what about exactly 100? Interval boundaries, an empty list, zero, a negative value, very long text, non-ASCII characters, time zones. This is exactly the craft of test design - applied to code before the merge instead of to the application after the release.

**Error handling.** What happens when a call to an external service does not respond? You look for empty exception-catching blocks, errors swallowed without a trace in the logs, messages like "an error occurred" with no information about what the user should do. You do not need to know the syntax - the empty space after "what if it fails" is visible to the naked eye.

**Input validation.** Every form field, URL parameter, header: is anyone checking length, format, range? Is the validation on the server side, or only in the browser? Here the tester often knows more than the developer-reviewer, because it is the tester who later pastes a thousand characters and an apostrophe into the name field.

**Changes without tests.** The simplest signal: the change touches discount calculation logic, and among the changed files there is not a single test file. Or there is one - and the test checks only the happy path. The question "what test would catch a regression of this change?" is always legitimate and always yours.

**Testability and observability.** Do the names say what the code does? Does the new function log anything that will tell you in production that it works? Can it be invoked in a test without standing up half the system? If you read a change and cannot say how you would test it - that is a comment to raise, not a gap in your competence.

## A tester's review checklist

For the first weeks - ten questions for every reviewed change:

1. Do I understand what user problem this change solves? If not - I ask before judging anything else.
2. What boundary values do I see in the conditions (thresholds, ranges, dates), and is any of them handled "off by one"?
3. What happens with empty, zero, duplicated and extremely large input?
4. Does every error path end with a readable message and a log entry?
5. Is data validation on the server side?
6. Does the change have tests, and do the tests check anything beyond the happy path?
7. What test would catch a regression of this change six months from now?
8. Does the change touch data (migrations, formats) - and what about the records created before it?
9. After deployment, will I be able to tell from logs and metrics that it works?
10. Is there anything in the change description that I do not see in the code - a promise without coverage?

After a month, half of these questions will have become habit and the list will no longer be needed.

## An example: one comment worth a week of complaints

A synthetic case from the ShopDemo project. The change: a new threshold discount calculation - 10% above 200 PLN. In the code, the condition `total > 200`. The tester's review comment: "What about a cart of exactly 200 PLN? The promotion terms say 'from 200 PLN'". The developer changed it to `>=` in three minutes. Had it surfaced after the release: customers with carts of exactly 200 PLN without the promised discount, complaints, corrections, apologies. The tester did not write a single line of code - they read one condition and compared it with the requirement. That is the whole magic.

Notice what really worked here: the tester was the only person in the review reading the code with the promotion terms open in a second window. The developer-reviewer was comparing the code with their own idea of what good code should look like. The tester was comparing the code with the requirement. That difference in perspective is exactly the contribution that no number of developers in a review can replace.

> The best tester comment in a code review is a question, not a verdict. "What happens when..." opens a conversation and finds a bug. "This is badly written" closes the conversation and finds a conflict.

## How to join the process without getting in anyone's way

Order matters. Do not start by asking for merge-blocking permissions - you start as an advisory voice, not a gate. A concrete entry plan:

- **Weeks 1-2: read without commenting.** Pick 2-3 changes a week from areas you test anyway. Learn how the team describes changes and what the tests look like.
- **Weeks 3-4: comment with questions.** Question form only, checklist areas only. Zero remarks about code style, formatting and local variable names - that is the developers' competence and the fastest way to stop getting invited.
- **Month 2: an agreement with the team.** If the questions catch real problems (and they will), propose a rule: changes in critical areas get a tester review, with a hard response time limit - 6 working hours works for me. Past the limit, the change moves on without you. That removes the "QA will slow us down" argument.
- **Always: pick by risk.** Do not review everything. Payments, permissions, data migrations, calculations - yes. A typo fix - no. Your time in reviews is an investment and is subject to the same risk matrix as your tests.

There is one more benefit few people mention: reviews are the fastest way to learn the system a tester has at their disposal. After a quarter of reading changes you know where the code is fragile before anything breaks - and your test plans start hitting the weak spots instead of covering everything evenly.

## Three objections you will hear - and how to defuse them

**"I don't know this programming language."** You do not need to. Of the five checklist areas, four are read at the level of conditions, names and structure - it is a reading skill, not a writing skill. After a month of regular reviews the syntax stops getting in the way, and a fragment you genuinely do not understand is a pretext for the best kind of question: "can you tell me what this piece does?". Surprisingly often, the developer finds the bug themselves while explaining.

**"Developers will feel I'm stepping into their competence."** They will - if you start with remarks about style and architecture. They will not - if you stick to your turf: edges, errors, validation, tests, observability. These are the areas where the developer-reviewer is weakest, because they look at the code through the eyes of an author of similar code. After a few accurate questions, the team will start tagging you on changes themselves, "because you always find that case with the zero".

**"It will eat into testing time."** Count it both ways. Two or three reviews a week is 1.5-2 hours. One bug report you did not have to write - with reproduction, description and a retest after the fix - is one to three hours. The balance hits zero at just one caught bug a week, and everything above that is pure profit. In my case, after a quarter of this practice, the number of bug reports from testing in the areas covered by reviews dropped by about a quarter - those bugs simply never got to exist.

## Summary

Code review is the cheapest point of bug detection, and the tester's perspective - edges, errors, validation, missing tests, observability - complements the developer's perspective there instead of competing with it. Enter the process gradually: first read, then ask, then agree on rules with a time limit, and always pick changes by risk. Do not judge code style, and phrase remarks as questions. One accurate comment on a boundary condition can repay months of this practice. Start with two changes next week - with the checklist from this article.
