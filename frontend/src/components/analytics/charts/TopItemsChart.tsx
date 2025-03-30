// components/analytics/charts/TopItemsChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TopItemsChartProps = {
  items: Array<{
    name: string;
    count: number;
  }>;
};

const TopItemsChart: React.FC<TopItemsChartProps> = ({ items }) => {
  // Format items for display (truncate long names)
  const data = items.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    fullName: item.name,
    count: item.count
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{payload[0].payload.fullName}</p>
          <p>Requested: {payload[0].value} times</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      {items.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            layout="vertical"
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={100}
              stroke="#9ca3af"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#E31937" 
              radius={[0, 4, 4, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center text-gray-500">
          No item request data available
        </div>
      )}
    </div>
  );
};

export default TopItemsChart;