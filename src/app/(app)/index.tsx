import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { formatKm } from '@/lib/format';
import { useCars, type Car } from '@/lib/queries/cars';
import { Spacing, useTheme } from '@/theme';

export default function GarageScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { data: cars, isPending, error, refetch } = useCars();

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <AppText variant="title">{t('garage.title')}</AppText>
          <AppText variant="muted">
            {cars ? t('garage.carCount', { count: cars.length }) : ' '}
          </AppText>
        </View>
        <View style={styles.headerActions}>
          <Button
            title={t('garage.settings')}
            variant="ghost"
            onPress={() => router.push('/settings')}
          />
          <Button
            title={t('garage.addCar')}
            onPress={() => router.push('/cars/new')}
          />
        </View>
      </View>

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <AppText variant="muted">{t('garage.loadError')}</AppText>
          <AppText variant="small">{error.message}</AppText>
          <Button
            title={t('common.retry')}
            variant="secondary"
            onPress={() => refetch()}
          />
        </View>
      ) : cars.length === 0 ? (
        <View style={styles.center}>
          <AppText variant="heading">{t('garage.empty')}</AppText>
          <AppText variant="muted">{t('garage.emptyHint')}</AppText>
          <Button
            title={t('garage.emptyAction')}
            onPress={() => router.push('/cars/new')}
          />
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
            {formatKm(car.odometer_km)}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
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
