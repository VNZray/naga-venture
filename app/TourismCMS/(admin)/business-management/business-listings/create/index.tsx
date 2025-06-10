// filepath: app/TourismCMS/(admin)/business-management/business-listings/create/index.tsx
import { router } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks and types
import { useCreateBusiness } from '@/hooks/useBusinessManagement';
import { BusinessInsert } from '@/types/supabase';

// Components
import { BusinessForm, CMSRouteGuard } from '@/components/TourismCMS/organisms';

/**
 * Create Business Page
 *
 * Form page for creating new business listings with multi-step workflow.
 */
export default function CreateBusinessScreen() {
  const createBusinessMutation = useCreateBusiness();

  const handleSubmit = (data: BusinessInsert) => {
    createBusinessMutation.mutate(data, {
      onSuccess: (newBusiness) => {
        Alert.alert(
          'Success',
          'Business listing has been created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to business listings
                router.replace(
                  '/TourismCMS/(admin)/business-management/business-listings/all-businesses'
                );
              },
            },
          ]
        );
      },
      onError: (error) => {
        Alert.alert(
          'Error',
          'Failed to create business listing. Please try again.',
          [{ text: 'OK' }]
        );
        console.error('Create business error:', error);
      },
    });
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Creation',
      'Are you sure you want to cancel? All entered data will be lost.',
      [
        { text: 'Continue Editing', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/create">
      <SafeAreaView style={styles.container}>
        <BusinessForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createBusinessMutation.isPending}
          isEdit={false}
        />
      </SafeAreaView>
    </CMSRouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});
