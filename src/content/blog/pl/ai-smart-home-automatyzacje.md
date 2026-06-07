---
title: "AI w Smart Home, część 2: Dom, który myśli scenariuszami - automatyzacje z pomocą AI"
description: "Druga część mini-serii o AI w smart home. Pokazuję, jak używać modeli językowych do projektowania, generowania, recenzowania i dokumentowania automatyzacji w Home Assistant - bez oddawania im pełnej kontroli nad domem."
date: 2026-06-15
tags: ["ai", "smart home", "home assistant", "automatyzacje", "yaml"]
lang: pl
readingTime: 13
author: [JS, GH]
---

W pierwszej części serii pokazałem, jak AI może dodać do smart home warstwę interpretacji obrazu. Kamera nie musi już tylko zgłaszać ruchu. Może pomóc rozpoznać, czy przy furtce stoi człowiek, czy w ogrodzie przebiegł kot, czy pod drzwiami leży paczka. To jednak dopiero początek.

Prawdziwa wartość smart home pojawia się wtedy, gdy z obserwacji powstaje działanie. Nie chodzi o działanie chaotyczne, przypadkowe albo „magiczne”. Chodzi o dobrze zaprojektowaną automatyzację, która wie, kiedy ma się uruchomić, kiedy nie powinna robić nic, jakie warunki musi sprawdzić i co dokładnie ma wykonać.

AI może w tym bardzo pomóc. Nie jako autonomiczny zarządca domu, który sam wymyśla reguły i od razu je wdraża. Raczej jako analityk, architekt, recenzent i generator pierwszego szkicu. Dobry model językowy potrafi zamienić opis w języku naturalnym na tabelę triggerów, warunków i akcji. Potrafi znaleźć brakujące przypadki brzegowe. Potrafi zaproponować strukturę YAML. Potrafi też wytłumaczyć istniejącą automatyzację tak, aby po trzech miesiącach nadal było wiadomo, dlaczego działa tak, a nie inaczej.

Ta część mini-serii jest o tym, jak tworzyć automatyzacje z pomocą AI w sposób praktyczny i bezpieczny.

## Automatyzacja to nie magia, tylko kontrakt

W Home Assistant automatyzacja ma bardzo logiczną strukturę. Oficjalna dokumentacja opisuje trigger jako coś, co „budzi” automatyzację. Gdy trigger się uruchomi, Home Assistant sprawdza warunki i jeśli są spełnione, wykonuje akcje. Ten prosty model jest genialny, bo pozwala opisać większość zachowań domu jako kontrakt:

```text
KIEDY wydarzy się X
JEŻELI spełnione są warunki Y
WYKONAJ akcje Z
```

AI nie zmienia tego modelu. AI pomaga go lepiej zaprojektować.

To ważne, bo wiele osób zaczyna od prośby: „napisz mi automatyzację do światła w korytarzu”. Model najczęściej coś wygeneruje. Problem w tym, że bez kontekstu nie wie, czy w domu są dzieci, tryb nocny, tryb gościa, czujnik natężenia światła, adaptacyjne oświetlenie, różne sceny, opóźnienia, obecność domowników, harmonogram snu albo pies, który aktywuje czujnik ruchu o 3:00 nad ranem.

Lepsza praca z AI zaczyna się nie od generowania YAML, ale od projektowania zachowania.

## Rola AI w tworzeniu automatyzacji

Najbardziej praktyczne role AI są cztery.

Pierwsza rola to analityk wymagań. Opisujesz, co chcesz osiągnąć, a model pomaga rozbić to na scenariusze. Na przykład: „światło w korytarzu ma włączać się po ruchu, ale nie w dzień, nie gdy dom jest w trybie nocnym i nie pełną jasnością po 22:00”. AI może zapytać o brakujące szczegóły: jak długo światło ma świecić, co zrobić przy ciągłym ruchu, czy ma ignorować ruch, gdy ktoś śpi, czy różnicować jasność w nocy.

Druga rola to projektant logiki. Model może zaproponować tabelę triggerów, warunków i akcji. Taka tabela jest czytelniejsza niż kod i świetnie nadaje się do przeglądu przed implementacją.

