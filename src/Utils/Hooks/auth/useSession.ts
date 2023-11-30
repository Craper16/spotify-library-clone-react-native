import {useQuery} from '@tanstack/react-query';
import {getItemFromAsyncStorage} from '../../../Storage/Async Storage/getItemFromAsyncStorage';
import {Storage} from '../../../Constants/storage';
import {User} from '../../../Types/user';
import {retrieveTokens} from '../../../Helpers/auth';
import SplashScreen from 'react-native-splash-screen';

export function useSession() {
  const getUserDataQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const tokens = await retrieveTokens();
      const userResponse = await getItemFromAsyncStorage(Storage.user);

      SplashScreen.hide();

      if (!userResponse || !tokens) {
        return null;
      }

      const user: User = JSON.parse(userResponse);

      return {user, tokens: tokens};
    },
  });

  return {
    user: getUserDataQuery.data?.user,
    tokens: getUserDataQuery.data?.tokens,
    status: getUserDataQuery.status,
    isFetching: getUserDataQuery.isFetching,
    refetch: getUserDataQuery.refetch,
  };
}
