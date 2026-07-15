import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const emptySubscribe = () => () => {};

/**
 * The web build is statically pre-rendered without knowing the visitor's
 * color scheme, so the very first client render must match the server output
 * ('light'). After hydration we can return the real scheme.
 */
export function useColorScheme() {
  const colorScheme = useRNColorScheme();
  const isHydrating = useSyncExternalStore(
    emptySubscribe,
    () => false,
    () => true
  );

  return isHydrating ? 'light' : colorScheme;
}
