/**
 * Job Work Turnaround Time (TAT) Report
 * Track vendor performance and delivery timelines
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';
import dayjs from 'dayjs';

interface JobWorkTATData {
  key: string;
  vendor: string;
  process: string;
  challanNo: string;
  sentDate: string;
  receivedDate: string;
  expectedDays: number;
  actualDays: number;
  delay: boolean;
  performanceStatus: string;
}

const JobWorkTurnaroundTimeReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<JobWorkTATData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: JobWorkTATData[] = [
    {
      key: '1',
      vendor: 'ABC Stitching Works',
      process: 'Stitching',
      challanNo: 'JWO-2024-001',
      sentDate: '2026-01-02',
      receivedDate: '2026-01-08',
      expectedDays: 7,
      actualDays: 6,
      delay: false,
      performanceStatus: 'On-Time',
    },
    {
      key: '2',
      vendor: 'ABC Stitching Works',
      process: 'Stitching',
      challanNo: 'JWO-2024-002',
      sentDate: '2025-12-28',
      receivedDate: '2026-01-05',
      expectedDays: 7,
      actualDays: 8,
      delay: true,
      performanceStatus: 'Delayed',
    },
    {
      key: '3',
      vendor: 'XYZ Washing Unit',
      process: 'Washing',
      challanNo: 'JWO-2024-003',
      sentDate: '2026-01-03',
      receivedDate: '2026-01-07',
      expectedDays: 5,
      actualDays: 4,
      delay: false,
      performanceStatus: 'On-Time',
    },
    {
      key: '4',
      vendor: 'XYZ Washing Unit',
      process: 'Washing',
      challanNo: 'JWO-2024-004',
      sentDate: '2025-12-29',
      receivedDate: '2026-01-06',
      expectedDays: 5,
      actualDays: 8,
      delay: true,
      performanceStatus: 'Delayed',
    },
    {
      key: '5',
      vendor: 'DEF Dyeing Factory',
      process: 'Dyeing',
      challanNo: 'JWO-2024-005',
      sentDate: '2026-01-01',
      receivedDate: '2026-01-09',
      expectedDays: 10,
      actualDays: 8,
      delay: false,
      performanceStatus: 'On-Time',
    },
    {
      key: '6',
      vendor: 'DEF Dyeing Factory',
      process: 'Dyeing',
      challanNo: 'JWO-2024-006',
      sentDate: '2025-12-25',
      receivedDate: '2026-01-07',
      expectedDays: 10,
      actualDays: 13,
      delay: true,
      performanceStatus: 'Delayed',
    },
    {
      key: '7',
      vendor: 'GHI Printing Works',
      process: 'Printing',
      challanNo: 'JWO-2024-007',
      sentDate: '2026-01-04',
      receivedDate: '2026-01-09',
      expectedDays: 5,
      actualDays: 5,
      delay: false,
      performanceStatus: 'On-Time',
    },
    {
      key: '8',
      vendor: 'GHI Printing Works',
      process: 'Printing',
      challanNo: 'JWO-2024-008',
      sentDate: '2025-12-30',
      receivedDate: '2026-01-08',
      expectedDays: 5,
      actualDays: 9,
      delay: true,
      performanceStatus: 'Delayed',
    },
    {
      key: '9',
      vendor: 'JKL Embroidery Unit',
      process: 'Embroidery',
      challanNo: 'JWO-2024-009',
      sentDate: '2026-01-05',
      receivedDate: '2026-01-10',
      expectedDays: 6,
      actualDays: 5,
      delay: false,
      performanceStatus: 'On-Time',
    },
    {
      key: '10',
      vendor: 'JKL Embroidery Unit',
      process: 'Embroidery',
      challanNo: 'JWO-2024-010',
      sentDate: '2025-12-27',
      receivedDate: '2026-01-06',
      expectedDays: 6,
      actualDays: 10,
      delay: true,
      performanceStatus: 'Delayed',
    },
    {
      key: '11',
      vendor: 'ABC Stitching Works',
      process: 'Stitching',
      challanNo: 'JWO-2024-011',
      sentDate: '2026-01-06',
      receivedDate: '2026-01-10',
      expectedDays: 7,
      actualDays: 4,
      delay: false,
      performanceStatus: 'On-Time',
    },
    {
      key: '12',
      vendor: 'XYZ Washing Unit',
      process: 'Washing',
      challanNo: 'JWO-2024-012',
      sentDate: '2026-01-02',
      receivedDate: '2026-01-10',
      expectedDays: 5,
      actualDays: 8,
      delay: true,
      performanceStatus: 'Delayed',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'dateRange',
      label: 'Sent Date Range',
      type: 'dateRange',
      required: true,
    },
    {
      name: 'vendor',
      label: 'Vendor',
      type: 'select',
      options: [
        { label: 'All Vendors', value: 'all' },
        { label: 'ABC Stitching Works', value: 'abc' },
        { label: 'XYZ Washing Unit', value: 'xyz' },
        { label: 'DEF Dyeing Factory', value: 'def' },
        { label: 'GHI Printing Works', value: 'ghi' },
      ],
    },
    {
      name: 'process',
      label: 'Process',
      type: 'multiSelect',
      options: [
        { label: 'Stitching', value: 'stitching' },
        { label: 'Washing', value: 'washing' },
        { label: 'Dyeing', value: 'dyeing' },
        { label: 'Printing', value: 'printing' },
        { label: 'Embroidery', value: 'embroidery' },
      ],
    },
    {
      name: 'performanceStatus',
      label: 'Performance Status',
      type: 'multiSelect',
      options: [
        { label: 'On-Time', value: 'ontime' },
        { label: 'Delayed', value: 'delayed' },
      ],
    },
  ];

  const handleFilter = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting Job Work TAT Report to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting Job Work TAT Report to PDF...');
  };

  const columns: ColumnsType<JobWorkTATData> = [
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Process',
      dataIndex: 'process',
      key: 'process',
      width: 120,
      render: (text) => {
        const colorMap: Record<string, string> = {
          Stitching: 'blue',
          Washing: 'cyan',
          Dyeing: 'purple',
          Printing: 'green',
          Embroidery: 'orange',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Challan No',
      dataIndex: 'challanNo',
      key: 'challanNo',
      width: 150,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Sent Date',
      dataIndex: 'sentDate',
      key: 'sentDate',
      width: 120,
      render: (text) => dayjs(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Received Date',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
      width: 130,
      render: (text) => dayjs(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Expected Days',
      dataIndex: 'expectedDays',
      key: 'expectedDays',
      width: 130,
      align: 'center',
      render: (val) => <span style={{ color: 'var(--color-666666)' }}>{val} days</span>,
    },
    {
      title: 'Actual Days',
      dataIndex: 'actualDays',
      key: 'actualDays',
      width: 120,
      align: 'center',
      render: (val, record) => {
        const color = val <= record.expectedDays ? 'var(--color-52c41a)' : 'var(--color-ff4d4f)';
        return <strong style={{ color, fontSize: '14px' }}>{val} days</strong>;
      },
    },
    {
      title: 'Delay',
      dataIndex: 'delay',
      key: 'delay',
      width: 100,
      align: 'center',
      render: (val) => (val ? <Tag color="red">Yes</Tag> : <Tag color="green">No</Tag>),
    },
    {
      title: 'Performance Status',
      dataIndex: 'performanceStatus',
      key: 'performanceStatus',
      width: 150,
      render: (text) => {
        const colorMap: Record<string, string> = {
          'On-Time': 'green',
          Delayed: 'red',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
  ];

  const displayData = searchText
    ? filteredData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()))
      )
    : filteredData;

  // Calculate summary stats
  const totalChallans = displayData.length;
  const onTimeDeliveries = displayData.filter((d) => !d.delay).length;
  const delayedDeliveries = displayData.filter((d) => d.delay).length;
  const onTimePercentage = totalChallans ? ((onTimeDeliveries / totalChallans) * 100).toFixed(1) : '0';
  const avgTAT = (displayData.reduce((sum, d) => sum + d.actualDays, 0) / totalChallans).toFixed(1);

  return (
    <div>
      <Card
        title={
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Job Work Turnaround Time (TAT) Report</div>
            <div style={{ fontSize: '12px', color: 'var(--color-888888)', fontWeight: 400, marginTop: 4 }}>
              Track vendor performance and delivery timelines
            </div>
          </div>
        }
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
              Filters
            </Button>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} type="primary" ghost>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPDF} danger ghost>
              PDF
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Challans</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{totalChallans}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>On-Time Deliveries</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-52c41a)' }}>{onTimeDeliveries}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Delayed Deliveries</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ff4d4f)' }}>{delayedDeliveries}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>On-Time %</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-52c41a)' }}>{onTimePercentage}%</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Avg TAT (Days)</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{avgTAT}</div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="key"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} challans`,
          }}
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilter}
        filters={filters}
        title="Job Work TAT Filters"
      />
    </div>
  );
};

export default JobWorkTurnaroundTimeReport;
