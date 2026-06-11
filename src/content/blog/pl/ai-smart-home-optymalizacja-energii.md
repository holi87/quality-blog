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

Planowanie zużycia energii stoi na trzech nogach. Pierwsza to **cena prądu w czasie**. Przy taryfie dynamicznej opartej o ceny giełdowe dom zna jutrzejszy cennik godzina po godzinie już po południu dnia poprzedniego. Przy zwykłej taryfie strefowej sprawa jest jeszcze prostsza - tanie godziny są stałe i zapisane w umowie.

Druga noga to **prognoza produkcji**, jeśli masz fotowoltaikę. Integracje typu Forecast.Solar przeliczają prognozę nasłonecznienia na spodziewane kilowatogodziny z twojej instalacji - z grubsza, ale wystarczająco, żeby odróżnić dzień, w którym bojler wygrzeje się za darmo z dachu, od dnia, w którym trzeba kupić energię nocą.

Trzecia noga to **kalendarz i wzorce domu**. Wyjazd o 6:30 oznacza, że woda ma być gorąca do 6:00, a auto naładowane wieczorem, nie nad ranem. Praca z domu oznacza wyższą temperaturę w gabinecie w godzinach, w których normalnie dom by oszczędzał.

## Co naprawdę da się przesunąć

Tu pierwsza dawka realizmu: większości zużycia nie przesuniesz. Lodówka, oświetlenie, kuchenka, telewizor - to się dzieje, kiedy się dzieje. Przesuwalne są urządzenia, które magazynują efekt swojej pracy:

- **bojler** - magazynuje ciepłą wodę, więc może grzać o 2:00 zamiast o 18:00;
- **auto elektryczne** - magazynuje energię, a stoi pod domem średnio 12 godzin na dobę;
- **ogrzewanie z bezwładnością** - podłogówka albo dom o dobrej izolacji pozwalają przegrzać budynek o 1 stopień w taniej godzinie i przeczekać drogą;
- **pralka, zmywarka, suszarka** - cykl można opóźnić o kilka godzin bez żadnej straty komfortu.

Te cztery kategorie to zwykle 30-60% rachunku w domu z autem elektrycznym i znacznie mniej bez niego. Ta proporcja zdecyduje o opłacalności całego projektu, do czego wrócimy przy liczbach.

## Architektura: LLM planuje, automatyzacja wykonuje

Wzorzec znany z [poprzednich części serii](/pl/blog/ai-smart-home-automatyzacje/) obowiązuje i tutaj, w najczystszej postaci. Model językowy jest planistą z ograniczeniami: raz dziennie, np. o 21:00, dostaje jutrzejszy cennik, prognozę produkcji z dachu, stan naładowania auta, kalendarz i listę twardych warunków. Zwraca plan w formie strukturalnej - harmonogram z godzinami startu urządzeń plus uzasadnienie każdej pozycji.

Wykonaniem zajmuje się klasyczna, deterministyczna automatyzacja, która zna warunki nieprzekraczalne i sprawdza je niezależnie od planu: woda minimum 50 stopni do 6:00, auto minimum 60% przed pierwszym wyjazdem z kalendarza, temperatura w domu nigdy poniżej 19 stopni. Jeśli plan modelu narusza warunek brzegowy, wygrywa warunek, nie plan. Model może się mylić - bariery ochronne nie.

Dlaczego w ogóle LLM, skoro istnieją gotowe algorytmy optymalizacji? Uczciwie: dla samego harmonogramu bojlera wystarczy zwykłe "wybierz 3 najtańsze godziny nocy". Model językowy wnosi dwie rzeczy: łączy źródła, których sztywny algorytm nie zna (kalendarz, nietypowe sytuacje, twoje notatki o planach), oraz tłumaczy decyzje ludzkim językiem. Ta druga rzecz okazała się u nas ważniejsza, niż się spodziewaliśmy.

## Prompt planisty: ograniczenia ważniejsze niż cel

Z doświadczeń Grzegorza z agentami w pracy wynika jedna zasada, która przenosi się na dom jeden do jednego: model optymalizujący bez jawnych ograniczeń zoptymalizuje ci życie w sposób, którego nie chcesz. Planista, któremu każesz "minimalizuj koszt energii", chętnie zostawi cię z zimną wodą o 6:00, bo taniej było nie grzać.

