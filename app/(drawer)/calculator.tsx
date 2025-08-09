import { CalculatorButton } from '@/components/CalculatorButton';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(true);

  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleNumberPress = (value: string) => {
    if (waitingForOperand) {
      setDisplay(value);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? value : display + value);
    }
  };

  const handleOperatorPress = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (previousValue == null) {
      setPreviousValue(String(inputValue));
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setPreviousValue(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const prev = parseFloat(previousValue!);
    const current = parseFloat(display);

    switch (operator) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return prev / current;
      default:
        return current;
    }
  };

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'C':
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        break;
      case '±':
        setDisplay(String(parseFloat(display) * -1));
        break;
      case '%':
        setDisplay(String(parseFloat(display) / 100));
        break;
      case '=':
        if (operator && previousValue !== null) {
          const result = performCalculation();
          setDisplay(String(result));
          setPreviousValue(null);
          setOperator(null);
          setWaitingForOperand(true);
        }
        break;
      case '.':
        if (!display.includes('.')) {
          setDisplay(display + '.');
        }
        break;
    }
  };

  const handlePress = (value: string, type: string) => {
    if (type === 'number') handleNumberPress(value);
    if (type === 'operator') handleOperatorPress(value);
    if (type === 'action') handleActionPress(value);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.displayContainer}>
        <Text style={[styles.displayText, { color: theme.text }]}>{display}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalculatorButton value="C" type="action" onPress={() => handlePress('C', 'action')} />
          <CalculatorButton value="±" type="action" onPress={() => handlePress('±', 'action')} />
          <CalculatorButton value="%" type="action" onPress={() => handlePress('%', 'action')} />
          <CalculatorButton value="÷" type="operator" onPress={() => handlePress('÷', 'operator')} />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="7" type="number" onPress={() => handlePress('7', 'number')} />
          <CalculatorButton value="8" type="number" onPress={() => handlePress('8', 'number')} />
          <CalculatorButton value="9" type="number" onPress={() => handlePress('9', 'number')} />
          <CalculatorButton value="×" type="operator" onPress={() => handlePress('×', 'operator')} />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="4" type="number" onPress={() => handlePress('4', 'number')} />
          <CalculatorButton value="5" type="number" onPress={() => handlePress('5', 'number')} />
          <CalculatorButton value="6" type="number" onPress={() => handlePress('6', 'number')} />
          <CalculatorButton value="-" type="operator" onPress={() => handlePress('-', 'operator')} />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="1" type="number" onPress={() => handlePress('1', 'number')} />
          <CalculatorButton value="2" type="number" onPress={() => handlePress('2', 'number')} />
          <CalculatorButton value="3" type="number" onPress={() => handlePress('3', 'number')} />
          <CalculatorButton value="+" type="operator" onPress={() => handlePress('+', 'operator')} />
        </View>
        <View style={styles.row}>
          <CalculatorButton value="0" type="number" onPress={() => handlePress('0', 'number')} style={{ width: 176 }} />
          <CalculatorButton value="." type="action" onPress={() => handlePress('.', 'action')} />
          <CalculatorButton value="=" type="operator" onPress={() => handlePress('=', 'action')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  displayText: {
    fontSize: 96,
    fontWeight: '300',
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});