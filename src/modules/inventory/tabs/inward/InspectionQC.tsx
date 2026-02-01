/**
 * Inspection & QC
 * Quality inspection for received materials
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
  Radio,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface InspectionRecord {
  id: string;
  inspectionNumber: string;
  inspectionDate: Date;
  grnNumber: string;
  materialType: string;
  materialName: string;
  inspectedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  defectCategory?: 'major' | 'minor' | 'critical';
  defectPercentage?: number;
  defects?: string;
  inspectorName: string;
  qcApprovedBy?: string;
  reInspectionRequired?: boolean;
  status: 'approved' | 'rejected' | 'partial' | 'hold' | 'reinspect';
  remarks?: string;
  allowedDeviation?: number;
}

const InspectionQCScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<InspectionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<InspectionRecord | null>(null);

  const columns = [
    {
      title: 'Inspection No.',
      dataIndex: 'inspectionNumber',
      key: 'inspectionNumber',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Date',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      width: 120,
      render: (date: Date) => dayjs(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'GRN Number',
      dataIndex: 'grnNumber',
      key: 'grnNumber',
      width: 130,
    },
    {
      title: 'Material',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 160,
    },
    {
      title: 'Inspected Qty',
      dataIndex: 'inspectedQuantity',
      key: 'inspectedQuantity',
      width: 110,
      align: 'right' as const,
    },
    {
      title: 'Accepted',
      dataIndex: 'acceptedQuantity',
      key: 'acceptedQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => <Tag color="success">{qty}</Tag>,
    },
    {
      title: 'Rejected',
      dataIndex: 'rejectedQuantity',
      key: 'rejectedQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty > 0 ? <Tag color="error">{qty}</Tag> : <span>0</span>,
    },
    {
      title: 'Defect %',
      dataIndex: 'defectPercentage',
      key: 'defectPercentage',
      width: 100,
      align: 'right' as const,
      render: (pct: number = 0) => <span style={{ color: pct > 5 ? 'red' : 'inherit' }}>{pct?.toFixed(2)}%</span>,
    },
    {
      title: 'Defect Category',
      dataIndex: 'defectCategory',
      key: 'defectCategory',
      width: 130,
      render: (cat: string) => {
        if (!cat) return '-';
        const colorMap: Record<string, string> = {
          major: 'red',
          minor: 'orange',
          critical: 'purple',
        };
        return <Tag color={colorMap[cat]}>{cat.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config: Record<string, { color: string; icon: React.ReactNode }> = {
          approved: { color: 'success', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', icon: <CloseCircleOutlined /> },
          partial: { color: 'warning', icon: <ExclamationCircleOutlined /> },
          hold: { color: 'default', icon: <ExclamationCircleOutlined /> },
          reinspect: { color: 'processing', icon: <ExclamationCircleOutlined /> },
        };
        const { color, icon } = config[status as keyof typeof config];
        return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'QC By',
      dataIndex: 'qcApprovedBy',
      key: 'qcApprovedBy',
      width: 110,
      render: (name: string) => name || '-',
    },
    {
      title: 'Re-Inspect',
      dataIndex: 'reInspectionRequired',
      key: 'reInspectionRequired',
      width: 90,
      render: (req: boolean) => req ? <Tag color="orange">YES</Tag> : <Tag>NO</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 140,
      render: (_: any, record: InspectionRecord) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setData(data.map(item =>
                item.id === record.id
                  ? { ...item, status: 'approved' }
                  : item
              ));
              message.success('Inspection approved');
            }}
            disabled={record.status === 'approved'}
          >
            Approve
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setData(data.map(item =>
                item.id === record.id
                  ? { ...item, status: 'hold' }
                  : item
              ));
              message.warning('Inspection on hold');
            }}
          >
            Hold
          </Button>
          <Button
            type="link"
            danger
            size="small"
            onClick={() => {
              setData(data.map(item =>
                item.id === record.id
                  ? { ...item, status: 'rejected', reInspectionRequired: true }
                  : item
              ));
              message.error('Inspection rejected and marked for Re-Inspection');
            }}
          >
            Reject
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              // send back to supplier (mock)
              setData(data.map(item => item.id === record.id ? { ...item, status: 'rejected' } : item));
              message.info('Material sent back to supplier (mock)');
            }}
          >
            Send Back
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue({
                ...record,
                inspectionDate: dayjs(record.inspectionDate),
              });
              setDrawerVisible(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const accepted = values.acceptedQuantity || 0;
      const rejected = values.rejectedQuantity || 0;
      const status = rejected === 0 ? 'approved' : accepted === 0 ? 'rejected' : 'partial';

      // Auto-fail rule: defect % > allowedDeviation (mock allowedDeviation = 10)
      const defectPct = values.defectPercentage || 0;
      if (defectPct > (values.allowedDeviation || 10)) {
        values.reInspectionRequired = true;
        values.qcApprovedBy = undefined;
        message.error('Auto-fail: Defect % exceeds tolerance. Marked for re-inspection');
      }

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id
              ? { ...item, ...values, status, inspectionDate: values.inspectionDate.toDate() }
              : item
          )
        );
        message.success('Updated');
      } else {
        const newRecord: InspectionRecord = {
          ...values,
          id: Date.now().toString(),
          inspectionNumber: `INS-${String(data.length + 1).padStart(6, '0')}`,
          status,
          inspectionDate: values.inspectionDate.toDate(),
        };
        setData([newRecord, ...data]);
        message.success('Created');
      }

      setDrawerVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Fill required fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inspection-qc-screen">
      <Card
        title={
          <Space>
            <CheckCircleOutlined />
            <span>Inspection & Quality Control</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setDrawerVisible(true);
              }}
            >
              New Inspection
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} inspections`,
          }}
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Inspection' : 'New Inspection'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 720 : '100%'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)} style={{ minWidth: 100 }}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} style={{ minWidth: 100 }}>
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Inspection Date</span>} name="inspectionDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>GRN Number</span>} name="grnNumber" rules={[{ required: true }]}>
                <Input placeholder="GRN-XXXXXX" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Material Type</span>} name="materialType" rules={[{ required: true }]}>
                <Select placeholder="Select type">
                  <Select.Option value="fabric">Fabric</Select.Option>
                  <Select.Option value="trims">Trims</Select.Option>
                  <Select.Option value="accessories">Accessories</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Material Name</span>} name="materialName" rules={[{ required: true }]}>
                <Input placeholder="Material name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Inspected Quantity</span>} name="inspectedQuantity" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Accepted Qty</span>} name="acceptedQuantity" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Rejected Qty" name="rejectedQuantity" initialValue={0}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Inspector</span>} name="inspectorName" rules={[{ required: true }]}>
                <Input placeholder="Inspector name" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Defects" name="defects">
                <Input.TextArea rows={2} placeholder="List any defects found..." />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Remarks" name="remarks">
                <Input.TextArea rows={2} placeholder="Additional remarks..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default InspectionQCScreen;
