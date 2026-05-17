---
title: "Zigbee in Home Assistant 2026: ZHA, Z2M Add-on, or Z2M on a Separate Server?"
description: "Three real-world Zigbee deployments in HA: built-in ZHA, Zigbee2MQTT as an add-on, and Z2M+MQTT on a separate host. Failure isolation, MQTT attack surface, multi-coordinator, PoE coordinators."
date: 2026-05-11
tags: ["smart-home", "home-assistant", "zigbee", "zigbee2mqtt", "zha", "mqtt"]
lang: en
readingTime: 10
author: GH
---

In the [post from April 21, 2026](/en/blog/zwave-zigbee-wifi-matter/) we picked the protocol: Zigbee. Cheap, mature, mesh, hundreds of devices, battery sensors that last years. Choosing the protocol is one decision. But how to actually run it inside Home Assistant - that's three different decisions, and most online tutorials treat them as cosmetic.

They aren't cosmetic. The choice between **ZHA**, **Zigbee2MQTT as an HA add-on**, and **Z2M+MQTT on a separate server** affects failure isolation (does an HA update kill Zigbee?), attack surface (how many processes do you have to harden?), how fast new devices get supported, and whether you can even run multiple coordinators for a larger house or a workshop.

This post compares the three archetypes from two angles: someone who already runs HA with 5–20 sensors and is deciding whether to stick with the default ZHA or migrate, and someone building from scratch. In 2026 a new player changes the calculus: **PoE coordinators** (e.g. SMLight SLZB-06) - Zigbee over an Ethernet cable, no USB needed.

## TL;DR - three options compared

| Trait | ZHA | Z2M add-on | Z2M separate server |
|---|---|---|---|
| Setup time | 5 min | 15 min | 45–60 min |
| New device support | Slow (quarters) | Fastest (weeks) | Fastest (weeks) |
| Zigbee frontend | HA UI | Z2M (mesh map, OTA, clusters) | Z2M (mesh map, OTA, clusters) |
| OTA | OK | Very good | Very good |
| Multiple coordinators | Theoretically yes | No | Yes (N instances) |
| Isolation from HA crash | None | None | Full |
| Attack surface | Smallest | + Mosquitto on localhost | + MQTT over network |
| Backup/migration | Hard | Single file (`database.db`) | Single file + broker address |
| Update cadence | With HA core | Weekly | Weekly |
| Learning curve | Flat | Medium | Steep at first |

## ZHA - least friction, least flexibility

ZHA is HA's built-in integration. Underneath sits `zigpy` plus an adapter (`zigpy-znp` for Texas Instruments, `bellows` for EmberZNet). No MQTT, no separate process - USB coordinator (or TCP to a PoE coordinator) → ZHA → HA entities.

**Pros:**
- Zero MQTT setup - no Mosquitto in the stack
- Single diagnostic surface: HA crashes = everything crashes, you only have one place to check
- Works with both USB and network coordinators (`socket://192.168.x.y:6638` for SLZB-06)
- Lives inside HA UI like any other integration, no second frontend to learn

**Cons:**
- Slower new-device support. If Tuya ships a sensor today with a non-standard cluster implementation, Z2M gets a handler within a week (community PR → release); ZHA waits for an HA core cycle or a quirk in `zha-device-handlers`. Real-world 2026 difference: Z2M supports ~4500+ models, ZHA closer to 3000
- OTA works but the firmware image catalog is smaller
- Multi-coordinator: added in 2024, but in practice rarely used and less mature than running multiple Z2M instances
- No real-time mesh visualization (only a static device list)

**Signal this is the right one:** ≤30 devices, one coordinator, you don't want to touch MQTT, first attempt at smart home, you like everything in one UI.

## Z2M as an HA add-on - the compromise most people pick

The most popular setup: in HA OS you install two add-ons - **Mosquitto broker** and **Zigbee2MQTT**. On HA Container/Supervised you run two containers next to HA. Architecture:

```
coordinator → Z2M → Mosquitto (localhost:1883) → MQTT discovery → HA entities
```

