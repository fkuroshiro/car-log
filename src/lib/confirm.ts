import { Alert, Platform } from 'react-native';

import { i18next } from '@/i18n';

/**
 * Cross-platform confirmation dialog: RN's Alert does nothing on web, so the
 * browser's native confirm() fills in there (its buttons are rendered by the
 * browser in the browser's own language).
 */
export function confirmAsync(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      {
        text: i18next.t('common.cancel'),
        style: 'cancel',
        onPress: () => resolve(false),
      },
      {
        text: i18next.t('common.delete'),
        style: 'destructive',
        onPress: () => resolve(true),
      },
    ]);
  });
}
