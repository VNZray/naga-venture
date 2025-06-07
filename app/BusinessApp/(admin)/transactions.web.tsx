import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Transactions = () => {
  return (
    <View>
      <ThemedText type="title" darkColor="#000">
        Web Transactions
      </ThemedText>
    </View>
  );
};

export default Transactions;
