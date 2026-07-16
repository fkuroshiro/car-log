import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { formatDate, formatKm } from '@/lib/format';
import { useServiceRecords } from '@/lib/queries/service-records';
import { categoryLabel } from '@/lib/service-categories';
import { Spacing, useTheme } from '@/theme';

/** The maintenance history of one car, newest first. */
export function ServiceTimeline({ carId }: { carId: string }) {
  const { colors } = useTheme();
  const { data: records, isPending, error } = useServiceRecords(carId);

  if (isPending) {
    return <ActivityIndicator color={colors.accent} />;
  }
  if (error) {
    return (
      <AppText variant="small" style={{ color: colors.danger }}>
        Couldn&apos;t load the timeline: {error.message}
      </AppText>
    );
  }
  if (records.length === 0) {
    return (
      <AppText variant="muted">
        No service records yet — log the first one.
      </AppText>
    );
  }

  return (
    <View>
      {records.map((record, index) => (
        <Pressable
          key={record.id}
          onPress={() =>
            router.push({
              pathname: '/cars/[id]/services/[recordId]',
              params: { id: carId, recordId: record.id },
            })
          }>
          {({ pressed }) => (
            <View style={[styles.row, pressed && styles.pressed]}>
              <View style={styles.rail}>
                <View style={[styles.dot, { backgroundColor: colors.accent }]} />
                {index < records.length - 1 ? (
                  <View
                    style={[styles.line, { backgroundColor: colors.border }]}
                  />
                ) : null}
              </View>
              <View
                style={[
                  styles.body,
                  index === records.length - 1 && styles.lastBody,
                ]}>
                <View style={styles.titleRow}>
                  <AppText variant="label" style={styles.title}>
                    {record.title}
                  </AppText>
                  {record.cost != null ? (
                    <AppText variant="small">{record.cost}</AppText>
                  ) : null}
                </View>
                <AppText variant="small">
                  {formatDate(record.serviced_on)} ·{' '}
                  {formatKm(record.odometer_km)} ·{' '}
                  {categoryLabel(record.category)}
                </AppText>
              </View>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: Spacing.two },
  pressed: { opacity: 0.8 },
  rail: { width: 12, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  line: { width: 1, flex: 1, marginTop: 2 },
  body: { flex: 1, gap: Spacing.half, paddingBottom: Spacing.three },
  lastBody: { paddingBottom: 0 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: { flexShrink: 1 },
});
