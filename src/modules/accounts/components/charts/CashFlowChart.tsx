import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

const { Title, Text } = Typography;

// Sample data for the chart
const generateData = (period: string) => {
  // Different data based on selected period
  if (period === 'week') {
    return [
      { name: 'Mon', income: 4000, expenses: 2400, cashflow: 1600 },
      { name: 'Tue', income: 3000, expenses: 1398, cashflow: 1602 },
      { name: 'Wed', income: 5000, expenses: 3800, cashflow: 1200 },
      { name: 'Thu', income: 2780, expenses: 3908, cashflow: -1128 },
      { name: 'Fri', income: 1890, expenses: 2800, cashflow: -910 },
      { name: 'Sat', income: 2390, expenses: 1800, cashflow: 590 },
      { name: 'Sun', income: 3490, expenses: 1300, cashflow: 2190 },
    ];
  } else if (period === 'month') {
    return [
      { name: 'Week 1', income: 15000, expenses: 10000, cashflow: 5000 },
      { name: 'Week 2', income: 18000, expenses: 12000, cashflow: 6000 },
      { name: 'Week 3', income: 12000, expenses: 15000, cashflow: -3000 },
      { name: 'Week 4', income: 20000, expenses: 14000, cashflow: 6000 },
    ];
  } else {
    return [
      { name: 'Jan', income: 45000, expenses: 40000, cashflow: 5000 },
      { name: 'Feb', income: 52000, expenses: 45000, cashflow: 7000 },
      { name: 'Mar', income: 49000, expenses: 50000, cashflow: -1000 },
      { name: 'Apr', income: 60000, expenses: 45000, cashflow: 15000 },
      { name: 'May', income: 55000, expenses: 48000, cashflow: 7000 },
      { name: 'Jun', income: 70000, expenses: 65000, cashflow: 5000 },
      { name: 'Jul', income: 68000, expenses: 62000, cashflow: 6000 },
      { name: 'Aug', income: 72000, expenses: 68000, cashflow: 4000 },
      { name: 'Sep', income: 75000, expenses: 70000, cashflow: 5000 },
      { name: 'Oct', income: 80000, expenses: 74000, cashflow: 6000 },
      { name: 'Nov', income: 85000, expenses: 80000, cashflow: 5000 },
      { name: 'Dec', income: 90000, expenses: 85000, cashflow: 5000 },
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
        <p className="label" style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0, color: '#52c41a' }}>
          Income: ${payload[0].value.toLocaleString()}
        </p>
        <p style={{ margin: 0, color: '#ff4d4f' }}>
          Expenses: ${payload[1].value.toLocaleString()}
        </p>
        <p style={{ margin: 0, color: '#1890ff', fontWeight: 'bold' }}>
          Net Cash Flow: ${payload[2].value.toLocaleString()}
        </p>
      </div>
    );
  }

  return null;
};

interface CashFlowChartProps {
  title?: string;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ title = 'Cash Flow Analysis' }) => {
  const [period, setPeriod] = useState<string>('month');
  const data = generateData(period);

  const handlePeriodChange = (e: any) => {
    setPeriod(e.target.value);
  };

  // Calculate totals
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
  const netCashFlow = totalIncome - totalExpenses;

  return (
    <Card className="accounting-chart-card" style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Space>
          <Title level={5} style={{ margin: 0 }}>{title}</Title>
          <Tooltip title="Comparison of income vs expenses and resulting cash flow over time">
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
          <ComposedChart
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
            <Legend />
            <Bar dataKey="income" fill="#52c41a" name="Income" barSize={20} />
            <Bar dataKey="expenses" fill="#ff4d4f" name="Expenses" barSize={20} />
            <Line 
              type="monotone" 
              dataKey="cashflow" 
              stroke="#1890ff" 
              name="Net Cash Flow"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Space direction="vertical" size={0}>
          <Text type="secondary">Net Cash Flow</Text>
          <Text 
            strong 
            style={{ 
              color: netCashFlow >= 0 ? '#52c41a' : '#ff4d4f',
              fontSize: '16px'
            }}
          >
            ${netCashFlow.toLocaleString()}
          </Text>
        </Space>
        <Space size={16}>
          <Space size={4} align="center">
            <div style={{ width: 8, height: 8, backgroundColor: '#52c41a', borderRadius: '50%' }} />
            <Text type="secondary">Income: ${totalIncome.toLocaleString()}</Text>
          </Space>
          <Space size={4} align="center">
            <div style={{ width: 8, height: 8, backgroundColor: '#ff4d4f', borderRadius: '50%' }} />
            <Text type="secondary">Expenses: ${totalExpenses.toLocaleString()}</Text>
          </Space>
        </Space>
      </div>
    </Card>
  );
};