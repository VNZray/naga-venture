import logo from '@/assets/images/logo.png';
import { useFonts } from 'expo-font';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';

const LoadingScreen = () => {

  const [fontsLoaded] = useFonts({
    'Poppins-Black': require('@/assets/fonts/Poppins/Poppins-Black.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
  });

  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.text}>Naga Venture</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  text: {
    fontSize: 24,
    marginLeft: 10,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default LoadingScreen;
