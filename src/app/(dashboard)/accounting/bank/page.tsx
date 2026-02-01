import React from 'react';
import AccountingDashboard from '@/modules/accounts';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const BankPage: React.FC = () => {
  return (
    <div className="accounting-bank-page">
      <AccountingDashboard defaultActiveKey="6" />
    </div>
  );
};

export default BankPage;
