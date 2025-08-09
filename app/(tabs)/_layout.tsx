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
      // REMOVE all headers from the tab screens
      headerShown: false, 
    }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-sharp" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calculator"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <Ionicons name="calculator-sharp" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(converters)" // This points to the converter stack
        options={{
          title: 'Converters',
          tabBarIcon: ({ color }) => <Ionicons name="swap-horizontal-sharp" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="time-sharp" size={28} color={color} />,
        }}
      />
      {/* ADDED the new Settings tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-sharp" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}