import React, { useState } from 'react';
import { Drawer, Tabs, Form, Button, DatePicker, Table, Space, Typography, Card, Tag, Progress, Alert, Select, Statistic, Divider, List, Badge } from 'antd';
import { CalculatorOutlined, CalendarOutlined, FileTextOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined, DownloadOutlined, BarChartOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface TaxDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface TaxEntry {
  id: string;
  type: string;
  period: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'filed';
}

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  applicable: string;
  lastUpdated: string;
}

const TaxDrawer: React.FC<TaxDrawerProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Mock data for tax entries
  const taxEntries: TaxEntry[] = [
    { id: '1', type: 'GST', period: 'Apr-Jun 2023', dueDate: '2023-07-15', amount: 12500, status: 'pending' },
    { id: '2', type: 'Income Tax', period: 'FY 2022-2023', dueDate: '2023-07-31', amount: 35000, status: 'pending' },
    { id: '3', type: 'Payroll Tax', period: 'Jun 2023', dueDate: '2023-07-10', amount: 3200, status: 'overdue' },
    { id: '4', type: 'GST', period: 'Jan-Mar 2023', dueDate: '2023-04-15', amount: 10800, status: 'paid' },
    { id: '5', type: 'Withholding Tax', period: 'Q2 2023', dueDate: '2023-07-20', amount: 1500, status: 'pending' },
    { id: '6', type: 'Corporate Tax', period: 'FY 2022-2023', dueDate: '2023-09-30', amount: 28000, status: 'pending' },
  ];

  // Mock data for tax rates
  const taxRates: TaxRate[] = [
    { id: '1', name: 'GST Standard Rate', rate: 10, applicable: 'Goods and Services', lastUpdated: '2023-01-01' },
    { id: '2', name: 'Income Tax - Tier 1', rate: 15, applicable: 'Income up to ₹50,000', lastUpdated: '2023-03-15' },
    { id: '3', name: 'Income Tax - Tier 2', rate: 30, applicable: 'Income ₹50,001 to ₹120,000', lastUpdated: '2023-03-15' },
    { id: '4', name: 'Payroll Tax', rate: 4.75, applicable: 'Employee wages', lastUpdated: '2023-01-01' },
    { id: '5', name: 'Withholding Tax', rate: 10, applicable: 'Dividends, Interest, Royalties', lastUpdated: '2023-02-10' },
    { id: '6', name: 'Corporate Tax', rate: 25, applicable: 'Company profits', lastUpdated: '2023-01-01' },
  ];

  // Tax entries table columns
  const taxEntryColumns: TableProps<TaxEntry>['columns'] = [
    {
      title: 'Tax Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'GST', value: 'GST' },
        { text: 'Income Tax', value: 'Income Tax' },
        { text: 'Payroll Tax', value: 'Payroll Tax' },
        { text: 'Withholding Tax', value: 'Withholding Tax' },
        { text: 'Corporate Tax', value: 'Corporate Tax' },
      ],
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      render: (dueDate: string) => {
        const date = new Date(dueDate);
        const today = new Date();
        const daysRemaining = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <Space direction="vertical" size={0}>
            <Text>{dueDate}</Text>
            {daysRemaining > 0 && daysRemaining <= 15 ? (
              <Text type="warning" style={{ fontSize: '12px' }}>
                {daysRemaining} days left
              </Text>
            ) : daysRemaining <= 0 ? (
              <Text type="danger" style={{ fontSize: '12px' }}>
                Overdue
              </Text>
            ) : null}
          </Space>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      render: (amount: number) => (
        <Text strong>₹{amount.toLocaleString('en-US')}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Pending', value: 'pending' },
        { text: 'Overdue', value: 'overdue' },
        { text: 'Filed', value: 'filed' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case 'paid':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'pending':
            color = 'warning';
            icon = <ClockCircleOutlined />;
            break;
          case 'overdue':
            color = 'error';
            icon = <ExclamationCircleOutlined />;
            break;
          case 'filed':
            color = 'processing';
            icon = <FileTextOutlined />;
            break;
        }
        
        return (
          <Tag color={color} icon={icon} style={{ textTransform: 'capitalize' }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            View
          </Button>
          {record.status !== 'paid' && (
            <Button type="link" size="small">
              Pay
            </Button>
          )}
          <Button type="link" size="small">
            File
          </Button>
        </Space>
      ),
    },
  ];

  // Tax rates table columns
  const taxRateColumns: TableProps<TaxRate>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `${rate}%`,
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: 'Applicable To',
      dataIndex: 'applicable',
      key: 'applicable',
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          Edit
        </Button>
      ),
    },
  ];

  // Calculate tax summary
  const pendingAmount = taxEntries
    .filter(entry => entry.status === 'pending' || entry.status === 'overdue')
    .reduce((sum, entry) => sum + entry.amount, 0);
  
  const paidAmount = taxEntries
    .filter(entry => entry.status === 'paid')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const overdueEntries = taxEntries.filter(entry => entry.status === 'overdue');
  const upcomingEntries = taxEntries.filter(entry => 
    entry.status === 'pending' && 
    new Date(entry.dueDate) > new Date() && 
    new Date(entry.dueDate) <= new Date(new Date().setDate(new Date().getDate() + 30))
  );

  const renderOverviewTab = () => (
    <>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <Card style={{ flex: 1 }}>
          <Statistic
            title="Pending Tax"
            value={pendingAmount}
            precision={2}            valueStyle={{ color: '#faad14' }}
            prefix="₹"
            suffix={
              <span style={{ fontSize: '14px', color: '#00000073' }}>
                <ArrowUpOutlined /> 5.2%
              </span>
            }
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic
            title="Tax Paid (YTD)"
            value={paidAmount}
            precision={2}            valueStyle={{ color: '#52c41a' }}
            prefix="₹"
            suffix={
              <span style={{ fontSize: '14px', color: '#00000073' }}>
                <ArrowUpOutlined /> 12.5%
              </span>
            }
          />
        </Card>
        <Card style={{ flex: 1 }}>
          <Statistic
            title="Effective Tax Rate"
            value={22.5}
            precision={1}
            valueStyle={{ color: '#1890ff' }}
            suffix="%"
          />
        </Card>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <Title level={5} style={{ marginBottom: '16px' }}>Tax Compliance Calendar</Title>
        <Alert
          message="Tax Filing Reminder"
          description="GST for Apr-Jun 2023 is due in 15 days. Please ensure timely filing to avoid penalties."
          type="warning"
          showIcon
          style={{ marginBottom: '16px' }}
          action={
            <Button size="small" type="primary">
              File Now
            </Button>
          }
        />

        <Card title="Upcoming Tax Deadlines" size="small">
          <List
            size="small"
            dataSource={upcomingEntries}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" key="file" size="small">
                    File
                  </Button>,
                  <Button type="link" key="pay" size="small">
                    Pay
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<CalendarOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                  title={item.type}
                  description={`Due on ${item.dueDate} · ₹${item.amount.toLocaleString('en-US')}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>

      {overdueEntries.length > 0 && (
        <Alert
          message={`${overdueEntries.length} Overdue Tax Obligations`}
          description="You have overdue tax payments that require immediate attention to avoid penalties."
          type="error"
          showIcon
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" danger>
              View & Pay
            </Button>
          }
        />
      )}

      <Card title="Tax Health Overview" size="small">
        <div style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>Filing Compliance</Text>
              <Progress percent={92} size="small" status="active" />
            </div>
            <div>
              <Text>Payment Compliance</Text>
              <Progress percent={85} size="small" status="active" />
            </div>
            <div>
              <Text>Documentation Completeness</Text>
              <Progress percent={78} size="small" status="active" />
            </div>
          </Space>
        </div>
      </Card>
    </>
  );

  const renderTaxPaymentsTab = () => (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Title level={5}>Tax Payments & Filings</Title>
          <Paragraph type="secondary">
            View, manage, and make tax payments for all types of taxes.
          </Paragraph>
        </div>

        <Space>
          <Button icon={<BarChartOutlined />}>Analytics</Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button type="primary" icon={<FileTextOutlined />}>New Filing</Button>
        </Space>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">All Tax Types</Option>
            <Option value="gst">GST</Option>
            <Option value="income">Income Tax</Option>
            <Option value="payroll">Payroll Tax</Option>
            <Option value="withholding">Withholding Tax</Option>
            <Option value="corporate">Corporate Tax</Option>
          </Select>

          <Select defaultValue="all" style={{ width: 150 }}>
            <Option value="all">All Statuses</Option>
            <Option value="paid">Paid</Option>
            <Option value="pending">Pending</Option>
            <Option value="overdue">Overdue</Option>
            <Option value="filed">Filed</Option>
          </Select>

          <RangePicker />
        </Space>
      </div>

      <Table
        columns={taxEntryColumns}
        dataSource={taxEntries}
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 5 }}
        style={{ marginBottom: '24px' }}
      />

      <div style={{ display: 'flex', gap: '16px' }}>
        <Card size="small" title="Payment Methods" style={{ flex: 1 }}>
          <List
            size="small"
            dataSource={['Bank Transfer', 'Credit Card', 'Direct Debit', 'Online Banking']}
            renderItem={(item) => (
              <List.Item>
                {item}
              </List.Item>
            )}
          />
        </Card>

        <Card size="small" title="Tax Authority Contacts" style={{ flex: 1 }}>
          <List
            size="small"
            dataSource={[
              { name: 'Tax Office Helpline', value: '1800-TAX-HELP' },
              { name: 'GST Inquiries', value: 'gst@taxoffice.gov' },
              { name: 'Income Tax Support', value: 'income@taxoffice.gov' },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Text strong>{item.name}:</Text> {item.value}
              </List.Item>
            )}
          />
        </Card>
      </div>
    </>
  );

  const renderTaxRatesTab = () => (
    <>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Title level={5}>Tax Rates & Settings</Title>
          <Paragraph type="secondary">
            View and configure tax rates and settings for your organization.
          </Paragraph>
        </div>

        <Space>
          <Button type="primary">Add Tax Rate</Button>
        </Space>
      </div>

      <Table
        columns={taxRateColumns}
        dataSource={taxRates}
        rowKey="id"
        size="middle"
        pagination={false}
        style={{ marginBottom: '24px' }}
      />

      <Card title="Tax Configuration" size="small">
        <Form layout="vertical">
          <Form.Item label="Default Tax Calculation Method">
            <Select defaultValue="accrual">
              <Option value="accrual">Accrual Basis</Option>
              <Option value="cash">Cash Basis</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tax Reporting Currency">
            <Select defaultValue="inr">
              <Option value="inr">INR (₹)</Option>
              <Option value="eur">EUR (€)</Option>
              <Option value="gbp">GBP (£)</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Tax Year End Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Card>
    </>
  );

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CalculatorOutlined style={{ color: '#eb2f96', fontSize: '18px' }} />
          <span>Tax Management</span>
        </div>
      }
      width={720}
      open={open}
      onClose={onClose}
      footer={null}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Tabs activeKey={activeTab} onChange={handleTabChange} style={{ marginBottom: 24 }}>
        <TabPane tab="Overview" key="overview" />
        <TabPane tab="Tax Payments" key="payments" />
        <TabPane tab="Tax Rates" key="rates" />
      </Tabs>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'payments' && renderTaxPaymentsTab()}
      {activeTab === 'rates' && renderTaxRatesTab()}
    </Drawer>
  );
};

export default TaxDrawer;
