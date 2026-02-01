/**
 * Material Returns Screen
 * Handle returns from cutting, stitching, or job work processes
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Form,
  Row,
  Col,
  Select,
  Drawer,
  Tag,
  message,
  InputNumber,
  DatePicker,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import stockStore from '../../store/stockStore';
import issueStore from '../../store/issueStore';
import wipStore from '../../store/wipStore';

const { TextArea } = Input;

interface MaterialReturn {
  id: string;
  returnNo: string;
  returnDate: Date;
  returnType: 'from_cutting' | 'from_stitching' | 'from_job_work';
  issueReference: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  uom: string;
  reason: 'excess' | 'damage' | 'rework';
  remarks?: string;
  returnedBy: string;
  status: 'pending' | 'approved' | 'rejected';
}

const SAMPLE_RETURNS: MaterialReturn[] = [
  {
    id: '1',
    returnNo: 'RET-2025-001',
    returnDate: new Date('2025-01-03'),
    returnType: 'from_cutting',
    issueReference: 'ISS-2025-001',
    materialCode: 'FAB-001',
    materialName: 'Cotton Single Jersey - White',
    quantity: 15.5,
    uom: 'kg',
    reason: 'excess',
    remarks: 'Excess material after cutting',
    returnedBy: 'Ramesh Kumar',
    status: 'approved',
  },
  {
    id: '2',
    returnNo: 'RET-2025-002',
    returnDate: new Date('2025-01-02'),
    returnType: 'from_stitching',
    issueReference: 'ISS-2024-098',
    materialCode: 'TRM-012',
    materialName: 'Cotton Thread - White',
    quantity: 5,
    uom: 'piece',
    reason: 'damage',
    remarks: 'Thread damaged during stitching',
    returnedBy: 'Suresh Patel',
    status: 'pending',
  },
  {
    id: '3',
    returnNo: 'RET-2025-003',
    returnDate: new Date('2025-01-01'),
    returnType: 'from_job_work',
    issueReference: 'JWO-2024-045',
    materialCode: 'FAB-005',
    materialName: 'Denim Fabric - Blue',
    quantity: 25,
    uom: 'meter',
    reason: 'rework',
    remarks: 'Quality issue - needs rework',
    returnedBy: 'Job Work Vendor A',
    status: 'approved',
  },
];

const ReturnsScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<MaterialReturn[]>(SAMPLE_RETURNS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaterialReturn | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Return No',
      dataIndex: 'returnNo',
      key: 'returnNo',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Return Type',
      dataIndex: 'returnType',
      key: 'returnType',
      width: 140,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          from_cutting: 'blue',
          from_stitching: 'purple',
          from_job_work: 'orange',
        };
        const labelMap: Record<string, string> = {
          from_cutting: 'From Cutting',
          from_stitching: 'From Stitching',
          from_job_work: 'From Job Work',
        };
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>;
      },
    },
    {
      title: 'Material',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 220,
      render: (name: string, record: MaterialReturn) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-999999)' }}>{record.materialCode}</div>
        </div>
      ),
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: MaterialReturn) => (
        <span>{record.quantity} {record.uom}</span>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 110,
      render: (reason: string) => {
        const colorMap: Record<string, string> = {
          excess: 'success',
          damage: 'error',
          rework: 'warning',
        };
        return <Tag color={colorMap[reason]}>{reason.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
        };
        return <Tag color={colorMap[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Return Date',
      dataIndex: 'returnDate',
      key: 'returnDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Returned By',
      dataIndex: 'returnedBy',
      key: 'returnedBy',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: MaterialReturn) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status === 'approved'}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              disabled={record.status === 'approved'}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    form.resetFields();
    setEditingRecord(null);
    setDrawerVisible(true);
  };

  const handleEdit = (record: MaterialReturn) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      returnDate: dayjs(record.returnDate),
    });
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('Return deleted successfully');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const returnData = {
        ...values,
        returnDate: values.returnDate.toDate(),
      };

      if (editingRecord) {
        setData(data.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...returnData }
            : item
        ));
        message.success('Return updated successfully');
      } else {
        const newReturn: MaterialReturn = {
          id: `${data.length + 1}`,
          returnNo: `RET-2025-${String(data.length + 1).padStart(3, '0')}`,
          ...returnData,
          returnedBy: 'Current User',
          status: 'pending',
        };
        // Auto route based on reason: rework -> WIP, damage -> damaged stock, excess -> raw stock
        if (newReturn.reason === 'rework') {
          // send to WIP (mock)
          wipStore.reworkLot(newReturn.materialCode || 'UNKNOWN', 'cutting', 'stitching', newReturn.quantity as any, 'Auto rework from return');
          message.info('Return routed to WIP for rework (mock)');
        } else if (newReturn.reason === 'damage') {
          stockStore.addToDamagedStock({ itemId: newReturn.materialCode, itemName: newReturn.materialName, lotNumber: newReturn.issueReference, quantity: newReturn.quantity, uom: newReturn.uom, reference: newReturn.returnNo });
          message.info('Return routed to damaged stock (mock)');
        } else {
          stockStore.addToRawStock({ itemId: newReturn.materialCode, itemName: newReturn.materialName, lotNumber: newReturn.issueReference, quantity: newReturn.quantity, uom: newReturn.uom, reference: newReturn.returnNo });
          message.info('Return routed back to Raw stock (mock)');
        }
        setData([newReturn, ...data]);
        message.success('Return created successfully');
      }

      setDrawerVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="returns-screen">
      <Card
        title={
          <Space>
            <RollbackOutlined />
            <span>Material Returns</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search returns..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              New Return
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} returns`,
          }}
          size="small"
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Material Return' : 'New Material Return'}
        width={720}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={loading}
              >
                Save Return
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            returnDate: dayjs(),
            uom: 'kg',
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="returnType"
                label={<span><span style={{ color: 'red' }}>* </span>Return Type</span>}
                rules={[{ required: true, message: 'Please select return type' }]}
              >
                <Select placeholder="Select return type">
                  <Select.Option value="from_cutting">From Cutting</Select.Option>
                  <Select.Option value="from_stitching">From Stitching</Select.Option>
                  <Select.Option value="from_job_work">From Job Work</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="returnDate"
                label={<span><span style={{ color: 'red' }}>* </span>Return Date</span>}
                rules={[{ required: true, message: 'Please select return date' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="issueReference"
                label={<span><span style={{ color: 'red' }}>* </span>Original Issue Reference</span>}
                rules={[{ required: true, message: 'Please select issue reference' }]}
              >
                <Select
                  placeholder="Select original issue"
                  showSearch
                  optionFilterProp="children"
                >
                  <Select.Option value="ISS-2025-001">ISS-2025-001 - Cotton Fabric to Cutting</Select.Option>
                  <Select.Option value="ISS-2025-002">ISS-2025-002 - Thread to Stitching</Select.Option>
                  <Select.Option value="JWO-2024-045">JWO-2024-045 - Denim to Job Work</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="materialCode"
                label={<span><span style={{ color: 'red' }}>* </span>Material</span>}
                rules={[{ required: true, message: 'Please select material' }]}
              >
                <Select
                  placeholder="Select material"
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) => {
                    const material = value.split(' - ');
                    form.setFieldValue('materialName', material[1] || '');
                  }}
                >
                  <Select.Option value="FAB-001 - Cotton Single Jersey - White">
                    FAB-001 - Cotton Single Jersey - White
                  </Select.Option>
                  <Select.Option value="FAB-005 - Denim Fabric - Blue">
                    FAB-005 - Denim Fabric - Blue
                  </Select.Option>
                  <Select.Option value="TRM-012 - Cotton Thread - White">
                    TRM-012 - Cotton Thread - White
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="materialName" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="quantity"
                label={<span><span style={{ color: 'red' }}>* </span>Return Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter return quantity' },
                  { type: 'number', min: 0.01, message: 'Quantity must be greater than 0' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter quantity"
                  min={0.01}
                  step={0.01}
                  precision={2}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="uom"
                label={<span><span style={{ color: 'red' }}>* </span>UOM</span>}
                rules={[{ required: true, message: 'Please select UOM' }]}
              >
                <Select placeholder="Select UOM">
                  <Select.Option value="kg">KG</Select.Option>
                  <Select.Option value="meter">Meter</Select.Option>
                  <Select.Option value="piece">Piece</Select.Option>
                  <Select.Option value="yard">Yard</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="reason"
                label={<span><span style={{ color: 'red' }}>* </span>Return Reason</span>}
                rules={[{ required: true, message: 'Please select return reason' }]}
              >
                <Select placeholder="Select reason">
                  <Select.Option value="excess">Excess Material</Select.Option>
                  <Select.Option value="damage">Damage</Select.Option>
                  <Select.Option value="rework">Rework Required</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="remarks"
                label="Remarks"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter any additional remarks..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default ReturnsScreen;
