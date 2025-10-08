import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const createAddress = async ({ data }) => {
  const apiResponse = await apiService({
    endpoint: endpoints.address,
    method: "POST",
    data: data,
  });
  return apiResponse.response;
};
