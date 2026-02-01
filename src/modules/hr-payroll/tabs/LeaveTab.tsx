import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Input,
  DatePicker,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  Avatar,
  Progress,
  Statistic,
  Badge,
  Tooltip,
  Calendar,
  Dropdown,
  List,
  Divider
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  FileExcelOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileAddOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  MoreOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

// Register dayjs plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Components
import StatisticCard from '../components/StatisticCard';

// Data
import { getLeaveColumns } from '../data/tableColumns';
import { leaveRequestsData } from '../data/sampleData';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

// Interface for leave request data
interface BaseLeaveRequest {
  key: string;
  employee: string;
  leaveType: string;
  duration: string;
  status: string;
  avatar: null | string;
}

interface ExtendedLeaveRequest extends BaseLeaveRequest {
  startDate: string;
  endDate: string;
  reason: string;
}

type LeaveRequest = BaseLeaveRequest | ExtendedLeaveRequest;

// Extended leave request data
const extendedLeaveData: LeaveRequest[] = [
  ...leaveRequestsData,
  {
    key: '4',
    employee: 'Rahul Sharma',
    leaveType: 'Sick Leave',
    duration: '3 days',
    startDate: '2025-06-20',
    endDate: '2025-06-22',
    reason: 'Medical appointment',
    status: 'Pending',
    avatar: null
  },
  {
    key: '5',
    employee: 'Priya Patel',
    leaveType: 'Annual Leave',
    duration: '5 days',
    startDate: '2025-06-25',
    endDate: '2025-06-29',
    reason: 'Family vacation',
    status: 'Pending',
    avatar: null
  },
  {
    key: '6',
    employee: 'Amit Kumar',
    leaveType: 'Personal Leave',
    duration: '1 day',
    startDate: '2025-06-18',
    endDate: '2025-06-18',
    reason: 'Personal matters',
    status: 'Approved',
    avatar: null
  },
  {
    key: '7',
    employee: 'Sneha Reddy',
    leaveType: 'Sick Leave',
    duration: '2 days',
    startDate: '2025-06-12',
    endDate: '2025-06-13',
    reason: 'Fever',
    status: 'Approved',
    avatar: null
  },
  {
    key: '8',
    employee: 'Vikram Singh',
    leaveType: 'Annual Leave',
    duration: '10 days',
    startDate: '2025-07-01',
    endDate: '2025-07-10',
    reason: 'Summer vacation',
    status: 'Pending',
    avatar: null
  },
  {
    key: '9',
    employee: 'Deepa Joshi',
    leaveType: 'Unpaid Leave',
    duration: '5 days',
    startDate: '2025-06-22',
    endDate: '2025-06-26',
    reason: 'Family emergency',
    status: 'Rejected',
    avatar: null
  },
  {
    key: '10',
    employee: 'Raj Malhotra',
    leaveType: 'Maternity Leave',
    duration: '90 days',
    startDate: '2025-07-15',
    endDate: '2025-10-12',
    reason: 'Maternity leave',
    status: 'Approved',
    avatar: null
  }
];

// Leave policy data
const leavePolicies = [
  {
    key: '1',
    leaveType: 'Annual Leave',
    days: 24,
    carryForward: 'Yes (max 5 days)',
    encashment: 'Yes',
    eligibility: 'All full-time employees'
  },
  {
    key: '2',
    leaveType: 'Sick Leave',
    days: 12,
    carryForward: 'No',
    encashment: 'No',
    eligibility: 'All employees'
  },
  {
    key: '3',
    leaveType: 'Personal Leave',
    days: 5,
    carryForward: 'No',
    encashment: 'No',
    eligibility: 'After 3 months of service'
  },
  {
    key: '4',
    leaveType: 'Maternity Leave',
    days: 180,
    carryForward: 'No',
    encashment: 'No',
    eligibility: 'Female employees after 1 year of service'
  },
  {
    key: '5',
    leaveType: 'Paternity Leave',
    days: 15,
    carryForward: 'No',
    encashment: 'No',
    eligibility: 'Male employees after 1 year of service'
  }
];

