---
title: "Skala Holaka — rozbudowany model dojrzałości adopcji AI"
description: "11 poziomów od oporu do orkiestracji — z diagnozą, anti-patternami i wymiarem organizacyjnym. Rozwinięcie autorskiego modelu dojrzałości AI."
date: 2026-04-21T00:00:00+02:00
tags: ["ai", "adopcja", "zespoly", "strategia"]
lang: pl
readingTime: 12
---

Kilka dni temu opublikowałem krótki [model dojrzałości adopcji AI](/pl/blog/model-dojrzalosci-ai/) — 11 poziomów od oporu do orkiestracji. Po rozmowach z czytelnikami i zespołami, którym pomagam we wdrożeniach, stało się jasne, że model wymaga rozbudowy. Brakowało narzędzi do diagnozy, konkretów z życia, uczciwego pokazania anti-patternów i rozdzielenia perspektywy jednostki od organizacji. Ta wersja — **skala Holaka** — zamyka te luki.

## Jak czytać tę skalę

Skala ma **11 pozycji (0–10)**, ale „poziom 0" to stan *przed* adopcją, a nie pierwszy stopień dojrzałości. Liczenie od zera jest świadome — chcę pokazać, że odmowa też jest pozycją, którą warto nazwać.

Każdy poziom opisuję tym samym trójkątem:

- **Bariera** — co trzeba pokonać, żeby wejść wyżej.
- **Sukces** — jak wygląda stabilne funkcjonowanie na tym poziomie.
- **Pułapka** — co sprawia, że ludzie i firmy utykają.

Skala działa w **dwóch wymiarach**:

- **Indywidualnym** — gdzie jesteś Ty jako użytkownik.
- **Organizacyjnym** — gdzie jest Twój zespół / firma jako system.

Te dwa wymiary często się rozjeżdżają. Pojedynczy inżynier bywa na poziomie 9, kiedy jego firma jest na 3. Strategia wdrożeniowa musi uwzględniać oba.

## Mapa poziomów

