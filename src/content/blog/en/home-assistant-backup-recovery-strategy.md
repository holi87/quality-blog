---
title: "Back Up Home Assistant Before It's Too Late - a Step-by-Step Recovery Strategy"
description: "A complete Home Assistant backup strategy: automatic backups, off-device storage, encryption key handling and the restore test that tells you the truth about whether you have a backup at all."
date: 2026-07-17
tags: ["smart-home", "home-assistant", "backup", "recovery", "reliability"]
lang: en
readingTime: 10
author: GH
---

An SD card dies without warning, and with it go two years of configuration, automations and measurement history. This article is a complete Home Assistant backup strategy you can set up in a single evening: automatic backups, off-device storage, and a restore test that tells you the truth about whether you have a backup at all.

## Why I take this topic dead seriously

A friend of mine ran Home Assistant on a Raspberry Pi 4 for over two years. Forty automations, lovingly polished dashboards, pairings for dozens of Zigbee devices, temperature history going back to the first winter. One morning the system simply didn't come up. The SD card had switched to read-only mode and then stopped responding entirely. There was no backup whatsoever - because "I'll get to it someday".

That's not bad luck, that's statistics. SD cards are not designed for continuous writes, and Home Assistant with the history database enabled writes to the storage medium practically non-stop. A typical card in this role lasts one to three years. SSDs and eMMC storage (I run an HA Yellow, so I know this first-hand) live longer, but not forever either. The question isn't "will the storage fail" but "when" - and whether you'll be prepared when it does.

The second group of scenarios isn't hardware failures but ourselves: a botched update, an experiment with a HACS integration that took the system down, accidentally deleting half the configuration while tidying up. A backup protects you from the hardware and from the human at the same time.

## What the built-in backup system can do in HA 2026

Good news: you don't need any external tools to have a decent strategy. The Home Assistant backup system was thoroughly rebuilt in the 2025 releases, and in the 2026 versions you get out of the box: an automatic schedule, backup encryption, a retention policy (how many backups to keep) and upload to network locations.

A standard backup covers the entire configuration directory: automations, scenes, scripts, dashboards, user accounts, configured integrations, installed add-ons together with their data and - optionally - the history database. Everything lands in a single encrypted archive.

Configuration starts in `Settings → System → Backups`, via the automatic backup configuration button. There you set the day and time (I suggest the middle of the night), the number of backups to keep and the destinations. On first run the system generates an encryption key and offers to download an "emergency kit" - a file containing that key.

**Stop and pay attention at this step.** Without the encryption key, a backup is a useless blob of data. Download the emergency kit and store it in two places outside Home Assistant: in your password manager and, for example, in your mailbox or on a printout in a drawer. Keeping the key solely on the same device as the backup is a classic mistake that gets discovered at the worst possible moment.

## Rule number one: the backup lives off the device

A backup sitting on the same SD card as the system dies together with the card. That sentence sounds trivial, and yet the default configuration of many installations looks exactly like that. The minimum sensible standard for a home: backups in two places, at least one of them off the device itself - and ideally off-site.

You have three practical options that can be combined:

- **A NAS on the local network.** In `Settings → System → Storage` you add a network share (SMB or NFS), point it at a folder with credentials, and then mark it as a destination in the backup settings. Backups flow there automatically, no scripts required.
- **Home Assistant Cloud.** If you pay for the subscription (mainly for remote access and voice assistants), you also get cloud backup storage. The size limit forces you to exclude the history database, but the configuration is literally one click.
- **Google Drive via a community add-on.** The Home Assistant Google Drive Backup add-on has been the gold standard for years: you add its repository to the add-on store, authorize your Google account and decide how many backup generations to keep on Drive. The free 15 GB is plenty for backups without the history database.

My home setup: a daily local backup (last three kept), upload to the NAS (last ten kept) and once a week to Google Drive. Three independent locations, zero manual work.

## A schedule and retention that make sense

How often should you back up? Simple rule: as often as you change the configuration. If you tinker with automations every evening - daily. If the system just sits and runs for months - once a week is enough, because losing a week of history hurts less than losing a week of configuration work.

