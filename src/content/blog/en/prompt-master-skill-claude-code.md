---
title: "The prompt-master skill in Claude Code: a prompt generator for other AI tools"
description: "Instead of writing prompts to Midjourney, Sora, Suno or Cursor by hand, you have a Claude Code skill that does it. How it works, where it won't replace knowing the target tool."
date: 2026-05-13
tags: ["ai", "claude-code", "skill", "prompts"]
lang: en
readingTime: 7
author: GH
---

You wrote a Midjourney prompt today. You start with "cyberpunk Beksiński portrait, high detail, dark palette," look at the result, add `--ar 16:9 --style raw --v 6`, iterate ten times. Then the same thing for a GPT-5 prompt to generate Python code, then a Sora prompt for a video animation. Every tool has its own prompting grammar, its own parameters, its own idiosyncrasies. Writing this from memory by hand = wasted time.

The `prompt-master` skill in Claude Code solves exactly this problem: you give it an input ("I want a cyberpunk Beksiński portrait for MJ") and it returns a prompt optimized for the specific target tool, with the parameters and structure that tool expects.

## What it actually does

`prompt-master` is a skill (not a subagent) - a body of knowledge plus patterns plus rules that load into the main Claude in your terminal when specific triggers fire. It generates, fixes, improves, and adapts prompts for different tools:

- **Text LLMs** (GPT, Claude, Gemini) - system prompts, role definitions, few-shot examples
- **Image AI** (Midjourney, DALL-E, Stable Diffusion, Flux) - scene descriptions, style parameters, weights
- **Video AI** (Sora, Runway, Veo) - shot description, camera motion, duration, mood
- **Audio AI** (Suno, Udio) - genre, tempo, instrumentation, song structure
- **Coding agents** (Cursor, GitHub Copilot, Codex, Claude Code) - system prompts, project context, constraints

## How to invoke it

Three paths:

1. **Slash command**: `/prompt-master` in Claude Code
2. **Natural language**: "write a prompt for X," "fix this MJ prompt," "adapt this GPT prompt for Cursor" - the skill triggers on the description
3. **As part of a larger workflow**: while writing an article and saying "add a prompt I could feed to Sora for the video intro"

The skill needs no extra configuration if you have it installed (check `/help` or `~/.claude/skills/`).

## End-to-end: a Midjourney prompt

Input:

> I need an MJ prompt for a cyberpunk portrait in the style of Zdzisław Beksiński. 16:9, gloomy mood, neon in the background.

The skill runs through several things internally:

1. Identifies the target tool (MJ) and version (default to the latest, v6 in 2026)
2. Knows MJ prefers descriptions in the form "subject → traits → style → technical parameters"
3. Knows the idiosyncrasies: "cinematic" works for MJ but not for Stable Diffusion; the `::` weights are MJ syntax; reference style via `--sref`
4. Maps "Beksiński" to concrete visual descriptors (lone figures, decaying landscapes, brown-orange palette, oil painting texture)

Output:

```
A cyberpunk portrait in the style of Zdzisław Beksiński,
lone figure with bionic implants and exposed cables,
decaying urban background with flickering neon signs in muted reds and ambers,
oil painting texture with painterly brushstrokes, melancholic atmosphere,
dramatic chiaroscuro, fine cracks across the canvas surface
--ar 16:9 --style raw --v 6 --stylize 350
```

Plus a short rationale for why these descriptors and not others, plus a hint: "if MJ throws too much neon, lower `--stylize` to 200."

## Cross-tool: same theme, different tool

Second task: same visual idea, but a 5-second Sora clip.

The skill doesn't copy the MJ prompt. It knows Sora expects motion, temporal context, and action. The output looks different:

```
A 5-second cinematic clip in the style of Zdzisław Beksiński.
Camera slowly dollies forward toward a lone figure with bionic implants
standing in a decaying urban square. Flickering neon signs cast shifting
red and amber light across cracked concrete. The figure does not move;
only the cables on its body sway slightly in wind. Painterly oil-painting
texture, melancholic atmosphere, dramatic chiaroscuro. Aspect 16:9,
slow contemplative pacing.
```

Cross-tool adaptation, not copy-paste.

## Iteration: "almost-good prompt"

Common case: you have a prompt that works partially, but the result isn't what you want. Instead of writing from scratch, tell the skill: "I have this MJ prompt. It comes out too cartoony. I want more oil painting."

`prompt-master` does a diff in its head - it identifies which tokens push toward "cartoony" (e.g. "illustration," "character design") and swaps them for "oil painting," "painterly brushstrokes," "canvas texture." It returns the corrected prompt with an explanation of which token was changed and why.

This saves more time than starting over because you keep what already works.

## Limit: it won't replace knowing the target tool

The skill is good at prompting grammar and typical patterns. It won't replace:

- **Experimental knowledge** - which specific `--sref` produce which style, which `--stylize` values match your style best
- **Live changes to the tool** - MJ adds/removes parameters every month, the skill's knowledge has a cutoff date
- **Your aesthetic preferences** - whether you prefer soft shadows or sharp contrasts

Treat the output as 80% of the solution, not 100%. The first generated prompt will leave 1-2 things to polish manually.

## Anti-patterns

Three things people do wrong:

- **Input too generic** ("write a prompt for graphics"). The skill can't guess the subject, the tool, or the goal. The output will be generic. The more specific your input, the better the output
- **Expecting one output to be perfect.** The skill optimizes for the typical pattern. Your specific requirement (e.g. "must have exactly 12 elements in the image") needs iteration
- **Skipping the tool context.** "Write a prompt for AI" - which AI? MJ is different from DALL-E, different from SD. State it explicitly

## When to use it, when to skip

Use it when:

- You're working with a new AI tool and don't know its idiosyncrasies
- You're adapting a prompt from one tool to another
- You have a prompt that almost works and you want to improve it
- You're generating prompts in bulk (e.g. ten MJ prompts for different scenes)

Skip it when:

- You know the tool so well that you're faster by hand
- You already have a working template and you're just swapping parameters
- Your prompt is plain text to GPT for something you already know how to describe

## Crosslinks

Prompting basics (rules that work across tools) → [AI prompts](/en/blog/ai-prompts/). Yesterday on subagents, which can have their own custom prompts → [subagents](/en/blog/subagents-claude-code-what-and-why/). Tomorrow: [`advisor()`](/en/blog/advisor-claude-code-second-opinion/) - a second opinion in the terminal.
