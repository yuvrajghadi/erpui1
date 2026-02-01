import React from 'react';
import { Card, Typography, Space } from 'antd';
import ClientOnlyWrapper from '@/components/shared/ClientOnlyWrapper';

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  trendLabel?: string;
  prefix?: string;
  suffix?: string;
  valueFormatter?: (value: number | string) => string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  trendLabel,
  prefix,
  suffix,
  valueFormatter = (val) => val.toString(),
}) => {
  // Format the value if it's a number and a formatter is provided
  // Using a stable formatting approach to avoid hydration mismatches
  const formattedValue = React.useMemo(() => {
    if (typeof value === 'number' && valueFormatter) {
      // Use consistent US formatting to prevent hydration mismatches
      return valueFormatter(value);
    }
    return value.toString();
  }, [value, valueFormatter]);
  
  // Determine trend color
  const getTrendColor = () => {
    if (trend === undefined) return '#8c8c8c';
    if (trend > 0) return '#52c41a';
    if (trend < 0) return '#ff4d4f';
    return '#8c8c8c';
  };

  return (
    <Card 
      className="accounting-stat-card" 
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
      }}
      hoverable
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div 
          style={{ 
            fontSize: '24px', 
            marginRight: '16px',
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {title}
          </Text>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '4px' }}>
            {prefix && (
              <Text style={{ fontSize: '16px', marginRight: '4px', color: '#8c8c8c' }}>
                {prefix}
              </Text>
            )}
            <ClientOnlyWrapper fallback={<Title level={3} style={{ margin: 0, color: color }}>Loading...</Title>}>
              <Title level={3} style={{ margin: 0, color: color }}>
                {formattedValue}
              </Title>
            </ClientOnlyWrapper>
            {suffix && (
              <Text style={{ fontSize: '16px', marginLeft: '4px', color: '#8c8c8c' }}>
                {suffix}
              </Text>
            )}
          </div>
          {trend !== undefined && (
            <div style={{ marginTop: '8px' }}>
              <Space size={4}>
                <Text 
                  style={{ 
                    fontSize: '14px', 
                    color: getTrendColor(),
                    fontWeight: 500,
                  }}
                >
                  {trend > 0 ? '+' : ''}{trend}%
                </Text>
                {trendLabel && (
                  <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    {trendLabel}
                  </Text>
                )}
              </Space>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