Dlatego prompt planisty składa się w większości z ograniczeń, nie z celu:

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

Weźmy zmyślony, ale realistyczny DomDemo: rodzina 2+2, auto elektryczne, bojler elektryczny, taryfa dynamiczna ze średnią ceną 0,35 zł/kWh w tanich godzinach i 1,10 zł/kWh w szczycie 17:00-21:00. Bez planowania domownicy robią to, co wszyscy: ładują auto po powrocie z pracy i grzeją wodę wieczorem, czyli w szczycie.

| Urządzenie | Energia rocznie | Bez planu (śr. cena) | Z planem (śr. cena) | Oszczędność |
|---|---|---|---|---|
| Auto (15 000 km, 18 kWh/100 km) | 2700 kWh | 0,85 zł/kWh | 0,38 zł/kWh | ok. 1270 zł |
| Bojler (6 kWh/dobę) | 2190 kWh | 0,80 zł/kWh | 0,40 zł/kWh | ok. 880 zł |
| Pralka i zmywarka (450 cykli po 1,1 kWh) | 495 kWh | 0,75 zł/kWh | 0,45 zł/kWh | ok. 150 zł |

Jeśli DomDemo ma jeszcze fotowoltaikę, dochodzi druga dźwignia: zużycie własnej produkcji. Każda kilowatogodzina zmywarki przesunięta z wieczora na południe, gdy dach produkuje, to energia, której nie trzeba kupić wieczorem ani oddawać do sieci za ułamek ceny zakupu. W instalacji 5 kWp takie przesunięcia potrafią podnieść zużycie własne o 10-15 punktów procentowych, co przy dzisiejszych zasadach rozliczeń bywa warte drugie tyle, co sama gra cenami.

Razem około 2300 zł rocznie w wariancie bez fotowoltaiki. Po stronie kosztów: przekaźnik z pomiarem energii do bojlera (ok. 150 zł), ewentualnie sterowalna ładowarka, kilka wieczorów konfiguracji i grosze za zapytania do modelu - jeden plan dziennie to koszt pomijalny, a lokalny model robi to za darmo. W tym wariancie projekt zwraca się w pierwszych miesiącach.

## Granice opłacalności

Teraz druga dawka realizmu. Wykreśl z tabeli auto - zostaje ok. 1000 zł rocznie. Wykreśl taryfę dynamiczną i zostaw zwykłą G11 z jedną ceną - zostaje zero, bo nie ma czego optymalizować cenowo (zostaje tylko zużycie własnej produkcji z PV, jeśli ją masz). Dom bez auta elektrycznego, bez fotowoltaiki i bez taryfy strefowej lub dynamicznej nie potrzebuje planisty energii - potrzebuje najwyżej [części szóstej tej serii](/pl/blog/ai-smart-home-wykrywanie-anomalii/), czyli wykrywania, że coś zużywa za dużo.

Prosty test przed startem: policz, ile kilowatogodzin rocznie realnie przesuniesz, pomnóż przez różnicę cen między twoją tanią a drogą godziną i odejmij 20% na dni, w których życie wygra z planem. Jeśli wynik nie przekracza kilkuset złotych, odpuść albo ogranicz się do jednej automatyzacji bojlera na sztywnym harmonogramie - bez prognoz, bez modelu, bez dziennika.

## Podsumowanie

Planowanie energii to najbardziej wymierna część tej serii: efekt widać na rachunku, nie tylko w komforcie. Składniki są trzy - ceny w czasie, prognoza produkcji, kalendarz - a wzorzec architektury niezmienny: model proponuje i uzasadnia, deterministyczna automatyzacja wykonuje w granicach twardych warunków. Dziennik decyzji zamienia podejrzany automat w zrozumiałego współlokatora. Policz swój potencjał przesunięcia zanim zaczniesz - z autem elektrycznym i taryfą dynamiczną gra jest warta świeczki, bez nich często wystarczy jeden harmonogram bojlera. A jeśli liczby wyjdą na plus, zacznij od bojlera w najbliższy weekend: to jedno urządzenie, jeden przekaźnik i od razu widoczny efekt.
