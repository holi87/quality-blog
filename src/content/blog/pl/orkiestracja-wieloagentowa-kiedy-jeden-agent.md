---
title: "Orkiestracja wieloagentowa - kiedy jeden agent wystarczy"
description: "Poziom 10 w skali Holaka jest atrakcyjny dla CV, drogi w utrzymaniu. Sceptyczny take na zespoły agentów: kiedy realnie potrzebujesz wielu, kiedy jeden dobrze skonfigurowany wygrywa, i jak rozpoznać orkiestrację miernoty."
date: 2026-06-03
tags: ["ai", "agenty", "claude-code", "skala-holaka", "orkiestracja"]
lang: pl
readingTime: 8
author: GH
---

W [Skali Holaka](/pl/blog/skala-holaka/) poziom 10 to *„orkiestracja wieloagentowa - zespół agentów z koordynatorem"*. Brzmi sexy. Wygląda dobrze w deckach. Pasuje do CV.

I jest poziomem, na który większość zespołów wchodzi za wcześnie - i ponosi koszty bez korzyści.

Ten artykuł jest sceptycznym take na poziom 10. Bo wierzę w orkiestrację - ale tylko wtedy, gdy alternatywa (jeden dobry agent) realnie nie wystarcza.

## Czemu wszyscy chcą zespół agentów

Cztery powody, w kolejności od najczęstszego:

1. **Signal / status.** *„Mamy multi-agent setup"* brzmi lepiej niż *„mamy jednego agenta"*. CV, prezentacje, networking.
2. **Hype.** Każdy framework chwali się demo z 5 agentami współpracującymi. AutoGPT, BabyAGI, CrewAI, LangGraph, Autogen - wszystkie ciągną w tę stronę.
3. **Framework marketing.** Wiele tooli sprzedaje się jako *„zaprojektowane do multi-agent"*. Sprzedawcy mówią o tym co umieją, nie co warto.
4. **Realna potrzeba.** Najmniej liczna kategoria. Istnieje, ale jest mniejsza niż pierwsze trzy.

Jeśli ty (lub twój zespół) trafiacie do 1, 2, 3 - pomyślcie zanim zaczniecie.

## Co naprawdę kosztuje multi-agent

Lista, którą widzę w każdym multi-agent setupie po pół roku:

### Koszt projektowy

Nie wystarczy *„napiszemy agentów"*. Musisz zaprojektować:

- protokół komunikacji (co agent A mówi do agenta B i w jakim formacie)
- handoff state (jak przekazujesz kontekst między krokami bez utraty)
- konflikty (co gdy agent A i agent B nie zgadzają się)
- timeouts (co gdy któryś nie odpowiada)
- failure mode (co gdy któryś halucynuje - czy reszta to wychwyci?)

Każda z tych decyzji to godziny projektowania. Dla jednego agenta - żadna z nich nie istnieje.

### Koszt utrzymania

Zmiana w jednym agencie = potrzeba sprawdzenia, czy nie psuje protokołu z innymi. Update modelu (Claude 4.7 → 4.8) = retest całej orkiestracji.

Realna obserwacja: zespół z 5 agentami spędza **70% czasu utrzymania na interakcjach**, a tylko 30% na pojedynczych agentach.

### Koszt tokenów

Każdy handoff = przekazanie kontekstu. Każdy agent ma swój system prompt. Każda runda dyskusji = N × tokeny.

Liczbowo: pojedynczy agent rozwiązujący zadanie = 5–10K tokenów. Pięcioagentowa orkiestracja tego samego zadania = 40–80K tokenów. Czyli **8x koszt** za marginalnie lepszy wynik (zwykle 10–20%, czasem gorszy).

### Koszt debugowania

Gdy coś idzie źle:

- jeden agent: czytasz transcript, wiesz gdzie błąd
- pięciu agentów: musisz zrekonstruować całą rozmowę, śledzić handoff'y, sprawdzić, kto kogo przekonał

Sesja debug'u rośnie z 15 minut do 2 godzin.

## Kiedy jeden agent wystarczy (większość przypadków)

Jeśli zadanie spełnia te warunki, jeden agent z dobrym kontekstem wygrywa:

- **Jasno definiowalny output.** Wiesz, co ma powstać (kod, raport, ticket, mail).
- **Jeden kontekst.** Wszystko, co potrzebne do decyzji, mieści się w jednej sesji.
- **Brak handoffu.** Nie potrzebujesz przekazywania stanu między fazami.
- **Jedna domena uprawnień.** Agent działa w jednym scope (jeden repo, jeden system, jedna baza).

Konkretne przykłady:

