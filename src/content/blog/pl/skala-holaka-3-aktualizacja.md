---
title: "Skala Holaka (i Gomulskiego) 3.0 - mniej poziomów, więcej sensu"
description: "Aktualizacja modelu dojrzałości adopcji AI, współtworzona z Konradem Gomulskim. Wersja 3.0 upraszcza skalę do pięciu poziomów i przestaje traktować poziom jako etykietę człowieka - przenosi diagnozę na konkretny kontekst: zadanie, zespół, proces albo organizację."
date: 2026-06-22T14:00:00
tags: ["ai", "adopcja", "strategia", "governance", "holak-scale"]
lang: pl
readingTime: 9
author:
  - GH
  - KG
---

Skala Holaka 2.1 była potrzebna. Porządkowała drogę od prostego czatu, przez promptowanie, instrukcje, kontekst, skille, narzędzia, agentowe workflow, orkiestrację i agentic OS. Była też świadomie rozbita na dwie ścieżki: enterprise i private.

Wersję 3.0 współtworzyłem z **Konradem Gomulskim**. To w dużej mierze efekt jego pytań, kontrargumentów i recenzji - dlatego od tej wersji nazywam ją **Skalą Holaka (i Gomulskiego)**. Konrad odpowiada za około dziesiątą część tej przebudowy, ale akurat za tę część, która najmocniej zmieniła sposób myślenia o modelu: odejście od poziomu jako etykiety i nacisk na kontekst.

> Pełny opis modelu znajdziesz na stronie [Skala Holaka (i Gomulskiego) 3.0](/pl/skala-holaka-3/). Ten wpis tłumaczy, dlaczego powstała aktualizacja i co się zmieniło względem wersji 2.1.

Po wielu rozmowach, diagnozach i przykładach zobaczyliśmy jeden powtarzalny problem: skala zaczęła być traktowana zbyt dosłownie.

Ludzie pytali:

> Jestem na 5 czy na 6?

Zespoły pytały:

> Czy jeśli mamy MCP, to jesteśmy na 8?

Organizacje pytały:

> Czy skoro jedna osoba ma agentowe workflow, to firma też jest wysoko?

A to są złe pytania. Dlatego powstaje Skala Holaka (i Gomulskiego) 3.0.

## Największa zmiana: mniej poziomów

Wersja 3.0 upraszcza skalę do pięciu poziomów:

| Poziom | Nazwa | Jednym zdaniem |
|---:|---|---|
| 0 | Opór | AI nie jest używane albo jest używane poza świadomą adopcją. |
| 1 | Podstawy | AI pomaga w prostych, ad hoc zadaniach. |
| 2 | Świadome użycie | Użytkownik świadomie pracuje z celem, kontekstem, formatem, iteracją i instrukcjami. |
| 3 | Zaawansowane procesy | AI staje się częścią procesu: ma kontekst, narzędzia, skille, wiedzę, ewaluacje i zasady. |
| 4 | Autonomia / dojrzała adopcja | AI realizuje ograniczone cele end-to-end, a człowiek kontroluje granice, ryzyko i wynik. |

To nie znaczy, że szczegóły z wersji 2.1 znikają. One zostają, ale zmieniają rolę. Nie są już osobnymi stopniami drabiny. Stają się podobszarami diagnostycznymi.

## Podpoziomy nie są punktami

W wersji 3.0 nie chodzi o to, żeby powiedzieć:

> Mamy 7 z 10 elementów, więc jesteśmy na poziomie 3.

To byłoby zbyt mechaniczne. Podobszary mają pomagać w rozmowie:

- co już rozumiemy,
- czego jeszcze nie umiemy,
- gdzie mamy realny dowód,
- czego brakuje do stabilnego procesu,
- czy przejście wyżej ma sens.

Możesz wejść na poziom, gdy rozumiesz poziom niżej i zaczynasz stosować część obecnego poziomu. Ale nie powinieneś iść na kolejny poziom, jeśli nie rozumiesz całości poziomu niżej. Wyjątkiem jest poziom 0, bo poziom 0 opisuje stan przed świadomą adopcją albo świadomą rezygnację z AI.

