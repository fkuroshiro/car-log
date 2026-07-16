import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import type { Car, CarInput } from '@/lib/queries/cars';
import { Spacing, useTheme } from '@/theme';

interface CarFormProps {
  initial?: Car;
  submitLabel: string;
  submitting: boolean;
  /** Error coming back from the server, shown under the form. */
  error?: string;
  onSubmit: (input: CarInput) => void;
}

export function CarForm({
  initial,
  submitLabel,
  submitting,
  error,
  onSubmit,
}: CarFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [make, setMake] = useState(initial?.make ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [year, setYear] = useState(initial?.year?.toString() ?? '');
  const [plate, setPlate] = useState(initial?.registration_plate ?? '');
  const [odometer, setOdometer] = useState(
    initial?.odometer_km?.toString() ?? ''
  );
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    year?: string;
    odometer?: string;
  }>({});

  const handleSubmit = () => {
    const errors: typeof fieldErrors = {};

    if (!name.trim()) {
      errors.name = 'Give the car a name.';
    }
    const yearNumber = year.trim() ? Number(year.trim()) : null;
    if (
      yearNumber !== null &&
      (!Number.isInteger(yearNumber) || yearNumber < 1900 || yearNumber > 2100)
    ) {
      errors.year = 'Enter a year like 2014.';
    }
    const odometerNumber = odometer.trim() ? Number(odometer.trim()) : 0;
    if (!Number.isInteger(odometerNumber) || odometerNumber < 0) {
      errors.odometer = 'Enter kilometres as a whole number.';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmit({
      name: name.trim(),
      make: make.trim() || null,
      model: model.trim() || null,
      year: yearNumber,
      registration_plate: plate.trim() || null,
      odometer_km: odometerNumber,
    });
  };

  return (
    <View style={styles.form}>
      <TextField
        label="Name *"
        placeholder="e.g. Daily driver"
        value={name}
        onChangeText={setName}
        error={fieldErrors.name}
      />
      <View style={styles.row}>
        <TextField
          label="Make"
          placeholder="Škoda"
          value={make}
          onChangeText={setMake}
          containerStyle={styles.flex}
        />
        <TextField
          label="Model"
          placeholder="Octavia"
          value={model}
          onChangeText={setModel}
          containerStyle={styles.flex}
        />
      </View>
      <View style={styles.row}>
        <TextField
          label="Year"
          placeholder="2014"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
          error={fieldErrors.year}
          containerStyle={styles.flex}
        />
        <TextField
          label="Odometer (km)"
          placeholder="132500"
          keyboardType="numeric"
          value={odometer}
          onChangeText={setOdometer}
          error={fieldErrors.odometer}
          containerStyle={styles.flex}
        />
      </View>
      <TextField
        label="Registration plate"
        placeholder="1AB 2345"
        autoCapitalize="characters"
        value={plate}
        onChangeText={setPlate}
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
});
