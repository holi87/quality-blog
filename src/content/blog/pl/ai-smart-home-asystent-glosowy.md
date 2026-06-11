---
title: "AI w Smart Home, część 5: Dom, który mówi - asystent głosowy z lokalnym LLM"
description: "Piąta część mini-serii o AI w smart home. Budujemy asystenta głosowego na Home Assistant Assist z lokalnym modelem językowym: łańcuch od słowa wybudzającego po syntezę mowy, dobór sprzętu i uczciwe porównanie z asystentami komercyjnymi."
date: 2026-07-06
tags: ["ai", "smart home", "home assistant", "asystent głosowy", "llm"]
lang: pl
readingTime: 10
author: [JS, GH]
---

Asystent głosowy nie musi wysyłać twojego głosu do chmury wielkiej korporacji. Cały łańcuch - od mikrofonu, przez rozpoznanie mowy, po odpowiedź - może działać w twojej szafie technicznej. W tej części serii pokazujemy, jak zbudować asystenta na Home Assistant Assist z lokalnym modelem językowym, co działa zaskakująco dobrze, a gdzie lokalny LLM wciąż przegrywa z komercyjnymi asystentami.

## Dlaczego w ogóle lokalnie?

Komercyjne głośniki z asystentem są wygodne, ale mają dwie cechy, które w sypialni czy kuchni trudno zignorować. Po pierwsze, mikrofon w trybie nasłuchu to urządzenie, któremu trzeba zaufać. Po drugie, asystent przestaje działać razem z internetem albo z decyzją producenta o wygaszeniu usługi.

Lokalny asystent odwraca ten układ. Dźwięk nie opuszcza domu, historia komend zostaje u ciebie, a polecenie "zgaś światło w kuchni" działa nawet wtedy, gdy światłowód leży. Cena tego komfortu to własny sprzęt, własna konfiguracja i kilka kompromisów, o których uczciwie napiszemy niżej.

> Polecenie "zgaś światło w kuchni" nie potrzebuje centrum danych po drugiej stronie oceanu. Potrzebuje mikrofonu, kilku sekund pracy lokalnego procesora i odrobiny zaufania do własnego sprzętu.

## Łańcuch głosowy w Home Assistant

Home Assistant ma wbudowaną warstwę Assist, która spina cały potok przetwarzania głosu. Warto rozumieć go jako pięć ogniw, bo każde można wymienić niezależnie:

1. **Słowo wybudzające** (wake word) - urządzenie nasłuchuje frazy typu "Hej Nabu". W praktyce robi to openWakeWord na serwerze albo microWakeWord bezpośrednio na układzie ESP32-S3.
2. **Zamiana mowy na tekst** - nagrany fragment trafia do modelu Whisper (w wariancie faster-whisper), który zwraca tekst komendy.
3. **Rozpoznanie intencji** - Home Assistant próbuje dopasować tekst do wbudowanych komend: włącz, wyłącz, ustaw temperaturę, uruchom scenę.
4. **LLM jako ścieżka rozszerzona** - jeśli wbudowane intencje nie pasują, pytanie przejmuje model językowy, np. lokalny model przez Ollama.
5. **Odpowiedź głosowa** - tekst odpowiedzi czyta Piper, lekki lokalny syntezator mowy z polskimi głosami.

Komunikacja między ogniwami idzie przez protokół Wyoming, więc Whisper i Piper mogą działać na innym komputerze niż sam Home Assistant. To ważne, bo serwer domowy na słabym sprzęcie nie musi dźwigać wszystkiego sam.

## Czym dom słucha: satelity głosowe

Mikrofon w laptopie nie wystarczy - asystent potrzebuje uszu w pomieszczeniach. U Julii sprawdziły się dwa podejścia. Pierwsze to Home Assistant Voice Preview Edition, oficjalne urządzenie z dwoma mikrofonami i sprzętowym przetwarzaniem dźwięku, które za około 250 zł daje najlepszy stosunek jakości do wysiłku. Drugie to samodzielnie wgrany ESPHome na tanich płytkach z ESP32-S3, od kulki M5Stack ATOM Echo za kilkadziesiąt złotych po zestawy z ekranem.

