import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItem<T>(key: string, value: T) {
  const json = JSON.stringify(value);
  await AsyncStorage.setItem(key, json);
}

export async function getItem<T>(key: string): Promise<T | null> {
  const json = await AsyncStorage.getItem(key);
  return json ? (JSON.parse(json) as T) : null;
}

export async function removeItem(key: string) {
  await AsyncStorage.removeItem(key);
}
