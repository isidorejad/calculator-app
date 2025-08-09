import api from '@/api/api';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Clipboard from 'expo-clipboard';
import mexp from 'math-expression-evaluator'; // Import the safe math parser
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ButtonType, CalculatorButton } from '../../components/CalculatorButton';

interface ButtonConfig { value: string; type: ButtonType; style?: ViewStyle; }

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [realtimeResult, setRealtimeResult] = useState('');
  const [isScientific, setIsScientific] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    if (expression.length === 0) {
      setRealtimeResult('');
      return;
    }
    const sanitizedExpr = expression.replace(/[+\-×÷%]$/, '');
    if (!sanitizedExpr) return;
    
    try {
      const evalExpression = sanitizedExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100*');
      const result = (mexp as any).eval(evalExpression);
      setRealtimeResult(`= ${result}`);
    } catch {
      // Ignore errors during typing
    }
  }, [expression]);

  const handlePress = (value: string, type: ButtonType) => {
    if (realtimeResult.startsWith('=') && !expression.includes('+') && !expression.includes('-')) {
        setExpression(value);
        setDisplay(value);
        setRealtimeResult('');
        return;
    }

    if (type === 'number' || (type === 'action' && value === '.')) {
      if (value === '.' && display.includes('.')) return;
      const newDisplay = display === '0' && value !== '.' ? value : display + value;
      setDisplay(newDisplay);
      setExpression(expression + value);
    } else if (type === 'operator') {
      setDisplay('0');
      if (!/[+\-×÷%]$/.test(expression)) {
        setExpression(expression + value);
      }
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
        setRealtimeResult('');
        break;
      case '⌫':
        setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
        setExpression(expression.slice(0, -1));
        break;
      case '=':
        const expressionToSave = expression;
        try {
          const evalExpression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100*');
          const result = (mexp as any).eval(evalExpression);
          setDisplay(result);
          setExpression(result);
          setRealtimeResult(`= ${result}`);
          saveToHistory(expressionToSave, result);
        } catch {
          setDisplay('Error');
          setExpression('');
          setRealtimeResult('');
        }
        break;
    }
  };

  const handleScientific = (func: string) => {
     try {
       const number = parseFloat(display);
       let result: number;
       switch (func) {
         case 'sin': result = Math.sin(number * Math.PI / 180); break;
         case 'cos': result = Math.cos(number * Math.PI / 180); break;
         case 'tan': result = Math.tan(number * Math.PI / 180); break;
         case 'log': result = Math.log10(number); break;
         case 'ln': result = Math.log(number); break;
         case '√': result = Math.sqrt(number); break;
         case 'π': result = Math.PI; break;
         default: result = number;
       }
       setDisplay(String(result));
       setExpression(String(result));
       setRealtimeResult(`= ${String(result)}`);
     } catch {
       setDisplay('Error');
       setExpression('');
       setRealtimeResult('');
     }
  };

  const saveToHistory = async (expr: string, res: string) => {
    if (!expr || res === 'Error' || res === 'NaN') return;
    try {
      await api.post('/history', { expression: expr, result: res });
    } catch (error) {
      console.error('Could not save history');
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(display);
    Alert.alert('Copied!', 'Result copied to clipboard.');
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    const num = parseFloat(text);
    if (!isNaN(num)) {
      setDisplay(String(num));
      setExpression(expression + String(num));
    } else {
      Alert.alert("Paste Error", "Clipboard does not contain a valid number.");
    }
  };

  const standardButtons: ButtonConfig[] = [
    { value: 'C', type: 'action' }, { value: '⌫', type: 'action' }, { value: '%', type: 'operator' }, { value: '÷', type: 'operator' },
    { value: '7', type: 'number' }, { value: '8', type: 'number' }, { value: '9', type: 'number' }, { value: '×', type: 'operator' },
    { value: '4', type: 'number' }, { value: '5', type: 'number' }, { value: '6', type: 'number' }, { value: '-', type: 'operator' },
    { value: '1', type: 'number' }, { value: '2', type: 'number' }, { value: '3', type: 'number' }, { value: '+', type: 'operator' },
    { value: '0', type: 'number', style: { width: 176 } }, { value: '.', type: 'action' }, { value: '=', type: 'action' },
  ];

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
             <TouchableOpacity onPress={pasteFromClipboard} style={styles.iconButton}><Ionicons name="clipboard-outline" size={24} color={theme.text} /></TouchableOpacity>
             <TouchableOpacity onPress={copyToClipboard} style={styles.iconButton}><Ionicons name="copy-outline" size={24} color={theme.text} /></TouchableOpacity>
          </View>
      </View>
      
      <Pressable onLongPress={copyToClipboard} style={styles.displayContainer}>
        <Text style={[styles.expressionText, { color: theme.icon }]}>{expression || ' '}</Text>
        <Text style={[styles.displayText, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>{display}</Text>
        <Text style={[styles.realtimeText, { color: theme.tint }]}>{realtimeResult || ' '}</Text>
      </Pressable>

      <View style={styles.buttonContainer}>
        {isScientific &&
            <View style={[styles.scientificGrid, {backgroundColor: theme.card}]}>
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
  expressionText: { fontSize: 24, opacity: 0.7 },
  displayText: { fontSize: 72, fontWeight: '300' },
  realtimeText: { fontSize: 32, fontWeight: '500', minHeight: 40 },
  buttonContainer: { paddingBottom: 20, paddingHorizontal: 5 },
  scientificGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 10, borderRadius: 20, marginBottom: 10 },
  standardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
});