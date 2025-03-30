// AdminView.tsx
import { useEffect, useState } from "react";
import dayjs from "dayjs";
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
  Calendar,
  BarChart2,
  LightbulbIcon,
  PackageIcon,
} from "lucide-react";
import RequestModal from "@/components/ui/request-modal";
import SuggestionModal from "@/components/ui/suggestion-modal";
import AuthButton from "../auth/button";
import Inventory from "../ui/inventory";
import AdminAnalytics from "@/components/analytics/AdminAnalytics";
import { Product } from "@/types/product.types";
import { RequestService } from "@/lib/request-service";
import { Request } from "@/types/request.types";
import { Suggestion } from "@/types/suggestion.types";
import { parseServerRequest } from "@/types";

export type PageProps = {
  products: Product[];
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
    case "delivered":
      return "bg-green-100 text-green-800";
    case "ordered":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSuggestionStatus = (sugg: Suggestion) =>
  sugg.completedAt ? "completed" : "pending";

const statusOptions = [
  "all",
  "pending",
  "approved",
  "completed",
  "denied",
  "delivered",
  "ordered",
];

const AdminView: React.FC<PageProps> = ({ products }) => {
  const initialProducts = products;
  const [activeTab, setActiveTab] = useState<
    "requests" | "suggestions" | "inventory" | "analytics"
  >("requests");

  const [requests, setRequests] = useState<Request[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [inventory, setInventory] = useState<Product[]>(initialProducts);

  const [reqFilterStatus, setReqFilterStatus] = useState<string>("all");
  const [reqFilterStartDate, setReqFilterStartDate] = useState<string>("");
  const [reqFilterEndDate, setReqFilterEndDate] = useState<string>("");
  const [showReqDateRange, setShowReqDateRange] = useState<boolean>(false);

  const [suggFilterStatus, setSuggFilterStatus] = useState<string>("all");
  const [suggFilterStartDate, setSuggFilterStartDate] = useState<string>("");
  const [suggFilterEndDate, setSuggFilterEndDate] = useState<string>("");
  const [showSuggDateRange, setShowSuggDateRange] = useState<boolean>(false);

  useEffect(() => {
    const fetchRequests = async () => {
      const dbRequests = await RequestService.getAllRequests();
      setRequests(dbRequests);
    };
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    const statusMatch =
      reqFilterStatus === "all" || req.status.toLowerCase() === reqFilterStatus;
    const dateMatch =
      (reqFilterStartDate === "" || req.createdAt >= reqFilterStartDate) &&
      (reqFilterEndDate === "" || req.createdAt <= reqFilterEndDate);
    return statusMatch && dateMatch;
  });

  const filteredSuggestions = suggestions.filter((sugg) => {
    const derivedStatus = getSuggestionStatus(sugg);
    const statusMatch =
      suggFilterStatus === "all" || derivedStatus === suggFilterStatus;
    const dateMatch =
      (suggFilterStartDate === "" || sugg.createdAt >= suggFilterStartDate) &&
      (suggFilterEndDate === "" || sugg.createdAt <= suggFilterEndDate);
    return statusMatch && dateMatch;
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  const handleDelete = async (type: "request" | "suggestion", id: number) => {
    if (type === "request") {
      try {
        await RequestService.deleteRequest(id);
        setRequests((prev) => prev.filter((item) => item.id !== id));
      } catch (error) {
        console.error(error);
      }
    } else if (type === "suggestion") {
      setSuggestions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleUpdateRequest = async (request: Request) => {
    try {
      let data: Request & { amount?: number } = request;

      if (request.status === "delivered") {
        data = {
          ...request,
          amount: request.orderedAmount,
        };
      }

      const updatedRequest = await RequestService.updateRequest(data);
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

  const handleNewRequest = async (request: Request) => {
    const newRequest = await RequestService.createRequest(request);
    setRequests((prev) => [parseServerRequest([newRequest])[0], ...prev]);
  };

  const handleAddInventoryItem = () => {
    // TODO: Implement add inventory item
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
        <title>WorkSync | Admin Dashboard</title>
        <meta name="description" content="WorkSync admin dashboard" />
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
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Admin Approval Center
        </div>
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
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "requests"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText size={16} className="mr-1" />
              Requests
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "suggestions"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <LightbulbIcon size={16} className="mr-1" />
              Suggestions
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "inventory"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <PackageIcon size={16} className="mr-1" />
              Inventory
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === "analytics"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart2 size={16} className="mr-1" />
              Analytics
            </button>
          </nav>
        </div>

        {activeTab === "analytics" && (
          <AdminAnalytics requests={requests} suggestions={suggestions} />
        )}

        {/* Filter Panel for Requests */}
        {activeTab === "requests" && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-2">
                {statusOptions.map((status) => (
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
                ))}
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

        {activeTab === "suggestions" && (
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
                        : "bg-green-100 text-green-800"
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

        {activeTab === "requests" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => (
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
                  Submitted by: {req.isAnonymous ? "anonymous" : req.userName}
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
                  <div>
                    Created:{" "}
                    {dayjs(req.createdAt).format("MMM DD, YYYY hh:mm A")}
                  </div>
                  <div>
                    Updated:{" "}
                    {dayjs(req.updatedAt).format("MMM DD, YYYY hh:mm A")}
                  </div>
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
            {filteredSuggestions.map((sugg) => (
              <div
                key={sugg.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs uppercase text-gray-500 font-medium">
                    Suggestion ID: {sugg.id}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getSuggestionStatus(sugg)}
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

        {activeTab === "inventory" && (
          <Inventory
            products={products}
            onAddItem={handleAddInventoryItem}
            onEditItem={handleEditInventoryItem}
            onDeleteItem={() => {}}
          />
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
              handleNewRequest(updatedRequest);
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
