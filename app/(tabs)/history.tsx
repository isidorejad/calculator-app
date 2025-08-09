import api from '@/api/api';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

interface Calculation {
  _id: string;
  expression: string;
  result: string;
  createdAt: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/history');
      setHistory(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // useFocusEffect re-fetches data every time the screen comes into view
  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.expression}>{item.expression} =</Text>
          <Text style={styles.result}>{item.result}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No history found.</Text>}
    />
  );
}
const styles = StyleSheet.create({
    item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    expression: { fontSize: 16, color: 'gray' },
    result: { fontSize: 22, fontWeight: 'bold' },
    date: { fontSize: 12, color: 'gray', marginTop: 5 },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 18 },
});