| Faza | Poziom | Nazwa | Jednym zdaniem |
|------|--------|-------|----------------|
| Start | [0](#poziom-0) | Opór | Brak kontaktu z AI |
| Start | [1](#poziom-1) | Podstawowy czat | Pytanie → odpowiedź |
| Świadome użycie | [2](#poziom-2) | Świadome promptowanie | Jakość inputu = jakość outputu |
| Świadome użycie | [3](#poziom-3) | Frameworki | CRISP, CoT, few-shot |
| Świadome użycie | [4](#poziom-4) | Instrukcje niestandardowe | Model zna Cię bez przypominania |
| Kontekst i wiedza | [5](#poziom-5) | Pliki kontekstowe | README, AGENTS.md, claude.md |
| Kontekst i wiedza | [6](#poziom-6) | Zaawansowane instrukcje | Reguły zachowań i granic |
| Kontekst i wiedza | [7](#poziom-7) | Skille i bazy wiedzy | Wiedza domenowa + umiejętności |
| Kontekst i wiedza | [8](#poziom-8) | Narzędzia i MCP | Integracja z systemami |
| Autonomia | [9](#poziom-9) | Agentowy workflow | Cel → autonomiczna realizacja |
| Autonomia | [10](#poziom-10) | Orkiestracja | Zespół agentów + koordynator |

## Faza 0–1: Start

### Poziom 0 {#poziom-0}

**Opór / brak adopcji.** Użytkownik nie korzysta z AI — z powodu braku wiedzy, obaw, decyzji etycznej lub niezgody firmowej. Często towarzyszy temu lęk przed utratą pracy albo nieufność wobec technologii.

- **Bariera:** emocje i tożsamość zawodowa.
- **Sukces:** uczciwa, poinformowana decyzja (a nie unik).
- **Pułapka:** racjonalizowanie oporu argumentami technicznymi („halucynuje", „nie ma compliance") zamiast przyznania, że problemem jest strach.

### Poziom 1 {#poziom-1}

**Podstawowy czat — pytanie → odpowiedź.** Pierwsza interakcja. Użytkownik traktuje model jak wyszukiwarkę: wpisuje pytanie, dostaje odpowiedź, czasem doprecyzowuje.

> Nawet eksperci wracają tutaj — i to jest OK. Prosty czat to nie wstyd, to narzędzie.

- **Bariera:** przełamanie pierwszego kontaktu.
- **Sukces:** naturalne sięganie po AI przy drobnych pytaniach.
- **Pułapka:** zatrzymanie się tu na lata z przekonaniem „używam AI codziennie" — bo używasz 2% jego możliwości.

**Diagnoza fazy Start:** jesteś tu, jeśli nie masz własnego konta w żadnym narzędziu AI albo używasz go tylko wtedy, gdy ktoś Ci pokazuje. Sygnał przejścia dalej: zaczynasz zauważać, że odpowiedzi bywają różnej jakości w zależności od tego, *jak* pytasz.

## Faza 2–4: Świadome użycie

### Poziom 2 {#poziom-2}

**Świadome promptowanie — jakość inputu wpływa na jakość outputu.** Użytkownik nadaje rolę („jesteś QA, napisz testy"), kontekst, ograniczenia. Zaczyna iterować zamiast akceptować pierwszą odpowiedź.

- **Bariera:** odruch „piszę jak do człowieka" zamiast „piszę jak do systemu, który potrzebuje kontekstu".
- **Sukces:** prompty zawierają rolę, cel, kontekst, format wyjścia — bez frameworka, z doświadczenia.
- **Pułapka:** przekonanie, że „wystarczy być precyzyjnym" — bez systematyzacji każdy prompt trzeba wymyślać od nowa.

### Poziom 3 {#poziom-3}

**Frameworki i prompt engineering.** CRISP, chain-of-thought, few-shot learning, ReAct. Ustrukturyzowane szablony, powtarzalne procesy, własne biblioteki promptów.

> Tu zatrzymuje się większość organizacji wdrażających AI. Frameworki dają świetne wyniki — ale to dopiero początek drogi.

- **Bariera:** nauka technik i dyscyplina stosowania.
- **Sukces:** powtarzalne, wysokiej jakości wyniki; zespół ma wspólny język promptowania.
- **Pułapka:** fetyszyzacja promptów — coraz dłuższe, coraz bardziej barokowe, zamiast przenieść powtarzającą się treść do instrukcji niestandardowych.

### Poziom 4 {#poziom-4}

**Instrukcje niestandardowe — model zna Cię bez przypominania.** Custom instructions, system prompts, ustawienia per-projekt. Nie powtarzasz co sesję „jestem testerem, piszę po polsku, lubię zwięzłe odpowiedzi".

**Typowy dzień na poziomie 4:** otwierasz ChatGPT / Claude, piszesz *„zrób review tego PR-a"*, a model już wie w jakim języku odpowiadać, jakiego stylu używasz i na co zwracać uwagę — bo powiedziałeś mu to raz, w ustawieniach.

- **Bariera:** inwestycja czasu w setup, który zwróci się dopiero za tydzień.
- **Sukces:** krótkie prompty, długi kontekst domyślny; spójność między sesjami.
- **Pułapka:** instrukcje rosną do rozmiarów powieści, bo dorzucasz przy każdym problemie — bez przeglądów i usuwania.

**Diagnoza fazy Świadome użycie:** jesteś tu, jeśli rozpoznajesz różnicę między dobrym a złym promptem u kogoś innego i masz własne szablony lub custom instructions. Sygnał przejścia dalej: czujesz, że kopiujesz ten sam kontekst między projektami i marzysz o tym, żeby żył „przy kodzie".

## Faza 5–8: Kontekst i wiedza

### Poziom 5 {#poziom-5}

**Pliki kontekstowe — kontekst per-projekt.** `README.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`. Agenci AI otrzymują pliki opisujące projekt: co budujemy, jaka jest struktura, jakie konwencje. Uruchamiasz agenta w katalogu — on już wie, co robić.

- **Bariera:** przyjęcie, że pisanie dokumentacji dla AI to praca inżynierska, nie „narzut".
- **Sukces:** nowy członek zespołu (człowiek lub agent) jest produktywny w godzinę.
- **Pułapka:** `CLAUDE.md` pisany raz i nigdy nieaktualizowany — staje się mitologią.

### Poziom 6 {#poziom-6}

**Zaawansowane instrukcje — definicja zachowań, reguł i granic.** Nie „co robić", tylko „jak się zachowywać": kiedy pytać, kiedy działać autonomicznie, jak raportować, czego nie robić. Różnica między prostym README a pełną specyfikacją roli.

- **Bariera:** umiejętność artykułowania norm, które do tej pory były w głowie.
- **Sukces:** agent działa zgodnie z kulturą zespołu bez Twojej obecności.
- **Pułapka:** sztywne reguły w miejscach, gdzie lepiej działałby dobry przykład — overfitting do jednego scenariusza.

### Poziom 7 {#poziom-7}

**Skille i bazy wiedzy — wyspecjalizowane umiejętności i wiedza domenowa.** Dedykowane skille (generowanie raportów, analiza logów, migracje), bazy wiedzy (dokumentacja, standardy, historia decyzji). Nie wymyślamy koła na nowo — wiedza jest zorganizowana.

- **Bariera:** architektura informacji i decyzja *co* zamknąć w skillu, a co zostawić ad hoc.
- **Sukces:** agent sięga po właściwe narzędzie sam, bez prowadzenia za rękę.
- **Pułapka:** mnożenie skilli „na wszelki wypadek" — nikt ich nie używa i nikt nie pamięta, że istnieją.

### Poziom 8 {#poziom-8}

**Narzędzia, MCP i konektory — integracja z zewnętrznymi systemami.** Agent nie tylko pisze — przeszukuje Slacka, tworzy zadania w Jira, czyta maile, odpytuje API, uruchamia testy. MCP (Model Context Protocol) i konektory pozwalają mu działać w świecie.

- **Bariera:** bezpieczeństwo i uprawnienia — *co* i *gdzie* agent może realnie zrobić.
- **Sukces:** agent jak nowy członek zespołu z dostępem do systemów.
- **Pułapka:** podłączanie wszystkiego do wszystkiego bez audytu — pierwsza awaria kosztuje więcej niż cały rok oszczędności.

**Diagnoza fazy Kontekst i wiedza:** jesteś tu, jeśli Twoje projekty mają pliki kontekstowe, których sam przestrzegasz, a agent potrafi wykonać zadanie end-to-end bez instrukcji „krok po kroku". Sygnał przejścia dalej: zaczynasz formułować cele wysokopoziomowe i dziwisz się, że wciąż musisz rozpisywać je na kroki.

## Między fazą 8 a 9: granica zaufania

To jest **najważniejszy skok w całej skali** — i najsłabiej opisany w popularnych modelach. Do poziomu 8 włącznie człowiek prowadzi, agent wykonuje. Od poziomu 9 to człowiek definiuje cel, a agent sam decyduje o krokach.

Granica nie jest techniczna — narzędzia istnieją od dawna. Granica jest **organizacyjna i psychologiczna**: zgoda na to, że coś zostanie zrobione bez Twojej każdej decyzji. Firmy utykają na 8 nie z powodu braku MCP, tylko z powodu braku gotowości do oddania kontroli. Inżynierowie utykają na 8, bo lubią sterować.

Przejście wymaga dwóch rzeczy: **sprawdzalności** (łatwo zweryfikować, co agent zrobił) i **odwracalności** (łatwo cofnąć, jeśli zrobił źle). Bez tych dwóch poziom 9 jest nieodpowiedzialny. Z nimi — staje się oczywistym krokiem.

## Faza 9–10: Autonomia

### Poziom 9 {#poziom-9}

**Agentowy workflow — cel → autonomiczne planowanie i realizacja.** Agent dostaje cel wysokopoziomowy i sam planuje kroki. *„Przygotuj release notes na podstawie ostatnich commitów"* — agent sprawdza repo, analizuje zmiany, pisze notatki, proponuje draft.

> Paradoks: użytkownik wraca do „prostego pytania" z poziomu 1 — ale machina pod spodem jest zupełnie inna.

- **Bariera:** zaufanie i system weryfikacji.
- **Sukces:** delegujesz cele, nie zadania; agent zgłasza się sam, gdy utknie.
- **Pułapka:** iluzja autonomii — agent *wydaje się* robić sam, ale w praktyce 60% Twojego czasu zjadają poprawki tego, co „prawie działa".

### Poziom 10 {#poziom-10}

**Orkiestracja wieloagentowa — zespół agentów z koordynatorem.** Wielu agentów, każdy ze swoją specjalizacją: jeden analizuje, drugi koduje, trzeci robi review, czwarty pisze testy. Orkiestrator koordynuje kolejność, rozwiązuje konflikty, agreguje wyniki.

- **Bariera:** projektowanie systemu agentów, a nie pisanie promptów.
- **Sukces:** złożone cele realizowane bez mikrozarządzania; człowiek ustala kierunek i weryfikuje efekt.
- **Pułapka:** overengineering — trzech agentów tam, gdzie wystarczyłby jeden dobrze skonfigurowany, bo „modno jest mieć zespół".

**Diagnoza fazy Autonomia:** jesteś tu, jeśli w ciągu ostatniego tygodnia delegowałeś agentowi cel, którego realizację sprawdziłeś dopiero na końcu — i była poprawna. Sygnał, że jesteś „powyżej 10": zaczynasz projektować systemy, w których pojedynczy agent to szczegół implementacyjny.

## Anti-patterny — gdzie ludzie utykają

Z obserwacji:

- **Utknięcie na 1 z mitem „używam AI".** Codzienne Q&A daje poczucie adopcji, maskując zerowy wzrost umiejętności. Test: czy w ostatnim miesiącu wypróbowałeś cokolwiek nowego?
- **Utknięcie na 3 z fetyszem promptów.** Biblioteki „złotych promptów" na 200 linii każdy, zamiast przeniesienia powtarzalnej treści do instrukcji. Objaw: kopiujesz prompt z dokumentu za każdym razem.
- **Fałszywa dojrzałość na 8.** Firma ma MCP, integracje i dashboardy — ale każdy workflow wymaga człowieka do zatwierdzenia każdego kroku. To wciąż poziom 6–7 przebrany za 8.
- **Skok z 4 na 9.** „Zainstalujemy agenta, niech sam działa" — bez fazy kontekstu i wiedzy. Agent halucynuje, zespół traci zaufanie, wraca do poziomu 2 i mówi, że „AI nie działa".
- **Poziom 10 bez poziomu 9.** Zespół agentów, z których żaden nie radzi sobie z pojedynczym celem. Orkiestracja miernoty daje większą miernotę.

## Organizacja vs jednostka

Skala dla **jednostki** mierzy umiejętność. Skala dla **organizacji** mierzy system: procesy, wiedzę instytucjonalną, governance, narzędzia.

Typowe rozjazdy:

- **Jednostka 9, organizacja 2.** Pojedynczy inżynier używa agentów autonomicznie w pracy domowej, ale w firmie musi ich wyłączyć „bo compliance". Marnotrawstwo talentu.
- **Jednostka 3, organizacja 7.** Firma ma świetne pliki kontekstowe, skille, MCP — ale użytkownicy kopiują prompty z Confluence, bo nie rozumieją, co mają pod ręką. Marnotrawstwo infrastruktury.
- **Jednostka 5, organizacja 5 (wyrównane).** Rzadki, zdrowy stan. Zwykle oznacza, że firma aktywnie inwestuje w edukację, a inżynierowie mają głos w doborze narzędzi.

Mierząc organizację, sprawdzaj **medianę**, nie maksimum. Jeden lider na 9 nie czyni firmy dojrzałą.

## Gdzie ten model zawodzi

Uczciwie:

- **Skala jest liniowa, świat nie.** W praktyce skacze się między poziomami w zależności od zadania. W pisaniu maili jesteś na 1, w kodzie na 8. To normalne.
- **Nie wszystkie poziomy są równie wartościowe.** Przeskok z 1 na 4 daje większy zysk niż z 8 na 10. Model pokazuje trajektorię, nie priorytet.
- **Narzędzia się zmieniają szybciej niż skala.** Poziom 8 z 2024 (MCP) to nie to samo, co poziom 8 z 2026. Skala opisuje *rodzaj* umiejętności, nie konkretne produkty.
- **Nie ma tu etyki.** Można być na poziomie 10 i robić coś szkodliwego. Dojrzałość techniczna nie jest dojrzałością moralną.

## Co dalej

Jeśli ta skala Ci się przyda w rozmowie z zespołem — korzystaj, cytuj, adaptuj. Jeśli widzisz w niej luki, napisz do mnie na [holak.net.pl](https://holak.net.pl) albo przez kanał kontaktu na blogu. Wersja 3 powstanie, kiedy uzbieram wystarczająco dużo konkretów z Waszych wdrożeń.

Kolejny post z tej serii — *„Jak zdiagnozować poziom dojrzałości zespołu w 30 minut"* — w przygotowaniu.

---

*Opracowanie: Grzegorz Holak — AI Ambassador, SCIB. Pierwotna publikacja: [holak.net.pl](https://holak.net.pl). Wersja 1 modelu: [Model dojrzałości adopcji AI](/pl/blog/model-dojrzalosci-ai/).*
