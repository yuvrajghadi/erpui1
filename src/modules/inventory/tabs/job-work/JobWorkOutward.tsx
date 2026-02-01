/**
 * Job Work Outward - Send materials to job work vendors
 */

'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Drawer, Form, Row, Col, Select, DatePicker, InputNumber, Tag, message, Tooltip } from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined, PrinterOutlined, FileProtectOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import jobWorkStore from '../../store/jobWorkStore';

interface JobWorkOutwardRecord {
  id: string;
  challanNo: string;
  vendor: string;
  processType: string;
  date: string;
  expectedReturn: string;
  status: 'Draft' | 'Sent' | 'Completed';
}

interface MaterialItem {
  key: string;
  material: string;
  lotShade: string;
  qtySent: number;
  rate: number;
  amount: number;
  uom: string;
}

const JobWorkOutward: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<JobWorkOutwardRecord[]>([
    { id: '1', challanNo: 'JWO-2024-025', vendor: 'ABC Stitching Works', processType: 'Stitching', date: '2024-01-04', expectedReturn: '2024-01-10', status: 'Sent' },
    { id: '2', challanNo: 'JWO-2024-026', vendor: 'XYZ Washing Unit', processType: 'Washing', date: '2024-01-03', expectedReturn: '2024-01-08', status: 'Draft' },
  ]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [materialItems, setMaterialItems] = useState<MaterialItem[]>([
    { key: '1', material: '', lotShade: '', qtySent: 0, rate: 0, amount: 0, uom: 'kg' },
  ]);
  const [ledgerVisible, setLedgerVisible] = useState(false);
  const [ledgerRows, setLedgerRows] = useState<any[]>([]);
  const [billingVisible, setBillingVisible] = useState(false);
  const [selectedChallans, setSelectedChallans] = useState<string[]>([]);

  const handleAddMaterial = () => {
    const newItem: MaterialItem = {
      key: Date.now().toString(),
      material: '',
      lotShade: '',
      qtySent: 0,
      rate: 0,
      amount: 0,
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
        if (field === 'qtySent' || field === 'rate') {
          updated.amount = (updated.qtySent || 0) * (updated.rate || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleGenerateChallan = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      setTimeout(() => {
        const header = { vendor: form.getFieldValue('vendor'), processType: form.getFieldValue('processType'), date: form.getFieldValue('outwardDate')?.format('YYYY-MM-DD'), expectedReturn: form.getFieldValue('expectedReturnDate')?.format('YYYY-MM-DD') };
        const ch = jobWorkStore.createOutward(header, materialItems, { name: 'Operator' });
        message.success(`Job work challan ${ch.challanNo} generated`);
        setDrawerVisible(false);
        form.resetFields();
        setMaterialItems([{ key: '1', material: '', lotShade: '', qtySent: 0, rate: 0, amount: 0, uom: 'kg' }]);
        setData([ { id: ch.id, challanNo: ch.challanNo, vendor: ch.vendor, processType: ch.processType, date: ch.date, expectedReturn: ch.expectedReturn, status: ch.status }, ...data ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Validation failed:', error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    message.info('Print functionality will open print preview');
  };

  const columns: ColumnsType<JobWorkOutwardRecord> = [
    { title: 'Challan No', dataIndex: 'challanNo', key: 'challanNo', width: 140, fixed: 'left', render: (text) => <Tag color="blue">{text}</Tag> },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor', width: 200 },
    { title: 'Process Type', dataIndex: 'processType', key: 'processType', width: 130 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110 },
    { title: 'Expected Return', dataIndex: 'expectedReturn', key: 'expectedReturn', width: 130 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = { Draft: 'default', Sent: 'processing', Completed: 'success' };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setDrawerVisible(true)} />
          </Tooltip>
          <Tooltip title="Print">
            <Button type="text" size="small" icon={<PrinterOutlined />} onClick={handlePrint} />
          </Tooltip>
          <Button type="link" size="small" onClick={() => {
            const rows = jobWorkStore.listLedger().filter(l => l.refNo === record.challanNo || l.challanNo === record.challanNo);
            setLedgerRows(rows);
            setLedgerVisible(true);
          }}>Ledger</Button>
        </Space>
      ),
    },
  ];

  const openBilling = () => {
    // populate list of challans
    setSelectedChallans([]);
    setBillingVisible(true);
  };

  const applyCreateBill = () => {
    if (selectedChallans.length === 0) { message.error('Select at least one challan'); return; }
    // create a simple rate map from outward items
    const rateMap: any = {};
    for (const o of jobWorkStore.listOutwards()) {
      if (selectedChallans.includes(o.challanNo)) {
        for (const it of o.items) rateMap[it.material] = it.rate || rateMap[it.material] || 0;
      }
    }
    const bill = jobWorkStore.createBill(form.getFieldValue('vendor') || 'Unknown Vendor', selectedChallans, rateMap, { name: 'BillingUser' });
    message.success(`Bill ${bill.billNo} created (Draft)`);
    setBillingVisible(false);
  };

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
          <Select.Option value="Silk Fabric">Silk Fabric</Select.Option>
        </Select>
      ),
    },
    {
      title: <span><span style={{ color: 'red' }}>* </span>Lot / Shade</span>,
      dataIndex: 'lotShade',
      key: 'lotShade',
      width: 140,
      render: (_, record) => (
        <Select
          placeholder="Select lot"
          style={{ width: '100%' }}
          value={record.lotShade || undefined}
          onChange={(val) => handleMaterialChange(record.key, 'lotShade', val)}
        >
          <Select.Option value="LOT-2024-001">LOT-2024-001</Select.Option>
          <Select.Option value="LOT-2024-002">LOT-2024-002</Select.Option>
          <Select.Option value="LOT-2024-003">LOT-2024-003</Select.Option>
        </Select>
      ),
    },
    {
      title: <span><span style={{ color: 'red' }}>* </span>Qty Sent</span>,
      dataIndex: 'qtySent',
      key: 'qtySent',
      width: 130,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={record.qtySent}
          onChange={(val) => handleMaterialChange(record.key, 'qtySent', val || 0)}
          addonAfter={record.uom}
        />
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 120,
      render: (_, record) => (
        <InputNumber
          min={0}
          style={{ width: '100%' }}
          value={record.rate}
          onChange={(val) => handleMaterialChange(record.key, 'rate', val || 0)}
          prefix="₹"
        />
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (val) => `₹${val.toFixed(2)}`,
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

  const totalAmount = materialItems.reduce((sum, item) => sum + (item.amount || 0), 0);

  return (
    <div>
      <Card
        title="Job Work Outward"
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
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Challan</Button>
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

        <Drawer className="inventory-drawer" title="Job Work Ledger" open={ledgerVisible} onClose={() => setLedgerVisible(false)} width={720}>
          <Table dataSource={ledgerRows} rowKey={(r:any) => r.id} pagination={false} size="small" columns={[{ title: 'Date', dataIndex: 'date', key: 'date', render: (d:any) => new Date(d).toLocaleString() }, { title: 'Ref Type', dataIndex: 'refType', key: 'refType' }, { title: 'Challan', dataIndex: 'refNo', key: 'refNo' }, { title: 'Material', dataIndex: 'material', key: 'material' }, { title: 'Sent', dataIndex: 'qtySent', key: 'qtySent', align: 'right' }, { title: 'Received', dataIndex: 'qtyReceived', key: 'qtyReceived', align: 'right' }, { title: 'Damage', dataIndex: 'damageQty', key: 'damageQty', align: 'right' }, { title: 'Balance', dataIndex: 'balanceWithVendor', key: 'balanceWithVendor', align: 'right' }]} />
        </Drawer>

        <Drawer className="inventory-drawer" title="Create Bill (Draft)" open={billingVisible} onClose={() => setBillingVisible(false)} width={720} footer={<div style={{ textAlign: 'right' }}><Button onClick={() => setBillingVisible(false)}>Cancel</Button><Button type="primary" onClick={applyCreateBill}>Create Bill</Button></div>}>
          <p>Select challans to include in the bill</p>
          <div style={{ marginTop: 8 }}>
            {jobWorkStore.listOutwards().map(o => (
              <div key={o.challanNo} style={{ marginBottom: 6 }}>
                <input type="checkbox" id={o.challanNo} checked={selectedChallans.includes(o.challanNo)} onChange={(e) => {
                  if (e.target.checked) setSelectedChallans([...selectedChallans, o.challanNo]); else setSelectedChallans(selectedChallans.filter(x => x !== o.challanNo));
                }} /> <label htmlFor={o.challanNo} style={{ marginLeft: 6 }}>{o.challanNo} - {o.vendor}</label>
              </div>
            ))}
          </div>
        </Drawer>

      <Drawer
        className="inventory-drawer job-work-outward-drawer"
        title="Job Work Outward - Generate Challan"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 900 : '100%'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)} style={{ minWidth: 100 }}>Cancel</Button>
              <Button onClick={handlePrint} icon={<PrinterOutlined />} style={{ minWidth: 100 }}>Print</Button>
              <Button type="primary" onClick={handleGenerateChallan} loading={loading} icon={<FileProtectOutlined />} style={{ minWidth: 150 }}>Generate Challan</Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Card className="job-work-outward-card" size="small" title="Challan Header" style={{ marginBottom: 16 }}>
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
                    <Select.Option value="GHI Printing Works">GHI Printing Works</Select.Option>
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
                  label={<span><span style={{ color: 'red' }}>* </span>Expected Return Date</span>}
                  name="expectedReturnDate"
                  rules={[{ required: true, message: 'Please select expected return date' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label={<span><span style={{ color: 'red' }}>* </span>Outward Date</span>}
                  name="outwardDate"
                  rules={[{ required: true, message: 'Please select date' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card
            className="job-work-outward-card"
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
              footer={() => (
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '14px' }}>
                  Total Amount: ₹{totalAmount.toFixed(2)}
                </div>
              )}
            />
          </Card>

          <Card className="job-work-outward-card" size="small" title="Additional Information">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item label="Remarks" name="remarks">
                  <Input.TextArea rows={3} placeholder="Enter any special instructions or remarks..." />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>
      </Drawer>
    </div>
  );
};

export default JobWorkOutward;
