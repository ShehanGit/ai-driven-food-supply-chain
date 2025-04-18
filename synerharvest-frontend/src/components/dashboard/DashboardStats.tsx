// src/components/dashboard/DashboardStats.tsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../common/Card';

interface StatsData {
  name: string;
  value: number;
}

interface DashboardStatsProps {
  title: string;
  subtitle?: string;
  data: StatsData[];
  color?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  title,
  subtitle,
  data,
  color = '#22c55e', // primary-500
}) => {
  return (
    <Card title={title} subtitle={subtitle}>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DashboardStats;