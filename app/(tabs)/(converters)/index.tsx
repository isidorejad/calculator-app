import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

const tools = [
  { name: 'Currency', href: '/(tabs)/(converters)/currency', icon: 'cash-outline' },
  { name: 'Length', href: '/(tabs)/(converters)/length', icon: 'resize-outline' },
  { name: 'Mass', href: '/(tabs)/(converters)/mass', icon: 'barbell-outline' },
  { name: 'Temperature', href: '/(tabs)/(converters)/temperature', icon: 'thermometer-outline' },
  { name: 'Tip Calculator', href: '/(tabs)/(converters)/tip', icon: 'restaurant-outline' },
];

export default function ConverterMenu() {
  return (
    <FlatList
      data={tools}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <Link href={item.href as any} asChild>
          <TouchableOpacity style={styles.item}>
            <Ionicons name={item.icon as any} size={24} style={styles.icon} />
            <Text style={styles.text}>{item.name}</Text>
            <Ionicons name="chevron-forward-outline" size={22} color="gray" />
          </TouchableOpacity>
        </Link>
      )}
    />
  );
}
const styles = StyleSheet.create({
    item: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    icon: { marginRight: 15 },
    text: { flex: 1, fontSize: 18 },
});