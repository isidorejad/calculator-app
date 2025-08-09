import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';

export default function DrawerLayout() {
 const colorScheme = useColorScheme();
 const theme = Colors[colorScheme ?? 'light'];

 return (
   <Drawer
     screenOptions={{
       headerStyle: {
         backgroundColor: theme.background,
       },
       headerTintColor: theme.text,
       drawerStyle: {
         backgroundColor: theme.background,
       },
       drawerActiveTintColor: theme.tint,
       drawerInactiveTintColor: theme.tabIconDefault,
     }}>
     <Drawer.Screen
       name="calculator"
       options={{
         title: 'Calculator',
         drawerIcon: ({ color, size }) => (
           <Ionicons name="calculator-outline" size={size} color={color} />
         ),
       }}
     />
     <Drawer.Screen
       name="converter"
       options={{
         title: 'Converter',
         drawerIcon: ({ color, size }) => (
           <Ionicons name="swap-horizontal-outline" size={size} color={color} />
         ),
       }}
     />
     <Drawer.Screen
       name="settings"
       options={{
         title: 'Settings',
         drawerIcon: ({ color, size }) => (
           <Ionicons name="settings-outline" size={size} color={color} />
         ),
       }}
     />
   </Drawer>
 );
}