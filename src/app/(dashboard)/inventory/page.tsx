import React from 'react';
import InventoryDashboard from '@/modules/inventory';

// Force dynamic rendering to prevent CSR deopt warning
export const dynamic = 'force-dynamic';

const InventoryPage: React.FC = () => {
  return (
    <div className="inventory-page">
      <InventoryDashboard />
    </div>
  );
};

export default InventoryPage; 
