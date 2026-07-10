---
title: "IoT w osobnej sieci: VLAN-y i zapora dla smart home bez doktoratu z sieci"
description: "Segmentacja sieci to największa darmowa dźwignia bezpieczeństwa smart home: model trzech sieci, reguły zapory po ludzku, pułapka mDNS i plan wdrożenia na UniFi, Mikrotiku i OpenWrt."
date: 2026-07-31
tags: ["smart-home", "bezpieczenstwo", "siec", "vlan", "iot"]
lang: pl
readingTime: 10
author: GH
---

Tania kamera z chińskiej chmury nie powinna widzieć twojego laptopa, NAS-a z dokumentami ani telefonu - a w domyślnej konfiguracji domowej sieci widzi wszystko. Segmentacja sieci to największa dźwignia bezpieczeństwa smart home za zero złotych, o ile masz odpowiedni router. Pokażę model, który działa u mnie, reguły zapory po ludzku i przegląd, jak to zrobić na popularnych platformach.

## Jaki właściwie jest problem

Typowa domowa sieć jest płaska: router od operatora, jedno Wi-Fi, wszystko w jednej puli adresów. Laptop z dostępem do banku, telefon, NAS z dokumentami i zdjęciami z dziesięciu lat, a obok kamera za 90 złotych, której producent ostatnią aktualizację oprogramowania układowego wydał przed dwoma laty. W płaskiej sieci każde z tych urządzeń widzi każde inne i może próbować się z nim łączyć.

Nie chodzi o panikę, tylko o rachunek powierzchni ataku. Trzydzieści urządzeń IoT to trzydzieści potencjalnych furtek, z których większości nie kontrolujesz: nie znasz kodu, nie wiesz, z jakimi serwerami rozmawiają, nie masz wpływu na tempo łatania podatności. Historia botnetu Mirai pokazała, że tanie kamery i rejestratory są przejmowane masowo, automatycznie i bez żadnego zainteresowania tym, czyj to dom. Przejęte urządzenie w płaskiej sieci może skanować sąsiadów, podsłuchiwać ruch i służyć jako punkt wejścia dalej.

Wniosek jest prosty: urządzenia, którym nie ufasz, powinny mieszkać w osobnej sieci, z której nie widać niczego cennego. Do tego służą VLAN-y.

## Model docelowy: trzy sieci zamiast jednej

VLAN to logiczny podział jednej fizycznej sieci na kilka odseparowanych - te same kable i ten sam router, ale urządzenia w różnych VLAN-ach nie widzą się nawzajem, dopóki zapora wprost na to nie pozwoli. Sprawdzony układ dla domu wygląda tak:

- **Sieć zaufana** - laptopy, telefony domowników, NAS, drukarka i serwer Home Assistant. Pełen wzajemny dostęp.
- **Sieć IoT** - kamery, wtyczki, żarówki Wi-Fi, telewizor, robot sprzątający, czujniki. Osobne SSID, osobna pula adresów, domyślnie zero dostępu do sieci zaufanej.
- **Sieć dla gości** - internet i nic więcej. Większość routerów ma to gotowe jednym przełącznikiem.

Najczęstsze pytanie: gdzie postawić Home Assistant? Są dwie szkoły. Pierwsza umieszcza serwer HA w sieci zaufanej i przepuszcza przez zaporę tylko to, czego integracje potrzebują - polecam ten wariant, bo HA jest sercem domu i zasługuje na ochronę. Druga szkoła wrzuca HA do sieci IoT razem z urządzeniami; prostsze w konfiguracji, ale wtedy serwer z dostępem do wszystkich twoich danych mieszka w najmniej zaufanym segmencie. Wybieram szkołę pierwszą i na niej opieram resztę tekstu.

## Reguły zapory po ludzku

Zacznij od domyślnej blokady między strefami i dodawaj tylko potrzebne przepływy w obu kierunkach. Sieć zaufana nie musi mieć dostępu do każdego portu każdego urządzenia IoT - zwykle wystarczą konkretne adresy i usługi. Zapora stanowa przepuszcza odpowiedzi należące do prawidłowo ustanowionych lub powiązanych połączeń, ale dokładne stany i kolejność reguł zależą od platformy.

