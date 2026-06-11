---
title: "Fine-tuning, RAG czy dłuższy prompt? Drzewo decyzyjne bez marketingu"
description: "Pięciopunktowe drzewo decyzyjne dla zespołów bez działu ML: kiedy wystarczy prompt z przykładami, kiedy potrzebny jest RAG, a kiedy naprawdę opłaca się dostrajanie - z tabelą kosztów, czasu i ryzyka."
date: 2026-07-30
tags: ["ai", "rag", "fine-tuning", "prompt-engineering", "llm"]
lang: pl
readingTime: 9
author: GH
---

Na konferencjach każdy problem z modelem rozwiązuje się dostrajaniem (fine-tuning) - brzmi poważnie, dobrze wygląda na slajdach i uzasadnia budżet. W praktyce zespołów, które nie mają działu ML, w dziewięciu przypadkach na dziesięć wystarczy porządny prompt z przykładami albo RAG. Poniżej drzewo decyzyjne, rachunek kosztów i lista rzeczy, które się psują w każdym z trzech podejść.

## Trzy podejścia w trzech zdaniach

**Dłuższy prompt** to dostarczenie modelowi wiedzy i wzorców bezpośrednio w zapytaniu: instrukcje, definicje, 3-10 przykładów wejście-wyjście. Zero infrastruktury, zmiana w pięć minut, efekt natychmiast.

**RAG** (generowanie wspomagane wyszukiwaniem) to doklejanie do promptu fragmentów twoich dokumentów, wyszukanych automatycznie pod konkretne pytanie. Model nie musi niczego "pamiętać" - dostaje właściwe akapity z bazy wiedzy w momencie zapytania.

**Dostrajanie (fine-tuning)** to dalsze trenowanie istniejącego modelu na setkach lub tysiącach twoich przykładów, żeby zmienić jego domyślne zachowanie: styl, format, sposób rozumowania w wąskiej domenie. Powstaje nowy wariant modelu, który trzeba utrzymywać jak każdy artefakt produkcyjny.

Kluczowe nieporozumienie, od którego zaczyna się większość złych decyzji: dostrajanie kiepsko nadaje się do wstrzykiwania wiedzy. Model dostrojony na twojej dokumentacji nie staje się jej wiarygodnym źródłem - dalej potrafi zmyślać, tylko teraz zmyśla w twoim stylu i twoim żargonem. Wiedza, która ma być przywoływana wiernie i ze źródłem, to zadanie dla RAG. Dostrajanie zmienia zachowanie, nie zasób faktów.

## Drzewo decyzyjne

Przechodzę przez nie z zespołami w tej kolejności:

1. **Czy problem występuje przy porządnym promptcie z 5+ przykładami?** Nie wiesz, bo nie próbowałeś - wróć i spróbuj; to godzina pracy. Próbowałeś i działa - koniec, zostań przy promptcie. Działa prawie, ale przykładów przybywa - idź do punktu 2. Nie działa wcale - idź do punktu 3.
2. **Czy przykładów i reguł jest już tyle, że prompt puchnie ponad kilka tysięcy tokenów?** Jeśli rosnący prompt wciąż działa, a wywołań jest mało - zostaw, brzydki działający prompt jest tańszy niż ładna architektura. Jeśli koszt i opóźnienia bolą przy dużym wolumenie - rozważ dostrajanie jako kompresję promptu (punkt 5).
3. **Czy modelowi brakuje wiedzy o twoich danych: dokumentach, produktach, procedurach?** Tak - to RAG, punkt 4. Nie, model ma wiedzę, ale odpowiada w złym stylu, formacie albo nie trzyma się wąskiej konwencji - punkt 5.
4. **RAG:** zacznij od wariantu minimalnego - dobre wyszukiwanie po słowach kluczowych plus doklejanie znalezionych fragmentów do promptu. Baza wektorowa, embeddingi i przepisywanie zapytań to drugi etap, potrzebny dopiero gdy prosty wariant mierzalnie nie wystarcza (patrz wpis o ewaluacjach - bez złotego zestawu nie dowiesz się, czy nie wystarcza).
5. **Dostrajanie:** wchodzisz tu tylko jeśli masz minimum kilkaset zweryfikowanych przykładów wejście-wyjście, problem jest stabilny w czasie, a prompt i RAG mierzalnie nie domykają jakości albo robią to za drogo przy twoim wolumenie. Mniej niż trzy "tak" - wróć do punktów 1-4.

