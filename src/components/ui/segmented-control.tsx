import { Pressable, StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';
import { AppText } from './app-text';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.group,
        { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
      ]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
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
    flexWrap: 'wrap',
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
