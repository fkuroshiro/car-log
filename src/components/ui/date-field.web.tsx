import { StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';
import { AppText } from './app-text';
import type { DateFieldProps } from './date-field';

/**
 * Web version: a real <input type="date"> with the browser's calendar
 * picker. react-native-web components are DOM elements underneath, so a
 * plain HTML input can live right between them; `colorScheme` makes the
 * browser render the picker itself in our active theme.
 */
export function DateField({ label, value, onChangeText, error }: DateFieldProps) {
  const { colors, scheme } = useTheme();

  return (
    <View style={styles.container}>
      {label ? <AppText variant="label">{label}</AppText> : null}
      <input
        type="date"
        value={value}
        onChange={(event) => onChangeText(event.target.value)}
        style={{
          minHeight: 44,
          boxSizing: 'border-box',
          border: `1px solid ${error ? colors.danger : colors.border}`,
          borderRadius: Radius.md,
          padding: `0 ${Spacing.three}px`,
          fontSize: 16,
          fontFamily: 'var(--font-display)',
          backgroundColor: colors.surface,
          color: colors.text,
          colorScheme: scheme,
          outline: 'none',
        }}
      />
      {error ? (
        <AppText variant="small" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.two },
});
