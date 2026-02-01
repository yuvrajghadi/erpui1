'use client';

import React from 'react';
import { Layout, theme, Row, Col, Card, Statistic, Typography, Space, Button, Select, Avatar, Progress, Badge } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  BellOutlined,
  RiseOutlined,
  FallOutlined,
  DownOutlined,
  WalletOutlined,
  PercentageOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import CommonTable from '@/components/shared/table/table';
// import AccountsDashboard from './accounts'; // Removed as per new design

const { Content } = Layout;
const { useToken } = theme;
const { Title, Text } = Typography;
const { Option } = Select;

// --- Data for new Charts and Metrics ---

const salesData = [
  { month: 'Jan', sales: 40400 },
  { month: 'Feb', sales: 13800 },
  { month: 'Mar', sales: 41200 },
  { month: 'Apr', sales: 50300 },
  { month: 'May', sales: 47300 },
  { month: 'Jun', sales: 53030 },
  { month: 'Jul', sales: 41200 },
  { month: 'Aug', sales: 77600 },
  { month: 'Sep', sales: 89100 },
  { month: 'Oct', sales: 90000 },
  { month: 'Nov', sales: 97300 },
  { month: 'Dec', sales: 100000 },
];

const annualSalesData = [
  { year: '2021', sales: 550000 },
  { year: '2022', sales: 720000 },
  { year: '2023', sales: 910000 },
];

const profitAndLossData = [
  { month: 'Jan', profit: 5000, loss: 1200 },
  { month: 'Feb', profit: 7000, loss: 2000 },
  { month: 'Mar', profit: 6000, loss: 1500 },
  { month: 'Apr', profit: 9000, loss: 1000 },
  { month: 'May', profit: 8000, loss: 1800 },
  { month: 'Jun', profit: 11000, loss: 500 },
];

const workOverviewData = [
  { status: 'Completed', tasks: 120 },
  { status: 'In Progress', tasks: 50 },
  { status: 'Pending', tasks: 30 },
  { status: 'Overdue', tasks: 15 },
];

const userStatusData = [
  { name: 'Active Users', value: 750 },
  { name: 'Inactive Users', value: 250 },
];

const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3']; // More vibrant and distinct colors
const PIE_COLORS = ['#42A5F5', '#EF5350']; // Colors for Active/Inactive users

const currentBalance = 125300.75;

const uniqueVisitorsData = [
  { month: 'Jan', direct: 120, organic: 80 },
  { month: 'Feb', direct: 60, organic: 85 },
  { month: 'Mar', direct: 100, organic: 110 },
  { month: 'Apr', direct: 105, organic: 90 },
  { month: 'May', direct: 68, organic: 120 },
  { month: 'Jun', direct: 130, organic: 100 },
  { month: 'Jul', direct: 75, organic: 90 },
  { month: 'Aug', direct: 115, organic: 125 },
  { month: 'Sep', direct: 90, organic: 100 },
  { month: 'Oct', direct: 68, organic: 130 },
  { month: 'Nov', direct: 105, organic: 120 },
  { month: 'Dec', direct: 70, organic: 65 },
];

const salesByCategoryData = [
  { name: 'Food', value: 1200 },
  { name: 'Electronics', value: 800 },
  { name: 'Others', value: 540 },
];
const PIE_CHART_COLORS = ['#4285F4', '#FBBC05', '#EA4335']; // Google brand colors

const dailySalesData = [
  { day: 'Mon', sales: 60 },
  { day: 'Tue', sales: 90 },
  { day: 'Wed', sales: 40 },
  { day: 'Thu', sales: 100 },
  { day: 'Fri', sales: 70 },
  { day: 'Sat', sales: 110 },
  { day: 'Sun', sales: 80 },
];

const welcomeUsers = [
  { name: 'John', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Andrew', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
  { name: 'Darwin', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
  { name: 'Cristian', avatar: 'https://randomuser.me/api/portraits/men/50.jpg' },
];

interface StatCardProps {
  title: string;
  value: string;
  percentage?: {
    value: string;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, percentage, icon, iconBgColor, iconColor }) => (
  <Card variant="outlined" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space style={{ justifyContent: 'space-between', width: '100%', alignItems: 'flex-start' }}>
        <Text type="secondary" style={{ fontSize: 13 }}>{title}</Text>
        {percentage && (
          <Space size={4} style={{ fontSize: 12, alignItems: 'center' }}>
            {percentage.type === 'increase' ? (
              <RiseOutlined style={{ color: '#52c41a' }} />
            ) : (
              <FallOutlined style={{ color: '#ff4d4f' }} />
            )}
            <Text style={{ color: percentage.type === 'increase' ? '#52c41a' : '#ff4d4f', fontWeight: 'bold' }}>
              {percentage.value}
            </Text>
          </Space>
        )}
      </Space>
      <Statistic value={value} valueStyle={{ fontSize: 24, fontWeight: 'bold' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Button type="link" style={{ padding: 0, height: 'auto', fontSize: 13 }}>View more</Button>
        <div style={{ backgroundColor: iconBgColor, borderRadius: 8, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: iconColor }}>
          {icon}
        </div>
      </div>
    </Space>
  </Card>
);

const AppContent = () => {
  const { token } = useToken();

  const cardStyle = {
    borderRadius: token.borderRadiusLG * 1.5,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '16px',
    transition: 'all 0.3s ease-in-out',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as 'column',
  };

  const cardBodyStyle = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <Content
      style={{
        margin: '0',
        minHeight: 280,
        background: token.colorBgLayout,
        borderRadius: token.borderRadiusLG,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Top Row of Dashboard - Overview and Unique Visitors */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Overview</Title>
                <Select 
                  defaultValue="allTime" 
                  variant="borderless" 
                  size="small" 
                  style={{ width: 90 }}
                  suffixIcon={<DownOutlined style={{ fontSize: 12 }} />}
                >
                  <Option value="allTime">All time</Option>
                  <Option value="lastMonth">Last month</Option>
                  <Option value="lastYear">Last year</Option>
                </Select>
              </Space>
            }
            variant="borderless"
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%'
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)', 
                  borderRadius: 12, 
                  padding: '16px', 
                  color: '#fff', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>Customers</Text>
                    <Badge count="8%" style={{ backgroundColor: '#52c41a' }} />
                  </Space>
                  <Statistic value="10,235" valueStyle={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }} />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f0f2f5 0%, #e6e9f0 100%)', 
                  borderRadius: 12, 
                  padding: '16px', 
                  color: '#333', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between' 
                }}>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text style={{ color: '#333', fontSize: 14 }}>Income</Text>
                    <Badge count="15%" style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                  <Statistic value="₹105,212K" valueStyle={{ color: '#333', fontSize: 24, fontWeight: 'bold' }} />
                </div>
              </Col>
            </Row>
            <Title level={5} style={{ marginBottom: 16 }}>Welcome to our new online experience</Title>
            <Space size="large" style={{ width: '100%', justifyContent: 'space-around' }}>
              {welcomeUsers.map((user, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={48} 
                    src={user.avatar}
                    style={{ 
                      border: '2px solid #fff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Text style={{ display: 'block', marginTop: 8, fontSize: 12 }}>{user.name}</Text>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Unique Visitors</Title>
                <Space>
                  <Button type="text" icon={<DownloadOutlined />} size="small" />
                  <Button type="text" icon={<FilterOutlined />} size="small" />
                </Space>
              </Space>
            }
            variant="borderless"
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%'
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={uniqueVisitorsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  wrapperStyle={{ paddingBottom: 16 }}
                />
                <Bar 
                  dataKey="direct" 
                  fill="#4285F4" 
                  barSize={8} 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="organic" 
                  fill="#FBBC05" 
                  barSize={8} 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Middle Row - Charts and Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Total Orders</Title>
                <Button type="text" icon={<ReloadOutlined />} size="small" />
              </Space>
            }
            variant="borderless"
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%'
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ backgroundColor: '#E3F2FD', borderRadius: 8, padding: 8, fontSize: 20, color: '#1890FF' }}>
                <ShoppingCartOutlined />
              </div>
              <Statistic value="3,192" valueStyle={{ fontSize: 28, fontWeight: 'bold' }} />
            </Space>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={salesData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  fill="url(#colorSales)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Sales By Category</Title>
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Space>
            }
            variant="borderless"
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%'
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={salesByCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {salesByCategoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{ paddingTop: 16 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text strong style={{ fontSize: 20 }}>Total 2540</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Title level={4} style={{ margin: 0 }}>Daily Sales</Title>
                <Button type="text" icon={<FilterOutlined />} size="small" />
              </Space>
            }
            variant="borderless"
            style={{ 
              borderRadius: 16, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%'
            }}
            styles={{ body: { padding: '16px' } }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: 'none'
                  }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#4285F4" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Employee Table */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card 
            variant="borderless" 
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <CommonTable />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default AppContent;
