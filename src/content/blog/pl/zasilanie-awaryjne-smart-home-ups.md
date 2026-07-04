---
title: "Zasilanie awaryjne smart home: UPS, brak prądu i internetu - co przeżyje twój dom"
description: "Co pada w smart home razem z prądem, jak dobrać UPS pod realne obciążenie, integracja NUT z Home Assistant, internet awaryjny LTE i test odporności - z yaml."
date: 2026-08-21
tags: ["smart-home", "home-assistant", "ups", "niezawodnosc", "zasilanie"]
lang: pl
readingTime: 16
author: GH
---

O dwudziestej trzeciej gaśnie prąd w całej okolicy. Zwykły dom robi się po prostu ciemny. Dom inteligentny robi się głupszy od zwykłego: przycisk na ścianie nie zapala światła, bo rozmawiał z przekaźnikiem przez serwer, który właśnie zgasł, brama nie reaguje na telefon, a czujnik zalania pod zmywarką melduje w pustkę, bo nie ma ani sieci, ani nikogo, kto by go wysłuchał. Przeszedłem kilka takich wieczorów, zanim potraktowałem brak prądu jak scenariusz testowy, a nie zrządzenie losu. W tym tekście pokażę, co dokładnie pada i w jakiej kolejności, jak dobrać UPS pod realne obciążenie smart home, jak spiąć go z Home Assistant przez NUT i jak sprawdzić całość, zanim sprawdzi ją pierwsza prawdziwa awaria.

## Anatomia awarii: co gaśnie razem z prądem

Sekwencja jest zawsze ta sama, tylko mało kto ją sobie rozpisuje. Najpierw pada serwer Home Assistant - natychmiast i twardo, co przy okazji potrafi uszkodzić bazę danych z historią albo, w gorszym wariancie, kartę pamięci. Razem z nim pada router, switch (przełącznik sieciowy) i punkt dostępowy, więc nawet gdyby serwer jakimś cudem przeżył, nie miałby z kim rozmawiać. Koordynator Zigbee wisi na porcie USB serwera albo na osobnym urządzeniu zasilanym z tej samej listwy, więc ginie w tej samej sekundzie.

Potem robi się ciekawiej. Urządzenia zasilane sieciowo - żarówki, gniazdka, rolety, przekaźniki w puszkach - gasną z oczywistych powodów. Czujniki bateryjne formalnie działają dalej, ale w sieci Zigbee to właśnie urządzenia zasilane z sieci pełnią rolę routerów przekazujących pakiety. Kiedy znikają, sieć kratowa rozpada się także dla czujników na baterii: czujnik otwarcia ma zasilanie, ma radio, ale nie ma przez kogo nadawać. Ten efekt domina ciągnie się zresztą poza samą awarię - po powrocie prądu część czujników jeszcze przez wiele minut szuka nowej ścieżki w sieci. Architekturę tej warstwy opisałem szerzej w tekście o [Zigbee i osobnym serwerze](/pl/blog/zigbee-home-assistant-zha-z2m-osobny-serwer/); tutaj wystarczy jedno zdanie: sieć kratowa jest dokładnie tak odporna, jak zasilanie jej routerów.

Na końcu tej układanki są automatyzacje. Ogrzewanie zostaje w trybie, w którym zastała je awaria. Harmonogramy się nie wykonują, licznik czasu w automatyzacji nawadniania znika, a scena wieczorna nigdy się nie kończy. Dom nie tylko przestaje być inteligentny - on zamiera w pół gestu i będzie w tym gescie tkwił, dopóki ktoś go nie obudzi i nie posprząta.

## Priorytety: co musi działać, a co może poczekać

Zanim kupisz jakikolwiek sprzęt, zrób listę. Nie da się i nie warto podtrzymywać całego domu - da się podtrzymać jego układ nerwowy. Moja lista "musi działać" ma cztery pozycje:

