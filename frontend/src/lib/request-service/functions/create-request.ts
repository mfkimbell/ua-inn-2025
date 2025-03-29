import { fetch } from "@/lib/utils";
import { parseClientRequest } from "@/types";
import { ServerRequest } from "@/types/request.types";
import { Request } from "@/types/request.types";

export const createRequest = async (request: Request) => {
  const response = await fetch<ServerRequest>("/request", {
    method: "POST",
    data: parseClientRequest(request),
  });

  if (!response) {
    throw new Error("Failed to create request");
  }

  return response;
};
