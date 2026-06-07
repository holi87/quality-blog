---
title: "AI w Smart Home, część 1: Dom, który widzi - LLM Vision w praktyce"
description: "Pierwsza część mini-serii o łączeniu AI ze smart home. Pokazuję, jak przejść od zwykłego wykrywania ruchu do interpretowania obrazu: kto jest przy furtce, co wydarzyło się na podjeździe i kiedy warto wysłać powiadomienie."
date: 2026-06-08
tags: ["ai", "smart home", "home assistant", "llm vision", "computer vision"]
lang: pl
readingTime: 13
author: [JS, GH]
---

Przez lata smart home działał trochę jak bardzo sumienny, ale dość prosty automat. Czujnik ruchu wykrył ruch, więc włączaliśmy światło. Kontaktron zgłosił otwarte okno, więc wysyłaliśmy powiadomienie. Czujnik temperatury przekroczył próg, więc uruchamialiśmy ogrzewanie, klimatyzację albo wentylację. Taki dom reagował na sygnały, ale nie rozumiał sytuacji.

AI zmienia ten model. Nie dlatego, że nagle każdą żarówką powinien sterować chatbot. To byłoby efektowne, ale mało praktyczne. Największa wartość pojawia się tam, gdzie klasyczny smart home gubi kontekst. Ruch przy furtce może oznaczać kuriera, sąsiada, kota, cień drzewa, przejeżdżający samochód albo dziecko wracające ze szkoły. Dla klasycznej automatyzacji to często ten sam sygnał: „motion detected”. Dla modelu wizyjnego to mogą być zupełnie różne zdarzenia.

Pierwsza część tej mini-serii dotyczy właśnie tego kroku: jak połączyć AI i smart home przez obraz. Nie będziemy budować domu, który „magicznie wszystko wie”. Zbudujemy sensowną warstwę interpretacji, która potrafi obejrzeć obraz z kamery, opisać sytuację, sklasyfikować zdarzenie i pomóc Home Assistantowi podjąć lepszą decyzję.

W kolejnych częściach przejdziemy do tworzenia automatyzacji z pomocą AI oraz do projektowania dashboardów. Tutaj zaczynamy od fundamentu: dom może widzieć, ale musi widzieć odpowiedzialnie.

## Od czujnika do interpretacji

Najprostsza automatyzacja w smart home jest oparta o zdarzenie: coś się zmieniło, więc wykonaj akcję. To działa bardzo dobrze dla rzeczy jednoznacznych. Jeśli czujnik zalania wykrywa wodę, nie potrzebujemy AI do filozofowania. Powiadomienie ma być natychmiastowe. Jeśli temperatura w pokoju spada poniżej określonego progu, też możemy użyć prostej reguły.

Problem zaczyna się przy zdarzeniach wieloznacznych. Kamera wykrywa ruch, ale sam ruch nie mówi nam, czy sytuacja wymaga uwagi. Detektor osoby może wykryć sylwetkę, ale nie zawsze powie, czy ta osoba niesie paczkę, stoi przy furtce, odchodzi od drzwi, zagląda przez okno czy po prostu przechodzi chodnikiem. W praktyce to właśnie te niuanse decydują, czy powiadomienie jest przydatne, czy staje się kolejnym spamem na telefonie.

LLM Vision, czyli użycie multimodalnych modeli językowych do analizy obrazu lub wideo, pozwala zadać bardziej ludzkie pytania:

- Czy na obrazie widać człowieka, zwierzę, pojazd albo paczkę?
- Czy osoba wygląda, jakby próbowała wejść na posesję, czy tylko przechodzi obok?
- Czy pod drzwiami leży przesyłka?
- Czy brama jest otwarta?
- Czy światło w garażu zostało zapalone, mimo że nikogo nie ma w domu?
- Czy kot siedzi przy misce, czy po prostu przeszedł przez kadr?

Ważne jest jednak to, że AI nie zastępuje czujników. Najlepszy efekt daje połączenie obu światów. Czujniki i klasyczne detektory są szybkie, tanie i przewidywalne. AI jest wolniejsze i droższe, ale lepiej radzi sobie z kontekstem. Dlatego dobry wzorzec wygląda tak: klasyczny sensor uruchamia zdarzenie, a AI pomaga zdecydować, co to zdarzenie oznacza.

## Gdzie w tym wszystkim jest Home Assistant?

