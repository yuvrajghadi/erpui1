import React from 'react';
import HRPayrollDashboard from '@/modules/hr-payroll';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const HRPayrollPage: React.FC = () => {
  return <HRPayrollDashboard />;
};

export default HRPayrollPage; 