- **Sieć:** router, switch i jeden punkt dostępowy. Bez sieci serwer jest bezużyteczny, a telefon nie dostanie żadnego powiadomienia.
- **Serwer Home Assistant** razem z koordynatorem Zigbee. To on decyduje, czy dom w ogóle wie, że coś się dzieje, i czy zdąży o tym powiedzieć.
- **Czujniki bezpieczeństwa:** dym, czad, zalanie, otwarcie drzwi i okien. Bateryjne mierzą dalej same z siebie, ale ich meldunki muszą mieć dokąd docierać.
- **Kanał powiadomień:** cała droga od czujnika do telefonu, łącznie z internetem, o którym za chwilę.

Wszystko inne może poczekać: oświetlenie dekoracyjne, głośniki, telewizor, ekspres, rolety, asystenci głosowi. Godzina bez muzyki nikogo nie zabije; godzina, w której czujnik zalania melduje do martwego serwera, potrafi kosztować remont podłogi.

Jedna uwaga zasadnicza o czujnikach dymu i czadu: powinny być autonomiczne, czyli piszczeć same z siebie, niezależnie od jakiegokolwiek systemu. Smart home jest drugim kanałem alarmu - powiadomienie, syrena, miganie światłami - nigdy jedynym. Awaria zasilania to test uczciwości tej zasady: jeśli twój jedyny alarm dymowy gaśnie razem z Wi-Fi, masz problem poważniejszy niż utrata wygody.

## Dobór UPS: licz waty, nie strach

Pierwszy krok to pomiar, nie katalog. Podepnij listwę z routerem, switchem i serwerem do gniazdka z pomiarem energii i odczytaj realne obciążenie po kilku dniach. Typowy wynik zaskakuje: mini komputer z Home Assistant, router operatora i switch to razem często 30-60 W, czyli tyle, co jedna mocniejsza żarówka sprzed dekady. Ludzie kupują jednostki dobrane "na oko" pod kilowatowe obciążenia, a potem podtrzymują nimi sprzęt, który pobiera kilka procent ich mocy znamionowej.

Drugi krok to arytmetyka czasu podtrzymania. W uproszczeniu: energia akumulatora w watogodzinach podzielona przez pobór mocy w watach, pomnożona przez sprawność przetwarzania (licz realnie 80-85 procent). Akumulator o energii 100 Wh przy obciążeniu 40 W da w okolicach dwóch godzin - a nie pięciu minut z tabelki, bo tabelka opisuje pełne obciążenie. Uważaj przy tym na jednostki: moc UPS podawana w VA to nie to samo co waty; przy typowym współczynniku mocy 0,6-0,7 jednostka "650 VA" oddaje realnie około 400-450 W. Przy naszych obciążeniach to i tak ogromny zapas, ale warto rozumieć, co się kupuje. Wniosek praktyczny: dla smart home lepszy jest mały UPS z rozsądnym akumulatorem niż potężna jednostka, której mocy nigdy nie użyjesz, a której pobór własny zje część czasu podtrzymania.

Trzeci temat to kształt napięcia na wyjściu. Tańsze jednostki generują na baterii schodkową aproksymację sinusoidy. Zasilacze impulsowe w drobnej elektronice sieciowej zwykle to znoszą, ale zasilacze z aktywną korekcją współczynnika mocy - typowe w serwerach i urządzeniach NAS - potrafią przy schodkowym przebiegu buczeć, grzać się albo w najgorszym momencie się wyłączyć. Jeśli podtrzymujesz tylko router i mini komputer, przeżyjesz z aproksymacją; jeśli na tym samym UPS wisi NAS albo poważniejszy serwer, dopłać do czystej sinusoidy. Co do topologii: jednostka liniowo-interaktywna w domu w zupełności wystarcza, a podwójna konwersja (klasa "online") to koszt zakupu i stały pobór własny bez wyraźnej korzyści przy tej skali.

