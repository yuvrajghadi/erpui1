// components/CommonButton.tsx
import React from 'react';
import { Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

interface CommonButtonProps {
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text' | undefined;
  htmlType?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'middle' | 'large';
  className?: string;
  children: React.ReactNode;
  iconPosition?: 'start' | 'end';
  withSubmitIcon?: boolean;
  onClick?: () => void;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  type = 'primary',
  htmlType = 'button',
  size = 'middle',
  className = '',
  children,
  iconPosition = 'end',
  withSubmitIcon = false,
  onClick,
}) => {
  const icon = withSubmitIcon ? <SendOutlined /> : null;

  return (
    <Button
      type={type}
      htmlType={htmlType}
      size={size}
      icon={iconPosition === 'start' ? icon : undefined}
      className={`rounded-xl px-10 border flex items-center justify-center gap-2 ${className}`}
      onClick={onClick}
    >
      {children}
      {iconPosition === 'end' && icon}
    </Button>
  );
};

export default CommonButton;
