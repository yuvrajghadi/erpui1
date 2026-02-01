import React, { useState } from 'react';
import { Card, Typography, Tooltip as AntTooltip } from 'antd';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector,
} from 'recharts';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatQuantity } from '../../../../utilities/formatters';

const { Title, Text } = Typography;

// Sample data for supplier distribution
const supplierData = [
  { name: 'Acme Supplies', value: 4000, percentage: 40 },
  { name: 'Global Materials', value: 3000, percentage: 30 },
  { name: 'Quality Distributors', value: 1500, percentage: 15 },
  { name: 'Premium Inventory', value: 1000, percentage: 10 },
  { name: 'Other Suppliers', value: 500, percentage: 5 },
];

interface SupplierChartProps {
  data?: typeof supplierData;
}

const COLORS = ['var(--color-1890ff)', 'var(--color-52c41a)', 'var(--color-722ed1)', 'var(--color-faad14)', 'var(--color-13c2c2)', 'var(--color-eb2f96)'];

const SupplierChart: React.FC<SupplierChartProps> = ({
  data = supplierData,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{data.name}</p>
          <p style={{ margin: '4px 0' }}>
            <span style={{ fontWeight: 'bold' }}>Quantity:</span> {formatQuantity(data.value, 'units')}
          </p>
          <p style={{ margin: '4px 0' }}>
            <span style={{ fontWeight: 'bold' }}>Percentage:</span> {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Render active shape for pie chart
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={-15} textAnchor="middle" fill="var(--color-333333)" style={{ fontSize: '16px', fontWeight: 'bold' }}>
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="var(--color-666666)" style={{ fontSize: '14px' }}>
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 10}
          outerRadius={outerRadius + 12}
          fill={fill}
        />
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <Card 
      className="dashboard-card chart-card supplier-chart"
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={5} style={{ margin: 0 }}>Supplier Distribution</Title>
        <AntTooltip title="Shows distribution of inventory by supplier">
          <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)' }} />
        </AntTooltip>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconType="circle"
              iconSize={8}
              formatter={(value, entry: any, index) => (
                <span style={{ color: 'var(--color-333333)', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-info" style={{ marginTop: 10, textAlign: 'center' }}>
        <AntTooltip title="Based on inventory entries in the last 6 months">
          <span style={{ color: 'var(--color-8c8c8c)', fontSize: 12, cursor: 'help' }}>
            * Hover over chart segments for more details
          </span>
        </AntTooltip>
      </div>
    </Card>
  );
};

export default SupplierChart;