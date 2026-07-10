---
title: "MCP Security: What Can Go Wrong With Third-Party Servers and How to Audit Them"
description: "An MCP server is third-party code running with your permissions and content flowing straight into model context. Risk classes, an audit checklist, and a team process."
date: 2026-08-27
tags: ["ai", "mcp", "security", "audit", "claude-code"]
lang: en
readingTime: 15
author: GH
---

Connecting an MCP server to Claude Code takes five lines of configuration and two minutes of work. That ease is deceptive, because the technical simplicity has nothing to do with the weight of the decision: you have just executed someone else's code with your own permissions and given it a permanent channel into the context of a model that acts on your behalf. Over the past year I have been reviewing MCP servers before wiring them into agents - my own and my team's - and I have settled on a procedure that I lay out here in full. This is a defensive text: you will not find attack instructions in it, you will find a checklist for defense and a process you can show your security department without blushing.

## An MCP server is two attack surfaces at once

The classic trust model for plugins is simple: you install someone's code, so you trust the author that the code does nothing wrong. Browser extensions, npm packages, editor plugins - the same deal everywhere. An MCP server falls fully under that deal: it is a process, usually running on your machine, with your privileges, with access to everything your system user can touch.

MCP adds a second surface: tool descriptions and call results can enter the model's context. The exact timing depends on the client - some load definitions eagerly, while others discover them lazily - but content from a used tool becomes model input. The model does not separate data from instructions with a guarantee comparable to SQL parameterization. An MCP server can therefore hurt you in two independent ways: as code that does something bad on your machine, and as content that talks your agent into doing something bad with your hands.

Everything else in this text follows from that duality. An audit that checks only the code is half an audit; so is one that checks only the content. I have already written about [when MCP is worth adopting at all](/en/blog/mcp-when-it-helps-when-overengineering/) - today I assume the "yes, we need it" decision has been made, and the question is: can this particular server be trusted.

## The risk classes worth knowing by name

Before the checklist, let me name the threats, because a well-named risk is easier to detect and easier to discuss with a team.

- **A malicious or compromised server.** The oldest class of problem: the supply chain. An MCP server is a package from npm or pip, and packages get swapped, taken over after a maintainer's account lapses, or published under names confusingly close to a popular project. Nothing AI-specific about it - what is specific is the scale, because teams working with agents install more third-party code faster than ever, often on machines holding production credentials.
- **Tool description poisoning.** A tool description is not documentation for a human; it is a fragment of the model's prompt. A malicious server can plant instructions in a description that stay invisible in normal use: telling the model to attach certain data to call parameters, or to change the agent's behavior on entirely unrelated tasks. A human rarely reads tool descriptions end to end; the model reads them every time.
- **Indirect prompt injection through tool results.** A server can be perfectly honest and still become an attack channel, because it returns content from untrusted sources: web pages, tickets, comments, documents. If someone has planted instructions for the model inside that content, the agent may treat them as its own task. I dissected this mechanism in detail in the post on [prompt injection for testers](/en/blog/prompt-injection-for-testers-owasp-llm/); for now it is enough to remember that an honest server does not mean safe content.
- **Excessive permissions.** A "weather lookup" server whose configuration demands filesystem access and every environment variable does not have to be malicious - sloppy is enough. Every excess permission is surface that someone else will eventually use: through a bug in the server, through poisoned content, through a hijacked package.
- **The rug pull.** The server was honest on the day of the audit, and that guarantees nothing. An update can rewrite tool descriptions, add new tools, or change the behavior of existing ones - and if you automatically install "latest", you have pre-approved every future release that nobody has seen yet.

The uncomfortable common denominator: none of these classes requires a mistake on your side. Connecting the server and using it as documented is enough.

## The pre-connection audit: a checklist

Here is the procedure I run before connecting any new server. For a typical case it takes between thirty minutes and an hour - less than handling a single leaked-token incident.

1. **Who maintains it and whether the repository is alive.** An official server from the service vendor, a project of a known organization, or an anonymous account with a single repository? How many maintainers, how often releases ship, whether issues get answers, whether the commit history looks like a team at work or a one-time code dump. A hobby server is not bad by definition, but it needs a closer read, because nobody else has read it.
2. **What the server reads and writes.** Review the source for file operations, network calls, and process execution. If the codebase is too large, read at least the tool manifest: names, parameters, descriptions. A tool whose name suggests reading but whose parameters allow writing is a question you want answered before connecting, not after an incident.
3. **Which secrets it sees.** Which tokens and keys does the configuration require, and where do they end up: do they stay in a local process or travel to a remote service? A server that asks for a broad-scope key "for convenience" deserves a dedicated token with a minimal scope instead - more on that in a moment.
4. **Transport and authentication.** A local server over stdio limits the MCP channel to a process launched by the client, but that process can still read accessible files and environment variables and make network connections with the user's privileges. A remote server is a different model: your queries and data flow into someone else's infrastructure. Who operates it, how does it authenticate clients, what does it log, how long does it retain data, and does it say any of this plainly? The absence of clear answers is itself an answer.
5. **Pin the version.** A concrete version number in the configuration instead of "latest". Updating a server should be a deliberate decision with a short review of the changes, not an automatism. This is the only real defense against the rug pull, and it costs exactly one line.
6. **Read every tool description end to end.** All of them, before the first connection. Warning signs: imperatives addressed to the model ("always", "before every task", "do not tell the user"), mentions of files or data unrelated to the tool's function, instructions concerning other tools. A tool description is supposed to describe the tool; anything beyond that is suspect.

