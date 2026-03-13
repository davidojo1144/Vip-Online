import 'dotenv/config';
import type { ExpoConfig } from 'expo/config';

const NAME = 'Vip-Online';

const config: ExpoConfig = {
  name: NAME,
  slug: NAME,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSFaceIDUsageDescription: 'Authenticate to secure your account',
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-router', 'expo-secure-store', 'expo-image'],
  extra: {
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'https://example.com/api',
    EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV ?? 'development',
  },
};

export default config;
