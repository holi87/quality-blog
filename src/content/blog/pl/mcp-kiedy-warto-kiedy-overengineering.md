---
title: "MCP, CLI czy hook - kiedy które narzędzie, kiedy MCP to przeinżynierowanie"
description: "MCP to narzędzie, nie status. Każdy łącznik to utrzymanie, ryzyko i powierzchnia ataku. Kryteria, kiedy MCP się opłaca, kiedy lepsze jest CLI / polecenie ukośnikowe / hook, drzewo decyzyjne i ścieżka migracji CLI → MCP."
date: 2026-06-01
tags: ["ai", "mcp", "cli", "claude-code", "tooling", "skala-holaka"]
lang: pl
readingTime: 13
author: GH
---

Pisałem już o [pierwszym MCP dla QA](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/) i o [context7](/pl/blog/context7-mcp-aktualna-dokumentacja-llm/). Tamte teksty są entuzjastyczne - bo MCP zmienia sposób pracy z agentami i dla wielu zadań jest przełomem.

Ten artykuł jest kontrą do tej entuzji. Bo widzę za dużo zespołów, które dodały 15 serwerów MCP w trzy tygodnie i utknęły z chaosem nikomu niepotrzebnych łączników.

**Teza:** MCP to nie status - to narzędzie. Każdy łącznik to obciążenie utrzymaniem, ryzyko i powierzchnia ataku. Dodajesz świadomie albo płacisz długiem.

## Kiedy MCP się opłaca

Cztery warunki. Sprawdzaj każdy zanim dodasz konektor:

### 1. 3+ użycia tygodniowo

Jeśli funkcjonalność jest używana raz w miesiącu - nie MCP, tylko doraźne polecenie. Próg 3x/tydzień to mniej-więcej moment, gdy oszczędność z automatyzacji przekracza koszt utrzymania.

### 2. Powtarzalność > 80%

Akcja musi być wystarczająco regularna. *„Wyślij aktualizację do Slack #release"* - tak. *„Sprawdź co się dzieje w naszej infrastrukturze"* - nie, zbyt nieokreślone.

### 3. Manualny krok kosztuje >10 minut

Zbierz średnią z 3 ostatnich tygodni. Jeśli każde zadanie manualne kosztuje 3 minuty - nie warto MCP. Jeśli 15 minut - warto rozważyć.

### 4. Wynik wymaga śladu audytowego

Jeśli akcja musi być logowana (zgodność, bezpieczeństwo, debugowanie) - MCP daje to za darmo. Manualne kroki nie zostawiają systemowego śladu.

Wszystkie cztery? **Dodaj MCP.** Mniej niż trzy? **Nie dodawaj.**

## Kiedy MCP to przeinżynierowanie

Sygnały, że nie powinieneś:

- **Jednorazowe zadanie.** Migracja, audyt, jednorazowy raport. Skrypt + cron lepszy niż MCP.
- **Eksperymentalne.** Sprawdzasz, czy to w ogóle ma sens. Najpierw skrypt, dopiero gdy działa stabilnie → MCP.
- **Jeden użytkownik.** Nie buduj infrastruktury dla siebie samego. Własne polecenie w terminalu wystarczy.
- **Dane produkcyjne bez nadzoru.** Jeśli MCP miałby pisać do produkcyjnej bazy danych i nie masz frameworka uprawnień - nie rób tego.
- **Brak właściciela.** Jeśli nie wiesz, kto będzie utrzymywał ten MCP za pół roku - nie dodawaj.

Test prosty: *„Czy ktoś inny niż ja użyje tego MCP w ciągu najbliższego miesiąca?"* - jeśli nie, prawdopodobnie przeinżynierowanie.

## Rachunek ROI

Konkretny model. Załóżmy że rozważasz MCP do tworzenia zgłoszeń w Jirze.

**Koszt:**

- Implementacja MCP: 6 godzin (jeśli używasz oficjalnego SDK od Anthropic)
- Konfiguracja po stronie zespołu: 1 godzina × N osób
- Utrzymanie: ~2 godziny / miesiąc (aktualizacje, przypadki brzegowe, debugowanie)
- Premia za ryzyko: zależy od zakresu (błędna konfiguracja RBAC → potencjalne zagrożenie zgodności)

