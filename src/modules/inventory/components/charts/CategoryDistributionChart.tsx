import React from 'react';
import { Card, Typography } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { categoryDistributionData } from '../../data/sampleData';

const { Title } = Typography;

interface CategoryDistributionChartProps {
  data?: typeof categoryDistributionData;
}

const COLORS = ['var(--color-1890ff)', 'var(--color-722ed1)', 'var(--color-13c2c2)', 'var(--color-52c41a)', 'var(--color-eb2f96)', 'var(--color-fa8c16)', 'var(--color-faad14)', 'var(--color-a0d911)'];

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data = categoryDistributionData || [],
}) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}`}</p>
          <p className="value">{`${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="custom-legend">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
            <span className="legend-label">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="dashboard-card chart-card">
      <Title level={5}>Category Distribution</Title>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} innerRadius={40} fill="var(--color-8884d8)" dataKey="value">
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              content={renderLegend}
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CategoryDistributionChart;