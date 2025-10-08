import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const sendOtp = async (payload) => {
  const apiResponse = await apiService({
    endpoint: endpoints.sendOtp,
    method: "POST",
    data: payload,
  });
  return apiResponse.response;
};
