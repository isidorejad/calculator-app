import { Colors } from '@/constants/Colors';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics } = useSettings();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.setting}>
        <Text style={[styles.label, { color: theme.text }]}>Enable Sound</Text>
        <Switch
          value={soundEnabled}
          onValueChange={toggleSound}
          trackColor={{ false: '#767577', true: theme.tint }}
          thumbColor={'#f4f3f4'}
        />
      </View>
      <View style={styles.setting}>
        <Text style={[styles.label, { color: theme.text }]}>Enable Haptics</Text>
        <Switch
          value={hapticsEnabled}
          onValueChange={toggleHaptics}
          trackColor={{ false: '#767577', true: theme.tint }}
          thumbColor={'#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  label: {
    fontSize: 18,
  },
});