import React, { useState } from 'react';
import { Drawer, Form, Button, Radio, Select, Checkbox, Typography, Space, Divider, DatePicker, Card, List, Tabs } from 'antd';
import { ExportOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined, DownloadOutlined, SettingOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ExportDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ExportDrawer: React.FC<ExportDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [exportType, setExportType] = useState<string>('transactions');
  const [fileFormat, setFileFormat] = useState<string>('excel');
  
  const reportTypes = [
    {
      title: 'Transactions',
      value: 'transactions',
      icon: <FileTextOutlined style={{ color: '#1890ff' }} />,
      description: 'Export all income and expense transactions'
    },
    {
      title: 'Balance Sheet',
      value: 'balance',
      icon: <FileExcelOutlined style={{ color: '#52c41a' }} />,
      description: 'Export current balance sheet report'
    },
    {
      title: 'Profit & Loss',
      value: 'profit_loss',
      icon: <FilePdfOutlined style={{ color: '#fa8c16' }} />,
      description: 'Export profit and loss statement'
    },
    {
      title: 'Tax Report',
      value: 'tax',
      icon: <FileTextOutlined style={{ color: '#eb2f96' }} />,
      description: 'Export tax summary report'
    },
    {
      title: 'Customer Statement',
      value: 'customer',
      icon: <FileExcelOutlined style={{ color: '#722ed1' }} />,
      description: 'Export customer account statement'
    },
    {
      title: 'Vendor Statement',
      value: 'vendor',
      icon: <FilePdfOutlined style={{ color: '#13c2c2' }} />,
      description: 'Export vendor account statement'
    }
  ];

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Export values:', values);
      // Mock export download
      setTimeout(() => {
        onClose();
        form.resetFields();
      }, 1000);
    }).catch(info => {
      console.log('Validation failed:', info);
    });
  };

  const handleExportTypeChange = (e: any) => {
    setExportType(e.target.value);
  };

  const handleFileFormatChange = (value: string) => {
    setFileFormat(value);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ExportOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />
          <span>Export Data</span>
        </div>
      }
      width={520}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleSubmit}>
            Export
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ 
          exportType: 'transactions',
          fileFormat: 'excel',
          includeHeaders: true,
        }}
      >
        <Form.Item
          name="exportType"
          label="What would you like to export?"
          rules={[{ required: true, message: 'Please select export type' }]}
        >
          <Radio.Group onChange={handleExportTypeChange} style={{ width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {reportTypes.map(report => (
                <Card 
                  key={report.value} 
                  style={{ 
                    marginBottom: 8,
                    border: exportType === report.value ? `1px solid #1890ff` : '1px solid #e8e8e8',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: exportType === report.value ? '#f0f7ff' : '#fff',
                  }}
                  bodyStyle={{ padding: '12px 16px' }}
                  onClick={() => form.setFieldsValue({ exportType: report.value })}
                >
                  <Radio value={report.value}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        marginRight: 12,
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        borderRadius: 8,
                        background: exportType === report.value ? '#e6f7ff' : '#f5f5f5',
                      }}>
                        {report.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{report.title}</div>
                        <div style={{ fontSize: '12px', color: '#00000073' }}>{report.description}</div>
                      </div>
                    </div>
                  </Radio>
                </Card>
              ))}
            </Space>
          </Radio.Group>
        </Form.Item>

        <Divider />
        
        <Form.Item
          name="dateRange"
          label="Date Range"
        >
          <RangePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD"
            allowClear
            placeholder={['Start Date', 'End Date']}
          />
        </Form.Item>

        <Form.Item
          name="fileFormat"
          label="File Format"
          rules={[{ required: true, message: 'Please select file format' }]}
        >
          <Select onChange={handleFileFormatChange}>
            <Option value="excel">Excel (.xlsx)</Option>
            <Option value="csv">CSV (.csv)</Option>
            <Option value="pdf">PDF (.pdf)</Option>
            <Option value="json">JSON (.json)</Option>
          </Select>
        </Form.Item>

        <Form.Item name="advancedOptions" label="Advanced Options">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Checkbox checked={true}>Include column headers</Checkbox>
            <Checkbox>Include summary totals</Checkbox>
            <Checkbox>Format numbers and dates</Checkbox>
          </Space>
        </Form.Item>
        
        <Divider />
        
        <Card 
          size="small"
          title={<Text strong style={{ fontSize: '14px' }}>Export Preview</Text>}
          style={{ marginBottom: 16 }}
          extra={<Button type="link" icon={<SettingOutlined />} size="small">Configure</Button>}
        >
          <List
            size="small"
            dataSource={[
              'Total Records: 467',
              'Date Range: All dates',
              fileFormat === 'excel' ? 'Format: Microsoft Excel (.xlsx)' : 
                fileFormat === 'pdf' ? 'Format: PDF Document (.pdf)' : 
                fileFormat === 'csv' ? 'Format: CSV (.csv)' : 'Format: JSON (.json)',
              'Size: ~128 KB'
            ]}
            renderItem={item => (
              <List.Item>
                <Text style={{ fontSize: '13px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {item}
                </Text>
              </List.Item>
            )}
          />
        </Card>

        <Paragraph type="secondary" style={{ fontSize: '13px' }}>
          Exported data will be compiled according to your selections. Large datasets may take longer to process.
        </Paragraph>
      </Form>
    </Drawer>
  );
};

export default ExportDrawer;
