import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const UNITS = ['Celsius', 'Fahrenheit', 'Kelvin'];
type Unit = 'Celsius' | 'Fahrenheit' | 'Kelvin';

export default function TemperatureConverterScreen() {
  const [input, setInput] = useState('0');
  const [output, setOutput] = useState('');
  const [fromUnit, setFromUnit] = useState<Unit>('Celsius');
  const [toUnit, setToUnit] = useState<Unit>('Fahrenheit');

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    const val = parseFloat(input);
    if (isNaN(val)) {
        setOutput('');
        return;
    }

    let kelvin = 0;
    // First, convert input to Kelvin (base unit)
    switch(fromUnit) {
        case 'Celsius': kelvin = val + 273.15; break;
        case 'Fahrenheit': kelvin = (val - 32) * 5/9 + 273.15; break;
        case 'Kelvin': kelvin = val; break;
    }

    // Then, convert from Kelvin to the target unit
    let result = 0;
    switch(toUnit) {
        case 'Celsius': result = kelvin - 273.15; break;
        case 'Fahrenheit': result = (kelvin - 273.15) * 9/5 + 32; break;
        case 'Kelvin': result = kelvin; break;
    }
    setOutput(result.toFixed(2));

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
                {UNITS.map(u => <Picker.Item key={u} label={u} value={u} color={theme.text} />)}
            </Picker>
        </View>
        <View style={styles.row}>
            <Text style={[styles.output, { color: theme.text, borderColor: theme.icon }]}>{output}</Text>
            <Picker selectedValue={toUnit} style={styles.picker} onValueChange={(itemValue) => setToUnit(itemValue as Unit)}>
                {UNITS.map(u => <Picker.Item key={u} label={u} value={u} color={theme.text} />)}
            </Picker>
        </View>
    </ScrollView>
  );
}

// Using the same styles as Length/Mass Converter
const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: { padding: 20 },
    row: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
    input: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 20 },
    output: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 20, textAlignVertical: 'center', },
    picker: { flex: 1, height: 60 },
});