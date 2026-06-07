---
title: "Ultracode i Dynamic Workflows w Claude Code - co naprawdę zmieniają dla QA, architektów i zespołów developerskich?"
description: "Czym naprawdę jest Ultracode i Dynamic Workflows w Claude Code: workflow z fazami i subagentami zamiast liniowego czatu. Co to zmienia dla QA, architektów testów i zespołów - i jakie niesie ryzyka kosztowe."
date: 2026-06-17
tags: ["claude-code", "ai", "workflow", "subagenci", "qa"]
lang: pl
readingTime: 11
author: GH
---

## Wstęp: nie „magiczny tryb”, tylko mocniejszy sposób organizowania pracy AI

Narzędzia AI do programowania przez długi czas działały według dość prostego schematu: użytkownik zadawał pytanie, model analizował fragment kodu, proponował zmianę, a człowiek kopiował wynik do repozytorium albo akceptował diff w IDE. To już wystarczało do pisania prostych funkcji, generowania testów jednostkowych, tłumaczenia wyjątków, poprawiania literówek czy uzupełniania dokumentacji. Problem zaczynał się wtedy, gdy zadanie nie było lokalne. Migracja wielu modułów, audyt bezpieczeństwa w całym repozytorium, sprawdzenie spójności API, wyszukanie zależności między testami end-to-end i backendem albo analiza setek plików wymagały czegoś więcej niż jednego czatu.

Właśnie w tym miejscu pojawia się **Ultracode** w Claude Code, czyli ustawienie powiązane z **Dynamic Workflows**. Nie warto jednak opisywać go jako magicznego przełącznika, który samodzielnie „rozwiązuje projekt”. To raczej sposób, w jaki Claude Code może przejść z rozmowy liniowej do pracy zorganizowanej jako workflow: z planem, fazami, subagentami, kontrolą postępu i możliwością sprawdzania wyników z kilku niezależnych perspektyw.

Największa zmiana nie polega na tym, że model „myśli mocniej”. Sam wyższy poziom rozumowania jest ważny, ale nie wystarczy. Ważniejsze jest to, że część planu zostaje przeniesiona do wykonywalnego workflowu, który może koordynować pracę wielu subagentów. W praktyce oznacza to, że zamiast prosić model o jedną wielką odpowiedź, możemy zlecić mu zadanie typu: „przejrzyj cały moduł autoryzacji, znajdź brakujące testy, zaproponuj plan migracji i zweryfikuj, czy zmiany nie psują kontraktów API”. To nadal wymaga kontroli człowieka, ale zmienia skalę pracy, którą można sensownie powierzyć narzędziu.

## Czym jest Ultracode, a czym Dynamic Workflow?

Najprościej: **Dynamic Workflow** to workflow tworzony i uruchamiany przez Claude Code, który koordynuje subagentów. Dokumentacja opisuje go jako skrypt JavaScript generowany dla konkretnego zadania. Taki skrypt nie jest po prostu kolejną wiadomością w konwersacji. Pełni rolę planu wykonawczego: zawiera fazy, logikę rozdzielania pracy, gromadzenie wyników i momenty ich podsumowania. Subagenci pracują w osobnych kontekstach, a do głównej rozmowy wraca wynik końcowy albo wynik danej fazy.

**Ultracode** jest natomiast ustawieniem sesji, które łączy wysoki poziom wysiłku rozumowania z automatycznym korzystaniem z workflowów dla zadań, które Claude uzna za wystarczająco istotne. Można uruchomić pojedynczy workflow, prosząc o niego wprost, można użyć słowa kluczowego `ultracode` w konkretnym promptcie, a można też przełączyć sesję przez `/effort ultracode`. To ostatnie oznacza, że Claude częściej będzie wybierał workflow jako domyślną metodę pracy nad większymi zadaniami.

Warto doprecyzować skalę, bo łatwo tu o przesadę. Oficjalna dokumentacja mówi o pracy na poziomie dziesiątek lub setek agentów w jednym uruchomieniu, ale jednocześnie podaje limity wykonawcze: do **16 agentów równolegle** i do **1000 agentów łącznie** w ramach jednego workflowu. To nie jest więc niekontrolowana armia botów działająca bez ograniczeń. To mechanizm dużej, ale nadal limitowanej równoległości.

