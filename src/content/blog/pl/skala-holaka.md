---
title: "Skala Holaka v2.1e - enterprise. Model dojrzałości adopcji AI w organizacji"
description: "12 poziomów dojrzałości AI w firmie - od oporu, przez agentowe workflow, po własny agentic OS dla konkretnych celów biznesowych. Wersja v2.1e rozdzielająca ścieżkę firmową od prywatnej."
date: 2026-05-18
tags: ["ai", "adopcja", "enterprise", "strategia", "governance"]
lang: pl
readingTime: 14
author:
  - GH
  - KG
---

Skala Holaka rozwija się szybciej niż większość modeli dojrzałości, bo szybciej niż one zmienia się to, co AI naprawdę potrafi. **Wersja 2.1** rozdziela jedną skalę na dwie ścieżki: **v2.1e** dla użycia zawodowego i **v2.1p** dla użycia prywatnego. Ten artykuł to wersja enterprise. Wersja prywatna ma osobny wpis: [Skala Holaka v2.1p - private](/pl/blog/skala-holaka-private/).

## Dlaczego dwie skale

Skala v2 dobrze działała jako model ogólny, ale w praktyce mieszała dwa różne światy. W firmie najważniejsze są: wartość biznesowa, bezpieczeństwo, ład organizacyjny, proces, odpowiedzialność, koszty i audytowalność. W domu - wygoda, prywatność, zaufanie, codzienne nawyki, realna oszczędność czasu i nieprzekombinowanie. Próba mierzenia jedną linijką prowadziła do nieporozumień - ktoś z poziomu 9 w domu pytał, czy to znaczy, że jego firma „też dowozi 9". Nie znaczy.

W v2.1e mierzymy **dojrzałość organizacji, zespołu lub procesu** w zawodowym wykorzystaniu AI. Nie mierzymy „czy firma ma ChatGPT". Mierzymy, czy AI realnie zmienia sposób pracy, czy jest bezpieczne, mierzalne, audytowalne i powiązane z wynikiem biznesowym.

## Co nowego w v2.1e

Cztery zmiany względem v2:

1. **Skala rozdzielona** na enterprise (v2.1e) i private ([v2.1p](/pl/blog/skala-holaka-private/)).
2. **Stałe osie oceny od poziomu 4** - zarządzanie kontekstem, świadomość modelu, oszczędność tokenów, weryfikowalność, odwracalność, bezpieczeństwo i prywatność.
3. **Hooks na poziomie 8**, nie jako osobny poziom. To deterministyczna warstwa kontroli wokół agenta, nie autonomia.
4. **Poziom 11 zdefiniowany jako agentic OS** - nie „więcej agentów", tylko zaprojektowany system pracy dla konkretnego celu biznesowego.

## Mapa poziomów v2.1e

| Poziom | Nazwa | Jednym zdaniem |
|---|---|---|
| 0 | Opór / brak adopcji | Organizacja nie używa AI albo używa go wyłącznie nieformalnie. |
| 1 | Podstawowy czat | Pracownicy pytają AI ad hoc, bez standardów. |
| 2 | Świadome promptowanie | Ludzie rozumieją, że kontekst, cel i format wpływają na wynik. |
| 3 | Frameworki promptowania | Zespół używa powtarzalnych struktur promptów i szablonów. |
| 4 | Instrukcje niestandardowe i higiena tokenów | Stałe instrukcje, role i preferencje nie są przepisywane w każdym promptcie. |
| 5 | Kontekst projektowy | Wiedza o projekcie żyje w plikach, repozytoriach i dokumentacji dla ludzi oraz agentów. |
| 6 | Zaawansowane instrukcje operacyjne | Agent wie nie tylko *co* robić, ale *jak* działać, kiedy pytać i czego nie robić. |
| 7 | Skille, bazy wiedzy i ewaluacje | Organizacja buduje powtarzalne umiejętności AI, RAG, playbooki i zestawy testów. |
| 8 | Narzędzia, MCP, konektory i hooks | AI działa na systemach, ale w kontrolowanym środowisku z uprawnieniami i automatycznymi kontrolami. |
| 9 | Agentowe workflow | Człowiek definiuje cel, agent planuje i realizuje proces end-to-end z kontrolą. |
| 10 | Orkiestracja wieloagentowa | Wiele agentów współpracuje pod nadzorem koordynatora lub silnika przepływów. |
| 11 | Agentic OS dla celów biznesowych | Organizacja projektuje własny system operacyjny pracy agentów dla konkretnych rezultatów biznesowych. |

