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
  Typography,
  Avatar,
  Tag,
  DatePicker,
  Steps,
  Dropdown,
  Tooltip,
  Badge,
  Statistic,
  Divider,
  List,
  Progress,
  Alert
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  UserOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  BankOutlined,
  WalletOutlined,
  MailOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  MoreOutlined,
  DollarOutlined,
  CalendarOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  ExclamationCircleOutlined,
  CheckOutlined,
  SyncOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Components
import StatisticCard from '../components/StatisticCard';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Step } = Steps;

// Sample payroll data for employees
const payrollData = [
  {
    key: '1',
    employeeId: 'EMP001',
    name: 'John Doe',
    department: 'IT',
    position: 'Senior Developer',
    basicSalary: 75000,
    hra: 7500,
    da: 3750,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 5000,
    pf: 3600,
    tds: 7500,
    professionalTax: 200,
    loanDeduction: 5000,
    netSalary: 77800,
    paymentStatus: 'Paid',
    paymentDate: '2025-06-05',
    bankAccount: 'HDFC-XXXX5643',
    payslipGenerated: true
  },
  {
    key: '2',
    employeeId: 'EMP002',
    name: 'Jane Smith',
    department: 'HR',
    position: 'HR Manager',
    basicSalary: 85000,
    hra: 8500,
    da: 4250,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 7000,
    pf: 3600,
    tds: 8000,
    professionalTax: 200,
    loanDeduction: 0,
    netSalary: 95800,
    paymentStatus: 'Paid',
    paymentDate: '2025-06-05',
    bankAccount: 'ICICI-XXXX7890',
    payslipGenerated: true
  },
  {
    key: '3',
    employeeId: 'EMP003',
    name: 'Mike Johnson',
    department: 'Finance',
    position: 'Financial Analyst',
    basicSalary: 70000,
    hra: 7000,
    da: 3500,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 4000,
    pf: 3600,
    tds: 6500,
    professionalTax: 200,
    loanDeduction: 2000,
    netSalary: 75050,
    paymentStatus: 'Pending',
    paymentDate: null,
    bankAccount: 'SBI-XXXX1234',
    payslipGenerated: true
  },
  {
    key: '4',
    employeeId: 'EMP004',
    name: 'Rahul Sharma',
    department: 'Marketing',
    position: 'Marketing Manager',
    basicSalary: 82000,
    hra: 8200,
    da: 4100,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 6000,
    pf: 3600,
    tds: 7800,
    professionalTax: 200,
    loanDeduction: 0,
    netSalary: 91550,
    paymentStatus: 'Paid',
    paymentDate: '2025-06-05',
    bankAccount: 'AXIS-XXXX6543',
    payslipGenerated: true
  },
  {
    key: '5',
    employeeId: 'EMP005',
    name: 'Priya Patel',
    department: 'IT',
    position: 'UX Designer',
    basicSalary: 68000,
    hra: 6800,
    da: 3400,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 3500,
    pf: 3600,
    tds: 6000,
    professionalTax: 200,
    loanDeduction: 0,
    netSalary: 74750,
    paymentStatus: 'Scheduled',
    paymentDate: '2025-06-15',
    bankAccount: 'HDFC-XXXX8765',
    payslipGenerated: true
  },
  {
    key: '6',
    employeeId: 'EMP006',
    name: 'Amit Kumar',
    department: 'Finance',
    position: 'Senior Accountant',
    basicSalary: 78000,
    hra: 7800,
    da: 3900,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 5000,
    pf: 3600,
    tds: 7500,
    professionalTax: 200,
    loanDeduction: 3000,
    netSalary: 83250,
    paymentStatus: 'Failed',
    paymentDate: '2025-06-05',
    bankAccount: 'SBI-XXXX9870',
    payslipGenerated: true
  },
  {
    key: '7',
    employeeId: 'EMP007',
    name: 'Sneha Reddy',
    department: 'HR',
    position: 'Recruiter',
    basicSalary: 65000,
    hra: 6500,
    da: 3250,
    conveyance: 1600,
    medical: 1250,
    specialAllowance: 3000,
    pf: 3600,
    tds: 5500,
    professionalTax: 200,
    loanDeduction: 0,
    netSalary: 71300,
    paymentStatus: 'Not Processed',
    paymentDate: null,
    bankAccount: 'ICICI-XXXX4321',
    payslipGenerated: false
  }
];

