import '@/global.css';

import { Platform } from 'react-native';

/**
 * Design tokens: every color, size and radius the app uses has a name here.
 * Components never hard-code hex values — they read from the active palette,
 * which is what makes the light/dark switch a one-line concern.
 */

export const palettes = {
  /** Off-white, warm greys, amber tuned darker for contrast on light. */
  light: {
    background: '#FAF9F7',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F0EC',
    border: '#E5E1DA',
    text: '#26282B',
    textMuted: '#6F6B64',
    accent: '#B07830',
    accentSoft: '#F3E7D3',
    onAccent: '#FFFFFF',
    danger: '#B4524B',
    dangerSoft: '#F6E4E2',
  },
  /** Dark grey pastels; amber lightened so it glows against the grey. */
  dark: {
    background: '#1A1B1E',
    surface: '#222327',
    surfaceAlt: '#2A2C31',
    border: '#35383E',
    text: '#E8E8E6',
    textMuted: '#9BA0A6',
    accent: '#D9A05B',
    accentSoft: '#3A3229',
    onAccent: '#221A0F',
    danger: '#E08787',
    dangerSoft: '#3A2A2A',
  },
} as const;

export type ColorScheme = keyof typeof palettes;
export type ThemeColors = { [K in keyof typeof palettes.light]: string };

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const MaxContentWidth = 800;
