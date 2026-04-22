---
title: "Skill do zgłaszania bugów w Jirze — przez Atlassian MCP, po ludzku"
description: "Jak zbudować skill, który zamienia Twoje „hej, coś się psuje na checkoucie” w kompletny ticket w Jirze — z dowodami, dedupe i bez zaśmiecania projektu. Bez agenta-autopilota, z ludzkim confirmem."
date: 2026-04-30
tags: ["ai", "qa", "agenci", "skills", "mcp", "jira"]
lang: pl
readingTime: 11
---

W każdym zespole QA, w którym pracowałem, ten sam moment wraca co sprint: tester łapie buga, opisuje go jednym zdaniem na Slacku i dokleja link do ticketu. Po otwarciu okazuje się, że summary brzmi „nie działa login", brak kroków reprodukcji, screenshot pokazuje połowę ekranu, a w komentarzach pojawia się „u mnie działa". Po dwóch dniach ticket zostaje zamknięty z adnotacją „cannot reproduce", a po trzech tygodniach bug wraca na produkcję — tym razem z szerszym zasięgiem.

Nie chodzi o to, że testerzy są niesumienni. Zgłaszanie bugów to czynność powtarzalna, wymagająca porządku i łatwa do zaniedbania pod presją czasu. Dobry ticket wymaga zebrania kilku rzeczy w stałej kolejności: kroki reprodukcji, oczekiwane i faktyczne zachowanie, środowisko, dowody, priorytet, weryfikacja duplikatów. Każdy z tych elementów osobno jest trywialny. Razem, wykonywane kilkanaście razy dziennie, składają się w zadanie, przy którym regularnie coś wypada.

To dokładnie ten kształt zadania, pod który skill został pomyślany. W tym wpisie pokażę, jak taki skill złożyłem w oparciu o Atlassian MCP — co się w nim znajduje, czego w nim świadomie nie ma, i gdzie po drodze najłatwiej wpaść w pułapkę „AI tworzy ticket samodzielnie".

## Dlaczego skill, a nie prompt

Pierwszym podejściem, które przetestowałem, był prompt. Szablon w stylu „dostajesz opis buga, zbuduj z tego ticket z polami takimi-a-takimi, w konwencji naszego projektu" działał przez mniej więcej tydzień. Potem zaczął pęcznieć: konwencja nazewnicza komponentów, lista wymaganych label, format Jira Markup, reguły priorytetyzacji, obsługa duplikatów. Po miesiącu prompt zajmował pół ekranu, a i tak część kroków musiałem wykonywać ręcznie w Jirze.

Skill rozwiązuje to inaczej. To samodzielna paczka instrukcji — w Claude Code jest to folder z plikiem `SKILL.md` — którą agent ładuje wtedy, kiedy jest faktycznie potrzebna. Nie obciąża system prompta, nie zużywa kontekstu, a przede wszystkim ma dostęp do narzędzi: Atlassian MCP do założenia ticketu, Playwright MCP do zrobienia screenshotu i trace'a, terminal do uruchomienia `curl`.

Jeśli pojęcia „skill", „tool" i „MCP" wciąż się między sobą rozmywają, warto zajrzeć do [słownika pojęć AI dla testerów](/pl/blog/slownik-pojec-ai-dla-testerow). W tym tekście zakładam, że te podstawy mamy ustalone.

## Co bierzemy z Atlassian MCP

Oficjalny Atlassian MCP (i kilka społecznościowych wrapperów wokół niego) udostępnia agentowi standardowe operacje na Jirze. Do raportowania bugów wystarczą cztery z nich: `search` po JQL, `getIssue` do wglądu w potencjalny duplikat, `createIssue` do założenia nowego ticketu oraz `addAttachment` do dołożenia dowodów.

