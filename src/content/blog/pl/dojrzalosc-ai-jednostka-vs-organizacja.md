---
title: "Jednostka 9, firma 2 - co robić z rozjazdem dojrzałości AI"
description: "Większość firm mierzy maksimum zamiast mediany. Jak wykryć rozjazd między dojrzałością jednostki a organizacji, jak liczyć medianę i co realnie zrobić jeśli jesteś inżynierem na 9 w firmie na 2."
date: 2026-05-27
tags: ["ai", "adopcja", "skala-holaka", "zespoly", "governance"]
lang: pl
readingTime: 9
author: GH
---

W [Skali Holaka](/pl/blog/skala-holaka/) jest sekcja o dwóch wymiarach: jednostka i organizacja. To była jedna z najczęściej cytowanych części po publikacji - bo każdy widzi rozjazd między sobą a swoim pracodawcą.

Ten artykuł rozwija temat. Dla **menedżerów** - jak realnie zmierzyć organizację. Dla **inżynierów na 9 w firmie na 2** - co robić, żeby się nie wypalić. Dla **AI ambasadorów** - jak prowadzić rozmowy z compliance i zarządem.

## Dlaczego się rozjeżdża

Dwa systemy uczą się w innym tempie:

- **Jednostka** uczy się w 2–6 tygodni. Custom instructions, CLAUDE.md, MCP - narzędzia są publiczne, tutoriale są darmowe, sprzężenie zwrotne natychmiastowe.
- **Organizacja** uczy się w 12–24 miesięcy. Każdy nowy stack wymaga: review security, RBAC, polityki danych, szkolenia, change management, budżetu.

Rozjazd jest naturalny. Problem zaczyna się, gdy obie strony **udają, że go nie ma**.

## Trzy typowe wzorce

### Wzorzec A: jednostka 9, organizacja 2

Inżynier pracuje z agentami autonomicznie w pet projektach. W pracy odpalał ChatGPT z czystego okna, bo wewnętrzne narzędzia nie pozwalają na nic innego. „Compliance nie zatwierdził."

**Cena:** marnotrawstwo talentu. Inżynier traci motywację, w ciągu roku odchodzi do firmy która jest na 5.

**Sygnał:** rozmowy w stylu *„u nas to nie wejdzie"*, *„za dwa lata może"*. Cisza w retro przy temacie „jak pracujemy".

### Wzorzec B: jednostka 3, organizacja 7

Firma wdrożyła AGENTS.md, postawiła MCP servery, zatrudniła AI ambasadora. Ale przeciętny inżynier kopiuje prompty z Confluence - bo nie wie, że istnieją skille przygotowane przez team platformowy.

**Cena:** marnotrawstwo infrastruktury. ROI z wdrożenia spada do 10%, bo używa go 5% zespołu.

**Sygnał:** wewnętrzne dashboardy pokazują wysokie zużycie tokenów na małej liczbie userów. *„Mamy świetne narzędzia, tylko nikt ich nie używa."*

### Wzorzec C: jednostka 5, organizacja 5 (wyrównane)

Rzadki, zdrowy stan. Firma inwestuje w edukację, inżynierowie mają głos w doborze narzędzi, weekly o AI nie kończy się demoniem nowości tylko refleksją „co działa".

**Sygnał:** retro zawiera pytanie *„czy nasz CLAUDE.md / AGENTS.md zgadza się z praktyką?"*

## Jak liczyć medianę organizacji

**Najczęstszy błąd:** mierzenie tylko liderów. *„Nasz AI ambasador jest na 9, więc firma jest na 9."* Nie. Firma jest na medianie próby.

**Metoda:**

1. **Próbka.** Wylosuj 15–30 osób ze wszystkich poziomów struktury. Nie ochotników - losowo.
2. **Diagnoza.** Użyj [protokołu 30-minutowego](/pl/blog/diagnoza-dojrzalosci-ai-30-min/) per osoba. Tak, to 7–15 godzin sumarycznie.
3. **Dystrybucja.** Zapisz wszystkie poziomy w arkuszu. Histogram. Mediana, nie średnia.
4. **Spread.** Mediana + min + max + p25 i p75. Spread pokazuje, czy firma jest jednorodna.

**Czerwone flagi w wynikach:**

- Spread > 5 (np. min 1, max 9) - firma podzielona, ryzyko polaryzacji
- Mediana < 3 - większość zespołu jest na poziomie czata
- p25 = 0 lub 1 - co czwarta osoba w oporze, sprawdzić czy to wybór czy lęk

