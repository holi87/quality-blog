---
title: "AI w Smart Home, część 4: Czy warto mieć smart home w wersji mini na budowie?"
description: "Smart home nie musi zaczynać się dopiero po przeprowadzce. Na budowie może działać w wersji mini: mierzyć temperaturę i wilgotność, wysyłać raporty, wykrywać przekroczenia progów, łączyć dane z kamerami i pomagać dokumentować ryzyka."
date: 2026-06-29
tags: ["ai", "smart home", "home assistant", "budowa domu", "monitoring", "kamery"]
lang: pl
readingTime: 13
author: [JS, GH]
---

Kiedy myślimy o smart home, najczęściej widzimy gotowy dom: światła, rolety, ogrzewanie, alarm, dashboard na tablecie, integrację z fotowoltaiką i automatyzacje, które dbają o komfort mieszkańców. Budowa wydaje się etapem wcześniejszym, brudniejszym i mniej „smart”. Jest prąd tymczasowy, kurz, narzędzia, ekipy, dostawy, wilgoć, otwarte otwory okienne, czasem prowizoryczny internet. Trudno wyobrazić sobie tam elegancki system automatyki.

A jednak właśnie na budowie mały, lekki smart home potrafi dać bardzo sensowną wartość. Nie chodzi o to, aby montować pełną instalację docelową, programować sceny świetlne w salonie bez podłogi albo budować centrum dowodzenia dla domu, który jeszcze nie działa. Chodzi o coś prostszego: o warstwę obserwacji, alertowania i dokumentowania.

Mini smart home na budowie może mierzyć temperaturę i wilgotność, wykrywać nagłe zmiany, wysyłać raporty, informować o przekroczeniu progów ostrzegawczych i krytycznych, monitorować dostępność kamer, zapisywać zdarzenia oraz pomagać właścicielowi szybciej zauważyć problemy. W połączeniu z AI i LLM może dodatkowo streszczać dane, wyjaśniać, co się zmieniło, sugerować kolejne kroki i pomagać konfigurować automatyzacje.

To nie jest zamiennik kierownika budowy, inspektora, zdrowego rozsądku ani regularnych wizyt na miejscu. To raczej tani, cyfrowy „czujny notes”, który pracuje wtedy, gdy nas nie ma.

## Smart home na budowie nie musi być pełnym smart home

Największy błąd to myślenie zero-jedynkowe: albo budujemy kompletny system, albo nie robimy nic. Na etapie budowy rozsądniejsza jest wersja mini. Taki system powinien być tymczasowy, odporny na bałagan i łatwy do przeniesienia. Ma działać jak monitoring środowiska i prosty system powiadomień.

W praktyce wystarczy kilka elementów:

- Home Assistant uruchomiony na Raspberry Pi, małym mini PC albo innym niewielkim serwerze.
- Dostęp do internetu przez LTE, 5G, światłowód tymczasowy albo router na kartę SIM.
- Kilka czujników temperatury i wilgotności.
- Jedna lub kilka kamer IP.
- Czujnik otwarcia drzwi, bramy lub pomieszczenia technicznego.
- Prosty pomiar zasilania lub informacja o zaniku prądu.
- Powiadomienia na telefon, e-mail, komunikator albo webhook.
- Opcjonalnie UPS, aby system przeżył krótkie zaniki napięcia.

Taki zestaw nie musi sterować niczym krytycznym. Na budowie lepiej zacząć od obserwacji niż od automatycznego podejmowania akcji. Niech system najpierw mówi: „temperatura spada”, „wilgotność rośnie”, „kamera nie odpowiada”, „ktoś był na działce”, „czujnik od 12 godzin nie wysłał danych”. To już jest duża wartość.

## Temperatura i wilgotność: najprostsze dane, które mówią bardzo dużo

Dwa najbardziej oczywiste parametry na budowie to temperatura i wilgotność. Brzmi banalnie, ale te dane potrafią powiedzieć sporo o kondycji budynku i ryzykach w danym momencie.

Wilgotność pomaga obserwować proces schnięcia tynków, wylewek, gładzi i innych mokrych prac. Nie zastępuje profesjonalnego pomiaru wilgotności materiału, ale pokazuje trend. Jeżeli wilgotność w pomieszczeniu przez wiele dni utrzymuje się bardzo wysoko, można zadać pytanie, czy budynek jest odpowiednio wietrzony, czy osuszacze działają, czy gdzieś nie ma źródła wilgoci. Jeżeli nagle rośnie w pomieszczeniu, które wcześniej było stabilne, warto sprawdzić, czy nie pojawił się przeciek, zalanie, otwarte okno podczas deszczu albo problem z wentylacją.

