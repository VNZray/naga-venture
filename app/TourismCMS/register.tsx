import logo from '@/assets/images/logo.png';
import { CMSButton, CMSText } from '@/components/TourismCMS';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterWeb = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        role: 'tourism_admin', // Default role for CMS registration
      });

      if (error) {
        Alert.alert(
          'Registration Failed',
          error.message || 'Registration failed.'
        );
      } else {
        Alert.alert(
          'Registration Successful',
          'Please check your email to verify your account, then you can login.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/TourismCMS/login'),
            },
          ]
        );
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Registration Failed', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Right panel with register form */}
        <View style={styles.rightPanel}>
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.logoText}>Tourism CMS</Text>
            </View>{' '}
            <View style={{ marginBottom: 20 }}>
              <CMSText type="title" darkColor="#000">
                Create Account
              </CMSText>
              <CMSText type="default" darkColor="#000">
                Join the Tourism Management System
              </CMSText>
            </View>
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TextInput
                  mode="outlined"
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  style={{ flex: 1 }}
                />
                <TextInput
                  mode="outlined"
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  style={{ flex: 1 }}
                />
              </View>

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

              <TextInput
                mode="outlined"
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>{' '}
            <View style={{ marginTop: 20 }}>
              <CMSButton
                title={isLoading ? 'Creating Account...' : 'Create Account'}
                variant="primary"
                size="large"
                onPress={handleRegister}
                disabled={isLoading}
                loading={isLoading}
                fullWidth
              />
            </View>
            <View style={styles.loginRow}>
              <CMSText type="body" darkColor="#000">
                Already have an account?
              </CMSText>
              <Link href="/TourismCMS/login">
                <CMSText type="label" darkColor="#007AFF">
                  Sign In
                </CMSText>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterWeb;

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
  loginRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
});
