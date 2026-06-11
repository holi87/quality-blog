---
title: "Syntetyczne dane testowe z LLM: jak generować realistyczne dane bez wycieku produkcji"
description: "Kontrakt danych, deterministyczny walidator, celowane przypadki brzegowe i trzy pułapki syntezy - jak generować dane testowe z LLM bez kopiowania produkcji i bez ryzyka RODO."
date: 2026-08-13
tags: ["ai", "qa", "llm", "dane-testowe", "rodo"]
lang: pl
readingTime: 9
author: GH
---

Kopiowanie danych produkcyjnych do środowisk testowych to bomba zegarowa pod RODO: prawdziwe nazwiska, adresy i numery PESEL lądują w bazach o słabszych zabezpieczeniach, dostępnych dla pół firmy i podwykonawców. LLM daje realną alternatywę - dane statystycznie podobne do produkcji i całkowicie zmyślone. Ale "poproś model o tysiąc klientów" to przepis na dane, które wyglądają dobrze i nie nadają się do niczego. W tym wpisie pokazuję, jak zrobić to porządnie: od kontraktu danych, przez walidację spójności, po przypadki brzegowe na żądanie - i trzy pułapki, w które wpada prawie każdy.

## Dlaczego kopia produkcji to bomba zegarowa

Argument prawny jest znany: dane osobowe w środowisku testowym to nadal dane osobowe, ze wszystkimi obowiązkami - podstawą przetwarzania, ograniczeniem dostępu, retencją, zgłaszaniem naruszeń. Środowiska testowe niemal z definicji mają szersze grono dostępu i słabsze monitorowanie, więc wyciek stamtąd jest bardziej prawdopodobny, a tłumaczenie przed urzędem trudniejsze.

Ale jest też argument inżynierski, o którym mówi się rzadziej: kopia produkcji to złe dane testowe. Zawiera miliony rekordów przeciętnych i ani jednego skrajnego, którego akurat potrzebujesz. Anonimizacja, robiona porządnie, niszczy rozkłady i relacje; robiona po łebkach - nie anonimizuje. Widziałem oba warianty: zbiór tak wymaskowany, że testy raportów przestały mieć sens, i zbiór "zanonimizowany" podmianą imion, w którym numery telefonów i adresy zostały oryginalne. Synteza danych nie jest więc tylko unikiem przed RODO. Jest okazją, żeby dane testowe wreszcie projektować, zamiast dziedziczyć.

## Kontrakt najpierw, generowanie potem

Pierwsza zasada: model nie wymyśla struktury danych, tylko wypełnia strukturę zadaną. Punktem wyjścia jest kontrakt - schemat JSON, definicja tabel albo specyfikacja typów - z jawnymi regułami: format pola, zakresy wartości, pola wymagane, dozwolone słowniki. Do tego reguły biznesowe, których żaden schemat nie wyrazi: data zakończenia umowy po dacie rozpoczęcia, suma pozycji zamówienia równa kwocie zamówienia, klient niepełnoletni nie ma umowy kredytowej.

Prompt generujący dostaje trzy rzeczy: kontrakt, reguły biznesowe i parametry rozkładu ("80 procent klientów indywidualnych, 20 procent firmowych; wiek od 18 do 95 z medianą 42"). Wyjście ma być w formacie maszynowym - JSON lub CSV - nigdy w prozie. Dla dużych wolumenów lepszy jest wariant pośredni: model nie generuje miliona rekordów (to drogie i wolne), tylko generuje skrypt generatora w Pythonie zgodny z kontraktem, a skrypt produkuje dane lokalnie. LLM projektuje różnorodność, kod zapewnia skalę.

