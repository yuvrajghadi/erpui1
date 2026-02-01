import React from 'react';
import { Card, Row, Col, Tag, Button } from 'antd';

interface AlertsPanelProps {
  alerts: any[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <Row gutter={[12, 12]}>
      {alerts.map((alert) => {
        const severityConfig: any = {
          high: { border: 'var(--color-ff4d4f)', bg: 'var(--color-fff1f0)', icon: '🔴', iconColor: 'var(--color-ff4d4f)' },
          medium: { border: 'var(--color-faad14)', bg: 'var(--color-fffbe6)', icon: '🟠', iconColor: 'var(--color-faad14)' },
          low: { border: 'var(--color-52c41a)', bg: 'var(--color-f6ffed)', icon: '🟢', iconColor: 'var(--color-52c41a)' },
        };
        const config = severityConfig[alert.severity] || severityConfig.medium;

        return (
          <Col xs={24} sm={12} key={alert.id}>
            <Card
              size="small"
              hoverable
              style={{
                width: '100%',
                borderLeft: `4px solid ${config.border}`,
                borderRadius: 10,
                background: config.bg,
                border: `1px solid var(--color-e8e8e8)`,
                boxShadow: `0 2px 6px ${config.border}25`,
                transition: 'all 0.2s ease',
              }}
              bodyStyle={{ padding: '14px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{config.icon}</span>
                    <Tag color={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'success'} style={{ margin: 0, fontWeight: 600, fontSize: 11 }}>
                      {alert.type}
                    </Tag>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-262626)', fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-8c8c8c)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Severity: {alert.severity}
                  </div>
                </div>
                <Button
                  type="primary"
                  size="small"
                  style={{
                    background: config.iconColor,
                    borderColor: config.iconColor,
                    fontWeight: 600,
                    borderRadius: 6,
                    minWidth: 90
                  }}
                >
                  {alert.action}
                </Button>
              </div>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default AlertsPanel;