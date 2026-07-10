---
title: "Dom gotowy na jesień: harmonogramy ogrzewania w Home Assistant, zanim zrobi się zimno"
description: "Harmonogramy ogrzewania w Home Assistant: inwentaryzacja, strefy z głowicami TRV, obecność zamiast sztywnych godzin, kalibracja czujników i test na sucho przed sezonem."
date: 2026-08-28
tags: ["smart-home", "home-assistant", "ogrzewanie", "harmonogramy", "energia"]
lang: pl
readingTime: 14
author: GH
---

Koniec sierpnia to dziwny moment na pisanie o ogrzewaniu - za oknem wciąż lato, a ja właśnie skończyłem przegląd głowic termostatycznych. Robię to celowo: harmonogramy ogrzewania zbudowane teraz przejdą spokojny rozruch we wrześniu, zamiast powstawać w panice przy pierwszych przymrozkach, kiedy każdy błąd oznacza zimne poranki. Jeszcze dwa tygodnie temu stroiłem [automatyzacje na upały](/pl/blog/automatyzacje-na-upaly-rolety-klimatyzacja/), ale sezon w smart home odwraca się szybciej niż pogoda. W tym wpisie przechodzę przez cały proces: inwentaryzację tego, czym naprawdę możesz sterować, podział domu na strefy, harmonogram tygodniowy z temperaturą obniżoną, obecność zamiast sztywnych godzin, kalibrację czujników i wrześniowy test na sucho - z przykładami yaml i listą błędów pierwszego sezonu.

## Dlaczego koniec sierpnia, a nie październik

Pierwszy powód jest czysto techniczny: system ogrzewania, który stał bezczynnie od kwietnia, ma prawo nie działać. Głowice termostatyczne po pięciu miesiącach bez ruchu potrafią mieć zapieczony trzpień zaworu, baterie rozładowane do połowy i utracone sparowanie z siecią Zigbee po którejś przerwie zasilania. Wykrycie tego teraz to dziesięć minut z listą encji; wykrycie w listopadzie to zimny wieczór i szukanie baterii po szufladach. Uruchamiam grzanie na próbę pod koniec sierpnia właśnie po to, żeby awarie ujawniły się przy otwartych oknach, a nie przy minus pięciu.

Drugi powód to zakupy i kalibracja bez presji. Jeśli inwentaryzacja pokaże braki - głowica na grzejnik w sypialni, czujnik temperatury do biura, przekaźnik do grzejnika elektrycznego w garażu - zamawiasz je we wrześniu bez nerwów i montujesz w wolny wieczór. W październiku, gdy wszyscy naraz przypominają sobie o zimie, popularne modele znikają ze sklepów albo czekają w dostawie tygodniami. Kalibracja czujników z kolei wymaga stabilnych warunków i kilku iteracji rozłożonych na dni - tego nie da się nadrobić w weekend.

Trzeci powód to poligon, którego nie da się zasymulować: pierwszy chłodny tydzień września. Noce poniżej dziesięciu stopni, dni jeszcze ciepłe - grzanie włącza się naprawdę, harmonogram wykonuje pełny cykl dobowy, a koszt każdego błędu jest bliski zeru, bo nikt nie zmarznie. To najlepsze okno testowe w całym roku i dostajesz je tylko raz.

## Inwentaryzacja: czym grzejesz i czym możesz sterować

Zanim powstanie jakikolwiek harmonogram, spisz dwie warstwy: źródło ciepła i punkty sterowania. Źródłem może być kocioł gazowy, pompa ciepła, grzejniki elektryczne albo podłogówka - każde z nich stawia inne ograniczenia. Kocioł gazowy zwykle słucha jednego termostatu głównego: przez styk beznapięciowy, czyli zwykły przekaźnik, albo - lepiej - przez protokół OpenTherm z modulacją mocy. Pompa ciepła ma własną automatykę i krzywą grzewczą; Home Assistant powinien ją korygować, a nie wyręczać, bo częste włączanie i wyłączanie pompy z zewnątrz skraca jej życie i psuje sprawność. Grzejniki elektryczne to najprostszy przypadek: przekaźnik z pomiarem energii plus czujnik temperatury. Podłogówka wodna reaguje z bezwładnością liczoną w godzinach, więc sterowanie nią przypomina sterowanie tankowcem - o tym jeszcze będzie.

