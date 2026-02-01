import React from 'react';
import AccountingDashboard from '@/modules/accounts';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const GSTPage: React.FC = () => {
  return (
    <div className="accounting-gst-page">
      <AccountingDashboard defaultActiveKey="4" />
    </div>
  );
};

export default GSTPage;
