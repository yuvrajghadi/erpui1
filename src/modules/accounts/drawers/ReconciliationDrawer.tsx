import React, { useState } from 'react';
import { Drawer, Form, Button, DatePicker, Select, Table, Space, Typography, Checkbox, Statistic, Divider, Card, Alert, Tag } from 'antd';
import { BankOutlined, CheckOutlined, CloseOutlined, SearchOutlined, SyncOutlined, FileTextOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ReconciliationDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  cleared: boolean;
  isDeposit: boolean;
}

const ReconciliationDrawer: React.FC<ReconciliationDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  
  // Mock data
  const transactions: Transaction[] = [
    { id: '1', date: '2023-06-10', description: 'Client Payment - ABC Corp', reference: 'INV-2023-056', amount: 5000, cleared: false, isDeposit: true },
    { id: '2', date: '2023-06-11', description: 'Office Supplies', reference: 'PO-2023-112', amount: 350, cleared: false, isDeposit: false },
    { id: '3', date: '2023-06-12', description: 'Utility Bill Payment', reference: 'UTIL-062023', amount: 420, cleared: false, isDeposit: false },
    { id: '4', date: '2023-06-15', description: 'Client Payment - XYZ Ltd', reference: 'INV-2023-057', amount: 3200, cleared: false, isDeposit: true },
    { id: '5', date: '2023-06-16', description: 'Subscription Services', reference: 'SUB-2023-06', amount: 199, cleared: false, isDeposit: false },
    { id: '6', date: '2023-06-18', description: 'Equipment Purchase', reference: 'PO-2023-113', amount: 1200, cleared: false, isDeposit: false },
  ];

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      console.log('Selected transactions:', selectedRowKeys);
      onClose();
      form.resetFields();
      setCurrentStep(0);
      setSelectedRowKeys([]);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns: TableProps<Transaction>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'Type',
      key: 'type',
      render: (_, record) => (
        <Tag color={record.isDeposit ? 'green' : 'red'}>
          {record.isDeposit ? 'Deposit' : 'Withdrawal'}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text style={{ 
          color: record.isDeposit ? '#52c41a' : '#ff4d4f',
          fontWeight: 500
        }}>
          {record.isDeposit ? '+' : '-'}₹{amount.toLocaleString('en-US')}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Checkbox checked={selectedRowKeys.includes(record.id)} />
      ),
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Form.Item
              name="account"
              label="Select Bank Account"
              rules={[{ required: true, message: 'Please select a bank account' }]}
              initialValue="checking"
            >
              <Select placeholder="Select bank account">
                <Option value="checking">Checking Account (****1234)</Option>
                <Option value="savings">Savings Account (****5678)</Option>
                <Option value="business">Business Account (****9012)</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="statementDate"
              label="Statement Date"
              rules={[{ required: true, message: 'Please select statement date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="statementBalance"
              label="Statement Ending Balance"
              rules={[{ required: true, message: 'Please enter statement balance' }]}
            >
              <input 
                type="number"
                step="0.01"
                className="ant-input"
                placeholder="0.00"
              />
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="Transaction Date Range"
              rules={[{ required: true, message: 'Please select date range' }]}
            >
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Alert
              message="Prepare your bank statement"
              description="Have your bank statement ready to compare with your accounting records. This will help you identify any discrepancies."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <div style={{ textAlign: 'right', marginTop: 24 }}>
              <Button type="primary" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </>
        );
      case 1:
        // Calculate statistics
        const selectedTransactions = transactions.filter(t => selectedRowKeys.includes(t.id));
        const totalDeposits = selectedTransactions
          .filter(t => t.isDeposit)
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalWithdrawals = selectedTransactions
          .filter(t => !t.isDeposit)
          .reduce((sum, t) => sum + t.amount, 0);

        return (
          <>
            <Alert
              message="Match Transactions"
              description="Select all transactions that appear on your bank statement. Unselected transactions will be considered as outstanding items."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <div style={{ display: 'flex', gap: '16px', marginBottom: 24 }}>
              <Button 
                icon={<SearchOutlined />} 
                onClick={() => console.log('Filter transactions')}
              >
                Filter
              </Button>
              <Button 
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => setSelectedRowKeys(transactions.map(t => t.id))}
              >
                Select All
              </Button>
              <Button 
                danger
                icon={<CloseOutlined />}
                onClick={() => setSelectedRowKeys([])}
              >
                Clear All
              </Button>
            </div>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={transactions}
              rowKey="id"
              size="middle"
              pagination={false}
              scroll={{ y: 300 }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Space>
                <Statistic 
                  title="Selected Items" 
                  value={selectedRowKeys.length} 
                  suffix={`/ ${transactions.length}`} 
                />
              </Space>
              <Space>
                <Statistic                  title="Deposits" 
                  value={totalDeposits} 
                  prefix="₹"
                  valueStyle={{ color: '#52c41a' }}
                />
                <Statistic                  title="Withdrawals" 
                  value={totalWithdrawals} 
                  prefix="₹"
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Space>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Button onClick={handlePrevStep}>
                Previous
              </Button>
              <Button type="primary" onClick={handleNextStep}>
                Next
              </Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Alert
              message="Review & Finalize"
              description="Review the reconciliation summary before finalizing. Once finalized, selected transactions will be marked as reconciled."
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Card title="Reconciliation Summary" bordered={false} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Statement Ending Balance:</Text>
                <Text strong>₹8,650.00</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Book Balance:</Text>
                <Text strong>₹7,682.00</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Cleared Deposits:</Text>
                <Text strong style={{ color: '#52c41a' }}>₹8,200.00</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Cleared Withdrawals:</Text>
                <Text strong style={{ color: '#ff4d4f' }}>₹1,769.00</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Outstanding Deposits:</Text>
                <Text style={{ color: '#52c41a' }}>₹0.00</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Outstanding Withdrawals:</Text>
                <Text style={{ color: '#ff4d4f' }}>₹400.00</Text>
              </div>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Difference:</Text>
                <Text strong style={{ 
                  color: Math.abs(8650 - 7682 - 8200 + 1769) < 0.01 ? '#52c41a' : '#ff4d4f'
                }}>
                  ₹0.00
                </Text>
              </div>
            </Card>

            {Math.abs(8650 - 7682 - 8200 + 1769) < 0.01 ? (
              <Alert
                message="Reconciliation Balanced"
                description="Your bank reconciliation is balanced. You can now finalize it."
                type="success"
                showIcon
                style={{ marginBottom: 24 }}
              />
            ) : (
              <Alert
                message="Reconciliation Not Balanced"
                description="There's a difference between your bank statement and accounting records. Review your transactions again."
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <Button onClick={handlePrevStep}>
                Previous
              </Button>
              <Space>
                <Button icon={<FileTextOutlined />} onClick={() => console.log('Print report')}>
                  Print Report
                </Button>
                <Button type="primary" icon={<SyncOutlined />} onClick={handleSubmit}>
                  Finalize Reconciliation
                </Button>
              </Space>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BankOutlined style={{ color: '#fa8c16', fontSize: '18px' }} />
          <span>Bank Reconciliation</span>
        </div>
      }
      width={620}
      open={open}
      onClose={onClose}
      footer={null}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ flex: 1, height: 8, backgroundColor: currentStep >= 0 ? '#1890ff' : '#f0f0f0', marginRight: 4 }} />
          <div style={{ flex: 1, height: 8, backgroundColor: currentStep >= 1 ? '#1890ff' : '#f0f0f0', marginRight: 4 }} />
          <div style={{ flex: 1, height: 8, backgroundColor: currentStep >= 2 ? '#1890ff' : '#f0f0f0' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text strong={currentStep === 0}>Setup</Text>
          <Text strong={currentStep === 1}>Match</Text>
          <Text strong={currentStep === 2}>Finalize</Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          account: 'checking',
        }}
      >
        {renderStepContent()}
      </Form>
    </Drawer>
  );
};

export default ReconciliationDrawer;
