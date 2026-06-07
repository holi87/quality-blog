---
title: "AI w codziennym życiu: LLM jako pomocnik przy grach planszowych"
description: "LLM może być bardzo praktycznym pomocnikiem przy grach planszowych: tłumaczyć zasady, rozstrzygać niejasności, wyszukiwać fragmenty instrukcji, tworzyć skróty tur i pilnować spójności house rules. Warunek: traktować go jak asystenta, nie nieomylnego sędziego."
date: 2026-06-12
tags: ["ai", "llm", "chatgpt", "claude", "gry planszowe", "produktywność"]
lang: pl
readingTime: 9
author: GH
---

Są takie momenty przy planszówkach, które zna prawie każdy gracz. Gra trwa już dwie godziny. Na stole leżą karty, znaczniki, żetony, plansza główna, planszetki graczy, może jeszcze dodatek i kilka zasad z kampanii. Nagle pojawia się pytanie: „czy ta karta działa przed walką, czy po walce?”, „czy ten bonus się sumuje?”, „czy mogę wykonać tę akcję, jeśli nie mam zasobu?”, „czy instrukcja mówi coś o remisie?”. Ktoś bierze instrukcję. Ktoś inny szuka FAQ w telefonie. Trzecia osoba mówi: „gramy tak jak ostatnio”. Czwarta jest pewna, że ostatnio graliśmy źle.

W tym miejscu LLM, czyli duży model językowy taki jak ChatGPT lub Claude, może być naprawdę praktycznym narzędziem. Nie jako magiczny autorytet, który zawsze zna wszystkie gry świata. Nie jako replacement dla instrukcji. Raczej jako asystent stołu: szybki bibliotekarz zasad, tłumacz, mediator, generator skrótów i pomocnik w porządkowaniu informacji.

To bardzo dobry przykład użycia AI w codziennym życiu, bo nie wymaga wielkiego projektu, kodowania ani integracji. Wystarczy telefon, komputer, skan lub PDF instrukcji, kilka dobrze zadanych pytań i rozsądna zasada: ostateczną decyzję podejmują gracze.

## Dlaczego planszówki są trudne dla ludzi, a ciekawe dla LLM

Planszówki mają jedną cechę, która bardzo pasuje do LLM: dużo tekstu, dużo warunków i dużo wyjątków. Instrukcja może mieć kilkanaście albo kilkadziesiąt stron. Do tego dochodzą karty, symbole, dodatki, erraty, FAQ, warianty solo, zasady kampanii i nieoficjalne interpretacje społeczności. Człowiek świetnie rozumie intencję gry, ale nie zawsze szybko znajduje właściwy fragment instrukcji. Model językowy potrafi natomiast szybko przetwarzać tekst i zestawiać ze sobą rozproszone fragmenty.

Problem polega na tym, że LLM nie „zna prawdy” w sensie formalnym. Model może odpowiedzieć bardzo przekonująco, nawet gdy nie ma wystarczających danych. Może pomylić edycje, dodatki, nazwy kart, wersje językowe albo zasady z podobnych gier. Dlatego najlepszy sposób użycia nie brzmi: „powiedz nam, jaka jest zasada”. Lepszy brzmi: „na podstawie załączonej instrukcji znajdź odpowiedni fragment, wyjaśnij go prostym językiem i powiedz, czy odpowiedź jest pewna”.

To zmienia rolę AI. Nie jest wyrocznią. Jest asystentem interpretacji.

## Sędzia, bibliotekarz i tłumacz w jednym

LLM przy planszówkach może pełnić kilka ról. Najważniejsze z nich to: bibliotekarz zasad, sędzia pomocniczy, tłumacz, nauczyciel i kronikarz rozgrywki.

Jako bibliotekarz zasad model wyszukuje fragment instrukcji, który odpowiada na konkretne pytanie. To jest przydatne zwłaszcza wtedy, gdy instrukcja ma słaby indeks albo gdy nie pamiętamy oficjalnego terminu. Możemy zapytać: „gdzie w instrukcji jest opis remisu?”, „znajdź zasady dotyczące kolejności efektów”, „czy w instrukcji jest wyjątek dla akcji darmowych?”. Jeśli model ma załączony PDF, może wskazać sekcję lub stronę, a gracz może szybko zweryfikować źródło.

