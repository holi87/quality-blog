---
title: "Backup Power for Your Smart Home: UPS, Power and Internet Outages - What Survives"
description: "What fails in a smart home when the power goes out, sizing a UPS for the real load, NUT integration with Home Assistant, LTE failover and a resilience test - with yaml."
date: 2026-08-21
tags: ["smart-home", "home-assistant", "ups", "reliability", "power"]
lang: en
readingTime: 19
author: GH
---

At eleven in the evening the power goes out across the neighbourhood. An ordinary house simply goes dark. A smart house gets dumber than an ordinary one: the wall button won't turn on the light, because it talked to a relay through a server that just died, the gate ignores your phone, and the leak sensor under the dishwasher reports into the void, because there is no network and nobody left to listen. I went through a few evenings like that before I started treating a power outage as a test scenario rather than an act of fate. I'll show what fails and in what order, how to size a UPS for the real load of a smart home, how to wire it into Home Assistant through NUT, and how to verify the whole thing before the first real outage verifies it for you.

## Anatomy of an outage: what dies with the power

The sequence is always the same, but hardly anyone writes it down. First the Home Assistant server dies - instantly and hard, which along the way can corrupt the history database or, in the worse variant, the SD card. The router, switch and access point die with it, so even if the server somehow survived, it would have nobody to talk to. The Zigbee coordinator hangs off the server's USB port or off a separate device fed from the same power strip, so it goes down in the same second.

Then it gets more interesting. Mains-powered devices - bulbs, smart plugs, roller shutters, in-wall relays - go dark for obvious reasons. Battery sensors formally keep working, but in a Zigbee network it's precisely the mains-powered devices that act as routers relaying packets. When they vanish, the mesh collapses for the battery devices too: a door sensor has power and has radio, but nobody left to transmit through. The domino effect stretches beyond the outage itself - after power returns, some sensors keep hunting for a new path through the network for many minutes. I covered this layer in more depth in the piece on [Zigbee and running it on a separate server](/en/blog/zigbee-home-assistant-zha-z2m-separate-server/); here one sentence is enough: a mesh network is exactly as resilient as the power supply of its routers.

At the end of this chain sit the automations. The heating stays in whatever mode the outage caught it in. Schedules simply don't fire, the irrigation timer evaporates, and the evening scene never finishes. The house doesn't just stop being smart - it freezes mid-gesture and will stay frozen in that gesture until someone wakes it up and cleans up after it.

## Priorities: what must keep working and what can wait

Before you buy any hardware, make a list. You can't keep the whole house running and there's no point trying - what you can keep running is its nervous system. My "must work" list has four entries:

- **The network:** router, switch and one access point. Without the network the server is useless and the phone will never receive a single notification.
- **The Home Assistant server** together with the Zigbee coordinator. This is what decides whether the house even knows something is happening, and whether it manages to say so.
- **Safety sensors:** smoke, carbon monoxide, water leak, door and window contact. The battery-powered ones keep measuring on their own, but their reports need somewhere to land.
- **The notification path:** the whole route from sensor to phone, including the internet, which we'll get to shortly.

Everything else can wait: decorative lighting, speakers, the TV, the coffee machine, roller shutters, voice assistants. An hour without music kills nobody; an hour in which a leak sensor reports to a dead server can cost you a floor renovation.

One fundamental note about smoke and carbon monoxide detectors: they should be autonomous, meaning they scream on their own, independent of any system. The smart home is the second alarm channel - a notification, a siren, flashing lights - never the only one. A power outage is the honesty test for this principle: if your only smoke alarm dies together with your Wi-Fi, you have a problem far more serious than lost convenience.

## Sizing the UPS: count watts, not fear

The first step is measurement, not a catalogue. Put the strip with the router, switch and server on an energy-monitoring plug and read the real load after a few days. The typical result is a surprise: a mini PC running Home Assistant, the ISP's router and a switch together often draw 30-60 W - roughly one old incandescent bulb. People buy units picked by gut feeling for kilowatt loads, and then use them to sustain equipment drawing a few percent of the rated capacity.

The second step is runtime arithmetic. Simplified: battery energy in watt-hours divided by the load in watts, multiplied by conversion efficiency (realistically count on 80-85 percent). A battery holding 100 Wh at a 40 W load gives you around two hours - not the five minutes from the spec table, because the table describes full load. Watch the units while you're at it: UPS capacity stated in VA is not the same as watts; at the typical power factor of 0.6-0.7, a "650 VA" unit really delivers about 400-450 W. At our loads that's an enormous margin anyway, but it pays to understand what you're buying. The practical conclusion: for a smart home, a small UPS with a decent battery beats a powerful unit whose capacity you'll never use and whose own idle draw will eat part of your runtime.

