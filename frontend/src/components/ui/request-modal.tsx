// RequestModal.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Request } from "@/types/request.types";
import { Product } from "@/types/product.types";
import { Status } from "@/types/status.enum";
import useUser from "@/hooks/useUser";

interface RequestModalProps {
  request: Request | null;
  products: Product[];
  onClose: () => void;
  onSave: (data: Request) => void;
}

const RequestModal: React.FC<RequestModalProps> = ({
  request,
  products,
  onClose,
  onSave,
}) => {
  const { user } = useUser();
  const [formData, setFormData] = useState<Request>({
    id: request?.id || Math.floor(Math.random() * 1000000),
    status: request?.status || Status.PENDING,
    userId: request?.userId || 0,
    request: request?.request || "",
    requestType: request?.requestType || "supply",
    orderId: request?.orderId || 0,
    createdAt: request?.createdAt || new Date().toISOString(),
    updatedAt: request?.updatedAt || new Date().toISOString(),
    userName: user?.username || "",
    admin: request?.admin || 0,
    adminName: request?.adminName || "",
    cost: request?.cost || 0,
    requestedAmount: request?.requestedAmount || 0,
    orderedAmount: request?.orderedAmount || 0,
    itemName: request?.itemName || "",
    comments: request?.comments || "",
    isAnonymous: request?.isAnonymous || false,
  });

  useEffect(() => {
    if (request) {
      setFormData(request);
    }
  }, [request]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    if (name === "orderedAmount") {
      setFormData((prev) => ({
        ...prev,
        cost:
          (products.find((product) => product.title === formData.itemName)
            ?.price || 0) * Number(value),
      }));
    }

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-xl font-bold text-gray-900">
              {request ? "Edit Request" : "New Request"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Two-column grid for main fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request
                </label>
                <input
                  type="text"
                  name="request"
                  value={formData.request}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Type
                </label>
                <select
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="supply">Supply Request</option>
                  <option value="maintenance">Maintenance Request</option>
                  <option value="suggestion">Suggestion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Name
                </label>
                <select
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select an item</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.title}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requested Amount
                </label>
                <input
                  type="number"
                  name="requestedAmount"
                  value={formData.requestedAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              {user.role === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordered Amount
                  </label>
                  <input
                    type="number"
                    name="orderedAmount"
                    value={formData.orderedAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  disabled={user.role === "employee"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={Status.PENDING}>{Status.PENDING}</option>
                  <option value={Status.APPROVED}>{Status.APPROVED}</option>
                  <option value={Status.DENIED}>{Status.DENIED}</option>
                  <option value={Status.DELIVERED}>{Status.DELIVERED}</option>
                  <option value={Status.ORDERED}>{Status.ORDERED}</option>
                </select>
              </div>
              {user.role === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={(
                      (products.find(
                        (product) => product.title === formData.itemName
                      )?.price || 0) * formData.orderedAmount
                    ).toFixed(2)}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    disabled
                  />
                </div>
              )}
              {user.role === "admin" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Name
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={user.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Comments Section (full width, placed two rows below the grid) */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comments
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={4}
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
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

export default RequestModal;