Jako sędzia pomocniczy model może pomóc rozstrzygnąć spór. Ważne jest jednak, aby pytanie zawierało stan gry. Nie pytamy ogólnie: „czy mogę to zrobić?”. Piszemy: „gracz A ma 2 zasoby, karta wymaga zapłacenia 3 zasobów, ale inna karta daje zniżkę 1. Efekt karty mówi, że po zapłaceniu kosztu gracz dobiera kartę. Czy akcja jest legalna?”. Im dokładniejszy opis, tym mniej miejsca na zgadywanie.

Jako tłumacz model pomaga, gdy gra jest po angielsku, a część osób woli polski. Może wyjaśnić trudne terminy, rozróżnić „may” i „must”, opisać różnicę między „then”, „after”, „before”, „instead” i „up to”. To bywa kluczowe, bo w grach planszowych pojedyncze słowo potrafi zmienić wynik akcji.

Jako nauczyciel model może przygotować skrót zasad dla nowych graczy: cel gry, przygotowanie, przebieg tury, najczęstsze błędy i pierwszą rundę krok po kroku. To jest dużo przyjemniejsze niż czytanie całej instrukcji na głos przy stole.

Jako kronikarz model może prowadzić notatki z kampanii: co wydarzyło się w scenariuszu, jakie decyzje podjęli gracze, jakie zasady domowe przyjęto, co trzeba sprawdzić przed kolejną sesją.

## Przygotowanie przed grą: projekt, pliki i instrukcje

Największa różnica między chaotycznym użyciem LLM a naprawdę wygodnym workflow pojawia się przed grą. Zamiast otwierać przypadkowy czat w połowie partii, warto przygotować małą przestrzeń dla danej gry.

W ChatGPT można użyć projektu, czyli miejsca, które grupuje czaty, pliki i instrukcje. W Claude podobną rolę pełnią projekty z własną historią czatów i bazą wiedzy. Do takiego projektu można dodać instrukcję gry, FAQ, erratę, listę dodatków, własne house rules i notatki z poprzednich partii. Dzięki temu model nie musi za każdym razem odtwarzać kontekstu od zera.

Przykładowe instrukcje dla projektu:

```text
Jesteś asystentem zasad do gry planszowej.
Odpowiadaj wyłącznie na podstawie załączonych materiałów, chyba że wyraźnie poproszę o wiedzę z internetu.
Jeśli nie masz pewności, powiedz to.
Przy pytaniach regułowych podawaj:
1. krótką odpowiedź,
2. uzasadnienie,
3. źródło: strona, sekcja lub nazwa dokumentu,
4. poziom pewności: wysoki / średni / niski.
Nie wymyślaj zasad, których nie ma w materiałach.
```

Taki system prompt bardzo zmienia jakość pracy. Model dostaje rolę, granice i format odpowiedzi. A gracze dostają odpowiedź, którą łatwiej szybko ocenić.

Warto też dodać plik „house_rules.md”. To może być bardzo prosty dokument:

```text
# House rules

- Jeśli zasady są niejasne i nie ma szybkiej odpowiedzi, gramy interpretacją najmniej korzystną dla gracza wykonującego akcję.
- Decyzja podjęta w trakcie partii obowiązuje do końca tej partii.
- Po grze sprawdzamy oficjalne FAQ i aktualizujemy notatki.
- Przy remisie rozstrzygamy zgodnie z instrukcją, a jeśli instrukcja milczy, stosujemy zasadę ustaloną przed grą.
```

Dzięki temu LLM może przypominać nie tylko oficjalne zasady, ale też ustalenia grupy.

## Workflow w trakcie partii

Podczas gry nie chcemy prowadzić długiej dyskusji z AI. Chcemy szybkiego rozstrzygnięcia. Dlatego warto używać stałego formatu pytania.

Dobry prompt do sporu przy stole:

