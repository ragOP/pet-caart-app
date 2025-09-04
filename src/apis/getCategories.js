import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getCategories = async (params = {}) => {
  const apiResponse = await apiService({
    endpoint: endpoints.category,
    params,
  });
  return apiResponse.response;
}; 