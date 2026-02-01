import React, { useState } from 'react';
import { Table, Button, Space, Tooltip, Input, Typography, Tag, Badge, Avatar, Dropdown, Menu } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  ReloadOutlined,
  SearchOutlined,
  MoreOutlined,
  FilterOutlined,
  DownloadOutlined,
  UserOutlined,
} from '@ant-design/icons';

import './table.scss'; // ✅ Import SCSS

const { Title } = Typography;

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  email: string;
  phone: string;
  status: string;
  department: string;
  joinDate: string;
  avatar: string;
  role: string;
  performance: number;
}

const CommonTable: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return '#52c41a';
    if (score >= 70) return '#1890ff';
    if (score >= 50) return '#faad14';
    return '#ff4d4f';
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.role}</div>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
      filters: [
        { text: 'John', value: 'John' },
        { text: 'Sarah', value: 'Sarah' },
      ],
      onFilter: (value, record) => record.name.includes(value as string),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (department) => (
        <Tag color="blue" style={{ margin: 0 }}>
          {department}
        </Tag>
      ),
      filters: [
        { text: 'IT', value: 'IT' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Badge
          status={getStatusColor(status) as any}
          text={status}
          style={{ fontWeight: 500 }}
        />
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'On Leave', value: 'On Leave' },
        { text: 'Inactive', value: 'Inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      width: 120,
      render: (score) => (
        <div style={{ 
          color: getPerformanceColor(score),
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {score}%
        </div>
      ),
      sorter: (a, b) => a.performance - b.performance,
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '13px' }}>{record.email}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit'
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                danger: true
              },
              {
                key: 'update',
                icon: <SaveOutlined />,
                label: 'Update'
              }
            ]
          }}
          trigger={['click']}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{ padding: '4px 8px' }}
          />
        </Dropdown>
      ),
    },
  ];

  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations'];
  const statuses = ['Active', 'On Leave', 'Inactive'];
  const roles = ['Developer', 'Manager', 'Analyst', 'Designer', 'Engineer'];
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Lisa', 'James', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];

  const dataSource: DataType[] = Array.from({ length: 100 }).map((_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const joinDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    
    return {
      key: i,
      name: `${firstName} ${lastName}`,
      age: 25 + Math.floor(Math.random() * 15),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      phone: `+1 ${Math.floor(Math.random() * 900000000) + 1000000000}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: joinDate.toLocaleDateString(),
      address: `${Math.floor(Math.random() * 1000) + 1} Main St, City ${Math.floor(Math.random() * 100) + 1}`,
      avatar: `https://i.pravatar.cc/150?img=${i}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      performance: Math.floor(Math.random() * 100),
    };
  });

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((val) =>
      val?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="header-left">
          <Title level={4}>Employee Management</Title>
          <Badge count={filteredData.length} style={{ backgroundColor: '#1890ff' }} />
        </div>
        <Space size="middle">
          <Input
            placeholder="Search employees..."
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button
            type="default"
            icon={<FilterOutlined />}
          >
            Filters
          </Button>
          <Button
            type="default"
            icon={<DownloadOutlined />}
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Employee
          </Button>
        </Space>
      </div>

      <Table<DataType>
        className="customTable"
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: 'max-content', y: 500 }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedKeys,
          onChange: (selectedRowKeys) => setSelectedKeys(selectedRowKeys),
        }}
        pagination={{
          pageSize: 10,
          responsive: true,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} employees`,
        }}
        rowClassName={(record) =>
          selectedKeys.includes(record.key) ? 'active-row' : ''
        }
        bordered
        size="middle"
      />
    </div>
  );
};

export default CommonTable;
