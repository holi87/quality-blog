---
title: "Jak tester powinien oceniać output agenta"
description: "Pięć wymiarów oceny outputu agenta, checklista, którą przejdziesz w piętnaście minut, i sytuacje, w których po prostu zawracasz wynik bez długiej dyskusji."
date: 2026-04-28
tags: ["ai", "qa", "agenci", "review"]
lang: pl
readingTime: 9
author: GH
---

Kiedy zespół zaczyna używać agentów AI na serio, pojawia się nowe zadanie, którego wcześniej nie było - weryfikacja tego, co agent wyprodukował. Dla testera to w gruncie rzeczy dobra wiadomość, bo krytyczne review outputu to czynność, którą i tak wykonujemy codziennie. Zmienia się tylko rodzaj źródła i wzorce błędów, które pod tym źródłem się kryją.

W tym wpisie przedstawiam, jak podejść do tej oceny systematycznie. Materiał do przeglądu bywa różny: scenariusz testowy wygenerowany przez agenta, analiza changeloga, propozycja checklisty release readiness, wygenerowana dokumentacja API. Mechanizm oceny jest wspólny - zmienia się tylko konkret, który mamy przed sobą.

Od razu zastrzeżenie, żeby uniknąć nieporozumień. Celem nie jest „przyłapać AI na kłamstwie". Celem jest mieć stały zestaw pytań, które zadajemy każdemu outputowi, zanim pójdzie dalej do zespołu, do klienta albo do repo.

## Pięć wymiarów oceny

W praktyce sprawdzam pięć wymiarów. Każdy z nich odpowiada na inne pytanie i każdy łapie inną klasę problemu.

### Kompletność

Pierwszy wymiar to prosta kwestia: czy output pokrywa wszystko, co miał pokryć. Agent, który dostał prośbę o scenariusze testowe dla nowej funkcji kuponów, potrafi wygenerować osiem świetnych scenariuszy - i obok nich cztery ciche pominięcia. Braku nie zobaczymy, patrząc tylko na to, co napisał. Zobaczymy go, porównując z tym, co być powinno.

Z mojego doświadczenia sposób, który tu działa najlepiej, to zapisać listę obszarów jeszcze zanim zawołam agenta. Dla scenariuszy ta lista obejmuje happy path, główne ścieżki negatywne, przypadki brzegowe, błędy walidacji, interakcje z innymi modułami, zachowanie przy braku sieci i wymagania niefunkcjonalne. Kiedy wynik wraca, konfrontuję go pozycja po pozycji.

Warto mieć świadomość jednego typowego biasu - agenci nagminnie kierują się w stronę pozytywnych ścieżek. Jeśli jawnie nie poprosimy o klasę błędów, prawie zawsze zostanie pominięta.

### Poprawność faktyczna

Wymiar najbardziej oczywisty, a w praktyce paradoksalnie najczęściej zaniedbywany podczas review. Mechanizm jest prosty: output brzmi wiarygodnie, więc przestajemy kwestionować detale.

Trzy podejścia, które u mnie się sprawdzają. Pierwsze - krzyżowa weryfikacja z kodem. Jeśli agent opisuje zachowanie funkcji, trzy losowo wybrane stwierdzenia porównane z implementacją dają wystarczającą podstawę, żeby zaufać reszcie. Drugie - porównanie ze specyfikacją albo dokumentacją, szczególnie kiedy agent odwołuje się do wymagań. Dobre narzędzia cytują; jeśli nie cytują, trzymam rękę na pulsie. Trzecie - test samodzielności stwierdzenia. Wybieram jedno zdanie z outputu i proszę agenta o źródło albo rekonstrukcję uzasadnienia. Brak dobrej odpowiedzi to sygnał, że reszta też wymaga dokładniejszej weryfikacji.

Najbardziej niebezpieczna jest kategoria błędów, którą nazywam „precyzyjne, lecz fałszywe". Stwierdzenie w stylu „endpoint `/api/v2/discounts` akceptuje pole `max_uses`" brzmi konkretnie i autorytatywnie, bywa jednak zmyślone. Im bardziej szczegółowy detal techniczny, tym ostrożniej go przyjmuję.

### Zgodność z domeną