Warto zwrócić uwagę na to, czego na tej liście nie ma. Brakuje `deleteIssue`, `transitionIssue`, `assignIssue` — niczego, co modyfikuje istniejące tickety. To decyzja świadoma: skill, który raportuje, nie powinien móc zamykać ani przepisywać. Od tego jest człowiek. Poświadczenia, których używam, mają uprawnienia wyłącznie do tego minimalnego zestawu operacji, ograniczone dodatkowo do konkretnych projektów. Prośba „zamknij te dziesięć starych bugów" po prostu nie ma w tym skillu gdzie wylądować.

Najtańszy moment na ustawienie takiego zakresu to etap konfiguracji, a nie pierwszy incydent, w którym agent przypadkowo coś modyfikuje.

## Anatomia skilla

Moja wersja `SKILL.md` składa się z czterech części.

**Trigger** — jedno zdanie, kiedy skill ma się aktywować. W mojej wersji brzmi: „aktywuj, gdy użytkownik opisuje zaobserwowany defekt — błąd HTTP, nieprzewidziane zachowanie UI, niewłaściwy stan w bazie. Nie aktywuj przy review istniejącego ticketu ani przy dyskusji hipotetycznej". Precyzyjne zdanie drugie eliminuje zauważalną część fałszywych aktywacji.

**Wejście** — czego skill oczekuje od użytkownika. Minimum: krótki opis problemu, warstwa (API / UI / DB / messaging) i środowisko. Jeśli czegoś brakuje, skill zadaje jedno pytanie — nie trzy, nie z elaboratem.

**Proces** — główna część, omówiona niżej.

**Wyjście** — co dokładnie trafia do Jiry. Draft w formacie Jira Markup, lista załączników, jawne potwierdzenie przed `createIssue`, a po akceptacji — key utworzonego ticketu plus link, który można wkleić dalej.

## Przebieg po aktywacji

Kiedy przekazuję skillowi opis „POST /orders zwraca 500 przy pustym koszyku na staging", uruchamia się sekwencja sześciu kroków.

**Dedupe.** Pierwszym krokiem jest zawsze `search(jql)` po frazach z opisu. W praktyce wygląda to jak `project = CHK AND status != Closed AND text ~ "empty cart 500"`. Jeśli są trafienia, skill prezentuje trzy najbardziej podobne tickety i pyta, czy któryś z nich jest tym samym problemem. Ten krok w pierwszym miesiącu wyeliminował wyraźną część ticketów, które w innym scenariuszu trafiłyby do Jiry jako duplikaty.

**Zbieranie dowodów.** Kolejność zależy od warstwy. Dla API skill uruchamia `curl` i zapisuje request, response, nagłówki oraz kod statusu. Dla UI sięga po Playwright MCP — nawiguje do URL-a, odtwarza kroki, woła `browser_take_screenshot`, zbiera `browser_console_messages` oraz nieudane żądania z `browser_network_requests`. Dla DB — query przez DB MCP i wynik w postaci CSV. Wszystko zapisuje się lokalnie w `bugs/evidence/BUG-<timestamp>/`, bo te pliki staną się załącznikami.

**Priorytet według reguły.** W praktyce, bez jawnej definicji, model ma tendencję ustawiać wszystko jako „Major", bo brzmi to neutralnie. Rozwiązaniem jest krótki zestaw kryteriów w samym skillu: *Blocker* oznacza „produkcja nie działa, brak workaroundu", *Critical* — „kluczowa funkcja nie działa, workaround kosztowny", *Major* — „istotna funkcja nie działa, da się obejść", *Minor* — kosmetyka i drobne usterki. Jeśli priorytet pojawia się w opisie, zostaje on uszanowany. Jeśli nie — skill proponuje i prosi o potwierdzenie. Bez tej reguły każdy ticket lądowałby z tym samym priorytetem, a pole Priority bardzo szybko traciłoby znaczenie.

**Draft w stałym formacie.** Skill wypełnia szablon zawsze w tej samej strukturze. Summary zaczyna się od komponentu w nawiasach kwadratowych: `[Checkout] POST /orders zwraca 500 przy pustym koszyku`. Description powstaje w Jira Markup z sekcjami Steps, Expected, Actual, Environment i Evidence. Labels obejmują `bug`, warstwę i komponent. Placeholdery typu `{{TODO}}` nie są akceptowane — brak informacji oznacza brak ticketu.

