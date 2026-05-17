---
title: "Claude i Codex: CLI vs desktop vs web - gdzie naprawdę dowozisz robotę"
description: "Trzy kanały dostępu do tych samych modeli różnią się tym, co potrafią dotknąć. Praktyczne porównanie Claude Code i Codex CLI z aplikacjami desktop oraz interfejsami web."
date: 2026-05-20
tags: ["ai", "claude-code", "codex", "narzedzia", "workflow"]
lang: pl
readingTime: 12
author: GH
---

Anthropic i OpenAI udostępniają te same modele w trzech kanałach: linii poleceń, aplikacji desktop oraz przez przeglądarkę. Z punktu widzenia jakości odpowiedzi różnica jest niewielka - silnik jest ten sam. Z punktu widzenia tego, **co naprawdę można zrobić w jednej sesji**, różnica jest fundamentalna. Web odpowiada na pytania, desktop pomaga myśleć, CLI dowozi kod.

Ten wpis to neutralny przegląd kanałów dostępu dla Claude i Codex, ułożony tak, żebyś wiedział, gdzie warto zainwestować pierwszą godzinę konfiguracji, a gdzie wystarczy zalogować się przez przeglądarkę.

## TL;DR

- **Web** (`claude.ai`, `chatgpt.com`): zero instalacji, share linki, mobilność, projekty z plikami referencyjnymi. Brak realnego dostępu do twojego systemu plików, brak automatyzacji, brak własnych narzędzi.
- **Desktop** (Claude Desktop, ChatGPT Desktop): te same modele co web plus lokalny MCP, drag-and-drop plików z dysku, skróty systemowe, artefakty/canvas. Świetne do rozmowy z plikami z dysku bez wystawiania ich do CI.
- **CLI** (Claude Code, Codex CLI): pełen dostęp do file systemu, git, bash, hooków, subagentów, własnych skilli, MCP-serwerów, worktree i tasków w tle. To jest narzędzie do dowożenia kodu, nie tylko do rozmowy.

Jeżeli kupujesz tylko jeden plan i tylko jedno narzędzie do pracy z kodem, kup CLI. Jeżeli kupujesz pakiet do pracy mieszanej, weź CLI plus desktop, a web traktuj jako bonus.

## Co naprawdę dostajesz w każdym kanale

### Web

Web to najprostsza forma kontaktu z modelem. Logujesz się przez przeglądarkę, masz okno czatu, możesz wkleić plik tekstowy lub obraz, możesz utworzyć projekt z plikami referencyjnymi i instrukcją systemową, możesz udostępnić rozmowę linkiem. To bardzo dużo, dopóki nie spróbujesz zrobić czegoś, co wymaga dotknięcia twojego komputera.

W web nie ma `read_file('/Users/ty/repo/src/...')`. Nie ma `git diff`. Nie ma uruchomienia twojego skryptu, nie ma cron joba, nie ma własnego MCP serwera spinającego się z lokalną bazą. Możesz wkleić zawartość pliku albo wrzucić ZIP, ale to ty jesteś łyżką, która nosi kontekst tam i z powrotem.

Wbudowane narzędzia (web search, generowanie obrazów, code interpreter w sandboxie) są dostępne, ale nie wychodzą poza chmurę dostawcy.

### Desktop

Desktop dla Claude i ChatGPT to nakładka na te same modele co web plus parę różnic, które okazują się ważne, gdy zaczyna się pracować na poważnie.

Po pierwsze: integracja z systemem operacyjnym. Globalny skrót klawiszowy odpalający szybkie pytanie z dowolnego miejsca w macOS lub Windows, drag-and-drop pliku z Findera, kopiowanie zrzutów ekranu prosto do rozmowy. Drobiazg, ale liczy się w godzinach pracy.

Po drugie - i to jest najważniejsze - Claude Desktop obsługuje lokalne serwery MCP (Model Context Protocol). Możesz skonfigurować serwery, które dają modelowi dostęp do twojego file systemu, kalendarza, iMessage, Apple Notes, Spotify, lokalnej bazy danych. Wszystko bez wystawiania niczego do internetu. Web tego nie ma - MCP w web jest ograniczony do remote MCP serwerów udostępnianych przez Anthropic lub trzecie strony przez HTTPS.

