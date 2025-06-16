import Stepper from '@/components/StepperComponent';
import { ThemedText } from '@/components/ThemedText';
import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

// Import step components
import PressableButton from '@/components/PressableButton';
import { TouristSpotStatus, TouristSpotType } from '@/types/TouristSpot';
import { supabase } from '@/utils/supabase';
import StepSpotBasics from './steps/StepSpotBasics';
import StepSpotContact from './steps/StepSpotContact';
import StepSpotDescription from './steps/StepSpotDescription';
import StepSpotLocation from './steps/StepSpotLocation';
import StepSpotSubmit from './steps/StepSpotSubmit';

const steps = ['Basics', 'Location', 'Contact', 'Description', 'Submit'];

const AddSpotForm = ({
  isVisible,
  onClose,
  onSpotAdded,
}: {
  isVisible: boolean;
  onClose: () => void;
  onSpotAdded: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [formData, setFormData] = useState<TouristSpotFormData>({
    name: '',
    description: '',
    spot_type: 'Historical' as TouristSpotType,
    address: '',
    city: 'Naga City',
    province: 'Camarines Sur',
    latitude: '',
    longitude: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    opening_time: '',
    closing_time: '',
    entry_fee: '',
    picture: '',
  });

  // Define required fields for each step
  const stepRequiredFields = {
    0: ['name', 'spot_type'], // Basic Information
    1: ['address', 'city', 'province', 'latitude', 'longitude'], // Location
    2: [], // Contact (all optional)
    3: ['description'], // Description
  };

  const validateStep = (
    step: number
  ): { isValid: boolean; errors: string[] } => {
    const requiredFields =
      stepRequiredFields[step as keyof typeof stepRequiredFields] || [];
    const errors: string[] = [];

    requiredFields.forEach((field) => {
      const value = formData[field as keyof TouristSpotFormData];
      if (!value || value.trim() === '') {
        errors.push(field);
      }
    });

    // Additional validation for coordinates in step 1
    if (step === 1) {
      if (formData.latitude) {
        const lat = parseFloat(formData.latitude);
        if (isNaN(lat) || lat < -90 || lat > 90) {
          errors.push('latitude');
        }
      }
      if (formData.longitude) {
        const lng = parseFloat(formData.longitude);
        if (isNaN(lng) || lng < -180 || lng > 180) {
          errors.push('longitude');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleNext = () => {
    setValidationAttempted(true);
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      return;
    }
    setValidationAttempted(false);
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setValidationAttempted(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      // Validate only the required fields from the database schema
      const requiredFields = [
        'name',
        'description',
        'spot_type',
        'address',
        'latitude',
        'longitude', // latitude and longitude are required to create the location POINT
      ];

      const emptyFields = requiredFields.filter(
        (field) => !formData[field as keyof TouristSpotFormData]
      );

      if (emptyFields.length > 0) {
        window.alert(
          `Please fill in all required fields: ${emptyFields.join(', ')}`
        );
        return;
      }

      // Format the data for Supabase
      const spotData = {
        name: formData.name,
        description: formData.description,
        spot_type: formData.spot_type,
        address: formData.address,
        location: `POINT(${formData.longitude} ${formData.latitude})`,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        website: formData.website || null,
        entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : null,
        opening_time: formData.opening_time || null,
        closing_time: formData.closing_time || null,
        status: 'pending' as TouristSpotStatus,
        picture: formData.picture || null,
      };

      const { error } = await supabase.from('tourist_spots').insert([spotData]);

      if (error) throw error;

      // Reset form data
      setFormData({
        name: '',
        description: '',
        spot_type: 'Historical' as TouristSpotType,
        address: '',
        city: 'Naga City',
        province: 'Camarines Sur',
        latitude: '',
        longitude: '',
        contact_phone: '',
        contact_email: '',
        website: '',
        opening_time: '',
        closing_time: '',
        entry_fee: '',
        picture: '',
      });

      // Reset validation state
      setValidationAttempted(false);
      setCurrentStep(0);

      // Close modal and refresh data
      onClose();
      onSpotAdded();
    } catch (error) {
      console.error('Error adding spot:', error);
      window.alert('Error adding spot: ' + (error as Error).message);
    }
  };

  const renderStepContent = () => {
    const validation = validateStep(currentStep);

    switch (currentStep) {
      case 0:
        return (
          <StepSpotBasics
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 1:
        return (
          <StepSpotLocation
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 2:
        return (
          <StepSpotContact
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 3:
        return (
          <StepSpotDescription
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 4:
        return (
          <StepSpotSubmit
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        onClose();
        setCurrentStep(0);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <ThemedText type="title" darkColor="#000">
              Add New Tourist Spot
            </ThemedText>
            <Pressable
              onPress={() => {
                onClose();
                setCurrentStep(0);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={32} color="#000" />
            </Pressable>
          </View>

          <View style={styles.modalContent}>
            <Stepper currentStep={currentStep} steps={steps} />
            <View style={styles.stepFormContainer}>{renderStepContent()}</View>
          </View>

          <View style={styles.buttonContainer}>
            {currentStep > 0 && (
              <PressableButton
                type="secondary"
                color="#fff"
                Title="Previous"
                onPress={handlePrev}
                width={150}
              />
            )}
            {currentStep < steps.length - 1 ? (
              <PressableButton
                type="primary"
                color="#fff"
                Title="Next"
                onPress={handleNext}
                width={150}
              />
            ) : (
              <PressableButton
                type="primary"
                color="#fff"
                Title="Submit"
                onPress={handleSubmit}
                width={150}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxWidth: 1000,
    height: 650,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  stepFormContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
});

export default AddSpotForm;
