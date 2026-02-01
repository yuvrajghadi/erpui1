import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, DatePicker, Button, Space, Table, Row, Col, Divider, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, InboxOutlined, ScanOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;
const { TextArea } = Input;

interface InwardDrawerProps {
  form?: any; // Optional form instance if controlled from parent
}

const InwardDrawer: React.FC<InwardDrawerProps> = ({ form }) => {
  const [items, setItems] = useState<any[]>([]);

  // Sample items for selection
  const inventoryItems = [
    { id: '1', code: 'FAB001', name: 'Cotton Fabric', category: 'Raw Materials', unit: 'meters' },
    { id: '2', code: 'FAB002', name: 'Polyester Fabric', category: 'Raw Materials', unit: 'meters' },
    { id: '3', code: 'YRN001', name: 'Cotton Yarn', category: 'Raw Materials', unit: 'kg' },
    { id: '4', code: 'BTN001', name: 'Plastic Buttons', category: 'Accessories', unit: 'pcs' },
    { id: '5', code: 'ZIP001', name: 'Metal Zippers', category: 'Accessories', unit: 'pcs' },
  ];

  // Add item to the list
  const addItem = () => {
    const newItem = {
      key: Date.now().toString(),
      itemId: '',
      itemName: '',
      quantity: 1,
      unit: '',
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
  };

  // Remove item from the list
  const removeItem = (key: string) => {
    setItems(items.filter(item => item.key !== key));
  };

  // Handle item selection
  const handleItemSelect = (value: string, key: string) => {
    const selectedItem = inventoryItems.find(item => item.id === value);
    if (selectedItem) {
      setItems(items.map(item => {
        if (item.key === key) {
          return {
            ...item,
            itemId: selectedItem.id,
            itemName: selectedItem.name,
            unit: selectedItem.unit,
          };
        }
        return item;
      }));
    }
  };

  // Handle quantity or price change
  const handleValueChange = (key: string, field: string, value: number) => {
    setItems(items.map(item => {
      if (item.key === key) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate total price if quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  // Table columns
  const columns = [
    {
      title: 'Item',
      dataIndex: 'itemId',
      key: 'itemId',
      render: (text: string, record: any) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Select item"
          value={text || undefined}
          onChange={(value) => handleItemSelect(value, record.key)}
        >
          {inventoryItems.map(item => (
            <Option key={item.id} value={item.id}>{item.code} - {item.name}</Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 120,
      render: (text: number, record: any) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => handleValueChange(record.key, 'quantity', value as number)}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      width: 100,
      render: (text: string) => text,
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 120,
      render: (text: number, record: any) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleValueChange(record.key, 'unitPrice', value as number)}
          style={{ width: '100%' }}
          formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => Number(value?.replace(/₹\s?|(,*)/g, ''))}
        />
      ),
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      render: (text: number) => (
        <span>₹ {text.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_: any, record: any) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />} 
          onClick={() => removeItem(record.key)}
        />
      ),
    },
  ];

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="inwardNumber" label="Inward Number" rules={[{ required: true, message: 'Please enter inward number' }]}>
            <Input placeholder="Inward Number" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="inwardDate" label="Inward Date" rules={[{ required: true, message: 'Please select date' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="inwardType" label="Inward Type" rules={[{ required: true, message: 'Please select type' }]}>
            <Select placeholder="Select type">
              <Option value="purchase">Purchase</Option>
              <Option value="return">Return from Customer</Option>
              <Option value="transfer">Transfer from Other Location</Option>
              <Option value="production">Production Input</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="supplier" label="Supplier/Vendor">
            <Select placeholder="Select supplier" allowClear showSearch>
              <Option value="supplier1">Textile World Ltd.</Option>
              <Option value="supplier2">Fabric Masters Inc.</Option>
              <Option value="supplier3">Premier Yarns Co.</Option>
              <Option value="supplier4">Global Textile Supplies</Option>
              <Option value="supplier5">Quality Fabrics International</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="referenceNumber" label="Reference Number">
            <Input placeholder="PO/Invoice Number" />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Items</Divider>
      
      <div style={{ marginBottom: 16 }}>
        <Button type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
          Add Item
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={items} 
        pagination={false} 
        size="small"
        scroll={{ x: 800 }}
      />

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ marginRight: 8 }}>Total Items: {items.length}</span>
            <span>Total Amount: ₹ {items.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
          </div>
        </Col>
      </Row>

      <Divider orientation="left">Additional Information</Divider>
      
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} placeholder="Additional notes" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="receivedBy" label="Received By">
            <Input placeholder="Name of receiver" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="checkedBy" label="Checked By">
            <Input placeholder="Name of checker" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="attachments"
            label="Attachments"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload.Dragger name="files" action="/upload.do" listType="picture" maxCount={3}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for invoice, delivery challan, etc. Max 3 files.</p>
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default InwardDrawer;