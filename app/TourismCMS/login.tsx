import logo from '@/assets/images/logo.png';
import PressableButton from '@/components/PressableButton';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginWeb = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signInWithEmail, isLoading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    try {
      await signInWithEmail(email, password);

      // If no error is thrown, the auth state change will handle navigation
      // We can navigate immediately since signInWithEmail doesn't throw on auth errors
      if (!error) {
        router.replace('/TourismCMS/(admin)');
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      Alert.alert('Login Failed', 'An unexpected error occurred.');
    }
  };

  // Show error alert when error state changes
  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Failed', error.message || 'Authentication failed.');
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.twoColumn}>
        {/* Left panel with image */}
        <View style={styles.leftPanel}>
          <Image
            source={{
              uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/oragon-monument-by-colline.jpg',
            }}
            style={styles.backgroundImage}
            contentFit="cover"
          />
        </View>

        {/* Right panel with login form */}
        <View style={styles.rightPanel}>
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.logoText}>Naga Venture</Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <ThemedText darkColor="#000" type="title">
                Sign In
              </ThemedText>
              <ThemedText darkColor="#000" type="default">
                Navigate with Ease - Your Ultimate City Directory
              </ThemedText>
            </View>
            <View style={{ gap: 16 }}>
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TextInput
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {/* TODO: Create forgot password page for Tourism CMS */}
              <Text style={{ color: '#007AFF', fontSize: 14 }}>
                Forgot Password?
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <PressableButton
                TextSize={16}
                width={'100%'}
                height={60}
                type="primary"
                IconSize={24}
                color={'#DEE3F2'}
                direction="column"
                Title={isLoading ? 'Signing In...' : 'Login'}
                onPress={handleLogin}
                disabled={isLoading}
              />
            </View>

            <View style={styles.signupRow}>
              <ThemedText darkColor="#666" type="default2">
                Tourism CMS - Admin Access Only
              </ThemedText>
              {/* Temporary link to create admin user */}
              <Text
                style={{ color: '#007AFF', fontSize: 14, marginLeft: 10 }}
                onPress={() => router.push('/TourismCMS/register')}
              >
                Setup Admin
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginWeb;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  twoColumn: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  leftPanel: {
    width: '50%',
    height: '100%',
  },
  rightPanel: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Poppins-Bold',
  },
  signupRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
});
