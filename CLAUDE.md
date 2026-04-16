# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

`quality-blog` — dwujęzyczny (PL/EN) blog o smart home i AI zbudowany na **Astro 6** (static site, content collections). Deployowany na GitHub Pages (`quality-blog.eu`). Użytkownik: Grzegorz Holak. Komunikacja po polsku.

## Komendy

```sh
npm run dev       # dev server na localhost:4321
npm run build     # build do ./dist/
npm run preview   # preview builda (też używane przez Playwright webServer)
npx playwright test                          # wszystkie testy e2e
npx playwright test tests/e2e/blog.spec.ts   # pojedynczy plik
npx playwright test -g "nazwa testu"         # pojedynczy test po nazwie
```

Wymaga Node >= 22.12.0. Playwright automatycznie odpala `npm run preview` na porcie 4321 (`reuseExistingServer: true`).

## Architektura (high-level)

### i18n jako pierwsza zasada organizacji

Cała struktura routingu i treści jest zduplikowana per locale (`pl`, `en`). `defaultLocale: 'pl'` z `prefixDefaultLocale: true` — każdy URL ma prefix (`/pl/...`, `/en/...`).

- **`src/pages/pl/*`** i **`src/pages/en/*`** — zwierciadlane drzewa stron. Zmiana strony zazwyczaj wymaga edycji **obu** odpowiedników.
- **`src/pages/index.astro`** — root `/` serwuje treść PL bezpośrednio (bez redirectu). `netlify.toml` robi 302 → `/pl/` (dla wariantu Netlify; GH Pages tego nie używa).
- **`src/i18n/translations.ts`** — jedyne źródło stringów UI. Dodając tekst do UI, dopisz klucz do obu `pl` i `en`.

### Content collection `blog`

Zdefiniowana w `src/content.config.ts`. Ładowana glob-em `**/*.md` z `./src/content/blog`, więc plik `src/content/blog/pl/foo.md` ma `id = "pl/foo"`.

Schema (Zod) wymusza: `title`, `description`, `date` (Date), `tags` (string[]), `lang` ('pl'|'en'), `readingTime` (number).

Konwencja slugów: strony blogowe zdejmują prefix języka z `post.id` (`post.id.replace(/^[a-z]{2}\//, '')`) żeby dostać slug używany w URL `/pl/blog/<slug>/`. Ten sam pattern występuje w `[...slug].astro`, `index.astro`, `rss.xml.ts` — zachować przy zmianach.

### Scheduled publishing

Listingi i RSS filtrują `post.data.date <= now`. Post z datą w przyszłości **nie pojawia się** dopóki data nie minie. GitHub Actions rebuilduje site codziennie (`cron: '0 3 * * *'` w `.github/workflows/deploy.yml`), co publikuje zaplanowane wpisy bez ręcznego commita.

### Deploy

- **Produkcja**: GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages. Trigger: push na `master` + daily cron.
- **Netlify config** (`netlify.toml`) istnieje jako alternatywa, ale nie jest głównym deployem.
- `site: 'https://quality-blog.eu'` w `astro.config.mjs` — zmiana wpływa na RSS i absolutne URL-e.

### Komponenty i layouty

- `src/layouts/BaseLayout.astro` — shell strony (nav/footer + `<head>` z fontami Fraunces/Manrope/JetBrains Mono).
- `src/layouts/BlogPost.astro` — layout postu (hero, TOC, meta, related).
- `src/components/PostCard.astro`, `Tag.astro`, `RelatedPosts.astro`, `Nav.astro`, `Footer.astro`.
- `src/styles/global.css` — design tokens (CSS custom properties dla kolorów, kroku typograficznego, kategorii tagów przez `data-cat`). Tematyka light/dark + dual accent.

### Filtrowanie po tagach

Lista bloga (`/{locale}/blog/`) ma client-side filter po tagach (chips + query string `?tag=X`). Logika w `<script>` na dole `src/pages/pl/blog/index.astro` (i odpowiednika EN). Dodatkowo istnieją statyczne strony per tag: `src/pages/{locale}/blog/tag/[tag].astro`.

## Konwencje pracy

- **Dodając post**: utwórz `src/content/blog/<lang>/<slug>.md` z kompletem frontmattera wymaganym przez schema. Build padnie jeśli pole nie pasuje do Zod.
- **Dodając tłumaczenie UI**: najpierw klucz w `src/i18n/translations.ts` (oba locale), potem użycie `t(locale).section.key` w komponencie.
- **Dodając stronę**: duplikuj w `src/pages/pl/` i `src/pages/en/`. Przykład: `about.astro` (EN) vs `o-projekcie.astro` (PL) — nazwa pliku może być zlokalizowana.
- Po zmianach w stronach/treści uruchom `npx playwright test` — testy pokrywają redirect root→/pl/, hero/posts na obu locale, obecność nav/footer.
