import React from 'react';
import LeaveContent from './_components/LeaveContent';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const LeavePage: React.FC = () => {
  return <LeaveContent />;
};

export default LeavePage;
