---
title: "Testowanie aplikacji z LLM w środku: jak QA podchodzi do niedeterminizmu"
description: "Jak testować aplikacje z modelem językowym w środku: atrapy dla kodu, kontrakty struktury, asercje własności, ewaluacje z progiem zaliczeń i skalibrowany sędzia LLM."
date: 2026-08-19
tags: ["ai", "qa", "llm", "testy", "niedeterminizm"]
lang: pl
readingTime: 14
author: GH
---

Przez dwie dekady automatyzacja testów stała na jednym fundamencie: dla tego samego wejścia system zwraca to samo wyjście, więc asercja "wynik równa się oczekiwany" rozstrzyga spór o jakość w ułamku sekundy. Gdy w środku aplikacji siedzi model językowy, ten fundament pęka. Ten sam prompt wysłany dwa razy potrafi zwrócić dwie różne odpowiedzi - obie poprawne, obie inne niż wczoraj - i to nie jest defekt do zgłoszenia, tylko właściwość technologii, którą ktoś świadomie wybrał. Widziałem zespoły, które na to odkrycie reagowały dwojako: albo porównywały pełny tekst odpowiedzi i żyły z wiecznie czerwonym potokiem, albo wyłączały asercje i utrzymywały teatr testowania. Obie drogi prowadzą donikąd. Poniżej podejście, które u mnie działa: rozbiór aplikacji na warstwy, twarde kontrakty tam, gdzie się da, statystyka tam, gdzie się nie da.

## Niedeterminizm to cecha, nie usterka

Zacznijmy od przestawienia w głowie, bez którego reszta nie ma sensu. Model językowy losuje kolejne tokeny z rozkładu prawdopodobieństwa; temperatura i pozostałe parametry sterują tym losowaniem, ale nawet przy temperaturze zero dostawcy nie gwarantują pełnej powtarzalności - między wersjami modelu, a czasem między dwoma wywołaniami tego samego punktu końcowego. Ta zmienność jest ceną za zdolności, dla których model w ogóle znalazł się w aplikacji: parafrazę, syntezę, dopasowanie tonu do kontekstu rozmowy. Gdyby dało się ją wyzerować bez strat, dostalibyśmy słownik gotowych odpowiedzi, nie model.

Konkret z projektu: asystent zwrotów w SklepDemo na pytanie o status paczki odpowiadał raz "Twoja paczka jest w drodze i dotrze w czwartek", a raz "Przesyłka dotrze do Ciebie w czwartek - jest już u kuriera". Klasyczny test porównujący tekst widział dwie różne odpowiedzi i zgłaszał defekt, choć obie były poprawne. Ten sam test nie zauważyłby za to odpowiedzi o czwartkowej dostawie wysłanej do niewłaściwego klienta, gdyby akurat tekst się zgadzał ze wzorcem. Porównanie tekstu mierzy nie to, co trzeba: karze za dopuszczalną zmienność formy i nie chroni przed prawdziwymi błędami treści.

Zadanie QA nie brzmi więc "wyeliminować zmienność", tylko "ograniczyć ją do miejsc, gdzie jest akceptowalna, i zmierzyć tam, gdzie została". To zmienia zestaw narzędzi: mniej porównań tekstu, więcej walidatorów, progów i statystyki. Zmienia też definicję regresji. Regresją nie jest inna odpowiedź niż wczoraj - regresją jest spadek odsetka odpowiedzi spełniających kryteria.

## Większość aplikacji to nadal zwykły kod

Zanim dotkniesz niedeterminizmu, policz, ile go naprawdę jest. Udział zwykłego kodu zależy od architektury i nie ma uniwersalnej wartości osiemdziesięciu procent. Parsowanie, routing, uprawnienia, integracje, składanie promptu, walidację, obsługę błędów i limity nadal można testować deterministycznie, zastępując model kontrolowaną atrapą.

Atrapa zwraca nagrane odpowiedzi: poprawną, uszkodzony JSON, odmowę modelu, odpowiedź przekraczającą limit długości, przekroczenie czasu, błąd 429. Dzięki temu deterministycznie sprawdzisz całą obsługę przypadków brzegowych: czy aplikacja przeżyje niedomknięty nawias w odpowiedzi, czy odmowa nie wycieknie do użytkownika jako pusty ekran, czy ponawianie nie zdubluje operacji zapisu. Z mojego doświadczenia większość defektów w aplikacjach z LLM siedzi właśnie tu - w kodzie wokół modelu, nie w samym modelu. Wyspa niedeterminizmu jest mała; błąd polega na tym, że pozwalamy jej zalać myślenie o całym planie testów.

