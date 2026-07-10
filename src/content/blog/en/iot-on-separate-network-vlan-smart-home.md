---
title: "IoT on a Separate Network: VLANs and a Firewall for Your Smart Home Without a Networking PhD"
description: "Network segmentation is the biggest free security lever for a smart home: a three-network model, firewall rules in plain language, the mDNS trap and a rollout plan for UniFi, Mikrotik and OpenWrt."
date: 2026-07-31
tags: ["smart-home", "security", "network", "vlan", "iot"]
lang: en
readingTime: 10
author: GH
---

A cheap camera tied to a Chinese cloud should not be able to see your laptop, your NAS full of documents or your phone - and in the default home network configuration it sees everything. Network segmentation is the biggest smart home security lever you can pull for zero money, provided you have the right router. I'll show the model that works at my place, firewall rules in plain language, and an overview of how to do it on the popular platforms.

## What the problem actually is

A typical home network is flat: the ISP's router, one Wi-Fi network, everything in a single address pool. A laptop with access to your bank, a phone, a NAS with documents and ten years of photos, and right next to them a 90-zloty camera whose manufacturer released the last firmware update two years ago. In a flat network every one of these devices can see every other one and can try to connect to it.

This isn't about panic, it's about attack surface arithmetic. Thirty IoT devices are thirty potential backdoors, most of which you don't control: you don't know the code, you don't know which servers they talk to, you have no influence over how fast vulnerabilities get patched. The history of the Mirai botnet showed that cheap cameras and recorders get taken over en masse, automatically, with zero interest in whose home it is. A compromised device in a flat network can scan its neighbours, eavesdrop on traffic and serve as an entry point for going further.

The conclusion is simple: devices you don't trust should live in a separate network from which nothing valuable is visible. That's what VLANs are for.

## The target model: three networks instead of one

A VLAN is a logical split of one physical network into several isolated ones - the same cables and the same router, but devices in different VLANs can't see each other until the firewall explicitly allows it. A proven layout for a home looks like this:

- **Trusted network** - laptops, household phones, the NAS, the printer and the Home Assistant server. Full mutual access.
- **IoT network** - cameras, plugs, Wi-Fi bulbs, the TV, the robot vacuum, sensors. A separate SSID, a separate address pool, zero access to the trusted network by default.
- **Guest network** - internet and nothing else. Most routers have this ready behind a single toggle.

The most common question: where to put Home Assistant? There are two schools. The first places the HA server in the trusted network and lets through the firewall only what the integrations need - I recommend this variant, because HA is the heart of the home and deserves protection. The second school throws HA into the IoT network together with the devices; simpler to configure, but then a server with access to all your data lives in the least trusted segment. I choose the first school and base the rest of this article on it.

## Firewall rules in plain language

Start with a default block between zones and add only the required flows in both directions. The trusted network does not need every port on every IoT device - usually specific addresses and services are enough. A stateful firewall permits replies belonging to valid established or related connections, but exact states and rule order depend on the platform.

The exceptions, i.e. what to let through from the IoT network toward the trusted one, form a short list:

| Service | Port | Direction | What for |
| --- | --- | --- | --- |
| MQTT | 1883/TCP | IoT → HA server | Devices (Shelly, Zigbee2MQTT, sensors) publish states to the broker |
| HA interface | 8123/TCP | IoT → HA server | Only if devices call HA directly, for example wall tablets with a dashboard |
| DNS | 53/UDP | IoT → router | Name resolution; deliberately via the router, for control and logs |
| NTP | 123/UDP | IoT → internet or a local time server | Devices without a correct clock can get weirdly sick |
| mDNS | 5353/UDP | between networks via a repeater | Device discovery - a separate section on this below |

Check the direction of each integration: sometimes Home Assistant connects to a device, while in other designs the device publishes to a broker or cloud. Do not assume a universal "trusted to IoT - allow all" rule. Limit internet access to documented device needs; total isolation may stop updates, time synchronization, or cloud features.

## mDNS and discovery - the most common trap

After the first VLAN configuration almost everyone hits the same wall: Home Assistant stops discovering new devices and the phone can't see the Chromecast. The reason: discovery relies on mDNS, i.e. messages broadcast within a single network - by their nature they don't cross VLAN boundaries.

