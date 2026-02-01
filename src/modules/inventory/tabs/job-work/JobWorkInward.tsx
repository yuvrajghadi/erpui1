/**
 * Job Work Inward - Receive materials back from job work vendors
 */

'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Drawer, Form, Row, Col, Select, DatePicker, InputNumber, Tag, message, Tooltip } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined, SaveOutlined, FileProtectOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import jobWorkStore from '../../store/jobWorkStore';

interface JobWorkInwardRecord {
  id: string;
  inwardNo: string;
  vendor: string;
  challanNo: string;
  processType: string;
  date: string;
  status: 'Draft' | 'Submitted' | 'Completed';
}

interface MaterialItem {
  key: string;
  material: string;
  sentQty: number;
  receivedQty: number;
  shortageQty: number;
  damageQty: number;
  uom: string;
}

const JobWorkInward: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<JobWorkInwardRecord[]>([
    { id: '1', inwardNo: 'JWI-2024-001', vendor: 'ABC Stitching Works', challanNo: 'JWO-2024-015', processType: 'Stitching', date: '2024-01-03', status: 'Submitted' },
    { id: '2', inwardNo: 'JWI-2024-002', vendor: 'XYZ Washing Unit', challanNo: 'JWO-2024-020', processType: 'Washing', date: '2024-01-02', status: 'Draft' },
  ]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([
    { key: '1', material: 'Cotton Fabric - White', sentQty: 100, receivedQty: 0, shortageQty: 0, damageQty: 0, uom: 'kg' },
  ]);
  const [ledgerVisible, setLedgerVisible] = useState(false);
  const [ledgerRows, setLedgerRows] = useState<any[]>([]);
  const [settlementVisible, setSettlementVisible] = useState(false);
  const [settlementFor, setSettlementFor] = useState<any>(null);

  const handleAddMaterial = () => {
    const newItem: MaterialItem = {
      key: Date.now().toString(),
      material: '',
      sentQty: 0,
      receivedQty: 0,
      shortageQty: 0,
      damageQty: 0,
      uom: 'kg',
    };
    setMaterialItems([...materialItems, newItem]);
  };

  const handleRemoveMaterial = (key: string) => {
    setMaterialItems(materialItems.filter(item => item.key !== key));
  };

  const handleMaterialChange = (key: string, field: keyof MaterialItem, value: any) => {
    setMaterialItems(materialItems.map(item => {
      if (item.key === key) {
        const updated = { ...item, [field]: value };
        if (field === 'sentQty' || field === 'receivedQty') {
          updated.shortageQty = (updated.sentQty || 0) - (updated.receivedQty || 0) - (updated.damageQty || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        message.success('Job work inward saved as draft');
        setDrawerVisible(false);
        form.resetFields();
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        const header = { vendor: form.getFieldValue('vendor'), challanNo: form.getFieldValue('challanNo'), processType: form.getFieldValue('processType'), date: form.getFieldValue('inwardDate')?.format('YYYY-MM-DD') };
        const iw = jobWorkStore.submitInward(header, materialItems, { name: 'Operator' });
        message.success(`Job work inward ${iw.inwardNo} submitted`);
        setDrawerVisible(false);
        form.resetFields();
        setMaterialItems([{ key: '1', material: '', sentQty: 0, receivedQty: 0, shortageQty: 0, damageQty: 0, uom: 'kg' }]);
        setData([{ id: iw.id, inwardNo: iw.inwardNo, vendor: iw.vendor, challanNo: iw.challanNo, processType: iw.processType, date: iw.date, status: iw.status }, ...data]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  const columns: ColumnsType<JobWorkInwardRecord> = [
    { title: 'Inward No', dataIndex: 'inwardNo', key: 'inwardNo', width: 130, fixed: 'left' },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor', width: 200 },
    { title: 'Linked Challan No', dataIndex: 'challanNo', key: 'challanNo', width: 150, render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Process Type', dataIndex: 'processType', key: 'processType', width: 130 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const colorMap: Record<string, string> = { Draft: 'default', Submitted: 'processing', Completed: 'success' };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setDrawerVisible(true)} />
          </Tooltip>
          <Button type="link" size="small" onClick={() => {
            // quick settle shortage modal (simple)
            const rows = jobWorkStore.listLedger().filter(l => l.challanNo === record.challanNo || l.refNo === record.challanNo);
            message.info(`Ledger rows for ${record.challanNo}: ${rows.length}`);
          }}>Ledger</Button>
        </Space>
      ),
    },
  ];

  const materialColumns: ColumnsType<MaterialItem> = [
    {
      title: <span><span style={{ color: 'red' }}>* </span>Material</span>,
      dataIndex: 'material',
      key: 'material',
      width: 200,
      render: (_, record) => (
        <Select
          placeholder="Select material"
          style={{ width: '100%' }}
          value={record.material || undefined}
          onChange={(val) => handleMaterialChange(record.key, 'material', val)}
        >
          <Select.Option value="Cotton Fabric - White">Cotton Fabric - White</Select.Option>
          <Select.Option value="Polyester Blend">Polyester Blend</Select.Option>
          <Select.Option value="Denim - Blue">Denim - Blue</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Sent Qty',
      dataIndex: 'sentQty',
      key: 'sentQty',
      width: 110,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={record.sentQty}
          onChange={(val) => handleMaterialChange(record.key, 'sentQty', val || 0)}
          addonAfter={record.uom}
        />
      ),
    },
    {
      title: <span><span style={{ color: 'red' }}>* </span>Received Qty</span>,
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: 130,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={record.receivedQty}
          onChange={(val) => handleMaterialChange(record.key, 'receivedQty', val || 0)}
          addonAfter={record.uom}
        />
      ),
    },
    {
      title: 'Shortage Qty',
      dataIndex: 'shortageQty',
      key: 'shortageQty',
      width: 120,
      render: (val, record) => (
        <span style={{ color: val > 0 ? 'var(--color-ff4d4f)' : 'var(--color-666666)' }}>
          {val} {record.uom}
        </span>
      ),
    },
    {
      title: 'Damage Qty',
      dataIndex: 'damageQty',
      key: 'damageQty',
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={record.damageQty}
          onChange={(val) => handleMaterialChange(record.key, 'damageQty', val || 0)}
          addonAfter={record.uom}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Button type="link" danger size="small" onClick={() => handleRemoveMaterial(record.key)}>Remove</Button>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    Object.values(item).some(val => String(val).toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div>
      <Card
        title="Job Work Inward"
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Inward</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Drawer
        className="inventory-drawer job-work-inward-drawer"
        title="Job Work Inward Entry"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 900 : '100%'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)} style={{ minWidth: 100 }}>Cancel</Button>
              <Button onClick={handleSaveDraft} loading={loading} icon={<SaveOutlined />} style={{ minWidth: 120 }}>Save Draft</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading} icon={<FileProtectOutlined />} style={{ minWidth: 120 }}>Submit Inward</Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Card className="job-work-inward-card" size="small" title="Header Information" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Vendor</span>}
                  name="vendor"
                  rules={[{ required: true, message: 'Please select vendor' }]}
                >
                  <Select placeholder="Select vendor">
                    <Select.Option value="ABC Stitching Works">ABC Stitching Works</Select.Option>
                    <Select.Option value="XYZ Washing Unit">XYZ Washing Unit</Select.Option>
                    <Select.Option value="DEF Dyeing Factory">DEF Dyeing Factory</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Linked Challan No</span>}
                  name="challanNo"
                  rules={[{ required: true, message: 'Please select challan' }]}
                >
                  <Select placeholder="Select linked challan">
                    <Select.Option value="JWO-2024-015">JWO-2024-015</Select.Option>
                    <Select.Option value="JWO-2024-020">JWO-2024-020</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Process Type</span>}
                  name="processType"
                  rules={[{ required: true, message: 'Please select process type' }]}
                >
                  <Select placeholder="Select process type">
                    <Select.Option value="Stitching">Stitching</Select.Option>
                    <Select.Option value="Washing">Washing</Select.Option>
                    <Select.Option value="Dyeing">Dyeing</Select.Option>
                    <Select.Option value="Printing">Printing</Select.Option>
                    <Select.Option value="Embroidery">Embroidery</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Inward Date</span>}
                  name="inwardDate"
                  rules={[{ required: true, message: 'Please select date' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            className="job-work-inward-card"
            size="small"
            title="Material Items"
            extra={<Button type="dashed" size="small" onClick={handleAddMaterial}>+ Add Material</Button>}
            style={{ marginBottom: 16 }}
          >
            <Table
              columns={materialColumns}
              dataSource={materialItems}
              pagination={false}
              scroll={{ x: 800 }}
              size="small"
            />
          </Card>

          <Card className="job-work-inward-card" size="small" title="Additional Information">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Remarks" name="remarks">
                  <Input.TextArea rows={3} placeholder="Enter any additional remarks..." />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Drawer>
      <Drawer className="inventory-drawer" title="Job Work Ledger" open={ledgerVisible} onClose={() => setLedgerVisible(false)} width={720}>
        <Table dataSource={ledgerRows} rowKey={(r:any) => r.id} pagination={false} size="small" columns={[{ title: 'Date', dataIndex: 'date', key: 'date', render: (d:any) => new Date(d).toLocaleString() }, { title: 'Ref Type', dataIndex: 'refType', key: 'refType' }, { title: 'Challan', dataIndex: 'refNo', key: 'refNo' }, { title: 'Material', dataIndex: 'material', key: 'material' }, { title: 'Sent', dataIndex: 'qtySent', key: 'qtySent', align: 'right' }, { title: 'Received', dataIndex: 'qtyReceived', key: 'qtyReceived', align: 'right' }, { title: 'Damage', dataIndex: 'damageQty', key: 'damageQty', align: 'right' }, { title: 'Balance', dataIndex: 'balanceWithVendor', key: 'balanceWithVendor', align: 'right' }]} />
      </Drawer>

      <Drawer className="inventory-drawer" title="Shortage / Excess Settlement" open={settlementVisible} onClose={() => setSettlementVisible(false)} width={520} footer={<div style={{ textAlign: 'right' }}><Button onClick={() => setSettlementVisible(false)}>Cancel</Button><Button type="primary" onClick={() => {
        if (!settlementFor) { message.error('No record selected'); return; }
        // for demo: mark accept loss
        jobWorkStore.settleShortage(settlementFor.vendor, settlementFor.challanNo, settlementFor.material || 'Unknown', settlementFor.qty || 0, 'Accept Loss', { name: 'Operator' });
        message.success('Settlement recorded');
        setSettlementVisible(false);
      }}>Apply</Button></div>}>
        <div>
          <p>Settlement for: {settlementFor ? `${settlementFor.challanNo} / ${settlementFor.vendor}` : ''}</p>
          <div style={{ marginTop: 8 }}>
            <label>Settlement Type</label>
            <Select style={{ width: '100%' }} defaultValue="Accept Loss">
              <Select.Option value="Debit Vendor">Debit Vendor</Select.Option>
              <Select.Option value="Accept Loss">Accept Loss</Select.Option>
              <Select.Option value="Recover Next">Recover in Next Inward</Select.Option>
            </Select>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default JobWorkInward;