Druga warstwa to punkty sterowania widziane z Home Assistant. Termostat główny pojawia się jako jedna encja domeny climate i steruje całym obiegiem. Głowice termostatyczne TRV na Zigbee to osobna encja climate na każdym grzejniku - i to one umożliwiają strefy. Przekaźnik z czujnikiem temperatury można spiąć integracją `generic_thermostat` w wirtualny termostat, który z pary przełącznik plus czujnik robi pełnoprawną encję climate z histerezą. Wynikiem inwentaryzacji powinna być prosta tabela: pomieszczenie, grzejnik, czym sterowane, jaka encja. U mnie wyszło jedenaście grzejników, z czego sterowalnych było osiem - trzy brakujące głowice zamówiłem na początku września, bez pośpiechu i bez przepłacania.

## Strefy zamiast jednej temperatury na dom

Jedna temperatura na cały dom to marnotrawstwo w obie strony: sypialnia przegrzana nocą, kiedy do spania chcesz chłodu, i biuro niedogrzane dokładnie w godzinach, w których w nim siedzisz. Model stref przypisuje każdemu pomieszczeniu własną parę temperatur - komfortową i obniżoną - oraz okna czasowe, w których obowiązuje komfort. Mój punkt wyjścia na ten sezon wygląda tak:

| Strefa | Komfort | Obniżona | Okno komfortu |
| --- | --- | --- | --- |
| Sypialnia | 19.0 | 17.0 | 20:00-22:30 |
| Biuro | 21.5 | 18.0 | pn-pt 7:00-16:00 |
| Łazienka | 22.5 | 19.0 | 6:00-8:00 i 20:00-22:00 |
| Salon z kuchnią | 21.0 | 18.5 | 14:00-22:30 |
| Przedpokój | 18.5 | 18.5 | bez okna, temperatura stała |

Głowice TRV realizują strefy fizycznie, ale nie wolno projektować hydrauliki wyłącznie na podstawie encji w Home Assistant. Przy głowicach na wszystkich grzejnikach źródło potrzebuje poprawnego sygnału zapotrzebowania, zapewnionego przepływu minimalnego i ochrony przed pracą przy zamkniętych zaworach. Zależnie od instalacji służy do tego grzejnik bez głowicy, automatyczny zawór różnicowy, bufor albo rozwiązanie przewidziane przez producenta. Sam termostat w najchłodniejszym pokoju lub automatyzacja odczytująca pozycje TRV nie zastępują projektu instalatora i zabezpieczeń kotła lub pompy.

Strefy nie wszędzie mają sens. Otwarta przestrzeń salonu z kuchnią i schodami to jedna strefa niezależnie od liczby grzejników - powietrze miesza się szybciej, niż głowice są w stanie różnicować, a dwie różne nastawy w tym samym powietrzu kończą się tak, że jeden grzejnik pracuje za oba. Podłogówka z kolei słabo znosi strefy czasowe: przy kilkugodzinnej bezwładności okno komfortu musiałoby zaczynać się w środku nocy, żeby rano było ciepło. Dla niej lepsza jest stała, niska nastawa i korekta pogodowa po stronie źródła.

## Harmonogram tygodniowy i temperatura obniżona

Do harmonogramów w Home Assistant nie potrzeba niczego spoza pudełka: wbudowany pomocnik typu harmonogram (Ustawienia, Urządzenia i usługi, Pomocnicy) pozwala narysować bloki tygodnia myszką i wystawia encję `schedule.*` ze stanem on/off. Automatyzacja mapuje ten stan na temperatury: stan włączony to komfort, wyłączony to temperatura obniżona. Jeśli wolisz przestawiać nastawy bezpośrednio z panelu, w HACS znajdziesz popularną kartę harmonogramu, która steruje encjami climate bez pisania automatyzacji - ale wariant z pomocnikiem jest przejrzysty, trzyma logikę w jednym miejscu i łatwo go wersjonować.

```yaml
automation:
  - alias: "Ogrzewanie - biuro wedlug harmonogramu"
    triggers:
      - trigger: state
        entity_id: schedule.biuro_godziny_pracy
    actions:
      - if: "{{ is_state('schedule.biuro_godziny_pracy', 'on') }}"
        then:
          - action: climate.set_temperature
            target:
              entity_id: climate.biuro
            data:
              temperature: 21.5
        else:
          - action: climate.set_temperature
            target:
              entity_id: climate.biuro
            data:
              temperature: 18.0
```

