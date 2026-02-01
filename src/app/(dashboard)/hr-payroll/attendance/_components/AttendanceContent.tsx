'use client';

import React from 'react';
import { Card, Table, DatePicker, Button, Space, Typography, Row, Col, Statistic } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import '../attendance.scss';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const AttendanceContent: React.FC = () => {
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
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`status-tag status-${status.toLowerCase()}`}>
          {status === 'Present' ? <CheckCircleOutlined /> : <CloseCircleOutlined />} {status}
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      id: 'EMP001',
      name: 'John Doe',
      date: '2024-03-20',
      checkIn: '09:00 AM',
      checkOut: '06:00 PM',
      status: 'Present',
    },
    {
      key: '2',
      id: 'EMP002',
      name: 'Jane Smith',
      date: '2024-03-20',
      checkIn: '09:15 AM',
      checkOut: '05:45 PM',
      status: 'Present',
    },
    {
      key: '3',
      id: 'EMP003',
      name: 'Peter Jones',
      date: '2024-03-20',
      checkIn: '-',
      checkOut: '-',
      status: 'Absent',
    },
    {
      key: '4',
      id: 'EMP004',
      name: 'Alice Brown',
      date: '2024-03-20',
      checkIn: '08:55 AM',
      checkOut: '06:05 PM',
      status: 'Present',
    },
    {
      key: '5',
      id: 'EMP005',
      name: 'Charlie Green',
      date: '2024-03-20',
      checkIn: '09:30 AM',
      checkOut: '-',
      status: 'Absent',
    },
  ];

  return (
    <div className="attendance-page-container">
      <Card className="attendance-summary-card animated-card">
        <Title level={4} className="card-title">Attendance Overview</Title>
        <Row gutter={[24, 24]} className="stats-row">
          <Col xs={24} sm={8} lg={8}>
            <Card className="statistic-card">
              <Statistic
                title="Present Today"
                value={85}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined className="icon-large" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Card className="statistic-card">
              <Statistic
                title="Absent Today"
                value={15}
                suffix="%"
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<CloseCircleOutlined className="icon-large" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <Card className="statistic-card">
              <Statistic
                title="Late Today"
                value={5}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
                prefix={<CalendarOutlined className="icon-large" />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card className="attendance-table-card animated-card">
        <div className="table-actions-header">
          <Title level={4} className="card-title">Attendance Records</Title>
          <Space direction="vertical" size="middle" className="filter-export-section">
            <RangePicker className="responsive-datepicker" />
            <div className="action-buttons">
              <Button type="primary">Filter</Button>
              <Button>Export</Button>
            </div>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          pagination={{ pageSize: 5 }} 
          className="attendance-table"
        />
      </Card>
    </div>
  );
};

export default AttendanceContent;
