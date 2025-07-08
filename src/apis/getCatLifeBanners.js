import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getCatLifeBanners = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.cat_banners,
    method: "GET",
  });

  return apiResponse?.response
}