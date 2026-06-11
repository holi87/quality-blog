---
title: "Tester w code review: co możesz wnieść, nawet jeśli nie piszesz kodu na co dzień"
description: "Czego tester powinien szukać w zgłaszanych zmianach, lista kontrolna na pierwsze przeglądy i plan dołączenia do procesu bez wchodzenia programistom w kompetencje."
date: 2026-07-29
tags: ["qa", "code-review", "rola-testera", "wspolpraca"]
lang: pl
readingTime: 9
author: GH
---

Code review (przegląd kodu) to najtańszy moment na złapanie błędu po jego napisaniu: zmiana jest mała, kontekst świeży, poprawka kosztuje minuty. A mimo to testerzy prawie nigdy w przeglądach nie uczestniczą - „bo nie piszą kodu". To nieporozumienie kosztujące zespoły realne błędy. Pokazuję, czego tester powinien szukać w zgłaszanych zmianach, daję listę kontrolną do pierwszych przeglądów i opisuję, jak dołączyć do procesu, nie wchodząc nikomu w kompetencje i nie spowalniając zespołu.

## Dlaczego to najtańszy moment - i dlaczego cię tam nie ma

Rachunek jest prosty. Błąd znaleziony w przeglądzie kodu: programista poprawia w tej samej zmianie, koszt 10-30 minut. Ten sam błąd znaleziony w testach: zgłoszenie, odtworzenie, przełączanie kontekstu programisty, poprawka, ponowny test - pół dnia do dwóch dni. Na produkcji: dolicz obsługę incydentu i klienta. Każde przesunięcie wykrycia w lewo dzieli koszt przez kilka do kilkunastu.

Testera nie ma w przeglądach z dwóch powodów. Pierwszy to przekonanie samego testera: „nie napiszę tego lepiej, więc co mam tam robić". Drugi to przekonanie zespołu: przegląd kodu służy ocenie jakości implementacji. Oba są błędne w ten sam sposób - mylą przegląd kodu z konkursem na kod. Przegląd to ostatnia tania okazja, by na zmianę spojrzało drugie oko z innym pytaniem w głowie. Programista-recenzent pyta „czy to jest dobrze napisane". Tester pyta „co tu się zepsuje i skąd będziemy wiedzieć". To różne pytania i oba są potrzebne.

## Czego tester szuka w zmianie - pięć obszarów

**Przypadki brzegowe.** Nie musisz rozumieć każdej linii, żeby zobaczyć w warunku `if (kwota > 100)` pytanie: a co przy dokładnie 100? Granice przedziałów, pusta lista, zero, wartość ujemna, bardzo długi tekst, polskie znaki, strefa czasowa. To jest dokładnie warsztat projektowania testów - tyle że zastosowany do kodu przed scaleniem, a nie do aplikacji po wydaniu.

**Obsługa błędów.** Co się dzieje, gdy wywołanie zewnętrznej usługi nie odpowie? Szukasz pustych bloków przechwytywania wyjątków, błędów połkniętych bez śladu w logach, komunikatów typu „wystąpił błąd" bez informacji, co użytkownik ma zrobić. Nie musisz znać składni - puste miejsce po „co jeśli się nie uda" widać gołym okiem.

**Walidacja wejścia.** Każde pole formularza, parametr adresu, nagłówek: czy ktoś sprawdza długość, format, zakres? Czy walidacja jest po stronie serwera, czy tylko w przeglądarce? Tu tester często wie więcej niż recenzent-programista, bo to tester potem wkleja w pole imienia tysiąc znaków i apostrof.

**Zmiany bez testów.** Najprostszy sygnał: zmiana dotyka logiki naliczania rabatu, a w plikach zmiany nie ma ani jednego pliku testowego. Albo jest - i test sprawdza wyłącznie ścieżkę szczęśliwą. Pytanie „jaki test złapałby regresję tej zmiany?" jest zawsze zasadne i zawsze twoje.

**Testowalność i obserwowalność.** Czy nazwy mówią, co kod robi? Czy nowa funkcja loguje cokolwiek, po czym na produkcji poznasz, że działa? Czy da się ją wywołać w teście bez stawiania połowy systemu? Jeśli czytasz zmianę i nie umiesz powiedzieć, jak byś to przetestował - to jest uwaga do zgłoszenia, nie twój brak kompetencji.

## Lista kontrolna testera do przeglądu

Na pierwsze tygodnie - dziesięć pytań do każdej przeglądanej zmiany:

1. Czy rozumiem, jaki problem użytkownika ta zmiana rozwiązuje? Jeśli nie - pytam, zanim ocenię cokolwiek innego.
2. Jakie wartości brzegowe widzę w warunkach (progi, zakresy, daty) i czy któraś jest obsłużona „o jeden za mało / za dużo"?
3. Co się stanie przy pustym, zerowym, zduplikowanym i ekstremalnie dużym wejściu?
4. Czy każda ścieżka błędu kończy się czytelnym komunikatem i wpisem w logu?
5. Czy walidacja danych jest po stronie serwera?
6. Czy zmiana ma testy i czy testy sprawdzają coś poza ścieżką szczęśliwą?
7. Jaki test złapałby regresję tej zmiany za pół roku?
8. Czy zmiana dotyka danych (migracje, formaty) - i co z rekordami, które powstały przed nią?
9. Czy po wdrożeniu poznam z logów i metryk, że to działa?
10. Czy w opisie zmiany jest coś, czego nie widzę w kodzie - obietnica bez pokrycia?

Po miesiącu połowa tych pytań wejdzie ci w nawyk i lista przestanie być potrzebna.

