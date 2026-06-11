---
title: "AI w analizie flaky testów: od chaosu na CI do listy przyczyn źródłowych"
description: "Przepływ pracy, w którym agent zbiera historię przebiegów CI, grupuje awarie po sygnaturach błędów, klasyfikuje przyczyny źródłowe niestabilnych testów i ustala kolejność napraw."
date: 2026-07-24
tags: ["ai", "qa", "flaky-testy", "ci-cd", "test-automation"]
lang: pl
readingTime: 9
author: GH
---

Flaky (niestabilne) testy to najdroższy szum w inżynierii oprogramowania: każdy zespół je ma, każdy o nich wie i prawie nikt nie ma czasu ich systematycznie analizować. Restart przebiegu jest zawsze tańszy niż dochodzenie - do momentu, w którym zespół przestaje ufać CI w ogóle. W tym wpisie pokazuję przepływ pracy, w którym agent robi to dochodzenie za nas: zbiera historię przebiegów, grupuje awarie po sygnaturach, klasyfikuje przyczyny źródłowe i proponuje kolejność napraw.

## Dlaczego ręczna analiza nigdy się nie dzieje

Pojedynczy niestabilny test to drobiazg. Problem polega na tym, że analiza niestabilności wymaga spojrzenia na dziesiątki przebiegów naraz - a dane są rozproszone po raportach CI, każdy raport czyta się minutę, i z perspektywy pojedynczego dnia zawsze jest coś pilniejszego. W zespole, z którym pracowałem nad sklepem internetowym (nazwijmy go SklepDemo), 40 testów e2e na 600 wykazywało niestabilność, a restart potoku był tak zrytualizowany, że miał własny przycisk na kokpicie zespołu.

Koszt tego stanu jest większy, niż pokazuje licznik restartów. Po pierwsze, czas maszyn i ludzi: każdy restart czterdziestominutowego potoku to czterdzieści minut opóźnienia wdrożenia plus przełączanie kontekstu u osoby, która czeka. Po drugie, erozja zaufania: zespół, który nauczył się, że "czerwone pewnie znowu flaky", przestaje czytać raporty - i któregoś dnia restartuje przebieg z prawdziwą regresją w środku. Ten drugi koszt jest niewidoczny w żadnej metryce aż do dnia, w którym regresja wyjdzie na produkcji.

To jest jednocześnie dokładnie ten typ pracy, w którym agent ma przewagę strukturalną: nudna, powtarzalna, wymagająca przeczytania setek podobnych dokumentów i znalezienia w nich wzorców. Człowiek robi to raz na kwartał i się męczy. Agent robi to co noc i się nie nudzi.

## Krok 1: historia przebiegów jako dane wejściowe

Podstawą jest surowa historia: dla każdego testu wszystkie przebiegi z ostatnich 30 dni z wynikiem, czasem trwania, komunikatem błędu i identyfikatorem zadania CI. Większość serwerów CI wystawia to przez API; jeśli nie, wystarczy archiwizować raporty JSON z Playwright czy JUnit XML do jednego katalogu. Trzydzieści dni to świadomy kompromis: krótsze okno nie łapie rzadkich sygnatur, dłuższe miesza dane sprzed dużych zmian w aplikacji, które unieważniają część wniosków.

Pierwsza rzecz, którą liczy agent, to wskaźnik niestabilności: stosunek przebiegów, w których test padł a potem przeszedł bez zmiany kodu, do wszystkich przebiegów. Test, który pada zawsze, nie jest niestabilny - jest zepsuty, i to inna kolejka. Interesuje nas ten, który pada w 5 do 40 procent przypadków, losowo.

## Krok 2: sygnatury błędów zamiast nazw testów

Kluczowy ruch całej analizy: grupować nie po nazwie testu, tylko po znormalizowanej sygnaturze błędu. Jeden problem źródłowy potrafi wysypywać dwadzieścia różnych testów, a jeden test potrafi padać z trzech różnych powodów. Sygnatura to komunikat błędu po usunięciu części zmiennych: identyfikatorów, znaczników czasu, portów, losowych danych.

