'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Typography, Select, DatePicker, Tag, Modal, Form, Input } from 'antd';
import { FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import '../leave.scss';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface LeaveRequest {
  key: string;
  id: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

const LeaveContent: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRequest | null>(null);
  const [form] = Form.useForm();

  const [leaveData, setLeaveData] = useState<LeaveRequest[]>([
    {
      key: '1',
      id: 'LREQ001',
      employeeName: 'John Doe',
      leaveType: 'Annual Leave',
      startDate: '2024-04-01',
      endDate: '2024-04-05',
      status: 'Approved',
      reason: 'Family vacation',
    },
    {
      key: '2',
      id: 'LREQ002',
      employeeName: 'Jane Smith',
      leaveType: 'Sick Leave',
      startDate: '2024-04-10',
      endDate: '2024-04-10',
      status: 'Pending',
      reason: 'Flu',
    },
    {
      key: '3',
      id: 'LREQ003',
      employeeName: 'Peter Jones',
      leaveType: 'Maternity Leave',
      startDate: '2024-05-01',
      endDate: '2024-07-31',
      status: 'Pending',
      reason: 'Maternity leave',
    },
    {
      key: '4',
      id: 'LREQ004',
      employeeName: 'Alice Brown',
      leaveType: 'Paternity Leave',
      startDate: '2024-04-20',
      endDate: '2024-04-22',
      status: 'Rejected',
      reason: 'Critical project deadline',
    },
    {
      key: '5',
      id: 'LREQ005',
      employeeName: 'Charlie Green',
      leaveType: 'Casual Leave',
      startDate: '2024-05-15',
      endDate: '2024-05-15',
      status: 'Approved',
      reason: 'Personal errands',
    },
  ]);

  const columns = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'Pending' | 'Approved' | 'Rejected') => {
        let color = '';
        let icon;
        if (status === 'Approved') {
          color = 'green';
          icon = <CheckCircleOutlined />;
        } else if (status === 'Pending') {
          color = 'orange';
          icon = <FileTextOutlined />;
        } else {
          color = 'red';
          icon = <CloseCircleOutlined />;
        }
        return (
          <Tag color={color} className="status-tag">
            {icon} {status}
          </Tag>
        );
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: LeaveRequest) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)} />
        </Space>
      ),
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
    setEditingLeave(null);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const newLeave: LeaveRequest = {
        key: editingLeave ? editingLeave.key : String(leaveData.length + 1),
        id: values.id,
        employeeName: values.employeeName,
        leaveType: values.leaveType,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        status: values.status,
        reason: values.reason,
      };

      if (editingLeave) {
        setLeaveData(leaveData.map(leave => (leave.key === newLeave.key ? newLeave : leave)));
      } else {
        setLeaveData([...leaveData, newLeave]);
      }
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingLeave(null);
    form.resetFields();
  };

  const handleEdit = (record: LeaveRequest) => {
    setEditingLeave(record);
    form.setFieldsValue({
      ...record,
      dateRange: [new Date(record.startDate), new Date(record.endDate)],
    });
    setIsModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setLeaveData(leaveData.filter(leave => leave.key !== key));
  };

  return (
    <div className="leave-management-container">
      <Card className="leave-table-card animated-card">
        <div className="table-actions-header">
          <Title level={4} className="card-title">Leave Requests</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Apply for Leave
          </Button>
        </div>

        <div className="filters-section">
          <Space wrap size="middle" className="filter-controls">
            <Select defaultValue="all" style={{ width: 150 }} className="responsive-select">
              <Option value="all">All Status</Option>
              <Option value="Pending">Pending</Option>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
            <Select defaultValue="all" style={{ width: 150 }} className="responsive-select">
              <Option value="all">All Leave Types</Option>
              <Option value="Annual Leave">Annual Leave</Option>
              <Option value="Sick Leave">Sick Leave</Option>
              <Option value="Maternity Leave">Maternity Leave</Option>
              <Option value="Paternity Leave">Paternity Leave</Option>
              <Option value="Casual Leave">Casual Leave</Option>
            </Select>
            <RangePicker className="responsive-datepicker" />
            <Button>Filter</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={leaveData} 
          pagination={{ pageSize: 8 }} 
          className="leave-table"
          rowClassName="leave-table-row"
        />

        <Modal
          title={editingLeave ? "Edit Leave Request" : "Apply for Leave"}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={editingLeave ? "Update" : "Submit"}
          cancelText="Cancel"
          className="leave-modal"
        >
          <Form
            form={form}
            layout="vertical"
            name="leave_form"
            initialValues={editingLeave || { status: 'Pending' }}
          >
            <Form.Item name="id" label="Request ID" rules={[{ required: true, message: 'Please input the Request ID!' }]}>
              <Input disabled={!!editingLeave} />
            </Form.Item>
            <Form.Item name="employeeName" label="Employee Name" rules={[{ required: true, message: 'Please input the employee name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="leaveType" label="Leave Type" rules={[{ required: true, message: 'Please select the leave type!' }]}>
              <Select>
                <Option value="Annual Leave">Annual Leave</Option>
                <Option value="Sick Leave">Sick Leave</Option>
                <Option value="Maternity Leave">Maternity Leave</Option>
                <Option value="Paternity Leave">Paternity Leave</Option>
                <Option value="Casual Leave">Casual Leave</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" label="Leave Duration" rules={[{ required: true, message: 'Please select the leave dates!' }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="reason" label="Reason" rules={[{ required: true, message: 'Please input the reason for leave!' }]}>
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select the status!' }]}>
              <Select>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default LeaveContent;
