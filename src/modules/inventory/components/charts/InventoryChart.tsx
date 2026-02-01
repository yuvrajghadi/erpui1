import React from 'react';
import { Card, Typography, Tooltip as AntTooltip } from 'antd';
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
} from 'recharts';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatQuantity } from '../../../../utilities/formatters';

const { Title, Text } = Typography;

// Sample data for inventory status
const inventoryData = [
  { name: 'Cotton', inStock: 1200, allocated: 300, reorderPoint: 500 },
  { name: 'Polyester', inStock: 800, allocated: 200, reorderPoint: 400 },
  { name: 'Denim', inStock: 350, allocated: 150, reorderPoint: 400 },
  { name: 'Silk', inStock: 180, allocated: 50, reorderPoint: 200 },
  { name: 'Linen', inStock: 420, allocated: 120, reorderPoint: 300 },
];

interface InventoryChartProps {
  data?: typeof inventoryData;
}

const InventoryChart: React.FC<InventoryChartProps> = ({
  data = inventoryData,
}) => {
  // Format quantity with units
  const formatValue = (value: number) => {
    return formatQuantity(value, 'units', 0);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const belowReorder = item.inStock < item.reorderPoint;
      
      return (
        <div className="custom-tooltip">
          <p className="label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
          <div style={{ padding: '4px 0', borderTop: '1px dashed var(--color-cccccc)' }}>
            <p style={{ color: belowReorder ? 'var(--color-ff4d4f)' : 'var(--color-52c41a)', margin: '4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>In Stock:</span> {formatValue(item.inStock)}
              {belowReorder && (
                <span style={{ color: 'var(--color-ff4d4f)', marginLeft: '4px' }}>
                  (Below Reorder Point)
                </span>
              )}
            </p>
            <p style={{ color: 'var(--color-1890ff)', margin: '4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Allocated:</span> {formatValue(item.allocated)}
            </p>
            <p style={{ color: 'var(--color-faad14)', margin: '4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Reorder Point:</span> {formatValue(item.reorderPoint)}
            </p>
          </div>
          <div style={{ padding: '4px 0', borderTop: '1px dashed var(--color-cccccc)', marginTop: '4px' }}>
            <p style={{ color: 'var(--color-8c8c8c)', margin: '4px 0' }}>
              <span style={{ fontWeight: 'bold' }}>Available:</span> {formatValue(item.inStock - item.allocated)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      className="dashboard-card chart-card inventory-chart"
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={5} style={{ margin: 0 }}>Inventory Status</Title>
        <AntTooltip title="Shows current stock levels against reorder points">
          <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)' }} />
        </AntTooltip>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={0}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
            <Bar 
              dataKey="inStock" 
              name="In Stock" 
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.inStock < entry.reorderPoint ? 'var(--color-ff4d4f)' : 'var(--color-52c41a)'} 
                />
              ))}
            </Bar>
            <Bar 
              dataKey="allocated" 
              name="Allocated" 
              fill="var(--color-1890ff)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-info" style={{ marginTop: 10, textAlign: 'center' }}>
        <AntTooltip title="Red bars indicate items below reorder point that need attention">
          <Text type="secondary" style={{ fontSize: 12, cursor: 'help' }}>
            * Red bars indicate items below reorder point
          </Text>
        </AntTooltip>
      </div>
    </Card>
  );
};

export default InventoryChart;