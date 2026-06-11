---
title: "Anti-patterny adopcji AI - 7 sposobów na utknięcie"
description: "Większość zespołów nie utyka z braku narzędzi, tylko na konkretnych wzorcach myślenia. Siedem najczęstszych anti-patternów ze skali Holaka, test rozpoznawczy, kto utyka i jak wyjść."
date: 2026-05-25
tags: ["ai", "adopcja", "skala-holaka", "antipaterny", "zespoly"]
lang: pl
readingTime: 8
author:
  - KG
  - GH
---

[Skala Holaka](/pl/blog/skala-holaka/) wymienia pięć anti-patternów w jednej sekcji. Po kilkudziesięciu rozmowach z zespołami widzimy, że to za mało - i że format „jedno zdanie + bullet" nie wystarcza, żeby się z nich wyrwać.

Ten artykuł rozszerza listę do siedmiu, dodaje test rozpoznawczy per pattern, opisuje kto utyka najczęściej i pokazuje konkretną drogę wyjścia.

Pisaliśmy go razem, bo każdy z nas widzi inną stronę tych historii. Konrad - z perspektywy zespołów wdrożeniowych w Sii. Grzegorz - z perspektywy ambasadorów AI w bankach i fintechach.

## 1. „Używam AI codziennie" - utknięcie na 1

**Co to jest:** codzienne pytania do ChatGPT lub Claude'a, ale zawsze w trybie *„zapytaj - dostaniesz odpowiedź"*. Nic więcej. Brak iteracji, brak kontekstu, brak ustawień.

**Test:** *„Co nowego w pracy z AI próbowałaś/eś w ostatnim miesiącu?"* - jeśli odpowiedź brzmi „nic, ale codziennie używam" → utknięcie na 1.

**Kto utyka:** najczęściej menedżerowie, którzy uznali, że adopcja = używanie. Także inżynierowie, którzy testowali kilka modeli i wybrali jeden.

**Wyjście:**

1. Zapisz 5 powtarzających się typów pytań z ostatniego tygodnia.
2. Zrób jeden szablon prompta dla każdego - z rolą, kontekstem, formatem.
3. Przez tydzień używaj wyłącznie szablonów. Po tygodniu jesteś na 2-3.

## 2. Fetysz promptów - utknięcie na 3

**Co to jest:** biblioteka „złotych promptów" w Confluence albo Notion. Każdy ma 100-300 linii. Kopiujesz z dokumentu, podstawiasz zmienne, wysyłasz.

**Test:** *„Pokaż prompt, którego używasz codziennie. Skąd go kopiujesz?"* - jeśli z dokumentu, jeśli długi, jeśli czujesz dumę z jego struktury → fetysz promptów.

**Kto utyka:** zespoły, które zaczęły od warsztatu z prompt engineeringu i nigdy nie poszły dalej. Także single inżynierowie, którzy w pojedynkę zbudowali swój „złoty zestaw".

**Wyjście:**

1. Wybierz prompt, którego używasz najczęściej.
2. Wyciągnij z niego treść, która się nie zmienia (rola, styl, ograniczenia) - wrzuć do custom instructions.
3. Wyciągnij wiedzę projektową - wrzuć do [AGENTS.md / CLAUDE.md](/pl/blog/agents-md-dla-test-automation/).
4. Zostaw w prompcie tylko cel zadania. Powinien zmieścić się w 3-5 linijkach. Jesteś na 4+.

## 3. Dokumentacja-cmentarz - utknięcie na 5

**Co to jest:** projekt ma `AGENTS.md` lub `CLAUDE.md` - spisany raz, sześć miesięcy temu. Nikt nie pamięta, co tam jest. Agent nadal działa, ale „bardziej z pamięci niż z pliku".

**Test:** *„Otwórz CLAUDE.md i powiedz mi, co tam zmieniło się w ostatnim miesiącu."* - milczenie → cmentarz. Edytuj raz w miesiącu lub po istotnej zmianie projektu.

**Kto utyka:** zespoły, które wprowadziły pliki kontekstowe entuzjastycznie, ale nikt nie ma ich w retro / weekly. Także seniorzy, którzy spisali i poszli na inne tematy.

**Wyjście:**

1. Dodaj do retro pytanie: „czy CLAUDE.md zgadza się z tym, jak teraz pracujemy?"
2. Każda znacząca zmiana w workflow = PR do pliku kontekstowego.
3. Co kwartał review pliku z prośbą do agenta: *„wymień rzeczy w CLAUDE.md, które nie pasują do obecnego kodu"*.

## 4. Skill-bloat - utknięcie na 7

**Co to jest:** kilkanaście skilli, dedykowanych agentów, plików konfiguracji per zadanie. Nikt nie pamięta, co który robi. Agent rzadko trafia w odpowiedni.

**Test:** *„Wymień 5 skilli, których używasz w tygodniu, i powiedz, czym się różnią."* - brak płynnej odpowiedzi → bloat.