Osobną kategorią jest samo składanie promptu. Szablon promptu z wstrzykiwanymi danymi to kod jak każdy inny: test sprawdza, że dane klienta trafiają we właściwe miejsce, że znaki specjalne w danych nie rozbijają struktury szablonu, że instrukcja systemowa nie znika po zmianie kolejności fragmentów. Brzmi banalnie, dopóki nie zobaczysz awarii, w której pusta historia rozmowy skleiła się w prompt bez sekcji z zasadami - i model radośnie obiecał klientowi zwrot pieniędzy poza polityką sklepu.

## Kontrakt na granicy modelu

Pierwsza linia testów, które dotykają prawdziwego modelu, ocenia strukturę. Jeśli model ma zwracać JSON, schemat jest kontraktem: wymagane pola, typy, zakresy, wartości wyliczeniowe i limity. Asercja walidatora jest deterministyczna, ale odpowiedź modelu może naruszyć kontrakt - dlatego aplikacja musi odrzucić albo bezpiecznie obsłużyć niepoprawną strukturę zamiast zakładać, że zawsze będzie identyczna.

```json
{
  "category": "jedna z: zwrot | reklamacja | pytanie | inne",
  "summary": "tekst, maksymalnie 400 znaków",
  "confidence": "liczba od 0 do 1",
  "requires_human": "wartość logiczna, pole wymagane"
}
```

Kontrakt łapie całą klasę awarii, które w praktyce zdarzają się częściej niż spadek jakości treści: dostawca zaktualizował model i zmieniło się formatowanie, ktoś "poprawił" prompt i z odpowiedzi wypadło pole, tryb wymuszania struktury został przypadkiem wyłączony w konfiguracji. Ta sama walidacja powinna działać w środowisku produkcyjnym jako brama na wyjściu modelu, a test w CI sprawdza dodatkowo, że brama faktycznie odrzuca to, co ma odrzucać - podajesz jej celowo zepsute odpowiedzi z atrapy i oczekujesz odrzutu.

Kontrakt obejmuje też zachowania, nie tylko pola. Jeśli model może wywoływać narzędzia, lista dozwolonych narzędzi i schematy ich argumentów są częścią kontraktu: wywołanie narzędzia spoza listy albo z argumentem złego typu to twarde niezaliczenie, niezależnie od tego, jak sensownie brzmiała reszta odpowiedzi. Analogicznie limity operacyjne: maksymalna liczba wywołań w jednej odpowiedzi, maksymalny koszt pojedynczej interakcji. To wszystko są warunki zero-jedynkowe i szkoda ich nie sprawdzać deterministycznie.

## Własności zamiast równości

Piętro wyżej zaczyna się ocena treści i tu klasyczna równość ustępuje asercjom własności. Nie wiem, jak dokładnie model sformułuje odpowiedź, ale wiem, jakie niezmienniki każda poprawna odpowiedź musi spełniać:

- **Zawiera to, co musi.** Odpowiedź na pytanie o zamówienie zawiera numer tego zamówienia i nazwisko właściwego klienta, a podsumowanie dokumentu zawiera każdą decyzję oznaczoną w źródle jako wiążąca.
- **Nie zawiera tego, czego nie wolno.** Żadnych danych innych klientów, żadnych kwot spoza dokumentu źródłowego, żadnych obietnic, których proces obsługi nie przewiduje.
- **Mieści się w ramach.** Limit długości, język odpowiedzi zgodny z językiem pytania, format daty zgodny z ustawieniami regionalnymi.
- **Przechodzi walidator domenowy.** Suma pozycji w wygenerowanym podsumowaniu faktury równa się kwocie całkowitej; każdy przywołany identyfikator istnieje w bazie; każdy odnośnik prowadzi do zasobu, który odpowiada.

