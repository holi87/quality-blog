---
title: "Budowanie własnych agentów AI: od osobistego asystenta do zespołu specjalistów"
description: "Jak zbudować własnych agentów AI: od jednego osobistego asystenta po zespół wyspecjalizowanych agentów. Praktyczne podejście do projektowania, ról i koordynacji, bez magicznego myślenia."
date: 2026-06-26
tags: ["ai", "agenci ai", "llm", "automatyzacja", "produktywność"]
lang: pl
readingTime: 17
author: [JS, GH]
---

Jeszcze niedawno rozmowa o AI w pracy wyglądała najczęściej tak: otwieraliśmy ChatGPT, Claude albo inne narzędzie, wpisywaliśmy prompt, poprawialiśmy wynik, kopiowaliśmy fragment do dokumentu lub kodu i zaczynaliśmy od nowa. To było przydatne, ale miało jedną dużą wadę: za każdym razem trzeba było ponownie tłumaczyć kontekst, oczekiwania, styl pracy, format odpowiedzi i granice zadania.

Dziś coraz bardziej naturalnym kierunkiem jest budowanie **własnych wyspecjalizowanych agentów**. Nie chodzi o magiczne „cyfrowe osoby”, które same prowadzą nasze życie i piszą za nas cały system produkcyjny bez kontroli. Chodzi o coś dużo bardziej praktycznego: o powtarzalne, dobrze opisane role AI, które wiedzą, do czego służą, jaki mają zakres odpowiedzialności, z jakich źródeł mogą korzystać, jaki wynik mają oddać i kiedy powinny powiedzieć: „tego nie wiem” albo „tutaj potrzebuję decyzji człowieka”.

Taki agent może być prostym asystentem do planowania tygodnia. Może być prywatnym redaktorem technicznym. Może być agentem do przeglądu kodu, generowania testów, analizy logów albo tworzenia dokumentacji architektonicznej. Może też być „liderem”, czyli agentem koordynującym pracę kilku innych specjalistów: badacza, architekta, implementatora, testera, recenzenta bezpieczeństwa i autora dokumentacji.

W tym artykule przejdziemy przez temat bardzo praktycznie. Bez przesadnego hype’u, bez obietnic, że agent zastąpi zespół, i bez udawania, że wystarczy jedno zdanie promptu. Celem jest pokazanie, jak zacząć ćwiczyć budowanie agentów samemu: najpierw bardzo prosto, potem coraz bardziej świadomie, aż do własnych mini-zespołów agentowych do zadań zawodowych i codziennych.

---

## 1. Co właściwie nazywamy agentem?

W codziennym użyciu słowo „agent” jest nadużywane. Czasem oznacza zwykłego chatbota z ładnie napisanym promptem. Czasem oznacza skrypt korzystający z API. Czasem oznacza narzędzie deweloperskie, które potrafi czytać pliki, zmieniać kod, uruchamiać testy i iterować, dopóki wynik nie będzie poprawny.

Na potrzeby praktyki przyjmijmy prostą definicję:

> **Agent AI to wyspecjalizowany asystent, który ma określoną rolę, cel, kontekst, narzędzia, ograniczenia, procedurę działania oraz sposób weryfikacji wyniku.**

To ważne, bo „agent” nie staje się agentem dlatego, że nazwiemy go agentem. Staje się nim wtedy, gdy ma powtarzalny sposób pracy. Dobry agent nie tylko odpowiada. Dobry agent realizuje zadanie w ramach ustalonego procesu.

Można to porównać do różnicy między przypadkowym pytaniem kolegi na korytarzu a zleceniem pracy specjaliście. Jeśli mówimy: „rzuć okiem na ten kod”, dostaniemy ogólną opinię. Jeśli mówimy: „jesteś recenzentem jakości kodu backendowego; sprawdź klasę pod kątem czytelności, testowalności, obsługi błędów i ryzyka regresji; nie zmieniaj kodu, tylko oddaj listę problemów w kolejności ważności”, dostaniemy zupełnie inny typ wyniku.

Agent powinien mieć kilka elementów:

1. **Rolę** - kim jest w tym zadaniu, np. architekt testów, redaktor, planista, analityk logów.
2. **Misję** - po co istnieje, jaki problem rozwiązuje.
3. **Zakres** - czym się zajmuje, a czym nie.
4. **Kontekst** - informacje o użytkowniku, projekcie, repozytorium, stylu pracy, ograniczeniach.
5. **Narzędzia** - pliki, wyszukiwarka, kalendarz, repozytorium, terminal, API, system smart home, baza wiedzy.
6. **Procedurę** - kroki, które wykonuje przed odpowiedzią.
7. **Format wyjścia** - jak ma wyglądać wynik.
8. **Bramki jakości** - co musi sprawdzić przed oddaniem wyniku.
9. **Granice bezpieczeństwa** - czego nie wolno mu robić bez akceptacji.
10. **Mechanizm eskalacji** - kiedy ma zatrzymać się i zapytać człowieka.

Dopiero z tych elementów powstaje coś, co realnie może oszczędzać czas, a nie tylko generować efektowne teksty.

---

## 2. Dlaczego warto budować własnych agentów, zamiast używać jednego ogólnego czatu?

Ogólny czat jest świetny do eksploracji. Można go zapytać o pomysł, poprosić o porównanie technologii, wyjaśnienie błędu, napisanie fragmentu tekstu albo przetłumaczenie wiadomości. Problem zaczyna się wtedy, gdy zadanie jest powtarzalne.

Jeśli co tydzień przygotowujesz raport, agent raportujący powinien znać format raportu. Jeśli regularnie analizujesz pull requesty, agent do code review powinien znać standardy Twojego zespołu. Jeśli tworzysz testy automatyczne, agent testowy powinien rozumieć, że nie chcesz losowych testów „dla pokrycia”, tylko testy, które wynikają z ryzyka biznesowego, kontraktów API, danych brzegowych i możliwych regresji. Jeśli planujesz dom, agent budowlany powinien wiedzieć, że interesują Cię konkretne technologie, styl, koszty eksploatacji, automatyzacje i ograniczenia działki.

