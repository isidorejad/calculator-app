import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

interface SettingsContextType {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  toggleSound: () => void;
  toggleHaptics: () => void;
  playSound: () => void;
  triggerHaptics: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const playSound = async () => {
    if (soundEnabled) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/click.mp3')
        );
        await sound.playAsync();
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    }
  };

  const triggerHaptics = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const value = {
    soundEnabled,
    hapticsEnabled,
    toggleSound: () => setSoundEnabled(prev => !prev),
    toggleHaptics: () => setHapticsEnabled(prev => !prev),
    playSound,
    triggerHaptics,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};