// Salary components
const salaryComponents = [
  {
    key: '1',
    componentName: 'Basic Salary',
    type: 'Earning',
    calculationType: 'Percentage of CTC',
    value: '50%',
    taxable: 'Yes'
  },
  {
    key: '2',
    componentName: 'House Rent Allowance (HRA)',
    type: 'Earning',
    calculationType: 'Percentage of Basic',
    value: '50% of Basic for Metro cities, 40% for others',
    taxable: 'Partially'
  },
  {
    key: '3',
    componentName: 'Dearness Allowance (DA)',
    type: 'Earning',
    calculationType: 'Fixed',
    value: '5% of Basic',
    taxable: 'Yes'
  },
  {
    key: '4',
    componentName: 'Conveyance Allowance',
    type: 'Earning',
    calculationType: 'Fixed',
    value: '₹1,600',
    taxable: 'No (up to ₹1,600)'
  },
  {
    key: '5',
    componentName: 'Medical Allowance',
    type: 'Earning',
    calculationType: 'Fixed',
    value: '₹1,250',
    taxable: 'No (up to ₹15,000 per year)'
  },
  {
    key: '6',
    componentName: 'Special Allowance',
    type: 'Earning',
    calculationType: 'Variable',
    value: 'Remaining CTC after other components',
    taxable: 'Yes'
  },
  {
    key: '7',
    componentName: 'Provident Fund (PF)',
    type: 'Deduction',
    calculationType: 'Fixed',
    value: '12% of Basic (Employer Contribution: 12%)',
    taxable: 'N/A'
  },
  {
    key: '8',
    componentName: 'Tax Deducted at Source (TDS)',
    type: 'Deduction',
    calculationType: 'Variable',
    value: 'As per Income Tax Slabs',
    taxable: 'N/A'
  },
  {
    key: '9',
    componentName: 'Professional Tax',
    type: 'Deduction',
    calculationType: 'Fixed',
    value: '₹200 per month',
    taxable: 'N/A'
  }
];

// Payroll process data
const payrollProcesses = [
  {
    key: '1',
    month: 'June 2025',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    processDate: '2025-07-01',
    status: 'Scheduled',
    totalEmployees: 180,
    totalAmount: '₹1,35,45,600',
    processedBy: 'System (Auto)'
  },
  {
    key: '2',
    month: 'May 2025',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    processDate: '2025-06-01',
    status: 'Completed',
    totalEmployees: 178,
    totalAmount: '₹1,32,58,800',
    processedBy: 'Jane Smith'
  },
  {
    key: '3',
    month: 'April 2025',
    startDate: '2025-04-01',
    endDate: '2025-04-30',
    processDate: '2025-05-01',
    status: 'Completed',
    totalEmployees: 175,
    totalAmount: '₹1,28,95,400',
    processedBy: 'Jane Smith'
  }
];

interface PayrollTabProps {
  showDrawer: (type: string) => void;
}

