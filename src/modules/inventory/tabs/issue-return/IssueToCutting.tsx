/**
 * Issue to Cutting
 * Issue fabric rolls from raw material stock to cutting department
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
  Modal,
  Tag,
  message,
  InputNumber,
  DatePicker,
  Divider,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  ScissorOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { IssueToProduction } from '../../types';
import { UOM_OPTIONS } from '../../constants';
import { SAMPLE_RAW_STOCK } from '../../data/sampleData';
import { calculateAvailableStock } from '../../utils';
import dayjs from 'dayjs';
import issueStore from '../../store/issueStore';
import { Drawer as AntDrawer } from 'antd';
import { listStockLedger } from '../../store/stockStore';
import wipStore from '../../store/wipStore';

interface IssueItem {
  id: string;
  materialCode: string;
  materialName: string;
  lotNumber: string;
  rollNumber?: string;
  issuedQuantity: number;
  uom: string;
  availableQuantity: number;
}

const IssueToCuttingScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<IssueToProduction[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<IssueToProduction | null>(null);
  const [issueItems, setIssueItems] = useState<IssueItem[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [ledgerDrawerVisible, setLedgerDrawerVisible] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);

  const columns = [
    {
      title: 'Issue Number',
      dataIndex: 'issueNumber',
      key: 'issueNumber',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Style/Order',
      dataIndex: 'styleNumber',
      key: 'styleNumber',
      width: 140,
      render: (style: string) => <Tag color="blue">{style}</Tag>,
    },
    {
      title: 'Issued To',
      dataIndex: 'issuedTo',
      key: 'issuedTo',
      width: 120,
      render: (dept: string) => <Tag color="purple">{dept}</Tag>,
    },
    {
      title: 'Items Count',
      dataIndex: 'items',
      key: 'itemsCount',
      width: 100,
      align: 'center' as const,
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: 'Total Qty',
      key: 'totalQty',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: IssueToProduction) => {
        const total = record.items?.reduce((sum: number, item: any) => sum + (item.issuedQuantity || 0), 0) || 0;
        return `${total.toFixed(2)}`;
      },
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
 // Removed invalid named export
          approved: 'success',
          rejected: 'error',
          issued: 'processing',
          consumed: 'default',
          returned: 'blue',
        };
        return <Tag color={colorMap[status] || 'default'}>{String(status).toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 160,
      render: (_: any, record: IssueToProduction) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} disabled={record.status === 'consumed'} />
          <Button type="link" danger size="small" icon={<DeleteOutlined />} disabled={record.status === 'consumed'} />
          <Button type="link" size="small" onClick={() => openLedgerDrawer(record.issueNumber)}>Ledger</Button>
          <Button type="link" size="small" onClick={() => {
            if (record.status === 'draft' || record.status === 'pending') {
              issueStore.approveIssue(record.issueNumber, { name: 'Approver' });
              message.success(`Issue ${record.issueNumber} approved`);
              setData(data.map(d => d.issueNumber === record.issueNumber ? { ...d, status: 'approved' } : d));
            } else {
              message.info('Issue not in approvable state');
            }
          }}>Approve</Button>
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Lot Number',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (lot: string) => <Tag color="purple">{lot}</Tag>,
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 100,
    },
    {
      title: 'Available',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number, record: IssueItem) => `${qty?.toFixed(2)} ${record.uom}`,
    },
    {
      title: 'Issued Qty',
      dataIndex: 'issuedQuantity',
      key: 'issuedQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number, record: IssueItem) => {
        const isOverIssue = qty > record.availableQuantity;
        return (
          <span style={{ color: isOverIssue ? 'var(--color-cf1322)' : 'inherit' }}>
            {qty?.toFixed(2)} {record.uom}
            {isOverIssue && <WarningOutlined style={{ marginLeft: 4 }} />}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 70,
      render: (_: any, record: IssueItem, index: number) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            setIssueItems(issueItems.filter((_, i) => i !== index));
          }}
        />
      ),
    },
  ];

  const openLedgerDrawer = (issueNumber: string) => {
    const entries = issueStore.getIssueLedger(issueNumber);
    setLedgerEntries(entries);
    setLedgerDrawerVisible(true);
  };

  const LedgerDrawer = () => (
    <AntDrawer
      title={`Issue Ledger`}
      width={720}
      open={ledgerDrawerVisible}
      onClose={() => setLedgerDrawerVisible(false)}
    >
      <Table
        columns={[
          { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (d: Date) => dayjs(d).format('DD-MMM-YY') },
          { title: 'Material', dataIndex: 'materialName', key: 'materialName' },
          { title: 'Lot', dataIndex: 'lotNumber', key: 'lotNumber' },
          { title: 'Roll', dataIndex: 'rollNumber', key: 'rollNumber' },
          { title: 'Issued', dataIndex: 'issuedQty', key: 'issuedQty', align: 'right' as const },
          { title: 'Returned', dataIndex: 'returnedQty', key: 'returnedQty', align: 'right' as const },
          { title: 'Transferred', dataIndex: 'transferredQty', key: 'transferredQty', align: 'right' as const },
          { title: 'Balance', dataIndex: 'balanceQty', key: 'balanceQty', align: 'right' as const },
          { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag>{String(s).toUpperCase()}</Tag> },
        ]}
        dataSource={ledgerEntries}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </AntDrawer>
  );

  const handleMaterialSelect = (value: string) => {
    const material = SAMPLE_RAW_STOCK.find(m => m.id === value);
    if (material) {
      setSelectedMaterial(material);
      form.setFieldsValue({
        materialCode: material.materialCode,
        materialName: material.materialName,
        lotNumber: material.lotNumber,
        availableQty: material.availableQuantity,
        itemUom: material.uom,
      });
    }
  };

  const handleAddItem = () => {
    const itemValues = {
      materialId: form.getFieldValue('itemMaterialId'),
      materialCode: form.getFieldValue('materialCode'),
      materialName: form.getFieldValue('materialName'),
      lotNumber: form.getFieldValue('lotNumber'),
      rollNumber: form.getFieldValue('rollNumber'),
      issuedQuantity: form.getFieldValue('issueQuantity'),
      availableQuantity: form.getFieldValue('availableQty'),
      uom: form.getFieldValue('itemUom'),
    };

    if (!itemValues.materialId || !itemValues.issuedQuantity) {
      message.error('Please select material and enter quantity');
      return;
    }

    if (itemValues.issuedQuantity > itemValues.availableQuantity) {
      Modal.confirm({
        title: 'Over Issue Warning',
        content: 'Issued quantity exceeds available stock. Do you want to proceed?',
        onOk: () => {
          addItemToList(itemValues);
        },
      });
    } else {
      addItemToList(itemValues);
    }
  };

  const addItemToList = (itemValues: any) => {
    const newItem: IssueItem = {
      id: Date.now().toString(),
      ...itemValues,
    };
    setIssueItems([...issueItems, newItem]);
    form.setFieldsValue({
      itemMaterialId: undefined,
      materialCode: '',
      materialName: '',
      lotNumber: '',
      rollNumber: '',
      issueQuantity: undefined,
      availableQty: undefined,
      itemUom: undefined,
    });
    setSelectedMaterial(null);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    
    if (issueItems.length === 0) {
      message.error('Please add at least one item to issue');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newIssue: IssueToProduction = {
        ...values,
        id: Date.now().toString(),
        issueNumber: `ISS-CUT-${String(data.length + 1).padStart(6, '0')}`,
        items: issueItems,
        status: 'issued',
        issueDate: values.issueDate.toDate(),
        createdAt: new Date(),
      };
      setData([newIssue, ...data]);
      message.success('Material issued successfully');

      setDrawerVisible(false);
      form.resetFields();
      setIssueItems([]);
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-to-cutting-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <ScissorOutlined />
              <span>Issue to Cutting</span>
            </Space>
            <Space>
              <Input
                placeholder="Search issues..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                allowClear
              />
              <Button icon={<ExportOutlined />}>Export</Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingRecord(null);
                  form.resetFields();
                  setIssueItems([]);
                  form.setFieldsValue({ issueDate: dayjs(), issuedTo: 'Cutting' });
                  setDrawerVisible(true);
                }}
              >
                Create Issue
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} issues`,
          }}
        />
      </Card>

      {/* Issue Form Modal */}
      <Drawer
        className="inventory-drawer"
        title="Issue Material to Cutting"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setIssueItems([]);
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 1200 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); setIssueItems([]); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
              Issue Material
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Alert
            message="Select materials from available stock and specify quantities to issue"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="issueDate" label="Issue Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YY" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="styleNumber" label="Style/Order Number" rules={[{ required: true }]}>
                <Input placeholder="STY-12345" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="issuedTo" label="Issued To" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Cutting', label: 'Cutting' },
                    { value: 'Stitching', label: 'Stitching' },
                    { value: 'Finishing', label: 'Finishing' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="issuedBy" label="Issued By" rules={[{ required: true }]}>
                <Input placeholder="Employee name" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="purpose" label="Purpose">
                <Input placeholder="Production" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Add Items</Divider>

          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name="itemMaterialId" label="Select Material">
                <Select
                  showSearch
                  placeholder="Select material"
                  options={SAMPLE_RAW_STOCK.map(m => ({
                    value: m.id,
                    label: `${m.materialCode} - ${m.materialName}`,
                  }))}
                  onChange={handleMaterialSelect}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="materialCode" label="Code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="lotNumber" label="Lot No">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="rollNumber" label="Roll No">
                <Input placeholder="Optional" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="availableQty" label="Available">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="issueQuantity" label="Issue Qty">
                <InputNumber min={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item name="itemUom" label="UOM">
                <Input disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item label=" ">
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem}>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="materialName" hidden>
            <Input />
          </Form.Item>

          <Table
            columns={itemColumns}
            dataSource={issueItems}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 900 }}
            summary={() => {
              const total = issueItems.reduce((sum, item) => sum + (item.issuedQuantity || 0), 0);
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}>
                    <strong>Total Items: {issueItems.length}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} align="right">
                    <strong>Total: {total.toFixed(2)}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} />
                </Table.Summary.Row>
              );
            }}
          />

        </Form>
      </Drawer>
    </div>
  );
};

export default IssueToCuttingScreen;
