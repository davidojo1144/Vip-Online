import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout() {
  return (
    <AppProviders>
      <View className="flex-1 bg-white">
        <StatusBar style="auto" />
        <Slot />
      </View>
    </AppProviders>
  );
}
