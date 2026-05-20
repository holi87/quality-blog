---
title: "Biblioteka promptów to anti-pattern. Tak, ta z 200 linii"
description: "Jeśli kopiujesz prompt z dokumentu - masz problem fazy 4, nie fazy 3. Czemu fetyszyzacja promptów to objaw braku ewolucji, jak rozłożyć 200-linijkowy prompt na custom instructions i kontekst projektu."
date: 2026-05-28
tags: ["ai", "prompt-engineering", "skala-holaka", "antipaterny"]
lang: pl
readingTime: 7
author: GH
---

Mam w głowie obraz, który widzę w co drugim wdrożeniu:

Inżynier, dwa monitory. Po lewej Confluence z folderem *„Złote prompty"*. Po prawej Claude. Kopiuj - wklej - uzupełnij `{project_name}`, `{requirements}`, `{output_format}` - Enter. Czeka. Niezadowolony z wyniku, wraca do Confluence, kopiuje *„Złoty prompt v2 - kontekst rozszerzony (FINAL)"*. Wkleja, koryguje. Pisze do siebie *„muszę zaktualizować v3"*.

Tę osobę chcę przekonać do jednej rzeczy: **to nie jest sukces. To jest objaw**.

## Czego naprawdę dotyczy biblioteka promptów

Patrząc na [Skalę Holaka](/pl/blog/skala-holaka/) - biblioteka 200-linijkowych promptów to nie poziom 3 (frameworki), tylko poziom 3 z **utykaniem przed 4**. Czemu?

Bo bibliotekę masz wtedy, gdy:

- powtarzasz tę samą rolę / styl / ograniczenia w każdym prompcie
- przepisujesz kontekst projektu za każdym razem
- zarządzasz wersjami promptów ręcznie
- tworzysz konwencje *„v1 - basic, v2 - z testami, v3 - z testami i security"*

Wszystko to są **rzeczy, które powinny żyć wyżej**. W ustawieniach modelu (poziom 4), w plikach kontekstowych (poziom 5), w zaawansowanych instrukcjach (poziom 6).

Biblioteka promptów to dług, który zaciągasz, bo nie chcesz przejść wyżej.

## Czemu działa krótkoterminowo

Trzeba uczciwie powiedzieć: w sprincie biblioteka działa. Sztampowy prompt na 200 linii daje sztampowy output. Output jest powtarzalny. Zespół ma „wspólny język". Wszystko fajnie.

Po trzech miesiącach widzisz:

- **Drift modelu.** Anthropic / OpenAI zmieniają wersję modelu - twoje prompty nagle dają inne wyniki, bo bazowały na konkretnych regularnościach.
- **Brak transferu.** Nowy projekt = przepisz wszystkie prompty z konteksem nowego projektu. Skala roboty rośnie liniowo z liczbą projektów.
- **Rozwarstwienie zespołu.** Dwóch inżynierów ma „swoją wersję v3" tego samego prompta - nieuzgodnione. Trzeci napisał własną od zera, bo *„te są stare"*.
- **Brak ewolucji.** Po pół roku nadal jesteś na 3. Twoja branża dawno jest na 5–6.

## Jak rozłożyć 200-linijkowy prompt

Konkretny zabieg. Wziąłem realny prompt z jednego z banków (z anonimizacją). Wyglądał tak:

```
Jesteś senior software engineerem z 15-letnim doświadczeniem w Pythonie.
Pracujesz dla zespołu Risk Engine, który obsługuje system limitów kredytowych
dla 12 milionów klientów. Stack: Python 3.11, FastAPI, PostgreSQL 15, Redis.
Konwencje:
- type hinty wszędzie
- docstringi w formacie Google
- testy w pytest, mock'i przez unittest.mock
- logging przez structlog
- error handling: nigdy except Exception, zawsze konkretne typy
- nigdy nie używaj print
- nie używaj global state
- ...

[150 linii dalej]

Twoje zadanie:
Napisz endpoint do tworzenia limitu kredytowego dla klienta. Wymagania:
- POST /limits
- body: customer_id, amount, currency, expires_at
- walidacja: amount > 0, currency in ['PLN', 'EUR', 'USD']
- ...
```

Trzy operacje:

### Operacja 1: do custom instructions

Wszystko o tobie i twoim stylu. Wjeżdża do `Settings → Custom Instructions` w ChatGPT/Claude:

