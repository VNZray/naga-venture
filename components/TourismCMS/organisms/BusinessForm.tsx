// filepath: components/TourismCMS/organisms/BusinessForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

// Types and hooks
import { Business } from '@/types/supabase';

// Components
import { CMSButton, CMSInput } from '@/components/TourismCMS/atoms';

// Validation schema
const businessFormSchema = z.object({
  business_name: z
    .string()
    .min(2, 'Business name must be at least 2 characters'),
  business_type: z.enum(['accommodation', 'shop', 'service'], {
    required_error: 'Please select a business type',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province is required'),
  postal_code: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  facebook_url: z
    .string()
    .url('Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  instagram_url: z
    .string()
    .url('Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
  twitter_url: z
    .string()
    .url('Invalid Twitter URL')
    .optional()
    .or(z.literal('')),
});

type BusinessFormData = z.infer<typeof businessFormSchema>;

interface BusinessFormProps {
  initialData?: Business;
  onSubmit: (data: any) => void; // Generic to accept both BusinessInsert and BusinessUpdate
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

/**
 * BusinessForm Organism
 *
 * Comprehensive form component for creating and editing business listings.
 * Supports validation, multi-step flow, and all business data fields.
 */
export default function BusinessForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEdit = false,
}: BusinessFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessFormSchema),
    defaultValues: initialData
      ? {
          business_name: initialData.business_name,
          business_type: initialData.business_type,
          description: initialData.description,
          address: initialData.address,
          city: initialData.city,
          province: initialData.province,
          postal_code: initialData.postal_code || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          website: initialData.website || '',
          facebook_url: initialData.facebook_url || '',
          instagram_url: initialData.instagram_url || '',
          twitter_url: initialData.twitter_url || '',
        }
      : {
          business_name: '',
          business_type: 'shop',
          description: '',
          address: '',
          city: '',
          province: '',
          postal_code: '',
          phone: '',
          email: '',
          website: '',
          facebook_url: '',
          instagram_url: '',
          twitter_url: '',
        },
    mode: 'onChange',
  });

  // Handle form submission
  const onFormSubmit = (data: BusinessFormData) => {
    // Transform form data to match database structure
    const businessData = {
      ...data,
      // Set empty strings to null for optional fields
      postal_code: data.postal_code || null,
      phone: data.phone || null,
      email: data.email || null,
      website: data.website || null,
      facebook_url: data.facebook_url || null,
      instagram_url: data.instagram_url || null,
      twitter_url: data.twitter_url || null,
      // Default values for required fields not in form
      status: 'pending' as const,
      is_claimed: true,
      is_featured: false,
      review_count: 0,
      average_rating: null,
    };

    onSubmit(businessData);
  };

  // Handle step navigation
  const nextStep = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Validate current step fields
  const validateCurrentStep = async (): Promise<boolean> => {
    switch (currentStep) {
      case 1:
        return await trigger(['business_name', 'business_type', 'description']);
      case 2:
        return await trigger(['address', 'city', 'province']);
      case 3:
        return await trigger([
          'phone',
          'email',
          'website',
          'facebook_url',
          'instagram_url',
          'twitter_url',
        ]);
      default:
        return true;
    }
  };

  // Render step content
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
            placeholder="Describe your business..."
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            multiline
            numberOfLines={4}
            required
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
          />
        )}
      />
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
          />
        )}
      />
      <Text style={styles.sectionTitle}>Social Media Links</Text>{' '}
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
          />
        )}
      />
    </View>
  );

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
      >
        {renderStepContent()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <View style={styles.buttonRow}>
          {currentStep > 1 && (
            <CMSButton
              title="Previous"
              onPress={prevStep}
              variant="secondary"
              style={styles.navButton}
            />
          )}

          <CMSButton
            title="Cancel"
            onPress={onCancel}
            variant="tertiary"
            style={styles.navButton}
          />

          {currentStep < totalSteps ? (
            <CMSButton
              title="Next"
              onPress={nextStep}
              variant="primary"
              style={styles.navButton}
            />
          ) : (
            <CMSButton
              title={isEdit ? 'Update Business' : 'Create Business'}
              onPress={handleSubmit(onFormSubmit)}
              variant="primary"
              loading={isLoading}
              disabled={!isValid}
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
