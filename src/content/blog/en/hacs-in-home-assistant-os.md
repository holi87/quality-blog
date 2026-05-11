---
title: "HACS in Home Assistant OS — why, when it's worth it, and how to install it step by step"
description: "Why HACS belongs in Home Assistant OS, what to watch out for, how to install it step by step, and what to enable first — an honest walkthrough."
date: 2026-04-27
tags: ["smart-home", "home-assistant", "hacs"]
lang: en
readingTime: 15
author: JS
---

If you've been using Home Assistant for more than a week, sooner or later you'll hit a forum thread, a YouTube video, or a Reddit post where someone says: "install it from HACS". And it's usually said so casually that you'd think every HA user has HACS by default. They don't. HACS has to be installed separately, and the install itself — even though HACS 2.0 made it noticeably simpler — is still not a one-click affair.

This post is what I wish I'd had when I started a few years ago: an honest guide to HACS for a Home Assistant OS user. Not just "where to click," but also "why you're doing this," "what HACS **doesn't** do," and "what to watch out for to avoid breaking a working install." The whole thing is written from the perspective of a real home setup — I've been running HA for years, I have an HA Yellow, a couple of Raspberry Pis with Zigbee2MQTT, Shelly Gen4 modules at dozens of points around the house, and UniFi cameras — so I know how easy it is to break a working install with a single bad click.

Before we get to the install: fair enough, you're probably reading this because you already know you *want* HACS. But stick with me through the first few sections — HACS is powerful enough (and easy enough to misfire with) that knowing what you're about to do is worth the five minutes.

## What is HACS?

HACS stands for **Home Assistant Community Store**. The name is misleading on two counts, so let me defuse the biggest myths upfront.

First, HACS **is not an official Home Assistant product** the way the Add-ons store or the built-in integrations are. It's an independent open-source project, maintained mainly by Joakim Sørensen (`ludeeus`) and the community. Home Assistant only started cooperating with HACS officially from version 2.0 onward — HACS was accepted into the Open Home Foundation as a partner, which gave it some standing, but technically it's still a third-party extension.

Second, "store" suggests you're buying something. You're not. HACS is free, and everything you install through it is also free open-source projects hosted on GitHub.

The simplest way to describe HACS is as a **package manager for Home Assistant** — something like `apt` on Debian, `brew` on macOS, or the Chrome Web Store for your browser. It gives you a convenient interface for finding, installing, updating, and removing community extensions to Home Assistant that you won't find in the official integration repository.

Concretely, HACS can install five types of things: **integrations** (so-called custom components — Python code that adds support for new devices and services), **dashboards/Lovelace cards** (visual panel elements, e.g. `mini-graph-card`, `mushroom-cards`, `button-card`), **themes** (color schemes for the HA interface), **AppDaemon apps** (external Python automation scripts), and **Python scripts** (short snippets you run from automations).

## Why is it worth having?

Shortest answer: because Home Assistant out of the box is very good, but it doesn't support everything, and it doesn't look the way you'd like.

Home Assistant has hundreds of official integrations — and they're great integrations, maintained by the core team. But the smart home ecosystem as a whole is so wide that it's impossible for 400 volunteers to cover every device, every service, and every idea people come up with. HACS fills that gap. Some authors simply don't have the time to go through the acceptance process into the official HA repository (which requires tests, docs, and alignment with guidelines). Others do things HA officially doesn't accept — for example, integrations based on web scraping when a provider doesn't offer an API (this comes up often for regional utility providers, carmaker apps, and local weather services).

The second pillar of HACS is the **visual layer**. The default Home Assistant UI is functional but fairly austere. If you've ever seen those beautiful, minimal, modern Home Assistant dashboards on YouTube — it's practically guaranteed they're built on some card from HACS. `mushroom-cards` kicked off the minimalist interface wave, `button-card` lets you build practically any button, `mini-graph-card` renders history charts that are worlds prettier than the built-in one, and `bubble-card` revolutionized modern panel layouts. None of these are available without HACS.

A third reason is more pragmatic: **development pace**. Official HA integrations ship on a two-week release cycle and have to be tested. HACS lets developers publish new versions whenever they want, which means an integration for a new device shows up in HACS weeks or months before (if ever) it makes it into core. If you just bought a new IoT gadget and it isn't on HA's integration list, the first place to look is HACS.

Fourth, slightly hidden reason — **the long road to improvement**. Some of today's most popular integrations started life in HACS and only years later made it into official HA. HACS is the proving ground where interesting ideas mature before they go mainstream.