const PayrollTab: React.FC<PayrollTabProps> = ({ showDrawer }) => {
  // State
  const [activeTabKey, setActiveTabKey] = useState('salary');
  const [searchText, setSearchText] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('MMMM YYYY'));
  const [currentStep, setCurrentStep] = useState(0);

  // More menu items
  const moreMenuItems = [
    { key: 'export-excel', label: 'Export to Excel' },
    { key: 'export-pdf', label: 'Export to PDF' },
    { key: 'print-all', label: 'Print All Payslips' },
    { type: 'divider' as const, key: 'divider-1' },
    { key: 'email-all', label: 'Email All Payslips' },
    { key: 'mark-all-paid', label: 'Mark All as Paid' }
  ];

  // Filter payroll data based on search and filters
  const filteredPayrollData = payrollData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.department.toLowerCase().includes(searchText.toLowerCase()) ||
      item.position.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = paymentStatus === 'all' || item.paymentStatus === paymentStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Payroll columns
  const payrollColumns = [
    {
      title: 'Employee',
      key: 'employee',
      fixed: 'left' as const,
      width: 200,
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
      title: 'Gross Salary',
      key: 'grossSalary',
      render: (_: any, record: any) => {
        const gross = record.basicSalary + record.hra + record.da + record.conveyance + record.medical + record.specialAllowance;
        return <Text>₹{gross.toLocaleString('en-IN')}</Text>;
      },
      sorter: (a: any, b: any) => {
        const grossA = a.basicSalary + a.hra + a.da + a.conveyance + a.medical + a.specialAllowance;
        const grossB = b.basicSalary + b.hra + b.da + b.conveyance + b.medical + b.specialAllowance;
        return grossA - grossB;
      },
    },
    {
      title: 'Deductions',
      key: 'deductions',
      render: (_: any, record: any) => {
        const deductions = record.pf + record.tds + record.professionalTax + record.loanDeduction;
        return <Text>₹{deductions.toLocaleString('en-IN')}</Text>;
      },
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
      render: (text: number) => <Text strong>₹{text.toLocaleString('en-IN')}</Text>,
      sorter: (a: any, b: any) => a.netSalary - b.netSalary,
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => {
        let color = '';
        let icon = null;
        
        switch (status) {
          case 'Paid':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Pending':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case 'Scheduled':
            color = 'default';
            icon = <CalendarOutlined />;
            break;
          case 'Failed':
            color = 'error';
            icon = <ExclamationCircleOutlined />;
            break;
          case 'Not Processed':
            color = 'default';
            icon = <StopOutlined />;
            break;
        }
        
        return <Tag color={color} icon={icon}>{status}</Tag>;
      },
      filters: [
        { text: 'Paid', value: 'Paid' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Scheduled', value: 'Scheduled' },
        { text: 'Failed', value: 'Failed' },
        { text: 'Not Processed', value: 'Not Processed' },
      ],
      onFilter: (value: any, record: any) => record.paymentStatus === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            icon={<DownloadOutlined />} 
            size="small"
            disabled={!record.payslipGenerated}
            title={!record.payslipGenerated ? "Payslip not generated yet" : "Download Payslip"}
          />
          <Button 
            type="text" 
            icon={<MailOutlined />} 
            size="small"
            disabled={!record.payslipGenerated}
          />
          <Button 
            type="text" 
            icon={<PrinterOutlined />} 
            size="small"
            disabled={!record.payslipGenerated}
          />
          <Dropdown 
            menu={{ 
              items: [
                { key: 'view', label: 'View Details' },
                { key: 'edit', label: 'Edit Salary' },
                { key: 'generate', label: 'Generate Payslip', disabled: record.payslipGenerated },
                { key: 'payment', label: 'Process Payment', disabled: record.paymentStatus === 'Paid' }
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

  // Salary component columns
  const componentColumns = [
    {
      title: 'Component Name',
      dataIndex: 'componentName',
      key: 'componentName',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => (
        <Tag color={text === 'Earning' ? 'green' : 'red'}>{text}</Tag>
      ),
    },
    {
      title: 'Calculation',
      dataIndex: 'calculationType',
      key: 'calculationType',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Taxable',
      dataIndex: 'taxable',
      key: 'taxable',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => showDrawer('salary-component')} />
        </Space>
      ),
    },
  ];

  // Payroll process columns
  const processColumns = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
    },
    {
      title: 'Period',
      key: 'period',
      render: (_: any, record: any) => (
        <span>{record.startDate} to {record.endDate}</span>
      ),
    },
    {
      title: 'Process Date',
      dataIndex: 'processDate',
      key: 'processDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        let color = '';
        let icon = null;
        
        switch (text) {
          case 'Completed':
            color = 'success';
            icon = <CheckOutlined />;
            break;
          case 'In Progress':
            color = 'processing';
            icon = <SyncOutlined spin />;
            break;
          case 'Scheduled':
            color = 'default';
            icon = <CalendarOutlined />;
            break;
        }
        
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: 'Employees',
      dataIndex: 'totalEmployees',
      key: 'totalEmployees',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Processed By',
      dataIndex: 'processedBy',
      key: 'processedBy',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<FileTextOutlined />} 
            onClick={() => showDrawer('payroll-summary')}
          >
            View
          </Button>
          {record.status === 'Scheduled' && (
            <Button 
              type="text" 
              size="small" 
              onClick={() => showDrawer('run-payroll')}
            >
              Run Now
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="payroll-tab">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Total Payroll"
            value={"₹93,54,650"}
            icon={<WalletOutlined />}
            color="#1890ff"
            change={3.2}
            changeText="from last month"
            changeType="increase"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Average Salary"
            value={"₹82,350"}
            icon={<BankOutlined />}
            color="#52c41a"
            change={2.1}
            changeText="from last month"
            changeType="increase"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Pending Payments"
            value={payrollData.filter(item => item.paymentStatus === 'Pending' || item.paymentStatus === 'Not Processed').length}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            change={-1}
            changeText="from last month"
            changeType="decrease"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Tax Deducted"
            value={"₹12,45,200"}
            icon={<DollarOutlined />}
            color="#722ed1"
            change={5.6}
            changeText="from last month"
            changeType="increase"
          />
        </Col>
      </Row>

      {/* Tabs Section */}
      <Card className="payroll-card">
        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="Salary Processing" key="salary">
            <div className="tab-header">
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col xs={24} md={16}>
                  <Space wrap>
                    <Input
                      placeholder="Search employee, ID..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      style={{ width: 220 }}
                      allowClear
                    />
                    <Select
                      placeholder="Payment Status"
                      style={{ width: 150 }}
                      value={paymentStatus}
                      onChange={setPaymentStatus}
                    >
                      <Option value="all">All Status</Option>
                      <Option value="Paid">Paid</Option>
                      <Option value="Pending">Pending</Option>
                      <Option value="Scheduled">Scheduled</Option>
                      <Option value="Failed">Failed</Option>
                      <Option value="Not Processed">Not Processed</Option>
                    </Select>
                    <Select
                      value={selectedMonth}
                      style={{ width: 150 }}
                      onChange={setSelectedMonth}
                      options={[
                        { value: 'June 2025', label: 'June 2025' },
                        { value: 'May 2025', label: 'May 2025' },
                        { value: 'April 2025', label: 'April 2025' }
                      ]}
                    />
                  </Space>
                </Col>
                <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                  <Space wrap style={{ float: 'right' }}>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => showDrawer('run-payroll')}
                    >
                      Run Payroll
                    </Button>
                    <Button icon={<FileExcelOutlined />}>Export</Button>
                    <Dropdown menu={{ items: moreMenuItems }} trigger={['click']}>
                      <Button icon={<MoreOutlined />}>More</Button>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={payrollColumns} 
              dataSource={filteredPayrollData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} employees`
              }}
              scroll={{ x: 1200 }}
              className="payroll-table"
            />
          </TabPane>

          <TabPane tab="Salary Components" key="components">
            <div className="tab-header">
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col>
                  <Title level={5}>Salary Structure Components</Title>
                  <Text type="secondary">
                    Define and manage all the components that make up the salary structure
                  </Text>
                </Col>
                <Col>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => showDrawer('salary-component')}
                  >
                    Add Component
                  </Button>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={componentColumns} 
              dataSource={salaryComponents}
              pagination={false}
              className="components-table"
            />
          </TabPane>

          <TabPane tab="Payroll History" key="history">
            <div className="tab-header">
              <Row gutter={[16, 16]} justify="space-between" align="middle">
                <Col>
                  <Title level={5}>Payroll Processing History</Title>
                  <Text type="secondary">
                    View past and scheduled payroll runs
                  </Text>
                </Col>
                <Col>
                  <Space>
                    <RangePicker />
                    <Button icon={<SearchOutlined />}>Search</Button>
                  </Space>
                </Col>
              </Row>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <Table 
              columns={processColumns} 
              dataSource={payrollProcesses}
              pagination={false}
              className="history-table"
            />
          </TabPane>

          <TabPane tab="Payroll Process" key="process">
            <Card className="process-card">
              <Steps current={currentStep} onChange={setCurrentStep} direction="vertical">
                <Step 
                  title="Data Validation" 
                  description="Validate employee attendance, leaves, and other input data" 
                  icon={<CheckCircleOutlined />}
                />
                <Step 
                  title="Salary Calculation" 
                  description="Calculate salary components, allowances, and deductions" 
                  icon={<DollarOutlined />}
                />
                <Step 
                  title="Review & Approval" 
                  description="Review calculated salaries and get necessary approvals" 
                  icon={<FileTextOutlined />}
                />
                <Step 
                  title="Payslip Generation" 
                  description="Generate payslips for all employees" 
                  icon={<FileExcelOutlined />}
                />
                <Step 
                  title="Payment Processing" 
                  description="Process payments through bank transfers" 
                  icon={<BankOutlined />}
                />
                <Step 
                  title="Payslip Distribution" 
                  description="Distribute payslips to employees via email" 
                  icon={<MailOutlined />}
                />
              </Steps>

              <div className="step-details">
                {currentStep === 0 && (
                  <div className="step-content">
                    <Title level={5}>Data Validation</Title>
                    <Paragraph>
                      This step ensures all input data is accurate before proceeding with payroll processing.
                    </Paragraph>
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Card className="checklist-card">
                          <Statistic 
                            title="Attendance Data" 
                            value={100} 
                            suffix="%" 
                            valueStyle={{ color: '#52c41a' }}
                          />
                          <Text type="success"><CheckOutlined /> Validated</Text>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card className="checklist-card">
                          <Statistic 
                            title="Leave Records" 
                            value={100} 
                            suffix="%" 
                            valueStyle={{ color: '#52c41a' }}
                          />
                          <Text type="success"><CheckOutlined /> Validated</Text>
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card className="checklist-card">
                          <Statistic 
                            title="Employee Data" 
                            value={100} 
                            suffix="%" 
                            valueStyle={{ color: '#52c41a' }}
                          />
                          <Text type="success"><CheckOutlined /> Validated</Text>
                        </Card>
                      </Col>
                    </Row>
                    <div className="step-actions">
                      <Button type="primary" onClick={() => setCurrentStep(1)}>Proceed to Salary Calculation</Button>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="step-content">
                    <Title level={5}>Salary Calculation</Title>
                    <Paragraph>
                      Calculate all salary components, allowances, and deductions for each employee.
                    </Paragraph>
                    <div className="calculation-summary">
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Card title="Earnings" className="earnings-card">
                            <List
                              size="small"
                              dataSource={[
                                { name: 'Basic Salary', value: '₹56,25,000' },
                                { name: 'House Rent Allowance', value: '₹12,15,000' },
                                { name: 'Dearness Allowance', value: '₹6,82,500' },
                                { name: 'Conveyance Allowance', value: '₹1,12,000' },
                                { name: 'Medical Allowance', value: '₹87,500' },
                                { name: 'Special Allowance', value: '₹8,92,500' },
                              ]}
                              renderItem={item => (
                                <List.Item className="calculation-item">
                                  <Text>{item.name}</Text>
                                  <Text strong>{item.value}</Text>
                                </List.Item>
                              )}
                            />
                            <Divider style={{ margin: '12px 0' }} />
                            <div className="total-line">
                              <Text strong>Total Earnings</Text>
                              <Text strong style={{ color: '#52c41a' }}>₹86,14,500</Text>
                            </div>
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card title="Deductions" className="deductions-card">
                            <List
                              size="small"
                              dataSource={[
                                { name: 'Provident Fund', value: '₹6,75,000' },
                                { name: 'Tax Deducted at Source', value: '₹12,45,200' },
                                { name: 'Professional Tax', value: '₹14,000' },
                                { name: 'Loan Deductions', value: '₹2,10,000' },
                                { name: 'Other Deductions', value: '₹0' },
                              ]}
                              renderItem={item => (
                                <List.Item className="calculation-item">
                                  <Text>{item.name}</Text>
                                  <Text strong>{item.value}</Text>
                                </List.Item>
                              )}
                            />
                            <Divider style={{ margin: '12px 0' }} />
                            <div className="total-line">
                              <Text strong>Total Deductions</Text>
                              <Text strong style={{ color: '#ff4d4f' }}>₹21,44,200</Text>
                            </div>
                          </Card>
                        </Col>
                      </Row>
                      <Card className="net-salary-card" style={{ marginTop: '16px' }}>
                        <Row>
                          <Col span={12}>
                            <Statistic 
                              title="Total Gross Salary" 
                              value={"₹86,14,500"} 
                              valueStyle={{ color: '#1890ff' }}
                            />
                          </Col>
                          <Col span={12}>
                            <Statistic 
                              title="Net Salary Payout" 
                              value={"₹64,70,300"} 
                              valueStyle={{ color: '#52c41a' }}
                            />
                          </Col>
                        </Row>
                      </Card>
                    </div>
                    <div className="step-actions">
                      <Space>
                        <Button onClick={() => setCurrentStep(0)}>Back</Button>
                        <Button type="primary" onClick={() => setCurrentStep(2)}>Save & Continue</Button>
                      </Space>
                    </div>
                  </div>
                )}

                {currentStep > 1 && (
                  <div className="step-content">
                    <Alert
                      message="Process Details"
                      description={`This interface would show details for step ${currentStep + 1}. Navigate through steps to see the complete payroll process workflow.`}
                      type="info"
                      showIcon
                    />
                    <div className="step-actions" style={{ marginTop: '20px' }}>
                      <Space>
                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Previous Step</Button>
                        {currentStep < 5 && (
                          <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>Next Step</Button>
                        )}
                        {currentStep === 5 && (
                          <Button type="primary" onClick={() => setCurrentStep(0)}>Complete Process</Button>
                        )}
                      </Space>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </Card>

      {/* Additional Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card 
            title="Payroll Summary" 
            className="animated-card"
          >
            <div className="payroll-summary">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="Processed" 
                    value={5} 
                    suffix="/ 7"
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Progress percent={Math.round(5/7*100)} status="active" />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Total Salary" 
                    value={"₹5,69,500"} 
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <div className="statistic-change">
                    <RiseOutlined style={{ color: '#52c41a' }} /> 3.2% from last month
                  </div>
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Deductions" 
                    value={"₹1,36,600"} 
                    valueStyle={{ color: '#faad14' }}
                  />
                  <div className="statistic-change">
                    <FallOutlined style={{ color: '#52c41a' }} /> 2.1% from last month
                  </div>
                </Col>
              </Row>
              <Divider style={{ margin: '16px 0' }} />
              <div className="dept-breakdown">
                <Title level={5}>Department Breakdown</Title>
                <div className="chart-bar">
                  <div className="bar-label">IT Department</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '35%', backgroundColor: '#1890ff' }}></div>
                    <div className="bar-value">₹1,94,950</div>
                  </div>
                </div>
                <div className="chart-bar">
                  <div className="bar-label">HR Department</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '30%', backgroundColor: '#722ed1' }}></div>
                    <div className="bar-value">₹1,67,100</div>
                  </div>
                </div>
                <div className="chart-bar">
                  <div className="bar-label">Finance Department</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '20%', backgroundColor: '#52c41a' }}></div>
                    <div className="bar-value">₹1,18,300</div>
                  </div>
                </div>
                <div className="chart-bar">
                  <div className="bar-label">Marketing Department</div>
                  <div className="bar-container">
                    <div className="bar" style={{ width: '15%', backgroundColor: '#fa8c16' }}></div>
                    <div className="bar-value">₹89,150</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title="Recent Activities" 
            extra={<Button type="link" size="small">View All</Button>}
            className="animated-card"
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'Payroll Processed', description: 'June 2025 payroll processed and scheduled for payment', time: '1 day ago', icon: <CheckCircleOutlined style={{ color: '#52c41a' }} /> },
                { title: 'Salary Revision', description: 'Annual salary revisions approved for 12 employees', time: '3 days ago', icon: <RiseOutlined style={{ color: '#722ed1' }} /> },
                { title: 'Tax Adjustment', description: 'TDS adjustments processed for Q1 2025', time: '1 week ago', icon: <DollarOutlined style={{ color: '#faad14' }} /> },
                { title: 'Bonus Calculation', description: 'Performance bonus calculated for Q2 2025', time: '2 weeks ago', icon: <RiseOutlined style={{ color: '#1890ff' }} /> }
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={item.icon} />}
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text>{item.description}</Text>
                        <Text type="secondary">{item.time}</Text>
                      </Space>
                    }
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

export default PayrollTab;