**Oszczędność:**

- Manualne tworzenie zgłoszenia: 4 minuty
- Liczba zgłoszeń / tydzień: 25
- = 100 minut / tydzień = ~7 godzin / miesiąc oszczędności

**Break-even:** 1 miesiąc dla zespołu 3-osobowego. Po roku: 70 godzin netto.

Ten sam rachunek dla MCP do *„sprawdź status wdrożenia"* (1 użycie / tydzień, 2 minuty manualnie):

- Oszczędność: 8 minut / miesiąc
- Koszt utrzymania: 2 godziny / miesiąc

**Break-even: nigdy.** Nie buduj.

## Bezpieczeństwo - lista kontrolna przed włączeniem

Niezależnie od ROI, każdy MCP wymaga przeglądu bezpieczeństwa. Pięć pytań:

1. **Jakie dane czyta?** Lista konkretnych zasobów (tabele, kanały, repozytoria). „Wszystko" = czerwona flaga.
2. **Jakie akcje pisze?** Tylko do odczytu vs zapis vs operacje destrukcyjne. Każdy poziom wymaga innego frameworka.
3. **Jaki jest promień rażenia przy błędnej akcji?** Maksymalny zakres szkody (1 zgłoszenie vs cała baza). Jeśli > „naprawimy w godzinę" → wymaga piaskownicy.
4. **Czy MCP ma swój własny token / poświadczenia?** Dedykowane poświadczenie na MCP, nie współdzielone z kontem użytkownika.
5. **Czy mam log audytowy każdej akcji?** Nie do CloudWatch który nikt nie czyta - do systemu który ma alert na anomalię.

Mniej niż 5 odpowiedzi „tak" → nie podłączasz do produkcji. Najpierw piaskownica.

## Antywzorzec: „mamy 15 MCP"

Widzę to często. Zespół dodał 15 łączników w dwa miesiące. Po pół roku:

- 4 są używane regularnie
- 5 jest używanych sporadycznie
- 6 jest martwych (nikt nie pamięta po co)

Każdy z tych 15 wymaga: aktualizacji wersji, łatania CVE, dokumentacji. Obciążenie utrzymaniem jest **15-krotne**, wartość - **4-krotna**.

**Wyjście:**

1. Audyt co kwartał. Dla każdego MCP: liczba wywołań / 30 dni, właściciel, czy aktywnie używany.
2. Jeśli <10 wywołań / 30 dni i brak właściciela - usuń.
3. Jeśli duplikat funkcjonalności z innym - konsoliduj.
4. Jeśli używany przez 1 osobę - zastanów się, czy to nie powinno być osobistą konfiguracją.

Cel: <8 MCP na zespół, każdy z właścicielem, każdy z metryką użycia.

## Drzewo decyzyjne - przed dodaniem MCP

Przejdź przez nie, zanim klikniesz „instaluj":

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

Próba zwrócenia uwagi: nie każdy MCP musi być wielkim projektem. „Mały MCP" - jedno narzędzie, jeden punkt końcowy, jeden konkretny przypadek użycia - zwykle:

- 200 linii kodu
- 1 właściciel
- 1 typ akcji
- log audytowy na wywołanie

To **lepszy wzór** niż „mamy uniwersalny MCP do wszystkiego". Ten ostatni szybko staje się odpowiedzialny za wszystko i niczego.

## Zanim sięgniesz po MCP - rozważ CLI

MCP to nie jedyna ścieżka. W połowie przypadków, w których zespoły dodają łącznik, **polecenie ukośnikowe albo skrypt CLI** wykonują tę samą pracę za ułamek kosztu utrzymania.

Konkretnie chodzi o trzy formy:

- **Polecenia ukośnikowe w Claude Code / Codex / Cursor** - plik markdown z instrukcją, wywoływany `/nazwa`. Zero infrastruktury, dystrybucja przez repo (`.claude/commands/`).
- **Nakładki CLI w narzędziu Bash** - `gh`, `jira-cli`, `slack-cli`, `curl + jq`, `aws`, `kubectl`, własny skrypt w `~/.local/bin/`. Agent woła komendę przez Bash, my widzimy ją w historii powłoki.
- **Skrypty Python / Node** - `scripts/release-notes.py`, `scripts/jira-triage.ts`. Stałe w repo, wersjonowane, testowalne.

