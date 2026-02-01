'use client';

/**
 * Dashboard Stats Cards Component
 * Displays key metrics and statistics for the admin dashboard
 */

import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { DashboardStats } from '../../types/admin.types';

const { Text } = Typography;

interface StatsCardsProps {
  stats: DashboardStats;
  loading?: boolean;
}

/**
 * Individual Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  trend, 
  loading 
}) => (
  <Card
    className="stats-card"
    bordered={false}
    loading={loading}
  >
    <div className={`stats-card-icon ${color}`}>
      {icon}
    </div>
    <div className="stats-card-title">
      {title}
    </div>
    <div className="stats-card-value">
      {value.toLocaleString()}
    </div>
    {trend && (
      <div className="stats-card-trend">
        <RiseOutlined style={{ marginRight: 4 }} />
        {trend}
      </div>
    )}
  </Card>
);

/**
 * StatsCards Component
 * Main component that renders all dashboard statistics
 */
const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading = false }) => {
  // Calculate trends (for demo purposes)
  const getTrend = (current: number, type: string): string => {
    const trends = {
      total: '+12% from last month',
      pending: '+5% from yesterday',
      approved: '+18% from last week',
      rejected: '-3% from last week'
    };
    return trends[type as keyof typeof trends] || '';
  };

  const statsConfig = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: <FileTextOutlined />,
      color: 'total',
      trend: getTrend(stats.totalApplications, 'total')
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: <ClockCircleOutlined />,
      color: 'pending',
      trend: getTrend(stats.pendingApplications, 'pending')
    },
    {
      title: 'Approved',
      value: stats.approvedApplications,
      icon: <CheckCircleOutlined />,
      color: 'approved',
      trend: getTrend(stats.approvedApplications, 'approved')
    },
    {
      title: 'Rejected',
      value: stats.rejectedApplications,
      icon: <CloseCircleOutlined />,
      color: 'rejected',
      trend: getTrend(stats.rejectedApplications, 'rejected')
    }
  ];

  return (
    <div className="dashboard-stats">
      <Row gutter={[16, 16]}>
        {statsConfig.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              loading={loading}
            />
          </Col>
        ))}
      </Row>
      
      {/* Additional Stats Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={8}>
          <Card
            className="stats-card"
            bordered={false}
            loading={loading}
          >
            <Statistic
              title="Today's Applications"
              value={stats.todayApplications}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            className="stats-card"
            bordered={false}
            loading={loading}
          >
            <Statistic
              title="This Week"
              value={stats.weeklyApplications}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            className="stats-card"
            bordered={false}
            loading={loading}
          >
            <Statistic
              title="This Month"
              value={stats.monthlyApplications}
              prefix={<RiseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsCards;