This list gives no guarantees - no audit does. It gives something more practical: a fast filter for servers that fail on the first three points, and a documented basis of trust for the ones that pass.

## Least privilege in practice

The audit answers the question "should we connect it". Least privilege answers the question "how do we connect it so that a wrong answer to the first question hurts as little as possible".

First, a separate token for every server, with the narrowest possible scope. A server for browsing Jira tickets gets a read-only token limited to one project - not the service account with admin rights "because it was already lying around". Separate tokens have a second virtue beyond scope: revocation becomes surgical. When a server turns out to be a problem, you invalidate one token and the rest of the environment keeps working.

Second, read-only mode wherever it exists. Some servers offer it as a configuration flag; where they do not, a read-only token enforces it from the outside. An agent that can read but cannot write has a radically smaller damage potential - and most QA use cases are reads anyway: logs, tickets, test results, documentation.

Third, a client-side allowlist of tools. A server may expose twenty tools of which you need three. A client can block calls to the rest through permission rules. Check separately whether that client also removes their definitions from model context: blocking execution does not always shorten the prompt or hide the tool description.

Fourth, a container or other isolation for servers you trust only conditionally. A container with no host mounts, no excess capabilities, no privileged mode, and restricted egress substantially reduces the blast radius. It is not a magic boundary: careless mounts, the Docker socket, secrets in the environment, and broad network access can hand back almost the same power as the host.

Fifth, and I consider this the most important one: separate the agent that holds private data from the agent that reads untrusted content. An agent that simultaneously sees your repositories and secrets, reads content from the internet, and can send data out combines all three ingredients of an incident in a single process. Break that triangle: the agent doing web research reads untrusted content but holds no secrets; the agent with secrets never touches raw external content. The separation is inconvenient, and that is precisely why it works.

## Warning signs at runtime

The pre-connection audit is half the job; the other half is attentiveness during use. Three signals that make me stop and check what is actually going on:

- **A tool asks for data unrelated to the task.** The agent suddenly wants to pass the contents of a configuration file, a token, or a code fragment into a tool call, even though the task does not call for it. It may be harmless overeagerness of the model - or the effect of an instruction buried in a tool description. Before you approve the call, read exactly what the agent is about to send, and where.
- **The tool list changes after an update.** New tools appear, descriptions shift, parameters grow. If you have pinned versions, such a change always coincides with a deliberate update and becomes part of its review. If the list changes "by itself", you have just learned that you do not control your server's version.
- **Results contain instructions for the model.** Fragments addressed to the agent rather than to you: directions to call other tools, requests to disregard earlier arrangements, text impersonating a system message. That is not a curiosity, it is an incident in progress: disconnect the server, preserve the session transcript, and trace where the content came from.

The precondition for noticing any of this is telemetry, however basic: a log of tool calls - which tool, with what parameters, returning what. Claude Code records session transcripts locally; in a team environment it is worth collecting them centrally. Without that record an incident cannot be reconstructed, and you will learn exactly nothing from it.

## A process for the team

Individual hygiene does not scale to a team; a process does. Four elements are enough to start:

- **A registry of approved servers.** A file in the repository: server name, pinned version, permission scope, audit date, owner. A new team member connects what is in the registry and knows that somebody has checked it.
- **A review before adding one.** A candidate server goes through the checklist from this text, and a second person reviews the result - exactly the way code gets reviewed. A good first candidate is [a simple search-and-fetch server](/en/blog/first-mcp-for-qa-search-fetch/), because its entire surface is easy to understand in one sitting.
- **An owner for every server.** A specific person follows the releases, decides about updates, and reviews the changes before bumping the version. "Everyone" as the owner means "no one" in practice.
- **A periodic review.** Once a quarter: is the server still used, is the version still supported, do the tokens still carry minimal scope. Unused servers get removed from the registry - a dead integration is pure risk cost with zero benefit.

With such a process, the conversation with the security department looks entirely different. Instead of asking for permission to "connect AI to our systems", you bring the registry, the checklist, and the least-privilege rules - the same apparatus the company has used for years to manage code dependencies, applied to a new class of dependency. In my experience this framing turns the conversation from "no, because we do not know what it does" into a negotiation about the scope of a pilot. And the alternative to a process is not the absence of MCP in the company - it is MCP connected quietly, without audit and without a registry, because a ban does not remove the need, only the visibility.

## Summary

An MCP server is two attack surfaces in one package: code executed with your permissions and content flowing straight into the model's context. The risk classes are known and named: a compromised supply chain, tool description poisoning, indirect prompt injection through results, excessive permissions, and the silent rug pull after an update. The defense is no secret either: a checklist audit before connecting, dedicated minimal-scope tokens, read-only mode, a client-side tool allowlist, isolation for conditionally trusted servers, and separating the agent with secrets from the agent that reads the internet. At the team level: a registry, a review before adding, an owner per server, and a periodic review. If you take one thing away from this text, let it be the cheapest one available: before you connect the next server, open the manifest and read every tool description to the end. Ten minutes, after which you will never look at "five lines of configuration" the same way again.