Temperatura jest równie ważna. Zimą pozwala pilnować, czy wewnątrz nie robi się niebezpiecznie zimno dla materiałów, instalacji, chemii budowlanej albo świeżo wykonanych prac. Latem pomaga ocenić warunki przechowywania materiałów i wpływ nasłonecznienia. W domu w stanie surowym lub deweloperskim temperatura bywa bardzo nierówna: inne warunki będą w salonie z dużymi przeszkleniami, inne w kotłowni, garażu, pomieszczeniu bez okien albo na poddaszu.

Największa wartość pojawia się jednak nie w pojedynczym odczycie, tylko w historii. Jednorazowa informacja „wilgotność wynosi 78%” jest mniej przydatna niż wykres pokazujący, że przez pięć dni spadała z 88% do 68%, po czym nagle wróciła do 82%. Smart home daje właśnie tę pamięć.

## Progi ostrzegawcze i krytyczne

Same wykresy są dobre wtedy, gdy ktoś je ogląda. Na budowie często nie ma na to czasu. Dlatego warto od razu zbudować progi ostrzegawcze i krytyczne.

Przykładowy podział może wyglądać tak:

```text
Temperatura:
- informacyjnie: poniżej 8°C
- ostrzegawczo: poniżej 5°C przez ponad 60 minut
- krytycznie: poniżej 2°C lub szybki spadek o kilka stopni w krótkim czasie

Wilgotność:
- informacyjnie: powyżej 70% przez kilka godzin
- ostrzegawczo: powyżej 80% przez ponad 6 godzin
- krytycznie: powyżej 90% albo nagły wzrost o 15 punktów procentowych
```

To nie są uniwersalne normy budowlane. To przykłady progów operacyjnych dla systemu monitoringu. W prawdziwym projekcie trzeba je dopasować do etapu budowy, użytych materiałów, sezonu, zaleceń wykonawców i realnych warunków. Inne progi będą przy schnięciu tynków, inne przy pracach zimowych, inne przy przechowywaniu farb, klejów, drewna albo elementów wykończeniowych.

Dobrą praktyką jest oddzielenie poziomu ostrzegawczego od krytycznego. Alert ostrzegawczy mówi: „sprawdź temat, może trzeba zareagować”. Alert krytyczny mówi: „to wymaga uwagi teraz”. Bez takiego podziału łatwo stworzyć system, który wysyła za dużo powiadomień. A system, który wysyła za dużo powiadomień, po kilku dniach przestaje być traktowany poważnie.

## Automatyzacje jako raporty, nie tylko alarmy

Na budowie bardzo przydatne są raporty okresowe. Alerty są dobre, gdy dzieje się coś nietypowego, ale raport daje spokój wtedy, gdy wszystko jest w normie. Zamiast codziennie wchodzić do dashboardu, można dostać krótkie podsumowanie rano albo wieczorem.

Dobry raport budowlany z Home Assistanta może zawierać:

- minimalną, maksymalną i średnią temperaturę z ostatnich 24 godzin,
- minimalną, maksymalną i średnią wilgotność,
- listę pomieszczeń z przekroczonym progiem,
- trend: rośnie, spada, stabilnie,
- informację, czy wszystkie czujniki wysłały dane,
- poziom baterii czujników,
- status kamer,
- informację o zaniku prądu lub internetu,
- liczbę zdarzeń z kamer,
- ostatnie wykryte zdarzenie przy wejściu, bramie lub magazynku.

Najprostszy komunikat może wyglądać tak:

```text
Raport budowy - 07:00

Parter:
- temperatura: 9.8-12.4°C, trend stabilny
- wilgotność: 68-74%, lekko spada

Poddasze:
- temperatura: 7.2-10.1°C
- wilgotność: 81-86%, poziom ostrzegawczy przez 5 godzin

System:
- wszystkie czujniki online
- kamera wejście online
- brak zaniku zasilania
- 3 zdarzenia ruchu od 18:00
```

Taki raport nie musi być idealny literacko. Ma być czytelny. Tu bardzo dobrze sprawdza się LLM, bo może zamienić surowe dane w naturalne podsumowanie: „wilgotność na poddaszu nadal jest wysoka, ale spada wolniej niż na parterze; warto sprawdzić wietrzenie albo osuszacz”. Model może też dodać status ryzyka: normalny, obserwacja, ostrzeżenie, krytyczny.

## Kamery: mniej „podglądania”, więcej informacji o zdarzeniach

