import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getHomeGridConfig = async ({ params}) => {
  const apiResponse = await apiService({
    endpoint: endpoints.gridConfig,
    params
  });
  return apiResponse.response;
};
