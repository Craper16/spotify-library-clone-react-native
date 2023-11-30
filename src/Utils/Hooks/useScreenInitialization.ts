import {useState} from 'react';
import {useAnimatedStyle, withTiming} from 'react-native-reanimated';

type useScreenInitializationParams = {
  duration?: number;
  initFunction?: () => void;
  manuallyAssign?: boolean;
};

export function useScreenInitialization(
  screenParams?: useScreenInitializationParams,
) {
  const [isContentReady, setIsContentReady] = useState(false);

  const mainContentAnimatedStyles = useAnimatedStyle(() => {
    return {opacity: withTiming(isContentReady ? 1 : 0, {duration: 250})};
  });

  setTimeout(() => {
    if (screenParams?.initFunction) {
      screenParams?.initFunction();
      if (!screenParams.manuallyAssign) {
        return setTimeout(() => setIsContentReady(true), 50);
      }
    }

    if (!screenParams?.manuallyAssign) {
      setIsContentReady(true);
    }
  }, screenParams?.duration ?? 59);

  return {isContentReady, mainContentAnimatedStyles, setIsContentReady};
}
