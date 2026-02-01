import React from 'react';
import { Card, Button } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { attendanceData } from '../../data/sampleData';

interface AttendanceChartProps {
  title?: string;
  height?: number;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ 
  title = "Attendance Overview", 
  height = 250 
}) => {
  return (
    <Card 
      title={title} 
      className="chart-card animated-card"
      extra={<Button type="link" size="small">Details</Button>}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={attendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" name="Present" fill="#52c41a" />
          <Bar dataKey="absent" name="Absent" fill="#ff4d4f" />
          <Bar dataKey="leave" name="Leave" fill="#faad14" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default AttendanceChart;