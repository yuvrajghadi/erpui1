import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip as AntTooltip } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatCurrency } from '../../../../utilities/formatters';

const { Title, Text } = Typography;

// Sample data for inventory value trend
const valueTrendData = [
  { name: 'Jan', value: 950000, target: 900000 },
  { name: 'Feb', value: 1050000, target: 950000 },
  { name: 'Mar', value: 1120000, target: 1000000 },
  { name: 'Apr', value: 1250000, target: 1100000 },
  { name: 'May', value: 1180000, target: 1150000 },
  { name: 'Jun', value: 1320000, target: 1200000 },
];

interface ValueTrendChartProps {
  data?: typeof valueTrendData;
}

type TimeRange = '6months' | '1year' | 'ytd';

const ValueTrendChart: React.FC<ValueTrendChartProps> = ({
  data = valueTrendData,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');
  // Format value as currency
  const formatValue = (value: number) => {
    return formatCurrency(value, { decimals: 0 });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '10px', 
          border: '1px solid var(--color-dddddd)',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p className="label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`value-${index}`} style={{ 
              color: entry.color, 
              margin: '4px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{entry.name === 'value' ? 'Actual Value' : 'Target Value'}: </span>
              <span style={{ marginLeft: '12px', fontWeight: 'bold' }}>
                {formatValue(entry.value)}
              </span>
            </p>
          ))}
          {payload.length >= 2 && (
            <div style={{ 
              marginTop: '8px', 
              padding: '6px 0 0',
              borderTop: '1px dashed var(--color-cccccc)' 
            }}>
              <p style={{ 
                color: payload[0].value >= payload[1].value ? 'var(--color-52c41a)' : 'var(--color-ff4d4f)',
                margin: '0',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Variance:</span>
                <span style={{ marginLeft: '12px', fontWeight: 'bold' }}>
                  {formatValue(payload[0].value - payload[1].value)}
                  {' '}
                  ({(((payload[0].value - payload[1].value) / payload[1].value) * 100).toFixed(1)}%)
                </span>
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleTimeRangeChange = (e: any) => {
    setTimeRange(e.target.value);
  };

  // Calculate gradient colors
  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.value));
    const dataMin = Math.min(...data.map((i) => i.value));
  
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
  
    return dataMax / (dataMax - dataMin);
  };

  return (    <Card 
      className="dashboard-card chart-card value-trend-chart"
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Title level={5} style={{ margin: 0 }}>Inventory Value Trend</Title>
        <Radio.Group 
          value={timeRange} 
          onChange={handleTimeRangeChange} 
          size="small"
          buttonStyle="solid"
        >
          <Radio.Button value="6months">6 Months</Radio.Button>
          <Radio.Button value="1year">1 Year</Radio.Button>
          <Radio.Button value="ytd">YTD</Radio.Button>
        </Radio.Group>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        Track your inventory valuation over time
      </Text>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => value === 'value' ? 'Actual Value' : 'Target Value'}
            />
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-1890ff)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--color-1890ff)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="target" 
              stroke="var(--color-faad14)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="none"
              dot={false}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-1890ff)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              activeDot={{ r: 6 }}
            />
            <ReferenceLine
              y={data[data.length - 1].target}
              stroke="var(--color-faad14)"
              strokeDasharray="3 3"
              label={{
                position: 'right',
                value: 'Target',
                fill: 'var(--color-faad14)',
                fontSize: 12,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: '8px', 
        padding: '8px',
        background: 'rgba(240, 242, 245, 0.5)',
        borderRadius: '4px'
      }}>
        <Space>
          <AntTooltip title="Current month's value compared to target">
            <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)' }} />
          </AntTooltip>
          <Text strong>Current:</Text>
          <Text>{formatValue(data[data.length - 1].value)}</Text>
        </Space>
        <Space>
          <Text 
            type={data[data.length - 1].value >= data[data.length - 1].target ? 'success' : 'danger'} 
            strong
          >
            {data[data.length - 1].value >= data[data.length - 1].target ? '+' : ''}
            {formatValue(data[data.length - 1].value - data[data.length - 1].target)}
            {' '}
            ({(((data[data.length - 1].value - data[data.length - 1].target) / data[data.length - 1].target) * 100).toFixed(1)}%)
          </Text>
          <Text type="secondary">vs Target</Text>
        </Space>
      </div>
    </Card>
  );
};

export default ValueTrendChart;
