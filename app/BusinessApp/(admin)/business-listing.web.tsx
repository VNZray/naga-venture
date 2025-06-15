import Stepper from '@/components/web-components/StepperComponent';
import StepPermits from '@/components/web-components/steps/StepPermits';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import StepBasics from '../../../components/web-components/steps/StepBasics';
import StepContact from '../../../components/web-components/steps/StepContact';
import StepDescription from '../../../components/web-components/steps/StepDescription';
import StepLinks from '../../../components/web-components/steps/StepLinks';
import StepLocation from '../../../components/web-components/steps/StepLocation';
import StepPricing from '../../../components/web-components/steps/StepPricing';
import StepReview from '../../../components/web-components/steps/StepReview';
import StepSubmit from '../../../components/web-components/steps/StepSubmit';

const BusinessListing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any | null>(null);

  useEffect(() => {
    const fetchOwnerId = async () => {
      if (!user) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      const { data: ownerData, error } = await supabase
        .from('Owner')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (error || !ownerData) {
        Alert.alert('Error', 'Owner not found.');
        console.error('Supabase error:', error);
        return;
      }

      setOwnerId(ownerData.id);
      setFormData({
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
        owner_id: ownerData.id,
        status: 'Pending',
      });
    };

    fetchOwnerId();
  }, [user]);

  if (!formData) return null; // Or show a loading indicator

  const renderStep = () => {
    const commonProps = {
      data: formData,
      setData: setFormData,
      onNext: () => setCurrentStep((prev) => prev + 1),
      onPrev: () => setCurrentStep((prev) => Math.max(prev - 1, 0)),
    };

    switch (currentStep) {
      case 0:
        return <StepBasics {...commonProps} />;
      case 1:
        return <StepContact {...commonProps} />;
      case 2:
        return <StepLocation {...commonProps} />;
      case 3:
        return <StepDescription {...commonProps} />;
      case 4:
        return <StepLinks {...commonProps} />;
      case 5:
        return <StepPricing {...commonProps} />;
      case 6:
        return <StepPermits {...commonProps} />;
      case 7:
        return <StepReview {...commonProps} />;
      case 8:
        return <StepSubmit {...commonProps} />;
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
