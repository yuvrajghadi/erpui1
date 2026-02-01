/**
 * Master Card Component
 * Card UI for each master in onboarding dashboard
 */

'use client';

import React from 'react';
import { Card, Badge, Button, Progress, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, DownloadOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { MasterCard as MasterCardType } from '../types';

interface MasterCardProps {
  master: MasterCardType;
  onAddSingle: () => void;
  onUploadExcel: () => void;
  onDownloadTemplate: () => void;
  onClick?: () => void;
}

const MasterCard: React.FC<MasterCardProps> = ({
  master,
  onAddSingle,
  onUploadExcel,
  onDownloadTemplate,
  onClick,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'var(--color-52c41a)', text: 'Completed', icon: <CheckCircleOutlined /> };
      case 'in-progress':
        return { color: 'var(--color-1890ff)', text: 'In Progress', icon: <ClockCircleOutlined /> };
      default:
        return { color: 'var(--color-d9d9d9)', text: 'Not Started', icon: <ClockCircleOutlined /> };
    }
  };

  const statusConfig = getStatusConfig(master.status);

  return (
    <Card
      hoverable
      onClick={onClick}
      className="onboarding-master-card"
      style={{
        borderRadius: 12,
        border: `2px solid ${master.status === 'completed' ? 'var(--color-52c41a)' : 'var(--color-e8e8e8)'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        height: '100%',
      }}
      bodyStyle={{ padding: '20px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 10, 
            background: `${master.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: master.color,
            fontSize: 24,
          }}>
            {master.icon}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--color-262626)' }}>
              {master.title}
            </h3>
            <Tag color={statusConfig.color} style={{ marginTop: 4, fontSize: 11 }}>
              {statusConfig.icon} {statusConfig.text}
            </Tag>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ 
        fontSize: 13, 
        color: 'var(--color-8c8c8c)', 
        marginBottom: 16,
        minHeight: 40,
      }}>
        {master.description}
      </p>

      {/* Progress */}
      {master.status !== 'not-started' && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--color-595959)' }}>Records</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: master.color }}>
              {master.recordCount}
            </span>
          </div>
          <Progress 
            percent={master.status === 'completed' ? 100 : 60} 
            strokeColor={master.color}
            showInfo={false}
            size="small"
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginTop: 16,
        paddingTop: 16,
        borderTop: '1px solid var(--color-f0f0f0)',
      }}>
        <Button
          size="small"
          icon={<PlusOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onAddSingle();
          }}
          style={{ flex: 1, fontSize: 12 }}
        >
          Add
        </Button>
        <Button
          size="small"
          icon={<UploadOutlined />}
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
            onUploadExcel();
          }}
          style={{ flex: 1, fontSize: 12 }}
        >
          Upload
        </Button>
        <Button
          size="small"
          icon={<DownloadOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDownloadTemplate();
          }}
          style={{ fontSize: 12 }}
        />
      </div>
    </Card>
  );
};

export default MasterCard;
