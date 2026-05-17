---
title: "Writing your own Claude Code subagent: frontmatter, prompt, deployment"
description: "Part two of the subagent series. We build a blog-post-writer agent from scratch - what to put in the frontmatter, how to write a description that actually triggers, and how to dodge two classic traps."
date: 2026-05-15
tags: ["ai", "claude-code", "subagents", "automation"]
lang: en
readingTime: 9
author: GH
---

In the [post from May 12, 2026](/en/blog/subagents-claude-code-what-and-why/) I covered why subagents are worth calling and which built-ins are available. Now part two: writing your own from scratch. A concrete use case: an agent that reads a blog post idea and returns a full draft in the voice of your blog. Written once, used dozens of times.

A Claude Code subagent is a Markdown file with frontmatter. No compilation, no deployment to any server - you just save it in the right folder and Claude sees it immediately.

## Location: where the subagent lives

Three places, in increasing specificity:

1. **Project-local**: `.claude/agents/<name>.md` at the repo root. Works only in that project. Useful when the agent is tightly bound to the repo's conventions
2. **User-global**: `~/.claude/agents/<name>.md`. Available in every Claude Code session for you. Useful for agents you reuse across projects (e.g. "read the diff and return a review")
3. **Plugin**: bundled in a Claude Code plugin and installed via a marketplace. Useful when sharing the agent with a team or the public

For a first attempt, start with user-global - minimum overhead, maximum reach.

## Frontmatter anatomy

Every subagent begins with a YAML block:

```yaml
---
name: blog-post-writer
description: Use this agent to draft full blog posts in the user's voice from a topic outline. PROACTIVELY use when the user asks to "write a blog post about X", "draft a post on Y", or describes a topic and target reading time.
tools: Read, Write, WebSearch, WebFetch
model: sonnet
---
```

Fields:

- **`name`** - the identifier. Lowercase, dashes, descriptive. Claude calls the agent by this
- **`description`** - the CRUCIAL field. This is what Claude reads when deciding whether to call the agent. Write it like a short table of contents - what it does, when to use it, whether proactively. Words like "PROACTIVELY," "MUST BE USED," "use when" strengthen triggering
- **`tools`** - the list of tools the agent can call. Either a list (`Read, Write, Bash`) or `*` (all of them). The narrower the list, the safer and the easier it is for Claude to predict what the agent will do
- **`model`** - optional override. `opus`, `sonnet`, `haiku`. Omitting it = inherit from parent. Small tasks can run on Haiku (faster, cheaper), heavy analysis on Opus

The frontmatter ends with a second `---`, then the body - the system prompt - follows.

## Body = the agent's system prompt

After the frontmatter, you write the prompt that becomes the system prompt for this subagent. Don't be shy with length - the agent has no other knowledge of what it should do beyond what you write here.

A structure that works:

```markdown
You are an expert blog post writer specializing in [domain].

## Your task

When invoked, you receive:
- A topic outline or rough idea
- Optional: target reading time, tags, audience
- Optional: existing post slugs to crosslink

You produce:
- A complete blog post in Markdown
- Frontmatter matching the project's Zod schema
- Cross-links to related existing posts
- Reading-time-appropriate length

## Style guidelines

- [concrete style rules - e.g. "prefer concrete examples over abstractions"]
- ["use second person, not first plural"]
- ["avoid filler words: 'just', 'really', 'basically'"]

## Output format

Return only the complete Markdown file content, ready to be written to
src/content/blog/<lang>/<slug>.md. No commentary, no preamble.
```

The more concrete the rules - the more consistent the output. The more "use your judgment" you leave open - the more the agent will improvise.

## Practical example: blog-post-writer

Full file `~/.claude/agents/blog-post-writer.md`:

```markdown
---
name: blog-post-writer
description: Drafts full bilingual (PL/EN) blog posts for quality-blog.eu in the user's voice from a topic outline. PROACTIVELY use when the user asks to write, draft, or prepare a blog post and provides a topic. Returns complete Markdown files for src/content/blog/{pl,en}/<slug>.md.
tools: Read, Glob, Grep, Write, WebSearch
model: sonnet
---

You are a senior technical writer specializing in smart home and AI topics for quality-blog.eu, a bilingual (PL/EN) blog by Grzegorz Holak.

## Your task

When invoked, you receive a topic outline. You produce two Markdown files
(PL and EN), each ~1500-2000 words for a 7-9 minute read.

## Reading the project

Before writing, you must:
1. Glob `src/content/blog/pl/*.md` and `src/content/blog/en/*.md` to know
   existing posts and their slugs (for crosslinks).
2. Read 2–3 recent posts from each locale to absorb tone, structure,
   typical section count, and crosslink patterns.
3. Check the schedule (which dates are taken) - pick the next free
   weekday that's not a Polish public holiday.

## Frontmatter (Zod schema)

PL:
title, description (1-2 sentences),
date (YYYY-MM-DD), tags (array), lang: "pl", readingTime (number)

EN: same fields, lang: "en"

## Style

- Concrete examples over abstractions
- Tables and lists for comparisons, not prose paragraphs
- TL;DR table near the top for any "X vs Y" topic
- Anti-patterns section near the end
- Crosslinks to 2-3 existing related posts at the end

## Output

For each language, return the complete file content as a fenced block
labeled with the target path:

PATH: src/content/blog/pl/<slug>.md
```markdown
---
... frontmatter ...
---

... body ...
```

Then write both files using the Write tool. Do not add commentary outside
the file contents.
```

This is a real skeleton. After the first invocation you'll see what works and what doesn't - and you'll iterate.

## Test: does Claude actually pick this agent

After saving the file, in a new Claude Code session try invoking it via natural language:

> Write a post about how Mosquitto MQTT scales with 10 Zigbee coordinators.

Claude should recognize "write a post" + "Mosquitto MQTT" as a blog-post-writer task. If it doesn't:

- Description too narrow - it may need explicit "blog-post-writer" reference, but you want proactive triggering. Add "PROACTIVELY use when…"
- Description too broad - Claude calls the agent for every "write X," including "write a function." Tighten it to "blog post" or "article"
- Conflict with another agent - if you have "content-writer" and "blog-post-writer," Claude may prefer one over the other. Compare the descriptions

Explicit test: in the main session say "run the blog-post-writer subagent with task X" - that calls it directly. If the result is OK but auto-trigger doesn't work, the problem is in the description.

## Description traps

Three classics I see most often:

**1. Description without "when."** "Drafts blog posts" - what does that mean? Claude doesn't know when to reach for this agent. Add explicit "use when the user asks to write/draft/prepare a blog post."

**2. Description with negations.** "Don't use this for code" - Claude reads it, but negations are weaker than positive triggers. Better: "use ONLY for prose content, never for code."

**3. Description without priority.** If you have five content agents, Claude rolls dice. Add "MUST BE USED for blog posts" to the one that should be the default.

## Tools traps

- **`tools: *`**. Convenient, but the agent gets Bash too. If this is a read-only research agent, give it `Read, Grep, Glob, WebSearch` - nothing more. Safer and Claude knows what to expect
- **No Write in a writer agent.** People often forget. The agent returns text "in the response," the user copies it manually. Wasteful - give it `Write` and tell it to save the file itself
- **Bash without precision.** If the agent has Bash for `npm test` and you assumed read-only, you can get surprises. Constrain it in the prompt: "use Bash ONLY for npm test, never for git or filesystem changes."

## Iteration

The first version of an agent is never final. Iterate on this pattern:

1. Call the agent on a real task
2. See what's wrong (output, agent selection, missing tools)
3. Edit `~/.claude/agents/<name>.md`
4. Call again

Three iterations are usually enough for the agent to behave stably. If after five it still doesn't fit - maybe the problem isn't the agent but a poorly defined task.

## When a custom agent pays off

Rule of thumb: if you repeat the same type of task three times a week, a custom agent pays for itself. Writing one is 30–60 minutes; each invocation saves 2–5 minutes of briefing (the agent already has the prompt).

Three real examples where an agent pays off fast:

- **Diff reviewer before commit** - reads `git diff`, returns notes (style, bugs, missing tests). You call it daily
- **Test writer** - reads a function, returns a test set in the project's style. You call it whenever you add a function
- **Doc updater** - reads changed files, checks whether READMEs/docstrings are stale. You call it before merging

## Crosslinks

[Subagents - what and why](/en/blog/subagents-claude-code-what-and-why/) - part one of the series. [`prompt-master`](/en/blog/prompt-master-skill-claude-code/) - a skill (not a subagent), a different mechanism. [`advisor()`](/en/blog/advisor-claude-code-second-opinion/) - second opinion, yet another one.

This wraps up the four-day Claude Code series. Of the four tools (subagents, prompt-master, advisor, custom subagent), a custom agent earns the most if you have repeatable tasks, and advisor earns the most if you work on complex systems. Built-in subagents you'll use daily whether you mean to or not.
