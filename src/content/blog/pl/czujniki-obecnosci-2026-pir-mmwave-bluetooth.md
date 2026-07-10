---
title: "Czujniki obecności 2026: PIR, mmWave czy śledzenie bluetooth - co wybrać do którego pokoju"
description: "Porównanie trzech technologii wykrywania obecności: cena, czułość, fałszywe alarmy, prywatność i pobór prądu, plus konkretne rekomendacje pokój po pokoju i strojenie mmWave."
date: 2026-08-07
tags: ["smart-home", "home-assistant", "czujniki", "mmwave", "obecnosc"]
lang: pl
readingTime: 9
author: GH
---

Światło gaśnie, gdy siedzisz nieruchomo przy biurku? To klasyczny czujnik PIR, który wykrywa ruch, a nie obecność - i to jest najczęstsza przyczyna rozczarowania automatyzacjami oświetlenia. Porównuję trzy technologie wykrywania ludzi: cenę, czułość, fałszywe alarmy, prywatność i pobór prądu, a potem przechodzę pokój po pokoju i mówię, co bym tam powiesił.

## Dlaczego twoje światło gaśnie, kiedy czytasz

Czujnik PIR (pasywna podczerwień) nie widzi ciebie - widzi zmianę rozkładu ciepła w polu widzenia. Kiedy idziesz przez pokój, ciepła plama przesuwa się między strefami soczewki i czujnik zgłasza ruch. Kiedy siedzisz nieruchomo nad książką albo klawiaturą, dla PIR-a jesteś meblem. Automatyzacja odlicza pięć minut bez ruchu i gasi światło - dokładnie tak, jak ją zaprogramowano, tylko wbrew intencji.

Ten problem ma dwa uczciwe rozwiązania. Pierwsze: wydłużanie czasu podtrzymania, czyli leczenie objawów - światło w pustym pokoju pali się wtedy po dwadzieścia minut. Drugie: technologia, która naprawdę wykrywa obecność, a nie ruch. I tu wchodzą czujniki mmWave oraz, do innej klasy zadań, śledzenie sygnałów bluetooth.

## Trzy technologie w pięć minut

**PIR** to weteran: tani, natychmiastowy, oszczędny. Działa na baterii latami, reaguje w ułamku sekundy i kosztuje od 40 złotych. Słabość zasadnicza jedna, za to fundamentalna: bezruch oznacza brak detekcji.

**mmWave** to radar milimetrowy - czujnik emituje fale radiowe i analizuje odbicia. Dobrze wykrywa drobny ruch nieruchomo siedzącej osoby, a wybrane modele i tryby są projektowane także do wykrywania oddechu. Nie każdy czujnik mmWave niezawodnie wykryje człowieka śpiącego pod kołdrą. Cena za tę czułość: zwykle zasilanie sieciowe, wyższy koszt (150-400 złotych) i skłonność do fałszywych alarmów, bo poruszająca się firanka, wiatrak albo monstera na przeciągu też odbijają fale.

**Śledzenie bluetooth** odpowiada na inne pytanie. PIR i mmWave mówią, że „ktoś" jest w pokoju; śledzenie sygnału opaski, telefonu albo zegarka mówi, że to konkretnie ty. Stawiasz w pokojach odbiorniki (najtaniej: moduły ESP32 z oprogramowaniem ESPresense albo zwykłe urządzenia ESPHome działające jako pośredniki bluetooth plus integracja Bermuda w HA), a system na podstawie siły sygnału szacuje, w którym pomieszczeniu jest dane urządzenie. To nie jest wykrywanie obecności do gaszenia świateł - opóźnienia idą w dziesiątki sekund - ale do scen personalnych nie ma lepszego narzędzia.

Dwie uwagi praktyczne do warstwy bluetooth. Telefony losują adresy BLE, więc nie można polegać na zwykłym adresie sprzętowym. Na Androidzie aplikacja Home Assistant może nadawać iBeacon, a iPhone może być rozpoznawany przez integrację Private BLE Device na podstawie klucza IRK; alternatywą jest brelok lub opaska o stałym identyfikatorze. I licz się z kalibracją: siła sygnału zależy od ścian, mebli i tego, w której kieszeni nosisz telefon, więc pierwsze dni to strojenie progów per pokój. Jeden odbiornik na pomieszczenie, w którym personalizacja ma sens, jest dobrym punktem startowym, nie gwarancją dokładności.

| Kryterium | PIR | mmWave | Bluetooth |
| --- | --- | --- | --- |
| Wykrywa bezruch | Nie | Tak; oddech tylko w odpowiednich modelach i warunkach | Tak (obecność urządzenia) |
| Czas reakcji | Poniżej sekundy | 1-3 sekundy | 10-60 sekund |
| Fałszywe alarmy | Rzadkie (zwierzęta, słońce) | Częste bez strojenia (firanki, wiatraki, rośliny) | Rzadkie, za to dryf między pokojami |
| Rozpoznaje kto | Nie | Nie | Tak |
| Zasilanie | Bateria, 1-2 lata | Sieciowe (USB) | Sieciowe (odbiorniki) |
| Cena za pokój | 40-90 zł | 150-400 zł | 60-100 zł za odbiornik |
| Prywatność | Bez zastrzeżeń | Bez kamery, ale mapuje pozycję w pokoju | Śledzi konkretne osoby - wymaga zgody domowników |

Prywatność zasługuje na zdanie więcej. Żadna z tych technologii nie rejestruje obrazu i to ich wielka przewaga nad kamerami z detekcją osób. Ale śledzenie bluetooth z definicji buduje historię tego, kto i kiedy był w którym pokoju - zanim je włączysz, porozmawiaj z domownikami. U nas zgoda była warunkowa: śledzimy telefony, nie osoby, i każdy może swój wyłączyć.

## Pokój po pokoju

**Biuro i miejsca pracy: mmWave, bez dyskusji.** To jest dokładnie scenariusz, w którym PIR przegrywa - godziny bezruchu przy biurku. Czujnik mmWave skierowany na strefę biurka trzyma światło i automatyzacje obecności tak długo, jak tam siedzisz. Sprawdzone modele: Aqara FP2 (Wi-Fi, strefy definiowane w aplikacji - możesz wykluczyć okno z firanką), Everything Presence Lite (ESPHome, w pełni lokalny, świetny do strojenia w HA) albo któryś z tańszych czujników z układem LD2410.

**Łazienka: duet PIR plus mmWave.** PIR przy wejściu zapala światło natychmiast (mmWave bywa o sekundę za wolny, a w łazience każda sekunda po ciemku irytuje), mmWave podtrzymuje obecność podczas kąpieli, kiedy ruchu prawie nie ma. Automatyzacja: zapal po PIR, gaś dopiero gdy mmWave zgłosi pustkę. Uwaga praktyczna: para wodna i ruch wody potrafią generować fałszywe odbicia - czujnik kieruj na strefę umywalki i wanny, nie na prysznic z natryskiem.

**Salon z kotem: mmWave ze strefami albo świadomy kompromis.** Marketingowa „odporność na zwierzęta" w czujnikach PIR oznacza zwykle obniżoną czułość poniżej pewnej wysokości - z kotem chodzącym po oparciach kanapy działa to słabo. Czujnik mmWave ze strefami (FP2 jest tu mocny) pozwala wyciąć podłogę i drapak ze strefy detekcji i zostawić kanapę z fotelami. Zadziała w dziewięciu przypadkach na dziesięć; ten dziesiąty to kot śpiący dokładnie na twoim miejscu na kanapie - tego żadna technologia nie odróżni od człowieka po samym odbiciu radarowym.

**Sypialnia: specjalizowany mmWave albo czujnik nacisku.** Radar z trybem oddechu może pomóc ocenić zajęcie łóżka, ale wynik zależy od modelu, montażu, pościeli i ruchu powietrza - nie traktuj go jako urządzenia medycznego ani jedynego sygnału bezpieczeństwa. Wiatrak przy łóżku to generator fałszywych obecności pierwszej klasy, a czujnik powinien patrzeć na łóżko, nie na okno. Czujnik nacisku pod materacem mierzy zajęcie bardziej bezpośrednio, lecz też wymaga kalibracji i może zareagować na zwierzę, bagaż albo przesunięcie ciężaru.

**Korytarz i schody: zwykły PIR.** Nikt nie stoi nieruchomo na schodach. Tu liczy się tylko szybkość reakcji i cena - PIR za 50 złotych (Sonoff SNZB-03P, Aqara P1) robi robotę, a bateria starcza na rok z okładem. Wydawanie tu pieniędzy na mmWave to przepalanie budżetu.

**Kuchnia: zwykle wystarczy PIR.** Gotowanie to ciągły ruch, więc bezruch zdarza się rzadko. Wyjątek: jeśli przy kuchennym blacie również pracujesz albo jadasz, a światło ma być sterowane obecnością, potraktuj kuchnię jak biuro i dołóż mmWave skierowany na strefę stołu.

> PIR mówi: ktoś się poruszył. mmWave mówi: ktoś tu jest. Bluetooth mówi: to jest Grzegorz. Dobry system obecności używa wszystkich trzech zdań, każdego tam, gdzie ma sens.

## Strojenie mmWave, zanim uznasz go za zepsuty

Czujniki mmWave mają zasłużoną opinię kapryśnych i równie zasłużoną opinię świetnych - różnica leży w strojeniu. Cztery kroki, które załatwiają większość problemów. Pierwszy: **ogranicz zasięg maksymalny do wymiarów pokoju**. Fale milimetrowe przenikają cienkie ściany działowe i czujnik z fabrycznym zasięgiem ośmiu metrów wykrywa ruch w korytarzu za ścianą. To najczęstsza przyczyna „duchów" zaraz po firankach.

Drugi: **czas podtrzymania ustaw w jednym miejscu** - albo w czujniku, albo w automatyzacji, nigdy w obu. Dwa nakładające się opóźnienia dają nieprzewidywalne zachowanie, którego nie da się sensownie diagnozować. Trzeci: **montaż ma znaczenie** - czujnik powinien patrzeć na strefę przebywania ludzi, nie na okno, drzwi ani kratkę nawiewu. Wysokość około półtora metra i lekki kąt w dół to dobry punkt startowy dla większości modeli. Czwarty: **obserwuj encje diagnostyczne** - lepsze czujniki raportują odległość i energię celu, więc zamiast zgadywać, co wywołuje fałszywą obecność, otwierasz wykres i widzisz, że cel pojawia się zawsze 3,2 metra od czujnika. Dokładnie tam, gdzie stoi monstera.

Daj sobie tydzień obserwacji na każdy nowy czujnik, zanim podepniesz pod niego gaszenie świateł w całej strefie. Niedostrojony mmWave sterujący światłem to najszybsza droga do utraty zaufania domowników do całego systemu.

## Integracja z Home Assistant i łączenie czujników

Wszystkie wymienione klasy urządzeń integrują się lokalnie: czujniki Zigbee przez koordynator (ZHA albo Zigbee2MQTT), Aqara FP2 po Wi-Fi przez integrację HomeKit, urządzenia ESPHome natywnie, śledzenie bluetooth przez ESPresense (publikuje po MQTT) albo Bermudę. Każdy czujnik kończy jako encja binarna obecności albo ruchu - i tu zaczyna się właściwa robota.

Najlepsze efekty daje składanie czujników w jedną logiczną encję obecności na pokój: pomocnik grupy z trybem „dowolny zgłasza obecność" albo szablon w stylu „zapal, gdy PIR *lub* mmWave; zgaś, gdy oba milczą od dwóch minut". PIR daje szybkość zapalenia, mmWave pewność podtrzymania - osobno każdy jest ułomny, razem dają wrażenie domu, który po prostu wie. Zacznij od jednego pokoju, w którym obecny system najbardziej cię irytuje, dołóż tam mmWave do istniejącego PIR-a i daj sobie tydzień na strojenie czułości, zanim kupisz kolejne.

## Podsumowanie

Nie ma jednego najlepszego czujnika obecności - jest właściwa technologia do właściwego pomieszczenia. PIR tam, gdzie ludzie się przemieszczają (korytarze, schody, spiżarnia), mmWave tam, gdzie przebywają w bezruchu (biuro, salon, sypialnia, łazienka), śledzenie bluetooth tam, gdzie chcesz wiedzieć kto, a nie tylko czy (sceny personalne, automatyzacje powrotu do domu). Budżetowo: zaczynaj od PIR-ów za kilkadziesiąt złotych, mmWave dokładaj punktowo do pokoi bezruchu, a bluetooth traktuj jako warstwę personalizacji na końcu. I jedna rada strojeniowa warta więcej niż niejeden zakup: zanim uznasz czujnik mmWave za wadliwy, wyłącz ze strefy detekcji firanki, wiatraki i rośliny - to one są „duchami" w dziewięćdziesięciu procentach zgłoszeń.
