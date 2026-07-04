---
title: "Agent w testach eksploracyjnych: partner, nie zamiennik"
description: "Karty eksploracji przed sesją, drugi obserwator z Playwright MCP w trakcie, samodzielna eksploracja nocą - co agent realnie wnosi do testów eksploracyjnych, a gdzie zawodzi."
date: 2026-08-26
tags: ["ai", "qa", "testy-eksploracyjne", "agenci"]
lang: pl
readingTime: 13
author: GH
---

Kiedy automatyzacja zabierała testerom kolejne kawałki pracy, testy eksploracyjne zawsze wskazywano jako bezpieczną wyspę: tu trzeba myśleć w trakcie, a nie odtwarzać kroki wymyślone wcześniej. Potem pojawiły się agenty, które same klikają po aplikacji, czytają konsolę i piszą raporty - i pytanie o wyspę wróciło ze zdwojoną siłą. Po kilkudziesięciu sesjach z agentem u boku i kilkunastu, w których agent eksplorował samodzielnie, mam odpowiedź nieco przewrotną: agent jest w eksploracji najbardziej wartościowy dokładnie wtedy, gdy nie próbuje udawać testera. Poniżej rozkładam to na konkrety: co agent robi przed sesją, w trakcie i po niej, gdzie regularnie zawodzi i w jakie pułapki wciąga zespół, który uwierzył w niego odrobinę za mocno.

## Eksploracja to nie skrypt, którego jeszcze nie nagrano

Test skryptowy ma kroki i oczekiwany wynik ustalone, zanim ktokolwiek dotknie aplikacji. Cała inteligencja została wydana na etapie projektowania; wykonanie jest odtworzeniem. Eksploracja odwraca tę kolejność: uczę się produktu w trakcie testowania, a każdy kolejny krok projektuję na podstawie tego, co pokazał poprzedni. Widzę, że filtr cen w SklepDemo dziwnie reaguje na wartość ujemną, więc następne dziesięć minut spędzam na granicach zakresów, choć żaden plan tego nie przewidywał. To pętla: obserwacja, hipoteza, eksperyment i znowu obserwacja - zamknięta w jednej głowie i w jednej sesji.

Dlatego nagrany scenariusz nigdy eksploracji nie zastąpi. Nie dlatego, że jest gorszy, tylko dlatego, że odpowiada na inne pytanie: skrypt sprawdza, czy to, co już wiemy o produkcie, wciąż jest prawdą, a eksploracja odkrywa to, czego jeszcze nie wiemy. Właśnie dlatego eksploracja pozostawała ostatnim bastionem pracy nie do zastąpienia przez automatyzację - nie da się nagrać scenariusza na odkrywanie nieznanego. Pytanie o agenta brzmi więc inaczej niż zwykle: nie "czy odtworzy kroki", tylko czy umie uczestniczyć w pętli uczenia się. Albo chociaż ją zasilać.

## Przed sesją: karty eksploracji z opisu funkcji i historii błędów

Dobra sesja zaczyna się od karty eksploracji (ang. charter) - krótkiej misji w rodzaju: "zbadaj łączenie kuponów z rabatami ilościowymi w koszyku, na kontach z różnymi walutami, poluj na błędy zaokrągleń". Karta wyznacza obszar i kierunek, ale nie kroki. Pisanie trafnych kart wymaga wiedzy o tym, gdzie produkt bywał kruchy - i to była pierwsza rzecz, którą oddałem agentowi. Dostaje opis funkcji, zgłoszenia błędów z ostatniego półrocza i listę zmian w kodzie od poprzedniego wydania; oddaje kilkanaście kart z uzasadnieniem, dlaczego każda jest warta godziny czyjegoś czasu.

Najciekawsza jest priorytetyzacja. Agent, który przeczytał historię zmian, zauważa, że moduł płatności dostał w tym wydaniu trzy poprawki od dwóch różnych osób w plikach, które w przeszłości generowały regresje - i wypycha kartę płatności na szczyt listy. Człowiek zostaje kuratorem: z kilkunastu kart odrzucam zwykle jedną trzecią, bo część dubluje istniejącą automatyzację, a część goni ryzyka, o których wiem, że są martwe, bo znam kontekst biznesowy. Ale jako generator hipotez agent jest ode mnie szybszy o rząd wielkości - a lista, z której skreślam, bije pustą kartkę.

