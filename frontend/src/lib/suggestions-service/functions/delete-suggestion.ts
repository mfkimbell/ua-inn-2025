import { fetch } from "@/lib/utils";

export const deleteSuggestion = async (suggestionId: number): Promise<boolean> => {
  const response = await fetch<{ success: boolean }>("/suggestion/delete", {
    method: "POST",
    data: { suggestion_id: suggestionId },
  });

  if (!response) {
    throw new Error("Failed to delete suggestion");
  }

  return true;
};
