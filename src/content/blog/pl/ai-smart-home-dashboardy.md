---
title: "AI w Smart Home, część 3: Dom, który pokazuje sens - dashboardy projektowane z pomocą AI"
description: "Trzecia część mini-serii o AI w smart home. Pokazuję, jak używać AI do projektowania dashboardów Home Assistant: od informacji architektonicznej, przez układ widoków, po karty, statusy, dashboard techniczny i czytelne opisy."
date: 2026-06-22
tags: ["ai", "smart home", "home assistant", "dashboardy", "ux"]
lang: pl
readingTime: 13
author: [JS, GH]
---

W pierwszej części serii dom nauczył się lepiej widzieć. W drugiej - lepiej przekładać intencje na automatyzacje. W trzeciej dochodzimy do warstwy, z którą człowiek najczęściej ma kontakt bezpośredni: dashboardów.

Dashboard w smart home bardzo łatwo zepsuć. Wystarczy pokazać wszystko. Każdą lampę, każdy czujnik, każdy przełącznik, każdy wykres, każdą baterię, każdą temperaturę, każdy tryb. Efekt wygląda imponująco przez pierwsze pięć minut, a potem staje się cyfrową szafą z kablami: wszystko niby jest, ale trudno znaleźć to, co ważne.

Dobry dashboard nie jest listą encji. Dobry dashboard odpowiada na pytania. Czy wszystko jest w porządku? Czy dom jest bezpieczny? Czy coś wymaga mojej reakcji? Ile energii zużywam? Czy auto się ładuje? Czy okna są otwarte? Czy kot dostał jedzenie? Czy system działa stabilnie?

AI może tu pomóc nie dlatego, że „ładnie rozmieści kafelki”. Największa wartość AI polega na tym, że potrafi uporządkować informację, zaproponować strukturę widoków, nazwać sekcje językiem użytkownika, wygenerować warianty dla telefonu i tabletu oraz pomóc zbudować dashboard techniczny dla administratora domu. Innymi słowy: AI pomaga przejść od „mam dużo encji” do „mam interfejs, który ma sens”.

## Dashboard to produkt, nie dekoracja

Dashboard smart home warto traktować jak mały produkt. Ma użytkowników, cele, kontekst użycia i ograniczenia. Inaczej wygląda dashboard na telefonie, inaczej na tablecie na ścianie, inaczej dla osoby technicznej, a inaczej dla gościa.

Telefon służy zwykle do szybkiej reakcji. Chcemy zobaczyć status domu, otworzyć bramę, wyłączyć światło, sprawdzić alarm, zmienić tryb, uruchomić odkurzacz. Tablet ścienny jest bardziej wspólnym panelem domu: światła, sceny, temperatura, multimedia, status wejść. Dashboard techniczny jest dla administratora: baterie, niedostępne encje, błędy automatyzacji, status Zigbee/Z-Wave/Wi-Fi, aktualizacje, backupy, logi.

Jeżeli wszystkie te potrzeby wrzucimy do jednego widoku, powstanie chaos. Dlatego pierwsze pytanie nie brzmi „jakie karty dodać?”, tylko „kto i po co będzie tego używał?”.

AI jest świetne właśnie na tym etapie. Możemy dać mu listę encji i poprosić o architekturę informacji, zanim zaczniemy cokolwiek rysować.

## Home Assistant: widoki, sekcje, karty

Home Assistant dashboardy są oparte o widoki i karty. Widok można traktować jak zakładkę lub stronę, a karty jako elementy pokazujące stan, sterowanie, wykres, listę, przycisk albo grupę informacji. Nowsze podejście oparte o sections pomaga wizualnie grupować powiązane karty, porządkować widok i przenosić elementy między sekcjami. Dokumentacja Home Assistant opisuje też możliwość ustawiania widoczności sekcji na podstawie warunków oraz dodawania tła lub motywów dla sekcji.

