import React from 'react';
import { Row, Col, Card, Table, List, Space, Button, Avatar, Typography } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  DollarOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';

// Components
import StatisticCard from '../components/StatisticCard';
import QuickActionCard from '../components/QuickActionCard';
import AttendanceChart from '../components/charts/AttendanceChart';
import DepartmentChart from '../components/charts/DepartmentChart';
import SalaryChart from '../components/charts/SalaryChart';
import HiringChart from '../components/charts/HiringChart';

// Data
import { 
  employeeData, 
  recentActivities, 
  leaveRequestsData, 
  jobOpeningsData, 
  upcomingEvents 
} from '../data/sampleData';
import { getEmployeeColumns, getLeaveColumns, getJobColumns } from '../data/tableColumns';

const { Text } = Typography;

interface DashboardTabProps {
  showDrawer: (type: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ showDrawer }) => {
  // Get table columns with drawer function
  const columns = getEmployeeColumns(showDrawer);
  const leaveColumns = getLeaveColumns(showDrawer);
  const jobColumns = getJobColumns(showDrawer);

  return (
    <>
      {/* Statistics Row */}
      <Row gutter={[24, 24]} className="stats-row">
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard 
            title="Total Employees"
            value={employeeData.length}
            icon={<TeamOutlined />}
            color="#1890ff"
            change={5.2}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard 
            title="Open Positions"
            value={8}
            icon={<UserOutlined />}
            color="#52c41a"
            change={12.5}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard 
            title="Leave Requests"
            value={leaveRequestsData.filter(item => item.status === 'Pending').length}
            icon={<CalendarOutlined />}
            color="#faad14"
            change={-8.5}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard 
            title="Payroll Budget"
            value={"₹458,600"}
            icon={<DollarOutlined />}
            color="#722ed1"
            change={3.2}
            changeText="from last month"
          />
        </Col>
      </Row>

      {/* Quick Actions Row */}
      <Row gutter={[24, 24]} className="quick-actions-row">
        <Col xs={24} sm={12} md={8} lg={6}>
          <QuickActionCard 
            title="Add Employee"
            icon={<UserOutlined />}
            color="#1890ff"
            onClick={() => showDrawer('employee')}
            description="Create a new employee record"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <QuickActionCard 
            title="Leave Request"
            icon={<CalendarOutlined />}
            color="#52c41a"
            onClick={() => showDrawer('leave')}
            description="Submit a new leave request"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <QuickActionCard 
            title="Post Job"
            icon={<FileTextOutlined />}
            color="#faad14"
            onClick={() => showDrawer('job')}
            description="Create a new job posting"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <QuickActionCard 
            title="Schedule Event"
            icon={<TeamOutlined />}
            color="#722ed1"
            onClick={() => showDrawer('event')}
            description="Plan a new HR event"
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[24, 24]} className="charts-row">
        <Col xs={24} lg={12}>
          <AttendanceChart />
        </Col>
        <Col xs={24} lg={12}>
          <DepartmentChart />
        </Col>
      </Row>

      {/* More Charts Row */}
      <Row gutter={[24, 24]} className="charts-row">
        <Col xs={24} lg={12}>
          <SalaryChart />
        </Col>
        <Col xs={24} lg={12}>
          <HiringChart />
        </Col>
      </Row>

      {/* Employee Performance Table */}
      <Row gutter={[24, 24]} className="table-row">
        <Col xs={24}>
          <Card 
            title="Employee Performance Overview" 
            className="table-card animated-card" 
            styles={{ body: { padding: 0 } }}
            extra={<Space>
              <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => showDrawer('employee')}>Add Employee</Button>
              <Button icon={<FileTextOutlined />} size="small">Export</Button>
            </Space>}
          >
            <Table 
              columns={columns} 
              dataSource={employeeData} 
              pagination={{ pageSize: 5, showSizeChanger: true, showQuickJumper: true }} 
              scroll={{ x: 1300 }}
              // responsive={'true'}
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      {/* Latest HR Activities and Leave Requests */}
      <Row gutter={[24, 24]} className="activities-row">
        <Col xs={24} lg={12}>
          <Card 
            title="Latest HR Activities" 
            className="animated-card"
            extra={<Button type="link" size="small">View All</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.avatar ? <Avatar src={item.avatar} /> : <Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.user}</Text>}
                    description={
                      <Text type="secondary">
                        {item.action} <Text strong>{item.target}</Text> • {item.time}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Pending Leave Requests" 
            className="animated-card"
            extra={<Button type="link" size="small">View All</Button>}
          >
            <Table 
              columns={leaveColumns} 
              dataSource={leaveRequestsData.filter(item => item.status === 'Pending')} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Job Openings and Upcoming Events */}
      <Row gutter={[24, 24]} className="activities-row">
        <Col xs={24} lg={14}>
          <Card 
            title="Current Job Openings" 
            className="animated-card"
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => showDrawer('job')}>Post New Job</Button>}
          >
            <Table 
              columns={jobColumns} 
              dataSource={jobOpeningsData} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card 
            title="Upcoming HR Events" 
            className="animated-card"
            extra={<Button type="link" size="small" onClick={() => showDrawer('event')}>Add Event</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={upcomingEvents}
              renderItem={item => (
                <List.Item
                  key="details"
                  actions={[<Button key="details" type="link" size="small">Details</Button>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<CalendarOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">Date: {item.date}</Text>
                        <Text type="secondary">Location: {item.location}</Text>
                        <Text type="secondary">Participants: {item.participants}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardTab;