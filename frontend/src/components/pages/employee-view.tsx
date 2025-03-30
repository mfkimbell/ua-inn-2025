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
} from "lucide-react";
import { RequestService } from "@/lib/request-service";
import { Request } from "@/types/request.types";
import AuthButton from "../auth/button";
import RequestDetailsModal from "@/components/ui/details-modal";
import RequestModal from "../ui/request-modal";
import { parseServerRequest } from "@/types";
import { Product } from "@/types/product.types";

export type PageProps = {
  products: Product[];
};

export default function EmployeeView({ products }: PageProps) {
  const [activeTab, setActiveTab] = useState("my-requests");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("supply");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await RequestService.getRequests();
      setMyRequests(requests);
    };
    fetchRequests();
  }, []);

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-600 mb-6">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Employee Request Center
        </div>

        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Request Dashboard
          </h1>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
          >
            <Plus size={20} className="mr-2" />
            New Request
          </button>
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
              <FileText size={16} className="mr-1" />
              My Requests
            </button>
          </nav>
        </div>

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
      </main>

      {showNewRequestModal && (
        <RequestModal
          request={selectedRequest}
          products={products}
          onClose={() => setShowNewRequestModal(false)}
          onSave={handleNewRequest}
        />
      )}

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
