---
title: "Ewaluacje dla zwykłych ludzi: skąd wiesz, że twój prompt w ogóle działa?"
description: "Minimalny proces ewaluacji promptów bez frameworka: złoty zestaw dziesięciu przypadków, binarne kryteria, tabelka z porównaniem A/B i trzy pułapki, które psują pomiar."
date: 2026-07-23
tags: ["ai", "prompt-engineering", "ewaluacje", "qa", "testy"]
lang: pl
readingTime: 9
author: GH
---

Poprawiłeś prompt, wkleiłeś jeden przykład, wynik wyglądał lepiej - i uznałeś sprawę za zamkniętą. Tak pracuje z promptami większość ludzi, których znam, łącznie ze mną sprzed dwóch lat. Problem w tym, że "wyglądało lepiej" na jednym przykładzie to nie pomiar, tylko wróżenie. A wystarczy mały złoty zestaw przykładów i tabelka, żeby zmiany w promptach przestały być loterią.

## Dlaczego "na oko" zawodzi

Modele językowe są niedeterministyczne: ten sam prompt potrafi dać różne odpowiedzi w dwóch kolejnych uruchomieniach. Oceniając zmianę na jednym przykładzie, nie wiesz, czy widzisz efekt swojej poprawki, czy zwykły szum próbkowania. Druga pułapka jest podstępniejsza: regresja. Dopisek, który naprawił przypadek X, po cichu zepsuł przypadki Y i Z - a tych akurat nie sprawdziłeś, bo patrzyłeś tylko na X. W testowaniu oprogramowania nikt przy zdrowych zmysłach nie wdraża poprawki bez testów regresji. W pracy z promptami robimy to nagminnie.

Ewaluacja - po naszemu: systematyczne sprawdzenie, jak prompt radzi sobie na stałym zestawie przypadków - to dokładnie ten brakujący test regresji. I wbrew temu, co sugerują dostawcy platform, nie potrzebujesz do niej żadnego frameworka. Potrzebujesz pliku z przykładami, kryteriów oceny i godziny pracy.

## Krok 1: złoty zestaw, czyli 10 przypadków

Złoty zestaw to lista przypadków testowych z ustaloną poprawną odpowiedzią. Dla zadań klasyfikacyjnych: wejście plus oczekiwana etykieta. Dla generowania tekstu: wejście plus lista cech, które dobra odpowiedź musi mieć. Zaczynam zawsze od dziesięciu przypadków, dobranych według prostego klucza:

- **4-5 przypadków typowych** - codzienność, którą prompt musi obsługiwać bezbłędnie.
- **3-4 przypadki brzegowe** - dwuznaczne, niekompletne, z pułapką. To tutaj prompty naprawdę się różnią.
- **1-2 przypadki negatywne** - wejścia, na które poprawną reakcją jest odmowa albo kategoria "inne", a nie wymuszona odpowiedź.

Skąd brać przypadki? Najlepiej z życia: realne zgłoszenia, realne pytania, zanonimizowane. Jeśli ich nie masz, wygeneruj kandydatów modelem, ale etykiety nadaj ręcznie - złoty zestaw, którego nie zweryfikował człowiek, mierzy zgodność modelu z modelem, nie jakość.

## Krok 2: kryteria, czyli co znaczy "działa"

Dla klasyfikacji kryterium jest oczywiste: etykieta zgodna z oczekiwaną. Dla zadań generatywnych rozbij ocenę na 2-4 kryteria binarne - tak/nie, bez skali ocen. "Czy odpowiedź zawiera wszystkie wymagane pola?", "Czy format jest zgodny z szablonem?", "Czy nie zmyśla danych spoza wejścia?". Binarne kryteria są mniej wygodne niż gwiazdki od 1 do 5, ale za to dwóch oceniających da te same wyniki - a ocena, która zależy od humoru oceniającego, niczego nie mierzy.

## Krok 3: tabela, czyli cały "framework"

