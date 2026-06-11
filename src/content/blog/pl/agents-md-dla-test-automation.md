---
title: "Jak napisać AGENTS.md dla repo test automation"
description: "Co wrzucać do AGENTS.md w repozytorium testowym, jakie są typowe pułapki, szkielety dla Playwright, Cypress i API, i jak sprawdzić, czy plik realnie pomaga."
date: 2026-04-22
tags: ["ai", "qa", "agenci", "agents-md", "test-automation"]
lang: pl
readingTime: 9
author: GH
---

Kiedy agent AI dostaje Twoje repo testowe bez żadnej dodatkowej instrukcji, zaczyna od tego, co widzi: `package.json`, `playwright.config.ts`, kilka folderów `tests/`. Na tej podstawie zgaduje, jak pracujesz. Zgaduje całkiem nieźle - ale zgaduje.

`AGENTS.md` to plik, który zamienia zgadywanie w wiedzę. To konwencja analogiczna do `README.md`, tylko adresowana do modeli pracujących w repo, nie do ludzi. W repozytoriach testowych daje szczególnie dużo wartości, bo test automation ma mnóstwo wiedzy plemiennej, której agent z samego kodu nie wyciągnie: jak uruchamia się testy lokalnie vs w CI, jakie tagi znaczą co, które fixtures są współdzielone, czego lepiej nie ruszać.

W tym wpisie pokażę, co faktycznie wrzucać do `AGENTS.md`, jakie są typowe pułapki, jak wygląda szkielet dla Playwright / Cypress / testów API, i jak sprawdzić, czy plik realnie pomaga.

## Po co osobny plik dla agentów

Można by zapytać: dlaczego nie wrzucić wszystkiego do `README.md`?

Trzy powody:

**Inni czytelnicy, inne potrzeby.** `README.md` odpowiada na pytania człowieka - „co to jest, jak odpalić lokalnie, do kogo pisać z pytaniami". `AGENTS.md` odpowiada na pytania agenta - „jaka jest komenda, dokładnie, literka po literce; czego mam nie robić; w jakim stylu mam pisać nowy kod".

**Różny format.** Dobry `README` jest narracyjny. Dobry `AGENTS.md` jest operacyjny - komendy, listy, jasne „tak/nie". Ludzie tolerują lanie wody. Agent traktuje lanie wody dosłownie i gubi sygnał.