**Dry-run i potwierdzenie.** Najważniejszy moment całej sekwencji. Skill nie tworzy ticketu od razu. Prezentuje draft dokładnie w takiej postaci, w jakiej zamierza go wysłać, i czeka na decyzję. Akceptacja, odrzucenie albo prośba o zmianę pola — każda odpowiedź jest dopuszczalna. Tryb „utwórz bez pytania" istnieje, ale wyłącznie jako jawny flag w wywołaniu. Uczynienie go domyślnym oznaczałoby rezygnację z najważniejszego zabezpieczenia przed zaśmiecaniem Jiry.

**Utworzenie ticketu.** Dopiero na tym etapie wywoływane jest `createIssue`, a następnie `addAttachment` dla każdego pliku z evidence. Na końcu skill zwraca klucz ticketu i link do niego.

## Szablon opisu, który trzymam w jednym miejscu

Jira Markup to nie jest Markdown i to jest drobna pułapka, która wciąga każdego nowego skill-autora. Trzymam szablon jako osobny plik w skillu, żeby nie wpisywać go w instrukcje:

```text
h2. Kroki reprodukcji

# Zaloguj się jako {{qa-user-checkout}}
# Dodaj produkt {{SKU-42}} do koszyka
# Usuń produkt — koszyk zostaje pusty
# Wyślij POST /api/orders z pustym body

h2. Oczekiwane

* 400 Bad Request, payload {{{"error": "empty cart"}}}

h2. Faktyczne

* 500 Internal Server Error
* Stack wskazuje NPE w OrderService.validate()

h2. Środowisko

* Build: 3.12.4
* URL: https://staging.example.com
* Browser: Chrome 138, macOS 15.3

h2. Dowody

* [^screenshot.png] — stan koszyka przed POST
* [^response.json] — pełny response 500
* [^playwright-trace.zip] — trace z odtworzenia
```

Szablon trzymany w jednym pliku daje jedną bardzo praktyczną własność: pojedyncza zmiana przekłada się na wszystkie przyszłe tickety. W wariancie, w którym format był zaszyty w samych instrukcjach skilla, każda aktualizacja wymagała modyfikacji w kilku miejscach naraz — łatwo o niespójność.

## Czego świadomie nie dopuszczam

Cztery decyzje, które w praktyce decydują, czy skill zostanie w zespole na dłużej.

**Auto-assign.** Pomysł, żeby skill sam przypisywał ticket do „ostatniej osoby, która dotykała kodu", wydaje się kuszący. W praktyce bywa problematyczny — `git blame` nie zawsze pokazuje właściwego autora, a błędne przypisanie poza godzinami pracy generuje więcej szkód niż korzyści. Przypisanie traktuję jako decyzję triage podejmowaną przez człowieka.

**Auto-transition statusu.** Skill wyłącznie tworzy tickety. Nie przenosi do „In Progress", nie zamyka, nie klonuje między projektami. Świeży ticket pozostaje w „To Do" do momentu, gdy zajmie się nim człowiek.

**Ticket bez kroków reprodukcji.** Screenshot bez kroków nie jest raportem. Kroki reprodukcji są polem obowiązkowym — jeśli ich nie podałem, skill pyta. Jeśli mimo pytania nie uzupełniono, nic nie trafia do `createIssue`.

**Wspólny skill dla wszystkich projektów.** Wariant, w którym projekt Jira wybierany jest heurystycznie na podstawie fraz z opisu („checkout" → CHK, „auth" → AUTH), bywa zawodny — pomyłka raz na kilkanaście razy oznacza ticket w projekcie, którego nikt nie obserwuje. Skuteczniej sprawdza się trzymanie projektu w triggerze skilla i utrzymywanie osobnych wariantów dla każdego projektu.

## Quality gate przed wysyłką ticketu

