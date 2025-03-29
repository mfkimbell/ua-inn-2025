// AdminView.tsx
import { useState } from "react";
import Head from "next/head";
import { Bell, UserCircle, Plus, ChevronDown, Trash2 } from "lucide-react";
import RequestModal from "@/components/ui/requests-modal";
import SuggestionModal from "@/components/ui/suggestion-modal";
import OrderModal from "@/components/ui/order-modal";
import { Box, FileText, Wrench } from "lucide-react";
import AuthButton from "../auth/button";
import { Product } from "@/types/product.types";

export interface Request {
  id?: number;
  user_id: number;
  request: string;
  type: "supply" | "maintenance" | "suggestion";
  order_id?: number;
  created_at: string;
  updated_at: string;
  comments: string;
  is_anonymous: boolean;
  user_name: string;
}

export interface Suggestion {
  id?: number;
  user_id: number;
  suggestion: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  comments: string;
  is_anonymous: boolean;
  user_name: string;
}

export interface Order {
  id?: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  comments: string;
  cost: number;
  user_name: string;
}

// Sample data arrays for demonstration
const sampleRequests: Request[] = [
  {
    id: 1,
    user_id: 1,
    request: "Request new supplies",
    type: "supply",
    order_id: 0,
    created_at: "2025-03-25",
    updated_at: "2025-03-25",
    comments: "",
    is_anonymous: false,
    user_name: "Alice",
  },
  {
    id: 2,
    user_id: 2,
    request: "Fix the printer",
    type: "maintenance",
    order_id: 0,
    created_at: "2025-03-20",
    updated_at: "2025-03-21",
    comments: "",
    is_anonymous: true,
    user_name: "Bob",
  },
];

const sampleSuggestions: Suggestion[] = [
  {
    id: 1,
    user_id: 1,
    suggestion: "Upgrade coffee machine",
    created_at: "2025-03-15",
    updated_at: "2025-03-15",
    comments: "",
    is_anonymous: false,
    user_name: "Alice",
  },
];

const sampleOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    status: "pending",
    created_at: "2025-03-25",
    updated_at: "2025-03-25",
    comments: "",
    cost: 150,
    user_name: "John Doe",
  },
];

// Helper functions for type icons and status colors
const getTypeIcon = (type: "supply" | "maintenance" | "suggestion") => {
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

export type PageProps = {
  products: Product[];
};

const AdminView: React.FC<PageProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<
    "requests" | "suggestions" | "orders"
  >("requests");

  const [requests, setRequests] = useState<Request[]>(sampleRequests);
  const [suggestions, setSuggestions] =
    useState<Suggestion[]>(sampleSuggestions);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleDelete = (
    type: "request" | "suggestion" | "order",
    id: number
  ) => {
    if (type === "request") {
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } else if (type === "suggestion") {
      setSuggestions((prev) => prev.filter((item) => item.id !== id));
    } else if (type === "order") {
      setOrders((prev) => prev.filter((item) => item.id !== id));
    }
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
          {activeTab === "orders" && (
            <button
              onClick={() => {
                setSelectedOrder(null);
                setShowOrderModal(true);
              }}
              className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Order
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
            <button
              onClick={() => setActiveTab("orders")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Orders
            </button>
          </nav>
        </div>

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {getTypeIcon(req.type)}
                    <span className="ml-2 text-xs uppercase text-gray-500 font-medium">
                      {req.type}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      "pending"
                    )}`}
                  >
                    pending
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {req.request}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Submitted by: {req.is_anonymous ? "anonymous" : req.user_name}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <div>Created: {req.created_at}</div>
                  <div>Updated: {req.updated_at}</div>
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
                      onClick={() => handleDelete("request", req.id!)}
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

        {/* Suggestions Tab */}
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
                <div className="mt-4 text-xs text-gray-500">
                  <div>Created: {sugg.created_at}</div>
                  <div>Updated: {sugg.updated_at}</div>
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
                      onClick={() => handleDelete("suggestion", sugg.id!)}
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

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs uppercase text-gray-500 font-medium">
                    Order ID: {order.id}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {order.status}
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  User: {order.user_name}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  Cost: ${order.cost}
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  <div>Created: {order.created_at}</div>
                  <div>Updated: {order.updated_at}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowOrderModal(true);
                    }}
                    className="text-[#E31937] hover:text-[#c01731] text-sm font-medium flex items-center"
                  >
                    View Details
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete("order", order.id!)}
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

      {/* Modals for CRUD operations */}
      {showRequestModal && (
        <RequestModal
          request={selectedRequest}
          onClose={() => setShowRequestModal(false)}
          onSave={(updatedRequest) => {
            if (selectedRequest) {
              // Update existing request
              setRequests((prev) =>
                prev.map((req) =>
                  req.id === updatedRequest.id ? updatedRequest : req
                )
              );
            } else {
              // Create new request (assign a new id)
              setRequests((prev) => [
                ...prev,
                {
                  ...updatedRequest,
                  id: prev.length ? prev[prev.length - 1].id! + 1 : 1,
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
                  id: prev.length ? prev[prev.length - 1].id! + 1 : 1,
                },
              ]);
            }
            setShowSuggestionModal(false);
          }}
        />
      )}

      {showOrderModal && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setShowOrderModal(false)}
          onSave={(updatedOrder) => {
            if (selectedOrder) {
              setOrders((prev) =>
                prev.map((ord) =>
                  ord.id === updatedOrder.id ? updatedOrder : ord
                )
              );
            } else {
              setOrders((prev) => [
                ...prev,
                {
                  ...updatedOrder,
                  id: prev.length ? prev[prev.length - 1].id! + 1 : 1,
                },
              ]);
            }
            setShowOrderModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminView;
