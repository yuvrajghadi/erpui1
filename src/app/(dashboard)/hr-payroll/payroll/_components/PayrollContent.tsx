'use client';

import React from 'react';
import { Card, Table, Button, Space, Typography, Select, DatePicker, Row, Col, Statistic, Tag } from 'antd';
import { DollarOutlined, SolutionOutlined, FileTextOutlined, WarningOutlined, DownloadOutlined } from '@ant-design/icons';
import '../payroll.scss';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface PayrollRecord {
  key: string;
  id: string;
  name: string;
  payPeriod: string;
  grossPay: number;
  netPay: number;
  status: string;
}

const PayrollContent: React.FC = () => {
  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Pay Period',
      dataIndex: 'payPeriod',
      key: 'payPeriod',
    },
    {
      title: 'Gross Pay',
      dataIndex: 'grossPay',
      key: 'grossPay',
      render: (text: number) => <Text strong>${text.toFixed(2)}</Text>,
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
      render: (text: number) => <Text type="success" strong>${text.toFixed(2)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Paid' ? 'green' : (status === 'Pending' ? 'orange' : 'red')}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<FileTextOutlined />}>View Details</Button>
          <Button type="link" icon={<DownloadOutlined />}>Generate Slip</Button>
        </Space>
      ),
    },
  ];

  const data: PayrollRecord[] = [
    {
      key: '1',
      id: 'EMP001',
      name: 'John Doe',
      payPeriod: 'Mar 1 - Mar 15, 2024',
      grossPay: 2500.00,
      netPay: 2200.00,
      status: 'Paid',
    },
    {
      key: '2',
      id: 'EMP002',
      name: 'Jane Smith',
      payPeriod: 'Mar 1 - Mar 15, 2024',
      grossPay: 3000.00,
      netPay: 2600.00,
      status: 'Paid',
    },
    {
      key: '3',
      id: 'EMP003',
      name: 'Peter Jones',
      payPeriod: 'Mar 1 - Mar 15, 2024',
      grossPay: 1800.00,
      netPay: 1600.00,
      status: 'Pending',
    },
    {
      key: '4',
      id: 'EMP004',
      name: 'Alice Brown',
      payPeriod: 'Mar 16 - Mar 31, 2024',
      grossPay: 2700.00,
      netPay: 2400.00,
      status: 'Paid',
    },
    {
      key: '5',
      id: 'EMP005',
      name: 'Charlie Green',
      payPeriod: 'Mar 16 - Mar 31, 2024',
      grossPay: 2200.00,
      netPay: 1950.00,
      status: 'Pending',
    },
  ];

  return (
    <div className="payroll-page-container">
      <Card className="payroll-summary-card animated-card">
        <Title level={4} className="card-title">Payroll Overview</Title>
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={8} lg={8}>
            <Card className="statistic-card">
              <Statistic
                title="Total Paid Salaries"
                value={150000}
                prefix={<DollarOutlined className="icon-large icon-success" />}
                valueStyle={{ color: '#3f8600' }}
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Card className="statistic-card">
              <Statistic
                title="Pending Payments"
                value={15000}
                prefix={<WarningOutlined className="icon-large icon-warning" />}
                valueStyle={{ color: '#cf1322' }}
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Card className="statistic-card">
              <Statistic
                title="Employees on Payroll"
                value={120}
                prefix={<SolutionOutlined className="icon-large icon-info" />}
                valueStyle={{ color: '#0050b3' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card className="payroll-table-card animated-card">
        <div className="table-actions-header">
          <Title level={4} className="card-title">Payroll Records</Title>
          <Space direction="vertical" size="middle" className="filter-generate-section">
            <div className="filters">
              <Select defaultValue="all" style={{ width: 120 }} className="responsive-select">
                <Option value="all">All Status</Option>
                <Option value="paid">Paid</Option>
                <Option value="pending">Pending</Option>
                <Option value="failed">Failed</Option>
              </Select>
              <RangePicker className="responsive-datepicker" />
            </div>
            <div className="action-buttons">
              <Button type="primary">Filter</Button>
              <Button icon={<DownloadOutlined />}>Export</Button>
              <Button type="primary" icon={<SolutionOutlined />}>Generate Payroll</Button>
            </div>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 8 }} 
          className="payroll-table"
          rowClassName="payroll-table-row"
        />
      </Card>
    </div>
  );
};

export default PayrollContent;
