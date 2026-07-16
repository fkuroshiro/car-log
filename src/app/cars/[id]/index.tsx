import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ServiceTimeline } from '@/components/service-timeline';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { confirmAsync } from '@/lib/confirm';
import { formatDate, formatKm } from '@/lib/format';
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
            <DetailRow label="Odometer" value={formatKm(car.odometer_km)} />
            <DetailRow
              label="Registration plate"
              value={car.registration_plate ?? '—'}
            />
            <DetailRow
              label="In garage since"
              value={formatDate(car.created_at)}
            />
          </Card>

          <Card style={styles.timeline}>
            <View style={styles.timelineHeader}>
              <AppText variant="heading">Service timeline</AppText>
              <Button
                title="Log service"
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: '/cars/[id]/services/new',
                    params: { id: car.id },
                  })
                }
              />
            </View>
            <ServiceTimeline carId={car.id} />
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
  timeline: { gap: Spacing.three },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  actions: { flexDirection: 'row', gap: Spacing.two },
  actionButton: { flex: 1 },
});
