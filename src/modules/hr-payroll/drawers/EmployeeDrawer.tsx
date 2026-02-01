import React from 'react';
import { Form, Input, Select, DatePicker, Row, Col, Divider } from 'antd';

const { Option } = Select;

interface EmployeeDrawerProps {
  form?: any; // Optional form instance if controlled from parent
}

const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({ form }) => {
  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input placeholder="Email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Please enter phone' }]}>
            <Input placeholder="Phone" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="department" label="Department" rules={[{ required: true, message: 'Please select department' }]}>
            <Select placeholder="Select department">
              <Option value="IT">IT</Option>
              <Option value="HR">HR</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Marketing">Marketing</Option>
              <Option value="Operations">Operations</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please enter position' }]}>
            <Input placeholder="Position" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="salary" label="Salary" rules={[{ required: true, message: 'Please enter salary' }]}>
            <Input prefix="$" type="number" placeholder="Salary" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="joinDate" label="Join Date" rules={[{ required: true, message: 'Please select join date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Additional Information</Divider>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={4} placeholder="Address" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EmployeeDrawer;