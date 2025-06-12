import Stepper from '@/components/StepperComponent';
import React, { useState } from 'react';
import { View } from 'react-native';
import StepBasics from './(business)/steps/StepBasics';
import StepContact from './(business)/steps/StepContact';
import StepDescription from './(business)/steps/StepDescription';
import StepLinks from './(business)/steps/StepLinks';
import StepLocation from './(business)/steps/StepLocation';
import StepPricing from './(business)/steps/StepPricing';
import StepReview from './(business)/steps/StepReview';
import StepSubmit from './(business)/steps/StepSubmit';

const BusinessListing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    category: '',
    phone_number: '',
    business_email: '',
    barangay: '',
    city: '',
    province: '',
    postal_code: '',
    description: '',
    instagram_url: '',
    twitter_url: '',
    facebook_url: '',
    longitude: '',
    latitude: '',
    price_range: '',
  });

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepBasics
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
          />
        );
      case 1:
        return (
          <StepContact
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      case 2:
        return (
          <StepLocation
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      case 3:
        return (
          <StepDescription
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      case 4:
        return (
          <StepLinks
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      case 5:
        return (
          <StepPricing
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      case 6:
        return (
          <StepReview
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      case 7:
        return (
          <StepSubmit
            data={formData}
            setData={setFormData}
            onNext={() => setCurrentStep((prev) => prev + 1)}
            onPrev={() => setCurrentStep((prev) => prev - 1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <Stepper currentStep={currentStep} />
      <View style={{ width: '50%' }}>{renderStep()}</View>
    </View>
  );
};

export default BusinessListing;
