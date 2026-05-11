---
title: "Caveman — plugin, który tnie output tokeny o 75% (i gdzie to pęka)"
description: "Jak plugin Claude Code każący modelowi mówić jak jaskiniowiec zmienił mój rachunek za tokeny — i w których zadaniach to działa, a w których wręcz szkodzi."
date: 2026-05-04
tags: ["ai", "claude-code", "tokeny", "tooling", "plugins"]
lang: pl
readingTime: 10
author: GH
---

Pod koniec marca dostałem fakturę za API Anthropic, na którą nie byłem gotowy. Nie dlatego, że korzystałem z Claude'a więcej niż zwykle — raczej dlatego, że zacząłem pracować z długimi, agentowymi sesjami, w których każda runda zawierała elegancko sformułowane odpowiedzi, uprzejme wprowadzenia i drobiazgowe podsumowania tego, co zaraz zostanie zrobione. Gdy wyciągnąłem statystyki z logów, okazało się, że około **60–70% wygenerowanych tokenów to narracja wokół właściwej odpowiedzi** — „Sure!", „Happy to help", „Let me take a look", „The reason this happens is likely...". Technicznie nic z tego nie było błędne. Finansowo i operacyjnie — wszystko z tego było do wyrzucenia.

To był moment, w którym trafiłem na plugin o nazwie `caveman`. Slogan: *why use many token when few do trick*. Idea: zmusić model, żeby mówił jak jaskiniowiec. Bez przedimków, bez wstępów, bez hedgingu. Na pierwszy rzut oka wygląda jak żart. W praktyce okazał się jednym z najciekawszych narzędzi, jakie dodałem do Claude Code w tym kwartale — nie dlatego, że rozwiązuje wszystkie problemy, ale dlatego, że bardzo precyzyjnie pokazuje, *gdzie* model marnuje tokeny, i daje wyłącznik.

W tym wpisie opowiem, co caveman właściwie robi, na jakich zadaniach się sprawdza, na których pęka, i dlaczego traktuję go jako eksperyment poznawczy tak samo ważny, jak oszczędność pieniędzy.

## Co to jest caveman

Technicznie caveman jest pluginem Claude Code (dostępny też dla Codex, Gemini CLI, Cursor, Windsurf, Copilot, Cline) i zestawem skilli. Instalacja zajmuje jedną linię:

```bash
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman
```

Po instalacji każda nowa sesja Claude Code dostaje hook `SessionStart`, który wstrzykuje do system prompta instrukcję w stylu: *mów zwięźle jak caveman, tnij przedimki, unikaj grzeczności, trzymaj całą techniczną substancję, zachowaj dokładność cytatów i bloków kodu*. Sam plugin to kilkanaście plików — `caveman.skill`, reguły, hooki, kilka dodatkowych skilli (`caveman-commit`, `caveman-review`, `caveman-compress`).

Najczęściej przywoływany przykład z repo pokazuje, o co w tym chodzi:

> **Normalny Claude (69 tokenów):** „The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

> **Caveman (19 tokenów):** „New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

Ta sama diagnoza, ta sama rekomendacja, 72% mniej tokenów. Autor pluginu cytuje artykuł z arXiv sugerujący, że kompresja promptu tego typu nie obniża dokładności modelu w zadaniach technicznych. Moje własne testy — o których za chwilę — potwierdzają to w pewnym zakresie i dokładnie pokazują, gdzie przestaje to być prawdą.

## Poziomy intensity — od litego do文言文

Caveman nie jest jednym trybem, tylko skalą. Poziom zmienia się komendą `/caveman lite|full|ultra|wenyan`.

- **Lite** — usuwa grzeczności, ale zachowuje zdania. Tekst dalej wygląda profesjonalnie.
- **Full** — domyślny. Drop przedimków, fragmenty zdań OK, krótkie synonimy.
- **Ultra** — wygląda jak notatki inżyniera pod presją. Strzałki, skróty, maksymalna kompresja.
- **Wenyan (文言文)** — klasyczny chiński. Żart, ale działający. Około 85% mniej tokenów niż baseline, kosztem tego, że rano nic nie rozumiesz z własnych logów.

W codziennej pracy używam `full`. Do szybkich debugów i fixów potrafię przełączyć w `ultra`. Do dokumentacji i kodu klienta wyłączam komendą `stop caveman`.

