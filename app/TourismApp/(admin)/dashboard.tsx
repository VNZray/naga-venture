import { TestSupabase } from '@/components/TestSupabase';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { View } from 'react-native';

const Dashboard = () => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: 20,
      }}
    >
      <ThemedText darkColor="#000" type="title">
        Dashboard
      </ThemedText>
      <TestSupabase />
    </View>
  );
};

export default Dashboard;
