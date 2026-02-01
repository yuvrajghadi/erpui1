import React from 'react';
import { Drawer, Button, Form } from 'antd';
import EmployeeDrawer from './EmployeeDrawer';
import LeaveDrawer from './LeaveDrawer';

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

  const getDrawerTitle = () => {
    switch (drawerType) {
      case 'employee':
        return 'Add New Employee';
      case 'leave':
        return 'Create Leave Request';
      case 'job':
        return 'Post New Job Opening';
      case 'event':
        return 'Schedule Event';
      case 'payroll':
        return 'Process Payroll';
      default:
        return 'Action';
    }
  };

  const renderDrawerContent = () => {
    switch (drawerType) {
      case 'employee':
        return <EmployeeDrawer form={form} />;
      case 'leave':
        return <LeaveDrawer form={form} />;
      case 'job':
      case 'event':
      case 'payroll':
      default:
        return (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>This drawer type is not yet implemented.</p>
          </div>
        );
    }
  };

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        console.log('Form values:', values);
        form.resetFields();
        closeDrawer();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Drawer
      title={getDrawerTitle()}
      placement="right"
      width={600}
      onClose={closeDrawer}
      open={drawerVisible}
      styles={{ body: { paddingBottom: 80 } }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={closeDrawer} style={{ marginRight: 8 }}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      }
    >
      {renderDrawerContent()}
    </Drawer>
  );
};

export default DrawerContainer;