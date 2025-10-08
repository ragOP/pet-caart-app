import { apiService } from './apiService';
import { endpoints } from './endpoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN } from '../constants/AUTH';

export const loginUser = async payload => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.login,
      method: 'POST',
      data: payload,
    });
    if (apiResponse?.error) {
      console.log('API Error:', apiResponse.error);
      return {
        success: false,
        message:
          apiResponse?.error?.message || 'An error occurred during login',
      };
    }
    console.log('API Response:', apiResponse);
    // Extract the relevant data
    const data = apiResponse.response.data;
    if (data?.token) {
      await AsyncStorage.setItem(TOKEN, data.token);
      console.log('Token saved to AsyncStorage login');
      // Return all necessary fields, including isExisitinguser
      return {
        success: true,
        token: data.token,
        user: data.user,
        isExisitinguser: data.isExisitinguser, // <- This is the key line
      };
    } else {
      console.log('Login failed, no token received.');
      return { success: false, message: 'No token received from the server' };
    }
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      message: error.message || 'An error occurred during the login process',
    };
  }
};
