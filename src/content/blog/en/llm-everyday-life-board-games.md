---
title: "AI in Everyday Life: LLMs as Board Game Assistants"
description: "An LLM can be a very practical helper during board games: explaining rules, resolving ambiguities, searching rulebooks, creating turn summaries, and keeping house rules consistent. The condition is simple: treat it as an assistant, not an infallible judge."
date: 2026-06-12
tags: ["ai", "llm", "chatgpt", "claude", "board games", "productivity"]
lang: en
readingTime: 9
author: [JS, GH]
---

There are moments at the board game table that almost every player knows. The game has been going for two hours. Cards, tokens, markers, a main board, player boards, maybe an expansion and a few campaign rules are spread across the table. Suddenly someone asks: “does this card trigger before combat or after combat?”, “do these bonuses stack?”, “can I take this action if I do not have the resource?”, “what does the rulebook say about ties?” Someone grabs the rulebook. Someone else searches the FAQ on their phone. A third player says: “we played it this way last time.” A fourth player is sure last time was wrong.

This is where an LLM - a large language model such as ChatGPT or Claude - can become a genuinely practical tool. Not as a magical authority that knows every game in the world. Not as a replacement for the rulebook. More like a table assistant: a fast rules librarian, translator, mediator, summary generator, and information organizer.

It is a great example of AI in everyday life because it does not require a big project, coding, or integrations. You only need a phone or laptop, a scan or PDF of the rulebook, a few well-phrased questions, and one sensible rule: the players make the final decision.

## Why board games are hard for humans and interesting for LLMs

Board games have one feature that fits LLMs very well: lots of text, lots of conditions, and lots of exceptions. A rulebook may have a dozen pages or several dozen. On top of that, there are cards, symbols, expansions, errata, FAQs, solo variants, campaign rules, and unofficial community interpretations. Humans are good at understanding the spirit of a game, but not always at quickly finding the exact rule. A language model, however, can process text quickly and connect scattered fragments.

The problem is that an LLM does not “know the truth” in a formal sense. It can answer confidently even when it does not have enough information. It can confuse editions, expansions, card names, languages, or rules from similar games. That is why the best prompt is not: “tell us what the rule is.” A better prompt is: “based on the attached rulebook, find the relevant section, explain it simply, and tell us how confident you are.”

That changes the role of AI. It is not an oracle. It is an interpretation assistant.

## Judge, librarian, and translator in one

An LLM can play several roles at the board game table. The most important ones are rules librarian, assistant judge, translator, teacher, and campaign chronicler.

As a rules librarian, the model searches for the part of the rulebook that answers a specific question. This is especially useful when the rulebook has a weak index or when you do not remember the official term. You can ask: “where does the rulebook explain ties?”, “find the rules about effect timing,” or “does the rulebook contain an exception for free actions?” If the model has the PDF, it can point to a section or page, and players can quickly verify the source.

As an assistant judge, the model can help resolve a dispute. The key is to describe the game state. Do not ask generally: “can I do this?” Instead, write: “Player A has 2 resources. The card costs 3 resources, but another card gives a discount of 1. The effect says that after paying the cost, the player draws a card. Is the action legal?” The more precise the state, the less room there is for guessing.

As a translator, the model helps when the game is in English and some players prefer another language. It can explain difficult terms and distinguish between “may” and “must,” “then,” “after,” “before,” “instead,” and “up to.” This can be crucial because in board games, one word can change the outcome of an action.

As a teacher, the model can prepare a rules summary for new players: the goal, setup, turn structure, common mistakes, and a guided first round. This is often much nicer than reading the entire rulebook aloud at the table.

As a chronicler, the model can keep campaign notes: what happened in the scenario, which decisions players made, which house rules were accepted, and what should be checked before the next session.

## Preparing before the game: projects, files, and instructions

The biggest difference between chaotic LLM use and a genuinely useful workflow happens before the game. Instead of opening a random chat in the middle of a session, create a small workspace for the game.

In ChatGPT, you can use a project: a place that groups chats, files, and instructions. In Claude, projects play a similar role, providing a self-contained workspace with chat history and a knowledge base. You can add the rulebook, FAQ, errata, expansion list, house rules, and notes from previous sessions. This means the model does not have to rebuild context from scratch every time.

Example project instructions:

```text
You are a rules assistant for a board game.
Answer only based on the attached materials unless I explicitly ask you to use the web.
If you are not sure, say so.
For rules questions, provide:
1. a short answer,
2. reasoning,
3. source: page, section, or document name,
4. confidence level: high / medium / low.
Do not invent rules that are not present in the materials.
```

