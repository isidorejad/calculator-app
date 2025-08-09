import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TipCalculatorScreen() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(1);
  const [totalTip, setTotalTip] = useState(0);
  const [totalPerPerson, setTotalPerPerson] = useState(0);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    const billAmount = parseFloat(bill);
    if (isNaN(billAmount) || billAmount <= 0) {
        setTotalTip(0);
        setTotalPerPerson(0);
        return;
    }
    const tip = billAmount * (tipPercent / 100);
    const total = billAmount + tip;
    const perPerson = total / numPeople;

    setTotalTip(tip);
    setTotalPerPerson(perPerson);
  }, [bill, tipPercent, numPeople]);
  
  const tipOptions = [10, 15, 18, 20, 25];

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.text}]}>Bill Amount</Text>
            <TextInput
                style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
                value={bill}
                onChangeText={setBill}
                keyboardType="numeric"
                placeholder="$0.00"
                placeholderTextColor={theme.icon}
            />
        </View>

        <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.text}]}>Select Tip %</Text>
            <View style={styles.tipSelector}>
                {tipOptions.map(opt => (
                    <TouchableOpacity 
                        key={opt} 
                        style={[styles.tipButton, tipPercent === opt && {backgroundColor: theme.tint}]}
                        onPress={() => setTipPercent(opt)}
                    >
                        <Text style={[styles.tipText, tipPercent === opt && {color: '#fff'}]}>{opt}%</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

        <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.text}]}>Number of People</Text>
            <View style={styles.peopleSelector}>
                 <TouchableOpacity onPress={() => setNumPeople(Math.max(1, numPeople - 1))} style={styles.personButton}><Text style={{fontSize: 24, color: theme.text}}>-</Text></TouchableOpacity>
                 <Text style={[styles.peopleCount, {color: theme.text}]}>{numPeople}</Text>
                 <TouchableOpacity onPress={() => setNumPeople(numPeople + 1)} style={styles.personButton}><Text style={{fontSize: 24, color: theme.text}}>+</Text></TouchableOpacity>
            </View>
        </View>

        <View style={[styles.resultContainer, {backgroundColor: theme.tint}]}>
            <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Tip Amount</Text>
                <Text style={styles.resultValue}>${totalTip.toFixed(2)}</Text>
            </View>
            <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Per Person</Text>
                <Text style={styles.resultValue}>${totalPerPerson.toFixed(2)}</Text>
            </View>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'space-around' },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 18, marginBottom: 10 },
    input: { height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 24, },
    tipSelector: { flexDirection: 'row', justifyContent: 'space-between' },
    tipButton: { flex: 1, padding: 15, borderRadius: 8, alignItems: 'center', marginHorizontal: 5, backgroundColor: '#eee' },
    tipText: { fontSize: 18, fontWeight: 'bold' },
    peopleSelector: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 40 },
    personButton: { padding: 10 },
    peopleCount: { fontSize: 24, fontWeight: 'bold' },
    resultContainer: { padding: 20, borderRadius: 12, gap: 15 },
    resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
    resultLabel: { fontSize: 18, color: 'white' },
    resultValue: { fontSize: 28, fontWeight: 'bold', color: 'white' },
});