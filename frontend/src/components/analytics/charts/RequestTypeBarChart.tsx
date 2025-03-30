// components/analytics/charts/RequestTypeBarChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type RequestTypeBarChartProps = {
  supplyCount: number;
  maintenanceCount: number;
  otherCount: number;
};

const RequestTypeBarChart: React.FC<RequestTypeBarChartProps> = ({
  supplyCount,
  maintenanceCount,
  otherCount
}) => {
  const data = [
    {
      name: 'Supply',
      count: supplyCount,
      fill: '#3b82f6' // Blue
    },
    {
      name: 'Maintenance',
      count: maintenanceCount,
      fill: '#ef4444' // Red
    },
    {
      name: 'Other',
      count: otherCount,
      fill: '#9ca3af' // Gray
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = supplyCount + maintenanceCount + otherCount;
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs">
          <p className="font-medium">{label}</p>
          <p>Count: {payload[0].value}</p>
          <p>Percentage: {percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <YAxis 
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestTypeBarChart;