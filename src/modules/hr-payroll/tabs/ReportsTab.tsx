import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  List,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tabs,
  Typography,
  Divider,
  Tag,
  Avatar,
  Progress,
  Badge,
  Table,
  Dropdown,
  Tooltip,
  Menu,
  Statistic,
  Alert
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  EyeOutlined,
  ShareAltOutlined,
  MoreOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  MailOutlined,
  AppstoreOutlined,
  StarOutlined,
  HistoryOutlined,
  PlusOutlined,
  StarFilled
} from '@ant-design/icons';
import dayjs from 'dayjs';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Report categories data
const reportCategories = [
  {
    key: 'employee',
    title: 'Employee Reports',
    icon: <TeamOutlined />,
    reports: [
      { 
        id: 'emp-list', 
        title: 'Employee Directory', 
        description: 'Complete list of all employees with contact details',
        type: 'Table',
        lastRun: '2025-06-01',
        frequency: 'On Demand'
      },
      { 
        id: 'emp-demographics', 
        title: 'Employee Demographics', 
        description: 'Age, gender, location distribution of employees',
        type: 'Chart',
        lastRun: '2025-05-15',
        frequency: 'Monthly'
      },
      { 
        id: 'emp-dept', 
        title: 'Department Distribution', 
        description: 'Distribution of employees across departments',
        type: 'Chart',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'emp-turnover', 
        title: 'Employee Turnover', 
        description: 'Employee turnover rates and trends',
        type: 'Chart',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      }
    ]
  },
  {
    key: 'attendance',
    title: 'Attendance Reports',
    icon: <CalendarOutlined />,
    reports: [
      { 
        id: 'att-summary', 
        title: 'Attendance Summary', 
        description: 'Monthly attendance summary by department',
        type: 'Table',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'att-absent', 
        title: 'Absenteeism Report', 
        description: 'Employees with high absence rates',
        type: 'Table',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'att-trend', 
        title: 'Attendance Trends', 
        description: 'Attendance patterns over time',
        type: 'Chart',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      }
    ]
  },
  {
    key: 'leave',
    title: 'Leave Reports',
    icon: <ClockCircleOutlined />,
    reports: [
      { 
        id: 'leave-bal', 
        title: 'Leave Balances', 
        description: 'Current leave balances for all employees',
        type: 'Table',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'leave-usage', 
        title: 'Leave Utilization', 
        description: 'Leave usage patterns by department',
        type: 'Chart',
        lastRun: '2025-05-15',
        frequency: 'Monthly'
      },
      { 
        id: 'leave-analysis', 
        title: 'Leave Analysis', 
        description: 'Analysis of leave types and frequencies',
        type: 'Chart',
        lastRun: '2025-05-15',
        frequency: 'Quarterly'
      }
    ]
  },
  {
    key: 'payroll',
    title: 'Payroll Reports',
    icon: <DollarOutlined />,
    reports: [
      { 
        id: 'pay-summary', 
        title: 'Payroll Summary', 
        description: 'Monthly payroll summary by department',
        type: 'Table',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'pay-tax', 
        title: 'Tax Deduction Report', 
        description: 'Summary of tax deductions',
        type: 'Table',
        lastRun: '2025-05-15',
        frequency: 'Monthly'
      },
      { 
        id: 'pay-comp', 
        title: 'Compensation Analysis', 
        description: 'Salary distribution across departments',
        type: 'Chart',
        lastRun: '2025-04-01',
        frequency: 'Quarterly'
      },
      { 
        id: 'pay-trend', 
        title: 'Salary Trends', 
        description: 'Salary growth trends over time',
        type: 'Chart',
        lastRun: '2025-04-01',
        frequency: 'Quarterly'
      }
    ]
  },
  {
    key: 'recruitment',
    title: 'Recruitment Reports',
    icon: <UserOutlined />,
    reports: [
      { 
        id: 'rec-funnel', 
        title: 'Recruitment Funnel', 
        description: 'Candidate progression through hiring stages',
        type: 'Chart',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'rec-source', 
        title: 'Hiring Sources', 
        description: 'Analysis of effective recruitment channels',
        type: 'Chart',
        lastRun: '2025-06-01',
        frequency: 'Monthly'
      },
      { 
        id: 'rec-time', 
        title: 'Time to Hire', 
        description: 'Average time to fill positions',
        type: 'Chart',
        lastRun: '2025-05-15',
        frequency: 'Monthly'
      }
    ]
  },
  {
    key: 'performance',
    title: 'Performance Reports',
    icon: <BarChartOutlined />,
    reports: [
      { 
        id: 'perf-rating', 
        title: 'Performance Ratings', 
        description: 'Distribution of performance ratings',
        type: 'Chart',
        lastRun: '2025-04-15',
        frequency: 'Quarterly'
      },
      { 
        id: 'perf-review', 
        title: 'Review Completion', 
        description: 'Status of performance review completion',
        type: 'Table',
        lastRun: '2025-04-15',
        frequency: 'Quarterly'
      }
    ]
  }
];