To oznacza, że nie musimy projektować jednego wielkiego ekranu. Możemy projektować warstwowo:

```text
Dashboard główny
  ├─ Widok: Home / status
  ├─ Widok: Security
  ├─ Widok: Energy
  ├─ Widok: Climate
  ├─ Widok: Rooms
  ├─ Widok: Cat / Pet
  └─ Widok: Technical / Admin
```

Każdy widok może mieć sekcje. Na przykład główny widok:

```text
Home
  ├─ Czy wszystko OK?
  ├─ Szybkie akcje
  ├─ Najważniejsze alerty
  ├─ Energia teraz
  ├─ Komfort
  └─ Ostatnie zdarzenia
```

To jest bardzo dobre miejsce dla AI. Model może zaproponować hierarchię, nazwy, priorytety i warianty. Potem człowiek decyduje, co naprawdę pasuje do domu.

## Pierwszy prompt: od encji do architektury informacji

Zamiast prosić AI: „zrób mi ładny dashboard”, lepiej zacząć od architektury.

```text
Jesteś UX designerem i architektem Home Assistant.
Na podstawie poniższej listy encji zaproponuj strukturę dashboardów.

Kontekst:
- dom jednorodzinny,
- jedna osoba pracuje zdalnie,
- jeden kot,
- fotowoltaika i magazyn energii planowane lub dostępne,
- jedno auto elektryczne,
- Home Assistant działa jako centrum smart home,
- dashboard ma być używany na telefonie i tablecie ściennym.

Zadanie:
1. zaproponuj widoki dashboardu,
2. dla każdego widoku zaproponuj sekcje,
3. określ, które informacje są krytyczne, a które pomocnicze,
4. zaproponuj wersję mobile-first,
5. zaproponuj oddzielny dashboard techniczny,
6. nie generuj jeszcze YAML.

Lista encji:
[wklej listę encji]
```

Taki prompt zmienia rozmowę. AI nie wybiera od razu kart. Najpierw projektuje sens. To podobne do projektowania aplikacji: zanim dobierzemy komponenty UI, musimy wiedzieć, jaki jest przepływ użytkownika.

## Zasada numer jeden: dashboard ma pokazywać wyjątki

Najlepszy dashboard nie pokazuje wszystkiego, tylko to, co wymaga uwagi. W smart home większość rzeczy przez większość czasu jest normalna. Drzwi są zamknięte, okna są zamknięte, światła są wyłączone albo działają automatycznie, temperatura jest w normie, baterie są OK, internet działa.

Jeżeli dashboard cały czas pokazuje pełną listę wszystkiego, użytkownik musi sam wyłowić wyjątek. To męczące. Lepszy model to:

```text
Najpierw status ogólny.
Potem alerty i wyjątki.
Potem szybkie akcje.
Dopiero dalej szczegóły.
```

Przykład sekcji „Czy wszystko OK?”:

- alarm: uzbrojony / rozbrojony;
- drzwi i okna: wszystko zamknięte albo lista otwartych;
- obecność: domownicy w domu / poza domem;
- energia: pobór teraz, produkcja, bateria, ładowanie auta;
- system: liczba niedostępnych encji, niski poziom baterii, backup.

AI może pomóc stworzyć tekstowe podsumowanie takiej sekcji, np. do karty Markdown:

```text
Wszystko OK. Dom jest w trybie dziennym. Zamknięte są wszystkie drzwi i okna.
Tesla nie jest podłączona. Produkcja PV pokrywa bieżące zużycie.
```

Albo, gdy coś wymaga reakcji:

```text
Uwaga: otwarte jest okno w gabinecie, a prognoza pokazuje deszcz.
Bateria czujnika w kotłowni ma 8%. Auto jest podłączone, ale ładowanie nie ruszyło.
```

Taka warstwa może być zbudowana klasycznie przez template sensory, a AI może pomóc wygenerować treści, nazwy, warunki i logikę priorytetów.

