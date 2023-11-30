import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Signin from '../../Screens/Auth/Signin';

type AuthStackParams = {
  Signin: undefined;
};

const AuthNavigator = createNativeStackNavigator<AuthStackParams>();

export default function AuthNavigation() {
  return (
    <AuthNavigator.Navigator screenOptions={{headerShown: false}}>
      <AuthNavigator.Screen name="Signin" component={Signin} />
    </AuthNavigator.Navigator>
  );
}