## What HACS **isn't**

This matters, because beginning HA users confuse HACS with two other things, and that confusion costs a lot of wasted time.

**HACS is not the Add-ons store.** Add-ons in Home Assistant OS are full Docker containers that run *alongside* Home Assistant — for example Mosquitto (the MQTT broker), Zigbee2MQTT, AdGuard Home, Node-RED, File editor. They have their own store, built into HAOS, and you install them under `Settings → Add-ons`. HACS has nothing to do with that and doesn't install anything of the sort.

**HACS is not a cloud integration or a device store.** You don't buy anything physical through it, you don't link a Google Home account, none of that. It's a code repository — only code, which you install onto your own hardware, under your own roof.

And the final myth: **HACS is not something you install once and forget about.** More on that in the risks section in a moment.

## What you should be aware of before you click "Install"

Here I have to put on the QA engineer hat I wear at work every day. HACS is a powerful tool, but it introduces code written by strangers into your HA install. The HA maintainers repeat it like a mantra: *HACS can destabilize your system*. And they're right.

First, **code from HACS has full access to your Home Assistant install**. It can read your tokens, your device states, your history, everything. Before you install an integration that syncs your phone's location with some exotic service, think about who you've just trusted.

Second, **custom components can break an HA update**. When the core HA team changes an internal API (and they do, regularly — development never stops), any HACS integrations that haven't been updated may stop working or, worse, prevent HA from starting up after a restart. I'm not kidding — I've seen it on my own system and I've seen it at friends'. That's why **before every HA update** you should skim the release notes for the "Breaking Changes" section and check whether any of your HACS integrations are called out as a source of problems.

Third, **HACS projects get abandoned**. The author gets interested in something else, changes jobs, loses motivation — and the integration stops being developed. When you're browsing HACS, watch the repository's last activity date. If it's been a year since the last commit, that's a warning sign. Three years — skip it, unless there's genuinely no alternative.

Fourth, **a backup before installing isn't a suggestion — it's a requirement**. Home Assistant OS has a built-in backup mechanism (`Settings → System → Backups`). Before installing HACS, and before every significant HACS operation, take a backup and — this matters — **download it onto another device**. A backup that lives on the same disk as the broken system has limited value.

If after those warnings you've decided you're ready, your install is stable, and you have a fresh backup — let's go.

## What you need before the install

The requirements list is short but complete:

1. **A working Home Assistant OS (or Supervised) install.** This guide covers HAOS — for Container or Core the procedure is different (those use a `wget -O - https://get.hacs.xyz | bash -` script inside the container or terminal). If you don't know which install type you have, stop and check under `Settings → System → About`. The HACS docs say it plainly: if you don't know what you're using, you shouldn't be installing HACS.
2. **Home Assistant reasonably up to date.** HACS 2.0 works with any fairly recent HA version, but for safety sake you should be on at least the last release of the previous quarter.
3. **A GitHub account.** Required. HACS fetches packages from GitHub and requires authorization via your account. If you don't have one, create it before installing at `github.com/signup` — it's free and there's nothing more to it. A few questions I hear often: no, the account doesn't need to be public; no, you don't have to push anything there; no, HACS doesn't get access to your repos.
4. **A fresh HA backup downloaded to another device.** Repeating myself, but not too often.
5. **Access to the HA UI through a browser.** Not SSH, not the mobile app at this stage — a full browser, because we'll be going into configuration screens and copying a GitHub device code.

## Installing HACS on Home Assistant OS — step by step

As of HACS 2.0 (August 2024), the process is significantly simpler than it used to be. You used to have to install Terminal & SSH, SSH in, `wget` files, and restart — today most of that is handled for you by a dedicated "app" in the HA store.

A quick note on naming. The latest HACS docs use the term "app" rather than the older "add-on". In the English HA UI you'll typically see "Add-on" or "Add-ons" — treat them as the same thing. In some HAOS versions the menu is `Settings → Add-ons`, in others `Settings → Apps`.

### Step 1. Take a backup (seriously)

`Settings → System → Backups → Create backup`. Choose **Full backup**. Wait for it to finish — depending on the size of your install, it can take anywhere from a few seconds to a dozen minutes. When it's done, click the backup name and **Download** it to your computer. Keep the `.tar` file somewhere safe. If anything goes wrong in the next steps, you have somewhere to fall back to.

### Step 2. Add the HACS repository to the add-ons store

Open Home Assistant in a browser and go to `Settings → Add-ons → Add-on Store`. In the top-right corner click the three-dot menu icon and pick **Repositories**.

