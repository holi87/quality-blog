---
title: "Monitoring energii w Home Assistant: co naprawdę zżera prąd i czy smart home się zwraca"
description: "Pomiary energii od wtyczki po licznik główny, panel energii z ceną prądu, progi alertów, automatyzacje taryfy nocnej i uczciwy rachunek zwrotu z inwestycji na realistycznym domu."
date: 2026-08-03
tags: ["smart-home", "home-assistant", "energia", "oszczedzanie", "automatyzacje"]
lang: pl
readingTime: 9
author: GH
---

Panel energii w Home Assistant odpowiada na pytanie, którego boi się każdy domownik przy rachunku: co tyle kosztuje. Pokażę, jak zbudować pomiary od pojedynczej wtyczki po licznik główny, jakie progi alertów mają sens, które automatyzacje realnie oszczędzają - i policzę na syntetycznym, ale realistycznym domu, czy ta zabawa w ogóle się zwraca.

## Trzy poziomy pomiaru

Monitoring energii buduje się warstwami i nie trzeba kupować wszystkiego od razu. Poziom pierwszy: **inteligentna wtyczka z pomiarem mocy** - Shelly Plug S albo wtyczka Zigbee z pomiarem. Wpinasz w nią podejrzane urządzenie na tydzień i masz odpowiedź: ile bierze lodówka, ile telewizor w trybie czuwania, ile stary zamrażalnik w piwnicy. Koszt: 60-120 złotych za sztukę, dwie albo trzy wystarczą na start, bo można je przenosić.

Poziom drugi: **pomiar na obwodzie**. Moduł Shelly z pomiarem mocy montowany za wyłącznikiem albo w puszce mierzy całe oświetlenie, kuchnię albo bojler - rzeczy, których nie wepniesz we wtyczkę. Wymaga pracy przy instalacji elektrycznej, więc jeśli nie czujesz się pewnie, to robota dla elektryka; sam moduł kosztuje 80-150 złotych.

Poziom trzeci: **licznik główny**. Trójfazowy miernik (na przykład Shelly Pro 3EM) w rozdzielnicy mierzy zużycie całego domu z dokładnością co sekundę. To najdroższy element (400-600 złotych z montażem), ale spina całość: suma z licznika minus zmierzone obwody pokazuje, ile prądu znika w „reszcie", której jeszcze nie zidentyfikowałeś.

Wszystkie trzy poziomy łączą się z Home Assistant lokalnie - Shelly po Wi-Fi, wtyczki Zigbee przez koordynator. Warunek techniczny: sensor musi raportować energię w kWh (klasa pomiaru energii, wartość narastająca), nie samą chwilową moc w watach. Urządzenia z tej listy robią to poprawnie z pudełka.

## Panel energii w pół godziny

Konfiguracja panelu to `Ustawienia → Panele → Energia`. Wskazujesz sensor zużycia z sieci (licznik główny albo suma obwodów), opcjonalnie produkcję z fotowoltaiki, a potem dodajesz poszczególne urządzenia w sekcji monitorowania indywidualnych odbiorników. Po kilku godzinach zaczynają spływać dane, po dobie masz pierwszy pełny wykres, po tygodniu - obraz nawyków domu.

Od razu dodaj cenę prądu: panel pozwala podać stawkę za kWh statycznie albo wskazać encję z taryfą, jeśli masz taryfę wielostrefową. Dopiero złotówki, nie kilowatogodziny, robią wrażenie na domownikach. Sprawdzone w praktyce: wykres w kWh nie obchodzi nikogo, ten sam wykres w złotych wywołuje dyskusję przy kolacji.

> Panel energii sam w sobie nie oszczędza ani złotówki. Oszczędza ją decyzja, którą podejmujesz, kiedy pierwszy raz zobaczysz liczby.

## Pułapki danych, które zafałszują rachunek

Zanim zaczniesz wyciągać wnioski z wykresów, kilka rzeczy, które psują dane i o które rozbija się większość pierwszych analiz. Po pierwsze, **resety liczników**: po aktualizacji oprogramowania albo zaniku zasilania niektóre urządzenia zerują licznik energii. Panel energii radzi sobie z tym poprawnie, jeśli sensor ma właściwą klasę wartości narastającej - ale tanie wtyczki z egzotycznych integracji potrafią to zgłaszać źle i wtedy na wykresie pojawiają się absurdalne skoki. Jeden dzień z zużyciem 4000 kWh w historii potrafi zepsuć każdą średnią.

