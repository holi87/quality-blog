import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://quality-blog.eu',
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