In the window that opens, paste:

```text
https://github.com/hacs/addons
```

Click **Add**, then close the window. The add-on store will refresh automatically and after a moment a new section will appear at the bottom of the list called **Home Assistant Community Store (HACS)** with a single add-on inside: **Get HACS**.

If the new section doesn't show up immediately, do a hard refresh of the browser (`Ctrl+Shift+R` on Windows/Linux, `Cmd+Shift+R` on macOS). It's a known quirk — the HA UI occasionally caches the add-on list.

### Step 3. Install the "Get HACS" add-on

Click the **Get HACS** add-on and on the next screen pick **Install**. The install takes a moment (typically under a minute).

Worth emphasizing: **this add-on is not HACS itself**. It's just an install script that copies the actual HACS code into your `/config/custom_components/hacs/` and prepares everything to run. Once it's done its one-time job, it doesn't need to keep running.

### Step 4. Start the add-on and check the logs

After the install you'll stay on the add-on page. Leave **Start on boot** disabled (you don't need it) and click **Start**. The add-on will launch, do its work, and stop on its own.

Now, **the important bit**: click into the **Log** tab for this add-on. Scroll to the bottom. If everything went well, you'll see a message like:

```text
[info] Installation complete.
[info] Remember to restart Home Assistant before you configure it.
```

If you see errors instead (e.g. GitHub denial, network timeout) — it's usually a problem with your HA's internet connectivity or DNS. Restart the router, check `Settings → System → Network`, and try starting the add-on again.

### Step 5. Restart Home Assistant

Go to `Developer Tools → YAML` and click **Restart Home Assistant**. Alternatively: `Settings → System → top of the page → Restart → Restart Home Assistant`. Note — you need to restart **Home Assistant Core**, not the whole host.

The restart usually takes 30–90 seconds. Wait for the UI to come back and ask you to log in again.

### Step 6. Add the HACS integration

Now you have to wire HACS into HA as an integration. Go to `Settings → Devices & Services`.

**Heads-up**: quite often HACS "doesn't show up" on the list of available integrations at this point, even if you did everything above correctly. The HACS docs call this out explicitly: you need to **clear the browser cache** or do a hard refresh (`Ctrl+Shift+R`). After that it works.

In the bottom-right corner click **+ Add Integration**. In the search box type `HACS` and pick it from the list.

You'll see a dialog with a few acknowledgements to check. Standard practice is to check all of them — they're confirmations that you understand HACS is an independent project, that it introduces custom code, and that you take backups. Click **Submit** when done.

### Step 7. GitHub authorization

Now the interesting part. HACS uses the **OAuth Device Flow** — an authentication method that doesn't require HA to "see" your GitHub password. Instead you get a short code (8 characters) that you enter manually on a GitHub page.

You'll see a message like:

> To continue, open https://github.com/login/device and enter code: `XXXX-XXXX`

Copy the code. In a new tab open `https://github.com/login/device`. If you're not logged into GitHub yet — log in now (or create an account).

Paste the code into the field, click **Continue**. On the next screen you'll see that the HACS app is requesting access. Click **Authorize HACS**.

After a moment you'll see a confirmation. You can close that tab and go back to Home Assistant.

### Step 8. Assign an area and finish

Home Assistant will ask you to assign HACS to an area. This doesn't really matter technically — HACS isn't a device, it's a system integration. You can pick "Office", "Server room", or just leave it empty. Click **Finish**.

**Done.** In the left sidebar a new entry will appear after a moment: **HACS** with its distinctive icon. If you don't see it immediately — another hard browser refresh.

## The first few minutes with HACS

After clicking HACS in the menu you'll land on the main screen with tabs at the top: **Integrations**, **Frontend**, **Automations**, **Themes** (the exact names shift a bit between versions). On first launch, HACS will pull down the list of repositories and index it — this takes a while, because the database has thousands of projects. Then you'll see search and filters.

For starters I recommend two things.

**First: don't install anything for the next 15 minutes.** Click around, look at things. HACS has an addictive "candy store" effect — everything looks fascinating and you want all of it. Remember that every installed integration is one more thing that can break during an HA update.

**Second: browse the Explore section, sort by install count, and see what's most popular**. What tens of thousands of users install is usually well-maintained and tested. Examples you'll definitely run into: `HACS Frontend`, `Mushroom`, `Mini Graph Card`, `Button Card`, `Browser Mod`, `Card Mod`, `Adaptive Lighting`, `Alarmo`, `Spook`.

