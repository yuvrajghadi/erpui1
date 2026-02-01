/**
 * EXAMPLE: Enhanced GRN Drawer with Transaction Preview Strip
 * 
 * This example demonstrates:
 * 1. Transaction Preview Strip integration
 * 2. Live calculation updates
 * 3. Error/Warning detection
 * 4. Exception-first coloring in table
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, Space, Table, Row, Col, Divider, Tag, message } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import InventoryDrawer from '../components/InventoryDrawer';
import TransactionPreviewStrip from '../components/TransactionPreviewStrip';

interface GRNItem {
  key: string;
  materialCode: string;
  materialName: string;
  rollNumber: string;
  quantity: number;
  uom: string;
  receivedQty: number;
  shortageQty: number;
  lotNumber?: string;
}

interface EnhancedGRNDrawerProps {
  open: boolean;
  onClose: () => void;
}

const EnhancedGRNDrawer: React.FC<EnhancedGRNDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [items, setItems] = useState<GRNItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Live calculations for Transaction Preview Strip
  const totalQuantity = items.reduce((sum, item) => sum + (item.receivedQty || 0), 0);
  const totalRolls = items.length;
  const shortageQty = items.reduce((sum, item) => sum + (item.shortageQty || 0), 0);
  const lossPercentage = totalQuantity > 0 ? (shortageQty / (totalQuantity + shortageQty)) * 100 : 0;
  
  // Error detection
  const errors: string[] = [];
  const warnings: string[] = [];
  
  items.forEach((item) => {
    if (!item.lotNumber) {
      errors.push(`${item.materialName} missing lot number`);
    }
    if (item.shortageQty > 0) {
      warnings.push(`${item.materialName}: ${item.shortageQty} ${item.uom} shortage`);
    }
    if (!item.rollNumber) {
      errors.push(`${item.materialName} missing roll number`);
    }
  });

  const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : totalQuantity > 0 ? 'success' : 'processing';

  // Add new item row
  const handleAddItem = () => {
    const newItem: GRNItem = {
      key: Date.now().toString(),
      materialCode: '',
      materialName: '',
      rollNumber: '',
      quantity: 0,
      uom: 'kg',
      receivedQty: 0,
      shortageQty: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const handleRemoveItem = (key: string) => {
    setItems(items.filter(item => item.key !== key));
  };

  // Update item field
  const handleUpdateItem = (key: string, field: keyof GRNItem, value: any) => {
    setItems(items.map(item => {
      if (item.key === key) {
        const updated = { ...item, [field]: value };
        
        // Auto-calculate shortage
        if (field === 'quantity' || field === 'receivedQty') {
          updated.shortageQty = Math.max(0, (updated.quantity || 0) - (updated.receivedQty || 0));
        }
        
        return updated;
      }
      return item;
    }));
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      if (errors.length > 0) {
        message.error('Please fix all errors before submitting');
        return;
      }

      const values = await form.validateFields();
      setLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      message.success('GRN created successfully');
      form.resetFields();
      setItems([]);
      onClose();
    } catch (error) {
      message.error('Failed to create GRN');
    } finally {
      setLoading(false);
    }
  };

  // Table columns with exception-first coloring
  const columns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 150,
      render: (text: string, record: GRNItem) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateItem(record.key, 'materialCode', e.target.value)}
          placeholder="MAT-001"
          status={!text ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
      render: (text: string, record: GRNItem) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateItem(record.key, 'materialName', e.target.value)}
          placeholder="Cotton Fabric"
          status={!text ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 130,
      render: (text: string, record: GRNItem) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateItem(record.key, 'rollNumber', e.target.value)}
          placeholder="R-001"
          status={!text ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Lot Number',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 130,
      render: (text: string | undefined, record: GRNItem) => (
        <Input
          value={text}
          onChange={(e) => handleUpdateItem(record.key, 'lotNumber', e.target.value)}
          placeholder="LOT-001"
          status={!text ? 'error' : ''}
        />
      ),
    },
    {
      title: 'Expected Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (text: number, record: GRNItem) => (
        <InputNumber
          value={text}
          onChange={(value) => handleUpdateItem(record.key, 'quantity', value)}
          min={0}
          style={{ width: '100%' }}
          placeholder="0"
        />
      ),
    },
    {
      title: 'Received Qty',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: 120,
      render: (text: number, record: GRNItem) => (
        <InputNumber
          value={text}
          onChange={(value) => handleUpdateItem(record.key, 'receivedQty', value)}
          min={0}
          style={{ width: '100%' }}
          placeholder="0"
        />
      ),
    },
    {
      title: 'Shortage',
      dataIndex: 'shortageQty',
      key: 'shortageQty',
      width: 100,
      render: (text: number) => (
        text > 0 ? (
          <Tag color="error">{text} kg</Tag>
        ) : (
          <Tag color="success">0</Tag>
        )
      ),
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 80,
      render: (text: string) => text,
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: any, record: GRNItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveItem(record.key)}
        />
      ),
    },
  ];

  return (
    <InventoryDrawer
      open={open}
      onClose={onClose}
      title="Goods Receipt Note (GRN)"
      width={typeof window !== 'undefined' && window.innerWidth > 1400 ? 1400 : '100%'}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button icon={<CloseOutlined />} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              loading={loading}
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              disabled={errors.length > 0}
            >
              Create GRN
            </Button>
          </Space>
        </div>
      }
    >
      <Row gutter={[16, 16]}>
        {/* Main Form Area - Left Side */}
        <Col xs={24} lg={18}>
          <Form form={form} layout="vertical">
            {/* Header Info */}
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="grnNumber"
                  label="GRN Number"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Input placeholder="GRN-2024-001" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="grnDate"
                  label="GRN Date"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item
                  name="supplierName"
                  label="Supplier"
                  rules={[{ required: true, message: 'Required' }]}
                >
                  <Select placeholder="Select Supplier">
                    <Select.Option value="supplier1">Textile World Ltd.</Select.Option>
                    <Select.Option value="supplier2">Fabric Masters Inc.</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Material Details</Divider>

            {/* Add Item Button */}
            <div style={{ marginBottom: 16 }}>
              <Button
                type="dashed"
                onClick={handleAddItem}
                block
                icon={<PlusOutlined />}
              >
                Add Material Roll
              </Button>
            </div>

            {/* Items Table with Exception-First Coloring */}
            <Table
              columns={columns}
              dataSource={items}
              pagination={false}
              size="small"
              scroll={{ x: 1200 }}
              rowClassName={(record) => {
                // Exception-first: Highlight only issues
                if (!record.lotNumber || !record.rollNumber || !record.materialCode) {
                  return 'row-error'; // Red highlight
                }
                if (record.shortageQty > 0) {
                  return 'row-warning'; // Orange highlight
                }
                return ''; // Normal - no color
              }}
            />
          </Form>
        </Col>

        {/* Transaction Preview Strip - Right Side */}
        <Col xs={24} lg={6}>
          <TransactionPreviewStrip
            totalQuantity={totalQuantity}
            totalRolls={totalRolls}
            uom="kg"
            lossPercentage={lossPercentage}
            errors={errors}
            warnings={warnings}
            status={status}
          />
        </Col>
      </Row>

      {/* Add CSS for exception-first coloring */}
      <style jsx>{`
        :global(.row-error) {
          background-color: var(--color-fff1f0) !important;
          border-left: 3px solid var(--color-ff4d4f);
        }
        :global(.row-warning) {
          background-color: var(--color-fffbf0) !important;
          border-left: 3px solid var(--color-faad14);
        }
        :global(.row-error:hover),
        :global(.row-warning:hover) {
          background-color: var(--color-fff7e6) !important;
        }
      `}</style>
    </InventoryDrawer>
  );
};

export default EnhancedGRNDrawer;
