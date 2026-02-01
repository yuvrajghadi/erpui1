/**
 * Fabric GRN (Goods Receipt Note)
 * Roll-wise fabric receipt with barcode generation and inspection status
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
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  InboxOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PrinterOutlined,
  QrcodeOutlined,
} from '@ant-design/icons';
import type { FabricGRN, FabricRoll, BarcodeData, PrintStatus } from '../../types';
import { INSPECTION_STATUS_OPTIONS, UOM_OPTIONS } from '../../constants';
import { SAMPLE_WAREHOUSES } from '../../data/sampleData';
import { generateRollBarcode, generateBarcodeId, formatBarcodeLocation } from '../../utils';
import { BarcodePrintPreview } from '../../components/barcode';
import dayjs from 'dayjs';

const FabricGRNScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<FabricGRN[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FabricGRN | null>(null);
  const [rolls, setRolls] = useState<FabricRoll[]>([]);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [selectedRollsForPrint, setSelectedRollsForPrint] = useState<BarcodeData[]>([]);
  const [rollSelection, setRollSelection] = useState<React.Key[]>([]);
  const [putAwayDrawerVisible, setPutAwayDrawerVisible] = useState(false);
  const [putAwayQuantities, setPutAwayQuantities] = useState<Record<string, number>>({});

  const columns = [
    {
      title: 'GRN Number',
      dataIndex: 'grnNumber',
      key: 'grnNumber',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'GRN Date',
      dataIndex: 'grnDate',
      key: 'grnDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
      width: 130,
      render: (po: string) => <Tag color="blue">{po}</Tag>,
    },
    {
      title: 'Lot/Batch',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (lot: string) => <Tag color="cyan">{lot || '-'}</Tag>,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
    },
    {
      title: 'Fabric Type',
      dataIndex: 'fabricType',
      key: 'fabricType',
      width: 140,
    },
    {
      title: 'Rolls',
      dataIndex: 'rolls',
      key: 'rollCount',
      width: 70,
      align: 'center' as const,
      render: (rolls: FabricRoll[]) => (
        <Badge count={rolls?.length || 0} showZero color="blue" />
      ),
    },
    {
      title: 'Qty Variance',
      key: 'qtyVariance',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: FabricGRN) => {
        const totalReceived = record.rolls?.reduce((sum, roll) => sum + (roll.quantityInKg || 0), 0) || 0;
        const status = record.shortExcessQty !== undefined 
          ? (record.shortExcessQty > 0 ? '+' : '') + record.shortExcessQty.toFixed(2)
          : 'N/A';
        return <span style={{ color: record.shortExcessQty !== undefined && record.shortExcessQty > 0 ? 'green' : 'red' }}>{status} kg</span>;
      },
    },
    {
      title: 'Put-Away',
      dataIndex: 'putAwayStatus',
      key: 'putAwayStatus',
      width: 100,
      render: (status: string = 'pending') => (
        <Tag color={status === 'completed' ? 'success' : 'warning'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Inspection',
      key: 'inspectionSummary',
      width: 130,
      render: (_: any, record: FabricGRN) => {
        const passed = record.rolls?.filter(r => r.inspectionStatus === 'pass').length || 0;
        const total = record.rolls?.length || 0;
        const allPassed = passed === total;
        return (
          <Tooltip title={`${passed} of ${total} rolls passed`}>
            <Tag color={allPassed ? 'success' : 'warning'} icon={allPassed ? <CheckCircleOutlined /> : <WarningOutlined />}>
              {passed}/{total} Passed
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: FabricGRN) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingRecord(record);
              setRolls(record.rolls || []);
              form.setFieldsValue({
                ...record,
                grnDate: dayjs(record.grnDate),
              });
              setDrawerVisible(true);
            }}
          />
          <Button
            type="link"
            size="small"
            onClick={() => {
              // Open put-away drawer for this GRN
              setEditingRecord(record);
              setRolls(record.rolls || []);
              setPutAwayDrawerVisible(true);
            }}
          >
            Put-Away
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const rollColumns = [
    {
      title: 'Roll No',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 100,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Barcode ID',
      dataIndex: 'barcodeId',
      key: 'barcodeId',
      width: 180,
      render: (barcodeId: string, record: any) => {
        if (!barcodeId) {
          return <Tag color="default">Not Generated</Tag>;
        }
        return (
          <Space size={4}>
            <BarcodeOutlined style={{ color: 'var(--color-1890ff)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 500 }}>{barcodeId}</span>
          </Space>
        );
      },
    },
    {
      title: 'Print Status',
      dataIndex: 'printStatus',
      key: 'printStatus',
      width: 110,
      render: (status: PrintStatus = 'not_printed') => {
        const statusConfig = {
          not_printed: { color: 'default', text: 'Not Printed' },
          printed: { color: 'success', text: 'Printed' },
          reprinted: { color: 'warning', text: 'Reprinted' },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Lot/Shade',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (lot: string, record: FabricRoll) => (
        <div>
          <div><Tag color="blue">{lot}</Tag></div>
          <div style={{ fontSize: '11px', color: 'var(--color-666666)' }}>{record.shadeNumber}</div>
        </div>
      ),
    },
    {
      title: 'Qty (kg)',
      dataIndex: 'quantityInKg',
      key: 'quantityInKg',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty?.toFixed(2),
    },
    {
      title: 'Qty (m)',
      dataIndex: 'quantityInMeters',
      key: 'quantityInMeters',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty?.toFixed(2),
    },
    {
      title: 'Width',
      dataIndex: 'actualWidth',
      key: 'actualWidth',
      width: 80,
      align: 'right' as const,
      render: (width: number) => `${width}"`,
    },
    {
      title: 'GSM',
      dataIndex: 'actualGsm',
      key: 'actualGsm',
      width: 80,
      align: 'right' as const,
    },
    {
      title: 'Inspection',
      dataIndex: 'inspectionStatus',
      key: 'inspectionStatus',
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pass: 'success',
          hold: 'warning',
          reject: 'error',
          pending: 'default',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Rack/Bin',
      key: 'location',
      width: 120,
      render: (_: any, record: FabricRoll) => 
        record.rackCode && record.binCode ? `${record.rackCode}-${record.binCode}` : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_: any, record: FabricRoll, index: number) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setRolls(rolls.map((r, i) => 
                i === index 
                  ? { ...r, inspectionStatus: r.inspectionStatus === 'hold' ? 'pending' : 'hold', holdReason: 'On Hold' }
                  : r
              ));
            }}
          >
            {record.inspectionStatus === 'hold' ? 'Release' : 'Hold'}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              // Split roll: create a new roll with provided qty = half
              const original = rolls[index];
              const halfKg = (original.quantityInKg || 0) / 2;
              if (halfKg <= 0) {
                message.error('Cannot split roll with zero quantity');
                return;
              }
              const newRoll: FabricRoll = {
                ...original,
                id: Date.now().toString(),
                rollNumber: `${original.rollNumber}-S1`,
                quantityInKg: halfKg,
                quantityInMeters: (original.quantityInMeters || 0) / 2,
                barcodeId: undefined,
                printStatus: undefined,
              };
              // adjust original
              const updatedOriginal = { ...original, quantityInKg: halfKg, quantityInMeters: (original.quantityInMeters || 0) / 2 };
              const newRolls = rolls.slice();
              newRolls.splice(index + 1, 0, newRoll);
              newRolls[index] = updatedOriginal;
              setRolls(newRolls);
              message.success('Roll split successfully (mock)');
            }}
          >
            Split
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setRolls(rolls.map((r, i) => 
                i === index 
                  ? { ...r, quarantineStatus: r.quarantineStatus === 'quarantine' ? 'none' : 'quarantine' }
                  : r
              ));
            }}
          >
            {record.quarantineStatus === 'quarantine' ? 'Release QT' : 'Quarantine'}
          </Button>
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setRolls(rolls.filter((_, i) => i !== index));
            }}
          />
        </Space>
      ),
    },
  ];

  const handleAddRoll = () => {
    const rollValues = {
      rollNumber: form.getFieldValue('rollNumber'),
      lotNumber: form.getFieldValue('lotNumber'),
      shadeNumber: form.getFieldValue('shadeNumber'),
      quantityInKg: form.getFieldValue('rollQuantityKg'),
      quantityInMeters: form.getFieldValue('rollQuantityMeters'),
      actualWidth: form.getFieldValue('actualWidth'),
      actualGsm: form.getFieldValue('actualGsm'),
      inspectionStatus: form.getFieldValue('inspectionStatus') || 'pending',
      rackCode: form.getFieldValue('rackCode'),
      binCode: form.getFieldValue('binCode'),
    };

    if (!rollValues.rollNumber || !rollValues.quantityInKg) {
      message.error('Please fill roll number and quantity');
      return;
    }

    const fabricCode = form.getFieldValue('fabricCode') || 'FAB';
    const lotNumber = rollValues.lotNumber || 'LOT';
    const rollNumber = rollValues.rollNumber || `R-${Date.now()}`;
    const barcode = generateRollBarcode(fabricCode, lotNumber, rollNumber);

    const newRoll: FabricRoll = {
      id: Date.now().toString(),
      rollNumber,
      barcode,
      fabricId: form.getFieldValue('fabricId') || 'unknown',
      fabricName: fabricCode,
      lotNumber: lotNumber,
      dyeLot: form.getFieldValue('dyeLot') || '',
      shade: rollValues.shadeNumber || '',
      gsmActual: rollValues.actualGsm || 0,
      widthActual: rollValues.actualWidth || 0,
      lengthInMeters: rollValues.quantityInMeters || 0,
      weightInKg: rollValues.quantityInKg || 0,
      inspectionStatus: rollValues.inspectionStatus || 'pending',
      warehouseId: form.getFieldValue('warehouseId') || SAMPLE_WAREHOUSES[0]?.id || '1',
      receivedDate: new Date(),
      rackCode: rollValues.rackCode,
      binCode: rollValues.binCode,
    };
    
    setRolls([...rolls, newRoll]);
    
    // Auto-increment roll number
    const nextRollNum = parseInt(rollValues.rollNumber) + 1;
    form.setFieldsValue({
      rollNumber: String(nextRollNum).padStart(3, '0'),
      rollQuantityKg: undefined,
      rollQuantityMeters: undefined,
      actualWidth: undefined,
      actualGsm: undefined,
    });
  };

  const handleOpenPutAway = (grn?: FabricGRN | null) => {
    setEditingRecord(grn || editingRecord);
    setRolls(grn?.rolls || rolls);
    setPutAwayDrawerVisible(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    
    if (rolls.length === 0) {
      message.error('Please add at least one roll to the GRN');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate barcodes for all rolls upon GRN approval
      const rollsWithBarcodes = rolls.map((roll, index) => {
        if (!roll.barcodeId) {
          const barcodeId = generateBarcodeId(data.length * 1000 + index + 1);
          return {
            ...roll,
            barcodeId,
            printStatus: 'not_printed' as PrintStatus,
            printCount: 0,
          };
        }
        return roll;
      });

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id
              ? {
                  ...item,
                  ...values,
                  rolls: rollsWithBarcodes,
                  grnDate: values.grnDate.toDate(),
                }
              : item
          )
        );
        message.success('GRN updated successfully');
      } else {
        const newGRN: FabricGRN = {
          ...values,
          id: Date.now().toString(),
          grnNumber: `FGRN-${String(data.length + 1).padStart(6, '0')}`,
          rolls: rollsWithBarcodes,
          // If received < PO qty or user chooses partial, set status to 'partial'
          status: values.receivedQuantity && values.receivedQuantity < (values.poQuantity || 0) ? 'partial' : 'completed',
          grnDate: values.grnDate.toDate(),
          createdAt: new Date(),
        };
        setData([...data, newGRN]);
        message.success('GRN created successfully with barcodes generated!');
      }

      setDrawerVisible(false);
      form.resetFields();
      setRolls([]);
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePutAwaySubmit = () => {
    if (!editingRecord) return;
    // mark rolls as put-away completed where quantity provided
    const updatedRolls: FabricRoll[] = rolls.map((r): FabricRoll => {
      const qty = putAwayQuantities[r.id];
      if (qty && qty > 0) {
        return { ...r, putAwayStatus: 'completed', rackCode: r.rackCode || 'R-01', binCode: r.binCode || 'B-01' };
      }
      const status: FabricRoll['putAwayStatus'] = r.putAwayStatus ?? 'pending';
      return { ...r, putAwayStatus: status };
    });

    setData(data.map((d) => d.id === editingRecord.id ? { ...d, rolls: updatedRolls, putAwayStatus: 'completed' } : d));
    setRolls(updatedRolls);
    setPutAwayDrawerVisible(false);
    message.success('Put-Away completed (mock)');
  };

  // Barcode Print Functions
  const handlePrintAllBarcodes = () => {
    if (rolls.length === 0) {
      message.warning('No rolls available to print barcodes');
      return;
    }

    const barcodesToPrint = rolls
      .filter(roll => roll.barcodeId)
      .map((roll) => convertRollToBarcodeData(roll));

    if (barcodesToPrint.length === 0) {
      message.warning('No barcodes generated yet. Please save GRN first.');
      return;
    }

    setSelectedRollsForPrint(barcodesToPrint);
    setPrintModalVisible(true);
  };

  const handlePrintSelectedBarcodes = () => {
    if (rollSelection.length === 0) {
      message.warning('Please select rolls to print barcodes');
      return;
    }

    const selectedRolls = rolls.filter((_, index) => rollSelection.includes(index));
    const barcodesToPrint = selectedRolls
      .filter(roll => roll.barcodeId)
      .map((roll) => convertRollToBarcodeData(roll));

    if (barcodesToPrint.length === 0) {
      message.warning('Selected rolls do not have barcodes generated');
      return;
    }

    setSelectedRollsForPrint(barcodesToPrint);
    setPrintModalVisible(true);
  };

  const convertRollToBarcodeData = (roll: FabricRoll): BarcodeData => {
    const grnNumber = form.getFieldValue('grnNumber') || editingRecord?.grnNumber || 'N/A';
    const fabricCode = form.getFieldValue('fabricCode') || editingRecord?.fabricType || 'N/A';
    const warehouseId = form.getFieldValue('warehouseId') || editingRecord?.warehouseId || SAMPLE_WAREHOUSES[0]?.id || '1';

    return {
      rollBarcodeId: roll.barcodeId || '',
      fabricCode: fabricCode,
      fabricName: roll.fabricName || fabricCode,
      lotNumber: roll.lotNumber || 'N/A',
      dyeLot: roll.dyeLot,
      shade: roll.shadeNumber || 'N/A',
      gsmActual: roll.actualGsm || 0,
      rollQty: roll.quantityInKg || 0,
      rollQtyUnit: 'kg',
      rollNumber: roll.rollNumber,
      warehouseId: warehouseId,
      rackId: roll.rackCode,
      binId: roll.binCode,
      locationDisplay: formatBarcodeLocation(warehouseId, roll.rackCode, roll.binCode),
      grnReference: grnNumber,
      grnDate: form.getFieldValue('grnDate')?.toDate() || editingRecord?.grnDate || new Date(),
      generatedAt: new Date(),
      format: 'CODE128',
    };
  };

  const handlePrintComplete = (barcodeIds: string[]) => {
    // Update print status for printed rolls
    const updatedRolls = rolls.map(roll => {
      if (barcodeIds.includes(roll.barcodeId || '')) {
        const isPrinted = roll.printStatus === 'printed';
        return {
          ...roll,
          printStatus: (isPrinted ? 'reprinted' : 'printed') as PrintStatus,
          printCount: (roll.printCount || 0) + 1,
          printedAt: new Date(),
        };
      }
      return roll;
    });

    setRolls(updatedRolls);
    setPrintModalVisible(false);
    message.success(`${barcodeIds.length} barcode(s) printed successfully`);
  };

  return (
    <div className="fabric-grn-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <InboxOutlined />
              <span>Fabric GRN (Roll-wise)</span>
            </Space>
            <Space>
              <Input
                placeholder="Search GRN..."
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
                  setRolls([]);
                  form.setFieldsValue({ rollNumber: '001', grnDate: dayjs() });
                  setDrawerVisible(true);
                }}
              >
                Create GRN
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
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} GRNs`,
          }}
        />
      </Card>

      {/* GRN Form Modal */}
      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Fabric GRN' : 'Create Fabric GRN'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setRolls([]);
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 1400 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); setRolls([]); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
              {editingRecord ? 'Update' : 'Create GRN'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="grnDate" label="GRN Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YY" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="lotNumber" label="Lot/Batch No">
                <Input placeholder="LOT-2025-001" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="poNumber" label="PO Number" rules={[{ required: true }]}>
                <Input placeholder="PO-000001" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="supplierName" label="Supplier" rules={[{ required: true }]}>
                <Input placeholder="Supplier name" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="fabricCode" label="Fabric Code" rules={[{ required: true }]}>
                <Input placeholder="FAB-KN-001" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="fabricType" label="Fabric Type" rules={[{ required: true }]}>
                <Input placeholder="Single Jersey Cotton" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="receivedUom" label="Received UOM" rules={[{ required: true }]}>
                <Select placeholder="Select UOM" options={[
                  { value: 'kg', label: 'Kilogram (kg)' },
                  { value: 'meter', label: 'Meter (m)' },
                  { value: 'roll', label: 'Roll' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="receivedQuantity" label="Received Quantity">
                <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="poQuantity" label="PO Quantity">
                <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} placeholder="0.00" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="shortExcessQty" label="Short/Excess">
                <InputNumber step={0.01} style={{ width: '100%' }} placeholder="Auto" disabled />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
                <Select
                  placeholder="Select warehouse"
                  options={SAMPLE_WAREHOUSES.map(w => ({ value: w.id, label: w.warehouseName }))}
                  onChange={(value) => {
                    const wh = SAMPLE_WAREHOUSES.find(w => w.id === value);
                    form.setFieldsValue({ warehouseName: wh?.warehouseName });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="putAwayStatus" label="Put-Away Status" initialValue="pending">
                <Select options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="invoiceNumber" label="Invoice Number">
                <Input placeholder="INV-12345" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="challanNumber" label="Challan Number">
                <Input placeholder="DC-12345" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="vehicleNumber" label="Vehicle Number">
                <Input placeholder="MH 01 AB 1234" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="warehouseName" hidden>
            <Input />
          </Form.Item>

          <Divider>Add Rolls</Divider>

          <Row gutter={8}>
            <Col span={3}>
              <Form.Item name="rollNumber" label="Roll No">
                <Input placeholder="001" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="lotNumber" label="Lot No">
                <Input placeholder="LOT-001" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="shadeNumber" label="Shade">
                <Input placeholder="A1" />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="rollQuantityKg" label="Kg">
                <InputNumber min={0.01} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="rollQuantityMeters" label="Meters">
                <InputNumber min={0.01} step={0.1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="actualWidth" label="Width">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="actualGsm" label="GSM">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="inspectionStatus" label="Status">
                <Select options={INSPECTION_STATUS_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="rackCode" label="Rack">
                <Input placeholder="R-01" />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="binCode" label="Bin">
                <Input placeholder="B-01" />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Form.Item label=" ">
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddRoll}>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>

          {/* Roll Entry Table with Barcode Actions */}
          <Divider>Roll Details</Divider>
          
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>Total Rolls: {rolls.length}</strong>
              {rolls.filter(r => r.barcodeId).length > 0 && (
                <Tag color="green" style={{ marginLeft: 8 }}>
                  {rolls.filter(r => r.barcodeId).length} Barcode(s) Generated
                </Tag>
              )}
            </div>
            <Space>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrintAllBarcodes}
                disabled={rolls.length === 0}
              >
                Print All Barcodes
              </Button>
              <Button
                icon={<QrcodeOutlined />}
                onClick={handlePrintSelectedBarcodes}
                disabled={rollSelection.length === 0}
              >
                Print Selected ({rollSelection.length})
              </Button>
            </Space>
          </div>

          <Table
            columns={rollColumns}
            dataSource={rolls}
            rowKey={(record, index) => index?.toString() || '0'}
            pagination={false}
            size="small"
            scroll={{ x: 1300 }}
            rowSelection={{
              selectedRowKeys: rollSelection,
              onChange: (selectedKeys) => setRollSelection(selectedKeys),
            }}
            summary={() => {
              const totalKg = rolls.reduce((sum, roll) => sum + (roll.quantityInKg || 0), 0);
              const totalMeters = rolls.reduce((sum, roll) => sum + (roll.quantityInMeters || 0), 0);
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <strong>Total Rolls: {rolls.length}</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3} align="right">
                    <strong>{totalKg.toFixed(2)} kg</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4} align="right">
                    <strong>{totalMeters.toFixed(2)} m</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5} colSpan={5} />
                </Table.Summary.Row>
              );
            }}
          />

        </Form>
      </Drawer>

      {/* Barcode Print Preview Modal */}
      <BarcodePrintPreview
        visible={printModalVisible}
        barcodes={selectedRollsForPrint}
        onClose={() => setPrintModalVisible(false)}
        onPrintComplete={handlePrintComplete}
      />

      {/* Put-Away Drawer */}
      <Drawer
        className="inventory-drawer"
        title="Put-Away Management"
        open={putAwayDrawerVisible}
        onClose={() => setPutAwayDrawerVisible(false)}
        width={720}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setPutAwayDrawerVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={handlePutAwaySubmit}>Complete Put-Away</Button>
            </Space>
          </div>
        }
      >
        <div>
          <p>Assign Warehouse → Rack → Bin and capture put-away quantities. Stock will be blocked until put-away completes.</p>
          <Table
            columns={[
              { title: 'Roll No', dataIndex: 'rollNumber', key: 'rollNumber' },
              { title: 'Qty (kg)', dataIndex: 'quantityInKg', key: 'quantityInKg', align: 'right' as const },
              { title: 'Rack', key: 'rack', render: (_: any, r: FabricRoll) => (
                <Input defaultValue={r.rackCode || ''} onChange={(e) => {
                  setRolls(rolls.map(rr => rr.id === r.id ? { ...rr, rackCode: e.target.value } : rr));
                }} />
              )},
              { title: 'Bin', key: 'bin', render: (_: any, r: FabricRoll) => (
                <Input defaultValue={r.binCode || ''} onChange={(e) => {
                  setRolls(rolls.map(rr => rr.id === r.id ? { ...rr, binCode: e.target.value } : rr));
                }} />
              )},
              { title: 'Put-Away Qty', key: 'putQty', render: (_: any, r: FabricRoll) => (
                <InputNumber min={0} max={r.quantityInKg || 0} defaultValue={r.quantityInKg || 0} onChange={(val) => {
                  setPutAwayQuantities({ ...putAwayQuantities, [r.id]: val || 0 });
                }} />
              )}
            ]}
            dataSource={rolls}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      </Drawer>
    </div>
  );
};

export default FabricGRNScreen;
