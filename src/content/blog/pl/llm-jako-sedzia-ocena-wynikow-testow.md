---
title: "LLM jako sędzia: czy model może oceniać wyniki testów i kiedy mu nie ufać"
description: "Wzorzec LLM-as-judge w testowaniu: rubryka zamiast skali 1-10, kalibracja na wzorcach złota, trzy tryby pracy i cztery skrzywienia sędziego, które trzeba znać przed wdrożeniem."
date: 2026-08-05
tags: ["ai", "qa", "llm", "llm-as-judge", "ewaluacja"]
lang: pl
readingTime: 9
author: GH
---

Części asercji nie da się zapisać w kodzie. "Czy ten opis błędu jest zrozumiały dla użytkownika", "czy odpowiedź chatbota jest uprzejma i na temat", "czy wygenerowane podsumowanie nie przekręca faktów" - to są realne wymagania jakościowe, na które klasyczny `expect` nie ma składni. Wzorzec LLM-as-judge (model jako sędzia) obiecuje, że oceni je model. Obietnica jest do obrony, ale tylko pod warunkami, które w tym wpisie rozbieram: rubryka zamiast wrażenia, kalibracja na wzorcach i znajomość skrzywień sędziego.

## Skąd w ogóle ten problem

Dopóki testowaliśmy systemy deterministyczne, asercja była prosta: wartość równa się oczekiwanej albo nie. Systemy z komponentem generatywnym psują ten model w dwóch miejscach. Po pierwsze, poprawnych odpowiedzi jest nieskończenie wiele - chatbot aplikacji NotkaApp może odmówić nieuprawnionego dostępu na sto uprzejmych sposobów. Po drugie, część kryteriów jakości jest z natury miękka: zrozumiałość, ton, adekwatność.

Tradycyjne wyjścia z tej pułapki są dwa i oba złe. Asercje na słowa kluczowe ("odpowiedź zawiera 'przepraszam'") są kruche i mierzą nie to, co trzeba. Ocena ręczna jest dobra, ale nie skaluje się do tysiąca przypadków testowych na każdy przebieg regresji. Model jako sędzia to próba trzeciej drogi: ocenia maszyna, ale według kryteriów miękkich.

## Rubryka, czyli koniec pytania "czy to jest dobre"

Najczęstszy błąd wdrożeniowy wygląda tak: "oceń tę odpowiedź w skali 1-10". Taki sędzia jest bezużyteczny, bo skala bez definicji mierzy nastrój modelu, nie jakość odpowiedzi. Te same dane wejściowe potrafią dostać 6 i 9 w dwóch przebiegach, a liczba nie mówi nic o tym, co poprawić.

Działająca alternatywa to rubryka: rozbicie oceny na wymiary, z których każdy ma jawne kryterium i wąską skalę. Przykładowa rubryka, której używam do oceny komunikatów o błędach generowanych przez system:

- **Zrozumiałość (0-2):** 0 - wymaga wiedzy technicznej (kody, ślady stosu); 1 - zrozumiały, ale używa żargonu; 2 - zrozumiały dla użytkownika bez przygotowania.
- **Wykonalność (0-2):** 0 - nie mówi, co zrobić dalej; 1 - sugeruje działanie ogólnikowo; 2 - wskazuje konkretny następny krok.
- **Poprawność faktyczna (0-1):** 0 - opisuje przyczynę niezgodnie ze stanem systemu; 1 - zgodnie. Wymiar binarny, bo "trochę prawdziwy" komunikat nie istnieje.
- **Ton (0-1):** 0 - obwinia użytkownika lub straszy; 1 - neutralny lub pomocny.

Do każdego wymiaru sędzia musi zwrócić nie tylko punktację, ale i cytat z ocenianego tekstu, który ją uzasadnia. Cytat to mechanizm kontrolny: sędziego, który punktuje bez uzasadnienia, łapie się dokładnie tak samo, jak ucznia zgadującego odpowiedzi.

