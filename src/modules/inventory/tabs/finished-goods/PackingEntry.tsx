/**
 * Packing Entry - Pack finished goods for shipping
 */

'use client';

import React, { useState } from 'react';
import fgStore from '../../store/fgStore';
import { Card, Table, Button, Space, Input, Drawer, Form, Row, Col, Select, InputNumber, Tag, message, Tooltip, Badge } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface PackingRecord {
  id: string;
  packingNo: string;
  style: string;
  orderNo: string;
  date: string;
  totalQty: number;
  cartons: number;
  status: 'Open' | 'Closed' | 'Shipped';
}

interface PackingItem {
  key: string;
  color: string;
  size: string;
  qty: number;
  packType: string;
  cartonNo: string;
}

const PackingEntry: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PackingRecord[]>([
    { id: '1', packingNo: 'PACK-2024-001', style: 'T-Shirt Round Neck', orderNo: 'ORD-2024-105', date: '2024-01-04', totalQty: 500, cartons: 5, status: 'Open' },
    { id: '2', packingNo: 'PACK-2024-002', style: 'Jeans Slim Fit', orderNo: 'ORD-2024-110', date: '2024-01-03', totalQty: 300, cartons: 6, status: 'Closed' },
  ]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [repackDrawerVisible, setRepackDrawerVisible] = useState(false);
  const [repackOriginalItems, setRepackOriginalItems] = useState<PackingItem[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [packingItems, setPackingItems] = useState<PackingItem[]>([
    { key: '1', color: '', size: '', qty: 0, packType: '', cartonNo: 'CTN-001' },
  ]);
  const [cartonCounter, setCartonCounter] = useState(1);

  const handleAddItem = () => {
    const newCartonNo = `CTN-${String(cartonCounter + 1).padStart(3, '0')}`;
    const newItem: PackingItem = {
      key: Date.now().toString(),
      color: '',
      size: '',
      qty: 0,
      packType: '',
      cartonNo: newCartonNo,
    };
    setPackingItems([...packingItems, newItem]);
    setCartonCounter(cartonCounter + 1);
  };

  const handleRemoveItem = (key: string) => {
    setPackingItems(packingItems.filter(item => item.key !== key));
  };

  const handleItemChange = (key: string, field: keyof PackingItem, value: any) => {
    setPackingItems(packingItems.map(item =>
      item.key === key ? { ...item, [field]: value } : item
    ));
  };

  const handleSavePacking = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        message.success('Packing entry saved successfully');
        setDrawerVisible(false);
        form.resetFields();
        setPackingItems([{ key: '1', color: '', size: '', qty: 0, packType: '', cartonNo: 'CTN-001' }]);
        setCartonCounter(1);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  const handleCloseCarton = () => {
    try {
      const header = { packingNo: `PACK-${Date.now()}`, style: form.getFieldValue('style'), date: new Date(), warehouse: 'Main' };
      fgStore.recordPackingClose(header, packingItems, { name: 'PackUser' });
      message.success('Carton closed and sealed and FG stock updated');
    } catch (err) {
      console.error(err);
      message.error('Close carton failed');
    }
  };

  const columns: ColumnsType<PackingRecord> = [
    { title: 'Packing No', dataIndex: 'packingNo', key: 'packingNo', width: 140, fixed: 'left', render: (text) => <Tag color="green">{text}</Tag> },
    { title: 'Style', dataIndex: 'style', key: 'style', width: 180 },
    { title: 'Order No', dataIndex: 'orderNo', key: 'orderNo', width: 140, render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'Total Qty', dataIndex: 'totalQty', key: 'totalQty', width: 100, align: 'right', render: (val) => <Badge count={val} showZero style={{ backgroundColor: 'var(--color-52c41a)' }} /> },
    { title: 'Cartons', dataIndex: 'cartons', key: 'cartons', width: 90, align: 'center' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = { Open: 'processing', Closed: 'success', Shipped: 'default' };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setDrawerVisible(true)} />
          </Tooltip>
          {record.status === 'Closed' && (
            <Button type="link" size="small" onClick={() => {
              // mock reopen: load current packing items as original
              setRepackOriginalItems(packingItems.map(p => ({ ...p })));
              setRepackDrawerVisible(true);
            }}>Reopen</Button>
          )}
        </Space>
      ),
    },
  ];

  const packingColumns: ColumnsType<PackingItem> = [
    {
      title: <span><span style={{ color: 'red' }}>* </span>Color</span>,
      dataIndex: 'color',
      key: 'color',
      width: 140,
      render: (_, record) => (
        <Select
          placeholder="Select color"
          style={{ width: '100%' }}
          value={record.color || undefined}
          onChange={(val) => handleItemChange(record.key, 'color', val)}
        >
          <Select.Option value="White">White</Select.Option>
          <Select.Option value="Black">Black</Select.Option>
          <Select.Option value="Blue">Blue</Select.Option>
          <Select.Option value="Red">Red</Select.Option>
          <Select.Option value="Green">Green</Select.Option>
        </Select>
      ),
    },
    {
      title: <span><span style={{ color: 'red' }}>* </span>Size</span>,
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (_, record) => (
        <Select
          placeholder="Select size"
          style={{ width: '100%' }}
          value={record.size || undefined}
          onChange={(val) => handleItemChange(record.key, 'size', val)}
        >
          <Select.Option value="XS">XS</Select.Option>
          <Select.Option value="S">S</Select.Option>
          <Select.Option value="M">M</Select.Option>
          <Select.Option value="L">L</Select.Option>
          <Select.Option value="XL">XL</Select.Option>
          <Select.Option value="XXL">XXL</Select.Option>
        </Select>
      ),
    },
    {
      title: <span><span style={{ color: 'red' }}>* </span>Qty</span>,
      dataIndex: 'qty',
      key: 'qty',
      width: 110,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={record.qty}
          onChange={(val) => handleItemChange(record.key, 'qty', val || 0)}
          addonAfter="pcs"
        />
      ),
    },
    {
      title: <span><span style={{ color: 'red' }}>* </span>Pack Type</span>,
      dataIndex: 'packType',
      key: 'packType',
      width: 140,
      render: (_, record) => (
        <Select
          placeholder="Select pack type"
          style={{ width: '100%' }}
          value={record.packType || undefined}
          onChange={(val) => handleItemChange(record.key, 'packType', val)}
        >
          <Select.Option value="Poly Bag">Poly Bag</Select.Option>
          <Select.Option value="Box">Box</Select.Option>
          <Select.Option value="Hanger">Hanger</Select.Option>
          <Select.Option value="Bulk">Bulk</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Carton No (Auto)',
      dataIndex: 'cartonNo',
      key: 'cartonNo',
      width: 130,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" danger size="small" onClick={() => handleRemoveItem(record.key)}>Remove</Button>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()))
  );

  const totalPackedQty = packingItems.reduce((sum, item) => sum + (item.qty || 0), 0);

  return (
    <div className="packing-entry">
      <Card
        title="Packing Entry"
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Packing</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1100 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Drawer
        className="inventory-drawer packing-entry-drawer"
        title="Packing Entry Form"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 900 : '100%'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)} style={{ minWidth: 100 }}>Cancel</Button>
              <Button onClick={handleCloseCarton} icon={<CheckCircleOutlined />} style={{ minWidth: 130 }}>Close Carton</Button>
              <Button type="primary" onClick={handleSavePacking} loading={loading} icon={<SaveOutlined />} style={{ minWidth: 130 }}>Save Packing</Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Card size="small" title="Packing Header" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Style</span>}
                  name="style"
                  rules={[{ required: true, message: 'Please select style' }]}
                >
                  <Select placeholder="Select style">
                    <Select.Option value="T-Shirt Round Neck">T-Shirt Round Neck</Select.Option>
                    <Select.Option value="Jeans Slim Fit">Jeans Slim Fit</Select.Option>
                    <Select.Option value="Shirt Formal">Shirt Formal</Select.Option>
                    <Select.Option value="Hoodie">Hoodie</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Order No</span>}
                  name="orderNo"
                  rules={[{ required: true, message: 'Please select order' }]}
                >
                  <Select placeholder="Select order">
                    <Select.Option value="ORD-2024-105">ORD-2024-105</Select.Option>
                    <Select.Option value="ORD-2024-110">ORD-2024-110</Select.Option>
                    <Select.Option value="ORD-2024-115">ORD-2024-115</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            size="small"
            title="Packing Details"
            extra={<Button type="dashed" size="small" onClick={handleAddItem}>+ Add Item</Button>}
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={packingColumns}
              dataSource={packingItems}
              pagination={false}
              scroll={{ x: 800 }}
              size="small"
              footer={() => (
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
                  Total Packed Qty: {totalPackedQty} pcs
                </div>
              )}
            />
          </Card>

          <Card size="small" title="Additional Information">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Remarks" name="remarks">
                  <Input.TextArea rows={2} placeholder="Enter packing remarks..." />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Drawer>
      <Drawer
        className="inventory-drawer packing-entry-drawer"
        title="Repack Carton"
        open={repackDrawerVisible}
        onClose={() => { setRepackDrawerVisible(false); setRepackOriginalItems(null); }}
        width={800}
        footer={<div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => { setRepackDrawerVisible(false); setRepackOriginalItems(null); }}>Cancel</Button>
            <Button type="primary" onClick={() => {
              if (!repackOriginalItems) { message.error('Nothing to repack'); return; }
              setLoading(true);
              try {
                fgStore.repackCarton(`REPACK-${Date.now()}`, repackOriginalItems, packingItems, { name: 'Repacker' });
                message.success('Repack applied');
                setRepackDrawerVisible(false);
                setRepackOriginalItems(null);
              } catch (err) { console.error(err); message.error('Repack failed'); }
              finally { setLoading(false); }
            }}>Apply Repack</Button>
          </Space>
        </div>}
      >
        <Table columns={packingColumns} dataSource={packingItems} pagination={false} size="small" />
      </Drawer>
    </div>
  );
};

export default PackingEntry;
