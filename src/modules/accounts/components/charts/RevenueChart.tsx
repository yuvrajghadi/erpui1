import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

const { Title, Text } = Typography;

// Sample data for the chart
const generateData = (period: string) => {
  // Different data based on selected period
  if (period === 'week') {
    return [
      { name: 'Mon', revenue: 4000 },
      { name: 'Tue', revenue: 3000 },
      { name: 'Wed', revenue: 5000 },
      { name: 'Thu', revenue: 2780 },
      { name: 'Fri', revenue: 1890 },
      { name: 'Sat', revenue: 2390 },
      { name: 'Sun', revenue: 3490 },
    ];
  } else if (period === 'month') {
    return [
      { name: 'Week 1', revenue: 15000 },
      { name: 'Week 2', revenue: 18000 },
      { name: 'Week 3', revenue: 12000 },
      { name: 'Week 4', revenue: 20000 },
    ];
  } else {
    return [
      { name: 'Jan', revenue: 45000 },
      { name: 'Feb', revenue: 52000 },
      { name: 'Mar', revenue: 49000 },
      { name: 'Apr', revenue: 60000 },
      { name: 'May', revenue: 55000 },
      { name: 'Jun', revenue: 70000 },
      { name: 'Jul', revenue: 68000 },
      { name: 'Aug', revenue: 72000 },
      { name: 'Sep', revenue: 75000 },
      { name: 'Oct', revenue: 80000 },
      { name: 'Nov', revenue: 85000 },
      { name: 'Dec', revenue: 90000 },
    ];
  }
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <p className="label" style={{ margin: 0 }}>{`${label}`}</p>
        <p className="intro" style={{ margin: 0, color: '#1890ff' }}>
          {`Revenue: $${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }

  return null;
};

interface RevenueChartProps {
  title?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ title = 'Revenue Overview' }) => {
  const [period, setPeriod] = useState<string>('month');
  const data = generateData(period);

  const handlePeriodChange = (e: any) => {
    setPeriod(e.target.value);
  };

  return (
    <Card className="accounting-chart-card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Space>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          <Tooltip title="Revenue generated from all sources over the selected time period">
            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        </Space>
        <Radio.Group value={period} onChange={handlePeriodChange} size="small">
          <Radio.Button value="week">Week</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>
      </div>
      
      <div style={{ height: 300 }}>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#1890ff" 
              fill="#e6f7ff" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Text type="secondary">Total Revenue</Text>
        <Text strong>
          ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
        </Text>
      </div>
    </Card>
  );
};