---
title: "Advisor w Claude Code: druga opinia od silniejszego modelu zanim się zacementujesz"
description: "Tool advisor() forwarduje cały transkrypt do silniejszego modelu i wraca z opinią. Kiedy wołać przed pracą, kiedy NIE dla każdego kroku, jak nie zrobić z tego konsultacji w nieskończoność."
date: 2026-05-14
tags: ["ai", "claude-code", "advisor", "workflow"]
lang: pl
readingTime: 7
author: GH
---

Claude w terminalu pisze rozwiązanie. Skąd wie, że dobre? Domyślnie: zgaduje. Pierwszy strzał, czasem drugi. Jeśli zacementuje się przy złej interpretacji problemu - wraca dopiero po godzinie, gdy debug zaczyna trzeszczeć. Tool `advisor()` to mechanizm, który łamie ten loop: Claude woła silniejszy model, dostaje second opinion, decyduje na podstawie obu.

## Co to dokładnie

Advisor to narzędzie wbudowane w Claude Code (od jakiegoś czasu w wersji beta, obecnie stabilne w 2026). Działa tak:

- Claude woła `advisor()` bez parametrów
- Cały twój transkrypt (zadanie, każdy tool call, każdy result, każde reasoning) leci do silniejszego modelu (zwykle Opus z poolu reviewerów)
- Advisor czyta to wszystko i odpowiada - diagnoza, sugestia, ostrzeżenie
- Output wraca jako tool result do głównego Claude'a

Nie ma `prompt:` ani parametrów. Forward kontekstu jest automatyczny. To jest celowe - żeby advisor widział dokładnie tyle, ile widziałby ktoś czytający transkrypt, bez „streszczonego" briefu, który mógłby ominąć szczegóły.

## Kiedy wołać

Z dokumentacji Claude Code wynikają cztery momenty:

1. **PRZED substantive work.** Zanim napiszesz rozwiązanie albo zacementujesz interpretację problemu. To jest kluczowy moment - najtaniej skorygować kierunek tu, najdrożej po tygodniu pracy
2. **Gdy praca utknęła.** Errors recurring, approach nie konwerguje, wyniki nie pasują do hipotezy
3. **Przy zmianie podejścia.** Zanim porzucisz aktualną ścieżkę - może wystarczy mniejsza korekta
4. **Przed deklaracją „gotowe".** Final check, czy nic istotnego nie zostało

