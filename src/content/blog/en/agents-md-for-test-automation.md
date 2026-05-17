---
title: "How to write AGENTS.md for a test automation repo"
description: "What to put in AGENTS.md for a test automation repo, common pitfalls, templates for Playwright, Cypress, and API tests, and how to tell if the file actually helps."
date: 2026-04-22
tags: ["ai", "qa", "agents", "agents-md", "test-automation"]
lang: en
readingTime: 9
author: GH
---

When an AI agent lands in your test repo with no extra instructions, it starts from what it can see: `package.json`, `playwright.config.ts`, a few `tests/` folders. Based on that, it guesses how you work. It guesses reasonably well - but it guesses.

`AGENTS.md` is the file that turns guessing into knowledge. It's a convention analogous to `README.md`, only addressed to the models working in the repo, not to humans. In test repositories it's particularly valuable, because test automation carries a lot of tribal knowledge the agent won't extract from code alone: how tests run locally vs in CI, what tags mean, which fixtures are shared, and what you'd rather nobody touched.

In this post I'll show what to actually put in `AGENTS.md`, the common pitfalls, templates for Playwright / Cypress / API tests, and how to check whether the file is really helping.

## Why a separate file for agents

You might ask: why not just dump everything into `README.md`?

Three reasons:

**Different reader, different needs.** `README.md` answers a human's questions - "what is this, how do I run it locally, who do I ping with questions." `AGENTS.md` answers an agent's questions - "what's the exact command, character by character; what am I not supposed to do; what style should new code follow."

**Different format.** A good `README` is narrative. A good `AGENTS.md` is operational - commands, lists, clear "yes/no". Humans tolerate fluff. An agent takes fluff literally and loses the signal.

**Different rate of change.** `README.md` rarely moves. `AGENTS.md` is something you tune whenever you notice the agent repeating the same mistake ("ran all the tests again instead of just the changed ones"). It's a live document of "how we work here."

## What belongs in `AGENTS.md`

The skeleton that works for me in test automation repos:

### 1. Short project description - one paragraph

Don't repeat the README. Enough to say: what's tested, the stack the tests use, their scope (E2E, API, integration), and where this code sits in relation to the SUT (system under test).

### 2. Setup commands

Concrete commands, not general instructions. The agent is there to **run them**, not to interpret them.

```sh
# Install dependencies
pnpm install

# Install Playwright browsers (needed after install or browser bump)
pnpm exec playwright install --with-deps

# Seed test data (required before first local run)
pnpm run seed:test
```

### 3. Test commands

The most important section. List:

- the command that runs **all** tests,
- the command that runs a **single file** (with an example),
- the command for **a single test by name**,
- how to filter by **tag** (if you use tags),
- how to run tests in **headed / debug mode** (if the agent will help you debug),
- how to generate a **report** and where it lands.

This is the section the agent uses most. The less ambiguity, the better.

### 4. Conventions

Don't paste your entire coding stylebook here. Give 5–10 rules you actually want to enforce:

- how we name test files (`*.spec.ts` vs `*.test.ts`),
- how we name tests (pattern: "should … when …" or present-tense sentences),
- where fixtures live and when to create vs reuse them,
- how we handle test data (isolate per test, or per suite),
- how we handle waits (no hardcoded sleeps, prefer web-first assertions).

### 5. What NOT to do

An underrated section. Say it plainly:

- "Don't edit files in `tests/legacy/` - scheduled for removal in Q3."
- "Don't add new dependencies without agreement."
- "Don't use `page.waitForTimeout`."
- "Don't write tests that depend on order."
- "Don't generate selectors from CSS classes - we use `data-testid`."

Without this section the agent will take "the next reasonable step," which will cost you hours of review later.

### 6. Scope and boundaries

Tell the agent which changes are OK to make on its own and which need a conversation. Example:

- OK: add a test to an existing spec, refactor a helper within a single file.
- Needs discussion: change fixture structure, add a new dependency, new config file.

### 7. What a good PR looks like

A short list. Example: "Every PR should contain: a test, repro steps (if the test covers a bug), a link to the ticket, and confirmation that tests pass in CI."

## Pitfalls I see most often

**Too much text.** I've seen 8-page `AGENTS.md` files. An agent given 8 pages treats the whole thing as one giant context and either ignores details or pulls the wrong priorities. Target: 1–2 pages. If it doesn't fit, cut.

**Conflicts with the code.** "All API tests live in `tests/api/`" - meanwhile half of them are in `tests/integration/`. The agent trusts the document, not the code, and goes wrong. Treat `AGENTS.md` like code - update it with every structural change.

**No scope.** "Help with the tests" is not an instruction. "You can add new E2E tests under `tests/e2e/`, do not modify the Playwright config, do not add dependencies" is.

