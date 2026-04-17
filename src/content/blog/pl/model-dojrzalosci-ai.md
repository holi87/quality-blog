---
title: "Model dojrzałości adopcji AI"
description: "Od oporu do orkiestracji — 11 poziomów wykorzystania AI w organizacji. Sprawdź, na którym etapie jesteś Ty i Twój zespół."
date: 2026-04-15
tags: ["ai", "adopcja", "zespoly"]
lang: pl
readingTime: 7
---

Od oporu do orkiestracji — 11 poziomów wykorzystania AI w organizacji. Sprawdź, na którym etapie jesteś Ty i Twój zespół.

## Mapa poziomów

| Faza | Poziom | Nazwa | Jednym zdaniem |
|------|--------|-------|----------------|
| Start | 0 | Opór | Brak kontaktu z AI |
| Start | 1 | Podstawowy czat | Pytanie → odpowiedź |
| Świadome użycie | 2 | Świadome promptowanie | Jakość inputu = jakość outputu |
| Świadome użycie | 3 | Frameworki | CRISP, CoT, few-shot |
| Świadome użycie | 4 | Instrukcje niestandardowe | Custom instructions, system prompts |
| Kontekst i wiedza | 5 | Pliki kontekstowe | README, AGENTS.md, claude.md |
| Kontekst i wiedza | 6 | Zaawansowane instrukcje | Reguły zachowań i granic |
| Kontekst i wiedza | 7 | Skille i bazy wiedzy | Wiedza domenowa + umiejętności |
| Kontekst i wiedza | 8 | Narzędzia i MCP | Integracja z systemami |
| Autonomia | 9 | Agentowy workflow | Cel → autonomiczna realizacja |
| Autonomia | 10 | Orkiestracja | Zespół agentów + koordynator |

## Faza 0–1: Start

### Poziom 0 — Opór / brak adopcji

**Brak kontaktu z narzędziami AI.**

Użytkownik nie korzysta z AI — z powodu braku wiedzy, obaw lub świadomej decyzji. Często towarzyszy temu lęk przed utratą pracy lub nieufność wobec technologii. To naturalny punkt startowy — kluczowa jest edukacja i budowanie zaufania, nie wymuszanie.

### Poziom 1 — Podstawowy czat

**Pytanie → odpowiedź.**

Pierwsza interakcja z AI w formie prostego Q&A. Użytkownik traktuje model jak wyszukiwarkę — wpisuje pytanie, dostaje odpowiedź. Wartość jest już realna, ale potencjał wykorzystany minimalnie.

> Nawet eksperci wracają tutaj — i to jest OK. Prosty czat to nie wstyd, to narzędzie.

**Co wyróżnia tę fazę:**

- Pierwszy kontakt z technologią — od zera do „o, to działa".
- Kluczowa bariera to **emocje**, nie umiejętności.
- Sukces = przełamanie oporu i pierwsze pozytywne doświadczenie.

## Faza 2–4: Świadome użycie

### Poziom 2 — Świadome promptowanie

**Jakość inputu wpływa na jakość outputu.**

