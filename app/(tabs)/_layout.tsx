import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.tint,
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <Ionicons name="calculator" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(converters)" // This points to the converter stack
        options={{
          title: 'Converters',
          headerShown: false, // The stack has its own header
          tabBarIcon: ({ color }) => <Ionicons name="swap-horizontal" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="time" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}