/**
 * WIP Washing Screen
 * Track washing process work-in-progress
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

interface WIPWashing {
  id: string;
  styleCode: string;
  styleName: string;
  color: string;
  qtySent: number;
  qtyReceived: number;
  damageQty: number;
  balanceQty: number;
  remarks?: string;
  status: 'sent' | 'in_process' | 'received' | 'partial';
}

const SAMPLE_WIP_WASHING: WIPWashing[] = [
  {
    id: '1',
    styleCode: 'STY-001',
    styleName: 'Classic Polo Shirt',
    color: 'White',
    qtySent: 500,
    qtyReceived: 480,
    damageQty: 5,
    balanceQty: 15,
    remarks: 'Some pieces still in washing',
    status: 'partial',
  },
  {
    id: '2',
    styleCode: 'STY-002',
    styleName: 'Denim Jeans',
    color: 'Blue',
    qtySent: 300,
    qtyReceived: 290,
    damageQty: 10,
    balanceQty: 0,
    remarks: 'Stone washing completed',
    status: 'received',
  },
  {
    id: '3',
    styleCode: 'STY-003',
    styleName: 'T-Shirt',
    color: 'Black',
    qtySent: 600,
    qtyReceived: 0,
    damageQty: 0,
    balanceQty: 600,
    remarks: 'Just sent for washing',
    status: 'sent',
  },
  {
    id: '4',
    styleCode: 'STY-004',
    styleName: 'Cargo Pants',
    color: 'Olive Green',
    qtySent: 250,
    qtyReceived: 100,
    damageQty: 3,
    balanceQty: 147,
    remarks: 'Washing in progress',
    status: 'partial',
  },
];

const WIPWashingScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<WIPWashing[]>(SAMPLE_WIP_WASHING);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WIPWashing | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Style',
      key: 'style',
      fixed: 'left' as const,
      width: 180,
      render: (_: any, record: WIPWashing) => (
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
      title: 'Qty Sent',
      dataIndex: 'qtySent',
      key: 'qtySent',
      width: 110,
      align: 'right' as const,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: 'Qty Received',
      dataIndex: 'qtyReceived',
      key: 'qtyReceived',
      width: 130,
      align: 'right' as const,
      render: (qty: number) => (
        <span style={{ color: 'var(--color-52c41a)', fontWeight: 500 }}>
          {qty.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Damage',
      dataIndex: 'damageQty',
      key: 'damageQty',
      width: 100,
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
          sent: 'default',
          in_process: 'processing',
          partial: 'warning',
          received: 'success',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 80,
      render: (_: any, record: WIPWashing) => (
        <Space>
          <Tooltip title="Washing Entry">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status === 'received'}
            />
          </Tooltip>
          <Tooltip title="Transfer Lot">
            <Button
              type="text"
              size="small"
              onClick={() => {
                // simple transfer demo
                const lots = wipStore.listWipLots();
                const found = lots.find(l => l.styleId === record.styleCode || l.styleId === record.styleCode);
                if (found) {
                  wipStore.transferLot(found.lotNumber, 'Line-B', Math.min(10, found.totalQty));
                  message.success(`Transferred 10 pcs of ${found.lotNumber}`);
                } else message.warning('No matching lot to transfer');
              }}
            >Transfer</Button>
          </Tooltip>
          <Tooltip title="View Ledger">
            <Button
              type="text"
              size="small"
              onClick={() => {
                const lots = wipStore.listWipLots();
                const found = lots.find(l => l.styleId === record.styleCode || l.styleId === record.styleCode);
                if (found) {
                  const entries = wipStore.getLedgerForLot(found.lotNumber);
                  console.table(entries);
                  message.info(`Ledger printed to console for ${found.lotNumber}`);
                } else {
                  message.warning('No matching WIP lot ledger found');
                }
              }}
            >Ledger</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record: WIPWashing) => {
    setEditingRecord(record);
    form.setFieldsValue({
      styleCode: record.styleCode,
      styleName: record.styleName,
      color: record.color,
      qtySent: record.qtySent,
      balanceQty: record.balanceQty,
      receivedQty: 0,
      damageQty: 0,
      remarks: '',
    });
    setDrawerVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        const newQtyReceived = editingRecord.qtyReceived + values.receivedQty;
        const newDamageQty = editingRecord.damageQty + values.damageQty;
        const newBalanceQty = editingRecord.balanceQty - values.receivedQty - values.damageQty;
        const newStatus = newBalanceQty === 0 ? 'received' : 'partial';

        setData(data.map(item => 
          item.id === editingRecord.id 
            ? {
                ...item,
                qtyReceived: newQtyReceived,
                damageQty: newDamageQty,
                balanceQty: newBalanceQty,
                status: newStatus,
                remarks: values.remarks || item.remarks,
              }
            : item
        ));
        message.success('Washing entry submitted successfully');
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
  const totalQtySent = data.reduce((sum, item) => sum + item.qtySent, 0);
  const totalQtyReceived = data.reduce((sum, item) => sum + item.qtyReceived, 0);
  const totalDamage = data.reduce((sum, item) => sum + item.damageQty, 0);
  const totalBalance = data.reduce((sum, item) => sum + item.balanceQty, 0);

  return (
    <div className="wip-washing-screen">
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Sent</div>
            <Statistic
              value={totalQtySent}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Received</div>
            <Statistic
              value={totalQtyReceived}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Damage</div>
            <Statistic
              value={totalDamage}
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
            <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>WIP - Washing/Job Work</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search washing..."
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
        title="Washing Entry"
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
                name="qtySent"
                label="Total Sent"
              >
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
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
                name="receivedQty"
                label={<span><span style={{ color: 'red' }}>* </span>Received Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter received quantity' },
                  { type: 'number', min: 0, message: 'Quantity cannot be negative' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const balance = getFieldValue('balanceQty') || 0;
                      const damage = getFieldValue('damageQty') || 0;
                      if (value + damage <= balance) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Total exceeds available balance'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter received quantity"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="damageQty"
                label={<span><span style={{ color: 'red' }}>* </span>Damage Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter damage quantity' },
                  { type: 'number', min: 0, message: 'Quantity cannot be negative' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const balance = getFieldValue('balanceQty') || 0;
                      const received = getFieldValue('receivedQty') || 0;
                      if (value + received <= balance) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Total exceeds available balance'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter damage quantity"
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

export default WIPWashingScreen;
