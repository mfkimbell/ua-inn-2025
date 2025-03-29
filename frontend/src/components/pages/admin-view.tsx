// AdminView.tsx
import { useEffect, useState } from "react";
import Head from "next/head";
import {
  Bell,
  UserCircle,
  Plus,
  ChevronDown,
  Trash2,
  Box,
  FileText,
  Wrench,
} from "lucide-react";
import RequestModal from "@/components/ui/request-modal";
import SuggestionModal from "@/components/ui/suggestion-modal";
import AuthButton from "../auth/button";
import { Product } from "@/types/product.types";
import { Status } from "@/types/status.enum";
import { RequestService } from "@/lib/request-service";
import { Request } from "@/types/request.types";
import { Suggestion } from "@/types/suggestion.types";
import { parseServerRequest } from "@/types";

export type PageProps = {
  products: Product[];
};

// Sample data arrays for demonstration
const sampleRequests: Request[] = [
  {
    id: 1,
    status: Status.PENDING,
    userId: 1,
    request: "Request new office supplies",
    requestType: "supply",
    orderId: 0,
    createdAt: "2025-03-25",
    updatedAt: "2025-03-25",
    userName: "Alice",
    admin: 0,
    adminName: "",
    cost: 0,
    requestedAmount: 10,
    orderedAmount: 0,
    itemName: "Printer Paper",
    comments: "",
  },
  {
    id: 2,
    status: Status.APPROVED,
    userId: 2,
    request: "Fix the printer",
    requestType: "maintenance",
    orderId: 0,
    createdAt: "2025-03-20",
    updatedAt: "2025-03-21",
    userName: "Bob",
    admin: 1,
    adminName: "Admin1",
    cost: 50,
    requestedAmount: 1,
    orderedAmount: 1,
    itemName: "Ink Cartridge",
    comments: "",
  },
];

const sampleSuggestions: Suggestion[] = [
  {
    id: 1,
    userId: 1,
    createdAt: "2025-03-15",
    updatedAt: "2025-03-15",
    completedAt: "2025-03-16",
    suggestion: "Upgrade the coffee machine",
    comments: "",
    userName: "Alice",
    isAnonymous: false,
  },
  {
    id: 2,
    userId: 2,
    createdAt: "2025-03-10",
    updatedAt: "2025-03-11",
    completedAt: "",
    suggestion: "Add a relaxation room",
    comments: "",
    userName: "Bob",
    isAnonymous: true,
  },
];

// Helper to display request type icons
const getTypeIcon = (type: string) => {
  switch (type) {
    case "supply":
      return <Box size={20} className="text-[#E31937]" />;
    case "maintenance":
      return <Wrench size={20} className="text-[#E31937]" />;
    case "suggestion":
      return <FileText size={20} className="text-[#E31937]" />;
    default:
      return <Box size={20} className="text-[#E31937]" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "denied":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const AdminView: React.FC<PageProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<"requests" | "suggestions">(
    "requests"
  );

  const [requests, setRequests] = useState<Request[]>([]);
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(sampleSuggestions);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  const handleDelete = (type: "request" | "suggestion", id: number) => {
    if (type === "request") {
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } else if (type === "suggestion") {
      setSuggestions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleUpdateRequest = async (request: Request) => {
    try {
      const updatedRequest = await RequestService.updateRequest(request);

      setRequests((prev) =>
        prev.map((item) =>
          item.id === request.id
            ? parseServerRequest([updatedRequest])[0]
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await RequestService.getAllRequests();
      setRequests(requests);
    };
    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>WorkSync | Admin Dashboard</title>
        <meta name="description" content="WorkSync admin dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-[#E31937]">Work</span>
            <span className="text-2xl font-bold text-gray-900">Sync</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Bell size={24} />
            </button>
            <div className="flex items-center">
              <UserCircle size={32} className="text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Admin User
              </span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
            <AuthButton toggleAuthModal={() => {}} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {activeTab === "requests" && (
            <button
              onClick={() => {
                setSelectedRequest(null);
                setShowRequestModal(true);
              }}
              className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Request
            </button>
          )}
          {activeTab === "suggestions" && (
            <button
              onClick={() => {
                setSelectedSuggestion(null);
                setShowSuggestionModal(true);
              }}
              className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Suggestion
            </button>
          )}
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("requests")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "requests"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Requests
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "suggestions"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Suggestions
            </button>
          </nav>
        </div>

        {/* Requests List */}
        {activeTab === "requests" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {getTypeIcon(req.requestType)}
                    <span className="ml-2 text-xs uppercase text-gray-500 font-medium">
                      {req.requestType}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {req.request}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Submitted by: {req.userName}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Item: {req.itemName}
                </p>
                {req.cost > 0 && (
                  <p className="text-sm text-gray-700 mb-2">
                    Cost: ${req.cost}
                  </p>
                )}
                {req.adminName && (
                  <p className="text-sm text-gray-700 mb-2">
                    Admin: {req.adminName}
                  </p>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  <div>Created: {req.createdAt}</div>
                  <div>Updated: {req.updatedAt}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowRequestModal(true);
                    }}
                    className="text-[#E31937] hover:text-[#c01731] text-sm font-medium flex items-center"
                  >
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete("request", req.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions List */}
        {activeTab === "suggestions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.map((sugg) => (
              <div
                key={sugg.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs uppercase text-gray-500 font-medium">
                    Suggestion ID: {sugg.id}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    pending
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {sugg.suggestion}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Submitted by: {sugg.isAnonymous ? "anonymous" : sugg.userName}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <div>Created: {sugg.createdAt}</div>
                  <div>Updated: {sugg.updatedAt}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      setSelectedSuggestion(sugg);
                      setShowSuggestionModal(true);
                    }}
                    className="text-[#E31937] hover:text-[#c01731] text-sm font-medium flex items-center"
                  >
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete("suggestion", sugg.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {showRequestModal && (
        <RequestModal
          request={selectedRequest}
          products={products}
          onClose={() => setShowRequestModal(false)}
          onSave={(updatedRequest) => {
            if (selectedRequest) {
              handleUpdateRequest(updatedRequest);
            } else {
              setRequests((prev) => [
                ...prev,
                {
                  ...updatedRequest,
                  id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                },
              ]);
            }
            setShowRequestModal(false);
          }}
        />
      )}

      {showSuggestionModal && (
        <SuggestionModal
          suggestion={selectedSuggestion}
          onClose={() => setShowSuggestionModal(false)}
          onSave={(updatedSuggestion) => {
            if (selectedSuggestion) {
              setSuggestions((prev) =>
                prev.map((sugg) =>
                  sugg.id === updatedSuggestion.id ? updatedSuggestion : sugg
                )
              );
            } else {
              setSuggestions((prev) => [
                ...prev,
                {
                  ...updatedSuggestion,
                  id: prev.length ? prev[prev.length - 1].id + 1 : 1,
                },
              ]);
            }
            setShowSuggestionModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminView;
