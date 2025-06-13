import { testSupabaseConnection } from '@/utils/supabase';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const TestSupabase = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    'checking' | 'success' | 'error'
  >('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testSupabaseConnection();
        setConnectionStatus(isConnected ? 'success' : 'error');
        if (!isConnected) {
          setErrorMessage('Failed to connect to Supabase');
        }
      } catch (error) {
        setConnectionStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error occurred'
        );
      }
    };

    checkConnection();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Connection Test</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text
          style={[
            styles.status,
            connectionStatus === 'success' && styles.success,
            connectionStatus === 'error' && styles.error,
          ]}
        >
          {connectionStatus === 'checking'
            ? 'Checking...'
            : connectionStatus === 'success'
            ? 'Connected'
            : 'Error'}
        </Text>
      </View>
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
});
