
import api from '@/api/api';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

// Initialize Supabase client (should ideally be in its own file)
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default function SettingsScreen() {
    const { username, profilePictureUrl, preferredCurrency, logout, updateUser } = useAuth();
    const { soundEnabled, toggleSound, hapticsEnabled, toggleHaptics } = useSettings();
    const [uploading, setUploading] = useState(false);
    
    const colorScheme = useColorScheme() ?? 'light';
    const theme = Colors[colorScheme];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadAvatar(result.assets[0].uri);
        }
    };

    const uploadAvatar = async (uri: string) => {
        setUploading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const fileExt = uri.split('.').pop();
            const filePath = `${Date.now()}.${fileExt}`;

            let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, blob, {
                contentType: `image/${fileExt}`,
            });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const newAvatarUrl = data.publicUrl;

            // Update user profile in our backend
            const { data: updatedUser } = await api.put('/profile', { profilePictureUrl: newAvatarUrl });
            
            // Update auth context state
            updateUser(updatedUser);

            Alert.alert("Success", "Profile picture updated!");

        } catch (error: any) {
            Alert.alert("Upload Error", error.message);
        } finally {
            setUploading(false);
        }
    };


    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.profileSection}>
                <TouchableOpacity onPress={pickImage} disabled={uploading}>
                    <Image 
                        source={profilePictureUrl ? { uri: profilePictureUrl } : require('@/assets/images/icon.png')} 
                        style={styles.avatar} 
                    />
                    {uploading && <ActivityIndicator style={StyleSheet.absoluteFill} />}
                    <View style={styles.editIconContainer}>
                       <Ionicons name="pencil" size={18} color="white" />
                    </View>
                </TouchableOpacity>
                <Text style={[styles.username, { color: theme.text }]}>{username}</Text>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, {color: theme.text}]}>App Preferences</Text>
                <View style={[styles.row, {backgroundColor: theme.card}]}>
                    <Text style={[styles.label, {color: theme.text}]}>Enable Sound</Text>
                    <Switch value={soundEnabled} onValueChange={toggleSound} trackColor={{ true: theme.tint }} />
                </View>
                 <View style={[styles.row, {backgroundColor: theme.card}]}>
                    <Text style={[styles.label, {color: theme.text}]}>Enable Haptics</Text>
                    <Switch value={hapticsEnabled} onValueChange={toggleHaptics} trackColor={{ true: theme.tint }} />
                </View>
            </View>

             <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Logout</Text>
             </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  // ... your new styles here
  container: { flex: 1 },
  profileSection: { alignItems: 'center', paddingVertical: 30 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
  editIconContainer: { position: 'absolute', bottom: 15, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 15 },
  username: { fontSize: 24, fontWeight: 'bold' },
  section: { marginHorizontal: 20, marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, opacity: 0.7 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 10 },
  label: { fontSize: 16 },
  logoutButton: { margin: 20, padding: 15, alignItems: 'center', backgroundColor: '#ff3b3020', borderRadius: 10 },
  logoutText: { color: '#ff3b30', fontSize: 16, fontWeight: '600' },
});