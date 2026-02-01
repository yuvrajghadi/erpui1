import React from 'react';
import PayrollContent from './_components/PayrollContent';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const PayrollPage: React.FC = () => {
  return <PayrollContent />;
};

export default PayrollPage;
