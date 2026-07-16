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

export default function SignInScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setError(signInError.message);
      setSubmitting(false);
    }
    // On success there is nothing to do: the new session flips the route
    // guards and the (auth) layout redirects to the garage.
  };

  return (
    <Screen>
      <View style={styles.wrap}>
        <View style={styles.brand}>
          <AppText variant="title">Car Log</AppText>
          <AppText variant="muted">
            Your cars&apos; service history, in one place.
          </AppText>
        </View>

        <Card style={styles.card}>
          <AppText variant="heading">Sign in</AppText>
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
            placeholder="••••••••"
            secureTextEntry
            autoComplete="current-password"
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
          <Button title="Sign in" loading={submitting} onPress={handleSubmit} />
        </Card>

        <View style={styles.switchRow}>
          <AppText variant="muted">New here?</AppText>
          <Link href="/sign-up">
            <AppText variant="label" style={{ color: colors.accent }}>
              Create an account
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
