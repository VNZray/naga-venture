// filepath: c:\Users\Hans Candor\Documents\capstone-NV\naga-venture\app\TourismCMS\(admin)\business-management\business-listings\create.tsx
// filepath: app/TourismCMS/(admin)/business-management/business-listings/create/index.tsx
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks and types
import { useCreateBusiness } from '@/hooks/useBusinessManagement';
import { BusinessInsert } from '@/types/supabase';

// Services
import { NavigationService } from '@/services/NavigationService';

// Components
import { ConfirmationModal } from '@/components/TourismCMS/molecules/ConfirmationModal';
import { BusinessForm, CMSRouteGuard } from '@/components/TourismCMS/organisms';

/**
 * Create Business Page
 *
 * Form page for creating new business listings with multi-step workflow.
 */
export default function CreateBusinessScreen() {
  const createBusinessMutation = useCreateBusiness();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleSubmit = (data: BusinessInsert) => {
    createBusinessMutation.mutate(data, {
      onSuccess: (newBusiness) => {
        setSuccessMessage(
          `Business "${newBusiness.business_name}" has been created successfully!`
        );
        setSuccessModalVisible(true);
      },
      onError: (error) => {
        console.error('Create business error:', error);
        setErrorMessage(
          `Failed to create business listing. Please try again.\n\nError Details: ${error.message}`
        );
        setErrorModalVisible(true);
      },
    });
  };
  const handleCancel = () => {
    console.log('🔴 [CreateBusinessScreen] Cancel button clicked');
    console.log('🔴 [CreateBusinessScreen] About to show confirmation modal');
    setCancelModalVisible(true);
  };

  const confirmCancel = () => {
    console.log(
      '✅ [CreateBusinessScreen] User confirmed cancel - navigating back'
    );
    setCancelModalVisible(false);
    try {
      NavigationService.toAllBusinesses();
      console.log('✅ [CreateBusinessScreen] Navigation successful');
    } catch (error) {
      console.error('❌ [CreateBusinessScreen] Navigation error:', error);
    }
  };
  const cancelCancel = () => {
    console.log('⏸️ [CreateBusinessScreen] User chose to continue editing');
    setCancelModalVisible(false);
  };

  const handleSuccessOk = () => {
    setSuccessModalVisible(false);
    NavigationService.toAllBusinesses();
  };

  const handleErrorOk = () => {
    setErrorModalVisible(false);
  };
  return (
    <CMSRouteGuard routePath="/TourismCMS/(admin)/business-management/business-listings/create">
      <SafeAreaView style={styles.container}>
        {/*
          FIX: Add a static key. This ensures that the "Create" screen *always*
          has a different key than the "Edit" screen, forcing a full remount
          when navigating between them and destroying any old state.
        */}
        <BusinessForm
          key="create-business-form" // <-- THE FIX
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createBusinessMutation.isPending}
          isEdit={false}
        />
        <ConfirmationModal
          visible={cancelModalVisible}
          title="Cancel Action"
          message="Are you sure you want to cancel? Any unsaved changes will be lost."
          confirmText="Cancel"
          cancelText="Continue Editing"
          confirmStyle="destructive"
          onConfirm={confirmCancel}
          onCancel={cancelCancel}
        />

        <ConfirmationModal
          visible={successModalVisible}
          title="Success"
          message={successMessage}
          confirmText="OK"
          cancelText=""
          onConfirm={handleSuccessOk}
          onCancel={handleSuccessOk}
        />

        <ConfirmationModal
          visible={errorModalVisible}
          title="Error"
          message={errorMessage}
          confirmText="OK"
          cancelText=""
          onConfirm={handleErrorOk}
          onCancel={handleErrorOk}
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
