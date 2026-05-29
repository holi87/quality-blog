---
title: "AGENTS.md vs CLAUDE.md vs .cursorrules - który plik kontekstowy do czego"
description: "Trzy formaty plików kontekstowych dla agentów AI to nie chaos - każdy ma niszę. Co czyta który agent, co wrzucać do każdego, jak utrzymać w synchronizacji i czego nie kopiować 1:1."
date: 2026-05-29
tags: ["ai", "agents-md", "claude-code", "skala-holaka", "kontekst"]
lang: pl
readingTime: 8
author: GH
---

W [Skali Holaka](/pl/blog/skala-holaka/) poziom 5 to *„pliki kontekstowe per-projekt"*. Wymieniam tam trzy formaty: `AGENTS.md`, `CLAUDE.md`, `.cursorrules`. Najczęstsze pytanie po publikacji: **„dobrze, ale który mam używać?"**

Krótka odpowiedź: wszystkie trzy, dla różnych celów. Dłuższa - w tym artykule.

## Skąd się wzięły

Trzy formaty narodziły się w odpowiedzi na ten sam problem (agent nie zna mojego projektu), ale w różnych ekosystemach.

- **`.cursorrules`** - pierwszy, od Cursor. Krótkie reguły, „nie używaj X, używaj Y". Plik leży w korzeniu repo, Cursor czyta go automatycznie.
- **`CLAUDE.md`** - wprowadzone z Claude Code. Bardziej opisowe, „kontekst projektu plus konwencje". Claude Code automatycznie wczytuje plik z root + dowolnego katalogu nadrzędnego.
- **`AGENTS.md`** - najbardziej generyczny, propagowany od połowy 2025. Zamysł: jeden plik, który zrozumie każdy nowoczesny agent - Claude Code, Codex, Cursor, Aider itd.

W praktyce: rynek nie ujednolicił się. Każde narzędzie czyta swój format, niektóre czytają wszystkie.

## Tabela: co kto czyta

| Narzędzie | AGENTS.md | CLAUDE.md | .cursorrules |
|-----------|-----------|-----------|--------------|
| Claude Code | tak (awaryjnie) | **główny** | nie |
| Cursor agent | tak | tak | **główny** |
| Codex CLI | **główny** | tak | częściowo |
| Aider | tak | tak | nie |
| Continue | tak | tak | tak |

**Hierarchia precedensów w Claude Code**: globalny CLAUDE.md (`~/.claude/CLAUDE.md`) → katalogowy CLAUDE.md (wczytywany rekursywnie od korzenia projektu w dół). Jeśli istnieje AGENTS.md w korzeniu - Claude Code go również wciągnie.

## Co wrzucać do każdego

Każdy format ma trochę inny *charakter*. Mieszanie ich na zasadzie *„kopiuj 1:1"* daje gorsze efekty niż wykorzystanie różnic.

### CLAUDE.md - kontekst i sposób pracy

Najpojemniejszy z trzech. Tutaj wjeżdża:

