---
title: "Zigbee w Home Assistant 2026: ZHA, Z2M w HA, czy Z2M na osobnym serwerze?"
description: "Trzy realne deploymenty Zigbee w HA: wbudowane ZHA, Zigbee2MQTT jako addon, Z2M+MQTT na osobnym hoście. Izolacja awarii, bezpieczeństwo MQTT, multi-koordynator, koordynatory PoE."
date: 2026-05-11
tags: ["smart-home", "home-assistant", "zigbee", "zigbee2mqtt", "zha", "mqtt"]
lang: pl
readingTime: 10
author: GH
---

We [wpisie z dnia 21 kwietnia 2026](/pl/blog/zwave-zigbee-wifi-matter/) wybraliśmy protokół: Zigbee. Tani, dojrzały, mesh, setki urządzeń, bateryjne czujniki na lata. Wybór protokołu to jedna decyzja. Ale jak go uruchomić w Home Assistant - to trzy różne decyzje, i większość tutoriali w sieci traktuje je jako kosmetyczne.

Nie są kosmetyczne. Wybór między **ZHA**, **Zigbee2MQTT jako addon HA** i **Z2M+MQTT na osobnym serwerze** wpływa na izolację awarii (czy update HA pada Zigbee?), powierzchnię ataku (ile procesów hardenujesz?), tempo wsparcia nowych urządzeń, i czy w ogóle możesz mieć kilka koordynatorów dla większego domu albo warsztatu.

Ten wpis to porównanie trzech archetypów z perspektywy kogoś, kto już ma HA i 5-20 czujników, decyduje czy zostać przy domyślnym ZHA czy migrować, oraz z perspektywy kogoś budującego od zera. W 2026 doszedł jeszcze jeden gracz, który zmienia kalkulację: **koordynatory PoE** (np. SMLight SLZB-06) - Zigbee na kabel ethernetowy, bez USB.

## TL;DR - tabela trzech opcji

| Cecha | ZHA | Z2M addon | Z2M osobny serwer |
|---|---|---|---|
| Setup | 5 min | 15 min | 45-60 min |
| Wsparcie nowych urządzeń | Wolne (kwartały) | Najszybsze (tygodnie) | Najszybsze (tygodnie) |
| Frontend Zigbee | HA UI | Z2M (mapa, OTA, klastry) | Z2M (mapa, OTA, klastry) |
| OTA | OK | Bardzo dobre | Bardzo dobre |
| Wiele koordynatorów | Teoretycznie tak | Nie | Tak (N instancji) |
| Izolacja od awarii HA | Brak | Brak | Pełna |
| Powierzchnia ataku | Najmniejsza | + Mosquitto localhost | + MQTT przez sieć |
| Backup/migracja | Trudne | Jeden plik (`database.db`) | Jeden plik + adres brokera |
| Tempo update'ów | Z HA core | Weekly | Weekly |
| Krzywa nauki | Płaska | Średnia | Stroma na początku |

## ZHA - najmniejszy opór, najmniejsza elastyczność

ZHA to integracja wbudowana w HA. Pod spodem siedzi `zigpy` plus adapter (`zigpy-znp` dla Texas Instruments, `bellows` dla EmberZNet). Brak MQTT, brak osobnego procesu - koordynator USB (lub TCP do koordynatora PoE) → ZHA → encje HA.

**Plusy:**
- Zero setupu MQTT - brak Mosquitto w stosie
- Jedno miejsce diagnostyki: pad HA = pad wszystkiego, więc szukasz w jednym miejscu
- Działa z koordynatorem USB i sieciowym (`socket://192.168.x.y:6638` dla SLZB-06)
- Wpada w UI HA tak samo jak inne integracje, brak osobnego frontendu do nauki

**Minusy:**
- Wsparcie nowych urządzeń idzie wolniej. Jeśli Tuya wypuści dziś czujnik z dziwną implementacją klastra, w Z2M dostaniesz handler za tydzień (community pull request → release), w ZHA czeka się na cykl HA core albo na quirk w `zha-device-handlers`. Realna różnica w 2026: Z2M ma ~4500+ obsługiwanych modeli, ZHA bliżej 3000
- OTA działa, ale baza obrazów uboższa
- Multi-koordynator: dodany do ZHA w 2024, ale w praktyce mało używany, mniej dojrzały niż wielu instancji Z2M
- Brak wizualizacji mesha w czasie rzeczywistym (tylko statyczna lista)

