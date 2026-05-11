---
title: "Context7 — MCP, który daje modelowi aktualną dokumentację zamiast stanu sprzed pół roku"
description: "Jak jeden mały MCP rozwiązuje największy problem pracy z LLM przy kodzie: przestarzałą wiedzę modelu o bibliotekach. Setup, realne przypadki, ograniczenia."
date: 2026-05-05
tags: ["ai", "mcp", "claude-code", "dokumentacja", "tooling"]
lang: pl
readingTime: 11
author: GH
---

Dwa tygodnie temu migrowałem ten blog z Astro 5 na Astro 6. Claude Code miał znać Astro — i owszem, znał. Tylko że znał wersję 5. Kod, który zaproponował, był technicznie poprawny, składnia działała, komendy się wykonywały, ale w kilku miejscach używał API, które w szóstce zostało przepisane. Content collections, renderowanie Markdown, konfiguracja `astro.config.mjs` — wszędzie drobne, ale kosztowne różnice. Godzinę później, po trzech cyklach „napisz, zepsuj, popraw", w końcu udało się dobić migrację. Większość tego czasu zniknęła na walkę z wiedzą modelu, która była o pół roku przeterminowana.

Ten problem nie jest szczególnie mój. Każdy, kto używa LLM do pracy z kodem, zna to uczucie: model pewnie sugeruje rozwiązanie na API, którego już nie ma, albo proponuje składnię z wersji, której Ty nie używasz. To nie jest bug — to naturalne ograniczenie training data cutoff. Pytanie brzmi: co z tym zrobić?

Odpowiedzi było dotąd kilka i żadna nie była zadowalająca. Można kopiować fragmenty docs ręcznie do promptu — to działa, ale jest mozolne. Można używać web search — i tu zaczyna się prawdziwy problem, o którym za chwilę. Można trzymać kontekst projektowy w `CLAUDE.md` — ale to rozwiązanie dla wiedzy *własnej*, nie dla dokumentacji cudzych bibliotek. Brakowało czegoś pośredniego: toola, który daje modelowi dostęp do *aktualnej, oficjalnej* dokumentacji konkretnej wersji biblioteki, na żądanie.

Tym czymś okazał się `context7` — MCP server od Upstash, o którym opowiem w tym wpisie.

## Dlaczego web search nie wystarcza

Naturalne pierwsze pytanie brzmi: „A po co jeszcze jeden tool? Przecież Claude ma web search". Ma, i faktycznie to pomaga — ale tylko w części przypadków.

Web search daje modelowi odpowiedź w formie listy linków, które potem trzeba otworzyć i przeczytać. Problem w tym, że wyniki wyszukiwania dla „React useEffect" zawierają:

- Oficjalną dokumentację (dobrą, ale często w złej wersji — web search nie czyta z rozpoznaniem wersji projektu).
- Stack Overflow z 2019 roku, który pokazuje pattern już dawno nieaktualny.
- Medium-artykuły autogenerowane z AI, które powtarzają stare założenia z training data.
- Tutoriale YouTube, które w formie transkryptu są bez sensu jako wejście do LLM.
- Ostatnio — coraz więcej content farms publikujących AI-slop na każdy popularny termin.

Model musi z tego wszystkiego wyłuskać to, co faktycznie obowiązuje w wersji, której używasz. Robi to z różnym skutkiem. Realnie: w 60% przypadków dostaję coś sensownego, w 40% dostaję odpowiedź, która mogła równie dobrze pochodzić z wiedzy modelu bez web searcha — czyli właśnie tę przestarzałą.

Dokumentacja oficjalna w formie web search jest też zbyt duża. `reactjs.org/docs` to setki stron. Model musi sam wybrać, co przeczytać, i często trafia na stronę v19 zamiast v20, bo ta pierwsza ma większy link juice. W efekcie dostaje wycinkę, która już nie obowiązuje.

Potrzebowałem czegoś, co działa inaczej: wchodzi bezpośrednio do repozytorium źródłowego biblioteki, czyta dokumentację **w tej konkretnej wersji, której używam**, i zwraca modelowi tylko tę odpowiedź. Bez szumu, bez AI-slopu, bez pomyłek wersjonowania.

## Co robi context7

Context7 to MCP server stworzony przez Upstash. Technicznie to proces `npx @upstash/context7-mcp`, który Claude Code odpala przy starcie i z którym model rozmawia przez protokół MCP. Udostępnia dwa toole:

