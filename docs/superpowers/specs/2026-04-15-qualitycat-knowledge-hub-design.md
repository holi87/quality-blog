# Quality Cat — Knowledge Hub

Platforma wiedzy prowadzona przez Quality Cat (qualitycat.pl). Blog informacyjno-edukacyjny o smart home i AI. Side project firmy — nie strona firmowa, a darmowa baza wiedzy budująca świadomość marki.

## Technologia

- **Framework:** Astro (static site generator)
- **Treści:** Markdown z Content Collections
- **Hosting:** Netlify, Vercel lub GitHub Pages (statyczne pliki, darmowy plan)
- **Deploy:** Automatyczny z git push
- **Języki:** Dwujęzyczna strona (PL + EN) z natywnym i18n Astro

Nie jest potrzebny serwer — Astro generuje statyczne HTML/CSS/JS.

## Styl wizualny

- **Motyw:** Dark theme
- **Tło główne:** Zinc `#18181b`
- **Tło kart/elementów:** `#27272a` z borderem `#3f3f46`
- **Kolor akcentu:** Pomarańczowy `#f97316`
- **Tekst główny:** `#d4d4d8`
- **Tekst nagłówków:** `#fafafa`
- **Tekst drugorzędny:** `#a1a1aa`
- **Tekst wyciszony:** `#71717a`
- **Typografia:** System sans-serif (-apple-system, Segoe UI, system-ui)
- **Charakter:** Profesjonalny, minimalistyczny, przystępny dla szerokiej publiczności (nie "hackerski")

## Branding

- **Logo:** Tekstowe — "qualitycat / wiedza" (z "cat" w kolorze akcentu)
- **Powiązanie z firmą:** Subtelne — link do qualitycat.pl w stopce ("Projekt prowadzony przez Quality Cat")
- **Ton komunikacji:** Merytoryczny, bez marketingowego szumu, dzielenie się wiedzą za darmo

## Struktura stron

### 1. Strona główna (`/`)

- **Nawigacja:** Logo, linki (Strona główna, Blog, O projekcie), przełącznik PL/EN
- **Hero:** Nagłówek z misją ("Dzielimy się wiedzą o smart home i AI"), krótki opis, tagi tematyczne (Home Assistant, Claude/ChatGPT, Automatyzacja, IoT, Prompt Engineering)
- **Ostatnie wpisy:** Grid 3 kolumny z kartami artykułów (data, czas czytania, tytuł, opis, tag kategorii)
- **Stopka:** Link do qualitycat.pl, copyright

### 2. Blog (`/blog`)

- Lista artykułów z filtrami po tagach/kategoriach
- Mix formatów: długie artykuły, poradniki, krótkie porady, code snippety
- Każdy wpis jako plik Markdown z frontmatter (tytuł, data, tagi, język, czas czytania)
- Paginacja lub infinite scroll

### 3. O projekcie (`/o-projekcie`)

- Krótki opis inicjatywy i jej celu
- Tematyka: smart home, AI, automatyzacja
- Link do strony firmowej qualitycat.pl
- Bez imion/zdjęć — anonimowy charakter

## Dwujęzyczność

- Struktura katalogów: `src/content/blog/pl/` i `src/content/blog/en/`
- Routing: `/pl/blog/...` i `/en/blog/...`
- Przełącznik języka w nawigacji
- Domyślny język: polski
- Każdy wpis może istnieć w jednym lub obu językach

## Formaty treści

Markdown z frontmatter, przykład:

```yaml
---
title: "Jak zacząć z Home Assistant w 2026 roku"
description: "Kompletny przewodnik dla początkujących"
date: 2026-04-12
tags: ["smart-home", "home-assistant"]
lang: pl
readingTime: 5
---
```

Obsługiwane typy treści:
- **Artykuł** — dłuższy tekst z nagłówkami, obrazkami, przykładami
- **Porada** — krótka forma, 1-3 minuty czytania
- **Snippet** — blok kodu z opisem

Rozróżnienie przez tagi/kategorię, nie osobne kolekcje.

## Responsywność

- Desktop: grid 3 kolumny dla wpisów
- Mobile: single column, nawigacja hamburger
- Breakpoint: 768px

## Mockup referencyjny

Zatwierdzony mockup strony głównej: `.superpowers/brainstorm/54427-1776281378/content/homepage-layout.html`
