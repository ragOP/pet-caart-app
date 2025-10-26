import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getReviewsByProductId = async ({ id }) => {
  const response = await apiService({
    endpoint: `${endpoints.getReviewsByProductId}/${id}`,
    method: 'GET',
  });
  return response;
};
