import { StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing, useTheme } from '@/theme';

/**
 * Page wrapper: themed background, safe-area padding on mobile, and a
 * centered max-width column so screens stay readable on wide browsers.
 */
export function Screen({ style, children, ...rest }: ViewProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <View {...rest} style={[styles.content, style]}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  content: { flex: 1, padding: Spacing.three },
});