## Rachunek: koszt, czas, ryzyko

| Wymiar | Dłuższy prompt | RAG | Dostrajanie |
|---|---|---|---|
| Czas do pierwszego efektu | godziny | dni do 2 tygodni | 2-6 tygodni |
| Koszt startowy | ~0 | dni pracy + infrastruktura wyszukiwania | przygotowanie danych (największy koszt) + trening |
| Koszt bieżący | więcej tokenów na wywołanie | utrzymanie indeksu + tokeny na doklejony kontekst | hosting/stawka za model dostrojony + retreningi |
| Aktualizacja wiedzy | edycja promptu, minuty | dodanie dokumentu do indeksu, minuty | nowy trening, dni |
| Wymagane dane | 3-10 przykładów | dokumenty, które już masz | setki-tysiące czystych par wejście-wyjście |
| Wymagane kompetencje | każdy w zespole | programista + podstawy wyszukiwania | ktoś, kto rozumie ewaluacje i przygotowanie danych |
| Główne ryzyko | rozcieńczenie instrukcji w długim promptcie | złe wyszukiwanie = pewne siebie złe odpowiedzi | regresje po zmianie modelu bazowego, przeuczenie |
| Odwracalność decyzji | pełna | duża | mała - inwestycja w konkretny model |

Najczęściej pomijany wiersz to aktualizacja wiedzy. Cennik się zmienił? W promptcie i RAG poprawiasz dokument i po sprawie. W modelu dostrojonym stary cennik jest zapieczony w wagach - i będzie wracał w odpowiedziach do następnego treningu.

## Co się psuje w każdym podejściu

**W promptach** psuje się dyscyplina. Prompt rośnie przez pół roku, każdy dopisek coś łatał, nikt nie wie, które zdania jeszcze pracują. Instrukcje zaczynają się wzajemnie rozcieńczać, a czasem jawnie sobie przeczyć. Higiena: prompt w repozytorium, zmiany przez przegląd, złoty zestaw ewaluacyjny jako test regresji.

**W RAG** psuje się wyszukiwanie, nie generowanie. Z mojego doświadczenia zdecydowana większość złych odpowiedzi systemów RAG to przypadki, w których model dostał niewłaściwe fragmenty - źle pocięte dokumenty, przestarzałe wersje obok aktualnych, pytanie sformułowane inaczej niż treść. Model z błędnym kontekstem odpowiada płynnie i pewnie, więc problem widać dopiero przy weryfikacji u źródła. Higiena: testuj osobno samo wyszukiwanie ("czy dla tych 20 pytań wracają właściwe fragmenty?") zanim zaczniesz stroić cokolwiek innego, i pilnuj świeżości indeksu.

**W dostrajaniu** psują się fundamenty. Dostawca wycofuje model bazowy - trenujesz od nowa. Domena się przesunęła - model pewnie odpowiada według świata sprzed pół roku. Dane treningowe miały skrzywienie - model je wzmocnił. To wszystko jest do opanowania, ale wymaga procesu: wersjonowania zbiorów danych, ewaluacji po każdym treningu, monitorowania dryfu. Jeśli czytasz to i myślisz "nie mamy na to ludzi" - to jest właśnie odpowiedź na pytanie z tytułu.

> Dostrajanie to nie wyższy poziom rozwoju zespołu, tylko inny rodzaj zobowiązania: kupujesz procent jakości za stały koszt procesu, który musi się kręcić tak długo, jak żyje produkt.

## Kiedy dostrajanie naprawdę wygrywa

