import React, { useState } from 'react';
import { Drawer, Form, Input, Button, Table, Space, Typography, Tag, Switch } from 'antd';
import { AppstoreOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

const { Title, Text } = Typography;

interface CategoryDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  active: boolean;
  description?: string;
}

const CategoryDrawer: React.FC<CategoryDrawerProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [isAddMode, setIsAddMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Mock data
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Sales', type: 'income', active: true, description: 'Revenue from product sales' },
    { id: '2', name: 'Services', type: 'income', active: true, description: 'Revenue from services' },
    { id: '3', name: 'Rent', type: 'expense', active: true, description: 'Office space rent' },
    { id: '4', name: 'Utilities', type: 'expense', active: true, description: 'Electricity, water, internet, etc.' },
    { id: '5', name: 'Salaries', type: 'expense', active: true, description: 'Employee salaries and wages' },
  ]);

  const handleAddCategory = () => {
    setIsAddMode(true);
    setEditingCategory(null);
    form.resetFields();
  };

  const handleEditCategory = (record: Category) => {
    setIsAddMode(false);
    setEditingCategory(record);
    form.setFieldsValue(record);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (isAddMode) {
        // Add new category
        const newCategory: Category = {
          id: Math.random().toString(36).substr(2, 9),
          ...values,
        };
        setCategories([...categories, newCategory]);
      } else if (editingCategory) {
        // Update existing category
        const updatedCategories = categories.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...values } : cat
        );
        setCategories(updatedCategories);
      }
      
      setIsAddMode(false);
      setEditingCategory(null);
      form.resetFields();
    });
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(
      categories.map(cat => 
        cat.id === id ? { ...cat, active: !cat.active } : cat
      )
    );
  };

  const columns: TableProps<Category>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: Category) => (
        <Switch 
          checked={active} 
          size="small"
          onChange={() => toggleCategoryStatus(record.id)} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditCategory(record)} 
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteCategory(record.id)} 
          />
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AppstoreOutlined style={{ color: '#722ed1', fontSize: '18px' }} />
          <span>Manage Categories</span>
        </div>
      }
      width={620}
      open={open}
      onClose={onClose}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      }
    >
      {(isAddMode || editingCategory) ? (
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>
            {isAddMode ? 'Add New Category' : 'Edit Category'}
          </Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ type: 'expense', active: true }}
          >
            <Form.Item
              name="name"
              label="Category Name"
              rules={[{ required: true, message: 'Please enter category name' }]}
            >
              <Input placeholder="Enter category name" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Category Type"
              rules={[{ required: true }]}
            >
              <Input.Group compact>
                <Button 
                  style={{ width: '50%', borderRadius: '2px 0 0 2px' }}
                  type={form.getFieldValue('type') === 'income' ? 'primary' : 'default'}
                  onClick={() => form.setFieldsValue({ type: 'income' })}
                >
                  Income
                </Button>
                <Button 
                  style={{ width: '50%', borderRadius: '0 2px 2px 0' }}
                  type={form.getFieldValue('type') === 'expense' ? 'primary' : 'default'}
                  onClick={() => form.setFieldsValue({ type: 'expense' })}
                >
                  Expense
                </Button>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
            >
              <Input.TextArea rows={3} placeholder="Enter description" />
            </Form.Item>

            <Form.Item
              name="active"
              valuePropName="checked"
              label="Status"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {isAddMode ? 'Add Category' : 'Update Category'}
                </Button>
                <Button onClick={() => {
                  setIsAddMode(false);
                  setEditingCategory(null);
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      ) : null}

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={false}
        size="middle"
        style={{ marginTop: isAddMode || editingCategory ? 24 : 0 }}
        scroll={{ y: isAddMode || editingCategory ? 300 : 400 }}
      />
    </Drawer>
  );
};

export default CategoryDrawer;