// Sample report data
const sampleReportData = {
  'emp-list': {
    columns: [
      {
        title: 'Employee',
        key: 'employee',
        render: (_: any, record: any) => (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <div>
              <Text strong>{record.name}</Text>
              <div>
                <Text type="secondary">{record.employeeId}</Text>
              </div>
            </div>
          </Space>
        ),
      },
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (text: string) => {
          let color = 'blue';
          if (text === 'IT') color = 'geekblue';
          if (text === 'HR') color = 'purple';
          if (text === 'Finance') color = 'green';
          if (text === 'Marketing') color = 'orange';
          if (text === 'Operations') color = 'cyan';
          
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
      },
      {
        title: 'Join Date',
        dataIndex: 'joinDate',
        key: 'joinDate',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text: string) => {
          let color = text === 'Active' ? 'success' : 'error';
          let icon = text === 'Active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
          
          return <Tag color={color} icon={icon}>{text}</Tag>;
        },
      },
      {
        title: 'Contact',
        dataIndex: 'email',
        key: 'email',
      }
    ],
    data: [
      {
        key: '1',
        name: 'John Doe',
        employeeId: 'EMP001',
        department: 'IT',
        position: 'Senior Developer',
        location: 'Bangalore',
        joinDate: '2022-01-15',
        status: 'Active',
        email: 'john.doe@example.com'
      },
      {
        key: '2',
        name: 'Jane Smith',
        employeeId: 'EMP002',
        department: 'HR',
        position: 'HR Manager',
        location: 'Mumbai',
        joinDate: '2021-06-01',
        status: 'Active',
        email: 'jane.smith@example.com'
      },
      {
        key: '3',
        name: 'Mike Johnson',
        employeeId: 'EMP003',
        department: 'Finance',
        position: 'Financial Analyst',
        location: 'Delhi',
        joinDate: '2022-03-10',
        status: 'Active',
        email: 'mike.johnson@example.com'
      }
    ]
  },
  'att-summary': {
    columns: [
      {
        title: 'Department',
        dataIndex: 'department',
        key: 'department',
        render: (text: string) => {
          let color = 'blue';
          if (text === 'IT') color = 'geekblue';
          if (text === 'HR') color = 'purple';
          if (text === 'Finance') color = 'green';
          if (text === 'Marketing') color = 'orange';
          if (text === 'Operations') color = 'cyan';
          
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: 'Total Employees',
        dataIndex: 'totalEmployees',
        key: 'totalEmployees',
      },
      {
        title: 'Present',
        dataIndex: 'present',
        key: 'present',
        render: (text: number, record: any) => {
          const percentage = (text / record.totalEmployees) * 100;
          return (
            <div>
              <Progress 
                percent={percentage} 
                size="small" 
                format={() => `${text} (${percentage.toFixed(1)}%)`}
                status="success"
              />
            </div>
          );
        },
      },
      {
        title: 'Absent',
        dataIndex: 'absent',
        key: 'absent',
        render: (text: number, record: any) => {
          const percentage = (text / record.totalEmployees) * 100;
          return (
            <div>
              <Progress 
                percent={percentage} 
                size="small" 
                format={() => `${text} (${percentage.toFixed(1)}%)`}
                status="exception"
              />
            </div>
          );
        },
      },
      {
        title: 'Late',
        dataIndex: 'late',
        key: 'late',
        render: (text: number, record: any) => {
          const percentage = (text / record.totalEmployees) * 100;
          return (
            <div>
              <Progress 
                percent={percentage} 
                size="small" 
                format={() => `${text} (${percentage.toFixed(1)}%)`}
                status="active"
                strokeColor="#faad14"
              />
            </div>
          );
        },
      },
      {
        title: 'On Leave',
        dataIndex: 'onLeave',
        key: 'onLeave',
        render: (text: number, record: any) => {
          const percentage = (text / record.totalEmployees) * 100;
          return (
            <div>
              <Progress 
                percent={percentage} 
                size="small" 
                format={() => `${text} (${percentage.toFixed(1)}%)`}
                status="active"
                strokeColor="#722ed1"
              />
            </div>
          );
        },
      }
    ],
    data: [
      {
        key: '1',
        department: 'IT',
        totalEmployees: 45,
        present: 38,
        absent: 2,
        late: 3,
        onLeave: 2
      },
      {
        key: '2',
        department: 'HR',
        totalEmployees: 15,
        present: 13,
        absent: 0,
        late: 1,
        onLeave: 1
      },
      {
        key: '3',
        department: 'Finance',
        totalEmployees: 20,
        present: 17,
        absent: 1,
        late: 0,
        onLeave: 2
      },
      {
        key: '4',
        department: 'Marketing',
        totalEmployees: 25,
        present: 20,
        absent: 2,
        late: 2,
        onLeave: 1
      },
      {
        key: '5',
        department: 'Operations',
        totalEmployees: 30,
        present: 25,
        absent: 1,
        late: 2,
        onLeave: 2
      }
    ]
  }
};

// Favorite reports data
const favoriteReports = [
  { 
    id: 'emp-list', 
    title: 'Employee Directory', 
    category: 'Employee Reports',
    lastRun: '2025-06-01'
  },
  { 
    id: 'att-summary', 
    title: 'Attendance Summary', 
    category: 'Attendance Reports',
    lastRun: '2025-06-01'
  },
  { 
    id: 'pay-summary', 
    title: 'Payroll Summary', 
    category: 'Payroll Reports',
    lastRun: '2025-06-01'
  }
];

// Recent reports data
const recentReports = [
  { 
    id: 'emp-list', 
    title: 'Employee Directory', 
    category: 'Employee Reports',
    runDate: '2025-06-01 09:15 AM',
    runBy: 'Jane Smith'
  },
  { 
    id: 'att-summary', 
    title: 'Attendance Summary', 
    category: 'Attendance Reports',
    runDate: '2025-06-01 09:00 AM',
    runBy: 'Jane Smith'
  },
  { 
    id: 'leave-bal', 
    title: 'Leave Balances', 
    category: 'Leave Reports',
    runDate: '2025-05-31 05:30 PM',
    runBy: 'Mike Johnson'
  },
  { 
    id: 'pay-summary', 
    title: 'Payroll Summary', 
    category: 'Payroll Reports',
    runDate: '2025-05-31 04:45 PM',
    runBy: 'Jane Smith'
  },
  { 
    id: 'rec-funnel', 
    title: 'Recruitment Funnel', 
    category: 'Recruitment Reports',
    runDate: '2025-05-30 11:20 AM',
    runBy: 'John Doe'
  }
];