Ta różnica jest ważna dla QA i architektów. W testowaniu nie chodzi o to, żeby narzędzie „dużo zrobiło”. Chodzi o to, żeby wynik był sprawdzalny, powtarzalny i możliwy do zrecenzowania. Dynamic Workflow jest ciekawy właśnie dlatego, że plan można podejrzeć, uruchomienie można obserwować, a koszt i postęp można monitorować. To przybliża pracę AI do sposobu, w jaki myślimy o pipeline’ach, jobach CI, audytach i checklistach jakościowych.

## Dlaczego to może być ważne z perspektywy Quality Assurance?

Dla zespołu QA największą wartością nie jest automatyczne pisanie kodu. Największą wartością jest **systematyczna analiza dużego obszaru**. W wielu projektach problemy jakościowe nie wynikają z jednego złego pliku. Wynikają z niespójnych wzorców, historycznych wyjątków, powielonych helperów, testów zależnych od kolejności uruchamiania, niestabilnych selektorów UI, niejawnych kontraktów między usługami albo brakujących walidacji w kilku miejscach naraz.

Zwykły czat AI potrafi pomóc w jednym fragmencie. Dynamic Workflow może podejść do tematu szerzej. Jeden zestaw agentów może analizować endpointy, drugi testy, trzeci konfigurację pipeline’u, a kolejny dokumentację lub kontrakty OpenAPI. Następnie inna faza może porównać wnioski i odrzucić te, które nie mają potwierdzenia w kodzie. To nadal nie jest formalny dowód poprawności, ale jest to bardziej kontrolowany proces niż jednorazowe „przejrzyj repozytorium i powiedz, co poprawić”.

W praktyce widzę tu kilka bardzo sensownych zastosowań.

Pierwsze to **audyt pokrycia testami**. Możemy poprosić o znalezienie miejsc, gdzie istnieje logika biznesowa bez testów jednostkowych, integracyjnych lub kontraktowych. Model może przejść przez kontrolery, serwisy, walidatory i mappery, a potem zaproponować listę braków. Ważne, aby nie kończyć na samej liście. Dobry workflow powinien od razu odróżniać braki krytyczne od kosmetycznych, wskazywać ryzyko biznesowe i proponować minimalny zestaw testów zabezpieczających.

Drugie zastosowanie to **migracje frameworków testowych**. Przykład: przejście z Cypress na Playwright, zmiana sposobu mockowania w testach Spring Boot, aktualizacja bibliotek asercji albo refaktoryzacja kroków Cucumbera. W takich zadaniach zwykle nie wystarczy zamienić importów. Trzeba wykryć wzorce, wyjątki, helpery, konfiguracje, dane testowe i powtarzalne antywzorce. Workflow z subagentami może podzielić repozytorium na obszary i przygotować plan migracji etapami.

Trzecie zastosowanie to **analiza flaky tests**. Niestabilne testy rzadko mają jedną przyczynę. Czasem problemem jest czas, czasem kolejność danych, czasem zależność od stanu środowiska, czasem zbyt ogólne selektory, a czasem brak izolacji scenariuszy. Dynamic Workflow może zebrać logi, historię zmian i kod testów, a potem pogrupować potencjalne przyczyny. To nadal trzeba potwierdzić eksperymentalnie, ale startujemy z uporządkowaną hipotezą zamiast z przeczuciem.

Czwarte zastosowanie to **przegląd bezpieczeństwa i autoryzacji**. Dla architekta testów bardzo ważne jest sprawdzenie, czy endpointy mają spójne reguły dostępu, czy role są nazwane konsekwentnie, czy testy negatywne istnieją dla zasobów wrażliwych, czy walidacja danych wejściowych nie została pominięta w mniej popularnych ścieżkach. Taki audyt można rozbić na agentów analizujących routing, konfigurację security, testy i dokumentację API.

Piąte zastosowanie to **przygotowanie planu technicznego przed refaktoryzacją**. Zanim ktoś zacznie zmieniać kod, AI może przygotować mapę zależności, listę miejsc potencjalnie dotkniętych zmianą, minimalny zakres testów regresji i plan bezpiecznego wdrożenia. To jest szczególnie cenne w organizacjach, gdzie jedna zmiana w bibliotece wspólnej potrafi wpłynąć na wiele usług.

## Co jest realną zaletą, a co marketingową przesadą?

Największą realną zaletą jest **równoległość z kontrolą**. Jeżeli zadanie da się podzielić na niezależne części, workflow może przyspieszyć analizę. Nie chodzi tylko o szybkość. Chodzi też o to, że różne subagenty mogą patrzeć na problem z różnych stron. Jeden szuka brakujących testów, drugi potencjalnych regresji, trzeci naruszeń konwencji, a czwarty porównuje wyniki. Taki model pracy przypomina miniaturowy zespół reviewerski.