Sama karta ma u mnie stały szkielet: obszar, dane i konta potrzebne na wejściu, lista pytań do zbadania i jawna sekcja "czego nie ruszać". Agent dostaje ten szablon i wypełnia go za każdym razem tak samo, dzięki czemu karty da się porównywać między wydaniami. Efekt uboczny okazał się cenniejszy niż sama oszczędność czasu: archiwum kart z uzasadnieniami to gotowa mapa ryzyk produktu, której wcześniej nikt u nas nie prowadził.

## Sesja parowana: ja prowadzę, agent patrzy tam, gdzie ja nie patrzę

Najwięcej wartości znalazłem w układzie, w którym sesję prowadzę sam, a agent pracuje jako drugi obserwator. Techniczne oczy daje mu Playwright MCP: agent jest podłączony do tej samej przeglądarki, w której klikam, i po każdej mojej akcji odczytuje stan strony, wpisy w konsoli i ruch sieciowy. Ja patrzę na aplikację jak użytkownik; on patrzy pod spód. Tę samą integrację opisywałem przy okazji [naprawiania testów e2e przez agenta](/pl/blog/agent-naprawia-testy-e2e-playwright-claude-code/) - w eksploracji pracuje w trybie wyłącznie do odczytu.

Podział ról jest ostry: ja decyduję, dokąd idziemy, agent niczego nie klika. Jego robota to notatki z sesji - co odwiedziłem, jakimi danymi, co się wydarzyło - oraz wyłapywanie anomalii, których z ekranu nie widać. Klasyka gatunku: wysyłam formularz, interfejs pokazuje zielone potwierdzenie, a w tle poszła odpowiedź 500, którą warstwa interfejsu po cichu przełknęła. Albo błąd JS przy trzecim otwarciu tego samego okna dialogowego, po którym przyciski przestają reagować dopiero dwa ekrany dalej - bez agenta powiązanie skutku z przyczyną zajęłoby mi kwadrans. Sam łapię takie rzeczy tylko wtedy, gdy akurat mam otwartą konsolę; z agentem dostaję je na bieżąco, z żądaniem i odpowiedzią przyklejonymi do notatki.

Dwa zastrzeżenia praktyczne. Po pierwsze, całość dzieje się na środowisku testowym - agent czyta pełny ruch sieciowy, więc na produkcji z danymi klientów ta konfiguracja wymagałaby osobnej rozmowy o dostępach i anonimizacji. Po drugie, obserwator kosztuje: każda moja akcja to dla agenta odczyt stanu strony i dziennika sieci, więc godzinna sesja zużywa zauważalny budżet tokenów. U mnie rachunek i tak wychodzi na plus, ale warto go znać, zanim ktoś obieca zarządowi darmowego drugiego testera.

Po sesji agent składa surowe notatki w raport: przebieg, znaleziska z dowodami, pytania otwarte. Piętnaście minut redakcji zamiast czterdziestu minut pisania. Co ważniejsze, notatki są kompletniejsze od moich własnych, bo agent nie przestaje notować w momencie, w którym robi się ciekawie - a ja dokładnie wtedy przestaję.

## Odwrócenie ról: agent eksploruje, ja przeglądam znaleziska

Układ odwrotny też przetestowałem: agent dostaje kartę i eksploruje samodzielnie, a ja przeglądam znaleziska następnego dnia. W obszarach, gdzie eksploracja jest z natury mechaniczna, bywa zaskakująco skuteczny: kombinacje danych wejściowych, ścieżki boczne formularzy, zachowanie po cofnięciu, odświeżeniu i podwójnym wysłaniu. Znalazł w ten sposób błąd, na którego szukanie nigdy nie starczyłoby mi cierpliwości: kupon działał poprawnie w każdej walucie z osobna, ale zmiana waluty konta przy kuponie już wpiętym w koszyk przeliczała rabat od starej kwoty. To dokładnie ten typ kombinatoryki, na który człowiekowi szkoda życia. Takie sesje puszczam poza godzinami pracy, na środowisku testowym ze świeżo odtworzonymi danymi - rano zamiast pustej kolejki czeka lista zgłoszeń do przejrzenia.

