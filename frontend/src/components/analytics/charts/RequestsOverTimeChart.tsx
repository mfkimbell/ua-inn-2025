// components/analytics/charts/RequestsOverTimeChart.tsx
import React, { useMemo } from 'react';
import { Request } from '@/types/request.types';
import dayjs from 'dayjs';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

type RequestsOverTimeChartProps = {
  requests: Request[];
  timeRange: 'week' | 'month' | 'quarter' | 'year';
};

const RequestsOverTimeChart: React.FC<RequestsOverTimeChartProps> = ({ 
  requests, 
  timeRange 
}) => {
  // Generate data for the chart based on time range
  const chartData = useMemo(() => {
    // Determine the format and grouping based on time range
    let format: string;
    let increment: 'day' | 'week' | 'month';
    let count: number;
    
    switch (timeRange) {
      case 'week':
        format = 'ddd';
        increment = 'day';
        count = 7;
        break;
      case 'month':
        format = 'MMM D';
        increment = 'day';
        count = 30;
        break;
      case 'quarter':
        format = 'MMM';
        increment = 'week';
        count = 13;
        break;
      case 'year':
        format = 'MMM YYYY';
        increment = 'month';
        count = 12;
        break;
      default:
        format = 'MMM D';
        increment = 'day';
        count = 30;
    }

    // Generate date intervals
    const now = dayjs();
    const intervals = [];
    
    for (let i = count - 1; i >= 0; i--) {
      let date;
      if (increment === 'day') {
        date = now.subtract(i, 'day');
      } else if (increment === 'week') {
        date = now.subtract(i, 'week');
      } else {
        date = now.subtract(i, 'month');
      }
      intervals.push(date);
    }

    // Group requests by interval
    const data = intervals.map(interval => {
      let startOfInterval, endOfInterval;
      
      if (increment === 'day') {
        startOfInterval = interval.startOf('day');
        endOfInterval = interval.endOf('day');
      } else if (increment === 'week') {
        startOfInterval = interval.startOf('week');
        endOfInterval = interval.endOf('week');
      } else {
        startOfInterval = interval.startOf('month');
        endOfInterval = interval.endOf('month');
      }

      // Count requests in this interval by status
      const requestsInInterval = requests.filter(req => {
        const createdAt = dayjs(req.createdAt);
        return createdAt.isAfter(startOfInterval) && createdAt.isBefore(endOfInterval);
      });

      const pendingCount = requestsInInterval.filter(req => req.status === 'pending').length;
      const approvedCount = requestsInInterval.filter(req => req.status === 'approved').length;
      const completedCount = requestsInInterval.filter(req => 
        req.status === 'delivered' || req.status === 'completed'
      ).length;

      return {
        name: interval.format(format),
        pending: pendingCount,
        approved: approvedCount,
        completed: completedCount,
        total: requestsInInterval.length
      };
    });

    return data;
  }, [requests, timeRange]);

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsOverTimeChart;