import React from 'react';
import EmployeesContent from './_components/EmployeesContent';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const EmployeesPage: React.FC = () => {
  return <EmployeesContent />;
};

export default EmployeesPage; 