When you find something you want to install, click on it and choose **Download** (or **Install**). HACS will fetch the files. As a rule, **every change in HACS requires a Home Assistant restart** for the code to actually load. After installing an integration (custom component), go to `Settings → Devices & Services → Add Integration` and configure it the same way you configure any official HA integration. For Lovelace cards and themes, changes show up automatically after refreshing the dashboard, though sometimes an HA restart is still needed.

## Updates and maintenance

When an author releases a new version of one of your integrations, HACS notifies you through the standard HA update mechanism. You'll see a red dot in `Settings` and a list of available updates, exactly like an HA update. This is one of the bigger HACS 2.0 improvements — earlier, notifications were separate, hidden inside the HACS UI.

My recommendation: **don't update everything at once**. Update integrations one at a time, wait a day or two, and check that nothing broke. Same goes for HA updates themselves — if a new core version just dropped, give it a week for HACS developers to update their projects. Updating HA plus ten HACS integrations at once is a direct path to spending a Saturday night on rollbacks.

HACS updates itself as well — as a "normal" integration. When a new version comes out, you'll see a notification, click install, restart HA.

## Common problems and quick fixes

If something went wrong, the most frequent scenarios look like this.

**"I don't see HACS in the integration list after the restart."** Almost always the browser cache is at fault. Do `Ctrl+Shift+R`, close all HA tabs, open them again. If still nothing — check the HA logs (`Settings → System → Logs`) for anything related to `hacs`.

**"The Get HACS add-on errors out while fetching."** Check HA's internet connectivity. Easiest check: in `Developer Tools → Services`, run the `homeassistant.check_config` service — if it works, HA has internet. If not, the problem is networking. Check DNS (AdGuard, Pi-hole, a router-level DNS — any of these can block specific domains).

**"GitHub authorization won't work, the code expires too quickly."** The code is valid for 15 minutes. If you've done it in stops and starts — just exit the integration configuration screen, re-add the HACS integration, and repeat the process. You'll get a new code.

**"HACS installed, but HA doesn't start after the restart."** Worst scenario, but solvable. First try via SSH (the Terminal & SSH add-on in advanced mode) to look into the HA log (`cat /config/home-assistant.log`). If you can see clearly that a specific `custom_components` integration is the culprit, remove its directory over SSH and restart. If you don't know what happened — restore the backup from Step 1.

**"HACS was working and stopped after the latest HA update."** A classic after major HA releases. The HACS docs have a dedicated "HA update broke my HACS" section — usually you just wait a day or two for HACS itself or the problematic integration to update. If you can't wait, you always have the option to restore the backup from before the HA update.

## What to install first

So I don't leave you with an empty interface, my subjective recommendations for the first few installs — things almost every HA user will appreciate.

If you want nicer-looking dashboards: **Mushroom Cards** (modern, minimalist style), **Mini Graph Card** (history charts much prettier than the built-in one), **Button Card** (flexible buttons with arbitrary content), and **Card Mod** (lets you add CSS to any card — when you're ready for more control).

If you have smart lighting: **Adaptive Lighting**. An integration that automatically adjusts color temperature and brightness to the time of day, simulating natural sunlight. Two weeks in and you'll forget you ever had the same white color on your lamps all day.

If you're interested in alarm systems: **Alarmo**. Full support for zones, user codes, delays, and integrations with motion and contact sensors. Turns HA into a proper alarm system.

If you want more control over the UI: **Browser Mod** — lets you control what's happening in a user's browser (e.g. switch to a specific tile on a particular tablet when someone rings the doorbell). Brilliant in automations.

And one thing that isn't quite "must have" but I love: **Spook**. Extends HA with a lot of extra services that are missing from core — cleaning up unused entities, fixing broken integrations, extended actions. I call it "the Swiss army knife for HA".

Each of these deserves its own post. But if you want to see right away what HACS can do — this is where I'd start.

## Wrapping up

HACS is something without which a serious Home Assistant install barely exists. It gives you access to an ecosystem of several thousand community projects — from integrations for devices HA doesn't officially support, to visual elements that will change your dashboard from "functional" to "I show it to everyone who walks in." The price for that power is responsibility: code from unknown authors, risk of destabilization on updates, the need to keep track of what you have installed, and strict backup hygiene.

If you've worked through this guide, you now have HACS running and a few evenings of interesting tinkering ahead of you. My final piece of advice is banal but really does matter: **don't install too many things at once, and test after every install**. Minimalism with HACS pays off in the long run. Better to have five solidly vetted extensions than thirty, half of which don't work.

Good luck — and don't forget to take another backup before you start clicking.
