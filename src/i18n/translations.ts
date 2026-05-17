const translations = {
  pl: {
    nav: {
      home: 'Strona główna',
      blog: 'Blog',
      aiAdoption: 'Adopcja AI',
      about: 'O projekcie',
    },
    hero: {
      title: 'Dzielimy się wiedzą o',
      highlight1: 'AI',
      highlight2: 'smart home',
      and: 'i',
      highlight3: 'QA',
      description: 'Blog o jakości — w AI, w smart home, w testowaniu. Praktyczne poradniki, eksperymenty i wnioski z pracy. Bez paywalli i bez marketingowego szumu.',
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
      aiAdoption: 'AI Adoption',
      about: 'About',
    },
    hero: {
      title: 'We share knowledge about',
      highlight1: 'AI',
      highlight2: 'smart home',
      and: 'and',
      highlight3: 'QA',
      description: 'A blog about quality — in AI, in smart home, in testing. Practical guides, experiments and lessons from the field. No paywalls, no marketing fluff.',
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