Zwróć uwagę na wąskie skale. Wymiar 0-2 zamiast 1-10 to nie asceza, tylko statystyka: im mniej poziomów, tym łatwiej je jednoznacznie zdefiniować i tym wyższa powtarzalność ocen między przebiegami. Rubryka o czterech wąskich wymiarach daje też coś, czego pojedyncza liczba nie da nigdy - diagnozę. Wynik "zrozumiałość 2, wykonalność 0" mówi od razu, co poprawić.

## Kalibracja na przykładach wzorcowych

Rubryka bez kalibracji to nadal loteria, tylko z ładniejszym opisem. Kalibracja oznacza zbiór 20-40 przykładów ocenionych przez człowieka - wzorzec złota - i regularne porównywanie ocen sędziego z tymi ocenami. Mierzę dwie rzeczy: zgodność (w ilu procentach przypadków sędzia daje tę samą punktację co człowiek) i kierunek rozjazdu (czy sędzia jest systematycznie łagodniejszy, czy surowszy).

Praktyczny próg: poniżej 80 procent zgodności na wzorcach sędzia nie wchodzi do potoku. Co ważne, kalibrację powtarza się po każdej zmianie promptu sędziego i po każdej zmianie wersji modelu - nowy model to nowy sędzia, nawet jeśli prompt został ten sam. Zbiór wzorcowy traktuję jak każdy inny zasób testowy: ma właściciela, wersjonowanie i przegląd co kwartał.

## Trzy tryby pracy i miejsce w potoku

Sędzia może pracować w trzech trybach i wybór trybu to decyzja projektowa, nie detal. Tryb punktowy - ocena pojedynczego wyniku rubryką - nadaje się do bramek jakości w potoku CI: każdy wynik dostaje punktację, próg decyduje o czerwonym. Tryb porównawczy - "która z dwóch odpowiedzi lepsza" - jest statystycznie stabilniejszy i świetny do testów regresji generatywnej: porównujesz wyniki nowej wersji promptu albo modelu z poprzednią na tym samym zbiorze wejść. Tryb referencyjny - porównanie z odpowiedzią wzorcową - jest najtańszy w kalibracji, ale wymaga posiadania wzorca, więc działa tylko tam, gdzie umiemy go napisać.

W praktyce u mnie wygląda to tak: tryb porównawczy do decyzji "czy nowa wersja promptu produkcyjnego jest lepsza", tryb punktowy jako bramka regresji na zbiorze stu stałych przypadków, tryb referencyjny do wąskiej klasy zadań ekstrakcyjnych, gdzie wzorzec jest jednoznaczny.

Kwestia kosztów bywa zaskoczeniem przy pierwszym wdrożeniu. Każda ocena to wywołanie modelu, a ocena tysiąca przypadków w czterech wymiarach przy każdym przebiegu CI potrafi kosztować więcej niż reszta potoku razem wzięta. Trzy techniki trzymają to w ryzach: mniejszy, tańszy model jako sędzia pierwszej linii (kalibrowany tak samo - mały model z dobrą rubryką regularnie bije duży model bez rubryki), próbkowanie zamiast pełnego zbioru w przebiegach na gałęziach roboczych z pełnym zbiorem tylko przed wydaniem, i pamięć podręczna werdyktów dla niezmienionych par wejście-wyjście.

## Skrzywienia sędziego, które trzeba znać

Model jako sędzia ma udokumentowane, powtarzalne skrzywienia. Nie są egzotyczne - wychodzą w pierwszym tygodniu używania, jeśli się wie, gdzie patrzeć.

