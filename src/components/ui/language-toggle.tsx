import { useTranslation } from 'react-i18next';

import type { LanguageMode } from '@/i18n';
import { useLanguage } from '@/i18n/language-context';
import { SegmentedControl } from './segmented-control';

export function LanguageToggle() {
  const { t } = useTranslation();
  const { mode, setMode } = useLanguage();

  const options: { value: LanguageMode; label: string }[] = [
    { value: 'system', label: t('languageNames.system') },
    // Languages are shown in their own name on purpose: if you switched to a
    // language you can't read, its own name is the one label you'd recognize.
    { value: 'en', label: t('languageNames.en') },
    { value: 'cs', label: t('languageNames.cs') },
  ];

  return <SegmentedControl options={options} value={mode} onChange={setMode} />;
}