## Dashboard główny: mniej znaczy szybciej

Widok główny powinien odpowiadać na pytanie: „czy muszę coś zrobić?”. Nie musi zawierać każdego urządzenia. Proponowana struktura:

| Sekcja | Cel | Przykładowe elementy |
| --- | --- | --- |
| Status domu | Jedno spojrzenie na sytuację | alarm, obecność, tryb domu, alerty |
| Szybkie akcje | Najczęstsze ręczne działania | tryb nocny, tryb gościa, wszystkie światła off, odkurzacz |
| Bezpieczeństwo | Wejścia i zdarzenia | drzwi, okna, brama, ostatni ruch |
| Komfort | Klimat i światło | temperatura, wilgotność, sceny |
| Energia | Teraz, bez szczegółów | pobór, produkcja, bateria, auto |
| Ostatnie zdarzenia AI | Kontekst z części 1 | paczka, osoba przy furtce, ruch w ogrodzie |

AI może zaproponować, które elementy dać najwyżej na telefonie, a które przenieść niżej. Na telefonie priorytetem są duże przyciski i krótkie statusy. Na tablecie można pokazać więcej kontekstu, wykresy i sekcje obok siebie.

## Dashboard security: bezpieczeństwo bez paniki

Widok bezpieczeństwa powinien być spokojny i konkretny. Nie chodzi o czerwony alarm przy każdym ruchu. Chodzi o jasną informację:

- które drzwi i okna są otwarte;
- jaki jest stan alarmu;
- czy brama jest zamknięta;
- kiedy był ostatni ruch przy furtce;
- czy kamera AI wykryła coś istotnego;
- czy są zdarzenia wymagające reakcji.

AI może pomóc zaprojektować kategorie zdarzeń:

```text
critical: alarm, zalanie, dym, otwarte drzwi podczas nieobecności
warning: otwarte okno, niski poziom baterii czujnika, brama otwarta za długo
info: paczka dostarczona, ruch przy furtce, kot w ogrodzie
```

To lepsze niż jeden worek „notifications”. Dashboard powinien różnicować wagę zdarzeń. Jeżeli wszystko jest alarmem, nic nie jest alarmem.

Warto też rozdzielić widok dla domownika od widoku technicznego. Domownik nie musi widzieć każdego binary sensora. Powinien widzieć „otwarte: okno w gabinecie”. Administrator może mieć szczegółową listę encji.

## Dashboard energy: AI jako tłumacz danych

Energia to obszar, w którym smart home bardzo łatwo staje się przeładowany wykresami. Pobór, produkcja, autokonsumpcja, magazyn energii, import, eksport, ładowanie auta, taryfy, prognoza pogody - wszystko jest ciekawe, ale nie wszystko jest potrzebne na ekranie głównym.

Dobrze zaprojektowany widok energii powinien odpowiadać na pytania:

- ile dom zużywa teraz?
- skąd bierze energię: PV, bateria, sieć?
- czy auto się ładuje?
- czy ładowanie ma sens teraz, czy lepiej później?
- czy magazyn energii wystarczy na najbliższe godziny?
- czy dzisiejszy wynik jest normalny?

AI może pomóc nazwać te informacje ludzkim językiem. Zamiast samego wykresu możemy mieć krótkie podsumowanie:

```text
Dom zużywa teraz 1,2 kW. PV produkuje 2,8 kW, więc nadwyżka ładuje magazyn.
Tesla nie jest podłączona. Dzisiejsza produkcja jest wyższa niż średnia z ostatnich 7 dni.
```

Oczywiście takie zdanie musi opierać się na realnych sensorach i template logic. AI nie powinno zgadywać danych. Może natomiast pomóc napisać template, wybrać progi i ułożyć warstwę prezentacji.

## Dashboard techniczny: observability dla domu