interface ReportsTabProps {
  showDrawer: (type: string) => void;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ showDrawer }) => {
  // State
  const [activeTabKey, setActiveTabKey] = useState('reports');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<any>([dayjs().subtract(30, 'days'), dayjs()]);

  // Export menu items
  const exportMenuItems = [
    { key: 'excel', label: 'Export to Excel', icon: <FileExcelOutlined /> },
    { key: 'pdf', label: 'Export to PDF', icon: <FilePdfOutlined /> },
    { key: 'print', label: 'Print Report', icon: <PrinterOutlined /> },
    { type: 'divider' as const, key: 'divider-1' },
    { key: 'email', label: 'Email Report', icon: <MailOutlined /> },
    { key: 'schedule', label: 'Schedule Report', icon: <CalendarOutlined /> }
  ];

  // Filter reports based on search and category
  const getFilteredReports = () => {
    let filteredReports: any[] = [];
    
    reportCategories.forEach(category => {
      if (selectedCategory === 'all' || selectedCategory === category.key) {
        const matchingReports = category.reports.filter(report => 
          report.title.toLowerCase().includes(searchText.toLowerCase()) ||
          report.description.toLowerCase().includes(searchText.toLowerCase())
        );
        
        if (matchingReports.length > 0) {
          filteredReports = [
            ...filteredReports,
            ...matchingReports.map(report => ({
              ...report,
              category: category.title,
              categoryKey: category.key
            }))
          ];
        }
      }
    });
    
    return filteredReports;
  };

  // Get the selected report data
  const getSelectedReport = () => {
    if (!selectedReportId) return null;
    
    for (const category of reportCategories) {
      const report = category.reports.find(r => r.id === selectedReportId);
      if (report) {
        return {
          ...report,
          category: category.title,
          categoryKey: category.key,
          data: sampleReportData[selectedReportId as keyof typeof sampleReportData]
        };
      }
    }
    
    return null;
  };

  const selectedReport = getSelectedReport();

  return (
    <div className="reports-tab">
      <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} items={[
        {
          key: "dashboard",
          label: "Reports Dashboard",
          children: (
            <div>
          {/* Stats Row */}
          <Row gutter={[16, 16]} className="stats-row">
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Available Reports" 
                  value={reportCategories.reduce((sum, category) => sum + category.reports.length, 0)} 
                  prefix={<FileTextOutlined />} 
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Reports Generated" 
                  value={28} 
                  prefix={<BarChartOutlined />} 
                  valueStyle={{ color: '#52c41a' }}
                  suffix={<span className="stat-trend"><RiseOutlined /> 12%</span>}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Scheduled Reports" 
                  value={15} 
                  prefix={<CalendarOutlined />} 
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card className="stat-card">
                <Statistic 
                  title="Report Categories" 
                  value={reportCategories.length} 
                  prefix={<AppstoreOutlined />} 
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Quick Access & Recent Reports */}
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24} md={12}>
              <Card 
                title={<><StarOutlined /> Favorite Reports</>} 
                extra={<Button type="link" size="small">View All</Button>}
                className="dashboard-card"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={favoriteReports}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          key="reports"
                          type="link" 
                          size="small" 
                          onClick={() => {
                            setSelectedReportId(item.id);
                            setActiveTabKey('reports');
                          }}
                        >
                          View
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                        title={item.title}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{item.category}</Text>
                            <Text type="secondary">Last run: {item.lastRun}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card 
                title={<><HistoryOutlined /> Recent Reports</>} 
                extra={<Button type="link" size="small">View All</Button>}
                className="dashboard-card"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={recentReports}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          key="recent-reports"
                          type="link" 
                          size="small" 
                          onClick={() => {
                            setSelectedReportId(item.id);
                            setActiveTabKey('reports');
                          }}
                        >
                          View
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<FileTextOutlined />} style={{ backgroundColor: '#52c41a' }} />}
                        title={item.title}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{item.category}</Text>
                            <Text type="secondary">Run by {item.runBy} on {item.runDate}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* Report Categories */}
          <Card 
            title="Report Categories" 
            className="categories-card"
            style={{ marginTop: '16px' }}
          >
            <Row gutter={[16, 16]}>
              {reportCategories.map(category => (
                <Col xs={24} sm={12} md={8} key={category.key}>
                  <Card 
                    className="category-card" 
                    hoverable
                    onClick={() => {
                      setSelectedCategory(category.key);
                      setActiveTabKey('reports');
                    }}
                  >
                    <div className="category-icon">
                      <Avatar size={48} icon={category.icon} style={{ backgroundColor: 
                        category.key === 'employee' ? '#1890ff' :
                        category.key === 'attendance' ? '#52c41a' :
                        category.key === 'leave' ? '#faad14' :
                        category.key === 'payroll' ? '#722ed1' :
                        category.key === 'recruitment' ? '#eb2f96' :
                        '#fa541c'
                      }} />
                    </div>
                    <div className="category-details">
                      <Title level={5}>{category.title}</Title>
                      <Text type="secondary">{category.reports.length} reports available</Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
            </div>
          ),
        },
        {
          key: "reports",
          label: "Reports",
          children: (
            <div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={6} lg={5} className="sidebar-col">
              <Card className="reports-sidebar">
                <div className="sidebar-search">
                  <Input 
                    placeholder="Search reports..." 
                    prefix={<SearchOutlined />} 
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                  />
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div className="category-filter">
                  <Text strong>Categories</Text>
                  <div className="category-list">
                    <div 
                      className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedCategory('all')}
                    >
                      <div className="category-name">All Reports</div>
                      <div className="category-count">{reportCategories.reduce((sum, category) => sum + category.reports.length, 0)}</div>
                    </div>
                    {reportCategories.map(category => (
                      <div 
                        key={category.key}
                        className={`category-item ${selectedCategory === category.key ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.key)}
                      >
                        <div className="category-name">
                          {category.icon} {category.title}
                        </div>
                        <div className="category-count">{category.reports.length}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div className="report-actions">
                  <Button 
                    type="primary" 
                    block 
                    icon={<PlusOutlined />}
                    onClick={() => showDrawer('custom-report')}
                  >
                    Create Custom Report
                  </Button>
                  <Button 
                    style={{ marginTop: '8px' }} 
                    block 
                    icon={<CalendarOutlined />}
                    onClick={() => showDrawer('schedule-report')}
                  >
                    Scheduled Reports
                  </Button>
                </div>
              </Card>
            </Col>
            
            <Col xs={24} sm={24} md={18} lg={19} className="content-col">
              {selectedReport ? (
                <Card
                  title={
                    <div className="report-header">
                      <div className="report-title">
                        <Title level={4}>{selectedReport.title}</Title>
                        <Text type="secondary">{selectedReport.category}</Text>
                      </div>
                      <div className="report-actions">
                        <Space>
                          <RangePicker 
                            value={dateRange}
                            onChange={value => setDateRange(value)}
                            allowClear={false}
                          />
                          <Button 
                            icon={<ReloadOutlined />}
                            onClick={() => {
                              // Refresh report
                            }}
                          >
                            Refresh
                          </Button>
                          <Dropdown menu={{ items: exportMenuItems }} trigger={['click']}>
                            <Button icon={<DownloadOutlined />}>
                              Export
                            </Button>
                          </Dropdown>
                          <Button icon={<StarFilled />} />
                        </Space>
                      </div>
                    </div>
                  }
                  className="report-card"
                >
                  <div className="report-description">
                    <InfoCircleOutlined /> {selectedReport.description}
                  </div>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div className="report-filters">
                    <Space wrap>
                      <Select defaultValue="all" style={{ width: 150 }}>
                        <Option value="all">All Departments</Option>
                        <Option value="IT">IT Department</Option>
                        <Option value="HR">HR Department</Option>
                        <Option value="Finance">Finance Department</Option>
                        <Option value="Marketing">Marketing Department</Option>
                        <Option value="Operations">Operations Department</Option>
                      </Select>
                      <Select defaultValue="all" style={{ width: 150 }}>
                        <Option value="all">All Locations</Option>
                        <Option value="bangalore">Bangalore</Option>
                        <Option value="mumbai">Mumbai</Option>
                        <Option value="delhi">Delhi</Option>
                        <Option value="hyderabad">Hyderabad</Option>
                      </Select>
                      <Select defaultValue="all" style={{ width: 150 }}>
                        <Option value="all">All Status</Option>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                      </Select>
                      <Button icon={<FilterOutlined />}>Apply Filters</Button>
                    </Space>
                  </div>
                  
                  <div className="report-content" style={{ marginTop: '16px' }}>
                    {selectedReport.data ? (
                      <Table 
                        columns={selectedReport.data.columns} 
                        dataSource={selectedReport.data.data}
                        pagination={{
                          pageSize: 10,
                          showSizeChanger: true,
                          pageSizeOptions: ['10', '20', '50'],
                        }}
                      />
                    ) : (
                      <div className="no-data">
                        <Image src="/assets/img/no-data.svg" alt="No Data" width={240} height={240} className="no-data-img" />
                        <Title level={5}>No data available for this report</Title>
                        <Text type="secondary">Try adjusting your filters or selecting a different date range</Text>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <div className="reports-list">
                  <div className="reports-header">
                    <Title level={4}>
                      {selectedCategory === 'all' ? 'All Reports' : 
                        reportCategories.find(c => c.key === selectedCategory)?.title || 'Reports'}
                    </Title>
                    <Text type="secondary">
                      {getFilteredReports().length} reports available
                    </Text>
                  </div>
                  
                  <Row gutter={[16, 16]}>
                    {getFilteredReports().map(report => (
                      <Col xs={24} sm={12} md={8} key={report.id}>
                        <Card 
                          hoverable
                          className="report-item-card"
                          onClick={() => setSelectedReportId(report.id)}
                        >
                          <div className="report-item">
                            <div className="report-icon">
                              <Avatar 
                                icon={report.type === 'Table' ? <FileTextOutlined /> : <BarChartOutlined />} 
                                style={{ 
                                  backgroundColor: report.type === 'Table' ? '#1890ff' : '#52c41a' 
                                }} 
                              />
                            </div>
                            <div className="report-info">
                              <Title level={5}>{report.title}</Title>
                              <Text type="secondary">{report.description}</Text>
                              <div className="report-meta">
                                <Tag color={
                                  report.categoryKey === 'employee' ? 'blue' :
                                  report.categoryKey === 'attendance' ? 'green' :
                                  report.categoryKey === 'leave' ? 'orange' :
                                  report.categoryKey === 'payroll' ? 'purple' :
                                  report.categoryKey === 'recruitment' ? 'magenta' :
                                  'volcano'
                                }>
                                  {report.category}
                                </Tag>
                                <Text type="secondary">Last run: {report.lastRun}</Text>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Col>
          </Row>
          </div>
        ),
        },
        {
          key: "analytics",
          label: "Analytics",
          children: (
            <div>
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Card title="HR Analytics Dashboard" className="analytics-card">
                <Alert
                  message="Interactive Analytics Dashboard"
                  description="This section would contain interactive analytics dashboards with charts, KPIs, and visualizations for all HR metrics. The dashboard would allow drilling down into specific data points and generating insights from HR data."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card title="Employee Distribution" className="chart-card">
                      <div className="placeholder-chart">
                        <Image
                          src="/assets/img/chart-placeholder.png"
                          alt="Placeholder Chart"
                          width={600}
                          height={320}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Attendance Trends" className="chart-card">
                      <div className="placeholder-chart">
                        <Image
                          src="/assets/img/chart-placeholder.png"
                          alt="Placeholder Chart"
                          width={600}
                          height={320}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Salary Distribution" className="chart-card">
                      <div className="placeholder-chart">
                        <Image
                          src="/assets/img/chart-placeholder.png"
                          alt="Placeholder Chart"
                          width={600}
                          height={320}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="Recruitment Metrics" className="chart-card">
                      <div className="placeholder-chart">
                        <Image
                          src="/assets/img/chart-placeholder.png"
                          alt="Placeholder Chart"
                          width={600}
                          height={320}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          </div>
        ),
        },
      ]}>
      </Tabs>
    </div>
  );
};

export default ReportsTab;
