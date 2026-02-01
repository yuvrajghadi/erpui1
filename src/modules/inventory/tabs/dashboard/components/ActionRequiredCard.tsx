import React from 'react';
import { Card, Tag, Button } from 'antd';

interface ActionRequiredCardProps {
  action: any;
  onActionClick: (title: string, type: string, data: any) => void;
}

const ActionRequiredCard: React.FC<ActionRequiredCardProps> = ({ action, onActionClick }) => {
  const priorityConfig: any = {
    critical: { bg: 'var(--card-bg)', border: 'var(--color-cf1322)', shadow: 'rgba(207,19,34,0.15)' },
    high: { bg: 'var(--card-bg)', border: 'var(--color-faad14)', shadow: 'rgba(250,173,20,0.15)' },
    medium: { bg: 'var(--card-bg)', border: 'var(--color-1890ff)', shadow: 'rgba(24,144,255,0.12)' },
  };
  const config = priorityConfig[action.priority] || priorityConfig.medium;

  return (
    <div style={{ flex: '1 1 calc(25% - 12px)', minWidth: 200 }}>
      <Card
        hoverable
        style={{
          borderLeft: `5px solid ${action.borderColor}`,
          borderRadius: '10px',
          background: config.bg,
          border: `0.7px solid ${action.borderColor || 'var(--border-color)'}`,
          boxShadow: `0 4px 12px ${config.shadow}`,
          transition: 'all 0.2s ease',
          height: '100%',
          minHeight: 140,
        }}
        bodyStyle={{ padding: '18px' }}
        onClick={() => onActionClick(action.title, 'single-action', action)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-000000)', lineHeight: 1.3 }}>
                {action.title}
              </span>
              {action.priority === 'critical' && (
                <Tag color="red" style={{ margin: 0, fontSize: '10px', padding: '0 6px', lineHeight: '18px' }}>URGENT</Tag>
              )}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-595959)', marginBottom: 6, lineHeight: 1.5 }}>
              {action.desc}
            </div>
            {action.secondary && (
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: action.priority === 'critical' ? 'var(--color-cf1322)' : 'var(--color-8c8c8c)',
                marginTop: 4
              }}>
                {action.secondary}
              </div>
            )}
          </div>
          <Button
            type="default"
            size="middle"
            block
            style={{
              borderRadius: 8,
              fontWeight: 600,
              background: 'transparent',
              borderColor: action.borderColor,
              border: `0.7px solid ${action.borderColor}`,
              color: 'var(--color-000000)',
              height: 40,
              marginTop: 12
            }}
          >
            {action.action} →
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ActionRequiredCard;