import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const UNITS = {
  Kilogram: 1,
  Gram: 0.001,
  Milligram: 0.000001,
  Pound: 0.453592,
  Ounce: 0.0283495,
  Tonne: 1000,
};
type Unit = keyof typeof UNITS;

export default function MassConverterScreen() {
  const [input, setInput] = useState('1');
  const [output, setOutput] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>('Kilogram');
  const [toUnit, setToUnit] = useState<Unit>('Pound');

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    const valueInKg = parseFloat(input) * UNITS[fromUnit];
    const convertedValue = valueInKg / UNITS[toUnit];
    setOutput(isNaN(convertedValue) ? '' : convertedValue.toFixed(4));
  }, [input, fromUnit, toUnit]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
        <View style={styles.row}>
            <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
                value={input}
                onChangeText={setInput}
                keyboardType="numeric"
            />
            <Picker selectedValue={fromUnit} style={styles.picker} onValueChange={(itemValue) => setFromUnit(itemValue as Unit)}>
                {Object.keys(UNITS).map(u => <Picker.Item key={u} label={u} value={u} color={theme.text} />)}
            </Picker>
        </View>
        <View style={styles.row}>
            <Text style={[styles.output, { color: theme.text, borderColor: theme.icon }]}>{output}</Text>
            <Picker selectedValue={toUnit} style={styles.picker} onValueChange={(itemValue) => setToUnit(itemValue as Unit)}>
                {Object.keys(UNITS).map(u => <Picker.Item key={u} label={u} value={u} color={theme.text} />)}
            </Picker>
        </View>
    </ScrollView>
  );
}

// Using the same styles as Length Converter
const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    input: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 20 },
    output: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 20, textAlignVertical: 'center', },
    picker: { flex: 1, height: 60 },
});