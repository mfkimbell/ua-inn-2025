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
  X,
  Wrench,
  Package,
  ClipboardList,
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
import { Product } from "@/types/product.types";
import Inventory from "../ui/inventory";
import useUser from "@/hooks/useUser";

export type PageProps = {
  products: Product[];
};

export default function EmployeeView({ products }: PageProps) {
  const [activeTab, setActiveTab] = useState<
    "my-requests" | "my-suggestions" | "inventory"
  >("my-requests");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNewSuggestionModal, setShowNewSuggestionModal] = useState(false);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [mySuggestions, setMySuggestions] = useState<Suggestion[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] =
    useState<Suggestion | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await RequestService.getRequests();
      setMyRequests(requests);
    };

    const fetchSuggestions = async () => {
      // If you have a service method to fetch employee suggestions, use it.
      // Otherwise, this could be replaced by a call to SuggestionsService.getAllSuggestions()
      const suggestions = await SuggestionsService.getAllSuggestions();
      setMySuggestions(suggestions);
    };

    fetchRequests();
    fetchSuggestions();
  }, []);

  // Helpers to render icons and colors
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

  const handleNewRequest = async (request: Request) => {
    const newRequest = await RequestService.createRequest(request);
    setMyRequests((prev) => [parseServerRequest([newRequest])[0], ...prev]);
    setShowNewRequestModal(false);
  };

  const handleNewSuggestion = async (suggestion: Suggestion) => {
    const newSuggestion = await SuggestionsService.createSuggestion(suggestion);
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
      prev.map((item) =>
        item.id === suggestion.id
          ? parseServerSuggestion([updatedSuggestion])[0]
          : item
      )
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
              onClick={() => setShowNewRequestModal(true)}
              className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              New Request
            </button>
          )}

          {activeTab === "my-suggestions" && (
            <button
              onClick={() => setShowNewSuggestionModal(true)}
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

        {activeTab === "my-requests" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRequests.map((request) => (
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
                <div className="mt-4 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>
                      Created:{" "}
                      {dayjs(request.createdAt).format("MMM DD, YYYY hh:mm:A")}
                    </span>
                    <span>
                      Updated:{" "}
                      {dayjs(request.updatedAt).format("MMM DD, YYYY hh:mm:A")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRequest(request)}
                  className="mt-4 w-full text-[#E31937] hover:text-[#c01731] text-sm font-medium py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "my-suggestions" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mySuggestions.map((suggestion) => (
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
                    setShowNewSuggestionModal(true);
                  }}
                  className="mt-4 w-full text-[#E31937] hover:text-[#c01731] text-sm font-medium py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "inventory" && <Inventory products={products} />}
      </main>

      {showNewRequestModal && (
        <RequestModal
          request={selectedRequest}
          products={products}
          onClose={() => setShowNewRequestModal(false)}
          onSave={(updatedRequest) => {
            if (selectedRequest) {
              // For updates
              // (Assuming your RequestService.updateRequest works as expected)
              // You could call a handler similar to admin view
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
              handleNewSuggestion(updatedSuggestion);
            }
            setShowNewSuggestionModal(false);
            setSelectedSuggestion(null);
          }}
        />
      )}
    </div>
  );
}
