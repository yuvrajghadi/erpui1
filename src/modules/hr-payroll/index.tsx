'use client';

import React, { useState, useCallback } from 'react';
import ModuleBreadcrumb from '@/components/shared/ModuleBreadcrumb';
import { 
  Tabs, 
  Input, 
  Typography, 
  Row, 
  Col, 
  Dropdown, 
  Button, 
  Space, 
  Badge,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  BellOutlined, 
  SettingOutlined, 
  DownOutlined,
  UserAddOutlined,
  FileAddOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  UserOutlined,
  FormOutlined,
  BarChartOutlined,
  ScheduleOutlined,
  FileDoneOutlined
} from '@ant-design/icons';

// Import tabs
import DashboardTab from './tabs/DashboardTab';
import EmployeeTab from './tabs/EmployeeTab';
import AttendanceTab from './tabs/AttendanceTab';
import LeaveTab from './tabs/LeaveTab';
import PayrollTab from './tabs/PayrollTab';
import RecruitmentTab from './tabs/RecruitmentTab';
import ReportsTab from './tabs/ReportsTab';
import EventsTab from './tabs/EventsTab';

// Import drawer container
import DrawerContainer from './drawers/DrawerContainer';

// Import styles
import './styles/hr-payroll.scss';

const { Title } = Typography;

const HRPayrollDashboard: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State for search text
  const [searchText, setSearchText] = useState('');
  
  // State for filter visibility
  const [filterVisible, setFilterVisible] = useState(false);
  
  // State for drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<string>('');
  
  // Notification count
  const notificationCount = 5;

  // Function to show drawer - using useCallback to prevent unnecessary re-renders
  const showDrawer = useCallback((type: string) => {
    setDrawerType(type);
    setDrawerVisible(true);
  }, []);

  // Function to close drawer
  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  // Department filter dropdown
  const departmentFilter = {
    items: [
      { key: 'all', label: 'All Departments' },
      { key: 'it', label: 'IT Department' },
      { key: 'hr', label: 'HR Department' },
      { key: 'finance', label: 'Finance Department' },
      { key: 'marketing', label: 'Marketing Department' },
      { key: 'operations', label: 'Operations Department' },
      { key: 'sales', label: 'Sales Department' },
      { key: 'support', label: 'Support Department' },
    ]
  };

  // Quick actions menu
  const actionsMenu = {
    items: [
      { key: 'employee', icon: <UserAddOutlined />, label: 'Add Employee' },
      { key: 'leave', icon: <CalendarOutlined />, label: 'Create Leave Request' },
      { key: 'attendance', icon: <ClockCircleOutlined />, label: 'Mark Attendance' },
      { key: 'job', icon: <FileAddOutlined />, label: 'Post Job Opening' },
      { key: 'event', icon: <ScheduleOutlined />, label: 'Schedule Event' },
      { key: 'payroll', icon: <FileDoneOutlined />, label: 'Process Payroll' },
    ],
    onClick: ({ key }: { key: string }) => {
      switch (key) {
        case '1':
          showDrawer('employee');
          break;
        case '2':
          showDrawer('leave');
          break;
        case '3':
          showDrawer('job');
          break;
        case '4':
          showDrawer('event');
          break;
        case '5':
          showDrawer('payroll');
          break;
        default:
          break;
      }
    }
  };

  const items = [
    {
      key: 'dashboard',
      label: (
        <span>
          <DashboardOutlined /> Dashboard Overview
        </span>
      ),
      children: <DashboardTab showDrawer={showDrawer} />
    },
    {
      key: 'employees',
      label: (
        <span>
          <TeamOutlined /> Employee Management
        </span>
      ),
      children: <EmployeeTab showDrawer={showDrawer} />
    },
    {
      key: 'attendance',
      label: (
        <span>
          <ClockCircleOutlined /> Attendance
        </span>
      ),
      children: <AttendanceTab showDrawer={showDrawer} />
    },
    {
      key: 'leave',
      label: (
        <span>
          <CalendarOutlined /> Leave Management
        </span>
      ),
      children: <LeaveTab showDrawer={showDrawer} />
    },
    {
      key: 'payroll',
      label: (
        <span>
          <FileDoneOutlined /> Payroll
        </span>
      ),
      children: <PayrollTab showDrawer={showDrawer} />
    },
    {
      key: 'recruitment',
      label: (
        <span>
          <UserOutlined /> Recruitment
        </span>
      ),
      children: <RecruitmentTab showDrawer={showDrawer} />
    },
    {
      key: 'events',
      label: (
        <span>
          <ScheduleOutlined /> Events
        </span>
      ),
      children: <EventsTab showDrawer={showDrawer} />
    },
    {
      key: 'reports',
      label: (
        <span>
          <BarChartOutlined /> Reports
        </span>
      ),
      children: <ReportsTab showDrawer={showDrawer} />
    }
  ];

  return (
    <div className="hr-payroll-dashboard">
      <ModuleBreadcrumb items={[{ title: 'HR & Payroll', icon: null }]} />
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={8}>
            <Title level={3} className="dashboard-title">
              <span className="title-highlight"></span>
              HR & Payroll Management
            </Title>
          </Col>
          <Col xs={24} md={16}>
            <Row justify="end" gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8} lg={9}>
                <Input 
                  placeholder="Search employees, leave requests..." 
                  prefix={<SearchOutlined />} 
                  className="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col>
                <Space size="middle">
                  <Dropdown menu={departmentFilter} trigger={['click']} onOpenChange={setFilterVisible}>
                    <Tooltip title="Filter by department">
                      <Button icon={<FilterOutlined />} className={filterVisible ? "active-filter" : ""}>
                        Filter <DownOutlined />
                      </Button>
                    </Tooltip>
                  </Dropdown>
                  <Dropdown menu={actionsMenu} trigger={['click']}>
                    <Button type="primary">
                      Quick Actions <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Tooltip title="Notifications">
                    <Badge count={notificationCount} size="small">
                      <Button icon={<BellOutlined />} className="icon-button" />
                    </Badge>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <Button icon={<SettingOutlined />} className="icon-button" />
                  </Tooltip>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          className="custom-tabs"
          destroyInactiveTabPane
          tabBarGutter={6}
          size="large"
          items={items}
        />
      </div>

      {/* Drawer Container - Used for all forms and detail views */}
      <DrawerContainer 
        drawerVisible={drawerVisible}
        drawerType={drawerType}
        closeDrawer={closeDrawer}
      />
    </div>
  );
};

export default HRPayrollDashboard;