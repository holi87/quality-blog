# Quality Cat Knowledge Hub — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (PL/EN) knowledge-sharing blog for Quality Cat using Astro, with dark zinc theme, orange accent, deployed as a static site.

**Architecture:** Astro static site with Content Collections for Markdown blog posts, directory-based i18n routing (`/pl/...`, `/en/...`), component-driven layout (Nav, Footer, PostCard), and global CSS custom properties for theming.

**Tech Stack:** Astro 5, TypeScript, Playwright (E2E tests)

**Working directory:** `/Users/grzegorzholak/Desktop/GenAI/quality-blog`

---

## File Structure

```
quality-blog/
├── astro.config.mjs          # Astro config with i18n
├── package.json
├── tsconfig.json
├── public/
│   └── favicon.svg
├── src/
│   ├── content/
│   │   └── config.ts          # Content collection schema
│   ├── content/blog/
│   │   ├── pl/
│   │   │   ├── home-assistant-2026.md
│   │   │   └── prompty-ai.md
│   │   └── en/
│   │       ├── home-assistant-2026.md
│   │       └── ai-prompts.md
│   ├── i18n/
│   │   └── translations.ts   # UI string translations
│   ├── styles/
│   │   └── global.css         # Theme variables + base styles
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   └── TagBadge.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro   # HTML shell, head, global styles
│   │   └── BlogPost.astro     # Single post layout
│   └── pages/
│       ├── index.astro        # Redirect to /pl/
│       ├── pl/
│       │   ├── index.astro    # Homepage PL
│       │   ├── blog/
│       │   │   ├── index.astro
│       │   │   └── [...slug].astro
│       │   └── o-projekcie.astro
│       └── en/
│           ├── index.astro    # Homepage EN
│           ├── blog/
│           │   ├── index.astro
│           │   └── [...slug].astro
│           └── about.astro
├── tests/
│   └── e2e/
│       ├── homepage.spec.ts
│       ├── blog.spec.ts
│       └── i18n.spec.ts
└── playwright.config.ts
```

---

## Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`

- [ ] **Step 1: Scaffold Astro project**

Run from `quality-blog/`:

```bash
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

Use `--no-git` because git is already initialized. If prompted to overwrite, accept.

- [ ] **Step 2: Verify project builds**

```bash
npm run build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 3: Add `.gitignore`**

Create `.gitignore`:

```
node_modules/
dist/
.astro/
.superpowers/
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json src/ .gitignore
git commit -m "chore: initialize Astro project"
```

---

## Task 2: Global Theme and Base Layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create global CSS with theme variables**

Create `src/styles/global.css`:

```css
:root {
  --bg-primary: #18181b;
  --bg-card: #27272a;
  --border-card: #3f3f46;
  --accent: #f97316;
  --text-heading: #fafafa;
  --text-primary: #d4d4d8;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --font-sans: -apple-system, 'Segoe UI', system-ui, sans-serif;
  --max-width: 1100px;
}

*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  max-width: 100%;
  height: auto;
}
```

- [ ] **Step 2: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  lang?: string;
}

const { title, description = 'Dzielimy się wiedzą o smart home i AI', lang = 'pl' } = Astro.props;
---

<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} | qualitycat / wiedza</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Create a simple favicon**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#18181b"/>
  <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="18" fill="#f97316">Q</text>
</svg>
```

- [ ] **Step 4: Update `src/pages/index.astro` to use BaseLayout**

Replace contents of `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Strona główna">
  <h1>Quality Cat — Knowledge Hub</h1>
</BaseLayout>
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/styles/ src/layouts/ src/pages/index.astro public/favicon.svg
git commit -m "feat: add global theme and base layout"
```

---

## Task 3: i18n Setup and Translations

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/i18n/translations.ts`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Configure Astro i18n routing**

Replace `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
```

- [ ] **Step 2: Create translations file**

Create `src/i18n/translations.ts`:

```ts
const translations = {
  pl: {
    nav: {
      home: 'Strona główna',
      blog: 'Blog',
      about: 'O projekcie',
    },
    hero: {
      title: 'Dzielimy się wiedzą o',
      highlight1: 'smart home',
      and: 'i',
      highlight2: 'AI',
      description: 'Praktyczne poradniki, artykuły i porady — od automatyzacji domu po sztuczną inteligencję. Wszystko za darmo, bez marketingowego szumu.',
    },
    posts: {
      latest: 'Ostatnie wpisy',
      readingTime: 'min czytania',
      readMore: 'Czytaj więcej',
      allPosts: 'Wszystkie wpisy',
    },
    footer: {
      madeBy: 'Projekt prowadzony przez',
    },
    about: {
      title: 'O projekcie',
    },
  },
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog',
      about: 'About',
    },
    hero: {
      title: 'We share knowledge about',
      highlight1: 'smart home',
      and: 'and',
      highlight2: 'AI',
      description: 'Practical guides, articles and tips — from home automation to artificial intelligence. All free, no marketing fluff.',
    },
    posts: {
      latest: 'Latest posts',
      readingTime: 'min read',
      readMore: 'Read more',
      allPosts: 'All posts',
    },
    footer: {
      madeBy: 'A project by',
    },
    about: {
      title: 'About',
    },
  },
} as const;

export type Locale = keyof typeof translations;

export function t(locale: Locale) {
  return translations[locale];
}

export function getLocalePath(locale: Locale, path: string) {
  return `/${locale}${path}`;
}
```

