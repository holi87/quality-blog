---
title: "Tryb wakacyjny w Home Assistant: symulacja obecności i dom, który sam się pilnuje"
description: "Jeden przełącznik input_boolean, symulacja obecności z losowością, warstwowe alarmy, watchdog łączności i kod dla zaufanej osoby - z przykładami yaml i listą kontrolną."
date: 2026-08-14
tags: ["smart-home", "home-assistant", "wakacje", "symulacja-obecnosci", "bezpieczenstwo"]
lang: pl
readingTime: 13
author: GH
---

Dom, który stoi pusty przez dwa tygodnie, to nie ten sam dom, w którym mieszkasz na co dzień - to inny tryb pracy z innymi priorytetami. Codzienne automatyzacje optymalizują wygodę; podczas urlopu mają udawać, że ktoś jest w środku, pilnować tego, czego nie widzisz, i wiedzieć, kogo zawołać, kiedy coś pójdzie nie tak. Pokażę, jak zbudowałem tryb wakacyjny w Home Assistant wokół jednego centralnego przełącznika: symulację obecności, która nie wygląda jak symulacja, warstwowe alarmy z eskalacją, nadzór nad samym systemem i wejście dla osoby, która przychodzi podlać kwiaty.

## Wyjazd to zmiana trybu pracy, nie rytuał piętnastu przełączników

Zanim zbudowałem tryb wakacyjny, każdy wyjazd zaczynał się od rytuału: obniżyć ogrzewanie, wyłączyć bojler, uzbroić alarm, wyciszyć komunikaty głośnikowe, przestawić powiadomienia, wyłączyć podlewanie trawnika. Piętnaście ręcznych zmian w aplikacji, robionych w pośpiechu gdzieś między pakowaniem walizek a zamykaniem drzwi. Zawsze coś umykało - raz bojler grzał wodę dla nikogo przez dwa tygodnie, innym razem czujnik ruchu w przedpokoju sumiennie zapalał światło każdemu przeciągowi. Za trzecim razem, gdy siedząc już w samochodzie odtwarzaliśmy z Julią z pamięci, czy bojler na pewno wyłączony, stało się jasne, że lista w głowie nie skaluje się na urlop.

Problem jest strukturalny, nie dyscyplinarny. Pusty dom ma inne priorytety niż zamieszkany: wygoda przestaje się liczyć, bo nie ma dla kogo być wygodnie, a na szczyt listy wchodzą bezpieczeństwo, oszczędność i informacja. Część codziennych automatyzacji robi się w tym trybie bezużyteczna (światło od ruchu), część szkodliwa (harmonogram ogrzewania), a część zmienia wagę: otwarte okno w dzień to normalnie drobiazg do dziennika, podczas urlopu - zdarzenie alarmowe. Skoro zmienia się cały kontekst pracy systemu, ta zmiana powinna być jedną decyzją, nie piętnastoma.

## Jeden przełącznik: input_boolean jako źródło prawdy

