import React from 'react';
import { Space, Tag, Progress, Avatar, Button } from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

// Employee Table Columns
export const getEmployeeColumns = (showDrawer: (type: string) => void) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text, record) => (
        <Space>
          {record.avatar ? (
            <Avatar src={record.avatar} />
          ) : (
            <Avatar icon={<UserOutlined />} />
          )}
          <span className="employee-name">{text}</span>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (text) => {
        let color = 'blue';
        if (text === 'IT') color = 'geekblue';
        if (text === 'HR') color = 'purple';
        if (text === 'Finance') color = 'green';
        if (text === 'Marketing') color = 'orange';
        if (text === 'Operations') color = 'cyan';
        
        return (
          <Tag color={color} className="department-tag">
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 180,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text) => {
        let color = text === 'Active' ? 'success' : 'error';
        let icon = text === 'Active' ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
        
        return (
          <Tag color={color} icon={icon} className={`status-tag ${text.toLowerCase()}`}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      width: 100,
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      width: 120,
    },
    {
      title: 'Attendance',
      dataIndex: 'attendance',
      key: 'attendance',
      width: 150,
      render: (value) => {
        let status = 'normal';
        if (value >= 95) status = 'excellent';
        else if (value >= 85) status = 'good';
        else if (value >= 75) status = 'average';
        else status = 'poor';
        
        return (
          <Progress 
            percent={value} 
            size="small" 
            status={status === 'poor' ? 'exception' : 'active'}
            className={`performance-progress ${status}`}
          />
        );
      },
    },
    {
      title: 'Performance',
      dataIndex: 'performance',
      key: 'performance',
      width: 150,
      render: (value) => {
        let status = 'normal';
        if (value >= 90) status = 'excellent';
        else if (value >= 80) status = 'good';
        else if (value >= 70) status = 'average';
        else status = 'poor';
        
        return (
          <Progress 
            percent={value} 
            size="small" 
            status={status === 'poor' ? 'exception' : 'active'}
            className={`performance-progress ${status}`}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => showDrawer('employee')} />
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" danger icon={<DeleteOutlined />} size="small" />
        </Space>
      ),
    },
  ];
  
  return columns;
};

// Leave Requests Table Columns
export const getLeaveColumns = (showDrawer: (type: string) => void) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Employee',
      dataIndex: 'employee',
      key: 'employee',
      render: (text, record) => (
        <Space>
          {record.avatar ? (
            <Avatar src={record.avatar} size="small" />
          ) : (
            <Avatar icon={<UserOutlined />} size="small" />
          )}
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
      key: 'leaveType',
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        let color = 'processing';
        let icon = <ClockCircleOutlined />;
        
        if (text === 'Approved') {
          color = 'success';
          icon = <CheckCircleOutlined />;
        } else if (text === 'Rejected') {
          color = 'error';
          icon = <CloseCircleOutlined />;
        }
        
        return (
          <Tag color={color} icon={icon} className={`status-tag ${text.toLowerCase()}`}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => showDrawer('leave')} />
        </Space>
      ),
    },
  ];
  
  return columns;
};

// Job Openings Table Columns
export const getJobColumns = (showDrawer: (type: string) => void) => {
  const columns: ColumnsType<any> = [
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => {
        let color = 'blue';
        if (text === 'IT') color = 'geekblue';
        if (text === 'HR') color = 'purple';
        if (text === 'Finance') color = 'green';
        if (text === 'Marketing') color = 'orange';
        if (text === 'Operations') color = 'cyan';
        
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: 'Openings',
      dataIndex: 'openings',
      key: 'openings',
    },
    {
      title: 'Applications',
      dataIndex: 'applications',
      key: 'applications',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" onClick={() => showDrawer('job')} />
        </Space>
      ),
    },
  ];
  
  return columns;
};