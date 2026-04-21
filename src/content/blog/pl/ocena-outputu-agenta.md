---
title: "Jak tester powinien oceniać output agenta"
description: "Pięć wymiarów oceny outputu agenta plus checklista review, którą zrobisz w 15 minut, i pięć sytuacji, w których po prostu zawracasz."
date: 2026-04-26
tags: ["ai", "qa", "agenci", "review"]
lang: pl
readingTime: 9
---

Gdy zespół zaczyna używać agentów AI na serio, szybko pojawia się nowe zadanie, którego wcześniej nie było: **weryfikacja tego, co agent wyprodukował**. Dla testera to dobra wiadomość, bo to w dużej mierze ta sama czynność, którą i tak robimy codziennie — krytyczne review outputu — ale z nowym rodzajem źródła i nowymi wzorcami błędów.

W tym wpisie rozbiorę, jak podchodzić do oceny outputu agenta w sposób systematyczny. Na przykład: scenariusz testowy wygenerowany przez agenta, raport z analizy changeloga, propozycja checklisty release readiness, generowana dokumentacja API. Mechanizm jest podobny, zmienia się tylko konkret.

Celem nie jest „łapać AI na kłamstwie". Celem jest mieć stabilny zestaw pytań, które zadajesz każdemu outputowi, zanim go puścisz dalej.

## Pięć wymiarów oceny

Proponuję pięć wymiarów. Każdy z nich odpowiada na inne pytanie i każdy wyłapuje inny rodzaj problemu.

### 1. Kompletność

Pytanie: **czy output pokrywa wszystko, co miał pokryć?**

Agent, który dostał prośbę o „scenariusze testowe dla nowej funkcji kuponów", może łatwo wygenerować 8 świetnych scenariuszy i 4 ciche pominięcia. Nie zobaczysz tego, patrząc tylko na to, co napisał — zobaczysz, porównując z tym, co być powinno.

Praktyczny sposób: zanim zawołasz agenta, zapisz **listę obszarów, które powinny się znaleźć** w outputcie. Kiedy dostaniesz wynik, konfrontuj pozycja-po-pozycji. Jeśli agenta prosisz o scenariusze, Twoja lista powinna obejmować: happy path, główne scenariusze negatywne, brzegowe, błędy walidacji, interakcja z innymi modułami, zachowanie przy braku sieci, wymagania niefunkcjonalne.

Typowy symptom problemu: agent ma bias w stronę **pozytywnych ścieżek**. Prawie zawsze pominie klasę błędów, jeśli tego jawnie nie poprosisz.

### 2. Poprawność faktyczna

Pytanie: **czy to, co agent twierdzi, jest prawdą?**

Najbardziej oczywisty wymiar i najłatwiejszy do obrony, ale w praktyce najczęściej ignorowany przy review, bo output wygląda wiarygodnie.

Sposoby weryfikacji, które działają:

- **Cross-check z kodem**. Jeśli agent opisuje zachowanie funkcji, zerknij w kod. Trzy losowe stwierdzenia są wystarczające na zaufanie do reszty.
- **Cross-check ze specyfikacją**. Jeśli agent odnosi się do wymagań, sprawdź czy cytuje realne fragmenty. Dobre narzędzia cytują. Jeśli nie cytują — podejrzewaj.
- **Test samodzielności stwierdzeń**. Weź jedno twierdzenie z outputu i zapytaj „skąd to wiesz?". Jeśli agent nie potrafi wskazać źródła ani zrekonstruować uzasadnienia, to sygnał.

Najniebezpieczniejszy wariant błędu faktycznego to **precyzyjne, lecz fałszywe**. „Endpoint `/api/v2/discounts` akceptuje pole `max_uses`" — brzmi konkretnie, bywa zmyślone.

### 3. Zgodność z domeną

Pytanie: **czy output trzyma się konwencji Twojego projektu, zespołu, produktu?**

To jest wymiar, który agenci masowo lekceważą, bo go nie znają. Nie ma takiego wymiaru w ich trainingu — chyba że jawnie go dostarczysz przez `AGENTS.md`, dokumentację, przykłady.

Konkrety, które sprawdzam:

- **Nazewnictwo** — czy scenariusz nazwany jest zgodnie z waszą konwencją (`should ... when ...` vs opisowe zdania).
- **Selektory / identyfikatory** — czy użyte są `data-testid`, a nie klasy CSS, jeśli tak macie.
- **Terminologia** — czy używa Waszej, czy podstawił ogólne („user" vs „customer" vs „merchant", jeśli to znaczące).
- **Strukturalne konwencje** — gdzie żyje plik, jaką ma nagłówek, jakie importy.

Bez tego wymiaru output może być faktycznie poprawny, ale nie pasować do zespołu. Na review wróci, nawet jeśli wszystko inne jest OK.

### 4. Traceability do źródeł

Pytanie: **czy da się zweryfikować, skąd wzięło się każde stwierdzenie?**

To wymiar krytyczny dla wszystkiego, co agent generuje na podstawie evidence (analizy logów, historii bugów, dokumentacji). Bez traceability Ty jako reviewer nie masz żadnej szansy zweryfikować poprawności.

Dobry output ma:

- **cytaty wskazujące na konkretny ticket / log / plik**,
- **linki lub identyfikatory** klikalne przez człowieka,
- **datę / wersję** źródła, jeśli to ma znaczenie.

Zły output ma:

- stwierdzenia typu „nasze logi pokazują, że…" bez wskazania konkretnego loga,
- „w dokumentacji jest napisane…" bez referencji,
- „w ostatnich commitach…" bez hashów.

Jeśli to brzmi surowo, to dlatego że jest. Bez traceability nie odróżnisz wniosku ze źródła od halucynacji, a koszt tej różnicy w QA jest wysoki.

### 5. Ryzyko „ładnej bzdury"

Pytanie: **czy to, że output wygląda świetnie, nie jest jedynym powodem, dla którego go akceptujesz?**

To jest metawymiar. Chodzi o samoświadomość reviewera. Dobrze sformułowany, ładnie ustrukturyzowany, spójny w stylu tekst tworzy iluzję poprawności. Tester po dwóch godzinach review zaczyna ufać formie.

Antidotum: wybierz losowe fragmenty i bardzo agresywnie je sprawdź. Jeśli losowy fragment przechodzi trzy głębokie kontrole, reszta prawdopodobnie też przejdzie. Jeśli pęka — reszta wymaga głębszej weryfikacji, a nie powierzchownej akceptacji.

Drugi mechanizm: policz, ile razy w swoim review powiedziałeś „wygląda sensownie". Jeśli więcej niż dwa razy w jednym outputcie — robisz review formy, nie treści.

## Checklista review — wersja praktyczna

Składając to razem, ustrukturyzowana checklista, którą zapisuję sobie jako szablon:

**Kompletność**
- [ ] Output pokrywa wszystkie obszary z mojej wcześniejszej listy.
- [ ] Brak oczywistych klas scenariuszy/wątków, które powinny się pojawić.
- [ ] Zakres (scope) odpowiada temu, o co prosiłem.

**Poprawność**
- [ ] Losowe sprawdzenie 3 stwierdzeń wobec kodu/specyfikacji.
- [ ] Brak detalicznych, ale niedowodliwych faktów (np. nazwy endpointów, pól, stałych).
- [ ] Wartości liczbowe, jeśli są, mają źródło.

**Zgodność z domeną**
- [ ] Nazewnictwo zgodne z konwencjami.
- [ ] Selektory / typy / struktura pliku zgodne z repo.
- [ ] Terminologia produktowa spójna.

**Traceability**
- [ ] Każde stwierdzenie oparte na evidence ma citation.
- [ ] Cytowane źródła są otwieralne i aktualne.
- [ ] Brak stwierdzeń „nasze dane pokazują…" bez linku.

**Ładna bzdura**
- [ ] Forma nie przykryła mi braków treści — zrobiłem random sample.
- [ ] Nie akceptowałem niczego „bo wygląda sensownie".
- [ ] Trzy najbardziej precyzyjne stwierdzenia zweryfikowałem ręcznie.

Piętnaście punktów. Piętnaście minut, jeśli robisz to regularnie.

## Kiedy wynik odrzucać bez dyskusji

Są sytuacje, w których nie marnuję czasu na dokładne review, tylko wracam do agenta po nowy output. Traktuję je jak czerwone flagi:

**1. Brak źródeł przy twierdzeniach o evidence.**
Output w stylu „w ostatnim miesiącu mieliśmy flaky testy w obszarze X" bez wskazania, które konkretnie. Reject.

**2. Zmyślone nazwy API / pól / plików.**
Wystarczy jedno takie wskazanie, żeby zakwestionować cały output. Reject i generuj od nowa z wyraźnym wymogiem cytowania.

**3. Wewnętrzne sprzeczności.**
„Test powinien weryfikować, że kupon jest jednorazowy" — i trzy linie niżej „…po wielokrotnym użyciu kupon nadal działa". Obie linie mogą być z życia, ale agent nie zauważył konfliktu. Reject.

**4. Niezgodność z jawnymi instrukcjami.**
Prosiłeś o scenariusze w konwencji BDD, dostałeś listę kroków imperatywnych. Nie poprawiaj ręcznie — zawracaj. Inaczej agent nie nauczy się, że się z tego nie wywija.

**5. Output zbyt ogólny.**
„System powinien być niezawodny" — kiedy prosiłeś o konkretne scenariusze. Reject z prośbą o konkretność.

W każdym z tych przypadków koszt zawrócenia (30 sekund promptu) jest niższy niż koszt ręcznego poprawiania (30 minut). Zawracanie jest pro-quality.

## Skalowanie review — co dalej

W większych zespołach review agenta samemu przestaje skalować. Dwie praktyki, które działają:

**Review AI przez AI (jako pre-filtr).** Drugi model sprawdza output wobec powyższej checklisty i flaguje, co wymaga ludzkiej uwagi. To nie eliminuje ludzkiego review — eliminuje część rutynowej pracy. Jeśli pre-filtr mówi „całość wygląda spójnie, ale trzy stwierdzenia o evidence nie mają citationu" — człowiek wie, gdzie zacząć.

**Regresja własnych uwag.** Zbieraj notatki z review: „za trzecim razem dodałem uwagę o brakującym citation", „znowu zmyślone pole API". Po kilku tygodniach masz mapę słabości agenta. Część z nich trafi do system prompta jako instrukcje, część do `AGENTS.md`, część zostanie na stałe w Twojej checklicie.

Jakość oceny outputu agenta rośnie razem z dojrzałością procesu. Pierwsze review bywają długie. Dziesiąte są szybkie, bo wiesz, gdzie zwykle coś pęka.

## Warto pamiętać

- Pięć wymiarów oceny: kompletność, poprawność faktyczna, zgodność z domeną, traceability, ryzyko „ładnej bzdury".
- Każdy wymiar sprawdza inny typ błędu. Pominięcie któregoś to stały wyciek jakości.
- Piętnastopunktowa checklista mieści się w 15 minutach review.
- Pięć sytuacji, w których output odrzucasz bez dyskusji i zawracasz. Zawracanie jest tanie.
- Skalowanie: AI-pre-filtr + regresja własnych uwag do system prompta i `AGENTS.md`.

W kolejnym wpisie inny wątek — jak wpis taki jak ten zamienić w 30–45 sekundowy video explainer, który osadzasz pod artykułem i reużywasz w social i szkoleniu.
