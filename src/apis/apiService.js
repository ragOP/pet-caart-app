import axios from 'axios';
import { TOKEN } from '../constants/AUTH';
import { BACKEND_URL } from './backendUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiService = async ({
  endpoint,
  method = 'GET',
  data,
  params,
  token: _token,
  headers,
  customUrl,
  removeToken = false,
  signal,
}) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN);

    const requestObj = {
      url: `${customUrl ? customUrl : BACKEND_URL}/${endpoint}`,
      params,
      method,
      data,
      signal,
    };

    if (token || _token) {
      requestObj.headers = {
        ...headers,
        'ngrok-skip-browser-warning': 'xyz',
        ...(!removeToken ? {Authorization: `Bearer ${_token || token}`} : {}),
      };
    }

    const {data: res} = await axios(requestObj);
    return {response: res};
  } catch (error) {
    console.error(error, 'backend endpoint error');
    return {success: false, error: true, ...(error || {})};
  }
};