## Poziom 0 - Opór / brak adopcji

Organizacja nie używa AI albo oficjalnie zakazuje użycia, mimo że pracownicy mogą korzystać z narzędzi prywatnie lub po cichu.

- **Bariera:** strach, zgodność regulacyjna, brak wiedzy, brak właściciela tematu.
- **Sukces:** uczciwa decyzja - albo świadome „nie teraz", albo start kontrolowanego pilotażu.
- **Pułapka:** udawanie, że AI nie istnieje, podczas gdy ludzie i tak korzystają z narzędzi po cichu, poza nadzorem.

**Sygnał przejścia wyżej:** organizacja potrafi nazwać dopuszczalne i niedopuszczalne użycia AI.

## Poziom 1 - Podstawowy czat

Pracownicy używają AI jak wyszukiwarki albo generatora tekstów. Pytanie → odpowiedź. Brak wspólnych standardów.

- **Bariera:** brak wiedzy, jak pytać i jak weryfikować.
- **Sukces:** ludzie zaczynają używać AI do prostych zadań: streszczeń, maili, pomysłów, pierwszych wersji dokumentów.
- **Pułapka:** fałszywe poczucie adopcji - „używamy AI", ale bez wzrostu kompetencji.

**Sygnały w organizacji:** pojedyncze użycia, brak repo promptów, brak polityki, brak miar.

## Poziom 2 - Świadome promptowanie

Pracownicy rozumieją, że AI potrzebuje celu, kontekstu, roli, ograniczeń i oczekiwanego formatu.

- **Bariera:** przejście od „zadaję pytanie" do „projektuję instrukcję".
- **Sukces:** prompty zawierają cel, odbiorcę, dane wejściowe, ograniczenia i format wyniku.
- **Pułapka:** wiara, że dobry prompt rozwiązuje wszystko.

**Przykład.** Zamiast „Napisz test case'y" - lepiej: „Jesteś QA w projekcie bankowym. Na podstawie poniższych acceptance criteria przygotuj testy pozytywne, negatywne i brzegowe w formacie tabeli: ID, warunek, kroki, oczekiwany rezultat, ryzyko."

## Poziom 3 - Frameworki promptowania

Zespół ma wspólne szablony: CRISP, role-task-context-format, few-shot, kryteria jakości, checklisty review.

- **Bariera:** dyscyplina stosowania i utrzymania szablonów.
- **Sukces:** zespół ma wspólny język pracy z AI.
- **Pułapka:** biblioteka „złotych promptów" rośnie do 200-liniowych potworków.

**Sygnały w organizacji:** prompt library, przykłady dobrych/złych promptów, szkolenia, review promptów.

## Poziom 4 - Instrukcje niestandardowe i higiena tokenów

Organizacja zaczyna przenosić powtarzalne instrukcje z promptów do ustawień, instrukcji systemowych, instrukcji niestandardowych, konfiguracji asystentów i standardów projektowych.

To pierwszy poziom, na którym jawnie pojawia się **oszczędzanie tokenów i kosztów**. Nie chodzi o to, żeby pisać krócej za wszelką cenę. Chodzi o to, żeby nie płacić codziennie za ten sam kontekst.

- **Bariera:** inwestycja w setup, który zwraca się dopiero po czasie.
- **Sukces:** krótsze prompty, spójniejsze odpowiedzi, mniej kopiowania instrukcji.
- **Pułapka:** instrukcje niestandardowe stają się śmietnikiem wszystkiego.

