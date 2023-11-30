import {getKeychainData} from '../Storage/Keychain/getKeychainData';

export async function retrieveTokens() {
  const tokensResponse = await getKeychainData();
  if (!tokensResponse) {
    return null;
  }

  const tokens: {accessToken: string; refreshToken: string} = JSON.parse(
    tokensResponse.username,
  );

  return {tokens, expiryTime: tokensResponse.password};
}
