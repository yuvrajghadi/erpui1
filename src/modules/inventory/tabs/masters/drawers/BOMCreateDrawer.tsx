/**
 * BOM Create Drawer Component
 * Right-side drawer for creating/editing BOM with all sections
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Table,
  InputNumber,
  Tag,
  Checkbox,
  message,
} from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import type { BOM, FabricBOMItem, TrimBOMItem } from '../../../types/bom';
import { BOMStatus, BOMVersion, Size } from '../../../types/bom';
import styles from './BOMCreateDrawer.module.scss';

interface BOMCreateDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave?: (bom: BOM) => void;
  editBOM?: BOM | null;
}

interface FabricRow extends FabricBOMItem {
  key?: string;
}

interface TrimRow extends TrimBOMItem {
  key?: string;
}

const BOMCreateDrawer: React.FC<BOMCreateDrawerProps> = ({
  open,
  onClose,
  onSave,
  editBOM,
}) => {
  const [form] = Form.useForm();
  const [bomCode, setBOMCode] = useState('BOM-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const [fabricRows, setFabricRows] = useState<FabricRow[]>(
    editBOM?.fabricBOM?.map((item, idx) => ({ ...item, key: idx.toString() })) || []
  );
  const [trimRows, setTrimRows] = useState<TrimRow[]>(
    editBOM?.trimsBOM?.map((item, idx) => ({ ...item, key: idx.toString() })) || []
  );
  const [sizeRatios, setSizeRatios] = useState(editBOM?.sizeRatio || [
    { size: 'S', ratio: 25 },
    { size: 'M', ratio: 25 },
    { size: 'L', ratio: 25 },
    { size: 'XL', ratio: 25 },
  ]);
  const [showSizeRatio, setShowSizeRatio] = useState(!!editBOM?.sizeRatio.length);
  const [processFlags, setProcessFlags] = useState(
    editBOM?.processFlags || {
      requiresWashing: false,
      requiresPrinting: false,
      requiresEmbroidery: false,
      jobWorkRequired: false,
      expectedProcessLossPercent: 0,
    }
  );
  const [loading, setLoading] = useState(false);

  // Sample fabric master data
  const fabricMasterData = [
    { id: 1, name: 'Cotton 100%', gsm: 145, width: 58 },
    { id: 2, name: 'Cotton 50% Polyester 50%', gsm: 160, width: 58 },
    { id: 3, name: 'Rib Cuff', gsm: 200, width: 32 },
  ];

  // Sample trim master data
  const trimMasterData = [
    { id: 1, name: 'Button', uom: 'PCS' },
    { id: 2, name: 'Thread', uom: 'METER' },
    { id: 3, name: 'Zipper', uom: 'PCS' },
  ];

  // Sample style data
  const styleOptions = [
    { label: 'SH-001', value: 'SH-001' },
    { label: 'PT-002', value: 'PT-002' },
    { label: 'TSH-003', value: 'TSH-003' },
  ];

  // Sample buyer data
  const buyerOptions = [
    { label: 'Buyer A', value: 'Buyer A' },
    { label: 'Buyer B', value: 'Buyer B' },
    { label: 'Buyer C', value: 'Buyer C' },
  ];

  const seasonOptions = [
    { label: 'Summer', value: 'Summer' },
    { label: 'Winter', value: 'Winter' },
    { label: 'Spring', value: 'Spring' },
  ];

  const garmentTypeOptions = [
    { label: 'Shirt', value: 'Shirt' },
    { label: 'T-Shirt', value: 'T-Shirt' },
    { label: 'Pant', value: 'Pant' },
    { label: 'Skirt', value: 'Skirt' },
  ];

  const addFabricRow = () => {
    const newRow: FabricRow = {
      id: `fab-${Date.now()}`,
      fabricName: '',
      fabricCode: '',
      gsm: 0,
      width: 0,
      consumptionPerPiece: 0,
      wastagePercent: 0,
      effectiveConsumption: 0,
      remarks: '',
      key: fabricRows.length.toString(),
    };
    setFabricRows([...fabricRows, newRow]);
  };

  const removeFabricRow = (key: string) => {
    setFabricRows(fabricRows.filter((row) => row.key !== key));
  };

  const updateFabricRow = (key: string, field: string, value: any) => {
    setFabricRows(
      fabricRows.map((row) => {
        if (row.key === key) {
          const updated = { ...row, [field]: value };
          // Auto-fill GSM and Width when fabric is selected
          if (field === 'fabricName') {
            const fabric = fabricMasterData.find((f) => f.name === value);
            if (fabric) {
              updated.gsm = fabric.gsm;
              updated.width = fabric.width;
              updated.fabricCode = `FAB-${fabric.id}`;
            }
          }
          // Calculate effective consumption
          if (field === 'consumptionPerPiece' || field === 'wastagePercent') {
            const consumption = updated.consumptionPerPiece || 0;
            const wastage = updated.wastagePercent || 0;
            updated.effectiveConsumption = consumption * (1 + wastage / 100);
          }
          return updated;
        }
        return row;
      })
    );
  };

  const addTrimRow = () => {
    const newRow: TrimRow = {
      id: `trim-${Date.now()}`,
      trimName: '',
      trimCode: '',
      uom: '',
      quantityPerPiece: 0,
      wastagePercent: 0,
      remarks: '',
      key: trimRows.length.toString(),
    };
    setTrimRows([...trimRows, newRow]);
  };

  const removeTrimRow = (key: string) => {
    setTrimRows(trimRows.filter((row) => row.key !== key));
  };

  const updateTrimRow = (key: string, field: string, value: any) => {
    setTrimRows(
      trimRows.map((row) => {
        if (row.key === key) {
          const updated = { ...row, [field]: value };
          // Auto-fill UOM when trim is selected
          if (field === 'trimName') {
            const trim = trimMasterData.find((t) => t.name === value);
            if (trim) {
              updated.uom = trim.uom;
              updated.trimCode = `TRIM-${trim.id}`;
            }
          }
          return updated;
        }
        return row;
      })
    );
  };

  const fabricColumns = [
    {
      title: 'Fabric',
      dataIndex: 'fabricName',
      key: 'fabricName',
      width: 140,
      render: (_: any, record: FabricRow) => (
        <Select
          value={record.fabricName}
          onChange={(val) => updateFabricRow(record.key!, 'fabricName', val)}
          placeholder="Select fabric"
          options={fabricMasterData.map((f) => ({ label: f.name, value: f.name }))}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'GSM',
      dataIndex: 'gsm',
      key: 'gsm',
      width: 70,
      render: (val: number) => <span>{val}</span>,
    },
    {
      title: 'Width',
      dataIndex: 'width',
      key: 'width',
      width: 70,
      render: (val: number) => <span>{val}</span>,
    },
    {
      title: 'Consumption (m)',
      dataIndex: 'consumptionPerPiece',
      key: 'consumptionPerPiece',
      width: 110,
      render: (_: any, record: FabricRow) => (
        <InputNumber
          value={record.consumptionPerPiece}
          onChange={(val) => updateFabricRow(record.key!, 'consumptionPerPiece', val || 0)}
          precision={3}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Wastage %',
      dataIndex: 'wastagePercent',
      key: 'wastagePercent',
      width: 90,
      render: (_: any, record: FabricRow) => (
        <InputNumber
          value={record.wastagePercent}
          onChange={(val) => updateFabricRow(record.key!, 'wastagePercent', val || 0)}
          precision={1}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Effective (m)',
      dataIndex: 'effectiveConsumption',
      key: 'effectiveConsumption',
      width: 110,
      render: (val: number) => <strong>{val.toFixed(3)}</strong>,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 100,
      render: (_: any, record: FabricRow) => (
        <Input
          value={record.remarks}
          onChange={(e) => updateFabricRow(record.key!, 'remarks', e.target.value)}
          placeholder="Notes"
          size="small"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 60,
      render: (_: any, record: FabricRow) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeFabricRow(record.key!)}
        />
      ),
    },
  ];

  const trimColumns = [
    {
      title: 'Trim Item',
      dataIndex: 'trimName',
      key: 'trimName',
      width: 140,
      render: (_: any, record: TrimRow) => (
        <Select
          value={record.trimName}
          onChange={(val) => updateTrimRow(record.key!, 'trimName', val)}
          placeholder="Select trim"
          options={trimMasterData.map((t) => ({ label: t.name, value: t.name }))}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 70,
      render: (val: string) => <span>{val}</span>,
    },
    {
      title: 'Qty/Piece',
      dataIndex: 'quantityPerPiece',
      key: 'quantityPerPiece',
      width: 100,
      render: (_: any, record: TrimRow) => (
        <InputNumber
          value={record.quantityPerPiece}
          onChange={(val) => updateTrimRow(record.key!, 'quantityPerPiece', val || 0)}
          precision={2}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Wastage %',
      dataIndex: 'wastagePercent',
      key: 'wastagePercent',
      width: 90,
      render: (_: any, record: TrimRow) => (
        <InputNumber
          value={record.wastagePercent}
          onChange={(val) => updateTrimRow(record.key!, 'wastagePercent', val || 0)}
          precision={1}
          size="small"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
      render: (_: any, record: TrimRow) => (
        <Input
          value={record.remarks}
          onChange={(e) => updateTrimRow(record.key!, 'remarks', e.target.value)}
          placeholder="Notes"
          size="small"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 60,
      render: (_: any, record: TrimRow) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => removeTrimRow(record.key!)}
        />
      ),
    },
  ];

  const handleSave = async (status: 'draft' | 'approved') => {
    try {
      const values = await form.validateFields();

      if (fabricRows.length === 0) {
        message.error('At least one fabric must be added');
        return;
      }

      setLoading(true);

      const newBOM: BOM = {
        id: editBOM?.id || `bom-${Date.now()}`,
        header: {
          bomCode: bomCode,
          style: values.style,
          buyer: values.buyer || '',
          season: values.season || '',
          garmentType: values.garmentType,
          bomVersion: values.bomVersion || BOMVersion.V1,
          status: status === 'approved' ? BOMStatus.APPROVED : BOMStatus.DRAFT,
          remarks: values.remarks || '',
          createdDate: editBOM?.header.createdDate || new Date(),
          createdBy: editBOM?.header.createdBy || 'Current User',
          lastModifiedDate: new Date(),
          lastModifiedBy: 'Current User',
        },
        fabricBOM: fabricRows as FabricBOMItem[],
        trimsBOM: trimRows as TrimBOMItem[],
        sizeRatio: showSizeRatio
          ? sizeRatios.map((item) => ({
              size: item.size as Size,
              ratio: item.ratio,
            }))
          : [],
        processFlags: processFlags,
      };

      setTimeout(() => {
        onSave?.(newBOM);
        message.success(`BOM saved as ${status === 'approved' ? 'Approved' : 'Draft'}`);
        resetForm();
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('Please fill all required fields');
      setLoading(false);
    }
  };

  const resetForm = () => {
    form.resetFields();
    setBOMCode('BOM-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    setFabricRows([]);
    setTrimRows([]);
    setSizeRatios([
      { size: 'S', ratio: 25 },
      { size: 'M', ratio: 25 },
      { size: 'L', ratio: 25 },
      { size: 'XL', ratio: 25 },
    ]);
    setShowSizeRatio(false);
    setProcessFlags({
      requiresWashing: false,
      requiresPrinting: false,
      requiresEmbroidery: false,
      jobWorkRequired: false,
      expectedProcessLossPercent: 0,
    });
    onClose();
  };

  const totalSizeRatio = useMemo(
    () => sizeRatios.reduce((sum, item) => sum + item.ratio, 0),
    [sizeRatios]
  );

  const isApprovedBOM = editBOM?.header.status === BOMStatus.APPROVED;

  return (
    <Drawer
      title="Create BOM / Design Card"
      placement="right"
      className="inventory-drawer"
      onClose={resetForm}
      open={open}
      width={typeof window !== 'undefined' && window.innerWidth > 1024 ? '50%' : '90%'}
      bodyStyle={{ paddingBottom: 60 }}
      footer={
        <Space style={{ float: 'right' }}>
          <Button onClick={resetForm}>Cancel</Button>
          <Button
            type="default"
            icon={<SaveOutlined />}
            onClick={() => handleSave('draft')}
            loading={loading}
            disabled={isApprovedBOM}
          >
            Save as Draft
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => handleSave('approved')}
            loading={loading}
            disabled={isApprovedBOM}
          >
            Approve BOM
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {/* BOM Header Section */}
        <div className={styles.section}>
          <h3>BOM Header Information</h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="BOM Code" required>
                <Input value={bomCode} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="style"
                label="Style"
                rules={[{ required: true, message: 'Style is required' }]}
              >
                <Select placeholder="Select style" options={styleOptions} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="buyer" label="Buyer">
                <Select placeholder="Select buyer" options={buyerOptions} allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="season" label="Season">
                <Select placeholder="Select season" options={seasonOptions} allowClear />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="garmentType"
                label="Garment Type"
                rules={[{ required: true, message: 'Garment type is required' }]}
              >
                <Select placeholder="Select garment type" options={garmentTypeOptions} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="bomVersion"
                label="BOM Version"
                initialValue={BOMVersion.V1}
              >
                <Select disabled options={[{ label: 'v1', value: BOMVersion.V1 }]} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item name="remarks" label="Remarks">
                <Input.TextArea rows={2} placeholder="Any additional notes..." />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Fabric BOM Section */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Fabric BOM (Mandatory)</h3>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addFabricRow}
              disabled={isApprovedBOM}
            >
              Add Fabric
            </Button>
          </div>
          <Table
            columns={fabricColumns}
            dataSource={fabricRows}
            rowKey="key"
            pagination={false}
            size="small"
            scroll={{ x: 900 }}
          />
        </div>

        {/* Trims & Accessories Section */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Trims & Accessories BOM</h3>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addTrimRow}
              disabled={isApprovedBOM}
            >
              Add Trim
            </Button>
          </div>
          <Table
            columns={trimColumns}
            dataSource={trimRows}
            rowKey="key"
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
          />
        </div>

        {/* Size Ratio Section */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3>Size Ratio (Optional for v1)</h3>
            <Checkbox
              checked={showSizeRatio}
              onChange={(e) => setShowSizeRatio(e.target.checked)}
              disabled={isApprovedBOM}
            >
              Enable Size Ratio
            </Checkbox>
          </div>

          {showSizeRatio && (
            <>
              <Row gutter={16}>
                {sizeRatios.map((item, idx) => (
                  <Col xs={12} sm={6} key={item.size}>
                    <Form.Item label={item.size}>
                      <InputNumber
                        value={item.ratio}
                        onChange={(val) => {
                          const newRatios = [...sizeRatios];
                          newRatios[idx].ratio = val || 0;
                          setSizeRatios(newRatios);
                        }}
                        min={0}
                        max={100}
                        suffix="%"
                        disabled={isApprovedBOM}
                      />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <div style={{ marginBottom: '12px' }}>
                <Tag color={totalSizeRatio === 100 ? 'green' : 'red'}>
                  Total: {totalSizeRatio}%
                </Tag>
                {totalSizeRatio !== 100 && (
                  <span style={{ color: 'var(--color-ff4d4f)', marginLeft: '8px' }}>
                    (Must equal 100%)
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Process Flags Section */}
        <div className={styles.section}>
          <h3>Process Flags</h3>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Checkbox
                checked={processFlags.requiresWashing}
                onChange={(e) =>
                  setProcessFlags({
                    ...processFlags,
                    requiresWashing: e.target.checked,
                  })
                }
                disabled={isApprovedBOM}
              >
                Requires Washing
              </Checkbox>
            </Col>
            <Col xs={24} sm={12}>
              <Checkbox
                checked={processFlags.requiresPrinting}
                onChange={(e) =>
                  setProcessFlags({
                    ...processFlags,
                    requiresPrinting: e.target.checked,
                  })
                }
                disabled={isApprovedBOM}
              >
                Requires Printing
              </Checkbox>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Checkbox
                checked={processFlags.requiresEmbroidery}
                onChange={(e) =>
                  setProcessFlags({
                    ...processFlags,
                    requiresEmbroidery: e.target.checked,
                  })
                }
                disabled={isApprovedBOM}
              >
                Requires Embroidery
              </Checkbox>
            </Col>
            <Col xs={24} sm={12}>
              <Checkbox
                checked={processFlags.jobWorkRequired}
                onChange={(e) =>
                  setProcessFlags({
                    ...processFlags,
                    jobWorkRequired: e.target.checked,
                  })
                }
                disabled={isApprovedBOM}
              >
                Job Work Required
              </Checkbox>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginTop: '12px' }}>
            <Col xs={24} sm={12}>
              <Form.Item label="Expected Process Loss %">
                <InputNumber
                  value={processFlags.expectedProcessLossPercent}
                  onChange={(val) =>
                    setProcessFlags({
                      ...processFlags,
                      expectedProcessLossPercent: val || 0,
                    })
                  }
                  min={0}
                  max={100}
                  suffix="%"
                  disabled={isApprovedBOM}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Drawer>
  );
};

export default BOMCreateDrawer;
