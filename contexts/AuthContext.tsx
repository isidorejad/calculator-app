import api from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  profilePictureUrl: string;
  preferredCurrency: string;
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId: string, username: string, profilePictureUrl: string, preferredCurrency: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  username: string | null;
  profilePictureUrl: string | null;
  preferredCurrency: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Define logout function here so it can be used in useEffect
  const performLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'userId']);
      setToken(null);
      setUserId(null);
      setUserInfo({});
      delete api.defaults.headers.common['x-auth-token'];
      router.replace('/login');
    } catch (e) {
      console.error('Failed to clear auth state.', e);
    }
  };
  
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            api.defaults.headers.common['x-auth-token'] = storedToken;
            const { data } = await api.get('/profile/me');
            setUserInfo({ 
                username: data.username,
                profilePictureUrl: data.profilePictureUrl,
                preferredCurrency: data.preferredCurrency,
            });
            setUserId(data._id);
        }
      } catch (e) {
        console.error('Token expired or invalid. Logging out.', e);
        await performLogout();
      } finally {
        setIsLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const login = async (newToken: string, newUserId: string, newUsername: string, newProfilePic: string, newPrefCurrency: string) => {
    try {
      await AsyncStorage.setItem('token', newToken);
      await AsyncStorage.setItem('userId', newUserId);
      setToken(newToken);
      setUserId(newUserId);
      setUserInfo({ username: newUsername, profilePictureUrl: newProfilePic, preferredCurrency: newPrefCurrency });
      api.defaults.headers.common['x-auth-token'] = newToken;
      router.replace('/home');
    } catch (e) {
      console.error('Failed to save auth state.', e);
    }
  };

  const updateUser = (newUser: Partial<User>) => {
      setUserInfo(prev => ({ ...prev, ...newUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout: performLogout,
        updateUser,
        username: userInfo.username || null,
        profilePictureUrl: userInfo.profilePictureUrl || null,
        preferredCurrency: userInfo.preferredCurrency || null,
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