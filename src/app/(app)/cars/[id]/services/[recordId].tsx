import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ServiceRecordForm } from '@/components/service-record-form';
import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { confirmAsync } from '@/lib/confirm';
import {
  useDeleteServiceRecord,
  useServiceRecord,
  useUpdateServiceRecord,
} from '@/lib/queries/service-records';
import { Spacing, useTheme } from '@/theme';

export default function EditServiceRecordScreen() {
  const { id, recordId } = useLocalSearchParams<{
    id: string;
    recordId: string;
  }>();
  const { colors } = useTheme();
  const { data: record, isPending, error } = useServiceRecord(recordId);
  const updateRecord = useUpdateServiceRecord(id, recordId);
  const deleteRecord = useDeleteServiceRecord(id);

  const handleDelete = async () => {
    if (!record) return;
    const confirmed = await confirmAsync(
      'Delete service record',
      `Remove "${record.title}" from the timeline? This cannot be undone.`
    );
    if (confirmed) {
      deleteRecord.mutate(record.id, { onSuccess: () => router.back() });
    }
  };

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ headerShown: true, title: 'Edit service' }} />

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : error || !record ? (
        <View style={styles.center}>
          <AppText variant="muted">Couldn&apos;t load this record.</AppText>
          {error ? <AppText variant="small">{error.message}</AppText> : null}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <ServiceRecordForm
            initial={record}
            submitLabel="Save changes"
            submitting={updateRecord.isPending}
            error={updateRecord.error?.message}
            onSubmit={(input) =>
              updateRecord.mutate(input, { onSuccess: () => router.back() })
            }
          />
          <Button
            title="Delete record"
            variant="danger"
            loading={deleteRecord.isPending}
            onPress={handleDelete}
          />
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: Spacing.three, gap: Spacing.four },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
});