To jest rama myślenia zapożyczona z testowania opartego na własnościach (property-based testing): zamiast jednego oczekiwanego wyniku definiujesz przestrzeń wyników dopuszczalnych i sprawdzasz przynależność do niej. Im więcej kryteriów jakości uda się wyrazić zwykłym kodem walidatora, tym mniej zostaje dla najdroższego i najmniej pewnego narzędzia, czyli oceny przez drugi model. W praktyce zaskakująco dużo da się wyrazić kodem - włącznie z wykrywaniem zmyślonych liczb przez porównanie każdej wartości w odpowiedzi z danymi źródłowymi.

## Ewaluacje na zbiorach i odsetek zaliczeń

Pojedynczy przebieg może wykryć konkretną awarię, ale nie oszacuje częstości błędów ani stabilności. Do tego służy ewaluacja na reprezentatywnym zbiorze i, gdy to potrzebne, powtórzenia. Liczebność próby oraz próg dobierz do ryzyka, oczekiwanej częstości błędów i wymaganej niepewności statystycznej - nie istnieje uniwersalny przedział od pięćdziesięciu do kilkuset przypadków ani domyślne dziewięćdziesiąt pięć procent.

Powtórzenia pomagają oszacować zmienność, ale trzy do pięciu wywołań to tylko tani rekonesans, nie dowód stabilności. Liczbę powtórzeń dobierz do decyzji i raportuj wynik z przedziałem ufności albo co najmniej licznikiem sukcesów i całkowitej liczby prób. Dla porównywalności zapisuj zbiór, parametry, wersję modelu i datę uruchomienia.

Próg wynika z ryzyka i kosztu błędu. Ani dziewięćdziesiąt, ani dziewięćdziesiąt dziewięć procent nie jest uniwersalnie bezpieczne; dla operacji finansowych kryteria krytyczne potrzebują twardej walidacji i ścieżki obsługi przez człowieka, nie tylko średniego wyniku modelu. Każda zmiana promptu, modelu lub parametrów powinna przejść odpowiednią ewaluację, a prompt, konfiguracja i wyniki muszą być wersjonowane oraz przeglądane.

Zbiór przypadków żyje. Każdy błąd zgłoszony z produkcji staje się nowym przypadkiem ewaluacji, dokładnie tak jak defekt w kodzie staje się testem regresji. Po roku taki zbiór jest najcenniejszym artefaktem jakości w projekcie - cenniejszym niż sam prompt, bo prompt można napisać od nowa, a zbioru przypadków z historią nie.

## Sędzia LLM wymaga wzorcowania

Dla odpowiedzi otwartych - podsumowań, odpowiedzi konsultanta, tekstów o swobodnej formie - części kryteriów nie da się wyrazić walidatorem: "czy odpowiedź jest uprzejma", "czy podsumowanie nie pomija kluczowej decyzji". Tu wchodzi sędzia LLM (LLM-as-judge): drugi model ocenia odpowiedź pierwszego według rubryki. To narzędzie realnie użyteczne i realnie zdradliwe zarazem, bo sędzia ma własne, dobrze udokumentowane skrzywienia: preferuje odpowiedzi dłuższe, faworyzuje styl podobny do własnego, a przy porównaniach parami potrafi zmienić werdykt po samej zamianie kolejności kandydatów.

Dlatego sędziego traktuję jak każde narzędzie pomiarowe: przed użyciem wymaga wzorcowania. Bierzesz próbkę pięćdziesięciu do stu odpowiedzi, oceniasz je ręcznie, puszczasz na nich sędziego i mierzysz zgodność jego werdyktów z ludzkimi. Jeśli zgodność jest niska, poprawiasz rubrykę - najlepiej rozbijając ocenę na pytania binarne ("czy odpowiedź zawiera decyzję z notatki: tak/nie") zamiast skal punktowych, które sędzia interpretuje dowolnie. Kalibrację powtarzasz po każdej zmianie modelu sędziego. Szerzej rozbieram ten temat w osobnym wpisie o [LLM w roli sędziego](/pl/blog/llm-jako-sedzia-ocena-wynikow-testow/). Zasada minimalna: sędzia nigdy nie jest jedynym strażnikiem kryterium krytycznego - od danych wrażliwych, kwot i uprawnień są walidatory w kodzie.

## CI i budżet: co na commit, co nocą