**Sygnał, że to dobre dla ciebie:** ≤30 urządzeń, jeden koordynator, nie chcesz MQTT, pierwsza próba ze smart home, lubisz wszystko w jednym UI.

## Z2M jako addon w HA - kompromis większości

Najpopularniejszy setup: w HA OS instalujesz dwa addony - **Mosquitto broker** i **Zigbee2MQTT**. W HA Container/Supervised odpalasz dwa kontenery obok HA. Architektura:

```
koordynator → Z2M → Mosquitto (localhost:1883) → MQTT discovery → encje HA
```

Z2M co tydzień dostaje update `zigbee-herdsman` z nowymi handlerami urządzeń. Ma własny frontend pod `/zigbee2mqtt/` - mapa mesha w czasie rzeczywistym, OTA z buttonem, edycja klastrów ręcznie dla nietypowych urządzeń, podgląd surowych pakietów do debugu.

**Plusy:**
- Najszybsze wsparcie nowości - to ten stack dostaje handlery jako pierwszy
- Frontend Z2M to inna liga niż „czujniki w HA UI" - mapa pokazuje, że Aqara w salonie routuje przez wtyczkę w korytarzu, więc jak wymontujesz wtyczkę, czujnik straci połączenie
- OTA jeden klik - Z2M sam pobiera obrazy z bazy `Koenkk/zigbee-OTA`
- Backup = `data/database.db` + `coordinator_backup.json`. Dwa pliki, koniec
- Mosquitto domyślnie na `localhost:1883` bez auth - w obrębie hosta to OK, attack surface znikoma

**Minusy:**
- Restart HA = restart całości (addon żyje na tym samym hoście)
- Pad HA OS = pad Zigbee. Jeden punkt awarii dla całego smart home
- Sztywno jedna instancja Z2M. Multi-koordynator wymaga osobnego serwera
- Mosquitto „bez hasła" przestaje być OK w momencie gdy chcesz, żeby Node-RED na innym Pi czytał MQTT - wtedy auth/ACL trzeba dodać

**Sygnał, że to dobre dla ciebie:** 30-100 urządzeń, kupujesz nowości (najświeższe Tuya/Aqara/Sonoff), chcesz mapy mesha i OTA, ale nie chcesz utrzymywać dwóch hostów.

## Z2M + MQTT na osobnym serwerze - separation of concerns

Architektura inna:

```
HA (NUC)        ←TLS MQTT 8883→        Mosquitto + Z2M (Pi 5)        ←USB / TCP→        koordynator
```

HA i Z2M to dwa osobne hosty. MQTT broker zwykle na tym samym hoście co Z2M (krótszy hop, mniej awarii sieciowych dla samego sterowania urządzeniami). HA łączy się przez sieć TLS-em.

**Dlaczego ktoś to robi:**

- **Izolacja awarii.** Update HA → restart HA → automatyzacje pauzują. Ale Z2M żyje, dalej raportuje stan urządzeń przez MQTT z `retain: true`. Po starcie HA stan natychmiast dostępny, nie ma czasu „nieznanego" w UI ani utraconych eventów dla automatyzacji opartej na zmianach
- **Edge deployment.** Koordynator ma być blisko centrum mesha. HA niekoniecznie. 5m kabla USB to nieelegancki workaround; Pi 5 z koordynatorem ustawiony w środku domu, HA w piwnicy obok rack - działa
- **Multi-koordynator naprawdę** (sekcja niżej)
- **Reuse starego sprzętu.** Pi 4 leży w szufladzie, a kupowanie kolejnego NUC pod sam HA to przesada
- **Koordynator PoE zmienia kalkulację.** SLZB-06 podpięte do switcha PoE = koordynator jest endpointem sieciowym, nie peryferium konkretnego hosta. Z2M wskazuje na `tcp://10.0.20.11:6638`, host Z2M może być gdziekolwiek. To rozwiązuje 90% problemów z odległością i USB

**Co dochodzi w setupie:**

