---
title: "Piramida testów w 2026: co z niej zostało po dekadzie mikroserwisów i e2e na agentach"
description: "Które piętra klasycznej piramidy testów mają jeszcze sens, gdzie rysunek kłamie i jak wygląda zdrowy rozkład testów w typowym projekcie webowym - bez dogmatów, z heurystykami."
date: 2026-07-15
tags: ["qa", "testy", "automatyzacja", "piramida-testow", "strategia"]
lang: pl
readingTime: 9
author: GH
---

Piramida testów ma kilkanaście lat i powstała w świecie, którego już prawie nie ma: monolit, jedna baza danych, interfejs renderowany na serwerze. Dziś między testami jednostkowymi a testami całościowymi siedzi gruba warstwa, której klasyczny rysunek w ogóle nie przewidział: testy kontraktowe, integracyjne na kontenerach, testy API. Sprawdzam, które piętra piramidy mają jeszcze sens, gdzie rysunek zwyczajnie kłamie i jak wygląda zdrowy rozkład testów w typowym projekcie webowym - bez dogmatów, z heurystykami.

## Skąd wzięła się piramida i co naprawdę mówiła

Oryginalna piramida niosła dwie obserwacje. Pierwsza: im niżej w stosie łapiesz błąd, tym taniej - test jednostkowy wykonuje się w milisekundach i wskazuje winną funkcję, test przez interfejs wykonuje się w minutach i wskazuje „coś nie działa". Druga: testów tanich powinno być dużo, drogich mało, stąd kształt - szeroka podstawa jednostkowa, wąski wierzchołek testów przez interfejs.

Obie obserwacje powstały w architekturze, gdzie „jednostka" miała dostęp do całej logiki, bo cała logika żyła w jednym procesie. Test jednostkowy pokrywał realny kawałek zachowania systemu. To założenie umarło pierwsze.

Warto od razu powiedzieć, co z piramidy przeżyło, bo to nie jest tekst o tym, że „piramida nie działa". Ekonomia poziomów działa dalej: test jednostkowy nadal jest o dwa-trzy rzędy wielkości szybszy i tańszy w diagnozie niż test przeglądarkowy. Umarł kształt - sztywne trzy piętra i proporcje rysowane bez patrzenia na architekturę projektu.

## Co zmieniła dekada: trzy nowe piętra w środku

W architekturze mikroserwisowej logika biznesowa rozpada się na procesy gadające po sieci. Test jednostkowy serwisu zamówień powie ci, że serwis poprawnie liczy sumę - ale nie powie, że serwis płatności zmienił format odpowiedzi i całość leży. Najciekawsze błędy przeniosły się ze środka funkcji na granice między serwisami, a tam klasyczna piramida miała białą plamę.

Tę plamę wypełniły trzy rodzaje testów. **Testy kontraktowe** (np. w narzędziu Pact) sprawdzają, czy serwisy dotrzymują uzgodnionego formatu wymiany - konsument zapisuje oczekiwania, dostawca je weryfikuje, każdy testuje u siebie, bez stawiania całego środowiska. **Testy integracyjne na kontenerach** (np. Testcontainers) odpalają prawdziwą bazę danych czy kolejkę w kontenerze na czas testu - koniec z atrapami bazy, które przepuszczały błędy w zapytaniach SQL. **Testy API** uderzają w punkty końcowe usługi przez HTTP, omijając interfejs graficzny - sprawdzają logikę całej usługi przy ułamku kosztu testu przeglądarkowego.

Do tego doszła zmiana na samym wierzchołku: testy e2e (przechodzące przez cały system, od przeglądarki po bazę) pisane i naprawiane z pomocą agentów AI. Playwright plus agent piszący selektory i scenariusze obniżył koszt utworzenia testu e2e kilkukrotnie. I to jest pułapka, do której wrócę - bo taniość tworzenia nie zmienia kosztu utrzymania i czasu wykonania.

## Agenty AI na wierzchołku: tańsze pisanie, ta sama fizyka