Żeby nie było, że jestem fanatykiem jednej strony - trzy scenariusze, w których dostrajanie jest właściwą odpowiedzią. Pierwszy: sztywny format i styl przy ogromnym wolumenie. Klasyfikacja milionów rekordów miesięcznie według stabilnych reguł - dostrojony mały model robi to taniej i szybciej niż duży model z długim promptem przy każdym wywołaniu. Drugi: wąska konwencja, której nie da się opisać. Specyficzny ton komunikacji marki, format raportu z dziesiątkami niuansów - czasem łatwiej pokazać tysiąc przykładów niż napisać instrukcję. Trzeci: latencja i prywatność. Mały model dostrojony do jednego zadania, uruchamiany na własnej infrastrukturze, tam gdzie dane nie mogą wyjść na zewnątrz.

Zwróć uwagę na wspólny mianownik: wszystkie trzy to optymalizacja czegoś, co już działa na promptcie albo RAG. Dostrajanie jako pierwsza próba rozwiązania problemu, którego jeszcze nie rozumiesz - to przepalanie budżetu.

## A co z podejściami łączonymi?

W praktyce te trzy opcje rzadko występują w czystej postaci. Prompt z przykładami jest składnikiem każdego rozwiązania - RAG to przecież "dłuższy prompt", tylko składany automatycznie z wyszukanych fragmentów. Połączenie RAG z dostrajaniem też istnieje: model dostrojony do stylu i formatu odpowiedzi, karmiony faktami z wyszukiwania. Ma sens w organizacjach z dużym wolumenem i działem, który to udźwignie - czyli poza zakresem tego wpisu.

Dla zespołu bez działu ML praktyczna rada brzmi: traktuj te podejścia jako warstwy, nie alternatywy. Najpierw wyciśnij wszystko z warstwy promptu, bo ona zostaje z tobą niezależnie od dalszych decyzji. Potem dołóż wyszukiwanie, jeśli brakuje wiedzy. Dostrajanie, jeśli kiedykolwiek nadejdzie, też będzie potrzebowało dobrego promptu i dobrego zestawu ewaluacyjnego - nic z wcześniejszej pracy się nie marnuje. Odwrotna kolejność marnuje wszystko: trening bez ewaluacji i bez sprawdzenia tańszych opcji to inwestycja w rozwiązanie problemu, którego być może nie ma.

## Perspektywa zespołu bez działu ML

Realny scenariusz z mojego otoczenia: zespół utrzymujący wewnętrzną bazę wiedzy chciał "własny model wytrenowany na naszej dokumentacji". Po przejściu drzewa decyzyjnego skończyło się na prostym RAG: indeks po słowach kluczowych, doklejanie trzech najlepszych fragmentów, wymóg cytowania źródła w odpowiedzi. Wdrożenie zajęło tydzień, jakość na ich złotym zestawie wzrosła z 60% do 88%, a "własny model" przestał być tematem - bo problemem nigdy nie był brak treningu, tylko brak dostępu modelu do aktualnych dokumentów.

To jest typowy przebieg. Zespoły bez działu ML mają zwykle problemy z wiedzą i formatem, a nie z fundamentalnymi zdolnościami modelu - a na wiedzę i format odpowiedzią są prompt i RAG, czyli narzędzia w zasięgu każdego programisty.

## Podsumowanie

Kolejność prób jest stała: najpierw porządny prompt z przykładami (godziny, zero ryzyka), potem RAG, gdy modelowi brakuje twojej wiedzy (dni, umiarkowane ryzyko skupione w wyszukiwaniu), na końcu dostrajanie - gdy masz setki czystych przykładów, stabilny problem i mierzalny dowód, że tańsze podejścia nie wystarczają. Dostrajanie zmienia zachowanie modelu, nie jego zasób faktów, więc na braki wiedzy nie odpowiada nigdy. A każda decyzja w tym drzewie wymaga złotego zestawu ewaluacyjnego - bez pomiaru nie wybierasz architektury, tylko słuchasz marketingu. Zanim zaplanujesz trening, poświęć godzinę na prompt z pięcioma przykładami i zmierz różnicę: to najtańszy eksperyment w całym AI.