Stosunek sygnału do szumu jest jednak brutalny. Z pierwszych sesji dostawałem po dwadzieścia zgłoszeń, z czego wartościowe były dwa; reszta to duplikaty, zachowania poprawne opisane tonem odkrycia i teorie o błędach, które nie istnieją. Szum spada, gdy instrukcja twardnieje:

- **Zawęź obszar.** Jedna karta, jeden moduł, jedna godzina. Agent puszczony na całą aplikację produkuje spis wrażeń, nie znaleziska.
- **Zdefiniuj anomalię.** Wypisz wprost, co jest znaleziskiem: odpowiedź 4xx/5xx, błąd w konsoli, niespójność danych między widokami, brak walidacji tam, gdzie siostrzany formularz ją ma. Nic poza listą nie jest.
- **Wymagaj dowodu.** Każde zgłoszenie musi mieć zapis żądania i odpowiedzi albo treść błędu. Zgłoszenie bez dowodu nie istnieje - ta jedna reguła wycięła mi połowę szumu.
- **Ogranicz liczbę.** Maksymalnie pięć zgłoszeń na sesję. Limit zmusza model do selekcji, którą inaczej przerzuca na ciebie.

Przegląd znalezisk to osobna praca i w bilansie trzeba ją uczciwie policzyć - szerzej pisałem o tym w tekście o [ocenie wyników pracy agenta](/pl/blog/ocena-outputu-agenta/). Moja reguła praktyczna: jeśli przegląd zgłoszeń z godzinnej sesji agenta zajmuje mi więcej niż pół godziny, to nie agent jest słaby, tylko moja instrukcja za luźna.

## Gdzie agent regularnie zawodzi

Po kilkudziesięciu sesjach widzę pięć powtarzalnych ślepych plam. Żadna nie zniknie wraz z lepszym modelem, bo żadna nie wynika z braku inteligencji - wynikają z braku kontekstu, ciała i stawki.

- **Wyczucie użytkownika.** Agent nie poczuje, że formularz jest męczący, że trzecie pytanie o hasło irytuje, że przycisk jest o dwa kliknięcia za daleko. Wykryje błąd; nie wykryje wstydu, który produkt przynosi.
- **Wiedza domenowa.** Nie wie, że w tym banku dzień księgowy kończy się o 17:30, więc przelew zlecony o 17:29 i zaksięgowany "jutro" to katastrofa, a nie ciekawostka. Ta wiedza nie zostawia śladu w aplikacji - mieszka w głowach i procedurach.
- **"Coś tu jest nie tak".** Doświadczony tester zatrzymuje się, bo strona mrugnęła ułamek sekundy za długo albo dane "wyglądają dziwnie", zanim umie powiedzieć dlaczego. Agent potrzebuje twardego sygnału; intuicji karmionej latami produkcyjnych awarii nie da się przenieść instrukcją.
- **Ślepota na braki.** Agent ocenia to, co jest w drzewie strony. Brakująca waluta przy kwocie, brak stronicowania na liście, obiecany w specyfikacji eksport, którego nigdzie nie ma - rzeczy nieobecne nie zostawiają śladu w DOM, a wdrożenia rozbijają się właśnie o nie.
- **Znieczulica na absurdy biznesowe.** Rabat 105 procent, data urodzenia za dwa lata, zamówienie zerowej liczby sztuk z ujemnym kosztem dostawy - jeśli serwer odpowiada 200, agent raportuje sukces. Rozpoznanie absurdu wymaga wiedzy o tym, co w danym biznesie w ogóle ma prawo się zdarzyć.

Wniosek z tej listy nie brzmi "agent jest słaby". Brzmi: obszary, w których stawką jest doświadczenie użytkownika, zgodność z domeną albo zdrowy rozsądek biznesowy, planuję jako sesje prowadzone przez człowieka. Agent bywa w nich obserwatorem - nigdy jedynym wykonawcą.

## Pułapki: gdzie ta współpraca psuje się po cichu

Osobna kategoria to nie braki agenta, tylko zmiany w zachowaniu człowieka, które agent wywołuje.

