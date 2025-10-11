import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getAdBanner = async () => {
  const apiResponse = await apiService({
    endpoint: `${endpoints.banners}?type=web`,
    method: 'GET',
  });
  return apiResponse?.response;
};
