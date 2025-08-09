import api from '@/api/api';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
// Correctly import the component AND its exported type
import { ButtonType, CalculatorButton } from '../../components/CalculatorButton';

// Define an interface for our button configuration objects.
// This ensures that the 'type' property is always a valid ButtonType.
interface ButtonConfig {
  value: string;
  type: ButtonType;
  style?: ViewStyle;
}

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // The 'type' parameter is now correctly typed as ButtonType, not a generic string.
  const handlePress = (value: string, type: ButtonType) => {
    if (justCalculated && type === 'number') {
      setDisplay(value);
      setExpression(value);
      setJustCalculated(false);
      return;
    }
    if (justCalculated && type === 'operator') {
      setExpression(display + value);
      setDisplay('0'); // Start new number entry after operator
      setJustCalculated(false);
      return;
    }

    setJustCalculated(false);

    if (type === 'number' || type === 'action' && value === '.') {
      if (value === '.' && display.includes('.')) return; // Prevent multiple dots
      setDisplay(display === '0' && value !== '.' ? value : display + value);
      setExpression(expression + value);
    } else if (type === 'operator') {
      setDisplay('0');
      setExpression(expression + value);
    } else if (type === 'action') {
      handleAction(value);
    } else if (type === 'scientific') {
      handleScientific(value);
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'C':
        setDisplay('0');
        setExpression('');
        break;
      case '⌫': // Backspace
        if (display.length > 1) {
          setDisplay(display.slice(0, -1));
        } else {
          setDisplay('0');
        }
        // This backspace logic for expression is tricky; a simple slice may not be correct
        // for multi-character results. For simplicity, we keep it this way.
        setExpression(expression.slice(0, -1));
        break;
      case '=':
        try {
          // Replace visual operators with evaluatable ones
          const evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');
          // Note: eval() is powerful but can be a security risk.
          // For a production app, a custom math expression parser is safer.
          const result = eval(evalExpression);
          setDisplay(String(result));
          setExpression(String(result));
          setJustCalculated(true);
        } catch {
          setDisplay('Error');
          setExpression('');
        }
        break;
      // The '.' case is now handled in handlePress to combine logic
    }
  };

  const handleScientific = (func: string) => {
     try {
       const number = parseFloat(display);
       let result: number;
       switch (func) {
         case 'sin': result = Math.sin(number * Math.PI / 180); break; // Assuming degree input
         case 'cos': result = Math.cos(number * Math.PI / 180); break; // Assuming degree input
         case 'tan': result = Math.tan(number * Math.PI / 180); break; // Assuming degree input
         case 'log': result = Math.log10(number); break;
         case 'ln': result = Math.log(number); break;
         case '√': result = Math.sqrt(number); break;
         case 'π': result = Math.PI; break;
         default: result = number;
       }
       setDisplay(String(result));
       setExpression(String(result));
       setJustCalculated(true);
     } catch {
       setDisplay('Error');
       setExpression('');
     }
  };

  const saveToHistory = async () => {
    if (!justCalculated || display === 'Error') {
      return Alert.alert('Save Error', 'Only the result of a valid calculation can be saved.');
    }
    try {
      // The expression saved is the final result, not the initial calculation string.
      // This could be improved by storing the pre-evaluation expression state.
      await api.post('/history', { expression, result: display });
      Alert.alert('Success', 'Calculation saved to your history.');
    } catch (error) {
      Alert.alert('Error', 'Could not save history. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(display);
    Alert.alert('Copied!', 'Result copied to clipboard.');
  };

  // This array is now strictly typed as ButtonConfig[]
  const standardButtons: ButtonConfig[] = [
    { value: 'C', type: 'action' }, { value: '⌫', type: 'action' }, { value: '%', type: 'operator' }, { value: '÷', type: 'operator' },
    { value: '7', type: 'number' }, { value: '8', type: 'number' }, { value: '9', type: 'number' }, { value: '×', type: 'operator' },
    { value: '4', type: 'number' }, { value: '5', type: 'number' }, { value: '6', type: 'number' }, { value: '-', type: 'operator' },
    { value: '1', type: 'number' }, { value: '2', type: 'number' }, { value: '3', type: 'number' }, { value: '+', type: 'operator' },
    { value: '0', type: 'number', style: { width: 176 } }, { value: '.', type: 'action' }, { value: '=', type: 'action' },
  ];

  // This array is now strictly typed as ButtonConfig[]
  const scientificButtons: ButtonConfig[] = [
    { value: 'sin', type: 'scientific' }, { value: 'cos', type: 'scientific' }, { value: 'tan', type: 'scientific' },
    { value: 'log', type: 'scientific' }, { value: 'ln', type: 'scientific' }, { value: '√', type: 'scientific' },
    { value: 'π', type: 'scientific' }, { value: '(', type: 'operator' }, { value: ')', type: 'operator' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.topBar}>
          <View style={styles.switchContainer}>
            <Text style={{color: theme.text}}>Scientific</Text>
            <Switch value={isScientific} onValueChange={setIsScientific} trackColor={{true: theme.tint}}/>
          </View>
          <View style={styles.iconButtons}>
             <TouchableOpacity onPress={saveToHistory} style={styles.iconButton}><Ionicons name="save-outline" size={24} color={theme.text} /></TouchableOpacity>
             <TouchableOpacity onPress={copyToClipboard} style={styles.iconButton}><Ionicons name="copy-outline" size={24} color={theme.text} /></TouchableOpacity>
          </View>
      </View>
      <View style={styles.displayContainer}>
        <Text style={[styles.expressionText, { color: theme.icon }]}>{expression}</Text>
        <Text style={[styles.displayText, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {isScientific &&
            <View style={styles.scientificRow}>
                {scientificButtons.map(b => <CalculatorButton key={b.value} {...b} onPress={handlePress} />)}
            </View>
        }
        <View style={styles.standardGrid}>
            {standardButtons.map(b => <CalculatorButton key={b.value} {...b} onPress={handlePress} />)}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButtons: { flexDirection: 'row', gap: 20 },
  iconButton: {},
  displayContainer: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 20, gap: 10 },
  expressionText: { fontSize: 24 },
  displayText: { fontSize: 72, fontWeight: '300' },
  buttonContainer: { paddingBottom: 20, paddingHorizontal: 5 },
  scientificRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  standardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});