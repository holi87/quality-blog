---
title: "Skills, tools, agents, MCP, AGENTS.md — mapa pojęć dla testerów"
description: "Pięć pojęć, które najczęściej mylą się w rozmowach o AI w QA — plus prosty model decyzyjny, czego użyć do czego."
date: 2026-04-19
tags: ["ai", "qa", "agenci", "mcp"]
lang: pl
readingTime: 8
author: GH
---

W rozmowach o AI w QA zauważyłem, że dyskusja zazwyczaj się zacina nie dlatego, że technologia jest trudna, tylko dlatego, że wszyscy używają tych samych słów na zupełnie różne rzeczy. „Zbudowaliśmy agenta" często oznacza „mamy prompt w Notion". „Odpaliliśmy MCP" bywa synonimem „skleiliśmy Pythonowy skrypt". „Piszemy skill" bywa tłumaczone jako „dopisaliśmy akapit do system prompta".

Zanim zaczniemy cokolwiek wdrażać w zespole testerskim, warto mieć wspólny słownik. Ten wpis to mapa pięciu pojęć, które najczęściej się mylą: **skill, tool, agent, MCP i AGENTS.md**. Na końcu znajdziesz prosty model decyzyjny „czego użyć do czego".

## Prompt vs skill

**Prompt** to pojedyncza instrukcja, którą wysyłasz do modelu w konkretnym momencie. „Przejrzyj tę strategię testów i wskaż luki" — to prompt.

**Skill** to paczka wielokrotnego użytku — zwykle folder z plikiem `SKILL.md` — która opisuje modelowi, jak wykonywać konkretny rodzaj zadania. Model sam decyduje, czy dany skill załadować, na podstawie opisu zadania. Skill może zawierać:

- instrukcje krok po kroku,
- przykłady dobrych i złych outputów,
- reguły formatu,
- skrypty pomocnicze albo szablony.

Różnica praktyczna: prompt piszesz za każdym razem, skill raz, a potem model z niego korzysta, kiedy problem się powtarza. Dla zespołu QA to ważne, bo typowe zadania — generowanie scenariuszy E2E, review strategii, triage logu błędu — są dokładnie takimi powtarzalnymi wzorcami.

Najczęstsza pomyłka: mylenie skilla z długim system promptem. System prompt jest „zawsze włączony". Skill jest „włączany kontekstowo". Jeśli ładujesz całą biblioteczkę instrukcji zawsze, marnujesz kontekst i mieszasz modelowi w głowie.

## Tool vs MCP

**Tool** to funkcja, którą model może wywołać zamiast ją tylko opisać słowami. Przykłady: `run_playwright_test(name)`, `fetch_jira_ticket(id)`, `search_confluence(query)`. Każdy tool to kontrakt: nazwa, parametry, schema odpowiedzi.

**MCP (Model Context Protocol)** to standard — otwarty protokół — który opisuje, jak serwer może wystawić zestaw tooli (i zasobów, i promptów) w sposób, który każdy kompatybilny klient AI potrafi podpiąć. MCP nie jest toolem. MCP jest sposobem dystrybucji tooli.

Analogia z codziennego życia IT: tool to konkretny endpoint w API. MCP to coś w rodzaju OpenAPI / REST — konwencja, która sprawia, że endpointy można odkrywać, opisywać i podłączać w przewidywalny sposób.

Co z tego wynika dla QA:

- Pojedynczy tool („wywołaj naszą wewnętrzną testową usługę") można zbudować ad hoc.
- Kiedy chcesz, żeby te same narzędzia działały w wielu miejscach — w Claude, w IDE, w chatbocie zespołowym — sensowniej spiąć je w serwerze MCP.
- MCP to nie magia. To głównie dyscyplina nazywania rzeczy i opisywania parametrów.

## Workflow vs agent

Tu pojęcia mylą się najczęściej, bo marketing AI lubi mówić „agent" o czymkolwiek, co coś robi.

**Workflow** to predeterminowana sekwencja kroków. Ty decydujesz, co po czym następuje. Model wykonuje konkretny etap (np. generuje scenariusz), ale nie decyduje o tym, czy iść dalej, czy wrócić.

**Agent** to model, któremu dałeś pętlę, narzędzia i cel — i który sam decyduje, jakie narzędzie wywołać w następnym kroku, aż uzna zadanie za zakończone.

Praktyczne kryterium: jeśli potrafisz narysować diagram z jasnymi strzałkami i warunkami, prawdopodobnie chcesz workflow. Jeśli problem ma charakter eksploracyjny („przejrzyj raport z ostatnich 10 buildów i znajdź flaky testy, zbierz evidence, zaproponuj kolejność napraw"), agent ma sens.

W QA większość realnie pomocnych zastosowań AI to **workflow**, nie agent. Workflow jest przewidywalny, łatwiejszy do review i testowania, i rzadziej generuje kosztowne niespodzianki. Agent przydaje się tam, gdzie eksploracja naprawdę jest sednem problemu — typowo: deep-dive triage, systematyczny research wokół incydentu, konwersacyjne śledztwo po evidence.

Częsty błąd zespołów, które wchodzą w AI: od razu biorą się za agentów, bo „tak robi branża". Efekt jest odwrotny do zamierzonego — zespół traci zaufanie do AI, bo widzi drogie, losowe loopy zamiast powtarzalnej pomocy.

## Gdzie wchodzi AGENTS.md

**AGENTS.md** to plik w repozytorium, który opisuje agentom AI, jak pracować z tym konkretnym kodem. Konwencja jest świadomie podobna do README.md — ten drugi jest dla ludzi, `AGENTS.md` jest dla modeli.

Co typowo się tam znajduje:

- struktura repo,
- komendy do setupu,
- komendy do uruchamiania testów,
- konwencje (nazewnictwo, styl, wymogi PR),
- rzeczy, których agent **nie ma** robić (np. „nie twórz nowych zależności", „nie ruszaj folderu `legacy/`").

Dla repozytoriów testowych `AGENTS.md` jest szczególnie wartościowy, bo test automation ma dużo ukrytej wiedzy: które fixtures są współdzielone, jak uruchamia się testy lokalnie vs w CI, które tagi znaczą co, jak nazywa się scenariusze. Bez tego pliku agent zgaduje. Z nim — działa w ramach Twoich reguł.

Temu plikowi poświęcam osobny wpis, bo jest tam sporo pułapek. Tutaj zostawiam główny komunikat: **`AGENTS.md` to nie jest długi tekst o projekcie. To operacyjne instrukcje dla modelu.**

## Najczęstsze pomyłki pojęciowe

Pięć, które widzę najczęściej:

1. **„Mamy agenta"** — naprawdę mają prompt i ręcznie kopiowany output między narzędziami. To workflow, na dodatek manualny.
2. **„Wystawiamy MCP"** — w rzeczywistości skleili jeden skrypt CLI. Jeśli nie ma protokołu i klient AI nie może tego auto-odkryć, to po prostu skrypt.
3. **„Skill to długi prompt"** — skill ma być modularny i ładowany warunkowo, inaczej tracisz sens.
4. **„Dodaliśmy tool"** — ale bez dobrego opisu i przykładów model nie wie, kiedy go wywołać. Tool bez dobrego schema to martwy tool.
5. **„`AGENTS.md` to `README.md` v2"** — `README` odpowiada „co to jest i jak zacząć". `AGENTS.md` odpowiada „jak masz się tu zachować jako agent".

## Prosty model decyzyjny — czego użyć do czego

Zanim coś zbudujesz, zadaj cztery pytania w tej kolejności:

**1. Czy problem jest powtarzalny?**
Tak → zastanów się nad skillem.
Nie → wystarczy prompt.

**2. Czy model potrzebuje czegoś z zewnątrz (danych, akcji)?**
Nie → skill wystarczy.
Tak, jedna rzecz, jednorazowo → pojedynczy tool.
Tak, zestaw rzeczy, do reużycia w wielu miejscach → MCP.

**3. Czy kroki są znane i uporządkowane?**
Tak → zbuduj workflow.
Nie, problem jest eksploracyjny → rozważ agenta.

**4. Czy agent będzie pracował z kodem / testami?**
Tak → od razu napisz `AGENTS.md`, zanim go uruchomisz. Bez tego uczysz się na własnych błędach, a koszt „błędów agenta w repo" jest wysoki.

Ta czwórka pytań zastępuje dziewięćdziesiąt procent architektonicznych dyskusji „czy budujemy agenta, czy workflow, czy może MCP". Większość zespołów QA kończy na: skill + pojedynczy tool + workflow. I to jest w porządku — to realnie pomaga, bez ryzyka.

## Co warto zapamiętać

- **Skill** to powtarzalna paczka instrukcji. **Prompt** to jednorazowe zapytanie.
- **Tool** to funkcja do wywołania. **MCP** to protokół dystrybucji tooli.
- **Workflow** to zdefiniowana ścieżka. **Agent** to model z pętlą i autonomią.
- **`AGENTS.md`** to operacyjny kontrakt z agentem pracującym w Twoim repo.
- Zanim zbudujesz „agenta", sprawdź, czy naprawdę potrzebujesz autonomii, czy wystarczy przewidywalny workflow.

W kolejnych wpisach rozłożymy każdy z tych elementów na czynniki pierwsze — zaczynając od pisania sensownego `AGENTS.md` dla repo test automation.
