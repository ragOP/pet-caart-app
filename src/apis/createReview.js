import { apiService } from './apiService';
import { endpoints } from './endpoints';

export const createReview = async reviewData => {
  const { productId, rating, review } = reviewData;

  return await apiService({
    endpoint: endpoints.createReview,
    method: 'POST',
    data: {
      productId,
      rating,
      review,
    },
  });
};
