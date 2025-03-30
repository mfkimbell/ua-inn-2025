import { fetch } from "@/lib/utils";

export const deleteProduct = async (productId: number): Promise<boolean> => {
  const response = await fetch<{ success: boolean }>("/product/delete", {
    method: "POST",
    data: { product_id: productId },
  });

  if (!response) {
    throw new Error("Failed to delete product");
  }

  return true;
};
