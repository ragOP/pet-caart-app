import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getSliders = async ({ params } = {}) => {
  try {
    const apiResponse = await apiService({
      endpoint: `${endpoints.sliders}?type=web`,
      params
    });
    return apiResponse.response;
  } catch (error) {
    console.error('Error in getSliders:', error);
    throw error;  
  }
};
