---
title: "AI w Smart Home, część 7: Dom, który planuje - optymalizacja energii z prognozami"
description: "Siódma część mini-serii o AI w smart home. Budujemy planistę energii: ceny prądu, prognoza produkcji z fotowoltaiki i kalendarz jako dane wejściowe, LLM jako planista z ograniczeniami, dziennik decyzji i uczciwy rachunek opłacalności."
date: 2026-07-20
tags: ["ai", "smart home", "home assistant", "energia", "optymalizacja"]
lang: pl
readingTime: 9
author: [JS, GH]
---

Twój dom zna prognozę pogody, cennik prądu na jutro i twój kalendarz. To wystarczy, żeby AI ułożyło plan dnia dla bojlera, ładowania auta i ogrzewania - i potrafiło wytłumaczyć każdą decyzję. W tej części budujemy planistę energii: od danych wejściowych, przez dziennik decyzji, po uczciwy rachunek, kiedy to się w ogóle opłaca.

## Trzy źródła danych, które dom już ma albo łatwo zdobędzie

Planowanie zużycia energii stoi na trzech nogach. Pierwsza to **cena prądu w czasie**. Przy taryfie dynamicznej dom może dostać ceny na kolejne bloki rynku dnia następnego, ale moment publikacji i sposób przeliczenia zależą od sprzedawcy. W 2026 roku okres rozliczania może wynosić 15 minut, więc nie należy zakładać pełnych godzin. Przy zwykłej taryfie strefowej sprawa jest prostsza - okna tańszej strefy są zapisane w umowie.

Druga noga to **prognoza produkcji**, jeśli masz fotowoltaikę. Integracje typu Forecast.Solar przeliczają prognozę pogody i parametry instalacji na spodziewaną produkcję - z błędem, który trzeba uwzględnić. Energia z dachu nie jest dosłownie darmowa: jej użycie ma wartość alternatywną wynikającą z zasad rozliczenia nadwyżek.

Trzecia noga to **kalendarz i wzorce domu**. Wyjazd o 6:30 oznacza, że woda ma być gorąca do 6:00, a auto naładowane wieczorem, nie nad ranem. Praca z domu oznacza wyższą temperaturę w gabinecie w godzinach, w których normalnie dom by oszczędzał.

## Co naprawdę da się przesunąć

Tu pierwsza dawka realizmu: większości zużycia nie przesuniesz. Lodówka, oświetlenie, kuchenka, telewizor - to się dzieje, kiedy się dzieje. Przesuwalne są urządzenia, które magazynują efekt swojej pracy:

- **bojler** - magazynuje ciepłą wodę, więc może grzać o 2:00 zamiast o 18:00;
- **auto elektryczne** - magazynuje energię i często daje kilkugodzinne okno ładowania przed kolejnym wyjazdem;
- **ogrzewanie z bezwładnością** - podłogówka albo dom o dobrej izolacji pozwalają przegrzać budynek o 1 stopień w taniej godzinie i przeczekać drogą;
- **pralka, zmywarka, suszarka** - cykl można opóźnić o kilka godzin bez żadnej straty komfortu.

Udział tych kategorii zależy od ogrzewania, auta, liczby domowników i ich zwyczajów. Zmierz go przed zakupem sterowników, bo to on zdecyduje o opłacalności projektu.

## Architektura: LLM planuje, automatyzacja wykonuje

Wzorzec znany z [poprzednich części serii](/pl/blog/ai-smart-home-automatyzacje/) obowiązuje i tutaj, w najczystszej postaci. Model językowy jest planistą z ograniczeniami: raz dziennie, np. o 21:00, dostaje jutrzejszy cennik, prognozę produkcji z dachu, stan naładowania auta, kalendarz i listę twardych warunków. Zwraca plan w formie strukturalnej - harmonogram z godzinami startu urządzeń plus uzasadnienie każdej pozycji.

Wykonaniem zajmuje się klasyczna, deterministyczna automatyzacja, która zna warunki nieprzekraczalne i sprawdza je niezależnie od planu: woda minimum 50 stopni do 6:00, auto minimum 60% przed pierwszym wyjazdem z kalendarza, temperatura w domu nigdy poniżej 19 stopni. Jeśli plan modelu narusza warunek brzegowy, wygrywa warunek, nie plan. Model może się mylić, a bariery ochronne też mogą mieć błąd konfiguracji - dlatego potrzebują testów, bezpiecznych wartości domyślnych i ręcznego nadpisania.

