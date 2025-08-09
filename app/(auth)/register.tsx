// import api from '@/api/api';
// import { Colors } from '@/constants/Colors';
// import { useAuth } from '@/contexts/AuthContext';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { Link } from 'expo-router';
// import React, { useState } from 'react';
// import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// export default function RegisterScreen() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const { login } = useAuth();
//   const colorScheme = useColorScheme() ?? 'light';
//   const theme = Colors[colorScheme];

//   const handleRegister = async () => {
//     if (!username || !password || !confirmPassword) {
//       return Alert.alert('Error', 'Please fill in all fields.');
//     }
//     if (password !== confirmPassword) {
//       return Alert.alert('Error', 'Passwords do not match.');
//     }
//     try {
//       const response = await api.post('/auth/register', { username, password });
//       const { token, userId, username: loggedInUsername } = response.data;
//       login(token, userId, loggedInUsername);
//     } catch (error: any) {
//       Alert.alert('Registration Failed', error.response?.data?.msg || 'An error occurred.');
//     }
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.background }]}>
//       <View style={[styles.card, { backgroundColor: theme.card }]}>
//         <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
//         <Text style={[styles.subtitle, { color: theme.icon }]}>Sign up to start using CalcuVerse</Text>
//         <TextInput
//           style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
//           placeholder="Username"
//           placeholderTextColor={theme.icon}
//           value={username}
//           onChangeText={setUsername}
//           autoCapitalize="none"
//         />
//         <TextInput
//           style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
//           placeholder="Password"
//           placeholderTextColor={theme.icon}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//         <TextInput
//           style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
//           placeholder="Confirm Password"
//           placeholderTextColor={theme.icon}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//         />
//         <TouchableOpacity
//           style={[styles.button, { backgroundColor: theme.tint }]}
//           onPress={handleRegister}
//         >
//           <Text style={styles.buttonText}>Register</Text>
//         </TouchableOpacity>
//         <Link href="../(auth)/login" style={styles.link}>
//           <Text style={{ color: theme.tint }}>Already have an account? Login</Text>
//         </Link>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   card: { padding: 25, borderRadius: 16, elevation: 4, shadowOpacity: 0.1 },
//   title: { fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
//   subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
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

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      return Alert.alert('Error', 'Please fill in all fields.');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match.');
    }
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { username, password });
      const { token, userId, username: loggedInUsername } = response.data;
      login(token, userId, loggedInUsername);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.msg || 'An error occurred.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.icon }]}>Sign up to start using CalcuVerse</Text>
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
          placeholder="Password (min. 6 characters)"
          placeholderTextColor={theme.icon}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="next"
        />
        <TextInput
          style={[styles.input, { borderColor: theme.icon, color: theme.text }]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.icon}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.tint }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>
        
        {/* Use the Link component with an absolute path */}
        <Link href="/(auth)/login" asChild>
            <TouchableOpacity style={styles.link}>
                <Text style={{ color: theme.tint }}>Already have an account? Login</Text>
            </TouchableOpacity>
        </Link>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 20 },
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