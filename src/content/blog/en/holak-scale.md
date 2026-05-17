---
title: "Holak Scale v2.1e - enterprise. An AI adoption maturity model for organizations"
description: "12 maturity levels of AI in the workplace - from resistance, through agent workflows, to a purpose-built agentic OS for concrete business outcomes. Version v2.1e splits the enterprise path from the private one."
date: 2026-05-18
tags: ["ai", "adoption", "enterprise", "strategy", "governance"]
lang: en
readingTime: 14
author:
  - GH
  - KG
---

The Holak Scale evolves faster than most maturity models because what AI can actually do changes faster than they do. **Version 2.1** splits the single scale into two tracks: **v2.1e** for professional use and **v2.1p** for private use. This article is the enterprise version. The private version has its own post: [Holak Scale v2.1p - private](/en/blog/holak-scale-private/).

## Why two scales

The v2 scale worked well as a general model, but in practice it conflated two different worlds. In a company, what matters is business value, security, governance, process, accountability, cost and auditability. At home - comfort, privacy, trust, daily habits, real time saved and not over-engineering. Trying to measure both with the same ruler led to misunderstandings - someone at home level 9 would ask whether that meant their company was also "shipping at 9". It doesn't.

In v2.1e we measure the **maturity of an organization, team or process** in the professional use of AI. We don't measure "does the company have ChatGPT". We measure whether AI is genuinely changing the way work is done - whether it's safe, measurable, auditable, and tied to a business outcome.

## What's new in v2.1e

Four changes versus v2:

1. **Scale split** into enterprise (v2.1e) and private ([v2.1p](/en/blog/holak-scale-private/)).
2. **Permanent assessment axes from level 4 onwards** - context management, model awareness, token/cost efficiency, verifiability, reversibility, security and privacy.
3. **Hooks at level 8**, not as a separate level. Hooks are a deterministic control layer around the agent, not autonomy.
4. **Level 11 defined as agentic OS** - not "more agents", but a system of work designed for a concrete business outcome.

## Levels map v2.1e

| Level | Name | In one sentence |
|---|---|---|
| 0 | Resistance / no adoption | The organization does not use AI or uses it only informally. |
| 1 | Basic chat | Employees ask AI ad hoc, without standards. |
| 2 | Conscious prompting | People understand that context, goal and format shape the result. |
| 3 | Prompting frameworks | The team uses repeatable prompt structures and templates. |
| 4 | Custom instructions and token hygiene | Standing instructions, roles and preferences are not rewritten in every prompt. |
| 5 | Project context | Project knowledge lives in files, repos and documentation, for humans and agents. |
| 6 | Advanced operating instructions | The agent knows not only *what* to do but *how* to act, when to ask, what not to do. |
| 7 | Skills, knowledge bases and evals | The organization builds repeatable AI skills, RAG, playbooks and test sets. |
| 8 | Tools, MCP, connectors and hooks | AI acts on systems, but in a controlled environment with permissions and automated checks. |
| 9 | Agent workflows | A human defines the goal; the agent plans and executes the process end-to-end under control. |
| 10 | Multi-agent orchestration | Multiple agents collaborate under a coordinator or workflow engine. |
| 11 | Agentic OS for business goals | The organization designs its own operating system for agent work, tied to concrete business outcomes. |

## Level 0 - Resistance / no adoption

The organization does not use AI or officially forbids it, even though employees may be using tools privately or quietly.

- **Barrier:** fear, compliance, lack of knowledge, no topic owner.
- **Success:** an honest decision - either a deliberate "not now" or the start of a controlled pilot.
- **Trap:** pretending AI doesn't exist while shadow AI grows.

**Signal to move up:** the organization can name what AI uses are acceptable and what aren't.

## Level 1 - Basic chat

Employees use AI as a search engine or text generator. Question → answer. No shared standards.

- **Barrier:** not knowing how to ask or how to verify.
- **Success:** people start using AI for simple tasks - summaries, emails, ideas, first drafts.
- **Trap:** false sense of adoption - "we use AI", but skill levels don't grow.

**Enterprise evidence:** isolated uses, no prompt repo, no policy, no metrics.

## Level 2 - Conscious prompting

Employees understand that AI needs a goal, context, role, constraints and an expected format.

- **Barrier:** moving from "I ask a question" to "I design an instruction".
- **Success:** prompts contain goal, audience, inputs, constraints and output format.
- **Trap:** belief that a good prompt solves everything.

