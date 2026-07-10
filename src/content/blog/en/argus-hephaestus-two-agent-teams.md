---
title: "Argus and Hephaestus: Two AI Agent Teams, One Builds, One Inspects"
description: "How I built two teams of specialized subagents in Claude Code: Hephaestus delivers software, Argus hunts bugs. Roles, coordinators, how they cooperate, and when orchestration is overkill."
date: 2026-09-02
tags: ["ai", "agents", "claude-code", "orchestration", "subagents"]
lang: en
readingTime: 15
author: GH
---

For my first months with Claude Code, one agent in one window handled everything. Then it stopped being enough. On tasks like "new feature from requirements to deployment" or "full quality audit of the app", a single agent kept losing context, mixed the architect's hat with the tester's hat and - worst of all - graded its own homework. So I built two teams of specialized subagents: Hephaestus, which builds, and Argus, which looks over its shoulder. This post shows how the teams are organized, how they work together, and when this kind of orchestration earns its keep - and when it's pure ceremony.

## Why a team instead of a single agent

Three things break when one agent does everything.

**Context.** The context window is a resource, not scenery. An agent that gathers requirements, designs the architecture, writes code, runs tests and reads logs in a single session carries all of it at once. The more it carries, the worse it reasons about any single piece. I covered the mechanics and how subagents fix this in my post on [subagents in Claude Code](/en/blog/subagents-claude-code-what-and-why/) - the short version: a subagent gets a fresh window and only the slice of the problem it owns, and only the conclusion flows back to the parent conversation, not thousands of lines of raw output.

**Focus.** A system prompt that says "you are a helpful coding assistant" is the absence of specialization. A prompt that says "you are a database engineer, you design schemas and migrations, you never touch the UI, you return results in this exact format" narrows the decision space. In practice, a tight role with a clear definition of done drifts far less than one universal agent that needs reminding halfway through what it was supposed to be doing.

**Adversarial review.** The most important one. An agent doesn't catch its own bugs, for the same reason a developer doesn't spot the typo in their own code: it looks at its work through the very assumptions that produced it. If the agent misread a requirement, the same misreading sits in the code, in the tests, and in the "self-check" at the end. A reviewer needs fresh context, a different goal and a different prompt - only then does review mean anything.

There is a fourth argument: restricted tools and an explicit role contract reduce the blast radius. In the current configuration reviewers also have Bash, so "read-only" is a prompt rule, not a physical write barrier. Strong isolation requires operating-system or sandbox permissions, not the prompt alone.

## Hephaestus: the forge that ships

Hephaestus takes its name from the smith god. The team has one job: forge working software. Technically it's a set of Claude Code subagents, each with its own system prompt, a narrow scope of responsibility and a restricted set of tools. There is exactly one entry point: **Marcus**, the team lead. He's the one I talk to. Marcus decomposes the goal, picks the lineup for that specific job, produces a delegation plan, then synthesizes the results and reports back.

Here's how the goal "add a reporting module with PDF export" flows through the team:

1. **Environment.** Janus checks whether the team can even start: are the MCP servers configured and connected, are the CLI tools installed, does auth work, do the dependencies line up. The verdict is READY, READY-WITH-GAPS or NOT-READY, with the exact remediation command for every gap. Janus is strictly read-only - it diagnoses, it never installs. This role exists because of a string of sessions where the team face-planted mid-build on missing credentials.
2. **Requirements.** Varro turns a vague sentence into INVEST user stories with acceptance criteria written in Gherkin. Anything ambiguous comes back to me as a question instead of becoming a silent assumption baked into code.
3. **Architecture.** Vitruvius designs the solution: architecture decisions as ADRs, non-functional requirements, integration contracts. The design gets reviewed before the first line of code exists.
4. **Plan.** Agrippa slices the architecture into a sequenced task plan with acceptance criteria, sets the definition of done and the coding standards for the whole crew.
5. **Build.** Maximus takes the backend, Lucius the frontend and UI, Tiberius the database schema and migrations, Appius the CI/CD, infrastructure, deployments and the commit/PR mechanics. When a feature cuts through every layer and needs a single owner, Fabricius steps in and delivers a full vertical slice, database to screen.
6. **Testing and the gate.** Fabius automates the tests, Boethius designs test cases with formal techniques (equivalence classes, boundary values), Catiline does manual and exploratory testing like a hostile user, Mercury measures performance, and Cassius runs a security review against STRIDE and OWASP - read-only again. Seneca ties it together with a QA strategy and a GO/NO-GO verdict, and Severus, the most distrustful agent on the roster, performs an adversarial review of every non-trivial diff right before merge: approve or block.