The third topic is the shape of the output voltage. Cheaper units generate a stepped approximation of a sine wave when on battery. Switching power supplies in small network gear usually tolerate it, but supplies with active power factor correction - typical in servers and NAS boxes - can hum, overheat or shut down at the worst possible moment on a stepped waveform. If you're only sustaining a router and a mini PC, you'll live with the approximation; if a NAS or a more serious server hangs off the same UPS, pay the extra for pure sine. As for topology: a line-interactive unit is entirely sufficient at home, and double conversion (the "online" class) is purchase cost plus constant self-consumption without a visible benefit at this scale.

The fourth choice: one UPS or two. If the server sits next to the network cabinet, a single unit covers everything and simplifies the cabling. If the server lives a floor up, two smaller units are a more honest solution than running extension cords through half the house. For the network cabinet alone, a 12 V DC buffer supply is an interesting alternative: it sustains the router and modem without a double voltage conversion, so it wastes less and takes up less space. While you're tidying the cabinet, it's also worth considering [moving IoT devices onto a separate network](/en/blog/iot-on-separate-network-vlan-smart-home/) - a mass restart of everything at once is the moment when network hygiene pays off the most. And remember one thing: the battery is a consumable. After three, at most five years it holds a fraction of its nominal capacity and needs replacing, regardless of how rarely it worked.

## NUT: Home Assistant knows it's on battery

A UPS connected by the power cable alone is half the job - the house is sustained but doesn't know it. A USB cable between the UPS and the server plus NUT (Network UPS Tools) turn the unit into a data source: the NUT integration in Home Assistant exposes power status, charge level, estimated runtime and current load. On Home Assistant OS a NUT server add-on is all you need; in a container-based install, one more container next to the rest of your services.

From this data I build two automations. The first one reacts to the switch to battery: it sends a notification (the network is still up, so it will arrive) and turns off everything that needlessly drains the battery. One practical note: the exact status value depends on the driver and model - before you put it into a trigger, check in the developer tools what your unit actually reports.

```yaml
automation:
  - alias: "UPS - switched to battery"
    triggers:
      - trigger: state
        entity_id: sensor.ups_status
        to: "OB DISCHRG"
    actions:
      - action: notify.mobile_app_phone_gh
        data:
          title: "Power outage"
          message: >
            The house is running on battery.
            Battery level: {{ states('sensor.ups_battery_charge') }}%.
      - action: switch.turn_off
        target:
          entity_id: switch.non_critical_strip
```

The second automation is a clean server shutdown before the battery runs out. The Home Assistant database does not enjoy hard cuts, and an SD card can refuse to boot at all after one. Pick the threshold so that after the server shuts down, the UPS still carries the network alone for a dozen or so minutes - notifications from battery sensors will stop flowing at that point, but the router gets to deliver whatever is still in flight:

