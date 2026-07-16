import type { Session } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  use,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

interface SessionState {
  session: Session | null;
  ready: boolean;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<SessionState>({
    session: null,
    ready: false,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setState({ session: data.session, ready: true });
    });

    // Fires on sign-in, sign-out and token refresh — the single place that
    // keeps React state in sync with the real auth state.
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState({ session, ready: true });
        if (event === 'SIGNED_OUT') {
          // Never let the next user see the previous user's cached data.
          queryClient.clear();
        }
      }
    );
    return () => subscription.subscription.unsubscribe();
  }, [queryClient]);

  // Until the stored session is loaded we don't know whether to show the
  // garage or the sign-in screen, so show neither.
  if (!state.ready) {
    return <SplashSpinner />;
  }

  return <SessionContext value={state}>{children}</SessionContext>;
}

function SplashSpinner() {
  const { colors } = useTheme();

  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

/** Session state including signed-out; for layouts deciding where to route. */
export function useSessionState(): SessionState {
  const state = use(SessionContext);
  if (!state) {
    throw new Error('useSessionState must be used inside <SessionProvider>');
  }
  return state;
}

/** The signed-in session. Only call from screens inside the (app) group. */
export function useSession(): Session {
  const { session } = useSessionState();
  if (!session) {
    throw new Error('useSession requires a signed-in user');
  }
  return session;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
