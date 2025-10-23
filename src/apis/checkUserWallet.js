import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const checkUserWallet = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.checkUserWallet,
    method: 'GET',
  });
  return apiResponse.response;
};
