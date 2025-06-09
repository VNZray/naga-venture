import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto'; // Important for Supabase Auth in React Native

// Get environment variables from Expo Constants
const supabaseUrl =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://vqyjssvywyvpmvkcbtxg.supabase.co';

const supabaseAnonKey =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxeWpzc3Z5d3l2cG12a2NidHhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNzMyMjIsImV4cCI6MjA2NDk0OTIyMn0.i7EDzvcDUSckmyMPRNJUYVwzcV5YAUtUN0NQqQjEEfw';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please check your environment variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: AsyncStorage, // Uncomment if using AsyncStorage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Required for Expo/React Native
  },
});