A selective mDNS repeater or proxy can solve discovery. UniFi can limit which services are forwarded, while RouterOS requires multicast-capable interfaces and, with a strict firewall, an explicit UDP 5353 input rule; its current repeater supports IPv4 only. Discovering a service does not open its data port, so separate firewall rules are still required.

> The cheapest smart home security component is not another gadget, but a firewall rule: from IoT to the rest of the house, nothing gets through by default.

## What it looks like on the popular platforms

I'm deliberately keeping this at an overview level - detailed instructions change with software versions, while the principles stay the same.

**UniFi** is the gentlest path. You create a new network with a VLAN ID in the network settings, pin it to a separate SSID and click the rules together in the Zone-Based Firewall: IoT zone to internal zone - block, with the exceptions from the table above. The mDNS toggle is built in. The price of this convenience is the cost of UniFi hardware.

**Mikrotik** gives you the most control for the least money, but the learning curve is steep. You configure VLAN filtering on the bridge, then the firewall rules - exactly in the spirit of the three directional principles. There are plenty of proven smart home VLAN configuration guides online; don't invent your own from scratch, adapt a ready one.

**OpenWrt** is a free system you can flash onto many popular routers. You define networks in the network device settings, and separation is handled by firewall zones: lan, iot, guest with a forwarding policy between zones. A great option if you have a router from the supported list and you like to tinker.

The common denominator: the ISP's router usually isn't enough, because it supports neither VLANs nor a sensible firewall. The cheapest realistic entry point is a used router running OpenWrt or a basic Mikrotik - an expense in the range of two to three hundred zlotys if you don't have anything yet.

## Where to start and what not to force

Don't move everything at once. Start with the devices that carry the highest risk and the fewest interactions: cameras, cheap Wi-Fi plugs, the robot vacuum. Leave the TV and the speakers with casting features for the end - they generate the most discovery problems, and if the fight with them frustrates you, consider a compromise in the form of a separate, third multimedia network with slightly looser rules.

A practical rollout order that saves nerves: first create the IoT network with the rules, but don't move anything yet. Then move devices one by one or in small groups, and after each move check whether the integration in Home Assistant still works. With static DHCP address reservations, a device will get a new address after changing networks - some integrations will detect it on their own, others will need the new address pointed out manually. Doing this for thirty devices at once on a Friday evening is a recipe for a Saturday spent diagnosing which of ten problems is which.

## How to verify that the segmentation really works

This is where the tester in me speaks up: configuration without verification is a hypothesis. After the rollout, run a short test session in which negative tests matter more than positive ones - that is, checking that forbidden things are actually forbidden.

- Connect a laptop to the IoT network's SSID and try to: open a file share on the NAS, reach the router's interface, ping a phone in the trusted network. All of it should fail.
- From the same laptop check the exceptions: does the MQTT broker respond on port 1883, does DNS resolve names. That should work.
- Go back to the trusted network and check access to the camera and the live view in Home Assistant - the allowed direction should work without friction.
- Test discovery: does the phone see casting devices, does HA suggest newly discovered devices. This verifies the mDNS repeater.

The most common mistakes found at this stage: firewall rules in the wrong order (a blocking rule above an allowing rule, which therefore never fires), forgotten management devices in the wrong network (an access point that lost contact with its controller) and cut-off updates - if you blocked the IoT network's internet entirely, some devices will stop receiving security patches, which can be worse than controlled network access. This test session is worth repeating after every major router firmware update.

Thread is an IPv6 network, and a border router routes it into the home IP network and potentially the internet. A Thread device is not Wi-Fi, but border routers and Matter controllers still belong in the firewall model. Zigbee does not natively carry the sensor's IP traffic, yet its coordinator, broker, and Home Assistant server remain networked components that need protection.

## Summary

Network segmentation can limit lateral movement, but it does not remove every risk and it needs maintenance and testing. Remember separate zones, default deny, explicit least-privilege flows, and selective discovery forwarding only where required. Start by inventorying camera and plug traffic, then deploy rules in reversible stages.
