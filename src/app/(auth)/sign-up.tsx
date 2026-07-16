import { Link } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { supabase } from '@/lib/supabase';
import { Spacing, useTheme } from '@/theme';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError(t('auth.errorInvalidEmail'));
      return;
    }
    if (password.length < 6) {
      setError(t('auth.errorShortPassword'));
      return;
    }
    setSubmitting(true);
    setError(null);

    // display_name lands in the user metadata; the database trigger from
    // the schema migration copies it into the profiles row on creation.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() || null } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setSubmitting(false);
      return;
    }
    if (!data.session) {
      // Email confirmation is enabled: no session until the link is clicked.
      setNotice(t('auth.confirmNotice'));
      setSubmitting(false);
    }
    // With confirmation disabled a session exists already and the route
    // guards redirect into the app on their own.
  };

  return (
    <Screen>
      <View style={styles.wrap}>
        <View style={styles.brand}>
          <AppText variant="title">Car Log</AppText>
          <AppText variant="muted">{t('auth.signUpTagline')}</AppText>
        </View>

        <Card style={styles.card}>
          <AppText variant="heading">{t('auth.signUpTitle')}</AppText>
          <TextField
            label={t('auth.displayName')}
            placeholder={t('auth.displayNamePlaceholder')}
            autoComplete="name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextField
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label={t('auth.password')}
            placeholder={t('auth.newPasswordPlaceholder')}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
          />
          {error ? (
            <AppText variant="small" style={{ color: colors.danger }}>
              {error}
            </AppText>
          ) : null}
          {notice ? (
            <AppText variant="small" style={{ color: colors.accent }}>
              {notice}
            </AppText>
          ) : null}
          <Button
            title={t('auth.signUpAction')}
            loading={submitting}
            onPress={handleSubmit}
          />
        </Card>

        <View style={styles.switchRow}>
          <AppText variant="muted">{t('auth.haveAccount')}</AppText>
          <Link href="/sign-in">
            <AppText variant="label" style={{ color: colors.accent }}>
              {t('auth.signInLink')}
            </AppText>
          </Link>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 420,
    gap: Spacing.four,
  },
  brand: { alignItems: 'center', gap: Spacing.one },
  card: { gap: Spacing.three },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
