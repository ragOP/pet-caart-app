
import { apiService } from "./apiService";
import { endpoints } from "./endpoints";

export const addProductToCart = async ({ productId, variantId, quantity = 1 }) => {
  try {
    const apiResponse = await apiService({
      endpoint: endpoints.cart,
      method: "POST",
      data: {
        product_id: productId || null,
        variant_id: variantId || null,
        quantity: parseInt(quantity, 10),
      },
    });
    if (!apiResponse.response?.success) {
      console.warn("API call failed:", apiResponse);
      throw new Error('Failed to add product to cart');
    }

    return apiResponse.response;
  } catch (error) {
    console.error("Error in addProductToCart:", error);
    throw error;
  }
};
