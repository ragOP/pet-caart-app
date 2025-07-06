import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getProducts = async (params = {}) => {
  const apiResponse = await apiService({
    endpoint: endpoints.products,
    params,
  });
  return apiResponse.response;
};
