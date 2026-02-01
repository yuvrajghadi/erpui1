import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip as AntTooltip } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatQuantity } from '../../../../utilities/formatters';

const { Title, Text } = Typography;

// Sample data for inventory movement
const movementData = [
  { name: 'Jan', inward: 2500, outward: 1800, balance: 700 },
  { name: 'Feb', inward: 3200, outward: 2400, balance: 1500 },
  { name: 'Mar', inward: 2800, outward: 3000, balance: 1300 },
  { name: 'Apr', inward: 3500, outward: 2900, balance: 1900 },
  { name: 'May', inward: 4000, outward: 3200, balance: 2700 },
  { name: 'Jun', inward: 3800, outward: 3600, balance: 2900 },
];

interface MovementChartProps {
  data?: typeof movementData;
}

type TimeRange = '6months' | '1year' | 'ytd';

const MovementChart: React.FC<MovementChartProps> = ({
  data = movementData,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('6months');

  // Format quantity with units
  const formatValue = (value: number) => {
    return formatQuantity(value, 'units', 0);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`value-${index}`} style={{ color: entry.color, margin: '4px 0' }}>
              {`${entry.name}: ${formatValue(entry.value)}`}
            </p>
          ))}
          {payload.length >= 2 && (
            <p style={{ color: 'var(--color-722ed1)', margin: '8px 0 0 0', borderTop: '1px dashed var(--color-cccccc)', paddingTop: '8px' }}>
              {`Net: ${formatValue(payload[0].value - payload[1].value)}`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const handleTimeRangeChange = (e: any) => {
    setTimeRange(e.target.value);
  };

  return (
    <Card 
      className="dashboard-card chart-card movement-chart"
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '16px' }}>
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
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-f0f0f0)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-8c8c8c)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-8c8c8c)' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <ReferenceLine y={0} stroke="var(--color-f0f0f0)" />
            <Line 
              type="monotone" 
              dataKey="inward" 
              name="Inward" 
              stroke="var(--color-52c41a)" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-52c41a)', stroke: 'var(--color-ffffff)', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: 'var(--color-52c41a)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="outward" 
              name="Outward" 
              stroke="var(--color-f5222d)" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-f5222d)', stroke: 'var(--color-ffffff)', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: 'var(--color-f5222d)', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              name="Balance" 
              stroke="var(--color-722ed1)" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-722ed1)', stroke: 'var(--color-ffffff)', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: 'var(--color-722ed1)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-info" style={{ marginTop: 10, display: 'flex', justifyContent: 'center' }}>
        <Space>
          <AntTooltip title="Total inventory received">
            <span style={{ color: 'var(--color-52c41a)', fontSize: 12, cursor: 'help', display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-52c41a)', marginRight: '4px' }}></span>
              Inward
            </span>
          </AntTooltip>
          <AntTooltip title="Total inventory issued">
            <span style={{ color: 'var(--color-f5222d)', fontSize: 12, cursor: 'help', display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-f5222d)', marginRight: '4px' }}></span>
              Outward
            </span>
          </AntTooltip>
          <AntTooltip title="Net balance of inventory">
            <span style={{ color: 'var(--color-722ed1)', fontSize: 12, cursor: 'help', display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-722ed1)', marginRight: '4px' }}></span>
              Balance
            </span>
          </AntTooltip>
        </Space>
      </div>
    </Card>
  );
};

export default MovementChart;