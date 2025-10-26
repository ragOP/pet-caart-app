import { apiService } from './apiService';

export const checkIfUserBoughtProduct = async productId => {
  const apiResponse = await apiService({
    endpoint: `api/reviews/check-if-user-bought-product/${productId}`,
  });
  return apiResponse.response;
};