Największa wartość agentów pojawia się w trzech miejscach.

Po pierwsze, **powtarzalność**. Zamiast za każdym razem pisać długi prompt, zapisujesz sposób pracy raz i używasz go wielokrotnie. To zmniejsza tarcie. Agent staje się narzędziem, a nie eksperymentem.

Po drugie, **spójność**. Jeśli agent ma jasne zasady, będzie zwracał wyniki w podobnym stylu i strukturze. To bardzo ważne w pracy z kodem, dokumentacją, raportami i analizą jakości.

Po trzecie, **kontekst domenowy**. Ogólny model zna wiele rzeczy, ale nie zna Twoich decyzji architektonicznych, standardów zespołu, skrótów myślowych, preferowanych bibliotek, historii projektu ani osobistych preferencji. Agent może dostać ten kontekst w formie instrukcji, plików, notatek, przykładów i checklist.

W praktyce dobry agent działa trochę jak junior, któremu dobrze opisaliśmy zadanie, ale z jedną różnicą: agent nie obrazi się, gdy każemy mu dziesięć razy poprawiać ten sam format. To świetne narzędzie do ćwiczenia własnego procesu myślenia. Jeśli nie umiesz zdefiniować dobrego agenta do przeglądu testów, to być może sam proces przeglądu testów w zespole też nie jest wystarczająco dobrze opisany.

---

## 3. Sześć poziomów dojrzałości: od promptu do zespołu agentów

Budowanie agentów nie musi zaczynać się od API, kontenerów, webhooków i integracji z firmowymi systemami. Lepiej zacząć od prostego poziomu i dopiero potem zwiększać automatyzację.

### Poziom 0: zapisany prompt

Najprostszy agent to dobrze napisany prompt, który zapisujesz w notatniku. Przykład: „Jesteś redaktorem technicznym mojego bloga. Popraw tekst, zachowując mój styl, nie skracaj za mocno, wypisz zmiany i oznacz miejsca wymagające fakt-checkingu”.

To nie jest jeszcze pełny system agentowy, ale jest to dobry początek. Dzięki temu zaczynasz myśleć rolami i procedurami.

### Poziom 1: projekt z instrukcjami i plikami

Kolejny krok to przeniesienie promptu do przestrzeni roboczej, która pamięta kontekst. W narzędziach typu ChatGPT Projects można trzymać rozmowy, pliki referencyjne i instrukcje projektu. W praktyce oznacza to, że agent redakcyjny może mieć dostęp do poprzednich artykułów, stylu bloga, listy pojęć, których używasz, oraz zasad publikacji.

Dla codziennych potrzeb można stworzyć osobne projekty: „Dom i budowa”, „Smart home”, „Dieta i zakupy”, „Blog”, „Nauka angielskiego”, „Gry planszowe”. Dla pracy: „Projekt API”, „Framework testowy”, „ABAP/SAP”, „Mentoring QA”, „Prezentacje i szkolenia”.

### Poziom 2: własny GPT, Skill, Project lub agent konfigurowany w narzędziu

Na tym poziomie agent dostaje bardziej trwałą konfigurację: instrukcje, wiedzę, przykłady, czasem akcje lub narzędzia. W ChatGPT można budować własne GPT skonfigurowane do konkretnego celu. W Claude Code można definiować umiejętności i subagentów. W innych narzędziach istnieją podobne mechanizmy: projekty, zasady repozytorium, pliki instrukcji, profile agentów, workflows.

Ważne: nie chodzi o nazwę funkcji w konkretnym produkcie. Produkty będą się zmieniały. Istotny jest wzorzec: **wyciągamy powtarzalną wiedzę i procedury z naszej głowy do konfiguracji agenta**.

### Poziom 3: agent pracujący z repozytorium lub konkretnym zbiorem danych

To etap szczególnie ciekawy dla osób pracujących z kodem. Agent nie tylko odpowiada na pytania, ale może czytać pliki, wyszukiwać zależności, proponować zmiany, uruchamiać testy, analizować błędy i weryfikować wynik. Narzędzia agentowe do kodu często działają w pętli: zbierz kontekst, wykonaj akcję, sprawdź rezultat, popraw.

Na tym poziomie trzeba bardzo pilnować granic. Agent może proponować zmianę w kodzie, ale nie powinien bez kontroli robić operacji destrukcyjnych, wypychać zmian na produkcję, kasować danych albo modyfikować konfiguracji bezpieczeństwa.

### Poziom 4: zespół agentów z liderem

Tu zaczyna się prawdziwa zabawa. Zamiast jednego agenta, budujesz mały zespół. Lider analizuje zadanie, dzieli je na części, wybiera specjalistów, zbiera ich wyniki, wykrywa sprzeczności i przygotowuje decyzję dla człowieka.

Przykład dla zadania technicznego:

- **Agent Lider** - rozumie cel, dzieli pracę, pilnuje zakresu.
- **Agent Architekt** - analizuje wpływ zmiany na strukturę systemu.
- **Agent Implementator** - proponuje konkretne zmiany w kodzie.
- **Agent Test Architect** - projektuje testy i ryzyka regresji.
- **Agent Security Reviewer** - szuka problemów bezpieczeństwa.
- **Agent Documentation Writer** - aktualizuje dokumentację i ADR.

Dla codziennego zadania związanego np. z remontem albo budową:

- **Agent Lider Projektu** - tworzy plan i kolejność decyzji.
- **Agent Kosztowy** - pilnuje budżetu i wariantów.
- **Agent Techniczny** - analizuje wymagania instalacyjne.
- **Agent Smart Home** - proponuje automatyzacje i czujniki.
- **Agent Ryzyk** - szuka miejsc, gdzie można popełnić kosztowny błąd.

To nie oznacza, że musisz mieć fizycznie pięć różnych narzędzi. Czasem wystarczy jeden model poproszony o symulację ról. Jednak przy większych zadaniach osobne agenty z osobnym kontekstem są wygodniejsze, bo nie zaśmiecają głównej rozmowy szczegółami.

### Poziom 5: workflow programistyczny z API, narzędziami i kontrolą

Najbardziej zaawansowany poziom to agenci budowani programistycznie. Wtedy definiujesz agentów w kodzie, dajesz im narzędzia, pamięć, handoffy, walidacje, logowanie i bramki akceptacji. Można integrować je z repozytorium, systemem ticketowym, dokumentacją, kalendarzem, bazą wiedzy, Home Assistantem albo wewnętrznym API.

To poziom dla organizacji i zaawansowanych użytkowników. Ale nawet wtedy zasada jest ta sama: mały, dobrze opisany agent jest lepszy niż wielki, niejasny „superagent”, który ma robić wszystko.

---

## 4. Najważniejsza zasada: agent ma mieć mały zakres

Najczęstszy błąd początkujących brzmi: „Zbuduję agenta, który będzie mi pomagał we wszystkim”. To prosta droga do chaosu. Agent od wszystkiego jest najczęściej agentem od niczego.

Lepszy agent ma wąski zakres i jasną odpowiedzialność.

Zamiast:

> „Jesteś moim asystentem do pracy.”

Lepiej:

> „Jesteś agentem do przygotowywania technicznego planu testów dla zmian backendowych w aplikacjach Java/Spring. Na podstawie opisu zmiany, endpointów, DTO, ryzyk i istniejących testów przygotowujesz listę przypadków testowych, braków w pokryciu oraz propozycję automatyzacji. Nie piszesz kodu produkcyjnego. Jeśli brakuje informacji o wymaganiach lub danych testowych, oznaczasz to jako pytanie otwarte.”

To samo dotyczy życia codziennego.

Zamiast:

> „Pomagaj mi w domu.”

Lepiej:

> „Jesteś agentem do analizy danych z czujników domu i budowy. Interesują Cię temperatura, wilgotność, zużycie energii i alerty z kamer. Twoim zadaniem jest przygotowanie krótkiego raportu dziennego, wskazanie anomalii i zaproponowanie działań, ale nie wolno Ci samodzielnie wyłączać urządzeń ani zmieniać automatyzacji bez mojej akceptacji.”

Mały zakres daje trzy korzyści: łatwiej ocenić wynik, łatwiej poprawić instrukcję i łatwiej zaufać procesowi. Zaufanie nie powinno wynikać z tego, że model brzmi pewnie. Zaufanie powinno wynikać z tego, że agent działa w znanym procesie i oddaje wynik, który można zweryfikować.

---

## 5. Szablon projektowania agenta

Poniżej znajduje się prosty szablon, który można wkleić do ChatGPT, Claude, narzędzia typu Custom GPT, projektu, pliku instrukcji albo dokumentacji własnego workflow. To jest jedna z najważniejszych części artykułu, bo właśnie taki szablon pozwala zacząć ćwiczyć.

```markdown
# Agent: [nazwa]

## 1. Misja
Twoim zadaniem jest [konkretny cel]. Pomagasz użytkownikowi osiągnąć [rezultat], zachowując [najważniejsze zasady].

## 2. Rola
Działasz jako [rola/specjalizacja], np. architekt testów, recenzent kodu, redaktor techniczny, planista domu, sędzia gier planszowych.

## 3. Użytkownik i kontekst
Użytkownik pracuje nad [projekt/obszar]. Preferuje [styl odpowiedzi, język, poziom szczegółowości]. Ważne ograniczenia: [technologie, budżet, standardy, ryzyka].

## 4. Zakres odpowiedzialności
Zajmujesz się:
- [obszar 1]
- [obszar 2]
- [obszar 3]

Nie zajmujesz się:
- [rzecz wyłączona]
- [rzecz wymagająca eksperta]
- [czynność zabroniona]

## 5. Dane wejściowe
Pracujesz na podstawie:
- opisu zadania,
- załączonych plików,
- fragmentów kodu,
- notatek użytkownika,
- wyników narzędzi,
- pytań doprecyzowujących, jeśli są konieczne.

## 6. Procedura działania
Zawsze:
1. Zidentyfikuj cel zadania.
2. Wypisz założenia.
3. Sprawdź, czy brakuje krytycznych informacji.
4. Wykonaj analizę lub plan.
5. Zweryfikuj wynik z checklistą jakości.
6. Oddaj odpowiedź w ustalonym formacie.

## 7. Format odpowiedzi
Odpowiadaj w strukturze:
- Podsumowanie
- Najważniejsze ustalenia
- Rekomendacje
- Ryzyka / pytania otwarte
- Następne kroki

## 8. Zasady jakości
Nie zgaduj faktów. Oznaczaj niepewność. Oddzielaj fakty od rekomendacji. Dla kodu: uwzględniaj testowalność, utrzymanie, czytelność i regresję. Dla codziennych decyzji: pokazuj warianty i konsekwencje.

## 9. Granice bezpieczeństwa
Nie wykonuj działań nieodwracalnych bez akceptacji. Nie usuwaj danych. Nie wysyłaj wiadomości. Nie kupuj produktów. Nie zmieniaj konfiguracji produkcyjnej. Nie traktuj porad medycznych, prawnych ani finansowych jako ostatecznych decyzji.

## 10. Eskalacja
Zatrzymaj się i zapytaj użytkownika, jeśli:
- decyzja jest kosztowna,
- działanie jest nieodwracalne,
- brakuje danych,
- istnieje ryzyko bezpieczeństwa,
- wynik może wpłynąć na zdrowie, finanse, prawo lub produkcję.
```

