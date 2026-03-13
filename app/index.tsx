import { Text, View, Pressable } from 'react-native';
import { useState } from 'react';
import { LucideHome } from 'lucide-react-native';

export default function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <LucideHome color="#111827" size={32} />
      <Text className="text-xl font-bold mt-4">Welcome to Vip-Online</Text>
      <Text className="text-gray-600 mt-2">Expo Router + NativeWind</Text>

      <Pressable
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2"
        onPress={() => setCount((c) => c + 1)}
      >
        <Text className="text-white font-medium">Tap Count: {count}</Text>
      </Pressable>
    </View>
  );
}
