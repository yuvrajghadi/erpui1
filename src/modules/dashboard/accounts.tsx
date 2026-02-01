'use client';

import React from 'react';
import { Card, Row, Col, Typography, Space, Button, Statistic } from 'antd';
import {
  PlusOutlined,
  RiseOutlined,
  FallOutlined,
  DownOutlined,
  MoneyCollectOutlined,
  TransactionOutlined,
  DollarCircleOutlined,
  WalletOutlined,
  InboxOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface MetricCardProps {
  title: string;
  value: string;
  percentageChange?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  secondaryText?: string;
  cardBgColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
  iconBgColor,
  iconColor,
  secondaryText,
  cardBgColor,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 12,
        boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        padding: '12px 16px',
        height: '100%',
        transition: 'all 0.3s ease',
        background: isHovered ? '#ffffff' : (cardBgColor || 'transparent'),
      }}
      styles={{ body: { padding: 0 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Space direction="vertical" style={{ width: '100%' }} size={2}>
        <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Title level={5} style={{ margin: 0, fontSize: 14, color: '#666' }}>
            {title}
          </Title>
          <div
            style={{
              background: iconBgColor,
              borderRadius: 8,
              padding: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              color: iconColor,
            }}
          >
            {icon}
          </div>
        </Space>
        <div style={{ marginTop: 8 }}>
          <Statistic 
            value={value} 
            valueStyle={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              color: '#1a1a1a',
              lineHeight: 1.2 
            }} 
          />
        </div>
        <Space style={{ marginTop: 8, alignItems: 'center' }}>
          {percentageChange && (
            <Space size={4}>
              {percentageChange.type === 'increase' ? (
                <RiseOutlined style={{ color: '#52c41a', fontSize: 12 }} />
              ) : (
                <FallOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
              )}
              <Text style={{ 
                color: percentageChange.type === 'increase' ? '#52c41a' : '#ff4d4f', 
                fontWeight: 'bold', 
                fontSize: 12 
              }}>
                {percentageChange.value}
              </Text>
            </Space>
          )}
          <Text type="secondary" style={{ fontSize: 12 }}>This Week</Text>
        </Space>
        {secondaryText && (
          <Text type="secondary" style={{ marginTop: 4, fontSize: 12 }}>
            {secondaryText}
          </Text>
        )}
      </Space>
    </Card>
  );
};

const AccountsDashboard: React.FC = () => {
  return (
    <div style={{
      // background: '#fff', // Removed as requested
      borderRadius: '12px', // Keeping border-radius for consistency with cards within.
      height: '100%',
      overflow: 'auto',
      //padding: '16px' // Added padding back to the main container
    }}>
      <div style={{
        // background: '#fff', // Removed background here as cards will have their own
        // marginBottom: '16px' // Removed as requested
      }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <MetricCard
            title="Accounts Payable"
            value="₹23,738"
            percentageChange={{ value: '6.9%', type: 'increase' }}
            icon={<MoneyCollectOutlined />}
            iconBgColor="#FFEBEE"
            iconColor="#E53935"
            cardBgColor="#e6f7ff" // Light blue
          />
          <MetricCard
            title="Amounts Receivable"
            value="₹23,738"
            percentageChange={{ value: '3.0%', type: 'decrease' }}
            icon={<TransactionOutlined />}
            iconBgColor="#FFFDE7"
            iconColor="#FFB300"
            cardBgColor="#f6ffed" // Light green
          />
          <MetricCard
            title="Total Sales"
            value="₹23,738"
            percentageChange={{ value: '6.9%', type: 'increase' }}
            icon={<DollarCircleOutlined />}
            iconBgColor="#E8F5E9"
            iconColor="#43A047"
            cardBgColor="#fffbe6" // Light yellow
          />
          <MetricCard
            title="Current Balance"
            value="₹23,738"
            percentageChange={{ value: '5.2%', type: 'decrease' }}
            icon={<WalletOutlined />}
            iconBgColor="#EDE7F6"
            iconColor="#5E35B1"
            cardBgColor="#f9f0ff" // Light purple
          />
        </Space>
      </div>
    </div>
  );
};

export default AccountsDashboard;
