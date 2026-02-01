/**
 * Damaged Stock Screen - ENHANCED with Variance Tracking
 * Track and manage damaged/rejected stock with comprehensive source tracking,
 * recoverability flags, recovery actions, and financial impact analysis
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
  Modal,
  Tag,
  message,
  Tooltip,
  Badge,
  InputNumber,
  DatePicker,
  Switch,
  Divider,
  Statistic,
} from 'antd';
import {
  EditOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { DAMAGED_STOCK_SOURCES } from '../../constants';
import type { DamagedStock as DamagedStockType } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const SAMPLE_DAMAGED_STOCK: DamagedStockType[] = [
  {
    id: '1',
    itemId: 'FAB-001',
    itemType: 'fabric',
    itemName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2024-001',
    shade: 'White',
    quantity: 25.5,
    uom: 'kg',
    sourceProcess: 'grn_qc_reject',
    sourceDocumentNumber: 'GRN-000123',
    damageDate: new Date('2025-01-03'),
    reasonCode: 'Oil Stain',
    damageDescription: 'Oil stains found during inspection',
    recoverable: true,
    recoveryAction: 'downgrade',
    warehouseId: 'WH-001',
    location: 'Quarantine-A1',
    status: 'under_review',
    originalValue: 5100,
    reportedBy: 'QC Team',
  },
  {
    id: '2',
    itemId: 'FAB-005',
    itemType: 'fabric',
    itemName: 'Denim Fabric - Blue',
    lotNumber: 'LOT-2024-015',
    shade: 'Indigo Blue',
    quantity: 15,
    uom: 'meter',
    sourceProcess: 'wip_cutting_reject',
    damageDate: new Date('2025-01-02'),
    reasonCode: 'Cutting Error',
    damageDescription: 'Damaged during cutting process',
    recoverable: false,
    recoveryAction: 'scrap',
    warehouseId: 'WH-001',
    status: 'approved_disposal',
    originalValue: 3000,
    lossValue: 3000,
    reportedBy: 'Cutting Supervisor',
    approvedBy: 'Manager',
    approvalDate: new Date('2025-01-03'),
  },
  {
    id: '3',
    itemId: 'TRM-012',
    itemType: 'trim',
    itemName: 'Cotton Thread - White',
    lotNumber: 'LOT-2024-032',
    quantity: 10,
    uom: 'piece',
    sourceProcess: 'job_work_damage',
    sourceDocumentNumber: 'JWO-000045',
    damageDate: new Date('2025-01-01'),
    reasonCode: 'Quality Defect',
    damageDescription: 'Thread breaking frequently',
    recoverable: true,
    recoveryAction: 'return_vendor',
    warehouseId: 'WH-001',
    status: 'disposed',
    originalValue: 500,
    recoveredValue: 500,
    reportedBy: 'Production Floor',
    disposalDate: new Date('2025-01-02'),
  },
  {
    id: '4',
    itemId: 'FAB-008',
    itemType: 'fabric',
    itemName: 'Polyester Fabric - Grey',
    lotNumber: 'LOT-2025-003',
    shade: 'Grey Melange',
    quantity: 30,
    uom: 'kg',
    sourceProcess: 'grn_qc_reject',
    sourceDocumentNumber: 'GRN-000156',
    damageDate: new Date('2025-01-04'),
    reasonCode: 'GSM Variance',
    damageDescription: 'GSM not matching specification - Expected 180, Actual 165',
    recoverable: true,
    recoveryAction: 'return_vendor',
    warehouseId: 'WH-001',
    location: 'Quarantine-A2',
    status: 'quarantine',
    originalValue: 6000,
    reportedBy: 'QC Team',
  },
  {
    id: '5',
    itemId: 'ACC-025',
    itemType: 'trim',
    itemName: 'Zipper - Metal',
    lotNumber: 'LOT-2024-045',
    quantity: 50,
    uom: 'piece',
    sourceProcess: 'packing_reject',
    damageDate: new Date('2025-01-03'),
    reasonCode: 'Functional Defect',
    damageDescription: 'Zipper not functioning properly',
    recoverable: true,
    recoveryAction: 'rework',
    warehouseId: 'WH-001',
    status: 'recovered',
    originalValue: 1000,
    recoveredValue: 700,
    lossValue: 300,
    reportedBy: 'Packing Team',
  },
];

const DamagedStockScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DamagedStockType[]>(SAMPLE_DAMAGED_STOCK);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DamagedStockType | null>(null);
  const [searchText, setSearchText] = useState('');
  const [showFinancials, setShowFinancials] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterRecoverable, setFilterRecoverable] = useState<boolean | undefined>();

  const columns = [
    {
      title: 'Item',
      key: 'item',
      fixed: 'left' as const,
      width: 200,
      render: (_: any, record: DamagedStockType) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.itemName}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-999999)' }}>{record.itemId}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-999999)', marginTop: 2 }}>
            <Tag color={record.itemType === 'fabric' ? 'blue' : 'cyan'} style={{ fontSize: 11 }}>
              {record.itemType.toUpperCase()}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Lot/Shade',
      key: 'lotShade',
      width: 150,
      render: (_: any, record: DamagedStockType) => (
        <div>
          <div><Tag color="purple">{record.lotNumber}</Tag></div>
          {record.shade && <div style={{ fontSize: '12px', marginTop: 4 }}>{record.shade}</div>}
          {record.rollNumber && <div style={{ fontSize: '11px', color: 'var(--color-666666)', marginTop: 2 }}>Roll: {record.rollNumber}</div>}
        </div>
      ),
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: DamagedStockType) => (
        <span style={{ color: 'var(--color-ff4d4f)', fontWeight: 500 }}>
          {record.quantity.toFixed(2)} {record.uom}
        </span>
      ),
    },
    {
      title: 'Source Process',
      dataIndex: 'sourceProcess',
      key: 'sourceProcess',
      width: 160,
      render: (source: string) => {
        const sourceInfo = DAMAGED_STOCK_SOURCES.find(s => s.value === source);
        const colorMap: Record<string, string> = {
          inward: 'blue',
          processing: 'cyan',
          wip: 'geekblue',
          fg: 'purple',
          dispatch: 'magenta',
          return: 'volcano',
        };
        return (
          <Tooltip title={sourceInfo?.label}>
            <Tag color={colorMap[sourceInfo?.category || 'processing']}>
              {sourceInfo?.label || source}
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reasonCode',
      key: 'reasonCode',
      width: 140,
      render: (reason: string, record: DamagedStockType) => (
        <Tooltip title={record.damageDescription}>
          <div>
            <Tag color="orange">{reason}</Tag>
            {record.sourceDocumentNumber && (
              <div style={{ fontSize: '11px', color: 'var(--color-666666)', marginTop: 2 }}>
                <FileTextOutlined /> {record.sourceDocumentNumber}
              </div>
            )}
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Recoverable',
      dataIndex: 'recoverable',
      key: 'recoverable',
      width: 110,
      align: 'center' as const,
      render: (recoverable: boolean) => (
        <Badge 
          status={recoverable ? 'success' : 'error'}
          text={
            <span style={{ color: recoverable ? 'var(--color-52c41a)' : 'var(--color-ff4d4f)' }}>
              {recoverable ? (
                <><CheckCircleOutlined /> Yes</>
              ) : (
                <><CloseCircleOutlined /> No</>
              )}
            </span>
          }
        />
      ),
    },
    {
      title: 'Recovery Action',
      dataIndex: 'recoveryAction',
      key: 'recoveryAction',
      width: 150,
      render: (action: string, record: DamagedStockType) => {
        if (!record.recoverable) return <Tag color="default">N/A</Tag>;
        const actionMap: Record<string, { label: string; color: string }> = {
          rework: { label: 'Rework', color: 'processing' },
          downgrade: { label: 'Downgrade', color: 'warning' },
          scrap: { label: 'Scrap', color: 'error' },
          return_vendor: { label: 'Return to Vendor', color: 'cyan' },
        };
        const actionInfo = actionMap[action as keyof typeof actionMap];
        return actionInfo ? <Tag color={actionInfo.color}>{actionInfo.label}</Tag> : '-';
      },
    },
    ...(showFinancials ? [
      {
        title: 'Original Value',
        dataIndex: 'originalValue',
        key: 'originalValue',
        width: 120,
        align: 'right' as const,
        render: (value: number) => (
          <span style={{ fontWeight: 500 }}>₹{value.toLocaleString()}</span>
        ),
      },
      {
        title: 'Loss Value',
        dataIndex: 'lossValue',
        key: 'lossValue',
        width: 120,
        align: 'right' as const,
        render: (value: number) => (
          value ? <span style={{ color: 'var(--color-ff4d4f)', fontWeight: 500 }}>₹{value.toLocaleString()}</span> : '-'
        ),
      },
      {
        title: 'Recovered Value',
        dataIndex: 'recoveredValue',
        key: 'recoveredValue',
        width: 130,
        align: 'right' as const,
        render: (value: number) => (
          value ? <span style={{ color: 'var(--color-52c41a)', fontWeight: 500 }}>₹{value.toLocaleString()}</span> : '-'
        ),
      },
      {
        title: 'Finance Ref.',
        key: 'financeRef',
        width: 140,
        render: (_: any, record: DamagedStockType) => {
          // Mock finance references
          const refs = [];
          if (record.recoveryAction === 'return_vendor') {
            refs.push(<Tag color="purple" style={{ fontSize: 11 }} key="dn">DN-2025-001</Tag>);
          }
          if (record.recoveryAction === 'scrap') {
            refs.push(<Tag color="orange" style={{ fontSize: 11 }} key="si">SCRAP-INV-001</Tag>);
          }
          return refs.length > 0 ? <div>{refs}</div> : '-';
        },
      },
    ] : []),
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string) => {
        const statusMap: Record<string, { label: string; color: string }> = {
          quarantine: { label: 'Quarantine', color: 'default' },
          under_review: { label: 'Under Review', color: 'processing' },
          approved_disposal: { label: 'Approved', color: 'warning' },
          disposed: { label: 'Disposed', color: 'success' },
          recovered: { label: 'Recovered', color: 'cyan' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap];
        return statusInfo ? <Tag color={statusInfo.color}>{statusInfo.label}</Tag> : <Tag>{status}</Tag>;
      },
    },
    {
      title: 'Damage Date',
      dataIndex: 'damageDate',
      key: 'damageDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: DamagedStockType) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleAction(record)}
            />
          </Tooltip>
          {(record.status === 'quarantine' || record.status === 'under_review') && (
            <Tooltip title="Update Status">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleAction(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleAction = (record: DamagedStockType) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      recoveryAction: record.recoveryAction,
      status: record.status,
      remarks: '',
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (selectedRecord) {
        setData(data.map(item => 
          item.id === selectedRecord.id 
            ? {
                ...item,
                recoveryAction: values.recoveryAction,
                status: values.status,
                remarks: values.remarks ? `${item.remarks || ''}\n${dayjs().format('DD-MMM-YY')}: ${values.remarks}` : item.remarks,
                approvedBy: values.status === 'approved_disposal' ? 'Current User' : item.approvedBy,
                approvalDate: values.status === 'approved_disposal' ? new Date() : item.approvalDate,
                disposalDate: values.status === 'disposed' ? new Date() : item.disposalDate,
                lossValue: values.lossValue,
                recoveredValue: values.recoveredValue,
              }
            : item
        ));
        message.success('Damaged stock status updated successfully');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  let filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  if (filterStatus) {
    filteredData = filteredData.filter(item => item.status === filterStatus);
  }

  if (filterRecoverable !== undefined) {
    filteredData = filteredData.filter(item => item.recoverable === filterRecoverable);
  }

  // Calculate summary
  const pendingCount = data.filter(item => 
    item.status === 'quarantine' || item.status === 'under_review'
  ).length;
  const totalLossValue = data.reduce((sum, item) => sum + (item.lossValue || 0), 0);
  const totalRecoveredValue = data.reduce((sum, item) => sum + (item.recoveredValue || 0), 0);
  const recoverableCount = data.filter(item => item.recoverable).length;

  return (
    <div className="damaged-stock-screen">
      {/* Summary Cards */}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Pending Review</div>
            <Statistic
              value={pendingCount}
              prefix={<WarningOutlined style={{ color: 'var(--color-ff4d4f)', marginRight: 8 }} />}
              valueStyle={{ color: 'var(--color-ff4d4f)', fontSize: '24px', fontWeight: 700 }}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Recoverable Items</div>
            <Statistic
              value={recoverableCount}
              suffix={`/ ${data.length}`}
              prefix={<CheckCircleOutlined style={{ color: 'var(--color-52c41a)', marginRight: 8 }} />}
              valueStyle={{ color: 'var(--color-52c41a)', fontSize: '24px', fontWeight: 700 }}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Loss Value</div>
            <Statistic
              value={totalLossValue}
              prefix="₹"
              precision={0}
              valueStyle={{ color: 'var(--color-ff4d4f)', fontSize: '24px', fontWeight: 700 }}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Recovered Value</div>
            <Statistic
              value={totalRecoveredValue}
              prefix="₹"
              precision={0}
              valueStyle={{ color: 'var(--color-52c41a)', fontSize: '24px', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <WarningOutlined style={{ fontSize: 20, color: 'var(--color-ff4d4f)' }} />
            <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>Damaged/Rejected Stock</span>
          </Space>
        }
        extra={
          <Space wrap>
            <Input
              placeholder="Search damaged stock..."
              prefix={<SearchOutlined />}
              style={{ width: 220 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Filter by Status"
              style={{ width: 150 }}
              allowClear
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Select.Option value="quarantine">Quarantine</Select.Option>
              <Select.Option value="under_review">Under Review</Select.Option>
              <Select.Option value="approved_disposal">Approved</Select.Option>
              <Select.Option value="disposed">Disposed</Select.Option>
              <Select.Option value="recovered">Recovered</Select.Option>
            </Select>
            <Select
              placeholder="Recoverable"
              style={{ width: 130 }}
              allowClear
              value={filterRecoverable}
              onChange={setFilterRecoverable}
            >
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
            <Button
              type={showFinancials ? 'primary' : 'default'}
              icon={<DollarOutlined />}
              onClick={() => setShowFinancials(!showFinancials)}
            >
              {showFinancials ? 'Hide' : 'Show'} Financials
            </Button>
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
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          size="small"
        />
      </Card>

      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: 'var(--color-ff4d4f)' }} />
            <span>Damaged Stock Details & Action</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={loading}
              >
                Update Status
              </Button>
            </Space>
          </div>
        }
        width={800}
      >
        {selectedRecord && (
          <>
            <Card size="small" style={{ marginBottom: 16, backgroundColor: 'var(--page-bg)' }}>
              <Row gutter={[16, 12]}>
                <Col span={8}><strong>Item:</strong></Col>
                <Col span={16}>{selectedRecord.itemName}</Col>
                
                <Col span={8}><strong>Item Code:</strong></Col>
                <Col span={16}>
                  <Tag color="blue">{selectedRecord.itemId}</Tag>
                  <Tag style={{ fontSize: 11 }}>{selectedRecord.itemType.toUpperCase()}</Tag>
                </Col>
                
                <Col span={8}><strong>Lot / Roll:</strong></Col>
                <Col span={16}>
                  <Tag color="purple">{selectedRecord.lotNumber}</Tag>
                  {selectedRecord.rollNumber && <Tag>{selectedRecord.rollNumber}</Tag>}
                </Col>
                
                <Col span={8}><strong>Shade:</strong></Col>
                <Col span={16}>{selectedRecord.shade || '-'}</Col>
                
                <Col span={8}><strong>Quantity:</strong></Col>
                <Col span={16} style={{ color: 'var(--color-ff4d4f)', fontWeight: 500 }}>
                  {selectedRecord.quantity.toFixed(2)} {selectedRecord.uom}
                </Col>
                
                <Col span={8}><strong>Source Process:</strong></Col>
                <Col span={16}>
                  <Tag color="orange">
                    {DAMAGED_STOCK_SOURCES.find(s => s.value === selectedRecord.sourceProcess)?.label || selectedRecord.sourceProcess}
                  </Tag>
                  {selectedRecord.sourceDocumentNumber && (
                    <div style={{ marginTop: 4, fontSize: '12px', color: 'var(--color-666666)' }}>
                      Ref: {selectedRecord.sourceDocumentNumber}
                    </div>
                  )}
                </Col>

                <Col span={8}><strong>Damage Date:</strong></Col>
                <Col span={16}>{dayjs(selectedRecord.damageDate).format('DD-MMM-YYYY')}</Col>
                
                <Col span={8}><strong>Reason:</strong></Col>
                <Col span={16}>
                  <Tag color="red">{selectedRecord.reasonCode}</Tag>
                </Col>
                
                <Col span={24}>
                  <strong>Description:</strong>
                  <div style={{ marginTop: 4, padding: '8px', border: '1px solid var(--color-d9d9d9)', borderRadius: '4px' }}>
                    {selectedRecord.damageDescription}
                  </div>
                </Col>
                
                <Col span={8}><strong>Recoverable:</strong></Col>
                <Col span={16}>
                  <Badge 
                    status={selectedRecord.recoverable ? 'success' : 'error'} 
                    text={
                      <strong style={{ color: selectedRecord.recoverable ? 'var(--color-52c41a)' : 'var(--color-ff4d4f)' }}>
                        {selectedRecord.recoverable ? 'YES' : 'NO'}
                      </strong>
                    }
                  />
                </Col>

                <Col span={8}><strong>Original Value:</strong></Col>
                <Col span={16} style={{ fontWeight: 500 }}>
                  ₹{selectedRecord.originalValue.toLocaleString()}
                </Col>
                
                <Col span={8}><strong>Location:</strong></Col>
                <Col span={16}>{selectedRecord.location || '-'}</Col>
                
                <Col span={8}><strong>Reported By:</strong></Col>
                <Col span={16}>{selectedRecord.reportedBy}</Col>

                {selectedRecord.approvedBy && (
                  <>
                    <Col span={8}><strong>Approved By:</strong></Col>
                    <Col span={16}>
                      {selectedRecord.approvedBy}
                      {selectedRecord.approvalDate && (
                        <span style={{ marginLeft: 8, fontSize: '12px', color: 'var(--color-666666)' }}>
                          ({dayjs(selectedRecord.approvalDate).format('DD-MMM-YYYY')})
                        </span>
                      )}
                    </Col>
                  </>
                )}
              </Row>
            </Card>

            <Divider orientation="left">Update Status & Action</Divider>

            <Form
              form={form}
              layout="vertical"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="status"
                    label={<span><span style={{ color: 'red' }}>* </span>Status</span>}
                    rules={[{ required: true, message: 'Please select status' }]}
                  >
                    <Select placeholder="Select status">
                      <Select.Option value="quarantine">Quarantine</Select.Option>
                      <Select.Option value="under_review">Under Review</Select.Option>
                      <Select.Option value="approved_disposal">Approved for Disposal</Select.Option>
                      <Select.Option value="disposed">Disposed</Select.Option>
                      <Select.Option value="recovered">Recovered</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>

                {selectedRecord.recoverable && (
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="recoveryAction"
                      label={<span><span style={{ color: 'red' }}>* </span>Recovery Action</span>}
                      rules={[{ required: selectedRecord.recoverable, message: 'Please select recovery action' }]}
                    >
                      <Select placeholder="Select recovery action">
                        <Select.Option value="rework">Rework - Send for repair/rework</Select.Option>
                        <Select.Option value="downgrade">Downgrade - Sell at lower price</Select.Option>
                        <Select.Option value="scrap">Scrap - Dispose completely</Select.Option>
                        <Select.Option value="return_vendor">Return to Vendor</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                )}
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="lossValue"
                    label="Loss Value (₹)"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Enter loss value"
                      prefix="₹"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    name="recoveredValue"
                    label="Recovered Value (₹)"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="Enter recovered value"
                      prefix="₹"
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24}>
                  <Form.Item
                    name="remarks"
                    label="Action Remarks"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Enter remarks about the action taken..."
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            {selectedRecord.remarks && (
              <>
                <Divider orientation="left">History</Divider>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: 'var(--page-bg)', 
                  border: '1px solid var(--color-d9d9d9)', 
                  borderRadius: '4px',
                  maxHeight: '150px',
                  overflowY: 'auto'
                }}>
                  <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                    {selectedRecord.remarks}
                  </pre>
                </div>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default DamagedStockScreen;
