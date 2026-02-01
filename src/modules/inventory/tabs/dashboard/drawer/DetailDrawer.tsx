import React, { useState, useEffect } from 'react';
import { Drawer, Button, Space } from 'antd';
import { DrawerContent } from './DrawerContent';

interface DetailDrawerProps {
  visible: boolean;
  content: { title: string; type: string; data: any };
  onClose: () => void;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({ visible, content, onClose }) => {
  const [drawerWidth, setDrawerWidth] = useState<number>(800);

  // Responsive drawer width logic
  useEffect(() => {
    const updateWidth = () => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      if (w < 600) setDrawerWidth(Math.floor(w * 0.95));
      else if (w < 1000) setDrawerWidth(Math.floor(w * 0.85));
      else setDrawerWidth(900);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <Drawer
      className="inventory-drawer"
      title={content.title}
      open={visible} // Note: Use 'visible' if on AntD v4, or 'open' if on AntD v5
      onClose={onClose}
      width={drawerWidth}
      bodyStyle={{ padding: 24, maxHeight: '85vh', overflowY: 'auto', background: 'var(--card-bg)' }}
      headerStyle={{ borderBottom: '1px solid var(--color-f0f0f0)' }}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onClose}>Close</Button>
          </Space>
        </div>
      }
    >
      <DrawerContent content={content} onClose={onClose} />
    </Drawer>
  );
};
