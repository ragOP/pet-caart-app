import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getCoupons = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.coupons,
  });
  return apiResponse.response;
};