- MQTT przez sieć ⇒ TLS (port 8883), self-signed cert lub domowy CA
- Per-client credentials: jeden user dla HA, jeden per instancja Z2M, ewentualnie read-only dla Node-RED/dashboardu
- ACL w `mosquitto.conf`: HA może `homeassistant/#` i `zigbee2mqtt/#`, Z2M może tylko swój prefix
- VLAN IoT, brak NAT do internetu (zdalne MQTT przez VPN)
- Monitoring drugiego hosta - HA nie krzyknie tak czytelnie, jak gdyby ZHA padło

**Realny koszt:** 30-60 minut konfigu MQTT + TLS + ACL + reverse proxy/monitoringu. Plus utrzymanie drugiego hosta (update Pi OS, backup).

## Wiele koordynatorów - tylko z osobnym serwerem ma to sens

Kiedy potrzebujesz więcej niż jednego koordynatora:

- Dom z piętrami albo z ogrodem - jeden koordynator gubi pakiety na końcu mesha
- Mieszkanie + warsztat / garaż / piwnica - dwie sieci na innych kanałach, mniej kolizji 2.4 GHz
- >80 urządzeń - mesh staje się kruchy, dzielenie zwiększa stabilność
- Sieć dev/test obok produkcyjnej, żeby nie mergować nowego czujnika do główniej sieci od razu

ZHA wspiera multi-coordinator od 2024, ale to wciąż mniej dojrzałe. Z2M w trybie addon = sztywno jedna instancja na host. Z2M na osobnym serwerze = N instancji w `docker-compose.yml`, każda z własnym `mqtt.base_topic` i koordynatorem.

```yaml
services:
  z2m-ground:
    image: koenkk/zigbee2mqtt:latest
    volumes: [./data-ground:/app/data]
    environment:
      ZIGBEE2MQTT_CONFIG_MQTT_BASE_TOPIC: zigbee2mqtt/ground
      ZIGBEE2MQTT_CONFIG_MQTT_SERVER: mqtts://mqtt.home.lan:8883
      ZIGBEE2MQTT_CONFIG_SERIAL_PORT: tcp://10.0.20.11:6638  # SLZB-06 PoE #1
    ports: ["8080:8080"]

  z2m-upper:
    image: koenkk/zigbee2mqtt:latest
    volumes: [./data-upper:/app/data]
    environment:
      ZIGBEE2MQTT_CONFIG_MQTT_BASE_TOPIC: zigbee2mqtt/upper
      ZIGBEE2MQTT_CONFIG_MQTT_SERVER: mqtts://mqtt.home.lan:8883
      ZIGBEE2MQTT_CONFIG_SERIAL_PORT: tcp://10.0.20.12:6638  # SLZB-06 PoE #2
    ports: ["8081:8080"]
```

