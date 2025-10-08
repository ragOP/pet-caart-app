import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getProductById = async ({ id }) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.products}/${id}`,
    });

    return apiResponse?.response?.data;
  } catch (error) {
    console.error(error);
  }
};
