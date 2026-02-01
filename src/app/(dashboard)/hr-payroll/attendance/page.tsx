import React from 'react';
import AttendanceContent from './_components/AttendanceContent';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const AttendancePage: React.FC = () => {
  return <AttendanceContent />;
};

export default AttendancePage; 