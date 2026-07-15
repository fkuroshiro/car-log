import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme, type ThemeMode } from '@/theme';
import { AppText } from './app-text';

const OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export function ThemeToggle() {
  const { colors, mode, setMode } = useTheme();

  return (
    <View
      style={[
        styles.group,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
      ]}>
      {OPTIONS.map((option) => {
        const selected = option.value === mode;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => setMode(option.value)}
            style={[
              styles.option,
              selected && {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <AppText
              variant="label"
              style={{ color: selected ? colors.accent : colors.textMuted }}>
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: 3,
    padding: 3,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  option: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: Radius.sm,
  },
});