### Kiedy CLI bije MCP

- **Pojedynczy użytkownik.** Nie ma sensu stawiać serwera dla siebie. `~/.local/bin/jira-create` + alias robi to samo.
- **Eksperyment.** Sprawdzasz, czy automatyzacja w ogóle ma sens. Skrypt → tydzień użycia → decyzja. MCP wymusza konfigurację, której nie chcesz wyrzucać.
- **Audyt tylko do odczytu / jednorazowy.** „Wyciągnij listę PR-ów z ostatniego tygodnia" - `gh pr list --json ...` + `jq`. Nie dorabiaj do tego serwera.
- **Działa wszędzie.** CLI uruchomisz w Claude Code, Codex, Cursor, surowym terminalu, w CI, na cudzym laptopie. MCP wymaga konfiguracji na klienta.
- **Niski promień rażenia.** Skrypt z `--dry-run` i jasnym zakresem (jeden użytkownik, jedna komenda) ma mniejszą powierzchnię ataku niż serwer MCP nasłuchujący stale.
- **Audyt za darmo.** Historia powłoki + `script` + centralny `~/.zsh_history` na kopii zapasowej. Albo logowanie w samym skrypcie. Nie potrzebujesz CloudWatcha.

### Kiedy CLI jest gorsze niż MCP

- **Wielu użytkowników, ten sam przepływ pracy.** Każdy musi sam zainstalować skrypt, ustawić poświadczenia, śledzić wersję. MCP rozwiązuje to centralnie.
- **Akcje z zapisem do produkcji + zgodność.** Audyt przez historię powłoki nie wystarczy - trzeba centralnego logu z atrybucją.
- **Wymuszone zachowanie agenta.** Jeśli agent ma ZAWSZE używać tej funkcji w określony sposób - MCP wpisany do listy dozwolonych bije skrypt, który agent może zignorować.
- **Złożone schematy danych.** Jeśli narzędzie zwraca strukturyzowaną odpowiedź, którą agent ma dalej parsować - MCP z schematem wygrywa nad surowym JSON-em z `curl`.

### Konkretne pary CLI ↔ MCP

| Przypadek użycia | CLI / skrypt | MCP - kiedy |
|---|---|---|
| Tworzenie zgłoszeń Jira | `jira create -p PROJ -t Bug --summary "..."` | gdy 3+ osoby, zapis + audyt |
| Wysyłka do Slack | `curl -X POST webhook ... \| jq` | gdy potrzebne kontrolowane kanały + DLP |
| Status wdrożenia | `gh run list --workflow=deploy.yml --limit=5` | rzadko - tylko do odczytu, niskie ROI |
| Wyszukiwanie dokumentacji | `rg`, `grep`, `context7` (sam jest MCP) | dla zewnętrznych baz wiedzy z uwierzytelnianiem |
| Generowanie informacji o wydaniu | `scripts/release-notes.py` | gdy ma czytać z 5+ źródeł z różnym uwierzytelnianiem |
| Recenzja PR | `gh pr view 123 --json ...` | gdy polityka dla całego zespołu z guardrailami |

**Heurystyka:** zacznij od CLI. Migruj do MCP, gdy spełnione kryteria z sekcji „Migracja".

## Kompromis: CLI vs MCP vs Hook

Każdy ma inny cel. Trzymanie ich osobno upraszcza decyzje.