Ile realnie daje obniżanie nocne? To zależy od izolacji, pogody, czasu obniżenia i źródła ciepła, więc uniwersalny procent na stopień byłby mylący. W dobrze ocieplonym domu z pompą ciepła głębokie obniżenie może pogorszyć sprawność podczas nadrabiania. Zacznij od małej zmiany albo żadnej i porównaj zużycie w podobnych warunkach pogodowych, nie tylko w dwóch kolejnych dniach.

## Obecność zamiast sztywnych godzin

Harmonogram opisuje tydzień, jaki powinien być; obecność koryguje tydzień, jaki jest. Trzy automatyzacje robią tu większość roboty. Pierwsza: **dom pusty, wszystko na obniżoną**. Gdy liczba osób w strefie domowej spada do zera na dłużej niż pół godziny, wszystkie strefy dostają temperaturę obniżoną, niezależnie od tego, co w tej chwili mówi harmonogram. Pół godziny zwłoki jest ważne - wyjście do sklepu nie powinno wychładzać domu.

Druga: **podnoszenie przed powrotem**. Czas nagrzania trzeba zmierzyć dla danego pokoju i pogody. Strefa dojazdu może przywrócić harmonogram wcześniej, ale geolokalizacja bywa opóźniona lub błędna, więc nie traktuj jej jako jedynego zabezpieczenia przed zamarzaniem ani jako dowodu obecności. Do obecności per pomieszczenie używam czujników opisanych w tekście o [czujnikach obecności](/pl/blog/czujniki-obecnosci-2026-pir-mmwave-bluetooth/), również z bezpiecznym zachowaniem na wypadek braku danych.

Trzecia: **otwarte okno przykręca grzejnik**. Czujnik otwarcia na oknie, dwie minuty zwłoki, żeby krótkie uchylenie nie wywoływało reakcji, i głowica przechodzi w tryb wyłączony do czasu zamknięcia. Część głowic ma własną detekcję otwartego okna po gwałtownym spadku temperatury, ale zewnętrzny czujnik jest szybszy i nie generuje fałszywych reakcji przy zwykłym przeciągu.

```yaml
  - alias: "Sypialnia - okno otwarte, wstrzymaj grzanie"
    triggers:
      - trigger: state
        entity_id: binary_sensor.sypialnia_okno
        to: "on"
        for: "00:02:00"
    actions:
      - action: climate.set_hvac_mode
        target:
          entity_id: climate.sypialnia
        data:
          hvac_mode: "off"

  - alias: "Sypialnia - okno zamkniete, wznow grzanie"
    triggers:
      - trigger: state
        entity_id: binary_sensor.sypialnia_okno
        to: "off"
        for: "00:01:00"
    actions:
      - action: script.przywroc_ogrzewanie_sypialnia
```

Skrypt przywracający musi pamiętać tryb i nastawę sprzed otwarcia okna oraz ponownie sprawdzić harmonogram. Nie wpisuj na sztywno `heat`, bo możesz uruchomić grzanie, które wcześniej było wyłączone ręcznie albo przez inne zabezpieczenie.

## Kalibracja: wbudowany czujnik głowicy kłamie

Głowica termostatyczna mierzy temperaturę przy grzejniku, często we wnęce albo za zasłoną, więc odczyt może różnić się od temperatury w używanej części pokoju. Kierunek i wielkość błędu zależą od montażu i przepływu powietrza - nie zawsze są to dwa lub trzy stopnie ani zawsze zawyżenie.

Punktem odniesienia może być osobny czujnik temperatury umieszczony w reprezentatywnym miejscu, z dala od źródeł ciepła, okna i elektroniki. Część modeli TRV wystawia korektę odczytu, ale nie robi tego każda głowica i zakres zależy od urządzenia. Najpierw sprawdź instrukcję i porównaj odczyty po stabilizacji. Częste dynamiczne przepisywanie korekty może zwiększać ruch w sieci, zużycie baterii i niestabilność regulacji; stosuj je tylko po testach, z ograniczeniem częstotliwości i zmian.

## Koszty i taryfy: zamknij sprzężenie zwrotne

