import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getBreeds = async () => {
  const apiResponse = await apiService({
    endpoint: endpoints.breed,
  });
  return apiResponse.response;
};