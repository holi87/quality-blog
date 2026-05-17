---
title: "MCP, CLI czy hook — kiedy który tool, kiedy MCP to overengineering"
description: "MCP to narzędzie, nie status. Każdy konektor to maintenance, ryzyko i powierzchnia ataku. Kryteria, kiedy MCP się opłaca, kiedy lepsze jest CLI / slash command / hook, drzewo decyzyjne i ścieżka migracji CLI → MCP."
date: 2026-06-01
tags: ["ai", "mcp", "cli", "claude-code", "tooling", "skala-holaka"]
lang: pl
readingTime: 13
author: GH
---

Pisałem już o [pierwszym MCP dla QA](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/) i o [context7](/pl/blog/context7-mcp-aktualna-dokumentacja-llm/). Tamte teksty są entuzjastyczne — bo MCP zmienia sposób pracy z agentami i dla wielu zadań jest game-changer.

Ten artykuł jest kontrą do tej entuzji. Bo widzę za dużo zespołów, które dodały 15 MCP serverów w trzy tygodnie i utknęły z chaosem nikomu niepotrzebnych konektorów.

**Teza:** MCP to nie status — to tool. Każdy konektor to maintenance burden, ryzyko i powierzchnia ataku. Dodajesz świadomie albo płacisz długiem.

## Kiedy MCP się opłaca

Cztery warunki. Sprawdzaj każdy zanim dodasz konektor:

### 1. 3+ użycia tygodniowo

Jeśli funkcjonalność jest używana raz w miesiącu — nie MCP, tylko ad-hoc command. Próg 3x/tydzień to mniej-więcej moment, gdy oszczędność z automatyzacji przekracza koszt utrzymania.

### 2. Powtarzalność > 80%

Akcja musi być wystarczająco regularna. *„Wyślij update do Slack #release"* — tak. *„Sprawdź co się dzieje w naszej infrastrukturze"* — nie, zbyt nieokreślone.

### 3. Manualny krok kosztuje >10 minut

Zbierz średnią z 3 ostatnich tygodni. Jeśli każde zadanie manualne kosztuje 3 minuty — nie warto MCP. Jeśli 15 minut — warto rozważyć.

### 4. Wynik wymaga audit trailu

Jeśli akcja musi być logowana (compliance, security, debugging) — MCP daje to za darmo. Manualne kroki nie zostawiają systemowego śladu.

Wszystkie cztery? **Dodaj MCP.** Mniej niż trzy? **Nie dodawaj.**

## Kiedy MCP to overengineering

Sygnały, że nie powinieneś:

- **Jednorazowe zadanie.** Migracja, audit, jednorazowy raport. Skrypt + cron lepszy niż MCP.
- **Eksperymentalne.** Sprawdzasz, czy to w ogóle ma sens. Najpierw script, dopiero gdy działa stabilnie → MCP.
- **Jeden user.** Nie buduj infrastruktury dla siebie samego. Custom command w terminalu wystarczy.
- **Dane produkcyjne bez governance.** Jeśli MCP miałby pisać do prod DB i nie masz frameworka uprawnień — nie rób tego.
- **Brak ownership.** Jeśli nie wiesz, kto będzie utrzymywał ten MCP za pół roku — nie dodawaj.

Test prosty: *„Czy ktoś inny niż ja użyje tego MCP w ciągu najbliższego miesiąca?"* — jeśli nie, prawdopodobnie overengineering.

## Rachunek ROI

Konkretny model. Załóżmy że rozważasz MCP do tworzenia ticketów w Jirze.

**Koszt:**

