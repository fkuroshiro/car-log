import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';
import { AppText } from './app-text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  variant?: Variant;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();

  const variants: Record<Variant, { container: ViewStyle; label: string }> = {
    primary: {
      container: { backgroundColor: colors.accent },
      label: colors.onAccent,
    },
    secondary: {
      container: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
      },
      label: colors.text,
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      label: colors.accent,
    },
    danger: {
      container: { backgroundColor: colors.danger },
      label: colors.onAccent,
    },
  };
  const { container, label } = variants[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      {...rest}
      style={({ pressed }) => [
        styles.base,
        container,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={label} />
      ) : (
        <AppText variant="label" style={{ color: label }}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: 44,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.md,
  },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
