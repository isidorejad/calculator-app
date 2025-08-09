import { CURRENCIES, useCurrencyData } from '@/api/currency';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ConverterScreen() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);

  const { rates, loading, error } = useCurrencyData(fromCurrency);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (rates && rates[toCurrency]) {
      const rate = rates[toCurrency];
      const result = parseFloat(amount) * rate;
      setConvertedAmount(result.toFixed(2));
    }
  }, [amount, rates, toCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
      <Text style={[styles.title, { color: theme.text }]}>Currency Converter</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="Amount"
          placeholderTextColor={theme.icon}
        />
        <Picker
          selectedValue={fromCurrency}
          style={[styles.picker, { color: theme.text }]}
          onValueChange={(itemValue) => setFromCurrency(itemValue)}>
          {CURRENCIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
        </Picker>
      </View>

      <Text style={[styles.swapButton, { color: theme.tint }]} onPress={handleSwapCurrencies}>
        Swap ⇅
      </Text>

      <Picker
        selectedValue={toCurrency}
        style={[styles.picker, { color: theme.text, marginBottom: 20 }]}
        onValueChange={(itemValue) => setToCurrency(itemValue)}>
        {CURRENCIES.map(c => <Picker.Item key={c} label={c} value={c} />)}
      </Picker>

      {loading && <ActivityIndicator size="large" color={theme.tint} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {convertedAmount && !loading && (
        <Text style={[styles.resultText, { color: theme.tint }]}>
          {convertedAmount} {toCurrency}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  swapButton: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    padding: 10,
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});