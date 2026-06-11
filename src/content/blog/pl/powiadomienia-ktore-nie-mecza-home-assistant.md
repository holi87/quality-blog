---
title: "Powiadomienia, które nie męczą: strategia notyfikacji w Home Assistant"
description: "Warstwowy model powiadomień (alarm, informacja, dziennik), powiadomienia akcyjne z przyciskami, eskalacja dla zdarzeń krytycznych oraz ciche godziny i grupowanie - z przykładami yaml."
date: 2026-08-10
tags: ["smart-home", "home-assistant", "powiadomienia", "automatyzacje", "ux"]
lang: pl
readingTime: 9
author: GH
---

Po trzech tygodniach od wdrożenia smart home większość ludzi wyłącza powiadomienia, bo dom spamuje o wszystkim: pralka skończyła, czujnik wrócił do sieci, temperatura spadła o pół stopnia. A potem przegapiają to jedno powiadomienie o zalaniu pod zmywarką. Pokażę warstwowy model notyfikacji, wzorce powiadomień akcyjnych i eskalacji oraz kilka krótkich przykładów yaml, które wdrożysz w jeden wieczór.

## Jak dom uczy domowników ignorowania

Mechanizm jest dobrze znany z zespołów utrzymaniowych w IT: alarm, który dzwoni za często, przestaje być alarmem. W pracy nazywamy to zmęczeniem alertami i traktujemy jako poważną wadę systemu monitoringu - a potem wracamy do domu i budujemy sobie dokładnie tę samą wadę własnymi rękami. Każda nowa automatyzacja dostaje „na wszelki wypadek" powiadomienie, po miesiącu telefon brzęczy piętnaście razy dziennie, a po dwóch wszystkie powiadomienia z Home Assistant są wyciszone systemowo.

Problem nie leży w liczbie powiadomień, tylko w braku rozróżnienia ich wagi. Kiedy „wykryto wodę pod zmywarką" wygląda i brzmi identycznie jak „pranie zakończone", odbiorca nie ma jak nauczyć się reagować różnie. Lekarstwem jest jawny model warstw.

## Trzy warstwy: alarm, informacja, dziennik

Każde powiadomienie w moim domu musi mieć przypisaną jedną z trzech warstw, zanim w ogóle powstanie automatyzacja:

| Warstwa | Kryterium | Kanał | Przykłady |
| --- | --- | --- | --- |
| Alarm | Wymaga działania teraz; koszt przegapienia wysoki | Powiadomienie krytyczne - przebija wyciszenie, dzwoni, budzi | Zalanie, dym, czad, brama otwarta w nocy, alarm włamaniowy |
| Informacja | Przyda się wiedzieć dziś; działanie opcjonalne | Zwykły cichy push na telefon | Pranie skończone, paczka u drzwi, gość w drodze, niska bateria czujnika |
| Dziennik | Może się przydać kiedyś; działania brak | Tylko wpis w dzienniku HA, zero pushy | Czujnik wrócił do sieci, automatyzacja wykonana, drzwi otwarte w dzień |

Test kwalifikacyjny jest brutalnie prosty: co się stanie, jeśli zobaczę to powiadomienie jutro? Jeśli nic - to dziennik. Jeśli stracę trochę wygody - informacja. Jeśli stracę pieniądze, zdrowie albo poczucie bezpieczeństwa - alarm. W moim domu na warstwę alarmową kwalifikuje się sześć zdarzeń. Sześć, nie sześćdziesiąt - i właśnie dlatego, kiedy telefon zadzwoni dźwiękiem alarmu, wszyscy wiedzą, że to nie ćwiczenia.

Technicznie: aplikacja mobilna Home Assistant wspiera powiadomienia krytyczne na iOS i kanały powiadomień o różnych priorytetach na Androidzie. Warstwę alarmową wysyłasz z najwyższym priorytetem i flagą krytyczną, informacyjną jako zwykły push, a dziennik załatwia usługa wpisu do dziennika zdarzeń - bez ruszania telefonu.