Skąd model ma wiedzieć, jak wyglądają realistyczne rozkłady, skoro nie pokazujemy mu produkcji? Z dwóch legalnych źródeł. Pierwsze to statystyki zagregowane: rozkład wieku, proporcje typów klientów, histogram wartości zamówień - liczby policzone zapytaniem na produkcji przez osobę z dostępem, bez ani jednego rekordu osobowego w wyniku. Drugie to wiedza dziedzinowa zespołu: "klienci firmowi zamawiają rzadziej, ale pięciokrotnie drożej", "szczyt rejestracji jest w styczniu". Oba źródła mieszczą się w promptcie i żadne nie wynosi danych osobowych poza systemy produkcyjne.

## Walidacja spójności, czyli nieufność jako proces

Wygenerowane dane traktuję jak każdy inny niesprawdzony materiał: nie wchodzą do środowiska bez przejścia walidatora. Walidator to zwykły kod, nie drugi model - sprawdzanie reguł deterministycznych to robota dla deterministycznego narzędzia. Cztery warstwy kontroli:

- **Zgodność ze schematem:** typy, formaty, pola wymagane. Najtańsza warstwa, łapie najwięcej.
- **Relacje:** każde zamówienie wskazuje istniejącego klienta, każda pozycja istniejący produkt. Modele generujące tabele osobno notorycznie psują klucze obce.
- **Sumy kontrolne i reguły pochodne:** PESEL z poprawną cyfrą kontrolną, NIP z poprawną sumą ważoną, kwota brutto równa netto plus VAT, suma pozycji równa wartości zamówienia.
- **Rozkłady:** czy zadane proporcje są z grubsza trzymane - jeśli prosiłem o 20 procent firm, a dostałem 3 procent, generacja wraca do poprawki.

Uwaga praktyczna do numerów identyfikacyjnych: modele potrafią wygenerować PESEL wyglądający poprawnie, ale z błędną cyfrą kontrolną - albo, co gorsza, z poprawną, czyli potencjalnie należący do żywej osoby. Dlatego identyfikatory liczy kod walidatora, nie model: data i płeć z rekordu, seria losowa, cyfra kontrolna z algorytmu. Model dostarcza człowieka, kod dostarcza numer.

## Przypadki brzegowe na żądanie - tu LLM naprawdę błyszczy

Przewaga modelu nad klasycznymi bibliotekami danych losowych nie leży w masie, tylko w celowanej różnorodności. Bibliotece trzeba brzegówki zaprogramować; modelowi wystarczy je opisać. Mój stały zestaw zamówień dla aplikacji typu NotkaApp:

- nazwiska z pełnym polskim alfabetem: Żółć-Gręboszewska, Łękawski, Ćwiąkała - łamią systemy z błędną obsługą kodowania znaków;
- nazwiska wieloczłonowe i bardzo długie (50+ znaków) - łamią ograniczenia długości kolumn i układ interfejsu;
- daty graniczne: 29 lutego roku przestępnego, urodzeni przed 1900, daty na przełomie stref czasowych;
- PESEL-e osób urodzonych po 1999 (inne kodowanie stulecia w miesiącu) i testowe serie;
- adresy nietypowe: miejscowość bez ulicy, numer 1/3/5, nazwy jednoliterowe;
- wartości puste tam, gdzie schemat pozwala, i minimalne tam, gdzie nie pozwala.

Każdy taki przypadek to potencjalny raport błędu, który inaczej przyszedłby z produkcji. Koszt wygenerowania - jedno zdanie w promptcie. W kopii produkcji te przypadki też istnieją, ale rozcieńczone milionami przeciętnych rekordów; w zbiorze syntetycznym sadzasz je celowo i wiesz dokładnie, który test ma na nie trafić.

## Dane jako artefakt z wersją, nie jednorazowy zrzut

Najczęstszy błąd organizacyjny: synteza jako akcja jednorazowa. Ktoś generuje paczkę danych, wrzuca do środowiska, po trzech miesiącach schemat się zmienia, dane przestają pasować i zespół wraca do kopiowania produkcji, "bo przynajmniej działa". Żeby synteza przetrwała, dane muszą stać się artefaktem inżynierskim z pełnym cyklem życia.

