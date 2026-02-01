/**
 * WIP Finishing Screen
 * Track finishing process work-in-progress
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
  Drawer,
  Tag,
  message,
  InputNumber,
  Tooltip,
  Statistic,
} from 'antd';
import {
  EditOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

import wipStore from '../../store/wipStore';

const { TextArea } = Input;

interface WIPFinishing {
  id: string;
  styleCode: string;
  styleName: string;
  color: string;
  qtyIn: number;
  qtyOut: number;
  rejectionQty: number;
  balanceQty: number;
  remarks?: string;
  status: 'in_progress' | 'completed' | 'on_hold';
}

const SAMPLE_WIP_FINISHING: WIPFinishing[] = [
  {
    id: '1',
    styleCode: 'STY-001',
    styleName: 'Classic Polo Shirt',
    color: 'White',
    qtyIn: 500,
    qtyOut: 450,
    rejectionQty: 10,
    balanceQty: 40,
    remarks: 'Quality check in progress',
    status: 'in_progress',
  },
  {
    id: '2',
    styleCode: 'STY-002',
    styleName: 'Denim Jeans',
    color: 'Blue',
    qtyIn: 300,
    qtyOut: 300,
    rejectionQty: 5,
    balanceQty: 0,
    remarks: 'Batch completed',
    status: 'completed',
  },
  {
    id: '3',
    styleCode: 'STY-003',
    styleName: 'T-Shirt',
    color: 'Black',
    qtyIn: 600,
    qtyOut: 200,
    rejectionQty: 15,
    balanceQty: 385,
    remarks: 'Pressing in progress',
    status: 'in_progress',
  },
  {
    id: '4',
    styleCode: 'STY-004',
    styleName: 'Cargo Pants',
    color: 'Olive Green',
    qtyIn: 250,
    qtyOut: 0,
    rejectionQty: 0,
    balanceQty: 250,
    remarks: 'Just received from washing',
    status: 'in_progress',
  },
];

const WIPFinishingScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<WIPFinishing[]>(SAMPLE_WIP_FINISHING);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WIPFinishing | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Style',
      key: 'style',
      fixed: 'left' as const,
      width: 180,
      render: (_: any, record: WIPFinishing) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.styleName}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-999999)' }}>{record.styleCode}</div>
        </div>
      ),
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: 120,
      render: (color: string) => <Tag color="blue">{color}</Tag>,
    },
    {
      title: 'Qty In',
      dataIndex: 'qtyIn',
      key: 'qtyIn',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: 'Qty Out',
      dataIndex: 'qtyOut',
      key: 'qtyOut',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => <span style={{ color: 'var(--color-52c41a)', fontWeight: 500 }}>{qty.toLocaleString()}</span>,
    },
    {
      title: 'Rejection Qty',
      dataIndex: 'rejectionQty',
      key: 'rejectionQty',
      width: 120,
      align: 'right' as const,
      render: (qty: number) => (
        <span style={{ color: qty > 0 ? 'var(--color-ff4d4f)' : 'inherit' }}>
          {qty.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balanceQty',
      key: 'balanceQty',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => (
        <strong style={{ color: qty > 0 ? 'var(--color-1890ff)' : 'var(--color-999999)' }}>
          {qty.toLocaleString()}
        </strong>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          in_progress: 'processing',
          completed: 'success',
          on_hold: 'warning',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 80,
      render: (_: any, record: WIPFinishing) => (
        <Space>
          <Tooltip title="Finish Entry">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status === 'completed'}
            />
          </Tooltip>
          <Tooltip title="Hold Lot">
            <Button
              type="text"
              size="small"
              onClick={() => {
                const lots = wipStore.listWipLots();
                const found = lots.find(l => l.styleId === record.styleCode || l.styleId === record.styleCode);
                if (found) {
                  wipStore.holdLot(found.lotNumber, 'Buyer Hold from Finishing');
                  message.success(`Lot ${found.lotNumber} placed on hold`);
                } else message.warning('No matching WIP lot found');
              }}
            >Hold</Button>
          </Tooltip>
          <Tooltip title="Send For Rework">
            <Button
              type="text"
              size="small"
              onClick={() => {
                const lots = wipStore.listWipLots();
                const found = lots.find(l => l.styleId === record.styleCode || l.styleId === record.styleCode);
                if (found) {
                  wipStore.reworkLot(found.lotNumber, 'finishing', 'stitching', Math.min(5, found.totalQty), 'Rework due to seam');
                  message.success('Rework created and routed to Stitching');
                } else message.warning('No matching WIP lot found for rework');
              }}
            >Rework</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: WIPFinishing) => {
    setEditingRecord(record);
    form.setFieldsValue({
      styleCode: record.styleCode,
      styleName: record.styleName,
      color: record.color,
      balanceQty: record.balanceQty,
      finishedQty: 0,
      rejectionQty: 0,
      remarks: '',
    });
    setDrawerVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        const newQtyOut = editingRecord.qtyOut + values.finishedQty;
        const newRejectionQty = editingRecord.rejectionQty + values.rejectionQty;
        const newBalanceQty = editingRecord.balanceQty - values.finishedQty - values.rejectionQty;
        const newStatus = newBalanceQty === 0 ? 'completed' : editingRecord.status;

        setData(data.map(item => 
          item.id === editingRecord.id 
            ? {
                ...item,
                qtyOut: newQtyOut,
                rejectionQty: newRejectionQty,
                balanceQty: newBalanceQty,
                status: newStatus,
                remarks: values.remarks || item.remarks,
              }
            : item
        ));
        message.success('Finishing entry submitted successfully');
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

  // Calculate statistics
  const totalQtyIn = data.reduce((sum, item) => sum + item.qtyIn, 0);
  const totalQtyOut = data.reduce((sum, item) => sum + item.qtyOut, 0);
  const totalRejection = data.reduce((sum, item) => sum + item.rejectionQty, 0);
  const totalBalance = data.reduce((sum, item) => sum + item.balanceQty, 0);

  return (
    <div className="wip-finishing-screen">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Qty In</div>
            <Statistic
              value={totalQtyIn}
              valueStyle={{ color: 'var(--color-1890ff)', fontSize: '24px', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Finished Qty</div>
            <Statistic
              value={totalQtyOut}
              valueStyle={{ color: 'var(--color-52c41a)', fontSize: '24px', fontWeight: 700 }}
              prefix={<CheckCircleOutlined style={{ color: 'var(--color-52c41a)', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Rejection</div>
            <Statistic
              value={totalRejection}
              valueStyle={{ color: 'var(--color-ff4d4f)', fontSize: '24px', fontWeight: 700 }}
              prefix={<CloseCircleOutlined style={{ color: 'var(--color-ff4d4f)', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Balance</div>
            <Statistic
              value={totalBalance}
              valueStyle={{ color: totalBalance > 0 ? 'var(--color-faad14)' : 'var(--color-999999)', fontSize: '24px', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>WIP - Finishing Process</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search finishing..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<ExportOutlined />}>Export</Button>
          </Space>
        }
        style={{
          borderRadius: '12px',
          border: '2px solid var(--color-e8e8e8)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        headStyle={{
          borderBottom: '2px solid var(--color-f0f0f0)',
          background: 'linear-gradient(135deg, var(--page-bg) 0%, var(--table-header-bg) 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '16px 24px',
        }}
        bodyStyle={{ padding: '24px', background: 'var(--color-ffffff)' }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          size="small"
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title="Finish Entry"
        width={600}
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
                Submit Entry
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="styleCode"
                label="Style Code"
              >
                <Input disabled style={{ fontWeight: 500 }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="styleName"
                label="Style Name"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="color"
                label="Color"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="balanceQty"
                label="Available Balance"
              >
                <InputNumber disabled style={{ width: '100%', fontWeight: 500, color: 'var(--color-1890ff)' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="finishedQty"
                label={<span><span style={{ color: 'red' }}>* </span>Finished Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter finished quantity' },
                  { type: 'number', min: 0, message: 'Quantity cannot be negative' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const balance = getFieldValue('balanceQty') || 0;
                      const rejection = getFieldValue('rejectionQty') || 0;
                      if (value + rejection <= balance) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Total exceeds available balance'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter finished quantity"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="rejectionQty"
                label={<span><span style={{ color: 'red' }}>* </span>Rejection Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter rejection quantity' },
                  { type: 'number', min: 0, message: 'Quantity cannot be negative' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const balance = getFieldValue('balanceQty') || 0;
                      const finished = getFieldValue('finishedQty') || 0;
                      if (value + finished <= balance) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Total exceeds available balance'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter rejection quantity"
                  min={0}
                />
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

export default WIPFinishingScreen;
