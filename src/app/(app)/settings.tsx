import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { useSession } from '@/auth/session-context';
import { ProfileNameForm } from '@/components/profile-name-form';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { Screen } from '@/components/ui/screen';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useProfile } from '@/lib/queries/profile';
import { supabase } from '@/lib/supabase';
import { Spacing, useTheme } from '@/theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
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
      <Stack.Screen
        options={{ headerShown: true, title: t('settings.title') }}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <AppText variant="heading">{t('settings.appearance')}</AppText>
          <ThemeToggle />
          <AppText variant="small">{t('settings.appearanceHint')}</AppText>
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">{t('settings.language')}</AppText>
          <LanguageToggle />
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">{t('settings.profile')}</AppText>
          {isPending || !profile ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <ProfileNameForm initialName={profile.display_name ?? ''} />
          )}
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">{t('settings.account')}</AppText>
          <View style={styles.accountRow}>
            <AppText variant="muted">{t('settings.signedInAs')}</AppText>
            <AppText>{session.user.email}</AppText>
          </View>
          <Button
            title={t('settings.signOut')}
            variant="secondary"
            loading={signingOut}
            onPress={handleSignOut}
          />
        </Card>

        <Button
          title={t('settings.styleguide')}
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
