import { apiService } from "./apiService";
import { endpoints } from "./endpoints";


export const getAdBanner = async () => {
  const apiResponse = await apiService({
    endpoint: `${endpoints.banners}?type=app`,
    method: "GET",
  });
  console.log('getAdBanner API raw response:', apiResponse);
  return apiResponse?.response;
};
