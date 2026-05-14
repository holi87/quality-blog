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
      description: 'Blog o jakości — w IT, w smart home, w codziennych wyborach technologicznych. Praktyczne poradniki, eksperymenty i wnioski z pracy. Bez paywalli i bez marketingowego szumu.',
    },
    posts: {
      latest: 'Ostatnie wpisy',
      author: 'Autor',
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
      description: 'A blog about quality — in IT, in smart home, in everyday tech choices. Practical guides, experiments and lessons from the field. No paywalls, no marketing fluff.',
    },
    posts: {
      latest: 'Latest posts',
      author: 'By',
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