## Poziom nie jest tożsamością

To najważniejsza poprawka i to jest też część, którą najmocniej wypchnął Konrad.

Poziom nie opisuje człowieka. Poziom opisuje kontekst.

Ten sam człowiek może być:

- na poziomie 3 w kodowaniu,
- na poziomie 2 w analizie dokumentów,
- na poziomie 1 w pisaniu maili,
- na poziomie 0 w danych finansowych.

Ta sama firma może być:

- na poziomie 3 w IT,
- na poziomie 2 w QA,
- na poziomie 1 w HR,
- na poziomie 0 w procesach, gdzie AI jest formalnie zakazane.

Dlatego Skala Holaka (i Gomulskiego) 3.0 nie pyta:

> Na którym poziomie jesteś?

Pyta:

> Na którym poziomie jest ten konkretny obszar użycia AI?

To drobna zmiana językowa, ale ogromna zmiana praktyczna. Zdejmuje z ludzi etykietę i przenosi rozmowę na proces.

## Co stało się ze starą skalą 0-11

Stare poziomy nie zostały wyrzucone. Zostały pogrupowane.

| v2.1 | v3.0 |
|---|---|
| 0 - Opór / brak adopcji | 0 - Opór |
| 1 - Podstawowy czat | 1 - Podstawy |
| 2 - Świadome promptowanie | 2 - Świadome użycie |
| 3 - Frameworki promptowania | 2 - Świadome użycie |
| 4 - Instrukcje niestandardowe i higiena tokenów | 2 - Świadome użycie |
| 5 - Kontekst projektowy/domowy | 3 - Zaawansowane procesy |
| 6 - Zaawansowane instrukcje operacyjne | 3 - Zaawansowane procesy |
| 8 - Narzędzia, MCP, konektory, hooks | 3 - Zaawansowane procesy |
| 7 - Skille, bazy wiedzy i ewaluacje | 3 - Zaawansowane procesy |
| 9 - Agentowe workflow | 4 - Autonomia / dojrzała adopcja |
| 10 - Orkiestracja wieloagentowa | 4 - Autonomia / dojrzała adopcja |
| 11 - Agentic OS | 4 - Autonomia / dojrzała adopcja |

Tak, w tej tabeli poziom 8 pojawia się przed poziomem 7. To celowe.

## Narzędzia przed skillami

W wersji 2.1 skille, bazy wiedzy i ewaluacje były przed narzędziami, MCP, konektorami i hooks. W wersji 3.0 zmieniam tę kolejność.

Najpierw musimy rozumieć:

- w jakim środowisku AI działa,
- do jakich narzędzi ma dostęp,
- jakie ma uprawnienia,
- jakie akcje są dozwolone,
- jakie akcje wymagają zgody,
- jak zapisywany jest ślad działania,
- jak ograniczamy ryzyko.

Dopiero potem ma sens budowanie skilli, baz wiedzy i powtarzalnych workflow. Skill bez zrozumienia narzędzi często jest tylko ładnie zapakowanym promptem. Narzędzie bez zasad jest ryzykiem. Proces powstaje dopiero wtedy, gdy łączymy kontekst, narzędzia, kontrolę, skille i weryfikację.

## Pięć poziomów w skrócie

**Poziom 0 - Opór.** AI nie jest używane albo jest używane poza świadomą adopcją. To nie zawsze porażka - w procesie wysokiego ryzyka odmowa użycia AI może być bardziej odpowiedzialna niż szybka automatyzacja. Problemem nie jest poziom 0. Problemem jest udawanie, że AI nie istnieje, gdy ludzie używają go po cichu.

**Poziom 1 - Podstawy.** AI pomaga w prostych zadaniach: mail, streszczenie, pomysł, tłumaczenie, wyjaśnienie, pierwsza wersja dokumentu. Najważniejsze są dwie rzeczy: podstawowa weryfikacja i podstawowa higiena danych. Użytkownik musi wiedzieć, że AI może się mylić i że nie wszystko wolno wkleić do czatu.