Trzeci wymiar to pytanie o konwencje naszego projektu, zespołu i produktu. Agenci masowo to lekceważą, bo zwyczajnie ich nie znają. Tej wiedzy nie ma w treningu - chyba że jawnie ją dostarczymy przez `AGENTS.md`, dokumentację albo przykłady.

W praktyce sprawdzam cztery rzeczy. Nazewnictwo - czy scenariusz jest nazwany zgodnie z naszą konwencją, na przykład `should ... when ...` zamiast opisowego zdania. Selektory i identyfikatory - czy agent użył `data-testid` zamiast klas CSS, jeśli takie mamy ustalenie. Terminologię produktową, zwłaszcza tam, gdzie rozróżnienie ma znaczenie biznesowe („user" vs „customer" vs „merchant"). Strukturalne konwencje - gdzie plik żyje, jaki ma nagłówek, jakie importy.

Pominięcie tego wymiaru prowadzi do outputu, który jest faktycznie poprawny, ale nie pasuje do zespołu. Na review wróci, nawet jeśli wszystko inne jest w porządku.

### Traceability do źródeł

Czwarty wymiar jest krytyczny dla wszystkiego, co agent generuje na podstawie evidence - analizy logów, historii bugów, dokumentacji. Bez traceability reviewer nie ma szans zweryfikować poprawności.

Dobry output wskazuje konkretne źródła: identyfikator ticketu, numer loga, ścieżkę do pliku, hash commita. Linki są klikalne przez człowieka. Tam, gdzie wersja albo data ma znaczenie - są podane wprost. Zły output operuje na frazach typu „nasze logi pokazują…" bez wskazania, które; „w dokumentacji jest napisane…" bez referencji; „w ostatnich commitach…" bez hashów.

Brzmi to surowo, bo takie jest. Bez traceability nie odróżnimy wniosku ze źródła od halucynacji, a ta różnica kosztuje w QA wyraźnie więcej niż dodatkowe piętnaście sekund poświęcone na dopisanie citation.

### Ryzyko „ładnej bzdury"

Ostatni wymiar jest meta-wymiarem - dotyczy samoświadomości reviewera. Dobrze sformułowany, równo ustrukturyzowany, stylistycznie spójny tekst tworzy iluzję poprawności. Po dwóch godzinach review tester zaczyna ufać formie, a nie treści. To jest moment, w którym jakość oceny zaczyna cicho spadać.

Antidotum jest nudne, ale działa: wybieram losowe fragmenty i sprawdzam je bardzo agresywnie. Jeśli losowy fragment przechodzi trzy głębokie kontrole, pozostałej części można zaufać. Jeśli pęka - reszta wymaga głębszej weryfikacji, a nie powierzchownej akceptacji.

Drugi mechanizm to proste liczenie. Ile razy w swoim review powiedziałem „wygląda sensownie"? Jeśli więcej niż dwa razy na jeden output, robię review formy, nie treści, i muszę się zatrzymać.

## Checklista review w wersji praktycznej

Te pięć wymiarów składa się w piętnastopunktową listę, którą trzymam jako szablon.

**Kompletność**
- [ ] Output pokrywa wszystkie obszary z listy przygotowanej przed wywołaniem agenta.
- [ ] Brak oczywistych klas scenariuszy lub wątków, które powinny się pojawić.
- [ ] Zakres odpowiada temu, o co prosiłem.

**Poprawność**
- [ ] Wyrywkowa weryfikacja trzech stwierdzeń wobec kodu lub specyfikacji.
- [ ] Brak detalicznych, ale niedowodliwych faktów (nazwy endpointów, pól, stałych).
- [ ] Wartości liczbowe, jeśli się pojawiają, mają źródło.

**Zgodność z domeną**
- [ ] Nazewnictwo zgodne z konwencjami projektu.
- [ ] Selektory i struktura plików zgodne z repo.
- [ ] Terminologia produktowa spójna.

**Traceability**
- [ ] Każde stwierdzenie oparte na evidence ma citation.
- [ ] Cytowane źródła są otwieralne i aktualne.
- [ ] Brak stwierdzeń „nasze dane pokazują…" bez linku.

**Ładna bzdura**
- [ ] Forma nie przykryła braków treści - zrobiłem random sample.
- [ ] Nie zaakceptowałem niczego „bo wygląda sensownie".
- [ ] Trzy najbardziej precyzyjne stwierdzenia zweryfikowałem ręcznie.

Piętnaście punktów i piętnaście minut, jeśli robi się to regularnie. Pierwsze przejścia są dłuższe, bo trzeba się nauczyć, gdzie typowo pęka output.

## Sytuacje, w których odrzucam bez dyskusji

Są przypadki, w których nie marnuję czasu na dokładny przegląd, tylko wracam do agenta po nowy wynik. Traktuję je jako czerwone flagi.

**Brak źródeł przy stwierdzeniach o evidence.** Output w stylu „w ostatnim miesiącu mieliśmy flaky testy w obszarze X", bez wskazania, które konkretnie. Nie ma o czym dyskutować - zawracam i proszę o konkret.

**Zmyślone nazwy API, pól albo plików.** Wystarczy jedno takie wskazanie, żeby cały output stał się podejrzany. Zawracam i generuję od nowa z jawnym wymogiem cytowania.

**Wewnętrzne sprzeczności.** „Test powinien weryfikować, że kupon jest jednorazowy" - i trzy linie niżej „…po wielokrotnym użyciu kupon nadal działa". Obie linie mogą mieć sens osobno, ale agent nie zauważył konfliktu. Zawracam.

**Niezgodność z jawnymi instrukcjami.** Prosiłem o scenariusze w konwencji BDD, dostałem listę kroków imperatywnych. Nie poprawiam ręcznie - zawracam. Inaczej agent nie uczy się, że z instrukcji się nie wywinie.

**Output zbyt ogólny.** „System powinien być niezawodny" w miejscu, w którym pytałem o konkretne scenariusze. Zawracam z prośbą o konkretność.

Reguła ekonomiczna jest prosta: koszt zawrócenia to zwykle trzydzieści sekund promptu, koszt ręcznej poprawki - trzydzieści minut pracy. Zawracanie jest pro-quality.

## Skalowanie review w większym zespole

W pewnym momencie samodzielne review agenta przestaje skalować - wyników jest za dużo, a testerzy mają też inne zadania. Dwie praktyki, które mi się sprawdziły.

Pierwsza to **AI reviewing AI jako pre-filtr**. Drugi model sprawdza output wobec tej samej checklisty i flaguje fragmenty wymagające ludzkiej uwagi. Nie eliminuje to ludzkiego review - eliminuje rutynową część. Kiedy pre-filtr mówi „całość wygląda spójnie, ale trzy stwierdzenia o evidence nie mają citationu", człowiek wie, gdzie zacząć.

Druga to **regresja własnych uwag**. Prowadzę prostą notatkę po review: „trzeci raz dodałem uwagę o brakującym citation", „znowu zmyślone pole API", „znowu scenariusz pozytywny bez negatywnej wersji". Po kilku tygodniach mam mapę słabości konkretnego agenta albo konkretnego promptu. Część z tych obserwacji trafia do system prompta jako instrukcja, część do `AGENTS.md`, część zostaje na stałe w checklicie.

Jakość oceny outputu agenta rośnie razem z dojrzałością procesu. Pierwsze review bywają długie i wymagają skupienia. Dziesiąte są szybkie, bo wiadomo, gdzie zwykle coś pęka i gdzie nie ma co tracić czasu na nadmierną weryfikację.

## Na koniec

Pięć wymiarów oceny to kompletność, poprawność faktyczna, zgodność z domeną, traceability i ryzyko „ładnej bzdury". Każdy z nich łapie inny typ błędu, a pominięcie któregoś zostawia stały wyciek jakości. Piętnastopunktowa checklista mieści się w kwadransie review. Pięć sytuacji, w których zawracam bez dyskusji, pozwala oszczędzić sobie ręcznej poprawki. Skalowanie zapewniają pre-filtr AI i systematyczna regresja własnych obserwacji do system prompta i `AGENTS.md`.

W kolejnym wpisie - inny wątek: jak artykuł tego typu zamienić w trzydziestosekundowy video explainer, który osadzamy pod tekstem i reużywamy w social oraz szkoleniach.
