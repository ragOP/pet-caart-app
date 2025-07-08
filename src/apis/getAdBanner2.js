import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getAdBanner2 = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.ad_banners,
    method: "GET",
  });
  return apiResponse?.response;
};
