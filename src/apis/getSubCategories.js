import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getSubCategories = async (params = {}) => {
  const apiResponse = await apiService({
    endpoint: endpoints.sub_category,
    params,
  });
  return apiResponse.response;
};
