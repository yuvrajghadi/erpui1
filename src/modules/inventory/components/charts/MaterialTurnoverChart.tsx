import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip as AntTooltip, Progress, Divider, Row, Col } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Sample data for material turnover
const turnoverData = [
  { name: 'Cotton', turnover: 8.2, industry: 6.5, status: 'high' },
  { name: 'Polyester', turnover: 5.7, industry: 5.5, status: 'normal' },
  { name: 'Denim', turnover: 4.3, industry: 4.9, status: 'low' },
  { name: 'Silk', turnover: 3.1, industry: 3.8, status: 'low' },
  { name: 'Linen', turnover: 7.6, industry: 5.2, status: 'high' },
];

interface MaterialTurnoverChartProps {
  data?: typeof turnoverData;
}

type ChartView = 'turnover' | 'comparison';

const MaterialTurnoverChart: React.FC<MaterialTurnoverChartProps> = ({
  data = turnoverData,
}) => {
  const [chartView, setChartView] = useState<ChartView>('turnover');
  
  // Get bar color based on status
  const getBarColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'var(--color-52c41a)';
      case 'normal':
        return 'var(--color-1890ff)';
      case 'low':
        return 'var(--color-faad14)';
      default:
        return 'var(--color-1890ff)';
    }
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
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <Divider style={{ margin: '4px 0' }} />
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name === 'turnover' ? 'Your Turnover Rate' : 'Industry Average'}: <strong>{entry.value.toFixed(1)}</strong>
            </p>
          ))}
          {chartView === 'comparison' && (
            <div style={{ marginTop: '4px', borderTop: '1px dashed var(--color-cccccc)', paddingTop: '4px' }}>
              <p style={{ 
                margin: '4px 0',
                color: payload[0].value > payload[1].value ? 'var(--color-52c41a)' : 'var(--color-f5222d)',
              }}>
                {payload[0].value > payload[1].value ? (
                  <span>
                    <ArrowUpOutlined /> {((payload[0].value / payload[1].value - 1) * 100).toFixed(1)}% above average
                  </span>
                ) : (
                  <span>
                    <ArrowDownOutlined /> {((1 - payload[0].value / payload[1].value) * 100).toFixed(1)}% below average
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleViewChange = (e: any) => {
    setChartView(e.target.value);
  };

  return (
    <Card 
      className="dashboard-card chart-card material-turnover-chart"
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Title level={5} style={{ margin: 0 }}>Material Turnover Rates</Title>
        <Radio.Group 
          value={chartView} 
          onChange={handleViewChange} 
          size="small"
          buttonStyle="solid"
        >
          <Radio.Button value="turnover">Turnover</Radio.Button>
          <Radio.Button value="comparison">Industry Comparison</Radio.Button>
        </Radio.Group>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        How frequently materials are used and replenished
      </Text>
      
      <div className="chart-container" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'turnover' ? (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              barSize={40}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Turns per Year', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="turnover" 
                name="Turnover Rate" 
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                ))}
                <LabelList dataKey="turnover" position="top" formatter={(value: number) => value.toFixed(1)} />
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Turns per Year', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="turnover" 
                name="Your Turnover Rate" 
                fill="var(--color-1890ff)" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="industry" 
                name="Industry Average" 
                fill="var(--color-faad14)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <Divider style={{ margin: '16px 0 8px' }} />
      
      <Row gutter={16} align="middle">
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Avg. Turnover</Text>
            <div>
              <Text strong style={{ fontSize: '18px' }}>
                {data.reduce((sum, item) => sum + item.turnover, 0) / data.length}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Industry Avg.</Text>
            <div>
              <Text strong style={{ fontSize: '18px' }}>
                {data.reduce((sum, item) => sum + item.industry, 0) / data.length}
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <AntTooltip title="Higher is better - indicates efficient inventory management">
              <InfoCircleOutlined style={{ marginRight: '4px', color: 'var(--color-8c8c8c)' }} />
              <Text type="secondary">Performance</Text>
            </AntTooltip>
            <div>
              <Text 
                type={data.reduce((sum, item) => sum + item.turnover, 0) / data.length > 
                     data.reduce((sum, item) => sum + item.industry, 0) / data.length ? 'success' : 'danger'} 
                strong style={{ fontSize: '18px' }}
              >
                {data.reduce((sum, item) => sum + item.turnover, 0) / data.length > 
                 data.reduce((sum, item) => sum + item.industry, 0) / data.length ? '+' : ''}
                {(((data.reduce((sum, item) => sum + item.turnover, 0) / data.length) / 
                   (data.reduce((sum, item) => sum + item.industry, 0) / data.length) - 1) * 100).toFixed(1)}%
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MaterialTurnoverChart;
