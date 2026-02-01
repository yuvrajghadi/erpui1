import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

interface ModuleBreadcrumbProps {
  items: { title: string; href?: string; icon?: React.ReactNode }[];
}

const ModuleBreadcrumb: React.FC<ModuleBreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb className="module-breadcrumb" style={{ marginBottom: 16 }}>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      {items.map((item, idx) => (
        <Breadcrumb.Item key={idx} href={item.href}>
          {item.icon}
          <span style={{ marginLeft: item.icon ? 6 : 0 }}>{item.title}</span>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default ModuleBreadcrumb;
