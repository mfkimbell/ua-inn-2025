// components/analytics/AdminAnalytics.tsx
import { useState } from "react";
import { 
  BarChart, 
  PieChart, 
  LineChart,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Request, Suggestion } from "@/types";
import { Status } from "@/types/status.enum";
import dayjs from "dayjs";
import RequestsOverTimeChart from "./charts/RequestsOverTimeChart";
import RequestStatusPieChart from "./charts/RequestsStatusPieChart";
import RequestTypeBarChart from "./charts/RequestTypeBarChart";
import TopItemsChart from "./charts/TopItemsChart";
import KeyMetricsCards from "./KeyMetricsCard";

type AdminAnalyticsProps = {
  requests: Request[];
  suggestions: Suggestion[];
};

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ requests, suggestions }) => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [lastUpdated, setLastUpdated] = useState<string>(dayjs().format("MMMM D, YYYY h:mm A"));
  
  // Get start date based on selected time range
  const getStartDate = () => {
    const now = dayjs();
    switch (timeRange) {
      case "week":
        return now.subtract(7, "day").toDate();
      case "month":
        return now.subtract(30, "day").toDate();
      case "quarter":
        return now.subtract(90, "day").toDate();
      case "year":
        return now.subtract(365, "day").toDate();
      default:
        return now.subtract(30, "day").toDate();
    }
  };

  const filteredRequests = requests.filter(request => 
    dayjs(request.createdAt).isAfter(getStartDate())
  );

  const filteredSuggestions = suggestions.filter(suggestion => 
    dayjs(suggestion.createdAt).isAfter(getStartDate())
  );

  const suggestionsAmount = filteredSuggestions.length;

  const totalRequests = filteredRequests.length;
  
  const pendingRequests = filteredRequests.filter(r => r.status === Status.PENDING).length;
  const completedRequests = filteredRequests.filter(r => 
    r.status === Status.DELIVERED || r.status === Status.APPROVED
  ).length;
  
  const completionRate = totalRequests > 0 
    ? Math.round((completedRequests / totalRequests) * 100) 
    : 0;

  const avgResponseTime = calculateAvgResponseTime(filteredRequests);

  const supplyRequests = filteredRequests.filter(r => r.requestType === "supply").length;
  const maintenanceRequests = filteredRequests.filter(r => r.requestType === "maintenance").length;
  const otherRequests = totalRequests - supplyRequests - maintenanceRequests;

  const topItems = getTopRequestedItems(filteredRequests);

  const handleRefresh = () => {
    setLastUpdated(dayjs().format("MMMM D, YYYY h:mm A"));
    // You would typically call a function here to refresh data from API
  };

  // Helper function to calculate average response time (in days)
  function calculateAvgResponseTime(reqs: Request[]): number {
    const requestsWithResponse = reqs.filter(r => 
      r.status !== Status.PENDING && r.createdAt && r.updatedAt
    );
    
    if (requestsWithResponse.length === 0) return 0;
    
    const totalDays = requestsWithResponse.reduce((sum, req) => {
      const created = dayjs(req.createdAt);
      const updated = dayjs(req.updatedAt);
      return sum + updated.diff(created, 'day');
    }, 0);
    
    return Math.round((totalDays / requestsWithResponse.length) * 10) / 10;
  }

  // Helper function to get top requested items
  function getTopRequestedItems(reqs: Request[]) {
    const supplyRequests = reqs.filter(r => r.requestType === "supply");
    const itemCounts: Record<string, number> = {};
    
    // Count occurrences of each item
    supplyRequests.forEach(req => {
      const itemName = req.itemName || "Unknown";
      itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
    });
    
    // Convert to array and sort
    const itemsArray = Object.entries(itemCounts).map(([name, count]) => ({ name, count }));
    itemsArray.sort((a, b) => b.count - a.count);
    
    // Return top 5 items
    return itemsArray.slice(0, 5);
  }

  const totalSpent = filteredRequests
  .filter(r => r.status === Status.DELIVERED || r.status === Status.APPROVED)
  .reduce((sum, req) => sum + (req.cost || 0), 0);

  const statusData = [
    { status: 'pending', count: pendingRequests },
    { status: 'approved', count: filteredRequests.filter(r => r.status === Status.APPROVED).length },
    { status: 'denied', count: filteredRequests.filter(r => r.status === Status.DENIED).length },
    { status: 'delivered', count: filteredRequests.filter(r => r.status === Status.DELIVERED).length },
    { status: 'ordered', count: filteredRequests.filter(r => r.status === Status.ORDERED).length },
    { status: 'completed', count: filteredRequests.filter(r => r.status === Status.COMPLETED).length }
  ];

  return (
    <div className="space-y-6">
      {/* Header and filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated} 
            {/* <button 
              onClick={handleRefresh}
              className="ml-2 text-[#E31937] hover:text-[#c01731] inline-flex items-center"
            >
              <RefreshCw size={14} className="mr-1" /> Refresh
            </button> */}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 font-medium">Time Range:</span>
          <div className="flex bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1 text-xs font-medium rounded ${timeRange === "week" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1 text-xs font-medium rounded ${timeRange === "month" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange("quarter")}
              className={`px-3 py-1 text-xs font-medium rounded ${timeRange === "quarter" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            >
              Quarter
            </button>
            <button
              onClick={() => setTimeRange("year")}
              className={`px-3 py-1 text-xs font-medium rounded ${timeRange === "year" ? "bg-white shadow-sm" : "hover:bg-gray-200"}`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <KeyMetricsCards 
        totalRequests={totalRequests}
        pendingRequests={pendingRequests}
        completedRequests={completedRequests}
        completionRate={completionRate}
        avgResponseTime={avgResponseTime}
        totalSuggestions={suggestionsAmount}
        totalSpent={totalSpent}
      />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Over Time */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <LineChart size={20} className="text-[#E31937] mr-2" />
              Requests Over Time
            </h3>
          </div>
          <RequestsOverTimeChart 
            requests={filteredRequests} 
            timeRange={timeRange} 
          />
        </div>

        {/* Request Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <PieChart size={20} className="text-[#E31937] mr-2" />
              Request Status Distribution
            </h3>
          </div>
          <RequestStatusPieChart statusData={statusData} totalRequests={totalRequests}/>
        </div>

        {/* Request Types */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BarChart size={20} className="text-[#E31937] mr-2" />
              Request Types
            </h3>
          </div>
          <RequestTypeBarChart 
            supplyCount={supplyRequests}
            maintenanceCount={maintenanceRequests}
            otherCount={otherRequests}
          />
        </div>

        {/* Top Requested Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <TrendingUp size={20} className="text-[#E31937] mr-2" />
              Top Requested Items
            </h3>
          </div>
          <TopItemsChart items={topItems} />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;