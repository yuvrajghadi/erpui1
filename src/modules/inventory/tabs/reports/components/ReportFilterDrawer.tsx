import React, { useCallback } from 'react';
import { Drawer, Form, Button, Row, Col, DatePicker, Select, Input, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDeviceType } from '../../../utils';

const { RangePicker } = DatePicker;

export interface FilterConfig {
  name: string;
  label: string;
  type: 'dateRange' | 'select' | 'multiSelect' | 'input';
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
}

interface ReportFilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (values: any) => void;
  filters: FilterConfig[];
  title?: string;
}

const ReportFilterDrawer: React.FC<ReportFilterDrawerProps> = ({
  visible,
  onClose,
  onApply,
  filters,
  title = 'Report Filters',
}) => {
  const [form] = Form.useForm();
  const deviceType = useDeviceType();
  const drawerWidth = deviceType === 'mobile' ? '100%' : deviceType === 'tablet' ? '70%' : 400;

  // Initialize date range to current month
  const initializeValues = useCallback(() => {
    const currentMonth = {
      dateRange: [dayjs().startOf('month'), dayjs().endOf('month')],
    };
    form.setFieldsValue(currentMonth);
  }, [form]);

  React.useEffect(() => {
    if (visible) {
      initializeValues();
    }
  }, [visible, initializeValues]);

  const handleApply = () => {
    form.validateFields().then((values) => {
      // Format date range if present
      if (values.dateRange) {
        values.dateRange = [
          values.dateRange[0].format('YYYY-MM-DD'),
          values.dateRange[1].format('YYYY-MM-DD'),
        ];
      }
      onApply(values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    initializeValues();
  };

  const renderFilterField = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'dateRange':
        return (
          <RangePicker
            style={{ width: '100%' }}
            format="DD-MMM-YYYY"
            placeholder={['From Date', 'To Date']}
          />
        );

      case 'select':
        return (
          <Select
            placeholder={filter.placeholder || `Select ${filter.label}`}
            allowClear
            showSearch
            optionFilterProp="label"
            options={filter.options}
          />
        );

      case 'multiSelect':
        return (
          <Select
            mode="multiple"
            placeholder={filter.placeholder || `Select ${filter.label}`}
            allowClear
            showSearch
            optionFilterProp="label"
            options={filter.options}
          />
        );

      case 'input':
        return <Input placeholder={filter.placeholder || `Enter ${filter.label}`} allowClear />;

      default:
        return null;
    }
  };

  return (
    <Drawer
      className="inventory-drawer"
      title={
        <Space>
          <FilterOutlined />
          {title}
        </Space>
      }
      placement="right"
      width={drawerWidth}
      onClose={onClose}
      open={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleReset}>Reset</Button>
            <Button type="primary" onClick={handleApply}>
              Apply Filters
            </Button>
          </Space>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          {filters.map((filter) => (
            <Col xs={24} key={filter.name}>
              <Form.Item
                name={filter.name}
                label={filter.label}
                rules={[{ required: filter.required, message: `Please select ${filter.label}` }]}
              >
                {renderFilterField(filter)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    </Drawer>
  );
};

export default ReportFilterDrawer;