**Kto utyka:** zespoły fascynacji „mamy własne skille". Także team leadi, którzy chcieli pokazać produkcję wewnętrzną.

**Wyjście:**

1. Audyt: dla każdego skilla policz wywołania w ostatnich 30 dniach.
2. Skille z <5 wywołaniami - kasujesz albo łączysz.
3. Skill bez właściciela - kasujesz.
4. Skill z duplikującą się funkcjonalnością z innym - konsolidujesz.

Cel: <8 skilli, każdy z opisem w 1 zdaniu, każdy z owner'em.

## 5. Fałszywa dojrzałość 8 - udawanie 8 z poziomu 6-7

**Co to jest:** firma chwali się: *„mamy MCP, mamy connectory, mamy 15 integracji"*. Ale każda akcja agenta wymaga ręcznego zatwierdzenia kliknięciem. To wciąż człowiek prowadzi krok po kroku.

**Test:** *„Pokaż jedną akcję agenta z ostatniego tygodnia, która została wykonana w realnym systemie bez Twojego kliknięcia"* - brak takiego przykładu → fałszywe 8.

**Kto utyka:** firmy z silnym security/compliance, które dodały MCP bez frameworka uprawnień. Też zespoły z hype'u - chcą mówić „mamy MCP" w prezentacjach.

**Wyjście:**

1. Wybierz **jedną** akcję, która jest niskoryzykowna (np. tworzenie ticketu w Jirze).
2. Zbuduj [framework sprawdzalności i odwracalności](/pl/blog/granica-zaufania-przejscie-8-do-9/).
3. Włącz dla tej jednej akcji bez ręcznego zatwierdzenia.
4. Monitoruj tydzień. Skaluj na kolejną akcję.

## 6. Skok 4→9 - agent bez kontekstu

**Co to jest:** *„Zainstalujemy agenta i niech sam działa."* Brak plików kontekstowych, brak skilli, brak MCP. Agent halucynuje, zespół traci zaufanie, wraca do 2 z mottem *„AI nie działa"*.

**Test:** *„Jak agent wie, jakie są konwencje twojego repo?"* - jeśli odpowiedź to „on sam się domyśla" → 4→9.

**Kto utyka:** zespoły naciskane terminem. Także managerowie, którzy widzieli demo na konferencji i kupili narzędzie tego samego dnia.

**Wyjście:**

1. **Cofnij się** do poziomu 5. To nie jest porażka - to dyscyplina.
2. Spisz CLAUDE.md / AGENTS.md w jeden weekend.
3. Daj agentowi 5 zadań w sandboxie i porównaj z manualnym.
4. Dopiero potem włącz autonomię na jedno wybrane zadanie.

## 7. Orkiestracja miernoty - udawanie 10 bez 9

**Co to jest:** trzech, pięciu agentów współpracuje. Żaden z nich nie radzi sobie z pojedynczym zadaniem od początku do końca. Wynik: trzy razy więcej błędów, trzy razy więcej kosztów, te same wyniki co z jednym agentem.

**Test:** *„Czy pojedynczy agent radzi sobie z 80% zadań w tej domenie?"* - jeśli nie → nie buduj zespołu, napraw pojedynczego.

**Kto utyka:** zespoły zainspirowane multi-agent frameworkami. Też firmy które chcą napisać w deck'u „mamy orkiestrację".

**Wyjście:**

1. Zatrzymaj projekt multi-agent.
2. Wybierz najsłabszego agenta z zespołu.
3. Spraw, żeby jako pojedyncza jednostka osiągał 80% sukcesu w swojej domenie.
4. Powtórz dla każdego.
5. Dopiero teraz wracaj do orkiestracji - i sprawdź, czy w ogóle jest potrzebna.

## Co je łączy

Wszystkie siedem mają wspólny mianownik: **mylenie aktywności z dojrzałością**.

- „Używam codziennie" ≠ jestem zaawansowany
- „Mam bibliotekę promptów" ≠ jestem na 4
- „Spisałem AGENTS.md" ≠ pracuję z kontekstem
- „Mam 15 skilli" ≠ mam strategię
- „Mam MCP" ≠ mam autonomię
- „Mam agenta" ≠ delegowałem cel
- „Mam wielu agentów" ≠ orkiestruję

Test, który łapie je wszystkie naraz: *„pokaż konkretny output z ostatniego tygodnia i opisz, ile czasu zaoszczędziło Ci to względem starego workflow."*

Brak odpowiedzi = któryś z patternów.

## Co dalej

W [Skali Holaka](/pl/blog/skala-holaka/) anti-patterny były punktem startowym. Tutaj mają wyjścia. Wersja 3 skali będzie miała te wzorce w jednej tablicy z linkami do checklist (zbieramy materiał - jeśli widzicie u siebie któryś, [napiszcie do nas](https://holak.net.pl)).

W praktyce: największą korzyść daje **przyznanie, że jest się w którymś z patternów**. Reszta to dyscyplina.