Czwarty wybór: jeden UPS czy dwa. Jeśli serwer stoi przy szafce sieciowej, jedna jednostka obsłuży wszystko i uprości okablowanie. Jeśli serwer mieszka piętro wyżej, dwa mniejsze UPS-y są uczciwszym rozwiązaniem niż prowadzenie przedłużaczy przez pół domu. Dla samej szafki sieciowej ciekawą alternatywą jest zasilacz buforowy 12 V: podtrzymuje router i modem bez podwójnej przemiany napięcia, więc ma mniejsze straty i mniejszą obudowę. Przy okazji porządkowania szafki warto też przemyśleć [wydzielenie urządzeń IoT do osobnej sieci](/pl/blog/iot-w-osobnej-sieci-vlan-smart-home/) - masowy restart wszystkiego naraz to moment, w którym porządek w sieci najbardziej procentuje. I pamiętaj o jednym: akumulator to część eksploatacyjna. Po trzech, najpóźniej pięciu latach trzyma ułamek nominalnej pojemności i wymaga wymiany, niezależnie od tego, jak rzadko pracował.

## NUT: Home Assistant wie, że działa na baterii

UPS podpięty samym kablem zasilającym to połowa roboty - dom jest podtrzymany, ale o tym nie wie. Kabel USB między UPS-em a serwerem plus NUT (Network UPS Tools) zamieniają zasilacz awaryjny w źródło danych: integracja NUT w Home Assistant wystawia stan zasilania, poziom naładowania, szacowany czas podtrzymania i bieżące obciążenie. Na Home Assistant OS wystarczy dodatek z serwerem NUT, w instalacji kontenerowej - osobny kontener obok reszty usług.

Z tych danych buduję dwie automatyzacje. Pierwsza reaguje na przejście na baterię: wysyła powiadomienie (sieć jeszcze działa, więc dotrze) i wyłącza wszystko, co niepotrzebnie ciągnie energię z akumulatora. Jedna uwaga praktyczna: dokładna wartość statusu zależy od sterownika i modelu - zanim wpiszesz ją w wyzwalacz, sprawdź w narzędziach deweloperskich, co raportuje twój egzemplarz.

```yaml
automation:
  - alias: "UPS - przejście na baterię"
    triggers:
      - trigger: state
        entity_id: sensor.ups_status
        to: "OB DISCHRG"
    actions:
      - action: notify.mobile_app_telefon_gh
        data:
          title: "Brak prądu"
          message: >
            Dom działa na baterii.
            Poziom akumulatora: {{ states('sensor.ups_battery_charge') }}%.
      - action: switch.turn_off
        target:
          entity_id: switch.listwa_niekrytyczna
```

Druga automatyzacja to czyste zamknięcie serwera, zanim akumulator padnie. Baza danych Home Assistant nie przepada za twardymi odcięciami, a karta pamięci potrafi po takim odcięciu nie wstać wcale. Próg dobierz tak, żeby po zamknięciu serwera UPS jeszcze kilkanaście minut pociągnął samą sieć - powiadomienia z czujników bateryjnych przestaną wtedy przechodzić, ale router zdąży obsłużyć to, co jeszcze jest w drodze:

```yaml
  - alias: "UPS - czyste zamknięcie serwera"
    triggers:
      - trigger: numeric_state
        entity_id: sensor.ups_battery_charge
        below: 25
    conditions:
      - condition: state
        entity_id: sensor.ups_status
        state: "OB DISCHRG"
    actions:
      - action: hassio.host_shutdown
```

Akcja `hassio.host_shutdown` dotyczy Home Assistant OS; w instalacji kontenerowej ten sam efekt daje skrypt na hoście wywołany po MQTT albo przez SSH. Niezależnie od automatyzacji zostaw włączony wbudowany mechanizm NUT, który sam zamyka hosta przy krytycznym poziomie baterii - to druga linia obrony na wypadek, gdyby automatyzacja z jakiegoś powodu nie zadziałała.

> UPS nie kupuje ci wieczoru normalnego życia - kupuje ci kwadrans, w którym dom zdąży powiedzieć, co się dzieje, i czysto się położyć.

## Internet awaryjny: powiadomienie musi mieć którędy wyjść

