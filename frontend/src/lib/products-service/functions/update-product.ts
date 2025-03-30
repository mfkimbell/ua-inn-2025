import { fetch } from "@/lib/utils";
import { Product } from "@/types/product.types";

export const updateProduct = async (product: Product) => {
  const response = await fetch<Product>("/product", {
    method: "PUT",
    data: product,
  });

  if (!response) {
    throw new Error("Failed to update product");
  }

  return response;
};
