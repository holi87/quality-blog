---
title: "Halucynacje od kuchni: skąd się biorą i pięć technik, które realnie je ograniczają"
description: "Dlaczego model zmyśla z definicji, a nie z usterki, i pięć codziennych technik obrony z przykładami przed/po: wymuszanie źródeł, dozwolone \"nie wiem\", podział zadania, weryfikacja drugim modelem i ugruntowanie w dokumentach."
date: 2026-08-06
tags: ["ai", "halucynacje", "llm", "prompt-engineering", "qa"]
lang: pl
readingTime: 9
author: GH
---

Model nie kłamie, bo kłamstwo wymaga znajomości prawdy. Model dopowiada najbardziej prawdopodobny ciąg dalszy tekstu - i czasem ten ciąg dalszy jest prawdziwy, a czasem tylko prawdopodobny. Z tej jednej różnicy wynikają wszystkie skuteczne techniki obrony. Pięć z nich stosuję codziennie i każdą pokażę z przykładem przed i po.

## Mechanika zmyślania

Model językowy robi w gruncie rzeczy jedno: mając dotychczasowy tekst, przewiduje kolejne tokeny tak, żeby całość była jak najbardziej prawdopodobna na tle danych treningowych. Kiedy pytasz o coś, co w danych treningowych występowało często i spójnie - stolica Francji, składnia pętli w Pythonie - najbardziej prawdopodobna kontynuacja jest zarazem prawdziwa. Kiedy pytasz o coś rzadkiego, niszowego albo nieistniejącego, mechanizm działa identycznie: produkuje tekst, który wygląda jak prawdziwa odpowiedź. Nazwa biblioteki, która brzmi jak nazwy bibliotek. Numer artykułu ustawy, który ma format numeru artykułu. Parametr API, który pasuje do konwencji nazewniczej reszty parametrów.

Dlatego halucynacje są tak przekonujące: to nie są błędy losowe, tylko wzorcowo poprawne odpowiedzi z fałszywą treścią. I dlatego "precyzyjne, lecz fałszywe" detale - o których pisałem przy ocenie outputu agenta - są groźniejsze niż ogólniki. Im bardziej szczegółowo model coś podaje, tym bardziej wygląda na wiedzę, choć mechanizm produkcji jest dokładnie ten sam co przy zmyśleniu.

Druga część mechaniki: domyślne zachowanie modelu premiuje odpowiadanie. Modele są uczone, żeby być pomocne, a odmowa odpowiedzi rzadko bywa "pomocna" w danych treningowych. Jeśli nie otworzysz modelowi wyjścia awaryjnego, będzie brnął w odpowiedź także tam, gdzie nie ma podstaw. Te dwa fakty - dopowiadanie prawdopodobnego ciągu i premia za odpowiadanie - to cała teoria, której potrzebujesz. Reszta to technika.

> Halucynacja to nie usterka mechanizmu, tylko mechanizm działający zgodnie z projektem na pytaniu, na które nie ma pokrycia. Dlatego nie da się jej "wyłączyć" - da się jej odebrać przestrzeń.

## Technika 1: wymuszanie źródeł

Najprostsza dźwignia: każde stwierdzenie faktograficzne ma wskazywać, skąd pochodzi. Zmyślić odpowiedź jest łatwo, zmyślić odpowiedź razem ze spójnym, sprawdzalnym źródłem - dużo trudniej, a przede wszystkim: zmyślone źródło da się zweryfikować w 30 sekund, zmyślonego "faktu" bez źródła często nie.

**Przed:** "Jakie limity zapytań ma to API?" - model odpowiada konkretną liczbą, która może pochodzić ze starej wersji dokumentacji, z innego produktu albo znikąd.

**Po:** "Jakie limity zapytań ma to API? Przy każdej wartości podaj dokładne miejsce w załączonej dokumentacji (nagłówek sekcji), z którego ją wziąłeś. Jeśli wartości nie ma w dokumentacji, napisz to wprost." Odpowiedź z odsyłaczami sprawdzam wyrywkowo; odpowiedź bez odsyłaczy wraca do poprawki. W zespole działa to też psychologicznie - recenzent przestaje oceniać pewność tonu, a zaczyna klikać w źródła.

