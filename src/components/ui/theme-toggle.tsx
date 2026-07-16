import { useTranslation } from 'react-i18next';

import { useTheme, type ThemeMode } from '@/theme';
import { SegmentedControl } from './segmented-control';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { mode, setMode } = useTheme();

  const options: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: t('theme.system') },
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
  ];

  return <SegmentedControl options={options} value={mode} onChange={setMode} />;
}
