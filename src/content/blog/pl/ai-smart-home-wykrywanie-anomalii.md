---
title: "AI w Smart Home, część 6: Dom, który zauważa - wykrywanie anomalii zamiast sztywnych progów"
description: "Szósta część mini-serii o AI w smart home. Uczymy dom rozpoznawania odchyleń od własnej normy: od statystyk wbudowanych w Home Assistant, przez reguły domenowe, po model językowy jako cyklicznego analityka danych."
date: 2026-07-13
tags: ["ai", "smart home", "home assistant", "wykrywanie anomalii", "monitoring"]
lang: pl
readingTime: 9
author: [JS, GH]
---

Sztywny próg "temperatura powyżej 28 stopni" wykryje pożar, ale nie wykryje lodówki, która umiera powoli, ani pompy, która chodzi o 20% dłużej niż miesiąc temu. W tej części pokazujemy, jak nauczyć dom rozpoznawania odchyleń od własnej normy - od prostych statystyk w Home Assistant po cykliczną analizę danych modelem językowym.

## Czego nie widzi sztywny próg

Progi są świetne dla zdarzeń zero-jedynkowych: zalanie, dym, otwarte drzwi po 23:00. Tam nie ma czego interpretować i pisaliśmy o tym w [części o automatyzacjach](/pl/blog/ai-smart-home-automatyzacje/) - prosta reguła wygrywa.

Problem w tym, że większość awarii domowych nie wygląda jak skok. Wygląda jak trend. Lodówka u Julii przez sześć tygodni podniosła dobowe zużycie z 0,7 kWh do 1,0 kWh - żadnego progu po drodze nie przekroczyła, bo każdy rozsądny próg byłby ustawiony wyżej. Sprężarka po prostu pracowała coraz dłuższymi cyklami, aż w końcu przestała nadążać. Gdyby dom porównywał bieżący tydzień ze swoją normą, alarm przyszedłby miesiąc przed zepsutymi zakupami.

> Dobre pytanie nie brzmi "czy wartość przekroczyła próg", tylko "czy to jest normalne dla tego domu, o tej porze, w tym sezonie".

## Norma domu, czyli linia odniesienia

Żeby wykrywać odchylenia, dom musi najpierw wiedzieć, co jest normą. Dobra wiadomość: jeśli masz Home Assistant z czujnikami energii i temperatury, dane historyczne już zbierasz. Zła wiadomość: norma nie jest jedną liczbą. Zużycie energii w styczniu i w lipcu to dwa różne światy, poniedziałek różni się od niedzieli, a tydzień z gośćmi od tygodnia wyjazdu.

Dlatego sensowna linia odniesienia porównuje podobne do podobnego: dzisiejszą dobę do średniej z ostatnich 30 dób, bieżący cykl urządzenia do średniej długości jego cykli, zużycie wtorku do zużycia poprzednich wtorków. Im węższe porównanie, tym mniej fałszywych alarmów.

## Poziom 1: statystyka bez AI

Zanim sięgniesz po model językowy, wyciśnij to, co Home Assistant ma wbudowane. Integracja statystyk liczy średnią kroczącą i odchylenie standardowe z dowolnego sensora, sensor pochodnej pokazuje tempo zmian, a sensor trendu zamienia kierunek zmian na prosty stan binarny.

Przykład dla lodówki: sensor dobowego zużycia plus 30-dniowa średnia krocząca i jedna automatyzacja porównująca obie wartości.

```yaml
sensor:
  - platform: statistics
    name: "Lodowka - srednia dobowa 30 dni"
    entity_id: sensor.lodowka_energia_doba
    state_characteristic: mean
    max_age:
      days: 30
```

Automatyzacja wysyła powiadomienie, gdy dzisiejsza doba przekracza średnią o więcej niż 25% przez trzy dni z rzędu. Te trzy dni są ważne - pojedynczy gorący dzień, w którym drzwi lodówki chodziły co chwilę, to nie anomalia, to życie. Warunek utrzymania się odchylenia to najtańszy filtr fałszywych alarmów, jaki znamy.

