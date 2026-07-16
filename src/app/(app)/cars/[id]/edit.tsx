import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { CarForm } from '@/components/car-form';
import { AppText } from '@/components/ui/app-text';
import { Screen } from '@/components/ui/screen';
import { useCar, useUpdateCar } from '@/lib/queries/cars';
import { Spacing, useTheme } from '@/theme';

export default function EditCarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: car, isPending, error } = useCar(id);
  const updateCar = useUpdateCar(id);

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ headerShown: true, title: 'Edit car' }} />

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : error || !car ? (
        <View style={styles.center}>
          <AppText variant="muted">Couldn&apos;t load this car.</AppText>
          {error ? <AppText variant="small">{error.message}</AppText> : null}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <CarForm
            initial={car}
            submitLabel="Save changes"
            submitting={updateCar.isPending}
            error={updateCar.error?.message}
            onSubmit={(input) =>
              updateCar.mutate(input, { onSuccess: () => router.back() })
            }
          />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: Spacing.three },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
