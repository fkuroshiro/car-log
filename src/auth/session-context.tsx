import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  use,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { supabase } from '@/lib/supabase';
import { Spacing, useTheme } from '@/theme';

const SessionContext = createContext<Session | null>(null);

/**
 * TEMPORARY until the auth phase: when nobody is signed in, sign into the
 * dev account from .env so the app can talk to the database during
 * development. Real sign-in/sign-up screens will replace this shim.
 */
async function devSignIn() {
  const email = process.env.EXPO_PUBLIC_DEV_EMAIL;
  const password = process.env.EXPO_PUBLIC_DEV_PASSWORD;
  if (!__DEV__ || !email || !password) return;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('Dev sign-in failed:', error.message);
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (!data.session) {
        devSignIn();
      }
    });

    // Fires on sign-in, sign-out and token refresh — the single place that
    // keeps React state in sync with the real auth state.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      }
    );
    return () => subscription.subscription.unsubscribe();
  }, []);

  if (!session) {
    return <ConnectingScreen failed={ready} />;
  }

  return <SessionContext value={session}>{children}</SessionContext>;
}

function ConnectingScreen({ failed }: { failed: boolean }) {
  const { colors } = useTheme();

  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.accent} />
      {failed ? (
        <AppText variant="muted">
          Waiting for dev sign-in… check EXPO_PUBLIC_DEV_* in .env if this
          never finishes.
        </AppText>
      ) : null}
    </View>
  );
}

export function useSession() {
  const session = use(SessionContext);
  if (!session) {
    throw new Error('useSession must be used inside <SessionProvider>');
  }
  return session;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
  },
});
