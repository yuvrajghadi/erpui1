import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface QuickActionCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  description?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  color,
  onClick,
  description,
}) => {
  return (
    <Card 
      className="animated-card action-card" 
      hoverable 
      onClick={onClick}
    >
      <div style={{ color, fontSize: '32px', marginBottom: '8px' }}>
        {icon}
      </div>
      <Title level={5} style={{ marginTop: 0, marginBottom: description ? '8px' : 0 }}>
        {title}
      </Title>
      {description && (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {description}
        </Text>
      )}
    </Card>
  );
};

export default QuickActionCard;