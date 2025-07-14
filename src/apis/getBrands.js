import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getBrands = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.brands,
  });
  return apiResponse.response;
};