Ten szablon wygląda prosto, ale robi ogromną różnicę. Uczy myślenia o agencie jak o małym procesie, a nie jak o losowej rozmowie.

---

## 6. Agent lider: jak zbudować zespół do zadania

Jednym z ciekawszych wzorców jest **agent lider**. Jego zadaniem nie jest robić wszystko samemu. Jego zadaniem jest zaprojektować sposób wykonania zadania i dobrać specjalistów.

Agent lider powinien odpowiadać na kilka pytań:

- Jaki jest cel zadania?
- Jakie decyzje trzeba podjąć?
- Jakie obszary wymagają osobnej analizy?
- Jakich agentów warto powołać?
- Co każdy agent ma dostać jako kontekst?
- W jakim formacie ma oddać wynik?
- Jak połączyć wyniki w jedną rekomendację?
- Gdzie są sprzeczności i ryzyka?
- Co musi zatwierdzić człowiek?

Przykładowy prompt dla agenta lidera:

```markdown
Jesteś Agentem Liderem. Twoim zadaniem jest zorganizować pracę zespołu agentów dla poniższego zadania.

Zadanie: [opisz zadanie]

Nie rozwiązuj całego problemu od razu. Najpierw:
1. Zdefiniuj cel i oczekiwany wynik.
2. Zaproponuj zespół agentów specjalistycznych.
3. Dla każdego agenta opisz jego rolę, dane wejściowe, zakres i format odpowiedzi.
4. Wskaż kolejność pracy: kto pracuje równolegle, a kto po kim.
5. Wypisz ryzyka i decyzje wymagające zatwierdzenia przez człowieka.
6. Na końcu przygotuj zintegrowany plan działania.

Nie twórz sztucznie zbyt dużego zespołu. Jeśli wystarczą 2 role, użyj 2 ról.
```

W pracy z kodem taki lider może utworzyć zespół:

- **Repo Explorer** - czyta strukturę projektu i znajduje istotne pliki.
- **Requirement Analyst** - tłumaczy wymaganie na konsekwencje techniczne.
- **Implementation Agent** - proponuje zmianę.
- **Test Architect** - projektuje testy.
- **Regression Hunter** - szuka miejsc, które mogą się zepsuć.
- **Documentation Agent** - aktualizuje README, ADR albo changelog.

W codziennych potrzebach lider może pracować inaczej:

- **Planista** - układa kolejność działań.
- **Researcher** - zbiera opcje.
- **Sceptyk** - szuka słabych punktów.
- **Budżetowiec** - pilnuje kosztów.
- **Redaktor** - zamienia wynik w czytelny plan.

Warto pamiętać: zespół agentów to nie zawsze lepsze rozwiązanie. Jeśli zadanie jest proste, zespół tylko wydłuży pracę. Używaj agentów-liderów wtedy, gdy zadanie ma kilka wymiarów: techniczny, kosztowy, organizacyjny, jakościowy, bezpieczeństwa albo komunikacyjny.

---

## 7. Agenci do pracy z kodem

Agenci kodowi są jednymi z najbardziej praktycznych, ale też najbardziej ryzykownych. Model może bardzo przekonująco zaproponować zmianę, która kompiluje się tylko w jego wyobraźni. Dlatego agent kodowy musi mieć mocną procedurę weryfikacji.

Dobry agent do kodu nie powinien zaczynać od pisania. Powinien zaczynać od zrozumienia. Najpierw czyta strukturę projektu, sprawdza istniejące wzorce, identyfikuje testy, patrzy na konwencje i dopiero potem proponuje zmianę.

### Przykład 1: Agent Test Architect

```markdown
# Agent: Test Architect

Misja:
Projektujesz strategię testów dla zmian backendowych i integracyjnych.

Zakres:
- analiza ryzyka regresji,
- projektowanie testów jednostkowych, integracyjnych i kontraktowych,
- wskazywanie braków w istniejącym pokryciu,
- proponowanie danych testowych,
- analiza czy testy są czytelne i utrzymywalne.

Nie robisz:
- nie zmieniasz produkcyjnego kodu bez osobnej prośby,
- nie tworzysz testów wyłącznie dla procentu pokrycia,
- nie ignorujesz przypadków brzegowych.

Procedura:
1. Opisz zmianę biznesowo.
2. Wskaż komponenty dotknięte zmianą.
3. Wypisz ryzyka.
4. Zaproponuj przypadki testowe.
5. Podziel je na must-have, should-have, nice-to-have.
6. Wskaż, które testy warto automatyzować.
7. Wypisz pytania otwarte.

Format:
- Kontekst zmiany
- Ryzyka
- Proponowane testy
- Automatyzacja
- Braki / pytania
```

To jest agent, którego można użyć przy pull requestach, analizie historyjek, zmianach API, refaktoryzacji frameworka testowego albo przygotowaniu planu regresji.

### Przykład 2: Agent Code Review Adversary

Ten agent nie ma być miły. Ma szukać problemów.

```markdown
# Agent: Code Review Adversary

Działasz jako wymagający recenzent kodu. Twoim celem jest znaleźć problemy, które mogą przejść niezauważone: ukryte zależności, nieczytelność, brak testów, błędną obsługę wyjątków, ryzyko regresji, problemy wydajnościowe i naruszenie konwencji projektu.

Zasady:
- Nie przepisuj kodu od razu.
- Najpierw opisz problem i jego wpływ.
- Odróżniaj blokery od sugestii.
- Nie czepiaj się stylu, jeśli nie ma wpływu na utrzymanie.
- Jeśli czegoś nie możesz potwierdzić, oznacz jako hipotezę.

Format odpowiedzi:
1. Blokery
2. Ważne problemy
3. Sugestie
4. Brakujące testy
5. Pytania do autora
```

To bardzo dobry agent do ćwiczenia jakości. Jeśli używasz go regularnie, szybko zobaczysz powtarzające się wzorce błędów w projekcie.

