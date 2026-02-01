import React from 'react';
import { Drawer, Form, Button, Upload, Typography, Select, Alert, Space, Divider, Steps } from 'antd';
import { ImportOutlined, UploadOutlined, FileExcelOutlined, FileOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

interface ImportDrawerProps {
  open: boolean;
  onClose: () => void;
}

const ImportDrawer: React.FC<ImportDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      console.log('Import values:', values);
      // Move to next step or close if finished
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        form.resetFields();
        setCurrentStep(0);
        onClose();
      }
    }).catch(info => {
      console.log('Validation failed:', info);
    });
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        console.log(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Alert
              message="Import Guidelines"
              description="Make sure your file follows the required format. Download our template for the best results."
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />
            
            <Form.Item name="importType" label="Select Data Type" rules={[{ required: true, message: 'Please select data type' }]}>
              <Select placeholder="Select the type of data to import">
                <Option value="transactions">Transactions</Option>
                <Option value="customers">Customers</Option>
                <Option value="vendors">Vendors</Option>
                <Option value="products">Products</Option>
                <Option value="accounts">Chart of Accounts</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="fileFormat" label="File Format" rules={[{ required: true, message: 'Please select file format' }]}>
              <Select placeholder="Select file format">
                <Option value="excel">Excel (.xlsx)</Option>
                <Option value="csv">CSV</Option>
              </Select>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <Button icon={<FileExcelOutlined />}>
                Download Template
              </Button>
              <Button type="primary" onClick={() => setCurrentStep(1)}>
                Next
              </Button>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <Form.Item name="file" label="Upload File" rules={[{ required: true, message: 'Please upload a file' }]}>
              <Upload.Dragger {...uploadProps} maxCount={1} accept=".xlsx,.csv">
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                  Support for Excel or CSV files. Please ensure your data follows the template format.
                </p>
              </Upload.Dragger>
            </Form.Item>

            <Form.Item name="duplicateHandling" label="Handle Duplicates">
              <Select defaultValue="skip" placeholder="How to handle duplicate entries">
                <Option value="skip">Skip duplicates</Option>
                <Option value="overwrite">Overwrite duplicates</Option>
                <Option value="merge">Merge with existing data</Option>
              </Select>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <Button onClick={() => setCurrentStep(0)}>Previous</Button>
              <Button type="primary" onClick={() => setCurrentStep(2)}>Validate Data</Button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Alert
              message="Data Validation Successful"
              description="Your data has been validated successfully and is ready to be imported."
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              style={{ marginBottom: 20 }}
            />

            <div style={{ margin: '24px 0', background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
              <div style={{ marginBottom: 12 }}>
                <Text strong>Import Summary</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Total Records:</Text>
                <Text>238</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Valid Records:</Text>
                <Text>235</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ff4d4f' }}>
                <Text>Invalid Records:</Text>
                <Text>3</Text>
              </div>
            </div>

            <Alert
              message="Warning"
              description="3 records have invalid data and will be skipped during import."
              type="warning"
              showIcon
              style={{ marginBottom: 20 }}
            />

            <Form.Item name="confirmImport">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <Text type="secondary">
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  The import process may take several minutes depending on the size of your data.
                </Text>
              </div>
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <Button onClick={() => setCurrentStep(1)}>Previous</Button>
              <Button type="primary" onClick={handleSubmit}>Complete Import</Button>
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
          <ImportOutlined style={{ color: '#13c2c2', fontSize: '18px' }} />
          <span>Import Data</span>
        </div>
      }
      width={520}
      open={open}
      onClose={onClose}
      footer={null}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Select Type" description="Choose import type" />
        <Step title="Upload" description="Upload your file" />
        <Step title="Confirm" description="Review and import" />
      </Steps>

      <Divider />

      <Form
        form={form}
        layout="vertical"
      >
        {renderCurrentStep()}
      </Form>
    </Drawer>
  );
};

export default ImportDrawer;