Po drugie, **dziury w danych**: urządzenie offline przez kilka godzin to kilka godzin niezmierzonej energii. Przy wtyczkach to pomijalne, przy liczniku głównym już nie - dlatego miernik w rozdzielnicy powinien wisieć na najstabilniejszym Wi-Fi w domu, a nie na granicy zasięgu. Po trzecie, **dokładność**: tanie wtyczki mierzą z błędem rzędu dwóch, trzech procent i zaniżają bardzo małe obciążenia. Do decyzji domowych to w zupełności wystarcza; do reklamacji u sprzedawcy prądu - nie.

I po czwarte, **sezonowość**: tydzień pomiaru lodówki w lipcu da inny wynik niż w styczniu, a pompa obiegowa ogrzewania w ogóle nie istnieje w danych z lata. Wnioski o rocznych kosztach wyciągaj z co najmniej miesiąca danych i dopisuj poprawkę na porę roku. Do rozliczeń w cyklach pomaga wbudowany pomocnik licznika taryfowego - tnie zużycie na doby i miesiące oraz rozdziela je na strefy taryfowe, dzięki czemu widzisz osobno prąd dzienny i nocny bez żadnych obliczeń ręcznych.

## Co pokazały pomiary w domu DemoDom

Zamiast obietnic producentów - liczby. Dom DemoDom jest syntetyczny, ale złożony z typowych wartości, które zobaczysz u siebie: cztery osoby, dom 120 metrów, bojler elektryczny, zużycie roczne około 4800 kWh, taryfa całodobowa 1,15 zł/kWh.

| Odbiornik | Zużycie dobowe | Koszt roczny | Komentarz |
| --- | --- | --- | --- |
| Bojler elektryczny | 6,0 kWh | 2519 zł | Największy pojedynczy odbiornik w domu bez ogrzewania elektrycznego |
| Lodówka z zamrażarką | 1,1 kWh | 462 zł | Stary model; nowy zszedłby do ~0,6 kWh |
| Tryby czuwania razem | 1,4 kWh | 588 zł | Telewizor, konsola, drukarka, ładowarki, dekoder - stałe ~60 W |
| Pralka + zmywarka | 1,5 kWh | 630 zł | Zależne od liczby cykli, tu po jednym dziennie łącznie |
| Serwer HA + sieć + NAS | 0,7 kWh | 294 zł | Smart home też kosztuje - warto to wiedzieć |

Dwie rzeczy z tej tabeli zaskakują prawie każdego. Po pierwsze, tryby czuwania: 60 W ciągłego poboru to prawie 600 złotych rocznie za nic. Po drugie, bojler: ponad połowa rachunku w jednym urządzeniu, które grzeje wodę o losowych porach, w tym w szczycie cenowym - i to jest największa pojedyncza dźwignia oszczędności.

## Progi alertów i automatyzacje, które oszczędzają

Sensowne alerty to takie, które prowadzą do działania. Trzy wzorce, które u mnie zostały na stałe. Pierwszy: **anomalia poboru** - jeśli lodówka pobiera moc bez przerwy przez dwie godziny (normalnie pracuje cyklami), coś jest nie tak z drzwiami albo agregatem. Drugi: **koniec cyklu** - pralka, której moc spadła poniżej 5 W na pięć minut, skończyła pranie; powiadomienie oszczędza nie prąd, tylko wieszanie mokrych rzeczy o północy. Trzeci: **budżet dzienny** - jeśli do godziny 18 dom zużył więcej niż ustalony próg, dostaję cichą informację i wieczorem wiem, żeby spojrzeć w panel.