### Przykład 3: Agent Refactoring Scout

Ten agent nie ma od razu refaktoryzować. Ma znaleźć miejsca, gdzie refaktoryzacja ma sens.

```markdown
# Agent: Refactoring Scout

Twoim zadaniem jest znaleźć kandydatów do refaktoryzacji, ale nie zmieniać kodu bez decyzji użytkownika.

Szukaj:
- duplikacji logiki,
- zbyt dużych klas,
- metod o zbyt wielu odpowiedzialnościach,
- trudnych do testowania zależności,
- nazw, które nie opisują intencji,
- miejsc, gdzie wyjątki są połykane albo logowane bez działania,
- testów kruchych i zbyt mocno zależnych od implementacji.

Dla każdego problemu podaj:
- lokalizację,
- objaw,
- wpływ,
- propozycję poprawy,
- ryzyko zmiany,
- minimalny bezpieczny krok.
```

Ten wzorzec jest świetny, bo ogranicza pokusę „dużej refaktoryzacji wszystkiego”. Agent ma szukać małych, bezpiecznych kroków.

### Przykład 4: Agent Dokumentacji Technicznej

Kod bez dokumentacji bywa problemem, ale dokumentacja oderwana od kodu jest jeszcze gorsza. Agent dokumentacyjny może pomagać pisać ADR-y, README, instrukcje uruchomienia, opisy endpointów, changelogi i notatki migracyjne.

Ważna zasada: agent dokumentacyjny powinien oddzielać to, co wynika z kodu, od tego, co jest jego interpretacją. Jeśli nie ma pewności, powinien oznaczyć fragment jako „do potwierdzenia”.

---

## 8. Agenci do codziennych potrzeb

Agenci nie są tylko dla programistów. W życiu codziennym często mamy powtarzalne procesy decyzyjne, które są męczące właśnie dlatego, że nie są trudne, ale wracają co tydzień.

### Agent planowania tygodnia

Taki agent może łączyć zadania prywatne, pracę, trening, zakupy, obowiązki domowe i czas wolny. Nie chodzi o to, żeby AI zarządzało życiem. Chodzi o to, żeby pomogło zobaczyć konflikt zasobów: zbyt dużo rzeczy na jeden dzień, brak czasu na odpoczynek, niedoszacowanie dojazdów, przeciążenie po pracy.

Dobry prompt:

```markdown
Jesteś agentem planowania tygodnia. Pomagasz mi ułożyć realistyczny plan, bez przeładowywania dnia.

Zasady:
- Zakładaj bufor między zadaniami.
- Oddzielaj zadania wymagające skupienia od prostych spraw.
- Wskazuj dni przeciążone.
- Proponuj maksymalnie 3 priorytety dziennie.
- Nie planuj mi każdej minuty.

Na końcu daj:
- plan tygodnia,
- największe ryzyka,
- rzeczy do usunięcia lub przesunięcia,
- jedną rekomendację upraszczającą tydzień.
```

### Agent domowy lub budowlany

Jeśli budujesz dom, remontujesz mieszkanie albo rozwijasz smart home, agent może być świetnym miejscem do porządkowania decyzji. Może pomagać analizować oferty, porównywać warianty, planować kolejność prac, pilnować pytań do wykonawcy, interpretować dane z czujników albo tworzyć propozycje automatyzacji.

Przykład:

```markdown
Jesteś agentem wsparcia budowy i smart home. Pomagasz mi analizować decyzje techniczne, ale nie udajesz kierownika budowy ani elektryka z uprawnieniami.

Zawsze oddzielaj:
- fakty,
- założenia,
- ryzyka,
- pytania do fachowca,
- propozycje automatyzacji.

Jeśli temat dotyczy bezpieczeństwa elektrycznego, konstrukcji, gazu, wentylacji lub przepisów, oznacz, że wymaga potwierdzenia przez specjalistę.
```

### Agent zakupowy

Agent zakupowy nie powinien po prostu wybierać „najlepszego produktu”. Powinien najpierw pomóc opisać kryteria: budżet, ograniczenia, wymagania, rzeczy zbędne, ryzyka marketingowe. Przy większych zakupach jego wartością jest nie tyle odpowiedź „kup to”, ile matryca decyzji.

### Agent gier planszowych

Bardzo praktyczny przykład z codziennego życia. Agent może pomagać jako sędzia zasad, tłumacz instrukcji, wyszukiwarka fragmentów reguł, moderator sporu albo generator krótkiego streszczenia zasad dla nowych graczy.

Dobra instrukcja dla takiego agenta powinna zawierać ważną zasadę:

> Jeśli instrukcja gry jest załączona, opieraj się na niej. Jeśli nie masz instrukcji, wyraźnie oznacz, że korzystasz z ogólnej wiedzy i wynik trzeba potwierdzić w oficjalnych zasadach.

To ogranicza halucynacje. Agent nie powinien wymyślać reguł tylko dlatego, że brzmią logicznie.

### Agent zdrowych nawyków

Tu trzeba szczególnie uważać. Agent może pomagać planować posiłki, listy zakupów, aktywność albo przypomnienia, ale nie powinien zastępować lekarza ani dietetyka w sprawach medycznych. Dobry agent zdrowych nawyków powinien trzymać się organizacji, konsekwencji i monitorowania, a nie diagnozowania.

---

## 9. Narzędzia, pamięć i kontekst: co agent powinien wiedzieć?

Agent bez kontekstu jest jak nowa osoba w zespole bez onboardingu. Może być inteligentny, ale będzie zgadywał. Dlatego największa praca przy budowie agentów polega często nie na pisaniu promptów, tylko na przygotowaniu kontekstu.

Dla agenta kodowego kontekstem mogą być:

