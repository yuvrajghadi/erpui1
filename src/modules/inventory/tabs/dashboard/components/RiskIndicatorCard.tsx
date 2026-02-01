import React from 'react';
import { Card, Button } from 'antd';
import { WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';

interface RiskIndicatorCardProps {
  risk: any;
  onActionClick: (title: string, type: string, data: any) => void;
}

const RiskIndicatorCard: React.FC<RiskIndicatorCardProps> = ({ risk, onActionClick }) => {
  const icon = risk.severity === 'error' ? <WarningOutlined /> : <ClockCircleOutlined />;

  return (
    <Card
      hoverable
      style={{
        borderRadius: 10,
        border: `0.7px solid ${risk.severity === 'error' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)'}`,
        background: 'var(--color-ffffff)',
        boxShadow: `0 4px 12px ${risk.severity === 'error' ? 'rgba(255,77,79,0.12)' : 'rgba(250,173,20,0.12)'}`,
        height: '100%',
        minHeight: 160,
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: 6, background: risk.severity === 'error' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)', borderRadius: '6px 6px 0 0' }} />
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 100, flex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 24, color: risk.severity === 'error' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)' }}>{icon}</span>
              <strong style={{ fontSize: '15px', color: 'var(--color-000000)' }}>{risk.title}</strong>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-262626)', marginBottom: 12, fontWeight: 500 }}>{risk.desc}</div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <Button
              type="default"
              size="middle"
              block
              style={{
                borderRadius: 8,
                fontWeight: 600,
                background: 'transparent',
                borderColor: risk.severity === 'error' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)',
                border: `0.7px solid ${risk.severity === 'error' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)'}`,
                color: 'var(--color-000000)',
              }}
              onClick={() => onActionClick(risk.title, risk.type, [])}
            >
              {risk.action} →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RiskIndicatorCard;