- **`resolve-library-id`** — przyjmuje nazwę biblioteki („astro", „react", „prisma", „django") i zwraca kanoniczny identyfikator używany wewnątrz serwera. To krok de-ambiguizujący: biblioteka „next" może oznaczać Next.js albo pakiet npm o tej nazwie.
- **`query-docs`** — przyjmuje identyfikator biblioteki, wersję i pytanie, zwraca fragmenty oficjalnej dokumentacji + przykłady kodu.

Flow wygląda tak: pytam Claude'a o sposób konfiguracji content collections w Astro 6. Model woła `resolve-library-id("astro")`, dostaje kanoniczny id. Potem woła `query-docs(id, "6", "content collections configuration")`. W odpowiedzi dostaje fragment oficjalnych docs Astro 6 — ten fragment wchodzi do kontekstu modelu, który generuje odpowiedź. Cała rozmowa z MCP dzieje się pod maską; ja widzę tylko finalną odpowiedź, która tym razem używa prawidłowego API.

Serwer jest hostowany przez Upstash, nie ma klucza API, użycie jest darmowe. Indeks pokrywa większość popularnych bibliotek: React, Next.js, Vue, Svelte, Angular, Astro, Prisma, Django, Flask, FastAPI, Spring Boot, Express, Tailwind, shadcn/ui, Laravel, Rails, Go, Rust, setki innych. Indeksacja idzie z oficjalnych repozytoriów, więc dostajesz to, co autorzy napisali i zmerżowali do main — a nie to, co ktoś napisał na Medium trzy lata temu.

## Setup w Claude Code

Trzy sposoby instalacji, w kolejności łatwości:

**1) Przez marketplace** (najprościej):

```bash
claude plugin install context7@claude-plugins-official
```

**2) Ręcznie w `.mcp.json`** projektu:

```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"]
  }
}
```

**3) Globalnie w `~/.claude/mcp.json`** — to samo co wyżej, tylko widoczne we wszystkich projektach.

Po instalacji Claude Code widzi nowe toole: `mcp__context7__resolve-library-id` i `mcp__context7__query-docs`. Co ważne, MCP jako taki dostarcza też instrukcję dla modelu — wtyczka przychodzi z wbudowanym opisem, w którym konkretnie zapisano, kiedy model powinien sięgnąć po te toole:

> Use this server to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service — even well-known ones like React, Next.js, Prisma, Express, Tailwind, Django, or Spring Boot. (...) Use even when you think you know the answer — your training data may not reflect recent changes.

To zdanie — „even when you think you know the answer" — jest kluczowe. Bez niego model wołałby context7 tylko wtedy, gdy sam sobie nie radzi. A to znaczy: dopiero wtedy, gdy już popełnił błąd albo jest niepewny. Instrukcja w MCP mówi modelowi: „woła *zanim* uznasz, że wiesz". To zmienia default-mode z „używaj wiedzy własnej, web search w razie potrzeby" na „używaj context7 dla każdej biblioteki, wiedza własna jako fallback".

## Kiedy używać

Oficjalne wytyczne context7 mówią: dla pytań o biblioteki, frameworki, SDK, API, narzędzia CLI i usługi chmurowe, **nawet dla dobrze znanych**. Obejmuje to składnię API, konfigurację, migracje między wersjami, debugowanie specyficzne dla biblioteki, instrukcje setupu i użycie CLI.

Nie używaj dla: refactoringu, pisania skryptów od zera, debugowania logiki biznesowej, code review, ogólnych koncepcji programistycznych. To rzeczy, w których dokumentacja zewnętrzna nic nie pomoże.

W moim użyciu context7 najwięcej daje w trzech rolach.

Po pierwsze, **migracje między wersjami**. Ekran z ogłoszeniem „React 19 released" na stronie domowej to jedno; różnice w API, breaking changes, nowe hooki — to drugie. Model z context7 dostaje te różnice na tacy, zamiast zgadywać. Na moim projekcie migracja Astro zajęła kolejnym razem 20 minut zamiast godziny.

Po drugie, **biblioteki z szybkim cyklem zmian**. Shadcn/ui, Playwright, nowsze wersje Tailwind — wszystko, co ma releases co tydzień, a training data modelu jest sprzed pół roku. Context7 zwraca aktualną sygnaturę komponentu, aktualną składnię selectorów, aktualne nazwy CLI command.

Po trzecie, **rzadko używane fragmenty API**. Model zna `useState` i `useEffect` na pamięć. Ale już `useInsertionEffect` albo niszowy hook z React Query 5, któremu autorzy zmienili nazwę przy releasie, dostaje z training data w wersji sprzed zmiany. Context7 daje aktualne.

## Gdzie context7 zawodzi

Idealne narzędzie nie istnieje. Context7 ma kilka realnych ograniczeń, które warto znać, zanim wdrożysz go jako default.

- **Biblioteki poza indeksem.** Mały pakiet npm z 50 gwiazdkami może nie być w bazie. Wtedy `resolve-library-id` zwraca pustkę i model wraca do web search albo training data.
- **Wewnętrzne SDK firmy.** Dla tego context7 jest bezużyteczny — nie ma dostępu do Twojego Githuba. Tu potrzebujesz własnego MCP (pisałem o tym w [pierwszym MCP dla QA](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/)).
- **Docs niezindeksowane lub w osobliwych formatach.** Biblioteki, które trzymają dokumentację tylko w wiki, w PDF-ach, albo jako komentarze doctest w kodzie — context7 może ich nie objąć.
- **Świeżo wydane wersje.** Indeks ma jakieś opóźnienie względem release-a. Dla biblioteki, która wyszła wczoraj, context7 może jeszcze nie mieć najnowszej wersji.
- **Niespójność między docs a kodem.** Jeśli dokumentacja biblioteki jest sama w sobie nieaktualna (zdarza się), context7 zwróci Ci nieaktualne informacje. Garbage in, garbage out.

W moim workflow w przypadku, kiedy context7 zwraca coś dziwnego, mam prosty fallback: pytam modelu, żeby zweryfikował sugestię patrząc na `package.json` projektu (czyli jaką wersję naprawdę mam) i potem na oficjalny GitHub release notes przez web search. Trzy źródła, jedna decyzja.

## Jak to się składa z resztą stacka

Context7 to nie jest narzędzie „zamiast" — tak jak w przypadku większości MCP, jego siła polega na tym, gdzie pasuje w warstwach.

Wyobraź sobie zadanie: „dodaj nowy endpoint API w projekcie, zgodnie z konwencjami, używając aktualnego API FastAPI". Trzy źródła wiedzy, które model musi pogodzić:

- **Konwencje projektowe** — w `CLAUDE.md` („każdy endpoint ma test, każdy model Pydantica jest w `models/`, dla auth używamy `deps/auth.py`").
- **Proces pracy** — w skillu („najpierw test, potem implementacja, potem sprawdzenie coverage").
- **Aktualne API biblioteki** — w context7 („jak się używa `Depends` w FastAPI 0.115? Czy `BackgroundTasks` się zmieniło?").

Każde z tych trzech źródeł wypełnia inną lukę. `CLAUDE.md` mówi *jak my*. Skill mówi *w jakiej kolejności*. Context7 mówi *z jakim API*. Żadne z nich samo nie wystarczy. Razem — czyli jak to często widzimy w dobrych setupach Claude Code — dają pracę, która nie tylko działa, ale pasuje do projektu i używa aktualnej składni.

Jeżeli szukasz szerszego obrazu, gdzie to wszystko siedzi, opisałem to w [skali Holaka](/pl/blog/skala-holaka/) — context7 mieszka w warstwie 8 („narzędzia i MCP"), a nie w warstwie 7 („skille"). Różnica jest istotna: skill modyfikuje zachowanie modelu, MCP daje mu dostęp do źródła.

## Wnioski — default on

Dla context7 wniosek jest wyjątkowo prosty, a to rzadkość. Trzy linijki w `.mcp.json`, brak klucza API, brak kosztów, brak konfiguracji per projekt. Dla każdego, kto używa Claude Code do pracy z kodem, domyślne włączenie daje konkretne korzyści:

- Mniej halucynacji API, bo model dostaje aktualne źródło.
- Mniej cykli „napisz-popraw-napisz", bo dokumentacja w kontekście modelu jest kompletna.
- Krótsze migracje i szybszy onboarding w nowych bibliotekach.
- Mniej przestojów przy niszowych, rzadko używanych API.

W moim setupie context7 jest włączony globalnie od około miesiąca. Nie było sytuacji, w której musiałem go wyłączyć, bo przeszkadzał. Był szereg sytuacji, w których gdyby nie on, zmarnowałbym pół godziny na walkę z przestarzałą wiedzą modelu.

Jest tylko jedna rzecz, o której warto pamiętać: context7 nie czyta w Twojej głowie. Nadal musisz wiedzieć, że używasz Astro 6, nie 5; że FastAPI to 0.115, nie 0.104. W idealnym świecie Claude Code mógłby sam sprawdzać `package.json`/`requirements.txt` i przekazywać wersję do context7. W rzeczywistości często trzeba to powiedzieć w prompcie: „używam React 19, sprawdź context7". Gdy ten jeden szczegół wejdzie w nawyk, context7 zaczyna pracować w tle bez Twojego zaangażowania. A to jest chyba najlepsza rekomendacja, jaką można dać narzędziu programistycznemu.
