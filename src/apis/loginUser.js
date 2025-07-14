import { apiService } from "./apiService";
import { endpoints } from "./endpoints";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN } from '../constants/AUTH';

export const loginUser = async (payload) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.login,
      method: "POST",
      data: payload,
    });

    // Check if there was an error in the API response
    if (apiResponse?.error) {
      console.log('API Error:', apiResponse.error);  
      return { success: false, message: apiResponse?.error?.message || 'An error occurred during login' };
    }

    console.log('API Response:', apiResponse);  // Log full response
    if (apiResponse?.response?.data?.token) {
      await AsyncStorage.setItem(TOKEN, apiResponse.response.data.token);
      console.log("Token saved to AsyncStorage");

      // Extract user data (example: name, profile image, etc.)
      const user = apiResponse.response.data.user;

      // Return the success object with the token and user data
      return { success: true, token: apiResponse.response.data.token, user: user };
    } else {
      // If no token was received in the response
      console.log("Login failed, no token received.");
      return { success: false, message: "No token received from the server" };
    }
  } catch (error) {
    // Catch any other errors such as network errors
    console.error('Login failed:', error);  // Log the error

    return { success: false, message: error.message || 'An error occurred during the login process' };
  }
};
