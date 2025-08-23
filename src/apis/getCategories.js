import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getCategories = async ({ params }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.category,
      params,
    });

    console.log(apiResponse)
    return apiResponse;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};
