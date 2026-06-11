---
title: "Inżynieria kontekstu: dlaczego twój agent głupieje w długiej sesji"
description: "Trzy mechanizmy degradacji kontekstu (zgubiony środek, rozcieńczenie instrukcji, rosnący koszt) i cztery nawyki, które trzymają budżet tokenów w ryzach: kompaktowanie, czysty start, subagenci i wskaźniki zamiast danych."
date: 2026-07-16
tags: ["ai", "inzynieria-kontekstu", "agenci", "claude-code", "tokeny"]
lang: pl
readingTime: 9
author: GH
---

Każdy, kto pracuje z agentem dłużej niż godzinę, zna ten moment: model, który rano błyszczał, po południu myli nazwy plików, ignoruje ustalenia sprzed kwadransa i proponuje rozwiązania, które sam wcześniej odrzucił. To nie jest degradacja modelu. To degradacja kontekstu - i da się nią zarządzać tak samo świadomie, jak budżetem projektu.

## Okno kontekstu to budżet, nie pojemnik

Okno kontekstu - czyli wszystko, co model "widzi" w danym momencie: instrukcje systemowe, historię rozmowy, wklejone pliki, wyniki narzędzi - ma twardy limit liczony w tokenach. Token to jednostka tekstu, w polszczyźnie średnio pół słowa. Okno na 200 tysięcy tokenów brzmi jak nieskończoność, ale arytmetyka jest brutalna: jeden większy plik źródłowy to 5-15 tysięcy tokenów, zrzut logów z nieudanego potoku CI/CD potrafi zjeść 40 tysięcy, a wynik `git diff` po większym refaktorze - kolejne 20.

Problem w tym, że większość ludzi traktuje okno jak pojemnik: "mieści się, więc wrzucam". A powinno się je traktować jak budżet: każdy token wydany na szum to token, którego zabraknie na sygnał. I - co gorsze - szum nie jest neutralny. On aktywnie psuje odpowiedzi, zanim jeszcze skończy się miejsce.

## Trzy mechanizmy degradacji

Warto rozumieć, dlaczego dokładnie sesja "głupieje", bo każdy mechanizm ma inne antidotum.

**Zgubiony środek (lost in the middle).** Modele najlepiej korzystają z informacji na początku i na końcu kontekstu, a najsłabiej z tych w środku. To zjawisko potwierdzone pomiarami, nie anegdota. W praktyce: ustalenie z połowy długiej sesji - "używamy bazy testowej, nie produkcyjnej" - ma fizycznie mniejszą szansę wpłynąć na odpowiedź niż to samo zdanie napisane przed chwilą. Im dłuższa sesja, tym więcej ważnych rzeczy ląduje w martwej strefie.

**Rozcieńczenie instrukcji.** Twoje kluczowe polecenie konkuruje o uwagę modelu ze wszystkim innym w oknie. Kiedy instrukcja "zwracaj wynik w formacie JSON" stanowi 20 słów na 2 tysiące tokenów kontekstu, jest przestrzegana niemal zawsze. Te same 20 słów na 150 tysięcy tokenów - już nie. Z mojego doświadczenia pierwszym objawem rozcieńczenia jest właśnie gubienie wymagań formatu i konwencji nazewniczych: model dalej rozwiązuje zadanie, ale przestaje go rozwiązywać po twojemu.

**Koszt i czas.** W modelach rozliczanych za tokeny każda kolejna odpowiedź w długiej sesji jest droższa, bo model za każdym razem przetwarza całą historię od nowa. Sesja, która urosła do 100 tysięcy tokenów, płaci ten haracz przy każdym twoim zdaniu - również wtedy, gdy pytasz o drobiazg. Rosną też opóźnienia. Płacisz więcej za gorsze odpowiedzi: to najgorsza taryfa, jaką znam.

## Na co naprawdę wydajesz tokeny

Zanim przejdziemy do nawyków, krótki rachunek sumienia. Oto typowi pożeracze budżetu, których widzę najczęściej u siebie i w zespołach:

- **Wklejone logi w całości.** 300 linii stosu wywołań, z których istotne są trzy. Reszta to czysty szum, który zostanie w oknie do końca sesji.
- **Całe pliki zamiast fragmentów.** Agent czyta plik na 800 linii, żeby zmienić jedną funkcję. Te 800 linii podróżuje z wami już na zawsze.
- **Stare wątki.** Poranne debugowanie problemu A wciąż siedzi w kontekście, kiedy po południu robicie funkcję B. Model próbuje honorować ustalenia z obu - i miesza.
- **Powtórzone próby.** Trzy nieudane wersje tego samego rozwiązania w historii. Model widzi je wszystkie i statystycznie ciąży w stronę tego, co już napisał, łącznie z błędami.

> Agent nie głupieje od trudnych zadań. Głupieje od taniego szumu, który sami mu wsypujemy do okna.

## Nawyk 1: kompaktuj, zanim będzie źle

Kompaktowanie to zastąpienie dotychczasowej historii jej zwięzłym podsumowaniem - Claude Code robi to poleceniem `/compact`, ale ten sam manewr wykonasz ręcznie w każdym narzędziu: "podsumuj nasze ustalenia, decyzje i otwarte wątki w 15 punktach", a potem nowa sesja z tym podsumowaniem na starcie. Kluczowy jest moment: kompaktuj po domknięciu etapu, kiedy wiesz, co było ważne - nie wtedy, gdy okno już się przepełnia i automat zrobi to za ciebie w losowym miejscu, ucinając kontekst w połowie myśli.

Mój próg alarmowy to mniej więcej 60-70% zajętości okna. Powyżej tej granicy nie zaczynam nowych wątków - najpierw porządki.

