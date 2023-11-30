import * as Keychain from 'react-native-keychain';

export async function setKeychainData({
  password,
  username,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await Keychain.setGenericPassword(username, password);
    if (response) {
      return response;
    }
  } catch (error) {}
}
