import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <ThemedText darkColor="#000" type="title">
        Tourism CMS Dashboard
      </ThemedText>
      <ThemedText darkColor="#666" type="default">
        Welcome to the Tourism Content Management System
      </ThemedText>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText type="subtitle" darkColor="#000">
            Total Accommodations
          </ThemedText>
          <ThemedText type="title" darkColor="#007AFF">
            12
          </ThemedText>
        </View>

        <View style={styles.statCard}>
          <ThemedText type="subtitle" darkColor="#000">
            Tourist Spots
          </ThemedText>
          <ThemedText type="title" darkColor="#007AFF">
            25
          </ThemedText>
        </View>

        <View style={styles.statCard}>
          <ThemedText type="subtitle" darkColor="#000">
            Events
          </ThemedText>
          <ThemedText type="title" darkColor="#007AFF">
            8
          </ThemedText>
        </View>

        <View style={styles.statCard}>
          <ThemedText type="subtitle" darkColor="#000">
            Shops
          </ThemedText>
          <ThemedText type="title" darkColor="#007AFF">
            45
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Dashboard;
