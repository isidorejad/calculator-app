import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

const InitialLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (isAuthenticated && inAuthGroup) {
      router.replace('../(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('../(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments, router]);

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