// Employee leave balances
const leaveBalances = [
  {
    key: '1',
    employee: 'John Doe',
    annual: { total: 24, used: 10, remaining: 14 },
    sick: { total: 12, used: 3, remaining: 9 },
    personal: { total: 5, used: 2, remaining: 3 }
  },
  {
    key: '2',
    employee: 'Jane Smith',
    annual: { total: 24, used: 15, remaining: 9 },
    sick: { total: 12, used: 6, remaining: 6 },
    personal: { total: 5, used: 1, remaining: 4 }
  },
  {
    key: '3',
    employee: 'Mike Johnson',
    annual: { total: 24, used: 5, remaining: 19 },
    sick: { total: 12, used: 0, remaining: 12 },
    personal: { total: 5, used: 3, remaining: 2 }
  }
];

interface LeaveTabProps {
  showDrawer: (type: string) => void;
}

const LeaveTab: React.FC<LeaveTabProps> = ({ showDrawer }) => {
  // State
  const [activeTabKey, setActiveTabKey] = useState('requests');
  const [searchText, setSearchText] = useState('');
  const [leaveStatus, setLeaveStatus] = useState('all');
  const [leaveType, setLeaveType] = useState('all');
  const [dateRange, setDateRange] = useState<any>(null);

  // Get leave columns with drawer function
  const leaveColumns = [
    ...getLeaveColumns(showDrawer),
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_: any, record: any) => (
        <span>{record.startDate || 'N/A'} to {record.endDate || 'N/A'}</span>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    }
  ];

  // Leave balance columns
  const balanceColumns = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Annual Leave',
      key: 'annual',
      render: (_: any, record: any) => (
        <div>
          <Progress 
            percent={Math.round((record.annual.used / record.annual.total) * 100)} 
            size="small" 
            format={() => `${record.annual.used}/${record.annual.total}`}
          />
          <div style={{ marginTop: 4 }}>
            <small>Remaining: {record.annual.remaining}</small>
          </div>
        </div>
      ),
    },
    {
      title: 'Sick Leave',
      key: 'sick',
      render: (_: any, record: any) => (
        <div>
          <Progress 
            percent={Math.round((record.sick.used / record.sick.total) * 100)} 
            size="small" 
            format={() => `${record.sick.used}/${record.sick.total}`}
          />
          <div style={{ marginTop: 4 }}>
            <small>Remaining: {record.sick.remaining}</small>
          </div>
        </div>
      ),
    },
    {
      title: 'Personal Leave',
      key: 'personal',
      render: (_: any, record: any) => (
        <div>
          <Progress 
            percent={Math.round((record.personal.used / record.personal.total) * 100)} 
            size="small" 
            format={() => `${record.personal.used}/${record.personal.total}`}
          />
          <div style={{ marginTop: 4 }}>
            <small>Remaining: {record.personal.remaining}</small>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" icon={<FileAddOutlined />} size="small" onClick={() => showDrawer('leave')} />
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  // Leave policy columns
  const policyColumns = [
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Days Allowed',
      dataIndex: 'days',
      key: 'days',
    },
    {
      title: 'Carry Forward',
      dataIndex: 'carryForward',
      key: 'carryForward',
    },
    {
      title: 'Encashment',
      dataIndex: 'encashment',
      key: 'encashment',
    },
    {
      title: 'Eligibility',
      dataIndex: 'eligibility',
      key: 'eligibility',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => showDrawer('leave-policy')} />
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  // Type guard to check if a leave request is an extended one
  const isExtendedLeaveRequest = (leave: LeaveRequest): leave is ExtendedLeaveRequest => {
    return 'startDate' in leave && 'endDate' in leave && 'reason' in leave;
  };

  // Filter leave requests based on search and filters
  const filteredLeaveRequests = extendedLeaveData.filter(request => {
    const matchesSearch = request.employee.toLowerCase().includes(searchText.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchText.toLowerCase()) ||
      (isExtendedLeaveRequest(request) && request.reason.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesStatus = leaveStatus === 'all' || request.status === leaveStatus;
    
    const matchesType = leaveType === 'all' || request.leaveType === leaveType;
    
    // If date range is set, check if the request falls within that range
    const matchesDate = !dateRange || !isExtendedLeaveRequest(request) || (
      (dayjs(request.startDate).isAfter(dayjs(dateRange[0]), 'day') || dayjs(request.startDate).isSame(dayjs(dateRange[0]), 'day')) &&
      (dayjs(request.endDate).isBefore(dayjs(dateRange[1]), 'day') || dayjs(request.endDate).isSame(dayjs(dateRange[1]), 'day'))
    );
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // More actions menu items
  const moreActionItems = [
    { key: 'export-excel', label: 'Export to Excel' },
    { key: 'export-pdf', label: 'Export to PDF' },
    { key: 'print', label: 'Print' },
    { type: 'divider' as const, key: 'divider-1' },
    { key: 'bulk-approve', label: 'Bulk Approve' },
    { key: 'bulk-reject', label: 'Bulk Reject', danger: true }
  ];

  return (
    <div className="leave-management-tab">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Total Leave Requests"
            value={extendedLeaveData.length}
            icon={<FileTextOutlined />}
            color="#1890ff"
            change={8.2}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Pending Approvals"
            value={extendedLeaveData.filter(leave => leave.status === 'Pending').length}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            change={-3.1}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Approved Requests"
            value={extendedLeaveData.filter(leave => leave.status === 'Approved').length}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            change={5.7}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Rejected Requests"
            value={extendedLeaveData.filter(leave => leave.status === 'Rejected').length}
            icon={<CloseCircleOutlined />}
            color="#ff4d4f"
            change={-2.3}
            changeText="from last month"
          />
        </Col>
      </Row>

      {/* Tabs Section */}
      <Card className="leave-card">
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="Leave Requests" key="requests">
            <div className="table-controls">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Space wrap>
                    <Input
                      placeholder="Search employee, leave type..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 220 }}
                      allowClear
                    />
                    <Select
                      placeholder="Leave Status"
                      style={{ width: 140 }}
                      value={leaveStatus}
                      onChange={setLeaveStatus}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="Pending">Pending</Option>
                      <Option value="Approved">Approved</Option>
                      <Option value="Rejected">Rejected</Option>
                    </Select>
                    <Select
                      placeholder="Leave Type"
                      style={{ width: 150 }}
                      value={leaveType}
                      onChange={setLeaveType}
                    >
                      <Option value="all">All Types</Option>
                      <Option value="Annual Leave">Annual Leave</Option>
                      <Option value="Sick Leave">Sick Leave</Option>
                      <Option value="Personal Leave">Personal Leave</Option>
                      <Option value="Maternity Leave">Maternity Leave</Option>
                      <Option value="Unpaid Leave">Unpaid Leave</Option>
                    </Select>
                    <RangePicker
                      onChange={dates => setDateRange(dates)}
                      style={{ width: 220 }}
                    />
                  </Space>
                </Col>
                <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                  <Space wrap style={{ float: 'right' }}>
                    <Button 
                      icon={<PlusOutlined />} 
                      type="primary"
                      onClick={() => showDrawer('leave')}
                    >
                      New Request
                    </Button>
                    <Button icon={<FileExcelOutlined />}>Export</Button>
                    <Dropdown menu={{ items: moreActionItems }} trigger={['click']}>
                      <Button icon={<MoreOutlined />}>More</Button>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={leaveColumns} 
              dataSource={filteredLeaveRequests}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`
              }}
              className="leave-table"
            />
          </TabPane>

          <TabPane tab="Leave Balances" key="balances">
            <div className="table-controls">
              <Row gutter={[16, 16]} justify="space-between">
                <Col>
                  <Input
                    placeholder="Search employee..."
                    prefix={<SearchOutlined />}
                    style={{ width: 220 }}
                    allowClear
                  />
                </Col>
                <Col>
                  <Space>
                    <Button icon={<PlusOutlined />} onClick={() => showDrawer('leave-balance')}>
                      Adjust Balance
                    </Button>
                    <Button icon={<FileExcelOutlined />}>Export</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={balanceColumns} 
              dataSource={leaveBalances}
              pagination={false}
              className="balance-table"
            />
          </TabPane>

          <TabPane tab="Leave Policy" key="policy">
            <div className="table-controls">
              <Row gutter={[16, 16]} justify="space-between">
                <Col>
                  <Title level={5}>Company Leave Policy</Title>
                </Col>
                <Col>
                  <Button 
                    icon={<PlusOutlined />} 
                    type="primary"
                    onClick={() => showDrawer('leave-policy')}
                  >
                    Add Policy
                  </Button>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={policyColumns} 
              dataSource={leavePolicies}
              pagination={false}
              className="policy-table"
            />
          </TabPane>

          <TabPane tab="Leave Calendar" key="calendar">
            <div className="calendar-container">
              <Calendar 
                className="leave-calendar"
                headerRender={({ value, type, onChange, onTypeChange }) => (
                  <Row justify="space-between" align="middle" style={{ padding: '8px 0' }}>
                    <Col>
                      <Title level={5}>{value.format('MMMM YYYY')} - Leave Calendar</Title>
                    </Col>
                    <Col>
                      <Space>
                        <Button size="small" onClick={() => onChange(value.clone().subtract(1, 'month'))}>Previous</Button>
                        <Button size="small" onClick={() => onChange(dayjs())}>Today</Button>
                        <Button size="small" onClick={() => onChange(value.clone().add(1, 'month'))}>Next</Button>
                      </Space>
                    </Col>
                  </Row>
                )}
                dateCellRender={(date) => {
                  const leavesThatDay = extendedLeaveData.filter(
                    leave => isExtendedLeaveRequest(leave) && 
                    date.isSameOrAfter(dayjs(leave.startDate)) && 
                    date.isSameOrBefore(dayjs(leave.endDate))
                  );
                  
                  return leavesThatDay.length > 0 ? (
                    <div className="leave-cell">
                      {leavesThatDay.slice(0, 2).map((leave, index) => (
                        <Tag 
                          key={index}
                          color={
                            leave.status === 'Approved' ? 'success' :
                            leave.status === 'Rejected' ? 'error' :
                            'processing'
                          }
                          className="leave-tag"
                        >
                          {leave.employee.split(' ')[0]}
                        </Tag>
                      ))}
                      {leavesThatDay.length > 2 && (
                        <Tag className="more-tag">+{leavesThatDay.length - 2} more</Tag>
                      )}
                    </div>
                  ) : null;
                }}
              />
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* Additional Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card 
            title="Recent Leave Activity" 
            extra={<Button type="link" size="small">View All</Button>}
            className="animated-card"
          >
            <List
              itemLayout="horizontal"
              dataSource={extendedLeaveData.slice(0, 5)}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.employee}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{item.leaveType} - {item.duration}</Text>
                        <Text type="secondary">
                          Status: <Tag 
                            color={
                              item.status === 'Approved' ? 'success' :
                              item.status === 'Rejected' ? 'error' :
                              'processing'
                            }
                          >
                            {item.status}
                          </Tag>
                        </Text>
                      </Space>
                    }
                  />
                  <div>
                    <Button type="link" size="small" onClick={() => showDrawer('leave-view')}>
                      Details
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Leave Stats" 
            className="animated-card"
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic 
                  title="Avg. Leave Duration" 
                  value={4.3}
                  suffix="days"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Approval Rate" 
                  value={78}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Sick Leave Ratio" 
                  value={42}
                  suffix="%"
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <div className="leave-stats-summary">
              <div>
                <Title level={5}>Most Common Leave Types</Title>
                <div className="leave-type-chart">
                  <div className="chart-bar">
                    <div className="bar-label">Annual Leave</div>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '45%', backgroundColor: '#1890ff' }}></div>
                      <div className="bar-value">45%</div>
                    </div>
                  </div>
                  <div className="chart-bar">
                    <div className="bar-label">Sick Leave</div>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '30%', backgroundColor: '#faad14' }}></div>
                      <div className="bar-value">30%</div>
                    </div>
                  </div>
                  <div className="chart-bar">
                    <div className="bar-label">Personal Leave</div>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '15%', backgroundColor: '#52c41a' }}></div>
                      <div className="bar-value">15%</div>
                    </div>
                  </div>
                  <div className="chart-bar">
                    <div className="bar-label">Others</div>
                    <div className="bar-container">
                      <div className="bar" style={{ width: '10%', backgroundColor: '#722ed1' }}></div>
                      <div className="bar-value">10%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeaveTab;