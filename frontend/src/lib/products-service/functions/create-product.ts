import { fetch } from "@/lib/utils";
import { Product } from "@/types/product.types";

export const createProduct = async (product: Product) => {
  const response = await fetch<Product>("/product", {
    method: "POST",
    data: product,
  });

  if (!response) {
    throw new Error("Failed to create product");
  }

  return response;
};