```
Jestem senior software engineerem z 15-letnim doświadczeniem w Pythonie.
Pracuję w stack: Python 3.11, FastAPI, PostgreSQL, Redis.
Preferuję: type hinty wszędzie, docstringi Google style, testy w pytest,
logging przez structlog, konkretne typy w except (nigdy Exception).
Unikaj: print, global state, magicznych liczb.
Odpowiadaj zwięźle, kod komentuj tylko gdzie WHY jest nieoczywiste.
```

20 linii zamiast 80. Trzymane raz, używane zawsze.

### Operacja 2: do pliku kontekstowego projektu

Wszystko o twoim projekcie. Wjeżdża do `CLAUDE.md` w katalogu repo (lub `AGENTS.md`, [więcej w osobnym poście](/pl/blog/agents-md-dla-test-automation/)):

```markdown
# Risk Engine

System limitów kredytowych dla 12 milionów klientów.

## Stack

FastAPI + PostgreSQL 15 + Redis. Migracje przez Alembic. Auth przez wewnętrzny JWT service.

## Konwencje testów

- pytest, fixtures w conftest.py per modul
- mockujemy zewnętrzne calle, nie wewnętrzne
- integration tests na PostgreSQL Docker (skrypt make test-int)

## Czego unikamy

Bez Alembic auto-generated migracji - zawsze ręcznie review przed merge.
Bez zmian w schemacie tabeli `customers` bez review z teamem KYC.
```

To 30 linii kontekstu projektu, które agent ma za każdym razem, gdy uruchamiasz Claude Code w tym repo.

### Operacja 3: prompt zostaje minimalistyczny

Zostaje tylko cel zadania. Z 200 linii - 5:

```
Endpoint POST /limits do tworzenia limitu kredytowego.
Body: customer_id, amount (>0), currency (PLN/EUR/USD), expires_at.
Walidacja przez Pydantic. Audit log przez structlog.
```

Tyle. Model zna twój styl (custom instructions), zna projekt (CLAUDE.md), wykonuje zadanie (prompt). Jesteś na 4–5, biblioteka jest niepotrzebna.

## „Ale ja używam 50 różnych zadań, nie jednego"

Najczęstsza obrona biblioteki. Też ma rozwiązanie:

- **Powtarzalne patterny zadań (raport, review, refactor, migracja)** → [skille Claude Code](/pl/blog/prompt-master-skill-claude-code/) albo dedykowane subagenty
- **Konkretne workflow'y end-to-end** → [własny subagent](/pl/blog/wlasny-subagent-claude-code-przyklad/) z zaprojektowanym systemem prompt
- **Eksperymenty / one-off** → tu możesz pisać prompty ad hoc, są ad hoc

Biblioteka 200-linijkowych promptów to próba zrobienia z poziomu 3 substytutu poziomów 4, 5, 6 i 7 naraz. Każdy z tych poziomów ma swoje narzędzie. Biblioteka żadnego z nich nie zastąpi dobrze.

## Wyjątek: ad-hoc eksperymenty

Nie chodzi o to, żeby nigdy nie pisać długich promptów. Chodzi o to, żeby długi prompt **nie był stałym fragmentem twojego workflow'u**.

Eksperymentujesz z nową techniką? Długi prompt OK. Onboardujesz model do projektu, którego nie znasz? OK. Robisz raz w roku coś jednorazowego? OK.

Ale jeśli prompt ma datę modyfikacji sprzed 3 miesięcy i ty go nadal kopiujesz - to nie jest eksperyment. To jest poziom 3 z anti-patternem.

## Test, czy jesteś w tej pułapce

Trzy pytania:

1. **Kiedy ostatnio były zmieniane custom instructions?** Jeśli „nigdy" lub „pół roku temu" - pułapka.
2. **Ile czasu spędzasz w narzędziu AI tygodniowo vs ile czasu spędzasz pisząc / aktualizując prompty?** Jeśli >20% to drugie - pułapka.
3. **Czy nowa osoba w zespole zaczyna od „daj mi twoją bibliotekę promptów"?** Tak = pułapka systemowa.

Jeśli choć raz odpowiedź to „tak" - wybierz jeden prompt z biblioteki, rozłóż go zgodnie z trzema operacjami powyżej, używaj tydzień, zobacz.

## Co dalej

[5 promptów, które zmienią Twoją pracę z AI](/pl/blog/prompty-ai/) to dobry start. Ale jeśli po pół roku te 5 promptów stało się 50 i wszystkie żyją w Confluence - to znak, że czas na promocję do wyższego poziomu, nie kolejny prompt.

Biblioteka to nie sukces. Jest niezbędnym etapem - i objawem, że czas iść dalej.