## Technika 2: dozwolone "nie wiem"

Skoro model ma wbudowaną premię za odpowiadanie, trzeba mu jawnie zbudować i wycenić wyjście awaryjne. Jedno zdanie w promptcie zmienia rozkład zachowań zaskakująco mocno.

**Przed:** "Która z naszych wtyczek obsługuje format X?" - model wskaże jakąś, bo pytanie zakłada, że któraś obsługuje.

**Po:** "Która z naszych wtyczek obsługuje format X? Jeśli żadna albo nie masz wystarczających informacji, odpowiedz dokładnie: NIE WIEM - i wypisz, czego brakuje, żeby odpowiedzieć. Odpowiedź NIE WIEM jest w pełni akceptowalna i lepsza niż zgadywanie." Dwa niuanse z praktyki: po pierwsze, daj modelowi konkretną formułę odmowy (łatwiej mu w nią trafić niż w mglistą "ostrożność"), po drugie - powiedz wprost, że odmowa jest premiowana. Bez tego drugiego zdania część modeli i tak będzie wolała zgadywać.

## Technika 3: podział zadania

Halucynacje mnożą się w zadaniach złożonych, bo model buduje długi łańcuch, w którym każde kolejne zdanie musi pasować do poprzednich - także do tych już zmyślonych. Jedno wczesne przekłamanie staje się "faktem", do którego reszta odpowiedzi lojalnie się dopasowuje. Podział zadania na etapy z weryfikacją między nimi przerywa ten łańcuch.

**Przed:** "Przeanalizuj ten zrzut logów i napisz poprawkę błędu" - model w jednym przebiegu diagnozuje i naprawia, a jeśli diagnoza jest zmyślona, poprawka jest bardzo pewną siebie zmianą w niewłaściwym miejscu.

**Po:** krok 1 - "wypisz z logu wyłącznie fakty: znaczniki czasu, komunikaty błędów, nazwy modułów; bez interpretacji". Krok 2 - "podaj trzy możliwe przyczyny uszeregowane według prawdopodobieństwa, każdą z fragmentem logu, który ją wspiera". Krok 3 - dopiero po mojej akceptacji przyczyny: "zaproponuj poprawkę". Każdy etap jest krótki, sprawdzalny i nie pozwala zmyśleniu z etapu pierwszego dożyć etapu trzeciego. Koszt: dwa dodatkowe kroki rozmowy. Zysk: błędna diagnoza ginie przy kroku drugim, a nie w przeglądzie kodu.

## Technika 4: weryfikacja drugim modelem

Świeże okno kontekstu nie dziedziczy zobowiązań. Model, który wygenerował odpowiedź, będzie jej bronił - to znów dopasowywanie się do już wyprodukowanego tekstu. Ale drugi model (albo ten sam w nowej, czystej sesji) nie ma w kontekście tej odpowiedzi jako "swojej" i ocenia ją chłodno.

**Przed:** "Czy twoja odpowiedź jest poprawna?" zadane w tej samej sesji - niemal zawsze kończy się uprzejmym potwierdzeniem z drobną kosmetyką.

**Po:** nowa sesja, rola recenzenta: "Dostajesz odpowiedź przygotowaną przez inny system oraz materiał źródłowy. Wypisz każde stwierdzenie faktograficzne i oceń: potwierdzone w źródle / sprzeczne ze źródłem / brak pokrycia. Niczego nie poprawiaj, tylko klasyfikuj." Kategoria "brak pokrycia" jest najcenniejsza - to tam mieszkają halucynacje. W moim przepływie pracy ta weryfikacja jest wstępnym filtrem przed przeglądem ludzkim, dokładnie jak automatyczne testy przed ręcznymi: nie zastępuje człowieka, ale kieruje jego uwagę tam, gdzie pęka.

## Technika 5: ugruntowanie w dokumentach

