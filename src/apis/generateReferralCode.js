import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const generateReferralCode = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.generateReferralCode,
    method: 'POST',
  });
  return apiResponse.response;
};
