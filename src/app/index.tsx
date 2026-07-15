import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/app-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';
import { TextField } from '@/components/ui/text-field';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Spacing } from '@/theme';

/**
 * Temporary style guide so every design-system piece can be seen in both
 * themes. This screen becomes the garage (car list) in a later phase.
 */
export default function HomeScreen() {
  const [nickname, setNickname] = useState('');

  return (
    <Screen style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="title">Car Log</AppText>
          <AppText variant="muted">
            Design system preview — becomes the garage soon.
          </AppText>
        </View>

        <ThemeToggle />

        <Card style={styles.section}>
          <AppText variant="heading">Buttons</AppText>
          <View style={styles.row}>
            <Button title="Add car" />
            <Button title="Edit" variant="secondary" />
            <Button title="Cancel" variant="ghost" />
            <Button title="Delete" variant="danger" />
          </View>
          <View style={styles.row}>
            <Button title="Saving" loading />
            <Button title="Disabled" disabled />
          </View>
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">Inputs</AppText>
          <TextField
            label="Car nickname"
            placeholder="e.g. Daily driver"
            value={nickname}
            onChangeText={setNickname}
          />
          <TextField
            label="Odometer (km)"
            placeholder="132500"
            keyboardType="numeric"
            error="Example of a validation error"
          />
        </Card>

        <Card style={styles.section}>
          <AppText variant="heading">Typography</AppText>
          <AppText variant="title">Title</AppText>
          <AppText variant="heading">Heading</AppText>
          <AppText>Body — regular content text.</AppText>
          <AppText variant="muted">Muted — secondary information.</AppText>
          <AppText variant="small">Small — timestamps, footnotes.</AppText>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 0 },
  list: { padding: Spacing.three, gap: Spacing.three },
  header: { gap: Spacing.one },
  section: { gap: Spacing.three },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
