import React from 'react';
import AccountingDashboard from '@/modules/accounts';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const TaxPage: React.FC = () => {
  return (
    <div className="accounting-tax-page">
      <AccountingDashboard defaultActiveKey="3" />
    </div>
  );
};

export default TaxPage;