Pokażę na syntetycznym przykładzie. SklepDemo, sklep internetowy ze średnim ruchem, chce promptem klasyfikować zgłoszenia klientów do czterech kategorii: *zwrot*, *reklamacja*, *dostawa*, *inne*. Prompt A to wersja podstawowa ("przypisz zgłoszenie do jednej z kategorii"). Prompt B dodaje definicje kategorii i dwa przykłady rozstrzygnięć granicznych. Złoty zestaw - dziesięć zgłoszeń, ocena: zgodność etykiety.

| Lp. | Zgłoszenie (skrót) | Oczekiwane | Prompt A | Prompt B |
|---|---|---|---|---|
| 1 | "Chcę odesłać buty, za małe" | zwrot | zwrot | zwrot |
| 2 | "Paczka od tygodnia w sortowni" | dostawa | dostawa | dostawa |
| 3 | "Ekspres przestał działać po 2 tygodniach" | reklamacja | reklamacja | reklamacja |
| 4 | "Kurier zostawił paczkę pod drzwiami, zginęła" | dostawa | reklamacja | dostawa |
| 5 | "Produkt niezgodny z opisem, chcę oddać" | reklamacja | zwrot | reklamacja |
| 6 | "Jaki jest status zamówienia 4412?" | inne | dostawa | inne |
| 7 | "Faktura ma błędny NIP" | inne | inne | inne |
| 8 | "Dostałem inny kolor niż zamawiałem" | reklamacja | reklamacja | reklamacja |
| 9 | "Czy mogę zmienić adres dostawy?" | dostawa | dostawa | inne |
| 10 | "Zwrot z zamówienia 8821 nie dotarł na konto" | zwrot | zwrot | zwrot |

Wynik: prompt A - 7/10, prompt B - 9/10. I od razu dwie obserwacje, których "na oko" nigdy bym nie zrobił. Po pierwsze, B wygrywa właśnie na przypadkach granicznych (4, 5, 6) - definicje kategorii zrobiły swoją robotę. Po drugie, B wprowadził regresję w przypadku 9, który A klasyfikował dobrze. Bez tabeli zobaczyłbym tylko poprawę tam, gdzie patrzyłem, a regresja wyszłaby na produkcji, w rozmowie z klientem.

> Jeden przykład mówi ci, że prompt potrafi zadziałać. Dziesięć przykładów mówi ci, kiedy nie działa - a to jest informacja, za którą się płaci.

## Krok 4: porównanie A/B bez oszukiwania samego siebie

Trzy zasady, które przeniosłem żywcem z QA. Pierwsza: jedna zmiana naraz. Jeśli między wersją A i B zmieniłeś definicje kategorii, kolejność sekcji i dodałeś przykłady, to wiesz tylko tyle, że "coś" pomogło - i przy następnej regresji nie będziesz wiedział, co wycofać. Druga: każdy przypadek uruchamiaj 2-3 razy, jeśli zadanie jest choć trochę niedeterministyczne. Przypadek, który raz przechodzi, raz nie, to osobna, cenna informacja - odpowiednik testu niestabilnego (flaky), czyli taki, który zdradza, że prompt balansuje na granicy. Trzecia: wynik zapisuj z datą i wersją promptu. Plik `ewaluacje.md` w repo wystarczy; za trzy miesiące będzie na wagę złota, gdy ktoś zapyta, czemu prompt wygląda tak dziwacznie.

## Jak to rośnie razem z tobą

Dziesięć przypadków to start, nie sufit. Mój rytm utrzymania jest prosty: każdy błąd promptu znaleziony na produkcji albo zgłoszony przez użytkownika trafia do zestawu jako nowy przypadek. To dokładnie ta sama praktyka, co pisanie testu regresji do każdego naprawionego defektu. Po kwartale zestaw ma 25-30 pozycji i pokrywa prawdziwy, a nie wyobrażony rozkład problemów.

