import AsyncStorage from '@react-native-async-storage/async-storage';

export async function deleteItemFromAsyncStorage(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {}
}