## Nawyk 2: jedna sesja, jedno zadanie

Najtańsza technika na liście: czysty start. Nowa funkcja - nowa sesja. Nowy problem do debugowania - nowa sesja. Stały kontekst projektu (konwencje, architektura, polecenia) powinien mieszkać w pliku CLAUDE.md albo jego odpowiedniku, gdzie ładuje się automatycznie i kosztuje raz, a nie być przeciągany ręcznie z rozmowy do rozmowy.

Opór przed czystym startem jest zwykle emocjonalny: "tyle już ustaliliśmy, szkoda tracić". To pułapka utopionych kosztów. Jeśli ustalenia są warte zachowania - zasługują na zapis w pliku, nie na dryfowanie w historii czatu, gdzie i tak trafią do zgubionego środka. Po wymuszeniu na sobie tej reguły moje sesje skróciły się średnio o połowę, a liczba odpowiedzi "wróć, przecież ustaliliśmy inaczej" spadła wyraźnie.

## Nawyk 3: deleguj brudną robotę do subagentów

Subagent - pomocniczy agent z własnym, osobnym oknem kontekstu - to mechanizm, o którym pisałem już osobno, ale w kontekście budżetu tokenów ma jedną zabójczo praktyczną właściwość: izoluje szum. Zadanie "przeszukaj repozytorium i znajdź wszystkie miejsca, gdzie walidujemy adres e-mail" wykonane w głównej sesji wciągnie do okna dziesiątki fragmentów plików. To samo zadanie oddelegowane do subagenta kosztuje główną sesję tylko jego końcową odpowiedź: pięć ścieżek z numerami linii.

Reguła kciuka: wszystko, co wymaga przeczytania wielu plików, a kończy się krótkim wnioskiem - wyszukiwanie, rozpoznanie nieznanego kodu, analiza logów - deleguj. Główna sesja ma trzymać decyzje i bieżącą pracę, nie surowiec.

## Nawyk 4: wskaźniki zamiast danych

Zamiast wklejać plik - podaj ścieżkę i pozwól agentowi przeczytać celowany fragment. Zamiast 300 linii logu - wklej 10 linii wokół błędu plus jedno zdanie kontekstu. Zamiast całej specyfikacji - punkt, którego dotyczy zadanie. Model z narzędziami sam dociągnie to, czego mu brakuje, i zrobi to precyzyjniej niż twoje hurtowe wklejanie.

Ten nawyk ma też wariant na wyjście: proś o zwięzłość tam, gdzie pełny wynik nie jest potrzebny. "Wypisz tylko zmienione linie", "odpowiedz tabelą, bez omówienia". Wyjście modelu też zostaje w oknie i też się liczy do budżetu następnych kroków.

## Anatomia jednej przepalonej sesji

Żeby nie zostawiać tego w teorii, prześledźmy typowy przebieg, który widziałem dziesiątki razy - u siebie też. Godzina 9:00: start sesji, zadanie "popraw walidację formularza rejestracji". Agent czyta trzy pliki, proponuje zmianę, działa świetnie. Godzina 9:40: przy okazji wychodzi błąd w testach, wklejam pełny wynik testów - 280 linii, z czego istotne jest jedno niepowodzenie. Godzina 10:30: "skoro już tu jesteśmy", proszę o refaktor sąsiedniego modułu. Agent czyta kolejne pięć plików. Godzina 11:15: wracam do walidacji z poranka - i agent proponuje rozwiązanie sprzeczne z tym, które sam wdrożył dwie godziny wcześniej, bo tamta decyzja utonęła w środku okna, przygnieciona logiem testów i refaktorem.

Rachunek tej sesji: trzy różne zadania, jeden duży zrzut logów, około 120 tysięcy tokenów historii. Każde z tych zadań osobno zajęłoby krótszą, tańszą i mądrzejszą sesję. Wniosek nie jest odkrywczy, ale wart zapisania: sesje nie psują się od trudności zadań, tylko od ich liczby i od surowca, który przy okazji do okna wpada.

Od kiedy prowadzę prosty dziennik sesji - data, zadanie, czy skończyłem w jednej sesji, czy musiałem ratować się kompaktowaniem - widzę wyraźny wzór: sesje jednowątkowe kończą się sukcesem niemal zawsze, sesje trzywątkowe wymagają ratunku w większości przypadków. Ta statystyka z własnego podwórka przekonuje skuteczniej niż każdy artykuł, łącznie z tym.

## Jak rozpoznać, że sesja umiera

Cztery sygnały, po których u mnie zapada decyzja o kompaktowaniu albo czystym starcie: model myli nazwy plików lub funkcji, które wcześniej znał; wraca do rozwiązania odrzuconego pół godziny temu; przestaje stosować format odpowiedzi, o który prosiłem na początku; odpowiada coraz wolniej i coraz ogólniej. Dwa z czterech naraz - sesja do wymiany. Nie negocjuję z umierającym kontekstem, bo każda kolejna odpowiedź będzie tylko gorsza, a ja zapłacę za nią pełną stawkę.

## Podsumowanie

Okno kontekstu to budżet: szum wypiera sygnał, a mechanizmy degradacji - zgubiony środek, rozcieńczenie instrukcji, rosnący koszt - działają na długo przed twardym limitem. Cztery nawyki trzymają budżet w ryzach: kompaktowanie po etapach zamiast w panice, czysty start na każde nowe zadanie ze stałym kontekstem w pliku, delegowanie przeszukiwań do subagentów i podawanie wskaźników zamiast hurtowego wklejania danych. Przez tydzień zapisuj, co naprawdę wkleiłeś do sesji - sama świadomość rachunku zmienia nawyki szybciej niż jakiekolwiek narzędzie.
