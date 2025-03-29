// SuggestionModal.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Suggestion } from "@/types/suggestion.types";

interface SuggestionModalProps {
  suggestion: Suggestion | null;
  onClose: () => void;
  onSave: (data: Suggestion) => void;
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({
  suggestion,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Suggestion>({
    id: suggestion?.id || 0,
    userId: suggestion?.userId || 0,
    createdAt: suggestion?.createdAt || new Date().toISOString().split("T")[0],
    updatedAt: suggestion?.updatedAt || new Date().toISOString().split("T")[0],
    completedAt: suggestion?.completedAt || "",
    suggestion: suggestion?.suggestion || "",
    comments: suggestion?.comments || "",
    userName: suggestion?.userName || "",
    isAnonymous: suggestion?.isAnonymous || false,
  });

  useEffect(() => {
    if (suggestion) {
      setFormData(suggestion);
    }
  }, [suggestion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {suggestion ? "Edit Suggestion" : "New Suggestion"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suggestion
              </label>
              <input
                type="text"
                name="suggestion"
                value={formData.suggestion}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">
                Submit anonymously
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={formData.isAnonymous}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#E31937] hover:bg-[#c01731] text-white font-medium rounded-md"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuggestionModal;
