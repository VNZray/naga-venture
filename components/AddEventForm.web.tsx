import PressableButton from '@/components/PressableButton';
import Stepper from '@/components/StepperComponent';
import { ThemedText } from '@/components/ThemedText';
import { EventFormData, EventStatus } from '@/types/event';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  View
} from 'react-native';
import StepEventBasics from './events/steps/StepEventBasics';
import StepEventContact from './events/steps/StepEventContact';
import StepEventDescription from './events/steps/StepEventDescription';
import StepEventLocation from './events/steps/StepEventLocation';
import StepEventPermits from './events/steps/StepEventPermits.web';
import StepEventSubmit from './events/steps/StepEventSubmit';

const steps = [
  'Basic Information',
  'Location',
  'Contact',
  'Description',
  'Permits & Clearances',
  'Review & Submit',
];

const AddEventForm = ({
  isVisible,
  onClose,
  onEventAdded,
}: {
  isVisible: boolean;
  onClose: () => void;
  onEventAdded: (eventData: any) => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    event_type: 'other',
    address: '',
    city: '',
    province: '',
    latitude: '',
    longitude: '',
    additional_locations: [],
    contact_phone: '',
    contact_email: '',
    website: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    entry_fee: '',
    social_media: '',
    permits: {
      barangay_clearance: null,
      mayor_special_permit: null,
      fire_safety_certificate: null,
      sanitary_permit: null,
      zoning_clearance: null,
      others: [],
    },
  });

  const stepRequiredFields = {
    0: ['name', 'event_type'],
    1: ['address', 'city', 'province', 'latitude', 'longitude'],
    2: [],
    3: ['description'],
    // Step 4 validation handled explicitly below for nested permit fields
    4: [],
    5: [
      'name',
      'description',
      'event_type',
      'address',
      'latitude',
      'longitude',
      'start_date',
      'end_date',
      'start_time',
      'end_time',
    ],
  };

  const validateStep = (
    step: number
  ): { isValid: boolean; errors: string[] } => {
    const requiredFields =
      stepRequiredFields[step as keyof typeof stepRequiredFields] || [];
    const errors: string[] = [];

    requiredFields.forEach((field) => {
      const value = formData[field as keyof EventFormData];
      if (
        (typeof value === 'string' && !value.trim()) ||
        (typeof value === 'number' && isNaN(value)) ||
        (value === null || value === undefined)
      ) {
        errors.push(field);
      }
    });

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

    if (step === 4) {
      const p = formData.permits;
      if (!p || !p.barangay_clearance) errors.push('permits.barangay_clearance');
      if (!p || !p.mayor_special_permit) errors.push('permits.mayor_special_permit');
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
    setValidationAttempted(true);
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      return;
    }
    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        event_type: formData.event_type,
        address: formData.address,
        location: `POINT(${formData.longitude} ${formData.latitude})`,
        contact_phone: formData.contact_phone || null,
        contact_email: formData.contact_email || null,
        website: formData.website || null,
        start_date: formData.start_date || null,
        start_time: formData.start_time || null,
        end_date: formData.end_date || null,
        end_time: formData.end_time || null,
        entry_fee: formData.entry_fee ? parseFloat(formData.entry_fee) : null,
        permits: formData.permits,
        status: 'pending' as EventStatus,
      };

      console.log('Submitting event:', eventData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFormData({
        name: '',
        description: '',
        event_type: 'other',
        address: '',
        city: '',
        province: '',
        latitude: '',
        longitude: '',
        contact_phone: '',
        contact_email: '',
        website: '',
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        entry_fee: '',
        social_media: '',
        permits: {
          barangay_clearance: null,
          mayor_special_permit: null,
          fire_safety_certificate: null,
          sanitary_permit: null,
          zoning_clearance: null,
          others: [],
        },
      });

      setValidationAttempted(false);
      setCurrentStep(0);

      onEventAdded(eventData);
      onClose();
    } catch (error) {
      console.error('Error adding event:', error);
      window.alert('Error adding event: ' + (error as Error).message);
    }
  };

  const renderStepContent = () => {
    const validation = validateStep(currentStep);

    switch (currentStep) {
      case 0:
        return (
          <StepEventBasics
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 1:
        return (
          <StepEventLocation
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 2:
        return (
          <StepEventContact
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 3:
        return (
          <StepEventDescription
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 4:
        return (
          <StepEventPermits
            data={formData}
            setData={setFormData}
            errors={validationAttempted ? validation.errors : []}
          />
        );
      case 5:
        return (
          <StepEventSubmit
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
              Add New Event
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
                type="pagination"
                color="#000"
                Title="< Previous"
                onPress={handlePrev}
                width={150}
              />
            )}
            {currentStep < steps.length - 1 ? (
              <PressableButton
                type="pagination"
                color="#000"
                Title="Next >"
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
    width: 1100,
    maxWidth: 1100,
    height: 720,
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
    // Allow children to define scroll areas properly
    minHeight: 0,
  },
  stepFormContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // Make step content scrollable within modal
    overflow: 'scroll',
    minHeight: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#0A1B47',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEventForm; 