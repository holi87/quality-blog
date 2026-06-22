---
title: "The Holak (and Gomulski) Scale 3.0 - fewer levels, more meaning"
description: "An update to the AI adoption maturity model, co-created with Konrad Gomulski. Version 3.0 simplifies the scale to five levels and stops treating a level as a label for a person - it moves the diagnosis onto a specific context: a task, a team, a process or an organisation."
date: 2026-06-22T14:00:00
tags: ["ai", "adoption", "strategy", "governance", "holak-scale"]
lang: en
readingTime: 9
author:
  - GH
  - KG
---

The Holak Scale 2.1 was needed. It mapped the road from a simple chat, through prompting, instructions, context, skills, tools, agentic workflows, orchestration and an agentic OS. It was also deliberately split into two tracks: enterprise and private.

I co-created version 3.0 with **Konrad Gomulski**. It is, to a large extent, the result of his questions, counterarguments and reviews - which is why from this version on I call it the **Holak (and Gomulski) Scale**. Konrad is responsible for roughly a tenth of this rebuild, but for exactly the part that changed how I think about the model the most: dropping the level as a label and putting the weight on context.

> You will find the full model on the [Holak (and Gomulski) Scale 3.0](/en/holak-scale-3/) page. This post explains why the update exists and what changed compared to version 2.1.

After many conversations, diagnoses and examples we saw one recurring problem: the scale started to be taken too literally.

People asked:

> Am I at 5 or at 6?

Teams asked:

> If we have MCP, are we at 8?

Organisations asked:

> If one person runs agentic workflows, is the whole company high up too?

Those are the wrong questions. That is why the Holak (and Gomulski) Scale 3.0 exists.

## The biggest change: fewer levels

Version 3.0 simplifies the scale to five levels:

| Level | Name | In one sentence |
|---:|---|---|
| 0 | Resistance | AI is not used, or it is used outside conscious adoption. |
| 1 | Basics | AI helps with simple, ad hoc tasks. |
| 2 | Conscious use | The user works deliberately with a goal, context, format, iteration and instructions. |
| 3 | Advanced processes | AI becomes part of a process: it has context, tools, skills, knowledge, evaluations and rules. |
| 4 | Autonomy / mature adoption | AI delivers limited goals end-to-end, while a human controls the boundaries, risk and outcome. |

This does not mean the detail from version 2.1 disappears. It stays, but its role changes. It is no longer a set of separate rungs on a ladder. It becomes a set of diagnostic sub-areas.

## Sub-levels are not points

In version 3.0 the point is not to say:

> We have 7 out of 10 elements, so we are at level 3.

That would be too mechanical. The sub-areas are there to support a conversation:

- what we already understand,
- what we still cannot do,
- where we have real evidence,
- what is missing for a stable process,
- whether moving up makes sense.

You can enter a level when you understand the level below and start applying part of the current one. But you should not move to the next level if you do not understand the whole level below. The exception is level 0, because level 0 describes the state before conscious adoption, or a conscious decision not to use AI.

## A level is not an identity

This is the most important correction, and it is also the part Konrad pushed the hardest.

A level does not describe a person. A level describes a context.

The same person can be:

- at level 3 in coding,
- at level 2 in document analysis,
- at level 1 in writing emails,
- at level 0 in financial data.

The same company can be:

- at level 3 in IT,
- at level 2 in QA,
- at level 1 in HR,
- at level 0 in processes where AI is formally forbidden.

That is why the Holak (and Gomulski) Scale 3.0 does not ask:

> Which level are you at?

It asks:

> Which level is this specific area of AI use at?

It is a small change in language, but a huge change in practice. It takes the label off people and moves the conversation onto the process.

## What happened to the old 0-11 scale

The old levels were not thrown away. They were grouped.

| v2.1 | v3.0 |
|---|---|
| 0 - Resistance / no adoption | 0 - Resistance |
| 1 - Basic chat | 1 - Basics |
| 2 - Conscious prompting | 2 - Conscious use |
| 3 - Prompting frameworks | 2 - Conscious use |
| 4 - Custom instructions and token hygiene | 2 - Conscious use |
| 5 - Project/home context | 3 - Advanced processes |
| 6 - Advanced operational instructions | 3 - Advanced processes |
| 8 - Tools, MCP, connectors, hooks | 3 - Advanced processes |
| 7 - Skills, knowledge bases and evaluations | 3 - Advanced processes |
| 9 - Agentic workflows | 4 - Autonomy / mature adoption |
| 10 - Multi-agent orchestration | 4 - Autonomy / mature adoption |
| 11 - Agentic OS | 4 - Autonomy / mature adoption |