**Poziom 2 - Świadome użycie.** Użytkownik przestaje tylko pytać. Zaczyna projektować instrukcję: cel, kontekst, rola, ograniczenia, dane wejściowe, format, kryteria jakości. Iteruje, sprawdza wynik, dobiera model do zadania, dba o koszt i długość kontekstu. To poziom, na którym wiele osób i zespołów uzyska największy zwrot z AI - nie przez agentów, nie przez MCP, tylko przez lepszą jakość pracy z podstawowym narzędziem.

**Poziom 3 - Zaawansowane procesy.** AI przestaje być tylko rozmową i staje się częścią procesu. Pojawiają się: stały kontekst, dokumentacja dla ludzi i agentów, instrukcje operacyjne, narzędzia i integracje, automatyzacje kontrolne, skille, bazy wiedzy, RAG, ewaluacje, właściciel procesu i zasady bezpieczeństwa.

**Poziom 4 - Autonomia / dojrzała adopcja.** AI może dostać ograniczony cel i przejść przez proces end-to-end, ale w znanych granicach. Człowiek definiuje cel, granice, kryteria sukcesu, ryzyka, sposób weryfikacji i procedurę zatrzymania. Dojrzała autonomia wymaga sprawdzalności, odwracalności, logów, właściciela i limitów. Bez tego autonomia nie jest dojrzałością. Jest ryzykiem.

## Krzywa wartości i kosztu

Nie każdy powinien iść na poziom 4. To może być najważniejsze zdanie całej aktualizacji.

W wielu przypadkach największy zwrot daje przejście z 0 na 1, z 1 na 2 i z 2 na 3. Poziom 4 jest droższy, bardziej ryzykowny i wymaga większej dyscypliny. Ma sens dla wybranych procesów, które są powtarzalne, mają jasne kryteria sukcesu i dają się sprawdzić oraz cofnąć.

Dojrzałość nie polega na tym, żeby wszystko automatyzować. Dojrzałość polega na tym, żeby wiedzieć, gdzie automatyzacja ma sens, a gdzie lepiej zostać niżej.

## Macierz zamiast etykiety

Wersja 3.0 najlepiej działa jako macierz.

| Obszar | Poziom | Dowód | Następny sensowny krok |
|---|---:|---|---|
| QA | 3 | Kontekst projektowy, workflow generowania testów, częściowe ewaluacje. | Dodać lepsze kontrole jakości. |
| Development | 3 | Repo, instrukcje, narzędzia, review kodu. | Uporządkować uprawnienia i logi. |
| HR | 1 | Proste generowanie treści. | Wprowadzić zasady danych i szablony. |
| Finanse | 0 | Brak użycia ze względu na dane wrażliwe. | Ocenić, czy są bezpieczne przypadki użycia. |
| Release notes | 4 | Agentowy workflow z weryfikacją człowieka. | Dodać metryki jakości i kosztu. |

Taka macierz jest bardziej uczciwa niż jeden numer dla całej osoby albo organizacji.

## Co dalej

Skala Holaka (i Gomulskiego) 3.0 jest próbą naprawienia tego, co w poprzedniej wersji było zbyt liniowe, zbyt szczegółowe i zbyt łatwe do zamienienia w etykietę. Nie chodzi o to, żeby wyrzucić v2.1 - ona dalej jest dobrym opisem szczegółowych obszarów adopcji.

Chodzi o to, żeby główna rozmowa była prostsza: jaki mamy kontekst, jaki mamy poziom, jaki mamy dowód, jaki poziom ma sens, czego brakuje, jakie ryzyko akceptujemy i gdzie lepiej nie iść wyżej.

Skala nie mówi:

> Jesteś na 3.

Skala mówi:

> W tym obszarze jesteś na 3. W innym jesteś na 1. To normalne. Teraz zdecydujmy, gdzie warto pójść dalej.

I właśnie o to chodzi w wersji 3.0.

Pełny model, z opisem każdego poziomu, mapą przejścia z 2.1, macierzą kontekstów i krzywą wartości i kosztu, znajdziesz na stronie [Skala Holaka (i Gomulskiego) 3.0](/pl/skala-holaka-3/).