```yaml
  - alias: "UPS - clean server shutdown"
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

The `hassio.host_shutdown` action applies to Home Assistant OS; in a container install the same effect comes from a script on the host triggered over MQTT or SSH. Independently of the automation, leave NUT's own built-in mechanism enabled - the one that shuts the host down when the UPS reports a critical battery level. It's the second line of defence for the day the automation doesn't fire for whatever reason.

> A UPS doesn't buy you an evening of normal life - it buys you fifteen minutes in which the house gets to say what's happening and lie down cleanly.

## Backup internet: the notification needs a way out

A wide power outage often takes the internet down with it - and the UPS in your cabinet can't help, because the equipment failing is on the operator's side. Here geography is kind or it isn't: fibre infrastructure usually sits in facilities with their own backup power and survives a local outage, while networks relying on street-level amplifiers die together with the street. You won't guess which group you belong to until you check - or until the first outage checks for you.

The answer is a second uplink: an LTE modem with a SIM card, plugged into the same UPS as the router. If your router supports two uplinks, configure failover - traffic moves to LTE automatically when the primary link dies and moves back once it recovers. Notifications from the Home Assistant companion app travel over the internet, so the moment failover kicks in they start arriving again; from the phone's perspective nothing changed. Two traps from practice: a prepaid SIM with no periodic activity can silently expire, and some tariffs block traffic entirely after the data cap instead of throttling it. Once a quarter, pull the primary uplink cable out of the router and check how many seconds it takes for traffic to move over to LTE - it's a five-minute test.

If you want to be bulletproof, add a channel fully independent of your home infrastructure - for example an SMS gateway on a separate device with its own SIM card, sending a message for top-shelf events only: leak, smoke, carbon monoxide. That's a league up and most homes don't need it, but the option exists.

## Power restoration: everything comes back, but in what state

The return of power is the second half of the outage, and in my experience it's the half that breaks more things. Start with the server: the BIOS must have restore-on-AC-power enabled, otherwise the machine will lie there switched off until someone physically presses the button - the dumbest possible reason for a dead smart home lasting half a day. The boot order usually sorts itself out: the router and switch come up in under a minute, the server in a few, and Home Assistant retries connections to services that aren't up yet. Usually - but individual integrations like to come up in an error state, so after your first test, verify that everything loaded without a manual reload.

The second matter is MQTT and the retain flag. A message published with retain stays in the broker and is handed to anyone who subscribes to the topic - thanks to that, Home Assistant sees the last known states immediately after a restart, instead of showing entities as unavailable until each device speaks up on its own. The catch: these are states from before the outage, not necessarily current ones. So alongside retain, configure device availability reporting - the system has to distinguish "I know the sensor is alive" from "I remember what it said yesterday".

The third matter is device behaviour when power is applied. Most bulbs and plugs have a configurable option: turn on, stay off, or restore the previous state - and the factory default is often "turn on at full brightness". Hence the classic of the genre: power returns at three in the morning and the whole house lights up like a Christmas tree. Walk through every device that supports it: bedrooms and kids' rooms set to "off", hallways to "previous state", heating appliances always to "off".

That leaves the last and least obvious trap: everything came back, but in the wrong state. Automations interrupted halfway will not finish themselves - the heating stayed in manual mode, the roller shutter stopped at half height, the irrigation timer is gone. For this I keep an automation triggered on Home Assistant start: it walks through the key entities, brings them to a safe state and sends a report along the lines of "the house is back after a power outage, heating returned to schedule, check the shutters". Five minutes of writing, and it turns the sneakiest phase of an outage into a single message to read.

## Test it before it has to work

Everything above is a hypothesis until you run the test. Warn the household, flip the main breaker and start the clock. Don't simulate the outage by pulling the UPS plug from the wall - that only tests the UPS. The breaker tests the whole house at once: together with the Zigbee routers, the bulbs, and that one device nobody remembered was plugged in outside the protected strip. The checklist:

- **Outage notification:** did it reach the phone, and how many seconds after the breaker went down.
- **Runtime:** how many minutes the network and server really last; compare against your watts-and-watt-hours calculation.
- **Clean shutdown:** did the server shut down at the configured threshold, before the UPS drew its last breath.
- **Server recovery:** did it boot on its own once the breaker came back, and did all integrations load without manual help.
- **The Zigbee network:** how many minutes until battery sensors resumed reporting, and which ones needed waking by hand.
- **Device states:** which lights came up on, what was left in the wrong mode, what's missing from the startup report.
- **Backup internet:** did failover to LTE work, and did notifications flow during the test.

Repeat the test every six months and after every larger infrastructure change. A UPS battery degrades silently, and the test is the only moment you see it - the fifteen minutes of runtime that quietly became four is something you'd rather discover on a Saturday afternoon than during a real outage at night. One last thing: a hard power cut is the most common killer of SD cards and databases, which is why the second pillar of resilience is a [backup and recovery strategy](/en/blog/home-assistant-backup-recovery-strategy/). The UPS protects you from most hard cuts; the backup protects you from the one that happens anyway.

## Summary

Backup power for a smart home is four decisions, not one. First, priorities: you sustain the nervous system - network, server, Zigbee coordinator and the notification path - not the whole house. Second, sizing: the real load of that list is often under 50 W, so a small UPS with a decent battery buys an hour or two of calm for reasonable money. Third, awareness: NUT turns the UPS into a sensor, and two automations - a notification on switching to battery and a clean shutdown at a low charge level - deliver ninety percent of the value of the whole project. Fourth, the return: restore-on-AC in the BIOS, retain in MQTT, power-on behaviour set deliberately on every device, and a cleanup automation that reconciles states after a restart. And then the breaker: one test every six months turns hope into knowledge. A house that survives a power outage with dignity is built in a single afternoon - provided you do it before the outage, not after.
