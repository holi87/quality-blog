---
title: "Caveman - the plugin that cuts output tokens by 75% (and where it breaks)"
description: "How a Claude Code plugin that makes the model talk like a caveman changed my token bill - and which tasks it actually fits, which ones it quietly ruins."
date: 2026-05-04
tags: ["ai", "claude-code", "tokens", "tooling", "plugins"]
lang: en
readingTime: 10
author: GH
---

Late in March I got an Anthropic API bill that I wasn't ready for. Not because I was using Claude more than usual - rather because I'd moved to long agentic sessions where every round contained politely-phrased replies, gentle introductions, and careful summaries of what was about to happen. When I pulled the stats from the logs, it turned out that roughly **60-70% of the generated tokens were narration around the actual answer** - "Sure!", "Happy to help", "Let me take a look", "The reason this happens is likely...". Technically nothing was wrong with any of it. Financially and operationally, all of it was waste.

That was the moment I stumbled across a plugin called `caveman`. Slogan: *why use many token when few do trick*. Idea: force the model to talk like a caveman. No articles, no intros, no hedging. At a glance, it looks like a joke. In practice it turned out to be one of the most interesting tools I've added to Claude Code this quarter - not because it fixes everything, but because it shows very precisely *where* the model wastes tokens, and gives you a switch.

In this post I'll walk through what caveman actually does, which tasks it handles well, which ones it breaks, and why I treat it as a cognitive experiment as much as a cost-saving measure.

## What caveman is

Technically, caveman is a Claude Code plugin (also available for Codex, Gemini CLI, Cursor, Windsurf, Copilot, Cline) and a set of skills. Installation is a one-liner:

```bash
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman
```

Once installed, every new Claude Code session gets a `SessionStart` hook that injects into the system prompt an instruction along the lines of: *speak tersely like a caveman, drop articles, skip pleasantries, keep all technical substance, preserve quote accuracy and code blocks*. The plugin itself is a handful of files - `caveman.skill`, rules, hooks, a few extra skills (`caveman-commit`, `caveman-review`, `caveman-compress`).

The example most often cited in the repo makes the point:

> **Normal Claude (69 tokens):** "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

> **Caveman (19 tokens):** "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

Same diagnosis, same recommendation, 72% fewer tokens. The plugin's author cites an arXiv paper suggesting that prompt compression of this kind does not degrade model accuracy on technical tasks. My own tests - more on those in a minute - confirm this up to a point, and also show where it stops being true.

## Intensity levels - from lite to 文言文

Caveman is not a single mode but a scale. You switch with `/caveman lite|full|ultra|wenyan`.

- **Lite** - drops pleasantries but keeps full sentences. The output still reads professionally.
- **Full** - the default. Articles gone, sentence fragments fine, short synonyms preferred.
- **Ultra** - looks like notes from an engineer under pressure. Arrows, shorthand, maximum compression.
- **Wenyan (文言文)** - classical Chinese. A joke, but a working one. Around 85% less than baseline, at the cost of not understanding your own logs in the morning.

For daily work I use `full`. For quick debugs and one-liner fixes I sometimes flip to `ultra`. For documentation and anything going to a client I turn it off with `stop caveman`.

One detail matters: the plugin **auto-disables caveman mode in situations where terseness would be harmful**. The plugin docs call this "auto-clarity" and it covers security warnings, confirmations of irreversible operations, and multi-step sequences where a wrong fragment ordering could cause errors. Code, commits, and error quotes are written normally - caveman never touches them. That's not a side note. Without auto-clarity, caveman would be useless for operations like `DROP TABLE` or for incident-response procedures.

## The ecosystem: commit, review, compress

The plugin itself is just the start. Three extra skills ship alongside it, each targeting one of the most verbose engineering rituals.

**`caveman-commit`** forces commit messages into Conventional Commits with a subject ≤50 characters and a body only when the "why" isn't obvious from the diff. If your previous commit read `Adding validation to handle the case where user inputs are empty or contain whitespace-only strings`, after caveman it becomes `feat(auth): trim and reject empty inputs`. A small thing, but after two weeks your `git log` reads like a table of contents, not a journal.

**`caveman-review`** trims code review comments to a single line: location, problem, fix. No intro, no "I think maybe consider", no explanation of why it matters. Teams that tried it split into two groups: those who love it (people with dozens of PRs to review daily) and those who hate it (people who treat review as conversation). My take: reviews from junior to senior are still worth writing as prose. Tool-to-tool reviews in CI pipelines - caveman.

