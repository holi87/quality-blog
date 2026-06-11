---
title: "Hooki w Claude Code - deterministyczna warstwa, której agentowi nie wolno ominąć"
description: "Czym są hooki w Claude Code, jak działa blokowanie akcji kodem wyjścia 2 i cztery praktyczne przykłady: blokada commitów bez testów, lint po edycji, strażnik sekretów i kontekst na start sesji."
date: 2026-07-09
tags: ["ai", "claude-code", "hooki", "automatyzacja", "bezpieczenstwo"]
lang: pl
readingTime: 9
author: GH
---

Skill agent może pominąć, instrukcję z CLAUDE.md potrafi zgubić w czterdziestym kroku sesji, a z serwera MCP korzysta wtedy, kiedy sam uzna to za sensowne. Hook działa inaczej: to mechaniczna bramka uruchamiana przez środowisko przed albo po akcji narzędzia, której model nie może przegadać ani zignorować. Po wpisach o MCP, skillach i subagentach ten tekst domyka układankę warstwą deterministyczną.

## Prośba kontra bramka

Wszystko, co do tej pory opisywałem na blogu - prompty, skille, serwery MCP, subagenci - ma jedną wspólną cechę: o użyciu decyduje model. Możesz napisać w CLAUDE.md wielkimi literami "ZAWSZE uruchamiaj testy przed commitem" i przez dwadzieścia sesji będzie działać. W dwudziestej pierwszej agent będzie miał długi kontekst, instrukcja rozmyje się wśród trzystu innych linii i commit pójdzie bez testów. Nie dlatego, że model jest złośliwy. Dlatego, że instrukcja w promptcie to statystyczna sugestia, nie twarda reguła.

Hook odwraca tę relację. To skrypt albo polecenie powłoki, które środowisko agenta uruchamia samo, w ściśle określonym momencie cyklu pracy: przed wywołaniem narzędzia, po nim, na starcie sesji, przy zakończeniu odpowiedzi. Model nie wie, że hook istnieje, dopóki ten go nie zablokuje. Nie może go pominąć, bo nie on go wywołuje.

U mnie ta różnica przekłada się na prostą zasadę projektową: wszystko, co jest polityką zespołu albo zasadą bezpieczeństwa, idzie do hooka. Wszystko, co jest wiedzą i sposobem pracy, idzie do skilli i CLAUDE.md. Polityka musi być deterministyczna. Wiedza może być probabilistyczna.

## Cztery typy hooków, które realnie się przydają

Claude Code ma kilka punktów zaczepienia, ale w praktyce 90% wartości dają cztery:

- **PreToolUse** - uruchamiany zanim agent wykona narzędzie. Dostaje na wejściu opis planowanej akcji (nazwę narzędzia i jego parametry) i może ją zablokować. To jest miejsce na bramki: "tej komendy nie wykonasz", "tego pliku nie ruszysz".
- **PostToolUse** - uruchamiany po wykonaniu narzędzia. Akcja już się wydarzyła, więc nie zablokuje, ale może posprzątać: sformatować zapisany plik, uruchomić lint, dopisać wpis do logu audytowego.
- **Stop** - uruchamiany, gdy agent uznaje, że skończył odpowiedź. Idealny moment na kontrolę jakości całości: czy testy przechodzą, czy w drzewie roboczym nie zostały niezacommitowane pliki, czy agent nie zostawił TODO w kodzie.
- **SessionStart** - uruchamiany na początku sesji. Nie blokuje niczego, za to wstrzykuje kontekst: aktualny stan gałęzi, listę otwartych zgłoszeń, przypomnienie konwencji. Tańsza i pewniejsza alternatywa dla wklejania tego samego ręcznie.

Konfiguracja mieszka w pliku `settings.json` (w repo: `.claude/settings.json`, globalnie: `~/.claude/settings.json`). Każdy hook to para: wzorzec dopasowania narzędzia plus polecenie do uruchomienia. Hook w repo wersjonuje się razem z kodem, więc cały zespół dostaje te same bramki po zwykłym `git pull`.

