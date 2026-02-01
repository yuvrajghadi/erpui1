import React, { useState } from 'react';
import type { ColumnType } from 'antd/es/table';
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
  Progress,
  Statistic,
  Timeline,
  Badge,
  Tooltip,
  List,
  Divider,
  Dropdown,
  Segmented,
  DatePicker
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  FileExcelOutlined,
  BarsOutlined,
  AppstoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  UserAddOutlined,
  SolutionOutlined,
  BulbOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Components
import StatisticCard from '../components/StatisticCard';

// Import job data
import { jobOpeningsData } from '../data/sampleData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

// Job openings interfaces
interface BaseJobOpening {
  key: string;
  position: string;
  department: string;
  openings: number;
  applications: number;
  status: string;
}

interface ExtendedJobOpening extends BaseJobOpening {
  location: string;
  type: string;
  postedDate: string;
  closingDate: string;
  hiringManager: string;
  priority: string;
}

// Candidate interface
interface Candidate {
  key: string;
  name: string;
  position: string;
  department: string;
  status: string;
  appliedDate: string;
  email: string;
  phone: string;
  source: string;
  experience: number;
  rating: number;
  stage: string;
  avatar: null;
}

type JobOpening = BaseJobOpening | ExtendedJobOpening;

// Update existing jobOpeningsData from sample data to include required fields
const updatedJobOpeningsData = jobOpeningsData.map(job => ({
  ...job,
  location: 'Bangalore',
  type: 'Full-time',
  postedDate: '2025-05-01',
  closingDate: '2025-06-15',
  hiringManager: 'Team Lead',
  priority: 'Medium'
})) as ExtendedJobOpening[];

// Extended job openings data
const extendedJobOpenings: ExtendedJobOpening[] = [
  ...updatedJobOpeningsData,
  {
    key: '4',
    position: 'UI/UX Designer',
    department: 'IT',
    openings: 1,
    applications: 18,
    status: 'Active',
    location: 'Bangalore',
    type: 'Full-time',
    postedDate: '2025-05-10',
    closingDate: '2025-06-25',
    hiringManager: 'John Doe',
    priority: 'High'
  },
  {
    key: '5',
    position: 'Product Manager',
    department: 'Operations',
    openings: 1,
    applications: 20,
    status: 'Active',
    location: 'Mumbai',
    type: 'Full-time',
    postedDate: '2025-05-15',
    closingDate: '2025-06-30',
    hiringManager: 'Jane Smith',
    priority: 'Medium'
  },
  {
    key: '6',
    position: 'Business Analyst',
    department: 'Finance',
    openings: 2,
    applications: 25,
    status: 'Closed',
    location: 'Delhi',
    type: 'Full-time',
    postedDate: '2025-04-01',
    closingDate: '2025-05-15',
    hiringManager: 'Mike Johnson',
    priority: 'Low'
  },
  {
    key: '7',
    position: 'Sales Executive',
    department: 'Marketing',
    openings: 3,
    applications: 30,
    status: 'Active',
    location: 'Hyderabad',
    type: 'Full-time',
    postedDate: '2025-05-20',
    closingDate: '2025-07-05',
    hiringManager: 'Rahul Sharma',
    priority: 'Medium'
  }
];

// Candidates data
const candidatesData = [
  {
    key: '1',
    name: 'Rahul Sharma',
    position: 'Senior Developer',
    department: 'IT',
    status: 'Interview Scheduled',
    appliedDate: '2025-05-12',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    source: 'LinkedIn',
    experience: 5,
    rating: 4.5,
    stage: 'Technical Interview',
    avatar: null
  },
  {
    key: '2',
    name: 'Priya Patel',
    position: 'UI/UX Designer',
    department: 'IT',
    status: 'Assessment',
    appliedDate: '2025-05-15',
    email: 'priya.patel@example.com',
    phone: '+91 9876543211',
    source: 'Naukri',
    experience: 3,
    rating: 4.0,
    stage: 'Assignment',
    avatar: null
  },
  {
    key: '3',
    name: 'Amit Kumar',
    position: 'Financial Analyst',
    department: 'Finance',
    status: 'Shortlisted',
    appliedDate: '2025-05-10',
    email: 'amit.kumar@example.com',
    phone: '+91 9876543212',
    source: 'Referral',
    experience: 4,
    rating: 4.2,
    stage: 'Initial Screening',
    avatar: null
  },
  {
    key: '4',
    name: 'Sneha Reddy',
    position: 'HR Specialist',
    department: 'HR',
    status: 'Hired',
    appliedDate: '2025-04-15',
    email: 'sneha.reddy@example.com',
    phone: '+91 9876543213',
    source: 'Indeed',
    experience: 3.5,
    rating: 4.8,
    stage: 'Offer Accepted',
    avatar: null
  },
  {
    key: '5',
    name: 'Vikram Singh',
    position: 'Product Manager',
    department: 'Operations',
    status: 'Rejected',
    appliedDate: '2025-05-05',
    email: 'vikram.singh@example.com',
    phone: '+91 9876543214',
    source: 'Monster',
    experience: 6,
    rating: 3.2,
    stage: 'Technical Interview',
    avatar: null
  },
  {
    key: '6',
    name: 'Deepa Joshi',
    position: 'Business Analyst',
    department: 'Finance',
    status: 'Interview Scheduled',
    appliedDate: '2025-05-20',
    email: 'deepa.joshi@example.com',
    phone: '+91 9876543215',
    source: 'Shine',
    experience: 2,
    rating: 3.8,
    stage: 'HR Interview',
    avatar: null
  },
  {
    key: '7',
    name: 'Raj Malhotra',
    position: 'Sales Executive',
    department: 'Marketing',
    status: 'New',
    appliedDate: '2025-06-01',
    email: 'raj.malhotra@example.com',
    phone: '+91 9876543216',
    source: 'Direct',
    experience: 4,
    rating: 3.5,
    stage: 'Application Received',
    avatar: null
  }
];

// Interview schedule data
const interviewSchedule = [
  {
    key: '1',
    candidate: 'Rahul Sharma',
    position: 'Senior Developer',
    interviewer: 'John Doe',
    date: '2025-06-18',
    time: '10:00 AM',
    type: 'Technical',
    status: 'Scheduled',
    location: 'Conference Room A'
  },
  {
    key: '2',
    candidate: 'Priya Patel',
    position: 'UI/UX Designer',
    interviewer: 'Jane Smith',
    date: '2025-06-20',
    time: '11:30 AM',
    type: 'Technical',
    status: 'Scheduled',
    location: 'Online (Zoom)'
  },
  {
    key: '3',
    candidate: 'Deepa Joshi',
    position: 'Business Analyst',
    interviewer: 'Mike Johnson',
    date: '2025-06-19',
    time: '02:00 PM',
    type: 'HR',
    status: 'Scheduled',
    location: 'HR Office'
  },
  {
    key: '4',
    candidate: 'Amit Kumar',
    position: 'Financial Analyst',
    interviewer: 'Jane Smith',
    date: '2025-06-15',
    time: '03:30 PM',
    type: 'Initial',
    status: 'Completed',
    location: 'Online (MS Teams)',
    feedback: 'Positive'
  }
];

// Recruitment sources data
const sourcesData = [
  { name: 'LinkedIn', count: 35, costPerHire: '₹15,000' },
  { name: 'Naukri', count: 28, costPerHire: '₹18,500' },
  { name: 'Indeed', count: 22, costPerHire: '₹12,000' },
  { name: 'Referrals', count: 15, costPerHire: '₹8,000' },
  { name: 'Direct', count: 10, costPerHire: '₹5,000' }
];

interface RecruitmentTabProps {
  showDrawer: (type: string) => void;
}