- README projektu,
- struktura katalogów,
- komendy build/test,
- standardy kodowania,
- decyzje architektoniczne,
- przykłady dobrych testów,
- lista antywzorców,
- instrukcja obsługi środowiska lokalnego,
- definicje ról i zasad code review.

Dla agenta codziennego:

- preferencje użytkownika,
- ograniczenia budżetowe,
- harmonogram,
- lista rzeczy nielubianych,
- dokumenty referencyjne,
- poprzednie decyzje,
- szablony raportów,
- zasady bezpieczeństwa.

Trzeba jednak uważać, aby nie wrzucać wszystkiego do jednego wielkiego pliku. Zbyt dużo kontekstu pogarsza jakość, bo ważne zasady giną w szumie. Lepiej mieć krótką instrukcję główną i osobne pliki referencyjne używane tylko wtedy, gdy są potrzebne.

Praktyczna zasada:

> To, co agent musi wiedzieć zawsze, trafia do instrukcji głównej. To, co jest potrzebne tylko czasami, trafia do plików, skillów, checklist albo dokumentów referencyjnych.

W pracy z kodem bardzo dobrze działa rozdział:

- **instrukcje stałe**: styl, komendy, architektura,
- **checklisty zadaniowe**: code review, testy, release,
- **wiedza domenowa**: słowniki, protokoły, procesy biznesowe,
- **przykłady**: dobre PR-y, dobre testy, dobre ADR-y.

---

## 10. Narzędzia zewnętrzne i MCP: kiedy agent ma mieć „ręce”

Na początku agent może działać tylko na tekście. To bezpieczne i wystarczające do nauki. Z czasem pojawia się pytanie: czy agent powinien mieć narzędzia?

Narzędziem może być:

- dostęp do plików,
- wyszukiwarka,
- terminal,
- repozytorium Git,
- system ticketowy,
- kalendarz,
- e-mail,
- Home Assistant,
- baza danych,
- API firmowe,
- przeglądarka,
- narzędzie do uruchamiania testów.

Im więcej narzędzi, tym większa wartość, ale też większe ryzyko. Agent, który tylko pisze plan, może się pomylić. Agent, który ma dostęp do narzędzi, może coś zmienić. Dlatego należy stosować zasadę najmniejszych uprawnień.

Agent do analizy repozytorium nie musi mieć prawa do pushowania zmian. Agent do raportów domowych nie musi mieć prawa do wyłączania ogrzewania. Agent do zakupów nie musi mieć prawa do finalizacji płatności. Agent do maili może przygotować szkic, ale wysyłkę powinien zatwierdzić człowiek.

W świecie agentów coraz ważniejszy staje się Model Context Protocol, czyli standardowy sposób podłączania modeli do narzędzi i danych. Praktycznie rzecz biorąc, MCP można traktować jak warstwę integracji: agent dostaje opis dostępnych narzędzi i może ich używać według zdefiniowanych zasad. To bardzo mocny kierunek, ale nadal obowiązuje zdrowy rozsądek: nie każde narzędzie trzeba podłączać od razu.

Dobre pytanie przed dodaniem narzędzia brzmi:

> Czy to narzędzie realnie skraca pracę agenta, czy tylko zwiększa powierzchnię ryzyka?

---

## 11. Jak testować agenta?

Jeśli agent ma być użyteczny, trzeba go testować. Brzmi zabawnie, ale to bardzo podobne do testowania aplikacji. Agent ma wymagania, dane wejściowe, oczekiwany format wyjścia i przypadki brzegowe.

Najprostsza metoda to zestaw trzech do pięciu zadań testowych.

Dla agenta code review:

1. Prosty PR bez większych problemów.
2. PR z ukrytym błędem logicznym.
3. PR z brakiem testów.
4. PR z problemem bezpieczeństwa.
5. PR z dobrym kodem, którego agent nie powinien niepotrzebnie krytykować.

Dla agenta planszówkowego:

1. Proste pytanie o kolejność akcji.
2. Spór między dwoma interpretacjami reguły.
3. Brak fragmentu instrukcji.
4. Pytanie zależne od dodatku lub wersji gry.
5. Sytuacja, w której agent powinien powiedzieć „nie wiem”.

Dla agenta planowania tygodnia:

1. Tydzień z małą liczbą zadań.
2. Tydzień przeładowany.
3. Konflikt terminów.
4. Zadania bez priorytetów.
5. Prośba o plan nierealistyczny.

Po każdym teście warto zadać sobie pytania:

- Czy agent trzymał się roli?
- Czy odpowiedź miała właściwy format?
- Czy oznaczył niepewność?
- Czy zapytał, gdy brakowało danych?
- Czy nie zrobił czegoś poza zakresem?
- Czy wynik był praktyczny?
- Czy trzeba doprecyzować instrukcję?

Najlepszym sposobem rozwijania agenta jest iteracja. Nie próbuj napisać idealnej instrukcji od razu. Napisz wersję 1.0, przetestuj na prawdziwych przypadkach, popraw, zapisz wersję 1.1.

---

## 12. Antywzorce: czego unikać

Budowanie agentów łatwo zepsuć. Oto najczęstsze antywzorce.

### Antywzorzec 1: agent od wszystkiego

Jeśli agent ma pisać kod, planować dietę, recenzować teksty, analizować finanse i sterować domem, to jego instrukcje będą zbyt ogólne. Lepiej mieć kilka małych agentów.

### Antywzorzec 2: brak formatu wyjścia

Bez formatu agent będzie odpowiadał raz tabelą, raz esejem, raz listą luźnych uwag. Format jest kontraktem. Dzięki niemu wynik można porównać i automatyzować.

### Antywzorzec 3: brak granic bezpieczeństwa

Agent musi wiedzieć, czego nie wolno mu robić. Szczególnie przy kodzie, danych, pieniądzach, zdrowiu, prawie, urządzeniach domowych i komunikacji z innymi ludźmi.

### Antywzorzec 4: zbyt dużo kontekstu

