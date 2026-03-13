import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProviders } from '@/providers/AppProviders';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar style="auto" />
          <Slot />
        </SafeAreaView>
      </AppProviders>
    </SafeAreaProvider>
  );
}
