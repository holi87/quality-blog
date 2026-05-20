---
title: "Claude and Codex: CLI vs Desktop vs Web - Where You Actually Ship Work"
description: "Three access channels to the same models differ in what they can touch. A practical comparison of Claude Code and Codex CLI against desktop apps and web interfaces."
date: 2026-05-20
tags: ["ai", "claude-code", "codex", "tools", "workflow"]
lang: en
readingTime: 12
author: GH
---

Anthropic and OpenAI expose the same models through three channels: command line, desktop app, and web browser. From the perspective of answer quality, the difference is small - the engine is the same. From the perspective of **what you can actually accomplish in a single session**, the difference is fundamental. Web answers questions, desktop helps you think, CLI ships code.

This post is a neutral overview of access channels for Claude and Codex, structured so you know where it pays to invest the first hour of setup and where logging into a browser is enough.

## TL;DR

- **Web** (`claude.ai`, `chatgpt.com`): zero install, shareable links, mobile, projects with reference files. No real file system access, no automation, no custom tools.
- **Desktop** (Claude Desktop, ChatGPT Desktop): same models as web plus local MCP, drag-and-drop files from disk, system shortcuts, artifacts/canvas. Great for talking to disk files without exposing them to CI.
- **CLI** (Claude Code, Codex CLI): full access to file system, git, bash, hooks, subagents, custom skills, MCP servers, worktrees, and background tasks. This is a tool for shipping code, not just chatting.

Web is usually available on a free tier, while desktop and CLI access typically unlock only on paid plans (Claude Pro/Max, ChatGPT Plus/Pro/Business). If you want AI to actually speed up your coding work, it's worth paying for one of those plans - the web tier alone won't carry it. If you're picking only one tool for code, go with CLI. If you're assembling a bundle for mixed work, take CLI plus desktop and treat web as a bonus for your phone and share links.

## What you actually get in each channel

### Web

Web is the simplest form of contact with the model. You log in through a browser, you have a chat window, you can paste a text file or image, you can create a project with reference files and a system instruction, you can share the conversation via link. That's a lot - until you try to do something that requires touching your computer.

In web there is no `read_file('/Users/you/repo/src/...')`. No `git diff`. No way to run your script, no cron job, no custom MCP server hooked into a local database. You can paste file contents or upload a ZIP, but you are the spoon ferrying context back and forth.

Built-in tools (web search, image generation, code interpreter in a sandbox) are available, but they don't leave the provider's cloud.

### Desktop

Desktop for Claude and ChatGPT is an overlay on the same models as web plus a few differences that turn out to matter when you start working seriously.

First: operating system integration. A global keyboard shortcut firing a quick question from anywhere in macOS or Windows, drag-and-drop a file from Finder, paste screenshots straight into the conversation. Small things, but they add up over hours of work.

Second - and this is the most important - Claude Desktop supports local MCP servers (Model Context Protocol). You can configure servers that give the model access to your file system, calendar, iMessage, Apple Notes, Spotify, local database. All without exposing anything to the internet. Web doesn't have this - MCP in web is limited to remote MCP servers exposed by Anthropic or third parties over HTTPS.

Third: artifacts and canvas - interactive previews of generated HTML, documents, code, with the ability to iterate in place. Web has this too, but on desktop it integrates better with the rest of the OS.

### CLI

CLI is a different category of tool. Claude Code and Codex CLI are not chat wrappers - they are agents living in your terminal with actual access to your repository.

What you get after install:

- **Full file system access** in the directory where you run the CLI. The model reads and edits files, creates new ones, deletes old ones - all with a permission system you can tune.
- **Bash**. The model runs commands in your shell (with allowlists and permission prompts), sees the output, reacts to errors.
- **Git workflow first-class**. Atomic commits, branching, worktree for isolating parallel work, PRs.
- **Hooks** - events in the session lifecycle (UserPromptSubmit, PreToolUse, SessionStart) that let you inject custom logic, validation, context.
- **Subagents** - specialized sub-agents for long research tasks, code review, debugging, with their own tools and their own context window.
- **Skills** - reusable "playbooks" in markdown that the model can pull into the session when the topic matches.
- **MCP servers** in stdio and HTTP variants, exactly the same as on desktop.
- **Background jobs / tasks** - you launch a long build or a research agent as a background process without blocking the main session.
- **Worktree mode** - the agent works in an isolated copy of the repo without touching your main working tree.

Codex CLI has an analogous toolset, with a different config layout (`~/.codex/`) and its own sandbox for running commands. The models behind it are of course OpenAI models (GPT-5.4, gpt-oss in offline mode, depending on configuration).