## Przykład: jedna uwaga warta tygodnia reklamacji

Syntetyczny przypadek z projektu SklepDemo. Zmiana: nowe naliczanie rabatu progowego - 10% powyżej 200 zł. W kodzie warunek `suma > 200`. Komentarz testera w przeglądzie: „A koszyk za dokładnie 200 zł? W regulaminie promocji jest «od 200 zł»". Programista poprawił na `>=` w trzy minuty. Gdyby to wyszło po wydaniu: klienci z koszykiem za równe 200 zł bez obiecanego rabatu, zgłoszenia, korekty, przeprosiny. Tester nie napisał ani linii kodu - przeczytał jeden warunek i porównał z wymaganiem. To jest cała magia.

Zwróć uwagę, co tu naprawdę zadziałało: tester był jedyną osobą w przeglądzie, która czytała kod z regulaminem promocji w drugim oknie. Recenzent-programista porównywał kod z własnym wyobrażeniem o tym, jak powinien wyglądać dobry kod. Tester porównywał kod z wymaganiem. Ta różnica perspektyw to dokładnie ten wkład, którego żadna liczba programistów w przeglądzie nie zastąpi.

> Najlepszy komentarz testera w przeglądzie kodu to pytanie, nie wyrok. „Co się stanie, gdy..." otwiera rozmowę i znajduje błąd. „To jest źle napisane" zamyka rozmowę i znajduje konflikt.

## Jak dołączyć do procesu, nie wchodząc nikomu w drogę

Kolejność ma znaczenie. Nie zaczynaj od prośby o uprawnienia blokowania scalenia - zaczynasz jako głos doradczy, nie bramka. Konkretny plan wejścia:

- **Tydzień 1-2: czytaj bez komentowania.** Wybierz 2-3 zmiany tygodniowo z obszarów, które i tak testujesz. Ucz się, jak zespół opisuje zmiany i jak wyglądają testy.
- **Tydzień 3-4: komentuj pytaniami.** Wyłącznie forma pytania, wyłącznie obszary z listy kontrolnej. Zero uwag o stylu kodu, formatowaniu i nazwach zmiennych lokalnych - to kompetencja programistów i najszybszy sposób, żeby cię przestali zapraszać.
- **Miesiąc 2: umowa z zespołem.** Jeśli pytania łapią realne problemy (a złapią), zaproponuj zasadę: zmiany w obszarach krytycznych dostają przegląd testerski, z twardym limitem czasu odpowiedzi - u mnie sprawdza się 6 godzin roboczych. Po limicie zmiana jedzie dalej bez ciebie. To zdejmuje argument „QA nas spowolni".
- **Stale: wybieraj po ryzyku.** Nie przeglądaj wszystkiego. Płatności, uprawnienia, migracje danych, naliczenia - tak. Poprawka literówki - nie. Twój czas w przeglądach to inwestycja i podlega tej samej macierzy ryzyka co testy.

Jest jeszcze korzyść, o której mało kto mówi: przeglądy to najszybsza nauka systemu, jaką tester ma do dyspozycji. Po kwartale czytania zmian wiesz, gdzie kod jest kruchy, zanim cokolwiek pęknie - i twoje plany testów zaczynają trafiać w słabe punkty zamiast równo pokrywać wszystko.

## Trzy obawy, które usłyszysz - i jak je rozbroić

**„Nie znam tego języka programowania."** Nie musisz. Z pięciu obszarów z listy kontrolnej cztery czyta się na poziomie warunków, nazw i struktury - to umiejętność czytania, nie pisania. Po miesiącu regularnych przeglądów składnia przestaje przeszkadzać, a fragment, którego naprawdę nie rozumiesz, jest pretekstem do najlepszego rodzaju pytania: „możesz mi powiedzieć, co ten kawałek robi?". Zaskakująco często programista, tłumacząc, sam znajduje błąd.

**„Programiści poczują, że wchodzę im w kompetencje."** Poczują - jeśli zaczniesz od uwag o stylu i architekturze. Nie poczują - jeśli trzymasz się swojej działki: brzegi, błędy, walidacja, testy, obserwowalność. To obszary, w których programista-recenzent jest najsłabszy, bo patrzy na kod oczami autora podobnego kodu. Po kilku trafnych pytaniach zespół sam zacznie cię oznaczać przy zmianach „bo ty zawsze znajdziesz ten przypadek z zerem".

**„To zje czas na testowanie."** Policz w obie strony. Dwa-trzy przeglądy tygodniowo to 1,5-2 godziny. Jedno zgłoszenie błędu, którego nie musiałeś pisać - z odtworzeniem, opisem i ponownym testem po poprawce - to godzina do trzech. Bilans wychodzi na zero już przy jednym złapanym błędzie tygodniowo, a wszystko powyżej jest czystym zyskiem. U mnie po kwartale praktyki liczba zgłoszeń z testów w obszarach objętych przeglądami spadła o około jedną czwartą - te błędy po prostu nie zdążyły powstać.

## Podsumowanie

Przegląd kodu to najtańszy punkt wykrywania błędów, a perspektywa testera - brzegi, błędy, walidacja, brak testów, obserwowalność - uzupełnia tam perspektywę programisty zamiast z nią konkurować. Wejdź w proces stopniowo: najpierw czytaj, potem pytaj, potem umów zasady z limitem czasu, zawsze wybieraj zmiany po ryzyku. Nie oceniaj stylu kodu i formułuj uwagi jako pytania. Jedna trafna uwaga przy warunku brzegowym potrafi zwrócić miesiące tej praktyki. Zacznij od dwóch zmian w przyszłym tygodniu - z listą kontrolną z tego tekstu.
