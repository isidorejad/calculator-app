import { Stack } from 'expo-router';

export default function ConverterLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Conversion Tools' }} />
      <Stack.Screen name="currency" options={{ title: 'Currency Converter' }} />
      <Stack.Screen name="length" options={{ title: 'Length Converter' }} />
      <Stack.Screen name="mass" options={{ title: 'Mass Converter' }} />
      <Stack.Screen name="temperature" options={{ title: 'Temperature Converter' }} />
      <Stack.Screen name="tip" options={{ title: 'Tip Calculator' }} />
    </Stack>
  );
}