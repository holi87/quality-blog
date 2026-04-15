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
