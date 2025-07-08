import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getProductBanner = async ({ params } = {}) => {
  const apiResponse = await apiService({
    endpoint: `${endpoints.productBanner}/get?type=web`,
    params: params,
  });
  return apiResponse.response;
};

