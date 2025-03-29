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

export default function EmployeeView() {
  const [activeTab, setActiveTab] = useState("my-requests");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("supply");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDetails, setRequestDetails] = useState("");
  const [myRequests, setMyRequests] = useState<Request[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await RequestService.getRequests();
      setMyRequests(requests);
    };
    fetchRequests();
  }, []);

  const handleNewRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ requestType, requestTitle, requestDetails });
    setShowNewRequestModal(false);

    setRequestType("supply");
    setRequestTitle("");
    setRequestDetails("");
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
                Jane Smith
              </span>
              <ChevronDown size={16} className="ml-1 text-gray-500" />
            </div>
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
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "my-requests"
                  ? "border-[#E31937] text-[#E31937]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
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
                    {dayjs(request.createdAt).format("DD/MM/YYYY hh:mm:ss")}
                  </span>
                  <span>
                    Updated:{" "}
                    {dayjs(request.updatedAt).format("DD/MM/YYYY hh:mm:ss")}
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full text-[#E31937] hover:text-[#c01731] text-sm font-medium py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* 
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-sm p-12 text-center">
          <Box size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No requests yet</h3>
          <p className="text-gray-500 mb-4">Get started by creating a new request or suggestion</p>
          <button 
            onClick={() => setShowNewRequestModal(true)}
            className="bg-[#E31937] hover:bg-[#c01731] text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Create Request
          </button>
        </div>
        */}
      </main>

      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  New Request
                </h2>
                <button
                  onClick={() => setShowNewRequestModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleNewRequest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31937] focus:border-transparent"
                  >
                    <option value="supply">Supply Request</option>
                    <option value="maintenance">Maintenance Request</option>
                    <option value="suggestion">Suggestion</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={requestTitle}
                    onChange={(e) => setRequestTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31937] focus:border-transparent"
                    placeholder="Brief description of your request"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Details
                  </label>
                  <textarea
                    value={requestDetails}
                    onChange={(e) => setRequestDetails(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E31937] focus:border-transparent"
                    placeholder="Provide additional information about your request"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewRequestModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E31937] hover:bg-[#c01731] text-white font-medium rounded-md transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