Wrzucenie setek stron dokumentów bez struktury nie tworzy mądrego agenta. Tworzy szum. Lepiej dać krótkie instrukcje i dobrze opisane pliki referencyjne.

### Antywzorzec 5: brak weryfikacji

Agent brzmi pewnie nawet wtedy, gdy się myli. Dlatego potrzebuje checklisty, testów, źródeł i jasnego oznaczania niepewności.

### Antywzorzec 6: automatyzacja zbyt wcześnie

Nie automatyzuj procesu, którego jeszcze nie rozumiesz. Najpierw wykonaj go ręcznie z agentem kilka razy. Dopiero potem podłącz narzędzia i workflow.

---

## 13. Plan ćwiczeń: jak zacząć w praktyce

Poniżej prosty plan na kilka tygodni. Nie wymaga API ani programowania. Wystarczy narzędzie LLM, notatnik i kilka realnych zadań.

### Tydzień 1: agent jako zapisany prompt

Wybierz jedno powtarzalne zadanie. Może to być code review, plan posiłków, analiza artykułu, przygotowanie szkolenia, plan tygodnia albo sędziowanie gry planszowej.

Napisz krótką kartę agenta:

- nazwa,
- misja,
- zakres,
- format odpowiedzi,
- czego nie robi,
- kiedy pyta użytkownika.

Użyj jej minimum trzy razy i zapisz, co poszło źle.

### Tydzień 2: dodaj przykłady

Agent dużo lepiej działa, gdy widzi przykłady dobrych wyników. Dodaj jeden przykład dobrej odpowiedzi i jeden przykład złej odpowiedzi. Opisz, dlaczego jedna jest dobra, a druga zła.

Przykład dla agenta code review:

- dobra uwaga: „Brakuje testu dla pustej listy, bo metoda mapująca zwraca null zamiast pustej kolekcji; może to powodować NPE w kontrolerze”.
- zła uwaga: „Kod wygląda brzydko”.

### Tydzień 3: dodaj checklistę jakości

Każdy agent powinien mieć checklistę. Dla testów: przypadki brzegowe, regresja, dane, asercje, czytelność. Dla artykułu: teza, struktura, przykłady, źródła, niepewność. Dla planu tygodnia: priorytety, bufory, konflikty, przeciążenie.

### Tydzień 4: zbuduj duet agentów

Połącz dwa agenty. Na przykład:

- autor + recenzent,
- implementator + tester,
- planista + sceptyk,
- researcher + redaktor,
- lider + specjalista.

To świetne ćwiczenie, bo pokazuje, że agent nie musi być idealny. Jeden agent może tworzyć, drugi może krytykować.

### Tydzień 5: dodaj lidera

Stwórz agenta lidera, który przed rozpoczęciem zadania wybiera role. Niech nie zawsze tworzy duży zespół. Jego zadaniem jest dobrać minimalny sensowny skład.

### Tydzień 6: dopiero teraz myśl o automatyzacji

Jeśli agent działa dobrze ręcznie, można go przenieść do projektu, własnego GPT, skilla, subagenta w narzędziu kodowym albo workflow z API. Automatyzacja ma sens dopiero wtedy, gdy proces jest powtarzalny.

---

## 14. Mini-przykład: własny zespół do zadania kodowego

Załóżmy, że masz zadanie: „Dodać endpoint zmiany hasła w aplikacji Spring Boot, z testami i aktualizacją dokumentacji”.

Agent lider mógłby zaproponować taki zespół:

### 1. Requirement Agent

Ma zrozumieć wymaganie:

- kto może zmieniać hasło,
- czy hasło stare jest wymagane,
- co po zmianie sesji lub tokena,
- jakie walidacje obowiązują,
- jakie komunikaty błędów są potrzebne.

### 2. Architecture Agent

Ma sprawdzić, gdzie zmiana pasuje:

- kontroler,
- serwis,
- walidator,
- DTO,
- security config,
- obsługa wyjątków,
- dokumentacja Swagger/OpenAPI.

### 3. Implementation Agent

Ma przygotować minimalny plan implementacji, zgodny z istniejącymi wzorcami.

### 4. Test Architect Agent

Ma zaproponować testy:

- sukces,
- błędne stare hasło,
- zbyt słabe nowe hasło,
- nowe hasło takie samo jak stare,
- brak autoryzacji,
- użytkownik nieistniejący,
- wpływ na tokeny/sesje.

### 5. Security Reviewer

Ma sprawdzić:

- czy hasło nie trafia do logów,
- czy odpowiedzi nie ujawniają zbyt dużo,
- czy walidacja nie jest tylko po stronie frontendu,
- czy operacja wymaga uwierzytelnienia,
- czy po zmianie hasła trzeba unieważnić token.

### 6. Documentation Agent

Ma przygotować opis endpointu, przykłady request/response i notatkę do changeloga.

Na końcu lider powinien połączyć wyniki w jeden plan:

- decyzje wymagające potwierdzenia,
- zakres implementacji,
- lista plików do zmiany,
- plan testów,
- ryzyka,
- kolejność prac.

To jest realna wartość agentów: nie chodzi o to, że jeden model „napisze wszystko”. Chodzi o to, że zadanie zostanie rozbite na sensowne perspektywy, a człowiek dostanie lepszy materiał do decyzji.

---

## 15. Mini-przykład: własny zespół do codziennego zadania

Załóżmy, że chcesz zaplanować mały system monitorowania budowy: temperatura, wilgotność, kamera, powiadomienia, raport dzienny.

Agent lider może dobrać taki zespół:

### 1. Context Agent

Zbiera założenia:

- czy na budowie jest prąd,
- czy jest internet,
- jakie pomieszczenia monitorujemy,
- gdzie są ryzyka wilgoci,
- czy są kamery,
- czy jest Home Assistant,
- jakie powiadomienia mają sens.

### 2. Sensor Agent

