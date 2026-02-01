import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';

const { Title, Text } = Typography;

// Sample data for the chart
const generateData = (period: string) => {
  // Different data based on selected period
  if (period === 'week') {
    return [
      { name: 'Utilities', value: 400, color: '#1890ff' },
      { name: 'Rent', value: 300, color: '#13c2c2' },
      { name: 'Salaries', value: 1500, color: '#52c41a' },
      { name: 'Supplies', value: 200, color: '#faad14' },
      { name: 'Marketing', value: 300, color: '#722ed1' },
    ];
  } else if (period === 'month') {
    return [
      { name: 'Utilities', value: 1800, color: '#1890ff' },
      { name: 'Rent', value: 1200, color: '#13c2c2' },
      { name: 'Salaries', value: 6000, color: '#52c41a' },
      { name: 'Supplies', value: 800, color: '#faad14' },
      { name: 'Marketing', value: 1200, color: '#722ed1' },
      { name: 'Insurance', value: 500, color: '#eb2f96' },
    ];
  } else {
    return [
      { name: 'Utilities', value: 22000, color: '#1890ff' },
      { name: 'Rent', value: 14400, color: '#13c2c2' },
      { name: 'Salaries', value: 72000, color: '#52c41a' },
      { name: 'Supplies', value: 9600, color: '#faad14' },
      { name: 'Marketing', value: 14400, color: '#722ed1' },
      { name: 'Insurance', value: 6000, color: '#eb2f96' },
      { name: 'Maintenance', value: 8000, color: '#fa541c' },
      { name: 'Taxes', value: 18000, color: '#fa8c16' },
    ];
  }
};

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ 
        backgroundColor: '#fff', 
        padding: '10px', 
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: payload[0].payload.color }}>
          {payload[0].name}
        </p>
        <p style={{ margin: 0 }}>
          ${payload[0].value.toLocaleString()}
        </p>
        <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
          {`${(payload[0].percent * 100).toFixed(2)}%`}
        </p>
      </div>
    );
  }

  return null;
};

// Custom legend component
const renderLegend = (props: any) => {
  const { payload } = props;
  
  return (
    <ul style={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center',
      padding: 0,
      margin: '16px 0 0 0',
      listStyle: 'none',
      fontSize: '12px'
    }}>
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} style={{ 
          display: 'flex', 
          alignItems: 'center',
          marginRight: '12px',
          marginBottom: '8px'
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            backgroundColor: entry.color,
            marginRight: '4px',
            borderRadius: '2px'
          }} />
          <span style={{ color: '#666' }}>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

interface ExpensesChartProps {
  title?: string;
}

export const ExpensesChart: React.FC<ExpensesChartProps> = ({ title = 'Expenses Breakdown' }) => {
  const [period, setPeriod] = useState<string>('month');
  const data = generateData(period);

  const handlePeriodChange = (e: any) => {
    setPeriod(e.target.value);
  };

  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="accounting-chart-card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Space>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          <Tooltip title="Breakdown of expenses by category for the selected time period">
            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        </Space>
        <Radio.Group value={period} onChange={handlePeriodChange} size="small">
          <Radio.Button value="week">Week</Radio.Button>
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>
      </div>
      
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              label={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Text type="secondary">Total Expenses</Text>
        <Text strong style={{ color: '#ff4d4f' }}>
          ${totalExpenses.toLocaleString()}
        </Text>
      </div>
    </Card>
  );
};