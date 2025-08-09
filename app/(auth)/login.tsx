// import api from '@/api/api';
// import { Colors } from '@/constants/Colors';
// import { useAuth } from '@/contexts/AuthContext';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function LoginScreen() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useAuth();
//   const router = useRouter();
//   const colorScheme = useColorScheme() ?? 'light';
//   const theme = Colors[colorScheme];

//   const handleLogin = async () => {
//     if (!username || !password) {
//       return Alert.alert('Error', 'Please fill in all fields.');
//     }
//     try {
//       const response = await api.post('/auth/login', { username, password });
//       const { token, userId, username: loggedInUsername } = response.data;
//       login(token, userId, loggedInUsername);
//     } catch (error: any) {
//       Alert.alert('Login Failed', error.response?.data?.msg || 'An error occurred.');
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <Text style={[styles.title, { color: theme.tint }]}>CalcuVerse</Text>
//       <Text style={[styles.subtitle, { color: theme.icon }]}>
//         Welcome back! Please log in.
//       </Text>
//       <TextInput
//         style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
//         placeholder="Username"
//         placeholderTextColor={theme.icon}
//         value={username}
//         onChangeText={setUsername}
//         autoCapitalize="none"
//       />
//       <TextInput
//         style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
//         placeholder="Password"
//         placeholderTextColor={theme.icon}
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: theme.tint }]}
//         onPress={handleLogin}
//       >
//         <Text style={styles.buttonText}>Login</Text>
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
//         <Text style={{ color: theme.tint }}>Don’t have an account? Register</Text>
//       </TouchableOpacity>


//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   title: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
//   subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 30 },
//   input: {
//     height: 50,
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     fontSize: 16,
//   },
//   button: { padding: 15, borderRadius: 10, alignItems: 'center', marginVertical: 10 },
//   buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
//   link: { marginTop: 15, textAlign: 'center' },
// });

import api from '@/api/api';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router'; // Use Link for navigation
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleLogin = async () => {
    if (!username || !password) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, userId, username: loggedInUsername } = response.data;
      login(token, userId, loggedInUsername);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.msg || 'An error occurred. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.tint }]}>CalcuVerse</Text>
      <Text style={[styles.subtitle, { color: theme.icon }]}>
        Welcome back! Log in to access your universe.
      </Text>
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
        placeholder="Username"
        placeholderTextColor={theme.icon}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        returnKeyType="next"
      />
      <TextInput
        style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
        placeholder="Password"
        placeholderTextColor={theme.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.tint }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>

      {/* Use the Link component with an absolute path from the /app directory */}
      <Link href="/register" asChild>
        <TouchableOpacity style={styles.link}>
            <Text style={{ color: theme.tint }}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 36, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 30 },
  input: {
    height: 50,
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  link: { marginTop: 15, padding: 10, alignSelf: 'center' },
});