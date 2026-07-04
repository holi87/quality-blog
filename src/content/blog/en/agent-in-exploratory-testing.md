---
title: "An Agent in Exploratory Testing: a Partner, Not a Replacement"
description: "Charters before the session, a second observer via Playwright MCP during it, solo exploration after hours - what an agent really adds to exploratory testing and where it fails."
date: 2026-08-26
tags: ["ai", "qa", "exploratory-testing", "agents"]
lang: en
readingTime: 14
author: GH
---

When automation was eating one piece of a tester's job after another, exploratory testing was always pointed to as the safe island: here you have to think while you test, not replay steps invented earlier. Then came agents that click through an application on their own, read the console, and write reports - and the question about the island came back with double force. After a few dozen sessions with an agent at my side, and a dozen or so where the agent explored on its own, my answer is slightly perverse: an agent is most valuable in exploration precisely when it does not try to impersonate a tester. Below I break that down into specifics: what the agent does before a session, during it, and after it, where it reliably fails, and what traps it sets for a team that believes in it a little too much.

## Exploration is not a script nobody has recorded yet

A scripted test has its steps and expected result fixed before anyone touches the application. All the intelligence was spent at design time; execution is replay. Exploration inverts that order: I learn the product while testing it, and I design each next step based on what the previous one showed me. I notice that the price filter in ShopDemo reacts oddly to a negative value, so I spend the next ten minutes on range boundaries, even though no plan ever mentioned them. It is a loop: observation, hypothesis, experiment, observation again - closed inside one head and one session.

That is why a recorded scenario will never replace exploration. Not because it is worse, but because it answers a different question: a script checks whether what we already know about the product is still true, while exploration discovers what we do not know yet. This is exactly why exploratory testing remained the last bastion of work automation could not take - you cannot record a scenario for discovering the unknown. So the question about the agent sounds different than usual: not "can it replay the steps", but can it take part in the learning loop. Or at least feed it.

## Before the session: charters from feature descriptions and bug history

A good session starts with a charter - a short mission like: "explore how coupons combine with volume discounts in the cart, on accounts with different currencies, hunt for rounding errors". A charter sets the area and the direction, not the steps. Writing sharp charters requires knowing where the product has been fragile - and that was the first job I handed to the agent. It gets the feature description, the bug reports from the last six months, and the list of code changes since the previous release; it returns a dozen or so charters, each with a justification for why it deserves an hour of someone's time.

The prioritization is the most interesting part. An agent that has read the change history notices that the payment module received three fixes in this release, from two different people, in files that have produced regressions before - and pushes the payment charter to the top of the list. The human stays the curator: out of a dozen charters I usually reject a third, because some duplicate what the automation already covers and some chase risks I know are dead, because I know the business context. But as a hypothesis generator the agent is an order of magnitude faster than I am - and a list I prune beats a blank page.

## The paired session: I drive, the agent watches where I do not

I found the most value in a setup where I run the session myself and the agent works as a second observer. Playwright MCP gives it technical eyes: the agent is attached to the same browser I am clicking in, and after each of my actions it reads the page state, the console entries, and the network traffic. I look at the application the way a user does; it looks underneath. I described the same integration when writing about [an agent fixing e2e tests](/en/blog/agent-fixes-e2e-tests-playwright-claude-code/) - in exploration it runs strictly in read-only mode.

The division of roles is sharp: I decide where we go, the agent clicks nothing. Its job is the session notes - what I visited, with what data, what happened - and catching the anomalies you cannot see from the screen. A classic of the genre: I submit a form, the interface shows a green confirmation, and underneath a 500 response went by that the UI quietly swallowed. Or a JS error on the third opening of the same dialog, after which buttons stop responding only two screens later - without the agent, connecting effect to cause would have cost me fifteen minutes. On my own I catch these things only when I happen to have the console open; with the agent I get them as they happen, with the request and the response pinned to the note.

After the session the agent assembles the raw notes into a report: the path taken, findings with evidence, open questions. Fifteen minutes of editing instead of forty minutes of writing. More importantly, the notes are more complete than my own, because the agent does not stop taking them the moment things get interesting - which is exactly when I do.

## Role reversal: the agent explores, I review the findings

I tested the inverse setup too: the agent gets a charter and explores alone, and I review the findings the next day. In areas where exploration is mechanical by nature, it can be surprisingly effective: combinations of input data, side paths of forms, behavior after back, refresh, and double submit. It found a bug this way that I would never have had the patience to dig out: a coupon worked correctly in every currency separately, but switching the account currency with the coupon already applied recalculated the discount from the old amount. That is exactly the kind of combinatorics a human's life is too short for.

The signal-to-noise ratio is brutal, though. Early sessions gave me twenty findings of which two were worth anything; the rest were duplicates, correct behavior described in the tone of a discovery, and theories about bugs that do not exist. The noise drops as the instructions harden:

- **Narrow the area.** One charter, one module, one hour. An agent let loose on the whole application produces a diary of impressions, not findings.
- **Define an anomaly.** Spell out what counts as a finding: a 4xx/5xx response, a console error, data inconsistency between views, missing validation where a sibling form has it. Nothing outside the list does.
- **Demand evidence.** Every finding must carry the request and response, or the error text. A finding without evidence does not exist - this one rule cut my noise in half.
- **Cap the count.** Five findings per session, maximum. The cap forces the model to do the selection it would otherwise push onto you.

Reviewing the findings is separate work and it has to be counted honestly in the balance - I wrote about this at length in the piece on [evaluating agent output](/en/blog/evaluating-agent-output/). My practical rule: if reviewing the findings from an hour-long agent session takes me more than half an hour, the agent is not weak - my instructions are too loose.

## Where the agent reliably fails

After a few dozen sessions I see five recurring blind spots. None of them will disappear with a better model, because none of them stems from a lack of intelligence - they stem from a lack of context, body, and stakes.

- **Feel for the user.** The agent will not sense that a form is exhausting, that the third password question is irritating, that a button sits two clicks too far away. It will detect a defect; it will not detect the embarrassment a product causes.
- **Domain knowledge.** It does not know that in this bank the accounting day ends at 17:30, so a transfer ordered at 17:29 and booked "tomorrow" is a disaster, not a curiosity. That knowledge leaves no trace in the application - it lives in heads and procedures.
- **"Something is off here".** An experienced tester stops because the page blinked a fraction of a second too long, or the data "looks weird", before they can say why. The agent needs a hard signal; intuition fed by years of production incidents does not transfer through an instruction.
- **Blindness to what is missing.** The agent evaluates what is in the page tree. The missing currency next to an amount, the missing pagination on a long list, the export promised in the specification that exists nowhere - absent things leave no trace in the DOM, and releases break on exactly those.
- **Numbness to business absurdity.** A 105 percent discount, a birth date two years in the future, an order of zero items with a negative delivery fee - if the server answers 200, the agent reports success. Recognizing absurdity requires knowing what is even allowed to happen in a given business.

## The traps: where this collaboration quietly breaks

A separate category is not the agent's gaps but the changes in human behavior the agent induces.

- **Automation bias.** After two weeks of working with an agent on the console, I stopped looking at it myself. I noticed only when an error had been sitting in a tab the agent was not observing. The human stops looking because "the agent is looking" - and the agent looks exactly where it was attached, and not a pixel further.
- **The illusion of coverage.** "The agent explored for an hour" sounds like a result and means nothing. An hour of clicking can be one screen viewed forty times. Coverage in exploration is measured in charters closed and risks addressed, not in activity time or action counts - an event log is not a map of the terrain.
- **The agent taking the wheel.** The subtlest of the three. The agent proposes "let's now check X", the human executes, the agent proposes the next step - and after fifteen minutes the learning loop lives inside the agent. The rule I imposed on myself: the agent's proposals land on a "later" list, not in my hands mid-session.

> A session in which the human executes steps the agent invents on the fly is not a paired session - it is the manual replay of a script that is still being written. The entire value of exploration sits in who asks the next question.

## How to measure whether agent sessions pay off at all

Three numbers are enough to make the discussion stop being ideological. First: significant bugs per session - weighted, because five typos do not balance one swallowed 500 at payment - compared between sessions with and without the agent on similar areas. Second: the quality of the session notes, spot-checked with a simple test - can a person who was not at the session reconstruct the path and the decisions from them. Third: the time from the end of the session to a finished report, because that is what decides whether the findings reach the team while still warm.

Honesty requires a sentence you will not hear from tool vendors: some agent sessions lose to solo ones. A simple, well-known area, an application without meaningful network traffic, a session shorter than half an hour - the cost of preparing instructions and reviewing findings eats the gain, and the balance goes negative. It is the same portfolio discipline as deciding [which tests to automate at all](/en/blog/when-to-automate-tests/): you apply the tool where it pays back, not everywhere it fits. If after a month the numbers do not defend the agent in a given area, solo exploration returns - and that is a result too, not a defeat.

## Summary

Exploration is a learning loop: observation, hypothesis, experiment - which is why neither a recorded script nor an agent replaying someone else's steps can replace it. The agent adds real value at the edges of that loop: before the session it generates charters from bug history and code changes, during it it works as a second observer attached through Playwright MCP - notes, console, network traffic, swallowed 500 responses - and after hours it mechanically combs through the data combinations a human's life is too short for. It fails where a body, a domain, and a feel for absurdity are required; the biggest risks are automation bias, the illusion of coverage, and the quiet moment when the agent starts asking the questions. Measure significant bugs per session, note quality, and time to report - and have the courage to return to solo sessions where the numbers do not defend the agent. A partner, not a replacement. And not the driver.
