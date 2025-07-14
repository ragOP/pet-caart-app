import axios from 'axios';
import { BACKEND_URL } from './backendUrl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN } from '../constants/AUTH';

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
    // Retrieving token from AsyncStorage
    const token = await AsyncStorage.getItem(TOKEN);
    console.log('Token from AsyncStorage:', token);

    const requestObj = {
      url: `${customUrl ? customUrl : BACKEND_URL}/${endpoint}`,
      params,
      method,
      data,
      signal,
    };

    // If token exists, add it to headers
    if (token || _token) {
      requestObj.headers = {
        ...headers,
        'ngrok-skip-browser-warning': 'xyz',  // If needed, adjust or remove this header
        ...(!removeToken ? { Authorization: `Bearer ${_token || token}` } : {}),
      };
    }
    const { data: res } = await axios(requestObj);
    if (res?.token) {
      await AsyncStorage.setItem(TOKEN, res.token);
      console.log('Token saved to AsyncStorage:', res.token);
    }

    return { response: res };
  } catch (error) {
    console.error('backend endpoint error:', error);  // Debugging log
    return { success: false, error: true, ...(error.response || error) };
  }
};
