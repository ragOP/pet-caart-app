import axios from 'axios';

export const getSimilar = async ({ productId, type = 'similar' }) => {
  try {
    const response = await axios.get(
      `https://pet-caart-be.onrender.com/api/product/recommendations/${productId}`,
      {
        params: { type },
        headers: {
          accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching similar:', error);
    throw error;
  }
};