To mój ulubiony dashboard, bo łączy smart home z myśleniem jakościowym. Każdy większy Home Assistant potrzebuje widoku administracyjnego. Nie musi być piękny. Musi być użyteczny.

Sekcje dashboardu technicznego:

| Sekcja | Co pokazuje |
| --- | --- |
| Health | niedostępne encje, restart, uptime, wersja HA |
| Baterie | sensory poniżej 20%, poniżej 10%, ostatnia aktualizacja |
| Sieć | status routera, AP, urządzeń krytycznych |
| Automatyzacje | ostatnio uruchomione, wyłączone, błędy, trace do sprawdzenia |
| Integracje | Zigbee, Z-Wave, MQTT, Shelly, UniFi, HACS |
| Backup | ostatni backup, status, miejsce na dysku |
| AI | liczba analiz, koszt, opóźnienia, błędy odpowiedzi |

AI może pomóc zaprojektować taki dashboard jak panel observability. Możemy poprosić:

```text
Zaprojektuj techniczny dashboard Home Assistant dla administratora.
Priorytet: wykrywanie problemów zanim zauważy je domownik.
Uwzględnij: baterie, niedostępne encje, automatyzacje, backup,
sieć, integracje, urządzenia krytyczne, AI vision.
Dla każdej sekcji podaj: cel, przykładowe sensory, próg alertu,
propozycję karty i test, który potwierdza, że sekcja działa.
```

To podejście jest bardzo bliskie testowaniu i monitorowaniu systemów. Dom też jest systemem produkcyjnym, tylko że jego użytkownicy siedzą przy kuchennym stole.

## Prompt do generowania kart i opisów

Gdy struktura dashboardu jest gotowa, można poprosić AI o konkretne karty. Najlepiej nie generować od razu całego dashboardu. Lepiej pracować sekcjami.

```text
Na podstawie poniższej sekcji dashboardu Home Assistant zaproponuj karty.
Nie używaj custom cards, chyba że oznaczysz je jako opcjonalne.
Preferuj rozwiązania wbudowane.
Dla każdej karty podaj:
- cel,
- encje,
- typ karty,
- krótką nazwę widoczną dla użytkownika,
- warunki widoczności,
- czy karta jest ważna na mobile.

Sekcja:
Security / Otwarte wejścia i ostatnie zdarzenia

Encje:
[wklej encje]
```

Taki prompt wymusza myślenie produktowe. Karta nie jest dodatkiem wizualnym, tylko odpowiedzią na konkretną potrzebę.

Można też poprosić o teksty:

```text
Zaproponuj krótkie, naturalne nazwy dla kart Home Assistant.
Styl: po polsku, prosto, bez technicznego żargonu.
Zamiast "binary_sensor.front_door_contact" użyj nazwy zrozumiałej dla domownika.
```

To drobiazg, ale bardzo zmienia odbiór dashboardu. „Front door contact” jest nazwą techniczną. „Drzwi wejściowe” jest nazwą dla człowieka.

## Mobile-first i wall tablet

AI może też pomóc stworzyć dwa warianty tego samego dashboardu.

Wariant mobile-first:

- maksymalnie 3-5 najważniejszych sekcji;
- duże przyciski;
- mało wykresów;
- status i akcja ponad szczegółami;
- karty warunkowe pokazujące tylko problemy;
- szybkie przełączniki trybów.

Wariant wall tablet:

- więcej kontekstu;
- widok pomieszczeń;
- sceny świetlne;
- pogoda;
- energia;
- multimedia;
- status bezpieczeństwa;
- estetyka pasująca do domu.

To są różne produkty. Telefon jest pilotem i systemem alertów. Tablet jest panelem domu. Dashboard administratora jest narzędziem diagnostycznym. Jeżeli AI dostanie ten kontekst, zwykle zaproponuje znacznie lepszy układ.

## AI-generated dashboard: na co uważać