- **Code review** - jeden agent czyta PR, wystawia komentarze. Multi-agent (jeden czyta, drugi pisze, trzeci review) wnosi 5% wartości za 4x koszt.
- **Generowanie release notes** - jeden agent czyta commity, pisze draft. Multi-agent jest overkill.
- **Refactor jednego modułu** - jeden agent w trybie agentic. Wieloagentowe podejście opóźnia o godziny.
- **Triagе ticketów** - jeden agent z dobrym CLAUDE.md klasyfikuje 95% przypadków.

## Kiedy realnie potrzebujesz wielu (mały zbiór)

Cztery sytuacje, w których multi-agent jest **faktycznie lepszy** niż pojedynczy agent:

### 1. Niezależne, równoległe ścieżki

Zadanie naturalnie dzieli się na N niezależnych ścieżek, które można wykonać równolegle. *„Przeszukaj 10 repozytoriów pod kątem X"* - 10 agentów, każdy w jednym repo, koordynator agreguje wyniki. Sensowne, bo równoległość daje 8x szybsze wykonanie.

### 2. Różne uprawnienia per krok

Workflow wymaga akcji w systemach z **różnymi domenami bezpieczeństwa**. Agent A czyta Slack (low risk), Agent B pisze do Jiry (medium risk), Agent C deployuje (high risk). Każdy z własnym scope'em uprawnień i osobnym audit logiem. Multi-agent tutaj nie tyle pomaga, co **jest wymagany przez governance**.

### 3. Specjalizacja wymaga różnych modeli

Część zadania potrzebuje Claude Opus (rozumowanie), część Claude Haiku (szybkie wypełnienia), część lokalnego modelu (poufne dane). Multi-agent pozwala dobrać model per krok.

### 4. Audit trail wymaga rozdzielenia

Compliance wymaga, żeby ślad każdej decyzji był odrębny per typ akcji. Jeden agent w pełnej logice = jeden log. Pięciu agentów = pięć osobnych logów, każdy podpisany przez owner'a per typ akcji.

Jeśli twój use case to żadne z powyższych - wracaj do jednego agenta.

## Anti-pattern „orkiestracja miernoty"

Sformułowanie z wcześniejszych wersji [Skali Holaka](/pl/blog/skala-holaka/): *„Trzech agentów z których żaden nie radzi sobie z pojedynczym celem. Orkiestracja miernoty daje większą miernotę."* W v2.1e ten wzorzec wraca pod hasłem *„OS bez celu"* - platforma z agentami, ale bez procesu biznesowego, który realnie obsługuje.

Sygnały:

- Każdy z agentów osiąga <60% sukcesu jako solo
- Wyniki orkiestracji nie są lepsze niż wyniki najlepszego agenta solo
- Czas wykonania orkiestracji > 3x czasu agenta solo
- Koszt tokenów > 5x kosztu agenta solo

**Wyjście:**

1. Zatrzymaj projekt multi-agent.
2. Wybierz agenta, który najsłabiej sobie radzi.
3. Spraw, żeby jako solo osiągał 80%.
4. Powtórz dla każdego.
5. **Po wszystkich** wróć do pytania: czy multi-agent jest jeszcze potrzebny?

Często odpowiedź brzmi nie. Bo po drodze powstało 4 dobrych agentów, każdy z których obsługuje swój zakres niezależnie.

## Test gotowości do orkiestracji

Cztery pytania. Wszystkie muszą być „tak":

1. **Czy każdy z planowanych agentów (jako solo) osiąga ≥80% sukcesu w swojej domenie?**
2. **Czy mam udokumentowany protokół komunikacji między agentami?**
3. **Czy mam plan na każdy z 5 typów failure mode (timeout, halucynacja, konflikt, bias, pętla)?**
4. **Czy wartość orkiestracji vs pojedyncze agenty wykazuję liczbowo (oszczędność czasu, jakość, dostępność)?**

Wszystkie tak → poziom 10 jest realny. Choć jedno nie → wracaj do 9.

## Co dalej

Pisałem o [subagentach Claude Code](/pl/blog/subagenci-claude-code-co-to-i-po-co/) - to dobry intro do orkiestracji w praktyce. [Własny subagent](/pl/blog/wlasny-subagent-claude-code-przyklad/) pokazuje, jak zbudować jednego. Te dwa posty są o **mechanice**.

Ten artykuł jest o **strategii**. Większość zespołów nie potrzebuje poziomu 10. Potrzebuje dobrego poziomu 9 - autonomicznego pojedynczego agenta, który robi swoje 80% przypadków.

Poziom 10 ma sens kiedy poziom 9 jest *„za mało"*. Nie wcześniej. Większość czasu *„za mało"* jest złudzeniem - z hype'u, nie z realnej potrzeby.

Jeśli mimo wszystko chcesz multi-agent - przejdź przez 4 pytania testu gotowości. Jeśli odpowiesz wszystko „tak" - zbuduj, ale uczciwie. Jeśli któryś „nie" - zatrzymaj się, dokończ wcześniejszy poziom.
