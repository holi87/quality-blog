---
title: "Pisanie własnego subagenta w Claude Code: frontmatter, prompt, deployment"
description: "Druga część serii o subagentach. Tworzymy od zera agenta blog-post-writer - co wpisać w frontmatter, jak napisać description, która faktycznie triggeruje, jak uniknąć dwóch klasycznych pułapek."
date: 2026-05-15
tags: ["ai", "claude-code", "subagenty", "automatyzacja"]
lang: pl
readingTime: 9
author: GH
---

We [wpisie z dnia 12 maja 2026](/pl/blog/subagenci-claude-code-co-to-i-po-co/) pokazałem, czemu warto wołać subagentów i jakie buildtin'y są dostępne. Teraz druga część: piszemy własny subagent od zera. Konkretny use-case: agent, który czyta pomysł na post bloga i zwraca pełny szkic w stylu twojego bloga. Pisany raz, używany dziesiątki razy.

Subagent w Claude Code to plik Markdown z frontmatterem. Nie kompilujesz, nie deployujesz na żaden serwer - tylko zapisujesz w odpowiednim folderze i Claude widzi go natychmiast.

## Lokalizacja: gdzie żyje subagent

Trzy miejsca, w kolejności specyficzności:

1. **Project-local**: `.claude/agents/<nazwa>.md` w korzeniu repo. Działa tylko w tym projekcie. Przydatne, gdy agent jest mocno związany z konwencjami repo
2. **User-global**: `~/.claude/agents/<nazwa>.md`. Dostępny w każdej sesji Claude Code u ciebie. Przydatne dla agentów, których używasz cross-project (np. „przeczytaj diff i zwróć review")
3. **Plugin**: zapakowany w plugin Claude Code i instalowany przez marketplace. Przydatne, gdy chcesz dzielić agenta z zespołem lub publicznie

Dla pierwszego strzału zacznij od user-global - minimum overhead, maksymalny zasięg.

## Anatomia frontmatter

Każdy subagent zaczyna się od bloku YAML:

```yaml
---
name: blog-post-writer
description: Use this agent to draft full blog posts in the user's voice from a topic outline. PROACTIVELY use when the user asks to "write a blog post about X", "draft a post on Y", or describes a topic and target reading time.
tools: Read, Write, WebSearch, WebFetch
model: sonnet
---
```

Pola:

- **`name`** - identyfikator. Lowercase, dashes, opisowe. Claude tym wywołuje agenta
- **`description`** - KLUCZOWE pole. To czyta Claude, gdy decyduje, czy zawołać agenta. Pisz tak, jakby ktoś czytał krótki spis treści - co robi, kiedy używać, czy proaktywnie. Słowa „PROACTIVELY", „MUST BE USED", „use when" wzmacniają triggering
- **`tools`** - lista narzędzi, które agent może wywoływać. Albo lista (`Read, Write, Bash`), albo `*` (wszystkie). Im węższa lista, tym bezpieczniej i tym łatwiej Claude przewiduje, co agent zrobi
- **`model`** - opcjonalny override. `opus`, `sonnet`, `haiku`. Pominięcie = inherituje z parenta. Drobne zadania mogą iść na Haiku (szybciej, taniej), ciężkie analizy na Opus

Frontmatter kończy się drugim `---`, dalej idzie body - system prompt.

## Body = system prompt agenta

Po frontmatter piszesz prompt, który będzie systemowym promptem dla tego subagenta. Nie krępuj się długością - agent nie ma innej wiedzy o tym, co ma robić, niż to, co tu napiszesz.

Struktura, która działa:

```markdown
You are an expert blog post writer specializing in [domena].

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

- [konkretne reguły stylu - np. „prefer concrete examples over abstractions"]
- [„use second person, not first plural"]
- [„avoid filler words: 'just', 'really', 'basically'"]

## Output format

Return only the complete Markdown file content, ready to be written to
src/content/blog/<lang>/<slug>.md. No commentary, no preamble.
```

Im bardziej konkretne reguły - tym konsystentniejszy output. Im więcej „w razie czego" zostawisz subiektywnie - tym agent będzie improwizował.

## Praktyczny przykład: blog-post-writer

Pełny plik `~/.claude/agents/blog-post-writer.md`:

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

To jest realny szkielet. Po pierwszym wywołaniu zobaczysz, co działa, a co nie - i będziesz iterował.

## Test: czy Claude faktycznie wybiera tego agenta

Po zapisaniu pliku, w nowej sesji Claude Code spróbuj wywołać go natural language:

> Napisz post o tym jak Mosquitto MQTT skaluje się przy 10 koordynatorach Zigbee.

Claude powinien rozpoznać „napisz post" + „Mosquitto MQTT" jako zadanie blog-post-writera. Jeśli nie woła:

- Description za wąska - może wymaga „blog-post-writer" w jawnym znaku, ale chcesz proaktywnego triggeringu. Dodaj „PROACTIVELY use when..."
- Description za szeroka - Claude woła agenta dla każdego „napisz X", w tym „napisz funkcję". Doprecyzuj „blog post" lub „artykuł"
- Konflikt z innym agentem - jeśli masz „content-writer" i „blog-post-writer", Claude może preferować jednego z nich. Sprawdź description obu

Test jawny: w głównej sesji powiedz „uruchom subagent blog-post-writer z zadaniem X" - wywoła go bezpośrednio. Jeśli wynik OK ale auto-trigger nie działa, problem leży w description.

## Pułapki w description

Trzy klasyczne, które widzę najczęściej:

**1. Description bez „when".** „Drafts blog posts" - co to znaczy? Claude nie wie, kiedy trzymać się tego agenta. Dodaj eksplicytne „use when the user asks to write/draft/prepare a blog post".

**2. Description z negacjami.** „Don't use this for code" - Claude czyta, ale negacje są słabsze niż pozytywne triggery. Lepiej: „use ONLY for prose content, never for code".

**3. Description bez priorytetu.** Jeśli masz pięć agentów do treści, Claude losuje. Dodaj „MUST BE USED for blog posts" do tego, który ma być domyślny.

## Pułapki w tools

- **Tools: \***. Wygodne, ale agent dostaje też Bash. Jeśli to read-only research agent, daj `Read, Grep, Glob, WebSearch` - nic więcej. Bezpieczniej i Claude wie czego się spodziewać
- **Brak Write w writer-agencie.** Często ludzie zapominają. Agent zwraca tekst „w odpowiedzi", użytkownik kopiuje ręcznie. Marnotrawstwo - daj `Write` i każ zapisać samemu
- **Bash bez precyzji.** Jeśli agent ma Bash do `npm test`, a ty założyłeś read-only, możesz dostać surprise. Ogranicz w prompcie: „use Bash ONLY for npm test, never for git or filesystem changes"

## Iteracja

Pierwsza wersja agenta nigdy nie jest finalna. Iteruj według pattern'u:

1. Wywołaj agenta na realnym zadaniu
2. Patrz, co źle (output, decyzja kogo użyć, narzędzia których brakowało)
3. Edytuj `~/.claude/agents/<nazwa>.md`
4. Wywołaj ponownie

Trzy iteracje wystarczą zwykle, by agent działał stabilnie. Jeśli po pięciu wciąż coś nie pasuje - może problem nie jest agentem, tylko zadaniem, które jest źle zdefiniowane.

## Kiedy własny agent się opłaca

Reguła kciuka: jeśli powtarzasz ten sam typ zadania ze trzy razy w tygodniu, własny agent się opłaca. Pisanie agenta to 30–60 minut, każde wywołanie oszczędza 2–5 minut briefingu (bo agent ma już prompt).

Trzy realne przykłady, gdzie agent płaci za siebie szybko:

- **Reviewer diff przed commit** - czyta `git diff`, zwraca uwagi (style, bugs, missing tests). Wywołujesz codziennie
- **Test-writer** - czyta funkcję, zwraca zestaw testów w stylu projektu. Wywołujesz przy każdej nowej funkcji
- **Doc-updater** - czyta zmienione pliki, sprawdza czy README/docstring nieaktualne. Wywołujesz przed mergem

## Crosslinki

[Subagenci - co to i po co](/pl/blog/subagenci-claude-code-co-to-i-po-co/) - pierwsza część serii. [`prompt-master`](/pl/blog/prompt-master-skill-claude-code/) - skill (nie subagent), inny mechanizm. [`advisor()`](/pl/blog/advisor-claude-code-druga-opinia/) - druga opinia, jeszcze inny.

To zamyka czterodniową serię o Claude Code. Z czterech narzędzi (subagenci, prompt-master, advisor, custom subagent) najwięcej zarobi własny agent jeśli masz powtarzalne zadania, a advisor jeśli pracujesz nad złożonymi systemami. Subagenty buildtin używasz codziennie, czy tego chcesz, czy nie.
