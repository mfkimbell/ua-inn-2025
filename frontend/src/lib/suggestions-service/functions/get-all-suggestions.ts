import { fetch } from "@/lib/utils";
import { parseServerSuggestion } from "@/types/helpers";
import { ServerSuggestion } from "@/types/suggestion.types";

export const getAllSuggestions = async () => {
  const response = await fetch<ServerSuggestion[]>("/suggestion/all");

  if (!response) {
    throw new Error("Failed to fetch products");
  }

  return parseServerSuggestion(response);
};
