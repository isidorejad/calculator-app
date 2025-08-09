import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { username, profilePictureUrl } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  // Animation values
  const card1Opacity = useSharedValue(0);
  const card1TranslateY = useSharedValue(50);
  const card2Opacity = useSharedValue(0);
  const card2TranslateY = useSharedValue(50);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    // Correct way to use delay in Reanimated v2/v3
    headerOpacity.value = withTiming(1, { duration: 400 });
    card1Opacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    card1TranslateY.value = withDelay(200, withTiming(0, { duration: 500 }));
    card2Opacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    card2TranslateY.value = withDelay(400, withTiming(0, { duration: 500 }));
  }, []);

  const card1AnimatedStyle = useAnimatedStyle(() => ({
    opacity: card1Opacity.value,
    transform: [{ translateY: card1TranslateY.value }],
  }));

  const card2AnimatedStyle = useAnimatedStyle(() => ({
    opacity: card2Opacity.value,
    transform: [{ translateY: card2TranslateY.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
      opacity: headerOpacity.value,
  }));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View>
          <Text style={[styles.greeting, { color: theme.icon }]}>{getGreeting()},</Text>
          <Text style={[styles.username, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>{username}!</Text>
        </View>
        <Link href="/settings" asChild>
          <TouchableOpacity>
            <Image 
              source={profilePictureUrl ? { uri: profilePictureUrl } : require('@/assets/images/icon.png')} 
              style={styles.avatar} 
            />
          </TouchableOpacity>
        </Link>
      </Animated.View>

      <View style={styles.content}>
        <AnimatedTouchableOpacity style={[styles.card, card1AnimatedStyle, {backgroundColor: theme.card, shadowColor: theme.text}]}>
            <Link href="/calculator" asChild>
                <TouchableOpacity style={styles.cardLink}>
                    <Ionicons name="calculator" size={32} color={theme.tint} />
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.cardTitle, {color: theme.text}]}>Calculator</Text>
                        <Text style={[styles.cardSubtitle, {color: theme.icon}]}>Standard & Scientific</Text>
                    </View>
                </TouchableOpacity>
            </Link>
        </AnimatedTouchableOpacity>
        <AnimatedTouchableOpacity style={[styles.card, card2AnimatedStyle, {backgroundColor: theme.card, shadowColor: theme.text}]}>
            <Link href="../(converters)" asChild>
                 <TouchableOpacity style={styles.cardLink}>
                    <Ionicons name="swap-horizontal" size={32} color={theme.tint} />
                    <View style={styles.cardTextContainer}>
                        <Text style={[styles.cardTitle, {color: theme.text}]}>Converters</Text>
                        <Text style={[styles.cardSubtitle, {color: theme.icon}]}>Currency, Units & Tips</Text>
                    </View>
                 </TouchableOpacity>
            </Link>
        </AnimatedTouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, paddingHorizontal: 10 },
  greeting: { fontSize: 18 },
  username: { fontSize: 28, fontWeight: 'bold' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  content: { paddingHorizontal: 10 },
  card: { padding: 20, borderRadius: 15, marginBottom: 20, elevation: 4, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: {width: 0, height: 4}},
  cardLink: { flexDirection: 'row', alignItems: 'center' },
  cardTextContainer: { marginLeft: 15 },
  cardTitle: { fontSize: 20, fontWeight: '600', },
  cardSubtitle: { fontSize: 14, opacity: 0.8 },
});