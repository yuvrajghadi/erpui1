import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AttendanceSummaryChartProps {
  data: {
    present: number;
    late: number;
    absent: number;
    halfDay: number;
  };
}

const AttendanceSummaryChart: React.FC<AttendanceSummaryChartProps> = ({ data }) => {
  const chartData = [
    {
      name: 'Present',
      value: data.present,
      color: '#52c41a',
    },
    {
      name: 'Late',
      value: data.late,
      color: '#faad14',
    },
    {
      name: 'Absent',
      value: data.absent,
      color: '#ff4d4f',
    },
    {
      name: 'Half Day',
      value: data.halfDay,
      color: '#1890ff',
    },
  ];

  const COLORS = ['#52c41a', '#faad14', '#ff4d4f', '#1890ff'];
  
  const totalRecords = data.present + data.late + data.absent + data.halfDay;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  // Fallback for when Recharts is not available or when the data is empty
  if (totalRecords === 0) {
    return (
      <div className="chart-fallback">
        <div className="chart-fallback-content">
          <h3>Attendance Summary</h3>
          <p>No attendance data available</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} records`, 'Count']}
            labelFormatter={(name) => `${name}`}
          />
          <Legend />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-5" fontSize="16" fontWeight="bold">
              {totalRecords}
            </tspan>
            <tspan x="50%" dy="20" fontSize="12">
              Total
            </tspan>
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceSummaryChart;