Home Assistant jest naturalnym centrum takiego rozwiązania, bo łączy urządzenia, encje, automatyzacje, powiadomienia, dashboardy i asystenta głosowego. Oficjalna integracja OpenAI w Home Assistant dodaje agenta konwersacyjnego, który może korzystać z Assist API i działać na encjach, które świadomie wystawimy do asystenta. Oficjalna integracja Ollama pozwala analogicznie podłączyć lokalny serwer modeli, choć kontrolowanie Home Assistanta przez lokalny model jest oznaczone jako funkcja eksperymentalna. Home Assistant ma też warstwę AI Task, która pozwala używać zadań AI do generowania tekstu, podsumowań lub danych.

Do analizy obrazu popularnym praktycznym wyborem jest integracja LLM Vision instalowana przez HACS. Według dokumentacji projektu integracja potrafi analizować obrazy, filmy, strumienie z kamer oraz zdarzenia Frigate przy użyciu multimodalnych modeli językowych. Wspiera wielu dostawców, w tym OpenAI, Google Gemini, Anthropic, OpenRouter, Ollama i inne endpointy zgodne z API OpenAI. Potrafi też zapisywać zdarzenia na osi czasu i aktualizować sensory na podstawie danych wyciągniętych z obrazu.

W praktyce architektura wygląda tak:

```text
kamera / Frigate / czujnik ruchu
        ↓
zdarzenie w Home Assistant
        ↓
snapshot, krótki klip albo analiza streamu
        ↓
LLM Vision / model multimodalny
        ↓
odpowiedź: tekst albo JSON
        ↓
automatyzacja: powiadomienie, zapis zdarzenia, dashboard, akcja pomocnicza
```

To bardzo ważne, aby AI było tylko jednym z elementów łańcucha. Nie powinno bezpośrednio podejmować krytycznych decyzji, takich jak otwarcie zamka, wyłączenie alarmu czy sterowanie bramą. Model może pomóc opisać sytuację, ale akcje wysokiego ryzyka powinny wymagać dodatkowych warunków, potwierdzenia albo klasycznej, deterministycznej logiki.

## Cloud czy lokalnie?

Pierwsza decyzja architektoniczna brzmi: czy wysyłamy obraz do modelu w chmurze, czy analizujemy go lokalnie. Nie ma jednej dobrej odpowiedzi. Jest za to kilka kryteriów, które warto przemyśleć przed wdrożeniem.

Model w chmurze zwykle daje lepszą jakość odpowiedzi, łatwiejszy start i mniej problemów z wydajnością lokalnego sprzętu. To dobre rozwiązanie na początek, zwłaszcza gdy chcemy szybko sprawdzić, czy scenariusz ma sens. Minusy są oczywiste: koszt zapytań, zależność od internetu oraz prywatność. Obraz z kamery przy drzwiach, w garażu czy w ogrodzie może zawierać twarze, tablice rejestracyjne, dzieci, gości albo sąsiadów. Nawet jeżeli dostawca modelu oferuje rozsądne zabezpieczenia, trzeba świadomie zdecydować, czy taki materiał może opuścić lokalną sieć.

Model lokalny, na przykład przez Ollama, daje większą kontrolę nad danymi i lepiej pasuje do filozofii local-first. Wymaga jednak mocniejszego sprzętu, cierpliwości przy konfiguracji i pogodzenia się z tym, że mniejsze modele mogą popełniać więcej błędów. Oficjalna dokumentacja Ollama dla Home Assistant sugeruje ograniczanie liczby encji wystawionych do sterowania, bo małe modele łatwiej gubią kontekst. Ta sama zasada dotyczy obrazu: im bardziej precyzyjny prompt i im węższy przypadek użycia, tym większa szansa na stabilne wyniki.

W mojej ocenie najlepszy początek to podejście hybrydowe. Najpierw wybieramy jeden, mało ryzykowny scenariusz, na przykład powiadomienia z furtki albo detekcję paczek. Testujemy go na modelu chmurowym, aby szybko ocenić jakość. Dopiero potem decydujemy, czy warto przenosić część analizy lokalnie.

## Najlepszy pierwszy przypadek użycia: mądre powiadomienia z kamery

