---
title: "AGENTS.md vs CLAUDE.md vs .cursorrules - Which Context File for What"
description: "Three context-file formats for AI agents aren't chaos - each has a niche. What each agent reads, what to put in each, how to keep them in sync, and what not to copy 1:1."
date: 2026-05-29
tags: ["ai", "agents-md", "claude-code", "holak-scale", "context"]
lang: en
readingTime: 8
author: GH
---

In the [Holak Scale](/en/blog/holak-scale/), level 5 is *"per-project context files."* I list three formats there: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`. The most common question after publication: **"OK, but which should I use?"**

Short answer: all three, for different purposes. Long answer - in this article.

## Where they came from

The three formats were born from the same problem (the agent doesn't know my project), but in different ecosystems.

- **`.cursorrules`** - first, from Cursor. Short rules, "don't use X, use Y." File at repo root, Cursor reads it automatically.
- **`CLAUDE.md`** - introduced with Claude Code. More descriptive, "project context plus conventions." Claude Code auto-loads it from root and recursively from any parent directory.
- **`AGENTS.md`** - the most generic, gained traction from mid-2025. Intent: a single file every modern agent reads - Claude Code, Codex, Cursor, Aider, etc.

In practice: the market didn't unify. Each tool reads its own format, some read all.

## Table: who reads what

| Tool | AGENTS.md | CLAUDE.md | .cursorrules |
|------|-----------|-----------|--------------|
| Claude Code | yes (as fallback) | **primary** | no |
| Cursor agent | yes | yes | **primary** |
| Codex CLI | **primary** | yes | partial |
| Aider | yes | yes | no |
| Continue | yes | yes | yes |

**Precedence hierarchy in Claude Code**: global CLAUDE.md (`~/.claude/CLAUDE.md`) → directory-level CLAUDE.md (loaded recursively from project root down). If AGENTS.md exists at root - Claude Code also pulls it in.

## What to put in each

Each format has a slightly different spirit. Treating them as *"copy 1:1"* yields worse results than leveraging the differences.

### CLAUDE.md - context and how-we-work

The most spacious of the three. Here goes:

- project goal in 2 sentences
- tech stack
- code conventions (only project-local ones - general ones go to custom instructions)
- git workflow / branching / commit message style
- how to run, build, test
- known gotchas ("don't touch X because Y")
- directory map if non-obvious

Example fragment I use in one project:

```markdown
# Risk Engine

Credit-limit system for 12M customers.

## Stack

Python 3.11 + FastAPI + PostgreSQL 15 + Redis 7.

## Commands

- `make dev` - local server with hot reload
- `make test` - unit tests
- `make test-int` - integration tests (requires Docker)
- `make migrate` - alembic upgrade head

## Workflow

- Branches per ticket: `feature/RISK-123-short-desc`
- Commit messages: English, conventional commits
- PR template in `.github/PULL_REQUEST_TEMPLATE.md`

## Don't touch

- `customers` table schema - requires KYC team review
- `config/risk_weights.yaml` - changes require Head of Risk approval
```

### .cursorrules - code behaviour rules

Short, directive. Optimised for "don't write Y, write X":

```
- Use TypeScript strict mode.
- Never use `any` type. If unsure use `unknown` and narrow.
- All async functions must handle errors via try/catch or `.catch()`.
- Components in PascalCase, hooks in camelCase prefixed with `use`.
- Tests live next to source: `Component.tsx` + `Component.test.tsx`.
- Don't use `index.ts` re-export barrels.
```

Ideally 10–30 lines. Larger = a signal the content should move to CLAUDE.md or the system prompt.

### AGENTS.md - agent workflow and protocol

The least standardised of the three, but it has its own character: this is where you describe **how the agent should behave in this project**:

- *"before changing X, check Y"*
- *"after every code change run `make test`"*
- *"never push directly to main"*
- *"before push run `npm run lint`"*

[I have a separate post on AGENTS.md for test automation](/en/blog/agents-md-for-test-automation/) - with details for Playwright/Cypress/API repos.

## Multi-tool strategy

If your team uses Claude Code + Cursor + occasionally Codex, three options:

### Option 1: a single source + symlinks

```sh
ln -s CLAUDE.md AGENTS.md
# Cursor reads AGENTS.md, so two context files in one shot
```

Downside: `.cursorrules` has a different format (short rules), so a symlink doesn't fit.

### Option 2: a single file with per-tool headers

```markdown
# Project context

<!-- @claude-code -->
... full context for Claude Code ...

<!-- @cursor -->
... short rules for Cursor agent ...

<!-- @codex -->
... protocols for Codex ...
```

Not all tools understand these sections. In practice each reads the whole file. Works so-so.

### Option 3: three separate files + cross-links

The solution I actually recommend. At repo root:

```
AGENTS.md       # workflow and protocols (references CLAUDE.md for details)
CLAUDE.md       # full project context, stack, commands
.cursorrules    # short code directives
```

`AGENTS.md` starts with *"Full project context in `CLAUDE.md`. Here only operational protocols."* - the agent loads both files, no duplicated content.

`.cursorrules` ends with *"For full project context see CLAUDE.md."*

## Anti-pattern: 1:1 copy between files

The most common mistake: the team copies CLAUDE.md content into AGENTS.md because "both tools need it." A month in, the files diverge. Someone edits one, someone the other. The agent gets conflicting signals.

Test: open both files and count shared lines. If >40% - you have duplication. Refactor: keep the content in one, link from the other.

## Anti-pattern: documentation graveyard

Written once, never updated. Covered [in adoption anti-patterns](/en/blog/ai-adoption-anti-patterns/) - but worth repeating, it applies to all three formats.

**Test:** open CLAUDE.md and say what changed in the last month. Silence = graveyard.

**Way out:** add a retro question *"does CLAUDE.md still match how we work?"*. Every workflow change = PR to the file.

## What NOT to put in

Regardless of format, a few things don't belong in CLAUDE.md / AGENTS.md / .cursorrules:

- **Secrets** - no API keys, passwords, tokens. The file is in the repo (usually public or broadly visible).
- **Customer data** - even anonymised "real-life examples."
- **General style preferences** (e.g., "I like concise answers") - that's global custom instructions, not a per-project file.
- **Decision history** (e.g., "we considered X and Y, picked Z") - that's ADRs or a separate `docs/` folder.
- **Roadmap / TODOs** - that's the issue tracker, not agent context.

## What's next

If your project has none of these files - start with **CLAUDE.md at the root**. Best ROI (Claude Code, Codex, and Aider all pick it up). Give yourself 30 minutes, one page max, update after the first session.

If you have all three but they duplicate - refactor per Option 3 from this post.

If you have one file from 2023 - you're pretending to be at level 5. Actually you're back at 4 with the anti-pattern. Way out: a weekend, a refresh, a retro.
