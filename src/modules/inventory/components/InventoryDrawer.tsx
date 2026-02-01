import React, { ReactNode } from 'react';
import { Drawer, Grid } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number | string;
  footer?: ReactNode | null;
  children?: ReactNode;
  className?: string;
};

const InventoryDrawer: React.FC<Props> = ({ open, onClose, title, width = 720, footer = null, children, className = '' }) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;
  const isTablet = !!screens.md && !screens.lg;
  const computedWidth = isMobile ? '100%' : isTablet ? '70%' : width;
  return (
    <Drawer
      className={`inventory-drawer ${className}`}
      title={title}
      open={open}
      onClose={onClose}
      width={computedWidth}
      closeIcon={<CloseOutlined />}
      footer={footer}
      destroyOnClose
      styles={{
        header: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '24px',
          paddingRight: '24px',
          borderBottom: '1px solid var(--color-f0f0f0)',
        },
      }}
    >
      {children}
    </Drawer>
  );
};

export default InventoryDrawer;
