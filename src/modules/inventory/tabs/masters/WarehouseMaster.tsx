/**
 * Warehouse & Location Master
 * Multi-warehouse management with rack and bin level tracking
 */

'use client';

import React, { useState, useEffect } from 'react';
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
  Checkbox,
  Modal,
  Drawer,
  Tag,
  Tree,
  Tabs,
  message,
  Collapse,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  HomeOutlined,
  AppstoreOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { WarehouseMaster, RackMaster, BinMaster } from '../../types';
import { WAREHOUSE_TYPE_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { SAMPLE_WAREHOUSES } from '../../data/sampleData';
import styles from './WarehouseMaster.module.scss';
import { generateSampleExcel } from '../../components/onboarding/utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';
import ExcelUploadButtonGroup from '../../components/onboarding/components/ExcelUploadButtonGroup';

const { Panel } = Collapse;
const { Title, Text } = Typography;

const WarehouseMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [rackForm] = Form.useForm();
  const [data, setData] = useState<WarehouseMaster[]>(SAMPLE_WAREHOUSES);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [rackDrawerVisible, setRackDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WarehouseMaster | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseMaster | null>(null);
  const [racks, setRacks] = useState<RackMaster[]>(selectedWarehouse?.racks || []);
  const [viewBinsDrawer, setViewBinsDrawer] = useState(false);
  const [activeRack, setActiveRack] = useState<RackMaster | null>(null);
  const [binPreview, setBinPreview] = useState<string>('');
  const [rackFormVisible, setRackFormVisible] = useState(false);

  useEffect(() => {
    setRacks(selectedWarehouse?.racks || []);
  }, [selectedWarehouse]);

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setDrawerVisible(true); };
  const handleEdit = (record: WarehouseMaster) => { setEditingRecord(record); form.setFieldsValue(record); setDrawerVisible(true); };
  const handleDelete = (id: string) => { Modal.confirm({ title: 'Delete Warehouse', content: 'Confirm?', onOk: () => { setData(data.filter((item) => item.id !== id)); message.success('Deleted'); } }); };
  const handleSubmit = async (values: any) => { setLoading(true); try { if (editingRecord) { setData(data.map((item) => (item.id === editingRecord!.id ? { ...item, ...values } : item))); message.success('Updated'); } else { setData([{ ...values, id: Date.now().toString(), warehouseCode: `WH-${String(data.length + 1).padStart(3, '0')}`, racks: [], createdAt: new Date() } as WarehouseMaster, ...data]); message.success('Created'); } setDrawerVisible(false); form.resetFields(); } catch (e) { message.error('Failed'); } finally { setLoading(false); } };

  const columns = [
    {
      title: 'Warehouse Code',
      dataIndex: 'warehouseCode',
      key: 'warehouseCode',
      fixed: 'left' as const,
      width: 150,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Warehouse Name',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 200,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          raw_material: 'blue',
          wip: 'orange',
          finished_goods: 'green',
          general: 'default',
        };
        return <Tag color={colorMap[type]}>{type.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Total Bins',
      key: 'binsCount',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: WarehouseMaster) => {
        const totalBins = record.racks?.reduce((sum, rack) => sum + (rack.bins?.length || 0), 0) || 0;
        return totalBins;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: WarehouseMaster) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<AppstoreOutlined />}
            onClick={() => {
              setSelectedWarehouse(record);
              setRackDrawerVisible(true);
            }}
          >
            Racks
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Excel handlers
  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const importedData: WarehouseMaster[] = jsonData.map((row, idx) => ({
        id: `imported-${Date.now()}-${idx}`,
        warehouseCode: row['Warehouse Code'] || '',
        warehouseName: row['Warehouse Name'] || '',
        location: row['Location'] || '',
        type: row['Type'] || 'general',
        racks: [],
        status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive'),
        createdAt: new Date(),
      }));

      setData([...importedData, ...data]);
      message.success(`${importedData.length} warehouses imported`);
    } catch (e) {
      message.error('Failed to read Excel');
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('warehouse');
    message.success('Sample Excel downloaded');
  };

  const renderRackManagement = () => {
    if (!selectedWarehouse) return null;

    // (racks state sync moved to component-level effect)

    const rackColumns = [
      { title: 'Rack Code', dataIndex: 'rackCode', key: 'rackCode', fixed: 'left' as const, width: 120, render: (t: string) => <strong>{t}</strong> },
      { title: 'Rack Name', dataIndex: 'rackName', key: 'rackName', width: 200 },
      { title: 'Zone', dataIndex: 'zone', key: 'zone', width: 120 },
      { title: 'Total Bins', dataIndex: 'bins', key: 'totalBins', width: 100, align: 'center' as const, render: (bins: any[]) => bins?.length || 0 },
      { title: 'Occupied Bins', dataIndex: 'bins', key: 'occupiedBins', width: 120, align: 'center' as const, render: (bins: any[]) => (bins || []).filter(b => (b.currentQty || 0) > 0).length },
      { title: 'Capacity', dataIndex: 'capacity', key: 'capacity', width: 140, render: (c: any) => `${c?.max ?? 0} ${c?.uom ?? 'kg/m'}` },
      { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s}</Tag> },
      { title: 'Actions', key: 'actions', width: 220, fixed: 'right' as const, render: (_: any, record: RackMaster) => {
        const disableable = !(record.bins || []).some(b => (b.currentQty || 0) > 0);
        return (
          <Space>
            <Button size="small" onClick={() => { setActiveRack(record); setViewBinsDrawer(true); }}>View Bins</Button>
            <Button size="small" onClick={() => { setActiveRack(record); rackForm.setFieldsValue(record); setRackFormVisible(true); }}>Edit</Button>
            <Button size="small" danger disabled={!disableable} onClick={() => {
              Modal.confirm({ title: 'Disable Rack', content: 'Disable this rack?', onOk: () => {
                setRacks(prev => prev.map(r => r.id === record.id ? { ...r, status: 'disabled' } : r));
                message.success('Rack disabled');
              } });
            }}>Disable</Button>
          </Space>
        );
      } },
    ];

    return (
      <div>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ExcelUploadButtonGroup
            masterName="Warehouse Rack"
            onFileSelect={handleFileSelect}
            onDownloadSample={handleDownloadSample}
          />
        </div>

        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setActiveRack(null); rackForm.resetFields(); setRackFormVisible(true); }}>Add Rack</Button>
          </div>
          <div>
            <Input.Search placeholder="Search racks..." style={{ width: 260 }} allowClear />
          </div>
        </div>

        <Table
          columns={rackColumns}
          dataSource={racks}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />

        {/* Add / Edit Rack Drawer (Form) */}
        <Drawer
          title={activeRack ? 'Edit Rack' : 'Add New Rack'}
          className="inventory-drawer"
          open={rackFormVisible}
          onClose={() => { setRackFormVisible(false); rackForm.resetFields(); setActiveRack(null); }}
          width={720}
          footer={
            <Space>
              <Button onClick={() => { setRackFormVisible(false); rackForm.resetFields(); setActiveRack(null); }}>Cancel</Button>
              <Button type="primary" htmlType="submit" onClick={() => rackForm.submit()}>
                {activeRack ? 'Update Rack' : 'Create Rack'}
              </Button>
            </Space>
          }
        >
          <Form form={rackForm} layout="vertical" onFinish={(values) => {
            // Prepare rack object
            const newRack: RackMaster = {
              id: Date.now().toString(),
              rackCode: values.rackCode || `R-${String(racks.length + 1).padStart(3, '0')}`,
              rackName: values.rackName,
              zone: values.zone,
              type: values.type,
              status: values.status || 'active',
              capacity: { uom: values.uom || 'kg', max: values.maxCapacity || 0, warningPercent: values.warningPercent || 80 },
              bins: [],
              createdAt: new Date(),
            } as RackMaster;

            // If bin generation auto
            if (values.binMode === 'auto') {
              const rows = Number(values.rows) || 1;
              const cols = Number(values.columns) || 1;
              const prefix = values.binPrefix || 'B';
              const start = Number(values.startIndex) || 1;
              const generatedBins: BinMaster[] = [];
              let counter = start;
              for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                  generatedBins.push({ id: `${newRack.id}-bin-${counter}`, binCode: `${prefix}${String(counter).padStart(3, '0')}`, binName: `Bin ${counter}`, capacity: values.binCapacity || 0, currentQty: 0, status: 'active' } as BinMaster);
                  counter++;
                }
              }
              newRack.bins = generatedBins as any;
            }

            if (activeRack) {
              setRacks(prev => prev.map(r => r.id === activeRack.id ? { ...r, ...newRack } : r));
              message.success('Rack updated');
            } else {
              setRacks(prev => [newRack, ...prev]);
              message.success('Rack created');
            }

            setRackFormVisible(false);
            rackForm.resetFields();
            setActiveRack(null);
          }}>
            {/* Rack Info */}
            <Title level={5}>Rack Info</Title>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Warehouse" name="warehouse" initialValue={selectedWarehouse?.warehouseName}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Rack Code" name="rackCode">
                  <Input placeholder="Auto or enter code" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Rack Name" name="rackName" rules={[{ required: true, message: 'Enter rack name' }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Zone" name="zone">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Rack Type" name="type">
                  <Select options={[{ label: 'Raw', value: 'raw' }, { label: 'WIP', value: 'wip' }, { label: 'Finished', value: 'finished' }]} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Status" name="status" initialValue="active">
                  <Select options={[{ label: 'Active', value: 'active' }, { label: 'Disabled', value: 'disabled' }]} />
                </Form.Item>
              </Col>
            </Row>

            {/* Capacity Setup */}
            <Title level={5} style={{ marginTop: 16 }}>Capacity Setup</Title>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label="UOM" name="uom" initialValue="kg">
                  <Select options={[{ label: 'Kg', value: 'kg' }, { label: 'Mtr', value: 'mtr' }]} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Max Capacity" name="maxCapacity" rules={[{ required: true, message: 'Enter max capacity' }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Warning %" name="warningPercent" initialValue={80}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>

            {/* Bin Configuration */}
            <Title level={5} style={{ marginTop: 16 }}>Bin Configuration</Title>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Mode" name="binMode" initialValue="auto">
                  <Select options={[{ label: 'Auto Generate', value: 'auto' }, { label: 'Manual', value: 'manual' }]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Rows" name="rows" initialValue={1}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Columns" name="columns" initialValue={1}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item label="Bin Prefix" name="binPrefix" initialValue="B">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Start Index" name="startIndex" initialValue={1}>
                  <Input type="number" onChange={(e) => {
                    const start = Number((e.target as HTMLInputElement).value) || 1;
                    const prefix = rackForm.getFieldValue('binPrefix') || 'B';
                    const cols = Number(rackForm.getFieldValue('columns') || 1);
                    const rows = Number(rackForm.getFieldValue('rows') || 1);
                    const previewCount = rows * cols;
                    const preview = Array.from({ length: previewCount }).map((_, i) => `${prefix}${String(start + i).padStart(3, '0')}`).join(', ');
                    setBinPreview(preview);
                  }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Bin Capacity" name="binCapacity" initialValue={0}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            {binPreview && (
              <Row>
                <Col span={24}>
                  <Text type="secondary">Preview: {binPreview}</Text>
                </Col>
              </Row>
            )}

            {/* Storage Rules */}
            <Title level={5} style={{ marginTop: 16 }}>Storage Rules</Title>
            <Row gutter={12}>
              <Col span={8}>
                <Form.Item name="allowMixedShade" valuePropName="checked" initialValue={false}>
                  <Checkbox>Allow mixed Shade / Lot / GSM</Checkbox>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="allowOverfill" valuePropName="checked" initialValue={false}>
                  <Checkbox>Allow Overfill</Checkbox>
                </Form.Item>
              </Col>
            </Row>

          </Form>
        </Drawer>

        {/* View Bins Drawer */}
        <Drawer
          title={activeRack ? `Bins - ${activeRack.rackCode}` : 'Bins'}
          className="inventory-drawer"
          open={viewBinsDrawer}
          onClose={() => { setViewBinsDrawer(false); setActiveRack(null); }}
          width={800}
          footer={null}
        >
          {activeRack ? (
            <Table
              dataSource={activeRack.bins || []}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              columns={[
                { title: 'Bin Code', dataIndex: 'binCode', key: 'binCode' },
                { title: 'Current Qty', dataIndex: 'currentQty', key: 'currentQty', render: (q: number) => q || 0 },
                { title: 'Capacity', dataIndex: 'capacity', key: 'capacity', render: (c: any) => c || 0 },
                { title: 'Occupancy %', dataIndex: 'currentQty', key: 'occupancy', render: (_: any, record: BinMaster) => {
                  const cap = record.capacity || 1;
                  const pct = Math.round(((record.currentQty || 0) / cap) * 100);
                  return <Tag color={pct > 90 ? 'red' : pct > 70 ? 'orange' : 'green'}>{pct}%</Tag>;
                }},
                { title: 'Fabric', dataIndex: ['meta', 'fabric'], key: 'fabric', render: (v: any) => v || '-' },
                { title: 'Lot', dataIndex: ['meta', 'lot'], key: 'lot', render: (v: any) => v || '-' },
                { title: 'Shade', dataIndex: ['meta', 'shade'], key: 'shade', render: (v: any) => v || '-' },
                { title: 'Status', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'active' ? 'success' : 'default'}>{s}</Tag> },
                { title: 'Actions', key: 'actions', render: (_: any, record: BinMaster) => (
                  <Space>
                    <Button size="small" disabled={(record.currentQty || 0) > 0}>Edit</Button>
                    <Button size="small" danger disabled={(record.currentQty || 0) > 0}>Delete</Button>
                  </Space>
                )}
              ]}
            />
          ) : (
            <div>No active rack selected</div>
          )}
        </Drawer>
      </div>
    );
  };

  return (
    <div className="warehouse-master-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <HomeOutlined />
              <span>Warehouse & Location Master</span>
            </Space>
            <Space>
              <Input
                placeholder="Search warehouses..."
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
                  setDrawerVisible(true);
                }}
              >
                Add Warehouse
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
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} warehouses`,
          }}
        />
      </Card>

      {/* Warehouse Form Drawer */}
      <Drawer
        title={editingRecord ? 'Edit Warehouse' : 'Add New Warehouse'}
        className="inventory-drawer"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 640 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading} icon={<SaveOutlined />}>
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'active' }}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="warehouseName"
                label="Warehouse Name"
                rules={[{ required: true, message: 'Please enter warehouse name' }]}
              >
                <Input placeholder="e.g., Raw Material Warehouse A" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Warehouse Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type" options={WAREHOUSE_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status" options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="e.g., Building A, Floor 1" />
              </Form.Item>
            </Col>
          </Row>

        </Form>
      </Drawer>

      {/* Rack Management Drawer */}
      <Drawer
        title={`Manage Racks & Bins - ${selectedWarehouse?.warehouseName}`}
        className="inventory-drawer"
        open={rackDrawerVisible}
        onClose={() => {
          setRackDrawerVisible(false);
          setSelectedWarehouse(null);
        }}
        width={900}
        footer={null}
      >
        {renderRackManagement()}
      </Drawer>
    </div>
  );
};

export default WarehouseMasterScreen;
