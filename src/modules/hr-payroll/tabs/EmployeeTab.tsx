import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  Avatar,
  Tooltip,
  Segmented,
  Statistic,
  Badge,
  Dropdown,
  Divider,
  Menu
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  TeamOutlined,
  BarsOutlined,
  AppstoreOutlined,
  UserSwitchOutlined,
  SolutionOutlined,
  TrophyOutlined
} from '@ant-design/icons';

// Components
import StatisticCard from '../components/StatisticCard';

// Data
import { getEmployeeColumns } from '../data/tableColumns';
import { employeeData } from '../data/sampleData';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// Extended employee data
const extendedEmployeeData = [
  ...employeeData,
  {
    key: '4',
    name: 'Rahul Sharma',
    department: 'Marketing',
    position: 'Marketing Manager',
    status: 'Active',
    salary: '₹95,000',
    joinDate: '2021-09-15',
    attendance: 97,
    performance: 93,
    avatar: null
  },
  {
    key: '5',
    name: 'Priya Patel',
    department: 'IT',
    position: 'UX Designer',
    status: 'Active',
    salary: '₹80,000',
    joinDate: '2022-02-10',
    attendance: 94,
    performance: 91,
    avatar: null
  },
  {
    key: '6',
    name: 'Amit Kumar',
    department: 'Finance',
    position: 'Senior Accountant',
    status: 'Active',
    salary: '₹88,000',
    joinDate: '2021-11-05',
    attendance: 96,
    performance: 90,
    avatar: null
  },
  {
    key: '7',
    name: 'Sneha Reddy',
    department: 'HR',
    position: 'Recruiter',
    status: 'Active',
    salary: '₹76,000',
    joinDate: '2022-04-20',
    attendance: 92,
    performance: 88,
    avatar: null
  },
  {
    key: '8',
    name: 'Vikram Singh',
    department: 'Operations',
    position: 'Operations Manager',
    status: 'Active',
    salary: '₹92,000',
    joinDate: '2021-08-12',
    attendance: 98,
    performance: 94,
    avatar: null
  },
  {
    key: '9',
    name: 'Deepa Joshi',
    department: 'IT',
    position: 'QA Engineer',
    status: 'Active',
    salary: '₹78,000',
    joinDate: '2022-01-18',
    attendance: 91,
    performance: 87,
    avatar: null
  },
  {
    key: '10',
    name: 'Raj Malhotra',
    department: 'Marketing',
    position: 'Content Specialist',
    status: 'Inactive',
    salary: '₹72,000',
    joinDate: '2021-07-14',
    attendance: 75,
    performance: 70,
    avatar: null
  }
].map(employee => ({
  ...employee,
  // Convert all salary fields to Indian Rupees format if they aren't already
  salary: employee.salary.startsWith('₹') ? employee.salary : employee.salary.replace('$', '₹')
}));

// Department distribution data
const departmentDistribution = [
  { name: 'IT', count: 3 },
  { name: 'HR', count: 2 },
  { name: 'Finance', count: 2 },
  { name: 'Marketing', count: 2 },
  { name: 'Operations', count: 1 }
];

interface EmployeeTabProps {
  showDrawer: (type: string) => void;
}

