import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

export function Card({ style, ...rest }: ViewProps) {
  const { colors } = useTheme();

  return (
    <View
      {...rest}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.three,
  },
});