const RecruitmentTab: React.FC<RecruitmentTabProps> = ({ showDrawer }) => {
  // State
  const [activeTabKey, setActiveTabKey] = useState('openings');
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<string | number>('table');

  // More menu items
  const moreMenuItems = [
    { key: 'export-excel', label: 'Export to Excel' },
    { key: 'export-pdf', label: 'Export to PDF' },
    { key: 'import', label: 'Import Jobs' },
    { type: 'divider' as const, key: 'divider-1' },
    { key: 'bulk-edit', label: 'Bulk Edit' },
    { key: 'bulk-close', label: 'Close Selected Jobs', danger: true }
  ];

  // Job openings columns
  const jobColumns: ColumnType<ExtendedJobOpening>[] = [
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text: string) => <Text strong>{text}</Text>,
      sorter: (a: any, b: any) => a.position.localeCompare(b.position),
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
      filters: [
        { text: 'IT', value: 'IT' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Marketing', value: 'Marketing' },
        { text: 'Operations', value: 'Operations' },
      ],
      onFilter: (value: any, record: ExtendedJobOpening) => record.department === value,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text: string) => (
        <Space>
          <EnvironmentOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Openings',
      dataIndex: 'openings',
      key: 'openings',
      sorter: (a: any, b: any) => a.openings - b.openings,
    },
    {
      title: 'Applications',
      dataIndex: 'applications',
      key: 'applications',
      sorter: (a: any, b: any) => a.applications - b.applications,
    },
    {
      title: 'Posted Date',
      dataIndex: 'postedDate',
      key: 'postedDate',
      sorter: (a: any, b: any) => dayjs(a.postedDate).unix() - dayjs(b.postedDate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = text === 'Active' ? 'success' : 'default';
        let icon = text === 'Active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
        
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Closed', value: 'Closed' },
      ],
      onFilter: (value: any, record: ExtendedJobOpening) => record.status === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (text: string) => {
        let color = 
          text === 'High' ? 'red' :
          text === 'Medium' ? 'orange' :
          'green';
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'High', value: 'High' },
        { text: 'Medium', value: 'Medium' },
        { text: 'Low', value: 'Low' },
      ],
      onFilter: (value: any, record: ExtendedJobOpening) => record.priority === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<UserAddOutlined />} 
            size="small" 
            onClick={() => showDrawer('job-candidates')}
            title="View Candidates"
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showDrawer('job')}
            title="Edit Job"
          />
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showDrawer('job-view')}
            title="View Details"
          />
        </Space>
      ),
    },
  ];

  // Candidates columns
  const candidateColumns: ColumnType<Candidate>[] = [
    {
      title: 'Candidate',
      key: 'candidate',
      fixed: 'left' as const,
      width: 200,
      render: (_: any, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary">{record.email}</Text>
            </div>
          </div>
        </Space>
      ),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
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
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      sorter: (a: any, b: any) => dayjs(a.appliedDate).unix() - dayjs(b.appliedDate).unix(),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      render: (text: number) => `${text} years`,
      sorter: (a: any, b: any) => a.experience - b.experience,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => {
        let color = '';
        if (rating >= 4.5) color = '#52c41a'; // Green
        else if (rating >= 4.0) color = '#1890ff'; // Blue
        else if (rating >= 3.5) color = '#faad14'; // Orange
        else color = '#ff4d4f'; // Red
        
        return (
          <div className="rating-display">
            <div className="rating-stars" style={{ color }}>
              {'★'.repeat(Math.floor(rating))}
              {rating % 1 >= 0.5 ? '½' : ''}
              {'☆'.repeat(5 - Math.ceil(rating))}
            </div>
            <div className="rating-text">{rating}</div>
          </div>
        );
      },
      sorter: (a: any, b: any) => a.rating - b.rating,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = '';
        let icon = null;
        
        switch (text) {
          case 'New':
            color = 'default';
            icon = <ClockCircleOutlined />;
            break;
          case 'Shortlisted':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case 'Interview Scheduled':
            color = 'warning';
            icon = <CalendarOutlined />;
            break;
          case 'Assessment':
            color = 'processing';
            icon = <FileTextOutlined />;
            break;
          case 'Hired':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Rejected':
            color = 'error';
            icon = <CloseCircleOutlined />;
            break;
        }
        
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
      filters: [
        { text: 'New', value: 'New' },
        { text: 'Shortlisted', value: 'Shortlisted' },
        { text: 'Interview Scheduled', value: 'Interview Scheduled' },
        { text: 'Assessment', value: 'Assessment' },
        { text: 'Hired', value: 'Hired' },
        { text: 'Rejected', value: 'Rejected' },
      ],
      onFilter: (value: any, record: Candidate) => record.status === value,
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            size="small" 
            onClick={() => showDrawer('candidate-profile')}
            title="View Profile"
          />
          <Button 
            type="text" 
            icon={<CalendarOutlined />} 
            size="small" 
            onClick={() => showDrawer('schedule-interview')}
            title="Schedule Interview"
          />
          <Dropdown 
            menu={{ 
              items: [
                { key: 'view', label: 'View Profile' },
                { key: 'schedule', label: 'Schedule Interview' },
                { key: 'change-stage', label: 'Change Stage' },
                { key: 'send-assessment', label: 'Send Assessment' },
                { key: 'hire', label: 'Hire Candidate' },
                { key: 'reject', label: 'Reject Candidate', danger: true }
              ] 
            }} 
            trigger={['click']}
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Interview schedule columns
  const interviewColumns = [
    {
      title: 'Candidate',
      dataIndex: 'candidate',
      key: 'candidate',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Interviewer',
      dataIndex: 'interviewer',
      key: 'interviewer',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        let color = '';
        
        switch (text) {
          case 'Initial':
            color = 'blue';
            break;
          case 'Technical':
            color = 'geekblue';
            break;
          case 'HR':
            color = 'purple';
            break;
          case 'Final':
            color = 'green';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string, record: any) => {
        let color = '';
        let icon = null;
        
        switch (text) {
          case 'Scheduled':
            color = 'processing';
            icon = <CalendarOutlined />;
            break;
          case 'Completed':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Cancelled':
            color = 'error';
            icon = <CloseCircleOutlined />;
            break;
          case 'Rescheduled':
            color = 'warning';
            icon = <ClockCircleOutlined />;
            break;
        }
        
        return (
          <Space direction="vertical" size={0}>
            <Tag color={color} icon={icon}>{text}</Tag>
            {record.feedback && <Text type="secondary">Feedback: {record.feedback}</Text>}
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 'Scheduled' ? (
            <>
              <Button 
                type="text" 
                size="small" 
                onClick={() => showDrawer('add-feedback')}
              >
                Add Feedback
              </Button>
              <Button 
                type="text" 
                size="small" 
                onClick={() => showDrawer('reschedule-interview')}
              >
                Reschedule
              </Button>
            </>
          ) : (
            <Button 
              type="text" 
              size="small" 
              onClick={() => showDrawer('view-feedback')}
            >
              View Feedback
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Filter jobs based on search and filters
  const filteredJobs = extendedJobOpenings.filter(job => {
    const matchesSearch = job.position.toLowerCase().includes(searchText.toLowerCase()) ||
      job.department.toLowerCase().includes(searchText.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  return (
    <div className="recruitment-tab">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Active Jobs"
            value={extendedJobOpenings.filter(job => job.status === 'Active').length}
            icon={<FileTextOutlined />}
            color="#1890ff"
            change={2}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Total Candidates"
            value={candidatesData.length}
            icon={<UserOutlined />}
            color="#52c41a"
            change={12}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Interviews Scheduled"
            value={interviewSchedule.filter(interview => interview.status === 'Scheduled').length}
            icon={<CalendarOutlined />}
            color="#faad14"
            change={3}
            changeText="from last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Average Hiring Time"
            value={18}
            suffix=" days"
            icon={<ClockCircleOutlined />}
            color="#722ed1"
            change={-2.5}
            changeText="from last month"
            changeType="decrease"
          />
        </Col>
      </Row>

      {/* Tabs Section */}
      <Card className="recruitment-card">
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="Job Openings" key="openings">
            <div className="tab-header">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Space wrap>
                    <Input
                      placeholder="Search position, location..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 220 }}
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
                      style={{ width: 120 }}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="Active">Active</Option>
                      <Option value="Closed">Closed</Option>
                    </Select>
                  </Space>
                </Col>
                <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
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
                      onClick={() => showDrawer('job')}
                    >
                      Post Job
                    </Button>
                    <Dropdown menu={{ items: moreMenuItems }} trigger={['click']}>
                      <Button icon={<MoreOutlined />}>More</Button>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            {viewMode === 'table' ? (
              <Table 
                columns={jobColumns} 
                dataSource={filteredJobs}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} jobs`
                }}
                className="jobs-table"
              />
            ) : (
              <div className="jobs-grid">
                <Row gutter={[16, 16]}>
                  {filteredJobs.map(job => (
                    <Col xs={24} sm={12} md={8} lg={6} key={job.key}>
                      <Card 
                        hoverable 
                        className="job-card"
                        actions={[
                          <Tooltip title="View Candidates" key="candidates">
                            <UserAddOutlined onClick={() => showDrawer('job-candidates')} />
                          </Tooltip>,
                          <Tooltip title="Edit Job" key="edit">
                            <EditOutlined onClick={() => showDrawer('job')} />
                          </Tooltip>,
                          <Tooltip title="View Details" key="view">
                            <EyeOutlined onClick={() => showDrawer('job-view')} />
                          </Tooltip>,
                        ]}
                      >
                        <div className="job-card-header">
                          <Tag color={job.status === 'Active' ? 'success' : 'default'}>
                            {job.status}
                          </Tag>
                          <Tag color={
                            job.priority === 'High' ? 'red' :
                            job.priority === 'Medium' ? 'orange' :
                            'green'
                          }>
                            {job.priority}
                          </Tag>
                        </div>
                        <div className="job-card-content">
                          <Title level={5}>{job.position}</Title>
                          <Space className="job-meta">
                            <Tag color={
                              job.department === 'IT' ? 'geekblue' :
                              job.department === 'HR' ? 'purple' :
                              job.department === 'Finance' ? 'green' :
                              job.department === 'Marketing' ? 'orange' :
                              'cyan'
                            }>
                              {job.department}
                            </Tag>
                            <Text type="secondary">
                              <EnvironmentOutlined /> {job.location}
                            </Text>
                          </Space>
                          <div className="job-details">
                            <div className="job-detail-item">
                              <Text type="secondary">Openings:</Text>
                              <Text strong>{job.openings}</Text>
                            </div>
                            <div className="job-detail-item">
                              <Text type="secondary">Applications:</Text>
                              <Text strong>{job.applications}</Text>
                            </div>
                            <div className="job-detail-item">
                              <Text type="secondary">Posted:</Text>
                              <Text>{job.postedDate}</Text>
                            </div>
                            <div className="job-detail-item">
                              <Text type="secondary">Closes:</Text>
                              <Text>{job.closingDate}</Text>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </TabPane>

          <TabPane tab="Candidates" key="candidates">
            <div className="tab-header">
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Space wrap>
                    <Input
                      placeholder="Search candidates..."
                      prefix={<SearchOutlined />}
                      style={{ width: 220 }}
                      allowClear
                    />
                    <Select
                      placeholder="Position"
                      style={{ width: 180 }}
                      defaultValue="all"
                    >
                      <Option value="all">All Positions</Option>
                      <Option value="Senior Developer">Senior Developer</Option>
                      <Option value="UI/UX Designer">UI/UX Designer</Option>
                      <Option value="Financial Analyst">Financial Analyst</Option>
                      <Option value="HR Specialist">HR Specialist</Option>
                      <Option value="Product Manager">Product Manager</Option>
                    </Select>
                    <Select
                      placeholder="Status"
                      style={{ width: 150 }}
                      defaultValue="all"
                    >
                      <Option value="all">All Status</Option>
                      <Option value="New">New</Option>
                      <Option value="Shortlisted">Shortlisted</Option>
                      <Option value="Interview Scheduled">Interview Scheduled</Option>
                      <Option value="Assessment">Assessment</Option>
                      <Option value="Hired">Hired</Option>
                      <Option value="Rejected">Rejected</Option>
                    </Select>
                  </Space>
                </Col>
                <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
                  <Space wrap style={{ float: 'right' }}>
                    <Button 
                      icon={<PlusOutlined />}
                      onClick={() => showDrawer('add-candidate')}
                    >
                      Add Candidate
                    </Button>
                    <Button icon={<FileExcelOutlined />}>Export</Button>
                    <Button icon={<MailOutlined />}>Bulk Email</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={candidateColumns} 
              dataSource={candidatesData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
              }}
              scroll={{ x: 1500 }}
              className="candidates-table"
            />
          </TabPane>

          <TabPane tab="Interviews" key="interviews">
            <div className="tab-header">
              <Row gutter={[16, 16]} justify="space-between">
                <Col>
                  <Space>
                    <Select
                      placeholder="Status"
                      style={{ width: 130 }}
                      defaultValue="all"
                    >
                      <Option value="all">All Status</Option>
                      <Option value="Scheduled">Scheduled</Option>
                      <Option value="Completed">Completed</Option>
                      <Option value="Cancelled">Cancelled</Option>
                      <Option value="Rescheduled">Rescheduled</Option>
                    </Select>
                    <Select
                      placeholder="Interview Type"
                      style={{ width: 150 }}
                      defaultValue="all"
                    >
                      <Option value="all">All Types</Option>
                      <Option value="Initial">Initial</Option>
                      <Option value="Technical">Technical</Option>
                      <Option value="HR">HR</Option>
                      <Option value="Final">Final</Option>
                    </Select>
                    <DatePicker placeholder="Select Date" />
                  </Space>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => showDrawer('schedule-interview')}
                  >
                    Schedule Interview
                  </Button>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={interviewColumns} 
              dataSource={interviewSchedule}
              pagination={false}
              className="interview-table"
            />
          </TabPane>

          <TabPane tab="Analytics" key="analytics">
            <Row gutter={[16, 24]}>
              <Col xs={24} md={12}>
                <Card title="Recruitment Sources" className="analytics-card">
                  <div className="recruitment-sources">
                    {sourcesData.map((source, index) => (
                      <div className="source-item" key={index}>
                        <div className="source-name">{source.name}</div>
                        <div className="source-bar-container">
                          <div 
                            className="source-bar" 
                            style={{ 
                              width: `${(source.count / sourcesData.reduce((acc, curr) => acc + curr.count, 0)) * 100}%`,
                              backgroundColor: 
                                index === 0 ? '#1890ff' :
                                index === 1 ? '#52c41a' :
                                index === 2 ? '#faad14' :
                                index === 3 ? '#722ed1' :
                                '#ff4d4f'
                            }}
                          ></div>
                        </div>
                        <div className="source-stats">
                          <div className="source-count">{source.count}</div>
                          <div className="source-cost">{source.costPerHire}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card title="Hiring Process Analytics" className="analytics-card">
                  <div className="hiring-stats">
                    <Row gutter={[16, 16]}>
                      <Col span={12}>
                        <Statistic 
                          title="Avg. Time to Hire" 
                          value={18} 
                          suffix="days"
                          valueStyle={{ color: '#1890ff' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic 
                          title="Offer Acceptance Rate" 
                          value={85} 
                          suffix="%"
                          valueStyle={{ color: '#52c41a' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic 
                          title="Cost per Hire" 
                          value={"₹15,200"} 
                          valueStyle={{ color: '#faad14' }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic 
                          title="Interview to Hire Ratio" 
                          value={"6:1"} 
                          valueStyle={{ color: '#722ed1' }}
                        />
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="Recruitment Funnel" className="analytics-card">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                      <div className="recruitment-funnel">
                        <div className="funnel-stage">
                          <div className="stage-label">Applications Received</div>
                          <div className="stage-bar" style={{ width: '100%', backgroundColor: '#1890ff' }}></div>
                          <div className="stage-value">250</div>
                        </div>
                        <div className="funnel-stage">
                          <div className="stage-label">Initial Screening</div>
                          <div className="stage-bar" style={{ width: '70%', backgroundColor: '#52c41a' }}></div>
                          <div className="stage-value">175</div>
                        </div>
                        <div className="funnel-stage">
                          <div className="stage-label">Technical Assessment</div>
                          <div className="stage-bar" style={{ width: '40%', backgroundColor: '#faad14' }}></div>
                          <div className="stage-value">100</div>
                        </div>
                        <div className="funnel-stage">
                          <div className="stage-label">Interview Round</div>
                          <div className="stage-bar" style={{ width: '20%', backgroundColor: '#722ed1' }}></div>
                          <div className="stage-value">50</div>
                        </div>
                        <div className="funnel-stage">
                          <div className="stage-label">Offers Extended</div>
                          <div className="stage-bar" style={{ width: '10%', backgroundColor: '#eb2f96' }}></div>
                          <div className="stage-value">25</div>
                        </div>
                        <div className="funnel-stage">
                          <div className="stage-label">Offers Accepted</div>
                          <div className="stage-bar" style={{ width: '8%', backgroundColor: '#f5222d' }}></div>
                          <div className="stage-value">20</div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} md={8}>
                      <div className="funnel-analysis">
                        <Title level={5}>Conversion Rates</Title>
                        <List
                          size="small"
                          dataSource={[
                            { label: 'Screening to Assessment', value: '57%', trend: 'up', change: '5%' },
                            { label: 'Assessment to Interview', value: '50%', trend: 'down', change: '3%' },
                            { label: 'Interview to Offer', value: '50%', trend: 'up', change: '8%' },
                            { label: 'Offer to Acceptance', value: '80%', trend: 'up', change: '5%' },
                            { label: 'Overall Conversion', value: '8%', trend: 'up', change: '1.5%' },
                          ]}
                          renderItem={item => (
                            <List.Item>
                              <div className="conversion-item">
                                <div className="conversion-label">{item.label}</div>
                                <div className="conversion-value">
                                  {item.value}
                                  <span className={`trend ${item.trend}`}>
                                    {item.trend === 'up' ? <RiseOutlined /> : <FallOutlined />}
                                    {item.change}
                                  </span>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>

      {/* Additional Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card 
            title="Hiring Timeline" 
            className="animated-card"
          >
            <Timeline mode="left">
              <Timeline.Item 
                color="green" 
                label="May 10, 2025"
              >
                <Text strong>Job Posting Created</Text>
                <div>UI/UX Designer position posted on 3 job portals</div>
              </Timeline.Item>
              <Timeline.Item 
                color="blue" 
                label="May 15-25, 2025"
              >
                <Text strong>Application Collection</Text>
                <div>18 applications received and reviewed</div>
              </Timeline.Item>
              <Timeline.Item 
                color="orange" 
                label="May 26-31, 2025"
              >
                <Text strong>Initial Screening</Text>
                <div>10 candidates shortlisted for technical assessment</div>
              </Timeline.Item>
              <Timeline.Item 
                color="purple" 
                label="June 1-10, 2025"
              >
                <Text strong>Technical Assessment</Text>
                <div>6 candidates completed design assignment</div>
              </Timeline.Item>
              <Timeline.Item 
                color="red" 
                label="June 15-20, 2025"
              >
                <Text strong>Interviews</Text>
                <div>4 candidates scheduled for interviews</div>
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Recruitment Tips & Best Practices" 
            extra={<Button type="link" size="small" icon={<BulbOutlined />}>More Tips</Button>}
            className="animated-card"
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                { 
                  title: 'Structure Your Interview Process', 
                  description: 'Use standardized questions and evaluation criteria to ensure fair assessment of all candidates.' 
                },
                { 
                  title: 'Optimize Job Descriptions', 
                  description: 'Focus on role impact and growth opportunities rather than just requirements and responsibilities.' 
                },
                { 
                  title: 'Leverage Employee Referrals', 
                  description: 'Referred candidates typically have higher retention rates and cultural alignment.' 
                },
                { 
                  title: 'Reduce Time-to-Hire', 
                  description: 'Top candidates are off the market within 10 days. Streamline your hiring process to avoid losing talent.' 
                }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<BulbOutlined />} style={{ backgroundColor: '#faad14' }} />}
                    title={<Text strong>{item.title}</Text>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RecruitmentTab;