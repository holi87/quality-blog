---
title: "Automatyzacje na upały: rolety, klimatyzacja i czujniki, zanim dom się nagrzeje"
description: "Tryb upału w Home Assistant: prognoza jako wyzwalacz, rolety według pozycji słońca dla każdej fasady, nocne przewietrzanie i klimatyzacja bez wojen automatyzacji - z yaml."
date: 2026-08-17
tags: ["smart-home", "home-assistant", "upaly", "rolety", "klimatyzacja", "automatyzacje"]
lang: pl
readingTime: 14
author: GH
---

Klimatyzacja włączana ręcznie o piętnastej, kiedy w salonie jest już trzydzieści stopni, to nie jest automatyzacja - to drogi przycisk paniki. Dom, który zdążył się nagrzać, będzie oddawał ciepło do późnej nocy niezależnie od tego, ile prądu wpompujesz w sprężarkę. Sedno obrony przed upałem to nie wpuścić ciepła do środka, a do tego potrzebne są decyzje podejmowane rano, kiedy o upale nikt jeszcze nie myśli. Pokażę kompletny układ w Home Assistant: prognoza jako wyzwalacz trybu upału, rolety prowadzone pozycją słońca osobno dla każdej fasady, nocne przewietrzanie oparte na różnicy temperatur i klimatyzacja, która wchodzi do gry ostatnia.

## Prewencja bije reakcję

Fizyka gra przeciwko spóźnionym. Ściany, stropy i meble mają masę termiczną: przez cały upalny dzień magazynują energię, a wieczorem oddają ją do pomieszczeń jak piec akumulacyjny. Dlatego dom, w którym o siedemnastej jest dwadzieścia dziewięć stopni, nie schłodzi się od przeciągu o dwudziestej drugiej - on będzie grzał od środka jeszcze o północy. Klimatyzacja potrafi to ciepło usunąć, ale usuwa je już po fakcie, płacąc prądem za każdą kilowatogodzinę, która weszła przez okno kilka godzin wcześniej.

A wchodzi tego dużo. Nieosłonięte okno po stronie południowej lub zachodniej wpuszcza w słoneczny dzień kilkaset watów na metr kwadratowy szyby. Trzy takie okna w salonie to grzejnik o mocy czajnika elektrycznego, pracujący od rana do wieczora, którego nikt nie zamawiał. Roleta zewnętrzna albo żaluzja fasadowa odbija to promieniowanie, zanim dotknie szyby - dlatego działa wielokrotnie lepiej niż zasłona wewnętrzna, przy której ciepło jest już w pokoju i zostaje w nim.

Tu właśnie automatyzacja ma przewagę nad człowiekiem, i to nie w sile, tylko w porze działania. Człowiek reaguje na odczucie: opuszcza rolety, gdy zrobiło się gorąco, czyli za późno. Automat opuszcza je o dziewiątej rano w dzień, który dopiero będzie upalny, bo wie z prognozy, że będzie. Cała reszta tego artykułu to rozwinięcie jednej zasady: każda decyzja o chłodzie ma zapaść zanim ciepło wejdzie, nie po.

## Dane wejściowe: prognoza, słońce i temperatury

Zacznij od centralnego przełącznika trybu upału - pomocniczej encji input_boolean, którą włącza prognoza, a sprawdzają wszystkie pozostałe automatyzacje. Wieczorem automat pobiera prognozę dzienną z integracji pogodowej i jeśli jutrzejsze maksimum przekracza próg, uzbraja dom na następny dzień:

```yaml
triggers:
  - trigger: time
    at: "21:30:00"
actions:
  - action: weather.get_forecasts
    target:
      entity_id: weather.dom
    data:
      type: daily
    response_variable: prognoza
  - if: "{{ prognoza['weather.dom'].forecast[1].temperature >= 29 }}"
    then:
      - action: input_boolean.turn_on
        target:
          entity_id: input_boolean.tryb_upalu
```