Po trzecie: artefakty i canvas - interaktywne podglądy generowanego HTML, dokumentów, kodu, z możliwością iterowania w miejscu. Web też to ma, ale na desktopie integruje się to lepiej z resztą OS-a.

### CLI

CLI to inna kategoria narzędzia. Claude Code i Codex CLI nie są opakowaniem na czat - są agentami, które żyją w twoim terminalu i mają faktyczny dostęp do twojego repozytorium.

Co dostajesz po instalacji:

- **Pełen file system access** w katalogu, w którym uruchamiasz CLI. Model czyta i edytuje pliki, tworzy nowe, kasuje stare - wszystko z permission system, który możesz dostroić.
- **Bash**. Model uruchamia komendy w twoim shellu (z whitelistą i promptami uprawnień), widzi output, reaguje na błędy.
- **Git workflow first-class**. Atomic commits, branchowanie, worktree do izolacji równoległej pracy, PR-y.
- **Hooks** - eventy w cyklu życia sesji (UserPromptSubmit, PreToolUse, SessionStart), które pozwalają wstrzykiwać własną logikę, walidacje, kontekst.
- **Subagenci** - wyspecjalizowane podagent y do długich research-tasków, code review, debugowania, które mają własne narzędzia i własne okno kontekstu.
- **Skills** - wielokrotnego użytku „rolki" w formacie markdown, które model może sobie zaprosić do sesji, gdy temat pasuje.
- **MCP serwery** w wariancie stdio i HTTP, dokładnie tak samo jak na desktopie.
- **Background jobs / tasks** - uruchamiasz długi build albo agenta robiącego research jako proces w tle, nie blokujesz głównej sesji.
- **Tryb worktree** - agent pracuje w odizolowanej kopii repo, nie ruszając twojego głównego working tree.

Codex CLI ma analogiczny zestaw, z innym layoutem konfiguracji (`~/.codex/`) i własnym sandboxem do wykonywania komend. Modele za CLI to oczywiście modele OpenAI (GPT-5.4, gpt-oss w trybie offline, w zależności od konfiguracji).

## Macierz decyzyjna

| Aspekt                      | Web                  | Desktop              | CLI                  |
| --------------------------- | -------------------- | -------------------- | -------------------- |
| Edycja plików w repo        | nie (kopiuj-wklej)   | ograniczona przez MCP| tak, natywnie        |
| Git workflow                | nie                  | przez MCP            | tak, first-class     |
| Uruchamianie poleceń shellu | nie                  | przez MCP            | tak, natywnie        |
| Lokalny MCP                 | nie                  | tak                  | tak                  |
| Subagenci / skille / hooki  | nie                  | nie (lub minimalnie) | tak                  |
| Automatyzacja / cron        | nie                  | nie                  | tak                  |
| Share linkiem               | tak                  | nie                  | nie                  |
| Mobilność (telefon)         | tak                  | nie                  | nie (poza SSH)       |
| Koszt wejścia               | minuta               | 5 minut              | 15–30 minut          |
| Audyt śladu                 | historia w UI        | historia w UI        | logi, git history    |

To uproszczenie - pojawiają się aktualizacje i sytuacja zmienia się szybko - ale ogólny kierunek jest stabilny od miesięcy.

## Kiedy każdy kanał wygrywa

### Web wygrywa, gdy

- Jesteś na czyjejś maszynie, telefonie, w przeglądarce kioskowej i nie zainstalujesz nic.
- Chcesz wysłać współpracownikowi link do dokładnej rozmowy, którą prowadziłeś.
- Robisz szybki research bez plików - pytanie, odpowiedź, koniec.
- Pokazujesz coś na warsztacie i nie chcesz pokazywać struktury swoich repo.
- Korzystasz z code interpretera w sandboxie do jednorazowej analizy CSV, którą i tak chcesz mieć w chmurze.

### Desktop wygrywa, gdy

- Pracujesz dużo z plikami z dysku, ale nie chcesz ich wystawiać do CI ani do remote MCP.
- Chcesz mieć globalny skrót na szybkie pytanie z dowolnej aplikacji.
- Iterujesz nad artefaktem (HTML, dokument, slajd) i potrzebujesz wizualnego podglądu w trakcie rozmowy.
- Spinasz model z lokalnymi narzędziami osobistymi: kalendarz, notatki, wiadomości, Spotify, lokalna baza.
- Chcesz mieć rozmowę długoterminową w jednym wątku z plikami projektowymi, ale bez ryzyka, że agent zacznie ci edytować repo, bo jeszcze nie jest do tego gotowy.

