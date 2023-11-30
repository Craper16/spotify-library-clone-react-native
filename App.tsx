import React from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import MainNavigation from './src/Navigation/MainNavigation';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Colors} from './src/Constants/colors';

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={styles.mainView}>
          <BottomSheetModalProvider>
            <StatusBar backgroundColor={Colors.black} translucent={false} />
            <MainNavigation />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  mainView: {flex: 1},
});

export default App;
