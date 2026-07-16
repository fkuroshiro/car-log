import { useState } from 'react';
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
      errors.servicedOn = 'Use the YYYY-MM-DD format, e.g. 2026-03-12.';
    }
    const odometerNumber = Number(odometer.trim());
    if (
      !odometer.trim() ||
      !Number.isInteger(odometerNumber) ||
      odometerNumber < 0
    ) {
      errors.odometer = 'Enter kilometres as a whole number.';
    }
    if (!title.trim()) {
      errors.title = 'Describe what was done.';
    }
    const costNumber = cost.trim()
      ? Number(cost.trim().replace(',', '.'))
      : null;
    if (costNumber !== null && (Number.isNaN(costNumber) || costNumber < 0)) {
      errors.cost = 'Enter the cost as a number.';
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
        <AppText variant="label">Category</AppText>
        <View style={styles.chips}>
          {SERVICE_CATEGORIES.map((option) => {
            const selected = option.value === category;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setCategory(option.value)}
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
                  {option.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <TextField
        label="Title *"
        placeholder="e.g. Oil and filter change"
        value={title}
        onChangeText={setTitle}
        error={fieldErrors.title}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <DateField
            label="Date *"
            value={servicedOn}
            onChangeText={setServicedOn}
            error={fieldErrors.servicedOn}
          />
        </View>
        <TextField
          label="Odometer (km) *"
          placeholder="132500"
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
          error={fieldErrors.odometer}
          containerStyle={styles.flex}
        />
      </View>
      <TextField
        label="Cost"
        placeholder="Optional"
        keyboardType="decimal-pad"
        value={cost}
        onChangeText={setCost}
        error={fieldErrors.cost}
      />
      <TextField
        label="Notes"
        placeholder="Parts, workshop, anything worth remembering…"
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
