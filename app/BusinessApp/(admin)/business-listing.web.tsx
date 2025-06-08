import Stepper from '@/components/StepperComponent';
import React from 'react';
import { View } from 'react-native';

const BusinessListing = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Stepper currentStep={8} />
    </View>
  );
};

export default BusinessListing;