**Example.** Instead of "Write test cases", try: "You are a QA engineer on a banking project. Based on the acceptance criteria below, prepare positive, negative and edge-case tests in a table format: ID, condition, steps, expected result, risk."

## Level 3 - Prompting frameworks

The team has shared templates: CRISP, role-task-context-format, few-shot, quality criteria, review checklists.

- **Barrier:** discipline of using and maintaining templates.
- **Success:** the team has a shared language for working with AI.
- **Trap:** the "golden prompts" library grows into 200-line monsters.

**Enterprise evidence:** prompt library, examples of good/bad prompts, training, prompt review.

## Level 4 - Custom instructions and token hygiene

The organization starts moving repeatable instructions out of prompts and into settings, system instructions, custom instructions, assistant configurations and project standards.

This is the first level where **saving tokens and cost** appears explicitly. The point isn't to write shorter at any cost. The point is to stop paying daily for the same context.

- **Barrier:** investment in setup that only pays off over time.
- **Success:** shorter prompts, more consistent answers, less copy-pasting of instructions.
- **Trap:** custom instructions turn into a dumping ground for everything.

**New in v2.1:** from this level we explicitly assess *model awareness* - does the user know when to use a fast model, when a reasoning model, when a code model, when multimodal, and when not to use AI at all.

## Level 5 - Project context

Context lives next to the project: in `README.md`, `AGENTS.md`, `CLAUDE.md`, architecture docs, ADRs, test rules, domain definitions, glossaries and examples.

- **Barrier:** treating AI documentation as an engineering element, not an add-on.
- **Success:** a new human or agent understands the project faster.
- **Trap:** the documentation is out of date, so the agent executes old rules.

**Enterprise evidence:** context files in the repo, updated alongside changes, actually used in practice.

## Level 6 - Advanced operating instructions

The agent has a described behavior: when to ask, when to act on its own, when to escalate, what not to do, how to report, how to verify the result.

- **Barrier:** writing down norms that previously "lived in the team's head".
- **Success:** the agent behaves consistently with the team's working culture.
- **Trap:** instructions too rigid, blocking sensible action.

**Example rules:**

- "Do not add dependencies without approval."
- "Before changing CI configuration, propose a plan."
- "After test changes run only the affected scope; leave the full regression to CI."
- "Do not touch production data."

## Level 7 - Skills, knowledge bases and evals

The organization has repeatable AI skills: report generation, log analysis, code review, test creation, requirements analysis, meeting summaries, ticket triage, release-note writing.

Knowledge bases and RAG also appear, but with quality control: sources, freshness, owners, versioning.

- **Barrier:** information architecture.
- **Success:** the agent uses the right knowledge and skill without constant hand-holding.
- **Trap:** multiplying skills without owners and without measuring quality.

**New in v2.1:** level 7 requires simple **evals** - test cases that check whether a prompt, skill or agent still works after a model change, instruction change, or data change.

## Level 8 - Tools, MCP, connectors and hooks

The agent doesn't only write. It has access to tools: repositories, ticket systems, documentation, APIs, Slack, email, calendars, databases, test environments, CI/CD.

MCP fits here - it's a standard for connecting LLM applications to external data sources and tools.

**Hooks** are part of this level in v2.1. They let you enforce automated checks before, during or after the agent acts: running tests, lints, security scans, prompt validation, mandatory review, blocking forbidden commands, audit logging.

- **Barrier:** security, permissions, audit, ownership.
- **Success:** the agent has access only to what it needs, and its actions are logged and controlled.
- **Trap:** "let's plug everything into everything".

**Enterprise controls:** agent registry, separate agent identity, least privilege, logs, cost limits, DLP, tool allowlist, sandbox, approval for risky actions.

## Level 9 - Agent workflows

A human defines the goal; the agent plans the steps and executes the task. The human doesn't drive every step but checks the outcome, logs and decisions.

- **Barrier:** trust, verifiability, reversibility.
- **Success:** the agent completes an end-to-end process within a known, bounded scope.
- **Trap:** the illusion of autonomy - the agent acts alone, but the human later rewrites 60% of the output.

**Enterprise examples:**

- "Prepare release notes from the last sprint."
- "Analyze production errors and propose priorities."
- "Review this pull request, run tests, flag risks."
- "Draft a customer reply based on the ticket history."

At this level **guardrails** and **human review** are essential. In production, automated validations and human approvals decide whether the agent should continue, stop or wait for sign-off.

## Level 10 - Multi-agent orchestration