Jeden istotny detal: plugin sam z siebie **wyłącza caveman mode w sytuacjach, w których zwięzłość byłaby szkodliwa**. Regulamin pluginu nazywa to „auto-clarity" i obejmuje ostrzeżenia bezpieczeństwa, potwierdzenia nieodwracalnych operacji oraz wieloetapowe sekwencje, w których zła kolejność fragmentów mogłaby prowadzić do błędu. Kod, commity i cytaty błędów są pisane normalnie — caveman nie dotyka ich w ogóle. To nie jest detal. Bez auto-clarity caveman byłby bezużyteczny przy operacjach typu `DROP TABLE` albo przy procedurach incydentowych.

## Ekosystem: commit, review, compress

Sam plugin to początek. Wraz z nim instalują się trzy skille, które odpowiadają na najbardziej „gadające" zadania inżyniera.

**`caveman-commit`** wymusza commit messages w konwencji Conventional Commits z subject ≤50 znaków i body tylko wtedy, gdy „why" nie jest oczywiste z samego diff-a. Jeżeli dotychczas Twój commit brzmiał `Adding validation to handle the case where user inputs are empty or contain whitespace-only strings`, po cavemanie wygląda jak `feat(auth): trim and reject empty inputs`. Drobna rzecz, ale po dwóch tygodniach `git log` staje się czytelny jak spis treści, a nie dziennik.

**`caveman-review`** tnie komentarze code review do jednej linii: lokalizacja, problem, fix. Bez wstępów, bez „I think maybe consider", bez tłumaczenia, dlaczego to ważne. Zespoły, które tego próbowały, dzielą się na dwie grupy: albo to kochają (ludzie, którzy mają dużo PR-ów do przejrzenia dziennie), albo nienawidzą (ludzie, którzy traktują review jako rozmowę). Moja opinia: review od młodszego kolegi do starszego nadal warto pisać po ludzku. Review tool-to-tool w pipeline-ach CI — cavemanem.

**`caveman-compress`** działa inaczej. Nie tnie outputu modelu, tylko inputy: kompresuje pliki `CLAUDE.md`, `AGENTS.md`, bazy instrukcji i memory files do formy caveman, zachowując pełną substancję techniczną, kod i URL-e. Oryginał zostaje jako `FILE.original.md`. Na moim projekcie szkoleniowym skompresowany `CLAUDE.md` był o 46% lżejszy, co realnie oznacza 46% mniej tokenów ładowanych do kontekstu **na każde zapytanie**. To skalowało się lepiej niż sam plugin.

## Moje testy — gdzie działa, gdzie pęka

Żeby nie skończyć na chwaleniu, przeprowadziłem własny, prosty eksperyment. Przez tydzień prowadziłem dwie równoległe sesje Claude Code na tym samym projekcie (blog, na którym czytasz ten wpis): jedną z cavemanem na poziomie `full`, drugą bez. Ten sam zestaw zadań, ten sam workflow, logi zapisywane do osobnych plików. Na koniec tygodnia policzyłem output tokeny i zapisałem subiektywną ocenę jakości.

Wyniki liczbowe były zgodne z reklamą: output caveman sesji stanowił **około 28% outputu sesji normalnej**. Czyli ponad 70% oszczędności. Dla kogoś, kto dziennie generuje kilkaset wywołań, to już jest realna kwota na miesiąc.

Subiektywnie natomiast ujawniły się trzy wzorce, o których nikt w marketingu pluginu nie mówi.

Po pierwsze, **caveman wygrywa przy zadaniach krótkich i dobrze zdefiniowanych**. Debugowanie, jednolinijkowe fixy, wyjaśnianie konkretnej funkcji, propozycja implementacji małej zmiany. W tych przypadkach krótki, fragmentaryczny styl nie tylko oszczędza tokeny, ale faktycznie jest łatwiejszy do przetworzenia wzrokiem. Nie muszę czytać „I'd recommend...", wiem, że model rekomenduje to, co napisał.

