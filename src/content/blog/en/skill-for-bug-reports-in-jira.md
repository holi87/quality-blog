---
title: "A skill for filing bugs in Jira through Atlassian MCP"
description: "How to build a skill that turns your „hey, something's broken on checkout” into a complete Jira ticket — with evidence, dedupe, and without polluting the project. No autopilot agent, a deliberate human confirm in the middle."
date: 2026-04-30
tags: ["ai", "qa", "agents", "skills", "mcp", "jira"]
lang: en
readingTime: 11
---

In every QA team I've worked with, the same moment comes back every sprint: a tester catches a bug, describes it in a single sentence on Slack, and attaches a Jira link. Open the ticket and the summary reads „login broken", there are no reproduction steps, the screenshot shows half a screen, and „works on mine" appears in the comments twelve minutes later. Two days in, the developer closes it as „cannot reproduce". Three weeks in, the bug is back in production — this time with a wider audience.

It isn't that testers are sloppy. Filing bugs is a repetitive job that demands discipline and is easy to shortcut under time pressure. A good ticket requires a handful of things, done in a stable order: reproduction steps, expected vs actual behaviour, environment, evidence, priority, a duplicate check. Each element is trivial in isolation. Performed a dozen times a day, they add up to a task where something routinely slips.

This is exactly the kind of work a skill was designed for. In this post I'll walk through the skill I built on top of Atlassian MCP — what's in it, what deliberately isn't, and where it's easiest to fall into the „AI creates tickets on its own" trap.

## Why a skill, not a prompt

The first approach I tested was a prompt. A template along the lines of „given a bug description, produce a ticket with the following fields in our project's conventions" worked for about a week. Then it started to bloat: component naming conventions, the list of required labels, Jira Markup formatting, priority rules, duplicate handling. After a month the prompt filled half a screen and I was still doing part of the work by hand inside Jira.

A skill solves this differently. It's a self-contained instruction package — in Claude Code that's a folder with a `SKILL.md` — which the agent loads when it's actually needed. It doesn't weigh down the system prompt, doesn't eat context, and most importantly it can reach for tools: Atlassian MCP to file the ticket, Playwright MCP for a screenshot and trace, a terminal tool to run `curl`.

If „skill", „tool" and „MCP" still blur together, it's worth revisiting the [glossary for testers](/en/blog/ai-glossary-for-testers). This post assumes those basics are settled.

## What we take from Atlassian MCP

The official Atlassian MCP (and a few community wrappers around it) exposes standard Jira operations to the agent. For bug reporting, four of them are enough: `search` by JQL, `getIssue` to inspect a potential duplicate, `createIssue` to file a new ticket, and `addAttachment` to attach the evidence.

It's worth noting what isn't on that list. No `deleteIssue`, no `transitionIssue`, no `assignIssue` — nothing that mutates existing tickets. That's a deliberate choice: a skill that reports shouldn't be able to close or rewrite. That's a human responsibility. The credentials I use have permissions for that minimal set only, further scoped to specific projects. A request like „close these ten old bugs" simply has nowhere to land inside this skill.

The cheapest moment to pin that scope down is during setup, not after the first incident where the agent modifies something by accident.

## Anatomy of the skill

My `SKILL.md` has four parts.

**Trigger** — one sentence specifying when the skill activates. Mine reads: „activate when the user describes an observed defect — an HTTP error, unexpected UI behaviour, incorrect state in the database. Do not activate for review of an existing ticket or a hypothetical discussion". A precise second sentence removes a noticeable share of false activations.

**Input** — what the skill expects from the user. At minimum: a short problem description, the layer (API / UI / DB / messaging) and the environment. If something is missing, the skill asks one question — not three, no essays.

**Process** — the main part, covered below.

**Output** — what exactly lands in Jira. A draft in Jira Markup, a list of attachments, an explicit confirmation step before `createIssue`, and after approval, the new ticket's key plus a link to share onwards.

## The process after activation

When I hand the skill a description like „POST /orders returns 500 with an empty cart on staging", a six-step sequence kicks in.

**Dedupe.** The first step is always `search(jql)` against phrases from the description. In practice that looks like `project = CHK AND status != Closed AND text ~ "empty cart 500"`. If there are hits, the skill presents the three most similar tickets and asks whether any of them describes the same problem. In the first month that single step removed a noticeable fraction of what would otherwise have become duplicates.

**Collecting evidence.** The order depends on the layer. For API the skill runs `curl` and saves request, response, headers and status code. For UI it reaches for Playwright MCP — navigates to the URL, replays the steps, calls `browser_take_screenshot`, collects `browser_console_messages` and failed requests from `browser_network_requests`. For DB — a query through the DB MCP, result as CSV. Everything is written locally into `bugs/evidence/BUG-<timestamp>/`, because those files become the ticket's attachments.

**Priority by rule.** Without an explicit definition the model tends to label everything „Major", because it sounds neutral. The fix is a short set of criteria inside the skill itself: *Blocker* means „production is down, no workaround"; *Critical* means „core function broken, workaround expensive"; *Major* means „important function broken, workaround exists"; *Minor* covers cosmetics and minor defects. If the description already specifies a priority, it's honoured. If it doesn't, the skill proposes one and asks for confirmation. Without that rule every ticket lands with the same priority and the Priority field quickly loses meaning.