Ten sam wzorzec działa dla pompy cyrkulacyjnej. U nas pompa ciepłej wody pracowała historycznie średnio 4,5 godziny na dobę. Gdy zaczęła chodzić 5,5 godziny - o 20% dłużej przy tej samej pogodzie i tych samych nawykach domowników - statystyka zgłosiła odchylenie po czterech dniach. Przyczyną okazało się zapowietrzenie instalacji, naprawione w kwadrans. Bez porównania z normą nikt by tego nie zauważył, bo pompa działała, woda była ciepła, a różnicy w rachunku jeszcze nie było widać.

Warunek wejścia na ten poziom jest jeden: pomiar. Gniazdko z pomiarem energii za kilkadziesiąt złotych na lodówce, pompie czy bojlerze daje dane, z których statystyka dopiero może coś wyczytać. Bez czujnika nie ma normy, bez normy nie ma anomalii.

## Poziom 2: porównania w czasie i proste reguły domenowe

Drugi poziom to reguły, które łączą dwa sygnały i odrobinę wiedzy o fizyce domu. Klasyk: otwarte okno kontra ogrzewanie. Żaden pojedynczy próg tego nie złapie, ale reguła "głowica termostatyczna grzeje na 100%, a temperatura w pokoju spada o ponad 1,5 stopnia w 20 minut" łapie to bezbłędnie - i przy okazji wykryje też okno uchylone przez dziecko, o którym kontaktron nic nie wie, bo go tam nie ma.

Podobnie bojler: jeśli czas nagrzania wody od 40 do 55 stopni wydłużył się z 50 do 70 minut przy tej samej mocy grzałki, to niemal na pewno kamień na grzałce. Dom nie musi rozumieć chemii - wystarczy, że porówna bieżący czas grzania ze swoją historią i zauważy trend wzrostowy utrzymany przez kilka tygodni.

## Wzorce obecności: anomalia to nie zawsze awaria

Odchylenia od normy dotyczą nie tylko urządzeń, ale i rytmu domu. Dom zna typowe godziny powrotów, włączania świateł, otwierania drzwi. Garażowa brama otwarta o 3:20, światło w piwnicy świecące się od 14 godzin, drzwi tarasowe otwierane w dzień roboczy, gdy nikogo nie powinno być w domu - żadne z tych zdarzeń nie przekracza progu, bo progu na "dziwność" nie ma. Wszystkie są odchyleniem od wzorca.

Tu jednak ostrożność musi być większa niż przy lodówce. Wzorce obecności dotyczą ludzi, a ludzie mają prawo do spontaniczności. Nocny powrót z imprezy nie powinien generować alarmu jak włamanie. Dlatego dla obecności rekomendujemy wyłącznie powiadomienia informacyjne o niskim priorytecie i tylko dla zdarzeń, które łączą dwa sygnały: drzwi otwarte plus wszyscy domownicy poza domem to sensowny sygnał, samo "nietypowo późne światło" to już nadgorliwość.

## Poziom 3: LLM jako analityk cykliczny

Tu zaczyna się warstwa AI (głos Grzegorza). Model językowy nie powinien oglądać każdego odczytu na żywo - to drogie, wolne i niepotrzebne. Najlepszy wzorzec to cykliczne podsumowania: raz dziennie albo raz w tygodniu automatyzacja zbiera zagregowane dane (dobowe zużycia, liczby i długości cykli urządzeń, czasy grzania, wzorce obecności) i wysyła je do modelu z pytaniem o odchylenia.

Prompt powinien wymuszać konkret: porównaj bieżący tydzień z poprzednimi czterema, wypisz maksymalnie trzy obserwacje, każdą z liczbą i możliwym wyjaśnieniem, nie zgaduj przyczyn, których nie widać w danych. Wynik trafia jako powiadomienie albo wpis na panelu, o którym pisaliśmy w [części o dashboardach](/pl/blog/ai-smart-home-dashboardy/).