Pełna ewaluacja z prawdziwym modelem i sędzią kosztuje realne pieniądze i realny czas, więc odpalanie jej przy każdym commicie jest marnotrawstwem. U mnie sprawdza się piramida:

| Warstwa | Kiedy uruchamiana | Model | Koszt |
|---|---|---|---|
| Testy kodu z atrapą modelu | każdy commit | brak (atrapa) | sekundy, zero tokenów |
| Kontrakty struktury na małej próbce | każda zmiana promptu, modelu lub parametrów | prawdziwy, kilkanaście wywołań | minuty, groszowy |
| Pełna ewaluacja z walidatorami i sędzią | nocą oraz przed wydaniem | prawdziwy, cały zbiór | dziesiątki minut, budżetowane tokeny |

Dwie uwagi z praktyki. Po pierwsze, temperatura zero i ustalone ziarno losowości (seed) zmniejszają zmienność i warto ich używać w ewaluacjach dla porównywalności wyników - ale nie obiecują pełnej powtarzalności, szczególnie między wersjami modelu, więc nie buduj strategii na złudzeniu "teraz jest deterministycznie". Po drugie, odróżniaj niestabilność infrastruktury od zmienności modelu. Przekroczenie czasu i błąd 429 to problemy infrastruktury - tu ponawianie z limitem prób jest uczciwe. Odpowiedź, która raz spełnia kryteria, a raz nie, to sygnał pomiarowy - ponawianie jej do skutku jest fałszowaniem wyniku, bo dokładnie tę częstość niepowodzeń chcesz znać.

Budżet tokenów na ewaluacje planuj jawnie, jak planuje się budżet czasu potoku CI: wielkość zbioru razy średnia długość odpowiedzi razy liczba powtórzeń. Gdy koszt rośnie, tnij świadomie - losowa próbka przy zmianach, pełny zbiór nocą - zamiast po cichu rezygnować z pomiaru w ogóle.

## QA projektuje wyrocznie, nie kroki

Najgłębsza zmiana nie dotyczy narzędzi, tylko roli. W klasycznej automatyzacji większość pracy szła w kroki: kliknij, wpisz, sprawdź. Wyrocznia testowa - definicja tego, co znaczy "poprawnie" - była trywialna, bo dawał ją deterministyczny system. Przy aplikacjach z LLM proporcje się odwracają: kroki są nudne (wyślij prompt, odbierz odpowiedź), a cała trudność siedzi w wyroczni. Co dokładnie znaczy "dobre podsumowanie"? Które pominięcie jest błędem krytycznym, a które dopuszczalnym skrótem? To pytania domenowe i QA nie rozstrzyga ich w pojedynkę - ale to QA musi je zadać, spisać odpowiedzi jako rubryki i walidatory, a potem pilnować, żeby nie zgniły.

W praktyce oznacza to nowy zestaw kompetencji: projektowanie zbiorów przypadków, podstawy statystyki na poziomie "jaka próbka uzasadnia jaki wniosek", czytanie i przegląd promptów jak kodu. I jedną kompetencję starą jak samo testowanie: nieufność wobec zielonego koloru. Nie uważam tej zmiany za degradację rzemiosła. To powrót do jego rdzenia - testowanie zawsze było projektowaniem wyroczni, tylko deterministyczne oprogramowanie pozwalało o tym zapomnieć.

## Podsumowanie

Aplikacji z modelem językowym w środku nie testuje się jedną techniką, tylko warstwami. Większość systemu to zwykły kod - testuj go klasycznie, z atrapą modelu i nagranymi odpowiedziami na przypadki brzegowe. Na granicy modelu postaw deterministyczne kontrakty struktury: schemat, typy, limity. Treść oceniaj asercjami własności, a tam, gdzie własności nie wystarczą, ewaluacjami na zbiorach z progiem odsetka zaliczeń i sędzią LLM skalibrowanym na ludzkich ocenach. W CI rozłóż koszty piramidą: atrapy przy każdym commicie, kontrakty przy zmianach promptu, pełne ewaluacje nocą i przed wydaniem. A jeśli chcesz zacząć jutro rano: weź jedną funkcję z LLM w swojej aplikacji, spisz pięć własności, które każda poprawna odpowiedź musi spełniać, i zamień je w asercje. Masz pierwszą ewaluację - reszta to skalowanie.