Trzecia rola to generator szkicu. AI może przygotować YAML, ale nie powinno go wdrażać bez recenzji. Szkic jest punktem startowym, nie prawdą objawioną.

Czwarta rola to reviewer. To często najcenniejszy scenariusz. Dajesz modelowi istniejącą automatyzację i prosisz: znajdź ryzyka, przypadki brzegowe, konfliktujące warunki, nieczytelne nazwy, brak trybu, zbyt agresywne akcje, możliwe pętle i problemy przy restarcie Home Assistanta.

W praktyce AI jest najlepsze wtedy, gdy traktujemy je jak bardzo szybkiego partnera do pair designu. Nie oddajemy mu odpowiedzialności, ale korzystamy z jego zdolności do porządkowania myśli.

## Zanim poprosisz AI o YAML

Najważniejsza część pracy dzieje się przed pierwszym promptem. Warto przygotować krótki opis domu, encji i zasad.

Minimalny kontekst dla modelu powinien zawierać:

```text
Platforma: Home Assistant.
Pomieszczenie: korytarz parter.
Encje:
- binary_sensor.hall_motion
- light.hall_ceiling
- sensor.hall_illuminance
- input_boolean.guest_mode
- input_boolean.night_mode
- person.grzegorz

Cel:
Światło ma zapalać się automatycznie po wykryciu ruchu, ale tylko wtedy,
gdy jest ciemno. W nocy ma używać niskiej jasności. W trybie gościa
światło ma działać normalnie, ale bez agresywnego wyłączania.

Ograniczenia:
Nie steruj zamkami, bramą ani alarmem.
Nie używaj nieistniejących encji.
Zaproponuj najpierw logikę w tabeli, dopiero potem YAML.
```

Ten format ma dwie zalety. Po pierwsze, zmusza nas do nazwania intencji. Po drugie, ogranicza modelowi pole do zgadywania. Jeżeli nie podamy listy encji, AI może wymyślić takie, które wyglądają sensownie, ale nie istnieją. To częsty błąd przy generowaniu konfiguracji.

Dobra zasada brzmi: AI może projektować w granicach podanego kontekstu. Jeżeli model potrzebuje więcej informacji, powinien zadać pytania, a nie fantazjować.

## Prompt 1: analiza wymagań

Pierwszy prompt nie powinien prosić o kod. Powinien prosić o analizę.

```text
Jesteś architektem automatyzacji Home Assistant.
Na podstawie poniższego opisu zaproponuj logikę automatyzacji.
Nie generuj jeszcze YAML.

Wynik podaj w formie:
1. cel automatyzacji,
2. triggery,
3. warunki,
4. akcje,
5. przypadki brzegowe,
6. pytania, które trzeba wyjaśnić przed implementacją.

Opis:
[tu wklej opis scenariusza i listę encji]
```

Taki prompt daje lepszy rezultat niż bezpośrednie „napisz automatyzację”. Model zaczyna od struktury, a my możemy ją ocenić. Często już na tym etapie wychodzą braki: nie mamy czujnika jasności, tryb nocny nie jest nigdzie zdefiniowany, nie wiadomo, jak długo światło ma świecić, albo nie ma encji informującej, czy ktoś jest w domu.

Dopiero po akceptacji logiki warto przejść do kodu.

## Prompt 2: generowanie YAML

Gdy logika jest jasna, można poprosić o szkic automatyzacji.

```text
Na podstawie zaakceptowanej logiki wygeneruj automatyzację Home Assistant YAML.
Wymagania:
- użyj tylko podanych encji,
- dodaj description,
- użyj czytelnych aliasów,
- dodaj trigger id, jeśli jest więcej niż jeden trigger,
- użyj choose, jeśli są różne ścieżki zachowania,
- ustaw mode i wyjaśnij wybór,
- nie dodawaj integracji ani encji, których nie podałem,
- po YAML dodaj krótkie wyjaśnienie działania.
```

Warto wymagać `description`, bo automatyzacje żyją długo. Po miesiącach najtrudniejsze nie jest zrozumienie, co robi YAML, ale dlaczego ktoś podjął taką decyzję. Opis jest tanią dokumentacją.

## Przykład: światło w korytarzu

Załóżmy, że chcemy prostą, ale sensowną automatyzację światła.