## Kod wyjścia jako mechanizm blokady

Cała siła hooków siedzi w jednym, bardzo uniksowym mechanizmie: kodzie wyjścia (exit code) skryptu. Hook dostaje na standardowe wejście JSON z opisem akcji i kończy się jednym z trzech wyników:

- **Kod 0** - przepuść. Akcja idzie dalej, agent niczego nie zauważa.
- **Kod 2** - zablokuj. Akcja nie zostaje wykonana, a to, co skrypt wypisał na standardowe wyjście błędów, wraca do agenta jako informacja zwrotna. Model czyta powód blokady i koryguje plan.
- **Inny kod** - błąd niefatalny. Środowisko pokaże ostrzeżenie, ale akcji nie zatrzyma.

Ten drugi punkt jest kluczowy i często niedoceniany. Blokada nie jest ślepą ścianą - to komunikat. Jeśli skrypt wypisze "commit zablokowany: testy nie były uruchomione w tej sesji, odpal najpierw npm test", agent w następnym kroku zrobi dokładnie to. Dobrze napisany hook nie tylko pilnuje reguły, ale uczy model, jak ją spełnić.

> Prompt to prośba, skill to oferta, MCP to możliwość. Hook to jedyna warstwa, w której słowo "zawsze" znaczy zawsze.

## Przykład 1: blokada commitów bez testów

Klasyka i mój pierwszy hook w każdym repo. PreToolUse dopasowany do narzędzia Bash sprawdza, czy planowana komenda to `git commit`, a jeśli tak - czy w tej sesji istnieje świeży znacznik udanego przebiegu testów (u mnie: plik `.claude/.tests-passed`, który zapisuje osobny hook PostToolUse po zielonym `npm test`, ze znacznikiem czasu nie starszym niż 15 minut).

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": ".claude/hooks/pilnuj-commitow.sh" }
        ]
      }
    ]
  }
}
```

Sam skrypt to kilkanaście linii: wczytaj JSON, wyciągnij komendę przez `jq`, jeśli nie zawiera `git commit` - zakończ kodem 0. Jeśli zawiera, a znacznika nie ma albo jest stary - wypisz powód na wyjście błędów i zakończ kodem 2. Od wdrożenia tej bramki liczba "poprawkowych" commitów po nieudanym wdrożeniu spadła u mnie praktycznie do zera, bo zniknęła cała klasa sytuacji "agent był pewny, że nic nie zepsuł".

## Przykład 2: automatyczny lint po każdej edycji

PostToolUse dopasowany do narzędzi Edit i Write. Po każdym zapisie pliku hook wyciąga ścieżkę z JSON-a i przepuszcza plik przez linter z automatyczną poprawką:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx eslint --fix" }
        ]
      }
    ]
  }
}
```

Efekt: agent nigdy nie zostawia pliku w stanie łamiącym styl, niezależnie od tego, czy "pamiętał" o konwencjach. To samo podejście działa dla `prettier`, `black`, `gofmt` - cokolwiek formatuje deterministycznie. Ważny niuans: hook po edycji nie powinien trwać dłużej niż 2-3 sekundy, bo płacisz nim przy każdym zapisie. Pełny lint całego projektu zostaw dla hooka Stop, który odpala się raz na odpowiedź.

## Przykład 3: strażnik sekretów

Trzeci hook, który traktuję jako obowiązkowy w pracy z klienckim kodem: PreToolUse na narzędziach Read i Bash, który blokuje dostęp do plików z poświadczeniami. Lista wzorców jest krótka i jawna: `.env`, `*.pem`, `id_rsa`, katalogi `secrets/`. Jeśli ścieżka w parametrach narzędzia pasuje do wzorca - kod 2 i komunikat "ten plik zawiera sekrety, użyj zmiennych środowiskowych z przykładu .env.example".

