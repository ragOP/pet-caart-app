import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const checkDelivery = async ({ pincode, productId }) => {
  if (!pincode || pincode.length !== 6) {
    throw new Error('Invalid pincode. Must be 6 digits.');
  }

  if (!productId) {
    throw new Error('Product ID is required.');
  }

  try {
    const apiResponse = await apiService({
      endpoint: endpoints.delivery,
      method: 'POST',
      data: {
        pincode: pincode,
        productId: productId,
      },
    });
    return apiResponse.response;
  } catch (error) {
    console.error('Delivery check API error:', error);
    throw error;
  }
};
