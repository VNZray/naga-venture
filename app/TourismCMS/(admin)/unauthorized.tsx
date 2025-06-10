import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UnauthorizedScreen() {
  const { userProfile } = useAuth();

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'business_listing_manager':
        return 'Business Listing Manager - You can manage business listings, categories, reviews, and content approval.';
      case 'tourism_content_manager':
        return 'Tourism Content Manager - You can manage tourism content, events, categories, and reviews.';
      case 'business_registration_manager':
        return 'Business Registration Manager - You can manage business registrations and business owners.';
      case 'tourism_admin':
        return 'Tourism Admin - You have full access to all sections.';
      default:
        return 'Your role does not have access to administrative functions.';
    }
  };

  return (
    <View style={styles.container}>
      <FontAwesome
        name="exclamation-triangle"
        size={60}
        color="#FFA000"
        style={styles.icon}
      />
      <Text style={styles.title}>Access Denied</Text>
      <Text style={styles.message}>
        You do not have the necessary permissions to access this section.
      </Text>

      {userProfile?.role && (
        <View style={styles.roleInfo}>
          <Text style={styles.roleTitle}>Your Current Role:</Text>
          <Text style={styles.roleDescription}>
            {getRoleDescription(userProfile.role)}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/TourismCMS/(admin)/dashboard')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => router.replace('/TourismCMS/login')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Switch Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#f8f9fa',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  roleInfo: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    maxWidth: 400,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#00796B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00796B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#00796B',
  },
});