Przykład z naszego tygodniowego raportu: "Zużycie czuwania nocnego wzrosło z 95 W do 128 W od 12 dni. Bojler: czas grzania stabilny. Lodówka: w normie. Sugestia: coś zostało włączone na stałe około 1 lipca - sprawdź gniazdka w gabinecie i garażu". Winowajcą okazała się zapomniana stacja lutownicza. 33 W przez pół roku to około 70 zł i jedno realne ryzyko pożarowe mniej - a żadna reguła progowa tego nie widziała, bo 128 W to nadal bardzo mało.

Przewaga modelu nad regułami z poziomów 1-2 jest dokładnie tam, gdzie reguł nie napisaliśmy. Model dostaje cały obraz i potrafi zauważyć, że pralka chodziła w nocy, czego nigdy wcześniej nie robiła, albo że zużycie czuwania domu wzrosło o 30 W od zeszłego tygodnia - czyli coś zostało włączone i zapomniane. Reguła wykrywa to, co przewidzieliśmy. Model bywa dobry w tym, czego nie przewidzieliśmy.

## Gradacja podejść w jednej tabeli

| Poziom | Narzędzie | Co wykrywa | Koszt i wysiłek |
|---|---|---|---|
| Próg | Zwykła automatyzacja | Zdarzenia ostre: zalanie, mróz, brak prądu | Minuty, zero kosztów |
| Statystyka | Średnia krocząca, odchylenie, trend | Powolne trendy pojedynczego urządzenia | Godzina na urządzenie |
| Reguły domenowe | Porównanie dwóch sygnałów | Okno przy grzaniu, kamień w bojlerze | Wymaga pomysłu, nie sprzętu |
| LLM cyklicznie | Dobowe/tygodniowe podsumowania | Odchylenia, których nie przewidziałeś | Grosze za zapytanie lub lokalny model |

Kolejność nie jest przypadkowa. Każdy poziom filtruje dane dla następnego - model językowy czytający surowe odczyty co minutę to antywzorzec, model czytający tygodniowy agregat to tani, sensowny analityk.

## Fałszywe alarmy: największy wróg zaufania

System wykrywania anomalii umiera nie wtedy, gdy czegoś nie wykryje, tylko wtedy, gdy domownicy przestaną czytać jego powiadomienia. Trzy zasady, które utrzymały nasz system przy życiu:

- **Odchylenie musi się utrzymać.** Jeden dziwny dzień to szum. Trzy dni z rzędu albo trzy cykle z rzędu to sygnał.
- **Kontekst wycisza.** Tryb gościa i tryb urlopu znasz z poprzednich części serii - tutaj powinny podnosić progi albo wyciszać porównania, bo dom z gośćmi ma inną normę.
- **Sezon ma znaczenie.** Porównuj lipiec z czerwcem, nie ze styczniem. Najprościej: okno porównania maksymalnie 4-6 tygodni wstecz.

I jedna zasada nadrzędna: powiadomienie o anomalii ma być pytaniem, nie wyrokiem. "Lodówka zużywa o 28% więcej niż jej miesięczna norma, trzeci dzień z rzędu - warto sprawdzić uszczelkę i szron" jest użyteczne. Automatyczne wyłączenie lodówki, bo model uznał ją za zepsutą, byłoby dokładnie tym rodzajem autonomii, przed którym ostrzegamy w całej serii.

## Podsumowanie

Sztywne progi zostawiamy zdarzeniom ostrym, a degradację łapiemy porównaniem z normą domu. Zacznij od jednego urządzenia z mierzalnym cyklem - lodówka i bojler to wdzięczni pacjenci - i od statystyki wbudowanej w Home Assistant, bez żadnego AI. Reguły domenowe dodaj tam, gdzie znasz fizykę problemu, a model językowy zatrudnij dopiero jako cyklicznego analityka agregatów, który wyłapie to, czego nie przewidziałeś. Miarą sukcesu nie jest liczba alarmów, tylko to, że pierwszy prawdziwy złapiesz miesiąc przed awarią.