Around that flow sits the support crew: Cato for backlog and scope, Cicero for documentation, Regulus for checklists, Tacitus for log condensation, and Numa for Scrum ceremonies, impediments, and delivery risks.

| Area | Agents | Responsibility |
|---|---|---|
| Entry point | Marcus | Goal decomposition, lineup selection, delegation plan, synthesis |
| Environment | Janus | Readiness of MCP, CLI, auth, dependencies; READY / READY-WITH-GAPS / NOT-READY verdict; read-only |
| Requirements | Varro | INVEST stories, Gherkin acceptance criteria |
| Architecture | Vitruvius | System design, ADRs, non-functional requirements |
| Plan | Agrippa | Task breakdown, definition of done, coding standards |
| Build | Maximus, Lucius, Tiberius, Appius, Fabricius | Backend, frontend, database and migrations, CI/CD and deploys, full vertical slices |
| Testing | Fabius, Boethius, Catiline, Mercury, Cassius | Automation, test design, exploration, performance, security; reviewer roles have a no-edit contract |
| Gate and support | Seneca, Severus, Cato, Cicero, Regulus, Tacitus, Numa | QA strategy and GO/NO-GO, pre-merge gate, backlog, docs, checklists, logs, ceremonies and risks |

Role sources are maintained in `hephaestus/claude/agents/` and as `*.toml` plus `*.md` pairs under `hephaestus/codex/`; a Claude Code installation may expose them in `.claude/agents/`. This distinguishes the source repository from the installed location. Janus's skeleton, for example:

```markdown
---
name: janus
description: Verify the environment is ready before the team builds.
tools: Read, Grep, Glob, Bash
---
You are Janus, the gatekeeper. You check MCP servers, CLI tools,
auth and dependencies against the specific goal at hand.
You never install or fix anything - you diagnose.
You return a verdict: READY / READY-WITH-GAPS / NOT-READY,
plus the exact remediation command for every gap found.
```

## Argus: a hundred eyes on quality

In mythology Argus is the hundred-eyed watchman - the one who sees everything at once. Hard to find a better name for a QA team. Where Hephaestus is organized around the delivery cycle, Argus is organized around the surfaces where quality breaks: every significant surface of the application has its own dedicated hunter.

The entry point is **Odysseus**. He doesn't start by dispatching agents - he starts by deciding how much engagement this particular job deserves. The modes range from a quick reconnaissance, through bug hunting on selected surfaces, to a full audit with regression automation. Picking a mode is really picking a cost - more on that in the pitfalls section.

Before anyone hunts, two analysts do the groundwork. Kalchas runs reconnaissance: he maps the stack, the API endpoints, the user roles and the data. Metis then writes the test strategy into TEST-STRATEGY.md with an explicit coverage grid: what we test, with what, in which order, and why. That grid later becomes a hard acceptance criterion - at the end, every cell must be either filled or explicitly justified as skipped.

Then the hunt starts, in parallel, one hunter per surface:

- **Orion** - functional UI bugs: forms, states, behavior.
- **Lynceus** - presentation and visuals: layout, number and date formats, sorting, legibility.
- **Antigone** - accessibility against WCAG: keyboard, contrast, screen-reader semantics.
- **Atalanta** - API: contracts, validation, data integrity.
- **Proteus** - multi-protocol API: GraphQL, gRPC, WebSocket and asynchronous messaging.
- **Perseus** - security against STRIDE and OWASP: access control, injection, data exposure.
- **Hermes** - performance: payload sizes, cache headers, N+1 queries, latency under load.
- **Tyche** - resilience and chaos: controlled failures and failure-behavior oracles.
- **Charon** - the database; activated conditionally, only when recon confirms direct DB access.
- **Ariadne** - deep journeys and business rules: she arranges her own preconditions (creates accounts, seeds data) to reach the states that breadth-first hunters never touch.

Alongside the hunters work the path analysts: Penelope specifies the baseline UI journeys, Theseus the baseline API paths - the things that must always work become the green regression baseline. And the automation crew makes the knowledge permanent: Atlas architects the shared test harness (config, API client, test data) and the single `run-tests.sh` script that runs every suite and emits one aggregated result. Daidalos automates the UI in Playwright, Talos the API, Nike performance, Mnemosyne the database, Aegis the security regression. The rule is simple: every confirmed bug ends up as a red test linked to its report, every baseline path as a green one.

Finally, control and synthesis. Tiresias - white-box, static source analysis - runs conditionally, when the code is available. Aristarchus reviews all the test code (read-only: determinism, honest assertions, cleanliness). Minos triages the bugs: independently verifies severity, deduplicates and prioritizes, so a clean ledger emerges instead of a pile of duplicates. Kleio writes the QA report and ticks off the final acceptance checklist.

| Area | Agents | Responsibility |
|---|---|---|
| Entry point | Odysseus | Engagement mode, crew selection, deliverable contract |
| Recon and strategy | Kalchas, Metis | System map (stack, API, roles, data); TEST-STRATEGY.md with coverage grid |
| Bug hunters | Orion, Lynceus, Antigone, Atalanta, Proteus, Perseus, Hermes, Tyche, Charon, Ariadne | UI, accessibility, API and protocols, security, performance, resilience, database and deep journeys |
| Baseline paths | Penelope, Theseus, Pistis | Canonical UI and API journeys plus consumer contracts |
| Automation | Atlas, Daidalos, Talos, Nike, Mnemosyne, Aegis | Shared harness and run-tests.sh; UI (Playwright), API, performance, database, security regression |
| Source analysis | Tiresias | White-box; only with source-code access |
| Control and reporting | Aristarchus, Asklepios, Minos, Kleio | Test-code review, brownfield suite sanitation, triage and QA reporting |

After a full audit, the output looks like this:

```text
solution/
  TEST-STRATEGY.md      # Metis: the coverage grid
  paths/ui-*.md         # Penelope: baseline UI journeys
  paths/api-*.md        # Theseus: baseline API paths
  PERF-REPORT.md        # Hermes: performance characterization
bugs/
  ORI-001-form.md       # one file = one bug, hunter's prefix
  PER-003-idor.md
tests/
  ui/  api/  perf/  security/
run-tests.sh            # Atlas: single entry to the whole regression
```

## How they play together

The most interesting part happens at the seam. Hephaestus already has internal quality control - Fabius, Catiline, Cassius, Severus - so why a second team at all? Because internal control shares context with the builders. Marcus coordinates both the build and the tests, so the same assumptions seep into both sides. Argus doesn't know those assumptions. Odysseus receives a built application and a goal, not the author's explanations. If Varro refined a requirement wrong and Fabius wrote tests against that same wrong requirement, the internal gate goes green - and only Ariadne, walking the business rules with no knowledge of the assumptions, has a chance to knock it over.

A typical cycle:

1. Hephaestus delivers an increment: code, tests, docs, and a green internal gate from Severus.
2. Argus receives the built app and hunts adversarially in the mode Odysseus picked.
3. Minos triages the findings: verifies severity, deduplicates, prioritizes.
4. Kleio's report goes back to Marcus. High-priority bugs land in Cato's backlog and return to the builders as ordinary tasks.
5. The fixes run through Argus's regression: one `./run-tests.sh`, one aggregated result. The red tests pinned to fixed bugs must turn green.
6. Only then does Seneca issue the GO.