- Implementacja MCP: 6 godzin (jeśli używasz oficjalnego SDK od Anthropic)
- Setup po stronie zespołu: 1 godzina × N osób
- Maintenance: ~2 godziny / miesiąc (aktualizacje, edge case'y, debug)
- Risk premium: zależy od scope'a (RBAC misconfiguration → potencjalne zagrożenie compliance)

**Oszczędność:**

- Manualne tworzenie ticketu: 4 minuty
- Liczba ticketów / tydzień: 25
- = 100 minut / tydzień = ~7 godzin / miesiąc oszczędności

**Break-even:** 1 miesiąc dla zespołu 3-osobowego. Po roku: 70 godzin netto.

Ten sam rachunek dla MCP do *„sprawdź status deploymentu"* (1 użycie / tydzień, 2 minuty manualnie):

- Oszczędność: 8 minut / miesiąc
- Koszt utrzymania: 2 godziny / miesiąc

**Break-even: nigdy.** Nie buduj.

## Bezpieczeństwo — checklist przed włączeniem

Niezależnie od ROI, każdy MCP wymaga przeglądu bezpieczeństwa. Pięć pytań:

1. **Jakie dane czyta?** Lista konkretnych zasobów (tabele, kanały, repozytoria). „Wszystko" = czerwona flaga.
2. **Jakie akcje pisze?** Tylko-czytanie vs zapis vs operacje destrukcyjne. Każdy poziom wymaga innego frameworka.
3. **Jaki jest blast radius przy błędnej akcji?** Maksymalny scope szkody (1 ticket vs cała baza). Jeśli > „naprawimy w godzinę" → wymaga sandboxa.
4. **Czy MCP ma swój własny token / credentials?** Dedicated credential per MCP, nie współdzielony z user accountem.
5. **Czy mam audit log każdej akcji?** Nie do CloudWatch który nikt nie czyta — do systemu który ma alert na anomalię.

Mniej niż 5 odpowiedzi „tak" → nie podłączasz do prod. Sandbox first.

## Anti-pattern: „mamy 15 MCP"

Widzę to często. Zespół dodał 15 konektorów w dwa miesiące. Po pół roku:

- 4 są używane regularnie
- 5 jest używanych sporadycznie
- 6 jest martwych (nikt nie pamięta po co)

Każdy z tych 15 wymaga: aktualizacji wersji, łatania CVE, dokumentacji. Maintenance burden jest **15-krotny**, wartość — **4-krotna**.

**Wyjście:**

1. Audit co kwartał. Dla każdego MCP: liczba wywołań / 30 dni, owner, czy aktywnie używany.
2. Jeśli <10 wywołań / 30 dni i brak właściciela — usuń.
3. Jeśli duplikat funkcjonalności z innym — konsoliduj.
4. Jeśli używany przez 1 osobę — zastanów się, czy to nie powinno być personal config.

Cel: <8 MCP per zespół, każdy z owner'em, każdy z metryką użycia.

## Drzewo decyzyjne — przed dodaniem MCP

Przejdź przez nie, zanim klikniesz „install":

```
1. Czy używam tej funkcjonalności 3x/tydzień?
   nie → STOP, nie dodawaj
   tak → idź dalej

2. Czy manualnie zajmuje mi to >10 minut?
   nie → STOP, MCP się nie opłaci
   tak → idź dalej

3. Czy mam owner'a (imię, nazwisko)?
   nie → STOP, znajdź najpierw owner'a
   tak → idź dalej

4. Czy dla scope (czytane dane, pisane akcje) mam framework uprawnień?
   nie → STOP, zbuduj framework najpierw
   tak → idź dalej

5. Czy istnieje już MCP, który robi ~80% tego co potrzebuję?
   nie → zbuduj nowy
   tak → użyj istniejącego (nawet jeśli „nie idealny")

6. Czy mogę zacząć od read-only?
   tak → ZACZNIJ READ-ONLY, write w fazie 2
   nie → projekt z write-from-day-one wymaga sandbox testów
```

## Co to jest „mały MCP"

Próba zwrócenia uwagi: nie każdy MCP musi być wielkim projektem. „Mały MCP" — jeden tool, jeden endpoint, jeden konkretny use case — zwykle:

- 200 linii kodu
- 1 owner
- 1 typ akcji
- audit log per call

To **lepszy wzór** niż „mamy general-purpose MCP do wszystkiego". Ten ostatni szybko staje się odpowiedzialny za wszystko i niczego.

## Zanim sięgniesz po MCP — rozważ CLI

MCP to nie jedyna ścieżka. W połowie przypadków, w których zespoły dodają konektor, **slash command albo skrypt CLI** wykonują tę samą pracę za ułamek kosztu utrzymania.

Konkretnie chodzi o trzy formy:

- **Slash commands w Claude Code / Codex / Cursor** — plik markdown z instrukcją, wywoływany `/nazwa`. Zero infrastruktury, dystrybucja przez repo (`.claude/commands/`).
- **CLI wrappery w Bash toolu** — `gh`, `jira-cli`, `slack-cli`, `curl + jq`, `aws`, `kubectl`, własny skrypt w `~/.local/bin/`. Agent woła komendę przez Bash, my widzimy ją w shell history.
- **Skrypty Python / Node** — `scripts/release-notes.py`, `scripts/jira-triage.ts`. Stałe w repo, wersjonowane, testowalne.

### Kiedy CLI bije MCP

- **Pojedynczy user.** Nie ma sensu stawiać serwera dla siebie. `~/.local/bin/jira-create` + alias robi to samo.
- **Eksperyment.** Sprawdzasz, czy automatyzacja w ogóle ma sens. Skrypt → tydzień użycia → decyzja. MCP wymusza setup, którego nie chcesz wyrzucać.
- **Read-only audit / one-shot.** „Wyciągnij listę PR-ów z ostatniego tygodnia" — `gh pr list --json ...` + `jq`. Nie dorabiaj do tego serwera.
- **Działa wszędzie.** CLI uruchomisz w Claude Code, Codex, Cursor, vanilla terminalu, w CI, na cudzym laptopie. MCP wymaga konfiguracji per-klient.
- **Niski blast radius.** Skrypt z `--dry-run` i jasnym scope (jeden user, jedna komenda) ma mniejszą powierzchnię ataku niż serwer MCP nasłuchujący stale.
- **Audit za darmo.** Shell history + `script` + centralny `~/.zsh_history` na backupie. Albo logowanie w samym skrypcie. Nie potrzebujesz CloudWatcha.

### Kiedy CLI jest gorsze niż MCP

- **Wielu użytkowników, ten sam workflow.** Każdy musi sam zainstalować skrypt, ustawić credentials, śledzić wersję. MCP rozwiązuje to centralnie.
- **Akcje z write do prod + compliance.** Audit przez shell history nie wystarczy — trzeba centralnego logu z atrybucją.
- **Wymuszone zachowanie agenta.** Jeśli agent ma ZAWSZE używać tej funkcji w określony sposób — MCP wpisany do allowlisty bije skrypt, który agent może zignorować.
- **Złożone schematy danych.** Jeśli tool zwraca strukturyzowaną odpowiedź, którą agent ma dalej parsować — MCP z schematem wygrywa nad surowym JSON-em z `curl`.

### Konkretne pary CLI ↔ MCP

| Use case | CLI / script | MCP — kiedy |
|---|---|---|
| Tworzenie ticketów Jira | `jira create -p PROJ -t Bug --summary "..."` | gdy 3+ osoby, write + audit |
| Wysyłka do Slack | `curl -X POST webhook ... \| jq` | gdy potrzebne kontrolowane channele + DLP |
| Status deploya | `gh run list --workflow=deploy.yml --limit=5` | rzadko — read-only, niskie ROI |
| Search dokumentacji | `rg`, `grep`, `context7` (sam jest MCP) | dla zewnętrznych baz wiedzy z auth |
| Generowanie release notes | `scripts/release-notes.py` | gdy ma czytać z 5+ źródeł z różnym auth |
| PR review | `gh pr view 123 --json ...` | gdy team-wide policy z guardrailami |

**Heurystyka:** zacznij od CLI. Migruj do MCP, gdy spełnione kryteria z sekcji „Migracja".

## Trade-off: CLI vs MCP vs Hook

Każdy ma inny target. Trzymanie ich osobno upraszcza decyzje.

| Wymiar | CLI / skrypt / slash command | MCP server | Hook |
|---|---|---|---|
| Wywołuje | agent (przez Bash) lub user | agent (allowlist tool) | runtime (auto, przed/po akcji) |
| Inicjatywa | model decyduje, kiedy odpalić | model decyduje, kiedy odpalić | wymuszone — agent nie pomija |
| Audit | shell history / log skryptu | strukturyzowany log per call | wbudowany w runtime |
| Scope | per user, per repo, per box | per zespół / org, scentralizowany | per sesja / per akcja |
| Setup | 5 min — plik w repo | 2–6h — serwer, deploy, auth | godzina — config |
| Maintenance | minimalny, edytujesz plik | regularny — wersje, CVE, auth | minimalny, ale wymaga testów |
| Blast radius | ograniczony scopem skryptu | zależny od permissions; jeśli źle skonfigurowany — duży | mały — hook nie ma własnego state'u |
| Dystrybucja | git, brew, npm | rejestr MCP, dokumentacja, onboarding | repo, `.claude/settings.json` |
| Idealne dla | osobistych workflows, prototypów, audytów, one-shot | team-wide write actions z governance | wymuszanie polityk: testy, linty, blokady, audit |
| Anti-use | wymuszone zachowanie agenta na wielu osobach | personal automation jednego usera | autonomia (hook nie zastępuje agentic workflow) |

W praktyce **wszystkie trzy współistnieją w dojrzałym setupie**. CLI dla 80% personalnej pracy. MCP dla team-wide write z audytem. Hooks dla deterministycznych guardraili wokół tego wszystkiego.

## Migracja CLI → MCP — kiedy promować

Skrypt zaczyna być MCP-kandydatem, gdy spełnia 3+ z poniższych:

1. **3+ użytkowników regularnie.** Każdy ma własną kopię. Wersje się rozjeżdżają. Onboarding nowego = pół dnia.
2. **Write z compliance.** Akcja zmienia stan w prod / klienckim / regulowanym systemie i audyt po fakcie nie wystarcza.
3. **Centralny audit wymagany.** Shell history per laptop nie wystarcza — bezpieczeństwo, SOC2, ISO chcą jednego punktu logowania.
4. **Stabilny kontrakt.** Schemat wejścia / wyjścia nie zmienia się co tydzień. MCP nie jest dobrym miejscem na eksperyment z API.
5. **Allowlist w polityce zespołu.** Chcesz wymusić, że agent używa TEGO toola, nie improwizuje własnego.
6. **Cross-toolingowe użycie.** Ten sam workflow ma działać w Claude Code, Codex, Cursor, Open WebUI. MCP daje jedną implementację, kilka konsumentów.

Jeśli spełnione 0–2 punkty — zostań przy CLI. Jeśli 3+ — pisz MCP.

**Migracja krokowa:**

1. Stabilizujesz skrypt CLI (test, README, semver).
2. Identyfikujesz `tools` w MCP: każda komenda CLI = jeden tool, z jasnym input schema.
3. Wrapper MCP wywołuje pod spodem ten sam CLI. Logika nie duplikuje się.
4. Przez pierwszy miesiąc oba istnieją równolegle. Monitorujesz użycie.
5. Wyłączasz CLI w team-config, zostawiasz na lokalnym laptopie ownera.

Antypattern: **MCP zamiast CLI**, gdy nikt z zespołu poza tobą tego nie używa. To kosztuje 4× więcej i daje 0× więcej wartości.

## Co dalej

Jeśli rozważasz pierwszy MCP — zacznij od [pierwszego MCP dla QA: search/fetch po evidence](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/). Najprostsza para tooli z owner'em i audit logiem.

Jeśli masz już kilka MCP i nie wiesz, które warto trzymać — zrób audit z drzewa decyzyjnego. Trzymaj te, które przechodzą wszystkie 6 kroków.

Jeśli twój zespół chwali się *„mamy 15 MCP"* — to znak utykania na poziomie 7–8 z anti-patternem [skill-bloat / MCP-everything](/pl/blog/antipaterny-adopcji-ai/). Liczba narzędzi to nie miara dojrzałości. Liczba dobrze wybranych i utrzymanych — tak.
