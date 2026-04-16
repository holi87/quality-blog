# quality blog

Dwujęzyczny (PL/EN) blog o smart home i AI. Astro 6 + content collections, deployowany na GitHub Pages pod [quality-blog.eu](https://quality-blog.eu).

## Komendy

| Komenda | Efekt |
| :-- | :-- |
| `npm install` | instalacja zależności |
| `npm run dev` | dev server na `localhost:4321` |
| `npm run build` | build produkcyjny do `./dist/` |
| `npm run preview` | podgląd builda lokalnie |
| `npx playwright test` | testy e2e (automatycznie podnosi preview) |

Wymaga Node >= 22.12.0.

## Jak dodać nowy wpis na bloga

Posty to pliki Markdown w `src/content/blog/<lang>/<slug>.md`. Każdy post istnieje niezależnie w wersji PL i EN (nie ma automatycznego tłumaczenia — jeden post = jeden plik na język).

### 1. Utwórz plik

Nazwa pliku to slug używany w URL. Przykład:

```
src/content/blog/pl/matter-vs-zigbee.md   → /pl/blog/matter-vs-zigbee/
src/content/blog/en/matter-vs-zigbee.md   → /en/blog/matter-vs-zigbee/
```

Slug: kebab-case, bez polskich znaków. Ten sam slug na obu językach ułatwia linkowanie między wersjami.

### 2. Wypełnij frontmatter

Wszystkie pola są wymagane — schema w `src/content.config.ts` jest walidowana przez Zod, build padnie przy brakującym polu.

```yaml
---
title: "Tytuł wpisu"
description: "Krótki opis (1–2 zdania) — wyświetla się na listingu i w OG/RSS."
date: 2026-05-20
tags: ["smart-home", "home-assistant"]
lang: pl
readingTime: 5
---
```

**Pola:**
- `title` — tytuł wpisu.
- `description` — lead, meta description, opis w RSS.
- `date` — data publikacji (`YYYY-MM-DD`). Posty z datą w przyszłości **nie pojawiają się** dopóki data nie minie. GitHub Actions rebuilduje site codziennie o 03:00 UTC, więc zaplanowany post wejdzie automatycznie bez ręcznego commita.
- `tags` — lista tagów (kebab-case). Nowe tagi same pojawią się na pasku filtrów i dostaną własną stronę `/blog/tag/<tag>/`.
- `lang` — `pl` albo `en`. Musi zgadzać się z katalogiem, w którym leży plik.
- `readingTime` — liczba minut, szacunkowy czas czytania.

### 3. Treść

Zwykły Markdown. Obsługiwane:

- Nagłówki `##`, `###` — automatycznie trafiają do TOC w layoucie posta.
- Fenced code blocks z nazwą języka — podświetlanie przez Shiki (`github-light` / `github-dark-dimmed`, zawijanie włączone).
- Obrazki: umieszczaj w `public/` i linkuj jako `/nazwa.png`.

### 4. Podgląd i publikacja

```sh
npm run dev                # sprawdź wpis lokalnie na http://localhost:4321/pl/blog/<slug>/
npx playwright test        # opcjonalnie — testy e2e
git add src/content/blog && git commit -m "post: <slug>"
git push                   # master → GitHub Actions → Pages
```

Dla posta zaplanowanego na przyszłość wystarczy pushnąć z datą w przyszłości — daily cron w `.github/workflows/deploy.yml` opublikuje go automatycznie, gdy data nadejdzie.

## Struktura projektu

Szczegóły architektoniczne (i18n, konwencja slugów, scheduled publishing, deploy) są w [`CLAUDE.md`](./CLAUDE.md).
