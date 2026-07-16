import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { CarForm } from '@/components/car-form';
import { Screen } from '@/components/ui/screen';
import { useCreateCar } from '@/lib/queries/cars';
import { Spacing } from '@/theme';

export default function NewCarScreen() {
  const createCar = useCreateCar();

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ headerShown: true, title: 'Add car' }} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <CarForm
          submitLabel="Add to garage"
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
