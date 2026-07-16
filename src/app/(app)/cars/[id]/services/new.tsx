import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ServiceRecordForm } from '@/components/service-record-form';
import { AppText } from '@/components/ui/app-text';
import { Screen } from '@/components/ui/screen';
import { useCar } from '@/lib/queries/cars';
import { useCreateServiceRecord } from '@/lib/queries/service-records';
import { Spacing, useTheme } from '@/theme';

export default function NewServiceRecordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: car, isPending, error } = useCar(id);
  const createRecord = useCreateServiceRecord(id);

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ headerShown: true, title: 'Log service' }} />

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
          <ServiceRecordForm
            carOdometerKm={car.odometer_km}
            submitLabel="Log service"
            submitting={createRecord.isPending}
            error={createRecord.error?.message}
            onSubmit={(input) =>
              createRecord.mutate(input, { onSuccess: () => router.back() })
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
