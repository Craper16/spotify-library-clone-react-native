import AsyncStorage from '@react-native-async-storage/async-storage';

export async function deleteMultipleItemsFromAsyncStorage(items: string[]) {
  try {
    await AsyncStorage.multiRemove(items);
  } catch (error) {}
}