Z2M gets a `zigbee-herdsman` update every week with new device handlers. It has its own frontend at `/zigbee2mqtt/` - real-time mesh map, OTA with a button, manual cluster editing for unusual devices, raw packet view for debugging.

**Pros:**
- Fastest new-device support - this is the stack that gets handlers first
- The Z2M frontend is in a different league from "sensors in HA UI" - the map shows that the Aqara in the living room routes through the plug in the hallway, so if you remove the plug, the sensor will lose connectivity
- One-click OTA - Z2M pulls images from the `Koenkk/zigbee-OTA` database
- Backup = `data/database.db` + `coordinator_backup.json`. Two files, done
- Mosquitto on `localhost:1883` without auth by default - within one host that's fine, attack surface is negligible

**Cons:**
- HA restart = full restart (the add-on lives on the same host)
- HA OS crash = Zigbee crash. Single point of failure for the whole smart home
- Strictly one Z2M instance. Multi-coordinator requires a separate server
- "No-password Mosquitto" stops being OK the moment you want Node-RED on another Pi to read MQTT - then auth/ACL becomes mandatory

**Signal this is the right one:** 30–100 devices, you buy new gear (latest Tuya/Aqara/Sonoff), you want the mesh map and OTA, but you don't want to maintain two hosts.

## Z2M + MQTT on a separate server - separation of concerns

A different architecture:

```
HA (NUC)        ←TLS MQTT 8883→        Mosquitto + Z2M (Pi 5)        ←USB / TCP→        coordinator
```

HA and Z2M are two separate hosts. The MQTT broker usually sits on the same host as Z2M (shorter hop, fewer network failure modes for device control itself). HA connects over the network with TLS.

**Why people do this:**

- **Failure isolation.** HA update → HA restart → automations pause. But Z2M is alive, still reporting device state through MQTT with `retain: true`. After HA starts, state is immediately available - no "unknown" period in the UI, no lost events for change-driven automations
- **Edge deployment.** The coordinator should sit near the center of the mesh. HA doesn't have to. A 5m USB cable is a clumsy workaround; a Pi 5 with the coordinator placed in the middle of the house, HA in the basement next to the rack - works
- **Multi-coordinator for real** (next section)
- **Reuse old hardware.** A Pi 4 sitting in a drawer beats buying another NUC just for HA
- **PoE coordinators change the calculus.** An SLZB-06 plugged into a PoE switch = the coordinator is a network endpoint, not a peripheral of any specific host. Z2M points to `tcp://10.0.20.11:6638`, the Z2M host can be anywhere. That solves 90% of the distance and USB problems

**What's added in setup:**

- MQTT over network ⇒ TLS (port 8883), self-signed cert or a home CA
- Per-client credentials: one user for HA, one per Z2M instance, optionally read-only for Node-RED/dashboards
- ACL in `mosquitto.conf`: HA can read `homeassistant/#` and `zigbee2mqtt/#`, Z2M can only write to its own prefix
- IoT VLAN, no NAT to the internet (remote MQTT via VPN)
- Monitoring of the second host - HA won't shout as loudly as it would if a built-in ZHA broke

**Real cost:** 30–60 minutes of MQTT + TLS + ACL + reverse proxy/monitoring config. Plus maintaining a second host (Pi OS updates, backups).

## Multiple coordinators - only the separate server makes sense

When you need more than one coordinator:

- A multi-floor house or one with a garden - a single coordinator drops packets at the edge of the mesh
- Apartment + workshop / garage / basement - two networks on different channels mean fewer 2.4 GHz collisions
- >80 devices - the mesh becomes fragile, splitting it improves stability
- A dev/test network alongside production, so you don't merge a new sensor into your main mesh on day one

ZHA supports multi-coordinator since 2024, but it's still less mature. Z2M as an add-on = strictly one instance per host. Z2M on a separate server = N instances in `docker-compose.yml`, each with its own `mqtt.base_topic` and coordinator.

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

Each instance on a different Zigbee channel (e.g. 11, 20, 25 - kept away from Wi-Fi channels 1, 6, 11). Three Z2M frontends on three ports (8080/8081/8082). All publish to the same MQTT broker; HA picks up devices from three separate sources with a clear prefix ("this water leak came from `zigbee2mqtt/upper` = upstairs").

