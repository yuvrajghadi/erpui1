import React, { useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Input, 
  DatePicker, 
  Select, 
  Tabs,
  Tag,
  Typography, 
  Statistic, 
  Space, 
  Badge,
  Segmented 
} from 'antd';
import { 
  SearchOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileExcelOutlined,
  UploadOutlined,
  TeamOutlined,
  UserOutlined,
  FileAddOutlined,
  PlusOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Components
import AttendanceSummaryChart from '../components/charts/AttendanceSummaryChart';
import AttendanceCalendar from '../components/AttendanceCalendar';
import StatisticCard from '../components/StatisticCard';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

// Sample attendance data
const attendanceData = Array.from({ length: 50 }, (_, i) => {
  const randomStatus = Math.random();
  let status;
  if (randomStatus > 0.7) status = 'Present';
  else if (randomStatus > 0.4) status = 'Late';
  else if (randomStatus > 0.2) status = 'Half Day';
  else status = 'Absent';
  
  const date = dayjs().subtract(Math.floor(Math.random() * 30), 'day').format('YYYY-MM-DD');
  const inTime = status !== 'Absent' ? `0${Math.floor(Math.random() * 3 + 9)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '-';
  const outTime = status !== 'Absent' ? `${Math.floor(Math.random() * 3 + 17)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '-';
  
  return {
    key: i,
    id: 1000 + i,
    employeeName: `Employee ${i + 1}`,
    employeeId: `EMP-${1000 + i}`,
    department: ['IT', 'HR', 'Finance', 'Marketing', 'Operations'][Math.floor(Math.random() * 5)],
    date,
    inTime,
    outTime,
    status,
    workHours: status === 'Absent' ? 0 : status === 'Half Day' ? 4 : Math.floor(Math.random() * 3 + 7),
    remarks: status === 'Late' ? 'Traffic delay' : '',
  };
});

interface AttendanceTabProps {
  showDrawer: (type: string) => void;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ showDrawer }) => {
  const [selectedView, setSelectedView] = useState<string | number>('list');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().subtract(6, 'days'), dayjs()]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Column definition for attendance table
  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      render: (text: string, record: any) => (
        <div className="employee-cell">
          <div className="employee-avatar">{text.charAt(0)}</div>
          <div>
            <div className="employee-name">{text}</div>
            <div className="employee-id">{record.employeeId}</div>
          </div>
        </div>
      ),
      sorter: (a: any, b: any) => a.employeeName.localeCompare(b.employeeName),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: [
        { text: 'IT', value: 'IT' },
        { text: 'HR', value: 'HR' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Marketing', value: 'Marketing' },
        { text: 'Operations', value: 'Operations' },
      ],
      onFilter: (value: any, record: any) => record.department.indexOf(value) === 0,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'In Time',
      dataIndex: 'inTime',
      key: 'inTime',
    },
    {
      title: 'Out Time',
      dataIndex: 'outTime',
      key: 'outTime',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '';
        let icon = null;
        switch (status) {
          case 'Present':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'Late':
            color = 'warning';
            icon = <ClockCircleOutlined />;
            break;
          case 'Absent':
            color = 'error';
            icon = null;
            break;
          case 'Half Day':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
      filters: [
        { text: 'Present', value: 'Present' },
        { text: 'Late', value: 'Late' },
        { text: 'Half Day', value: 'Half Day' },
        { text: 'Absent', value: 'Absent' },
      ],
      onFilter: (value: any, record: any) => record.status === value,
    },
    {
      title: 'Work Hours',
      dataIndex: 'workHours',
      key: 'workHours',
      render: (hours: number) => `${hours} hrs`,
      sorter: (a: any, b: any) => a.workHours - b.workHours,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button 
          type="link" 
          onClick={() => showDrawer('attendance-edit')}
        >
          Edit
        </Button>
      ),
    },
  ];

  const filteredData = attendanceData.filter(item => {
    const matchesSearch = 
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || item.department === selectedDepartment;
    
    const itemDate = dayjs(item.date);
    const matchesDate = dateRange ? 
      (itemDate.isAfter(dateRange[0], 'day') || itemDate.isSame(dateRange[0], 'day')) && 
      (itemDate.isBefore(dateRange[1], 'day') || itemDate.isSame(dateRange[1], 'day')) : 
      true;
    
    return matchesSearch && matchesDepartment && matchesDate;
  });

  // Calculate statistics
  const presentCount = filteredData.filter(item => item.status === 'Present').length;
  const lateCount = filteredData.filter(item => item.status === 'Late').length;
  const absentCount = filteredData.filter(item => item.status === 'Absent').length;
  const halfDayCount = filteredData.filter(item => item.status === 'Half Day').length;
  
  return (
    <div className="attendance-tab">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Present"
            value={presentCount}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            change={(presentCount / filteredData.length * 100).toFixed(1)}
            changeText="attendance rate"
            changePrefix="%"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Late"
            value={lateCount}
            icon={<ClockCircleOutlined />}
            color="#faad14"
            change={(lateCount / filteredData.length * 100).toFixed(1)}
            changeText="of total attendance"
            changePrefix="%"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Absent"
            value={absentCount}
            icon={<CloseCircleOutlined />}
            color="#ff4d4f"
            change={(absentCount / filteredData.length * 100).toFixed(1)}
            changeText="absence rate"
            changePrefix="%"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard 
            title="Average Work Hours"
            value={Math.round(filteredData.reduce((sum, item) => sum + item.workHours, 0) / filteredData.length * 10) / 10}
            icon={<ClockCircleOutlined />}
            color="#722ed1"
            suffix=" hrs"
            change={2.5}
            changeText="from last month"
          />
        </Col>
      </Row>

      {/* Control Row */}
      <Row gutter={[16, 16]} className="control-row">
        <Col xs={24} lg={16} className="leftSection">
          <Space wrap>
            <RangePicker 
              value={dateRange}
              onChange={value => setDateRange(value as any)}
              allowClear={false}
              className="date-range-picker"
            />
            <Select
              defaultValue="all"
              style={{ width: 160 }}
              onChange={setSelectedDepartment}
              options={[
                { value: 'all', label: 'All Departments' },
                { value: 'IT', label: 'IT Department' },
                { value: 'HR', label: 'HR Department' },
                { value: 'Finance', label: 'Finance Department' },
                { value: 'Marketing', label: 'Marketing Department' },
                { value: 'Operations', label: 'Operations Department' },
              ]}
            />
            <Input
              placeholder="Search employee..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 200 }}
              allowClear
            />
          </Space>
        </Col>
        <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
          <Space wrap>
            <Segmented
              options={[
                { value: 'list', icon: <TeamOutlined /> },
                { value: 'calendar', icon: <CalendarOutlined /> },
              ]}
              value={selectedView}
              onChange={setSelectedView}
              className="view-toggle"
            />
            <Button icon={<PlusOutlined />} onClick={() => showDrawer('attendance-add')}>
              Mark Attendance
            </Button>
            <Button icon={<UploadOutlined />}>
              Import
            </Button>
            <Button icon={<FileExcelOutlined />}>
              Export
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Content Section */}
      <div className="content-section">
        {selectedView === 'list' ? (
          <Card className="attendance-table-card">
            <Table 
              columns={columns} 
              dataSource={filteredData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
              }}
              scroll={{ x: 1000 }}
              className="attendance-table"
            />
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            <Col xs={24} xl={16}>
              <Card title="Attendance Calendar" bordered={false} className="calendar-card">
                <AttendanceCalendar attendanceData={attendanceData} />
              </Card>
            </Col>
            <Col xs={24} xl={8}>
              <Card title="Attendance Summary" bordered={false}>
                <AttendanceSummaryChart 
                  data={{
                    present: presentCount,
                    late: lateCount,
                    absent: absentCount,
                    halfDay: halfDayCount
                  }} 
                />
                <div className="summary-details">
                  <div className="summary-item">
                    <Badge color="#52c41a" />
                    <span>Present: {presentCount} ({Math.round(presentCount/filteredData.length*100)}%)</span>
                  </div>
                  <div className="summary-item">
                    <Badge color="#faad14" />
                    <span>Late: {lateCount} ({Math.round(lateCount/filteredData.length*100)}%)</span>
                  </div>
                  <div className="summary-item">
                    <Badge color="#ff4d4f" />
                    <span>Absent: {absentCount} ({Math.round(absentCount/filteredData.length*100)}%)</span>
                  </div>
                  <div className="summary-item">
                    <Badge color="#1890ff" />
                    <span>Half Day: {halfDayCount} ({Math.round(halfDayCount/filteredData.length*100)}%)</span>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default AttendanceTab;
