import { theme } from 'antd';
import type { ThemeConfig } from 'antd';

const { darkAlgorithm } = theme;

const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    colorBgBase: '#08070e',
    colorBgContainer: '#ffffff0d',
    colorBgLayout: '#08070e',
    colorText: '#e7e7ee',
    colorTextSecondary: '#b5b5c0',
    colorBorder: '#ffffff1a',
    colorPrimary: '#6aa3ff',
    colorError: '#ff7b7b',
    controlItemBgHover: '#ffffff14',
  },
  components: {
    Table: {
      headerBg: '#ffffff0d',
      headerColor: '#e7e7ee',
      rowHoverBg: '#ffffff14',
      borderColor: '#ffffff1a',
    },
    Card: {
      colorBgContainer: '#ffffff0d',
    },
    Modal: {
      contentBg: '#ffffff0d',
      headerBg: '#ffffff0d',
    },
    Drawer: {
      colorBgElevated: '#ffffff0d',
    },
    Input: {
      colorBgContainer: '#ffffff0d',
      colorText: '#e7e7ee',
      colorBorder: '#ffffff1a',
      colorTextPlaceholder: '#b5b5c0',
      colorTextDisabled: '#8f8f9b',
      colorBgContainerDisabled: '#ffffff08',
    },
    Select: {
      colorBgContainer: '#ffffff0d',
      colorText: '#e7e7ee',
      colorBorder: '#ffffff1a',
      colorTextPlaceholder: '#b5b5c0',
    },
    Breadcrumb: {
      colorText: '#e7e7ee',
      colorTextDescription: '#b5b5c0',
    },
  },
};

export default darkTheme;
