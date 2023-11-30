import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../Constants/colors';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {signinUser} from '../../api/auth/signinUser';
import {setKeychainData} from '../../Storage/Keychain/setKeychainData';
import {formatDateAndTime} from '../../Helpers/dateHelpers';
import {setItemInAsyncStorage} from '../../Storage/Async Storage/setItemInAsyncStorage';
import {Storage} from '../../Constants/storage';
import {AuthConfiguration, authorize} from 'react-native-app-auth';
import axios from 'axios';

type GoogleUser = {
  alg: string;
  at_hash: string;
  aud: string;
  azp: string;
  exp: string;
  family_name: string;
  given_name: string;
  iat: string;
  iss: string;
  kid: string;
  locale: string;
  name: string;
  nonce: string;
  picture: string;
  sub: string;
  typ: string;
};

const Signin = () => {
  const queryClient = useQueryClient();

  const [gUser, setGUser] = useState<GoogleUser | null>(null);

  const signinMutation = useMutation({
    mutationFn: signinUser,
    onSuccess: async response => {
      await setKeychainData({
        username: JSON.stringify({
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
        }),
        password: formatDateAndTime(
          new Date(response.tokens.accessTokenExpirationDate),
        ),
      });

      await setItemInAsyncStorage({
        key: Storage.user,
        value: JSON.stringify(response.user),
      });

      queryClient.invalidateQueries(['auth']);
    },
  });

  async function signinGoogle() {
    try {
      const config: AuthConfiguration = {
        issuer: 'https://accounts.google.com',
        clientId:
          '620176900200-njc7hb762nprif0obguk295elacnetee.apps.googleusercontent.com',
        redirectUrl: 'com.georgio.spoticlone:/oauth2callback',
        scopes: ['openid', 'profile'],
      };

      const authState = await authorize(config);

      console.log(authState.idToken);

      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${authState.idToken}`,
      );

      const data: GoogleUser = response.data;
      console.log(data);

      setGUser(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.screen}>
      <TouchableOpacity onPress={() => signinMutation.mutate()}>
        <Text style={styles.signinTitle}>Sign In to get started</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={signinGoogle}>
        <Text style={styles.signinTitle}>Sign In Google (Not spotify)</Text>
      </TouchableOpacity>
      <Text style={styles.anyText}>{gUser?.given_name}</Text>
      <Text style={styles.anyText}>{gUser?.family_name}</Text>
      <Text style={styles.anyText}>{gUser?.name}</Text>
      {gUser?.picture && (
        <Image
          source={{uri: gUser.picture, height: 40, width: 40}}
          borderRadius={100}
        />
      )}
      <Button title="Clear" onPress={() => setGUser(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinTitle: {color: Colors.green, fontWeight: 'bold', fontSize: 22},
  anyText: {color: Colors.white},
});

export default Signin;