Two properties of that seam matter most. First, **one report**: a dozen-plus roles work, but everything converges into the post-triage bug ledger and Kleio's report - I don't read twenty separate opinions. Second, **one gate**: the GO/NO-GO verdict takes both sides into account - Hephaestus's internal gate and Argus's external audit. Two lines of defense, one point of decision.

## What I've learned: the pitfalls

**Token cost is real.** A full Argus lineup on a mid-sized app can burn a multiple of what one solid single-agent session costs. Parallelism shortens wall-clock time but multiplies spend - eight hunters read the same application eight times. That's why Odysseus's engagement modes aren't decoration, they're cost control: day to day I run the limited modes, and I save the full audit for the releases that matter.

**Orchestration theater.** The biggest risk isn't technical. It's easy to build a team that looks impressive and produces impressive-looking artifacts that nobody reads. The test is simple: if a role's output never changes a decision, that role is decoration. I cut several roles on exactly that test. I've written skeptically about this in [multi-agent orchestration](/en/blog/multi-agent-orchestration-when-one-agent-is-enough/), and I stand by it: an agent team has to be justified, not just built.

**One agent is still often enough.** A bug fix, a small refactor, a one-afternoon prototype - one agent, one window, zero orchestration. Teams belong where the work has multiple phases with conflicting demands on context, or where independent verification is required. Spinning up Hephaestus to fix a typo is an anti-pattern.

**The coordinator is the weakest link.** Marcus and Odysseus decide everything: no specialist can save a bad decomposition, because each of them will faithfully execute the wrong task. The coordinator prompts are the longest and the most frequently revised files in both teams - and that's how it should be.

**Roles drift.** After a few weeks, Orion and Lynceus started reporting the same bugs - the line between "functional" and "presentation" turned out to be too soft. I had to write the boundary explicitly into both prompts, along with a tie-breaking rule. An agent team needs the same maintenance as a human team; it just breaks faster and gets fixed faster.

## How to start building your own team

Don't start with forty roles. My starter recipe:

1. **Two or three roles.** A builder, a reviewer and a coordinator are enough. That already buys you the most valuable property of the whole pattern: a reviewer with fresh context who doesn't know the author's assumptions.
2. **Narrow prompts.** Every role gets: who it is, what it does, what it does **not** do, and the exact output format. The "what you don't do" section matters more than it looks - it's what prevents drift.
3. **Restricted tools.** A reviewer with no write access, an analyst with no network access if it doesn't need one. The toolset is part of the role definition, not an afterthought.
4. **One coordinator, one aggregate artifact.** You talk to a single agent, and results converge into one place: a report, a bug ledger, a plan. If you're manually stitching together the outputs of five agents, the orchestration isn't working.
5. **Measure whether it works.** Does the team find problems a single agent didn't? Do the outputs change decisions? If not, go back to one agent and don't look back.

I walked through building a single subagent step by step - the file, the prompt, the tools, the test - in [a custom subagent example](/en/blog/custom-subagent-claude-code-example/). A team is that pattern applied consistently, plus a coordinator that knows how to delegate.

## The bottom line

Hephaestus and Argus are one idea applied to two goals: dividing work into narrow roles gives better context focus than one agent doing everything, and a single entry point - Marcus on the build side, Odysseus on the inspection side - turns a pile of prompts into a team. The most value lives at the seam: the team that builds doesn't judge itself; it gets judged by a team that doesn't know its assumptions. One report and one gate mean a dozen-plus roles produce a single decision, not a dozen opinions.

The order is non-negotiable, though: problem first, team second. If one agent delivers, keep one agent. Role-based teams pay off when the work has multiple phases, needs independent verification, and repeats often enough for the prompt investment to amortize. For me that threshold was clearly crossed - which is why a smith and a hundred-eyed watchman now live in my Claude Code.
