import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavThemeProvider,
} from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';

import { SessionProvider } from '@/auth/session-context';
import { ThemeProvider, useTheme } from '@/theme';

// One client for the whole app: it caches every query result, deduplicates
// identical requests and refetches stale data in the background.
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* Outside the session gate so the static export renders it too. */}
      <Head>
        <title>Car Log</title>
        <meta
          name="description"
          content="Track your cars and their maintenance history."
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RootNavigator />
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

/**
 * Separate component so it can call useTheme(): hooks can only read a context
 * from a provider *above* them in the tree, never one rendered alongside.
 */
function RootNavigator() {
  const { scheme, colors } = useTheme();

  // The navigator (headers, transitions) has its own theme object — feed it
  // our palette so built-in chrome always matches the app.
  const navTheme = useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.background,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
      },
    };
  }, [scheme, colors]);

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </NavThemeProvider>
  );
}
