import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { useUpdateProfile } from '@/lib/queries/profile';
import { Spacing, useTheme } from '@/theme';

/**
 * Rendered only after the profile has loaded, so useState can take the
 * stored name as its initial value — no state-syncing effect needed.
 */
export function ProfileNameForm({ initialName }: { initialName: string }) {
  const { colors } = useTheme();
  const updateProfile = useUpdateProfile();
  const [displayName, setDisplayName] = useState(initialName);

  return (
    <View style={styles.form}>
      <TextField
        label="Display name"
        placeholder="How should we call you?"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <View style={styles.saveRow}>
        <Button
          title="Save"
          variant="secondary"
          loading={updateProfile.isPending}
          onPress={() => updateProfile.mutate(displayName)}
        />
        {updateProfile.isSuccess && !updateProfile.isPending ? (
          <AppText variant="small" style={{ color: colors.accent }}>
            Saved
          </AppText>
        ) : null}
        {updateProfile.error ? (
          <AppText variant="small" style={{ color: colors.danger }}>
            {updateProfile.error.message}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
});
