---
title: "Komenda /goal w Claude Code - kontrakt sesji, który nie pozwala agentowi się poddać"
description: "Jak /goal w Claude Code wymusza dokończenie pracy przez sesyjny hook Stop. Plusy, minusy, kiedy stosować, jak formułować warunek i czemu to ważne dla QA."
date: 2026-06-08
tags: ["claude-code", "ai", "workflow", "qa"]
lang: pl
readingTime: 8
author: GH
---

Każdy, kto pracuje z agentami AI dłużej niż dwa tygodnie, zna ten moment: dajesz Claude'owi listę pięciu rzeczy do zrobienia, on robi trzy, mówi „gotowe” i czeka. Dwa zadania zniknęły gdzieś między dryfem kontekstu, kompresją historii a chęcią szybkiego zamknięcia tury. Komenda `/goal` w Claude Code jest na to konkretną odpowiedzią.

Ten wpis pokazuje, czym `/goal` jest pod spodem, gdzie pomaga, a gdzie szkodzi, i jak formułować warunek, żeby agent realnie skończył pracę zamiast kręcić się w pętli.

## Hak, który nie pozwala się poddać

Po wpisaniu `/goal "<warunek>"` Claude Code aktywuje **sesyjny hook Stop**. Działa to tak: za każdym razem, gdy agent próbuje zakończyć turę, hook sprawdza warunek. Jeśli niespełniony - blokuje zatrzymanie i agent musi kontynuować. Spełnione - automatyczne wyczyszczenie, hak znika sam, bez ręcznego sprzątania.

Trzy ważne właściwości:

- **Hook żyje przez całą sesję**, nie tylko dla jednej tury. Wystartowany raz, trzyma się aż do spełnienia warunku albo do `/goal clear`.
- **Przeżywa kompresję kontekstu** (`/compact`). Po zwinięciu historii agent nadal wie, czego od niego chcesz, bo warunek jest wstrzykiwany do każdej tury jako wytyczna.
- **Nie miesza się z TodoWrite**. Lista zadań to mapa drogowa agenta - co ma jeszcze zrobić. `/goal` to kontrakt zewnętrzny - kiedy uznać pracę za skończoną. To dwa różne narzędzia, nie konkurencja.

Dla porównania: zwykły prompt mówi „zrób X”. `/goal` mówi „nie wolno ci się zatrzymać, dopóki X nie jest zrobione i zweryfikowane”. To różnica między wytyczną a kontraktem.

## Cykl życia w trzech krokach

1. Wpisujesz `/goal "wszystkie testy zielone i PR otwarty z opisem"`.
2. Agent pracuje. Każda próba „zakończyłem” → hook sprawdza warunek → blokuje, jeśli nie spełniony. Agent dostaje informację zwrotną, kontynuuje.
3. Warunek spełniony → automatyczne wyczyszczenie. Sesja wraca do normalnego trybu.

Możesz w każdej chwili przerwać przez `/goal clear`. Możesz też podejrzeć aktywny goal - system pokazuje go w komunikatach hooka.

## Plusy

**Ochrona przed dryfem w długich sesjach.** Refaktor obejmujący 12 plików, wsadowa publikacja 6 wpisów w dwóch językach, migracja schematu z testami - to wszystko klasyczne sytuacje, w których agent rezygnuje po pierwszych trzech zadaniach. Z `/goal` tego nie robi.

**Definicja Ukończenia w jednej linijce.** Przestajesz pytać „a zrobione już X?”. Warunek jest kontraktem; albo spełniony, albo nie. Mniej negocjacji, mniej dopytywania.

**Przetrwanie kompresji.** Klasyczny problem: dłuższa sesja → kompresja historii → agent zapomina, po co tu jest. `/goal` jest wstrzykiwany do każdej tury niezależnie od kompresji, więc cel przeżywa nawet bardzo długie konwersacje.

**Zero ceremonii konfiguracyjnej.** Jedna komenda, działa od razu. Nie musisz pisać hooka, edytować `settings.json`, ładować skilla. To wbudowany mechanizm Claude Code'a.

**Idzie z obiadem.** Jeden z najbardziej praktycznych przypadków użycia: ustawiasz goal, dajesz automatyczną akceptację dla bezpiecznych narzędzi, wychodzisz. Wracasz, sprawdzasz, czego agent dokonał. Bez `/goal` ryzyko, że stoi w pół drogi i czeka na potwierdzenie, jest realne.

**Naturalnie paruje z innymi narzędziami Claude Code.** `/compact` dla długich sesji, `ScheduleWakeup` dla odpytywania zewnętrznych systemów, `Agent` dla równoległej pracy - wszystko działa z aktywnym `/goal`, który trzyma definicję końca.

## Minusy i pułapki

**Mglisty goal = nieskończona pętla.** Najbardziej brutalny minus. „Popraw to porządnie” bez metryki to przepis na agenta, który nigdy nie uznaje pracy za skończoną. Hook nie ma jak ocenić „porządnie”, więc po każdej próbie zatrzymania wraca z „warunek niespełniony” i agent kombinuje dalej.