Dlaczego w ogóle LLM, skoro istnieją gotowe algorytmy optymalizacji? Uczciwie: dla samego harmonogramu bojlera wystarczy zwykłe "wybierz 3 najtańsze godziny nocy". Model językowy wnosi dwie rzeczy: łączy źródła, których sztywny algorytm nie zna (kalendarz, nietypowe sytuacje, twoje notatki o planach), oraz tłumaczy decyzje ludzkim językiem. Ta druga rzecz okazała się u nas ważniejsza, niż się spodziewaliśmy.

## Prompt planisty: ograniczenia ważniejsze niż cel

Z doświadczeń Grzegorza z agentami w pracy wynika jedna zasada, która przenosi się na dom jeden do jednego: model optymalizujący bez jawnych ograniczeń zoptymalizuje ci życie w sposób, którego nie chcesz. Planista, któremu każesz "minimalizuj koszt energii", chętnie zostawi cię z zimną wodą o 6:00, bo taniej było nie grzać.

Dlatego prompt planisty składa się w większości z ograniczeń, nie z celu. Poniższe temperatury są tylko przykładem komfortu, a nie kompletnym programem higieny ciepłej wody - ochronę przed Legionellą ustaw zgodnie z instalacją i zaleceniami producenta:

- woda minimum 50 stopni między 5:30 a 7:00 oraz między 20:00 a 22:00;
- auto naładowane minimum do poziomu z kalendarza na godzinę przed pierwszym wyjazdem;
- temperatura w pomieszczeniach nigdy poniżej 19 stopni, w pokoju dziecka nigdy poniżej 20;
- pralka i zmywarka nie startują między 22:00 a 7:00 (hałas), suszarka tylko gdy ktoś jest w domu;
- maksymalnie 3 urządzenia dużej mocy jednocześnie (ograniczenie przyłącza);
- jeśli dane wejściowe są niepełne, zaplanuj wariant bezpieczny i zaznacz to w uzasadnieniu.

Dopiero po liście ograniczeń przychodzi cel: w wolnych ramach minimalizuj koszt, preferuj własną produkcję z dachu nad zakup z sieci. Taka kolejność brzmi pedantycznie, ale to ona decyduje, czy plan jest pomocny, czy uciążliwy.

## Dziennik decyzji, czyli zaufanie do automatu

Dom, który nocą sam włącza i wyłącza urządzenia, budzi nieufność - dokładnie do momentu, w którym zaczyna się tłumaczyć. Każda pozycja planu trafia u nas do dziennika decyzji: prostego logu na panelu, po jednym zdaniu na decyzję.

```
21:04 PLAN na wtorek 21.07:
- Bojler: 02:00-04:00 (cena 0,34 zl/kWh, prognoza PV slaba: 2,1 kWh,
  kalendarz: wyjazd 6:30, woda gotowa przed 6:00)
- Auto: 01:00-05:30 do 80% (najtansze okno nocy, jutro 90 km wg kalendarza)
- Zmywarka: start 13:00 (szczyt prognozy PV, 3,4 kW z dachu)
- Ogrzewanie: +1 st. C 05:00-07:00, obnizenie 18:00-20:00 (szczyt cenowy 1,12 zl/kWh)
```

Dziennik pełni trzy funkcje. Buduje zaufanie domowników, bo "czemu pralka ruszyła o 13?" ma odpowiedź na panelu. Ułatwia debugowanie, bo zły plan widać razem z danymi, na których powstał. I dyscyplinuje prompt - jeśli model nie umie krótko uzasadnić decyzji, to zwykle znak, że decyzja jest losowa.

Do dziennika należy też dopisywać odstępstwa: każde ręczne nadpisanie planu przez domownika to wpis "plan przewidywał X, człowiek wybrał Y". Przycisk "grzej teraz" na panelu musi istnieć i działać bez dyskusji - dom, w którym nie da się wziąć gorącego prysznica poza harmonogramem, to dom źle zaprojektowany, niezależnie od oszczędności. A jeśli odstępstwa się powtarzają, to nie domownicy są problemem, tylko ograniczenia w prompcie do poprawy.

