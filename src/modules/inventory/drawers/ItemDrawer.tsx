import React from 'react';
import { Form, Input, Select, InputNumber, Upload, Row, Col, Divider, DatePicker, Switch } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;
const { TextArea } = Input;

interface ItemDrawerProps {
  form?: any; // Optional form instance if controlled from parent
}

const ItemDrawer: React.FC<ItemDrawerProps> = ({ form }) => {
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="itemCode" label="Item Code" rules={[{ required: true, message: 'Please enter item code' }]}>
            <Input placeholder="Item Code" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="barcode" label="Barcode/SKU">
            <Input placeholder="Barcode/SKU" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="itemName" label="Item Name" rules={[{ required: true, message: 'Please enter item name' }]}>
            <Input placeholder="Item Name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select category' }]}>
            <Select placeholder="Select category">
              <Option value="raw">Raw Materials</Option>
              <Option value="finished">Finished Goods</Option>
              <Option value="wip">Work in Progress</Option>
              <Option value="packaging">Packaging Materials</Option>
              <Option value="consumables">Consumables</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="subCategory" label="Sub Category">
            <Select placeholder="Select sub category">
              <Option value="fabric">Fabric</Option>
              <Option value="yarn">Yarn</Option>
              <Option value="dyes">Dyes & Chemicals</Option>
              <Option value="accessories">Accessories</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="quantity" label="Initial Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Quantity" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="unit" label="Unit of Measure" rules={[{ required: true, message: 'Please select unit' }]}>
            <Select placeholder="Select unit">
              <Option value="pcs">Pieces</Option>
              <Option value="kg">Kilograms</Option>
              <Option value="m">Meters</Option>
              <Option value="yards">Yards</Option>
              <Option value="rolls">Rolls</Option>
              <Option value="boxes">Boxes</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="minStock" label="Minimum Stock Level">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Min Stock" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="costPrice" label="Cost Price" rules={[{ required: true, message: 'Please enter cost price' }]}>
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => Number(value?.replace(/₹\s?|(,*)/g, ''))}
              placeholder="Cost Price"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="sellingPrice" label="Selling Price">
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              // parser={value => value?.replace(/₹\s?|(,*)/g, '')}
              placeholder="Selling Price"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="location" label="Storage Location">
            <Input placeholder="Storage Location" />
          </Form.Item>
        </Col>
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
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="manufactureDate" label="Manufacture Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="expiryDate" label="Expiry Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Divider orientation="left">Additional Information</Divider>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Description" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="color" label="Color">
            <Input placeholder="Color" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="size" label="Size/Dimensions">
            <Input placeholder="Size/Dimensions" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="weight" label="Weight">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="Weight" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="weightUnit" label="Weight Unit">
            <Select placeholder="Select weight unit">
              <Option value="g">Grams</Option>
              <Option value="kg">Kilograms</Option>
              <Option value="lb">Pounds</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="trackable" label="Enable Tracking" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="active" label="Active Status" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="images"
            label="Item Images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload.Dragger name="files" action="/upload.do" listType="picture-card" maxCount={5}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">Support for a single or bulk upload. Max 5 images.</p>
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ItemDrawer;