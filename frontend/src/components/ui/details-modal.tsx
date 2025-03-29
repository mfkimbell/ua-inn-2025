// components/RequestDetailsModal.tsx
import { X } from "lucide-react";
import dayjs from "dayjs";
import { Request } from "@/types/request.types";
import { Status } from "@/types/status.enum";

type RequestDetailsModalProps = {
  request: Request | null;
  onClose: () => void;
};

const StatusBadge = ({ status }: { status: Status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case Status.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case Status.APPROVED:
        return "bg-blue-100 text-blue-800";
      case Status.ORDERED:
        return "bg-purple-100 text-purple-800";
      case Status.DELIVERED:
        return "bg-green-100 text-green-800";
      case Status.DENIED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const RequestDetailsModal = ({ request, onClose }: RequestDetailsModalProps) => {
  if (!request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Request Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Request ID</span>
                <p className="text-lg font-semibold">#{request.id}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="text-lg font-semibold mb-3">{request.request}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-500">Request Type</span>
                  <p className="font-medium">{request.requestType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Requested By</span>
                  <p className="font-medium">{request.userName}</p>
                </div>
              </div>

              {request.requestType === "supply" && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Item Name</span>
                    <p className="font-medium">{request.itemName || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Requested Amount</span>
                    <p className="font-medium">{request.requestedAmount || "N/A"}</p>
                  </div>
                </div>
              )}

              {request.orderId > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Order ID</span>
                      <p className="font-medium">#{request.orderId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ordered Amount</span>
                      <p className="font-medium">{request.orderedAmount || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Cost</span>
                      <p className="font-medium">
                        ${request.cost ? request.cost.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {request.admin > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Assigned Admin</span>
                  <p className="font-medium">{request.adminName}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span>Created</span>
                <p>{dayjs(request.createdAt).format("MMM D, YYYY h:mm A")}</p>
              </div>
              <div>
                <span>Last Updated</span>
                <p>{dayjs(request.updatedAt).format("MMM D, YYYY h:mm A")}</p>
              </div>
            </div>

            {request.status === Status.PENDING && (
              <div className="flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel Request
                </button>
              </div>
            )}

            {request.comments && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Comments</h4>
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {request.comments ? request.comments : "No comments available."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;