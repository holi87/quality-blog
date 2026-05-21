---
title: "Gdzie skala Holaka zawodzi - autokrytyka"
description: "Każdy model jest narzędziem, nie prawdą. Sześć miejsc, w których skala Holaka realnie zawodzi w pracy z zespołami, plus feedback od czytelników, który warto zaadresować w wersji 3."
date: 2026-06-05
tags: ["ai", "adopcja", "skala-holaka", "autokrytyka"]
lang: pl
readingTime: 6
author:
  - GH
  - KG
---

[Skala Holaka](/pl/blog/skala-holaka/) w wersji v2 miała sekcję *„Gdzie ten model zawodzi"* - cztery punkty, każdy w 2 zdaniach. Po dziesiątkach diagnoz i rozmów z czytelnikami widzimy, że to za mało. Wersja v2.1e zmieniła strukturę skali (12 poziomów, agentic OS na 11), ale autokrytyka dotyczy spraw, które żadna kosmetyczna iteracja nie rozwiązuje - dlatego przenosimy ją do osobnego wpisu.

Ten artykuł rozwija autokrytykę. Bo każdy model jest narzędziem, nie prawdą - a w tej skali są miejsca, w których konsekwentnie myli ludzi.

Piszemy razem, bo każdy z nas widzi inne pęknięcia. Konrad obserwuje zespoły wdrożeniowe, gdzie skala bywa używana jako etykieta. Grzegorz pisał ją oryginalnie i widzi jej granice z perspektywy autora.

## 1. Linearność, której w świecie nie ma

Skala wygląda na liniową: 0 → 1 → 2 → 10. Sugeruje to, że dojrzałość jest scalarem.

W realnych zespołach jest inaczej:

- W kodowaniu inżynier jest na 8.
- W pisaniu maili - na 1 (otwiera czyste okno, jedno pytanie).
- W analizie danych - na 4 (custom instructions dla R/Python, ale brak skilli).
- W obsłudze klienta - na 0 (nie używa AI w ogóle).

Ten sam człowiek. Cztery różne poziomy w cztery różne dni.

**Czego brakuje w skali:** wymiaru zadanie × domena. Wersja 3 będzie miała macierz, nie tylko skalę.

## 2. Nierówna wartość poziomów

Skala traktuje wszystkie kroki tak samo. *„Z 1 na 2"* wygląda jak *„z 9 na 10"*. Wizualnie i strukturalnie.

W praktyce krzywa wartości jest mocno wybrzuszona w pierwszej połowie:

- Skok 1 → 4: 50–70% maksymalnej wartości adopcji. Tania, szybka, dla większości użytkowników wystarczająca.
- Skok 4 → 8: kolejne 25%. Wymaga discipline organizacyjnej, dużo dłuższy.
- Skok 8 → 10: ostatnie 5%. Drogie, ryzykowne, sensowne dla bardzo wąskiej grupy zastosowań.

Dla 90% zespołów **celowanie w 4–5 daje większy ROI** niż celowanie w 10. Tego nie widać w skali.

**Czego brakuje:** mapy wartości / kosztu per skok. Wersja 3 będzie miała tę krzywą jako diagram obok skali.

## 3. Narzędzia się starzeją

Skala opisuje *rodzaj* umiejętności, ale gdy ludzie ją czytają - myślą *tools*. *„Poziom 8 to MCP"* - i już mieli rację w 2025, ale w 2026 to znaczy co innego.

Konkretne starzenie:

- Poziom 5 w 2025 = pisanie `.cursorrules`. W 2026 = AGENTS.md / CLAUDE.md / .cursorrules - trzy formaty, [każdy do innej rzeczy](/pl/blog/agents-md-claude-md-cursorrules-porownanie/).
- Poziom 7 w 2025 = własne skille. W 2026 = plugin marketplace + community-shared skille - inna ekonomia.
- Poziom 8 w 2025 = pierwsze MCP w użyciu. W 2026 = pytanie nie „czy mam MCP" tylko „[czy nie mam za dużo](/pl/blog/mcp-kiedy-warto-kiedy-overengineering/)".
- Poziom 10 w 2025 = autonomous agents demo. W 2026 = sceptyczne pytanie [„czy nie wystarczy jeden agent"](/pl/blog/orkiestracja-wieloagentowa-kiedy-jeden-agent/).

**Czego brakuje:** wersjonowanie skali. Wersja 3 będzie miała datę i listę narzędzi referencyjnych per poziom, eksplicytnie oznaczonych jako *„stan na Q2 2026, sprawdź czy aktualne"*.

## 4. Brak etyki

Skala mierzy umiejętność techniczną. Nie odnosi się do tego, *do czego* się tej umiejętności używa.

Można być na poziomie 10 i:

- generować dezinformację na masową skalę
- automatyzować decyzje, które wykluczają grupy ludzi
- budować systemy, które omijają regulacje
- wzmacniać bias, którego nikt nie audytuje

Dojrzałość techniczna ≠ dojrzałość moralna. A skala sugeruje, że „wyżej" zawsze jest *lepiej*.

**Czego brakuje:** wymiar etyczny / governance jako osobna oś. Wersja 3 może wprowadzić skalę 2D - *technical maturity* × *ethical maturity*. Albo szóstą fazę. Otwarte pytanie.

## 5. Ludzie identyfikują się z poziomem

To nie błąd modelu - to błąd używania. Ale skala go ułatwia.

Obserwacja Konrada z wdrożeń: rozmówcy mówią *„jestem na 5"* tak, jak mówią *„jestem ekstrawertykiem"*. To znaczy: identyfikacja, nie diagnoza.

Konsekwencje:

- Trudniej cofać się - *„ale ja byłem na 5, jak mam się przyznać, że teraz jestem na 4?"*
- Skala staje się rankingiem, nie narzędziem.
- Zespoły kłócą się o to, kto jest na 7 a kto na 6, zamiast pytać *„co dalej?"*

**Czego brakuje:** wyraźniejsze formowanie skali jako stanu, nie cechy. Wersja 3 będzie miała eksplicytne *„poziom jest stanem czasowym, zależnym od kontekstu, nie tożsamością"*.

## 6. Brak feedback loop'a po publikacji

W oryginalnej skali nie było mechanizmu zbierania doświadczeń. *„Wersja 3 powstanie, kiedy uzbieram materiał"* brzmi dobrze, ale nie ma kanału.

W ciągu kilku tygodni po publikacji dostaliśmy mailem ~30 historii wdrożeń. Każda zawierała coś, czego skala nie pokrywa. Ale 30 maili w skrzynce ≠ ustrukturyzowany feedback.

**Czego brakuje:** ankieta / formularz do diagnoz. Wersja 3 może mieć dedicated GitHub repo z templatkami case studies, albo prostą stronę zbierającą wpisy.

## Feedback od czytelników - co się powtarza

W mailach, które dostaliśmy:

- **„Co z tymi, którzy musieli się cofnąć?"** - np. firma na 8 wraca do 4 po incydencie. Skala nie ma drogi w dół.
- **„Co jeśli organizacja ma 3 poziomy naraz w różnych zespołach?"** - Sales na 1, Engineering na 7. Czy to ma sens jako jedna ocena?
- **„Czy są branże, w których poziom 8 nie ma sensu?"** - medycyna, prawo, edukacja. Czasem ograniczenie regulacyjne ustanawia sufit.
- **„Czy poziom 0 to naprawdę pozycja?"** - argumenty etyczne za odmową. Nie jest wstydem.
- **„Brakuje miejsca na wymiar zespołowy między jednostką a organizacją"** - squad / domena / wertykal.

Wszystkie zaadresujemy w v3.

## Co znaczy „autokrytyka"

Nie chodzi o to, żeby pokazać, że skala nie działa - działa, używamy jej co tydzień. Chodzi o to, żeby pokazać **gdzie** nie działa, bo bez tej części czytelnik wpada w pułapkę traktowania modelu jako prawdy.

Każdy model jest narzędziem. Narzędzie ma ostrza, ale ma też tępy koniec. Wiedza, gdzie który koniec - to różnica między używaniem a kaleczeniem.

Wersja 3 zaadresuje co najmniej cztery z sześciu punktów powyżej. Jeśli widzisz **siódmy**, którego tu nie wymieniliśmy - [napisz](https://holak.net.pl). Zbieramy materiał aktywnie.

To koniec serii rozwijającej skalę. Dziewięć postów, od [diagnozy 30-minutowej](/pl/blog/diagnoza-dojrzalosci-ai-30-min/) po tę autokrytykę. Następna iteracja będzie wersją 3 - z poprawkami z tej autokrytyki i materiałem zebranym z waszych wdrożeń.