This system prompt changes the quality of the interaction. The model receives a role, boundaries, and an answer format. Players receive an answer that is easier to evaluate quickly.

It is also worth adding a `house_rules.md` file. It can be very simple:

```text
# House rules

- If rules are unclear and there is no quick answer, we play the interpretation least favorable to the player taking the action.
- A decision made during a game remains valid until the end of that game.
- After the game, we check the official FAQ and update the notes.
- Ties are resolved according to the rulebook; if the rulebook is silent, we use the rule agreed before the game.
```

This way, the LLM can remind you not only of official rules but also of your group’s agreements.

## Workflow during play

During the game, you do not want a long conversation with AI. You want a quick ruling. That is why a fixed question format helps.

A good prompt for a table dispute:

```text
Resolve this situation based on the rulebook and FAQ.

Game: [game name]
Version: [edition / language]
Expansions in play: [list]
Game state:
- Player A: ...
- Player B: ...
- Card / action / effect: ...
Question:
- Can ...?

Answer in this format:
1. Decision in one sentence.
2. Reasoning.
3. Source in the rulebook or FAQ.
4. Confidence level.
5. If data is missing, ask at most one question.
```

This format has several advantages. It limits rambling. It forces the model to identify a source. It helps the table make a quick decision. It also reduces the risk that the model starts talking generally about similar games.

A time rule is useful too. For example: “we give AI 60-90 seconds; if there is no clear answer, we make a temporary decision and keep playing.” A board game should be fun, not a courtroom procedure.

## Searching the rulebook by meaning, not only by words

One of the most useful LLM features is searching by meaning rather than exact wording. In a normal PDF, you need to know the term. If you search for “tie” but the rulebook uses “draw,” “tiebreaker,” “equal score,” or a phrase hidden in an example, you may miss the answer. A model can understand the question semantically.

Example questions:

```text
Find all places in the rulebook that describe ties or equal-score resolution.

Does the rulebook say anything about the order of effects when two effects trigger at the same time?

Find the sections about a situation where a player cannot pay the full cost of an action.

Does the rulebook distinguish between an “action,” a “free action,” and a “card effect”?
```

This is especially useful in heavier, campaign, economic, and card-driven games, where many rules are hidden in examples. An LLM can find a relevant paragraph that a human missed because it did not contain the expected keyword.

Still, caution matters. A model may sometimes combine two sections into a logical but unofficial interpretation. For important decisions, ask: “do not interpret beyond the text; separate what follows directly from the rulebook from what is an inference.”

## Teaching rules to new players

Another excellent use case is preparing new players. Many board games have a high entry barrier not because they are impossible to understand, but because the rulebook is long and it is not obvious what matters first.

An LLM can prepare:

- a one-page rules summary,
- a player turn overview,
- a list of common beginner mistakes,
- a “first round with commentary,”
- differences between the base game and expansion,
- an explanation for someone who knows a similar game,
- a version for children or players who prefer simpler language.

Example prompt:

```text
Based on the attached rulebook, prepare an introduction for new players.
It must fit on one A4 page.
Do not describe every exception.
Focus on:
- goal of the game,
- setup,
- turn structure,
- 5 most important rules,
- 5 most common mistakes,
- what to focus on during the first two rounds.
```

This does not replace a good rules explanation by the host, but it helps organize the material. You can also ask: “explain this game as if I know Dune: Imperium but not this specific mechanism,” or “compare this rule to worker placement, deck building, and area control.”

## AI as a campaign assistant

Campaign and legacy games create a lot of notes. Who unlocked what? What decision did we make three scenarios ago? Which special rules apply in this campaign? Which character has which persistent effect? What needs to be prepared before the next session?

An LLM can work as a campaign chronicler. After a session, you can paste quick notes or dictate a summary, and the model can turn it into an organized record:

```text
# Campaign - session 4

## Result
Scenario completed successfully.

## Important decisions
- The group chose the northern path.
- Player B kept the artifact.
- The group did not visit the side location.

## To check before session 5
- Does the wound effect carry over to the next scenario?
- Is the unlocked item available to all players?

## House rules
- Reminder: decision timer is 2 minutes for a standard turn.
```

It is a small thing, but after a few months of break, it can save the atmosphere of a campaign.

## Claude Artifacts, ChatGPT Canvas, and small game tools

