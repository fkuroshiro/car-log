import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { useSession } from '@/auth/session-context';
import { ProfileNameForm } from '@/components/profile-name-form';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useProfile } from '@/lib/queries/profile';
import { supabase } from '@/lib/supabase';
import { Spacing, useTheme } from '@/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const session = useSession();
  const { data: profile, isPending } = useProfile();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    // The (app) layout redirects to /sign-in as soon as the session is gone.
    await supabase.auth.signOut();
  };

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ headerShown: true, title: 'Settings' }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <AppText variant="heading">Appearance</AppText>
          <ThemeToggle />
          <AppText variant="small">
            System follows your device preference; your choice is remembered
            on this device.
          </AppText>
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">Profile</AppText>
          {isPending || !profile ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <ProfileNameForm initialName={profile.display_name ?? ''} />
          )}
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">Account</AppText>
          <View style={styles.accountRow}>
            <AppText variant="muted">Signed in as</AppText>
            <AppText>{session.user.email}</AppText>
          </View>
          <Button
            title="Sign out"
            variant="secondary"
            loading={signingOut}
            onPress={handleSignOut}
          />
        </Card>

        <Button
          title="View style guide"
          variant="ghost"
          onPress={() => router.push('/styleguide')}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: Spacing.three, gap: Spacing.three },
  section: { gap: Spacing.three },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
});