Syntetyczny przykład z projektu typu SklepDemo - trzy surowe komunikaty:

```
TimeoutError: locator.click: element "#koszyk-pozycja-8841" not visible
TimeoutError: locator.click: element "#koszyk-pozycja-1207" not visible
Error: expect(received).toBe(expected) - kupon "LATO26" already used
```

Po normalizacji pierwsze dwa zlewają się w jedną sygnaturę `locator.click: element "#koszyk-pozycja-N" not visible`, trzeci tworzy osobną. Z 312 awarii w miesiącu robi się nagle 14 sygnatur - i to jest liczba, z którą człowiek może pracować. Normalizację agent pisze sam jako zestaw wyrażeń regularnych, ale wyniki grupowania warto raz przejrzeć: zbyt agresywna normalizacja sklei dwa różne problemy w jeden.

## Krok 3: klasyfikacja przyczyn źródłowych

Dla każdej sygnatury agent dostaje próbkę pełnych raportów (z trace i kontekstem) i klasyfikuje przyczynę do jednej z kategorii. Używam czterech podstawowych plus kategorii "nieznana", która jest ważniejsza, niż się wydaje - agent zmuszony do klasyfikacji wszystkiego zaczyna konfabulować.

| Kategoria | Typowa sygnatura | Mechanizm | Typowa naprawa |
|---|---|---|---|
| Synchronizacja / timing | element not visible, stale element, timeout na akcji | Test wyprzedza aplikację: klik przed końcem animacji, asercja przed odpowiedzią API | Jawne oczekiwanie na stan zamiast sztywnych pauz, asercje z wbudowanym ponawianiem |
| Dane testowe | already used, duplicate entry, brak rekordu | Testy współdzielą dane: kupon zużyty przez równoległy przebieg, użytkownik zmodyfikowany przez inny test | Dane tworzone per test, izolacja przez unikalne identyfikatory |
| Środowisko | connection refused, 502/503, DNS, brak miejsca na dysku | Infrastruktura testowa słabsza od produkcyjnej: usługa zależna restartuje się, kontener nie zdążył wstać | Kontrola gotowości środowiska przed startem, osobny monitoring środowiska testowego |
| Kolejność testów | test przechodzi solo, pada w pakiecie; pada tylko po teście X | Test zostawia stan, który psuje następny: niewyczyszczona sesja, zmieniona konfiguracja | Sprzątanie po teście, losowa kolejność uruchamiania jako wykrywacz |

Najlepszy sygnał diagnostyczny dla kategorii czwartej jest darmowy: jeśli test pada tylko wtedy, gdy biegnie po konkretnym innym teście, agent znajdzie tę korelację w historii przebiegów w kilka sekund. Człowiek nie znajdzie jej nigdy, bo nikt nie zestawia kolejności wykonania z wynikami ręcznie.

## Krok 4: priorytety napraw, czyli ekonomia szumu

Lista czternastu sygnatur z przyczynami to dopiero połowa wartości. Druga połowa to kolejność. Agent liczy dla każdej sygnatury prosty koszt: liczba awarii w miesiącu razy średni koszt jednej awarii (restart potoku, czas oczekiwania zespołu, ewentualne ręczne dochodzenie). W SklepDemo dwie sygnatury z czternastu odpowiadały za 61 procent wszystkich czerwonych przebiegów - obie z kategorii danych testowych, obie do naprawienia w jeden dzień.

> Niestabilność testów ma rozkład pasożytniczy: garstka przyczyn źródłowych generuje większość szumu. Bez grupowania po sygnaturach naprawiasz testy. Z grupowaniem - naprawiasz przyczyny, a testy naprawiają się stadami.

