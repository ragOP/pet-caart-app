import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getPageConfig = async ({ pageKey }) => {
  const apiResponse = await apiService({
    endpoint: `${endpoints.pageConfig}/${pageKey}`,
    method: 'GET'
  });
  return apiResponse.response;
}; 