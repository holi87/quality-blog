---
title: "Testowanie oparte na ryzyku w praktyce: jak decydować, czego NIE testować"
description: "Prosty model macierzy wpływu i prawdopodobieństwa, realny przebieg wydania, w którym połowa zakresu poszła bez testów, oraz sposób komunikowania tych decyzji biznesowi."
date: 2026-07-08
tags: ["qa", "ryzyko", "testy", "strategia"]
lang: pl
readingTime: 9
author: GH
---

Nigdy nie przetestujesz wszystkiego. To nie jest opinia, to arytmetyka: liczba kombinacji danych, konfiguracji i ścieżek w przeciętnej aplikacji webowej przekracza budżet czasowy każdego zespołu o kilka rzędów wielkości. Prawdziwe pytanie brzmi inaczej: co świadomie odpuszczasz i czy umiesz tę decyzję obronić przed zespołem oraz biznesem. W tym tekście pokazuję prosty model, który stosuję od lat - macierz wpływu i prawdopodobieństwa - oraz realny przebieg wydania, w którym połowa zakresu poszła bez testów. Celowo i z podpisem interesariuszy.

## Pełne pokrycie to iluzja, której nikt nie rozliczy

Zacznijmy od rachunku. Syntetyczny sklep internetowy SklepDemo: 38 ekranów, 4 role użytkownika, 3 metody płatności, 2 języki, 5 obsługiwanych przeglądarek. Sama kombinatoryka ścieżek zakupowych daje kilkanaście tysięcy wariantów. Przy 10 minutach na ręczne sprawdzenie jednego wariantu mówimy o latach pracy jednej osoby - na jedno wydanie.

Zespoły, które deklarują „testujemy wszystko", w praktyce testują to, co przyszło im do głowy najpierw. To najgorszy możliwy wybór zakresu: przypadkowy, nieudokumentowany i niemożliwy do obrony, gdy coś pęknie na produkcji. Bo pęknie - pytanie tylko, czy w miejscu, które odpuściłeś świadomie, czy w miejscu, o którym nikt nie pomyślał.

> Nieprzetestowane świadomie i nieprzetestowane przypadkiem to dwa różne stany. Pierwszy jest decyzją zarządczą z podpisem. Drugi jest zaniedbaniem, które wyjdzie w najmniej wygodnym momencie.

## Model: wpływ razy prawdopodobieństwo

Testowanie oparte na ryzyku sprowadza się do dwóch pytań zadanych każdemu elementowi zakresu. Pierwsze: co się stanie, jeśli to nie zadziała (wpływ)? Drugie: jak bardzo prawdopodobne jest, że nie zadziała (prawdopodobieństwo)? Iloczyn tych dwóch ocen wyznacza priorytet testowy.

Wpływ oceniam po trzech osiach: pieniądze (czy błąd zatrzymuje przychód lub generuje koszt), użytkownicy (ilu i jak mocno ich dotknie), zgodność z prawem (faktury, dane osobowe, regulacje). Prawdopodobieństwo po czterech: nowość kodu (świeży kod psuje się częściej niż stary), złożoność (warunki brzegowe, współbieżność, daty), historia zmian (moduł, który pękał trzy razy, pęknie czwarty) i liczba integracji (każdy system zewnętrzny to dodatkowe ryzyko).

Skala wystarczy trzystopniowa: niski, średni, wysoki. Widziałem zespoły z dziesięciostopniowymi skalami i wagami ważonymi - dyskusja o tym, czy coś jest „7 czy 8", zjadała więcej czasu niż testy. Trzy stopnie ocenia się w minutę i to wystarcza do decyzji.

| Prawdopodobieństwo \ Wpływ | Wysoki wpływ | Średni wpływ | Niski wpływ |
|---|---|---|---|
| **Wysokie** | Testuj dogłębnie: scenariusze, brzegi, automaty regresji | Testuj główne ścieżki + najgroźniejsze brzegi | Szybki test dymny, reszta odpuszczona |
| **Średnie** | Testuj główne ścieżki, monitoruj po wydaniu | Test dymny + jeden scenariusz negatywny | Bez testów, monitoring |
| **Niskie** | Test dymny + alarm w monitoringu | Bez testów, monitoring | Bez testów, świadomie |

