import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { confirmAsync } from '@/lib/confirm';
import { useCar, useDeleteCar } from '@/lib/queries/cars';
import { Spacing, useTheme } from '@/theme';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { data: car, isPending, error } = useCar(id);
  const deleteCar = useDeleteCar();

  const handleDelete = async () => {
    if (!car) return;
    const confirmed = await confirmAsync(
      'Delete car',
      `Remove "${car.name}" and its entire service history? This cannot be undone.`
    );
    if (confirmed) {
      deleteCar.mutate(car.id, { onSuccess: () => router.replace('/') });
    }
  };

  return (
    <Screen style={styles.screen}>
      <Stack.Screen
        options={{ headerShown: true, title: car?.name ?? 'Car' }}
      />

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
          <View style={styles.header}>
            <AppText variant="title">{car.name}</AppText>
            <AppText variant="muted">
              {[car.make, car.model, car.year].filter(Boolean).join(' ') ||
                'No details yet'}
            </AppText>
          </View>

          <Card style={styles.details}>
            <DetailRow
              label="Odometer"
              value={`${car.odometer_km.toLocaleString('en-US').replace(/,/g, ' ')} km`}
            />
            <DetailRow
              label="Registration plate"
              value={car.registration_plate ?? '—'}
            />
            <DetailRow
              label="In garage since"
              value={new Date(car.created_at).toLocaleDateString()}
            />
          </Card>

          <Card style={styles.timelinePlaceholder}>
            <AppText variant="heading">Service timeline</AppText>
            <AppText variant="muted">
              Maintenance records arrive in the next phase.
            </AppText>
          </Card>

          <View style={styles.actions}>
            <Button
              title="Edit"
              variant="secondary"
              style={styles.actionButton}
              onPress={() =>
                router.push({
                  pathname: '/cars/[id]/edit',
                  params: { id: car.id },
                })
              }
            />
            <Button
              title="Delete"
              variant="danger"
              style={styles.actionButton}
              loading={deleteCar.isPending}
              onPress={handleDelete}
            />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <AppText variant="muted">{label}</AppText>
      <AppText>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: Spacing.three, gap: Spacing.three },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  header: { gap: Spacing.one },
  details: { gap: Spacing.two },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  timelinePlaceholder: { gap: Spacing.one },
  actions: { flexDirection: 'row', gap: Spacing.two },
  actionButton: { flex: 1 },
});
