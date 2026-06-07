# AGENTS.md / CLAUDE.md

Instrukcje dla agentów pracujących w tym repozytorium. `AGENTS.md` i `CLAUDE.md` powinny pozostawać zsynchronizowane. Komunikacja z użytkownikiem: po polsku.

## Projekt

`quality-blog` - dwujęzyczny (PL/EN) blog o smart home i AI zbudowany na **Astro 6** (static site, content collections). Produkcja działa na GitHub Pages pod `https://quality-blog.eu`. Użytkownik: Grzegorz Holak.

## Komendy

```sh
npm run dev       # dev server na localhost:4321
npm run build     # build do ./dist/
npm run preview   # preview builda, używany też przez Playwright webServer
npx playwright test                          # wszystkie testy e2e
npx playwright test tests/e2e/blog.spec.ts   # pojedynczy plik
npx playwright test tests/e2e/seo.spec.ts    # SEO / LLM discoverability
npx playwright test -g "nazwa testu"         # pojedynczy test po nazwie
```

Wymaga Node >= 22.12.0. Playwright automatycznie odpala `npm run preview` na porcie 4321 (`reuseExistingServer: true`).

## Architektura

### i18n jako pierwsza zasada organizacji

Cała struktura routingu i treści jest zduplikowana per locale (`pl`, `en`). `defaultLocale: 'pl'` z `prefixDefaultLocale: true` - każdy lokalizowany URL ma prefix (`/pl/...`, `/en/...`).

- `src/pages/pl/*` i `src/pages/en/*` - zwierciadlane drzewa stron. Zmiana strony zazwyczaj wymaga edycji obu odpowiedników.
- `src/pages/index.astro` - root `/` serwuje treść PL bez widocznego redirectu. Kanonicznym odpowiednikiem tej treści jest `/pl/`.
- `src/i18n/translations.ts` - źródło stringów UI. Dodając tekst do UI, dopisz klucz do obu `pl` i `en`.

### Content collection `blog`

Zdefiniowana w `src/content.config.ts`. Ładowana globem `**/*.md` z `./src/content/blog`, więc plik `src/content/blog/pl/foo.md` ma `id = "pl/foo"`.

Schema (Zod) wymusza: `title`, `description`, `date` (Date), `tags` (string[]), `lang` (`'pl'|'en'`), `readingTime` (number), `author` (`'GH'|'JS'`).

Slug wpisu powstaje przez zdjęcie prefiksu języka z `post.id`. Używaj helpera `postSlug()` z `src/lib/seo.ts` zamiast powielać regex w nowych miejscach. URL wpisu ma format `/{locale}/blog/<slug>/`.

### Scheduled publishing

Treści z datą w przyszłości nie powinny pojawiać się publicznie przed datą publikacji. Listingi, RSS, sitemap, `llms.txt`, `llms-full.txt` oraz strony wpisów filtrują `post.data.date <= now` przez helper `isPublished()` z `src/lib/seo.ts`. GitHub Actions rebuilduje site codziennie (`cron: '0 3 * * *'` w `.github/workflows/deploy.yml`), co publikuje zaplanowane wpisy bez ręcznego commita.

### SEO, AEO i LLM discoverability

Centralna logika SEO jest w `src/lib/seo.ts`. Przy zmianach SEO używaj helperów stamtąd zamiast rozrzucać własne funkcje po stronach.

- `src/layouts/BaseLayout.astro` odpowiada za `<title>`, meta description, robots, canonical, OpenGraph, Twitter, RSS alternate, `hreflang`, `x-default` i wstrzykiwanie JSON-LD.
- `src/layouts/BlogPost.astro` przyjmuje `canonicalPath`, `alternatePaths` i `jsonLd`; nie ustawiaj na sztywno `currentPath="/blog"` dla wpisów.
- `src/pages/sitemap.xml.ts` generuje XML sitemap z URL-ami opublikowanych stron, `lastmod` i alternatami językowymi (`xhtml:link`).
- `src/pages/robots.txt.ts` wskazuje sitemap i jawnie pozwala Google/Bing oraz crawlerom AI/search (`OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `PerplexityBot`, `Google-Extended`, `CCBot`).
- `src/pages/llms.txt.ts` to krótka mapa strony dla modeli LLM.
- `src/pages/llms-full.txt.ts` to pełniejszy katalog opublikowanych artykułów dla retrieval/AI search.
- JSON-LD obejmuje `Organization`, `WebSite`, `Blog`, `BlogPosting`, `BreadcrumbList`, `AboutPage`. Przy zmianie informacji o autorach, Quality Cat lub powiązaniach zawodowych aktualizuj też `organizationJsonLd()` i odpowiednie testy.

### About / entity identity

Strony `src/pages/pl/o-projekcie.astro` i `src/pages/en/about.astro` muszą naturalnie i jawnie utrzymywać te informacje:

- Quality Cat to Grzegorz Holak i Julia Sielska.
- Grzegorz Holak łączy perspektywę Quality Cat z doświadczeniami z Sii Polska oraz Santander Corporate & Investment Banking.
- Julia Sielska wnosi perspektywę Quality Cat i ABB Polska.
- Konrad "Gumiś" Gomulski jest przyjacielem ekipy / stałym rozmówcą i wnosi świeże spojrzenie oraz doświadczenie z Sii Polska.

Nie sugeruj oficjalnego partnerstwa, sponsoringu ani afiliacji marek z blogiem, jeśli użytkownik tego wprost nie chce. Formułuj to jako kontekst doświadczeń osób. Unikaj dublowania Konrada w dwóch sąsiadujących akapitach.

### Deploy

- Produkcja: GitHub Actions (`.github/workflows/deploy.yml`) -> GitHub Pages. Trigger: push na `master` + daily cron.
- `netlify.toml` istnieje jako alternatywa, ale główny deploy to GitHub Pages.
- `site: 'https://quality-blog.eu'` w `astro.config.mjs` wpływa na RSS, sitemap, canonicale i absolutne URL-e.

### Komponenty i layouty

- `src/layouts/BaseLayout.astro` - shell strony, nawigacja, footer, metadane SEO i JSON-LD.
- `src/layouts/BlogPost.astro` - layout wpisu, hero, TOC, meta, related posts, copy buttons i wrappery tabel.
- `src/components/PostCard.astro`, `Tag.astro`, `RelatedPosts.astro`, `Nav.astro`, `Footer.astro`.
- `src/styles/global.css` - design tokens, light/dark theme, Shiki code blocks, kategorie tagów przez `data-cat`.
- Shiki jest skonfigurowane w `astro.config.mjs` (`github-light`, `github-dark-dimmed`). Czytelność kodu w ciemnym trybie jest regresyjnie testowana w `tests/e2e/blog.spec.ts`.

### Filtrowanie po tagach

Lista bloga (`/{locale}/blog/`) ma client-side filter po tagach (chips + query string `?tag=X`). Logika siedzi w `<script>` na dole `src/pages/pl/blog/index.astro` i `src/pages/en/blog/index.astro`. Statyczne strony per tag są w `src/pages/{locale}/blog/tag/[tag].astro`; slugi tagów powinny używać `tagSlug()` z `src/lib/seo.ts`.

## Konwencje pracy

- Dodając post: utwórz `src/content/blog/<lang>/<slug>.md` z kompletem frontmattera wymaganym przez schema, w tym `author: GH` dla wpisów AI oraz `author: JS` dla wpisów smart home / Home Assistant.
- Data publikacji: tylko dni robocze (pn-pt). Weekend pomijaj - jeśli kandydująca data wypada w sobotę/niedzielę, przesuń `date` na najbliższy poniedziałek. PL i EN siblings dzielą tę samą datę.
- Sloty tematyczne wg dnia tygodnia (reguła domyślna): **poniedziałki** to seria „AI w Smart Home" (`author: [JS, GH]`); **wtorki** to wpisy Filipa Barszcza - seria QA Leadership / metryki QA (`author: FB`); **piątki** to seria „AI w codziennym życiu" (`author: [JS, GH]`). Pozostałe dni robocze (śr, czw) to wpisy pojedyncze, zwykle `author: GH`. Nadrzędny wyjątek: jeśli użytkownik wprost wskaże, że w danej dacie ma być coś wbrew tej regule, jego wskazówka ma pierwszeństwo.
- Święta: tak samo jak weekend. Polskie wolne dni: 1.01, 6.01, Wielkanoc (Pn), 1.05, 3.05, Boże Ciało (czw, ruchome), 15.08, 1.11, 11.11, 25.12, 26.12. Dla świąt ruchomych policz datę dla danego roku.
- Dodając tłumaczenie UI: najpierw klucz w `src/i18n/translations.ts` (oba locale), potem użycie `t(locale).section.key` w komponencie.
- Dodając stronę: duplikuj w `src/pages/pl/` i `src/pages/en/`. Nazwa pliku może być zlokalizowana, np. `about.astro` (EN) vs `o-projekcie.astro` (PL).
- Po zmianach w stronach, layoutach, treści, SEO lub LLM endpointach uruchom `npm run build` i `npx playwright test`.
- **Myślniki: tylko krótkie `-` (hyphen, U+002D).** Nie używaj em-dasha `—` (U+2014) ani en-dasha `–` (U+2013) - ani w treści postów, ani w tytułach, opisach, frontmatterze, komponentach, tłumaczeniach UI ani docs. Dotyczy wszystkich plików w repo (md, astro, ts, css, json, yml). Jeśli model AI wstawia szerokie myślniki przy generowaniu treści, zamień je na hyphen przed commitem.
- **Polskie posty unikają angielskich wstawek.** W treści `src/content/blog/pl/**` pisz po polsku - nie wstawiaj angielskich słów ani fraz, jeśli istnieje naturalny polski odpowiednik. Wyjątki:
  - Nazwy własne i produkty: Jira, Confluence, Java, Astro, ChatGPT, Claude, GitHub, Slack, Anthropic, OpenAI itp.
  - Akronimy zakorzenione w branży: MCP, RAG, ADR, DLP, CI/CD, OS, QA, API.
  - Pojęcia ukute w tekście jako nazwy konceptów (np. "agentic OS", "Life OS", "hooks" jako warstwa na poziomie 8 Skali Holaka) - traktuj je jak nazwy własne.
  - Loanwordy mocno zakorzenione w polskim IT bez sensownego odpowiednika (np. "smart home", "framework").
  Tłumacz: "guardrails", "human review", "approval", "evals", "compliance", "governance", "identity", "logging", "shadow AI", "model awareness", "custom instructions", "overengineering", "release notes", "pull request", "dashboard", "anti-pattern", role agentów (researcher → badacz, developer → programista, reviewer → recenzent, release manager → menedżer wydań). Jeśli musisz użyć terminu po angielsku dla jednoznaczności, podaj polski odpowiednik w nawiasie. Wersja EN (`src/content/blog/en/**`) pozostaje pełna i naturalna po angielsku - reguła dotyczy tylko PL.

## Git workflow

**Po każdej zakończonej zmianie w tym repo: zawsze commit + push w tej samej turze, bez pytania użytkownika.** Reguła obowiązuje dla wszystkich edytów (treść, kod, layout, SEO, docs). Nie zostawiaj zmian w stagingu ani lokalnym working tree na koniec turę.

Każdy folder, który jest repo gita (`ls .git` zwraca obecny katalog), wymaga po zakończonych zmianach:

1. `git status` - sanity check
2. `git add <pliki>` - staging konkretnych plików, nie używaj bezmyślnie `git add .`
3. `git commit -m "krótki temat w trybie rozkazującym"`
4. `git push`

Zasady:

- Jeden temat = jeden commit. Nie mieszaj refactoru z fixem.
- Wiadomość: po polsku lub angielsku zgodnie z konwencją repo.
- Pre-commit hooki: jeśli failują, popraw przyczynę. Nie skipuj `--no-verify`.
- Push na `master` może wypisać ostrzeżenia o bypassie reguł ochrony brancha; po pushu sprawdź, czy `HEAD` i `origin/master` wskazują ten sam commit.
- Po zmianach w sub-projekcie sprawdź też repo nadrzędne, jeśli istnieje.