W moim workflow: na zadaniach dłuższych niż kilka kroków wołam advisor minimum dwa razy - przed commitem do podejścia i przed declaring done. Krótkie reactive tasks („uruchom test, popraw, recommit") mogą obyć się bez.

## Kiedy NIE wołać

Advisor nie jest wyrocznią. Nie wołaj:

- **Dla każdego kroku.** Każde wywołanie to forward całego kontekstu - drogo i wolno. Jeśli twój plan jest jasny i kolejny krok to oczywiste „uruchom test", advisor nie pomoże
- **Po krótkim 1-2 step zadaniu.** Overhead wywołania > wartość second opinion
- **Gdy wiesz dokładnie co zrobić.** Jeśli problem jest oczywisty (typo w kodzie, missing import), advisor nic nie wniesie
- **Jako substytut pisania kodu.** Advisor nie rozwiąże za ciebie - daje opinię, decyzja zostaje twoja

## Koszt

Advisor pali kontekst silniejszego modelu na całej historii rozmowy. To jest drogo. Konkretnie:

- Forwardowane są wszystkie messages + tool results (czyli twój transkrypt)
- Output advisora to jeden response (kilka stron tekstu zwykle)
- Cena = (tokens transkrypt + tokens response) × cena silniejszego modelu

Dla długich sesji (50k+ tokenów history) wywołanie kosztuje zauważalnie. Trzy wywołania w jednej sesji = trzy razy ten koszt. Lepiej dwa dobrze wycelowane niż dziesięć rozproszonych.

## Best practice: zapisz przed wywołaniem

Subtelna rzecz, którą warto zinternalizować. Wywołanie advisora zajmuje minuty (nie sekundy - to długie generowanie po stronie reviewer modelu). W tym czasie sesja może paść (network glitch, terminal close, runtime error). Jeśli twój deliverable jest tylko w chwilowej wiadomości - przepada.

Reguła: **commit / Write / save BEFORE advisor()**. Plik fizyczny zostaje. Tool result z advisora to bonus, nie deliverable.

W praktyce wygląda to tak:

1. Skończyłem implementację
2. `Write` finalnego pliku
3. `git commit` (nie push, bo może coś się jeszcze pojawi)
4. `advisor()` - czeka kilka minut
5. Czytanie opinii → jeśli OK, push. Jeśli wskazał problem, fix → goto 2

## Trust but verify

Advisor czasem się myli. Ma pełen transkrypt, ale nie odpalał kodu - opinia, nie wynik. Trzy wzorce, kiedy ignorować:

- **Empiryczna sprzeczność.** Wykonany krok dał inny wynik, niż advisor przewidywał. Trzymaj się dowodu, advisor mógł niedoceniać twoich tool results
- **Primary source contradiction.** Advisor mówi „ta funkcja nie istnieje w bibliotece X", ale dokumentacja właśnie ją pokazuje. Dokumentacja > opinia
- **Passing self-test ≠ advisor wrong.** Odwrotny case: jeśli twój test przeszedł, ale advisor mówi „masz bug" - to nie znaczy, że advisor się myli. Twój test może nie sprawdzać tego, na co advisor wskazuje. Sprawdź dokładnie

Reguła: jeśli masz primary-source evidence sprzeczne z advisorem, zostań przy evidence, ale rozważ jedno więcej wywołanie z reconcile prompt: „znalazłem X, sugerujesz Y, jaka konkretna konsystencja rozstrzyga?".

## Real workflow przykład

Zadanie: refaktor klasy auth middleware z opcją feature flag.

```
1. Czytam aktualny kod (Read x3)
2. advisor() - „mam plan: ekstrakt interfejsu, dwa implementacje, factory.
   Czy widzisz problem przed pisaniem?"
3. Advisor: „uważaj na request lifecycle, factory musi być per-request
   nie per-app, inaczej feature flag się nie przełączy między requestami"
4. Adjust plan, write code
5. Run tests
6. Tests pass
7. advisor() - „skończyłem. Czy widzisz risk przed mergem?"
8. Advisor: „migracja: stara klasa wciąż referenced w 3 miejscach.
   Albo usuń references, albo zostaw deprecation warning"
9. Fix references → re-test → commit → push
```

Dwa wywołania advisora, oba na granicach decyzyjnych. Nie wołałem advisora między krokami 4-5 ani 5-6, bo to było mechaniczne.

## Anti-patterns

- **Advisor zamiast myślenia.** „Co mam zrobić" → advisor → kopiuję sugestię → ugrzązłem przy implementacji, której nie rozumiem. Advisor wskazuje kierunek, ty rozumiesz drogę
- **Advisor po każdym tool use.** Drogie, wolne, bezsensowne. Większość tool calls nie wymaga second opinion
- **Traktowanie advisora jako wyroczni.** Daje opinię opartą na tekście, nie na wykonaniu. Verify z reality

## Kiedy advisor naprawdę zarabia

Jeśli zadanie ma cechę: „source of truth jest złożony i łatwo źle zinterpretować", advisor w punkcie 1 (przed substantive work) płaci za siebie wielokrotnie. Przykłady: refactor istniejącego systemu, debug skomplikowanego błędu, decyzja architektoniczna. Tu pierwszy strzał ma duże skutki, druga opinia łapie błędy interpretacji wcześnie.

Dla tasków mechanicznych („uruchom test, popraw lint", „dodaj testy do prostej funkcji") advisor jest overkillem.

## Crosslinki

[Subagenci](/pl/blog/subagenci-claude-code-co-to-i-po-co/) - inny mechanizm delegacji. [`prompt-master`](/pl/blog/prompt-master-skill-claude-code/) - skill wczoraj. Jutro: [pisanie własnego subagenta](/pl/blog/wlasny-subagent-claude-code-przyklad/) - koniec serii.
