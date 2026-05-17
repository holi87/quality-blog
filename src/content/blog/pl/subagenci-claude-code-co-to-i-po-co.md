---
title: "Subagenci w Claude Code: po co orkiestrować zamiast pisać w jednym oknie"
description: "Jeden Claude vs wielu specjalistów wołanych przez Agent. Po co subagenci, jak Claude wybiera którego użyć, kiedy NIE używać, i dlaczego to nie jest po prostu jedno okno z większym kontekstem."
date: 2026-05-12
tags: ["ai", "claude-code", "subagenty", "automatyzacja"]
lang: pl
readingTime: 7
author: GH
---

Claude Code w terminalu domyślnie odpowiada jednym modelem. Jeden context window, jedna historia, jedna sesja. Działa to do momentu, gdy zadanie wymaga rzeczy, które nie mieszczą się w jednym kontekście - research po dziesięciu plikach, równoległe naprawianie czterech bugów, druga opinia od silniejszego modelu. Wtedy włącza się delegacja: Claude woła **subagenta**.

Subagent to nie „jeszcze jeden model do rozmowy". To osobny LLM ze świeżym kontekstem, listą narzędzi inną niż twoja, własnym promptem systemowym, i bez pamięci o tym, co działo się w głównej sesji. Dostaje brief, robi swoje, zwraca jedno podsumowanie. To zmienia sposób, w jaki Claude potrafi prowadzić zadanie.

## Po co w ogóle subagenci

Trzy konkretne powody.

**Izolacja kontekstu.** Twój główny czat Claude ma już 50k tokenów historii - pliki, edycje, decyzje. Jeśli teraz zechcesz „przejrzyj cały folder testów i znajdź duplikaty", Claude wciągnie do swojego kontekstu tysiące linii kodu testów. Po tym zadaniu kontekst jest zaśmiecony, a Claude nie pamięta, o czym była rozmowa pół godziny temu. Subagent z osobnym kontekstem robi tę samą pracę, zwraca podsumowanie 200 słów, twój kontekst zostaje czysty.

**Parallelizacja.** Claude w jednym wywołaniu może wystrzelić cztery subagenty równolegle (cztery `Agent` tool uses w jednej odpowiedzi). Cztery niezależne zadania kończą się w czasie najwolniejszego - research po API, sprawdzenie testów, audyt bezpieczeństwa, lista TODO. To moment, w którym subagenci dają największą wartość.

**Specjalizacja.** Builtin agent `code-reviewer` ma prompt skupiony na znajdowaniu bugów. `tech-lead-orchestrator` patrzy na decyzje architektoniczne. Każdy z nich jest „lepszy" w swojej działce niż domyślny Claude, bo prompt systemowy jest ostrzejszy i nie konkuruje z 50 innymi rolami.

## Builtin: Explore, Plan, general-purpose

Trzy, które prawdopodobnie znasz:

- **`Explore`** - read-only, szybki agent do lokalizowania kodu („gdzie jest zdefiniowane X", „które pliki referencjonują Y"). Używaj zamiast `grep` + 3 retry, gdy nie wiesz, jak nazywa się funkcja
- **`Plan`** - agent architekt, projektuje plany implementacji. Krok po kroku, z trade-offami. Używaj, zanim zaczniesz pisać kod do nieoczywistego problemu
- **`general-purpose`** - wszystko inne. Multi-step research, otwarte pytania, „nie wiem od czego zacząć"

Plus dziesiątki dedykowanych: `code-reviewer`, `frontend-developer`, `python-expert`, `django-backend-expert`, `gsd-*` (jeśli masz plugin GSD), itp. Lista zależy od zainstalowanych pluginów i marketplace'ów.

## Jak Claude wybiera, którego użyć

Każdy subagent ma w definicji pole `description`. Claude czyta opisy wszystkich dostępnych subagentów i dopasowuje do twojego zadania. Czasem pomaga jawnie wskazać: w `Agent` tool use jest parametr `subagent_type`. Jeśli go nie podasz, Claude wybierze sam (zwykle `general-purpose`).

Praktyka: jeśli widzisz, że Claude woła nie tego agenta, którego chciałbyś, dwie rzeczy mogą być nie tak:

