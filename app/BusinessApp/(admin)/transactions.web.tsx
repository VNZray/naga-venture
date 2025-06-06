import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Transactions = () => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <ThemedText type="title" darkColor="#000">
        Web Transactions
      </ThemedText>
    </View>
  );
};

export default Transactions;