## Decision matrix

| Aspect                       | Web                  | Desktop              | CLI                  |
| ---------------------------- | -------------------- | -------------------- | -------------------- |
| Editing files in a repo      | no (copy-paste)      | limited via MCP      | yes, native          |
| Git workflow                 | no                   | via MCP              | yes, first-class     |
| Running shell commands       | no                   | via MCP              | yes, native          |
| Local MCP                    | no                   | yes                  | yes                  |
| Subagents / skills / hooks   | no                   | no (or minimal)      | yes                  |
| Automation / cron            | no                   | no                   | yes                  |
| Shareable links              | yes                  | no                   | no                   |
| Mobile (phone)               | yes                  | no                   | no (unless SSH)      |
| Onboarding cost              | a minute             | 5 minutes            | 15–30 minutes        |
| Audit trail                  | UI history           | UI history           | logs, git history    |

This is a simplification - updates ship and the situation changes fast - but the overall direction has been stable for months.

## When each channel wins

### Web wins when

- You're on someone else's machine, on a phone, in a kiosk browser, and you can't install anything.
- You want to send a coworker a link to the exact conversation you had.
- You're doing quick research without files - question, answer, done.
- You're presenting at a workshop and don't want to expose the structure of your repos.
- You use the sandbox code interpreter for one-off CSV analysis you want stored in the cloud anyway.

### Desktop wins when

- You work a lot with files from disk but don't want to expose them to CI or remote MCP.
- You want a global shortcut for a quick question from any application.
- You iterate on an artifact (HTML, doc, slide) and need a visual preview during the conversation.
- You wire the model into local personal tools: calendar, notes, messages, Spotify, local database.
- You want a long-running conversation in a single thread with project files, but without the risk of an agent editing your repo before you're ready.

### CLI wins when

- You're doing anything at the code level in an existing repo - refactor, fix, adding a feature, migrations, tests.
- You want atomic commits with messages written from change context.
- You work on several branches in parallel (worktree).
- You automate repetitive operations with hooks - e.g. running a linter after every edit.
- You build custom tools (MCP servers, skills, subagents) you want to roll out to a team.
- You operate on large logs, build outputs, database dumps - and don't want to load them into a chat window.
- You need an audit trail of who/what changed - git history plus session logs.

## The hybrid setup I see most often among experienced users

The most sensible practice I observe in people using both tools daily is splitting tasks across channels.

**Exploration, brainstorm, planning** - desktop. You drop in files, talk for a long time, arrive at a plan. You can have a project with a system instruction you don't want to repeat.

**Execution** - CLI. You take the plan from desktop, paste it into the first prompt of a CLI session, the agent executes. Atomic commits, hooks guard quality, subagents do parallel things in the background.

**Small questions, preview, share** - web. Phone, someone else's machine, link to a coworker. Or quickly checking something during a meeting.

This split has one big advantage: you're not forcing web to do CLI work or CLI to play the role of web. Each channel gets what it's good at.

## Pitfalls worth watching

**Token limits per plan differ across channels.** The subscription you buy for web/desktop doesn't necessarily cover the CLI at the same scale. Check the documentation of your plan before assuming you have the same pool available everywhere.

**MCP in web ≠ MCP on desktop ≠ MCP in CLI.** Configurations live in different places (`claude_desktop_config.json` for desktop, `.mcp.json` or user-level for CLI, remote MCP for web), with different formats and different permission models. A server written for one channel doesn't always work in another without tweaks.

**Files in web don't persist the way you think.** Files in a project do - files in a single conversation don't. The session ends, the context is gone.

**CLI without worktree mixes branches.** If you run an agent against your main working tree and have it run an experiment while you work on a different branch yourself, it ends in conflicts. Worktree (`git worktree add` or the built-in option in Claude Code) solves the problem.

**Hooks in CLI are a double-edged sword.** A well-tuned hook saves hours - a poorly tuned one blocks every model call and you can't figure out why the session is stuck. Configure incrementally, test.

**Codex and Claude are not drop-in replacements.** They have different models, different config formats, different sandboxes, different skill ecosystems. You can use them in parallel, but don't assume a workflow written for one will work in the other without porting.

## Takeaways

Web, desktop, and CLI are not three versions of the same product - they are three different tools with different blast radii on your system. Web answers questions, desktop helps you think with local data, CLI actually changes your repository.

If you use AI only for conversations and small chunks of code, web is enough. If you start wiring the model into your own data and personal processes, add desktop. If you want the model to ship code in your repo with the same rigor as you do, buy the CLI and give yourself an hour for setup. The investment pays off in the first serious refactor.