- Zła `description` w definicji agenta - za szeroka („wszystko") albo za wąska („tylko gdy plik nazywa się foo.ts")
- Twoje zadanie jest niejednoznaczne - Claude nie wie, czy to research, czy implementacja

## Sekwencyjnie czy równolegle

Reguła z dokumentacji Claude Code: jeśli kilka tasków jest niezależnych, wystrzel je w jednej odpowiedzi (multiple tool uses jednocześnie). Jeśli jeden zależy od drugiego (research → na podstawie wyniku decyzja → implementacja), wystrzel sekwencyjnie.

Konkretny przykład.

**Sekwencyjnie** (źle, marnujesz czas):
1. Spawn agent „znajdź cały auth middleware"
2. (czeka)
3. Spawn agent „znajdź kod connection do DB"
4. (czeka)
5. Spawn agent „lista TODO w komentarzach"

**Równolegle** (dobrze, jedna odpowiedź):

```
Agent("auth middleware") + Agent("DB connection code") + Agent("TODO comments")
```

Wszystkie trzy startują razem, kończą w czasie najwolniejszego.

## Kiedy NIE używać subagenta

Subagent kosztuje. Każdy = nowy context window do napełnienia, każdy = czas latencji, każdy = koszt tokenów. Nie używaj, gdy:

- Wiesz dokładnie który plik chcesz przeczytać. Po prostu zawołaj `Read` w głównym wątku
- Szukasz konkretnego symbolu. `grep` przez Bash jest szybsze niż `Explore`
- Robisz krótkie 1–2 step zadanie. Subagent tu tylko dodaje overhead
- Potrzebujesz pełnego output do dalszej decyzji. Subagent zwraca podsumowanie, raw output ginie

Anti-pattern, który widzę najczęściej: spawning subagent „znajdź wszystkie pliki .ts". `find . -name "*.ts"` przez Bash robi to samo w 10 ms zamiast 30 sekund.

## Trade-offy i ograniczenia

Trzy rzeczy, o których warto pamiętać:

- **Subagent nie widzi twojej rozmowy.** Musisz mu napisać brief od zera. Jeśli założysz „on wie, o czym rozmawiamy" - nie wie. Brief = task + relevant context + expected output format
- **Wynik to tekst, nie diff.** Subagent zwraca podsumowanie, nie pełny output. Jeśli kazałeś mu pisać kod, sprawdź, czy realnie zapisał plik (trust but verify)
- **Background agents są wygodne, ale niewidoczne do końca.** `run_in_background: true` pozwala odpalić agenta i kontynuować - ale dopóki nie skończy, nie wiesz, jak idzie. Pasuje do długich zadań z jasnym deliverable

## Przykład end-to-end

Zadanie: „dodaj testy do funkcji X i sprawdź, czy nie psują reszty".

Główny Claude:

1. `Read` X (nie subagent - jeden plik, znany path)
2. Spawn `Explore` agent „znajdź jak X jest używane w testach i kodzie produkcyjnym" (subagent - bo nie wiem ile plików)
3. Na podstawie wyniku: napisz nowy test (`Edit`, w głównym wątku, bo decyzja zależy od poprzedniego kroku)
4. Spawn `general-purpose` agent „uruchom `npm test` i zwróć tylko failujące testy z reasonem" (subagent - output `npm test` bywa dziesiątki kB)
5. Jeśli failuje → fix → goto 4

Trzy subagenty, każdy ma swoją rolę, każdy zwraca tyle, ile potrzeba, twój kontekst zostaje czysty.

## Co dalej

Ten post pokazał czemu i kiedy wołać subagentów. Drugi post w tej serii (piątek) pokaże **jak napisać własnego** - frontmatter, prompt, deployment, anty-wzorce w pisaniu `description`. Jeśli używasz Claude Code i często powtarzasz ten sam typ zadania (np. „przejrzyj diff przed PR i powiedz, co poprawić"), własny subagent z ostrym promptem płaci za siebie po trzecim wywołaniu.

Jutro: skill [`prompt-master`](/pl/blog/prompt-master-skill-claude-code/) - zamiast pisać prompt do MJ/Sory/Cursora ręcznie, masz w Claude Code generator promptów. Po więcej z serii: [podstawy promptingu](/pl/blog/prompty-ai/), [pierwszy MCP dla QA](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/).
