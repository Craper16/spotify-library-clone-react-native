import {API_KEY} from '@env';
import {User} from '../../Types/user';
import {retrieveTokens} from '../../Helpers/auth';
import {queryClient} from '../../../App';
import {instance} from '../config';

interface IGetUserProfile {
  userId: string;
}

export async function getUserProfile({userId}: IGetUserProfile) {
  const tokens = await retrieveTokens();

  const response = await instance.get(`${API_KEY}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${tokens?.tokens.accessToken}`,
    },
  });

  queryClient.invalidateQueries(['auth']);

  const data: User = response.data;

  return data;
}