## Co robi inżynier na 9 w firmie na 2

Realna sytuacja, którą widzimy często. Pięć opcji, od najmniej do najbardziej radykalnej.

### Opcja 1: kanały bezpieczne

Wykorzystaj to, na co firma się zgadza, w maksymalnym zakresie. Custom instructions w narzędziu, które masz oficjalnie. Pliki kontekstowe w prywatnym branchu (nie w prod repo). Skille lokalnie.

**Limit:** dojdziesz do 4–5 w pracy. Pełne 9 zostaje w pet projektach.

### Opcja 2: bycie chartem

Zaproponuj zarządowi pilot. 1 zespół, 1 projekt, 3 miesiące, zdefiniowany sukces. Pokaż liczby. Wygraj ten pilot - i poszerz.

**Limit:** wymaga politycznej energii. Działa jeśli masz sponsor'a na poziomie dyrektora.

### Opcja 3: kanał edukacyjny

Brown bag co tydzień, internal newsletter, demo dni. Nie pchaj narzędzi - pokaż wartość. Po kilku miesiącach krzywa adopcji rośnie organicznie.

**Limit:** wolne, miesiące do efektu. Wymaga cierpliwości.

### Opcja 4: rola AI ambasadora

Negocjuj z managerem rolę formalną. 20% etatu na adopcję, mierzalne cele, budżet na narzędzia. Wymaga politycznego kapitału.

**Limit:** rola istnieje tylko w firmach które się decydują na AI. W innych - nawet jej nie pozwolą zdefiniować.

### Opcja 5: zmiana pracy

Brzmi radykalnie, ale w 2026 to realna opcja. Firmy na 5–6 aktywnie rekrutują z firm na 2. Pomiar rynku jest prosty: jeśli twoja praca regularnie blokuje ci użycie narzędzi, których uczą się juniorzy w innych firmach - czas iść.

**Limit:** decyzja osobista, nie taktyczna.

## Co robi menedżer w firmie na 7 z medianą 3

Druga strona: masz świetną infrastrukturę i nikt jej nie używa.

**Co działa:**

1. **Internal champions.** Wybierz 1–2 osoby per zespół, daj im 10% czasu na bycie „przewodnikiem". Mierz wzrost użycia w ich zespole.
2. **Buddy programs.** Pair nowego użytkownika z championem na 2 tygodnie. Krytyczna metryka: ile prompts/dzień przed i po.
3. **Use case library.** Konkretne, krótkie nagrania *„jak Iwona oszczędza 45 minut tygodniowo na X"*. Nie generyczne *„AI zwiększa produktywność"*.
4. **Defaults.** Custom instructions zespołowe pre-defined. Skille widoczne w UI. CLAUDE.md w każdym repo z template'em do uzupełnienia.

**Co NIE działa:**

- Mandat zarządu - *„wszyscy muszą używać"*. Zwiększa opór.
- Szkolenie 1x - szkolenie nie zmienia poziomu, zachowanie zmienia.
- Dashboard z liczbami bez kontekstu - *„zużyliśmy 5M tokenów"* nic nie znaczy.

## Governance - kto decyduje

Trzy decyzje, które muszą mieć właściciela:

1. **Co wolno wdrożyć (narzędzia, MCP, agenty).** Owner: CISO + Head of Engineering.
2. **Co jest zabronione (klasa danych, akcje produkcyjne).** Owner: Compliance + DPO.
3. **Co jest mierzone (poziomy, użycie, ROI).** Owner: AI ambasador / Head of Productivity.

Bez owner'a per kategoria, każdy nowy MCP wymaga 3-tygodniowej dyskusji od zera. Z owner'em - decyzje w godzinach.

## Co dalej

Mierz organizację co kwartał. Trzy diagnozy w roku pokazują trajektorię. Trajektoria jest ważniejsza niż punktowy wynik.

Jeśli jesteś inżynierem na 9 w firmie na 2 - wybierz **jedną** z pięciu opcji. Nie próbuj wszystkich naraz. Zmierz wynik po 3 miesiącach. Adaptuj.

Jeśli jesteś menedżerem firmy na 7 z medianą 3 - wybierz **dwóch** championów. Daj im 10% czasu. Mierz delta użycia w ich zespołach po kwartale.

Wszystko inne to teoria, której nikt nie pamięta na produkcji.