**Ewolucja w innym tempie.** `README.md` zmienia się rzadko. `AGENTS.md` dostrajasz, gdy zauważasz, że agent powtarza ten sam błąd („znowu uruchomił wszystkie testy zamiast tylko zmienionych"). To live document Twojego „jak tu u nas pracujemy".

## Co powinno się znaleźć w `AGENTS.md`

Mój szkielet, który sprawdza się dla repo test automation:

### 1. Krótki opis projektu - jednym akapitem

Nie powtarzaj README. Wystarczy: co jest testowane, na jakim stacku są testy, jaki jest ich zakres (E2E, API, integracja), i gdzie ten kod żyje w relacji do SUT (system under test).

### 2. Setup commands

Konkretne komendy, nie ogólne instrukcje. Agent ma **uruchomić**, nie zinterpretować.

```sh
# Install dependencies
pnpm install

# Install Playwright browsers (needed after install or browser bump)
pnpm exec playwright install --with-deps

# Seed test data (required before first local run)
pnpm run seed:test
```

### 3. Test commands

Najważniejsza sekcja. Wypisz:

- komendę uruchamiającą **wszystkie** testy,
- komendę uruchamiającą **pojedynczy plik** (z przykładem),
- komendę dla **pojedynczego testu po nazwie**,
- jak odfiltrować po **tagu** (jeśli używacie tagów),
- jak uruchomić testy **w trybie headed / debug** (jeśli agent ma asystować przy debugowaniu),
- jak generować **raport** i gdzie ląduje.

Agent z tej sekcji korzysta najczęściej. Im mniej dwuznaczności, tym lepiej.

### 4. Conventions

Tu nie wrzucaj całego coding stylebooka. Daj 5-10 reguł, które faktycznie chcesz egzekwować:

- jak nazywamy pliki testowe (`*.spec.ts` vs `*.test.ts`),
- jak nazywamy testy (pattern: „should … when …" albo zdania w czasie teraźniejszym),
- gdzie żyją fixtures i kiedy je tworzyć, a kiedy reużywać,
- jak obsługujemy dane testowe (czy izolujemy per test, czy per suite),
- jak handlujemy czekanie (zakaz hardcoded sleepów, preferowane web-first assertions).

### 5. What NOT to do

Niedoceniana sekcja. Napisz wprost:

- „Nie modyfikuj plików w `tests/legacy/` - są do usunięcia w Q3."
- „Nie dodawaj nowych zależności bez uzgodnienia."
- „Nie używaj `page.waitForTimeout`."
- „Nie pisz testów, które zależą od kolejności."
- „Nie generuj selektorów po klasach CSS - używamy `data-testid`."

Bez tej sekcji agent zrobi „kolejny sensowny krok", który Was potem kosztuje godziny review.

### 6. Scope i granice

Powiedz agentowi, jakie zmiany są OK do zrobienia samodzielnie, a jakie wymagają dyskusji. Przykład:

- OK: dopisanie testu do istniejącego specka, refaktor helpera w ramach jednego pliku.
- Wymaga dyskusji: zmiana struktury fixtures, dodanie nowej zależności, nowy plik konfiguracyjny.

### 7. Jak wygląda dobry PR

Krótka lista. Przykład: „Każdy PR powinien zawierać: test, opis kroków odtworzenia problemu (jeśli test pokrywa bug), link do ticketu, i potwierdzenie, że testy przechodzą na CI."

## Pułapki, które spotykam najczęściej

**Za dużo tekstu.** Widziałem `AGENTS.md` na 8 stron. Agent, który dostaje 8 stron, potraktuje całość jako jeden wielki kontekst i albo zignoruje szczegóły, albo wyciągnie niewłaściwe priorytety. Cel: 1-2 strony. Jeśli nie mieścisz, tnij.

**Konflikty z kodem.** „Wszystkie testy API są w `tests/api/`" - a połowa żyje w `tests/integration/`. Agent wierzy dokumentowi, nie kodowi, więc pójdzie źle. Traktuj `AGENTS.md` jak kod - aktualizuj przy każdej większej zmianie struktury.

**Brak scope.** „Pomagaj z testami" nie jest instrukcją. „Możesz dopisywać nowe testy E2E w `tests/e2e/`, nie modyfikuj konfiguracji Playwright, nie dodawaj zależności" jest.

**Instrukcje wzajemnie sprzeczne.** „Pisz testy krótko, nie dłuższe niż 20 linii" obok „Zawsze dodawaj komentarze wyjaśniające każdy krok" - to się rozjeżdża. Przeczytaj plik po sobie i szukaj par, które się kłócą.

**Marketingowy ton.** „W naszym zespole dbamy o jakość i ciągle się uczymy" - to nie jest instrukcja, to jest misja firmy. Wywal. Agent tego nie potrzebuje.

## Przykład: szkielet dla Playwright

```markdown
# AGENTS.md

## Project
E2E tests for the checkout flow of shop.example.com. Playwright + TypeScript.
Tests run against a dedicated staging environment.

## Setup
- `pnpm install`
- `pnpm exec playwright install --with-deps`
- Copy `.env.example` to `.env.local` and fill in `STAGING_USER` / `STAGING_PASS`.

## Test commands
- All tests: `pnpm test`
- Single file: `pnpm test tests/e2e/checkout.spec.ts`
- By name: `pnpm test -g "should apply discount code"`
- By tag: `pnpm test --grep @smoke`
- Headed debug: `pnpm test --headed --debug`
- HTML report: opens automatically after failure; otherwise `pnpm exec playwright show-report`.

## Conventions
- File naming: `*.spec.ts`, grouped by feature under `tests/e2e/<feature>/`.
- Test titles: `"should <expected behaviour> when <condition>"`.
- Selectors: only `data-testid`. Never CSS classes.
- Assertions: use web-first `expect(locator).toHaveText(...)`. Never `waitForTimeout`.
- Shared fixtures in `tests/fixtures/`. Ask before adding a new one.
- Test data: isolated per test. Use the `createUser()` factory.

## Do not
- Do not edit `tests/legacy/` - scheduled for removal.
- Do not add new npm dependencies.
- Do not write tests that depend on order.
- Do not hardcode sleeps.

## Scope
OK without discussion: new test in existing file, refactor within a single helper.
Needs discussion: new fixture, new config, new folder.

## PR checklist
- [ ] Test added or updated.
- [ ] Linked to Jira ticket.
- [ ] `pnpm test` passes locally.
- [ ] No changes to `playwright.config.ts` unless discussed.
```

## Wariant dla Cypress

Podobna struktura, inne komendy i kilka specyficznych uwag:

- test commands: `pnpm cypress run`, `pnpm cypress run --spec "cypress/e2e/checkout.cy.ts"`, filtrowanie po `grep` (plugin),
- w `conventions` dopisz regułę o używaniu `cy.session()` dla logowania i o zakazie `cy.wait(ms)`,
- jeśli macie custom commands w `support/commands.ts`, wymień te, które agent ma znać, z jednolinijkowym opisem każdego.

Specyficzna pułapka Cypressa: agenci lubią generować łańcuchy `cy.get(...).should(...)`, które łamią Wasze konwencje. Jedna linia w „Do not": „Zamiast `cy.get('.button')` używaj `cy.findByTestId('button')`" zaoszczędza Ci pół review.

## Wariant dla testów API

Tu priorytety są inne. Dopisz:

- jakich **klientów HTTP** używacie (axios, supertest, got) - agent inaczej generuje kod dla każdego,
- gdzie żyją **kontrakty** (OpenAPI? Pact? wewnętrzne schematy?) i czy agent ma je walidować,
- jak obsługujecie **autoryzację w testach** (token z `.env`? mock? osobny endpoint `/test-login`?),
- **strukturę asercji** (czy walidujecie tylko status, czy też body vs schema),
- jakie są **kategorie testów** (smoke / regression / contract / negative) i po czym agent ma to poznać.

Ważna reguła w „Do not" dla API: „Nie generuj testów, które odpalają się na produkcji. Każdy nowy test musi używać `baseUrl` z `.env.test`."

## Jak zmierzyć, czy `AGENTS.md` realnie pomaga

Łatwo zbudować plik i mieć miłe poczucie, że jest. Trudniej sprawdzić, czy coś zmienia. Kilka praktycznych miar:

**1. Czy agent wykonuje właściwą komendę za pierwszym razem?**
Zadaj agentowi zadanie w stylu „odpal tylko testy smoke" i sprawdź, czy od razu trafia w `--grep @smoke`, czy najpierw próbuje czegoś innego. Zapisuj te „zgadnięte" vs „trafione".

**2. Ile razy w review powtarzasz tę samą uwagę?**
Jeśli trzy razy w tygodniu piszesz „nie używaj `waitForTimeout`", to znaczy, że albo tej reguły nie ma w `AGENTS.md`, albo jest, ale zginęła w szumie. Każdą uwagę, która wraca, promuj do pliku.

**3. Ile plików z kolejnego PR wymaga ręcznego przepisania?**
Prosty surogat jakości: liczba plików, w których akceptujesz agenta bez zmian, vs tych, które piszesz od nowa. Dobre `AGENTS.md` podbija pierwszą liczbę.

**4. Test drugiego zespołu.**
Oddaj repo i `AGENTS.md` zespołowi, który nie pracował nad tym projektem. Daj im zadanie „dopisz test dla scenariusza X" z użyciem agenta. Jeśli wychodzi im pierwsze podejście - plik działa. Jeśli muszą pytać na Slacku - masz dziury.

## Najważniejsze wnioski

- `AGENTS.md` to operacyjne instrukcje dla agenta, nie narracja o projekcie.
- Struktura: opis, setup, komendy, konwencje, „nie rób tego", scope, PR checklist.
- Trzymaj się 1-2 stron. Dłuższy plik gubi sygnał.
- Sekcja „Do not" jest tak samo ważna jak „Do".
- Traktuj plik jak kod - aktualizuj, gdy struktura repo się zmienia.
- Mierz, czy plik działa: po trafionych komendach, powtarzalnych uwagach w review, i teście drugiego zespołu.

W kolejnym wpisie pokażę, jak dołożyć do tego MCP - zaczynając od najprostszego, ale najbardziej użytecznego przypadku w QA: search i fetch po evidence.
