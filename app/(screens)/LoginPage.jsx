import logo from '@/assets/images/logo.png';
import PressableButton from '@/components/PressableButton';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),

  });


  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView >
        <View style={{ display: 'flex', padding: '5%', flexDirection: 'column', gap: 16 }}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
            <Text style={styles.text}>Naga Venture</Text>
          </View>

          <View>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24 }}>
              Sign In
            </Text>

            <Text style={{
              fontFamily: 'Poppins-Medium', fontSize: 16, marginBottom: 20,
            }}>
              Navigate with Ease - Your Ultimate City Directory
            </Text>
          </View>

          <View style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextInput
              style={{ borderRadius: 10 }}
              label="Email"
              value={email}
              onChangeText={email => setEmail(email)}
              underlineStyle={{ borderRadius: 10 }}
            />

            <TextInput
              style={{ borderRadius: 10 }}
              label="Password"
              value={password}
              onChangeText={password => setPassword(password)}
              underlineStyle={{ borderRadius: 10 }}
            />

            <Link href="/forgot-password">
              <Text style={{ color: 'blue' }}>Forgot Password?</Text>
            </Link>
          </View>

          <PressableButton
            TextSize={16}
            width={"100%"}
            height={60}
            type="primary"
            IconSize={24}
            color={"#DEE3F2"}
            direction="column"
            Title="Login"
            onPress={() => router.replace('/(tabs)/HomeScreen')}
          ></PressableButton>

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default LoginPage

const styles = {
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  text: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: 'Poppins-Bold',
  },
}