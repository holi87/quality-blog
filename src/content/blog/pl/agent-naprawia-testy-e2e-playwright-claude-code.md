---
title: "Agent naprawia testy e2e: workflow Playwright + Claude Code krok po kroku"
description: "Jak zbudować przepływ, w którym agent diagnozuje padnięte testy e2e i otwiera PR z poprawką - oraz cztery wzorce pomyłek agenta, które trzeba znać, zanim mu zaufasz."
date: 2026-07-10
tags: ["ai", "qa", "playwright", "agenci", "test-automation", "ci-cd"]
lang: pl
readingTime: 9
author: GH
---

Test e2e padł na CI o trzeciej w nocy. O ósmej rano w repozytorium czeka pull request (propozycja zmiany) z diagnozą przyczyny, zrzutem ekranu z miejsca awarii i poprawką do przeglądu. Ten przepływ pracy działa u mnie od kilku miesięcy i da się go zbudować w jeden dzień. W tym wpisie pokazuję krok po kroku jak - i równie dokładnie pokazuję, gdzie agent się myli, bo bez tej drugiej części całość jest niebezpieczna.

## Co agent musi dostać na wejściu

Większość nieudanych prób automatyzacji naprawy testów pada na tym samym: agent dostaje za mało kontekstu. Sam komunikat błędu w stylu `TimeoutError: locator.click: Timeout 30000ms exceeded` mówi tyle, co nic. Na jego podstawie agent zgaduje - a zgadujący agent jest gorszy niż brak agenta.

Playwright może zebrać przy porażce trzy rodzaje materiału, jeśli jawnie włączysz odpowiednie artefakty w konfiguracji:

- **Trace** (zapis przebiegu) - pełna sekwencja akcji testu z migawkami DOM przed i po każdym kroku. To najcenniejsze źródło: agent widzi, jak strona wyglądała w momencie awarii, a nie jak powinna wyglądać.
- **Zrzut ekranu** z chwili porażki - tani w analizie i często wystarczający, żeby odróżnić "element się nie załadował" od "element jest, ale przykryty banerem zgody na ciasteczka".
- **Kontekst DOM** - migawki drzewa elementów zapisane w trace. Agent porównuje selektor z testu z faktyczną strukturą strony i widzi, czy element zmienił atrybuty, zniknął, czy tylko się przesunął.

Do tego dokładam dwie rzeczy spoza raportu Playwright: diff zmian w aplikacji od ostatniego zielonego przebiegu oraz historię tego konkretnego testu z ostatnich dwóch tygodni. Pierwsza pozwala powiązać awarię ze zmianą w kodzie, druga odróżnia świeżą regresję od testu, który sypie się od dawna.

## Krok po kroku: budowa przepływu

Cały przepływ składa się z pięciu kroków. Zakładam Playwright na GitHub Actions i Claude Code jako agenta, ale mechanika jest przenośna na inne narzędzia.

1. **Włącz artefakty przy porażce.** W konfiguracji Playwright ustaw trace i zrzuty ekranu tak, żeby powstawały tylko przy nieudanych testach - inaczej CI zacznie produkować gigabajty.
2. **Wyzwól agenta po czerwonym przebiegu.** Osobne zadanie w potoku CI uruchamia się warunkowo, gdy testy padną, pobiera artefakty i odpala agenta z dostępem do repozytorium w trybie tylko do odczytu plus prawo utworzenia gałęzi.
3. **Daj agentowi instrukcję diagnostyczną, nie naprawczą.** Prompt brzmi: "ustal przyczynę, sklasyfikuj ją jako regresję aplikacji, problem testu albo problem środowiska, dopiero potem zaproponuj zmianę". Kolejność ma znaczenie - agent poproszony od razu o naprawę będzie naprawiał, nawet jeśli naprawiać trzeba aplikację.
4. **Agent otwiera PR, nigdy nie merguje.** Wynik pracy to gałąź z poprawką, opis diagnozy w treści PR i etykieta odróżniająca poprawki agenta od ludzkich.
5. **Człowiek zatwierdza.** O tym osobna sekcja niżej, bo to nie formalność.