**Nowość v2.1:** od tego poziomu oceniamy *świadomość modelu* - czy użytkownik wie, kiedy użyć modelu szybkiego, kiedy rozumującego, kiedy modelu kodowego, kiedy multimodalnego, a kiedy w ogóle nie używać AI.

## Poziom 5 - Kontekst projektowy

Kontekst żyje przy projekcie: w `README.md`, `AGENTS.md`, `CLAUDE.md`, dokumentacji architektury, ADR-ach, zasadach testowania, definicjach domeny, słownikach i przykładach.

- **Bariera:** potraktowanie dokumentacji dla AI jako elementu inżynierii, nie dodatku.
- **Sukces:** nowy człowiek lub agent szybciej rozumie projekt.
- **Pułapka:** dokumentacja jest nieaktualna, więc agent wykonuje stare zasady.

**Sygnały w organizacji:** pliki kontekstowe w repo, aktualizowane przy zmianach, używane w praktyce.

## Poziom 6 - Zaawansowane instrukcje operacyjne

Agent ma opisane zachowanie: kiedy pytać, kiedy działać samodzielnie, kiedy eskalować, czego nie robić, jak raportować, jak sprawdzać wynik.

- **Bariera:** spisanie norm, które wcześniej były „w głowie zespołu".
- **Sukces:** agent zachowuje się zgodnie z kulturą pracy zespołu.
- **Pułapka:** zbyt sztywne instrukcje, które blokują sensowne działanie.

**Przykład zasad:**

- „Nie dodawaj zależności bez zgody."
- „Przed zmianą konfiguracji CI zaproponuj plan."
- „Po zmianie testów uruchom tylko dotknięty zakres, a pełny regres zostaw do CI."
- „Nie dotykaj danych produkcyjnych."

## Poziom 7 - Skille, bazy wiedzy i ewaluacje

Organizacja ma powtarzalne skille AI: generowanie raportów, analiza logów, review kodu, tworzenie testów, analiza wymagań, streszczenia spotkań, triage ticketów, pisanie release notes.

Pojawiają się też bazy wiedzy i RAG, ale z kontrolą jakości: źródła, aktualność, właściciele, wersjonowanie.

- **Bariera:** architektura informacji.
- **Sukces:** agent korzysta z właściwej wiedzy i umiejętności bez ciągłego prowadzenia za rękę.
- **Pułapka:** mnożenie skilli bez właścicieli i bez mierzenia jakości.

**Nowość v2.1:** poziom 7 wymaga prostych **ewaluacji** - przykładów testowych, które sprawdzają, czy prompt, skill lub agent nadal działa po zmianie modelu, instrukcji albo danych.

## Poziom 8 - Narzędzia, MCP, konektory i hooks

Agent nie tylko pisze. Ma dostęp do narzędzi: repozytoriów, systemów ticketowych, dokumentacji, API, Slacka, poczty, kalendarzy, baz danych, środowisk testowych, CI/CD.

MCP pasuje właśnie tutaj - to standard łączenia aplikacji LLM z zewnętrznymi źródłami danych i narzędziami.

**Hooks** są w v2.1 częścią tego poziomu. Pozwalają wymusić automatyczne kontrole przed, w trakcie lub po działaniu agenta: uruchomienie testów, lintów, skanów bezpieczeństwa, walidacji promptów, wymuszenia review, blokowania niedozwolonych komend, zapisu audytu.

- **Bariera:** bezpieczeństwo, uprawnienia, audyt, ownership.
- **Sukces:** agent ma dostęp tylko do tego, czego potrzebuje, a jego działania są logowane i kontrolowane.
- **Pułapka:** „podłączmy wszystko do wszystkiego".

**Kontrole w organizacji:** rejestr agentów, osobna tożsamość agenta, zasada najmniejszych uprawnień, logi, limity kosztów, DLP, lista dozwolonych narzędzi, piaskownica, zatwierdzenie dla działań ryzykownych.

