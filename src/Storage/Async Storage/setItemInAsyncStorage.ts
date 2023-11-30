import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItemInAsyncStorage({
  key,
  value,
}: {
  key: string;
  value: string;
}) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {}
}
