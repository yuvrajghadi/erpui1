import React from 'react';
import { Card, Button } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { employeeData } from '../../data/sampleData';

interface DepartmentChartProps {
  title?: string;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DepartmentChart: React.FC<DepartmentChartProps> = ({ 
  title = "Department Distribution", 
  height = 250 
}) => {
  return (
    <Card 
      title={title} 
      className="chart-card animated-card"
      extra={<Button type="link" size="small">Details</Button>}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={employeeData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {employeeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DepartmentChart;