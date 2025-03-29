import { fetch } from "@/lib/utils";
import { parseServerRequest } from "@/types/helpers";
import { ServerRequest } from "@/types/request.types";

export const getAllRequests = async () => {
  const response = await fetch<ServerRequest[]>("/request/all");

  if (!response) {
    throw new Error("Failed to fetch requests");
  }

  const data = parseServerRequest(response);
  return data;
};
