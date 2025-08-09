import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const InitialLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't do anything until auth state is loaded

    const inTabsGroup = segments[0] === '(tabs)';

    // If the user is authenticated and not in the main app group,
    // redirect them to the main app group.
    if (isAuthenticated && !inTabsGroup) {
      router.replace('/home'); // Use absolute path
    } 
    // If the user is not authenticated and is in a protected group,
    // redirect them to the login page.
    else if (!isAuthenticated && inTabsGroup) {
      router.replace('/login'); // Use absolute path
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Show a loading spinner while we check for the stored token
  if (isLoading) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" /></View>;
  }

  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <InitialLayout />
      </SettingsProvider>
    </AuthProvider>
  );
}