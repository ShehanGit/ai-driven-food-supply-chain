// src/components/dashboard/DashboardCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: { value: number; isPositive: boolean };
  linkTo?: string;
  bgColor?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  change,
  linkTo,
  bgColor = 'bg-white',
}) => {
  const content = (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className="mt-1">
              <span
                className={`text-sm font-medium ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </p>
          )}
        </div>
        <div
          className={`rounded-md p-3 ${
            bgColor === 'bg-white' ? 'bg-primary-50' : 'bg-white bg-opacity-20'
          }`}
        >
          {icon}
        </div>
      </div>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo}>
        <Card
          className={`${bgColor} hover:shadow-md transition-shadow cursor-pointer h-full`}
          bodyClassName="h-full"
        >
          {content}
        </Card>
      </Link>
    );
  }

  return (
    <Card className={bgColor} bodyClassName="h-full">
      {content}
    </Card>
  );
};

export default DashboardCard;