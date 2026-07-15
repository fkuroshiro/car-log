import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const colors = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Car Log</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Track your cars and their service history.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
  },
});