**Praca na wypełniacz.** Powiązany problem: jeśli agent czuje, że warunek niewystarczająco wyraźnie zaspokojony, dokleja niepotrzebne kroki tylko po to, żeby uniknąć zatrzymania. Refaktor zaczyna przybierać formę kosmetycznego dryfu, bo agent szuka czegoś, co podpisze pod „ukończone”.

**Niewidoczność.** Aktywny goal nie jest hałaśliwy. Łatwo zapomnieć, że jest. Klasyczna scena: chcesz przerwać konwersację, naciskasz Ctrl+C, a agent przy nowym pytaniu znów próbuje pracować nad starym celem. Trzeba pamiętać o `/goal clear`.

**Ograniczenie do sesji.** Restart CLI = goal znika. To nie jest mechanizm trwałości. Nie polegaj na nim między sesjami.

**Brak edycji w miejscu.** Żeby zmienić warunek, musisz wyczyścić i ustawić nowy. Nie ma `/goal update`.

**Konflikt z trybem konwersacyjnym.** Pytania i odpowiedzi, debugowanie, eksploracja kodu - wszystkie te tryby wymagają częstych zatrzymań. Goal w nich tylko przeszkadza.

## Kiedy włączać

- **Wielokrokowe migracje i refaktory** ze znanym stanem końcowym. „Wszystkie pliki używają nowego importu i `npm test` zielony.”
- **Produkcja treści wsadowo.** „Trzy wpisy PL i EN, frontmatter spójny, czysty build, commit i push.”
- **Sekwencje programowanie → recenzja → wydanie.** „Funkcja gotowa, testy zielone, PR otwarty z opisem i listą kontrolną.”
- **Praca pod zegar.** Długotrwałe CI, wdrożenie, kolejka. Łącz z `ScheduleWakeup` dla odpytywania.
- **Praca, podczas której odchodzisz od komputera.** Jedno z najlepszych zastosowań.

## Kiedy nie włączać

- **Pojedyncza edycja.** Literówka, jeden plik, mała zmiana - narzut nieopłacony.
- **Debugowanie i eksploracja.** Nie znasz stanu końcowego; nie da się go opisać.
- **Pytania i odpowiedzi o kodzie.** Pytanie-odpowiedź, koniec.
- **Cele bez mierzalnej metryki.** „Lepiej”, „elegancko”, „bardziej idiomatycznie” - to są oceny, nie warunki.

## Jak formułować goal - lista kontrolna QA

Tu zaczyna się robić ciekawie z perspektywy testerskiej. Goal to w istocie **kryterium akceptacji sesji**. Zasady, które znamy z BDD i projektowania testów, działają jeden do jednego.

- ✅ **Mierzalność.** „Czysty build i 0 nowych ostrzeżeń” bije „popraw build”. Jeden da się zweryfikować jednym poleceniem; drugi nie.
- ✅ **Stan końcowy, nie czynność.** „PR otwarty z opisem” > „otwórz PR”. Czynność można wykonać niedbale; stan końcowy jest weryfikowalny.
- ✅ **Falsyfikowalność.** Da się zaprzeczyć jednym sprawdzeniem. Jeśli warunek brzmi tak, że trzeba uznać, czy się go dało - przepisz.
- ✅ **Koniunkcja, nie alternatywa.** „A i B i C” jest precyzyjne. „A albo B” daje agentowi wybór, który niekoniecznie pokrywa się z Twoim.
- ❌ **Przymiotniki bez progu.** „Szybciej”, „lepiej”, „czyściej” - wyrzuć albo zamień na próg („< 200 ms”, „bez duplikatów”, „przejście lintera”).
- ❌ **Imperatyw bez weryfikacji.** „Napisz testy” jest słabsze niż „pokrycie linii ≥ 80% dla pliku X”.

To dosłownie ten sam problem projektowania testów, który rozwiązujemy w specyfikacjach funkcjonalnych. `/goal` daje nam język, w którym możemy go zaadresować na poziomie sesji z agentem.

## `/goal` na tle innych narzędzi Claude Code

| Narzędzie | Zasięg | Po co |
|---|---|---|
| `/goal` | sesja, kontrakt | wymusza definicję ukończenia |
| `TaskCreate` | sesja, mapa | śledzi postęp wewnętrzny agenta |
| Tryb planowania | jednorazowy | uzgodnienie podejścia przed pracą |
| `ScheduleWakeup` | wieloraz, czas | odpytywanie stanu zewnętrznego |
| `CronCreate` | trwały | autonomiczna pętla między sesjami |

Te narzędzia łączą się, nie zastępują. Tryb planowania → uzgodnienie. `TaskCreate` → kroki. `/goal` → kontrakt. `ScheduleWakeup` → odpytywanie.

## Perspektywa QA - testowanie akceptacyjne agenta

Z perspektywy [architekta testów](/pl/blog/10-workflowow-ai-dla-test-architecta/), `/goal` to mechanizm, który wprost zaadresowuje jeden z najboleśniejszych problemów w pracy z agentami: **fałszywy sukces**. Agent twierdzi, że zrobił, ale nie zrobił, bo zatrzymał się przed weryfikacją albo bo „zrobił” znaczy dla niego coś innego niż dla nas.

Jeśli warunek `/goal` jest weryfikowalny - odpalany przez `npm test`, `lint`, `gh pr view`, cokolwiek deterministycznego - fałszywy sukces staje się znacznie trudniejszy. Agent może próbować skrótów, ale hook nie da mu wyjść, dopóki realne sprawdzenie nie przejdzie.

Dla [oceny wyniku agenta](/pl/blog/ocena-outputu-agenta/) to praktyczna konsekwencja: nie polegamy na deklaracji, polegamy na warunku. Goal jest mniej narzędziem produktywności, a bardziej narzędziem **walidacji w czasie działania**.

W zespole, w którym wprowadzam Claude Code do procesu QA, traktuję `/goal` jako wymuszoną Definicję Ukończenia na poziomie sesji. Każdy poważny przepływ pracy (aktualizacja zestawu testów regresji, proces poprawiania błędów, proces publikacji treści) ma swój szablon goal-a - analogicznie do tego, jak testowy framework ma szablon asercji.

## Mini case study - ten artykuł

Konkretne życie z tej sesji. Goal brzmiał: „popraw tytuł bloga i dopisz post o `/goal`”. Bez kontraktu typowy przebieg wyglądałby tak:

1. Zmień tytuł w jednym pliku.
2. „Gotowe, co dalej?”
3. Człowiek dopytuje, agent dopowiada drugą część.

Z aktywnym goal-em przebieg był inny:

1. Zmiana tytułu w sześciu plikach (JSON-LD + dwa indeksy + trzy `<title>` strony głównej).
2. Weryfikacja builda (153 stron).
3. Zwrot do drugiej części celu - propozycja punktów.
4. Czekanie na akceptację (bo to literalnie część warunku: „po akceptacji”).
5. Pełny artykuł, build, commit, push.

Hook nie pozwolił mi się zatrzymać po pierwszym kroku. Co ważne, w trakcie ujawniło się dodatkowe wymaganie (wtorki zarezerwowane dla innego autora), które normalnie zniknęłoby między zadaniami - z goalem zostało wpisane do pamięci i zaadresowane przed dalszą pracą.

## Pułapki obserwowane w praktyce

- **Goal po imperatywie** („zrób X”) - agent rozumie go jako akcję, nie stan końcowy. Łatwo go zaspokoić powierzchowną zmianą. Zamień na stan: „X jest gotowe i przetestowane”.
- **Goal z disjunkcją** („A albo B”) - agent wybierze łatwiejsze.
- **Goal kolidujący z informacją zwrotną od użytkownika** - chcesz przerwać, hook blokuje. Świadomie używaj `/goal clear`.
- **Goal niemożliwy do spełnienia** - agent będzie próbował w nieskończoność. Sprawdź realność warunku przed ustawieniem.
- **Goal w trybie automatycznej akceptacji bez nadzoru** - niebezpieczne. Agent z mocnym warunkiem i pełnym dostępem do narzędzi może zrobić rzeczy, których nie chcesz. Zostaw człowieka w pętli na kroki destrukcyjne.

## Praktyczne wskazówki

- **Pisz goal jako Definicję Ukończenia.** Jeśli umiesz to zwerbalizować dla recenzji kodu, umiesz dla `/goal`.
- **Łącz z `TaskCreate`.** Lista zadań = CO, goal = UKOŃCZONE. To dwie różne warstwy, obie potrzebne dla dłuższych przepływów pracy.
- **Bardzo długie zadania → fazuj.** Goal na koniec fazy, na koniec sesji wyzeruj. Łatwiej niż próbować zmieścić wszystko w jednym warunku.
- **Zostaw okruszek na koniec.** Po spełnieniu warunku jednym zdaniem opisz, co dalej. Pomaga, gdy wracasz po przerwie.
- **Paruj z `verification-before-completion`** (skill z Superpowers). Skill mówi, jak weryfikować; `/goal` mówi, że trzeba.

## Wnioski

`/goal` to jedna z najbardziej niedocenianych funkcji Claude Code. Wygląda jak mała wygoda, jest mechanizmem walidacji w czasie działania. Pozwala zamienić deklarację „zrobiłem” na sprawdzalny stan końcowy.

Sukces zależy w stu procentach od jakości warunku. To nie problem narzędzia, to problem projektowania testów. Jeśli umiesz pisać dobre asercje, umiesz pisać dobre goale.

Dla [architektów testów i osób wdrażających AI do procesu QA](/pl/blog/skala-holaka/) `/goal` jest realnym narzędziem nadzoru - buduje pewność, że sesja kończy się tam, gdzie chcieliśmy, a nie tam, gdzie agent uznał za wystarczające.

Następnym razem, gdy zaczynasz wielokrokową pracę z Claude Code, spróbuj sformułować jednozdaniową Definicję Ukończenia. Wpisz `/goal "..."`. Reszta sesji wygląda inaczej.
