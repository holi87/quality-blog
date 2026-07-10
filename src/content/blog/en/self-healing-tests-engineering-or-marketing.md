---
title: "Self-Healing Tests: How Much Is Engineering, and How Much Is Marketing"
description: "How automatic locator repair really works, where it quietly masks regressions, how a vendor tool differs from your own agent with repository access, and eight questions to ask before buying."
date: 2026-08-12
tags: ["ai", "qa", "test-automation", "self-healing", "tools"]
lang: en
readingTime: 9
author: GH
---

Sales materials for test automation tools have been promising the same thing for two years: the end of test maintenance. A selector changed? AI will fix it by itself, the team will not even notice. Inside that promise there is a genuine engineering mechanism and a thick layer of marketing - and the boundary between them runs exactly where the question begins of whether the change in the application was intentional. I take the mechanism apart and finish with a list of questions worth asking a vendor before signing a contract.

## What automatic locator repair can really do

Classic locator healing does not require an LLM. For each element, the tool remembers not one selector but a whole fingerprint: identifier, classes, attributes, text, DOM position, neighbors, and sometimes appearance. When the primary selector fails, the tool searches the current DOM for the closest candidate and swaps the selector above a threshold. This is not the only modern architecture, however: Playwright's agentic healer runs the test, inspects the current UI, proposes a patch, and retries until the test passes or guardrails stop the loop.

This works, and works well, in a narrow class of situations: the element exists, serves the same function, and only its technical identity has changed. The "Buy now" button got a new CSS class after a style refactoring, a form moved one container deeper, a framework-generated identifier changed its suffix. In projects with generated identifiers this can be a double-digit percentage of all test failures - and those repairs are genuinely worthless for a human to do, so automating them is pure profit.

The LLM layer adds semantic matching on top: "the element that used to be called 'Save' is now called 'Keep changes', but plays the same role". This extends the mechanism's reach, but it also extends the error surface - more on that in a moment.

While we are at it, the vocabulary deserves demystifying. In many classic products, "AI self-healing tests" means the similarity ranking described above, perhaps with a language layer. Newer agentic tools can explore the UI and repository, but they still do not know change intent unless they receive requirements, a diff, and history. Similarity ranking is solid engineering. Marketing begins when any of these mechanisms is said to "understand test intent" without showing where that intent comes from.

## Where the mechanism quietly masks regressions

The fundamental problem: the repair mechanism sees only the DOM, not the intent. It does not know whether a selector change is the result of a refactoring or the symptom of a bug. Three scenarios in which a "repair" is damage:

- **The change was intentional, but significant.** The "Delete account" button was redesigned and moved behind an extra confirmation. A self-healing test will find it in the new place and pass - but it should fail, because the flow changed, and someone should consciously test and accept that change in the scenario.
- **The element disappeared because the feature broke.** Due to a deployment bug, the coupon section in ShopDemo does not render at all. Semantic matching finds the "most similar" element - say, the discount code field in the newsletter footer - and the coupon test goes green, testing who knows what. This is not a theoretical scenario; it is exactly the type of failure I saw at a demo of one of the tools, except the vendor called it "aggressive matching mode".
- **A similarity threshold tuned for the metric.** The vendor boasts that it repairs 95 percent of failures automatically. The lower the similarity threshold, the prettier that number - and the more false repairs. The metric "percent self-healed" without the metric "percent of repairs that were right" is marketing, not engineering.

> A test that never fails is not a perfect test - it is a disabled alarm. The value of an e2e test lies in its ability to be red exactly when a human should look at something.

## The tool vendor versus your own agent with repository access

The fundamental difference is not commercial product versus in-house code. It is runtime-only healing versus an agent that has repository context, requirements, and human review. A vendor product may fall into either group. This is not about brand or model quality - it is about available context and who approves.