Cała wartość macierzy siedzi w trzech dolnych prawych polach. To one mówią wprost: tego nie testujemy. Bez tych pól macierz jest tylko ozdobą dokumentacji.

## Mapowanie na funkcje: wydanie 2.14 SklepuDemo

Teoria działa dopiero na konkretnym zakresie. Wydanie 2.14 SklepuDemo zawierało osiem zmian. Sesja oceny ryzyka zajęła 40 minut z udziałem programisty, właściciela produktu i mnie. Wynik:

- **Nowy dostawca płatności** - wpływ wysoki (przychód), prawdopodobieństwo wysokie (nowa integracja). Pełny zakres: scenariusze pozytywne, odrzucenia, przekroczenia czasu, zwroty, automaty.
- **Zmiana naliczania rabatów koszykowych** - wpływ wysoki (pieniądze, reklamacje), prawdopodobieństwo wysokie (logika warunkowa, historia błędów). Pełny zakres + testy brzegowe na progach rabatów.
- **Przebudowa strony „o nas"** - wpływ niski, prawdopodobieństwo niskie. Jeden rzut oka, zero scenariuszy.
- **Nowe banery promocyjne w panelu administratora** - wpływ niski (widzi 6 osób wewnętrznie), prawdopodobieństwo średnie. Bez testów, zgłoszenia od administratorów jako sygnał.
- **Aktualizacja biblioteki logowania zdarzeń** - wpływ średni, prawdopodobieństwo niskie (zmiana wersji łatki). Test dymny: czy logi w ogóle płyną.
- **Sortowanie listy produktów po popularności** - wpływ średni, prawdopodobieństwo niskie. Jeden scenariusz, bez brzegów.
- **Poprawka literówek w szablonach poczty** - wpływ niski, prawdopodobieństwo niskie. Bez testów.
- **Zmiana koloru przycisków w koszyku** - wpływ niski, prawdopodobieństwo niskie. Bez testów.

Cztery z ośmiu pozycji poszły na produkcję bez ani jednego wykonanego scenariusza. Połowa zakresu. I to była najlepsza decyzja tego wydania, bo zaoszczędzone dwa dni poszły na brzegi naliczania rabatów - gdzie znaleźliśmy błąd zaokrąglenia, który przy progu 199,99 zł naliczał rabat od kwoty sprzed dodania kosztów dostawy. Na produkcji kosztowałby realne pieniądze i zaufanie.

## Komunikacja: decyzja bez podpisu nie istnieje

Najczęstszy błąd zespołów, które wdrażają testowanie oparte na ryzyku: macierz powstaje, ale zostaje w notatkach QA. Potem coś pęka w polu „bez testów" i zaczyna się szukanie winnego. Tester broni się sam, bo decyzja formalnie była jego.

Dlatego wynik oceny ryzyka spisuję na jednej stronie i wysyłam do właściciela produktu z prośbą o jawne potwierdzenie. Format jest banalny: lista pozycji, ocena, decyzja, konsekwencja. Przy pozycjach „bez testów" jedno zdanie o tym, co się stanie w najgorszym przypadku i jak to wykryjemy (monitoring, zgłoszenia, alarmy). Właściciel produktu odpisuje „akceptuję" albo przesuwa coś w górę macierzy - i wtedy razem decydujemy, co spada w dół, bo budżet czasu się nie rozciąga.

Ta jedna strona zmienia dynamikę rozmowy po awarii. Zamiast „dlaczego tego nie przetestowaliście" pada „zaakceptowaliśmy to ryzyko wspólnie, wykryliśmy je w 20 minut przez alarm, poprawka w drodze". To różnica między QA jako kozłem ofiarnym a QA jako funkcją zarządzania ryzykiem.

## „Nie testujemy" nie znaczy „ignorujemy"

Pole „bez testów" w macierzy ma swoje zabezpieczenia. Po pierwsze monitoring: jeśli odpuszczam testy banerów w panelu, upewniam się, że błędy JavaScriptu z tego panelu w ogóle gdzieś spływają. Po drugie przełączniki funkcji: nową, nietestowaną funkcjonalność lepiej wypuścić z możliwością wyłączenia bez wdrożenia. Po trzecie kanał zgłoszeń: administratorzy SklepuDemo wiedzieli, że banery idą bez testów i mieli wskazane miejsce na zgłoszenia.

