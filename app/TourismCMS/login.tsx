import logo from '@/assets/images/logo.png';
import { CMSButton, CMSText } from '@/components/TourismCMS';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

// Zod schema for login form validation
const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormInputs = z.infer<typeof LoginSchema>;

const LoginWeb = () => {
  const {
    signInWithEmail,
    isLoading,
    authError,
    user,
    userProfile,
    isUserProfileLoading,
  } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const handleLogin = async (data: LoginFormInputs) => {
    if (!data.email || !data.password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    try {
      await signInWithEmail(data.email, data.password);
      // Don't navigate here - let the useEffect handle navigation after successful auth
    } catch (err) {
      console.error('Unexpected login error:', err);
      Alert.alert('Login Failed', 'An unexpected error occurred.');
    }
  }; // Show error alert when authError state changes
  React.useEffect(() => {
    if (authError) {
      Alert.alert(
        'Login Failed',
        authError.message || 'Authentication failed.'
      );
    }
  }, [authError]);
  // Navigate to admin panel when user is successfully authenticated
  React.useEffect(() => {
    if (
      user &&
      userProfile &&
      !isLoading &&
      !isUserProfileLoading &&
      !authError
    ) {
      console.log(
        '[Login] User authenticated with profile, navigating to admin panel'
      );
      router.replace('/TourismCMS/(admin)');
    }
  }, [user, userProfile, isLoading, isUserProfileLoading, authError]);

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
            </View>{' '}
            <View style={{ marginBottom: 20 }}>
              <CMSText type="title" darkColor="#000">
                Sign In
              </CMSText>
              <CMSText type="default" darkColor="#000">
                Navigate with Ease - Your Ultimate City Directory
              </CMSText>
            </View>
            <View style={{ gap: 16 }}>
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Email"
                      placeholder="Email Address"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                  name="email"
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}

              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Password"
                      placeholder="Password"
                      placeholderTextColor="#999"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      style={styles.input}
                    />
                  )}
                  name="password"
                />
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

              {/* TODO: Create forgot password page for Tourism CMS */}
              <Text
                style={{
                  color: '#007AFF',
                  fontSize: 14,
                  alignSelf: 'flex-end',
                  marginBottom: 20,
                }}
              >
                Forgot Password?
              </Text>
            </View>{' '}
            <View style={{ marginTop: 20 }}>
              <CMSButton
                title={isLoading ? 'Signing In...' : 'Login'}
                variant="primary"
                size="large"
                onPress={handleSubmit(handleLogin)}
                disabled={isLoading}
                loading={isLoading}
                fullWidth
              />
            </View>{' '}
            <View style={styles.signupRow}>
              <CMSText type="body" darkColor="#666">
                Tourism CMS - Admin Access Only
              </CMSText>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
});
