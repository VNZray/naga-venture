import logo from '@/assets/images/logo.png';
import PressableButton from '@/components/PressableButton';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/utils/supabase';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const RegistrationPageWeb = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<string[]>([]);
  const businessTypes = ['Accommodation', 'shop'];
  const [errorMessage, setErrorMessage] = useState('');

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  if (!fontsLoaded) return null;

  const registerBusinessOwner = async () => {
    if (!email || !password || password !== confirmPassword) {
      setErrorMessage('Please check your credentials.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: `${firstName} ${lastName}`,
          phone: phoneNumber,
        },
      },
    });

    if (authError) {
      setErrorMessage(authError.message);
      return;
    }

    // 2. Insert into Owner table
    const userId = authData?.user?.id;
    if (!userId) {
      Alert.alert('Error', 'User ID not returned from signup.');
      return;
    }

    const { data, error } = await supabase
      .from('Owner')
      .insert([
        {
          first_name: firstName,
          middle_name: '',
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          business_type: userType,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setErrorMessage('');
    Alert.alert('Success', 'Account created!');
    router.replace('/BusinessApp/(admin)/dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.twoColumn}>
        {/* Left Panel */}
        <View style={styles.leftPanel}>
          <Image
            source={{
              uri: 'https://i0.wp.com/nagayon.com/wp-content/uploads/2024/08/oragon-monument-by-colline.jpg',
            }}
            style={styles.backgroundImage}
            contentFit="cover"
          />
        </View>

        {/* Right Panel */}
        <View style={styles.rightPanel}>
          <View style={styles.formContainer}>
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
              <Text style={styles.logoText}>Naga Venture</Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <ThemedText darkColor="#000" type="title">
                Sign Up
              </ThemedText>
              <ThemedText darkColor="#000" type="default">
                Navigate with Ease - Your Ultimate City Directory
              </ThemedText>
            </View>

            <View style={styles.row}>
              <TextInput
                mode="outlined"
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
                keyboardType="default"
              />
              <TextInput
                mode="outlined"
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
                keyboardType="default"
              />
            </View>

            <ThemedText style={styles.subtext}>Business type</ThemedText>
            <View style={styles.radioRow}>
              {businessTypes.map((type) => (
                <Pressable
                  key={type}
                  style={styles.checkboxItem}
                  onPress={() => {
                    if (userType.includes(type)) {
                      setUserType(userType.filter((t) => t !== type));
                    } else {
                      setUserType([...userType, type]);
                    }
                  }}
                >
                  <View style={styles.checkbox}>
                    {userType.includes(type) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>{type}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              style={styles.input}
              keyboardType="default"
            />

            <TextInput
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
            />

            <ThemedText style={styles.termsText}>
              By signing up, you accept Naga Ventures{' '}
              <ThemedText type="link">Terms of Service</ThemedText> and{' '}
              <ThemedText type="link">Privacy Policy</ThemedText>.
            </ThemedText>

            {errorMessage !== '' && (
              <Text
                style={{
                  color: 'red',
                  fontFamily: 'Poppins-Regular',
                  marginTop: 10,
                }}
              >
                {errorMessage}
              </Text>
            )}

            <View style={{ marginTop: 20 }}>
              <PressableButton
                TextSize={16}
                width={'100%'}
                height={60}
                type="primary"
                IconSize={24}
                color={'#DEE3F2'}
                direction="column"
                Title="Sign Up"
                onPress={registerBusinessOwner}
              />
            </View>

            <View style={styles.signupRow}>
              <ThemedText darkColor="#000" type="default2">
                Already have an account?
              </ThemedText>
              <ThemedText
                type="link"
                onPress={() => router.push('/BusinessApp/login')}
              >
                Sign In
              </ThemedText>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegistrationPageWeb;

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
    backgroundColor: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.1)',
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
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  input: {
    flex: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  subtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginTop: 16,
    color: '#000',
  },
  radioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginVertical: 10,
  },

  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#999',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  checkmark: {
    color: '#365CCE',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },

  checkboxSelected: {
    borderColor: '#365CCE',
  },

  checkboxLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  signupRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
});
