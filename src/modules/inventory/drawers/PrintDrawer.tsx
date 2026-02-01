import React, { useState } from 'react';
import { Form, Select, InputNumber, Radio, Row, Col, Divider, Card, Space, Button, Table, Tag } from 'antd';
import { QrcodeOutlined, BarcodeOutlined, PrinterOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Option } = Select;

interface PrintDrawerProps {
  form?: any; // Optional form instance if controlled from parent
}

const PrintDrawer: React.FC<PrintDrawerProps> = ({ form }) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

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
    form.validateFields(['itemId', 'quantity'])
      .then((values: any) => {
        const selectedItem = inventoryItems.find(item => item.id === values.itemId);
        if (selectedItem) {
          const newItem = {
            key: Date.now().toString(),
            itemId: selectedItem.id,
            itemCode: selectedItem.code,
            itemName: selectedItem.name,
            category: selectedItem.category,
            quantity: values.quantity || 1,
          };
          setSelectedItems([...selectedItems, newItem]);
          form.setFieldsValue({ itemId: undefined, quantity: 1 });
        }
      })
      .catch((info: any) => {
        console.log('Validate Failed:', info);
      });
  };

  // Remove item from the list
  const removeItem = (key: string) => {
    setSelectedItems(selectedItems.filter(item => item.key !== key));
  };

  // Table columns
  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            title="Preview"
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => removeItem(record.key)}
            title="Remove"
          />
        </Space>
      ),
    },
  ];

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="printType" label="Print Type" initialValue="barcode" rules={[{ required: true }]}>
            <Radio.Group>
              <Space direction="horizontal">
                <Radio.Button value="barcode">
                  <Space>
                    <BarcodeOutlined /> Barcode
                  </Space>
                </Radio.Button>
                <Radio.Button value="qrcode">
                  <Space>
                    <QrcodeOutlined /> QR Code
                  </Space>
                </Radio.Button>
                <Radio.Button value="both">
                  <Space>
                    <BarcodeOutlined /> Barcode & QR Code
                  </Space>
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Form.Item name="itemId" label="Select Item">
            <Select 
              placeholder="Select item" 
              allowClear 
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {inventoryItems.map(item => (
                <Option key={item.id} value={item.id}>{item.code} - {item.name}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="quantity" label="Quantity" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item>
            <Button type="dashed" onClick={addItem} block icon={<PlusOutlined />}>
              Add Item
            </Button>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Selected Items</Divider>

      <Table 
        columns={columns} 
        dataSource={selectedItems} 
        pagination={false} 
        size="small"
        scroll={{ y: 240 }}
      />

      <Divider orientation="left">Label Options</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="labelSize" label="Label Size" initialValue="medium">
            <Select placeholder="Select label size">
              <Option value="small">Small (38mm x 25mm)</Option>
              <Option value="medium">Medium (50mm x 30mm)</Option>
              <Option value="large">Large (100mm x 75mm)</Option>
              <Option value="custom">Custom Size</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="paperType" label="Paper Type" initialValue="adhesive">
            <Select placeholder="Select paper type">
              <Option value="adhesive">Adhesive Labels</Option>
              <Option value="thermal">Thermal Paper</Option>
              <Option value="plain">Plain Paper</Option>
              <Option value="card">Card Stock</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="columns" label="Columns" initialValue={2}>
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="rows" label="Rows" initialValue={8}>
            <InputNumber min={1} max={20} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="copies" label="Copies per Item" initialValue={1}>
            <InputNumber min={1} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Content Options</Divider>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="includeFields" label="Include on Label" initialValue={['itemCode', 'itemName']}>
            <Select mode="multiple" placeholder="Select fields to include">
              <Option value="itemCode">Item Code</Option>
              <Option value="itemName">Item Name</Option>
              <Option value="category">Category</Option>
              <Option value="price">Price</Option>
              <Option value="date">Date</Option>
              <Option value="company">Company Name</Option>
              <Option value="logo">Company Logo</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Space>
              <Button type="primary" icon={<PrinterOutlined />}>
                Print Labels
              </Button>
              <Button icon={<EyeOutlined />}>
                Preview
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default PrintDrawer;