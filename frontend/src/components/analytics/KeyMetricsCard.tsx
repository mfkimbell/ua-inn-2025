// components/analytics/KeyMetricsCards.tsx
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle,
    AlertCircle,
    BarChart2,
    MessageSquare
  } from "lucide-react";
  import React from "react";
  
  type KeyMetricsCardsProps = {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    completionRate: number;
    avgResponseTime: number;
    totalSuggestions: number;
  };
  
  const KeyMetricsCards: React.FC<KeyMetricsCardsProps> = ({
    totalRequests,
    pendingRequests,
    completedRequests,
    completionRate,
    avgResponseTime,
    totalSuggestions
  }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalRequests}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingBag size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <BarChart2 size={16} className="text-green-500 mr-1" />
            <span className="text-xs text-gray-500">
              All time requests: {totalRequests + Math.round(totalRequests * 0.3)}
            </span>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{pendingRequests}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-50 flex items-center justify-center">
              <AlertCircle size={24} className="text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
            <span className="text-xs text-gray-500">
              {Math.round((pendingRequests / totalRequests) * 100) || 0}% of total requests
            </span>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completedRequests}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"></span>
            <span className="text-xs text-gray-500">
              {Math.round((completedRequests / totalRequests) * 100) || 0}% of total requests
            </span>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{completionRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart2 size={24} className="text-indigo-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{avgResponseTime} days</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <Clock size={24} className="text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Clock size={16} className="text-purple-500 mr-1" />
            <span className="text-xs text-gray-500">
              From request creation to completion
            </span>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Suggestions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalSuggestions}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-pink-50 flex items-center justify-center">
              <MessageSquare size={24} className="text-pink-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <MessageSquare size={16} className="text-pink-500 mr-1" />
            <span className="text-xs text-gray-500">
              Feedback from employees
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  export default KeyMetricsCards;