Indeks `forecast[1]` to jutro (zero to zwykle dzień bieżący - sprawdź w swojej integracji, bo bywa różnie). Wyłączanie zrób osobną automatyzacją i z zapasem: tryb upału gaśnie dopiero, gdy prognozowane maksimum spada poniżej dwudziestu sześciu stopni, nie dwudziestu dziewięciu. Ten odstęp progów oszczędzi ci domu, który co drugi dzień zmienia zdanie.

Drugie źródło danych to pozycja słońca. Encja `sun.sun` wystawia atrybuty azymutu i wysokości nad horyzontem (elevation) - dokładnie to, czego potrzebują rolety, żeby wiedzieć, która fasada jest właśnie ostrzeliwana. Szczegóły opisuje [dokumentacja integracji sun](https://www.home-assistant.io/integrations/sun/). Azymut mówi, z którego kierunku świeci słońce, wysokość - czy w ogóle grzeje: nisko wiszące słońce o siódmej rano na wschodniej fasadzie potrafi dać więcej ciepła przez okno niż południowe w zenicie, bo wpada głęboko w pokój.

Trzecia grupa to temperatury, i tu ważna jest para, nie pojedyncza liczba: temperatura wewnątrz każdego istotnego pomieszczenia oraz temperatura zewnętrzna mierzona w cieniu, najlepiej na północnej elewacji. Czujnik zewnętrzny na słońcu pokazuje temperaturę czujnika, nie powietrza, i zawyża odczyt o kilka stopni. Jeśli chcesz odróżnić dzień upalny i słoneczny od upalnego i pochmurnego, dodaj czujnik natężenia światła na elewacji albo wykorzystaj zachmurzenie z integracji pogodowej - to warunek, który uratuje cię przed zamykaniem rolet w dzień, gdy słońce i tak nie grzeje.

## Rolety według strony świata

Najczęstszy błąd początkujących: jedna automatyzacja "upał = wszystkie rolety w dół o dziesiątej". Dom robi się ciemny jak bunkier na dwanaście godzin, domownicy się buntują i po tygodniu cały tryb upału ląduje w koszu. Słońce nie grzeje wszystkich fasad naraz, więc rolety powinny pracować zmianowo: wschodnia fasada broni się rano, południowa w środku dnia, zachodnia po południu i wieczorem. Jedna automatyzacja na fasadę, wyzwalana azymutem słońca:

```yaml
triggers:
  - trigger: numeric_state
    entity_id: sun.sun
    attribute: azimuth
    above: 120
conditions:
  - condition: state
    entity_id: input_boolean.tryb_upalu
    state: "on"
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    above: 20
actions:
  - action: cover.set_cover_position
    target:
      entity_id: cover.roleta_salon_poludnie
    data:
      position: 15
```

Analogiczna automatyzacja podnosi roletę, gdy azymut wyjdzie poza sektor fasady - słońce przeszło dalej, pokój może wrócić do światła dziennego. Sektory wyznaczysz w jeden dzień obserwacji: zanotuj azymut, przy którym słońce zaczyna i przestaje wpadać do danego okna, i wpisz te liczby jako progi. U mnie wschodnia fasada pracuje mniej więcej między azymutem 70 a 130, południowa między 120 a 220, zachodnia od 210 do zachodu.

Procent zamknięcia dobieraj do funkcji pomieszczenia. Sypialnia i pokoje nieużywane w dzień: pełne zamknięcie, tam ciemność nikomu nie przeszkadza. Salon i miejsca pracy: pozycja 10-20 procent, która odcina bezpośrednie promieniowanie, ale zostawia szczeliny doświetlające. Jeśli masz żaluzje fasadowe z lamelami, zamiast pozycji steruj kątem przez `cover.set_cover_tilt_position` - lamele ustawione pod słońce blokują promienie, przepuszczając rozproszone światło, i to jest najlepszy kompromis między chłodem a jasnością, jaki znam.

## Klimatyzacja i wentylacja z głową

Klimatyzacja w tym układzie jest ostatnią linią obrony, nie pierwszą. Wstępne chłodzenie może przesunąć pobór na tańsze godziny i ograniczyć moc potrzebną w szczycie, ale nie gwarantuje mniejszego zużycia energii - zbyt niska nastawa może je zwiększyć. U mnie punktem startowym jest chłodzenie przed południem, lecz temperaturę, czas i opłacalność trzeba dobrać do bezwładności budynku, sprawności urządzenia i pełnej taryfy. Nie omijaj własnej automatyki klimatyzatora ani minimalnych czasów pracy określonych przez producenta.

Druga połowa tej sekcji kosztuje zero złotych za kilowatogodzinę: nocne przewietrzanie. Po upalnym dniu powietrze na zewnątrz robi się wieczorem chłodniejsze niż w domu - i to jest jedyny moment doby, kiedy otwarte okna chłodzą zamiast grzać. Automatyzacja pilnuje różnicy temperatur i daje znać, gdy przewietrzanie zaczyna mieć sens:

```yaml
triggers:
  - trigger: template
    value_template: >
      {{ states('sensor.temperatura_ogrod') | float(30)
         < states('sensor.temperatura_salon') | float(0) - 2 }}
conditions:
  - condition: time
    after: "20:00:00"
  - condition: state
    entity_id: input_boolean.tryb_upalu
    state: "on"
actions:
  - action: notify.mobile_app_telefon_gh
    data:
      message: "Na dworze o 2 stopnie chłodniej niż w salonie - pora otworzyć okna."
```

Różnica dwóch stopni jest moim progiem startowym, nie prawem fizyki. Efekt zależy od przepływu powietrza, wiatru, wilgotności i masy termicznej budynku, więc próg należy zmierzyć u siebie. Przy rekuperacji z obejściem wymiennika sprawdź instrukcję centrali: obejście nie jest aktywnym chłodzeniem i nie każda jednostka zapewni wystarczający przepływ. Rano zamknij okna, gdy powietrze na zewnątrz przestaje być chłodniejsze.

## Człowiek kontra automat

Najszybszy sposób, żeby domownicy znienawidzili tryb upału: roleta podniesiona ręcznie, bo ktoś chce popatrzeć na ogród, opuszcza się z powrotem po pięciu minutach. Drugi raz podniesiona - znowu jedzie w dół. Człowiek zawsze wygra tę wojnę, tylko że wyłącznikiem całej automatyzacji, więc lepiej, żeby wojny nie było. Ręczna zmiana pozycji musi być dla systemu sygnałem "wiem, co robię", respektowanym przez kilka godzin.

Wzorzec jest prosty: pomocniczy licznik czasu (encja timer) na każdą fasadę. Automatyzacja nasłuchuje zmian stanu rolety; jeśli zmiana nastąpiła, a żadna automatyzacja rolet nie działała w ostatniej minucie, uznaje ją za ręczną i startuje licznik na cztery godziny. Wszystkie automatyzacje danej fasady mają warunek: działaj tylko, gdy licznik nie biegnie. Po czterech godzinach system wraca do pilnowania fasady, bez pretensji i bez pamięci. Cztery godziny to u mnie kompromis: dość długo, żeby nadpisanie miało sens, dość krótko, żeby zapomniana roleta nie grzała pokoju do wieczora.

Druga klasyczna kolizja człowieka z automatem to otwarte okno przy pracującej klimatyzacji. Po kilku minutach można wstrzymać chłodzenie, ale po zamknięciu przywracaj je tylko wtedy, gdy przed otwarciem było aktywne i nadal istnieje zapotrzebowanie. Zachowaj wymagane przez producenta czasy postoju sprężarki; proste wyłączenie i natychmiastowe wznowienie może powodować zbyt częste przełączanie.

## Komfort kontra koszt energii

Warto policzyć, o co toczy się gra. Klimatyzator w moim salonie pobiera podczas aktywnego chłodzenia średnio około 0,8 kW. Dzień reagowania po fakcie - start o piętnastej, praca prawie ciągła do dwudziestej trzeciej - to w porywach 6 kWh na jedno pomieszczenie. Dzień z pełnym trybem upału, czyli rolety od rana, nocne przewietrzanie i krótkie wstępne schłodzenie przed południem, zamyka się w okolicach 1,5-2 kWh, a temperatura w szczycie jest niższa, nie wyższa. Te liczby zobaczysz u siebie dopiero, gdy mierzysz - jak to poskładać, opisałem w tekście o [monitoringu energii w Home Assistant](/pl/blog/monitoring-energii-home-assistant/). Bez pomiaru dyskusja o kosztach chłodzenia to zgadywanie.

Z moich pomiarów wynika, że w tym konkretnym domu przez dużą część lata wystarczają rolety i nocne przewietrzanie. Nie da się tego uogólnić na wszystkie polskie mieszkania i domy: wynik zależy od izolacji, przeszkleń, piętra, orientacji, zysków wewnętrznych, wilgotności i potrzeb zdrowotnych mieszkańców.

> Najtańsza kilowatogodzina chłodzenia to ta, której nie musiałeś wyprodukować, bo ciepło nigdy nie weszło do środka.

Niższa nastawa zwykle zwiększa obciążenie chłodnicze, ale nie ma uniwersalnego przelicznika ani gwarancji podwojenia zużycia między 25 a 22 stopniami. Mój kompromis to dwadzieścia pięć stopni w pomieszczeniach dziennych i dwadzieścia cztery w sypialni przed snem; własne progi dobierz do komfortu, zdrowia, wilgotności i pomiarów energii.

## Typowe błędy

Kilka grabi, na które nadepnąłem sam albo widziałem u innych - wszystkie do uniknięcia jedną poprawką.

- **Automatyzacje wojujące ze sobą.** Tryb upału opuszcza roletę, a starsza automatyzacja "podnieś przy dużej jasności" podnosi ją z powrotem. Objaw: rolety jeżdżą w tę i z powrotem co kilka minut, silniki się grzeją, domownicy pukają się w czoło. Lekarstwo: w sezonie upałów jedna automatyzacja jest właścicielem urządzenia - wszystkie pozostałe dostają warunek wykluczający na `input_boolean.tryb_upalu`.
- **Progi bez histerezy.** Nie steruj sprężarką z jednego ostrego progu. Korzystaj z termostatu urządzenia, histerezy i minimalnych czasów pracy oraz postoju zalecanych przez producenta; półtora stopnia nie jest uniwersalną wartością dla każdego systemu.
- **Ignorowanie prognozy.** Prognoza jest jednym z sygnałów wyprzedzających, obok pozycji słońca i harmonogramu. Jest obarczona błędem, więc połącz ją z bieżącą temperaturą i nasłonecznieniem zamiast traktować jako pewnik.
- **Jeden próg dla całego domu.** Poddasze nagrzewa się szybciej i mocniej niż parter, pokój z oknem zachodnim później, ale gwałtowniej niż wschodni. Progi i harmonogramy ustawiaj per pomieszczenie, inaczej automatyzacja będzie jednocześnie za czuła na parterze i za leniwa na górze.
- **Zamykanie rolet w pochmurny upał.** Prognoza mówi "trzydzieści stopni", rolety zjeżdżają, a przez cały dzień wisi gruba warstwa chmur - dom stoi ciemny bez żadnego zysku. Warunek na czujnik natężenia światła albo zachmurzenie z integracji pogodowej załatwia sprawę jedną linijką.

## Podsumowanie

Obrona przed upałem to sekwencja, w której każdy element gra o inną porę doby: prognoza uzbraja tryb upału wieczorem, rolety bronią kolejnych fasad od rana według pozycji słońca, nocne przewietrzanie zrzuca zgromadzone ciepło za darmo, a klimatyzacja domyka tylko różnicę, na którą tamte nie wystarczyły. Do tego dwie reguły pokojowego współistnienia z domownikami: ręczne nadpisanie respektowane przez kilka godzin i chłodzenie, które nie walczy z otwartym oknem. Nie wdrażaj wszystkiego naraz - zacznij od przełącznika trybu upału i rolet jednej, najbardziej nasłonecznionej fasady, bo to one dają największy efekt przy najmniejszej pracy. Po pierwszej fali upałów porównaj w danych energetycznych dzień z automatyzacją i bez niej; ta jedna różnica przekona cię skuteczniej niż ten artykuł. Dom, który nie wpuścił ciepła, nie musi go usuwać - wszystko inne jest dopiskiem do tego zdania.