Cały tryb wakacyjny wisi u mnie na jednej encji - pomocniczym przełączniku [input_boolean](https://www.home-assistant.io/integrations/input_boolean/):

```yaml
input_boolean:
  tryb_wakacyjny:
    name: Tryb wakacyjny
    icon: mdi:airplane
```

Ten przełącznik nie robi nic sam z siebie - jest źródłem prawdy, o które pytają wszystkie pozostałe automatyzacje. Jedna automatyzacja reaguje na jego włączenie i przestawia dom:

```yaml
automation:
  - alias: "Tryb wakacyjny: wejście"
    triggers:
      - trigger: state
        entity_id: input_boolean.tryb_wakacyjny
        to: "on"
    actions:
      - action: climate.set_preset_mode
        target:
          entity_id: climate.dom
        data:
          preset_mode: away
      - action: switch.turn_off
        target:
          entity_id: switch.bojler
      - action: alarm_control_panel.alarm_arm_away
        target:
          entity_id: alarm_control_panel.dom
```

Druga, lustrzana, reaguje na wyłączenie i przywraca stan codzienny. Reszta automatyzacji w domu dostaje warunek na stan przełącznika: symulacja obecności działa tylko przy „on", światło od ruchu w przedpokoju tylko przy „off", powiadomienia o otwartych oknach zmieniają warstwę. Zysk z tej architektury widać przy powrocie: zamiast odtwarzać z pamięci listę piętnastu zmian, wyłączam jeden przełącznik jeszcze na lotnisku i wchodzę do domu, który już się nagrzewa.

Przełącznik włączam ręcznie przy wyjściu, choć nic nie stoi na przeszkodzie, żeby spinał się z kalendarzem urlopowym albo włączał sam, gdy oba telefony są poza domem dłużej niż dobę. Celowo tego nie automatyzuję: wejście w tryb wakacyjny to decyzja o wysokiej stawce i wolę podjąć ją świadomie, jednym dotknięciem, niż tłumaczyć domowi po weekendowym wyjeździe, czemu przez dwa dni symulował moją obecność przed pustą ulicą.

## Symulacja obecności: nieregularność jest cechą, nie błędem

Symulacja obecności ma jeden cel: z zewnątrz dom ma wyglądać na zamieszkany. Nie ma gwarancji, że zapobiegnie włamaniu, więc jest tylko dodatkiem do mechanicznych zabezpieczeń, alarmu i ustalonego planu reakcji. Idealnie regularny harmonogram może wyglądać sztucznie, dlatego używam okien czasowych zamiast identycznych godzin każdego dnia. Wystarczą pomieszczenia widoczne z zewnątrz - u mnie salon, sypialnia i łazienka.

Są dwa podejścia. Pierwsze: odtwarzanie historii - bierzesz zapisane stany świateł sprzed tygodnia albo miesiąca i odgrywasz je z przesunięciem, jak nagranie. To rozwiązanie najbliższe prawdzie, bo odtwarza twoje realne nawyki z całą ich nieregularnością; w społeczności Home Assistant istnieją gotowe integracje robiące dokładnie to. Drugie podejście, które stosuję: losowość w oknach czasowych. Definiujesz okna zgodne z prawdziwym rytmem domu i losujesz w nich moment startu oraz czas trwania:

```yaml
automation:
  - alias: "Wakacje: wieczorne światło w salonie"
    triggers:
      - trigger: sun
        event: sunset
        offset: "-00:20:00"
    conditions:
      - condition: state
        entity_id: input_boolean.tryb_wakacyjny
        state: "on"
    actions:
      - delay:
          minutes: "{{ range(0, 40) | random }}"
      - action: light.turn_on
        target:
          entity_id: light.salon
      - delay:
          hours: "{{ range(2, 4) | random }}"
          minutes: "{{ range(0, 59) | random }}"
      - action: light.turn_off
        target:
          entity_id: light.salon
```

Analogiczne automatyzacje dostają sypialnia (późniejsze okno, krótszy czas) i łazienka (krótkie epizody). Klucz: okna mają odpowiadać twoim prawdziwym nawykom. Jeśli światło w kuchni gaśnie u was zwykle o dwudziestej pierwszej, symulacja świecąca do północy jest równie fałszywa jak ciemność.

Rolety robią większą różnicę niż światła, bo widać je również w dzień. Rolety zamknięte przez dwa tygodnie to najgłośniejszy możliwy komunikat „nikogo nie ma" - więc podczas urlopu jeżdżą dalej w dziennym rytmie: rano w górę (z losowym przesunięciem), po zmierzchu w dół. Trzeci element to sporadyczne media: telewizor albo głośnik uruchamiany dwa-trzy wieczory w tygodniu na godzinę daje migotanie i dźwięk, których zza zasłon nie sposób odróżnić od faktycznej obecności. Sporadyczne, nie codzienne - znowu: regularność zdradza.

Symulację testuj tak, jak będzie oceniana: z ulicy. Tydzień przed wyjazdem włączam tryb wakacyjny na jeden próbny wieczór i wychodzę na spacer wokół domu - to najtańszy przegląd, jaki znam. Z chodnika od razu widać rzeczy, których nie widać w aplikacji: że sypialnia zapala się o dziwnej porze, że lampa za cienką zasłoną oświetla pusty pokój zbyt teatralnie, że przedpokój świeci przez godzinę, choć nikt nigdy nie spędza w nim godziny. Dwa takie spacery wystarczyły, żebym przestawił połowę okien czasowych.

## Czujki i eskalacja: dom melduje warstwami

Symulacja to teatr na zewnątrz; do środka dom patrzy czujkami. Zestaw obejmuje czujniki otwarcia, ruchu i zalania, certyfikowane autonomiczne czujki dymu oraz kamery - integracja z Home Assistant ma uzupełniać ich lokalne alarmowanie, a nie je zastępować. Powiadomienie krytyczne zależy od ustawień systemu telefonu i nie daje gwarancji przebicia każdego wyciszenia. Ruch bez wcześniejszego otwarcia drzwi jest sygnałem do pilnej weryfikacji, ale może też pochodzić od zwierzęcia lub błędu czujnika. Temperaturę budynku i temperaturę lodówki mierz osobnymi czujnikami w odpowiednich miejscach; jeden czujnik pokojowy nie wykryje obu awarii wiarygodnie.

Druga zmiana to ustalony plan eskalacji, bo nie istnieje plan awaryjny w postaci „zaraz zejdę i sprawdzę". Automatyczne zamknięcie zaworu po wykryciu zalania stosuję tylko po przetestowaniu czujników, zaworu i skutków odcięcia. Koszt fałszywego zamknięcia nie zawsze jest zerowy - instalacja może zasilać ogrzewanie, podlewanie albo system ochrony przeciwpożarowej. Brak mojego potwierdzenia kieruje powiadomienie do Julii, a później do zaufanej osoby z kluczami.

## Awarie: cisza jest dwuznaczna

Najtrudniejszy problem trybu wakacyjnego nie jest techniczny, tylko poznawczy: z perspektywy telefonu na drugim końcu Europy brak prądu, brak internetu i awaria serwera wyglądają identycznie jak dwa tygodnie spokoju - cisza. Dom, który nie ma nic do zgłoszenia, i dom, który nie może nic zgłosić, wysyłają dokładnie to samo: nic. Bez dodatkowego mechanizmu o awarii dowiesz się od pierwszej rzeczy, która pójdzie źle już po niej.

Rozwiązaniem jest watchdog (zewnętrzny strażnik łączności): usługa poza domem, która oczekuje od Home Assistant regularnego sygnału życia i alarmuje, gdy sygnał przestaje przychodzić. Implementacja jest banalna - automatyzacja co pięć minut odpytuje adres zewnętrznej usługi monitorującej, a usługa pisze do ciebie, gdy dom milczy dłużej niż kwadrans. Kierunek jest tu kluczowy: powiadomienia „dom stracił łączność" nie może wysłać dom, bo dom bez łączności nie wysyła niczego; musi je wysłać ktoś, kto obserwuje dom z zewnątrz. Krok dalej to router z zapasowym łączem LTE: przy awarii łącza głównego dom traci szybki internet, ale wciąż może wysyłać powiadomienia - a dokładnie o to w tym trybie chodzi.

Drugi element to podtrzymanie zasilania: UPS na serwer i router daje czas zależny od rzeczywistego obciążenia, pojemności i stanu baterii, a integracja może wystawić sensory stanu. Czas działania zmierz testem pod obciążeniem. Trzeci element to restart bez opieki: sprawdź przed wyjazdem, że po przywróceniu prądu serwer i Home Assistant startują, a stan pomocnika wraca zgodnie z konfiguracją. Zrób też aktualną kopię zapasową z przetestowanym odtwarzaniem.

## Zaufana osoba: wejście bez rozbrajania twierdzy

Kwiaty trzeba podlać, skrzynkę opróżnić - i nagle projekt „twierdza" potrzebuje bramy dla gościa. Najgorsze rozwiązanie: dać komuś główny kod do alarmu i powyłączać na czas urlopu czujki. Dobre rozwiązanie składa się z trzech elementów. Po pierwsze, kod czasowy: zamek szyfrowy i panel alarmowy dostają osobny kod dla zaufanej osoby, ważny wyłącznie w okresie urlopu - u mnie dodatkowo tylko w godzinach 8-20, bo podlewanie kwiatów o trzeciej w nocy nie jest scenariuszem, który chcę wspierać. Kod tworzę przed wyjazdem, a po powrocie wygasa automatycznie. Jeśli nie masz zamka z kodami, minimalny wariant to zwykły klucz plus osobny kod do panelu alarmowego - sekwencja pozostaje ta sama, tylko wejście wykrywa czujnik otwarcia drzwi zamiast zamka.

Po drugie, obsługa wizyty. Otwarcie drzwi kodem gościa uruchamia sekwencję: alarm rozbraja się w strefie parteru, symulacja obecności zawiesza się (żeby automat nie gasił nikomu światła nad głową), a ja dostaję powiadomienie informacyjne „Kasia weszła, 18:42" - informacyjne, nie alarmowe, bo to zdarzenie oczekiwane. Po trzecie, domknięcie: kiedy drzwi są zamknięte, a czujniki ruchu nie widzą nikogo przez kwadrans, dom sam uzbraja alarm z powrotem i wznawia symulację. Zaufana osoba nie potrzebuje aplikacji, konta ani szkolenia z Home Assistant - dostaje czterocyfrowy kod i informację, że dom się nią zaopiekuje.

## Lista kontrolna przed wyjazdem

Tryb wakacyjny przestawia dom jednym przełącznikiem, ale kilka rzeczy trzeba sprawdzić rękami. Moja lista, w kolejności wykonywania:

- **Baterie czujników** - wymień wszystkie poniżej 30%. Czujnik otwarcia, który umrze trzeciego dnia, robi dziurę w systemie dokładnie tam, gdzie jej nie widać.
- **Kopia zapasowa** - aktualna, wykonana po ostatnich zmianach konfiguracji, przechowywana poza domem.
- **Test czujek** - otwórz okno przy uzbrojonym alarmie, zewrzyj mokrym palcem czujnik zalania. Powiadomienia mają przyjść dokładnie w tej formie, w jakiej ich oczekujesz.
- **Test watchdoga** - zatrzymaj Home Assistant na dwadzieścia minut i sprawdź, czy alert o utracie łączności naprawdę przyszedł.
- **Zawór wody** - decyzję o ręcznym zamknięciu sprawdź z instrukcją instalacji i listą zależnych systemów; nie odcinaj wody potrzebnej ogrzewaniu ani ochronie przeciwpożarowej.
- **Kod dla zaufanej osoby** - utworzony, przetestowany jednym prawdziwym wejściem, z ustawioną datą wygaśnięcia.
- **Zero aktualizacji** - żadnych aktualizacji Home Assistant, dodatków ani oprogramowania urządzeń w ostatnich dniach przed wyjazdem. Stabilność bije nowości; do eksperymentów wrócisz.
- **Przełącznik** - włącz tryb wakacyjny przy drzwiach i poświęć dwie minuty na kontrolę w aplikacji: ogrzewanie w trybie poza domem, bojler wyłączony, alarm uzbrojony.

## Podsumowanie

Tryb wakacyjny to nie zestaw gadżetów, tylko zmiana umowy między tobą a domem: na co dzień dom optymalizuje twoją wygodę, podczas urlopu ma udawać ciebie, pilnować siebie i wiedzieć, kogo zawołać. Fundamentem architektury jest jeden input_boolean jako źródło prawdy, na którym wiszą wszystkie zmiany zachowania. Symulacja obecności działa dokładnie w takim stopniu, w jakim odtwarza prawdziwe nawyki z prawdziwą nieregularnością. Czujki zmieniają wagi zdarzeń, eskalacja najpierw działa, a potem melduje, a watchdog rozwiązuje problem dwuznacznej ciszy. Do tego kod czasowy dla osoby od kwiatów i lista kontrolna na ostatni wieczór. Całość budowałem tydzień, a zwraca się w jednej chwili: kiedy na leżaku orientujesz się, że od trzech dni ani razu nie pomyślałeś o tym, czy w domu wszystko w porządku.
