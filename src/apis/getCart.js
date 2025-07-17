import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const getCart = async ({ params }) => {
  const apiResponse = await apiService({
    endpoint: endpoints.cart,
    params,
  });
  return apiResponse.response;
};