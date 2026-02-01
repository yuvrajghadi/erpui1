import React from 'react';
import { Card, Button, Typography } from 'antd';

const { Title, Text } = Typography;

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color,
  onClick
}) => {
  return (
    <Card 
      className="inventory-action-card" 
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)',
      }}
      hoverable
      styles={{ body: { padding: '20px' } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div 
          style={{ 
            fontSize: '24px', 
            marginBottom: '16px',
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: `${color}15`,
          }}
        >
          {icon}
        </div>
        <Title level={5} style={{ margin: '0 0 8px 0' }}>{title}</Title>
        <Text type="secondary" style={{ marginBottom: '16px', flex: 1 }}>
          {description}
        </Text>
        <Button 
          type="primary" 
          onClick={onClick}
          style={{ 
            backgroundColor: color,
            borderColor: color,
            boxShadow: 'none',
            borderRadius: '6px',
          }}
        >
          Get Started
        </Button>
      </div>
    </Card>
  );
};