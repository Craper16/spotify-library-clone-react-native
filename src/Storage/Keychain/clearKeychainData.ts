import * as Keychain from 'react-native-keychain';

export async function clearKeychainData() {
  try {
    const response = await Keychain.resetGenericPassword();

    return response;
  } catch (error) {}
}
