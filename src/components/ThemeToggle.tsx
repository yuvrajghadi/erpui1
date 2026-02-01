'use client';

import React from 'react';
import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '@/theme/themeContext';

interface ThemeToggleProps {
  size?: 'small' | 'default';
  stopPropagation?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'small', stopPropagation }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Switch
      size={size}
      checked={theme === 'dark'}
      onChange={toggleTheme}
      onClick={(_, event) => {
        if (stopPropagation) event.stopPropagation();
      }}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
};

export default ThemeToggle;
