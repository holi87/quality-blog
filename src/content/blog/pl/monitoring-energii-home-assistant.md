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

Wszystkie trzy poziomy łączą się z Home Assistant lokalnie - Shelly po Wi-Fi, wtyczki Zigbee przez koordynator. Najprościej użyć sensora energii w kWh z właściwą klasą urządzenia i stanem narastającym. Home Assistant potrafi też przyjąć do panelu zgodny sensor chwilowej mocy w W lub kW; jeśli potrzebujesz energii z samej mocy, możesz utworzyć sensor całkujący metodą sumy Riemanna. Zawsze sprawdź encje konkretnego modelu, bo nie każda wtyczka raportuje oba pomiary poprawnie.

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

Największy potencjał może leżeć w przeniesieniu bojlera do tańszej strefy. Godziny i pełne stawki zależą od operatora, sprzedawcy i taryfy; porównuj cenę energii razem ze zmiennym składnikiem dystrybucji, podatkami i ewentualnie wyższą stawką w drogiej strefie. Poniższe godziny są wyłącznie przykładem - wpisz okna z własnej umowy:

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

Do tego wyłącznik bezpieczeństwa: jeśli temperatura wody spadnie w dzień poniżej progu komfortu, bojler i tak się włączy. Proste `2190 kWh × różnica stawki` jest tylko teoretycznym maksimum, bo nie całe zużycie da się przesunąć, straty postojowe mogą wzrosnąć, a droższa strefa i składniki stałe zmieniają wynik całego domu. Drugi ruch to listwa albo wtyczka odcinająca odbiorniki, które producent dopuszcza do twardego wyłączenia. Stałe 30 W usunięte przez cały rok to 263 kWh; wartość oszczędności zależy od pełnej stawki, a nie od samej ceny energii czynnej.

## Czy to się zwraca - uczciwy rachunek

Koszt strony pomiarowej dla DemoDom: miernik do rozdzielnicy z montażem 550 zł, trzy wtyczki z pomiarem 270 zł, moduł do bojlera z montażem 250 zł. Razem 1070 złotych jednorazowo, zakładając że serwer Home Assistant już masz.

Rachunek DemoDom pokazuje sufit, nie obietnicę: przy założonej różnicy 0,40 zł/kWh pełne przesunięcie bojlera dałoby 876 zł, a wycięcie 30 W czuwania przy stawce 1,15 zł/kWh około 302 zł. Realny wynik policz z dwóch symulowanych rocznych rachunków dla całego profilu zużycia, z godzinami stref, dystrybucją i częścią energii, której nie przesuniesz. Dopiero tę różnicę podziel przez koszt sprzętu; bez takiego porównania nie da się uczciwie obiecać zwrotu w jedenaście miesięcy.

Uczciwe zastrzeżenie: ten rachunek stoi na bojlerze elektrycznym. Jeśli grzejesz wodę gazem, największa dźwignia znika, a zakup może zwracać się znacznie dłużej albo nie zwrócić się wcale. Wtedy zaczynałbym od samych wtyczek za ~270 zł i polowania na tryby czuwania, a miernik główny dokupił dopiero, gdy pomiary pokażą realny potencjał oszczędności.

Rachunek może poprawić fotowoltaika, bo przesunięcie odbiorów na czas produkcji zwiększa autokonsumpcję, ale skala zależy od profilu domu, mocy instalacji i magazynu. Przy taryfach dynamicznych ceny zmieniają się w blokach czasu określonych w umowie i na rynku - w 2026 nie zawsze są to pełne godziny - a automatyzacja pomaga reagować na te zmiany. Nie gwarantuje jednak, że taryfa dynamiczna będzie najtańsza po doliczeniu dystrybucji i całego profilu zużycia.

## Podsumowanie

Monitoring energii może odzyskiwać pieniądze, ale sam pomiar nie tworzy oszczędności. Ścieżka: zacznij od dwóch, trzech wtyczek z pomiarem i tygodnia pomiarów podejrzanych, dodaj panel energii z ceną prądu w złotych, potem miernik główny i pomiar największego odbiornika. Alerty ustawiaj tylko tam, gdzie prowadzą do działania, a największych pieniędzy szukaj w przesunięciu grzania wody na tanią taryfę i w wycięciu trybów czuwania. Okres zwrotu policz z własnych pomiarów i pełnej taryfy - może wynieść miesiące, lata albo nie wystąpić. Eksperyment na start: wepnij dziś wieczorem wtyczkę z pomiarem w najstarsze urządzenie AGD w domu i sprawdź za tydzień, czy nie utrzymujesz właśnie małej elektrowni.
