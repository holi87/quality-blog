---
title: "Argus i Hephaestus: dwa zespoły agentów AI, jeden buduje, drugi kontroluje"
description: "Jak zbudowałem w Claude Code dwa zespoły wyspecjalizowanych subagentów: Hephaestus dostarcza oprogramowanie, Argus poluje na błędy. Role, koordynatorzy, współpraca i pułapki orkiestracji."
date: 2026-07-21
tags: ["ai", "agenci", "claude-code", "orkiestracja", "subagenci"]
lang: pl
readingTime: 15
author: GH
---

Przez pierwsze miesiące pracy z Claude Code jeden agent w jednym oknie załatwiał wszystko. Aż przestał. Przy zadaniach typu "nowa funkcjonalność od wymagań po wdrożenie" albo "pełny audyt jakości aplikacji" pojedynczy agent gubił kontekst, mieszał rolę architekta z rolą testera i - co najgorsze - sam wystawiał sobie laurkę za własny kod. Dlatego zbudowałem dwa zespoły wyspecjalizowanych subagentów: Hephaestusa, który buduje, i Argusa, który patrzy mu na ręce. Oba są publiczne - mieszkają w repozytorium [holak-teams](https://github.com/holi87/holak-teams), które jest jednocześnie marketplace'em pluginów Claude Code, więc wszystko, co opisuję niżej, można zainstalować i obejrzeć w źródłach. W tym wpisie pokazuję, jak te zespoły są zorganizowane, jak współpracują i kiedy taka orkiestracja ma sens, a kiedy jest przerostem formy nad treścią.

## Dlaczego zespół zamiast jednego agenta

Trzy rzeczy psują się, gdy jeden agent robi wszystko.

**Kontekst.** Okno kontekstu to zasób, a nie dekoracja. Agent, który w jednej sesji zbiera wymagania, projektuje architekturę, pisze kod, uruchamia testy i czyta logi, nosi w kontekście wszystko naraz. Im więcej nosi, tym słabiej rozumuje o każdym z tych obszarów z osobna. Mechanikę tego zjawiska i sposób, w jaki subagenci je rozwiązują, opisałem we wpisie o [subagentach w Claude Code](/pl/blog/subagenci-claude-code-co-to-i-po-co/) - w skrócie: subagent dostaje świeże okno i tylko ten wycinek problemu, który go dotyczy, a do rozmowy nadrzędnej wraca sam wniosek, nie tysiące linii surowych danych.

**Skupienie.** Prompt systemowy "jesteś pomocnym asystentem programisty" to brak specjalizacji. Prompt "jesteś inżynierem baz danych, projektujesz schematy i migracje, nie dotykasz interfejsu użytkownika, wynik oddajesz w ustalonym formacie" zawęża przestrzeń decyzji. W praktyce wąska rola z jasną definicją ukończenia daje wyraźnie mniej dryfu niż jeden uniwersalny agent, któremu w połowie zadania muszę przypominać, czym miał się zajmować.

**Adwersarialność.** Punkt najważniejszy. Agent nie łapie własnych błędów - z tego samego powodu, z którego programista nie widzi literówki we własnym kodzie: patrzy na swoje dzieło przez te same założenia, którymi je stworzył. Jeśli agent źle zrozumiał wymaganie, to samo złe zrozumienie siedzi i w kodzie, i w testach, i w "samokontroli" na końcu. Recenzent musi mieć świeży kontekst, inny cel i inny prompt - dopiero wtedy przegląd cokolwiek znaczy.

Jest jeszcze czwarty argument: ograniczenia narzędzi i jawny kontrakt roli zmniejszają pole do szkód. W Hephaestusie „tylko odczyt" recenzentów to wciąż reguła promptu, bo mają także Bash - mocna izolacja wymaga uprawnień systemowych lub piaskownicy, nie samej instrukcji. Argus idzie o krok dalej: wtyczka instaluje hook, który fizycznie blokuje modyfikację testowanej aplikacji, oraz autoryzację ryzykownych akcji w modelu „domyślnie odmawiaj" - nieznane, przejściowe i produkcyjne środowiska pozostają tylko do odczytu, a dowody przechodzą przez redakcję danych wrażliwych, zanim trafią do raportu.

## Hephaestus: kuźnia, która dowozi

Hephaestus wziął nazwę od Hefajstosa, boga-kowala. Zadanie zespołu jest jedno: wykuć działające oprogramowanie. Technicznie to 22 subagentów Claude Code o rzymskich imionach - każdy ma własny prompt systemowy, wąski zakres odpowiedzialności, ograniczony zestaw narzędzi i przypisany model: koordynator i najbardziej krytyczni recenzenci działają na Opusie, budowniczowie na Sonnecie, lekkie role zaplecza na Haiku. Punkt wejścia też jest jeden: **Marcus**, lider zespołu. To z nim rozmawiam. Marcus dekomponuje cel, dobiera skład pod to konkretne zadanie, produkuje plan delegacji, a na końcu syntezuje wyniki i raportuje. Układ jest gwiaździsty: agenci nie rozmawiają ze sobą, wszystko przechodzi przez Marcusa. Do tego dochodzą kontrakty wykonania - każdy roboczy agent kończy ustaloną kopertą wyniku ze statusem COMPLETE, PARTIAL, BLOCKED albo UNVERIFIED i dowodami, każdy plan kodowania kończy się bramką realnego uruchomienia, nieudana naprawa po dwóch cyklach eskaluje do mocniejszego modelu albo do Codex, a operacje destrukcyjne wymagają mojego jawnego potwierdzenia.

Tak wygląda przepływ celu "dodaj do aplikacji moduł raportów z eksportem do PDF":

1. **Środowisko.** Janus sprawdza, czy zespół w ogóle może wystartować: czy serwery MCP są skonfigurowane i podłączone, czy narzędzia wiersza poleceń (CLI) są zainstalowane, czy uwierzytelnienie działa, czy zależności się zgadzają. Werdykt brzmi READY, READY-WITH-GAPS albo NOT-READY, z dokładną komendą naprawczą dla każdej luki. Janus działa tylko w trybie odczytu - diagnozuje, niczego nie instaluje. Ta rola powstała po serii sesji, w których zespół wysypywał się w połowie roboty na brakującym uwierzytelnieniu.
2. **Wymagania.** Varro zamienia mgliste zdanie w historyjki zgodne z INVEST i kryteria akceptacji zapisane w Gherkinie. Rzeczy nieoczywiste wracają do mnie jako pytania, a nie jako ciche założenia zaszyte w kodzie.
3. **Architektura.** Vitruvius projektuje rozwiązanie: decyzje architektoniczne w formie ADR, wymagania niefunkcjonalne, kontrakty integracji. Ocenia projekt, zanim powstanie pierwsza linia kodu.
4. **Plan.** Agrippa tnie architekturę na sekwencję zadań z kryteriami akceptacji, ustala definicję ukończenia i standardy kodowania dla całego składu.
5. **Budowa.** Maximus bierze backend, Lucius frontend i interfejs użytkownika, Tiberius schemat bazy danych i migracje, Appius CI/CD, infrastrukturę, wdrożenia oraz mechanikę commitów i pull requestów (zgłoszeń zmian do przeglądu). Gdy funkcjonalność przecina wszystkie warstwy i potrzebny jest jeden właściciel, wchodzi Fabricius i dostarcza pełny pionowy wycinek: od bazy po ekran.
6. **Testy i bramka.** Fabius automatyzuje testy, Boethius projektuje przypadki technikami formalnymi (klasy równoważności, wartości brzegowe), Catiline testuje ręcznie i eksploracyjnie jak złośliwy użytkownik, Mercury mierzy wydajność, a Cassius robi przegląd bezpieczeństwa według STRIDE i OWASP - znów wyłącznie w trybie odczytu. Seneca spina całość strategią QA i werdyktem GO/NO-GO, a Severus, najbardziej nieufny agent w składzie, wykonuje adwersarialny przegląd każdej nietrywialnej zmiany tuż przed scaleniem: zatwierdza albo blokuje.

Wokół tego przepływu pracuje zaplecze: Cato pilnuje backlogu, Cicero dokumentacji, Regulus list kontrolnych, Tacitus kondensacji logów, a Numa ceremonii Scrum, przeszkód i ryzyk dostarczenia.

| Obszar | Agenci | Odpowiedzialność |
|---|---|---|
| Wejście | Marcus | Dekompozycja celu, dobór składu, plan delegacji, synteza wyników |
| Środowisko | Janus | Gotowość MCP, CLI, uwierzytelnienia, zależności; werdykt READY / READY-WITH-GAPS / NOT-READY; tylko odczyt |
| Wymagania | Varro | Historyjki INVEST, kryteria akceptacji w Gherkinie |
| Architektura | Vitruvius | Projekt systemu, ADR, wymagania niefunkcjonalne |
| Plan | Agrippa | Podział na zadania, definicja ukończenia, standardy kodowania |
| Budowa | Maximus, Lucius, Tiberius, Appius, Fabricius | Backend, frontend, baza danych i migracje, CI/CD i wdrożenia, pełne pionowe wycinki |
| Testy | Fabius, Boethius, Catiline, Mercury, Cassius | Automatyzacja, projekt przypadków, eksploracja, wydajność, bezpieczeństwo; role recenzenckie mają kontrakt bez edycji |
| Bramka i zaplecze | Seneca, Severus, Cato, Cicero, Regulus, Tacitus, Numa | Strategia QA i GO/NO-GO, bramka przed scaleniem, backlog, dokumentacja, listy kontrolne, logi, ceremonie i ryzyka |

Całe repo `holak-teams` jest marketplace'em pluginów Claude Code, więc zespoły instaluje się trzema komendami:

```text
/plugin marketplace add holi87/holak-teams
/plugin install hephaestus@holak-teams
/plugin install argus@holak-teams
```

Źródła ról są utrzymywane jako płaska lista definicji w `hephaestus/claude/agents/` (korzeniem wtyczki jest katalog `claude/`), a warianty dla Codex jako pary `*.toml` i `*.md` w `hephaestus/codex/` - te same nazwy, te same role, dwa środowiska uruchomieniowe. Dla przykładu szkielet Janusa:

```markdown
---
name: janus
description: Weryfikacja gotowości środowiska przed startem zespołu.
tools: Read, Grep, Glob, LS, Bash
model: sonnet
---
Jesteś Janusem, strażnikiem wejścia. Sprawdzasz serwery MCP,
narzędzia CLI, uwierzytelnienie i zależności pod konkretny cel.
Niczego nie instalujesz i nie naprawiasz - diagnozujesz.
Zwracasz werdykt READY / READY-WITH-GAPS / NOT-READY
oraz dokładną komendę naprawczą dla każdej wykrytej luki.
```

## Argus: sto oczu na jakość

Argus to w mitologii stuoki strażnik - ten, który widzi wszystko naraz. Trudno o lepszą nazwę dla zespołu QA. O ile Hephaestus jest zbudowany wokół cyklu dostarczania, Argus - 27 ról o greckich imionach - jest zbudowany wokół powierzchni, na których psuje się jakość: każda istotna powierzchnia aplikacji ma swojego dedykowanego łowcę.

Punktem wejścia w Claude Code jest komenda **`/argus:run`** - orkiestracja zostaje w głównym wątku rozmowy, a polityką sterującą jest **Odysseus** (w wariancie Codex to on jest bezpośrednim punktem wejścia). Zaangażowanie nie zaczyna się od wysyłania agentów, tylko od wyboru jednego z czterech trybów: **A** - pełny audyt QA ze strategią, testami przez jeden skrypt uruchomieniowy i raportem zbiorczym, **B** - głębokie polowanie na błędy z rejestrem znalezisk, ale bez budowy frameworka, **C** - budowa zestawu testów od zera, **D** - rozszerzenie istniejącego zestawu w miejscu, bez stawiania konkurencyjnego szkieletu. Wybór trybu to w praktyce wybór kosztu - wrócę do tego przy pułapkach.

Zanim ktokolwiek zacznie polować, pracuje dwójka analityków. Kalchas robi rozpoznanie: mapuje stos technologiczny, punkty końcowe API (endpointy), role użytkowników i dane. Metis na tej podstawie pisze strategię testów do pliku TEST-STRATEGY.md z jawną siatką pokrycia: co testujemy, czym, w jakiej kolejności i dlaczego. Ta siatka jest później twardym kryterium odbioru - na końcu każda komórka musi być wypełniona albo jawnie uzasadniona jako pominięta.

Potem rusza polowanie, równolegle, po powierzchniach:

- **Orion** - funkcjonalne błędy interfejsu użytkownika (UI): formularze, stany, zachowanie.
- **Lynceus** - prezentacja i wizualia: układ, formaty liczb i dat, sortowanie, czytelność.
- **Antigone** - dostępność według WCAG: klawiatura, kontrast, semantyka dla czytników ekranu.
- **Atalanta** - API: kontrakty, walidacja, spójność danych.
- **Proteus** - API wieloprotokołowe: GraphQL, gRPC, WebSocket i komunikacja asynchroniczna.
- **Perseus** - bezpieczeństwo według STRIDE i OWASP: kontrola dostępu, wstrzyknięcia, wycieki danych.
- **Hermes** - wydajność: rozmiary odpowiedzi, nagłówki pamięci podręcznej, zapytania N+1, opóźnienia pod obciążeniem.
- **Tyche** - odporność i chaos: kontrolowane awarie oraz wyrocznie zachowania przy błędach.
- **Charon** - baza danych; aktywowany warunkowo, tylko gdy rozpoznanie potwierdzi bezpośredni dostęp do bazy.
- **Ariadne** - głębokie ścieżki i reguły biznesowe: sama aranżuje warunki wstępne (zakłada konta, tworzy dane), żeby dotrzeć do stanów, których łowcy szerokości nigdy nie zobaczą.

Obok łowców pracują analitycy ścieżek: Penelope opisuje bazowe ścieżki UI, Theseus bazowe ścieżki API - to, co musi działać zawsze, staje się zieloną linią bazową regresji. A zespół automatyzacji utrwala wiedzę: Atlas projektuje wspólny szkielet testów (konfiguracja, klient API, dane testowe) i jeden skrypt `run-tests.sh`, który uruchamia wszystkie zestawy i oddaje jeden zbiorczy wynik. Daidalos automatyzuje UI w Playwright, Talos API, Nike wydajność, Mnemosyne bazę danych, Aegis regresję bezpieczeństwa. Zasada jest prosta: każdy potwierdzony błąd kończy jako czerwony test przypięty do zgłoszenia, każda ścieżka bazowa jako test zielony.

Na końcu wchodzi kontrola i synteza. Tiresias - biała skrzynka, statyczna analiza źródeł - działa warunkowo, gdy kod jest dostępny. Aristarchus robi przegląd całego kodu testów (tylko odczyt: determinizm, uczciwość asercji, czystość). Minos triażuje błędy: niezależnie weryfikuje wagę, deduplikuje i priorytetyzuje, żeby zamiast stosu duplikatów powstał czysty rejestr. Kleio pisze raport QA i odhacza finalną listę kontrolną akceptacji.

| Obszar | Agenci | Odpowiedzialność |
|---|---|---|
| Wejście | Odysseus | Tryb zaangażowania, dobór ekipy, kontrakt na wyniki |
| Rozpoznanie i strategia | Kalchas, Metis | Mapa systemu (stos, API, role, dane); TEST-STRATEGY.md z siatką pokrycia |
| Łowcy błędów | Orion, Lynceus, Antigone, Atalanta, Proteus, Perseus, Hermes, Tyche, Charon, Ariadne | UI, dostępność, API i protokoły, bezpieczeństwo, wydajność, odporność, baza danych i głębokie ścieżki |
| Ścieżki bazowe | Penelope, Theseus, Pistis | Kanoniczne ścieżki UI i API oraz kontrakty konsumenckie |
| Automatyzacja | Atlas, Daidalos, Talos, Nike, Mnemosyne, Aegis | Wspólny szkielet i run-tests.sh; testy UI (Playwright), API, wydajności, bazy danych, regresja bezpieczeństwa |
| Analiza źródeł | Tiresias | Biała skrzynka; tylko przy dostępie do kodu źródłowego |
| Kontrola i raport | Aristarchus, Asklepios, Minos, Kleio | Przegląd kodu testów, stabilizacja istniejącego zestawu, triaż i raport QA |

Struktura wyników po pełnym audycie wygląda tak:

```text
solution/
  TEST-STRATEGY.md      # Metis: siatka pokrycia
  paths/ui-*.md         # Penelope: bazowe ścieżki UI
  paths/api-*.md        # Theseus: bazowe ścieżki API
  PERF-REPORT.md        # Hermes: charakterystyka wydajności
bugs/
  ORI-001-formularz.md  # jeden plik = jeden błąd, prefiks łowcy
  PER-003-idor.md
  BUG-LEDGER.md         # Minos: zdeduplikowany rejestr po triażu
tests/
  ui/  api/  perf/  security/
run-tests.sh            # Atlas: jedno wejście do całej regresji
```

Automatyzacja nie startuje od pustego katalogu: wtyczka wozi ze sobą gotowe szablony frameworków testowych (TypeScript z Playwright, Java, Python), a każdy z nich implementuje te same cztery tryby uruchomień i oddaje wynik w jednym wspólnym formacie raportu. Dzięki temu zbiorczy wynik regresji wygląda tak samo niezależnie od stosu technologicznego projektu.

## Jak grają razem

Najciekawsze dzieje się na styku. Hephaestus ma przecież własną kontrolę jakości - Fabiusa, Catiline'a, Cassiusa, Severusa - więc po co drugi zespół? Odpowiedź: kontrola wewnętrzna dzieli kontekst z budowniczymi. Marcus koordynuje i budowę, i testy, więc te same założenia przenikają obie strony. Argus tych założeń nie zna. Odysseus dostaje zbudowaną aplikację i cel, a nie tłumaczenia autora. Jeśli Varro źle doprecyzował wymaganie, a Fabius napisał testy pod to samo błędne wymaganie, wewnętrzna bramka będzie zielona - i dopiero Ariadne, przechodząc reguły biznesowe bez wiedzy o założeniach, ma szansę to wywrócić.

Typowy cykl wygląda tak:

1. Hephaestus dostarcza przyrost: kod, testy, dokumentację i zieloną wewnętrzną bramkę Severusa.
2. Argus dostaje gotową aplikację i poluje adwersarialnie w trybie dobranym przez Odysseusa.
3. Minos triażuje znaleziska: weryfikuje wagę, deduplikuje, priorytetyzuje.
4. Raport Kleio wraca do Marcusa. Błędy o wysokim priorytecie lądują w backlogu u Cato i wracają do budowniczych jako zwykłe zadania.
5. Poprawki przechodzą przez regresję Argusa: jedno `./run-tests.sh`, jeden zbiorczy wynik. Czerwone testy przypięte do naprawionych błędów muszą przejść na zielono.
6. Dopiero wtedy Seneca wystawia GO.

Kluczowe są dwie własności tego styku. Po pierwsze **jeden raport**: choć pracuje kilkanaście ról, wszystko zlewa się w rejestr błędów po ocenie Minosa i raport Kleio - nie czytam dwudziestu osobnych opinii. Po drugie **jedna bramka**: werdykt GO/NO-GO uwzględnia obie strony - wewnętrzną bramkę Hephaestusa i zewnętrzny audyt Argusa. Dwie linie obrony, jeden punkt decyzji.

## Czego się nauczyłem: pułapki

**Koszt tokenów jest realny.** Pełny skład Argusa na średniej wielkości aplikacji potrafi zużyć wielokrotność tego, co jedna porządna sesja z pojedynczym agentem. Równoległość skraca czas zegarowy, ale mnoży koszty - ośmiu łowców czyta tę samą aplikację osiem razy. Dlatego cztery tryby zaangażowania to nie ozdoba, tylko mechanizm kontroli wydatków: na co dzień używam trybów ograniczonych, a pełny audyt (tryb A) uruchamiam przed ważnymi wydaniami.

**Teatr orkiestracji.** Największe ryzyko nie jest techniczne. Łatwo zbudować zespół, który wygląda imponująco i produkuje imponująco wyglądające artefakty, których nikt nie czyta. Test jest prosty: jeśli wynik danej roli nigdy nie zmienia żadnej decyzji, rola jest dekoracją. Kilka ról wyciąłem właśnie po tym teście. Pisałem o tym sceptycznie we wpisie o [orkiestracji wieloagentowej](/pl/blog/orkiestracja-wieloagentowa-kiedy-jeden-agent/) i podtrzymuję tamtą tezę: zespół agentów trzeba umieć uzasadnić, a nie tylko zbudować.

**Jeden agent nadal często wystarcza.** Poprawka błędu, mały refaktoring, prototyp na jedno popołudnie - jeden agent, jedno okno, zero orkiestracji. Zespoły wchodzą tam, gdzie zadanie ma wiele faz o sprzecznych wymaganiach wobec kontekstu albo gdzie potrzebna jest niezależna kontrola. Odpalenie Hephaestusa do poprawienia literówki to antywzorzec.

**Koordynator to najsłabsze ogniwo.** Marcus i Odysseus decydują o wszystkim: złej dekompozycji celu nie uratują najlepsi specjaliści, bo każdy z nich rzetelnie wykona niewłaściwe zadanie. Prompty koordynatorów są w obu zespołach najdłuższe i najczęściej poprawiane - i tak powinno być.

**Role dryfują.** Po kilku tygodniach Orion i Lynceus zaczęli raportować te same błędy - granica między "funkcjonalne" a "prezentacja" okazała się zbyt miękka. Trzeba było wpisać ją wprost do obu promptów, razem z regułą rozstrzygania sporów. Zespół agentów wymaga pielęgnacji jak zespół ludzi, tylko psuje się szybciej i szybciej daje się naprawić. Pomaga prosty układ pamięci zespołu: trwałe lekcje rzemiosła destyluję do promptu roli, konwencje konkretnego projektu lądują w jego AGENTS.md, a stan bieżącego przebiegu Marcus notuje w lekkim logu. Agenci sami zgłaszają wnioski na końcu zadania, ale do promptu roli awansuję je ręcznie i po weryfikacji - reguła wyniesiona z jednego stosu technologicznego potrafi wprowadzać w błąd w innym, a aktualny kod zawsze bije zapamiętaną regułę.

## Jak zacząć budować własny zespół

Nie zaczynaj od pięćdziesięciu ról. Mój przepis na start:

1. **Dwie, trzy role.** Budowniczy, recenzent i koordynator wystarczą. To już daje najcenniejszą własność całego wzorca: recenzenta ze świeżym kontekstem, który nie zna założeń autora.
2. **Wąskie prompty.** Każda rola dostaje: kim jest, co robi, czego **nie** robi i w jakim formacie oddaje wynik. Sekcja "czego nie robisz" jest ważniejsza, niż się wydaje - to ona zapobiega dryfowi.
3. **Ograniczone narzędzia.** Recenzent bez prawa zapisu, analityk bez dostępu do sieci, jeśli go nie potrzebuje. Zestaw narzędzi to część definicji roli, nie dodatek.
4. **Jeden koordynator, jeden artefakt zbiorczy.** Rozmawiasz z jednym agentem, a wyniki zlewają się w jedno miejsce: raport, rejestr błędów, plan. Jeśli musisz ręcznie sklejać wyniki pięciu agentów, orkiestracja nie działa.
5. **Mierz, czy to działa.** Czy zespół znajduje problemy, których pojedynczy agent nie znajdował? Czy wyniki zmieniają decyzje? Jeśli nie - wróć do jednego agenta i nie żałuj.

Jak krok po kroku powstaje pojedynczy subagent - plik, prompt, narzędzia, test - opisałem w [przykładzie własnego subagenta](/pl/blog/wlasny-subagent-claude-code-przyklad/). Zespół to konsekwentne powtórzenie tego wzorca plus koordynator, który umie delegować. A jeśli wolisz zacząć od działającego przykładu: oba zespoły, razem z kontraktami ról, hookami i szablonami frameworków, leżą w repozytorium [holak-teams](https://github.com/holi87/holak-teams) gotowe do instalacji jako wtyczki.

## Podsumowanie

Hephaestus i Argus to ta sama idea zastosowana do dwóch celów: podział pracy na wąskie role daje lepsze skupienie kontekstu niż jeden agent od wszystkiego, a pojedynczy punkt wejścia - Marcus po stronie budowy, Odysseus po stronie kontroli - zamienia zbiór promptów w zespół. Najwięcej wartości powstaje na styku: zespół, który buduje, nie ocenia sam siebie; ocenia go zespół, który nie zna jego założeń. Jeden raport i jedna bramka sprawiają, że z kilkunastu ról wychodzi jedna decyzja, a nie kilkanaście opinii.

Kolejność jest jednak nienegocjowalna: najpierw problem, potem zespół. Jeśli jeden agent dowozi - zostaw jednego agenta. Zespoły ról zwracają się wtedy, gdy praca ma wiele faz, wymaga niezależnej kontroli i powtarza się na tyle często, że inwestycja w prompty się amortyzuje. U mnie ten próg został przekroczony wyraźnie - stąd w moim Claude Code mieszkają kowal i stuoki strażnik.