Użytkownik zauważa, że sposób sformułowania zapytania ma znaczenie. Pojawia się nadawanie roli („jesteś QA, napisz testy"), kontekstu i oczekiwań. To przełomowy moment — świadomość, że AI to narzędzie, które trzeba dobrze instruować.

### Poziom 3 — Frameworki i prompt engineering

**Systematyczne podejście do promptowania.**

Zastosowanie sprawdzonych frameworków (np. CRISP, chain-of-thought, few-shot learning). Ustrukturyzowane szablony promptów, powtarzalne procesy.

> Tu zatrzymuje się większość organizacji wdrażających AI. Frameworki dają świetne wyniki — ale to dopiero początek drogi.

### Poziom 4 — Instrukcje niestandardowe

**Personalizacja i oszczędność tokenów.**

Custom instructions, system prompts, ustawienia per-projekt. Użytkownik nie powtarza za każdym razem tych samych instrukcji — model „wie" kim jest, jak ma pisać, czego unikać. Początek świadomego zarządzania kontekstem i optymalizacji kosztów.

**Co wyróżnia tę fazę:**

- Przejście od „klikam i patrzę" do **świadomego sterowania** modelem.
- Kluczowa bariera to **wiedza** — trzeba poznać techniki promptowania.
- Sukces = powtarzalne, wysokiej jakości wyniki z AI.

## Faza 5–8: Kontekst i wiedza

### Poziom 5 — Pliki kontekstowe

**README, AGENTS.md, claude.md — kontekst per-projekt.**

Agenci AI otrzymują pliki opisujące projekt: co budujemy, jaka jest struktura, jakie konwencje obowiązują. Uruchamiasz agenta w danym katalogu i on już wie, co robić. Oddzielenie wiedzy od promptu — kontekst żyje przy projekcie, nie w głowie użytkownika.

### Poziom 6 — Zaawansowane instrukcje agentów

**Definicja zachowań, reguł i granic działania.**

Nie tylko „co robić", ale „jak się zachowywać". Agent ma zdefiniowane zasady: kiedy pytać, kiedy działać autonomicznie, jak raportować, czego nie robić. To różnica między prostym README a pełną specyfikacją roli — jak onboarding nowego członka zespołu.

### Poziom 7 — Skille i bazy wiedzy

**Wyspecjalizowane umiejętności i wiedza domenowa.**

Agent ma dostęp do dedykowanych umiejętności (np. generowanie raportów w określonym formacie) i baz wiedzy (dokumentacja, standardy firmy, dane historyczne). Nie wymyślamy koła na nowo przy każdej sesji — wiedza jest zorganizowana i dostępna.

### Poziom 8 — Narzędzia, MCP i konektory

**Integracja z zewnętrznymi systemami.**

Agent nie tylko „pisze" — korzysta z narzędzi: przeszukuje Slacka, tworzy zadania w Jira, czyta maile, odpytuje API. MCP (Model Context Protocol) i konektory pozwalają na interakcję ze światem zewnętrznym. To skok od „asystenta w czacie" do „członka zespołu z dostępem do systemów".

**Co wyróżnia tę fazę:**

- Przejście od jednorazowych promptów do **trwałej wiedzy** przy projekcie.
- Kluczowa bariera to **architektura** — jak zorganizować kontekst, skille i narzędzia.
- Sukces = agent, który rozumie projekt bez powtarzania instrukcji.

## Faza 9–10: Autonomia

### Poziom 9 — Agentowy workflow

**Cel → autonomiczne planowanie i realizacja.**

Agent otrzymuje cel wysokopoziomowy i sam planuje kroki do jego realizacji. „Przygotuj release notes na podstawie ostatnich commitów" — i agent sam sprawdza repo, analizuje zmiany, pisze notatki.

> Paradoks: użytkownik wraca do „prostego pytania" z poziomu 1 — ale cała machina pod spodem jest zupełnie inna.

### Poziom 10 — Orkiestracja wieloagentowa

**Zespół agentów z koordynatorem.**

Wielu agentów, każdy ze swoją specjalizacją: jeden analizuje, drugi koduje, trzeci robi review, czwarty pisze testy. Orkiestrator koordynuje ich pracę, zarządza kolejnością i rozwiązuje konflikty. To model pracy zespołowej — ale z agentami AI jako członkami zespołu.

**Co wyróżnia tę fazę:**

- Przejście od „ja używam AI" do **„AI pracuje jako zespół"**.
- Kluczowa bariera to **zaufanie** — oddanie kontroli wymaga dojrzałości.
- Sukces = autonomiczny system agentów realizujący złożone cele.

---

*Opracowanie: Grzegorz Holak — AI Ambassador, SCIB. Pierwotna publikacja: [holak.net.pl](https://holak.net.pl).*