## Poziom 9 - Agentowe workflow

Człowiek definiuje cel, agent planuje kroki i realizuje zadanie. Człowiek nie prowadzi go po każdym kroku, ale sprawdza efekt, logi i decyzje.

- **Bariera:** zaufanie, weryfikowalność i odwracalność.
- **Sukces:** agent realizuje proces end-to-end w ograniczonym, znanym zakresie.
- **Pułapka:** iluzja autonomii - agent działa sam, ale człowiek później poprawia 60% wyniku.

**Przykłady w organizacji:**

- „Przygotuj release notes z ostatniego sprintu."
- „Zrób analizę błędów z produkcji i zaproponuj priorytety."
- „Przejrzyj pull request, uruchom testy, zgłoś ryzyka."
- „Przygotuj wersję roboczą odpowiedzi dla klienta na podstawie historii zgłoszenia."

Na tym poziomie potrzebne są **bariery ochronne** i **weryfikacja przez człowieka**. W praktyce produkcyjnej automatyczne walidacje i zatwierdzenia człowieka decydują, czy agent ma kontynuować, zatrzymać się czy poczekać na zgodę.

## Poziom 10 - Orkiestracja wieloagentowa

Organizacja ma wiele wyspecjalizowanych agentów: analityk, badacz, programista, tester, recenzent, kontroler zgodności, dokumentalista, menedżer wydań.

- **Bariera:** projektowanie systemu agentów, a nie pojedynczego promptu.
- **Sukces:** agenci współpracują w kontrolowanym procesie i dowożą wynik lepszy niż pojedynczy agent.
- **Pułapka:** przekombinowanie - wielu agentów tam, gdzie wystarczyłby jeden dobry proces.

Anthropic w swoich praktykach budowania agentów podkreśla, że skuteczne implementacje często wygrywają prostymi, komponowalnymi wzorcami, a nie nadmiernie skomplikowanymi frameworkami. To ważne ostrzeżenie dla poziomu 10: orkiestracja ma sens tylko wtedy, gdy złożoność zadania ją uzasadnia.

## Poziom 11 - Agentic OS dla celów biznesowych

To nowy poziom v2.1.

Organizacja potrafi zaprojektować własny **agentic OS** (system operacyjny pracy agentów) dla konkretnego obszaru biznesowego. Nie chodzi o „więcej agentów". Chodzi o spójny system, w którym:

- cele biznesowe są przetłumaczone na workflow,
- agenci mają role, właścicieli i zakres odpowiedzialności,
- narzędzia są podłączone przez kontrolowane interfejsy,
- dane mają źródła, właścicieli i poziomy zaufania,
- działania są logowane,
- koszty są mierzone,
- ryzykowne akcje wymagają zatwierdzenia,
- błędy da się cofnąć,
- ład organizacyjny jest częścią działania, a nie dokumentem po fakcie.

**Bariera:** przejście z „używamy AI" do „projektujemy nowy system pracy".
**Sukces:** AI staje się warstwą operacyjną procesu biznesowego.
**Pułapka:** budowa efektownej platformy bez jasnego celu biznesowego.

**Przykładowe agentic OS w organizacji:**

1. **Agentic OS dla QA** - analiza wymagań, generowanie testów, utrzymanie regresji, analiza testów niestabilnych, raport jakości.
2. **Agentic OS dla wydań** - lista zmian, ryzyka, analiza wpływu testów, komunikacja wydania, listy kontrolne, plan wycofania.
3. **Agentic OS dla zgodności regulacyjnej** - monitoring regulacji, mapowanie polityk, wersje robocze procedur, zbieranie dowodów.
4. **Agentic OS dla obsługi klienta** - wstępna selekcja zgłoszeń, odpowiedzi, eskalacje, analiza sentymentu, baza wiedzy, jakość obsługi.
5. **Agentic OS dla raportowania finansowego** - zbieranie danych, wyjaśnianie odchyleń, przygotowanie narracji, kontrola źródeł.
6. **Agentic OS dla zakupów** - analiza ofert, ryzyka dostawców, porównania, zgodność z polityką zakupową.

