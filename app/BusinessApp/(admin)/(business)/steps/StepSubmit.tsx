import PressableButton from '@/components/PressableButton';
import { useAuth } from '@/context/AuthContext';
import { BusinessFormData } from '@/types/BusinessFormData';
import { supabase } from '@/utils/supabase'; // adjust based on your project structure
import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

type StepBasicsProps = {
  data: BusinessFormData;
  setData: React.Dispatch<React.SetStateAction<BusinessFormData>>;
  onNext: () => void;
  onPrev: () => void;
};

const StepSubmit: React.FC<StepBasicsProps> = ({ data, setData, onPrev }) => {
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    // Step 1: Fetch the Owner using the logged-in user's UID
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

    const ownerId = ownerData.id;
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);
    console.log(ownerId);

    // Step 2: Insert into Business (NOT Owner)
    const { data: newBusiness, error: businessError } = await supabase
      .from('Business')
      .insert({
        owner_id: ownerId,
        business_name: data.business_name,
        business_type: data.business_type,
        category: data.category,
        phone_number: data.phone_number,
        business_email: data.business_email,
        barangay: data.barangay,
        city: data.city,
        province: data.province,
        postal_code: data.postal_code,
        description: data.description,
        instagram_url: data.instagram_url,
        twitter_url: data.twitter_url,
        facebook_url: data.facebook_url,
        latitude: data.latitude,
        longitude: data.longitude,
        price_range: data.price_range,
        status: 'pending',
      })
      .select('id')
      .single();

    console.log(newBusiness);
    console.log(newBusiness);
    console.log(newBusiness);
    console.log(newBusiness);

    if (businessError) {
      Alert.alert('Error', 'Failed to register business.');
      console.error('Business insert error:', businessError);
      return;
    }

    Alert.alert(
      'Submitted',
      'Your business registration has been submitted for review.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Submit Registration</Text>
      <Text style={styles.description}>
        Please confirm and submit your business for review. Once submitted, the
        status will be set to{' '}
        <Text style={{ fontWeight: 'bold' }}>pending</Text>.
      </Text>
      <View style={styles.buttonContainer}>
        <PressableButton
          type="cancel"
          color="#fff"
          Title="Prev"
          onPress={onPrev}
          width={200}
        />
        <PressableButton
          type="primary"
          color="#fff"
          Title="Submit"
          onPress={handleSubmit}
          width={200}
        />
      </View>
    </View>
  );
};

export default StepSubmit;

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  description: { fontSize: 14, marginBottom: 24 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },
});