Różnica jest słyszalna dosłownie. Tani satelita z jednym mikrofonem łapie komendy z metra, w ciszy. Voice Preview Edition rozumie polecenia z drugiego końca kuchni, przy włączonym okapie. Jeżeli planujesz jeden punkt nasłuchu na pomieszczenie, nie oszczędzaj na mikrofonach - to najczęstsze źródło frustracji, a nie model językowy.

## Mowa na tekst: Whisper po polsku

Whisper jest dziś standardem lokalnego rozpoznawania mowy i dobrze radzi sobie z polskim, ale rozmiar modelu ma znaczenie. Wariant tiny potrafi z "zgaś światło w salonie" zrobić "zgaś światło w salonie" albo gorzej, wariant small jest już przyzwoity, a medium rozumie nawet niedbałą wymowę przy radiu grającym w tle.

Koszt rośnie razem z jakością. Na Raspberry Pi 4 sensownie działa tylko tiny albo base, z czasem przetwarzania 1-2 sekundy na krótką komendę. Mini komputer klasy N100 obsłuży small w okolicach sekundy. Model medium bez karty graficznej robi się zauważalnie wolny. Nasza rekomendacja dla polskiego: small jako minimum, medium jeśli sprzęt pozwala.

## Mózg: najpierw intencje, potem LLM

Najważniejsza decyzja architektoniczna całego projektu brzmi: nie każ modelowi językowemu obsługiwać wszystkiego. Home Assistant pozwala ustawić tryb, w którym wbudowane rozpoznawanie intencji ma pierwszeństwo, a LLM dostaje tylko to, czego dopasować się nie da. Komenda "włącz lampę w sypialni" wykonuje się wtedy w ułamku sekundy, deterministycznie, bez ani jednego tokenu.

LLM wchodzi do gry przy pytaniach otwartych: "czy w domu jest gdzieś otwarte okno?", "jaka temperatura jest w pokoju dziecka i czy to normalne?", "przypomnij mi wieczorem o podlaniu kwiatów". Model widzi tylko te encje, które świadomie wystawiliśmy do asystenta - to jednocześnie zabezpieczenie i sposób na mniejsze zużycie kontekstu. Zasada z [poprzednich części serii](/pl/blog/ai-smart-home-automatyzacje/) obowiązuje też tutaj: model interpretuje i odpowiada, ale akcje wysokiego ryzyka, jak zamki czy alarm, pozostają poza jego zasięgiem.

Od strony modeli (tu głos Grzegorza): lokalnie przez Ollama dobrze sprawdzają się modele klasy 7-8 miliardów parametrów w wersjach skwantyzowanych. Mniejsze modele, 3-4 miliardy, bywają zaskakująco sprawne w prostych pytaniach o stan domu, ale po polsku częściej kaleczą odmianę i gubią kontekst rozmowy po dwóch, trzech wymianach.

## Asystent jest tak dobry, jak nazwy twoich encji

To lekcja, która wraca w każdej części tej serii, ale przy głosie boli najbardziej. Encja `light.salon_sufit` z aliasem "światło w salonie" zadziała za pierwszym razem. Encja `switch.sonoff_0a3f` nie zadziała nigdy, bo nikt tak nie mówi. Przed podłączeniem asystenta przejdź przez listę wystawionych encji i nadaj każdej nazwę, którą faktycznie wypowiadasz na głos - po polsku, krótko, bez technicznego żargonu.

Drugi mnożnik jakości to obszary. Satelita przypisany do kuchni wie, że "zgaś światło" oznacza światło w kuchni - bez wskazywania pomieszczenia. To drobiazg w konfiguracji, a w praktyce różnica między asystentem, z którym się rozmawia, a takim, do którego wygłasza się formułki. Warto też dodać aliasy dla domowników: jeśli dziecko mówi "lampka", a ty "lampa nocna", oba warianty powinny być zapisane.

Na koniec podejście testerskie, którego w tej serii nie mogło zabraknąć: spisz 20 komend, których naprawdę używasz, i przetestuj je w trzech warunkach - cisza, telewizor w tle, mówienie z drugiego końca pokoju. Tabela wyników pokaże ci, czy problemem jest mikrofon, rozpoznawanie mowy czy dopasowanie intencji. Każde z tych trzech naprawia się inaczej i nie warto zgadywać.

## Głos odpowiedzi: Piper

Ostatnie ogniwo jest najmniej problematyczne. Piper generuje mowę szybciej niż w czasie rzeczywistym nawet na Raspberry Pi i ma kilka polskich głosów do wyboru. Brzmienie jest wyraźnie syntetyczne, ale w pełni zrozumiałe - do odpowiedzi typu "włączyłem światło, temperatura w salonie to 22 stopnie" zupełnie wystarcza. Jeśli zależy ci na naturalności znanej z komercyjnych asystentów, to jedyne miejsce łańcucha, gdzie różnica klasy jest słyszalna od pierwszego zdania.

## Co działa, a co odstaje

Po kilku miesiącach używania lokalnego asystenta obraz jest dość klarowny. Zestawienie poniżej porównuje typowe doświadczenie z asystentem komercyjnym.

| Obszar | Lokalny łańcuch | Asystent komercyjny |
|---|---|---|
| Komendy na encjach (światła, sceny) | Bardzo dobrze, 1-2 s | Bardzo dobrze, ok. 1 s |
| Pytania otwarte o stan domu | Dobrze, 3-6 s z LLM na GPU | Słabo - nie zna twoich encji tak dobrze |
| Wiedza ogólna, rozmowa | Przeciętnie, zależnie od modelu | Bardzo dobrze |
| Polszczyzna odpowiedzi | Poprawna, czasem drewniana | Naturalna |
| Praca bez internetu | Pełna | Brak |
| Prywatność dźwięku | Dźwięk nie opuszcza domu | Zależna od regulaminu dostawcy |

Największa przewaga lokalnego rozwiązania jest nieoczywista: asystent zna twój dom. Komercyjny głośnik wie wszystko o świecie i prawie nic o twoich czujnikach. Lokalny LLM z dostępem do encji odpowie na pytanie "czy pralka już skończyła?", bo widzi sensor zużycia energii pralki. Tego komfortu chmurowy asystent ogólnego przeznaczenia nie da bez dodatkowych integracji.

Największa słabość też jest konkretna: rozmowa wieloetapowa. "Włącz światło w salonie. A teraz przyciemnij je do połowy" - to drugie zdanie wymaga pamięci kontekstu, z którą mniejsze modele radzą sobie nierówno. Po dwóch, trzech wymianach lokalny asystent potrafi zgubić wątek, podczas gdy komercyjny prowadzi rozmowę dalej. W praktyce mniej to przeszkadza, niż sugerują demonstracje - 90% interakcji z asystentem domowym to pojedyncze komendy i pojedyncze pytania, nie dialogi.

## Sprzęt realnie, bez marketingu

Wymagania zależą od tego, gdzie postawisz granicę ambicji. Trzy realistyczne progi:

- **Raspberry Pi 4/5** - Whisper tiny/base, Piper, wbudowane intencje. Działa, komendy na encjach chodzą sprawnie, ale bez LLM. Dobry start za małe pieniądze.
- **Mini komputer klasy N100, 16 GB RAM** - Whisper small w ok. sekundę, mały LLM 3-4 mld parametrów na procesorze z czasem odpowiedzi 8-15 sekund. Do komend świetnie, do rozmowy cierpliwość wymagana.
- **Komputer z kartą graficzną 8-12 GB VRAM** - Whisper medium plus model 7-8 mld parametrów, pierwsza odpowiedź w 2-4 sekundy. To poziom, przy którym lokalny asystent przestaje być ciekawostką, a zaczyna być narzędziem.

Do tego satelity: jeden punkt nasłuchu na pomieszczenie, w którym faktycznie wydajesz komendy. U nas wystarczyły trzy: kuchnia, salon, sypialnia.

## Podsumowanie

Lokalny asystent głosowy w 2026 roku to już nie projekt dla zapaleńców z lutownicą - łańcuch Assist, Whisper, LLM, Piper składa się w weekend. Komendy na urządzeniach działają niemal tak dobrze, jak u komercyjnej konkurencji, a pytania o stan własnego domu działają lepiej, bo asystent zna twoje encje. Słabe punkty to opóźnienie przy pytaniach otwartych bez GPU, drewniana polszczyzna mniejszych modeli i syntetyczny głos. Jeśli masz już Home Assistant, zacznij od jednego satelity i wbudowanych intencji bez LLM - to godzina pracy, a od razu poczujesz, czy ten kierunek jest dla ciebie.
