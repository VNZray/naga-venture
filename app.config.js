// app.config.js

import 'dotenv/config';

export default {
  expo: {
    name: 'naga-venture',
    slug: 'naga-venture',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'nagaventure',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      package: "com.malzafre.nagaventure",
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      [
        'expo-router',
        {
          // unstable_exclude: ["**/*.{ts,tsx,js,jsx}", "components/**/*"],
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    updates: {
      url: 'https://u.expo.dev/45b699ab-0984-470b-8638-3b5caa0c0e57',
    },

    runtimeVersion: {
      policy: 'appVersion',
    },
    extra: {
      REACT_NATIVE_SUPABASE_URL: process.env.REACT_NATIVE_SUPABASE_URL,
      REACT_NATIVE_ANON_KEY: process.env.REACT_NATIVE_ANON_KEY,
      eas: {
        projectId: '45b699ab-0984-470b-8638-3b5caa0c0e57',
      },
    },
  },
};