**`caveman-compress`** works differently. It doesn't shrink the model's output; it shrinks the input: it compresses `CLAUDE.md`, `AGENTS.md`, instruction bases and memory files into caveman form, preserving all technical substance, code and URLs. The original is kept as `FILE.original.md`. On my training project, the compressed `CLAUDE.md` was 46% lighter, which literally means 46% fewer tokens loaded into context **on every request**. That scaled better than the plugin itself.

## My tests - where it works, where it breaks

To avoid just parroting the marketing, I ran a simple experiment. For a week I kept two parallel Claude Code sessions on the same project (the blog you're reading now): one with caveman on `full`, one without. Same set of tasks, same workflow, logs saved to separate files. At the end of the week I counted output tokens and wrote down a subjective quality score.

The numbers lined up with the advertised claim: caveman-session output was **about 28% of normal-session output**. That's over 70% saved. For someone generating a few hundred calls a day, that's already real money.

Subjectively, three patterns emerged that nobody mentions in the plugin's marketing.

First, **caveman wins on short, well-defined tasks**. Debugging, one-liner fixes, explaining a specific function, proposing a small implementation change. In these cases the short, fragmentary style doesn't just save tokens - it's genuinely easier to visually scan. I don't have to read "I'd recommend...", I know the model is recommending what it wrote.

Second, **caveman loses on plans and long explanations**. When you ask the model for an architectural review or a multi-step implementation plan, its caveman response becomes a list of single sentences that you have to mentally stitch together. You save tokens but lose readability, and valuable nuances ("this works, but watch out for X in Y") become hard to distinguish from the rest. `lite` or a full disable works much better here.

Third - and this is the most interesting - **caveman changed the way I write prompts**. I started phrasing questions more tersely, because I knew the answer would be short, so there was no point decorating the question. After a week that habit stuck even with caveman off. I had fewer "the model didn't understand what I meant" moments, because I'd forced myself into precision on input. I can't measure it, but I suspect this is a bigger win than the raw token savings.

## When NOT to use it

Treating the plugin as a golden hammer is a mistake. There are at least a few use cases where caveman is actively harmful.

- **Pair-programming with a junior.** A model that replies "new object ref each render, useMemo" to someone who's just learning React is counterproductive. The junior doesn't need a compressed answer, they need an *explained* one. For those sessions I turn caveman off at the start.
- **Generating content for people outside the engineering team.** This post, which you're reading now, was written with `stop caveman` set in Claude Code - because a caveman-mode article would read like notes from a hackathon. Same goes for client-facing docs, release notes, stakeholder updates.
- **Situations where tone carries information.** Incident response, escalation, a cautious recommendation ("I'm not sure this will work, but let's try") - here hedging is a feature, not noise. Caveman would strip it and change the meaning of the message.
- **Training material and recorded courses.** Teaching content needs rhythm and repetition. Caveman kills both.

In one sentence: the more human-to-human communication a task involves, the less caveman fits. The more technical and repetitive the task - the more it does.

## How it fits with everything else

On [Holak's scale](/en/blog/holak-scale/) (the maturity model I wrote about earlier) caveman sits squarely in the seventh layer: skills and knowledge bases that modify the model's default behaviour for a specific user context. It's not an "instead of" tool - it's a "layer" tool. It plays well with other skills and with project context files. In my setup caveman is on globally, but projects that include a `CLAUDE.md` with "respond in normal prose for blog content" effectively silence it for the relevant session. That's how it should work - a compression tool shouldn't fight a context tool.

## The verdict - is it worth it

Caveman is not a "must have". It's a "worth trying", provided you meet two conditions.

First, you generate enough LLM calls that 70% output-token savings have a real impact on either your bill or your latency. If you use Claude Code casually, the savings will be cosmetic.

Second, you're willing to switch modes deliberately instead of leaving the plugin on full blast. Caveman without self-discipline becomes "model produces unreadable output in the wrong context" - which will burn more time than it saved tokens.

Beyond the cost savings, though, caveman's biggest value to me is that it **named a problem** I had only vaguely felt before. The model's verbosity isn't a property, it's a default - the result of a design decision by Anthropic about tone. Caveman shows that this default can be flipped with a single flag, that technical substance survives, and that the choice between "polite" and "functional" belongs to the user, not the vendor.

If you want to see this for yourself: install the plugin, work with it for a week, then turn it off. You'll notice you're back in a much more talkative world than you remembered. And that's when you'll know how much caveman was actually giving you.