Harmonogram bez pomiaru to zgadywanie. Minimum, które warto mieć przed sezonem: pomiar zużycia źródła - impulsy z gazomierza albo pomiar energii pompy i grzejników - oraz historia temperatur per strefa. Jak to poskładać, opisałem w tekście o [monitoringu energii w Home Assistant](/pl/blog/monitoring-energii-home-assistant/); tutaj wystarczy powiedzieć, że bez tych danych nie odpowiesz na pytanie, czy obniżenie nocne w twoim domu w ogóle działa, ani które strefy grzeją najdłużej.

Taryfy wchodzą do gry przy ogrzewaniu elektrycznym, ale przesunięcie pracy pompy ciepła nie zawsze obniża koszt ani zużycie. Podniesienie nastawy może pogorszyć współczynnik efektywności i komfort, a ceny dynamiczne mogą mieć bloki krótsze niż godzina. Symuluj pełny rachunek i zmieniaj krzywą lub nastawę tylko w zakresie dopuszczonym przez producenta, z pomiarem efektu.

## Test na sucho we wrześniu

Wybierz pierwszy tydzień, w którym noce schodzą poniżej dziesięciu stopni, i przeprowadź próbę generalną. Scenariusz: podnieś nastawy o dwa, trzy stopnie powyżej aktualnej temperatury pomieszczeń, tak żeby grzanie ruszyło naprawdę, i przez dwa, trzy dni obserwuj historię - czy każda głowica otwiera zawór, czy temperatura w każdej strefie dochodzi do nastawy i w jakim czasie, czy kocioł dostaje żądanie grzania dokładnie wtedy, kiedy powinien. Potem przywróć normalne nastawy i pozwól harmonogramowi przejść pełny cykl tygodniowy bez dotykania. Wszystko, co wymaga poprawki, poprawiasz przy otwartym oknie pogodowym, nie w mrozie.

> Harmonogram ogrzewania, który pierwszy raz uruchamiasz w listopadzie, debugujesz w czapce i przy niezadowolonych domownikach.

Lista typowych błędów pierwszego sezonu - wszystkie przerabiałem na własnym domu:

- **Głowice bez kalibracji** - pokoje stabilnie o dwa stopnie chłodniejsze niż nastawa, domownicy podkręcają na ślepo i harmonogram traci sens. Kalibruj przed sezonem, nie w jego trakcie.
- **Harmonogram walczący z ręcznymi zmianami** - ktoś podnosi temperaturę pokrętłem, a automatyzacja po dziesięciu minutach ją cofa. Wprowadź pomocnika logicznego w roli trybu ręcznego, który wstrzymuje automatyzacje strefy na kilka godzin po ręcznej zmianie.
- **Brak trybu wietrzenia** - grzejnik może grzać przy otwartym oknie. Czujnik otwarcia jest jedną z metod, ale logika wznowienia musi pamiętać poprzedni tryb i respektować zabezpieczenia źródła.
- **Zapieczone zawory** - głowica raportuje otwarcie, a zawór fizycznie stoi. Przed sezonem przegoń każdy zawór kilka razy od pełnego otwarcia do pełnego zamknięcia.
- **Wszystkie strefy startują o tej samej godzinie** - mogą zwiększyć chwilowe zapotrzebowanie, ale zachowanie zależy od regulacji i modulacji źródła. Rozsuwaj starty tylko wtedy, gdy pomiary pokazują problem i nie pogarsza to komfortu.

## Podsumowanie

Dom gotowy na jesień to nie gadżet, tylko sekwencja: inwentaryzacja źródła ciepła i punktów sterowania, strefy z parą temperatur komfortowa-obniżona, harmonogram tygodniowy na wbudowanym pomocniku, obecność jako korekta wyjątków, kalibracja głowic względem zewnętrznych czujników i pomiar zużycia jako sprzężenie zwrotne. Kolejność ma znaczenie - harmonogram zbudowany na nieskalibrowanych głowicach to budowanie na piasku. Zacznij w ten weekend od inwentaryzacji i próbnego uruchomienia grzania, wrzesień zostaw na kalibrację i test na sucho. Kiedy w połowie października przyjdzie pierwszy prawdziwy chłód, dom po prostu zrobi swoje - a ty najwyżej zajrzysz do historii, żeby potwierdzić, że wszystko zagrało.