Najgorszy sposób użycia AI w smart home to analiza wszystkiego, cały czas. Najlepszy sposób to analiza małych, dobrze zdefiniowanych sytuacji. Dlatego dobrym pierwszym projektem jest „mądre powiadomienie z kamery”.

Załóżmy, że mamy kamerę przy furtce lub drzwiach wejściowych. Klasyczna automatyzacja wysyła powiadomienie za każdym razem, kiedy wykryje ruch. Po kilku dniach zaczynamy ignorować telefon, bo powiadomień jest za dużo. AI może pomóc, ale tylko jeśli zadamy mu właściwe pytanie.

Zamiast prosić model: „opisz obraz”, lepiej poprosić:

```text
Przeanalizuj obraz z kamery przy furtce.
Odpowiedz krótko i konkretnie.
Ustal:
1. Czy widać człowieka?
2. Czy człowiek jest na posesji, przy furtce, czy poza posesją?
3. Czy widać paczkę, torbę albo przesyłkę?
4. Czy sytuacja wymaga powiadomienia właściciela?
5. Jaki krótki tytuł powiadomienia pasuje do sytuacji?

Nie zgaduj. Jeśli czegoś nie widać, napisz "brak pewności".
```

Jeszcze lepszym rozwiązaniem jest odpowiedź strukturalna, na przykład JSON:

```json
{
  "person_visible": true,
  "package_visible": false,
  "location": "at_gate",
  "risk_level": "low",
  "notify": true,
  "title": "Ktoś stoi przy furtce",
  "summary": "Na obrazie widać jedną osobę stojącą przy furtce. Nie widać paczki."
}
```

Taki format jest mniej elegancki dla człowieka, ale dużo lepszy dla automatyzacji. Home Assistant może sprawdzić `notify`, `risk_level` albo `package_visible` i dopiero wtedy wykonać akcję. To jest zasadnicza różnica między „AI jako gadżetem” a „AI jako komponentem systemu”.

## Jak zacząć krok po kroku

Pierwszy etap to uporządkowanie Home Assistanta. AI nie naprawi bałaganu w encjach. Jeśli kamera nazywa się `camera.192_168_1_43_stream_2`, czujnik ruchu `binary_sensor.motion_7` a wejście `input_boolean.test`, to nawet najlepszy prompt będzie mniej czytelny. Warto nazwać urządzenia po ludzku: `camera.front_gate`, `binary_sensor.front_gate_motion`, `input_boolean.guest_mode`, `person.grzegorz`.

Drugi etap to przygotowanie źródła zdarzeń. Może to być czujnik ruchu, detekcja osoby z kamery, zdarzenie Frigate albo zwykły harmonogram. Kluczowe jest to, aby AI nie analizowało obrazu bez potrzeby. Najpierw coś taniego wykrywa potencjalne zdarzenie, dopiero potem model dostaje snapshot lub krótki klip.

Trzeci etap to konfiguracja dostawcy AI. W LLM Vision dodajemy dostawcę, np. OpenAI, OpenRouter, Gemini albo lokalny Ollama. Wybór modelu warto traktować jak parametr techniczny. Ten sam prompt może działać inaczej na różnych modelach. Do powiadomień z kamer zwykle bardziej opłaca się model szybki i wystarczająco dobry niż model największy i najdroższy.

Czwarty etap to zaprojektowanie promptu. Prompt powinien być krótki, jednoznaczny i związany z konkretną kamerą. Nie prosimy modelu o „ładny opis sceny”, jeśli automatyzacja potrzebuje tylko decyzji: powiadamiać czy nie. Warto też zakazać zgadywania i wymusić wartości z ograniczonej listy, np. `none`, `person`, `vehicle`, `animal`, `package`.

Piąty etap to testy. I tutaj przydaje się podejście testerskie. Nie testujemy tylko happy path. Sprawdzamy noc, deszcz, cień, odbicie w szybie, zwierzęta, różne ubrania, paczki w różnych miejscach, gości, samochody, osoby poza posesją. AI potrafi być bardzo przekonujące nawet wtedy, kiedy się myli, dlatego testy muszą być praktyczne.

Szósty etap to ograniczenie skutków błędów. Na początku AI powinno tylko wysyłać powiadomienia albo zapisywać zdarzenia. Jeżeli model błędnie uzna reklamówkę za paczkę, najwyżej dostaniemy niepotrzebne powiadomienie. Nie projektujmy od razu automatyzacji, w której model sam otwiera furtkę, odblokowuje drzwi albo wyłącza alarm.

