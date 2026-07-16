import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { TextField } from '@/components/ui/text-field';
import { todayISO } from '@/lib/format';
import type {
  ServiceRecord,
  ServiceRecordInput,
} from '@/lib/queries/service-records';
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from '@/lib/service-categories';
import { Radius, Spacing, useTheme } from '@/theme';

interface ServiceRecordFormProps {
  initial?: ServiceRecord;
  /** Pre-fills the odometer field when logging a new record. */
  carOdometerKm?: number;
  submitLabel: string;
  submitting: boolean;
  error?: string;
  onSubmit: (input: ServiceRecordInput) => void;
}

export function ServiceRecordForm({
  initial,
  carOdometerKm,
  submitLabel,
  submitting,
  error,
  onSubmit,
}: ServiceRecordFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [servicedOn, setServicedOn] = useState(
    initial?.serviced_on ?? todayISO()
  );
  const [odometer, setOdometer] = useState(
    (initial?.odometer_km ?? carOdometerKm)?.toString() ?? ''
  );
  const [category, setCategory] = useState<ServiceCategory>(
    (initial?.category as ServiceCategory) ?? 'service'
  );
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [cost, setCost] = useState(initial?.cost?.toString() ?? '');
  const [fieldErrors, setFieldErrors] = useState<{
    servicedOn?: string;
    odometer?: string;
    title?: string;
    cost?: string;
  }>({});

  const handleSubmit = () => {
    const errors: typeof fieldErrors = {};

    if (!/^\d{4}-\d{2}-\d{2}$/.test(servicedOn.trim())) {
      errors.servicedOn = t('service.errorDate');
    }
    const odometerNumber = Number(odometer.trim());
    if (
      !odometer.trim() ||
      !Number.isInteger(odometerNumber) ||
      odometerNumber < 0
    ) {
      errors.odometer = t('service.errorOdometer');
    }
    if (!title.trim()) {
      errors.title = t('service.errorTitle');
    }
    const costNumber = cost.trim()
      ? Number(cost.trim().replace(',', '.'))
      : null;
    if (costNumber !== null && (Number.isNaN(costNumber) || costNumber < 0)) {
      errors.cost = t('service.errorCost');
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmit({
      serviced_on: servicedOn.trim(),
      odometer_km: odometerNumber,
      category,
      title: title.trim(),
      notes: notes.trim() || null,
      cost: costNumber,
    });
  };

  return (
    <View style={styles.form}>
      <View style={styles.categoryField}>
        <AppText variant="label">{t('service.category')}</AppText>
        <View style={styles.chips}>
          {SERVICE_CATEGORIES.map((option) => {
            const selected = option === category;
            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCategory(option)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected
                      ? colors.accentSoft
                      : colors.surface,
                    borderColor: selected ? colors.accent : colors.border,
                  },
                ]}>
                <AppText
                  variant="label"
                  style={{
                    color: selected ? colors.accent : colors.textMuted,
                  }}>
                  {t(`categories.${option}`)}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <TextField
        label={t('service.title')}
        placeholder={t('service.titlePlaceholder')}
        value={title}
        onChangeText={setTitle}
        error={fieldErrors.title}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <DateField
            label={t('service.date')}
            value={servicedOn}
            onChangeText={setServicedOn}
            error={fieldErrors.servicedOn}
          />
        </View>
        <TextField
          label={t('service.odometer')}
          placeholder="132500"
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
          error={fieldErrors.odometer}
          containerStyle={styles.flex}
        />
      </View>
      <TextField
        label={t('service.cost')}
        placeholder={t('service.costPlaceholder')}
        keyboardType="decimal-pad"
        value={cost}
        onChangeText={setCost}
        error={fieldErrors.cost}
      />
      <TextField
        label={t('service.notes')}
        placeholder={t('service.notesPlaceholder')}
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
        style={styles.notes}
      />

      {error ? (
        <AppText variant="small" style={{ color: colors.danger }}>
          {error}
        </AppText>
      ) : null}

      <Button title={submitLabel} loading={submitting} onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: Spacing.three },
  row: { flexDirection: 'row', gap: Spacing.two },
  flex: { flex: 1 },
  categoryField: { gap: Spacing.two },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: Radius.full,
  },
  notes: { minHeight: 80, textAlignVertical: 'top' },
});