With PoE coordinators, multi-coord stops being engineering gymnastics with USB hubs and extenders. Three SLZB-06s in a PoE switch, three locations, one Z2M host running all three instances.

## Security and attack surface

Three archetypes = three levels of defense complexity.

**ZHA.** Surface = HA (web UI, supervisor, add-ons). No MQTT = one less process to harden. Simplest.

**Z2M add-on.** Adds Mosquitto. Listens on `localhost:1883` without auth by default. That's fine until you start exposing MQTT outside the local stack. The moment Node-RED on a neighboring Pi needs to read it - auth/ACL becomes mandatory.

**Z2M separate.** MQTT travels over the network, so:

- **TLS mandatory** (port 8883)
- **Per-client credentials** (HA, Z2M, dashboard read-only as separate users)
- **ACL** in `mosquitto.conf`:

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

- **Network**: IoT VLAN for Z2M hosts, core VLAN for HA, firewall allows 8883 between them, no NAT to the internet (remote MQTT - VPN only)

**The classic mistake to avoid:** forwarding the MQTT port from the router to the internet "so the phone can talk to the broker." That's instant compromise - botnets continuously scan 1883/8883. Use a VPN (Wireguard) into your home network instead and keep MQTT internal.

**Bonus for the separate server (security-wise):** the coordinator with access to the Zigbee mesh is physically isolated from HA. If HA gets compromised (a vulnerability in some HACS add-on nobody audits), the attacker doesn't have direct access to the coordinator - they have to go through the MQTT broker with auth + ACL. With ZHA and Z2M-add-on, compromised HA = compromised coordinator, end of story.

## Decision in 30 seconds

- **Pick ZHA if**: ≤30 devices, one coordinator, you don't want to touch MQTT, you like the HA UI, first attempt
- **Pick Z2M in HA if**: 30–100 devices, you buy new gear, you want the mesh map and OTA, you don't want a multi-host setup
- **Pick Z2M on a separate server if**: ≥80 devices or ≥2 coordinators, failure isolation matters, you have VLANs, you have a Pi in a drawer, or you have a PoE coordinator and want to do something with it

Unsure → **start with Z2M in HA**. Migrating Z2M-add-on → Z2M-separate is just copying `database.db` and changing the broker address. ZHA → Z2M is re-pairing most devices (block out a weekend).

## Migration traps people don't count

- **ZHA → Z2M**: in theory the coordinator backup helps, in practice most devices need re-pairing. Plan a weekend, not 2 hours
- **Z2M-add-on → Z2M-separate**: copy `data/database.db` + `data/coordinator_backup.json`, move the coordinator (USB plug or change the IP in `serial.port` for PoE), set `mqtt.server` to the new broker. All devices stay alive, no re-pairing
- **Coordinator backup** (Z2M creates it automatically in `data/coordinator_backup.json`): lets you rebuild the network after a host failure - flash a new coordinator from the backup, devices reconnect on their own, no walking around the house pressing buttons
- **Pre-flight before migration**: take screenshots of `/list devices` in Z2M frontend, keep a notebook with room labels (useful if a few devices end up needing re-pairing anyway)

## What I'd do today

My pick for 2026: **Z2M + Mosquitto on a dedicated Pi 5, MQTT over TLS to HA on a NUC, an SLZB-06 PoE coordinator placed in the middle of the apartment**. One Z2M instance, ~50 devices, plenty for my flat. If I had a two-story house or a workshop on a separate plot - a second SLZB-06 in the second location, a second Z2M instance in the same `docker-compose.yml`, a second `base_topic`. No re-architecture.

Anti-pattern: 10 devices + a separate server + TLS + ACL = overengineering, you're burning weekends. ZHA, end of story, get back to writing automations.

More from the smart home series: [picking the protocol](/en/blog/zwave-zigbee-wifi-matter/), [getting started with HA](/en/blog/home-assistant-2026/), [HACS and custom integrations](/en/blog/hacs-in-home-assistant-os/).