```text
Rozstrzygnij sytuację na podstawie instrukcji i FAQ.

Gra: [nazwa gry]
Wersja: [edycja / język]
Dodatki w grze: [lista]
Stan gry:
- Gracz A: ...
- Gracz B: ...
- Karta / akcja / efekt: ...
Pytanie:
- Czy ...?

Odpowiedz w formacie:
1. Decyzja w jednym zdaniu.
2. Uzasadnienie.
3. Źródło w instrukcji lub FAQ.
4. Poziom pewności.
5. Jeśli brakuje danych, zadaj maksymalnie jedno pytanie.
```

Ten format ma kilka zalet. Po pierwsze, ogranicza lanie wody. Po drugie, zmusza model do wskazania źródła. Po trzecie, pozwala szybko podjąć decyzję. Po czwarte, redukuje ryzyko, że model zacznie opowiadać ogólnie o podobnych grach.

Warto też przyjąć zasadę czasu. Na przykład: „dajemy AI 60-90 sekund; jeśli nie ma jasnej odpowiedzi, podejmujemy tymczasową decyzję i gramy dalej”. Planszówka ma być zabawą, a nie rozprawą sądową.

## Przeszukiwanie instrukcji i zagrania „po słowach”

Jednym z najprzydatniejszych zastosowań LLM jest wyszukiwanie po znaczeniu, a nie tylko po słowie. W zwykłym PDF-ie trzeba znać termin. Jeśli szukamy „remis”, a instrukcja używa słowa „tie”, „draw”, „tiebreaker” albo „equal score”, możemy nie znaleźć właściwego miejsca. Model może zrozumieć pytanie semantycznie.

Przykłady pytań:

```text
Znajdź w instrukcji wszystkie miejsca, które opisują remis lub rozstrzyganie równej liczby punktów.

Czy w zasadach jest coś o kolejności rozpatrywania efektów, jeśli dwa efekty aktywują się w tym samym momencie?

Znajdź fragmenty dotyczące sytuacji, gdy gracz nie może zapłacić pełnego kosztu akcji.

Czy instrukcja rozróżnia „akcję”, „akcję darmową” i „efekt karty”?
```

To jest szczególnie przydatne w grach cięższych, kampanijnych, ekonomicznych i karcianych, gdzie dużo zasad jest ukrytych w przykładach. LLM potrafi znaleźć fragment, który człowiek przeoczył, bo nie zawierał oczekiwanego słowa kluczowego.

Trzeba jednak zachować czujność. Model może czasem połączyć dwa fragmenty w logiczną, ale nieoficjalną interpretację. Dlatego przy ważnych decyzjach prosimy: „nie interpretuj szerzej niż tekst; oddziel to, co wynika wprost z instrukcji, od tego, co jest wnioskiem”.

## Uczenie zasad nowych graczy

Drugim genialnym zastosowaniem jest przygotowywanie nowych osób do gry. Wiele planszówek ma barierę wejścia nie dlatego, że są trudne, ale dlatego, że instrukcja jest długa i nie wiadomo, co jest ważne na początku.

LLM może przygotować:

- skrót zasad na jedną stronę,
- opis tury gracza,
- listę najczęstszych błędów początkujących,
- „pierwszą rundę z komentarzem”,
- różnice między grą podstawową a dodatkiem,
- osobne wyjaśnienie dla gracza, który zna podobną grę,
- wersję dla dzieci albo osób, które wolą prostszy język.

Przykładowy prompt:

```text
Na podstawie załączonej instrukcji przygotuj wprowadzenie do gry dla nowych graczy.
Ma zmieścić się na jednej stronie A4.
Nie opisuj wszystkich wyjątków.
Skup się na tym:
- cel gry,
- przygotowanie,
- przebieg tury,
- 5 najważniejszych zasad,
- 5 najczęstszych błędów,
- co warto robić w pierwszych dwóch rundach.
```

To nie zastąpi dobrego tłumaczenia zasad przez osobę prowadzącą, ale bardzo pomaga uporządkować materiał. Można też poprosić model: „wytłumacz mi tę grę tak, jakbym znał Dune: Imperium, ale nie znał tej konkretnej mechaniki” albo „porównaj tę zasadę do worker placement, deck buildingu i area control”.

## AI jako pomocnik kampanii

Gry kampanijne i legacy generują dużo notatek. Kto co odblokował? Jaką decyzję podjęliśmy trzy scenariusze temu? Jakie zasady specjalne obowiązują w tej kampanii? Która postać ma jaki efekt stały? Co trzeba przygotować przed następną sesją?

LLM może tu działać jak kronikarz. Po sesji można wkleić krótkie notatki albo podyktować podsumowanie, a model zrobi z tego uporządkowany zapis:

```text
# Kampania - sesja 4

## Wynik
Scenariusz zakończony sukcesem.

## Ważne decyzje
- Wybrano ścieżkę północną.
- Gracz B zachował artefakt.
- Grupa nie odwiedziła lokacji pobocznej.

## Do sprawdzenia przed sesją 5
- Czy efekt rany przechodzi do kolejnego scenariusza?
- Czy odblokowany przedmiot jest dostępny dla wszystkich graczy?

## House rules
- Przypominamy zasadę czasu na decyzję: 2 minuty przy standardowej turze.
```

To bardzo mała rzecz, ale po kilku miesiącach przerwy potrafi uratować klimat kampanii.

## Claude Artifacts, ChatGPT Canvas i małe narzędzia do gry

LLM to nie tylko odpowiedzi tekstowe. Narzędzia takie jak Claude Artifacts czy ChatGPT Canvas pozwalają tworzyć lub edytować większe fragmenty treści, a czasem także proste aplikacje pomocnicze. Przy planszówkach może to być bardzo praktyczne.

Przykłady:

- licznik punktów,
- tracker rund,
- generator losowych wydarzeń dla wariantu solo,
- karta pomocy gracza,
- interaktywny skrót tury,
- prosty kalkulator końcowej punktacji,
- dokument house rules,
- lista kontrolna przygotowania gry,
- tabela porównująca zasady gry podstawowej i dodatku.

Claude Artifacts szczególnie dobrze pasują do małych, interaktywnych pomocy, bo można opisać narzędzie w rozmowie i dostać osobny, edytowalny artefakt. ChatGPT Canvas jest wygodny przy pracy z dokumentami, skrótami zasad, tekstami house rules albo kodem prostego narzędzia. Nie trzeba od razu budować pełnej aplikacji. Czasem wystarczy mała tabela, którą da się szybko poprawiać między partiami.

## Zdjęcia planszy i kart: użyteczne, ale z ograniczeniami

Modele multimodalne potrafią analizować zdjęcia, więc pojawia się kuszący scenariusz: robimy zdjęcie stołu i pytamy, co można zrobić. To może być użyteczne, ale trzeba uważać.

Zdjęcie planszy bywa trudne: małe napisy, odbicia światła, zasłonięte elementy, podobne ikony, karty pod kątem, różne języki, figurki i znaczniki. Model może poprawnie zauważyć ogólną sytuację, ale pomylić szczegóły. Dlatego zdjęcia najlepiej wykorzystywać do wsparcia opisu, a nie jako jedyne źródło prawdy.

Lepszy prompt:

```text
Na zdjęciu jest stan gry, ale nie zakładaj, że widzisz wszystko poprawnie.
Najpierw opisz, co rozpoznajesz.
Potem zadaj pytania o elementy, których nie jesteś pewien.
Nie podejmuj decyzji regułowej tylko na podstawie niewyraźnego tekstu na kartach.
```

W praktyce często najszybszy workflow to: zdjęcie + krótki opis stanu gry + pytanie. Model dostaje kontekst wizualny, ale gracze nadal kontrolują szczegóły.

## Jak nie zepsuć gry AI

Największe ryzyko nie polega na tym, że model się pomyli. Największe ryzyko polega na tym, że model pomyli się pewnym tonem. To może wywołać przy stole fałszywe poczucie autorytetu. Dlatego warto ustalić kilka zasad.

Po pierwsze: AI nie jest oficjalnym sędzią, chyba że grupa tak postanowi. Jest asystentem.

Po drugie: przy ważnych rozstrzygnięciach model ma wskazać źródło. Jeśli nie potrafi, odpowiedź jest tylko sugestią.

