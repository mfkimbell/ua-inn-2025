import { fetch } from "@/lib/utils";
import { ServerRequest } from "@/types/request.types";

export const deleteRequest = async (requestId: number): Promise<boolean> => {
  const response = await fetch<{ success: boolean }>("/request/delete", {
    method: "POST",
    data: { request_id: requestId },
  });

  if (!response) {
    throw new Error("Failed to delete request");
  }

  return true;
};
