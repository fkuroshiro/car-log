import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { i18next, type Language, type LanguageMode } from './index';

const STORAGE_KEY = 'car-log/language';

/**
 * Only called on the client: during static rendering there is no navigator
 * to ask, which is also why i18next boots with plain English.
 */
function systemLanguage(): Language {
  return getLocales()[0]?.languageCode === 'cs' ? 'cs' : 'en';
}

interface LanguageContextValue {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<LanguageMode>('system');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      const loaded: LanguageMode =
        stored === 'en' || stored === 'cs' ? stored : 'system';
      setModeState(loaded);
      i18next.changeLanguage(loaded === 'system' ? systemLanguage() : loaded);
    });
  }, []);

  const setMode = useCallback((next: LanguageMode) => {
    setModeState(next);
    i18next.changeLanguage(next === 'system' ? systemLanguage() : next);
    if (next === 'system') {
      AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      AsyncStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return <LanguageContext value={value}>{children}</LanguageContext>;
}

export function useLanguage() {
  const ctx = use(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside <LanguageProvider>');
  }
  return ctx;
}