| Dimension | Runtime-only healing | Agent with repository and change context |
|---|---|---|
| Decision context | DOM before and after, element fingerprint | DOM plus the application code diff, commit history, ticket description, project conventions |
| Distinguishing intentional/accidental | Unreliable without requirements and change history | Can be justified - the agent cites the commit, task, and evidence, but a human still verifies |
| Moment of repair | In flight, during test execution | After the run, as a change proposal for review |
| Human approval | Usually optional, off by default | Built in - the repair is a PR, someone has to click |
| Audit trail | An entry in the tool's panel, outside the repository | Full history in the repository: who, what, why |
| Cost of entry | Low - you buy it and switch it on | Higher - you build the workflow and the prompt yourself |

The most important row is the second, and it is worth lingering on. A selector repair is correct if and only if the change in the application was intentional - and that cannot be determined by looking at the DOM alone, even if the model on the tool's side is the best on the market. An agent with repository access can write in the fix description: "selector changed in commit c41f2a, the ticket description mentions the cart redesign, repair consistent with intent". A tool without that access can at most state that something is similar to something.

In-flight repair has one more cost nobody talks about: it changes the semantics of the test run. The report says "all green", but part of that green passed through different selectors than the ones in the test code. The repository stops being the source of truth about what was actually tested.

## The zone of reason: a hybrid approach

Between "we buy magic" and "everything by hand" there is a zone of reason I recommend regardless of whether you choose a tool or your own agent. First, divide tests into risk classes. Critical flows - payment, registration, data deletion, consents - get rigid contract selectors and zero automatic repairs; here every change must go through a human, because the cost of a masked regression is incomparable to the cost of a review. The remaining scenarios can use repairs in proposal mode.

Second, attack the cause, not the symptom. Most of the "need for self-healing" comes from brittle selectors. A contract with the application team - stable `data-testid` attributes on elements used in tests, treated like an API and changed deliberately - reduces locator failures by an order of magnitude. The irony is that a self-healing tool is most needed exactly where that contract is missing, and least needed where selector hygiene is good.

Third, treat repairs as data. Every repair proposal is information: which area of the application changes most often, which tests are the most brittle, where the selector contract is not working. A monthly review of the repair log says more about the health of your automation than the coverage figure. If one module generates half the repairs, that is not a test problem - it is a signal that the frontend of that module lives without any agreement with the tests.

## A checklist of questions for the vendor before buying

If you are considering a tool with self-healing, these questions separate engineering from marketing faster than any demo:

1. What percentage of automatic repairs turns out to be wrong, and how do you measure it? (The absence of this metric is an answer in itself.)
2. Can I set a "propose instead of repair" mode, in which every repair requires approval?
3. What happens when an element has disappeared entirely - how does the tool tell "moved" from "removed"?
4. Do repairs flow back into the test code in the repository, or do they live only in your platform?
5. Is the similarity threshold configurable per project and per critical element?
6. What does the repair log look like: do I see the selector before, after, and the justification for the decision?
7. Can I completely disable repairs for elements in critical flows (payment, data deletion, consents)?
8. What happens to my tests and the repair history if I walk away from the tool?

Question eight tends to be the most sobering. If the repairs live exclusively in the vendor's platform, then after two years of use your tests in the repository are a fiction kept alive by an external system - and leaving it costs as much as writing the tests from scratch. Good answers to these eight questions exist, and some vendors give them without evasion; if a salesperson answers the question about wrong repairs with an anecdote instead of a number, you have an answer of a different kind.

## Summary

Self-healing tests are a real mechanism with a narrow, useful range: cosmetic identity changes of elements that exist and serve the same function. The marketing begins where the promise stretches to "the end of test maintenance" - because the mechanism does not see the intent of changes, and with overly aggressive matching it masks regressions, turning tests into disabled alarms. Your own agent with repository access has a structural advantage: it sees the diff and the history, so it can tell an intentional change from an accidental one, and it proposes the repair as a PR for human approval. Before buying a tool, ask the eight checklist questions, starting with the wrong-repair metric. And if you want to feel the problem on your own skin: take one of your tests, deliberately break the feature it checks, and see whether your self-healing lets it fail.
