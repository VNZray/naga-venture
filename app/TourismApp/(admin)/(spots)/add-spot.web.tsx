import Stepper from '@/components/StepperComponent';
import { ThemedText } from '@/components/ThemedText';
import { TouristSpotFormData } from '@/types/TouristSpotFormData';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

// Import step components
import PressableButton from '@/components/PressableButton';
import StepSpotBasics from './steps/StepSpotBasics';
import StepSpotContact from './steps/StepSpotContact';
import StepSpotDescription from './steps/StepSpotDescription';
import StepSpotLocation from './steps/StepSpotLocation';
import StepSpotSubmit from './steps/StepSpotSubmit';

const steps = ['Basics', 'Location', 'Contact', 'Description', 'Submit'];

const AddSpotForm = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<TouristSpotFormData>({
    name: '',
    description: '',
    spot_type: '',
    address: '',
    city: '',
    province: '',
    latitude: '',
    longitude: '',
    contact_phone: '',
    contact_email: '',
    website: '',
    opening_time: '',
    closing_time: '',
    entry_fee: '',
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    console.log('Submitting new spot:', formData);
    // Implement actual submission logic here (e.g., API call to Supabase)
    onClose();
    setCurrentStep(0); // Reset form for next use
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepSpotBasics
            data={formData}
            setData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev} // onPrev will be disabled on first step
          />
        );
      case 1:
        return (
          <StepSpotLocation
            data={formData}
            setData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 2:
        return (
          <StepSpotContact
            data={formData}
            setData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 3:
        return (
          <StepSpotDescription
            data={formData}
            setData={setFormData}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        );
      case 4:
        return (
          <StepSpotSubmit
            data={formData}
            setData={setFormData}
            onNext={handleSubmit}
            onPrev={handlePrev}
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
        setCurrentStep(0); // Reset step on modal close
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
                setCurrentStep(0); // Reset step on close
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