W praktyce oznacza to trzy rzeczy. Kontrakt danych i prompty generujące żyją w repozytorium obok kodu - zmiana schematu w migracji bazy pociąga zmianę kontraktu w tym samym przeglądzie kodu. Zbiory mają wersje i przeznaczenie: mały zbiór bazowy (kilkaset rekordów) do testów automatycznych, odtwarzany przy każdym przebiegu dla pełnej powtarzalności, oraz duży zbiór wolumenowy do testów wydajności, regenerowany skryptem na żądanie. I wreszcie - walidator chodzi w CI: każda zmiana kontraktu albo promptu odpala generację próbki i pełną walidację, więc rozjazd schematu z danymi wychodzi w minuty, nie w miesiące.

Warto też od razu ustalić właściciela. Dane testowe bez właściciela gniją tak samo jak testy bez właściciela. U mnie sprawdza się model, w którym kontraktem opiekuje się ta sama osoba, która opiekuje się testami danego obszaru - bo to ona pierwsza widzi, że brzegówki przestały wystarczać.

## Trzy pułapki syntezy

Pierwsza: **monotonia**. Model proszony o tysiąc rekordów bez parametrów rozkładu wygeneruje tysiąc wariacji tego samego przeciętnego klienta - Jan Kowalski, lat około 35, z Warszawy, jedno zamówienie za 150 złotych. Dane przejdą walidację i nie znajdą żadnego błędu, bo nie zawierają żadnego napięcia. Obrona: jawne rozkłady w promptach i walidacja różnorodności (liczba unikalnych wartości na kolumnę).

Druga: **wzorce, których model unika**. Modele mają wyuczone nawyki: zaokrąglają kwoty, preferują popularne imiona, unikają dat sprzed swojej wiedzy, omijają wartości kulturowo niezręczne. W efekcie syntetyczna populacja ma dziury dokładnie tam, gdzie produkcja je wypełnia. Tę pułapkę łapie się porównaniem rozkładów syntetycznych z produkcyjnymi - na poziomie statystyk, nie rekordów, więc bez wynoszenia danych osobowych.

Trzecia: **przypadkowe podobieństwo do prawdziwych osób**. Wygenerowany "Tomasz Wiśniewski, ul. Polna 7, Radom" prawie na pewno gdzieś istnieje. Dopóki to zbieg okoliczności na poziomie pojedynczych pól, ryzyko jest akademickie - ale nie wolno modelowi pokazywać prawdziwych rekordów jako wzorców do naśladowania, bo wtedy podobieństwo przestaje być przypadkowe i robi się z tego pseudonimizacja na skróty. Do modelu idą wyłącznie statystyki i schematy, nigdy surowe rekordy produkcyjne.

> Syntetyczne dane nie są kopią produkcji bez ryzyka. Są osobnym produktem inżynierskim z własnym kontraktem, własną walidacją i własnymi trybami awarii - i dopiero traktowane w ten sposób stają się bezpieczniejsze i lepsze od kopii.

## Podsumowanie

Przepływ syntezy danych testowych z LLM ma cztery elementy: kontrakt danych z regułami biznesowymi jako wejście, generowanie w formacie maszynowym (dla skali - model pisze generator, nie rekordy), deterministyczny walidator czterech warstw (schemat, relacje, sumy kontrolne, rozkłady) i celowane przypadki brzegowe na żądanie - od polskich znaków po graniczne daty. Trzy pułapki do aktywnego pilnowania: monotonia bez zadanych rozkładów, systemowe dziury w miejscach, których model unika, i zasada, że surowe rekordy produkcyjne nigdy nie trafiają do promptu. Dobry pierwszy krok: weź jedną tabelę ze swojego systemu, spisz jej kontrakt z regułami biznesowymi i poproś model o pięćdziesiąt rekordów z dziesięcioma celowanymi brzegówkami - a potem puść na nie swój pakiet testów i policz, ile nowych błędów wyskoczy.