LLMs are not only text-answer machines. Tools such as Claude Artifacts and ChatGPT Canvas can create or edit larger pieces of content, and sometimes simple helper apps. For board games, this can be very practical.

Examples:

- score counter,
- round tracker,
- random event generator for a solo variant,
- player aid card,
- interactive turn summary,
- final scoring calculator,
- house rules document,
- setup checklist,
- comparison table for base game and expansion rules.

Claude Artifacts are especially useful for small interactive aids because you can describe the tool in conversation and receive a separate, editable artifact. ChatGPT Canvas is convenient for working on documents, rules summaries, house rules, or the code of a small helper. You do not have to build a full app. Sometimes a small table that can be quickly updated between games is enough.

## Photos of boards and cards: useful, but limited

Multimodal models can analyze images, so one tempting scenario is to take a photo of the table and ask what can be done. This can be useful, but it requires caution.

Board photos are hard: small text, glare, blocked components, similar icons, angled cards, multiple languages, miniatures, tokens. The model may understand the general situation but miss details. That is why images are best used to support a written description, not as the only source of truth.

A better prompt:

```text
The photo shows the game state, but do not assume you see everything correctly.
First describe what you recognize.
Then ask questions about elements you are unsure about.
Do not make a rules decision based only on unclear text on cards.
```

In practice, the fastest workflow is often: photo + short state description + question. The model gets visual context, but players still control the details.

## How not to let AI spoil the game

The biggest risk is not that the model gets something wrong. The biggest risk is that it gets something wrong confidently. That can create a false sense of authority at the table. A few rules help.

First: AI is not the official judge unless the group agrees it is. It is an assistant.

Second: for important rulings, the model should provide a source. If it cannot, the answer is only a suggestion.

Third: a decision made during a game can be temporary. After the game, you can check the official FAQ and update house rules for next time.

Fourth: do not use AI carelessly with hidden information. If a game contains secret cards, hidden objectives, legacy envelopes, or scenario spoilers, make sure the model does not reveal information to the wrong players.

Fifth: AI should not play for a player unless the group wants that. There is a difference between explaining rules and giving strategic advice during a game. A strategy coach can be fun after the game, but during the game it may affect balance.

## Practical cheat sheet: best prompts

### 1. Quick rules ruling

```text
Answer as a rules assistant.
Use only the attached rulebook and FAQ.
Situation:
[description]
Question:
[question]
Provide:
- one-sentence decision,
- reasoning,
- source,
- confidence level,
- whether it follows directly from the rules or is an interpretation.
```

### 2. Rulebook search

```text
Find all rulebook sections related to:
[topic]
Provide pages/sections and a short summary of each.
Do not answer the rules question yet - show the sources first.
```

### 3. Card-effect translation

```text
Explain this card effect in Polish:
[card text]
Preserve the distinction between “may,” “must,” “before,” “after,” “then,” and “instead.”
End with an example of how it works during a turn.
```

### 4. Rules summary for new players

```text
Prepare a one-page rules summary for new players.
Do not include every exception.
Include the goal, turn structure, scoring, common mistakes, and the first 3 decisions a beginner should understand.
```

### 5. House rules update

```text
Based on our decision from today’s game, update the house rules file.
Add:
- date,
- problem,
- decision,
- whether the decision was temporary,
- what needs to be checked in the official FAQ.
```

## Summary

Using an LLM during board games is one of those AI use cases that is small, everyday, and genuinely practical. You do not need to build a system, train a model, or write an integration. A well-prepared project, a rulebook, a few safety rules, and realistic expectations are enough.

The best way to treat the model is like a person sitting next to the table with a very good memory for text, but without the final vote. It can help find a rule, translate a card effect, prepare a summary for new players, organize a campaign, create a score tracker, and reduce interruptions. But the players still decide how to play.

That is the biggest value. AI should not take the social nature out of board games. It should remove friction: less rulebook digging, fewer memory disputes, fewer pauses, and more playing.

## Sources and documentation

- [OpenAI Help - Projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt)
- [OpenAI Help - File Uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq)
- [OpenAI Help - ChatGPT Search](https://help.openai.com/articles/9237897-chatgpt-search)
- [OpenAI Help - Canvas in ChatGPT](https://help.openai.com/en/articles/9930697-using-canvas-in-chatgpt)
- [Claude Help - Projects](https://support.claude.com/en/articles/9517075-what-are-projects)
- [Claude Help - Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude Help - Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude Help - Web search](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)