- **Skłonność do ufania automatowi (ang. automation bias).** Po dwóch tygodniach pracy z agentem przy konsoli przestałem do niej zaglądać sam. Zauważyłem to dopiero wtedy, gdy błąd wisiał w zakładce, której agent nie obserwował. Człowiek przestaje patrzeć, bo "agent patrzy" - a agent patrzy dokładnie tam, gdzie go podłączono, i ani piksel dalej.
- **Iluzja pokrycia.** "Agent eksplorował godzinę" brzmi jak wynik, a nie znaczy nic. Godzina klikania może być jednym ekranem obejrzanym czterdzieści razy. Pokrycie w eksploracji mierzy się zamkniętymi kartami i zaadresowanymi ryzykami, nie czasem aktywności ani liczbą akcji - dziennik zdarzeń nie jest mapą terenu.
- **Przejmowanie steru.** Najsubtelniejsza z trzech. Agent proponuje "sprawdźmy teraz X", człowiek wykonuje, agent proponuje kolejny krok - i po kwadransie pętla uczenia się mieszka już w agencie. Zasada, którą sobie narzuciłem: propozycje agenta lądują na liście "na potem", a nie w moich rękach w trakcie sesji.

> Sesja, w której człowiek wykonuje kroki wymyślane na bieżąco przez agenta, nie jest sesją parowaną - jest ręcznym odtwarzaniem skryptu, który dopiero powstaje. Cała wartość eksploracji siedzi w tym, kto zadaje następne pytanie.

## Jak mierzyć, czy sesje z agentem w ogóle się opłacają

Trzy liczby wystarczą, żeby dyskusja przestała być ideologiczna. Pierwsza: istotne błędy na sesję - liczone z wagą, bo pięć literówek nie równoważy jednego przełkniętego błędu 500 przy płatności - porównywane między sesjami z agentem i bez niego na podobnych obszarach. Druga: jakość notatek z sesji, sprawdzana wyrywkowo prostym testem - czy osoba, której na sesji nie było, potrafi z notatek odtworzyć przebieg i decyzje. Trzecia: czas od końca sesji do gotowego raportu, bo to on decyduje, czy znaleziska trafią do zespołu jeszcze ciepłe. Do kompletu dochodzi strona kosztowa: czas przygotowania instrukcji i czas przeglądu zgłoszeń. Bez tych dwóch liczb każde porównanie wyjdzie na korzyść agenta, bo jego godziny wyglądają na darmowe - a nie są, tylko płaci się za nie czyjąś uwagą.

Uczciwość wymaga zdania, którego nie usłyszysz od dostawców narzędzi: część sesji z agentem przegrywa z samodzielnymi. Obszar prosty i dobrze znany, aplikacja bez istotnego ruchu sieciowego, sesja krótsza niż pół godziny - koszt przygotowania instrukcji i przeglądu zgłoszeń zjada zysk i bilans wychodzi na minus. To ta sama dyscyplina portfelowa, co przy decyzji, [które testy w ogóle automatyzować](/pl/blog/kiedy-warto-automatyzowac-testy/): narzędzie stosuje się tam, gdzie się zwraca, a nie wszędzie, gdzie się da. Jeśli po miesiącu liczby nie bronią agenta w danym obszarze, wraca eksploracja samodzielna - i to też jest wynik, a nie porażka.

## Podsumowanie

Eksploracja to pętla uczenia się: obserwacja, hipoteza, eksperyment - i dlatego nie zastąpi jej ani nagrany skrypt, ani agent odtwarzający cudze kroki. Agent wnosi realną wartość na obrzeżach tej pętli: przed sesją generuje karty eksploracji z historii błędów i zmian w kodzie, w trakcie pracuje jako drugi obserwator podpięty przez Playwright MCP - notatki, konsola, ruch sieciowy, przełknięte odpowiedzi 500 - a po godzinach mechanicznie przeczesuje kombinacje danych, na które człowiekowi szkoda życia. Zawodzi tam, gdzie potrzebne są ciało, domena i wyczucie absurdu; największe ryzyka to skłonność do ufania automatowi, iluzja pokrycia i cichy moment, w którym to agent zaczyna zadawać pytania. Mierz istotne błędy na sesję, jakość notatek i czas do raportu - i miej odwagę wrócić do sesji samodzielnych tam, gdzie liczby agenta nie bronią. Partner, nie zamiennik. I nie kierowca.
