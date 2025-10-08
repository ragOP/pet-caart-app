import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getCollection = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.collection,
  });
  return apiResponse.response;
};
