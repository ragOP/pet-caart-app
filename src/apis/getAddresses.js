import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getAddresses = async ({ params } = {}) => {
  const apiResponse = await apiService({
    endpoint: endpoints.address,
    params: params,
  });
  return apiResponse.response;
};