Raport agenta, który trafia do zespołu, ma jedną stronę: czternaście sygnatur, przyczyna, koszt miesięczny, proponowana naprawa, szacunek pracochłonności. To jest dokument, na podstawie którego da się podjąć decyzję na planowaniu sprintu - w przeciwieństwie do ogólnego "mamy dużo flaky testów, trzeba coś zrobić".

## Kwarantanna i rytm tygodniowy

Analiza przyczyn to jedna noga procesu; druga to polityka postępowania z testem, który już wiemy, że jest niestabilny. Tu sprawdza się kwarantanna: test oznaczony jako niestabilny nadal się wykonuje i raportuje wynik, ale jego porażka nie blokuje potoku. To uczciwy kompromis - zespół nie traci sygnału, a czerwień przestaje być tłem, na którym nikt nie zauważy prawdziwej regresji.

Kwarantanna bez kryteriów wyjścia degeneruje się jednak w cmentarz testów. Dlatego dwie twarde reguły. Pierwsza: do kwarantanny trafia się wyłącznie z przypisaną sygnaturą i kategorią przyczyny z analizy agenta - "jest flaky" nie jest powodem, "pada na współdzielonym kuponie, kategoria dane testowe" jest. Druga: test wychodzi z kwarantanny po dwóch tygodniach stabilnych przebiegów albo zostaje skasowany świadomą decyzją. Limit pojemności kwarantanny (u nas: 15 testów) wymusza, żeby naprawy faktycznie się działy.

Całość spinam rytmem tygodniowym. Co poniedziałek rano agent generuje świeży raport: nowe sygnatury, zmiany wskaźnika niestabilności, stan kwarantanny, dwie rekomendacje napraw na ten tydzień. Raport ląduje na kanale zespołu i zajmuje pięć minut na przejrzeniu. Po dwóch miesiącach takiego rytmu wskaźnik niestabilności w SklepDemo spadł z 11 do 3 procent przebiegów - nie dlatego, że ktoś dostał projekt "naprawa flaky testów", tylko dlatego, że co tydzień znikały dwie przyczyny z góry listy.

## Czego agent w tym przepływie nie zrobi

Uczciwość wymaga listy ograniczeń. Po pierwsze, agent klasyfikuje na podstawie śladów - jeśli środowisko testowe nie loguje restartów usług, kategoria "środowisko" będzie systematycznie niedoszacowana, a winę wezmą na siebie timeouty. Po drugie, propozycje napraw dla kategorii synchronizacji bywają powierzchowne: "dodaj oczekiwanie" to nie analiza, dlaczego aplikacja odpowiada raz w sekundę, a raz w dziesięć. Po trzecie, sama naprawa to nadal praca inżynierska - przepływ skraca dochodzenie z dni do minut, ale nie pisze za nas poprawek do izolacji danych.

I po czwarte: jednorazowa analiza starzeje się w tygodnie. Prawdziwa zmiana następuje, gdy raport generuje się co tydzień automatycznie, a wskaźnik niestabilności staje się metryką zespołową obok pokrycia i czasu budowania.

## Podsumowanie

Przepływ analizy niestabilnych testów ma cztery kroki: historia przebiegów z 30 dni, normalizacja komunikatów do sygnatur błędów, klasyfikacja przyczyn do czterech kategorii (synchronizacja, dane, środowisko, kolejność) plus uczciwe "nieznana", i priorytetyzacja po koszcie miesięcznym. Grupowanie po sygnaturach zamiast po nazwach testów to najważniejsza decyzja projektowa - zamienia setki awarii w kilkanaście problemów źródłowych. Agent wygrywa tu nie inteligencją, tylko cierpliwością: czyta wszystkie raporty, koreluje kolejność wykonania z wynikami i nie nudzi się przy pięćsetnym trace. Eksperyment na start: weź historię swojego najbardziej znienawidzonego potoku z ostatniego miesiąca i poproś agenta o samo grupowanie po sygnaturach - sama ta lista zwykle wystarcza, żeby zmienić rozmowę o niestabilności z narzekania w plan.