Kamery na budowie często kojarzą się z ochroną przed kradzieżą. To ważny przypadek użycia, ale nie jedyny. W połączeniu z Home Assistantem i AI kamera może być źródłem zdarzeń, a nie tylko obrazem do ręcznego oglądania.

Wersja podstawowa to wykrywanie ruchu: ktoś pojawił się przy bramie, samochód wjechał na działkę, ktoś podszedł do wejścia technicznego. Wersja bardziej zaawansowana to klasyfikacja: osoba, pojazd, zwierzę, dostawa, ekipa, nietypowy ruch po godzinach. Jeżeli używamy systemu typu Frigate, klasyczne wykrywanie obiektów może działać jako pierwszy filtr, a LLM Vision może dostać dopiero snapshot lub krótki klip do opisania kontekstu.

Przykładowe powiadomienie z AI mogłoby brzmieć:

```text
Zdarzenie przy bramie - 16:42
Na obrazie widać samochód dostawczy i dwie osoby przy rozładunku materiałów.
Nie widać oznak włamania ani uszkodzeń. Zdarzenie wygląda jak dostawa.
```

Albo:

```text
Zdarzenie krytyczne - 22:17
Kamera przy wejściu wykryła osobę na terenie budowy poza godzinami pracy.
Osoba znajduje się blisko składowanych materiałów. Warto sprawdzić podgląd.
```

Trzeba przy tym pamiętać o prywatności i przepisach. Kamera nie powinna bez potrzeby obejmować cudzej posesji, chodnika, okien sąsiadów czy miejsc, w których ludzie nie spodziewają się monitoringu. Jeżeli na budowie pracują ekipy, temat monitoringu warto uregulować formalnie i komunikacyjnie. AI nie zwalnia z odpowiedzialności za to, co nagrywamy i jak długo przechowujemy dane.

## Sensowne użycia mini smart home na budowie

Najlepsze scenariusze to te, które rozwiązują realny problem. Poniżej kilka zastosowań, które mają praktyczny sens.

### 1. Kontrola schnięcia i wentylacji

Po tynkach, wylewkach i innych mokrych pracach można obserwować, czy wilgotność powoli spada. Jeżeli spadek zatrzymuje się na wysokim poziomie, system może przypomnieć o wietrzeniu, osuszaczu albo kontroli pomieszczenia. Jeżeli wilgotność nagle rośnie po deszczu, warto sprawdzić okna, dach, taras, obróbki albo wejścia instalacyjne.

### 2. Ochrona przed mrozem

Zimą system może ostrzegać, gdy temperatura zbliża się do niebezpiecznego poziomu. Szczególnie ważne jest to przy wodzie w instalacjach, materiałach wrażliwych na mróz, świeżych pracach mokrych albo prowizorycznym ogrzewaniu. Alert może być prosty: „temperatura w kotłowni spadła poniżej 5°C przez 90 minut”.

### 3. Informacja o zaniku zasilania

Na budowie zanik prądu może oznaczać wyłączony osuszacz, brak ogrzewania, brak kamer, rozładowanie urządzeń albo problem z zabezpieczeniami. Czujnik zasilania, smart plug lub UPS z integracją może wysłać powiadomienie: „utrata zasilania o 03:12; system działa z UPS”. To jedna z najprostszych i najbardziej wartościowych automatyzacji.

### 4. Kontrola dostępu do pomieszczeń technicznych

Kontaktron na drzwiach do pomieszczenia z narzędziami, rozdzielnią, routerem albo materiałami może informować o otwarciu po godzinach. W połączeniu z kamerą można dostać nie tylko sygnał „otwarte”, ale też krótkie wyjaśnienie, czy widać ekipę, kuriera, właściciela czy nieznaną osobę.

### 5. Dokumentacja postępu

Kamera może co kilka godzin robić zdjęcie z tego samego miejsca. Home Assistant może zapisywać snapshoty, a LLM może raz dziennie wygenerować opis: „dziś pojawiły się palety z materiałem przy wjeździe; w salonie widoczne są prace przy instalacjach; nie widać zmian na poddaszu”. Nie chodzi o formalny dziennik budowy, ale o prywatną oś czasu, która później pomaga przypomnieć sobie, kiedy co się wydarzyło.

### 6. Kontrola warunków przechowywania materiałów

Drewno, płyty, farby, kleje, chemia budowlana i elementy wykończeniowe nie lubią skrajnych warunków. Mini smart home może ostrzegać, że w pomieszczeniu, w którym leżą materiały, jest zbyt wilgotno albo zbyt zimno. To nie musi być skomplikowany system magazynowy. Wystarczy czujnik i sensowny alert.

