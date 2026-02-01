import React from 'react';
import { Card, Button } from 'antd';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { hiringData } from '../../data/sampleData';

interface HiringChartProps {
  title?: string;
  height?: number;
}

const HiringChart: React.FC<HiringChartProps> = ({ 
  title = "Monthly Hiring Trends", 
  height = 250 
}) => {
  return (
    <Card 
      title={title} 
      className="chart-card animated-card"
      extra={<Button type="link" size="small">Details</Button>}
    >
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={hiringData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="hires" name="Hired" fill="#82ca9d" />
          <Bar yAxisId="left" dataKey="interviews" name="Interviews" fill="#ffc658" />
          <Line yAxisId="right" type="monotone" dataKey="applications" name="Applications" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default HiringChart;