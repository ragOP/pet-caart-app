import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const getWalletTransactions = async ({ page = 1, perPage = 10 }) => {
  const apiResponse = await apiService({
    endpoint: endpoints.walletTransactions,
    method: 'GET',
    params: {
      page,
      perPage,
    },
  });
  return apiResponse.response;
};
