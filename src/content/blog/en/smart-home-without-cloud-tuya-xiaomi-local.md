---
title: "Smart Home Without the Cloud: Free Your Tuya and Xiaomi Devices From Vendor Servers"
description: "How to cut Tuya and Xiaomi devices off vendor clouds: local control in Home Assistant, your own Zigbee coordinator, miio tokens and a phased migration plan."
date: 2026-08-24
tags: ["smart-home", "home-assistant", "tuya", "xiaomi", "local-control", "privacy"]
lang: en
readingTime: 18
author: GH
---

You tap a button in an app, and the command to a light bulb hanging three metres away travels through the vendor's server and comes back. That is how many Tuya devices and part of the Xiaomi ecosystem work out of the box, although the exact architecture depends on the model. Latency is only the most visible symptom of a deeper problem: a function that may stop working when your connection or the vendor's server goes down. I'll show you how to reclaim local control over this hardware - what can be freed from the cloud entirely, what only partially, and what is best replaced at the next opportunity.

## The vendor cloud is debt, not a free feature

Let's start with latency, because you feel it every day. A command from your phone to a bulb in the same room can take the route: phone, router, a vendor server in another part of the world, back through your router to the bulb. On a good day that's a few hundred milliseconds; on a bad one it's two seconds or nothing at all. For manual control this is annoying; for automations that are supposed to feel instant - a hallway light on a motion sensor, blinds on a dusk sensor - it's disqualifying. No amount of tuning will shorten a loop that physically runs halfway around the globe.

The second instalment of the debt is privacy. A device that reports to the vendor's server also reports the rhythm of your home: when you sleep, when you leave, when you come back, which rooms are used and at what hours. The telemetry is usually described in the privacy policy in generalities, and you only verify its real scope by watching the network traffic yourself. You don't even have to assume bad intent - it's enough that the data leaks in a breach or changes hands together with the whole company.

The third instalment hurts the most: shutdown risk. The last decade of smart home history is a graveyard of services - vendors went under, got acquired, or simply decided that keeping servers alive for older products wasn't worth it, and physically healthy devices turned into plastic overnight. I don't need to point fingers at specific brands; the pattern repeats often enough that it's safer to assume every consumer cloud will eventually go dark than to bet that yours will be the exception. And there are quieter variants of the same risk: terms-of-service changes, yesterday's free features moved behind a subscription, third-party integrations switched off by an update.

And the fourth, mundane instalment: no internet means a dead house. An outage at your provider, an overloaded vendor server on Black Friday - and the switch on the wall does nothing, even though the bulb and the relay are both healthy and two metres apart. All four instalments together add up to vendor lock-in: it's the vendor, not you, who decides how long and on what terms your home keeps working.

> A device that needs a server on another continent to turn on a light isn't yours - it's on loan, on terms the vendor can change tomorrow.

## Three incarnations of the same device

Before you start liberating anything, it pays to draw the map, because the same product is sold in three incarnations with completely different room for manoeuvre:

| Incarnation | How it works | Room for manoeuvre |
| --- | --- | --- |
| Wi-Fi with cloud | The device joins your router and talks directly to the vendor's server | Local integrations, reflashing or replacement - depending on the model |
| Zigbee behind a vendor gateway | The device speaks open Zigbee, but the gateway translates everything into cloud traffic | Swap the gateway for your own coordinator - the cloud disappears entirely |
| Zigbee with your own coordinator | The device talks directly to Home Assistant | You're already home - there is no cloud |

This map sets the strategy for the whole article. The hardest case is Wi-Fi with cloud, because there the vendor's protocol lives inside the device itself. The easiest is Zigbee behind a gateway: the sensor or button is local by nature, and the cloud is bolted on by a middleman you can simply retire to a drawer. So before touching any integrations, check which incarnation your hardware actually is - the box art can mislead, and the same smart plug often exists in Wi-Fi and Zigbee variants under nearly identical names.

## Tuya over Wi-Fi: a local bridge instead of a server