Warstwa informacyjna ma jeszcze jeden przydatny wariant: **podsumowanie poranne**. Zamiast wysyłać każdą informację natychmiast, część z nich można zbierać i dostarczać raz dziennie w jednej wiadomości: prognoza, stan baterii czujników, co dom zrobił w nocy, czy są zaległe sprawy w rodzaju otwartego od wczoraj okna w piwnicy. Jedna wiadomość o 7:30 zastępuje u mnie sześć do ośmiu pojedynczych powiadomień, a czyta się ją lepiej niż wszystkie z osobna.

## Powiadomienia akcyjne: pytanie zamiast komunikatu

Połowa moich powiadomień informacyjnych zniknęła, kiedy zrozumiałem, że dom nie powinien raportować - powinien pytać. Zamiast „brama otwarta od 10 minut" (i co ja mam z tym zrobić, stojąc w kolejce w sklepie?) telefon dostaje pytanie z dwoma przyciskami:

```yaml
actions:
  - action: notify.mobile_app_telefon_gh
    data:
      title: "Brama otwarta od 10 minut"
      message: "Zamknąć?"
      data:
        actions:
          - action: "ZAMKNIJ_BRAME"
            title: "Zamknij"
          - action: "ZOSTAW_OTWARTA"
            title: "Zostaw na 30 min"
```

Druga automatyzacja nasłuchuje zdarzenia naciśnięcia przycisku i wykonuje akcję. Jeden dotyk kciukiem zamiast otwierania aplikacji, szukania właściwej karty i przełącznika. Ten wzorzec pasuje wszędzie tam, gdzie reakcja jest binarna: zamknąć bramę, podlać ogród mimo prognozy deszczu, włączyć zmywarkę teraz czy w taniej taryfie, uzbroić alarm mimo otwartego okna na piętrze.

## Eskalacja: dom, który nie odpuszcza, gdy trzeba

Warstwa alarmowa ma jeszcze jeden obowiązek: nie dać się przegapić. Wzorzec eskalacji wygląda tak - wyślij powiadomienie, poczekaj na reakcję określony czas, przy braku reakcji podnieś poziom:

```yaml
      - wait_for_trigger:
          - trigger: event
            event_type: mobile_app_notification_action
            event_data:
              action: "POTWIERDZAM_ZALANIE"
        timeout: "00:03:00"
      - if: "{{ wait.trigger is none }}"
        then:
          - action: notify.mobile_app_telefon_julii
          - action: media_player.play_media
            target:
              entity_id: media_player.glosniki_dom
```

W praktyce: czujnik zalania budzi mój telefon powiadomieniem krytycznym; jeśli w trzy minuty nie potwierdzę, powiadomienie idzie na drugi telefon, a głośniki w całym domu zaczynają mówić. Trzeci poziom (po kolejnych minutach ciszy) to zamknięcie elektrozaworu wody - dom przestaje pytać i zaczyna działać. Eskalację rezerwuj wyłącznie dla warstwy alarmowej; eskalujące powiadomienie o praniu to prosta droga do rozwodu z technologią.

> Każde powiadomienie, które nie zmienia twojego zachowania, uczy cię ignorować wszystkie pozostałe - łącznie z tym jednym, które kiedyś będzie naprawdę ważne.

## Ciche godziny, grupowanie i adresowanie

Trzy szlify, które robią różnicę między systemem znośnym a dobrym. Pierwszy: **ciche godziny dla warstwy informacyjnej**. Powiadomienia o skończonym praniu nie mają prawa istnieć między 22 a 7 - warunek czasowy w automatyzacji albo centralny skrypt powiadamiający, który sprawdza godzinę zanim wyśle. Warstwa alarmowa cichych godzin nie ma z definicji: zalanie o trzeciej w nocy ma budzić.

Drugi: **grupowanie**. Pięć czujników zgłaszających niską baterię to jedno zbiorcze powiadomienie raz w tygodniu, w sobotę o dziesiątej, z listą czujników - nie pięć osobnych brzęczyków w losowych momentach. To samo z raportami: jedna poranna wiadomość „dom dziś" zamiast strumyka drobiazgów.