Największe ryzyko przy generowaniu dashboardów z AI to fałszywa pewność. Model może wygenerować YAML, który wygląda profesjonalnie, ale używa nieistniejących encji, nieobsługiwanych opcji albo custom cards, których nie mamy zainstalowanych. Może też przesadzić z estetyką i zapomnieć o użyteczności.

Dlatego warto trzymać się zasad:

- najpierw architektura informacji, potem karty;
- najpierw jeden widok, potem cały dashboard;
- najpierw wbudowane karty, custom cards dopiero świadomie;
- każda karta ma mieć cel;
- każda encja musi istnieć;
- dashboard ma być testowany na telefonie i tablecie;
- elementy wysokiego ryzyka, jak zamki i bramy, wymagają ostrożności;
- widok gościa nie powinien pokazywać technicznych lub wrażliwych informacji.

W praktyce dashboard tworzony z AI powinien przejść review tak samo jak automatyzacja. Pytamy: czy to jest czytelne? Czy działa na małym ekranie? Czy osoba nietechniczna rozumie komunikaty? Czy najważniejsze informacje są na górze? Czy coś krytycznego jest ukryte zbyt głęboko?

## AI jako autor podsumowań

Ciekawym kierunkiem jest dashboard, który nie tylko pokazuje karty, ale generuje krótkie podsumowania. Na przykład rano:

```text
Dzień dobry. W domu jest 22°C, wilgotność w normie.
Wszystkie okna są zamknięte. Dziś prognozowany jest deszcz po 16:00.
Tesla ma 68% baterii. W nocy nie było istotnych zdarzeń przy furtce.
```

Albo wieczorem:

```text
Dom jest gotowy do trybu nocnego. Otwarte jest tylko okno w sypialni.
Na dole świeci się światło w salonie. Ostatni ruch przy furtce był o 19:42.
```

Takie podsumowania mogą być generowane przez klasyczne templates albo przez AI Task, zależnie od tego, czy potrzebujemy tylko składania danych, czy bardziej naturalnego języka. Ważne: dane muszą pochodzić z sensorów, a AI ma je opisywać, nie wymyślać.

## Podsumowanie

AI może bardzo pomóc w tworzeniu dashboardów, ale nie powinno zaczynać od kolorów i kafelków. Najpierw powinno pomóc odpowiedzieć na pytania: kto używa dashboardu, w jakiej sytuacji, po co, na jakim urządzeniu i jaka informacja jest naprawdę ważna.

Dobry dashboard smart home nie pokazuje całego domu naraz. Pokazuje sens. Najpierw status i wyjątki. Potem szybkie akcje. Potem szczegóły. Oddziela potrzeby domownika od potrzeb administratora. Inaczej wygląda na telefonie, inaczej na tablecie, inaczej w widoku technicznym.

W całej mini-serii przewija się ta sama zasada: AI jest najlepsze jako warstwa wspierająca człowieka i system, a nie jako niekontrolowany operator domu. W LLM Vision pomaga rozumieć obraz. W automatyzacjach pomaga projektować zachowanie. W dashboardach pomaga uporządkować informację.

Smart home z AI nie musi być futurystycznym gadżetem. Może być po prostu bardziej zrozumiały, mniej hałaśliwy i bardziej użyteczny.

## Źródła i dalsza lektura

- [Home Assistant - Dashboard views](https://www.home-assistant.io/dashboards/views/)
- [Home Assistant - Sections view](https://www.home-assistant.io/dashboards/sections/)
- [Home Assistant - Introduction to templating](https://www.home-assistant.io/docs/templating/introduction/)
- [Home Assistant - AI Task integration](https://www.home-assistant.io/integrations/ai_task/)
- [Home Assistant Developer Docs - API for Large Language Models](https://developers.home-assistant.io/docs/core/llm/)
- [LLM Vision for Home Assistant - GitHub repository](https://github.com/valentinfrlch/ha-llmvision)
