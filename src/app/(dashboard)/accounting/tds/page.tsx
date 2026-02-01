import React from 'react';
import AccountingDashboard from '@/modules/accounts';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const TDSPage: React.FC = () => {
  return (
    <div className="accounting-tds-page">
      <AccountingDashboard defaultActiveKey="2" />
    </div>
  );
};

export default TDSPage;