**Draft in a fixed format.** The skill fills the template in the same structure every time. Summary starts with the component in square brackets: `[Checkout] POST /orders returns 500 on empty cart`. Description is rendered in Jira Markup with Steps, Expected, Actual, Environment and Evidence sections. Labels include `bug`, the layer, the component. Placeholders like `{{TODO}}` aren't accepted — missing information means no ticket.

**Dry-run and confirmation.** The pivotal moment of the whole sequence. The skill doesn't create the ticket immediately. It presents the draft in the exact form it intends to send and waits for a decision. Accept, reject, or request a change — any response is allowed. An „create without asking" mode does exist, but only as an explicit flag on the call. Turning it into the default would mean giving up the single most important safeguard against polluting the Jira project.

**Creating the ticket.** Only now does `createIssue` run, followed by `addAttachment` for each evidence file. At the end, the skill returns the key and a link to the new ticket.

## The description template, kept in one place

Jira Markup isn't Markdown, and that small difference trips up every new skill author. I keep the template as a separate file inside the skill, rather than baking the format into instructions:

```text
h2. Steps to Reproduce

# Log in as {{qa-user-checkout}}
# Add product {{SKU-42}} to the cart
# Remove the product — cart is empty
# POST /api/orders with an empty body

h2. Expected

* 400 Bad Request, payload {{{"error": "empty cart"}}}

h2. Actual

* 500 Internal Server Error
* Stack trace points to an NPE in OrderService.validate()

h2. Environment

* Build: 3.12.4
* URL: https://staging.example.com
* Browser: Chrome 138, macOS 15.3

h2. Evidence

* [^screenshot.png] — cart state before POST
* [^response.json] — full 500 response
* [^playwright-trace.zip] — trace of the replay
```

Keeping the template in a single file has a very practical property: one change propagates to every future ticket. In the variant where the format lived inside the skill's instructions, every update required edits in several places at once — easy to drift out of sync.

## What I deliberately don't allow

Four decisions that in practice determine whether the skill stays in use over time.

**Auto-assign.** The idea of having the skill assign the ticket to „whoever touched the code last" is tempting. In practice it gets messy — `git blame` doesn't always point at the right author, and a mistaken assignment outside working hours generates more damage than benefit. Assignment belongs in triage, performed by a human.

**Auto-transition of status.** The skill only creates tickets. It doesn't move them to „In Progress", doesn't close them, doesn't clone them between projects. A fresh ticket sits in „To Do" until a person picks it up.

**Screenshot-only tickets.** A screenshot without steps isn't a report. Reproduction steps are a required field — if I didn't supply them, the skill asks. If they still aren't provided, nothing reaches `createIssue`.

**A single skill across all projects.** The variant where the Jira project is picked heuristically from description phrases („checkout" → CHK, „auth" → AUTH) tends to be unreliable — one mistake in a dozen means a ticket filed in a project nobody watches. Keeping the project in the skill's trigger and running per-project variants works better.

## A quality gate before the ticket ships

Right before `createIssue`, the skill walks a short checklist. It's not code — it's a section of `SKILL.md` that instructs the model: „if any of the following isn't satisfied, return to the user with a list of gaps and do not create the ticket".

Summary must start with the component in square brackets. Steps must be numbered and no more than seven items long. Expected and actual must actually differ — it sounds trivial, but with a terse problem description those fields end up nearly identical surprisingly often. Environment must contain build, URL and browser. At least one attachment must be present, and for UI — screenshot and console log. Priority must be set. Labels must include the component and the layer.

In the first weeks after introducing this checklist, the skill sends drafts back regularly and asks for missing pieces. Over time those situations fade, because the information starts coming in up front, at the problem-description stage. The mechanism resembles a linter: checklists of this shape don't change people, they change what people supply on input.

## When extensions make sense

The first version of the skill covered four actions only: search, evidence, draft, create. I add further pieces only when the same manual step starts repeating dozens of times.

The first extension was a **triage mode** — a separate skill that on „triage BUG-1422" pulls the ticket, fetches CI logs from a ±2h window around the report time, looks at recent commits in the component named in the summary, and proposes candidates for the likely cause. This is no longer reporting, it's diagnosis — but the shape of the work is the same: a fixed sequence of manual steps that now takes a few minutes instead of a few hours.

The second extension is a **link to a pull request**. With GitHub MCP connected, after creating the ticket the skill checks whether an open PR touches the component in question and offers to link it. It retires the standing stand-up question „which ticket does this PR address".

What I didn't add — component auto-tagging and severity inferred from description content. In both cases the error margin is too high, and a silent mistake in a priority field is hard to catch later.

## Summing up

A skill for bug reporting isn't about „letting AI file tickets for the tester". It's about taking the repetitive layer off their plate — dedupe, template, Jira Markup, attachments — and leaving them the part that requires human judgment: the call on whether this is a bug, how serious, and who to route it to. Atlassian MCP provides access to Jira. Playwright MCP provides evidence. The skill provides the procedure. The human provides the decision.

The biggest value I see in this approach shows up only after the first month of use. It isn't the first automatically filed ticket. It's the observation that Jira stops accumulating tickets without reproduction steps. Not because the team suddenly writes better. Because the skill doesn't let those tickets through.

To see where this kind of skill fits into a broader Test Architect workflow, see [10 AI workflows that actually help](/en/blog/10-ai-workflows-for-test-architect). And if you don't have a first MCP for your QA team yet — start with [a search/fetch pair over evidence](/en/blog/first-mcp-for-qa-search-fetch). That's the cheapest, lowest-risk entry point.