Odpuszczenie testu to przeniesienie wykrywania błędu z fazy testów na produkcję - świadome i tańsze, o ile koszt błędu na produkcji jest niski, a wykrycie szybkie. Jeśli któryś z tych warunków nie zachodzi, pozycja nie powinna była trafić do pola „bez testów". Macierz wtedy kłamie i trzeba ją poprawić, nie obejść.

## Skąd brać dane, żeby ocena nie była zgadywaniem

Macierz jest tak dobra jak oceny, które do niej wkładasz. Dobra wiadomość: większość danych już masz. Prawdopodobieństwo awarii czytam z trzech źródeł. Historia zgłoszeń: moduły z największą liczbą defektów w ostatnich sześciu miesiącach to pierwsi kandydaci na „wysokie". Statystyki zmian z repozytorium: pliki zmieniane najczęściej i przez największą liczbę osób psują się statystycznie częściej - jedno polecenie na historii repozytorium daje listę gorących punktów. Rozmiar zmiany w wydaniu: zmiana na 40 plików niesie inne ryzyko niż zmiana na 3 pliki, niezależnie od deklaracji programisty, że „to tylko refaktoryzacja".

Wpływ z kolei czytam z danych biznesowych: które funkcje generują przychód (analityka sklepu powie, że 92% zamówień w SklepieDemo przechodzi przez 3 z 11 ścieżek zakupowych), które obszary mają zobowiązania umowne albo regulacyjne, ile kosztował ostatni incydent w danym module. Godzina z analityką raz na kwartał ustawia oceny wpływu na długo - wpływ zmienia się wolno, to prawdopodobieństwo skacze z wydania na wydanie.

## Pułapki, które widziałem najczęściej

Trzy powtarzalne błędy. Pierwszy: wszystko ląduje w polu „wysokie ryzyko", bo nikt nie chce wziąć odpowiedzialności za obniżenie oceny. Macierz, w której 80% pozycji ma najwyższy priorytet, nie podejmuje żadnej decyzji. Lekarstwo: wymuszony rozkład - maksymalnie jedna trzecia zakresu może być „wysoka".

Drugi: ocena robiona raz, na początku projektu, nigdy nieaktualizowana. Ryzyko żyje - moduł stabilny przez rok spada w dół, moduł po dużej przebudowie skacze w górę. Oceniaj per wydanie, nie per projekt; 30-40 minut na wydanie to cały koszt.

Trzeci: QA ocenia w pojedynkę. Tester zwykle dobrze czuje prawdopodobieństwo awarii, ale wpływ biznesowy zna właściciel produktu, a kruchość kodu - programista. Ocena solo daje macierz przechyloną w stronę tego, co tester zna najlepiej.

Jest i czwarta pułapka, subtelniejsza: macierz traktowana jako dokument zamiast jako rozmowa. Najwięcej wartości z sesji oceny ryzyka nie pochodzi z wypełnionej tabeli, tylko z momentów, gdy programista mówi „a, przy okazji ta zmiana dotyka też modułu faktur" - czego nie było w żadnym opisie zadania. Sesja oceny to najtańsze spotkanie wymiany wiedzy o ryzyku, jakie znam. Tabela jest tylko protokołem z tej rozmowy.

## Podsumowanie

Testowanie oparte na ryzyku to nie technika optymalizacji - to uczciwość wobec faktu, że zasoby są skończone. Macierz wpływu i prawdopodobieństwa w wersji trzystopniowej wystarcza, by w 40 minut zdecydować o zakresie wydania. Kluczowe są pola „bez testów": muszą być jawne, zabezpieczone monitoringiem i podpisane przez biznes. Jeśli po następnym wydaniu nie umiesz wskazać, czego świadomie nie testowałeś, to nie zarządzasz ryzykiem - tylko masz nadzieję. Spróbuj przy najbliższym wydaniu: jedna tabela, trzy stopnie, podpis właściciela produktu.
