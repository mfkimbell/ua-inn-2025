import { fetch } from "@/lib/utils";
import { parseClientRequest } from "@/types";
import { ServerRequest } from "@/types/request.types";
import { Request } from "@/types/request.types";

export const updateRequest = async (request: Request) => {
  const response = await fetch<ServerRequest>("/request", {
    method: "PUT",
    data: parseClientRequest(request),
  });

  if (!response) {
    throw new Error("Failed to update request");
  }

  return response;
};