Rozległa awaria zasilania często zabiera też internet - i UPS w szafce nic na to nie poradzi, bo pada sprzęt po stronie operatora. Tu geografia bywa łaskawa lub nie: infrastruktura światłowodowa zwykle stoi w obiektach z własnym zasilaniem awaryjnym i lokalne wyłączenie prądu przeżywa, sieci oparte o wzmacniacze uliczne padają razem z ulicą. Nie zgadniesz, do której grupy należysz, dopóki nie sprawdzisz - albo dopóki nie sprawdzi tego za ciebie pierwsza awaria.

Odpowiedzią jest drugie łącze: modem LTE z kartą SIM, podpięty pod ten sam UPS co router. Jeśli router obsługuje dwa łącza, skonfiguruj przełączenie awaryjne (failover) - ruch przechodzi na LTE automatycznie, gdy główne łącze padnie, i wraca po jego wznowieniu. Powiadomienia z aplikacji Home Assistant idą przez internet, więc z chwilą przełączenia zaczną znowu docierać; z perspektywy telefonu nic się nie zmienia. Dwie pułapki z praktyki: karta przedpłacona bez okresowego ruchu potrafi po cichu wygasnąć, a niektóre taryfy blokują ruch po wyczerpaniu pakietu zamiast go przycinać. Raz na kwartał wyciągnij kabel głównego łącza z routera i sprawdź, po ilu sekundach ruch przejdzie na LTE - to test na pięć minut.

Jeśli chcesz być pancerny, dodaj kanał całkiem niezależny od domowej infrastruktury - na przykład bramkę SMS na osobnym urządzeniu z własną kartą SIM, wysyłającą wiadomość przy zdarzeniach z najwyższej półki: zalanie, dym, czad. To już liga wyżej i większość domów jej nie potrzebuje, ale warto wiedzieć, że taka opcja istnieje.

## Powrót zasilania: wszystko wstaje, pytanie w jakim stanie

Powrót prądu to druga połowa awarii i z mojego doświadczenia to ona psuje więcej rzeczy. Zacznij od serwera: w ustawieniach BIOS musi być włączone przywracanie zasilania po awarii, inaczej maszyna będzie leżeć wyłączona, aż ktoś fizycznie wciśnie przycisk - najgłupszy możliwy powód martwego smart home przez pół dnia. Kolejność startu zwykle układa się sama: router i switch wstają w kilkadziesiąt sekund, serwer w kilka minut, a Home Assistant potrafi ponowić połączenia do usług, które jeszcze nie wstały. Potrafi - ale pojedyncze integracje lubią wstać w stanie błędu, więc po pierwszym teście sprawdź, czy wszystko załadowało się bez ręcznego przeładowania.

Druga sprawa to MQTT i flaga retain. Wiadomość opublikowana z retain zostaje w brokerze i jest wydawana każdemu, kto zasubskrybuje temat - dzięki temu Home Assistant po restarcie od razu widzi ostatnie znane stany, zamiast pokazywać encje jako niedostępne do czasu, aż urządzenie samo się odezwie. Haczyk: to stany sprzed awarii, niekoniecznie aktualne. Dlatego obok retain skonfiguruj raportowanie dostępności urządzeń - system musi odróżniać "wiem, że czujnik działa" od "pamiętam, co mówił wczoraj".

Trzecia sprawa to zachowanie urządzeń po podaniu zasilania. Większość żarówek i gniazdek ma konfigurowalną opcję: włącz, wyłącz albo przywróć poprzedni stan - a fabryczne ustawienie to często "włącz na pełnej jasności". Stąd klasyka gatunku: prąd wraca o trzeciej w nocy i cały dom rozbłyska jak choinka. Przejdź po wszystkich urządzeniach, które na to pozwalają: sypialnie i pokoje dzieci na "wyłączone", ciągi komunikacyjne na "poprzedni stan", urządzenia grzejne zawsze na "wyłączone".