Konkretne progi, od których warto zacząć (potem dostroisz do swojego domu): lodówka - moc powyżej 50 W nieprzerwanie przez dwie godziny oznacza alarm; pralka - koniec cyklu to spadek poniżej 5 W na pięć minut, ale dopiero po tym, jak wcześniej przekroczyła 10 W (inaczej powiadomienie przyjdzie też po samym włączeniu zasilania); budżet dzienny - średnia z ostatnich trzydziestu dni razy 1,3. Próg ustawiony za nisko generuje szum i uczy ignorowania, próg za wysoko nigdy nie zadziała - lepiej zacząć luźno i zacieśniać co tydzień, niż odwrotnie.

Największe pieniądze leżą jednak w przeniesieniu bojlera na taryfę nocną. W taryfie dwustrefowej prąd w nocy kosztuje w okolicach 0,75 zł/kWh zamiast 1,15 zł. Automatyzacja jest banalna:

```yaml
automation:
  - alias: "Bojler w taryfie nocnej"
    triggers:
      - trigger: time
        at: "22:05:00"
        id: start
      - trigger: time
        at: "05:55:00"
        id: stop
    actions:
      - action: "switch.turn_{{ 'on' if trigger.id == 'start' else 'off' }}"
        target:
          entity_id: switch.bojler
```

Do tego wyłącznik bezpieczeństwa: jeśli temperatura wody spadnie w dzień poniżej progu komfortu, bojler i tak się włączy. Oszczędność dla DemoDom: 2190 kWh rocznie razy 0,40 zł różnicy to około 876 złotych. Drugi ruch to listwa albo wtyczka odcinająca strefę rozrywki w nocy i podczas nieobecności - z 60 W czuwania realnie da się wyciąć połowę, czyli kolejne ~290 złotych rocznie.

## Czy to się zwraca - uczciwy rachunek

Koszt strony pomiarowej dla DemoDom: miernik do rozdzielnicy z montażem 550 zł, trzy wtyczki z pomiarem 270 zł, moduł do bojlera z montażem 250 zł. Razem 1070 złotych jednorazowo, zakładając że serwer Home Assistant już masz.

Oszczędności roczne: bojler na taryfie nocnej ~876 zł (wymaga zmiany taryfy u sprzedawcy - to wniosek, nie remont), przycięte tryby czuwania ~290 zł, do tego trudniejsze do policzenia drobiazgi: wykryta przed śmiercią lodówka, świadome decyzje zakupowe, pranie i zmywanie w tańszych godzinach. Licząc tylko dwie twarde pozycje: **1166 złotych rocznie, zwrot z inwestycji w jedenaście miesięcy**.

Uczciwe zastrzeżenie: ten rachunek stoi na bojlerze elektrycznym. Jeśli grzejesz wodę gazem, największa dźwignia znika i zwrot wydłuża się do trzech, czterech lat - wciąż dodatni, ale już nie spektakularny. Wtedy zaczynałbym od samych wtyczek za ~270 zł i polowania na tryby czuwania, a miernik główny dokupił dopiero, gdy pierwsze odkrycia się zwrócą.

Rachunek zmienia się też na plus w dwóch sytuacjach. Z fotowoltaiką pomiar przestaje być oszczędzaniem, a staje się zarządzaniem: automatyzacje przesuwające bojler, pranie i ładowanie na godziny produkcji potrafią podnieść autokonsumpcję o kilkanaście punktów procentowych. A przy taryfach dynamicznych, rozliczanych według cen giełdowych godzina po godzinie, monitoring i automatyzacja przestają być hobby - bez nich taka taryfa to ruletka, z nimi bywa najtańszą opcją na rynku.

## Podsumowanie

Monitoring energii to ta część smart home, która zamiast wydawać pieniądze, je odzyskuje. Ścieżka: zacznij od dwóch, trzech wtyczek z pomiarem i tygodnia pomiarów podejrzanych, dodaj panel energii z ceną prądu w złotych, potem miernik główny i pomiar największego odbiornika. Alerty ustawiaj tylko tam, gdzie prowadzą do działania, a największych pieniędzy szukaj w przesunięciu grzania wody na tanią taryfę i w wycięciu trybów czuwania. W realistycznym domu z bojlerem elektrycznym całość zwraca się w okolicach roku. Eksperyment na start: wepnij dziś wieczorem wtyczkę z pomiarem w najstarsze urządzenie AGD w domu i sprawdź za tydzień, czy nie utrzymujesz właśnie małej elektrowni.