**Contradictions.** "Keep tests short, no longer than 20 lines" next to "Always add comments explaining each step" - those break each other. Read the file top to bottom and hunt for pairs that fight.

**Marketing tone.** "Our team cares about quality and constantly learns" - that isn't an instruction, that's a company mission statement. Delete it. The agent doesn't need it.

## Example: Playwright skeleton

```markdown
# AGENTS.md

## Project
E2E tests for the checkout flow of shop.example.com. Playwright + TypeScript.
Tests run against a dedicated staging environment.

## Setup
- `pnpm install`
- `pnpm exec playwright install --with-deps`
- Copy `.env.example` to `.env.local` and fill in `STAGING_USER` / `STAGING_PASS`.

## Test commands
- All tests: `pnpm test`
- Single file: `pnpm test tests/e2e/checkout.spec.ts`
- By name: `pnpm test -g "should apply discount code"`
- By tag: `pnpm test --grep @smoke`
- Headed debug: `pnpm test --headed --debug`
- HTML report: opens automatically after failure; otherwise `pnpm exec playwright show-report`.

## Conventions
- File naming: `*.spec.ts`, grouped by feature under `tests/e2e/<feature>/`.
- Test titles: `"should <expected behaviour> when <condition>"`.
- Selectors: only `data-testid`. Never CSS classes.
- Assertions: use web-first `expect(locator).toHaveText(...)`. Never `waitForTimeout`.
- Shared fixtures in `tests/fixtures/`. Ask before adding a new one.
- Test data: isolated per test. Use the `createUser()` factory.

## Do not
- Do not edit `tests/legacy/` - scheduled for removal.
- Do not add new npm dependencies.
- Do not write tests that depend on order.
- Do not hardcode sleeps.

## Scope
OK without discussion: new test in existing file, refactor within a single helper.
Needs discussion: new fixture, new config, new folder.

## PR checklist
- [ ] Test added or updated.
- [ ] Linked to Jira ticket.
- [ ] `pnpm test` passes locally.
- [ ] No changes to `playwright.config.ts` unless discussed.
```

## Cypress variant

Similar structure, different commands, plus a few specifics:

- test commands: `pnpm cypress run`, `pnpm cypress run --spec "cypress/e2e/checkout.cy.ts"`, filtering via the `grep` plugin,
- in `conventions` add a rule about using `cy.session()` for login and a ban on `cy.wait(ms)`,
- if you have custom commands in `support/commands.ts`, list the ones the agent should know, one line per command.

A Cypress-specific pitfall: agents love generating `cy.get(...).should(...)` chains that break your conventions. A single line in "Do not" - "Use `cy.findByTestId('button')` instead of `cy.get('.button')`" - saves you half a review.

## API tests variant

Priorities are different here. Add:

- which **HTTP clients** you use (axios, supertest, got) - the agent generates different code for each,
- where **contracts** live (OpenAPI? Pact? internal schemas?) and whether the agent should validate against them,
- how you handle **auth in tests** (token from `.env`? mock? a dedicated `/test-login` endpoint?),
- your **assertion structure** (do you only check status, or also body vs schema),
- what the **test categories** are (smoke / regression / contract / negative) and how the agent should recognize each.

An important "Do not" rule for API: "Do not generate tests that run against production. Every new test must use `baseUrl` from `.env.test`."

## How to tell if `AGENTS.md` is actually helping

Building the file and feeling good that it exists is the easy part. Checking whether it changes anything is harder. A few practical signals:

**1. Does the agent use the right command on the first try?**
Give the agent a task like "run only smoke tests" and see whether it goes straight to `--grep @smoke`, or tries something else first. Track the "guessed" vs "nailed it" count.

**2. How often are you repeating the same review comment?**
If three times a week you're writing "don't use `waitForTimeout`", that rule either isn't in `AGENTS.md`, or it is but got lost in the noise. Every recurring comment gets promoted to the file.

**3. How many files in the next PR need full rewrites?**
A simple quality proxy: the count of files you accept from the agent as-is, vs the count you rewrite from scratch. A good `AGENTS.md` bumps the first number.

**4. The second-team test.**
Hand the repo and `AGENTS.md` to a team that hasn't worked on this project. Ask them to "add a test for scenario X" using an agent. If they get it right on the first pass - the file works. If they end up asking on Slack - you have gaps.

## Key takeaways

- `AGENTS.md` is operational instructions for the agent, not a narrative about the project.
- Structure: description, setup, commands, conventions, "do not", scope, PR checklist.
- Keep it to 1–2 pages. A longer file loses the signal.
- The "Do not" section matters as much as the "Do".
- Treat the file as code - update it whenever the repo structure changes.
- Measure whether it works: via first-try commands, recurring review comments, and the second-team test.

In the next post I'll show how to layer MCP on top of this - starting with the simplest but most useful QA case: search and fetch for evidence.