### CLI wygrywa, gdy

- Robisz cokolwiek na poziomie kodu w istniejącym repo - refactor, fix, dodanie feature'a, migracje, testy.
- Chcesz atomic commits z wiadomościami pisanymi z kontekstem zmiany.
- Pracujesz nad kilkoma branchami równolegle (worktree).
- Automatyzujesz powtarzalne operacje hookami - np. uruchamianie lintera po każdej edycji.
- Budujesz własne narzędzia (MCP serwery, skille, subagenci), które chcesz wdrożyć na zespół.
- Operujesz na dużych logach, outputach buildów, dumpach baz danych - i nie chcesz ładować tego do okna czatu.
- Potrzebujesz audytu, kto/co zmienił - git history plus logi sesji.

## Hybryda, którą widzę najczęściej u doświadczonych użytkowników

Najsensowniejsza praktyka, jaką obserwuję u osób, które używają obu narzędzi codziennie, to podział zadań po kanałach.

**Eksploracja, brainstorm, plan** - desktop. Wrzucasz pliki, rozmawiasz długo, dochodzisz do planu. Możesz mieć projekt z instrukcją systemową, której nie chcesz powtarzać.

**Wykonanie** - CLI. Bierzesz plan z desktopu, wklejasz w pierwszy prompt sesji CLI, agent wykonuje. Atomic commits, hooks pilnują jakości, subagenci robią równoległe rzeczy w tle.

**Drobne pytania, podgląd, share** - web. Telefon, cudza maszyna, link do współpracownika. Albo szybkie sprawdzenie czegoś w trakcie spotkania.

Ten układ ma jedną dużą zaletę: nie próbujesz zmusić web do roboty CLI ani CLI do roli web. Każdy kanał dostaje to, w czym jest dobry.

## Pułapki, na które warto uważać

**Limity tokenów per plan różnią się między kanałami.** Subskrypcja, którą kupujesz na web/desktop, niekoniecznie pokrywa CLI w tym samym rozmiarze. Sprawdź dokumentację swojego planu zanim założysz, że masz tę samą pulę dostępną wszędzie.

**MCP w web ≠ MCP na desktopie ≠ MCP w CLI.** Konfiguracje są w różnych miejscach (`claude_desktop_config.json` dla desktopu, `.mcp.json` lub user-level dla CLI, remote MCP dla web), z różnymi formatami i różnymi modelami uprawnień. Serwer napisany pod jeden kanał nie zawsze działa w innym bez tweakowania.

**Pliki w web nie persystują tak, jak myślisz.** Pliki w projekcie tak - pliki w pojedynczej rozmowie nie. Sesja kończy się, kontekst znika.

**CLI bez worktree miesza branche.** Jeżeli odpalasz agenta na swoim głównym working tree i każesz mu robić eksperyment, a w międzyczasie sam pracujesz na innym branchu, kończy się to konfliktami. Worktree (`git worktree add` lub wbudowana opcja w Claude Code) rozwiązuje problem.

**Hooki w CLI to obosieczna broń.** Dobrze ustawiony hook oszczędza godziny - źle ustawiony blokuje każde wywołanie modelu i nie wiadomo, dlaczego sesja stoi. Konfiguruj stopniowo, testuj.

**Codex i Claude nie są drop-in replacement.** Mają inne modele, inne formaty konfiguracji, inne sandboxy, inne ekosystemy skilli. Można używać równolegle, ale nie zakładaj, że workflow napisany pod jeden zadziała w drugim bez przerabiania.

## Wnioski

Web, desktop i CLI to nie trzy wersje tego samego produktu - to trzy różne narzędzia o różnym promieniu wpływu na twój system. Web odpowiada na pytania, desktop pomaga myśleć z lokalnymi danymi, CLI faktycznie zmienia twoje repozytorium.

Jeżeli używasz AI tylko do rozmów i kawałków kodu, web wystarczy. Jeżeli zaczynasz spinać model z własnymi danymi i procesami osobistymi, dopisz desktop. Jeżeli chcesz, żeby model dowoził kod w twoim repo z tym samym rygorem co ty, kup CLI i daj sobie godzinę na konfigurację. Inwestycja zwraca się w pierwszym poważnym refaktorze.
