import React from 'react';
import { Form, Select, DatePicker, Input, Row, Col } from 'antd';
import { employeeData } from '../data/sampleData';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface LeaveDrawerProps {
  form?: any; // Optional form instance if controlled from parent
}

const LeaveDrawer: React.FC<LeaveDrawerProps> = ({ form }) => {
  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="employee" label="Employee" rules={[{ required: true, message: 'Please select employee' }]}>
            <Select placeholder="Select employee">
              {employeeData.map(emp => (
                <Option key={emp.key} value={emp.name}>{emp.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="leaveType" label="Leave Type" rules={[{ required: true, message: 'Please select leave type' }]}>
            <Select placeholder="Select leave type">
              <Option value="Sick Leave">Sick Leave</Option>
              <Option value="Vacation">Vacation</Option>
              <Option value="Personal Leave">Personal Leave</Option>
              <Option value="Maternity/Paternity">Maternity/Paternity</Option>
              <Option value="Bereavement">Bereavement</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="duration" label="Duration" rules={[{ required: true, message: 'Please select duration' }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Please enter reason' }]}>
            <Input.TextArea rows={4} placeholder="Reason for leave" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default LeaveDrawer;