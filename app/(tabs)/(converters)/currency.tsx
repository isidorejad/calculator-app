import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = `https://api.exchangerate-api.com/v4/latest/`;

// --- NEW CURRENCY LISTS ---

// Caribbean currencies are placed first as requested.
const CARIBBEAN_CURRENCIES = [
  'XCD', // East Caribbean Dollar
  'AWG', // Aruban Florin
  'BSD', // Bahamian Dollar
  'BBD', // Barbadian Dollar
  'BMD', // Bermudian Dollar
  'KYD', // Cayman Islands Dollar
  'CUP', // Cuban Peso
  'ANG', // Netherlands Antillean Guilder
  'DOP', // Dominican Peso
  'HTG', // Haitian Gourde
  'JMD', // Jamaican Dollar
  'TTD', // Trinidad and Tobago Dollar
];

// A comprehensive list of other world currencies.
const WORLD_CURRENCIES = [
  'USD', // United States Dollar
  'EUR', // Euro
  'JPY', // Japanese Yen
  'GBP', // British Pound Sterling
  'AUD', // Australian Dollar
  'CAD', // Canadian Dollar
  'CHF', // Swiss Franc
  'CNY', // Chinese Yuan
  'INR', // Indian Rupee
  'BRL', // Brazilian Real
  'RUB', // Russian Ruble
  'KRW', // South Korean Won
  'SGD', // Singapore Dollar
  'MXN', // Mexican Peso
  'ZAR', // South African Rand
  'AED', // United Arab Emirates Dirham
  'AFN', // Afghan Afghani
  'ALL', // Albanian Lek
  'AMD', // Armenian Dram
  'AOA', // Angolan Kwanza
  'ARS', // Argentine Peso
  'AZN', // Azerbaijani Manat
  'BAM', // Bosnia-Herzegovina Convertible Mark
  'BDT', // Bangladeshi Taka
  'BGN', // Bulgarian Lev
  'BHD', // Bahraini Dinar
  'BIF', // Burundian Franc
  'BND', // Brunei Dollar
  'BOB', // Bolivian Boliviano
  'BWP', // Botswanan Pula
  'BYN', // Belarusian Ruble
  'BZD', // Belize Dollar
  'CDF', // Congolese Franc
  'CLP', // Chilean Peso
  'COP', // Colombian Peso
  'CRC', // Costa Rican Colón
  'CVE', // Cape Verdean Escudo
  'CZK', // Czech Koruna
  'DJF', // Djiboutian Franc
  'DKK', // Danish Krone
  'DZD', // Algerian Dinar
  'EGP', // Egyptian Pound
  'ERN', // Eritrean Nakfa
  'ETB', // Ethiopian Birr
  'FJD', // Fijian Dollar
  'FKP', // Falkland Islands Pound
  'FOK', // Faroese Króna
  'GEL', // Georgian Lari
  'GGP', // Guernsey Pound
  'GHS', // Ghanaian Cedi
  'GIP', // Gibraltar Pound
  'GMD', // Gambian Dalasi
  'GNF', // Guinean Franc
  'GTQ', // Guatemalan Quetzal
  'GYD', // Guyanaese Dollar
  'HKD', // Hong Kong Dollar
  'HNL', // Honduran Lempira
  'HRK', // Croatian Kuna
  'HUF', // Hungarian Forint
  'IDR', // Indonesian Rupiah
  'ILS', // Israeli New Shekel
  'IMP', // Isle of Man Pound
  'IQD', // Iraqi Dinar
  'IRR', // Iranian Rial
  'ISK', // Icelandic Króna
  'JEP', // Jersey Pound
  'JOD', // Jordanian Dinar
  'KES', // Kenyan Shilling
  'KGS', // Kyrgystani Som
  'KHR', // Cambodian Riel
  'KID', // Kiribati Dollar
  'KMF', // Comorian Franc
  'KWD', // Kuwaiti Dinar
  'KZT', // Kazakhstani Tenge
  'LAK', // Laotian Kip
  'LBP', // Lebanese Pound
  'LKR', // Sri Lankan Rupee
  'LRD', // Liberian Dollar
  'LSL', // Lesotho Loti
  'LYD', // Libyan Dinar
  'MAD', // Moroccan Dirham
  'MDL', // Moldovan Leu
  'MGA', // Malagasy Ariary
  'MKD', // Macedonian Denar
  'MMK', // Myanma Kyat
  'MNT', // Mongolian Tugrik
  'MOP', // Macanese Pataca
  'MRU', // Mauritanian Ouguiya
  'MUR', // Mauritian Rupee
  'MVR', // Maldivian Rufiyaa
  'MWK', // Malawian Kwacha
  'MYR', // Malaysian Ringgit
  'MZN', // Mozambican Metical
  'NAD', // Namibian Dollar
  'NGN', // Nigerian Naira
  'NIO', // Nicaraguan Córdoba
  'NOK', // Norwegian Krone
  'NPR', // Nepalese Rupee
  'NZD', // New Zealand Dollar
  'OMR', // Omani Rial
  'PAB', // Panamanian Balboa
  'PEN', // Peruvian Nuevo Sol
  'PGK', // Papua New Guinean Kina
  'PHP', // Philippine Peso
  'PKR', // Pakistani Rupee
  'PLN', // Polish Zloty
  'PYG', // Paraguayan Guarani
  'QAR', // Qatari Rial
  'RON', // Romanian Leu
  'RSD', // Serbian Dinar
  'RWF', // Rwandan Franc
  'SAR', // Saudi Riyal
  'SBD', // Solomon Islands Dollar
  'SCR', // Seychellois Rupee
  'SDG', // Sudanese Pound
  'SEK', // Swedish Krona
  'SHP', // Saint Helena Pound
  'SLL', // Sierra Leonean Leone
  'SOS', // Somali Shilling
  'SRD', // Surinamese Dollar
  'SSP', // South Sudanese Pound
  'STN', // São Tomé and Príncipe Dobra
  'SYP', // Syrian Pound
  'SZL', // Swazi Lilangeni
  'THB', // Thai Baht
  'TJS', // Tajikistani Somoni
  'TMT', // Turkmenistani Manat
  'TND', // Tunisian Dinar
  'TOP', // Tongan Paʻanga
  'TRY', // Turkish Lira
  'TVD', // Tuvaluan Dollar
  'TWD', // New Taiwan Dollar
  'TZS', // Tanzanian Shilling
  'UAH', // Ukrainian Hryvnia
  'UGX', // Ugandan Shilling
  'UYU', // Uruguayan Peso
  'UZS', // Uzbekistan Som
  'VES', // Venezuelan Bolívar
  'VND', // Vietnamese Dong
  'VUV', // Vanuatu Vatu
  'WST', // Samoan Tālā
  'XAF', // Central African CFA Franc
  'XOF', // West African CFA Franc
  'XPF', // CFP Franc
  'YER', // Yemeni Rial
];

// Combine the lists, ensuring no duplicates, with Caribbean currencies first.
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
      if(!amount) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}${fromCurrency}`);
        const data = await response.json();
        if(data.error) {
            setError('Could not fetch rates.');
            return;
        }
        const rate = data.rates[toCurrency];
        const result = parseFloat(amount) * rate;
        setConvertedAmount(result.toFixed(2));
      } catch {
          setError('An error occurred.');
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
         <Text style={[styles.resultBox, {color: theme.text, borderColor: theme.icon}]}>
            {loading ? <ActivityIndicator color={theme.tint} /> : convertedAmount || '0.00'}
         </Text>
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
  resultBox: { flex: 1, height: 60, borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, fontSize: 20, textAlignVertical: 'center', justifyContent: 'center' },
  picker: { flex: 1, height: 60 },
  swapButton: { alignItems: 'center', marginVertical: 10 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});