Many Tuya Wi-Fi devices expose a local protocol protected by a device key, but support depends on protocol version, product category, and exact model. Do not infer compatibility from the Tuya logo - check the chosen integration's database before buying. This is what community integrations in the Local Tuya family build on, usually installed through [HACS](/en/blog/hacs-in-home-assistant-os/). A common setup links the mobile-app account to the Tuya developer platform and retrieves local keys. The procedure and any cloud requirement for initial pairing change over time, so follow the integration's current documentation.

What works well: switches, plugs, lighting, blinds, heating controllers - mains-powered devices with a simple state model. Once configured, commands travel across your local network in tens of milliseconds, and you can uninstall the vendor's app. What's off the table: devices designed to talk exclusively to the cloud - some cameras, vacuums and screen-equipped gear expose no usable local interface at all, and no integration can work around that. You should also know that the local key can change after a factory reset or re-pairing with the app - then it's back to the developer platform for a fresh key.

An honest word about the maintenance cost: this is a bridge, not a destination. After bigger Home Assistant upgrades it's worth checking that the community integration is still alive; after a device reset you refresh the keys; a new device from the same product line can arrive with a newer protocol version the integration doesn't understand yet. My own bridge ran for two years and was hands-off most of the time - but each of its few failures meant an evening of digging through configuration that simply doesn't exist with Zigbee. Treat Local Tuya as a way to rescue the hardware you already own, not as an invitation to buy more Wi-Fi devices.

## Zigbee behind a vendor gateway: replace the translator, not the devices