- cel projektu w 2 zdaniach
- stack technologiczny
- konwencje kodu (tylko te, które są lokalne dla projektu - ogólne idą do instrukcji własnych)
- przepływ pracy w gicie / rozgałęzianie / styl wiadomości commitów
- jak uruchomić, jak zbudować, jak przetestować
- znane pułapki („nie ruszaj X bo Y")
- mapa katalogów jeśli nieoczywista

Przykład fragmentu, którego używam w jednym z projektów:

```markdown
# Risk Engine

System limitów kredytowych dla 12M klientów.

## Stack

Python 3.11 + FastAPI + PostgreSQL 15 + Redis 7.

## Komendy

- `make dev` - lokalny serwer z hot reload
- `make test` - unit tests
- `make test-int` - integration tests (wymaga Docker)
- `make migrate` - alembic upgrade head

## Workflow

- Branche per ticket: `feature/RISK-123-short-desc`
- Commit messages: po angielsku, conventional commits
- PR template w `.github/PULL_REQUEST_TEMPLATE.md`

## Nie ruszaj

- Schemat tabeli `customers` - wymaga review z teamem KYC
- Plik `config/risk_weights.yaml` - zmiana wymaga approve od Head of Risk
```

### .cursorrules - reguły zachowań w kodzie

Krótkie, dyrektywne. Optymalizowane pod „nie pisz Y, pisz X":

```
- Use TypeScript strict mode.
- Never use `any` type. If unsure use `unknown` and narrow.
- All async functions must handle errors via try/catch or `.catch()`.
- Components in PascalCase, hooks in camelCase prefixed with `use`.
- Tests live next to source: `Component.tsx` + `Component.test.tsx`.
- Don't use `index.ts` re-export barrels.
```

Idealnie 10-30 linii. Większe = sygnał że treść powinna pójść do CLAUDE.md albo do promptu systemowego.

### AGENTS.md - przepływ pracy agenta i protokół działania

Najmniej standardowy z trzech, ale nabrał własnego charakteru: tu opisujesz **jak agent powinien się zachować w tym projekcie**:

- *„zanim zmienisz X, sprawdź Y"*
- *„po każdej zmianie w kodzie uruchom `make test`"*
- *„nigdy nie pushuj bezpośrednio do main"*
- *„przed pushem uruchom `npm run lint`"*

[Mam osobny post o AGENTS.md w kontekście automatyzacji testów](/pl/blog/agents-md-dla-test-automation/) - tam jest szczegół dla repozytoriów Playwright/Cypress/API.

## Strategia wielonarzędziowa

Jeśli zespół używa Claude Code + Cursor + sporadycznie Codex, masz 3 opcje:

### Opcja 1: jeden źródłowy plik + symlinki

```sh
ln -s CLAUDE.md AGENTS.md
# Cursor i tak czyta AGENTS.md, więc dwa plik kontekstowe za jednym razem
```

Wada: `.cursorrules` ma inny format (krótkie reguły), więc symlink nie pasuje.

### Opcja 2: jeden plik z nagłówkami na narzędzie

```markdown
# Project context

<!-- @claude-code -->
... pełen kontekst dla Claude Code ...

<!-- @cursor -->
... krótkie reguły dla Cursor agent ...

<!-- @codex -->
... protokoły dla Codex ...
```

Nie wszystkie narzędzia rozumieją te sekcje. W praktyce każde czyta cały plik. Działa średnio.

### Opcja 3: trzy oddzielne pliki + wzajemne odnośniki

To rozwiązanie, które realnie polecam. W korzeniu repo:

```
AGENTS.md       # workflow i protokoły (referencje do CLAUDE.md po szczegóły)
CLAUDE.md       # pełen kontekst projektu, stack, komendy
.cursorrules    # krótkie dyrektywy kodowe
```

`AGENTS.md` zaczyna się od *„Pełny kontekst projektu w `CLAUDE.md`. Tutaj tylko protokoły działania."* - agent pobiera oba pliki, nie ma duplikacji treści.

`.cursorrules` ma na końcu *„For full project context see CLAUDE.md."*

## Antywzorzec: kopia 1:1 między plikami

Najczęstszy błąd: zespół kopiuje treść CLAUDE.md do AGENTS.md, bo „obydwa narzędzia tego potrzebują". Po miesiącu pliki rozjeżdżają się. Ktoś edytuje jeden, ktoś drugi. Agent dostaje sprzeczne sygnały.

Test: otwórz oba pliki i policz wspólne linie. Jeśli >40% - masz duplikację. Refaktoryzacja: zostaw treść w jednym, w drugim link.

## Antywzorzec: dokumentacja-cmentarz

Spisane raz, nigdy nie zaktualizowane. Pisałem o tym [w antywzorcach adopcji](/pl/blog/antipaterny-adopcji-ai/) - ale warto powtórzyć, bo to dotyczy każdego z trzech formatów.

**Test:** otwórz CLAUDE.md i powiedz, co tam zmieniło się w ostatnim miesiącu. Cisza = cmentarz.

**Wyjście:** dodaj do retrospektywy pytanie *„czy CLAUDE.md zgadza się z tym, jak teraz pracujemy?"*. Każda zmiana w przepływie pracy = PR do pliku.

## Czego nie wrzucać

Niezależnie od formatu, kilka rzeczy do CLAUDE.md / AGENTS.md / .cursorrules **nie należy**:

- **Sekretów** - żadne klucze API, hasła, tokeny. Plik jest w repo (zwykle publiczny lub szeroko widoczny).
- **Danych klientów** - nawet zanonimizowane „przykłady z życia".
- **Stylowych preferencji ogólnych** (np. „lubię zwięzłe odpowiedzi") - to do instrukcji własnych globalnie, nie do pliku per projekt.
- **Historii decyzji** (np. „rozważaliśmy X i Y, wybraliśmy Z") - to do ADR-ów (Architecture Decision Records) lub osobnego `docs/`.
- **Map drogowych / list TODO** - to do systemu zgłoszeń, nie do kontekstu agenta.

## Co dalej

Jeśli twój projekt nie ma żadnego z tych plików - zacznij od **CLAUDE.md w korzeniu**. To największy ROI (Claude Code, Codex i Aider go zauważą). Daj sobie 30 minut, jedna strona maks, zaktualizuj po pierwszej sesji.

Jeśli masz wszystkie trzy, ale duplikują się - refaktor zgodnie z opcją 3 z tego postu.

Jeśli masz jeden plik z 2023 roku - udajesz że jesteś na poziomie 5. Realnie wracasz do 4 z antywzorcem. Wyjście: weekend, odświeżenie, retrospektywa.
