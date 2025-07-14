import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const deleteAddress = async ({ id }) => {
  const apiResponse = await apiService({
    endpoint: `${endpoints.address}/${id}`,
    method: "DELETE",
  });
  return apiResponse.response;
};
