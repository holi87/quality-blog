---
title: "Hooks in Claude Code - the Deterministic Layer Your Agent Cannot Skip"
description: "What hooks are in Claude Code, how blocking actions with exit code 2 works, and four practical examples: blocking commits without tests, lint after every edit, a secrets guard, and session-start context."
date: 2026-07-09
tags: ["ai", "claude-code", "hooks", "automation", "security"]
lang: en
readingTime: 9
author: GH
---

An agent can skip a skill, it can lose a CLAUDE.md instruction by step forty of a session, and it uses an MCP server only when it decides that makes sense. A hook works differently: it is a mechanical gate triggered by the environment before or after a tool action, and the model cannot talk its way around it or ignore it. After the posts on MCP, skills, and subagents, this article completes the puzzle with the deterministic layer.

## A request versus a gate

Everything I have described on this blog so far - prompts, skills, MCP servers, subagents - shares one trait: the model decides whether to use it. You can write "ALWAYS run tests before committing" in CLAUDE.md in capital letters and it will work for twenty sessions. In the twenty-first, the agent will have a long context, the instruction will blur among three hundred other lines, and the commit will go out without tests. Not because the model is malicious. Because an instruction in a prompt is a statistical suggestion, not a hard rule.

A hook flips that relationship. It is a script or shell command that the agent's environment runs by itself, at a strictly defined moment in the work cycle: before a tool call, after it, at session start, when a response finishes. The model may know that hooks are configured, but it does not decide whether they run, so it cannot simply skip them.

For me, this difference translates into a simple design rule: everything that is team policy or a security rule goes into a hook. Everything that is knowledge and a way of working goes into skills and CLAUDE.md. Policy must be deterministic. Knowledge can be probabilistic.

## The four hook types that actually earn their keep

Claude Code has several attachment points, but in practice four of them deliver 90% of the value:

- **PreToolUse** - runs before the agent executes a tool. It receives a description of the planned action (the tool name and its parameters) and can block it. This is the place for gates: "you will not run this command", "you will not touch this file".
- **PostToolUse** - runs after the tool executes. The action has already happened, so it cannot block, but it can clean up: format the saved file, run lint, append an entry to an audit log.
- **Stop** - runs when the agent decides it has finished its response. The ideal moment for a quality check of the whole: do the tests pass, are there uncommitted files left in the working tree, did the agent leave a TODO in the code.
- **SessionStart** - runs at the beginning of a session. It blocks nothing; instead it injects context: the current branch state, the list of open issues, a reminder of conventions. A cheaper and more reliable alternative to pasting the same thing in by hand.

The configuration lives in `settings.json` (in the repo: `.claude/settings.json`, globally: `~/.claude/settings.json`). Each hook consists of an event, an optional matcher, and one or more handlers. A hook in the repo is versioned with the code, but Claude Code runs project hooks only in a trusted project - a plain `git pull` should not mean blindly executing a new script.

## The exit code as the blocking mechanism

For command hooks, the script's exit code is an important mechanism. The hook receives JSON describing the event on standard input, but the effect of an exit code depends on the event type:

- **Code 0** - the hook completed successfully. Without an explicit JSON decision, it does not automatically approve the tool; the normal permission flow still applies.
- **Code 2** - a blocking error. For `PreToolUse` it stops the planned call and returns standard error to the agent as feedback. For events that run after an action, it cannot undo the tool that already ran.
- **Any other code** - a non-fatal error. The environment shows a warning but does not treat it as a block.

That second point is crucial and often underrated. A `PreToolUse` block is not a blind wall - it is a message. If the script prints "commit blocked: tests were not run in this session, run npm test first", the agent gets a concrete instruction for correcting its plan. A well-written hook does not just enforce a rule; it shows the model how to satisfy it.

> A prompt is a request, a skill is a procedure, MCP is a capability. A hook can be a hard gate when the right event and blocking decision are configured correctly.

## Example 1: blocking commits without tests