Po trzecie: decyzja podjęta w trakcie partii może być tymczasowa. Po grze można sprawdzić oficjalne FAQ i poprawić house rules na przyszłość.

Po czwarte: nie używamy AI do ukrytych informacji. Jeśli gra zawiera tajne karty, sekrety, scenariusze, koperty legacy albo ukryte cele, trzeba uważać, żeby model nie zdradził informacji innym graczom.

Po piąte: AI nie powinno grać za gracza, jeśli grupa tego nie chce. Jest różnica między wyjaśnieniem zasad a dawaniem porad strategicznych w trakcie partii. Strategiczny coach może być fajny po grze, ale podczas gry może zaburzyć balans.

## Praktyczna ściąga: najlepsze prompty

### 1. Szybkie rozstrzygnięcie zasad

```text
Odpowiedz jak asystent zasad.
Korzystaj tylko z załączonej instrukcji i FAQ.
Sytuacja:
[opis]
Pytanie:
[pytanie]
Daj:
- decyzję w jednym zdaniu,
- uzasadnienie,
- źródło,
- poziom pewności,
- informację, czy to wynika wprost z zasad, czy jest interpretacją.
```

### 2. Wyszukiwanie w instrukcji

```text
Znajdź wszystkie fragmenty instrukcji dotyczące:
[temat]
Podaj strony/sekcje i krótkie streszczenie każdego fragmentu.
Nie odpowiadaj jeszcze na pytanie regułowe - najpierw pokaż źródła.
```

### 3. Tłumaczenie efektu karty

```text
Wyjaśnij ten efekt karty po polsku:
[tekst karty]
Zachowaj rozróżnienie między „may”, „must”, „before”, „after”, „then” i „instead”.
Na końcu podaj przykład użycia w turze.
```

### 4. Skrót zasad dla nowych graczy

```text
Przygotuj jednostronicowy skrót zasad dla nowych graczy.
Nie opisuj wszystkich wyjątków.
Uwzględnij cel gry, przebieg tury, punktację, najczęstsze błędy i pierwsze 3 decyzje, które początkujący powinien zrozumieć.
```

### 5. Aktualizacja house rules

```text
Na podstawie naszej decyzji z dzisiejszej partii zaktualizuj plik house rules.
Dodaj:
- datę,
- problem,
- decyzję,
- czy decyzja była tymczasowa,
- co trzeba sprawdzić w oficjalnym FAQ.
```

## Podsumowanie

LLM przy planszówkach to jedno z tych zastosowań AI, które jest małe, codzienne i naprawdę praktyczne. Nie trzeba budować systemu, trenować modelu ani pisać integracji. Wystarczy dobrze przygotowany projekt, instrukcja, kilka zasad bezpieczeństwa i rozsądne oczekiwania.

Najlepiej traktować model jak osobę siedzącą obok stołu z bardzo dobrą pamięcią do tekstu, ale bez prawa do ostatecznego głosu. Może pomóc znaleźć zasadę, przetłumaczyć efekt karty, przygotować skrót dla nowych graczy, uporządkować kampanię, stworzyć tracker punktów i zmniejszyć liczbę przerw w rozgrywce. Ale nadal to gracze decydują, jak grać.

I chyba właśnie w tym jest największa wartość. AI nie ma zabrać planszówkom społecznego charakteru. Ma usunąć trochę tarcia: mniej grzebania w instrukcji, mniej sporów o pamięć, mniej przerw, więcej grania.

## Źródła i dokumentacja

- [OpenAI Help - Projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt)
- [OpenAI Help - File Uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq)
- [OpenAI Help - ChatGPT Search](https://help.openai.com/articles/9237897-chatgpt-search)
- [OpenAI Help - Canvas in ChatGPT](https://help.openai.com/en/articles/9930697-using-canvas-in-chatgpt)
- [Claude Help - Projects](https://support.claude.com/en/articles/9517075-what-are-projects)
- [Claude Help - Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude)
- [Claude Help - Artifacts](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude Help - Web search](https://support.claude.com/en/articles/10684626-enable-and-use-web-search)
