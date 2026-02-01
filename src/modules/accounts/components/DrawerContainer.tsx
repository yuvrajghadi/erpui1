import React from 'react';
import { Drawer, Form, Input, Select, DatePicker, Button, Space, InputNumber, Upload, message } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface DrawerContainerProps {
  visible: boolean;
  drawerType: string;
  onClose: () => void;
}

const DrawerContainer: React.FC<DrawerContainerProps> = ({ visible, drawerType, onClose }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Form values:', values);
      message.success(`${drawerType} created successfully`);
      form.resetFields();
      onClose();
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo);
    });
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const renderDrawerContent = () => {
    switch (drawerType) {
      case 'invoice':
        return renderInvoiceForm();
      case 'bill':
        return renderBillForm();
      case 'tax':
        return renderTaxForm();
      case 'gst':
        return renderGSTForm();
      case 'tds':
        return renderTDSForm();
      case 'bank-account':
        return renderBankAccountForm();
      case 'transaction':
        return renderTransactionForm();
      case 'import':
        return renderImportForm();
      default:
        return <div>No form available for {drawerType}</div>;
    }
  };

  const renderInvoiceForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="customer" label="Customer" rules={[{ required: true, message: 'Please select a customer' }]}>
        <Select placeholder="Select a customer">
          <Option value="customer1">ABC Enterprises</Option>
          <Option value="customer2">XYZ Corporation</Option>
          <Option value="customer3">123 Industries</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true, message: 'Please enter invoice number' }]}>
        <Input placeholder="INV-2023-" />
      </Form.Item>
      
      <Form.Item name="date" label="Invoice Date" rules={[{ required: true, message: 'Please select invoice date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please select due date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Items" required>
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[{ required: true, message: 'Missing description' }]}
                  >
                    <Input placeholder="Item description" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Missing quantity' }]}
                  >
                    <InputNumber placeholder="Qty" min={1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'rate']}
                    rules={[{ required: true, message: 'Missing rate' }]}
                  >
                    <InputNumber placeholder="Rate" min={0} />
                  </Form.Item>
                  <Button onClick={() => remove(name)} type="text" danger>
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Add Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      
      <Form.Item name="notes" label="Notes">
        <TextArea rows={4} placeholder="Additional notes or terms" />
      </Form.Item>
    </Form>
  );

  const renderBillForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="vendor" label="Vendor" rules={[{ required: true, message: 'Please select a vendor' }]}>
        <Select placeholder="Select a vendor">
          <Option value="vendor1">Office Supplies Ltd</Option>
          <Option value="vendor2">Tech Solutions Inc</Option>
          <Option value="vendor3">Utility Services Co</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="billNumber" label="Bill Number" rules={[{ required: true, message: 'Please enter bill number' }]}>
        <Input placeholder="BILL-2023-" />
      </Form.Item>
      
      <Form.Item name="date" label="Bill Date" rules={[{ required: true, message: 'Please select bill date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please select due date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item label="Items" required>
        <Form.List name="items">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    rules={[{ required: true, message: 'Missing description' }]}
                  >
                    <Input placeholder="Item description" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'quantity']}
                    rules={[{ required: true, message: 'Missing quantity' }]}
                  >
                    <InputNumber placeholder="Qty" min={1} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'rate']}
                    rules={[{ required: true, message: 'Missing rate' }]}
                  >
                    <InputNumber placeholder="Rate" min={0} />
                  </Form.Item>
                  <Button onClick={() => remove(name)} type="text" danger>
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  + Add Item
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      
      <Form.Item name="category" label="Expense Category" rules={[{ required: true, message: 'Please select a category' }]}>
        <Select placeholder="Select a category">
          <Option value="office">Office Supplies</Option>
          <Option value="rent">Rent</Option>
          <Option value="utilities">Utilities</Option>
          <Option value="services">Professional Services</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="notes" label="Notes">
        <TextArea rows={4} placeholder="Additional notes" />
      </Form.Item>
    </Form>
  );

  const renderTaxForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="taxType" label="Tax Type" rules={[{ required: true, message: 'Please select tax type' }]}>
        <Select placeholder="Select tax type">
          <Option value="income">Income Tax</Option>
          <Option value="property">Property Tax</Option>
          <Option value="professional">Professional Tax</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="period" label="Tax Period" rules={[{ required: true, message: 'Please select tax period' }]}>
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please select due date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter amount' }]}>
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="description" label="Description">
        <TextArea rows={4} placeholder="Tax description" />
      </Form.Item>
      
      <Form.Item name="documents" label="Upload Documents">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </Form>
  );

  const renderGSTForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="returnType" label="Return Type" rules={[{ required: true, message: 'Please select return type' }]}>
        <Select placeholder="Select return type">
          <Option value="gstr1">GSTR-1</Option>
          <Option value="gstr2">GSTR-2</Option>
          <Option value="gstr3b">GSTR-3B</Option>
          <Option value="gstr9">GSTR-9</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="period" label="Return Period" rules={[{ required: true, message: 'Please select return period' }]}>
        <DatePicker picker="month" style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: 'Please select due date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="taxableAmount" label="Taxable Amount" rules={[{ required: true, message: 'Please enter taxable amount' }]}>
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="taxAmount" label="Tax Amount" rules={[{ required: true, message: 'Please enter tax amount' }]}>
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
        <Select placeholder="Select status">
          <Option value="pending">Pending</Option>
          <Option value="filed">Filed</Option>
          <Option value="paid">Paid</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="documents" label="Upload Return Documents">
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">Support for a single or bulk upload.</p>
        </Upload.Dragger>
      </Form.Item>
    </Form>
  );

  const renderTDSForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="deducteeType" label="Deductee Type" rules={[{ required: true, message: 'Please select deductee type' }]}>
        <Select placeholder="Select deductee type">
          <Option value="individual">Individual</Option>
          <Option value="company">Company</Option>
          <Option value="firm">Firm</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="deducteeName" label="Deductee Name" rules={[{ required: true, message: 'Please enter deductee name' }]}>
        <Input placeholder="Enter deductee name" />
      </Form.Item>
      
      <Form.Item name="pan" label="PAN Number" rules={[{ required: true, message: 'Please enter PAN number' }]}>
        <Input placeholder="Enter PAN number" />
      </Form.Item>
      
      <Form.Item name="section" label="TDS Section" rules={[{ required: true, message: 'Please select TDS section' }]}>
        <Select placeholder="Select TDS section">
          <Option value="194a">194A - Interest</Option>
          <Option value="194c">194C - Contractors</Option>
          <Option value="194h">194H - Commission</Option>
          <Option value="194i">194I - Rent</Option>
          <Option value="194j">194J - Professional Fees</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="date" label="Deduction Date" rules={[{ required: true, message: 'Please select deduction date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="amount" label="Amount Paid" rules={[{ required: true, message: 'Please enter amount paid' }]}>
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="tdsAmount" label="TDS Amount" rules={[{ required: true, message: 'Please enter TDS amount' }]}>
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status' }]}>
        <Select placeholder="Select status">
          <Option value="pending">Pending</Option>
          <Option value="paid">Paid</Option>
          <Option value="filed">Filed</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="remarks" label="Remarks">
        <TextArea rows={4} placeholder="Additional remarks" />
      </Form.Item>
    </Form>
  );

  const renderBankAccountForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="accountName" label="Account Name" rules={[{ required: true, message: 'Please enter account name' }]}>
        <Input placeholder="Enter account name" />
      </Form.Item>
      
      <Form.Item name="accountNumber" label="Account Number" rules={[{ required: true, message: 'Please enter account number' }]}>
        <Input placeholder="Enter account number" />
      </Form.Item>
      
      <Form.Item name="bankName" label="Bank Name" rules={[{ required: true, message: 'Please enter bank name' }]}>
        <Input placeholder="Enter bank name" />
      </Form.Item>
      
      <Form.Item name="branch" label="Branch" rules={[{ required: true, message: 'Please enter branch name' }]}>
        <Input placeholder="Enter branch name" />
      </Form.Item>
      
      <Form.Item name="ifsc" label="IFSC Code" rules={[{ required: true, message: 'Please enter IFSC code' }]}>
        <Input placeholder="Enter IFSC code" />
      </Form.Item>
      
      <Form.Item name="accountType" label="Account Type" rules={[{ required: true, message: 'Please select account type' }]}>
        <Select placeholder="Select account type">
          <Option value="current">Current</Option>
          <Option value="savings">Savings</Option>
          <Option value="overdraft">Overdraft</Option>
          <Option value="fixed">Fixed Deposit</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="openingBalance" label="Opening Balance">
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="openingDate" label="Opening Date">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="description" label="Description">
        <TextArea rows={4} placeholder="Additional details" />
      </Form.Item>
    </Form>
  );

  const renderTransactionForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="date" label="Transaction Date" rules={[{ required: true, message: 'Please select transaction date' }]}>
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="account" label="Bank Account" rules={[{ required: true, message: 'Please select bank account' }]}>
        <Select placeholder="Select bank account">
          <Option value="account1">Main Business Account</Option>
          <Option value="account2">Payroll Account</Option>
          <Option value="account3">Tax Payment Account</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="type" label="Transaction Type" rules={[{ required: true, message: 'Please select transaction type' }]}>
        <Select placeholder="Select transaction type">
          <Option value="credit">Credit (Money In)</Option>
          <Option value="debit">Debit (Money Out)</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Please enter amount' }]}>
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          // parser={value => value!.replace(/₹\s?|(,*)/g, '')}
          min={0}
        />
      </Form.Item>
      
      <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
        <Input placeholder="Enter transaction description" />
      </Form.Item>
      
      <Form.Item name="reference" label="Reference Number">
        <Input placeholder="Enter reference number" />
      </Form.Item>
      
      <Form.Item name="category" label="Category">
        <Select placeholder="Select category">
          <Option value="sales">Sales</Option>
          <Option value="purchase">Purchase</Option>
          <Option value="salary">Salary</Option>
          <Option value="rent">Rent</Option>
          <Option value="utilities">Utilities</Option>
          <Option value="taxes">Taxes</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="notes" label="Notes">
        <TextArea rows={4} placeholder="Additional notes" />
      </Form.Item>
    </Form>
  );

  const renderImportForm = () => (
    <Form form={form} layout="vertical">
      <Form.Item name="importType" label="Import Type" rules={[{ required: true, message: 'Please select import type' }]}>
        <Select placeholder="Select import type">
          <Option value="transactions">Bank Transactions</Option>
          <Option value="invoices">Invoices</Option>
          <Option value="bills">Bills</Option>
          <Option value="tax">Tax Records</Option>
          <Option value="gst">GST Records</Option>
          <Option value="tds">TDS Records</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="file" label="Upload File" rules={[{ required: true, message: 'Please upload a file' }]}>
        <Upload.Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for CSV, Excel, or XML files. Please ensure your file follows the required format.
            <a href="#" style={{ marginLeft: 8 }}>Download template</a>
          </p>
        </Upload.Dragger>
      </Form.Item>
      
      <Form.Item name="dateFormat" label="Date Format">
        <Select placeholder="Select date format">
          <Option value="dd/mm/yyyy">DD/MM/YYYY</Option>
          <Option value="mm/dd/yyyy">MM/DD/YYYY</Option>
          <Option value="yyyy-mm-dd">YYYY-MM-DD</Option>
        </Select>
      </Form.Item>
      
      <Form.Item name="skipRows" label="Skip Rows">
        <InputNumber min={0} placeholder="Number of header rows to skip" />
      </Form.Item>
      
      <Form.Item name="notes" label="Notes">
        <TextArea rows={4} placeholder="Additional import instructions" />
      </Form.Item>
    </Form>
  );

  const getDrawerTitle = () => {
    switch (drawerType) {
      case 'invoice':
        return 'Create New Invoice';
      case 'bill':
        return 'Add New Bill';
      case 'tax':
        return 'Add Tax Record';
      case 'gst':
        return 'Add GST Return';
      case 'tds':
        return 'Add TDS Record';
      case 'bank-account':
        return 'Add Bank Account';
      case 'transaction':
        return 'Add Bank Transaction';
      case 'import':
        return 'Import Data';
      default:
        return 'Create New Item';
    }
  };

  return (
    <Drawer
      title={getDrawerTitle()}
      width={720}
      onClose={onClose}
      open={visible}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} type="primary">
            Submit
          </Button>
        </Space>
      }
    >
      {renderDrawerContent()}
    </Drawer>
  );
};

export default DrawerContainer;