Po drugie, **caveman przegrywa przy planach i długich wyjaśnieniach**. Kiedy pytasz model o ocenę architektury albo o plan implementacji feature'u w kilku krokach, jego odpowiedź po caveman'ie staje się zbiorem pojedynczych zdań, które trzeba samemu zszywać w ciągłą narrację. Oszczędzasz tokeny, ale tracisz czytelność, a cenne niuanse („to zadziała, ale uwaga na X w Y") zaczynają być trudne do odróżnienia od reszty. Tu zdecydowanie lepiej sprawdza się tryb `lite` albo pełne wyłączenie.

Po trzecie — i to najciekawsze — **caveman zmienia sposób, w jaki sam piszę prompt**. Zacząłem formułować pytania krócej, bo wiedziałem, że odpowiedź będzie krótka, więc nie ma sensu ozdabiać pytania. Po tygodniu okazało się, że ta zmiana utrwaliła się nawet wtedy, gdy caveman był wyłączony. Mniej miałem frustracji z „model nie zrozumiał, o co mi chodziło", bo sam się zmusiłem do precyzji na wejściu. Nie umiem tego zmierzyć, ale podejrzewam, że to jest realnie większy zysk niż sama oszczędność na tokenach.

## Kiedy NIE używać

Traktowanie pluginu jak złotego młotka byłoby pomyłką. Jest co najmniej kilka zastosowań, w których caveman jest wręcz szkodliwy.

- **Pair programming z juniorem.** Model mówiący „new object ref each render, useMemo" w rozmowie z osobą, która dopiero poznaje React, jest kontrproduktywny. Junior nie potrzebuje odpowiedzi skompresowanej, tylko *wytłumaczonej*. Dla niego wyłączam caveman na starcie sesji.
- **Generowanie treści dla ludzi spoza zespołu.** Ten wpis, który właśnie czytasz, jest pisany w trybie `stop caveman` w Claude Code — bo artykuł w cavemanie brzmiałby jak notatka z hackathonu. To samo dotyczy dokumentacji klienta, ogłoszeń release notes, wiadomości do stakeholderów.
- **Sytuacje, w których ton komunikatu niesie informację.** Incident response, eskalacja, ostrożna rekomendacja („nie wiem, czy to zadziała, ale spróbujmy") — tu hedging jest funkcją, nie balastem. Caveman by go wyciął i zmienił znaczenie komunikatu.
- **Szkolenia i nagrywanie kursów.** Materiał do nauki potrzebuje rytmu i powtórzeń. Caveman niszczy jedno i drugie.

Mówiąc krócej: im większa rola komunikacji między-ludzkiej w zadaniu, tym mniej caveman pasuje. Im bardziej zadanie jest techniczne i powtarzalne — tym bardziej tak.

## Jak to się składa z resztą

W [skali Holaka](/pl/blog/skala-holaka) caveman siedzi dokładnie w warstwie siódmej: skille i bazy wiedzy, które modyfikują domyślne zachowanie modelu pod konkretny kontekst użytkownika. To nie jest narzędzie „zamiast" — to narzędzie „warstwa". Dobrze współgra z innymi skillami i z plikami kontekstowymi projektu. W moim setupie caveman jest włączony globalnie, ale projekty, które mają `CLAUDE.md` z instrukcją „respond in normal prose for blog content", skutecznie go wyciszają dla odpowiedniej sesji. Tak powinno to działać — narzędzie do kompresji nie powinno walczyć z narzędziem do kontekstu.

## Wnioski — czy warto

Caveman to nie jest „must have". To jest „warto spróbować", pod warunkiem, że spełniasz dwa kryteria.

Po pierwsze, generujesz wystarczająco dużo wywołań LLM, żeby 70% oszczędności tokenów output miało realny wpływ na rachunek albo na latencję. Jeśli pracujesz z Claude Code dorywczo — oszczędność będzie kosmetyczna.

Po drugie, jesteś gotów świadomie przełączać tryby zamiast zostawić plugin włączony na sztywno. Caveman bez samokontroli to generowanie niezrozumiałych wypowiedzi w nieodpowiednich kontekstach — co ostatecznie zmarnuje więcej czasu niż zaoszczędziło tokenów.

Największą wartością, poza oszczędnościami, jest dla mnie jednak to, że caveman **nazwał problem**, który wcześniej tylko czułem. Gadatliwość modelu to nie jest cecha, to jest domyślne ustawienie — wynik decyzji projektowej Anthropic o tonie komunikacji. Caveman pokazuje, że można to zmienić jedną flagą, że substancja techniczna nie ginie, i że wybór między „uprzejmym" a „funkcjonalnym" modelem jest wyborem użytkownika, nie dostawcy.

Jeżeli chcesz sam zobaczyć, jak to wygląda: zainstaluj plugin, popracuj z nim tydzień, a potem wyłącz. Zobaczysz, że wracasz do znacznie gadatliwszego świata, niż pamiętałeś. I wtedy będziesz wiedział, ile ten plugin naprawdę Ci daje.