const EmployeeTab: React.FC<EmployeeTabProps> = ({ showDrawer }) => {
  // State
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<string | number>('table');
  const [activeTabKey, setActiveTabKey] = useState('all');

  // Get table columns with drawer function
  const columns = getEmployeeColumns(showDrawer);

  // Filter employees based on search and filters
  const filteredEmployees = extendedEmployeeData.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    const matchesTab = activeTabKey === 'all' || 
      (activeTabKey === 'active' && employee.status === 'Active') ||
      (activeTabKey === 'inactive' && employee.status === 'Inactive') ||
      (activeTabKey === 'highPerformers' && employee.performance >= 90);
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesTab;
  });

  // More options menu items
  const moreMenuItems = [
    { key: 'print', label: 'Print List' },
    { key: 'export-pdf', label: 'Export as PDF' },
    { key: 'export-csv', label: 'Export as CSV' },
    { key: 'import', label: 'Import Employees' },
    { type: 'divider' as const, key: 'divider-1' },
    { key: 'bulk-edit', label: 'Bulk Edit' },
    { key: 'bulk-delete', label: 'Bulk Delete', danger: true }
  ];

  return (
    <div className="employee-tab">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Total Employees"
            value={extendedEmployeeData.length}
            icon={<TeamOutlined />}
            color="#1890ff"
            change={3.1}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Active Employees"
            value={extendedEmployeeData.filter(e => e.status === 'Active').length}
            icon={<UserOutlined />}
            color="#52c41a"
            change={4.5}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Avg. Performance"
            value={Math.round(extendedEmployeeData.reduce((sum, e) => sum + e.performance, 0) / extendedEmployeeData.length)}
            icon={<TrophyOutlined />}
            color="#faad14"
            suffix="%"
            change={2.3}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Avg. Salary"
            value={"₹82,600"}
            icon={<SolutionOutlined />}
            color="#722ed1"
            change={5.2}
            changeText="from last month"
          />
        </Col>
      </Row>

      {/* Tab and Controls Row */}
      <Card className="controls-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Tabs 
              activeKey={activeTabKey} 
              onChange={setActiveTabKey}
              className="employee-tabs"
            >
              <TabPane tab="All Employees" key="all" />
              <TabPane tab="Active" key="active" />
              <TabPane tab="Inactive" key="inactive" />
              <TabPane tab="High Performers" key="highPerformers" />
            </Tabs>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space wrap style={{ float: 'right' }}>
              <Segmented
                options={[
                  { value: 'table', icon: <BarsOutlined /> },
                  { value: 'grid', icon: <AppstoreOutlined /> },
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showDrawer('employee')}
              >
                Add Employee
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ margin: '16px 0' }} />
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space wrap>
              <Input
                placeholder="Search employees..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Select
                placeholder="Department"
                style={{ width: 150 }}
                value={selectedDepartment}
                onChange={setSelectedDepartment}
              >
                <Option value="all">All Departments</Option>
                <Option value="IT">IT</Option>
                <Option value="HR">HR</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Operations">Operations</Option>
              </Select>
              <Select
                placeholder="Status"
                style={{ width: 130 }}
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="all">All Status</Option>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Space wrap style={{ float: 'right' }}>
              <Button icon={<UploadOutlined />}>Import</Button>
              <Button icon={<FileExcelOutlined />}>Export</Button>
              <Dropdown menu={{ items: moreMenuItems }} trigger={['click']}>
                <Button icon={<MoreOutlined />}>More</Button>
              </Dropdown>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Employee Content */}
      <div className="employee-content">
        {viewMode === 'table' ? (
          <Card className="employee-table-card" styles={{ body: { padding: 0 } }}>
            <Table 
              columns={columns} 
              dataSource={filteredEmployees}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`
              }}
              scroll={{ x: 1200 }}
              size="middle"
              className="employee-table"
            />
          </Card>
        ) : (
          <div className="employee-grid">
            <Row gutter={[16, 16]}>
              {filteredEmployees.map(employee => (
                <Col xs={24} sm={12} md={8} lg={6} key={employee.key}>
                  <Card 
                    className="employee-card" 
                    hoverable
                    actions={[
                      <Tooltip title="View Details" key="view">
                        <EyeOutlined onClick={() => showDrawer('employee-view')} />
                      </Tooltip>,
                      <Tooltip title="Edit" key="edit">
                        <EditOutlined onClick={() => showDrawer('employee')} />
                      </Tooltip>,
                      <Tooltip title="Performance" key="performance">
                        <TrophyOutlined onClick={() => showDrawer('employee-performance')} />
                      </Tooltip>,
                      <Tooltip title="Switch Role" key="switch">
                        <UserSwitchOutlined onClick={() => showDrawer('employee-role')} />
                      </Tooltip>
                    ]}
                  >
                    <div className="employee-card-content">
                      <div className="employee-card-avatar">
                        <Avatar size={64} icon={<UserOutlined />} />
                        <Badge
                          status={employee.status === 'Active' ? 'success' : 'error'}
                          className="employee-status-badge"
                        />
                      </div>
                      <div className="employee-card-info">
                        <Title level={5} className="employee-name">{employee.name}</Title>
                        <Text type="secondary">{employee.position}</Text>
                        <Tag color={
                          employee.department === 'IT' ? 'geekblue' :
                          employee.department === 'HR' ? 'purple' :
                          employee.department === 'Finance' ? 'green' :
                          employee.department === 'Marketing' ? 'orange' :
                          'cyan'
                        } className="department-tag">
                          {employee.department}
                        </Tag>
                        <div className="employee-card-details">
                          <div className="detail-item">
                            <Text type="secondary">Joined:</Text>
                            <Text>{employee.joinDate}</Text>
                          </div>
                          <div className="detail-item">
                            <Text type="secondary">Salary:</Text>
                            <Text>{employee.salary}</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>

      {/* Department Distribution Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col xs={24}>
          <Card title="Department Distribution" className="animated-card">
            <Row gutter={[16, 16]}>
              {departmentDistribution.map(dept => (
                <Col xs={24} sm={12} md={4} key={dept.name}>
                  <Card className="department-stat-card">
                    <Statistic 
                      title={dept.name} 
                      value={dept.count} 
                      suffix={`/${extendedEmployeeData.length}`}
                      valueStyle={{ color: 
                        dept.name === 'IT' ? '#1890ff' :
                        dept.name === 'HR' ? '#722ed1' :
                        dept.name === 'Finance' ? '#52c41a' :
                        dept.name === 'Marketing' ? '#fa8c16' :
                        '#13c2c2'
                      }}
                    />
                    <div className="department-progress">
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${(dept.count / extendedEmployeeData.length) * 100}%`,
                          backgroundColor: 
                            dept.name === 'IT' ? '#1890ff' :
                            dept.name === 'HR' ? '#722ed1' :
                            dept.name === 'Finance' ? '#52c41a' :
                            dept.name === 'Marketing' ? '#fa8c16' :
                            '#13c2c2'
                        }}
                      ></div>
                    </div>
                  </Card>
                </Col>
              ))}
              <Col xs={24} sm={12} md={4}>
                <Card className="department-action-card">
                  <div className="add-department-btn">
                    <Button 
                      type="dashed" 
                      icon={<PlusOutlined />} 
                      onClick={() => showDrawer('department')}
                      block
                    >
                      Add Department
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EmployeeTab;