### 7. Wykrywanie awarii systemu monitoringu

Często zapominamy, że system monitoringu też może się zepsuć. Kamera może przestać odpowiadać, czujnik może zgubić sieć, bateria może paść, router LTE może stracić zasięg. Dlatego warto mieć automatyzację „watchdog”: jeśli urządzenie jest niedostępne przez określony czas, wyślij powiadomienie. Brak danych też jest daną.

## Minimalna architektura: prosto, tanio, przenośnie

Nie ma sensu robić na budowie instalacji, której później będziemy żałować. Dobry zestaw startowy powinien być mały i przenośny.

Przykładowa architektura:

```text
Internet:
router LTE/5G + karta SIM + zasilanie z UPS

Centrum:
Home Assistant na mini PC / Raspberry Pi / gotowym urządzeniu HA

Czujniki:
temperatura i wilgotność: salon, poddasze, kotłownia, garaż/magazynek
kontaktron: wejście techniczne lub pomieszczenie z narzędziami
zasilanie: smart plug / UPS / czujnik zaniku prądu

Kamery:
brama / wejście / magazyn materiałów

Powiadomienia:
telefon właściciela, e-mail, komunikator, kanał ekipy lub prywatny webhook
```

Na tym etapie nie chodzi o liczbę urządzeń. Lepiej mieć cztery dobrze ustawione czujniki niż piętnaście przypadkowych. Ważne są lokalizacje: pomieszczenie najbardziej narażone na wilgoć, miejsce z największym ryzykiem wychłodzenia, miejsce z materiałami i punkt wejścia.

Warto też od razu nazwać urządzenia tak, żeby rozumiały je zarówno ludzie, jak i LLM:

```text
sensor.parter_salon_wilgotnosc
sensor.poddasze_wilgotnosc
sensor.kotlownia_temperatura
binary_sensor.drzwi_techniczne
camera.brama
camera.wejscie_techniczne
```

Dobre nazewnictwo to niedoceniana część automatyki. Model językowy dużo lepiej poradzi sobie z raportem, jeśli encje mają sensowne nazwy, a nie `sensor.th_03_humidity`.

## Gdzie wchodzi LLM?

LLM może być w takim systemie użyty na kilka sposobów. Pierwszy to konfiguracja. Możemy opisać modelowi, jakie mamy czujniki, jakie progi chcemy ustawić i jakie komunikaty mają przychodzić. Model przygotuje szkic automatyzacji, template sensora, treść powiadomienia albo układ dashboardu. Nie oznacza to, że trzeba wszystko wkleić bez czytania. LLM jest świetnym asystentem, ale w Home Assistant zawsze trzeba sprawdzić encje, składnię i działanie na małym przykładzie.

Przykładowy prompt:

```text
Mam Home Assistanta na budowie domu.
Czujniki:
- sensor.parter_salon_temperature
- sensor.parter_salon_humidity
- sensor.poddasze_temperature
- sensor.poddasze_humidity
- binary_sensor.drzwi_techniczne_contact
- camera.brama

Chcę automatyzację:
1. raport codziennie o 7:00,
2. ostrzeżenie, gdy wilgotność w którymkolwiek pomieszczeniu przekracza 80% przez 6 godzin,
3. alert krytyczny, gdy temperatura spadnie poniżej 3°C przez 30 minut,
4. osobne powiadomienie, gdy drzwi techniczne są otwarte po 20:00.

Przygotuj YAML do Home Assistanta, opisz co robi każdy fragment i zaproponuj testy.
```

Drugi sposób to generowanie raportów. Home Assistant może zebrać dane liczbowe, a LLM może z nich zrobić zrozumiały komunikat. Zamiast surowej tabeli dostajemy krótkie podsumowanie: „wilgotność na poddaszu jest wysoka i nie spada od 18 godzin; parter zachowuje się stabilnie; jeden czujnik ma niski poziom baterii”.

Trzeci sposób to analiza zdarzeń z kamer. Model może obejrzeć snapshot i opisać, czy zdarzenie wygląda jak dostawa, wejście ekipy, zwierzę, przypadkowy ruch czy potencjalny problem. Warto jednak zachować zasadę: AI opisuje i klasyfikuje, człowiek decyduje.

Czwarty sposób to utrzymanie konfiguracji. LLM może pomóc znaleźć błąd w automatyzacji, zaproponować refaktor YAML, ułożyć dashboard, wygenerować listę testów po zmianach albo przygotować krótką dokumentację systemu dla domowników i wykonawców.

