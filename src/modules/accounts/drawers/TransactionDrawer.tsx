import React, { useState } from 'react';
import { Drawer, Form, Input, Button, Select, DatePicker, InputNumber, Typography, Space, Divider } from 'antd';
import { 
  PlusOutlined,
  DollarOutlined,
  TagOutlined,
  CalendarOutlined,
  MessageOutlined,
  BankOutlined,
  UserOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface TransactionDrawerProps {
  open: boolean;
  onClose: () => void;
}

const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Transaction values:', values);
      form.resetFields();
      onClose();
    }).catch(info => {
      console.log('Validation failed:', info);
    });
  };

  const handleTypeChange = (value: 'income' | 'expense') => {
    setTransactionType(value);
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
          <span>Record Transaction</span>
        </div>
      }
      width={520}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Space>
      }
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: 'income', date: null }}
      >
        <Form.Item
          name="type"
          label="Transaction Type"
          rules={[{ required: true, message: 'Please select transaction type' }]}
        >
          <Select onChange={(value) => handleTypeChange(value as 'income' | 'expense')}>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <InputNumber
            style={{ width: '100%' }}            prefix={<DollarOutlined />}
            placeholder="0.00"
            formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD" 
            placeholder="Select date"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select category' }]}
        >
          <Select
            showSearch
            placeholder="Select a category"
            optionFilterProp="children"
            suffixIcon={<TagOutlined />}
          >
            {transactionType === 'income' ? (
              <>
                <Option value="sales">Sales</Option>
                <Option value="services">Services</Option>
                <Option value="interest">Interest</Option>
                <Option value="investment">Investment</Option>
                <Option value="other">Other Income</Option>
              </>
            ) : (
              <>
                <Option value="rent">Rent</Option>
                <Option value="utilities">Utilities</Option>
                <Option value="salaries">Salaries</Option>
                <Option value="office">Office Supplies</Option>
                <Option value="advertising">Advertising</Option>
                <Option value="other">Other Expenses</Option>
              </>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >          <TextArea
            rows={4}
            placeholder="Enter transaction description"
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Divider />
        
        <Title level={5}>Additional Details</Title>
        
        <Form.Item name="paymentMethod" label="Payment Method">
          <Select placeholder="Select payment method">
            <Option value="cash">Cash</Option>
            <Option value="bank">Bank Transfer</Option>
            <Option value="credit">Credit Card</Option>
            <Option value="cheque">Cheque</Option>
          </Select>
        </Form.Item>

        <Form.Item name="account" label="Account">
          <Select placeholder="Select account" suffixIcon={<BankOutlined />}>
            <Option value="checking">Checking Account</Option>
            <Option value="savings">Savings Account</Option>
            <Option value="cash">Cash Account</Option>
          </Select>
        </Form.Item>

        <Form.Item name="reference" label="Reference/Invoice Number">
          <Input placeholder="Enter reference number" />
        </Form.Item>

        {transactionType === 'income' ? (
          <Form.Item name="customer" label="Customer">
            <Select placeholder="Select customer" suffixIcon={<UserOutlined />}>
              <Option value="customer1">ABC Corporation</Option>
              <Option value="customer2">XYZ Ltd</Option>
              <Option value="customer3">123 Industries</Option>
              <Option value="new">+ Add New Customer</Option>
            </Select>
          </Form.Item>
        ) : (
          <Form.Item name="vendor" label="Vendor">
            <Select placeholder="Select vendor" suffixIcon={<UserOutlined />}>
              <Option value="vendor1">Office Supplies Inc</Option>
              <Option value="vendor2">Tech Solutions</Option>
              <Option value="vendor3">Marketing Agency</Option>
              <Option value="new">+ Add New Vendor</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item name="notes" label="Notes">
          <TextArea rows={3} placeholder="Enter additional notes" />
        </Form.Item>
      </Form>

      <div style={{ marginTop: '20px' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          <InfoCircleOutlined style={{ marginRight: '6px' }} />
          All transactions are automatically synced with your accounting system.
        </Text>
      </div>
    </Drawer>
  );
};

export default TransactionDrawer;