- **Preferencja długich odpowiedzi.** Dłuższa odpowiedź dostaje wyższe noty niezależnie od treści. Komunikat o błędzie rozdęty do trzech akapitów wygrywa z trafnym jednozdaniowym, choć dla użytkownika jest gorszy. Obrona: jawny wymiar zwięzłości w rubryce i pary wzorcowe, w których krótsza odpowiedź jest tą lepszą.
- **Skrzywienie pozycji.** W porównaniach parami ("która odpowiedź lepsza: A czy B") odpowiedź pokazana jako pierwsza wygrywa częściej. Obrona: każde porównanie wykonuj dwa razy z zamienioną kolejnością; jeśli werdykty się różnią, traktuj wynik jako remis.
- **Preferencja własnego stylu.** Model wyżej ocenia teksty brzmiące jak jego własne - a jeśli oceniany tekst też generuje model tej samej rodziny, oceny puchną. Obrona: sędzia z innej rodziny modeli niż generator, przynajmniej w zbiorze kontrolnym.
- **Łagodnienie w dryfie.** Bez kalibracji oceny z czasem przesuwają się ku górze skali, szczególnie po zmianach wersji modelu. Obrona: wzorce złota i alarm przy spadku zgodności.

## Kiedy to narzędzie, a kiedy alibi

Model jako sędzia jest narzędziem, gdy ocenia rzeczy z natury miękkie, ma rubrykę, jest skalibrowany i jego werdykty podlegają wyrywkowej kontroli człowieka. Staje się alibi w trzech sytuacjach, które widuję regularnie.

Pierwsza: sędzia ocenia coś, co da się zasercić w kodzie. Jeśli kryterium brzmi "odpowiedź zawiera kwotę z faktury", to jest to porównanie napisów, nie ocena jakości - sędzia tutaj to drogi i niestabilny zamiennik darmowej asercji. Druga: punktacja sędziego trafia do raportu, ale nikt nie zdefiniował progu porażki. Test, który nie umie być czerwony, nie jest testem - jest dekoracją. Trzecia: sędzia zostaje jedyną linią kontroli jakości generatywnego komponentu, bo "przecież AI sprawdza AI". Bez wzorców złota i ludzkiej próbki kontrolnej to nie jest kontrola jakości, tylko jej pozór.

> Sędzia LLM nie zdejmuje z zespołu odpowiedzialności za definicję jakości. On ją egzekwuje w skali, w której człowiek nie da rady - ale definicja, rubryka i wzorce muszą pochodzić od ludzi, którzy rozumieją produkt.

Praktyczny mechanizm, który trzyma sędziego po stronie narzędzia: stała próbka kontrolna. Co tydzień losuję dziesięć werdyktów sędziego i oceniam te same przypadki sam, nie podglądając jego punktacji. Rozjazd w jednym przypadku na dziesięć to normalność; rozjazd w trzech to sygnał do ponownej kalibracji, zanim ktokolwiek podejmie decyzję na podstawie tych liczb. Kwadrans tygodniowo - tyle kosztuje utrzymanie prawa do mówienia "ufamy tym ocenom" na poważnie. Zespół, który tego kwadransa nie wydaje, po cichu przeszedł z kategorii narzędzia do kategorii alibi, nawet jeśli rubryka i kalibracja startowa były wzorowe.

## Podsumowanie

Model jako sędzia rozwiązuje realny problem: asercje na miękkie kryteria jakości w skali, której ocena ręczna nie udźwignie. Warunki brzegowe są trzy: rubryka z wąskimi, zdefiniowanymi wymiarami i wymogiem cytatu zamiast ogólnej skali; kalibracja na 20-40 wzorcach złota z progiem 80 procent zgodności, powtarzana po każdej zmianie modelu lub promptu; oraz świadomość skrzywień - długość, pozycja, własny styl, dryf - i mechanizmy obronne na każde z nich. Czerwone flagi alibi: ocena rzeczy zasercowalnych w kodzie, brak progu porażki, sędzia jako jedyna kontrola. Dobry pierwszy eksperyment: weź dziesięć komunikatów o błędach ze swojego produktu, oceń je sam rubryką z tego wpisu, potem daj tę samą rubrykę modelowi i policz zgodność - wynik powie ci więcej o dojrzałości tego wzorca niż dowolny materiał marketingowy.