## Przykład automatyzacji koncepcyjnej

Poniższy przykład nie jest gotowym uniwersalnym YAML-em do wklejenia, bo nazwy usług i pól mogą zależeć od wersji integracji oraz wybranego dostawcy. Pokazuje jednak sposób myślenia.

```yaml
alias: AI - analiza zdarzenia przy furtce
description: >
  Gdy kamera lub czujnik wykryje ruch przy furtce, wykonaj analizę obrazu
  i wyślij powiadomienie tylko wtedy, gdy sytuacja jest istotna.
trigger:
  - platform: state
    entity_id: binary_sensor.front_gate_motion
    to: "on"

condition:
  - condition: state
    entity_id: input_boolean.ai_camera_notifications
    state: "on"

action:
  - service: llmvision.image_analyzer
    data:
      provider: "TWOJ_PROVIDER_LLM_VISION"
      image_entity: camera.front_gate
      response_format: json
      message: >
        Analyze the image from the front gate camera.
        Return JSON only.
        Decide whether the owner should be notified.
        Do not guess. If uncertain, set confidence below 60.
        Fields: notify, title, summary, object_type, confidence.

  - choose:
      - conditions:
          - condition: template
            value_template: "{{ ai_result.notify == true and ai_result.confidence >= 70 }}"
        sequence:
          - service: notify.mobile_app_phone
            data:
              title: "{{ ai_result.title }}"
              message: "{{ ai_result.summary }}"
mode: single
```

W prawdziwej implementacji trzeba dopasować sposób odbierania wyniku z usługi do konkretnej wersji integracji. Najważniejsza jest jednak zasada: AI produkuje strukturę, a automatyzacja podejmuje decyzję na podstawie jawnych pól.

## Prompt jest częścią systemu, nie dodatkiem

W klasycznym smart home konfigurujemy encje, triggery i warunki. W smart home z AI dodatkowym artefaktem staje się prompt. Warto traktować go jak kod: wersjonować, testować, skracać, upraszczać i opisywać.

Słaby prompt:

```text
Co tu się dzieje?
```

Lepszy prompt:

```text
Jesteś modułem analizy obrazu dla smart home.
Analizujesz kamerę przy furtce.
Odpowiedz tylko na potrzeby automatyzacji.
Nie opisuj tła, jeśli nie wpływa na decyzję.
Zwróć JSON zgodny ze schematem.
Jeżeli nie masz pewności, obniż confidence.
```

Dobry prompt ogranicza pole interpretacji. Model nie powinien pisać powieści, oceniać intencji człowieka ani tworzyć sensacyjnych opisów. Ma odpowiedzieć na pytania przydatne dla domu.

Warto też używać list zamkniętych. Zamiast pytać „co widzisz?”, pytamy „wybierz jedną kategorię: person, vehicle, animal, package, no_relevant_activity”. Zamiast „czy to podejrzane?”, pytamy o cechy: „czy osoba znajduje się na posesji?”, „czy trzyma narzędzie?”, „czy próbuje otworzyć drzwi?”, „czy kamera pokazuje tylko osobę przechodzącą chodnikiem?”. To zmniejsza liczbę fałszywych alarmów.

## Prywatność i bezpieczeństwo

AI vision w domu brzmi atrakcyjnie, ale dotyka bardzo wrażliwego obszaru: obrazu z prywatnej przestrzeni. Dlatego już na starcie warto przyjąć kilka zasad.

Po pierwsze, nie analizujemy wnętrza domu bez realnej potrzeby. Kamera w salonie, pokoju dziecka czy sypialni to zupełnie inny poziom ryzyka niż kamera przy bramie. Jeżeli scenariusz da się zrealizować czujnikiem ruchu, kontaktronem albo czujnikiem obecności, często lepiej nie używać obrazu.

Po drugie, minimalizujemy dane. Jeżeli wystarczy pojedynczy snapshot, nie wysyłamy filmu. Jeżeli wystarczy fragment kadru, nie wysyłamy pełnej sceny. Jeżeli wystarczy lokalny model, nie wysyłamy danych do chmury. Jeżeli potrzebujemy chmury, wybieramy tylko scenariusze, w których akceptujemy taki przepływ danych.

