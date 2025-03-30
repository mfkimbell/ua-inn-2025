import { fetch } from "@/lib/utils";
import { parseClientSuggestion } from "@/types/helpers";
import { ServerSuggestion } from "@/types/suggestion.types";
import { Suggestion } from "@/types/suggestion.types";

export const updateSuggestion = async (suggestion: Suggestion) => {
  const response = await fetch<ServerSuggestion>("/suggestion", {
    method: "PUT",
    data: parseClientSuggestion(suggestion),
  });

  if (!response) {
    throw new Error("Failed to update suggestion");
  }

  return response;
};
