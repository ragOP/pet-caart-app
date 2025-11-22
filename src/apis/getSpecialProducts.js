import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getSpecialProducts = async (params = {}) => {
  const apiResponse = await apiService({
    endpoint: endpoints.specialProducts,
    params,
  });
  return apiResponse.response;
};