This is the friendliest scenario on the whole map. If your Tuya or Xiaomi sensors, buttons and plugs speak Zigbee, the cloud doesn't live in them - it lives in the gateway that translates an open radio protocol into a conversation with the vendor's server. Zigbee is a standard: the same devices can be paired with your own coordinator plugged into your server and driven by Zigbee2MQTT or ZHA - [I've written separately about choosing between them](/en/blog/zigbee-home-assistant-zha-z2m-separate-server/). The vendor gateway goes into a drawer, and the entire cloud layer goes with it: no accounts, no keys, no telemetry, no dependency on someone else's servers.

In practice, you buy a coordinator, set up Zigbee2MQTT or enable ZHA, and pair devices again one by one. Moving twenty sensors may take an evening, but the time depends on access and pairing behavior. Automations then run locally, and the Zigbee mesh may gain routes because most compatible mains-powered devices act as routers. Not every mains-powered product is a router, so verify the model in the compatibility database.

One thing worth preparing for: exotic models are sometimes supported incompletely - they pair, but some functions need an extra definition. The supported-device databases of both projects are public. Your own coordinator removes the cloud from day-to-day control of a compatible Zigbee device, but it may also mean giving up the vendor app and its firmware-update path. Verify both functions and updates before migrating.

## Xiaomi: miio tokens, BLE sensors and gateways

The Xiaomi ecosystem is more varied than Tuya's. Some supported Wi-Fi devices - selected vacuums, air purifiers, lamps, and humidifiers - use the local miio protocol and a device token. This does not cover every Xiaomi product or regional variant, so start with the Home Assistant integration's supported-model list. Token retrieval changes with app versions. Once configured, a supported model can be controlled locally, although the device may still contact the cloud when internet access is available.

BLE sensors are the most rewarding part of the ecosystem. Xiaomi thermometers, hygrometers and soil sensors broadcast their readings over the air, and Home Assistant can pick them up with no vendor involvement at all - a Bluetooth receiver in your server is enough, or a few cheap ESPHome microcontrollers scattered around the house acting as Bluetooth proxies, which conveniently also solve the range problem in a larger home. Some models encrypt their broadcasts and require a key (bindkey) - how to obtain it is, again, documented per model and firmware version.

Xiaomi gateways are a lottery that depends on the model and firmware revision: some can be switched into a local mode, some need modification, some are shut tight. My advice after several attempts: don't fight the gateway - make it redundant. Xiaomi's Zigbee sensors pair directly with your own coordinator, the BLE ones are read by proxies - and suddenly it turns out the gateway wasn't doing anything you aren't already doing yourself, except now it happens on your side of the wall.

## Flashing ESPHome and Tasmota: when it's worth it

The deepest level of liberation is replacing the firmware itself. ESPHome and Tasmota turn a device from a client of someone else's cloud into a device that talks exclusively to your server - after flashing there is no vendor protocol left, no keys to extract and no bridge to maintain. For years this was surprisingly easy, because cheap Wi-Fi hardware was built almost exclusively on modules with ESP chips - exactly the chips both projects were created for. There were even tools that flashed devices remotely, without opening the case.

That era is largely over. Vendors patched the remote route in newer stock firmware, and more importantly - a growing share of devices leaves the factory with non-ESP chips on which classic ESPHome and Tasmota won't run. For some of those chips there are community projects along the lines of LibreTiny, but the support is younger, the compatibility list shorter and the risk of bricking a device higher. Before buying anything "to flash", check the community databases for which chip sits in your specific hardware revision - manufacturers happily change the electronics without changing the model name.

When it's worth it: when the device has an ESP chip, a documented configuration for your model and easily accessible programming pins - or when the hardware is unusual and has no successor with native local control. The [ESPHome documentation](https://esphome.io/) then walks you by the hand from the first soldered wire to a finished entity in Home Assistant. When it's a waste of time: when you'd have to pry open a glued case and solder onto tiny pads just to rescue a plug whose Zigbee equivalent costs as much as two pizzas. These days I treat flashing as a hobby and a lifeline for gear with no alternative - not as a strategy for equipping a house.

## Purchasing strategy: don't carry a new cloud through the door

The cheapest cloud to remove is the one you never buy. Before every purchase I ask three questions. First: **is there a Zigbee or Matter-over-Thread variant with confirmed local control?** A Zigbee end device has no direct internet access. Thread, however, is an IP network: a device can communicate through a border router, and the word "Thread" alone does not guarantee cloud independence. Matter provides a local control protocol, but a product may still offer vendor features over the internet. Verify the exact model and its behavior with the uplink disconnected.

Second: **does the device work with Home Assistant without a vendor account?** Look for an explicit local-control claim, check the public Zigbee2MQTT and ZHA compatibility databases, and on higher-shelf hardware - the "Works with Home Assistant" badge. The key word is "locally": there are official integrations that technically work with Home Assistant yet still route every command through the vendor's server, which solves nothing. Third: **what happens when the vendor disappears?** If the answer is "the device stops working", you're not buying a product - you're buying a subscription with an unknown end date.

## Migration without demolishing the house

Don't replace everything at once - that's the shortest road to abandoning the project halfway and living in a house that's half old, half new and entirely undocumented. The order that worked for me has three stages. Stage one: **the zero-new-cloud rule** - from today, every new purchase meets the criteria from the previous chapter. It costs nothing and stops the problem from getting deeper. Stage two: **replace the critical points** - leak and smoke sensors, locks, heating control, everything that must keep working during an internet outage. Here you don't wait for the device's natural death, because the cost of a failure exceeds the cost of the replacement. Stage three: **everything else at the pace of opportunity** - cloud bulbs and plugs can live out their days behind a Local Tuya bridge and leave one by one whenever their Zigbee successors go on sale.

That leaves a fourth category: devices whose cloud cannot be removed but which you want to keep - the TV, the robot vacuum, the air conditioning. You won't free them, but you can fence them in: [a separate VLAN for IoT devices](/en/blog/iot-on-separate-network-vlan-smart-home/) with a firewall that lets them talk to the internet but not to the rest of your home, and - wherever local control exists - also cuts their traffic to the vendor's servers. The device stays cloud-bound, but it stops being a window into your network and an unsupervised telemetry stream. The same fence, by the way, serves the devices you've already freed: miio with tokens works locally, but only the firewall guarantees that locally means exclusively locally.

## Summary

The vendor cloud is debt paid through latency, telemetry, and service-shutdown risk. Move compatible Zigbee hardware under your own Zigbee2MQTT or ZHA coordinator after checking features and firmware updates. Some Tuya Wi-Fi devices work through Local Tuya-style bridges and local keys; selected Xiaomi models work through miio tokens. Flashing ESPHome or Tasmota remains an option where the exact chip and hardware revision allow it. For new purchases, prefer confirmed local control over a protocol label, and isolate anything that cannot be freed in a VLAN. The most honest migration test is to disconnect the internet uplink and count what stopped working.
