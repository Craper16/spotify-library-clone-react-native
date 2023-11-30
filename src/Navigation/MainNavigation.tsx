import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './Auth/AuthStack';
import {useSession} from '../Utils/Hooks/auth/useSession';
import RootBottomTabNavigation from './RootBottomTab/RootBottomTabNavigation';
// import notifee, {AndroidVisibility} from '@notifee/react-native';

export default function MainNavigation() {
  const {tokens} = useSession();

  async function handleNotificationsInitializing() {
    // await messaging().registerDeviceForRemoteMessages();
    // const response = await notifee.requestPermission();
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'default channel',
    //   visibility: AndroidVisibility.PUBLIC,
    // });
    // // const token = await messaging().getToken();
    // // console.log(token);
    // console.log(response);
    // console.log(channelId);
    // await notifee.displayNotification({title: 'HELLO', subtitle: 'SUP'});
  }
  // ANDROID TOKEN
  // cOHA18szROegYIWAyH5x3R:APA91bFJVf1bl0AG7TlvMJuEopvHO77donrG9WKqGTpR58wWV3R9jqPoE-5pSf_RnoeXTbmnDHvMDuBco8BbTJU1XJQVL3NI4vbiDaXwBBfdYogAM661grppYFA0CnTx5liQLp_BFOTG

  // messaging().onMessage(async message => {
  //   console.log(message);
  //   await notifee.displayNotification({
  //     android: {channelId: 'default'},
  //     body: message.body,
  //     data: message.data,
  //     title: message.title,
  //   });
  // });

  // messaging().setBackgroundMessageHandler(async message => {
  //   console.log(message);
  //   await notifee.displayNotification({
  //     android: {channelId: 'default'},
  //     body: message.body,
  //     data: message.data,
  //     title: message.title,
  //   });
  // });

  handleNotificationsInitializing();

  return (
    <NavigationContainer>
      {!tokens?.tokens.accessToken ? (
        <AuthNavigation />
      ) : (
        <RootBottomTabNavigation />
      )}
    </NavigationContainer>
  );
}
