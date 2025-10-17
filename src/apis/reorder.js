import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const reorder = async ({ orderId }) => {
  const apiResponse = await apiService({
    endpoint: endpoints.reorderCart,
    method: 'POST',
    data: {
      orderId,
    },
  });
  return apiResponse.response;
};
