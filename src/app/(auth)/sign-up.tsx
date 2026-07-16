import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { supabase } from '@/lib/supabase';
import { Spacing, useTheme } from '@/theme';

export default function SignUpScreen() {
  const { colors } = useTheme();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('The password needs at least 6 characters.');
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
      setNotice(
        'Account created — check your inbox and confirm your email, then sign in.'
      );
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
          <AppText variant="muted">Create your garage.</AppText>
        </View>

        <Card style={styles.card}>
          <AppText variant="heading">Create account</AppText>
          <TextField
            label="Display name"
            placeholder="Optional"
            autoComplete="name"
            value={displayName}
            onChangeText={setDisplayName}
          />
          <TextField
            label="Email"
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextField
            label="Password"
            placeholder="At least 6 characters"
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
            title="Create account"
            loading={submitting}
            onPress={handleSubmit}
          />
        </Card>

        <View style={styles.switchRow}>
          <AppText variant="muted">Already have an account?</AppText>
          <Link href="/sign-in">
            <AppText variant="label" style={{ color: colors.accent }}>
              Sign in
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
