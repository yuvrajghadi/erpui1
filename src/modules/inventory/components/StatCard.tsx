import React from 'react';
import { Card, Typography, Space } from 'antd';
import { formatNumber, formatCurrency, formatQuantity } from '../../../utilities/formatters';

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
  isCurrency?: boolean;
  isQuantity?: boolean;
  unit?: string;
  decimals?: number;
  compact?: boolean;
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
  isCurrency = false,
  isQuantity = false,
  unit = '',
  decimals = 0,
  compact = false,
  valueFormatter,
}) => {
  // Format the value if it's a number using our SSR-safe formatters
  // This ensures consistent rendering between server and client
  const formattedValue = React.useMemo(() => {
    if (typeof value !== 'number') {
      return value.toString();
    }
    
    // If a custom formatter is provided, use it
    if (valueFormatter) {
      return valueFormatter(value);
    }
    
    // Use the appropriate formatter based on the value type
    if (isCurrency) {
      return formatCurrency(value, { decimals, compact });
    }
    
    if (isQuantity) {
      return formatQuantity(value, unit, decimals);
    }
    
    // Default number formatting
    return formatNumber(value, { 
      prefix: prefix || '', 
      suffix: suffix || '', 
      decimals,
      compact
    });
  }, [value, valueFormatter, isCurrency, isQuantity, unit, decimals, compact, prefix, suffix]);
  
  
  // Determine trend color
  const getTrendColor = () => {
    if (trend === undefined) return 'var(--color-8c8c8c)';
    if (trend > 0) return 'var(--color-52c41a)';
    if (trend < 0) return 'var(--color-ff4d4f)';
    return 'var(--color-8c8c8c)';
  };

  return (
    <Card 
      className="inventory-stat-card" 
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
            <Title level={3} style={{ margin: 0, color: color }}>
              {formattedValue}
            </Title>
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
                  <Text style={{ fontSize: '12px', color: 'var(--color-8c8c8c)' }}>
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