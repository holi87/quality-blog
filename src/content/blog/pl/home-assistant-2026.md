---
title: "Jak zacząć z Home Assistant w 2026 roku"
description: "Kompletny przewodnik dla początkujących — od wyboru sprzętu po pierwszą automatyzację."
date: 2026-04-12
tags: ["smart-home", "home-assistant"]
lang: pl
readingTime: 5
---

## Czym jest Home Assistant?

Home Assistant to otwartoźródłowa platforma do automatyzacji domu. Pozwala zarządzać wszystkimi urządzeniami smart home z jednego miejsca — niezależnie od producenta.

## Od czego zacząć?

### 1. Wybierz sprzęt

Najprostszy start to **Home Assistant Green** — gotowe urządzenie, które wystarczy podłączyć do routera. Alternatywnie możesz zainstalować HA na Raspberry Pi 4/5 lub jako maszynę wirtualną.

### 2. Pierwsza integracja

Po uruchomieniu HA automatycznie wykryje urządzenia w Twojej sieci. Zacznij od czegoś prostego — na przykład inteligentnej żarówki Zigbee.

### 3. Pierwsza automatyzacja

```yaml
automation:
  - alias: "Wyłącz światła o północy"
    trigger:
      - platform: time
        at: "00:00:00"
    action:
      - service: light.turn_off
        target:
          entity_id: all
```

## Podsumowanie

Home Assistant w 2026 roku jest łatwiejszy niż kiedykolwiek. Społeczność jest ogromna, integracji jest ponad 2000, a start zajmuje dosłownie kilkanaście minut.
