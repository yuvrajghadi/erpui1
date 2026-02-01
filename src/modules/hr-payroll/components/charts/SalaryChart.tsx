import React from 'react';
import { Card, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { salaryDistributionData } from '../../data/sampleData';

interface SalaryChartProps {
  title?: string;
  height?: number;
}

const SalaryChart: React.FC<SalaryChartProps> = ({ 
  title = "Salary Distribution", 
  height = 250 
}) => {
  return (
    <Card 
      title={title} 
      className="chart-card animated-card"
      extra={<Button type="link" size="small">Details</Button>}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={salaryDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="range" type="category" width={80} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default SalaryChart;