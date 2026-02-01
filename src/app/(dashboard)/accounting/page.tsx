import React from 'react';
import AccountingDashboard from '@/modules/accounts';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const AccountingPage: React.FC = () => {
  return (
    <div className="accounting-page">
      <AccountingDashboard />
    </div>
  );
};

export default AccountingPage;
