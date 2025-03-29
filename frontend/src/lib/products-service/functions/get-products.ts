import { fetch } from "@/lib/utils";
import { Product } from "@/types/product.types";

export const getProducts = async () => {
  const response = await fetch<Product[]>("/product/all");

  if (!response) {
    throw new Error("Failed to fetch products");
  }

  return response;
};