Osobny akapit dla zjawiska, które w 2026 roku zmienia rozkłady testów najszybciej. Agent podpięty do Playwright potrafi z opisu „użytkownik dodaje produkt do koszyka i płaci kartą" wygenerować działający test w kwadrans, a po zmianie interfejsu zaproponować poprawkę selektorów. Bariera wejścia w testy przeglądarkowe spadła tak nisko, że zespoły zaczęły nimi pokrywać wszystko - bo „przecież agent napisze".

Tylko że agent obniżył wyłącznie koszt utworzenia testu. Nie zmienił trzech pozostałych składników rachunku: czasu wykonania (test przeglądarkowy nadal trwa pół minuty do kilku minut), niestabilności (nadal zależy od środowiska, danych i sieci) oraz kosztu diagnozy (czerwony test e2e nadal mówi „gdzieś nie działa", nie „ta funkcja zwraca złą wartość"). Zespół, który wygenerował 200 testów przeglądarkowych w miesiąc, po pół roku ma czterdziestominutowy potok i poranny rytuał restartowania czerwonych przebiegów. Lody na patyku w wersji przyspieszonej - antywzorzec, do którego za chwilę wrócę, tyle że osiągnięty dziesięć razy szybciej niż kiedyś.

## Gdzie piramida kłamie

Rysunek zakłada, że każdy projekt ma ten sam rozkład logiki. Nieprawda - i stąd dwa typowe przypadki, gdzie ślepe trzymanie się piramidy szkodzi.

**Front ciężki w logikę.** Aplikacja typu arkusz kalkulacyjny czy edytor, gdzie 70% logiki żyje w przeglądarce: walidacje, przeliczenia, stany interfejsu. Piramida każe pisać głównie testy jednostkowe „na dole" - ale dół jest tu cienki, prawdziwa złożoność siedzi w komponentach interfejsu i ich interakcjach. Zdrowy rozkład dla takiego projektu ma grubą warstwę testów komponentów uruchamianych w przeglądarce i to jest w porządku, choć rysunek robi się brzuchaty.

**Mikroserwis bez interfejsu.** Usługa przetwarzająca zdarzenia, wystawiająca API, zero ekranu. Wierzchołek piramidy nie istnieje, a najwyższym sensownym poziomem jest test API plus kontrakt. Zespoły, które „dla kompletności" dopisują testy przeglądarkowe przechodzące przez cudzy interfejs konsumujący ich usługę, fundują sobie najdroższe i najbardziej niestabilne testy w firmie - dla cudzego kodu.

> Piramida nie jest celem, do którego się dąży. Jest skutkiem ubocznym dobrych decyzji o tym, na którym poziomie najtaniej złapać konkretny rodzaj błędu. Jeśli twój rozkład wygląda inaczej niż rysunek, najpierw sprawdź, czy twoja architektura nie wygląda inaczej niż monolit z 2009 roku.

## Dwa antywzorce, które trzeba umieć rozpoznać

**Lody na patyku** (odwrócona piramida): masa testów ręcznych i przeglądarkowych na górze, cienki patyczek testów jednostkowych na dole. Tak wygląda projekt, w którym automatyzację zaczęto „od tego, co widzi użytkownik". Objawy: pełny przebieg regresji trwa całą noc, 10-15% testów wywraca się losowo, zespół ma etat „opiekuna testów", który nic nie testuje, tylko restartuje czerwone przebiegi. Koszt utrzymania rośnie szybciej niż pokrycie.

**Klepsydra**: dużo testów jednostkowych na dole, dużo testów e2e na górze, pusty środek. Częsta w zespołach, gdzie programiści piszą testy jednostkowe „bo tak trzeba", a QA buduje testy przeglądarkowe „bo to jedyne, co kontroluje". Objawy: obie grupy raportują zielono, a błędy i tak wychodzą na integracji - bo nikt nie testuje granic między modułami. Środek klepsydry to dokładnie miejsce na testy API i kontraktowe.