Została pułapka ostatnia i najmniej oczywista: wszystko wstało, ale w złym stanie. Automatyzacje przerwane w połowie nie dokończą się same - ogrzewanie zostało w trybie ręcznym, roleta w połowie wysokości, licznik czasu nawadniania wyparował. Na to mam automatyzację uruchamianą na starcie Home Assistant: przechodzi po kluczowych encjach, doprowadza je do stanu bezpiecznego i wysyła raport w stylu "dom wstał po awarii zasilania, ogrzewanie wróciło na harmonogram, sprawdź rolety". Pięć minut pisania, a zamienia najbardziej podstępną fazę awarii w jedną wiadomość do przeczytania.

## Test odporności: wyłącz bezpiecznik i patrz

Wszystko powyżej to hipotezy, dopóki nie zrobisz testu. Zapowiedz domownikom, wyłącz główny bezpiecznik i mierz czas. Nie symuluj awarii wyciągnięciem wtyczki UPS-a z gniazdka - tak testujesz tylko UPS. Bezpiecznik testuje cały dom naraz: razem z routerami Zigbee, żarówkami i tym jednym urządzeniem, o którym nikt nie pamiętał, że stoi poza listwą podtrzymywaną. Lista rzeczy do sprawdzenia:

- **Powiadomienie o awarii:** czy przyszło na telefon i po ilu sekundach od wyłączenia bezpiecznika.
- **Czas podtrzymania:** ile minut realnie trzyma sieć z serwerem; porównaj z wyliczeniem z watów i watogodzin.
- **Czyste zamknięcie:** czy serwer zamknął się przy zadanym progu, zanim UPS oddał ostatni oddech.
- **Powrót serwera:** czy wstał sam po włączeniu bezpiecznika i czy wszystkie integracje załadowały się bez ręcznej pomocy.
- **Sieć Zigbee:** po ilu minutach czujniki bateryjne wróciły do raportowania i które trzeba było budzić ręcznie.
- **Stany urządzeń:** które światła wstały zapalone, co zostało w złym trybie, czego brakuje na raporcie startowym.
- **Internet awaryjny:** czy przełączenie na LTE zadziałało i czy powiadomienia przechodziły w trakcie testu.

Powtarzaj ten test raz na pół roku i po każdej większej zmianie w infrastrukturze. Akumulator UPS-a degraduje się bezgłośnie i test to jedyny moment, w którym to widać - piętnaście minut podtrzymania, które po dwóch latach zmieniło się w cztery, wolisz odkryć w sobotnie popołudnie niż w noc z prawdziwą awarią. I ostatnia rzecz: twarde odcięcie zasilania to najczęstszy zabójca kart pamięci i baz danych, więc drugim filarem odporności jest [strategia kopii zapasowych i odtwarzania](/pl/blog/backup-home-assistant-strategia-odtwarzania/). UPS chroni przed większością twardych odcięć; kopia zapasowa przed tym jednym, które mimo wszystko się przydarzy.

## Podsumowanie

Zasilanie awaryjne smart home to cztery decyzje, nie jedna. Po pierwsze, priorytety: podtrzymujesz układ nerwowy - sieć, serwer, koordynator Zigbee i drogę powiadomień - a nie cały dom. Po drugie, dobór: realne obciążenie tej listy to często mniej niż 50 W, więc mały UPS z przyzwoitym akumulatorem daje godzinę lub dwie spokoju za rozsądne pieniądze. Po trzecie, świadomość: NUT zamienia UPS w czujnik, a dwie automatyzacje - powiadomienie przy przejściu na baterię i czyste zamknięcie przy niskim poziomie - załatwiają dziewięćdziesiąt procent wartości całego przedsięwzięcia. Po czwarte, powrót: przywracanie zasilania w BIOS, retain w MQTT, zachowanie urządzeń po włączeniu ustawione świadomie i automatyzacja sprzątająca stany po restarcie. A potem bezpiecznik: jeden test na pół roku zamienia nadzieję w wiedzę. Dom, który przeżyje brak prądu z godnością, buduje się w jedno popołudnie - pod warunkiem, że zrobisz to przed awarią, a nie po niej.
