import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

const SystemSettings = () => {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ThemedText darkColor="#000" type="title">
        System Settings
      </ThemedText>
      <ThemedText darkColor="#666" type="default">
        Configure system-wide settings and preferences
      </ThemedText>

      <View style={styles.content}>
        <ThemedText darkColor="#000" type="subtitle">
          Admin Settings
        </ThemedText>
        <ThemedText darkColor="#666" type="default">
          • User management{'\n'}• Role permissions{'\n'}• System configuration
          {'\n'}• Database management{'\n'}• Security settings{'\n'}• Backup and
          restore
        </ThemedText>

        <View style={styles.currentUser}>
          <ThemedText darkColor="#000" type="subtitle">
            Current User
          </ThemedText>
          <ThemedText darkColor="#666" type="default">
            Name: {profile?.first_name} {profile?.last_name}
            {'\n'}
            Role: {profile?.role?.replace('_', ' ').toUpperCase()}
            {'\n'}
            Status: {profile?.is_verified ? 'Verified' : 'Unverified'}
          </ThemedText>
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleSignOut}
            buttonColor="#fff"
            textColor="#dc3545"
            style={[styles.button, { borderColor: '#dc3545' }]}
          >
            Sign Out
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  content: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentUser: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  actions: {
    marginTop: 30,
    gap: 12,
  },
  button: {
    borderWidth: 1,
  },
});

export default SystemSettings;