Kiedy przypadków robi się więcej niż da się wygodnie sprawdzać ręcznie, czas na prosty skrypt: pętla po pliku CSV, wywołanie API, porównanie etykiet, wynik procentowy. To wciąż jest jedno popołudnie pracy, nie projekt. Frameworki do ewaluacji mają sens, gdy zestawy idą w setki przypadków, ocenia wiele osób i potrzebujesz historii w czasie - czyli później, niż podpowiada marketing, a często wcale.

Jest jeszcze wariant z modelem w roli sędziego - drugi model ocenia odpowiedzi pierwszego według twoich kryteriów. Używam go jako wstępnego filtra przy kryteriach generatywnych, ale z zasadą ograniczonego zaufania: sędziego też trzeba raz zewaluować, na próbce ocenionej przez człowieka. Inaczej automatyzujesz nie ocenę, tylko złudzenie oceny.

## Trzy pułapki, które psują ewaluację

**Przeuczenie do zestawu.** Jeśli poprawiasz prompt tak długo, aż przejdzie wszystkie dziesięć przypadków, ryzykujesz, że zoptymalizowałeś go pod te konkretne dziesięć zdań, a nie pod problem. Objaw: 10/10 na zestawie, a użytkownicy dalej zgłaszają błędy. Obrona jest prosta: trzymaj 2-3 przypadki w rezerwie, których nie oglądasz przy poprawianiu promptu, i sprawdzaj je dopiero na końcu, jak zestaw kontrolny. Albo co kilka tygodni wymieniaj część przypadków na świeże z produkcji.

**Przeciek przykładów.** Jeśli w promptcie B umieściłeś jako przykłady te same zgłoszenia, które masz w złotym zestawie, to nie mierzysz generalizacji, tylko zdolność modelu do kopiowania. Przykłady w promptcie i przypadki w zestawie muszą być rozłączne - to odpowiednik żelaznej zasady oddzielania danych treningowych od testowych, tylko w wersji dla zwykłych ludzi.

**Zestaw, który niczego nie różnicuje.** Jeśli obie wersje promptu mają 10/10, to nie znaczy, że obie są świetne - znaczy, że zestaw jest za łatwy i przestał cokolwiek mierzyć. Zdrowy złoty zestaw powinien być oblewalny: najlepsza wersja promptu powinna mieć na nim 80-90%, nie komplet. Brzmi przewrotnie, ale zestaw z kompletem punktów to narzędzie pomiarowe z uciętą skalą - dokładnie jak zestaw testów, który zawsze świeci na zielono i którego nikt już nie czyta.

## To jest myślenie QA, nie nauka o danych

Zwróć uwagę, że nigdzie w tym procesie nie padło słowo o statystyce, metrykach F1 ani zbiorach walidacyjnych. Świadomie. Ewaluacja promptu w zespole produktowym to w istocie test akceptacyjny: stały zestaw przypadków, jednoznaczne kryteria, porównanie przed/po, rejestr wyników. Każdy tester robił to setki razy - zmienia się tylko obiekt testowany. I tak jak w testowaniu, największa wartość nie leży w liczbie, która wychodzi na końcu, tylko w przypadkach, które oblały: one mówią, co konkretnie poprawić w następnej wersji promptu.

## Podsumowanie

Poprawianie promptów bez ewaluacji to wróżenie z jednego przykładu, w którym regresje wychodzą na produkcji. Minimalny proces kosztuje godzinę: dziesięć przypadków z ręcznie nadanymi etykietami (typowe, brzegowe, negatywne), binarne kryteria oceny, tabelka z porównaniem wersji A/B i jedna zmiana promptu naraz. Każdy błąd z produkcji dokładasz do zestawu, a skrypt i frameworki dokupujesz dopiero wtedy, gdy ręczne sprawdzanie realnie przestaje się domykać. Weź swój najczęściej używany prompt i zbuduj dla niego dziesięć przypadków jeszcze w tym tygodniu - pierwsza tabelka zwykle wystarcza, żeby już nigdy nie chcieć wracać do "na oko".
