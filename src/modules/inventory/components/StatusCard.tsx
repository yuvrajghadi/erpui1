import React from 'react';
import { Card, Progress, Typography, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatNumber } from '../../../utilities/formatters';

const { Title, Text } = Typography;

interface StatusCardProps {
  title: string;
  currentStock: number;
  totalCapacity: number;
  unit: string;
  color: string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
  status?: 'normal' | 'low' | 'critical' | 'out-of-stock';
}

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  currentStock,
  totalCapacity,
  unit,
  color,
  icon,
  trend,
  trendLabel,
  warningThreshold = 30,
  criticalThreshold = 15,
  status
}) => {
  // Calculate percentage
  const percentage = Math.round((currentStock / totalCapacity) * 100);
  
  // Determine status color based on thresholds or status prop
  const getStatusColor = () => {
    if (status) {
      switch (status) {
        case 'critical':
        case 'out-of-stock':
          return 'var(--color-ff4d4f)';
        case 'low':
          return 'var(--color-faad14)';
        case 'normal':
        default:
          return color;
      }
    }
    
    if (percentage <= criticalThreshold) return 'var(--color-ff4d4f)';
    if (percentage <= warningThreshold) return 'var(--color-faad14)';
    return color;
  };

  const statusColor = getStatusColor();

  return (
    <Card 
      className="inventory-status-card" 
      variant="outlined"
      style={{ 
        borderTop: `3px solid ${statusColor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        height: '100%',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
      }}
      hoverable
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <div 
          style={{ 
            fontSize: '24px', 
            marginRight: '12px',
            color: statusColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: `${statusColor}15`,
          }}
        >
          {icon}
        </div>
        <div>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          <Space size={4} align="center">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Current / Total Capacity
            </Text>
            <Tooltip title="Current available stock vs maximum storage capacity">
              <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)', fontSize: '12px' }} />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
          <Text strong style={{ fontSize: '24px', color: statusColor }}>
            {formatNumber(currentStock)}
          </Text>
          <Text type="secondary">
            / {formatNumber(totalCapacity)} {unit}
          </Text>
        </div>
        <Progress 
          percent={percentage} 
          showInfo={false} 
          strokeColor={statusColor}
          trailColor="var(--color-f0f0f0)"
          size={8}
          style={{ marginBottom: '8px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {percentage}% Utilized
          </Text>
          {trend !== undefined && (
            <Text 
              style={{ 
                fontSize: '12px', 
                color: trend > 0 ? 'var(--color-52c41a)' : trend < 0 ? 'var(--color-ff4d4f)' : 'var(--color-8c8c8c)'
              }}
            >
              {trend > 0 ? '+' : ''}{trend}%
              {trendLabel && (
                <span style={{ marginLeft: '4px', color: 'var(--color-8c8c8c)' }}>
                  {trendLabel}
                </span>
              )}
            </Text>
          )}
        </div>
      </div>
    </Card>
  );
};