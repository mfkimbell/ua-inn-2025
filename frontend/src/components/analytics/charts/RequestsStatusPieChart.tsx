// Components/analytics/charts/RequestStatusPieChart.tsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

type StatusData = {
  status: string;
  count: number;
};

type RequestStatusPieChartProps = {
  statusData: StatusData[];
  totalRequests: number;
};

const COLORS: Record<string, string> = {
  pending: "#f59e0b", // Amber
  approved: "#3b82f6", // Blue
  denied: "#ef4444", // Red
  delivered: "#10b981", // Green
  ordered: "#8b5cf6", // Purple
  completed: "#10b981", // Green
};

const RequestStatusPieChart: React.FC<RequestStatusPieChartProps> = ({
  statusData,
  totalRequests,
}) => {
  // Format data for the chart
  const chartData = statusData
    .filter((item) => item.count > 0) // Only include statuses with requests
    .map((item) => {
      const statusKey = item.status.toLowerCase();
      return {
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize
        value: item.count,
        color: statusKey in COLORS ? COLORS[statusKey] : "#9ca3af", // Type-safe check
      };
    });

  // Custom renderer for the label
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

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

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active: boolean;
    payload: {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      [x: string]: any;
      value: number;
    }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{data.name}</p>
          <p>Count: {data.value}</p>
          <p>Percentage: {((data.value / totalRequests) * 100).toFixed(1)}%</p>
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
            <Tooltip content={<CustomTooltip active={true} payload={[]} />} />
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