A classic and my first hook in every repo. A PreToolUse matched to the Bash tool checks whether the planned command is `git commit`, and if so - whether this session has a fresh marker of a successful test run (for me: a `.claude/.tests-passed` file, written by a separate PostToolUse hook after a green `npm test`, with a timestamp no older than 15 minutes).

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/guard-commits.sh" }
        ]
      }
    ]
  }
}
```

The script itself is a dozen or so lines: read the JSON, extract the command with `jq`, and if it does not contain `git commit` - exit with code 0. If it does, and the marker is missing or stale - print the reason to standard error and exit with code 2. Since deploying this gate, the number of "fix-up" commits after a failed deployment has dropped to practically zero for me, because the entire class of "the agent was sure it broke nothing" situations disappeared.

## Example 2: automatic lint after every edit

A PostToolUse matched to the Edit and Write tools. After every file save, the hook extracts the path from the JSON and runs the file through a linter with auto-fix:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx eslint --fix" }
        ]
      }
    ]
  }
}
```

The effect: the agent never leaves a file in a style-breaking state, regardless of whether it "remembered" the conventions. The same approach works for `prettier`, `black`, `gofmt` - anything that formats deterministically. An important nuance: a post-edit hook should not take longer than 2-3 seconds, because you pay for it on every save. Leave the full project-wide lint to a Stop hook, which fires once per response.

## Example 3: the secrets guard

The third hook, which I treat as mandatory when working with client code: a PreToolUse on the Read and Bash tools that blocks access to credential files. The pattern list is short and explicit: `.env`, `*.pem`, `id_rsa`, `secrets/` directories. If a path in the tool parameters matches a pattern - code 2 and the message "this file contains secrets, use the environment variables from the .env.example template".

Would the agent "want" to read secrets? Usually not. But one debugging session is enough, in which the model decides that the fastest path to a diagnosis is to peek at the configuration, and a production key lands in the conversation history, and from there potentially in logs. A hook closes that door mechanically. Cost of implementation: half an hour. Cost of a key-leak incident: rotating all credentials and a very unpleasant conversation.

## Example 4: context to start the day

SessionStart is the only one of the four that does not guard - it feeds. My session-start hook prints three things: the current branch with the commit count relative to main, the list of modified files from `git status`, and a one-line reminder of the commit convention. That lands in the agent's context before the first instruction is given. It sounds trivial, but it eliminates an entire class of "the agent thought it was on master" mistakes - and I have seen those in teams more often than is comfortable to admit.

## When a hook, when a skill, when MCP

After posts on all three layers, I can finally line them up in one place:

| Question | Hook | Skill / prompt | MCP |
|---|---|---|---|
| Who decides about execution | the environment, always | the model, at its discretion | the model, at its discretion |
| Can the agent skip it | no | yes | yes |
| What it is for | policies, blocks, audit | knowledge, ways of working | access to external systems |
| Cost of a mistake when missing | an incident | lower quality | manual work |
| Typical implementation time | 0.5-2 hours | 15-60 minutes | 2-6 hours |

A practical heuristic: if your answer to "what happens when the agent fails to do this?" is "an incident, a leak, or embarrassment in production" - that is a hook. If your answer is "the result will be weaker and someone will fix it in code review" - a skill or a CLAUDE.md entry is enough. If the problem is access to data the agent does not have - that is a topic for MCP, not for a hook.

## What not to do with hooks

Two anti-patterns I have already seen in the field. First: the hook as micromanagement. A team added twelve PreToolUse gates and the agent kept getting stuck in a loop of blocks halfway through a session, so people started working around it. Reserve gates for matters where the cost of a violation is real - my limit is 4-5 blocking hooks per repo. Second: business logic in a hook. A hook is there to guard and clean up, not to make substantive decisions. If a hook script exceeds 50 lines, that is usually a sign you are trying to use it to replace something that should be a test, a lint step in CI, or an ordinary script.

And one thing that is easy to forget: hooks run code on your machine with your privileges. A hook from a repo you just cloned off the internet deserves a review exactly like any other foreign script. Before you trust someone else's `settings.json`, read what it launches.

## Summary

Hooks are the deterministic layer of working with an agent: the environment runs them by itself, and a blocking `PreToolUse` result lets you stop an action while simultaneously telling the model how to satisfy the rule. Four types cover most needs - PreToolUse for gates, PostToolUse for cleanup, Stop for the final check, SessionStart for feeding context. Start with the three classics: blocking commits without tests, lint after edits, and the secrets guard. Policy goes to a hook, knowledge to a skill, integrations to MCP - and no more than a few gates per repo, so the agent still has room to breathe. One evening of configuration pays for itself at the first blocked accident.