A separate decision concerns the history database. The system lets you exclude it from backups, and that exclusion can shrink the archive from 4 GB to 200 MB. The compromise I recommend: daily backups without the database (fast, small, cheap to store) plus a full backup with the database once a month. You then lose at most a month of charts, and the configuration - never. If history is critical for you (for example, you track energy costs year over year), consider moving the database to an external engine on the NAS and covering it with its own backup.

The third element almost nobody remembers: checking whether backups are actually running. A silent failure of the backup mechanism is a classic - the NAS filled its disk, the Google authorization expired, the SMB share password got changed during a cleanup. The system keeps running, so nobody notices anything, and the counter of days since the last successful backup keeps growing. Home Assistant exposes the last backup information as an entity, and the Google Drive add-on has its own status sensor - build a simple automation on top of that: if the last successful backup is older than 48 hours, send a notification to your phone. Two minutes of work, and it closes the nastiest scenario: a failure discovered only when the backup is needed.

And one more safety net for people who tinker in yaml files: a git repository on the configuration directory. A backup answers the question "how do I get back to yesterday"; git answers the question "what exactly did I change in that automation three weeks ago and why did it work back then". It's not a backup replacement - the database, add-ons and secrets stay out of the repository - but when diagnosing regressions after your own changes it can be priceless.

## What the standard backup does not cover

This is the most commonly overlooked piece of the puzzle. A Home Assistant backup protects Home Assistant - but your smart home is more than one system. Here's the list of elements that can surprise you during a restore:

| Element | Where it really lives | How to protect it |
| --- | --- | --- |
| Zigbee network (network key, pairings) | Partly on the USB coordinator | ZHA and Zigbee2MQTT save a copy of the coordinator settings in configuration files - it ends up in the HA backup, but restoring onto a different coordinator model requires a separate migration procedure |
| History database (if excluded) | Database file outside the backup | A monthly full backup or an external database on the NAS |
| Tokens and sessions for cloud integrations | With third-party providers | A list of accounts in your password manager; some integrations will ask you to log in again after a restore |
| Network configuration (DHCP reservations, VLANs, DNS) | The router | Export the router configuration after every major change |
| Scenes and settings in manufacturer apps | The manufacturer's cloud | Move logic into HA instead of keeping it in device apps |
| The host operating system (Container/Core installs) | Outside the reach of HA backups | A disk image or your own system backup script |

The first item costs the most nerves. If your Zigbee coordinator dies together with the rest of the hardware, restoring the HA backup alone won't be enough - a new coordinator of the same type can be restored from the saved settings, but switching to a different model usually means re-pairing devices. It's worth keeping a spare coordinator of the same model in a drawer. It costs as much as two smart plugs and saves you a weekend of walking around the house with a ladder.

## The restore test, or the moment of truth

> A backup you have never restored is not a backup. It's a file with an optimistic name.

In my work as a tester I repeat this to teams with every business continuity plan, and exactly the same rule applies at home. The test procedure is simple and safe, because it doesn't touch the running system:

1. Take a spare storage medium (an old SD card, a USB drive) or a virtual machine on your computer. Flash a fresh Home Assistant OS image.
2. Boot the system and in the first-start wizard choose the option to restore from a backup instead of creating a new installation.
3. Point it at the backup file downloaded from the NAS or Google Drive and provide the encryption key from the emergency kit.
4. Wait - restoring can take a dozen or more minutes, and during that time the interface looks like nothing is happening. Patience.

After it boots, go through a short checklist: does login work, are the automations in place, do the dashboards look familiar, did the add-ons start, which integrations ask for re-authorization. Write down how long the whole operation took - for me it's about 40 minutes from taking the card out of the drawer to a working system. That number is your real recovery time after a failure, and it's worth knowing before the failure happens.

I repeat this test every six months, usually alongside a major update. Twice it caught a problem: once a corrupted archive (the NAS was truncating transfers), once an encryption key saved in an old version. Both discoveries happened under exercise conditions, not disaster conditions - and that's exactly the point.

## Summary

The Home Assistant backup strategy in three sentences: automatic backups with the built-in mechanism (daily or weekly, with sensible retention), off-device storage in at least two places (NAS plus cloud), and the encryption key secured separately. On top of that, awareness of what the backup doesn't cover - with the Zigbee network and router configuration at the top of the list. And the ritual that separates owning a file from owning a safety net: a restore test on clean hardware every six months. If you do just one thing after reading this, do this one: check tonight when your last backup was created and whether you can point to its encryption key.
