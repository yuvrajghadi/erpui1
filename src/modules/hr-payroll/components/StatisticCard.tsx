import React from 'react';
import { Card, Statistic, Row, Col, Typography, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  precision?: number;
  change?: number | string;
  changeText?: string;
  changePrefix?: string;
  changeType?: 'increase' | 'decrease' | string;
  loading?: boolean;
  onClick?: () => void;
  tooltip?: string;
  isCurrency?: boolean;
  currencyLocale?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  color,
  prefix,
  suffix,
  precision = 0,
  change,
  changeText,
  changePrefix = '',
  loading = false,
  onClick,
  tooltip,
  isCurrency = false,
  currencyLocale = 'en-IN',
}) => {
  // Handle change value (can be string or number)
  const numericChange = typeof change === 'number' ? change : parseFloat(change as string) || 0;
  const isPositiveChange = numericChange > 0;
  const changeIcon = isPositiveChange ? <ArrowUpOutlined /> : <ArrowDownOutlined />;
  const changeColor = isPositiveChange ? '#52c41a' : '#ff4d4f';
  
  // Format value if it's a currency
  let formattedValue = value;
  if (isCurrency && typeof value === 'number') {
    formattedValue = new Intl.NumberFormat(currencyLocale, {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: precision,
    }).format(value);
  }
  
  // Set default prefix for Indian currency if not provided
  const displayPrefix = isCurrency && !prefix ? '₹' : prefix;

  return (
    <Card 
      className="animated-card stat-card" 
      hoverable={!!onClick}
      onClick={onClick}
      loading={loading}
    >
      <Row justify="space-between" align="middle">
        <Col>
          <div className="stat-header">
            <span className="stat-title">{title}</span>
            {tooltip && (
              <Tooltip title={tooltip}>
                <InfoCircleOutlined className="stat-info-icon" />
              </Tooltip>
            )}
          </div>
          {isCurrency && typeof value === 'number' ? (
            <div className="stat-value" style={{ color }}>
              {formattedValue}
            </div>
          ) : (
            <Statistic 
              value={value}
              precision={precision}
              prefix={displayPrefix}
              suffix={suffix}
              valueStyle={{ color }}
            />
          )}
          {change !== undefined && (
            <Text className="stat-footer" style={{ color: changeColor }}>
              {changeIcon} {changePrefix}{Math.abs(numericChange)}{changePrefix ? '' : '%'} {changeText || (isPositiveChange ? 'increase' : 'decrease')}
            </Text>
          )}
        </Col>
        <Col>
          <div className="icon-large" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default StatisticCard;