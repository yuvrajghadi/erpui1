'use client';

import React, { useState } from 'react';
import ModuleBreadcrumb from '@/components/shared/ModuleBreadcrumb';
import { 
  Tabs, 
  Input, 
  Typography, 
  Row, 
  Col, 
  Dropdown, 
  Button, 
  Space, 
  Menu 
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  BellOutlined, 
  SettingOutlined, 
  DownOutlined,
  PlusOutlined,
  ImportOutlined,
  ExportOutlined,
  BarChartOutlined,
  PrinterOutlined
} from '@ant-design/icons';

// Import tabs
import DashboardTab from './tabs/DashboardTab';
import TDSTab from './tabs/TDSTab';
import TaxTab from './tabs/TaxTab';
import GSTTab from './tabs/GSTTab';
import InvoiceTab from './tabs/InvoiceTab';
import BankTab from './tabs/BankTab';

// Import drawer container
import DrawerContainer from './components/DrawerContainer';

// Import styles
import './styles/accounting.scss';

const { Title } = Typography;

interface AccountingDashboardProps {
  showDrawer?: (type: string) => void;
  defaultActiveKey?: string;
}

const AccountingDashboard: React.FC<AccountingDashboardProps> = ({ showDrawer, defaultActiveKey = '1' }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(defaultActiveKey);
  
  // State for search text
  const [searchText, setSearchText] = useState('');
  
  // State for filter visibility
  const [filterVisible, setFilterVisible] = useState(false);
  
  // State for drawer
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState<string>('');

  // Function to show drawer
  const handleShowDrawer = (type: string) => {
    setDrawerType(type);
    setDrawerVisible(true);
    if (showDrawer) {
      showDrawer(type);
    }
  };

  // Function to close drawer
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // Filter menu
  const filterMenu = {
    items: [
      { key: '1', label: 'All Categories' },
      { key: '2', label: 'Revenue' },
      { key: '3', label: 'Expenses' },
      { key: '4', label: 'Receivables' },
      { key: '5', label: 'Payables' },
      { key: '6', label: 'Tax' },
    ]
  };

  // Quick actions menu
  const actionsMenu = {
    items: [
      { key: '1', icon: <PlusOutlined />, label: 'Add New Item' },
      { key: '2', icon: <ImportOutlined />, label: 'Import Items' },
      { key: '3', icon: <ExportOutlined />, label: 'Export Data' },
      { key: '4', icon: <BarChartOutlined />, label: 'Generate Report' },
      { key: '5', icon: <PrinterOutlined />, label: 'Print Statement' },
    ],
    onClick: ({ key }: { key: string }) => {
      switch (key) {
        case '1':
          handleShowDrawer('item');
          break;
        case '2':
          handleShowDrawer('import');
          break;
        case '3':
          handleShowDrawer('export');
          break;
        case '4':
          handleShowDrawer('report');
          break;
        case '5':
          handleShowDrawer('print');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="accounting-dashboard">
      <ModuleBreadcrumb items={[{ title: 'Accounts', icon: null }]} />
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={8} className='pb-3'>
            <Title level={4} className="dashboard-title">Accounting Management</Title>
          </Col>
          <Col xs={24} md={16}>
            <Row justify="end" gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={8} lg={10}>
                <Input 
                  placeholder="Search accounting..." 
                  prefix={<SearchOutlined />} 
                  className="search-input"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col>
                <Space>
                  <Dropdown menu={filterMenu} trigger={['click']} onOpenChange={setFilterVisible}>
                    <Button icon={<FilterOutlined />}>
                      Filter <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Dropdown menu={actionsMenu} trigger={['click']}>
                    <Button type="primary">
                      Actions <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Button icon={<BellOutlined />} />
                  <Button icon={<SettingOutlined />} />
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* Dashboard Tabs */}
      <div className="dashboard-tabs">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          className="custom-tabs"
          destroyInactiveTabPane
          tabBarGutter={6}
          items={[
            {
              key: '1',
              label: 'Dashboard',
              children: <DashboardTab showDrawer={handleShowDrawer} />
            },
            {
              key: '2',
              label: 'TDS',
              children: <TDSTab />
            },
            {
              key: '3',
              label: 'Tax',
              children: <TaxTab />
            },
            {
              key: '4',
              label: 'GST',
              children: <GSTTab />
            },
            {
              key: '5',
              label: 'Invoice',
              children: <InvoiceTab />
            },
            {
              key: '6',
              label: 'Bank',
              children: <BankTab />
            }
          ]}
        />
      </div>

      {/* Drawer Container */}
      <DrawerContainer 
        visible={drawerVisible}
        drawerType={drawerType}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default AccountingDashboard;