The organization has multiple specialized agents: analyst, researcher, developer, tester, reviewer, compliance checker, documenter, release manager.

- **Barrier:** designing an agent *system*, not a single prompt.
- **Success:** agents cooperate in a controlled process and deliver outcomes better than a single agent.
- **Trap:** overengineering - many agents where one good workflow would do.

Anthropic, in its agent-building practices, emphasizes that effective implementations often win with simple, composable patterns rather than overly complex frameworks. That's an important warning for level 10: orchestration makes sense only when the task complexity justifies it.

## Level 11 - Agentic OS for business goals

This is a new level in v2.1.

The organization can design its own **agentic operating system** for a specific business area. It's not about "more agents". It's about a coherent system where:

- business goals are translated into workflows,
- agents have roles, owners and a scope of responsibility,
- tools are connected through controlled interfaces,
- data has sources, owners and trust levels,
- actions are logged,
- costs are measured,
- risky actions require approval,
- mistakes can be undone,
- governance is part of how it runs, not a document after the fact.

- **Barrier:** moving from "we use AI" to "we are designing a new system of work".
- **Success:** AI becomes the operating layer of a business process.
- **Trap:** building a flashy platform without a clear business goal.

**Example enterprise agentic OS:**

1. **QA Agentic OS** - requirements analysis, test generation, regression maintenance, flaky-test analysis, quality reports.
2. **Release Agentic OS** - changelog, risks, test-impact analysis, release communication, checklists, rollback plan.
3. **Compliance Agentic OS** - regulation monitoring, policy mapping, procedure drafts, evidence collection.
4. **Customer Support Agentic OS** - triage, replies, escalations, sentiment analysis, knowledge base, quality of service.
5. **Finance Reporting Agentic OS** - data collection, variance explanations, narrative preparation, source control.
6. **Procurement Agentic OS** - offer analysis, supplier risk, comparisons, procurement-policy compliance.

**Level 11 test:** can you point to one concrete business process and say, "here AI is not an add-on, it's the operating layer of the process - with goals, controls, metrics, audit and an owner"?

## Boundaries worth watching

**Boundary 8→9.** Tools are not yet autonomy. You can have MCP, hooks and 20 integrations, and the agent will still wait for every human step. Moving to 9 means the agent plans, acts and reports - and the human reviews the outcome, not every move.

**Boundary 10→11.** Orchestration is not yet an agentic OS. You can build a multi-agent workflow without governance, owners, audit or cost metrics. An agentic OS is a system of work with a business goal, not a demo of an agent crew.

## v2.1e anti-patterns

- **Shadow AI.** No policy, so everyone uses what they want on data they shouldn't.
- **Prompt cargo cult.** Copying other people's "mega-prompts" without understanding the context.
- **Integrations without governance.** An agent with access to the whole infra without identity, audit or approval.
- **Agents without owners.** They run in production but no one knows who is accountable for them.
- **OS without a goal.** A platform with a dashboard, cost meters and a slide deck - but no real business process it serves.

## Model awareness

In v2.1, maturity also includes model awareness. The same prompt doesn't have to work the same way on different models. A fast model is instructed differently than a reasoning model, a code model differently than a small model, a long-context model differently than a multimodal one.

A more mature person or organization doesn't only ask "which prompt should I use?" - they also ask: **which model, at what cost, with what level of reasoning and what kind of validation, is right for this task?**

## What's next

The private version of the scale has its own article: [Holak Scale v2.1p - private](/en/blog/holak-scale-private/). It measures the maturity of everyday AI use - home, learning, finance, smart home, life organization. Different risks, different successes, different traps.

Earlier versions: the original [AI maturity model (v1)](/en/blog/ai-maturity-model/) remains available as historical context. The v2.0 content has been folded into this v2.1e article.

---

## Version history

- **v1.0** - *AI adoption maturity model*. Created in March 2026, published **15 April 2026**. A short 11-level model.
- **v2.0** - *Holak Scale*. Created in April 2026, published **20 April 2026**. Expanded with diagnosis, anti-patterns and the organizational dimension.
- **v2.1e** (this article) - *enterprise*. Splits enterprise and private tracks, places hooks at level 8, defines level 11 as agentic OS. **18 May 2026**.
- **v2.1p** - *private*. Private version published **17 May 2026**. [Read v2.1p →](/en/blog/holak-scale-private/)

The scale remains an iteratively evolving model. AI, tools and the way we work with agents change faster than most maturity models, which is why the Holak Scale will keep being updated as it gets used in organizations and everyday life.
