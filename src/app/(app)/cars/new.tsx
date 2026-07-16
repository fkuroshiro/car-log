import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { CarForm } from '@/components/car-form';
import { Screen } from '@/components/ui/screen';
import { useCreateCar } from '@/lib/queries/cars';
import { Spacing } from '@/theme';

export default function NewCarScreen() {
  const { t } = useTranslation();
  const createCar = useCreateCar();

  return (
    <Screen style={styles.screen}>
      <Stack.Screen
        options={{ headerShown: true, title: t('car.addTitle') }}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <CarForm
          submitLabel={t('carForm.submitNew')}
          submitting={createCar.isPending}
          error={createCar.error?.message}
          onSubmit={(input) =>
            createCar.mutate(input, {
              onSuccess: (car) =>
                router.replace({
                  pathname: '/cars/[id]',
                  params: { id: car.id },
                }),
            })
          }
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  content: { padding: Spacing.three },
});
