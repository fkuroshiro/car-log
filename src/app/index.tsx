import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { useCars, type Car } from '@/lib/queries/cars';
import { Spacing, useTheme } from '@/theme';

export default function GarageScreen() {
  const { colors } = useTheme();
  const { data: cars, isPending, error, refetch } = useCars();

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">Garage</AppText>
          <AppText variant="muted">
            {cars ? `${cars.length} car${cars.length === 1 ? '' : 's'}` : ' '}
          </AppText>
        </View>
        <Button title="Add car" onPress={() => router.push('/cars/new')} />
      </View>

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AppText variant="muted">Couldn&apos;t load your cars.</AppText>
          <AppText variant="small">{error.message}</AppText>
          <Button title="Retry" variant="secondary" onPress={() => refetch()} />
        </View>
      ) : cars.length === 0 ? (
        <View style={styles.center}>
          <AppText variant="heading">No cars yet</AppText>
          <AppText variant="muted">
            Add your first car to start its service log.
          </AppText>
        </View>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(car) => car.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CarListItem car={item} />}
        />
      )}
    </Screen>
  );
}

function CarListItem({ car }: { car: Car }) {
  const { colors } = useTheme();
  const subtitle = [car.make, car.model, car.year].filter(Boolean).join(' ');

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/cars/[id]', params: { id: car.id } })
      }>
      {({ pressed }) => (
        <Card style={[styles.item, pressed && styles.pressed]}>
          <View style={styles.itemText}>
            <AppText variant="heading">{car.name}</AppText>
            {subtitle ? <AppText variant="muted">{subtitle}</AppText> : null}
          </View>
          <AppText variant="label" style={{ color: colors.accent }}>
            {car.odometer_km.toLocaleString('en-US').replace(/,/g, ' ')} km
          </AppText>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  headerText: { gap: Spacing.one },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  list: { gap: Spacing.two, paddingBottom: Spacing.five },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  itemText: { gap: Spacing.half, flexShrink: 1 },
  pressed: { opacity: 0.85 },
});
