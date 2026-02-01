import React, { useState } from 'react';
import { Drawer, Button, Form, Steps, Space, Typography, Divider, message, Spin } from 'antd';
import { SaveOutlined, CloseOutlined, CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import ItemDrawer from './ItemDrawer';
import InwardDrawer from './InwardDrawer';
import OutwardDrawer from './OutwardDrawer';
import ReportDrawer from './ReportDrawer';
import PrintDrawer from './PrintDrawer';

const { Title, Text } = Typography;

interface DrawerContainerProps {
  drawerVisible: boolean;
  drawerType: string;
  closeDrawer: () => void;
}

const DrawerContainer: React.FC<DrawerContainerProps> = ({
  drawerVisible,
  drawerType,
  closeDrawer,
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset state when drawer opens/closes
  React.useEffect(() => {
    if (drawerVisible) {
      setCurrentStep(0);
      setIsSuccess(false);
      form.resetFields();
    }
  }, [drawerVisible, form]);

  const getDrawerTitle = () => {
    switch (drawerType) {
      case 'item':
        return 'Add New Inventory Item';
      case 'inward':
        return 'Record Inward Entry';
      case 'outward':
        return 'Record Outward Entry';
      case 'report':
        return 'Generate Inventory Report';
      case 'print':
        return 'Print Barcode/QR Code';
      default:
        return 'Action';
    }
  };

  const getSteps = () => {
    switch (drawerType) {
      case 'item':
        return [
          { title: 'Basic Information' },
          { title: 'Additional Details' },
          { title: 'Review & Submit' }
        ];
      case 'inward':
        return [
          { title: 'Entry Details' },
          { title: 'Items Selection' },
          { title: 'Review & Submit' }
        ];
      case 'outward':
        return [
          { title: 'Entry Details' },
          { title: 'Items Selection' },
          { title: 'Review & Submit' }
        ];
      case 'report':
        return [
          { title: 'Report Type' },
          { title: 'Parameters' },
          { title: 'Output Options' }
        ];
      case 'print':
        return [
          { title: 'Select Items' },
          { title: 'Label Options' },
          { title: 'Preview & Print' }
        ];
      default:
        return [
          { title: 'Step 1' },
          { title: 'Step 2' },
          { title: 'Step 3' }
        ];
    }
  };

  const renderDrawerContent = () => {
    if (isSuccess) {
      return renderSuccessContent();
    }

    switch (drawerType) {
      case 'item':
        return <ItemDrawer form={form} />;
      case 'inward':
        return <InwardDrawer form={form} />;
      case 'outward':
        return <OutwardDrawer form={form} />;
      case 'report':
        return <ReportDrawer form={form} />;
      case 'print':
        return <PrintDrawer form={form} />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>This drawer type is not yet implemented.</p>
          </div>
        );
    }
  };

  const renderSuccessContent = () => {
    const getSuccessMessage = () => {
      switch (drawerType) {
        case 'item':
          return 'Inventory item has been successfully added!';
        case 'inward':
          return 'Inward entry has been successfully recorded!';
        case 'outward':
          return 'Outward entry has been successfully recorded!';
        case 'report':
          return 'Report has been successfully generated!';
        case 'print':
          return 'Print job has been successfully sent!';
        default:
          return 'Operation completed successfully!';
      }
    };

    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <CheckCircleOutlined style={{ fontSize: 72, color: 'var(--color-52c41a)', marginBottom: 24 }} />
        <Title level={3}>{getSuccessMessage()}</Title>
        <Text style={{ fontSize: 16, display: 'block', marginBottom: 32 }}>
          The data has been processed and saved successfully.
        </Text>
        <Space>
          <Button type="primary" onClick={closeDrawer}>
            Close
          </Button>
          <Button onClick={() => {
            setIsSuccess(false);
            form.resetFields();
          }}>
            Add Another
          </Button>
        </Space>
      </div>
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    form.validateFields()
      .then(values => {
        console.log('Form values:', values);
        // Simulate API call
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSuccess(true);
          message.success('Data saved successfully!');
        }, 1500);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
        setIsSubmitting(false);
        message.error('Please check the form for errors');
      });
  };

  const handleNext = () => {
    form.validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = getSteps();

  return (
    <Drawer
      className="inventory-drawer"
      title={
        <div>
          <div style={{ marginBottom: 8 }}>{getDrawerTitle()}</div>
          <Steps 
            current={currentStep} 
            items={steps} 
            size="small" 
            style={{ marginTop: 8 }}
          />
        </div>
      }
      placement="right"
      width={720}
      onClose={closeDrawer}
      open={drawerVisible}
      styles={{ 
        body: { paddingBottom: 80 },
        header: { paddingBottom: 16 }
      }}
      footer={
        !isSuccess && (
          <div style={{ textAlign: 'right' }}>
            {currentStep > 0 && (
              <Button onClick={handlePrev} style={{ marginRight: 8 }}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button 
                type="primary" 
                onClick={handleSubmit} 
                loading={isSubmitting}
                icon={<SaveOutlined />}
              >
                Submit
              </Button>
            )}
          </div>
        )
      }
    >
      {isSubmitting ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          <div style={{ marginTop: 24 }}>
            <Text>Processing your request...</Text>
          </div>
        </div>
      ) : (
        renderDrawerContent()
      )}
    </Drawer>
  );
};

export default DrawerContainer;