Tuż przed `createIssue` skill przechodzi przez krótką listę sprawdzeń. Nie jest to logika w kodzie, tylko sekcja w `SKILL.md`, która instruuje model: „jeśli którekolwiek z poniższych nie jest spełnione, wróć do użytkownika z listą braków i nie twórz ticketu".

Summary musi zaczynać się od komponentu w nawiasach kwadratowych. Kroki muszą być ponumerowane i nie przekraczać siedmiu pozycji. Expected i actual muszą rzeczywiście się różnić — brzmi banalnie, ale przy lakonicznym opisie problemu te dwa pola potrafią być niemal identyczne. Environment musi zawierać build, URL i przeglądarkę. Musi pojawić się co najmniej jeden załącznik, a dla warstwy UI — screenshot i log konsoli. Priority musi być ustawiony. Labels muszą zawierać komponent i warstwę.

Pierwsze tygodnie po wdrożeniu tej checklisty skill regularnie zawraca drafty i prosi o uzupełnienia. Z czasem takie sytuacje się urywają, bo informacje zaczynają być podawane od razu, na etapie opisu problemu. Działa to analogicznie do lintera: checklisty tego typu nie zmieniają ludzi — zmieniają to, co ludzie dostarczają na wejściu.

## Kiedy warto rozszerzać

W pierwszej wersji skill obsługiwał tylko cztery czynności: search, dowody, draft, create. Kolejne elementy dokładam dopiero wtedy, gdy widzę, że ten sam ręczny krok powtarza się dziesiątki razy.

Pierwszym rozszerzeniem był tryb **triage** — osobny skill, który na komendę „triage BUG-1422" pobiera ticket, dociąga logi z CI z okna ±2 godziny wokół zgłoszenia, sprawdza ostatnie commity w komponencie wymienionym w summary i proponuje kandydatów na prawdopodobną przyczynę. To już nie jest raportowanie, tylko diagnoza — ale kształt pracy jest identyczny: stała sekwencja ręcznych czynności, które teraz zajmują kilka minut zamiast kilku godzin.

Drugim rozszerzeniem jest **link do pull requesta**. Przy podpiętym GitHub MCP skill po utworzeniu ticketu sprawdza, czy w zmodyfikowanym komponencie istnieje otwarty PR, i proponuje dołączenie do niego linku. Eliminuje to powtarzające się na stand-upach pytanie „który ticket jest zaadresowany przez ten PR".

Czego nie dokładałem — automatycznego taggowania komponentów oraz wyznaczania severity na podstawie treści opisu. W obu przypadkach margines błędu jest zbyt duży, a cichy błąd w polu priorytetowym bywa trudny do wychwycenia.

## Podsumowanie

Skill do raportowania bugów nie polega na tym, żeby AI „zrobiło ticket za testera". Polega na tym, żeby zdjąć z niego warstwę powtarzalną — dedupe, szablon, Jira Markup, załączniki — i zostawić mu tę część pracy, która wymaga ludzkiego osądu: decyzję, czy to faktycznie bug, jak ważny i komu go przekazać. Atlassian MCP dostarcza dostęp do Jiry. Playwright MCP dostarcza dowody. Skill dostarcza procedurę. Człowiek dostarcza decyzję.

Największa wartość, jaką widzę w tym podejściu, pojawia się dopiero po pierwszym miesiącu używania. Nie jest nią pierwszy automatycznie zgłoszony ticket, tylko obserwacja, że w Jirze przestają pojawiać się tickety bez kroków reprodukcji. Nie dlatego, że zespół nagle zaczyna pisać lepiej. Dlatego, że skill po prostu takich ticketów nie przepuszcza.

Jeśli chcesz zobaczyć, jak ten typ skilla wpasowuje się w szerszy workflow Test Architecta, sprawdź [10 workflowów AI, które realnie pomagają](/pl/blog/10-workflowow-ai-dla-test-architecta). A jeżeli jeszcze nie masz pierwszego MCP w zespole QA — zacznij od [pary search/fetch po evidence](/pl/blog/pierwszy-mcp-dla-qa-search-fetch), to najtańszy i najmniej ryzykowny start.