Proponuje czujniki i miejsca montażu:

- temperatura,
- wilgotność,
- zalanie,
- otwarcie drzwi,
- ruch,
- energia,
- jakość powietrza, jeśli ma to sens.

### 3. Automation Agent

Projektuje automatyzacje:

- raport dzienny,
- alert ostrzegawczy,
- alert krytyczny,
- przypomnienie o wietrzeniu,
- informacja o zaniku zasilania,
- wykrycie nietypowego ruchu.

### 4. Camera Event Agent

Opisuje, jak interpretować zdarzenia z kamer:

- ruch człowieka,
- pojazd,
- zwierzę,
- wejście w strefę,
- zdarzenie po godzinach.

### 5. Risk Agent

Szuka problemów:

- fałszywe alarmy,
- brak internetu,
- rozładowane baterie,
- zły montaż czujnika,
- brak procedury reakcji,
- zbyt agresywne powiadomienia.

Na końcu lider tworzy plan minimum viable smart home na budowie. To jest dobry przykład codziennego zastosowania agentów: pomagają uporządkować decyzje, nie zastępując fachowców.

---

## 16. Najważniejsza umiejętność: pisanie instrukcji, które da się poprawiać

Budowanie agentów to nie jest jednorazowe napisanie genialnego promptu. To bardziej przypomina rozwój testów automatycznych albo dokumentacji procesowej. Pierwsza wersja będzie niedoskonała. To normalne.

Dobra instrukcja agenta powinna być wersjonowana. Możesz trzymać ją w pliku Markdown, repozytorium, projekcie lub notatniku. Po każdym użyciu warto dopisać jedną rzecz:

- co agent zrobił dobrze,
- co zrobił źle,
- jaką regułę trzeba doprecyzować,
- jaki przykład warto dodać,
- jakie pytanie powinien zadać następnym razem.

Po kilku iteracjach zaczyna powstawać bardzo wartościowy zasób: nie tylko agent, ale opis Twojego procesu pracy. To jest często ważniejsze niż sam model.

---

## 17. Jak odróżnić dobrego agenta od efektownego agenta?

Efektowny agent daje długie, pewne i ładnie brzmiące odpowiedzi. Dobry agent daje odpowiedzi przydatne, sprawdzalne i dopasowane do procesu.

Dobry agent:

- pyta, gdy brakuje danych,
- mówi, czego nie wie,
- nie wychodzi poza zakres,
- oddaje wynik w ustalonym formacie,
- rozróżnia fakty, założenia i rekomendacje,
- wskazuje ryzyka,
- nie robi automatycznie działań kosztownych lub nieodwracalnych,
- potrafi pracować na przykładach,
- poprawia się po feedbacku.

Efektowny, ale słaby agent:

- udaje pewność,
- generuje dużo tekstu bez decyzji,
- nie trzyma się formatu,
- ignoruje ograniczenia,
- miesza fakty z opiniami,
- wymyśla źródła,
- proponuje zbyt skomplikowane rozwiązania,
- robi rzeczy poza zakresem,
- nie potrafi powiedzieć „nie wiem”.

Warto mieć tę listę pod ręką, bo AI bardzo łatwo imponuje stylem. W pracy profesjonalnej styl nie wystarczy.

---

## 18. Na koniec: ćwiczenie na dziś

Jeśli chcesz zacząć dziś, zrób bardzo proste ćwiczenie.

Wybierz jedno zadanie, które wraca w Twoim życiu lub pracy. Niech będzie konkretne. Na przykład:

- przegląd pull requesta,
- plan testów do historyjki,
- analiza błędu z logów,
- przygotowanie posta na blog,
- plan zakupów na tydzień,
- sędziowanie zasad gry planszowej,
- raport z czujników smart home,
- porównanie ofert wykonawców.

Następnie napisz kartę agenta w pięciu punktach:

```markdown
Nazwa agenta:
Misja:
Zakres:
Format odpowiedzi:
Czego agent nie może robić:
```

Użyj tej karty na trzech realnych przykładach. Po każdym przykładzie dopisz jedną poprawkę do instrukcji. Po trzech użyciach będziesz mieć lepszego agenta niż 90% osób, które tylko wpisują doraźne prompty.

Najważniejsze jest podejście: nie budujesz „AI, które zrobi wszystko”. Budujesz małe, wyspecjalizowane narzędzia, które wzmacniają Twój sposób pracy. Agent lider pomaga rozbić duże zadania. Agenci specjalistyczni pomagają spojrzeć z różnych perspektyw. Człowiek nadal podejmuje decyzje, ustawia granice i odpowiada za wynik.

I właśnie to jest najrozsądniejszy sposób korzystania z agentów: nie jako zamiennik myślenia, tylko jako system do porządkowania pracy, przyspieszania analizy i lepszego podejmowania decyzji.

---

## Źródła i dalsza lektura

- OpenAI Help Center: [Projects in ChatGPT](https://help.openai.com/en/articles/10169521-using-projects-in-chatgpt)
- OpenAI Help Center: [Creating and editing GPTs](https://help.openai.com/en/articles/8554397-creating-a-gpt)
- OpenAI Help Center: [GPTs in ChatGPT](https://help.openai.com/en/articles/8554407-gpts-faq)
- OpenAI Developers: [Agents SDK](https://developers.openai.com/api/docs/guides/agents)
- OpenAI Developers: [Define agents](https://developers.openai.com/api/docs/guides/agents/define-agents)
- OpenAI Developers: [Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder)
- Claude Code Docs: [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- Claude Code Docs: [Extend Claude with skills](https://code.claude.com/docs/en/skills)
- Claude Code Docs: [How Claude remembers your project](https://code.claude.com/docs/en/memory)
- Claude Code Docs: [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)
- Model Context Protocol: [Introduction](https://modelcontextprotocol.io/docs/getting-started/intro)
- Model Context Protocol: [Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