| Wymiar | CLI / skrypt / polecenie ukośnikowe | serwer MCP | Hook |
|---|---|---|---|
| Wywołuje | agent (przez Bash) lub użytkownik | agent (narzędzie z listy dozwolonych) | runtime (auto, przed/po akcji) |
| Inicjatywa | model decyduje, kiedy odpalić | model decyduje, kiedy odpalić | wymuszone - agent nie pomija |
| Audyt | historia powłoki / log skryptu | strukturyzowany log na wywołanie | wbudowany w runtime |
| Zakres | na użytkownika, na repo, na maszynę | na zespół / organizację, scentralizowany | na sesję / na akcję |
| Konfiguracja | 5 min - plik w repo | 2-6h - serwer, wdrożenie, uwierzytelnianie | godzina - konfiguracja |
| Utrzymanie | minimalny, edytujesz plik | regularny - wersje, CVE, uwierzytelnianie | minimalny, ale wymaga testów |
| Promień rażenia | ograniczony zakresem skryptu | zależny od uprawnień; jeśli źle skonfigurowany - duży | mały - hook nie ma własnego stanu |
| Dystrybucja | git, brew, npm | rejestr MCP, dokumentacja, wdrożenie nowej osoby | repo, `.claude/settings.json` |
| Idealne dla | osobistych przepływów pracy, prototypów, audytów, zadań jednorazowych | akcji zapisu dla całego zespołu z nadzorem | wymuszanie polityk: testy, linty, blokady, audyt |
| Antyzastosowanie | wymuszone zachowanie agenta na wielu osobach | osobista automatyzacja jednego użytkownika | autonomia (hook nie zastępuje agentowego przepływu pracy) |

W praktyce **wszystkie trzy współistnieją w dojrzałej konfiguracji**. CLI dla 80% osobistej pracy. MCP dla zapisu dla całego zespołu z audytem. Hooks dla deterministycznych guardraili wokół tego wszystkiego.

## Migracja CLI → MCP - kiedy promować

Skrypt zaczyna być MCP-kandydatem, gdy spełnia 3+ z poniższych:

1. **3+ użytkowników regularnie.** Każdy ma własną kopię. Wersje się rozjeżdżają. Wdrożenie nowej osoby = pół dnia.
2. **Zapis ze zgodnością.** Akcja zmienia stan w produkcyjnym / klienckim / regulowanym systemie i audyt po fakcie nie wystarcza.
3. **Centralny audyt wymagany.** Historia powłoki na laptop nie wystarcza - bezpieczeństwo, SOC2, ISO chcą jednego punktu logowania.
4. **Stabilny kontrakt.** Schemat wejścia / wyjścia nie zmienia się co tydzień. MCP nie jest dobrym miejscem na eksperyment z API.
5. **Lista dozwolonych w polityce zespołu.** Chcesz wymusić, że agent używa TEGO narzędzia, nie improwizuje własnego.
6. **Użycie międzynarzędziowe.** Ten sam przepływ pracy ma działać w Claude Code, Codex, Cursor, Open WebUI. MCP daje jedną implementację, kilka konsumentów.

Jeśli spełnione 0-2 punkty - zostań przy CLI. Jeśli 3+ - pisz MCP.

**Migracja krokowa:**

1. Stabilizujesz skrypt CLI (test, README, semver).
2. Identyfikujesz `tools` w MCP: każda komenda CLI = jedno narzędzie, z jasnym schematem wejścia.
3. Nakładka MCP wywołuje pod spodem ten sam CLI. Logika nie duplikuje się.
4. Przez pierwszy miesiąc oba istnieją równolegle. Monitorujesz użycie.
5. Wyłączasz CLI w konfiguracji zespołu, zostawiasz na lokalnym laptopie właściciela.

Antywzorzec: **MCP zamiast CLI**, gdy nikt z zespołu poza tobą tego nie używa. To kosztuje 4× więcej i daje 0× więcej wartości.

## Co dalej

Jeśli rozważasz pierwszy MCP - zacznij od [pierwszego MCP dla QA: search/fetch po evidence](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/). Najprostsza para narzędzi z właścicielem i logiem audytowym.

Jeśli masz już kilka MCP i nie wiesz, które warto trzymać - zrób audyt z drzewa decyzyjnego. Trzymaj te, które przechodzą wszystkie 6 kroków.

Jeśli twój zespół chwali się *„mamy 15 MCP"* - to znak utykania na poziomie 7-8 z antywzorcem [przerost skilli / MCP na wszystko](/pl/blog/antipaterny-adopcji-ai/). Liczba narzędzi to nie miara dojrzałości. Liczba dobrze wybranych i utrzymanych - tak.