Ugruntowanie (grounding) to odwrócenie domyślnej sytuacji: zamiast pytać model o wiedzę z treningu, dostarczasz materiał źródłowy i zawężasz zadanie do pracy na nim. To najskuteczniejsza pojedyncza technika na liście, bo zmienia naturę zadania z "przypomnij sobie" na "przeczytaj i przetwórz" - a w tym drugim modele są radykalnie bardziej wiarygodne.

**Przed:** "Jak skonfigurować uwierzytelnianie w bibliotece NotkaAuth?" - model odpowie z treningu: być może o starej wersji, być może o innej bibliotece o podobnej nazwie, być może o bibliotece wyobrażonej.

**Po:** "Poniżej aktualna dokumentacja NotkaAuth. Odpowiadaj wyłącznie na jej podstawie. Jeśli czegoś w niej nie ma, powiedz to wprost zamiast uzupełniać z własnej wiedzy." To samo zdanie domykające co w technice 2 - bez niego model chętnie "dopowie" brakujące fragmenty dokumentacji. W wariancie systemowym to jest dokładnie RAG, o którym pisałem tydzień temu; w wariancie ręcznym to po prostu nawyk wklejania właściwego fragmentu źródła zamiast liczenia na pamięć modelu.

## Skąd wiesz, że obrona działa

Techniki warto nie tylko stosować, ale i mierzyć - inaczej zostajesz z wrażeniem poprawy, czyli dokładnie tym, przed czym bronią. Najprostszy pomiar: do złotego zestawu ewaluacyjnego (pisałem o nim dwa wpisy temu) dołóż przypadki-przynęty, czyli pytania, na które poprawną odpowiedzią jest odmowa albo "brak w źródle". Pytanie o funkcję, której biblioteka nie ma. Prośba o limit, którego nie ma w dokumentacji. Zgłoszenie o produkcie, którego nie ma w ofercie.

Wersję promptu sprzed i po wdrożeniu technik przepuszczasz przez ten sam zestaw i liczysz dwie rzeczy: ile przynęt model połknął oraz - równie ważne - ile zwykłych pytań zaczął odmawiać na wyrost. Bo nadgorliwe "nie wiem" przy każdym pytaniu to też regresja, tylko w drugą stronę: model bezpieczny, ale bezużyteczny. Dobre ustawienie balansuje obie miary, a bez tabelki tego balansu nie zobaczysz.

## Czego te techniki nie załatwią

Uczciwość wymaga dwóch zastrzeżeń. Po pierwsze, żadna z technik nie sprowadza ryzyka do zera - one zawężają przestrzeń zmyśleń i czynią je łatwiejszymi do wykrycia, ale ostatnia linia obrony to nadal weryfikacja człowieka, proporcjonalna do kosztu błędu. Notatka ze spotkania zniesie więcej ryzyka niż odpowiedź wysyłana klientowi. Po drugie, techniki kosztują: źródła i podział zadania wydłużają prompty i rozmowy, drugi model podwaja wywołania, ugruntowanie wymaga posiadania aktualnych dokumentów. Dlatego nie stosuję wszystkich pięciu wszędzie - do szybkiej burzy mózgów wystarczy świadomość, że wynik bywa zmyślony; do raportu, na którym ktoś podejmie decyzję, idzie pełen zestaw.

## Podsumowanie

Model dopowiada najbardziej prawdopodobny ciąg dalszy - gdy ma pokrycie w danych, wychodzi prawda, gdy nie ma, wychodzi coś, co prawdę wzorcowo udaje. Pięć technik odbiera zmyśleniom przestrzeń: wymuszanie źródeł czyni je sprawdzalnymi, dozwolone "nie wiem" znosi premię za zgadywanie, podział zadania przerywa łańcuch błędu, drugi model ocenia bez zobowiązań wobec własnego tekstu, a ugruntowanie w dokumentach zamienia przypominanie na czytanie. Dobierasz intensywność do kosztu błędu, a człowiek pozostaje ostatnią bramką. Wybierz jedno zadanie, przy którym model ostatnio zmyślał, i przepuść je przez wersję "po" dwóch technik z tej listy - różnicę zobaczysz w pierwszej odpowiedzi.