Drugą zaletą jest **izolacja kontekstu**. W klasycznej rozmowie wszystko trafia do jednego okna kontekstu: logi, fragmenty kodu, wyniki testów, dygresje, poprawki i decyzje. Im dłużej trwa rozmowa, tym łatwiej o szum. Subagent może wykonać poboczne zadanie w osobnym kontekście i zwrócić tylko podsumowanie. Dla dużych audytów to bardzo praktyczne.

Trzecią zaletą jest **możliwość kontroli jakości wyniku przez niezależne spojrzenie**. Dokumentacja dynamic workflows opisuje wzorce, w których agenci mogą wzajemnie sprawdzać swoje ustalenia albo próbować je podważyć. To jest bliskie temu, co w QA robimy intuicyjnie: nie ufamy pierwszemu wynikowi, tylko pytamy „jak to może się zepsuć?”, „czy mamy dowód?”, „czy to nie jest przypadkiem wniosek z jednego pliku?”.

Ale są też miejsca, gdzie łatwo przesadzić. Ultracode nie zastępuje architekta. Nie zastępuje code review. Nie zastępuje testów uruchomionych w prawdziwym pipeline. Nie gwarantuje, że wygenerowane testy są wartościowe. Model może napisać testy, które tylko potwierdzają obecną implementację, ale nie chronią wymagania biznesowego. Może też zaproponować refaktoryzację, która wygląda elegancko, ale wprowadza koszt utrzymania, bo nie pasuje do standardów zespołu.

Dlatego warto traktować Ultracode jako **wzmacniacz procesu**, nie jako proces sam w sobie. Jeżeli zespół nie ma jasnych reguł jakości, narzędzie tylko szybciej wygeneruje chaos. Jeżeli zespół ma dobre definicje gotowości, standardy testów, checklisty review i solidne CI, workflow może te praktyki przyspieszyć.

## Koszty, limity i bezpieczeństwo: tu nie ma darmowej magii

Dynamic Workflows uruchamiają wielu agentów, a każdy agent zużywa tokeny. Przy małym zadaniu nie ma sensu odpalać trybu, który robi analizę wieloetapową. Oficjalna dokumentacja wprost zaleca zaczynanie od małego zakresu: jednego katalogu, jednego typu problemu, jednej części repozytorium. To bardzo rozsądne. Najpierw sprawdzamy, czy workflow daje wartościowy wynik, a dopiero potem rozszerzamy zakres.

Koszt to nie tylko pieniądze. Kosztem jest też czas review. Jeżeli narzędzie wygeneruje ogromny plan zmian, którego nikt nie ma siły przeczytać, to nie poprawiliśmy jakości. Przesunęliśmy tylko problem z pisania kodu na recenzowanie niekontrolowanego diffu. Dobre użycie Ultracode powinno kończyć się wynikiem, który można przejrzeć etapami: najpierw diagnoza, potem plan, potem mały pull request, potem testy, potem kolejny zakres.

Bezpieczeństwo jest równie ważne. Subagenci mogą korzystać z narzędzi, wykonywać komendy, czytać pliki i wprowadzać zmiany zgodnie z konfiguracją uprawnień. Dlatego trzeba uważać na projekty zawierające sekrety, dane produkcyjne, pliki konfiguracyjne z hasłami albo wrażliwe logi. AI nie powinno dostawać większego dostępu niż członek zespołu potrzebowałby do wykonania tej samej pracy. To brzmi oczywiście, ale w praktyce presja na automatyzację często prowadzi do zbyt szerokich uprawnień.

W zespołach enterprise sensowne jest ustalenie kilku zasad: jakie katalogi wolno analizować, jakie komendy wolno uruchamiać bez potwierdzenia, które workflowy można zapisać i współdzielić, a które powinny być prywatne, oraz kiedy wymagane jest ręczne zatwierdzenie planu. Warto też przechowywać instrukcje projektowe w plikach typu `CLAUDE.md`, bo wtedy model zna standardy zespołu: nazewnictwo, strukturę testów, preferowane biblioteki, reguły architektury i wymagania dotyczące review.

## Jak używałbym Ultracode w praktyce?

Nie zaczynałbym od polecenia „napraw cały projekt”. To najkrótsza droga do dużej, trudnej do zweryfikowania odpowiedzi. Zacząłbym od zadania z jasnym zakresem i mierzalnym wynikiem.

