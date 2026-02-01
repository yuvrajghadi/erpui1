import React, { useState } from 'react';
import { Card, Typography, Button } from 'antd';

const { Text } = Typography;

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  buttonText: string;
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon,
  color,
  buttonText,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="accounting-action-card" 
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: isHovered ? `0 8px 16px rgba(0,0,0,0.12)` : '0 2px 8px rgba(0,0,0,0.09)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        borderRadius: '12px',
        border: `1px solid ${isHovered ? color : 'rgba(0,0,0,0.06)'}`,
      }}
      hoverable
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      bodyStyle={{ padding: '20px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
        {/* Icon and Title */}
        <div className="action-card-header" style={{ marginBottom: '16px' }}>
          <div 
            style={{ 
              fontSize: '22px',
              color: isHovered ? 'white' : color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '10px',
              backgroundColor: isHovered ? color : `${color}15`,
              flexShrink: 0,
              transition: 'all 0.3s ease',
              boxShadow: isHovered ? `0 4px 8px ${color}40` : 'none',
              margin: '0 auto 12px auto'
            }}
          >
            {icon}
          </div>
          
          <Text strong style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            display: 'block', 
            textAlign: 'center',
            marginBottom: '8px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {title}
          </Text>
        </div>
        
        {/* Description Text */}
        <Text type="secondary" style={{ 
          marginBottom: '20px',
          fontSize: '14px',
          textAlign: 'center',
          height: '42px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5',
          lineClamp: 2
        }}>
          {description}
        </Text>
        
        {/* Action Button */}
        <Button 
          type="primary" 
          onClick={onClick}
          style={{ 
            backgroundColor: color,
            borderColor: color,
            borderRadius: '6px',
            boxShadow: isHovered ? `0 4px 8px ${color}40` : 'none',
            height: '38px',
            transition: 'all 0.3s ease',
            fontWeight: 500,
            marginTop: 'auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          block
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};