- [ ] **Step 3: Update root index to redirect to /pl/**

Replace `src/pages/index.astro`:

```astro
---
return Astro.redirect('/pl/');
---
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs src/i18n/ src/pages/index.astro
git commit -m "feat: configure i18n with PL/EN translations"
```

---

## Task 4: Nav and Footer Components

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create Nav component**

Create `src/components/Nav.astro`:

```astro
---
import { t, getLocalePath, type Locale } from '../i18n/translations';

interface Props {
  locale: Locale;
  currentPath?: string;
}

const { locale, currentPath = '' } = Astro.props;
const strings = t(locale);
const otherLocale = locale === 'pl' ? 'en' : 'pl';
---

<nav>
  <a href={getLocalePath(locale, '/')} class="logo">
    quality<span>cat</span> / wiedza
  </a>
  <div class="nav-links">
    <a href={getLocalePath(locale, '/')} class:list={[{ active: currentPath === '/' || currentPath === '' }]}>
      {strings.nav.home}
    </a>
    <a href={getLocalePath(locale, '/blog/')} class:list={[{ active: currentPath.startsWith('/blog') }]}>
      {strings.nav.blog}
    </a>
    <a href={getLocalePath(locale, locale === 'pl' ? '/o-projekcie/' : '/about/')} class:list={[{ active: currentPath.includes('o-projekcie') || currentPath.includes('about') }]}>
      {strings.nav.about}
    </a>
    <a href={getLocalePath(otherLocale, '/')} class="lang-switch">
      {locale === 'pl' ? 'EN' : 'PL'}
    </a>
  </div>
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .logo {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-heading);
    letter-spacing: -0.5px;
  }
  .logo span {
    color: var(--accent);
  }
  .nav-links {
    display: flex;
    gap: 28px;
    font-size: 14px;
    align-items: center;
  }
  .nav-links a {
    color: var(--text-secondary);
    transition: color 0.2s;
  }
  .nav-links a:hover {
    color: var(--text-heading);
  }
  .nav-links a.active {
    color: var(--accent);
  }
  .lang-switch {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    color: var(--text-secondary) !important;
    cursor: pointer;
  }
  .lang-switch:hover {
    border-color: var(--accent);
  }

  @media (max-width: 768px) {
    nav {
      padding: 16px 20px;
    }
    .nav-links {
      gap: 16px;
    }
  }
</style>
```

- [ ] **Step 2: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
import { t, type Locale } from '../i18n/translations';

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const strings = t(locale);
---

<footer>
  <span>{strings.footer.madeBy} <a href="https://qualitycat.pl" target="_blank" rel="noopener">Quality Cat</a></span>
  <span>&copy; {new Date().getFullYear()}</span>
</footer>

<style>
  footer {
    border-top: 1px solid var(--bg-card);
    padding: 30px 40px;
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--text-muted);
  }
  footer a {
    color: var(--accent);
  }
  footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    footer {
      padding: 20px;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
```

- [ ] **Step 3: Add Nav and Footer to BaseLayout**

Replace `src/layouts/BaseLayout.astro`:

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import type { Locale } from '../i18n/translations';

interface Props {
  title: string;
  description?: string;
  locale?: Locale;
  currentPath?: string;
}

const {
  title,
  description = 'Dzielimy się wiedzą o smart home i AI',
  locale = 'pl',
  currentPath = '',
} = Astro.props;
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} | qualitycat / wiedza</title>
  </head>
  <body>
    <Nav locale={locale} currentPath={currentPath} />
    <main>
      <slot />
    </main>
    <Footer locale={locale} />
  </body>
</html>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/layouts/BaseLayout.astro
git commit -m "feat: add Nav and Footer components with i18n"
```

---

## Task 5: Content Collection Schema

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Define blog collection schema**

Create `src/content/config.ts`:

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    lang: z.enum(['pl', 'en']),
    readingTime: z.number(),
  }),
});

export const collections = { blog };
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds (no posts yet, empty collection is fine).

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "feat: define blog content collection schema"
```

---

## Task 6: Sample Blog Posts

**Files:**
- Create: `src/content/blog/pl/home-assistant-2026.md`
- Create: `src/content/blog/pl/prompty-ai.md`
- Create: `src/content/blog/en/home-assistant-2026.md`
- Create: `src/content/blog/en/ai-prompts.md`

- [ ] **Step 1: Create PL post — Home Assistant**

Create `src/content/blog/pl/home-assistant-2026.md`:

```markdown
---
title: "Jak zacząć z Home Assistant w 2026 roku"
description: "Kompletny przewodnik dla początkujących — od wyboru sprzętu po pierwszą automatyzację."
date: 2026-04-12
tags: ["smart-home", "home-assistant"]
lang: pl
readingTime: 5
---

## Czym jest Home Assistant?

Home Assistant to otwartoźródłowa platforma do automatyzacji domu. Pozwala zarządzać wszystkimi urządzeniami smart home z jednego miejsca — niezależnie od producenta.

## Od czego zacząć?

### 1. Wybierz sprzęt

Najprostszy start to **Home Assistant Green** — gotowe urządzenie, które wystarczy podłączyć do routera. Alternatywnie możesz zainstalować HA na Raspberry Pi 4/5 lub jako maszynę wirtualną.

### 2. Pierwsza integracja

Po uruchomieniu HA automatycznie wykryje urządzenia w Twojej sieci. Zacznij od czegoś prostego — na przykład inteligentnej żarówki Zigbee.

### 3. Pierwsza automatyzacja

```yaml
automation:
  - alias: "Wyłącz światła o północy"
    trigger:
      - platform: time
        at: "00:00:00"
    action:
      - service: light.turn_off
        target:
          entity_id: all
```

## Podsumowanie

Home Assistant w 2026 roku jest łatwiejszy niż kiedykolwiek. Społeczność jest ogromna, integracji jest ponad 2000, a start zajmuje dosłownie kilkanaście minut.
```

- [ ] **Step 2: Create PL post — AI Prompts**

Create `src/content/blog/pl/prompty-ai.md`:

```markdown
---
title: "5 promptów, które zmienią Twoją pracę z AI"
description: "Sprawdzone techniki prompt engineeringu, które możesz zastosować od razu."
date: 2026-04-08
tags: ["ai", "prompt-engineering"]
lang: pl
readingTime: 3
---

## Dlaczego prompty mają znaczenie?

Różnica między przeciętnym a świetnym wynikiem z AI to często kwestia jednego dobrze napisanego promptu.

## 5 sprawdzonych technik

### 1. Nadaj rolę

Zamiast: *"Napisz mi email"*
Napisz: *"Jesteś doświadczonym copywriterem B2B. Napisz email..."*

### 2. Podaj przykład

Pokaż AI dokładnie jakiego formatu oczekujesz. Jeden dobry przykład jest wart więcej niż paragraf opisu.

### 3. Myśl krok po kroku

Dodaj *"Myśl krok po kroku"* do złożonych zadań. AI będzie lepiej strukturyzować swoje rozumowanie.

### 4. Ogranicz zakres

*"Odpowiedz w maksymalnie 3 zdaniach"* — proste ograniczenie, ale dramatycznie poprawia jakość odpowiedzi.

### 5. Iteruj

Pierwszy wynik rzadko jest idealny. Traktuj rozmowę z AI jak współpracę — dawaj feedback, doprecyzowuj.
```

- [ ] **Step 3: Create EN post — Home Assistant**

Create `src/content/blog/en/home-assistant-2026.md`:

```markdown
---
title: "Getting Started with Home Assistant in 2026"
description: "A complete beginner's guide — from choosing hardware to your first automation."
date: 2026-04-12
tags: ["smart-home", "home-assistant"]
lang: en
readingTime: 5
---

## What is Home Assistant?

Home Assistant is an open-source home automation platform. It lets you manage all your smart home devices from one place — regardless of the manufacturer.

## Where to start?

### 1. Choose your hardware

The easiest start is **Home Assistant Green** — a ready-made device you just plug into your router. Alternatively, you can install HA on a Raspberry Pi 4/5 or as a virtual machine.

### 2. First integration

After starting HA, it will automatically discover devices on your network. Start with something simple — like a Zigbee smart bulb.

### 3. First automation

```yaml
automation:
  - alias: "Turn off lights at midnight"
    trigger:
      - platform: time
        at: "00:00:00"
    action:
      - service: light.turn_off
        target:
          entity_id: all
```

## Summary

Home Assistant in 2026 is easier than ever. The community is huge, there are over 2000 integrations, and getting started takes literally minutes.
```

- [ ] **Step 4: Create EN post — AI Prompts**

Create `src/content/blog/en/ai-prompts.md`:

```markdown
---
title: "5 Prompts That Will Change How You Work with AI"
description: "Proven prompt engineering techniques you can apply right away."
date: 2026-04-08
tags: ["ai", "prompt-engineering"]
lang: en
readingTime: 3
---

## Why do prompts matter?

The difference between an average and a great AI result often comes down to one well-written prompt.

## 5 proven techniques

### 1. Assign a role

Instead of: *"Write me an email"*
Write: *"You are an experienced B2B copywriter. Write an email..."*

### 2. Give an example

Show AI exactly what format you expect. One good example is worth more than a paragraph of description.

### 3. Think step by step

Add *"Think step by step"* to complex tasks. The AI will better structure its reasoning.

### 4. Limit scope

*"Answer in 3 sentences maximum"* — a simple constraint that dramatically improves response quality.

### 5. Iterate

The first result is rarely perfect. Treat your conversation with AI as a collaboration — give feedback, refine.
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: Build succeeds, content collections are parsed.

- [ ] **Step 6: Commit**

```bash
git add src/content/blog/
git commit -m "content: add sample blog posts in PL and EN"
```

---

## Task 7: PostCard and TagBadge Components

**Files:**
- Create: `src/components/PostCard.astro`
- Create: `src/components/TagBadge.astro`

- [ ] **Step 1: Create TagBadge component**

Create `src/components/TagBadge.astro`:

```astro
---
interface Props {
  tag: string;
}

const { tag } = Astro.props;
---

<span class="tag-badge">{tag}</span>

<style>
  .tag-badge {
    background: var(--border-card);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    color: var(--text-primary);
    display: inline-block;
  }
</style>
```

- [ ] **Step 2: Create PostCard component**

Create `src/components/PostCard.astro`:

```astro
---
import TagBadge from './TagBadge.astro';
import type { Locale } from '../i18n/translations';
import { t } from '../i18n/translations';

interface Props {
  title: string;
  description: string;
  date: Date;
  readingTime: number;
  tags: string[];
  slug: string;
  locale: Locale;
}

const { title, description, date, readingTime, tags, slug, locale } = Astro.props;
const strings = t(locale);

const formattedDate = date.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
---

<a href={`/${locale}/blog/${slug}/`} class="post-card">
  <div class="post-meta">
    <span>{formattedDate}</span>
    <span>{readingTime} {strings.posts.readingTime}</span>
  </div>
  <h3>{title}</h3>
  <p>{description}</p>
  <div class="post-tags">
    {tags.slice(0, 2).map((tag) => <TagBadge tag={tag} />)}
  </div>
</a>

<style>
  .post-card {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
    display: block;
  }
  .post-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }
  .post-meta {
    font-size: 12px;
    color: var(--text-muted);
    margin-bottom: 10px;
    display: flex;
    gap: 12px;
  }
  h3 {
    font-size: 17px;
    color: var(--text-heading);
    font-weight: 600;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  p {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  .post-tags {
    margin-top: 12px;
    display: flex;
    gap: 6px;
  }
</style>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.astro src/components/TagBadge.astro
git commit -m "feat: add PostCard and TagBadge components"
```

---

## Task 8: Homepage (PL + EN)

**Files:**
- Create: `src/pages/pl/index.astro`
- Create: `src/pages/en/index.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create PL homepage**

Create `src/pages/pl/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { getCollection } from 'astro:content';
import { t } from '../../i18n/translations';

const locale = 'pl';
const strings = t(locale);

const posts = (await getCollection('blog', ({ data }) => data.lang === locale))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 6);

const tags = ['Home Assistant', 'Claude / ChatGPT', 'Automatyzacja', 'IoT', 'Prompt Engineering'];
---

<BaseLayout title={strings.nav.home} locale={locale} currentPath="/">
  <section class="hero">
    <h1>
      {strings.hero.title} <span class="highlight">{strings.hero.highlight1}</span>
      {' '}{strings.hero.and}{' '}
      <span class="highlight">{strings.hero.highlight2}</span>
    </h1>
    <div class="hero-divider"></div>
    <p>{strings.hero.description}</p>
    <div class="tags">
      {tags.map((tag) => <span class="tag">{tag}</span>)}
    </div>
  </section>

  <section class="posts">
    <div class="section-title">{strings.posts.latest}</div>
    <div class="posts-grid">
      {posts.map((post) => (
        <PostCard
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          readingTime={post.data.readingTime}
          tags={post.data.tags}
          slug={post.slug}
          locale={locale}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    text-align: center;
    padding: 80px 40px 60px;
    max-width: 700px;
    margin: 0 auto;
  }
  .hero h1 {
    font-size: 40px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
    line-height: 1.2;
  }
  .highlight {
    color: var(--accent);
  }
  .hero-divider {
    width: 50px;
    height: 3px;
    background: var(--accent);
    margin: 30px auto;
    border-radius: 2px;
  }
  .hero p {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.7;
  }
  .tags {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .tag {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    color: var(--text-primary);
  }
  .posts {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 40px 40px 60px;
  }
  .section-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-muted);
    margin-bottom: 24px;
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 40px 20px 30px;
    }
    .hero h1 {
      font-size: 28px;
    }
    .posts {
      padding: 20px;
    }
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create EN homepage**

Create `src/pages/en/index.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PostCard from '../../components/PostCard.astro';
import { getCollection } from 'astro:content';
import { t } from '../../i18n/translations';

const locale = 'en';
const strings = t(locale);

const posts = (await getCollection('blog', ({ data }) => data.lang === locale))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 6);

const tags = ['Home Assistant', 'Claude / ChatGPT', 'Automation', 'IoT', 'Prompt Engineering'];
---

<BaseLayout title={strings.nav.home} locale={locale} currentPath="/">
  <section class="hero">
    <h1>
      {strings.hero.title} <span class="highlight">{strings.hero.highlight1}</span>
      {' '}{strings.hero.and}{' '}
      <span class="highlight">{strings.hero.highlight2}</span>
    </h1>
    <div class="hero-divider"></div>
    <p>{strings.hero.description}</p>
    <div class="tags">
      {tags.map((tag) => <span class="tag">{tag}</span>)}
    </div>
  </section>

  <section class="posts">
    <div class="section-title">{strings.posts.latest}</div>
    <div class="posts-grid">
      {posts.map((post) => (
        <PostCard
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          readingTime={post.data.readingTime}
          tags={post.data.tags}
          slug={post.slug}
          locale={locale}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .hero {
    text-align: center;
    padding: 80px 40px 60px;
    max-width: 700px;
    margin: 0 auto;
  }
  .hero h1 {
    font-size: 40px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
    line-height: 1.2;
  }
  .highlight {
    color: var(--accent);
  }
  .hero-divider {
    width: 50px;
    height: 3px;
    background: var(--accent);
    margin: 30px auto;
    border-radius: 2px;
  }
  .hero p {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.7;
  }
  .tags {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  .tag {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 13px;
    color: var(--text-primary);
  }
  .posts {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 40px 40px 60px;
  }
  .section-title {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--text-muted);
    margin-bottom: 24px;
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    .hero {
      padding: 40px 20px 30px;
    }
    .hero h1 {
      font-size: 28px;
    }
    .posts {
      padding: 20px;
    }
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Verify build and dev preview**

```bash
npm run build
```

Expected: Build succeeds, `/pl/` and `/en/` pages generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/
git commit -m "feat: add homepage with hero, tags, and posts grid (PL + EN)"
```

---

## Task 9: Blog Listing Page

**Files:**
- Create: `src/pages/pl/blog/index.astro`
- Create: `src/pages/en/blog/index.astro`

- [ ] **Step 1: Create PL blog listing**

Create `src/pages/pl/blog/index.astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';
import { t } from '../../../i18n/translations';

const locale = 'pl';
const strings = t(locale);

const posts = (await getCollection('blog', ({ data }) => data.lang === locale))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const allTags = [...new Set(posts.flatMap((p) => p.data.tags))];
---

<BaseLayout title="Blog" locale={locale} currentPath="/blog">
  <section class="blog-header">
    <h1>Blog</h1>
    <p>{strings.posts.allPosts}</p>
    <div class="tag-filters">
      {allTags.map((tag) => <button class="tag-filter" data-tag={tag}>{tag}</button>)}
    </div>
  </section>

  <section class="blog-list">
    <div class="posts-grid">
      {posts.map((post) => (
        <PostCard
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          readingTime={post.data.readingTime}
          tags={post.data.tags}
          slug={post.slug}
          locale={locale}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .blog-header {
    text-align: center;
    padding: 60px 40px 40px;
    max-width: 700px;
    margin: 0 auto;
  }
  .blog-header h1 {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
  }
  .blog-header p {
    color: var(--text-secondary);
    margin-top: 8px;
  }
  .tag-filters {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .tag-filter {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .tag-filter:hover {
    border-color: var(--accent);
  }
  .blog-list {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 40px 60px;
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    .blog-header {
      padding: 30px 20px 20px;
    }
    .blog-header h1 {
      font-size: 28px;
    }
    .blog-list {
      padding: 0 20px 40px;
    }
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Create EN blog listing**

Create `src/pages/en/blog/index.astro`:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import PostCard from '../../../components/PostCard.astro';
import { getCollection } from 'astro:content';
import { t } from '../../../i18n/translations';

const locale = 'en';
const strings = t(locale);

const posts = (await getCollection('blog', ({ data }) => data.lang === locale))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

const allTags = [...new Set(posts.flatMap((p) => p.data.tags))];
---

<BaseLayout title="Blog" locale={locale} currentPath="/blog">
  <section class="blog-header">
    <h1>Blog</h1>
    <p>{strings.posts.allPosts}</p>
    <div class="tag-filters">
      {allTags.map((tag) => <button class="tag-filter" data-tag={tag}>{tag}</button>)}
    </div>
  </section>

  <section class="blog-list">
    <div class="posts-grid">
      {posts.map((post) => (
        <PostCard
          title={post.data.title}
          description={post.data.description}
          date={post.data.date}
          readingTime={post.data.readingTime}
          tags={post.data.tags}
          slug={post.slug}
          locale={locale}
        />
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .blog-header {
    text-align: center;
    padding: 60px 40px 40px;
    max-width: 700px;
    margin: 0 auto;
  }
  .blog-header h1 {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
  }
  .blog-header p {
    color: var(--text-secondary);
    margin-top: 8px;
  }
  .tag-filters {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .tag-filter {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 13px;
    color: var(--text-primary);
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .tag-filter:hover {
    border-color: var(--accent);
  }
  .blog-list {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 40px 60px;
  }
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 768px) {
    .blog-header {
      padding: 30px 20px 20px;
    }
    .blog-header h1 {
      font-size: 28px;
    }
    .blog-list {
      padding: 0 20px 40px;
    }
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, blog listing pages generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/pl/blog/index.astro src/pages/en/blog/index.astro
git commit -m "feat: add blog listing page with tag filters (PL + EN)"
```

---

## Task 10: Blog Post Page and Layout

**Files:**
- Create: `src/layouts/BlogPost.astro`
- Create: `src/pages/pl/blog/[...slug].astro`
- Create: `src/pages/en/blog/[...slug].astro`

- [ ] **Step 1: Create BlogPost layout**

Create `src/layouts/BlogPost.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import TagBadge from '../components/TagBadge.astro';
import { t, type Locale } from '../i18n/translations';

interface Props {
  title: string;
  description: string;
  date: Date;
  readingTime: number;
  tags: string[];
  locale: Locale;
}

const { title, description, date, readingTime, tags, locale } = Astro.props;
const strings = t(locale);

const formattedDate = date.toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
---

<BaseLayout title={title} description={description} locale={locale} currentPath="/blog">
  <article class="post">
    <header class="post-header">
      <div class="post-meta">
        <span>{formattedDate}</span>
        <span>{readingTime} {strings.posts.readingTime}</span>
      </div>
      <h1>{title}</h1>
      <p class="post-description">{description}</p>
      <div class="post-tags">
        {tags.map((tag) => <TagBadge tag={tag} />)}
      </div>
    </header>
    <div class="post-content">
      <slot />
    </div>
    <footer class="post-footer">
      <a href={`/${locale}/blog/`}>&larr; {strings.posts.allPosts}</a>
    </footer>
  </article>
</BaseLayout>

<style>
  .post {
    max-width: 720px;
    margin: 0 auto;
    padding: 40px 40px 60px;
  }
  .post-header {
    margin-bottom: 40px;
  }
  .post-meta {
    font-size: 13px;
    color: var(--text-muted);
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }
  .post-header h1 {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
    line-height: 1.2;
  }
  .post-description {
    font-size: 18px;
    color: var(--text-secondary);
    margin-top: 12px;
    line-height: 1.6;
  }
  .post-tags {
    margin-top: 16px;
    display: flex;
    gap: 6px;
  }
  .post-content {
    font-size: 16px;
    line-height: 1.8;
    color: var(--text-primary);
  }
  .post-content :global(h2) {
    font-size: 24px;
    font-weight: 700;
    color: var(--text-heading);
    margin-top: 40px;
    margin-bottom: 16px;
  }
  .post-content :global(h3) {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-heading);
    margin-top: 32px;
    margin-bottom: 12px;
  }
  .post-content :global(p) {
    margin-bottom: 16px;
  }
  .post-content :global(code) {
    background: var(--bg-card);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 14px;
  }
  .post-content :global(pre) {
    background: var(--bg-card);
    border: 1px solid var(--border-card);
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    margin-bottom: 16px;
  }
  .post-content :global(pre code) {
    background: none;
    padding: 0;
  }
  .post-content :global(ul),
  .post-content :global(ol) {
    margin-bottom: 16px;
    padding-left: 24px;
  }
  .post-content :global(li) {
    margin-bottom: 8px;
  }
  .post-content :global(em) {
    color: var(--text-secondary);
  }
  .post-content :global(strong) {
    color: var(--text-heading);
  }
  .post-footer {
    margin-top: 60px;
    padding-top: 24px;
    border-top: 1px solid var(--border-card);
  }
  .post-footer a {
    color: var(--accent);
    font-size: 14px;
  }
  .post-footer a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .post {
      padding: 20px;
    }
    .post-header h1 {
      font-size: 28px;
    }
  }
</style>
```

- [ ] **Step 2: Create PL dynamic blog post route**

Create `src/pages/pl/blog/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'pl');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  readingTime={post.data.readingTime}
  tags={post.data.tags}
  locale="pl"
>
  <Content />
</BlogPost>
```

- [ ] **Step 3: Create EN dynamic blog post route**

Create `src/pages/en/blog/[...slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => data.lang === 'en');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  readingTime={post.data.readingTime}
  tags={post.data.tags}
  locale="en"
>
  <Content />
</BlogPost>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds, individual post pages generated (e.g. `/pl/blog/home-assistant-2026/`).

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BlogPost.astro src/pages/pl/blog/ src/pages/en/blog/
git commit -m "feat: add blog post page with dynamic routing (PL + EN)"
```

---

## Task 11: About Page (PL + EN)

**Files:**
- Create: `src/pages/pl/o-projekcie.astro`
- Create: `src/pages/en/about.astro`

- [ ] **Step 1: Create PL about page**

Create `src/pages/pl/o-projekcie.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="O projekcie" locale="pl" currentPath="/o-projekcie">
  <section class="about">
    <h1>O projekcie</h1>
    <div class="about-divider"></div>

    <div class="about-content">
      <p>
        <strong>qualitycat / wiedza</strong> to miejsce, w którym dzielimy się praktyczną wiedzą
        o smart home i sztucznej inteligencji. Bez marketingowego szumu, bez paywalli —
        po prostu przydatne treści.
      </p>

      <h2>Tematyka</h2>
      <ul>
        <li><strong>Smart Home</strong> — Home Assistant, Zigbee, automatyzacje, IoT</li>
        <li><strong>AI</strong> — prompt engineering, narzędzia AI, praktyczne zastosowania</li>
        <li><strong>Automatyzacja</strong> — od domu po procesy biznesowe</li>
      </ul>

      <h2>Kto za tym stoi?</h2>
      <p>
        Ten projekt jest prowadzony przez
        <a href="https://qualitycat.pl" target="_blank" rel="noopener">Quality Cat</a>
        — firmę, która wierzy, że dobra wiedza powinna być dostępna dla każdego.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .about {
    max-width: 650px;
    margin: 0 auto;
    padding: 60px 40px;
  }
  h1 {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
  }
  .about-divider {
    width: 50px;
    height: 3px;
    background: var(--accent);
    margin: 24px 0 32px;
    border-radius: 2px;
  }
  .about-content {
    font-size: 16px;
    line-height: 1.8;
  }
  .about-content p {
    margin-bottom: 20px;
  }
  .about-content h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-heading);
    margin-top: 36px;
    margin-bottom: 12px;
  }
  .about-content ul {
    padding-left: 20px;
    margin-bottom: 20px;
  }
  .about-content li {
    margin-bottom: 8px;
  }
  .about-content a {
    color: var(--accent);
  }
  .about-content a:hover {
    text-decoration: underline;
  }
  .about-content strong {
    color: var(--text-heading);
  }

  @media (max-width: 768px) {
    .about {
      padding: 30px 20px;
    }
    h1 {
      font-size: 28px;
    }
  }
</style>
```

- [ ] **Step 2: Create EN about page**

Create `src/pages/en/about.astro`:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
---

<BaseLayout title="About" locale="en" currentPath="/about">
  <section class="about">
    <h1>About</h1>
    <div class="about-divider"></div>

    <div class="about-content">
      <p>
        <strong>qualitycat / wiedza</strong> is a place where we share practical knowledge
        about smart home and artificial intelligence. No marketing fluff, no paywalls —
        just useful content.
      </p>

      <h2>Topics</h2>
      <ul>
        <li><strong>Smart Home</strong> — Home Assistant, Zigbee, automations, IoT</li>
        <li><strong>AI</strong> — prompt engineering, AI tools, practical applications</li>
        <li><strong>Automation</strong> — from home to business processes</li>
      </ul>

      <h2>Who's behind this?</h2>
      <p>
        This project is run by
        <a href="https://qualitycat.pl" target="_blank" rel="noopener">Quality Cat</a>
        — a company that believes good knowledge should be accessible to everyone.
      </p>
    </div>
  </section>
</BaseLayout>

<style>
  .about {
    max-width: 650px;
    margin: 0 auto;
    padding: 60px 40px;
  }
  h1 {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-heading);
    letter-spacing: -1px;
  }
  .about-divider {
    width: 50px;
    height: 3px;
    background: var(--accent);
    margin: 24px 0 32px;
    border-radius: 2px;
  }
  .about-content {
    font-size: 16px;
    line-height: 1.8;
  }
  .about-content p {
    margin-bottom: 20px;
  }
  .about-content h2 {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-heading);
    margin-top: 36px;
    margin-bottom: 12px;
  }
  .about-content ul {
    padding-left: 20px;
    margin-bottom: 20px;
  }
  .about-content li {
    margin-bottom: 8px;
  }
  .about-content a {
    color: var(--accent);
  }
  .about-content a:hover {
    text-decoration: underline;
  }
  .about-content strong {
    color: var(--text-heading);
  }

  @media (max-width: 768px) {
    .about {
      padding: 30px 20px;
    }
    h1 {
      font-size: 28px;
    }
  }
</style>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds, about pages generated.

- [ ] **Step 4: Commit**

```bash
git add src/pages/pl/o-projekcie.astro src/pages/en/about.astro
git commit -m "feat: add about page (PL + EN)"
```

---

## Task 12: E2E Tests with Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/homepage.spec.ts`
- Create: `tests/e2e/blog.spec.ts`
- Create: `tests/e2e/i18n.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  webServer: {
    command: 'npm run preview',
    port: 4321,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
});
```

- [ ] **Step 3: Create homepage tests**

Create `tests/e2e/homepage.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('root redirects to /pl/', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/pl\//);
  });

  test('PL homepage renders hero and posts', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('h1')).toContainText('smart home');
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('EN homepage renders hero and posts', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('h1')).toContainText('smart home');
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('navigation links are present', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('nav')).toContainText('Blog');
    await expect(page.locator('nav')).toContainText('O projekcie');
  });

  test('footer links to qualitycat.pl', async ({ page }) => {
    await page.goto('/pl/');
    const link = page.locator('footer a[href="https://qualitycat.pl"]');
    await expect(link).toBeVisible();
  });
});
```

- [ ] **Step 4: Create blog tests**

Create `tests/e2e/blog.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('Blog', () => {
  test('PL blog listing shows posts', async ({ page }) => {
    await page.goto('/pl/blog/');
    await expect(page.locator('h1')).toContainText('Blog');
    await expect(page.locator('.post-card').first()).toBeVisible();
  });

  test('clicking a post card opens the post', async ({ page }) => {
    await page.goto('/pl/blog/');
    await page.locator('.post-card').first().click();
    await expect(page).toHaveURL(/\/pl\/blog\/.+/);
    await expect(page.locator('article')).toBeVisible();
  });

  test('blog post has back link', async ({ page }) => {
    await page.goto('/pl/blog/');
    await page.locator('.post-card').first().click();
    const backLink = page.locator('.post-footer a');
    await expect(backLink).toBeVisible();
  });
});
```

- [ ] **Step 5: Create i18n tests**

Create `tests/e2e/i18n.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('i18n', () => {
  test('language switcher navigates to EN', async ({ page }) => {
    await page.goto('/pl/');
    await page.locator('.lang-switch').click();
    await expect(page).toHaveURL(/\/en\//);
  });

  test('EN page has English content', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('h1')).toContainText('We share knowledge');
  });

  test('PL page has Polish content', async ({ page }) => {
    await page.goto('/pl/');
    await expect(page.locator('h1')).toContainText('Dzielimy się wiedzą');
  });

  test('EN about page exists', async ({ page }) => {
    await page.goto('/en/about/');
    await expect(page.locator('h1')).toContainText('About');
  });

  test('PL about page exists', async ({ page }) => {
    await page.goto('/pl/o-projekcie/');
    await expect(page.locator('h1')).toContainText('O projekcie');
  });
});
```

- [ ] **Step 6: Build site and run tests**

```bash
npm run build && npx playwright test
```

Expected: All tests pass.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts tests/
git commit -m "test: add E2E tests for homepage, blog, and i18n"
```

---

## Task 13: Deploy Configuration

**Files:**
- Create: `netlify.toml` (or `vercel.json` — using Netlify as default)

- [ ] **Step 1: Create Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/"
  to = "/pl/"
  status = 302
```

- [ ] **Step 2: Verify build output**

```bash
npm run build && ls dist/
```

Expected: `dist/` contains `pl/`, `en/` directories with HTML files.

- [ ] **Step 3: Commit**

```bash
git add netlify.toml
git commit -m "chore: add Netlify deploy configuration"
```

---

## Task 14: Final Build Verification

- [ ] **Step 1: Clean build**

```bash
rm -rf dist .astro && npm run build
```

Expected: Build succeeds with no warnings.

- [ ] **Step 2: Run all E2E tests**

```bash
npx playwright test
```

Expected: All tests pass.

- [ ] **Step 3: Visual check with dev server**

```bash
npm run preview
```

Open `http://localhost:4321` and verify:
- Root redirects to `/pl/`
- Homepage renders with hero, tags, post cards
- Blog listing shows posts
- Individual blog posts render with proper styling
- About page displays correctly
- Language switcher works (PL ↔ EN)
- Footer shows Quality Cat link
- Mobile responsive (resize browser)

- [ ] **Step 4: Final commit if any fixes needed**

```bash
git add -A && git commit -m "fix: final adjustments after visual review"
```

- [ ] **Step 5: Push to origin**

```bash
git push -u origin master
```
