// filepath: app/TourismCMS/(admin)/business-management/business-listings/edit/[id]/index.tsx
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks and types
import { useBusiness, useUpdateBusiness } from '@/hooks/useBusinessManagement';
import { BusinessUpdate } from '@/types/supabase';

// Components
import { CMSButton } from '@/components/TourismCMS/atoms';
import { BusinessForm, CMSRouteGuard } from '@/components/TourismCMS/organisms';

/**
 * Edit Business Page
 *
 * Dynamic route page for editing existing business listings.
 * Loads business data and provides pre-filled form.
 */
export default function EditBusinessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch business data
  const {
    data: business,
    isLoading: businessLoading,
    isError,
    error,
  } = useBusiness(id);

  const updateBusinessMutation = useUpdateBusiness();
  const handleSubmit = (data: BusinessUpdate) => {
    if (!id) return;

    updateBusinessMutation.mutate(
      { businessId: id, updateData: data },
      {
        onSuccess: (updatedBusiness) => {
          Alert.alert(
            'Success',
            'Business listing has been updated successfully!',
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
            'Failed to update business listing. Please try again.',
            [{ text: 'OK' }]
          );
          console.error('Update business error:', error);
        },
      }
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Changes',
      'Are you sure you want to cancel? All unsaved changes will be lost.',
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

  // Loading state
  if (businessLoading) {
    return (
      <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/edit">
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading business details...</Text>
          </View>
        </SafeAreaView>
      </CMSRouteGuard>
    );
  }

  // Error state
  if (isError || !business) {
    return (
      <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/edit">
        <SafeAreaView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Business Not Found</Text>
            <Text style={styles.errorMessage}>
              {error?.message || 'The requested business could not be found.'}
            </Text>
            <CMSButton
              title="Go Back"
              onPress={() => router.back()}
              variant="primary"
              style={styles.backButton}
            />
          </View>
        </SafeAreaView>
      </CMSRouteGuard>
    );
  }

  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/edit">
      <SafeAreaView style={styles.container}>
        <BusinessForm
          initialData={business}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateBusinessMutation.isPending}
          isEdit={true}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  backButton: {
    minWidth: 120,
  },
});