Każda instancja na innym kanale Zigbee (np. 11, 20, 25 - odsunięte od kanałów Wi-Fi 1, 6, 11). Trzy frontendy Z2M na trzech portach (8080/8081/8082). Wszystkie publikują do tego samego MQTT brokera, HA odbiera urządzenia jako trzy oddzielne źródła z czytelnym prefiksem („to zalanie z `zigbee2mqtt/upper` = piętro").

Z koordynatorami PoE multi-coord przestaje być inżynierską kombinacją z USB hubami i ekstenderami. Trzy SLZB-06 w switchu PoE, trzy lokalizacje, jeden host Z2M obsługujący wszystkie instancje.

## Bezpieczeństwo i powierzchnia ataku

Trzy archetypy = trzy poziomy złożoności obrony.

**ZHA.** Powierzchnia = HA (web UI, supervisor, addony). Brak MQTT = jeden mniej proces do hardenowania. Najprościej.

**Z2M addon.** Dodaje Mosquitto. Domyślnie słucha na `localhost:1883` bez auth. To OK dopóki nie zaczniesz wystawiać MQTT poza lokalny stos. W momencie gdy Node-RED na sąsiednim Pi ma czytać - auth/ACL natychmiast.

**Z2M osobno.** MQTT idzie przez sieć, więc:

- **TLS obowiązkowy** (port 8883)
- **User/hasło per klient** (HA, Z2M, dashboard read-only osobno)
- **ACL** w `mosquitto.conf`:

```conf
listener 8883
cafile     /mosquitto/certs/ca.crt
certfile   /mosquitto/certs/server.crt
keyfile    /mosquitto/certs/server.key
require_certificate false

password_file /mosquitto/config/passwd
acl_file      /mosquitto/config/acl

# acl_file:
user homeassistant
topic readwrite homeassistant/#
topic read zigbee2mqtt/#

user z2m-ground
topic readwrite zigbee2mqtt/ground/#

user z2m-upper
topic readwrite zigbee2mqtt/upper/#
```

- **Sieć**: VLAN IoT dla Z2M hostów, VLAN core dla HA, firewall pozwala 8883 między nimi, brak NAT do internetu (zdalne MQTT - wyłącznie VPN)

**Klasyczny błąd, którego nie popełnij:** port forward MQTT z routera do internetu „żeby telefon gadał z brokerem". To natychmiastowa kompromitacja - botnety skanują 1883/8883 stale. Zamiast tego: VPN (Wireguard) do domowej sieci, MQTT pozostaje wewnętrzne.

**Plus dla osobnego serwera (security-wise):** koordynator z dostępem do sieci Zigbee jest fizycznie odseparowany od HA. Jeśli HA zostanie zhakowane (luka w jakimś addonie z HACS, którego nikt nie audytuje), atakujący nie ma bezpośredniego dostępu do koordynatora - musi przejść przez MQTT broker z auth + ACL. Dla ZHA i Z2M-addon zhakowane HA = zhakowany koordynator, koniec.

## Decyzja w 30 sekund

- **Wybierz ZHA jeśli**: ≤30 urządzeń, jeden koordynator, nie chcesz dotykać MQTT, lubisz HA UI, pierwsza próba
- **Wybierz Z2M w HA jeśli**: 30-100 urządzeń, kupujesz nowości, chcesz mapy mesha i OTA, nie chcesz multi-host
- **Wybierz Z2M na osobnym serwerze jeśli**: ≥80 urządzeń lub ≥2 koordynatory, izolacja awarii ma znaczenie, masz VLAN-y, masz Pi w szufladzie, lub masz koordynator PoE i chcesz coś z nim zrobić

W razie wątpliwości - **zacznij od Z2M w HA**. Migracja Z2M-addon → Z2M-osobny serwer = skopiowanie `database.db` + zmiana adresu brokera. ZHA → Z2M to re-pair większości urządzeń (zaplanuj na weekend).

## Pułapki migracji, których ludzie nie liczą

- **ZHA → Z2M**: w teorii backup koordynatora pomaga, w praktyce większość urządzeń trzeba sparować ponownie. Plan na weekend, nie 2h
- **Z2M-addon → Z2M-osobny**: kopiujesz `data/database.db` + `data/coordinator_backup.json`, przenosisz koordynator (USB albo zmieniasz IP w `serial.port` dla PoE), ustawiasz `mqtt.server` na nowy broker. Wszystkie urządzenia żyją, brak re-pair
- **Backup koordynatora** (Z2M tworzy automatycznie w `data/coordinator_backup.json`): pozwala odtworzyć sieć po padzie hosta - flashujesz nowy koordynator z backupu, urządzenia reconectują same, bez chodzenia po domu i wciskania przycisków
- **Pre-flight przed migracją**: zrób screenshoty `/list devices` w Z2M frontend, miej długopis i listę pomieszczeń (przyda się jeśli jednak parę urządzeń trzeba będzie re-pairować)

## Co bym zrobił dziś

Mój pick na 2026: **Z2M + Mosquitto na osobnym Pi 5, MQTT TLS do HA na NUC, koordynator SLZB-06 PoE w środku mieszkania**. Jedna instancja Z2M, ~50 urządzeń, dla mojego mieszkania wystarczy. Gdybym miał dom z dwoma piętrami albo warsztat na działce - drugi SLZB-06 w drugiej lokalizacji, druga instancja Z2M w tym samym `docker-compose.yml`, drugi `base_topic`. Bez przebudowy.

Anty-pattern: 10 urządzeń + osobny serwer + TLS + ACL = overengineering, marnujesz weekendy. ZHA, koniec tematu, wracaj do robienia automatyzacji.

Po więcej z serii smart home: [wybór protokołu](/pl/blog/zwave-zigbee-wifi-matter/), [start z HA](/pl/blog/home-assistant-2026/), [HACS i custom integracje](/pl/blog/hacs-w-home-assistant-os/).
