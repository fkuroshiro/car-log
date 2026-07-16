import { Redirect, Stack } from 'expo-router';

import { useSessionState } from '@/auth/session-context';
import { useTheme } from '@/theme';

/** Guard: everything in the (app) group requires a signed-in user. */
export default function AppLayout() {
  const { session } = useSessionState();
  const { colors } = useTheme();

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