Czy agent "chciałby" czytać sekrety? Zwykle nie. Ale wystarczy jedna sesja debugowania, w której model uzna, że najszybszą drogą do diagnozy jest podejrzenie konfiguracji, i klucz produkcyjny ląduje w historii rozmowy, a stamtąd potencjalnie w logach. Hook zamyka tę furtkę mechanicznie. Koszt wdrożenia: pół godziny. Koszt incydentu z wyciekiem klucza: rotacja wszystkich poświadczeń i bardzo nieprzyjemna rozmowa.

## Przykład 4: kontekst na dzień dobry

SessionStart to jedyny z czwórki, który nie pilnuje, tylko dokarmia. Mój hook na starcie sesji wypisuje trzy rzeczy: aktualną gałąź z liczbą commitów względem głównej, listę zmodyfikowanych plików z `git status` i jedną linię przypomnienia o konwencji commitów. To trafia do kontekstu agenta zanim padnie pierwsze polecenie. Brzmi banalnie, ale eliminuje całą klasę błędów "agent myślał, że jest na master" - a takie błędy widziałem w zespołach częściej, niż wypada przyznać.

## Kiedy hook, kiedy skill, kiedy MCP

Po wpisach o wszystkich trzech warstwach mogę je wreszcie zestawić w jednym miejscu:

| Pytanie | Hook | Skill / prompt | MCP |
|---|---|---|---|
| Kto decyduje o uruchomieniu | środowisko, zawsze | model, według uznania | model, według uznania |
| Czy agent może pominąć | nie | tak | tak |
| Do czego służy | polityki, blokady, audyt | wiedza, sposób pracy | dostęp do zewnętrznych systemów |
| Koszt pomyłki przy braku | incydent | gorsza jakość | ręczna robota |
| Typowy czas wdrożenia | 0,5-2 godziny | 15-60 minut | 2-6 godzin |

Praktyczna heurystyka: jeśli na pytanie "co się stanie, gdy agent tego nie zrobi?" odpowiadasz "będzie incydent, wyciek albo wstyd na produkcji" - to jest hook. Jeśli odpowiadasz "wynik będzie słabszy i ktoś go poprawi na przeglądzie kodu" - wystarczy skill albo wpis w CLAUDE.md. Jeśli problemem jest dostęp do danych, których agent nie ma - to temat na MCP, nie na hook.

## Czego hookami nie robić

Dwa antywzorce, które już widziałem w terenie. Pierwszy: hook jako mikrozarządzanie. Zespół dodał dwanaście bramek PreToolUse i agent w połowie sesji utykał w pętli blokad, a ludzie zaczęli pracować obok niego. Bramki rezerwuj dla spraw, których koszt naruszenia jest realny - u mnie limit to 4-5 hooków blokujących na repo. Drugi: logika biznesowa w hooku. Hook ma pilnować i sprzątać, nie podejmować decyzji merytorycznych. Jeśli skrypt hooka przekracza 50 linii, to zwykle znak, że próbujesz nim zastąpić coś, co powinno być testem, lintem w CI albo zwykłym skryptem.

I jedna rzecz, o której łatwo zapomnieć: hooki uruchamiają kod na twojej maszynie z twoimi uprawnieniami. Hook z repo, które właśnie sklonowałeś z internetu, zasługuje na przegląd dokładnie tak samo jak każdy inny obcy skrypt. Zanim zaufasz cudzemu `settings.json`, przeczytaj, co odpala.

## Podsumowanie

Hooki to deterministyczna warstwa pracy z agentem: środowisko uruchamia je samo, a kod wyjścia 2 pozwala mechanicznie zablokować akcję i jednocześnie podpowiedzieć modelowi, jak spełnić regułę. Cztery typy pokrywają większość potrzeb - PreToolUse do bramek, PostToolUse do sprzątania, Stop do kontroli końcowej, SessionStart do dokarmiania kontekstem. Zacznij od trzech klasyków: blokady commitów bez testów, lintu po edycji i strażnika sekretów. Polityka do hooka, wiedza do skilla, integracje do MCP - i nie więcej niż kilka bramek na repo, żeby agent dalej miał czym oddychać. Jeden wieczór konfiguracji zwraca się przy pierwszym zablokowanym wypadku.
