import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItemFromAsyncStorage(key: string) {
  try {
    const response = await AsyncStorage.getItem(key);

    return response;
  } catch (error) {}
}
