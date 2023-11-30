import * as Keychain from 'react-native-keychain';

export async function getKeychainData() {
  try {
    const username = await Keychain.getGenericPassword();

    if (username) {
      return username;
    }
  } catch (error) {}
}
