// EmployeeView.tsx
import { useEffect, useState } from "react";
import Head from "next/head";
import dayjs from "dayjs";
import {
  Bell,
  UserCircle,
  Box,
  FileText,
  Plus,
  ChevronDown,
  Wrench,
  ClipboardList,
  Calendar,
  Package,
} from "lucide-react";
import { RequestService } from "@/lib/request-service";
import { SuggestionsService } from "@/lib/suggestions-service";
import { Request } from "@/types/request.types";
import { Suggestion } from "@/types/suggestion.types";
import { parseServerRequest, parseServerSuggestion } from "@/types";
import AuthButton from "../auth/button";
import RequestDetailsModal from "@/components/ui/details-modal";
import RequestModal from "../ui/request-modal";
import SuggestionModal from "../ui/suggestion-modal";
import SuggestionDetailsModal from "../ui/suggestion-details-modal";
import Inventory from "../ui/inventory";
import useUser from "@/hooks/useUser";
import { Product } from "@/types/product.types";

export type PageProps = {
  products: Product[];
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

const EmployeeView: React.FC<PageProps> = ({ products }) => {
  const { user } = useUser();
  // Extend activeTab union to include "inventory"
  const [activeTab, setActiveTab] = useState<
    "my-requests" | "my-suggestions" | "inventory"
  >("my-requests");

  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNewSuggestionModal, setShowNewSuggestionModal] = useState(false);
  const [showSuggestionDetailsModal, setShowSuggestionDetailsModal] =
    useState(false);

  // Filter states for Requests
  const [reqFilterStatus, setReqFilterStatus] = useState<string>("all");
  const [reqFilterStartDate, setReqFilterStartDate] = useState<string>("");
  const [reqFilterEndDate, setReqFilterEndDate] = useState<string>("");
  const [showReqDateRange, setShowReqDateRange] = useState<boolean>(false);

  // Filter states for Suggestions
  const [suggFilterStatus, setSuggFilterStatus] = useState<string>("all");
  const [suggFilterStartDate, setSuggFilterStartDate] = useState<string>("");
  const [suggFilterEndDate, setSuggFilterEndDate] = useState<string>("");
  const [showSuggDateRange, setShowSuggDateRange] = useState<boolean>(false);

  // Inventory state
  const [inventory, setInventory] = useState<Product[]>(products);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await RequestService.getRequests();
      setMyRequests(requests);
    };
    const fetchSuggestions = async () => {
      const suggestions = await SuggestionsService.getAllSuggestions();
      setMySuggestions(suggestions);
    };
    fetchRequests();
    fetchSuggestions();
  }, []);

  const filteredRequests = myRequests.filter((req) => {
    const statusMatch =
      reqFilterStatus === "all" || req.status.toLowerCase() === reqFilterStatus;
    const dateMatch =
      (reqFilterStartDate === "" || req.createdAt >= reqFilterStartDate) &&
      (reqFilterEndDate === "" || req.createdAt <= reqFilterEndDate);
    return statusMatch && dateMatch;
  });

  const filteredSuggestions = mySuggestions.filter((sugg) => {
    const derivedStatus = sugg.completedAt ? "completed" : "pending";
    const statusMatch =
      suggFilterStatus === "all" || derivedStatus === suggFilterStatus;
    const dateMatch =
      (suggFilterStartDate === "" || sugg.createdAt >= suggFilterStartDate) &&
      (suggFilterEndDate === "" || sugg.createdAt <= suggFilterEndDate);
    return statusMatch && dateMatch;
  });

  const handleNewRequest = async (request: Request) => {
    const newRequest = await RequestService.createRequest(request);
    setMyRequests((prev) => [parseServerRequest([newRequest])[0], ...prev]);
    setShowNewRequestModal(false);
  };

  const handleNewSuggestion = async (suggestion: Suggestion) => {
    // If completedAt is empty, set it to undefined (to avoid sending an empty string)
    let data = { ...suggestion };
    if (!data.completedAt || data.completedAt.trim() === "") {
      data.completedAt = undefined;
      data.id = Math.floor(Math.random() * 1000000);
    }
    const newSuggestion = await SuggestionsService.createSuggestion(data);
    setMySuggestions((prev) => [
      parseServerSuggestion([newSuggestion])[0],
      ...prev,
    ]);
    setShowNewSuggestionModal(false);
  };

  const handleSuggestionUpdate = async (suggestion: Suggestion) => {
    const updatedSuggestion = await SuggestionsService.updateSuggestion(
      suggestion
    );
    setMySuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestion.id
          ? parseServerSuggestion([updatedSuggestion])[0]
          : s
      )
    );
  };

  // Inventory handlers (example logic)
  const handleAddInventoryItem = () => {
    // Implement your logic to add an inventory item
    console.log("Add inventory item");
  };

  const handleEditInventoryItem = (product: Product) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === product.id ? product : item))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>WorkSync | Employee Dashboard</title>
        <meta
          name="description"
          content="WorkSync employee request dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <img
            src="/worksync_logo.png"
            alt="WorkSync Logo"
            className="w-25 h-9"
          />
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
              <Bell size={24} />
            </button>
            <div className="flex items-center">
              <UserCircle size={32} className="text-gray-400" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Jane Smith
              </span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
            <AuthButton toggleAuthModal={() => {}} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Employee Request Center
        </div>

        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === "my-requests"
              ? "Request Dashboard"
              : activeTab === "my-suggestions"
              ? "Suggestion Dashboard"
              : "Inventory"}
          </h1>
          {activeTab === "my-requests" && (
            <button
              onClick={() => {
                setSelectedRequest(null);
                setShowNewRequestModal(true);
              }}
              className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Request
            </button>
          )}
          {activeTab === "my-suggestions" && (
            <button
              onClick={() => {
                setSelectedSuggestion(null);
                setShowNewSuggestionModal(true);
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
              onClick={() => setActiveTab("my-requests")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "my-requests"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <ClipboardList size={16} className="mr-1" />
              My Requests
            </button>
            <button
              onClick={() => setActiveTab("my-suggestions")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "my-suggestions"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText size={16} className="mr-1" />
              My Suggestions
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "inventory"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package size={16} className="mr-1" />
              Inventory
            </button>
          </nav>
        </div>

        {/* Filter Panel for Requests */}
        {activeTab === "my-requests" && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                {["all", "pending", "approved", "completed", "denied"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setReqFilterStatus(status)}
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        status === "all"
                          ? "bg-gray-200 text-gray-800"
                          : getStatusColor(status)
                      } ${
                        reqFilterStatus === status
                          ? "ring-2 ring-offset-2 ring-[#E31937]"
                          : ""
                      }`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowReqDateRange(!showReqDateRange)}
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 text-xs font-medium flex items-center"
                >
                  <Calendar size={16} className="mr-1" /> Date Range
                </button>
                {showReqDateRange && (
                  <div className="absolute z-20 top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg">
                    <label className="block text-sm text-gray-600 mb-1">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      value={reqFilterStartDate}
                      onChange={(e) => setReqFilterStartDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm mb-2"
                    />
                    <label className="block text-sm text-gray-600 mb-1">
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={reqFilterEndDate}
                      onChange={(e) => setReqFilterEndDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm mb-2"
                    />
                    <button
                      onClick={() => setShowReqDateRange(false)}
                      className="px-3 py-1 rounded-md bg-[#E31937] text-white text-xs font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Panel for Suggestions */}
        {activeTab === "my-suggestions" && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                {["all", "pending", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSuggFilterStatus(status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === "all"
                        ? "bg-gray-200 text-gray-800"
                        : status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    } ${
                      suggFilterStatus === status
                        ? "ring-2 ring-offset-2 ring-[#E31937]"
                        : ""
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowSuggDateRange(!showSuggDateRange)}
                  className="px-3 py-1 rounded-md bg-gray-200 text-gray-800 text-xs font-medium flex items-center"
                >
                  <Calendar size={16} className="mr-1" /> Date Range
                </button>
                {showSuggDateRange && (
                  <div className="absolute z-20 top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-md shadow-lg">
                    <label className="block text-sm text-gray-600 mb-1">
                      Start Date:
                    </label>
                    <input
                      type="date"
                      value={suggFilterStartDate}
                      onChange={(e) => setSuggFilterStartDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm mb-2"
                    />
                    <label className="block text-sm text-gray-600 mb-1">
                      End Date:
                    </label>
                    <input
                      type="date"
                      value={suggFilterEndDate}
                      onChange={(e) => setSuggFilterEndDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm mb-2"
                    />
                    <button
                      onClick={() => setShowSuggDateRange(false)}
                      className="px-3 py-1 rounded-md bg-[#E31937] text-white text-xs font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Requests List */}
        {activeTab === "my-requests" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {getTypeIcon(request.requestType)}
                    <span className="ml-2 text-xs uppercase text-gray-500 font-medium">
                      {request.requestType}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {request.request}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Submitted by:{" "}
                  {request.is_anonymous ? "anonymous" : request.userName}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>
                      Created:{" "}
                      {dayjs(request.createdAt).format("MMM DD, YYYY hh:mm A")}
                    </span>
                    <span>
                      Updated:{" "}
                      {dayjs(request.updatedAt).format("MMM DD, YYYY hh:mm A")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                  }}
                  className="mt-4 w-full text-[#E31937] hover:text-[#c01731] text-sm font-medium py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Suggestions List */}
        {activeTab === "my-suggestions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-end items-start mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {suggestion.completedAt ? "completed" : "pending"}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {suggestion.suggestion}
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Submitted by:{" "}
                  {suggestion.isAnonymous ? "anonymous" : suggestion.userName}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <div>
                    Created:{" "}
                    {dayjs(suggestion.createdAt).format("MMM DD, YYYY hh:mm A")}
                  </div>
                  <div>
                    Updated:{" "}
                    {dayjs(suggestion.updatedAt).format("MMM DD, YYYY hh:mm A")}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSuggestion(suggestion);
                    // When viewing details, open the read-only details modal:
                    setShowNewSuggestionModal(false);
                  }}
                  className="mt-4 w-full text-[#E31937] hover:text-[#c01731] text-sm font-medium py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "inventory" && (
          <Inventory
            products={products}
            onAddItem={() => {
              // You can implement your inventory add logic here
              console.log("Add inventory item");
            }}
            onEditItem={(product) => {
              // Inventory edit logic
              setInventory((prev) =>
                prev.map((item) => (item.id === product.id ? product : item))
              );
            }}
            onDeleteItem={(productId) => {
              setInventory((prev) =>
                prev.filter((item) => item.id !== productId)
              );
            }}
          />
        )}
      </main>

      {/* Modals */}
      {showNewRequestModal && (
        <RequestModal
          request={selectedRequest}
          products={products}
          onClose={() => setShowNewRequestModal(false)}
          onSave={(updatedRequest) => {
            if (selectedRequest) {
              // For update logic, implement as needed
            } else {
              handleNewRequest(updatedRequest);
            }
            setShowNewRequestModal(false);
          }}
        />
      )}

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {showNewSuggestionModal && (
        <SuggestionModal
          suggestion={selectedSuggestion}
          onClose={() => {
            setShowNewSuggestionModal(false);
            setSelectedSuggestion(null);
          }}
          onSave={(updatedSuggestion) => {
            if (selectedSuggestion) {
              handleSuggestionUpdate(updatedSuggestion);
            } else {
              // Ensure new suggestion doesn't pass an empty completedAt
              let data = { ...updatedSuggestion };
              if (!data.completedAt || data.completedAt.trim() === "") {
                data.completedAt = undefined;
                data.id = Math.floor(Math.random() * 1000000);
              }
              handleNewSuggestion(data);
            }
            setShowNewSuggestionModal(false);
            setSelectedSuggestion(null);
          }}
        />
      )}

      {/* Read-only Details Modal for Suggestions */}
      {selectedSuggestion && (
        <SuggestionDetailsModal
          suggestion={selectedSuggestion}
          onClose={() => setSelectedSuggestion(null)}
        />
      )}
    </div>
  );
};

export default EmployeeView;
