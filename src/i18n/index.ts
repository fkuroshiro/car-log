import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { cs } from './locales/cs';
import { en } from './locales/en';

export const LANGUAGES = ['en', 'cs'] as const;
export type Language = (typeof LANGUAGES)[number];
/** 'system' follows the device/browser language. */
export type LanguageMode = Language | 'system';

// Initialized with English so the static pre-render is deterministic; the
// LanguageProvider applies the device/stored language after hydration.
// eslint-disable-next-line import/no-named-as-default-member -- .use() on the instance is the documented i18next API
i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }, // React escapes output itself
});

export { i18next };
