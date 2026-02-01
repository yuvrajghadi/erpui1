import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

const { defaultAlgorithm } = theme;

const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    colorBgBase: '#f7f8fa',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f7fb',
    colorText: '#1f2937',
    colorTextSecondary: '#6b7280',
    colorBorder: '#e5e7eb',
    colorPrimary: '#1d4ed8',
    colorError: '#dc2626',
    controlItemBgHover: '#eef2ff',
  },
  components: {
    Table: {
      headerBg: '#f3f6fb',
      headerColor: '#1f2937',
      rowHoverBg: '#f0f5ff',
      borderColor: '#e5e7eb',
    },
    Card: {
      colorBgContainer: '#ffffff',
    },
    Modal: {
      contentBg: '#ffffff',
      headerBg: '#ffffff',
    },
    Drawer: {
      colorBgElevated: '#ffffff',
    },
    Input: {
      colorBgContainer: '#ffffff',
      colorText: '#1f2937',
      colorBorder: '#d1d5db',
      colorTextPlaceholder: '#9ca3af',
      colorTextDisabled: '#9ca3af',
      colorBgContainerDisabled: '#f3f4f6',
    },
    Select: {
      colorBgContainer: '#ffffff',
      colorText: '#1f2937',
      colorBorder: '#d1d5db',
      colorTextPlaceholder: '#9ca3af',
    },
    Breadcrumb: {
      colorText: '#374151',
      colorTextDescription: '#6b7280',
    },
  },
};

export default lightTheme;
