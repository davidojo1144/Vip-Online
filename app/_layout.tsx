import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      <Slot />
    </View>
  );
}