Wymaganie biznesowe:

```text
Gdy ktoś wejdzie do korytarza i jest ciemno, włącz światło.
Po 22:00 włączaj je tylko na 20%, żeby nie raziło.
Gdy ruch ustanie, zgaś światło po 2 minutach.
W trybie gościa nie gaś światła automatycznie, bo goście często siedzą dłużej przy wejściu.
```

AI powinno zaproponować logikę podobną do tej:

| Element | Decyzja |
| --- | --- |
| Trigger 1 | Ruch w korytarzu przechodzi na `on` |
| Trigger 2 | Ruch w korytarzu pozostaje `off` przez 2 minuty |
| Warunek dla włączenia | Jasność poniżej progu, np. 60 lx |
| Akcja dzienna | Włącz światło na 80% |
| Akcja nocna | Włącz światło na 20% |
| Akcja wyłączenia | Wyłącz światło, jeśli nie ma trybu gościa |
| Tryb automatyzacji | `restart` albo `queued`, zależnie od tego, jak obsługujemy powtarzający się ruch |

Przykładowy szkic YAML może wyglądać tak:

```yaml
alias: Hall - motion light with night brightness
description: >
  Turns on the hall light when motion is detected and it is dark.
  Uses lower brightness at night. Does not auto-turn-off in guest mode.
trigger:
  - id: motion_on
    platform: state
    entity_id: binary_sensor.hall_motion
    to: "on"
  - id: motion_off
    platform: state
    entity_id: binary_sensor.hall_motion
    to: "off"
    for:
      minutes: 2

action:
  - choose:
      - conditions:
          - condition: trigger
            id: motion_on
          - condition: numeric_state
            entity_id: sensor.hall_illuminance
            below: 60
          - condition: time
            after: "22:00:00"
            before: "06:00:00"
        sequence:
          - service: light.turn_on
            target:
              entity_id: light.hall_ceiling
            data:
              brightness_pct: 20

      - conditions:
          - condition: trigger
            id: motion_on
          - condition: numeric_state
            entity_id: sensor.hall_illuminance
            below: 60
        sequence:
          - service: light.turn_on
            target:
              entity_id: light.hall_ceiling
            data:
              brightness_pct: 80

      - conditions:
          - condition: trigger
            id: motion_off
          - condition: state
            entity_id: input_boolean.guest_mode
            state: "off"
        sequence:
          - service: light.turn_off
            target:
              entity_id: light.hall_ceiling

mode: restart
```

Czy to jest idealna automatyzacja? Niekoniecznie. Właśnie o to chodzi. AI dało szkic, który trzeba przejrzeć. Możemy zapytać: co stanie się, jeśli po 23:00 światło jest już włączone na 80%? Czy automatyzacja obniży jasność? Czy ma to robić? Co jeśli `sensor.hall_illuminance` jest niedostępny? Czy tryb gościa powinien blokować tylko gaszenie, czy też zmieniać jasność? Czy godziny nocne przechodzące przez północ są poprawnie obsłużone? AI może pomóc znaleźć te pytania, ale decyzje należą do nas.

## Prompt 3: recenzja automatyzacji

Najbardziej testerski prompt w całym procesie brzmi:

```text
Przeprowadź code review tej automatyzacji Home Assistant.
Szukaj:
- błędów logicznych,
- przypadków brzegowych,
- nieistniejących albo podejrzanych encji,
- problemów po restarcie Home Assistanta,
- możliwych pętli,
- ryzyk bezpieczeństwa,
- problemów z trybem automatyzacji,
- miejsc, które warto opisać w description.

Nie zmieniaj kodu od razu.
Najpierw wypisz obserwacje w tabeli: problem, wpływ, rekomendacja.
```

To świetnie działa, bo model nie tylko generuje, ale też zaczyna myśleć jak reviewer. W automatyzacjach smart home review jest bardzo ważne, ponieważ błędy mają skutki fizyczne. Źle napisana reguła może zapalać światło w nocy, rozładować baterię, włączać ogrzewanie przy otwartym oknie albo wysyłać dziesiątki powiadomień.

## AI i blueprinty

Home Assistant ma też blueprinty, czyli gotowe szablony automatyzacji, które można importować i konfigurować własnymi encjami. Dokumentacja opisuje je jako jeden z najprostszych sposobów dodawania automatyzacji, bo ktoś wcześniej przygotował logikę, a my podłączamy własne urządzenia.

AI jest bardzo pomocne przy blueprintach w dwóch scenariuszach.

Pierwszy: wybór blueprintu. Możemy wkleić opis kilku blueprintów i poprosić model, aby porównał je pod kątem naszego celu. Drugi: tworzenie własnego blueprintu na podstawie automatyzacji, która działa już dobrze. To szczególnie przydatne, gdy mamy podobną logikę w kilku pomieszczeniach: światło po ruchu, powiadomienie z czujnika, reakcja na przycisk, kontrola wentylacji po wilgotności.

Dobra ścieżka wygląda tak:

1. zbuduj jedną automatyzację ręcznie lub z pomocą AI;
2. testuj ją kilka dni;
3. popraw błędy;
4. dopiero potem poproś AI o przerobienie jej na blueprint;
5. sprawdź, czy wejścia blueprintu są czytelne dla człowieka;
6. dodaj opis i ograniczenia.

Nie twórz blueprintu z automatyzacji, której jeszcze nie rozumiesz. Blueprint powiela zarówno dobre decyzje, jak i błędy.

## Szablony Jinja: miejsce, gdzie AI bardzo pomaga

Home Assistant używa Jinja2 do templatingu. Oficjalna dokumentacja słusznie opisuje szablony jako bardziej techniczny obszar, zbliżony do lekkiego programowania. Szablony są przydatne, gdy trzeba policzyć wartość, zbudować dynamiczny tekst, sprawdzić stan kilku encji albo przetworzyć dane z API.

AI świetnie pomaga w Jinja, bo wiele błędów wynika z drobiazgów: typów danych, stanów `unknown`, porównań tekstu z liczbą, zaokrągleń, pustych wartości. Możemy poprosić model nie tylko o napisanie template, ale też o zabezpieczenie go przed niedostępnymi encjami.

Przykładowy prompt:

```text
Napisz template Jinja dla Home Assistant.
Cel: zwróć true, jeśli więcej niż 3 okna są otwarte.
Encje:
- binary_sensor.window_living_room
- binary_sensor.window_kitchen
- binary_sensor.window_bedroom
- binary_sensor.window_office
Wymagania:
- obsłuż unknown/unavailable,
- dodaj krótkie wyjaśnienie,
- pokaż jak przetestować w Developer Tools > Template.
```

AI może wygenerować czytelniejszy template, ale nadal warto testować go w edytorze szablonów. To bardzo szybki sposób sprawdzenia, czy wynik jest taki, jak oczekujemy.

## Automatyzacje wysokiego ryzyka

Nie wszystkie automatyzacje są równe. Światło w korytarzu może się pomylić i najwyżej zirytować domowników. Ale zamek, brama, alarm, ogrzewanie, ładowanie auta, pompa, zawór wody albo urządzenia dużej mocy wymagają innego poziomu ostrożności.

W automatyzacjach wysokiego ryzyka AI powinno być najwyżej doradcą. Dobry wzorzec to:

```text
AI może:
- przygotować projekt,
- wypisać ryzyka,
- zaproponować warunki,
- przygotować dokumentację,
- wygenerować test cases.

AI nie powinno:
- samodzielnie wdrażać zmian,
- decydować o otwarciu zamka,
- wyłączać alarmu,
- omijać potwierdzenia użytkownika,
- ignorować stanów awaryjnych.
```

Jeżeli AI analizuje obraz i wykrywa „znaną osobę przy furtce”, to nadal nie oznacza, że ma otworzyć drzwi. Może wysłać powiadomienie z przyciskiem do ręcznego potwierdzenia. Może podpowiedzieć, że ktoś czeka. Może włączyć światło zewnętrzne. Ale decyzja o dostępie powinna być zabezpieczona silniej niż opis z modelu.

## Dokumentacja automatyzacji

Jedną z niedocenianych ról AI jest dokumentowanie. Smart home po roku zaczyna przypominać mały system produkcyjny. Są zależności, wyjątki, tryby, obejścia i historyczne decyzje. Jeśli nie dokumentujemy automatyzacji, po czasie boimy się je zmieniać.

Można poprosić AI:

```text
Na podstawie tej automatyzacji przygotuj dokumentację:
- cel,
- używane encje,
- opis działania krok po kroku,
- tryby i wyjątki,
- znane ograniczenia,
- pomysły na testy regresji,
- propozycję krótkiego description do YAML.
```

To szczególnie przydatne przed refaktoryzacją. Najpierw dokumentujemy istniejące zachowanie, potem zmieniamy. To podejście znane z jakości oprogramowania działa świetnie również w Home Assistant.

## Testowanie automatyzacji jak testowanie software’u

Automatyzacje smart home warto testować jak małe funkcje systemu. Każda ma wejścia, warunki i oczekiwane wyjścia.

Dla przykładu światła w korytarzu test cases mogą wyglądać tak:

| Przypadek | Wejście | Oczekiwany wynik |
| --- | --- | --- |
| Dzień, jasno | ruch = on, lux = 200 | światło nie włącza się |
| Wieczór, ciemno | ruch = on, lux = 20, godzina 19:00 | światło 80% |
| Noc | ruch = on, lux = 10, godzina 23:30 | światło 20% |
| Brak ruchu | motion off przez 2 min | światło gaśnie |
| Tryb gościa | motion off przez 2 min, guest mode on | światło nie gaśnie |
| Sensor lux unavailable | lux = unavailable | system zachowuje się przewidywalnie |

AI może wygenerować takie przypadki testowe. To bardzo dobre ćwiczenie, bo często ujawnia luki szybciej niż czytanie YAML. Warto też używać trace w Home Assistant, aby zobaczyć, którą ścieżkę automatyzacja wybrała i dlaczego.

## Minimalny proces pracy

Mój rekomendowany proces wygląda tak:

1. Opisz scenariusz naturalnym językiem.
2. Wypisz encje, tryby i ograniczenia.
3. Poproś AI o analizę, bez YAML.
4. Zatwierdź logikę.
5. Poproś AI o szkic YAML.
6. Wklej YAML do środowiska testowego lub edytora, nie od razu do krytycznego systemu.
7. Poproś AI o review.
8. Przetestuj przypadki brzegowe.
9. Dodaj description i komentarze.
10. Monitoruj działanie przez kilka dni.
11. Dopiero potem uogólniaj jako blueprint.

To może brzmieć wolniej niż „wygeneruj i wklej”, ale w praktyce oszczędza czas. Mniej debugowania, mniej losowych zachowań, mniej automatyzacji, których nikt nie rozumie.

## Podsumowanie

AI nie sprawia, że automatyzacje przestają wymagać myślenia. Sprawia, że możemy myśleć szybciej, szerzej i bardziej strukturalnie. Największa wartość nie leży w samym generowaniu YAML, ale w analizie wymagań, szukaniu przypadków brzegowych, recenzji logiki i dokumentowaniu decyzji.

Dobrze używane AI pomaga zbudować smart home, który nie jest zbiorem przypadkowych reguł, tylko spójnym systemem zachowań. Nadal obowiązuje klasyczny model: trigger, condition, action. Zmienia się sposób projektowania. Zamiast zaczynać od kodu, zaczynamy od intencji i scenariuszy.

W trzeciej części mini-serii przejdziemy do dashboardów. Bo nawet najlepsze automatyzacje potrzebują dobrego interfejsu: takiego, który pokazuje nie wszystko, ale to, co w danym momencie naprawdę ma znaczenie.

## Źródła i dalsza lektura

- [Home Assistant - Automation triggers](https://www.home-assistant.io/docs/automation/trigger/)
- [Home Assistant - Using automation blueprints](https://www.home-assistant.io/docs/automation/using_blueprints/)
- [Home Assistant - Introduction to templating](https://www.home-assistant.io/docs/templating/introduction/)
- [Home Assistant - OpenAI integration](https://www.home-assistant.io/integrations/openai_conversation/)
- [Home Assistant - Ollama integration](https://www.home-assistant.io/integrations/ollama/)
- [Home Assistant Developer Docs - API for Large Language Models](https://developers.home-assistant.io/docs/core/llm/)
