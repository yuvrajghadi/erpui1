import React, { useState } from 'react';
import { Drawer, Form, Button, Radio, Select, DatePicker, Typography, Card, Tabs, Space, Divider, List, Tag } from 'antd';
import {
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
  DollarOutlined,
  DownloadOutlined,
  PrinterOutlined,
  MailOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface ReportDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ReportDrawer: React.FC<ReportDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [reportType, setReportType] = useState<string>('financial');
  
  const reportTypes = [
    {
      key: 'financial',
      name: 'Financial Reports',
      icon: <DollarOutlined style={{ color: '#1890ff' }} />,
      reports: [
        { title: 'Balance Sheet', format: ['pdf', 'excel'], tag: 'Standard' },
        { title: 'Profit & Loss Statement', format: ['pdf', 'excel'], tag: 'Standard' },
        { title: 'Cash Flow Statement', format: ['pdf', 'excel'], tag: 'Standard' },
        { title: 'Trial Balance', format: ['excel'], tag: 'Advanced' },
      ]
    },
    {
      key: 'tax',
      name: 'Tax Reports',
      icon: <FileTextOutlined style={{ color: '#52c41a' }} />,
      reports: [
        { title: 'GST Summary', format: ['pdf', 'excel'], tag: 'Monthly' },
        { title: 'Tax Liability Report', format: ['pdf', 'excel'], tag: 'Quarterly' },
        { title: 'Income Tax Computation', format: ['pdf'], tag: 'Annual' },
      ]
    },
    {
      key: 'transactions',
      name: 'Transaction Reports',
      icon: <BarChartOutlined style={{ color: '#fa8c16' }} />,
      reports: [
        { title: 'Sales Report', format: ['pdf', 'excel'], tag: '' },
        { title: 'Purchase Report', format: ['pdf', 'excel'], tag: '' },
        { title: 'Expense Report', format: ['pdf', 'excel'], tag: '' },
      ]
    },
    {
      key: 'accounts',
      name: 'Account Reports',
      icon: <PieChartOutlined style={{ color: '#eb2f96' }} />,
      reports: [
        { title: 'Accounts Receivable Aging', format: ['pdf', 'excel'], tag: '' },
        { title: 'Accounts Payable Aging', format: ['pdf', 'excel'], tag: '' },
        { title: 'Bank Reconciliation Report', format: ['pdf'], tag: '' },
      ]
    }
  ];

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Report values:', values);
      setTimeout(() => {
        onClose();
      }, 1000);
    }).catch(info => {
      console.log('Validation failed:', info);
    });
  };

  const handleTabChange = (key: string) => {
    setReportType(key);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileTextOutlined style={{ color: '#52c41a', fontSize: '18px' }} />
          <span>Generate Report</span>
        </div>
      }
      width={620}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleSubmit}>
            Generate
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form form={form} layout="vertical">
        <Tabs 
          activeKey={reportType} 
          onChange={handleTabChange} 
          type="card"
          tabPosition="left"
          style={{ 
            minHeight: 500,
          }}
        >
          {reportTypes.map((group) => (
            <TabPane 
              tab={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0' }}>
                  {group.icon}
                  <span>{group.name}</span>
                </div>
              } 
              key={group.key}
            >
              <Title level={5} style={{ marginBottom: 16 }}>{group.name}</Title>
              <Paragraph type="secondary" style={{ marginBottom: 24 }}>
                Select a report type and customize parameters to generate your report.
              </Paragraph>

              <Form.Item
                name={`${group.key}ReportType`}
                label="Report Type"
                rules={[{ required: true, message: 'Please select a report type' }]}
              >
                <Radio.Group style={{ width: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {group.reports.map((report, index) => (
                      <Card
                        key={index}
                        size="small"
                        style={{
                          marginBottom: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                        }}
                        hoverable
                      >
                        <Radio value={report.title.toLowerCase().replace(/\s+/g, '_')}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div>
                              <Text strong>{report.title}</Text>
                              {report.tag && (
                                <Tag
                                  color={report.tag === 'Standard' ? 'blue' : report.tag === 'Advanced' ? 'purple' : 'orange'}
                                  style={{ marginLeft: 8 }}
                                >
                                  {report.tag}
                                </Tag>
                              )}
                            </div>
                            <Space>
                              {report.format.includes('pdf') && <FilePdfOutlined style={{ color: '#ff4d4f' }} />}
                              {report.format.includes('excel') && <FileExcelOutlined style={{ color: '#52c41a' }} />}
                            </Space>
                          </div>
                        </Radio>
                      </Card>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Divider />

              <Form.Item
                name={`${group.key}DateRange`}
                label="Date Range"
                rules={[{ required: true, message: 'Please select date range' }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name={`${group.key}Format`} label="Output Format" initialValue="pdf">
                <Radio.Group>
                  <Radio.Button value="pdf">
                    <FilePdfOutlined /> PDF
                  </Radio.Button>
                  <Radio.Button value="excel">
                    <FileExcelOutlined /> Excel
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item 
                name={`${group.key}AdditionalOptions`}
                label="Additional Options"
              >
                <Card size="small" bordered={false} style={{ backgroundColor: '#f5f5f5' }}>
                  <List size="small" split={false}>
                    <List.Item>
                      <Radio.Group name="comparison" style={{ width: '100%' }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Radio value="none">No comparison</Radio>
                          <Radio value="previous_period">Compare with previous period</Radio>
                          <Radio value="previous_year">Compare with previous year</Radio>
                        </Space>
                      </Radio.Group>
                    </List.Item>
                  </List>
                </Card>
              </Form.Item>
              
              <Divider />
              
              <Form.Item label="Delivery Options">
                <Space>
                  <Button icon={<DownloadOutlined />}>Download</Button>
                  <Button icon={<PrinterOutlined />}>Print</Button>
                  <Button icon={<MailOutlined />}>Email</Button>
                </Space>
              </Form.Item>
            </TabPane>
          ))}
        </Tabs>
      </Form>
    </Drawer>
  );
};

export default ReportDrawer;
