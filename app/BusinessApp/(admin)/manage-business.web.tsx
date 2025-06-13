import PressableButton from '@/components/PressableButton';
import TabSwitcher from '@/components/TabSwitcherComponent';
import { ThemedText } from '@/components/ThemedText';
import CardView from '@/components/web-components/CardView';
import { useAuth } from '@/context/AuthContext';
import { useBusiness } from '@/context/BusinessContext';
import { Business } from '@/types/Business';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, useColorScheme, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const width = Dimensions.get('screen').width;

const ManageBusiness = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [activeTab, setActiveTab] = useState('all');

  const { user } = useAuth();
  const { loading, filterByOwnerId, filteredBusinesses } = useBusiness();
  const activeBackground = '#0A1B47';

  const filterByStatus = (data: Business[]) => {
    return data.filter((business) => {
      switch (activeTab) {
        case 'all':
          return ['Active', 'Pending', 'Inactive'].includes(business.status);
        case 'active':
          return business.status === 'Active';
        case 'pending':
          return business.status === 'Pending';
        case 'inactive':
          return business.status === 'Inactive';
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    const fetchOwnerAndFilter = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('Owner')
        .select('id')
        .eq('user_id', user.id)
        .single();
      if (error) {
        console.error('Error fetching owner ID:', error);
        return;
      }

      if (data?.id) {
        filterByOwnerId(data.id);
      }
    };

    if (filteredBusinesses.length) {
      console.log(
        'Owner IDs:',
        filteredBusinesses.map((b) => b.owner_id)
      );
    }

    fetchOwnerAndFilter();
  }, [user]);

  const businessListing = () => {
    router.replace('/BusinessApp/(admin)/business-listing');
  };

  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TabSwitcher
          tabs={[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'pending', label: 'Pending' },
            { key: 'inactive', label: 'Inactive' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          color={'#000'}
          active={activeBackground}
          textStyle={{ fontFamily: 'Poppins-SemiBold' }}
          style={{ width: 800 }}
        />
        <PressableButton
          type="secondary"
          Title="List my Business"
          color="#fff"
          width={200}
          TextSize={14}
          onPress={businessListing}
        />
      </View>

      <View style={styles.cardWrapper}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={isDarkMode ? '#fff' : '#000'}
            style={{ marginTop: 40 }}
          />
        ) : filteredBusinesses.length > 0 ? (
          filteredBusinesses.map((business) => (
            <CardView
              key={business.owner_id}
              height={350}
              radius={10}
              elevation={1}
              imageUri={business.image_url}
              title={business.business_name}
              subtitle={`${business.barangay}, ${business.city}, ${business.province}`}
              status={business.status}
            />
          ))
        ) : (
          <ThemedText style={{ textAlign: 'center', marginTop: 40 }}>
            No results found.
          </ThemedText>
        )}
      </View>
    </View>
  );
};

export default ManageBusiness;

const styles = StyleSheet.create({
  cardWrapper: {
    gap: 16,
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