Minimalny fragment konfiguracji Playwright, od którego wszystko zależy:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  reporter: [['html'], ['json', { outputFile: 'results.json' }]],
});
```

Raport JSON jest dla agenta, HTML dla człowieka. Ta sama awaria, dwóch odbiorców, dwa formaty.

## Instrukcja diagnostyczna w praktyce

Treść instrukcji dla agenta to połowa sukcesu tego przepływu, więc rozpiszę ją dokładniej. Moja wersja ma cztery części. Pierwsza definiuje rolę i zakres: "jesteś inżynierem diagnozującym awarię testu e2e; twoim zadaniem jest diagnoza, nie zielony przebieg za wszelką cenę". To zdanie brzmi banalnie, ale realnie zmienia zachowanie - bez niego agent optymalizuje pod sukces testu, z nim pod prawdziwość diagnozy.

Druga część wymusza format wyniku: klasyfikacja przyczyny (regresja aplikacji / problem testu / problem środowiska / nie wiem), materiał dowodowy z konkretnymi odwołaniami (linia trace, fragment DOM, hash commita z diffa), proponowana zmiana i poziom pewności. Kategoria "nie wiem" jest obowiązkowa w słowniku - agent pozbawiony tej opcji zawsze coś wymyśli, a wymyślona diagnoza jest gorsza niż przyznanie się do braku danych. PR z klasyfikacją "nie wiem" też ma wartość: to przefiltrowany materiał dla człowieka z zebranym kontekstem.

Trzecia część to zakazy: nie zmieniaj oczekiwanych wartości asercji bez wskazania celowej zmiany w aplikacji, nie podnoś limitów czasu, nie usuwaj kroków, nie dotykaj plików poza katalogiem testów. Czwarta to ograniczenia zasobowe - limit czasu pracy i limit prób. Agent, który po dwóch podejściach nie ma diagnozy, kończy raportem z tego, co ustalił, zamiast mielić tokeny do skutku.

Klasyfikacja "regresja aplikacji" zasługuje na osobne zdanie: w tym przypadku agent w ogóle nie proponuje zmiany testu. Otwiera zgłoszenie błędu z diagnozą i dowodami, a test zostaje czerwony - bo powinien być czerwony. To jest moment, w którym przepływ przestaje być "naprawianiem testów", a staje się tym, czym ma być naprawdę: skracaniem drogi od sygnału do decyzji.

## Twarda reguła: agent proponuje, człowiek zatwierdza

W moim przepływie agent nie ma prawa zapisu do głównej gałęzi i nie ma prawa zatwierdzenia własnego PR. To nie jest tymczasowa ostrożność na okres wdrożenia - to stały element projektu. Powód jest prosty: test e2e, który padł, to sygnał. Automatyczne "naprawienie" testu bez zrozumienia sygnału to wyciszenie alarmu przeciwpożarowego, bo piszczał w nocy.

> Czerwony test jest sygnałem, nie diagnozą. Przyczyną może być regresja aplikacji, błąd lub nieaktualność testu, dane testowe, środowisko albo rzeczywista niestabilność. Agent potrafi u mnie poprawnie sklasyfikować około osiemdziesięciu procent przypadków. Cała wartość człowieka w tym przepływie mieści się w pozostałych dwudziestu.

Przegląd PR od agenta zajmuje mi zwykle pięć minut, bo dobra diagnoza w opisie robi większość roboty. Sprawdzam trzy rzeczy: czy klasyfikacja przyczyny zgadza się z diffem aplikacji, czy poprawka zmienia test a nie jego sens, i czy agent nie poluzował asercji.

## Gdzie agent się myli - cztery wzorce

Po kilku miesiącach przeglądania takich PR mam katalog typowych pomyłek. Każda z nich wygląda na poprawkę, a jest szkodą.

| Pomyłka agenta | Jak wygląda w PR | Jak ją wyłapać |
|---|---|---|
| Naprawia asercję zamiast aplikacji | Oczekiwana wartość w teście zmieniona na tę, którą zwraca zepsuta aplikacja, np. cena 89,99 podmieniona na 99,89 | Każdą zmianę oczekiwanej wartości konfrontuj z wymaganiem lub diffem - czy zmiana w aplikacji była celowa? |
| Maskuje regresję selektorem | Element zniknął, bo funkcja przestała działać, a agent "naprawił" lokator tak, żeby wskazywał inny, podobny element | Porównaj zrzut ekranu z oczekiwanym stanem - czy element naprawdę powinien tam być? |
| Leczy objaw timeoutem | Limit czasu podniesiony z 30 do 90 sekund, test zielony, aplikacja trzykrotnie wolniejsza | Zmiana limitu czasu w PR agenta to zawsze żółta flaga - pytaj o przyczynę spowolnienia |
| Usuwa "nadmiarowy" krok | Krok, który padał, po prostu zniknął z testu wraz z asercją, którą przygotowywał | Diff testu czytaj pod kątem ubytków pokrycia, nie tylko zmian |

Wzorzec pierwszy jest najgroźniejszy, bo wygląda najbardziej niewinnie. Test oczekiwał komunikatu "Zamówienie przyjęte", aplikacja po regresji pokazuje "Zamówienie przyjęto", agent uznaje różnicę za literówkę w teście i poprawia asercję. Tyle że to aplikacja się zmieniła - i być może zmieniła się przypadkiem, w odruchu refaktoryzacji, której nikt nie zauważył. Dlatego w promptcie agenta mam jawny zakaz: "nie zmieniaj oczekiwanych wartości asercji bez wskazania commita, który celowo zmienił to zachowanie".

## Co mierzyć, żeby wiedzieć, czy to działa

Trzy liczby wystarczą. Pierwsza: odsetek PR agenta zaakceptowanych bez poprawek - u mnie po dostrojeniu promptu około 70 procent. Druga: odsetek błędnych diagnoz wykrytych na przeglądzie - na początku 1 na 4, teraz 1 na 10. Trzecia, najważniejsza: czas od czerwonego przebiegu do zielonego. Przed agentem mediana wynosiła u nas półtora dnia, bo naprawa testu czekała w kolejce za "prawdziwą" robotą. Teraz to godzina, z czego 55 minut to czekanie na człowieka z poranną kawą.

Jest i czwarta obserwacja, niemierzalna: zespół przestał ignorować czerwone testy e2e. Kiedy diagnoza przychodzi sama, próg wejścia w naprawę spada prawie do zera - i nagle okazuje się, że "wieczna czerwień" na CI nie była prawem natury, tylko skutkiem kosztu analizy.

## Podsumowanie

Przepływ "agent naprawia testy e2e" składa się z pięciu kroków: artefakty przy porażce, warunkowe wyzwolenie agenta, instrukcja najpierw diagnozuj potem proponuj, PR zamiast bezpośredniego zapisu, ludzkie zatwierdzenie. Wartość bierze się z kompletu wejść - trace, zrzut ekranu, kontekst DOM, diff aplikacji i historia testu - a bezpieczeństwo z twardej reguły, że agent niczego nie merguje sam. Cztery wzorce pomyłek warto znać na pamięć: naprawiona asercja zamiast aplikacji, zamaskowana regresja, leczenie timeoutem i ciche usuwanie kroków. Jeśli chcesz zacząć, włącz dziś `trace: 'retain-on-failure'` i przez tydzień podawaj artefakty agentowi ręcznie - zanim zautomatyzujesz wyzwalanie, nauczysz się, jak wyglądają jego dobre i złe diagnozy.