**Test poziomu 11:** czy możesz wskazać jeden konkretny proces biznesowy i powiedzieć: „tu AI nie jest dodatkiem, tylko warstwą operacyjną procesu - z celami, kontrolami, miernikami, audytem i właścicielem"?

## Granice, na które warto patrzeć

**Granica 8→9.** Narzędzia to jeszcze nie autonomia. Możesz mieć MCP, hooks i 20 integracji, a agent nadal czeka na każdy krok człowieka. Przejście na 9 oznacza, że agent planuje, działa i raportuje - a człowiek przegląda efekt, nie każdy ruch.

**Granica 10→11.** Orkiestracja to jeszcze nie agentic OS. Wieloagentowy proces można zbudować bez nadzoru, bez właścicieli, bez audytu i bez metryk kosztu. Agentic OS to system pracy z celem biznesowym, nie pokaz zespołu agentów.

## Antywzorce v2.1e

- **AI poza nadzorem.** Brak polityki, więc każdy używa, czego chce, na danych, których nie powinien.
- **Kult cargo promptów.** Kopiowanie cudzych „mega-promptów" bez zrozumienia kontekstu.
- **Integracje bez nadzoru.** Agent z dostępem do całej infrastruktury bez tożsamości, audytu i zatwierdzeń.
- **Agenci bez właścicieli.** Działają na produkcji, ale nikt nie wie, kto za nich odpowiada.
- **OS bez celu.** Platforma z panelem, kosztami i prezentacją, ale bez procesu biznesowego, który realnie obsługuje.

## Świadomość modeli

W v2.1 dojrzałość obejmuje też świadomość modeli. Ten sam prompt nie musi działać tak samo na różnych modelach. Inaczej instruuje się model szybki, inaczej reasoning model, inaczej model kodowy, inaczej model mały, a inaczej model z dużym kontekstem.

Osoba lub organizacja na wyższym poziomie nie pyta tylko „jakiego promptu użyć?", ale też: **który model, z jakim kosztem, z jakim poziomem rozumowania i z jaką walidacją jest właściwy dla tego zadania?**

## Co dalej

Wersja prywatna skali ma osobny artykuł: [Skala Holaka v2.1p - private](/pl/blog/skala-holaka-private/). Tam mierzy się dojrzałość codziennego użycia AI - dom, nauka, finanse, smart home, organizacja życia. Inne ryzyka, inne sukcesy, inne pułapki.

Wcześniejsze wersje: pierwotny [Model dojrzałości AI (v1)](/pl/blog/model-dojrzalosci-ai/) pozostaje dostępny jako kontekst historyczny. Treść v2.0 została w całości włączona do tej wersji v2.1e.

---

## Historia wersji

- **v1.0** - *Model dojrzałości adopcji AI*. Powstała w marcu 2026, opublikowana **15 kwietnia 2026**. Krótki model 11-poziomowy.
- **v2.0** - *Skala Holaka*. Powstała w kwietniu 2026, opublikowana **20 kwietnia 2026**. Rozbudowa o diagnozę, anti-patterny i wymiar organizacyjny.
- **v2.1e** (ten artykuł) - *enterprise*. Rozdzielenie ścieżki firmowej i prywatnej, hooks na poziomie 8, poziom 11 jako agentic OS. **18 maja 2026**.
- **v2.1p** - *private*. Wersja prywatna opublikowana **17 maja 2026**. [Czytaj v2.1p →](/pl/blog/skala-holaka-private/)

Skala pozostaje modelem rozwijanym iteracyjnie. AI, narzędzia i sposób pracy z agentami zmieniają się szybciej niż większość modeli dojrzałości, dlatego Skala Holaka będzie aktualizowana wraz z praktyką jej użycia w organizacjach i w życiu codziennym.