Trzeci: **adresowanie do właściwej osoby**. Powiadomienie o otwartej bramie powinno iść do tego, kto jest w domu albo najbliżej - nie do wszystkich. Warunek na strefie obecności załatwia sprawę, a przy okazji o połowę zmniejsza liczbę powiadomień na osobę. Wspólny mianownik tych trzech szlifów: zamiast rozsypywać logikę po dziesiątkach automatyzacji, zbuduj jeden centralny skrypt powiadamiający z parametrami (warstwa, treść, adresat) i wołaj go zewsząd. Zmiana cichych godzin to wtedy edycja jednego miejsca.

## Kanały poza telefonem: światło, głośniki, tablet

Telefon to domyślny, ale nie jedyny kanał - i część powiadomień w ogóle nie powinna na niego trafiać, bo istnieją lepsze nośniki. **Światło jako sygnał**: kinkiet w przedpokoju świecący na zielono, gdy pranie skończone, albo na pomarańczowo, gdy któreś okno jest otwarte przy włączonym ogrzewaniu. Informacja jest widoczna dokładnie wtedy, gdy przechodzisz obok, nie wymaga sięgania po telefon i nie przeszkadza, gdy cię nie ma. Dla domowników, którzy nie chcą żadnych aplikacji, to często jedyny akceptowany interfejs.

**Głośniki i komunikaty głosowe** sprawdzają się dla zdarzeń ważnych dla wszystkich obecnych: gość przy furtce, woda pod zmywarką, przypomnienie o wyjściu do szkoły. Reguła higieny: komunikaty głosowe tylko wtedy, gdy ktoś jest w domu (warunek na strefie obecności) i nigdy w cichych godzinach poza warstwą alarmową. Mówiący do pustego domu głośnik to strata, mówiący o 23:30 - sabotaż.

**Tablet ścienny** z panelem to dobre miejsce na warstwę pośrednią: trwałe powiadomienia wewnątrz Home Assistant, które wiszą na widoku, dopóki ktoś ich nie potwierdzi - lista spraw domu zamiast strumienia pushy. Tam mieszkają u mnie rzeczy w rodzaju „filtr w oczyszczaczu do wymiany" - za mało pilne na telefon, za ważne na sam dziennik.

## Audyt i reguła awansu

Strategia powiadomień nie jest projektem jednorazowym - degraduje się z każdą nową automatyzacją. Dwa mechanizmy trzymają ją w ryzach. Pierwszy: **kwartalny audyt**. Przejrzyj historię powiadomień z ostatniego tygodnia (aplikacja mobilna ją przechowuje) i dla każdego zadaj dwa pytania: czy zrobiłem coś w reakcji na nie i czy chciałbym dostać je ponownie. Dwa razy „nie" oznacza degradację o warstwę w dół albo kasację. Drugi: **reguła awansu dla nowych automatyzacji** - każda nowa automatyzacja zaczyna z powiadomieniem w warstwie dziennika. Awans do cichego pusha musi zasłużyć: jeśli w ciągu dwóch tygodni ani razu nie zajrzałeś do dziennika z myślą „szkoda, że tego nie dostałem na telefon", powiadomienie zostaje tam, gdzie jest. Ten jeden nawyk odwraca domyślny kierunek: zamiast walczyć z rosnącym spamem, świadomie wpuszczasz pojedyncze powiadomienia wyżej.

## Podsumowanie

Dobre powiadomienia to nie funkcja, tylko strategia: trzy warstwy (alarm, informacja, dziennik) z twardym testem kwalifikacyjnym, powiadomienia akcyjne zamiast raportów tam, gdzie reakcja jest binarna, eskalacja wyłącznie dla zdarzeń, których nie wolno przegapić, ciche godziny i grupowanie dla całej reszty. Zacznij od audytu: przejrzyj powiadomienia z ostatniego tygodnia i każde przypisz do warstwy - to, co nie mieści się w żadnej, skasuj bez żalu. Mój wynik z takiego audytu sprzed roku: z dwudziestu trzech powiadomień dziennie zostało pięć, a poczucie kontroli nad domem wzrosło, zamiast spaść. Telefon, który brzęczy rzadko, to telefon, którego brzęczenie coś znaczy.
