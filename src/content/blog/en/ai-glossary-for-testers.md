---
title: "Skills, tools, agents, MCP, AGENTS.md — a concept map for testers"
description: "Five concepts that get confused most often in QA conversations about AI — plus a simple decision model for what to use when."
date: 2026-04-19
tags: ["ai", "qa", "agents", "mcp"]
lang: en
readingTime: 8
---

In conversations about AI in QA, I've noticed that discussions usually stall not because the technology is hard, but because everyone uses the same words for completely different things. "We built an agent" often means "we have a prompt in Notion." "We launched an MCP" turns out to be "we glued together a Python script." "We're writing a skill" sometimes translates to "we appended a paragraph to the system prompt."

Before rolling anything out in a QA team, it's worth having a shared vocabulary. This post is a map of five concepts that get mixed up most often: **skill, tool, agent, MCP, and AGENTS.md**. At the end you'll find a simple decision model for "what to use when."

## Prompt vs skill

A **prompt** is a single instruction you send to the model at a specific moment. "Review this test strategy and point out gaps" — that's a prompt.

A **skill** is a reusable package — typically a folder with a `SKILL.md` file — that tells the model how to perform a specific kind of task. The model itself decides whether to load a given skill, based on the task description. A skill can contain:

- step-by-step instructions,
- examples of good and bad outputs,
- formatting rules,
- helper scripts or templates.

The practical difference: you write a prompt every time, but you write a skill once and the model uses it whenever the problem recurs. For QA teams this matters, because typical tasks — generating E2E scenarios, reviewing strategies, triaging error logs — are exactly those recurring patterns.

The most common mistake: confusing a skill with a long system prompt. A system prompt is "always on." A skill is "loaded contextually." If you load an entire library of instructions every time, you waste context and confuse the model.

## Tool vs MCP

A **tool** is a function the model can call instead of just describing in words. Examples: `run_playwright_test(name)`, `fetch_jira_ticket(id)`, `search_confluence(query)`. Each tool is a contract: name, parameters, response schema.

**MCP (Model Context Protocol)** is a standard — an open protocol — that describes how a server can expose a set of tools (and resources, and prompts) in a way that any compatible AI client can plug into. MCP is not a tool. MCP is a way of distributing tools.

An analogy from everyday IT life: a tool is a specific endpoint in an API. MCP is something like OpenAPI / REST — a convention that lets endpoints be discovered, described, and connected predictably.

What this means for QA:

- A single tool ("call our internal test service") can be built ad hoc.
- When you want the same tools to work in multiple places — in Claude, in your IDE, in a team chatbot — it makes more sense to bundle them into an MCP server.
- MCP isn't magic. It's mostly the discipline of naming things and describing parameters well.

## Workflow vs agent

This is where concepts get confused most often, because AI marketing likes to call anything that does anything an "agent."

A **workflow** is a predetermined sequence of steps. You decide what comes after what. The model executes a specific stage (e.g. generates a scenario), but doesn't decide whether to move forward or go back.

An **agent** is a model you've given a loop, tools, and a goal — and it decides on its own which tool to call next, until it considers the task complete.

A practical criterion: if you can draw a diagram with clear arrows and conditions, you probably want a workflow. If the problem is exploratory ("review reports from the last 10 builds, find flaky tests, gather evidence, propose a fix order"), then an agent makes sense.

In QA, most genuinely useful AI applications are **workflows**, not agents. A workflow is predictable, easier to review and test, and rarely produces costly surprises. An agent is useful where exploration really is the heart of the problem — typically: deep-dive triage, systematic research around an incident, conversational evidence-gathering investigation.

A common mistake by teams entering the AI space: they jump straight to building agents because "that's what the industry does." The effect is the opposite of what they wanted — the team loses trust in AI because they see expensive, random loops instead of repeatable help.

## Where AGENTS.md fits in

**AGENTS.md** is a file in the repository that tells AI agents how to work with this specific codebase. The convention is deliberately similar to README.md — the latter is for humans, `AGENTS.md` is for models.

What typically goes there:

- repo structure,
- setup commands,
- commands for running tests,
- conventions (naming, style, PR requirements),
- things the agent **must not** do (e.g. "don't create new dependencies," "don't touch the `legacy/` folder").

For test automation repositories, `AGENTS.md` is especially valuable, because test automation has a lot of hidden knowledge: which fixtures are shared, how tests run locally vs in CI, what the tags mean, how scenarios are named. Without this file, the agent guesses. With it, the agent works within your rules.

I'm dedicating a separate post to this file because there are quite a few traps. Here, the main message is this: **`AGENTS.md` is not a long text about the project. It's operational instructions for the model.**

## The most common conceptual mistakes

Five I see most often:

1. **"We have an agent"** — they actually have a prompt and manually copy outputs between tools. That's a workflow, and a manual one at that.
2. **"We're exposing an MCP"** — in reality they slapped together a single CLI script. If there's no protocol and the AI client can't auto-discover it, it's just a script.
3. **"A skill is a long prompt"** — a skill is meant to be modular and loaded conditionally; otherwise you lose the point.
4. **"We added a tool"** — but without a good description and examples the model doesn't know when to call it. A tool without a good schema is a dead tool.
5. **"`AGENTS.md` is `README.md` v2"** — `README` answers "what is this and how do I get started." `AGENTS.md` answers "how should you behave here as an agent."

## A simple decision model — what to use when

Before you build anything, ask four questions in this order:

**1. Is the problem recurring?**
Yes → consider a skill.
No → a prompt is enough.

**2. Does the model need something from outside (data, actions)?**
No → a skill is enough.
Yes, one thing, one-off → a single tool.
Yes, a set of things, reusable across multiple places → MCP.

**3. Are the steps known and ordered?**
Yes → build a workflow.
No, the problem is exploratory → consider an agent.

**4. Will the agent work with code / tests?**
Yes → write `AGENTS.md` immediately, before you launch it. Without it, you learn from your own mistakes, and the cost of "agent mistakes in the repo" is high.

These four questions replace ninety percent of architectural debates about "should we build an agent, or a workflow, or maybe an MCP." Most QA teams end up with: skill + a single tool + workflow. And that's fine — it really helps, with no risk.

## Key takeaways

- **Skill** is a reusable instruction package. **Prompt** is a one-off query.
- **Tool** is a function to call. **MCP** is a protocol for distributing tools.
- **Workflow** is a defined path. **Agent** is a model with a loop and autonomy.
- **`AGENTS.md`** is an operational contract with an agent working in your repo.
- Before you build "an agent," check whether you really need autonomy or whether a predictable workflow is enough.

In the next posts we'll break down each of these elements in detail — starting with how to write a sensible `AGENTS.md` for a test automation repo.
