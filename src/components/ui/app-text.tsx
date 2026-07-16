import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, useTheme } from '@/theme';

type Variant = 'title' | 'heading' | 'body' | 'muted' | 'small' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
}

export function AppText({ variant = 'body', style, ...rest }: AppTextProps) {
  const { colors } = useTheme();
  const color =
    variant === 'muted' || variant === 'small' ? colors.textMuted : colors.text;

  return (
    <Text
      {...rest}
      style={[{ color, fontFamily: Fonts.sans }, styles[variant], style]}
    />
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '600', letterSpacing: -0.5 },
  heading: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16 },
  muted: { fontSize: 16 },
  small: { fontSize: 13 },
  label: { fontSize: 14, fontWeight: '500' },
});
