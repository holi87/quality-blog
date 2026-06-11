---
title: "Dług testowy: jak go zmierzyć, pokazać biznesowi i spłacać bez zatrzymywania zespołu"
description: "Definicja operacyjna długu testowego, sześć mierzalnych sygnałów, wycena w godzinach i ryzyku oraz strategia spłaty, która nie wymaga zatrzymywania dostarczania na sprint naprawczy."
date: 2026-07-22
tags: ["qa", "dlug-testowy", "testy", "metryki", "proces"]
lang: pl
readingTime: 9
author: GH
---

Każdy zespół, z którym pracowałem, miał testy wyłączone „tymczasowo" - średnio od ośmiu miesięcy - i wskaźnik pokrycia, w który nikt nie wierzył. To jest dług testowy: różnica między tym, co twoje testy obiecują, a tym, co naprawdę sprawdzają. W tym tekście daję definicję operacyjną, listę mierzalnych sygnałów, sposób wyceny w godzinach i ryzyku oraz strategię spłaty, która nie wymaga zatrzymywania dostarczania na „sprint naprawczy".

## Definicja operacyjna: dług, który da się policzyć

Dług testowy definiuję tak: suma rozjazdów między deklarowanym a faktycznym zabezpieczeniem systemu przez testy, wyrażona w godzinach pracy potrzebnych do usunięcia rozjazdu albo w ryzyku, które rozjazd przykrywa. Kluczowe słowo: rozjazd. Brak testów w świadomie odpuszczonym obszarze (pisałem o tym przy testowaniu opartym na ryzyku) nie jest długiem - jest decyzją. Długiem jest test, który istnieje i kłamie, oraz luka, o której nikt nie wie.

Ta definicja od razu odcina jałową dyskusję „mamy za mało testów". Może macie ich w sam raz. Problem w tym, że jedna trzecia jest wyłączona, kolejna część przechodzi niezależnie od stanu kodu, a pokrycie krytycznej ścieżki płatności wynosi 12%, choć raport całościowy pokazuje dumne 78%.

## Skąd dług się bierze: trzy uczciwe odpowiedzi

Zanim zacznę mierzyć, nazywam źródła - bo spłata bez zakręcenia kranu nie ma sensu. Źródło pierwsze: presja terminu. Test wyłączony „na chwilę", żeby zdążyć z wydaniem, plus brak mechanizmu, który by o nim przypomniał. Intencja była uczciwa, dług robi się z braku terminu zwrotu.

Źródło drugie: zmiana bez aktualizacji testów. System się rozwija, testy zostają. Scenariusz pisany pod stary proces zamówień przechodzi dalej, bo sprawdza rzeczy, które przestały być istotne - zielony kolor bez wartości informacyjnej. To najgroźniejsze źródło, bo niewidoczne: nic nie jest wyłączone, wskaźniki wyglądają dobrze.

Źródło trzecie: testy pisane pod wskaźnik, nie pod ryzyko. Gdy organizacja rozlicza zespół z procentu pokrycia, zespół dostarcza procent pokrycia - testami trywialnych ścieżek, bo te są najtańsze. Krytyczne ścieżki pozostają cienkie, bo są najdroższe w testowaniu. Wskaźnik rośnie, zabezpieczenie nie.

## Sygnały: po czym poznać dług w swoim projekcie

Dług testowy zostawia mierzalne ślady. Sześć sygnałów, które zbieram w pierwszej kolejności:

