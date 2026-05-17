---
title: "MCP i konektory — kiedy warto, kiedy to overengineering"
description: "MCP to narzędzie, nie status. Każdy konektor to maintenance, ryzyko i powierzchnia ataku. Kryteria, kiedy MCP się opłaca, kiedy to lepsze niż integracja w kodzie, i drzewo decyzyjne przed dodaniem."
date: 2026-06-01
tags: ["ai", "mcp", "claude-code", "tooling", "skala-holaka"]
lang: pl
readingTime: 8
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

## Co dalej

Jeśli rozważasz pierwszy MCP — zacznij od [pierwszego MCP dla QA: search/fetch po evidence](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/). Najprostsza para tooli z owner'em i audit logiem.

Jeśli masz już kilka MCP i nie wiesz, które warto trzymać — zrób audit z drzewa decyzyjnego. Trzymaj te, które przechodzą wszystkie 6 kroków.

Jeśli twój zespół chwali się *„mamy 15 MCP"* — to znak utykania na poziomie 7–8 z anti-patternem [skill-bloat / MCP-everything](/pl/blog/antipaterny-adopcji-ai/). Liczba narzędzi to nie miara dojrzałości. Liczba dobrze wybranych i utrzymanych — tak.
