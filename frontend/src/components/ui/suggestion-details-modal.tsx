// SuggestionDetailsModal.tsx
import { X } from "lucide-react";
import dayjs from "dayjs";
import { Suggestion } from "@/types/suggestion.types";

type SuggestionDetailsModalProps = {
  suggestion: Suggestion | null;
  onClose: () => void;
};

const SuggestionDetailsModal: React.FC<SuggestionDetailsModalProps> = ({ suggestion, onClose }) => {
  if (!suggestion) return null;

  const derivedStatus = suggestion.completedAt ? "completed" : "pending";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Suggestion Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Suggestion ID</span>
                <p className="text-lg font-semibold">#{suggestion.id}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  derivedStatus === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {derivedStatus}
              </span>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-lg font-semibold mb-3">{suggestion.suggestion}</h3>
              
              <div className="mb-4">
                <span className="text-sm text-gray-500">Comments</span>
                <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">
                  {suggestion.comments ? suggestion.comments : "No comments available."}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Submitted By</span>
                <p className="font-medium">
                  {suggestion.isAnonymous ? "anonymous" : suggestion.userName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span>Created</span>
                <p>{dayjs(suggestion.createdAt).format("MMM D, YYYY h:mm A")}</p>
              </div>
              <div>
                <span>Last Updated</span>
                <p>{dayjs(suggestion.updatedAt).format("MMM D, YYYY h:mm A")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionDetailsModal;
