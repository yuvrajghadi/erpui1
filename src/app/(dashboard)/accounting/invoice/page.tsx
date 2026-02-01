import React from 'react';
import AccountingDashboard from '@/modules/accounts';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const InvoicePage: React.FC = () => {
  return (
    <div className="accounting-invoice-page">
      <AccountingDashboard defaultActiveKey="5" />
    </div>
  );
};

export default InvoicePage;
