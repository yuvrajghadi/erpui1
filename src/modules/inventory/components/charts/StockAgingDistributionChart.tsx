import React, { useMemo } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

import { calculateAgingDays } from '../../utils';

const { Title, Text } = Typography;

// Define the buckets we want to show in order
const BUCKETS = ['0-30', '31-60', '61-90', '91-180', '180+'];
const COLORS = ['var(--color-52c41a)', 'var(--color-1890ff)', 'var(--color-faad14)', 'var(--color-f5222d)', 'var(--color-722ed1)'];

interface StockItem {
  id: string;
  name: string;
  qty: number;
  rate: number; // per unit
  lastMovementDate: string; // ISO date
}

const sampleStock: StockItem[] = [
  { id: 's1', name: 'Cotton - White', qty: 1200, rate: 45, lastMovementDate: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString() },
  { id: 's2', name: 'Denim - Indigo', qty: 350, rate: 75, lastMovementDate: new Date(Date.now() - 35 * 24 * 3600 * 1000).toISOString() },
  { id: 's3', name: 'Polyester - Grey', qty: 800, rate: 30, lastMovementDate: new Date(Date.now() - 50 * 24 * 3600 * 1000).toISOString() },
  { id: 's4', name: 'Silk - Red', qty: 180, rate: 220, lastMovementDate: new Date(Date.now() - 95 * 24 * 3600 * 1000).toISOString() },
  { id: 's5', name: 'Linen - Natural', qty: 420, rate: 60, lastMovementDate: new Date(Date.now() - 160 * 24 * 3600 * 1000).toISOString() },
  { id: 's6', name: 'Viscose - Black', qty: 230, rate: 50, lastMovementDate: new Date(Date.now() - 200 * 24 * 3600 * 1000).toISOString() },
  { id: 's7', name: 'Wool - Grey', qty: 95, rate: 310, lastMovementDate: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString() },
  { id: 's8', name: 'Canvas - Natural', qty: 560, rate: 85, lastMovementDate: new Date(Date.now() - 74 * 24 * 3600 * 1000).toISOString() },
];

const getBucketForDays = (days: number) => {
  if (days <= 30) return '0-30';
  if (days <= 60) return '31-60';
  if (days <= 90) return '61-90';
  if (days <= 180) return '91-180';
  return '180+';
};

const formatValue = (value: number) => {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
};

const StockAgingDistributionChart: React.FC = () => {
  const { barData, pieData, totalCount, totalValue } = useMemo(() => {
    const buckets: Record<string, { count: number; value: number }> = {};
    BUCKETS.forEach((b) => (buckets[b] = { count: 0, value: 0 }));

    sampleStock.forEach((s) => {
      const days = calculateAgingDays(s.lastMovementDate);
      const bucket = getBucketForDays(days);
      buckets[bucket].count += s.qty;
      buckets[bucket].value += s.qty * s.rate;
    });

    const barData = BUCKETS.map((b) => ({ name: b, count: buckets[b].count }));
    const pieData = BUCKETS.map((b, i) => ({ name: b, value: Math.round(buckets[b].value), fill: COLORS[i % COLORS.length] }));

    const totalCount = sampleStock.reduce((s, it) => s + it.qty, 0);
    const totalValue = sampleStock.reduce((s, it) => s + it.qty * it.rate, 0);

    return { barData, pieData, totalCount, totalValue };
  }, []);

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      const bucketName = p.name;
      const bucketValue = pieData.find((d) => d.name === bucketName)?.value ?? 0;
      return (
        <div style={{ padding: 8, background: 'var(--color-ffffff)', border: '1px solid var(--color-eeeeee)' }}>
          <div style={{ fontWeight: 600 }}>{bucketName}</div>
          <div>Quantity: {formatValue(p.count)}</div>
          <div>Value: ₹ {formatValue(bucketValue)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="dashboard-card chart-card stock-aging-chart">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Title level={5} style={{ margin: 0 }}>Stock Aging Distribution</Title>
        <div style={{ textAlign: 'right' }}>
          <Text type="secondary" style={{ display: 'block' }}>Total Qty: <strong>{formatValue(totalCount)}</strong></Text>
          <Text type="secondary">Total Value: <strong>₹ {formatValue(totalValue)}</strong></Text>
        </div>
      </div>

      <Row gutter={16} style={{ alignItems: 'stretch' }}>
        <Col xs={24} md={16} style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" name="Quantity" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Col>

        <Col xs={24} md={8} style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} label>
                {pieData.map((entry, index) => (
                  <Cell key={`pie-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </Card>
  );
};

export default StockAgingDistributionChart;