## Policzmy: syntetyczny DomDemo

Weźmy całkowicie syntetyczny DomDemo: rodzina 2+2, auto elektryczne, bojler elektryczny oraz umowa, w której przyjmujemy średnio 0,35 zł/kWh w wybranych tanich blokach i 1,10 zł/kWh w drogim oknie 17:00-21:00. To założenia do pokazania rachunku, nie aktualny cennik ani typowy profil każdego domu. Dla uproszczenia tabela porównuje zmienny koszt zakupu energii; pełna ocena musi uwzględniać umowę, dystrybucję, podatki i opłaty.

| Urządzenie | Energia rocznie | Bez planu (śr. cena) | Z planem (śr. cena) | Oszczędność |
|---|---|---|---|---|
| Auto (15 000 km, 18 kWh/100 km) | 2700 kWh | 0,85 zł/kWh | 0,38 zł/kWh | ok. 1270 zł |
| Bojler (6 kWh/dobę) | 2190 kWh | 0,80 zł/kWh | 0,40 zł/kWh | ok. 880 zł |
| Pralka i zmywarka (450 cykli po 1,1 kWh) | 495 kWh | 0,75 zł/kWh | 0,45 zł/kWh | ok. 150 zł |

Jeśli DomDemo ma jeszcze fotowoltaikę, dochodzi druga dźwignia: zużycie własnej produkcji. Każda kilowatogodzina zmywarki przesunięta z wieczora na południe może zastąpić zakup z sieci, ale jednocześnie rezygnujesz z wartości jej rozliczenia jako nadwyżki. Wzrost autokonsumpcji policz z profilu produkcji i zużycia, bo sama moc instalacji 5 kWp nie pozwala obiecać konkretnej liczby punktów procentowych ani kwoty.

W tabeli wychodzi około 2300 zł rocznie, ale tylko przy jej założeniach i przed pełnym rachunkiem. Po stronie kosztów uwzględnij sterowanie odpowiednie do mocy bojlera i ładowarki, montaż przez osobę z właściwymi uprawnieniami, ewentualne styczniki i zabezpieczenia, serwer, energię do jego pracy, zapytania do modelu oraz utrzymanie konfiguracji. Lokalny model nie ma opłaty za zapytanie, ale sprzęt i prąd nadal kosztują. Okres zwrotu wynika z pełnego porównania, a nie z ceny samego przekaźnika.

## Granice opłacalności

Teraz druga dawka realizmu. Wykreśl z tabeli auto - zostaje ok. 1000 zł rocznie. Wykreśl taryfę dynamiczną i zostaw zwykłą G11 z jedną ceną - zostaje zero, bo nie ma czego optymalizować cenowo (zostaje tylko zużycie własnej produkcji z PV, jeśli ją masz). Dom bez auta elektrycznego, bez fotowoltaiki i bez taryfy strefowej lub dynamicznej nie potrzebuje planisty energii - potrzebuje najwyżej [części szóstej tej serii](/pl/blog/ai-smart-home-wykrywanie-anomalii/), czyli wykrywania, że coś zużywa za dużo.

Prosty test przed startem: policz, ile kilowatogodzin rocznie realnie przesuniesz i przelicz dwa pełne rachunki według własnej umowy. Zrób też warianty, w których plan uda się wykonać na przykład w 60%, 80% i 100% dni, zamiast odejmować arbitralny stały procent. Jeśli wynik nie pokrywa kosztów i zapasu na niepewność, odpuść albo ogranicz się do jednej automatyzacji bojlera na sztywnym harmonogramie - bez prognoz, bez modelu, bez dziennika.

## Podsumowanie

Planowanie energii jest wymierne, bo efekt da się porównać na rachunku. Składniki są trzy - ceny w czasie, prognoza produkcji, kalendarz - a wzorzec architektury niezmienny: model proponuje i uzasadnia, deterministyczna automatyzacja wykonuje w granicach przetestowanych warunków. Dziennik decyzji ułatwia zrozumienie działania automatu. Policz swój potencjał przesunięcia zanim zaczniesz - auto elektryczne i zmienna cena mogą zwiększyć potencjał, ale nie gwarantują oszczędności. Jeśli liczby wyjdą na plus, zacznij od jednego kontrolowanego odbiornika i zweryfikuj wynik na rachunku przed rozbudową systemu.
