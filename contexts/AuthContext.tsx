import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  userId: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedUsername = await AsyncStorage.getItem('username');

        if (storedToken) {
          setToken(storedToken);
          setUserId(storedUserId);
          setUsername(storedUsername);
          // Set the token for all subsequent api requests
          api.defaults.headers.common['x-auth-token'] = storedToken;
        }
      } catch (e) {
        console.error('Failed to load auth state.', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const login = async (newToken: string, newUserId: string, newUsername: string) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('userId', newUserId);
      await AsyncStorage.setItem('username', newUsername);
      setToken(newToken);
      setUserId(newUserId);
      setUsername(newUsername);
      api.defaults.headers.common['x-auth-token'] = newToken;
      router.replace('../(tabs)/home');
    } catch (e) {
      console.error('Failed to save auth state.', e);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('username');
      setToken(null);
      setUserId(null);
      setUsername(null);
      delete api.defaults.headers.common['x-auth-token'];
      router.replace('../(auth)/login');
    } catch (e) {
      console.error('Failed to clear auth state.', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        username,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};