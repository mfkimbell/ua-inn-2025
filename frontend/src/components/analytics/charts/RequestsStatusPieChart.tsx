// components/analytics/charts/RequestStatusPieChart.tsx
import React, { useMemo } from 'react';
import { Request } from '@/types/request.types';
import { Status } from '@/types/status.enum';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type RequestStatusPieChartProps = {
  requests: Request[];
};

const COLORS = {
  [Status.PENDING]: '#f59e0b',    // Amber
  [Status.APPROVED]: '#3b82f6',   // Blue
  [Status.DENIED]: '#ef4444',     // Red
  [Status.DELIVERED]: '#10b981',  // Green
  [Status.ORDERED]: '#8b5cf6',    // Purple
};

const RequestStatusPieChart: React.FC<RequestStatusPieChartProps> = ({ requests }) => {
  const chartData = useMemo(() => {
    // Get count of each status
    const statusCounts: Record<string, number> = {};
    
    // Initialize all statuses with 0
    Object.values(Status).forEach(status => {
      statusCounts[status] = 0;
    });
    
    // Count occurrences
    requests.forEach(request => {
      statusCounts[request.status] = (statusCounts[request.status] || 0) + 1;
    });
    
    // Convert to array for chart
    return Object.entries(statusCounts)
      .filter(([_, count]) => count > 0) // Only include statuses with requests
      .map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize
        value: count,
        color: COLORS[status as Status] || '#9ca3af' // Default color
      }));
  }, [requests]);

  // Custom renderer for the label
  const renderCustomLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent 
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{data.name}</p>
          <p>Count: {data.value}</p>
          <p>Percentage: {((data.value / requests.length) * 100).toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No request data available
        </div>
      )}
    </div>
  );
};

export default RequestStatusPieChart;