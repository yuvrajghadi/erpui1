/**
 * WIP Stitching Screen
 * Track stitching process work-in-progress by line
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
  Progress,
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

interface WIPStitching {
  id: string;
  styleCode: string;
  styleName: string;
  lineNo: string;
  qtyIssued: number;
  qtyCompleted: number;
  defectQty: number;
  balanceQty: number;
  remarks?: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

const SAMPLE_WIP_STITCHING: WIPStitching[] = [
  {
    id: '1',
    styleCode: 'STY-001',
    styleName: 'Classic Polo Shirt',
    lineNo: 'LINE-A1',
    qtyIssued: 500,
    qtyCompleted: 450,
    defectQty: 8,
    balanceQty: 42,
    remarks: 'Production in progress',
    status: 'in_progress',
  },
  {
    id: '2',
    styleCode: 'STY-002',
    styleName: 'Denim Jeans',
    lineNo: 'LINE-B2',
    qtyIssued: 300,
    qtyCompleted: 300,
    defectQty: 5,
    balanceQty: 0,
    remarks: 'Batch completed',
    status: 'completed',
  },
  {
    id: '3',
    styleCode: 'STY-003',
    styleName: 'T-Shirt',
    lineNo: 'LINE-A2',
    qtyIssued: 600,
    qtyCompleted: 200,
    defectQty: 10,
    balanceQty: 390,
    remarks: 'Started today',
    status: 'in_progress',
  },
  {
    id: '4',
    styleCode: 'STY-004',
    styleName: 'Cargo Pants',
    lineNo: 'LINE-C1',
    qtyIssued: 250,
    qtyCompleted: 0,
    defectQty: 0,
    balanceQty: 250,
    remarks: 'Waiting to start',
    status: 'not_started',
  },
  {
    id: '5',
    styleCode: 'STY-005',
    styleName: 'Hooded Sweatshirt',
    lineNo: 'LINE-A3',
    qtyIssued: 400,
    qtyCompleted: 380,
    defectQty: 15,
    balanceQty: 5,
    remarks: 'Almost finished',
    status: 'in_progress',
  },
];

const WIPStitchingScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<WIPStitching[]>(SAMPLE_WIP_STITCHING);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WIPStitching | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      title: 'Style',
      key: 'style',
      fixed: 'left' as const,
      width: 180,
      render: (_: any, record: WIPStitching) => (
        <Space>
          <Tooltip title="Update Progress">
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
                // find a matching lot and hold it
                const lots = wipStore.listWipLots();
                const found = lots.find(l => l.styleId === record.styleCode || l.styleId === record.styleCode);
                if (found) {
                  wipStore.holdLot(found.lotNumber, 'QA Hold from Stitching');
                  message.success(`Lot ${found.lotNumber} placed on hold`);
                } else {
                  message.warning('No matching WIP lot found to hold');
                }
              }}
            >Hold</Button>
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
    {
      title: 'Line No',
      dataIndex: 'lineNo',
      key: 'lineNo',
      width: 110,
      render: (line: string) => <Tag color="purple">{line}</Tag>,
    },
    {
      title: 'Qty Issued',
      dataIndex: 'qtyIssued',
      key: 'qtyIssued',
      width: 110,
      align: 'right' as const,
      render: (qty: number) => qty.toLocaleString(),
    },
    {
      title: 'Qty Completed',
      dataIndex: 'qtyCompleted',
      key: 'qtyCompleted',
      width: 130,
      align: 'right' as const,
      render: (qty: number) => (
        <span style={{ color: 'var(--color-52c41a)', fontWeight: 500 }}>
          {qty.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Balance Qty',
      dataIndex: 'balanceQty',
      key: 'balanceQty',
      width: 120,
      align: 'right' as const,
      render: (qty: number) => (
        <strong style={{ color: qty > 0 ? 'var(--color-1890ff)' : 'var(--color-999999)' }}>
          {qty.toLocaleString()}
        </strong>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 150,
      render: (_: any, record: WIPStitching) => {
        const percentage = Math.round((record.qtyCompleted / record.qtyIssued) * 100);
        return (
          <Progress
            percent={percentage}
            size="small"
            status={percentage === 100 ? 'success' : 'active'}
          />
        );
      },
    },
    {
      title: 'Defect',
      dataIndex: 'defectQty',
      key: 'defectQty',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => (
        <span style={{ color: qty > 0 ? 'var(--color-ff4d4f)' : 'inherit' }}>
          {qty.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          not_started: 'default',
          in_progress: 'processing',
          completed: 'success',
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
      render: (_: any, record: WIPStitching) => (
        <Tooltip title="Update Progress">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={record.status === 'completed'}
          />
        </Tooltip>
      ),
    },
  ];

  const handleEdit = (record: WIPStitching) => {
    setEditingRecord(record);
    form.setFieldsValue({
      styleCode: record.styleCode,
      styleName: record.styleName,
      lineNo: record.lineNo,
      qtyIssued: record.qtyIssued,
      balanceQty: record.balanceQty,
      completedQty: 0,
      defectQty: 0,
      remarks: '',
    });
    setDrawerVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        const newQtyCompleted = editingRecord.qtyCompleted + values.completedQty;
        const newDefectQty = editingRecord.defectQty + values.defectQty;
        const newBalanceQty = editingRecord.balanceQty - values.completedQty - values.defectQty;
        const newStatus = newBalanceQty === 0 ? 'completed' : 'in_progress';

        setData(data.map(item => 
          item.id === editingRecord.id 
            ? {
                ...item,
                qtyCompleted: newQtyCompleted,
                defectQty: newDefectQty,
                balanceQty: newBalanceQty,
                status: newStatus,
                remarks: values.remarks || item.remarks,
              }
            : item
        ));
        message.success('Stitching update submitted successfully');
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
  const totalQtyIssued = data.reduce((sum, item) => sum + item.qtyIssued, 0);
  const totalQtyCompleted = data.reduce((sum, item) => sum + item.qtyCompleted, 0);
  const totalDefect = data.reduce((sum, item) => sum + item.defectQty, 0);
  const totalBalance = data.reduce((sum, item) => sum + item.balanceQty, 0);
  const overallProgress = totalQtyIssued > 0 ? Math.round((totalQtyCompleted / totalQtyIssued) * 100) : 0;

  return (
    <div className="wip-stitching-screen">
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Issued</div>
            <Statistic
              value={totalQtyIssued}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Completed</div>
            <Statistic
              value={totalQtyCompleted}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Defect</div>
            <Statistic
              value={totalDefect}
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
            <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>WIP - Stitching Process</span>
            <Tag color="blue">{overallProgress}% Complete</Tag>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search stitching..."
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
          scroll={{ x: 1200 }}
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
        title="Stitching Update"
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
                Submit Update
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
                name="lineNo"
                label="Line Number"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="qtyIssued"
                label="Total Issued"
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
                name="completedQty"
                label={<span><span style={{ color: 'red' }}>* </span>Completed Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter completed quantity' },
                  { type: 'number', min: 0, message: 'Quantity cannot be negative' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const balance = getFieldValue('balanceQty') || 0;
                      const defect = getFieldValue('defectQty') || 0;
                      if (value + defect <= balance) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Total exceeds available balance'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter completed quantity"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="defectQty"
                label={<span><span style={{ color: 'red' }}>* </span>Defect Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter defect quantity' },
                  { type: 'number', min: 0, message: 'Quantity cannot be negative' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const balance = getFieldValue('balanceQty') || 0;
                      const completed = getFieldValue('completedQty') || 0;
                      if (value + completed <= balance) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Total exceeds available balance'));
                    },
                  }),
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter defect quantity"
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

export default WIPStitchingScreen;
