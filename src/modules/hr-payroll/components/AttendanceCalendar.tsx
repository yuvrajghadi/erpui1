import React from 'react';
import { Calendar, Badge, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { CellRenderInfo } from 'rc-picker/lib/interface';

interface AttendanceRecord {
  date: string;
  status: string;
  inTime?: string;
  outTime?: string;
}

interface AttendanceCalendarProps {
  attendanceData: any[]; // Replace with your attendance data type
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ attendanceData }) => {
  // Group attendance data by date
  const attendanceByDate: Record<string, AttendanceRecord[]> = {};
  
  attendanceData.forEach(record => {
    const date = record.date;
    if (!attendanceByDate[date]) {
      attendanceByDate[date] = [];
    }
    attendanceByDate[date].push({
      date,
      status: record.status,
      inTime: record.inTime,
      outTime: record.outTime
    });
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Present':
        return '#52c41a';
      case 'Late':
        return '#faad14';
      case 'Absent':
        return '#ff4d4f';
      case 'Half Day':
        return '#1890ff';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge 
        color={getStatusColor(status)} 
        text={status}
      />
    );
  };
  const dateCellRender = (date: Dayjs) => {
    // Ensure date is a valid Dayjs object
    if (!date || typeof date.format !== 'function') {
      return null;
    }
    
    const dateString = date.format('YYYY-MM-DD');
    const records = attendanceByDate[dateString] || [];
    
    if (records.length === 0) return null;
    
    // Count status types
    const statusCounts: Record<string, number> = {};
    records.forEach(record => {
      if (!statusCounts[record.status]) {
        statusCounts[record.status] = 0;
      }
      statusCounts[record.status]++;
    });
    
    // Get the most common status for this day
    let primaryStatus = '';
    let maxCount = 0;
    
    Object.keys(statusCounts).forEach(status => {
      if (statusCounts[status] > maxCount) {
        maxCount = statusCounts[status];
        primaryStatus = status;
      }
    });
    
    return (
      <div className="date-cell">
        <Tooltip title={
          <div>
            {records.map((record, index) => (
              <div key={index}>
                {getStatusBadge(record.status)}
                {record.inTime && record.outTime && 
                  <span> ({record.inTime} - {record.outTime})</span>
                }
              </div>
            ))}
          </div>
        }>
          <div 
            className="status-indicator" 
            style={{ backgroundColor: getStatusColor(primaryStatus) }}
          >
            {records.length > 1 ? `${records.length}` : ''}
          </div>
        </Tooltip>
      </div>
    );
  };
  
  const monthCellRender = (date: Dayjs) => {
    // Could implement a summary for the month here if needed
    return null;
  };  return (
    <div className="attendance-calendar">
      <Calendar 
        cellRender={(date) => dateCellRender(date)}
      />
    </div>
  );
};

export default AttendanceCalendar;
