import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = `https://api.exchangerate-api.com/v4/latest/`;

const CARIBBEAN_CURRENCIES = [ 'XCD', 'AWG', 'BSD', 'BBD', 'BMD', 'KYD', 'CUP', 'ANG', 'DOP', 'HTG', 'JMD', 'TTD' ];
const WORLD_CURRENCIES = [ 'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL', 'RUB', 'KRW', 'SGD', 'MXN', 'ZAR', 'AED', 'AFN', 'ALL', 'AMD', 'AOA', 'ARS', 'AZN', 'BAM', 'BDT', 'BGN', 'BHD', 'BIF', 'BND', 'BOB', 'BWP', 'BYN', 'BZD', 'CDF', 'CLP', 'COP', 'CRC', 'CVE', 'CZK', 'DJF', 'DKK', 'DZD', 'EGP', 'ERN', 'ETB', 'FJD', 'FKP', 'FOK', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HUF', 'IDR', 'ILS', 'IMP', 'IQD', 'IRR', 'ISK', 'JEP', 'JOD', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KWD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XOF', 'XPF', 'YER' ];
const CURRENCIES = [...CARIBBEAN_CURRENCIES, ...WORLD_CURRENCIES.filter(c => !CARIBBEAN_CURRENCIES.includes(c))];

export default function CurrencyConverterScreen() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    const convert = async () => {
      if(!amount || parseFloat(amount) <= 0) {
        setConvertedAmount('0.00');
        return;
      };
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}${fromCurrency}`);
        const data = await response.json();
        if(data.error) {
            setError('Could not fetch rates.');
            setConvertedAmount(null);
            return;
        }
        const rate = data.rates[toCurrency];
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result.toFixed(2));
      } catch {
          setError('An error occurred.');
          setConvertedAmount(null);
      } finally {
        setLoading(false);
      }
    };
    convert();
  }, [amount, fromCurrency, toCurrency]);

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.icon }]}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Picker selectedValue={fromCurrency} style={styles.picker} onValueChange={setFromCurrency}>
          {CURRENCIES.map(c => <Picker.Item key={c} label={c} value={c} color={theme.text} />)}
        </Picker>
      </View>

      <TouchableOpacity onPress={handleSwapCurrencies} style={styles.swapButton}>
        <Ionicons name="swap-vertical" size={32} color={theme.tint} />
      </TouchableOpacity>

      <View style={styles.row}>
         <View style={[styles.resultBox, {borderColor: theme.icon}]}>
            {loading ? <ActivityIndicator color={theme.tint} /> : <Text style={[styles.resultText, {color: theme.text}]}>{convertedAmount || '0.00'}</Text>}
         </View>
         <Picker selectedValue={toCurrency} style={styles.picker} onValueChange={setToCurrency}>
            {CURRENCIES.map(c => <Picker.Item key={c} label={c} value={c} color={theme.text} />)}
         </Picker>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { padding: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 20 },
  resultBox: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, justifyContent: 'center' },
  resultText: { fontSize: 20 },
  picker: { flex: 1, height: 60 },
  swapButton: { alignItems: 'center', marginVertical: 10 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});