Wyjątki, czyli co przepuścić z sieci IoT w stronę zaufanej, to krótka lista:

| Usługa | Port | Kierunek | Po co |
| --- | --- | --- | --- |
| MQTT | 1883/TCP | IoT → serwer HA | Urządzenia (Shelly, Zigbee2MQTT, czujniki) publikują stany do brokera |
| Interfejs HA | 8123/TCP | IoT → serwer HA | Tylko jeśli urządzenia wołają HA bezpośrednio, na przykład tablety ścienne z panelem |
| DNS | 53/UDP | IoT → router | Rozwiązywanie nazw; celowo przez router, żeby mieć kontrolę i logi |
| NTP | 123/UDP | IoT → internet lub lokalny serwer czasu | Urządzenia bez poprawnego zegara potrafią dziwnie chorować |
| mDNS | 5353/UDP | między sieciami przez powtarzacz | Wykrywanie urządzeń - o tym osobna sekcja niżej |

Zwróć uwagę na kierunek konkretnej integracji: czasem Home Assistant łączy się z urządzeniem, a czasem urządzenie publikuje do brokera lub chmury. Nie zakładaj więc uniwersalnej reguły „zaufana do IoT - wszystko". Dostęp do internetu ograniczaj według udokumentowanych potrzeb urządzenia; pełne odcięcie może zatrzymać aktualizacje, synchronizację czasu albo funkcje chmurowe.

## mDNS i wykrywanie - najczęstsza pułapka

Po pierwszej konfiguracji VLAN-ów prawie każdy trafia na ten sam mur: Home Assistant przestaje wykrywać nowe urządzenia, a telefon nie widzi Chromecasta. Powód: wykrywanie opiera się na mDNS, czyli komunikatach rozgłaszanych w obrębie jednej sieci - one z natury nie przechodzą między VLAN-ami.

Rozwiązaniem może być selektywny powtarzacz lub pełnomocnik mDNS. UniFi pozwala ograniczyć przekazywane usługi, a RouterOS wymaga interfejsów obsługujących multicast i jawnego dopuszczenia UDP 5353 w łańcuchu wejściowym przy ścisłej zaporze; jego obecna funkcja powtarzania obsługuje tylko IPv4. Samo wykrycie usługi nie otwiera portu danych, więc nadal potrzebujesz osobnych reguł dla właściwego ruchu.

> Najtańszy element bezpieczeństwa smart home to nie kolejny gadżet, tylko reguła zapory: z IoT do reszty domu domyślnie nie przechodzi nic.

## Jak to wygląda na popularnych platformach

Celowo trzymam poziom przeglądowy - szczegółowe instrukcje zmieniają się z wersjami oprogramowania, a zasady pozostają te same.

**UniFi** to najłagodniejsza droga. Nową sieć z identyfikatorem VLAN tworzysz w ustawieniach sieci, przypinasz ją do osobnego SSID i klikasz reguły w zaporze strefowej (Zone-Based Firewall): strefa IoT do strefy wewnętrznej - blokuj, wyjątki jak w tabeli wyżej. Przełącznik mDNS jest wbudowany. Cena tej wygody to koszt sprzętu UniFi.

**Mikrotik** daje największą kontrolę za najmniejsze pieniądze, ale krzywa nauki jest stroma. Konfigurujesz filtrowanie VLAN na mostku, potem reguły w zaporze - dokładnie w duchu trzech zasad kierunkowych. W sieci jest mnóstwo sprawdzonych poradników konfiguracji VLAN pod smart home; nie wymyślaj własnej od zera, zaadaptuj gotową.

**OpenWrt** to darmowy system, który wgrasz na wiele popularnych routerów. Sieci definiujesz w ustawieniach urządzeń sieciowych, a separację załatwiają strefy zapory: lan, iot, guest z polityką przekazywania między strefami. Świetna opcja, jeśli masz router z listy wspieranych i lubisz grzebać.

Wspólny mianownik: router operatora zwykle nie wystarczy, bo nie obsługuje VLAN-ów ani sensownej zapory. Najtańszy realny punkt wejścia to używany router z OpenWrt albo podstawowy Mikrotik - wydatek rzędu dwustu, trzystu złotych, jeśli nie masz jeszcze niczego.

## Od czego zacząć i czego nie wciskać na siłę

Nie przenoś wszystkiego naraz. Zacznij od urządzeń o najwyższym ryzyku i najmniejszej liczbie interakcji: kamery, tanie wtyczki Wi-Fi, robot sprzątający. Telewizor i głośniki z funkcją przesyłania obrazu zostaw na koniec - to one generują najwięcej problemów z wykrywaniem i jeśli walka z nimi cię sfrustruje, rozważ kompromis w postaci osobnej, trzeciej sieci multimedialnej o nieco luźniejszych regułach.

Praktyczna kolejność wdrożenia, która oszczędza nerwy: najpierw utwórz sieć IoT z regułami, ale nie przenoś jeszcze niczego. Potem przenoś urządzenia pojedynczo albo małymi grupami i po każdej przeprowadzce sprawdzaj, czy integracja w Home Assistant dalej działa. Przy stałych rezerwacjach adresów w DHCP urządzenie po zmianie sieci dostanie nowy adres - część integracji wykryje to samo, części trzeba będzie wskazać nowy adres ręcznie. Robienie tego dla trzydziestu urządzeń naraz w piątkowy wieczór to przepis na sobotę spędzoną na diagnozowaniu, które z dziesięciu problemów jest którym.

## Jak sprawdzić, że segmentacja naprawdę działa

Tu odzywa się we mnie tester: konfiguracja bez weryfikacji to hipoteza. Po wdrożeniu zrób krótką sesję testową, w której ważniejsze są testy negatywne niż pozytywne - czyli sprawdzenie, że zabronione rzeczy faktycznie są zabronione.

- Podłącz laptop do SSID sieci IoT i spróbuj: otworzyć udział plików na NAS-ie, wejść na interfejs routera, wykonać ping do telefonu w sieci zaufanej. Wszystko powinno zakończyć się niepowodzeniem.
- Z tego samego laptopa sprawdź wyjątki: czy broker MQTT odpowiada na porcie 1883, czy DNS rozwiązuje nazwy. To powinno działać.
- Wróć do sieci zaufanej i sprawdź dostęp do kamery oraz podgląd w Home Assistant - kierunek dozwolony ma działać bez zgrzytów.
- Przetestuj wykrywanie: czy telefon widzi urządzenia do przesyłania obrazu, czy HA proponuje nowo wykryte urządzenia. To weryfikuje powtarzacz mDNS.

Najczęstsze błędy znajdowane na tym etapie: reguły zapory w złej kolejności (reguła blokująca nad regułą zezwalającą, która przez to nigdy nie działa), zapomniane urządzenia zarządzające w złej sieci (punkt dostępowy, który stracił kontakt z kontrolerem) i odcięte aktualizacje - jeśli zablokowałeś IoT internet w całości, część urządzeń przestanie dostawać poprawki bezpieczeństwa, co bywa gorsze niż kontrolowany dostęp do sieci. Tę sesję testową warto powtórzyć po każdej większej aktualizacji oprogramowania routera.

Thread jest siecią IPv6, a router brzegowy routuje ją do domowej sieci IP i potencjalnie internetu. Nie jest to urządzenie Wi-Fi, ale nadal trzeba uwzględnić je w modelu zapory, routerów brzegowych i kontrolerów Matter. Zigbee nie przenosi natywnie ruchu IP czujnika, lecz jego koordynator, broker i serwer Home Assistant pozostają elementami sieci, które trzeba zabezpieczyć.

## Podsumowanie

Segmentacja może ograniczyć ruch boczny, ale nie usuwa wszystkich ryzyk i wymaga utrzymania oraz testów. Model do zapamiętania: osobne strefy, domyślna blokada, jawne przepływy o najmniejszych potrzebnych uprawnieniach i selektywne przekazywanie wykrywania tylko tam, gdzie jest potrzebne. Zacznij od inwentaryzacji przepływów kamer i wtyczek, a potem wdrażaj reguły etapami z możliwością wycofania.