Dobry prompt może brzmieć tak:

> Użyj workflowu do audytu endpointów w katalogu `src/main/java/.../controller`. Sprawdź, które endpointy mają brakujące testy autoryzacji. Nie zmieniaj kodu. Zwróć tabelę: endpoint, wymagana rola, istniejące testy, brakujące testy, ryzyko, rekomendowany pierwszy PR.

To jest dobre, bo ogranicza zakres, zakazuje zmian i definiuje format wyniku. Można potem uruchomić drugi etap:

> Na podstawie zaakceptowanej listy wygeneruj testy tylko dla trzech endpointów o najwyższym ryzyku. Nie zmieniaj implementacji produkcyjnej. Po zmianach uruchom testy dla danego modułu i podsumuj wynik.

W ten sposób AI działa jak bardzo szybki asystent techniczny, ale człowiek nadal steruje procesem. Najpierw diagnoza, potem decyzja, potem mała zmiana, potem weryfikacja.

Dla migracji testów prompt może być inny:

> Przygotuj plan migracji testów E2E z Cypress do Playwright. Najpierw sklasyfikuj testy według wzorców użycia: logowanie, dane testowe, selektory, mocki, oczekiwania asynchroniczne. Nie generuj kodu. Zwróć plan migracji w pięciu etapach i wskaż największe ryzyka.

Dopiero po zaakceptowaniu planu prosiłbym o kod. To zmniejsza ryzyko, że model zacznie mechanicznie przepisywać testy bez zrozumienia domeny.

## Antywzorce, których warto unikać

Pierwszy antywzorzec to **włączanie Ultracode dla wszystkiego**. Jeżeli chcesz zmienić nazwę pola w DTO albo dopisać jedną asercję, zwykły tryb pracy będzie szybszy i tańszy. Ultracode ma sens wtedy, gdy zadanie wymaga koordynacji, porównania wielu miejsc albo niezależnej weryfikacji.

Drugi antywzorzec to **akceptowanie dużych zmian bez planu**. Im większy diff, tym większa szansa, że review stanie się powierzchowne. Lepiej wymusić małe kroki i jasne kryteria sukcesu.

Trzeci antywzorzec to **brak własnych standardów**. Model nie zgadnie, jak Twój zespół definiuje dobry test. Czy preferujecie testy integracyjne czy jednostkowe? Jak nazywacie scenariusze? Czy test ma opisywać regułę biznesową, czy konkretną metodę? Czy mockowanie repozytorium jest akceptowane? Bez takich reguł AI może wygenerować kod poprawny składniowo, ale niespójny z kulturą projektu.

Czwarty antywzorzec to **mylenie weryfikacji AI z weryfikacją systemu**. To, że subagent sprawdził wynik innego subagenta, jest pomocne. Ale nadal potrzebujesz testów, builda, statycznej analizy, review i - w krytycznych systemach - dodatkowej walidacji ręcznej.

## Podsumowanie: kiedy warto, a kiedy nie?

Ultracode i Dynamic Workflows mają największy sens wtedy, gdy problem jest złożony, rozproszony i wymaga uporządkowanej analizy. Dla QA i architektów mogą być szczególnie użyteczne przy audytach testów, migracjach frameworków, analizie flaky tests, przeglądach bezpieczeństwa, mapowaniu zależności i planowaniu refaktoryzacji.

Nie są natomiast dobrym wyborem do rutynowych, małych zadań. W takich przypadkach zwiększają koszt i złożoność bez proporcjonalnej korzyści. Najlepsza praktyka jest prosta: używaj Ultracode jak narzędzia chirurgicznego. Najpierw zawęź problem, potem poproś o plan, następnie wykonuj małe kroki i zawsze weryfikuj wynik normalnym procesem inżynierskim.

Dla Test Architekta to nie jest zastępstwo za doświadczenie. To dodatkowa para - a właściwie wiele par - oczu, które mogą szybciej przejrzeć duży obszar i pomóc znaleźć miejsca warte uwagi. Jakość nadal zależy od człowieka: od tego, jak zdefiniuje cel, jakie ograniczenia ustawi i czy potrafi odróżnić elegancko brzmiącą sugestię od realnie bezpiecznej zmiany.

**Źródła i weryfikacja:**

- [Claude Code Docs - Dynamic workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code Docs - Settings](https://code.claude.com/docs/en/settings)
- [Claude Code Docs - Subagents](https://code.claude.com/docs/en/sub-agents)