| Sygnał | Jak zmierzyć | Próg alarmowy |
|---|---|---|
| Testy pominięte | liczba adnotacji wyłączających w kodzie testów + wiek najstarszej (z historii repozytorium) | >5% zestawu lub pominięcie starsze niż 3 miesiące |
| Testy niestabilne (flaky) | odsetek przebiegów, w których test zmienia wynik bez zmiany kodu | >2% zestawu zachowuje się losowo |
| Luki pokrycia krytycznych ścieżek | pokrycie liczone osobno dla modułów krytycznych, nie średnia całości | moduł krytyczny <60% przy średniej >75% |
| Przestarzałe dane testowe | wiek zrzutów i rekordów wzorcowych względem zmian schematu | dane starsze niż 2 wersje schematu |
| Rosnąca regresja ręczna | godziny ręcznej regresji na wydanie, trend kwartalny | wzrost >20% kwartał do kwartału |
| Testy zaufania zerowego | testy bez asercji, testy zawsze zielone (sprawdź mutacją: zepsuj kod, czy test spadnie?) | każdy znaleziony |

Zebranie tych sześciu liczb dla średniego projektu zajmuje dzień, góra dwa. Większość wyciąga się skryptem z repozytorium i raportów potoku CI/CD. To tani audyt o nieprzyzwoicie wysokim zwrocie.

## Wycena: godziny i ryzyko, nie procenty

Surowe sygnały trzeba przeliczyć na dwie waluty. Pierwsza: godziny spłaty. Dla każdej pozycji szacunek naprawy - odblokowanie i naprawa pominiętego testu to średnio 1-3 godziny, ustabilizowanie niestabilnego 2-6 godzin, pokrycie luki w krytycznej ścieżce 4-16 godzin na scenariusz. W syntetycznym projekcie SklepDemo rachunek wyszedł tak: 34 testy pominięte (~70 godzin), 18 niestabilnych (~70 godzin), luka w module zwrotów (~60 godzin), odświeżenie danych testowych (~40 godzin). Razem około 240 godzin - sześć tygodni jednej osoby.

Druga waluta: ryzyko przykryte. Każda pozycja dostaje jedno zdanie: jaki błąd może przejść niezauważony i co wtedy. „Wyłączone testy modułu zwrotów oznaczają, że błąd w naliczaniu zwrotu wykryje pierwszy klient, nie my; ostatni taki incydent kosztował 11 dni obsługi reklamacji". To zdanie robi w rozmowie z biznesem więcej niż każdy wykres pokrycia.

Dwie waluty są potrzebne obie, bo odpowiadają na różne pytania. Godziny odpowiadają na „ile to kosztuje naprawić" i pozwalają planować. Ryzyko odpowiada na „dlaczego w ogóle mamy to naprawiać" i pozwala priorytetyzować. Lista posortowana po samych godzinach zaczyna się od pozycji najtańszych, lista po samym ryzyku - od najstraszniejszych. Sortuję po stosunku ryzyka do godzin: najpierw pozycje, które za mało pracy zdejmują dużo ryzyka.

> Pokrycie, w które nikt nie wierzy, jest gorsze niż brak pokrycia. Brak pokrycia przynajmniej nie daje fałszywego spokoju przed wydaniem.

## Jak o tym mówić do biznesu

Błąd, który popełniałem latami: raportowanie długu testowego językiem inżynierskim. „Mamy 18 testów niestabilnych i pokrycie 54% w module X" - dla osoby decydującej o budżecie to szum. Działa język ryzyka i pieniędzy, w trzech krokach.

Krok pierwszy: skutek. „Nie jesteśmy w stanie wykryć błędu w naliczaniu zwrotów przed klientem". Krok drugi: koszt zaniechania na podstawie historii. „Ostatnie dwa takie błędy kosztowały łącznie 19 dni pracy zespołu i interwencję księgowości". Krok trzeci: cena rozwiązania z widełkami. „Zamknięcie tej luki to 60 godzin rozłożone na trzy sprinty, bez wstrzymywania dostarczania". Skutek, koszt, cena - w tej kolejności. Procenty pokrycia zostają w załączniku dla zainteresowanych.

I jedna zasada negocjacyjna: nigdy nie proś o „czas na poprawę jakości". To brzmi jak prośba o urlop od pracy. Proś o decyzję między dwoma ryzykami: spłacamy po kawałku teraz albo akceptujemy na piśmie, że błąd klasy X wykrywa klient.

## Strategia spłaty: po kawałku, bez zatrzymywania zespołu

Wielki „sprint naprawy testów" to najgorsza strategia spłaty: zatrzymuje dostarczanie, więc biznes się na niego nie godzi, więc dług rośnie dalej. Działa spłata strumieniowa, na trzech mechanizmach.

**Reguła harcerza**: zostaw obozowisko czystsze, niż je zastałeś. W praktyce: dotykasz modułu - naprawiasz jeden powiązany test pominięty albo niestabilny, w ramach tego samego zadania. Bez osobnego zgłoszenia, bez pytania o zgodę. To podnosi wycenę zadań o 5-10%, ale spłaca dług dokładnie tam, gdzie kod żyje - martwych modułów i tak nie warto sprzątać w pierwszej kolejności.

**Budżet 10-15% sprintu** na pozycje z listy długu, wybierane wedle rachunku ryzyka, nie wygody. Stały budżet ma kluczową cechę: jest przewidywalny dla biznesu i nie podlega cotygodniowej negocjacji. W SklepieDemo 12% pojemności sprintu spłaciło te 240 godzin w pięć miesięcy - bez jednego dnia zatrzymania dostarczania.

**Kwarantanna z terminem ważności**: test niestabilny trafia do osobnej grupy, która nie blokuje potoku, ale ma twardy termin - 30 dni na naprawę albo świadome skasowanie. Kwarantanna bez terminu to nie mechanizm spłaty, tylko cmentarz z ładniejszą nazwą. Termin pilnuje się sam, jeśli raz w tygodniu lista kwarantanny ląduje na kanale zespołu z wiekiem każdej pozycji.

Do tego jedna reguła ochronna: dług nie może rosnąć z przodu. Nowy kod bez testów albo z testem pominiętym „na chwilę" nie przechodzi przeglądu kodu. Spłacanie z tyłu przy jednoczesnym zadłużaniu z przodu to bieg w kieracie.

## Czego nie robić

Trzy antywzorce spłaty. Pierwszy: przepisywanie całego zestawu od zera, bo „stary jest beznadziejny" - po pół roku masz dwa zestawy, oba w połowie wiarygodne. Drugi: podnoszenie progu pokrycia w potoku jako „motywacja" - zespół dopisze testy bez asercji i wskaźnik wzrośnie, a dług razem z nim. Trzeci: delegowanie całej spłaty do jednej osoby „od testów" - dług powstał w całym zespole i tylko cały zespół przestanie go produkować.

I czwarty, najnowszy: hurtowe generowanie testów agentem AI jako „spłata" długu. Agent dopisze setki testów w tydzień, wskaźniki wystrzelą - ale jeśli nie sprawdzisz, że te testy spadają przy zepsutym kodzie, właśnie zamieniłeś dług widoczny na niewidoczny. Generowanie wspomagane agentem działa świetnie jako narzędzie spłaty, pod jednym warunkiem: każdy wygenerowany test przechodzi tę samą próbę mutacji co testy pisane ręcznie. Zepsuj kod, sprawdź, czy test to widzi. Bez tego kupujesz spokój, nie zabezpieczenie.

## Podsumowanie

Dług testowy to rozjazd między tym, co testy obiecują, a tym, co sprawdzają - i da się go zmierzyć w jeden-dwa dni sześcioma sygnałami: pominięcia, niestabilność, luki krytycznych ścieżek, stare dane, rosnąca regresja ręczna, testy bez wartości. Wyceniaj w godzinach i ryzyku, raportuj biznesowi sekwencją skutek-koszt-cena, spłacaj regułą harcerza plus stałym budżetem 10-15% sprintu, z kwarantanną na termin. I pilnuj jedynego progu, który naprawdę blokuje: nowy dług nie wchodzi. Policz w tym tygodniu choćby pierwszy sygnał - wiek najstarszego pominiętego testu w twoim projekcie może być wystarczającym argumentem, żeby zacząć.