## Zdrowy rozkład w typowym projekcie webowym

Syntetyczny przykład: NotkaApp, aplikacja do notatek zespołowych. Front w React, trzy usługi backendowe, PostgreSQL, kolejka zdarzeń. Rozkład, który u takiego projektu uznałbym za zdrowy:

| Poziom | Udział | Czas przebiegu | Co łapie | Kiedy uruchamiany |
|---|---|---|---|---|
| Jednostkowe | ~55% | sekundy | logika funkcji, przeliczenia, walidacje | każdy zapis kodu |
| Integracyjne na kontenerach | ~15% | 2-4 min | zapytania do bazy, kolejki, transakcje | każda zmiana w gałęzi |
| Kontraktowe | ~10% | sekundy | zgodność formatów między usługami | każda zmiana w gałęzi |
| API | ~12% | 1-3 min | logika usługi przez HTTP, uprawnienia, błędy | każda zmiana w gałęzi |
| E2e w przeglądarce | ~8% | 5-15 min | krytyczne ścieżki użytkownika, sklejenie całości | przed scaleniem + co noc |

Procenty to orientacja, nie norma do audytu. Ważniejsze są dwa progi: pełny potok (pipeline) walidacji zmiany powinien mieścić się w 10-15 minutach, a testów e2e powinno być tyle, ile krytycznych ścieżek użytkownika - w NotkaApp osiem, nie osiemdziesiąt.

## Heurystyki zamiast dogmatu

Zamiast pilnować kształtu rysunku, pilnuję czterech reguł. Po pierwsze: każdy błąd łap na najniższym poziomie, na którym da się go wiarygodnie odtworzyć - błąd zaokrąglenia to test jednostkowy, błąd formatu odpowiedzi to kontrakt, błąd „koszyk znika po wylogowaniu" to e2e. Po drugie: jeśli test e2e wywraca się z powodu, który złapałby test API, przepisz go w dół i skasuj oryginał. Po trzecie: tani w napisaniu nie znaczy tani w posiadaniu - agent AI wygeneruje ci 50 testów przeglądarkowych w godzinę, ale każdy z nich będziesz wykonywał i utrzymywał latami; licz koszt cyklu życia, nie koszt utworzenia. Po czwarte: pusty środek boli najpóźniej, ale najmocniej - inwestycja w testy API i kontraktowe zwraca się dokładnie wtedy, gdy system zaczyna się rozpadać na usługi.

A jeśli twój projekt już dziś wygląda jak lody na patyku? Nie przepisuj wszystkiego. Kolejność, która działa: najpierw zmierz, które testy e2e wywracają się najczęściej i które trwają najdłużej - to kandydaci do zepchnięcia w dół. Potem dla każdego z nich odpowiedz na pytanie, jaki błąd naprawdę łapie: jeśli logikę usługi, przepisz na test API; jeśli format wymiany, na kontrakt; jeśli faktyczne sklejenie ekranu z systemem, zostaw. Na końcu skasuj oryginał - przepisanie bez kasowania powiększa zestaw zamiast go leczyć. Tempo dwóch-trzech testów na sprint wystarczy: po dwóch kwartałach rozkład wygląda inaczej, a zespół nie stanął ani na dzień.

## Podsumowanie

Z klasycznej piramidy przetrwały obie idee fundamentalne: błędy łap jak najniżej, testów drogich trzymaj mało. Nie przetrwał sam rysunek - środek piramidy rozrósł się o testy kontraktowe, integracyjne na kontenerach i API, a kształt zdrowego rozkładu zależy dziś od tego, gdzie w twojej architekturze mieszka logika. Antywzorce poznasz po objawach: lody na patyku po nocnej regresji i etacie restartowacza, klepsydrę po zielonych raportach i czerwonej integracji. Narysuj rozkład testów swojego projektu w tabeli jak wyżej - sam kształt powie ci więcej niż niejeden audyt.
