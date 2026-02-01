'use client';

import React from 'react';
import { Card, Table, Button, Space, Typography, Avatar, Tag, Input } from 'antd';
import { UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import '../employees.scss';

const { Title, Text } = Typography;
const { Search } = Input;

interface Employee {
  key: string;
  id: string;
  name: string;
  department: string;
  position: string;
  status: string;
  email: string;
  phone: string;
}

const EmployeesContent: React.FC = () => {
  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={text === 'Active' ? 'green' : 'red'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (record: Employee) => (
        <Space direction="vertical" size={0}>
          <Text>{record.email}</Text>
          <Text type="secondary">{record.phone}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>Delete</Button>
        </Space>
      ),
    },
  ];

  const data: Employee[] = [
    {
      key: '1',
      id: 'EMP001',
      name: 'John Doe',
      department: 'IT',
      position: 'Senior Developer',
      status: 'Active',
      email: 'john.doe@example.com',
      phone: '+1 123 456 7890',
    },
    {
      key: '2',
      id: 'EMP002',
      name: 'Jane Smith',
      department: 'HR',
      position: 'HR Manager',
      status: 'Active',
      email: 'jane.smith@example.com',
      phone: '+1 987 654 3210',
    },
    {
      key: '3',
      id: 'EMP003',
      name: 'Peter Jones',
      department: 'Finance',
      position: 'Accountant',
      status: 'Active',
      email: 'peter.jones@example.com',
      phone: '+1 555 123 4567',
    },
    {
      key: '4',
      id: 'EMP004',
      name: 'Alice Brown',
      department: 'Operations',
      position: 'Operations Lead',
      status: 'On Leave',
      email: 'alice.brown@example.com',
      phone: '+1 222 333 4444',
    },
    {
      key: '5',
      id: 'EMP005',
      name: 'Charlie Green',
      department: 'IT',
      position: 'UI/UX Designer',
      status: 'Active',
      email: 'charlie.green@example.com',
      phone: '+1 777 888 9999',
    },
  ];

  return (
    <div className="employee-management-container">
      <Card className="employee-table-card animated-card">
        <div className="table-header-section">
          <Title level={4} className="card-title">Employee Directory</Title>
          <div className="actions-section">
            <Search
              placeholder="Search employees..."
              onSearch={(value) => console.log(value)}
              style={{ width: 200 }}
              className="employee-search-input"
            />
            <Button type="primary" icon={<PlusOutlined />}>
              Add New Employee
            </Button>
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 8 }} 
          className="employee-table"
          rowClassName="employee-table-row"
        />
      </Card>
    </div>
  );
};

export default EmployeesContent;
