import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      t('service.deleteTitle'),
      t('service.deleteMessage', { title: record.title })
    );
    if (confirmed) {
      deleteRecord.mutate(record.id, { onSuccess: () => router.back() });
    }
  };

  return (
    <Screen style={styles.screen}>
      <Stack.Screen
        options={{ headerShown: true, title: t('service.editTitle') }}
      />

      {isPending ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
        </View>
      ) : error || !record ? (
        <View style={styles.center}>
          <AppText variant="muted">{t('service.loadError')}</AppText>
          {error ? <AppText variant="small">{error.message}</AppText> : null}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <ServiceRecordForm
            initial={record}
            submitLabel={t('service.submitEdit')}
            submitting={updateRecord.isPending}
            error={updateRecord.error?.message}
            onSubmit={(input) =>
              updateRecord.mutate(input, { onSuccess: () => router.back() })
            }
          />
          <Button
            title={t('service.deleteAction')}
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