Po trzecie, oddzielamy interpretację od sterowania. Model może napisać: „prawdopodobnie kurier zostawił paczkę”. To nie znaczy, że system ma automatycznie odblokować bramkę. Dobre reguły bezpieczeństwa powinny być nudne, przewidywalne i odporne na pomyłki modelu.

Po czwarte, pamiętamy o domownikach i gościach. Smart home powinien pomagać, a nie tworzyć atmosferę ciągłej obserwacji. Warto mieć tryb gościa, tryb prywatny, czytelne zasady retencji zdjęć oraz prosty sposób wyłączenia analizy.

## Jak mierzyć, czy to działa?

AI w smart home łatwo ocenić po efekcie wow, ale lepiej użyć prostych metryk jakości. Skoro system ma pomagać, warto mierzyć, czy naprawdę pomaga.

Pierwsza metryka to liczba powiadomień. Jeżeli po wdrożeniu AI mamy mniej niepotrzebnych alertów, to dobry sygnał. Druga metryka to fałszywe negatywy: sytuacje, w których system powinien powiadomić, ale tego nie zrobił. Trzecia to opóźnienie. Powiadomienie o osobie przy furtce po dwóch minutach jest znacznie mniej przydatne niż po kilku sekundach. Czwarta to koszt. Analiza każdego ruchu dużym modelem może być niepotrzebnie droga.

W praktyce dobry wynik to nie „AI nigdy się nie myli”. Dobry wynik to system, który jest zauważalnie bardziej użyteczny niż zwykła detekcja ruchu, a jednocześnie jego błędy nie mają poważnych konsekwencji.

## Co można zbudować dalej?

Po pierwszym scenariuszu warto rozbudowywać system małymi krokami. Przykłady:

- powiadomienie tylko wtedy, gdy osoba stoi przy furtce dłużej niż 10 sekund;
- wykrywanie paczki i przypomnienie, jeśli nadal leży pod drzwiami po godzinie;
- rozróżnianie kota, psa, samochodu i człowieka w ogrodzie;
- dzienny raport ze zdarzeń z kamer z krótkim podsumowaniem;
- dashboard „co wydarzyło się dziś wokół domu”;
- automatyczne tagowanie zdarzeń: paczka, osoba, pojazd, zwierzę, brak istotnej aktywności.

Wszystkie te scenariusze prowadzą do kolejnej części serii. Gdy dom potrafi lepiej opisać świat, możemy zacząć projektować lepsze automatyzacje. Nie chodzi o to, aby AI robiło wszystko samo. Chodzi o to, aby pomagało nam przejść od prostych reguł do reguł opartych o kontekst.

## Podsumowanie

LLM Vision to jeden z najbardziej praktycznych sposobów połączenia AI i smart home, bo rozwiązuje realny problem: klasyczne czujniki widzą zdarzenia, ale nie zawsze rozumieją sytuację. Kamera z AI może pomóc odróżnić kuriera od kota, paczkę od cienia i istotne zdarzenie od tła.

Najważniejsze zasady są proste. Zaczynaj od małych, niskiego ryzyka scenariuszy. Nie analizuj wszystkiego. Nie oddawaj modelowi pełnej kontroli. Projektuj prompty jak element systemu. Wymuszaj odpowiedzi strukturalne. Testuj na prawdziwych przypadkach. Dbaj o prywatność.

Dobrze zaprojektowany AI smart home nie jest domem, który przypadkowo stał się chatbotem. To dom, który nadal działa przewidywalnie, ale zyskał nową warstwę interpretacji.

W drugiej części mini-serii przejdziemy do automatyzacji: jak użyć AI do projektowania, generowania, recenzowania i dokumentowania reguł w Home Assistant.

## Źródła i dalsza lektura

- [Home Assistant - OpenAI integration](https://www.home-assistant.io/integrations/openai_conversation/)
- [Home Assistant - Ollama integration](https://www.home-assistant.io/integrations/ollama/)
- [Home Assistant - AI Task integration](https://www.home-assistant.io/integrations/ai_task/)
- [Home Assistant Developer Docs - API for Large Language Models](https://developers.home-assistant.io/docs/core/llm/)
- [Home Assistant - Exposing entities to Assist](https://www.home-assistant.io/voice_control/voice_remote_expose_devices/)
- [LLM Vision for Home Assistant - GitHub repository](https://github.com/valentinfrlch/ha-llmvision)
