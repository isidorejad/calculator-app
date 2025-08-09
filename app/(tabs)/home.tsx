import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { username, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CalcuVerse,</Text>
      <Text style={styles.username}>{username}!</Text>
      <Text style={styles.subtitle}>Select a tool from the tabs below to get started.</Text>
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  username: { fontSize: 32, fontWeight: 'bold', color: '#0a7ea4', marginBottom: 20 },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center' },
  buttonContainer: { marginTop: 40 },
});