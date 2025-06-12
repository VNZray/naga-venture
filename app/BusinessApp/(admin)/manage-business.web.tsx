import CardView from '@/components/CardView';
import PressableButton from '@/components/PressableButton';
import { ThemedText } from '@/components/ThemedText';
import { useAccommodation } from '@/context/AccommodationContext';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, useColorScheme, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const width = Dimensions.get('screen').width;

const ManageBusiness = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const { search, setSearch, handleSearch, filteredAccommodations, loading } =
    useAccommodation();

  const businesslisting = () => {
    router.replace('/BusinessApp/(admin)/business-listing');
  };
  return (
    <View style={{ padding: 16 }}>
      <PressableButton
        type="primary"
        Title="List my Business"
        color="#fff"
        width={200}
        TextSize={14}
        onPress={businesslisting}
      ></PressableButton>
      <View style={styles.cardWrapper}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={isDarkMode ? '#fff' : '#000'}
            style={{ marginTop: 40 }}
          />
        ) : filteredAccommodations.length > 0 ? (
          filteredAccommodations.map((acc) => (
            <CardView
              height={350}
              radius={10}
              elevation={0}
              imageUri={acc.imageUri}
              title={acc.name}
              subtitle={acc.location}
              price={acc.priceRange}
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