## Przykładowa automatyzacja ostrzegawcza

Poniższy przykład jest celowo prosty i poglądowy. W prawdziwej konfiguracji trzeba dopasować encje i kanał powiadomień.

```yaml
alias: Budowa - ostrzeżenie o wysokiej wilgotności
description: Powiadomienie, gdy wilgotność na poddaszu przekracza próg przez dłuższy czas.
trigger:
  - platform: numeric_state
    entity_id: sensor.poddasze_humidity
    above: 80
    for:
      hours: 6
condition: []
action:
  - service: notify.mobile_app_phone
    data:
      title: "Budowa: wysoka wilgotność"
      message: >
        Wilgotność na poddaszu przekracza 80% od co najmniej 6 godzin.
        Sprawdź wietrzenie, osuszacz lub możliwe źródło wilgoci.
mode: single
```

Taki przykład pokazuje sedno: nie musimy od razu budować skomplikowanego systemu AI. Najpierw tworzymy pewną, deterministyczną logikę. Dopiero później dodajemy LLM do opisu, klasyfikacji i wygodniejszego zarządzania.

## Dashboard dla budowy

Dashboard budowlany powinien być inny niż domowy. Nie potrzebuje pięknej kontroli każdego światła. Potrzebuje szybkiej odpowiedzi na pytanie: „czy wszystko jest w porządku?”.

Dobry dashboard może mieć cztery sekcje:

1. **Status ogólny** - zielony, ostrzegawczy, krytyczny.
2. **Warunki** - temperatura i wilgotność dla kluczowych pomieszczeń.
3. **Zdarzenia** - ostatnie alerty, kamera, otwarcia drzwi, zanik prądu.
4. **Zdrowie systemu** - baterie, dostępność czujników, status internetu, status kamer.

Przydatna jest też sekcja „co się zmieniło od wczoraj”. To może być zwykły template, ale LLM potrafi zrobić z tego naturalny komentarz. Taki dashboard nie ma imponować. Ma skrócić czas decyzji.

## Granice i ryzyka

Mini smart home na budowie ma sens, ale trzeba znać jego granice. Czujnik temperatury i wilgotności nie zastąpi pomiaru technicznego. Kamera nie zastąpi ochrony. LLM nie zastąpi specjalisty. Alert nie oznacza automatycznie awarii, a brak alertu nie oznacza, że wszystko jest idealnie.

Największe ryzyka to:

- fałszywe alarmy,
- brak internetu,
- rozładowane baterie,
- błędnie ustawione progi,
- czujniki w złych miejscach,
- kamera obejmująca zbyt szeroki obszar,
- zbyt duże zaufanie do interpretacji AI,
- brak reakcji człowieka po otrzymaniu alertu.

Dlatego warto zacząć od prostego systemu i przez pierwsze tygodnie traktować go testowo. Obserwować, które alerty są przydatne, które są spamem, gdzie czujnik stoi źle, jakie progi trzeba zmienić i co naprawdę pomaga w decyzjach.

## Czy warto?

Moim zdaniem tak, ale pod jednym warunkiem: trzeba potraktować to jako system obserwacji, a nie pełną automatykę domu. Mini smart home na budowie jest szczególnie sensowny, gdy nie mieszkamy blisko działki, mamy prace mokre, budujemy zimą, przechowujemy materiały na miejscu, mamy prowizoryczne ogrzewanie albo po prostu chcemy lepiej dokumentować przebieg budowy.

Największy zwrot daje mała liczba dobrze dobranych elementów: kilka czujników, podstawowe alerty, raport dzienny, jedna lub dwie kamery i integracja z Home Assistantem. AI i LLM nie są tutaj obowiązkowe, ale mocno zwiększają wygodę. Pomagają napisać automatyzacje, podsumować dane, opisać zdarzenia z kamer i utrzymać system w czytelnej formie.

Smart home na budowie nie musi być gadżetem. Może być praktycznym narzędziem do zmniejszania niepewności. A na budowie mniej niepewności to często mniej stresu, mniej telefonów i szybsza reakcja, gdy naprawdę dzieje się coś ważnego.

## Źródła i dokumentacja

- [Home Assistant - OpenAI Conversation](https://www.home-assistant.io/integrations/openai_conversation)
- [Home Assistant - AI Task](https://www.home-assistant.io/integrations/ai_task/)
- [LLM Vision for Home Assistant](https://github.com/valentinfrlch/ha-llmvision)
- [Home Assistant - Automations](https://www.home-assistant.io/docs/automation/)
- [Home Assistant - Dashboards](https://www.home-assistant.io/dashboards/)
