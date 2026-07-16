import { Redirect, Stack } from 'expo-router';

import { useSessionState } from '@/auth/session-context';
import { useTheme } from '@/theme';

/** Mirror guard: signed-in users have no business on the auth screens. */
export default function AuthLayout() {
  const { session } = useSessionState();
  const { colors } = useTheme();

  if (session) {
    return <Redirect href="/" />;
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
