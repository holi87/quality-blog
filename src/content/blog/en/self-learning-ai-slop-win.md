---
title: "Self-learning AI: ai-slop.win - a free GenAI course built entirely by AI"
description: "Behind the self-ironic domain ai-slop.win sits a complete, free, anonymous GenAI and LLM course: six learning paths, over thirty modules, tests with safety gates, and a certificate. The whole thing was built by AI - under supervision, with requirements, code review, and tests."
date: 2026-06-24
tags: ["ai", "self-learning", "ai-slop", "education", "genai"]
lang: en
readingTime: 11
author: GH
---

The site is called [ai-slop.win](https://ai-slop.win) - literally "AI slop wins". It's a deliberate provocation: behind the self-ironic domain sits a complete, free, and anonymous GenAI and LLM course - six learning paths, over thirty modules, tests with safety gates, and a certificate. And the joke is double-layered, because the entire application was built by AI. Under supervision, with requirements, code reviews, and tests - and that's exactly what this story is about.

## Where the name comes from: slop as the reference point

"AI slop" is the pejorative term for mass-generated mush: articles with no substance, images with no point, code with no understanding. The internet has been flooding with it for a few years now, and the criticism is justified - most content created with AI and no oversight is simply bad.

The [ai-slop.win](https://ai-slop.win) domain flips that accusation around. If the tool can produce slop, the problem isn't the tool - it's the process. The same technology, used with requirements, review, and tests, can build something complete and honest. The site is simultaneously a course about AI and material evidence in the case of "can AI produce anything beyond slop".

Hence the title of this post: self-learning AI. Not self-learning models - learning about AI on your own, at your own pace, with no sign-ups, no accounts, and no payment.

## What it actually is

When you open ai-slop.win, you land in the "GenAI and LLM Training" application signed by Quality Cat. Technically it's a static HTML/CSS/JS app hosted on GitHub Pages: no backend, no login, no tracking. Your progress is saved locally in the browser (localStorage), and you can export your results to a file.

From the user's perspective, that means three things:

- **Zero barriers to entry.** You open the page and start learning. No email address, no account, nobody sends you a sales pitch afterwards.
- **Full privacy.** Test results never leave your browser. You decide whether to show anyone your certificate.
- **Your own pace.** The course is split into 30-45 minute modules. You can stop at any point and come back - your progress waits.

## Six paths: from the boardroom to the engineer, from the kitchen to the office

The most interesting design decision is that the course doesn't pretend everyone needs the same thing. Instead of one linear course, you get six paths matched to role and goal:

| Path | Who it's for | Scope |
|---|---|---|
| **AI with QA - Basic** | non-technical and decision-making roles: managers, product owners, analysts | 12 modules in condensed form, 25-question final test |
| **AI with QA - Practitioner** | testers and practitioners using AI in daily work | 12 modules, 40-question test, practical prompt assignment |
| **AI with QA - Engineer** | engineers, technical testers, automation folks | 12 modules in full scope, 55-question test, two practical assignments |
| **Holak Scale - diagnosis and growth** | anyone who wants to measure their own (or their company's) AI maturity | personal and organizational self-assessment + 4 development modules |
| **AI at home** | private users, families, anyone without a technical background | 6 modules: from everyday prompts to household privacy |
| **Safe AI usage** | anyone using AI at work or privately who wants to do it safely | 6 modules on risks, 20-question test with a safety gate |

The first three paths are the same program at three depths - from "I understand what's going on and can talk about it" to "I can evaluate it technically and deploy it". The other three are independent programs: maturity diagnosis, AI in home life, and safety.

## What the core program teaches

The twelve core modules (M1-M12) form a logical sequence: from intuition, through the technical layer, to practice and its limits.

1. **GenAI and LLM fundamentals** - what the model actually does when it "answers"
2. **LLM architecture at a practical level** - tokens, context window, parameters, the transformer without the math
3. **Generation parameters and output control** - temperature, top-p, max tokens and their real impact on output
4. **Embeddings and semantic similarity** - how text becomes numbers
5. **Vector databases and similarity search** - where those numbers live and how they're searched
6. **RAG: Retrieval-Augmented Generation** - how to give the model your knowledge instead of its guesses
7. **Prompt engineering in practice** - craft instead of magic
8. **GenAI applications in QA and quality** - test cases, reports, requirements analysis
9. **Tool integrations and agents** - from chat to a working workflow
10. **Security, data hygiene, and governance** - what you may paste into a model, and what you never should
11. **Hallucinations, limits of applicability, and output verification** - when not to trust the model
12. **Evaluating LLM and RAG quality** - how to measure whether any of it works at all

Every module follows the same skeleton: an introduction grounded in a real work context, a few content screens, an interactive element, and a summary with a quiz. The interactions aren't decorations - the architecture module has a "context counter" that shows how a document falls out of the context window and which questions stop being answerable. The generation-parameters module has sliders where you watch temperature change the formality and the error risk of a response. You learn by touching the mechanism, not by reading a definition.

### Special modules: home, safety, maturity

Beyond the core there are three module sets I consider the most underrated:

- **AI at home**: what AI can do today, everyday prompts, AI on your phone and in your house, creating images and video, AI and kids and family, household privacy. This is the course you can send to your parents or a teenager - no jargon, no assumption that anyone knows what an API is.
- **Safe AI usage**: a map of AI risks, sensitive data, prompt injection and social engineering, deepfakes, scams and disinformation, workplace policies and shadow AI, verifying AI content. Six modules that should be mandatory at every company before anyone gets chat access.
- **Holak Scale**: a self-assessment of AI working maturity - separately for individuals ([v2.1p](/en/blog/holak-scale-private/)) and organizations ([v2.1e](/en/blog/holak-scale/)), plus four development modules on context management, agents, security, and measuring impact. If you read this blog regularly, you already know the scale - here you can walk through it interactively.

## Tests that take safety seriously

The scoring system is where the project's QA DNA shows. A path's result is a weighted blend of three parts: in-module quizzes (30%), the final test (60%), and the practical assignment (10%). Passing thresholds grow with the level: 75% for the basic path, 78% for the practitioner, 80% for the engineer. You get three attempts.

But one mechanism sets this course apart from typical internet courses:

> Critical safety questions are a hard requirement. You can score 95% overall - if you don't answer 100% of the critical questions on data hygiene and prompt injection correctly, you don't pass. Regardless of your overall score.

That's the exact inverse of how ordinary tests work, where a mistake on a personal-data question can be "made up for" with transformer knowledge. Here it can't. The logic is simple: a person who understands LLM architecture brilliantly but pastes client data into a public chat is more dangerous than a person who doesn't know the architecture at all. The test reflects that risk hierarchy.

After passing you get a certificate - honestly described as informational, not formal. You can save it as a PDF and show off your score, but nobody pretends it's an accredited credential.

## Eight languages

The course is available in Polish, English, German, Spanish, French, Italian, Ukrainian, and Vietnamese. The translations cover the full module content, the test questions, and the interface labels - not just the menu. For educational content built as a hobby, that's a scope a commercial e-learning platform wouldn't be ashamed of. And it's part of the experiment too: maintaining eight language versions by hand would be infeasible; with AI in the process, it's a matter of discipline, not budget.

## How it was built: AI under supervision, not AI gone wild

Now the second layer of this story. The entire application - content, quiz logic, path system, scoring, certificate, translations - was created in a process where AI generated the code and the content. But "generated by AI" doesn't mean "came out of a single prompt". The process looked like this:

- **Requirements first.** Before the first line of code, there were twelve analysis documents: business goals, audience analysis, training needs analysis, learning outcomes, curriculum, test specification, rollout plan, success metrics, risks. Yes, for a free hobby course.
- **Every change via pull request.** No saving straight to the main branch. Every work package is a separate issue, a separate branch, a separate PR with acceptance criteria.
- **AI reviewing AI.** Code written in Claude Code went through review by Codex - a second, independent model. The PR waited for green CI and a review before anything reached production.
- **Architecture decisions in writing.** The project keeps a decision register (ADRs): why a static site with no backend, why progress in localStorage, why manual versioning. Every decision can be traced.
- **Synthetic data only.** All the examples in the course - apps, companies, addresses, identifiers - are made up from scratch. Zero real client data, zero real national IDs, zero copying from commercial projects. It's a rule hard-coded into the repository's working agreements.
- **Data and accessibility tests.** The JSON structures holding questions and content go through schema validation; the interface is checked for keyboard navigation and contrast.

In other words: AI generated hundreds of files, but what reached the site was decided by the process - requirements, review, quality gates. That is precisely the difference between slop and a product. Slop happens when generation is the last step. A product happens when generation is the first.

**Meta-observation:** the course teaches, among other things, that model output must be verified, that data safety is a hard gate, and that process matters more than the prompt. And it was itself built by those rules. Hard to find a better alignment of message and method.

## What's in it for you: three scenarios

### Scenario 1: you're a tester and your company is "adopting AI"

Take the Practitioner path. You'll get a shared vocabulary with your team (tokens, context, RAG, hallucinations), practical prompting habits, and - most importantly - a module on evaluating model output instead of trusting it. The practical assignment forces you to write a real prompt and score it against a rubric, not by gut feeling.

### Scenario 2: you manage a team and have to make decisions about AI

The Basic path plus the organizational self-assessment from the Holak Scale. After 4-5 hours you know how RAG differs from fine-tuning, why "we rolled out a chatbot" is not a strategy, and what maturity level your organization is actually at. That's enough to stop buying promises with no coverage.

### Scenario 3: you want someone close to you to use AI safely

The AI at home and Safe AI usage paths. No jargon, with modules on deepfakes, scams, privacy, and AI in kids' hands. It's the missing link between "grandma got a phone with artificial intelligence" and "grandma knows the grandchild's voice on the phone might be generated".

## What's not there (and why that's a feature)

- **No accounts or login.** The consequence: progress lives in one browser. Clear your browser data and you start over (unless you export your results to a file). A deliberate trade-off in favor of privacy.
- **No formal certificate.** The document is informational. That's more honest than pretending to an accreditation that doesn't exist.
- **No tool-specific material.** The course is tool-neutral - it teaches mechanisms, not clicking through a specific product. That's why it won't go stale at the next model launch.
- **No price.** The whole thing is free and publicly available.

## Summary

ai-slop.win is two things at once. First - a solid, free, anonymous GenAI course with six paths and eight languages, with a test system that treats data safety as a hard requirement rather than just another topic. Second - an experiment showing that AI-generated content and code don't have to be slop, as long as the generation is backed by a process: requirements, review, tests, quality gates.

The domain name is a joke, but the thesis isn't: whether AI produces slop isn't decided by the model. It's decided by what stands before it and after it.

**See for yourself:** go to [ai-slop.win](https://ai-slop.win), pick the path that matches your role, and do the first module. Half an hour, zero registration. If you start with the safety module - even better.