Yes, in this table level 8 comes before level 7. That is on purpose.

## Tools before skills

In version 2.1, skills, knowledge bases and evaluations came before tools, MCP, connectors and hooks. In version 3.0 I change that order.

First we need to understand:

- what environment AI operates in,
- which tools it has access to,
- what permissions it has,
- which actions are allowed,
- which actions require approval,
- how the trail of activity is recorded,
- how we limit risk.

Only then does it make sense to build skills, knowledge bases and repeatable workflows. A skill without an understanding of tools is often just a nicely packaged prompt. A tool without rules is a risk. A process appears only when we combine context, tools, control, skills and verification.

## The five levels in brief

**Level 0 - Resistance.** AI is not used, or it is used outside conscious adoption. This is not always a failure - in a high-risk process, refusing to use AI can be more responsible than rushed automation. The problem is not level 0. The problem is pretending AI does not exist while people use it quietly.

**Level 1 - Basics.** AI helps with simple tasks: an email, a summary, an idea, a translation, an explanation, a first draft of a document. Two things matter most: basic verification and basic data hygiene. The user has to know that AI can be wrong and that not everything may be pasted into a chat.

**Level 2 - Conscious use.** The user stops merely asking. They start designing the instruction: goal, context, role, constraints, input, format, quality criteria. They iterate, check the result, pick the model to fit the task and watch cost and context length. This is the level where many people and teams get the biggest return from AI - not through agents, not through MCP, but through better quality of work with a basic tool.

**Level 3 - Advanced processes.** AI stops being just a conversation and becomes part of a process. What appears: durable context, documentation for humans and agents, operational instructions, tools and integrations, control automations, skills, knowledge bases, RAG, evaluations, a process owner and security rules.

**Level 4 - Autonomy / mature adoption.** AI can be given a limited goal and run a process end-to-end, but within known boundaries. The human defines the goal, the boundaries, the success criteria, the risks, the way to verify and the stop procedure. Mature autonomy requires traceability, reversibility, logs, an owner and limits. Without that, autonomy is not maturity. It is risk.

## The value and cost curve

Not everyone should go to level 4. This may be the single most important sentence in the whole update.

In many cases the biggest return comes from moving 0 to 1, 1 to 2 and 2 to 3. Level 4 is more expensive, riskier and demands more discipline. It makes sense for selected processes that are repeatable, have clear success criteria and can be verified and reversed.

Maturity is not about automating everything. Maturity is about knowing where automation makes sense and where it is better to stay lower.

## A matrix instead of a label

Version 3.0 works best as a matrix.

| Area | Level | Evidence | Next sensible step |
|---|---:|---|---|
| QA | 3 | Project context, test generation workflow, partial evaluations. | Add better quality controls. |
| Development | 3 | Repo, instructions, tools, code review. | Tidy up permissions and logs. |
| HR | 1 | Simple content generation. | Introduce data rules and templates. |
| Finance | 0 | No use because of sensitive data. | Assess whether there are safe use cases. |
| Release notes | 4 | Agentic workflow with human review. | Add quality and cost metrics. |

A matrix like this is more honest than a single number for a whole person or organisation.

## What next

The Holak (and Gomulski) Scale 3.0 is an attempt to fix what was too linear, too detailed and too easy to turn into a label in the previous version. The point is not to throw out v2.1 - it is still a good description of the detailed areas of adoption.

The point is to make the main conversation simpler: what context we have, what level we are at, what evidence we have, what level makes sense, what is missing, what risk we accept and where it is better not to go higher.

The scale does not say:

> You are at 3.

The scale says:

> In this area you are at 3. In another you are at 1. That is normal. Now let us decide where it is worth going next.

And that is exactly what version 3.0 is about.

You will find the full model - with a description of every level, the migration map from 2.1, the context matrix and the value and cost curve - on the [Holak (and Gomulski) Scale 3.0](/en/holak-scale-3/) page.
