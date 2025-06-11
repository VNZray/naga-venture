// filepath: components/TourismCMS/organisms/BusinessForm.tsx
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Controller } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

// Smart hook
import { useBusinessForm } from '@/hooks/useBusinessForm';

// Types
import { Business } from '@/types/supabase';

// Components
import { CMSButton, CMSInput } from '@/components/TourismCMS/atoms';

interface BusinessFormProps {
  initialData?: Business;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

/**
 * BusinessForm Organism (Dumb Component)
 *
 * Pure presentation component for business forms.
 * All logic is handled by the useBusinessForm hook (Smart Hook pattern).
 */
export default function BusinessForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: BusinessFormProps) {
  console.log('🏗️ [BusinessForm] Component rendered');
  console.log('🏗️ [BusinessForm] Props:', {
    hasInitialData: !!initialData,
    hasOnSubmit: typeof onSubmit === 'function',
    hasOnCancel: typeof onCancel === 'function',
    isLoading,
    isEdit,
  });

  const {
    control,
    errors,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    handleSubmit,
    handleCancel,
    canGoNext,
    canGoPrev,
    isLastStep,
    isCurrentStepValid,
    isNavigating,
  } = useBusinessForm({
    initialData,
    onSubmit,
    onCancel,
    isEdit,
  });
  console.log('🏗️ [BusinessForm] Hook state:', {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrev,
    isLastStep,
    isCurrentStepValid,
    isNavigating,
    hasHandleCancel: typeof handleCancel === 'function',
  });

  // Debug wrapper for cancel button
  const handleCancelClick = () => {
    console.log('🔴 [BusinessForm] Cancel button clicked');
    console.log('🔴 [BusinessForm] handleCancel type:', typeof handleCancel);
    console.log('🔴 [BusinessForm] isLoading:', isLoading);

    try {
      handleCancel();
      console.log('✅ [BusinessForm] handleCancel executed');
    } catch (error) {
      console.error('❌ [BusinessForm] Error in handleCancel:', error);
    }
  };

  // Step 1: Basic Information
  const renderBasicInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepDescription}>
        Provide the basic details about your business
      </Text>

      <Controller
        control={control}
        name="business_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Business Name"
            placeholder="Enter business name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.business_name?.message}
            required
            editable={!isLoading}
          />
        )}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Business Type <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Controller
            control={control}
            name="business_type"
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.picker}
                enabled={!isLoading}
              >
                <Picker.Item label="Shop" value="shop" />
                <Picker.Item label="Accommodation" value="accommodation" />
                <Picker.Item label="Service" value="service" />
              </Picker>
            )}
          />
        </View>
        {errors.business_type && (
          <Text style={styles.errorText}>{errors.business_type.message}</Text>
        )}
      </View>

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Description"
            placeholder="Describe your business (minimum 200 characters)..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            multiline
            numberOfLines={4}
            required
            editable={!isLoading}
          />
        )}
      />
    </View>
  );

  // Step 2: Location Information
  const renderLocationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Location Details</Text>
      <Text style={styles.stepDescription}>
        Provide the location and address information
      </Text>

      <Controller
        control={control}
        name="address"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Address"
            placeholder="Enter complete address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.address?.message}
            required
            editable={!isLoading}
          />
        )}
      />

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <CMSInput
                label="City"
                placeholder="Enter city"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.city?.message}
                required
                editable={!isLoading}
              />
            )}
          />
        </View>

        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="province"
            render={({ field: { onChange, onBlur, value } }) => (
              <CMSInput
                label="Province"
                placeholder="Enter province"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.province?.message}
                required
                editable={!isLoading}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="postal_code"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Postal Code"
            placeholder="Enter postal code (optional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.postal_code?.message}
            editable={!isLoading}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Location Coordinates</Text>
      <Text style={styles.helpText}>
        Provide exact coordinates for map display. Default is Naga City center.
      </Text>

      <View style={styles.row}>
        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="latitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <CMSInput
                label="Latitude"
                placeholder="13.6218"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 13.6218)}
                onBlur={onBlur}
                error={errors.latitude?.message}
                keyboardType="decimal-pad"
                required
                editable={!isLoading}
              />
            )}
          />
        </View>

        <View style={styles.halfWidth}>
          <Controller
            control={control}
            name="longitude"
            render={({ field: { onChange, onBlur, value } }) => (
              <CMSInput
                label="Longitude"
                placeholder="123.1948"
                value={value?.toString() || ''}
                onChangeText={(text) => onChange(parseFloat(text) || 123.1948)}
                onBlur={onBlur}
                error={errors.longitude?.message}
                keyboardType="decimal-pad"
                required
                editable={!isLoading}
              />
            )}
          />
        </View>
      </View>
    </View>
  );

  // Step 3: Contact Information
  const renderContactStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Contact Information</Text>
      <Text style={styles.stepDescription}>
        Add contact details and social media links (all optional)
      </Text>

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Phone Number"
            placeholder="Enter phone number"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.phone?.message}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Email Address"
            placeholder="Enter email address"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        )}
      />

      <Controller
        control={control}
        name="website"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Website"
            placeholder="https://yourwebsite.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.website?.message}
            keyboardType="url"
            autoCapitalize="none"
            editable={!isLoading}
          />
        )}
      />

      <Text style={styles.sectionTitle}>Social Media Links</Text>

      <Controller
        control={control}
        name="facebook_url"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Facebook"
            placeholder="https://facebook.com/yourpage"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.facebook_url?.message}
            keyboardType="url"
            autoCapitalize="none"
            editable={!isLoading}
          />
        )}
      />

      <Controller
        control={control}
        name="instagram_url"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Instagram"
            placeholder="https://instagram.com/youraccount"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.instagram_url?.message}
            keyboardType="url"
            autoCapitalize="none"
            editable={!isLoading}
          />
        )}
      />

      <Controller
        control={control}
        name="twitter_url"
        render={({ field: { onChange, onBlur, value } }) => (
          <CMSInput
            label="Twitter"
            placeholder="https://twitter.com/youraccount"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.twitter_url?.message}
            keyboardType="url"
            autoCapitalize="none"
            editable={!isLoading}
          />
        )}
      />
    </View>
  );

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderLocationStep();
      case 3:
        return renderContactStep();
      default:
        return null;
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <View key={stepNumber} style={styles.stepIndicatorItem}>
            <View
              style={[
                styles.stepCircle,
                isActive && styles.stepCircleActive,
                isCompleted && styles.stepCircleCompleted,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (isActive || isCompleted) && styles.stepNumberActive,
                ]}
              >
                {stepNumber}
              </Text>
            </View>
            <Text
              style={[styles.stepLabel, isActive && styles.stepLabelActive]}
            >
              {stepNumber === 1 && 'Basic Info'}
              {stepNumber === 2 && 'Location'}
              {stepNumber === 3 && 'Contact'}
            </Text>
            {stepNumber < totalSteps && <View style={styles.stepConnector} />}
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {renderStepIndicator()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <View style={styles.buttonRow}>
          {canGoPrev && (
            <CMSButton
              title="Previous"
              onPress={prevStep}
              variant="secondary"
              style={styles.navButton}
              disabled={isLoading || isNavigating}
            />
          )}{' '}
          <CMSButton
            title="Cancel"
            onPress={handleCancelClick}
            variant="tertiary"
            style={styles.navButton}
            disabled={isLoading}
          />
          {canGoNext ? (
            <CMSButton
              title="Next"
              onPress={nextStep}
              variant="primary"
              style={styles.navButton}
              disabled={isLoading || isNavigating || !isCurrentStepValid}
            />
          ) : (
            <CMSButton
              title={isEdit ? 'Update Business' : 'Create Business'}
              onPress={handleSubmit}
              variant="primary"
              loading={isLoading}
              disabled={isLoading || !isCurrentStepValid}
              style={styles.navButton}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  stepIndicator: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepIndicatorItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: '#3B82F6',
  },
  stepCircleCompleted: {
    backgroundColor: '#10B981',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  stepConnector: {
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '-40%',
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  scrollView: {
    flex: 1,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  required: {
    color: '#DC2626',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
    ...Platform.select({
      android: {
        color: '#374151',
      },
    }),
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 16,
  },
  navigationButtons: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
  },
});
