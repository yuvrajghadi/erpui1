/**
 * BOM Form Screen - Create/Edit BOM
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Tabs,
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
import { SaveOutlined, CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import type { BOM, FabricBOMItem, TrimBOMItem } from '../../types/bom';
import { BOMStatus, BOMVersion, Size } from '../../types/bom';
import { useDeviceType } from '../../utils';
import { SAMPLE_BOM_SH001 } from '../../data/bomData';

interface BOMFormScreenProps {
  bomId?: string;
  mode?: 'create' | 'edit' | 'view';
  onSave?: (bom: BOM) => void;
  onCancel?: () => void;
}

const BOMFormScreen: React.FC<BOMFormScreenProps> = ({
  bomId,
  mode = 'create',
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [bom, setBOM] = useState<BOM>(SAMPLE_BOM_SH001);
  const [activeTab, setActiveTab] = useState('fabric');
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';

  const isReadOnly = mode === 'view' || bom.header.status === BOMStatus.APPROVED;

  const handleSave = () => {
    message.success('BOM saved successfully');
    onSave?.(bom);
  };

  const handleApprove = () => {
    setBOM((prev) => ({
      ...prev,
      header: { ...prev.header, status: BOMStatus.APPROVED },
    }));
    message.success('BOM approved');
  };

  // Fabric columns
  const fabricColumns = [
    {
      title: 'Fabric Name',
      dataIndex: 'fabricName',
      key: 'fabricName',
      width: 140,
    },
    {
      title: 'GSM',
      dataIndex: 'gsm',
      key: 'gsm',
      width: 80,
    },
    {
      title: 'Width',
      dataIndex: 'width',
      key: 'width',
      width: 80,
    },
    {
      title: 'Consumption (m)',
      dataIndex: 'consumptionPerPiece',
      key: 'consumptionPerPiece',
      width: 120,
    },
    {
      title: 'Wastage %',
      dataIndex: 'wastagePercent',
      key: 'wastagePercent',
      width: 100,
    },
    {
      title: 'Effective (m)',
      dataIndex: 'effectiveConsumption',
      key: 'effectiveConsumption',
      width: 120,
      render: (value: number) => <strong>{value.toFixed(3)}</strong>,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 120,
    },
  ];

  // Trims columns
  const trimsColumns = [
    {
      title: 'Trim Name',
      dataIndex: 'trimName',
      key: 'trimName',
      width: 140,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 80,
    },
    {
      title: 'Qty/Piece',
      dataIndex: 'quantityPerPiece',
      key: 'quantityPerPiece',
      width: 100,
    },
    {
      title: 'Wastage %',
      dataIndex: 'wastagePercent',
      key: 'wastagePercent',
      width: 100,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <Card
        title={`${mode === 'create' ? 'Create' : 'Edit'} BOM - ${bom.header.style}`}
        extra={
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={onCancel}>
              Back
            </Button>
            {mode !== 'view' && (
              <>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
                  Save Draft
                </Button>
                {bom.header.status === BOMStatus.DRAFT && (
                  <Button icon={<CheckOutlined />} onClick={handleApprove}>
                    Approve
                  </Button>
                )}
              </>
            )}
          </Space>
        }
      >
        {/* Header Section */}
        <Card size="small" style={{ marginBottom: '16px' }} title="BOM Header">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="BOM Code" required>
                  <Input value={bom.header.bomCode} disabled />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Style" required>
                  <Input
                    value={bom.header.style}
                    onChange={(e) =>
                      setBOM((prev) => ({
                        ...prev,
                        header: { ...prev.header, style: e.target.value },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Buyer">
                  <Input
                    value={bom.header.buyer}
                    onChange={(e) =>
                      setBOM((prev) => ({
                        ...prev,
                        header: { ...prev.header, buyer: e.target.value },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Season">
                  <Input
                    value={bom.header.season}
                    onChange={(e) =>
                      setBOM((prev) => ({
                        ...prev,
                        header: { ...prev.header, season: e.target.value },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Garment Type">
                  <Input
                    value={bom.header.garmentType}
                    onChange={(e) =>
                      setBOM((prev) => ({
                        ...prev,
                        header: { ...prev.header, garmentType: e.target.value },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Version">
                  <Input value={bom.header.bomVersion} disabled />
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Status">
                  <Tag color={bom.header.status === BOMStatus.APPROVED ? 'green' : 'orange'}>
                    {bom.header.status}
                  </Tag>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form layout="vertical">
                <Form.Item label="Remarks">
                  <Input.TextArea
                    rows={1}
                    value={bom.header.remarks}
                    onChange={(e) =>
                      setBOM((prev) => ({
                        ...prev,
                        header: { ...prev.header, remarks: e.target.value },
                      }))
                    }
                    disabled={isReadOnly}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>

        {/* Tabs */}
        {isMobile && (
          <Select
            value={activeTab}
            onChange={setActiveTab}
            style={{ width: '100%', marginBottom: 12 }}
            options={[
              { value: 'fabric', label: 'Fabric BOM (Mandatory)' },
              { value: 'trims', label: 'Trims & Accessories' },
              { value: 'sizeRatio', label: 'Size Ratio' },
              { value: 'processFlags', label: 'Process Flags' },
            ]}
          />
        )}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarGutter={deviceType === 'tablet' ? 8 : 16}
          tabBarStyle={isMobile ? { display: 'none' } : undefined}
          className="inventory-responsive-tabs"
          items={[
            {
              key: 'fabric',
              label: 'Fabric BOM (Mandatory)',
              children: (
                <Card size="small" style={{ marginTop: '12px' }}>
                  <Table
                    columns={fabricColumns}
                    dataSource={bom.fabricBOM}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              ),
            },
            {
              key: 'trims',
              label: 'Trims & Accessories',
              children: (
                <Card size="small" style={{ marginTop: '12px' }}>
                  <Table
                    columns={trimsColumns}
                    dataSource={bom.trimsBOM}
                    rowKey="id"
                    pagination={false}
                    size="small"
                  />
                </Card>
              ),
            },
            {
              key: 'sizeRatio',
              label: 'Size Ratio',
              children: (
                <Card size="small" style={{ marginTop: '12px' }}>
                  <Row gutter={16}>
                    {bom.sizeRatio.map((item) => (
                      <Col xs={12} sm={8} md={6} key={item.size}>
                        <Form layout="vertical">
                          <Form.Item label={item.size}>
                            <InputNumber
                              value={item.ratio}
                              min={0}
                              max={100}
                              suffix="%"
                              disabled={isReadOnly}
                            />
                          </Form.Item>
                        </Form>
                      </Col>
                    ))}
                  </Row>
                </Card>
              ),
            },
            {
              key: 'processFlags',
              label: 'Process Flags',
              children: (
                <Card size="small" style={{ marginTop: '12px' }}>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Checkbox
                        checked={bom.processFlags.requiresWashing}
                        onChange={(e) =>
                          setBOM((prev) => ({
                            ...prev,
                            processFlags: {
                              ...prev.processFlags,
                              requiresWashing: e.target.checked,
                            },
                          }))
                        }
                        disabled={isReadOnly}
                      >
                        Requires Washing
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox
                        checked={bom.processFlags.requiresPrinting}
                        onChange={(e) =>
                          setBOM((prev) => ({
                            ...prev,
                            processFlags: {
                              ...prev.processFlags,
                              requiresPrinting: e.target.checked,
                            },
                          }))
                        }
                        disabled={isReadOnly}
                      >
                        Requires Printing
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox
                        checked={bom.processFlags.requiresEmbroidery}
                        onChange={(e) =>
                          setBOM((prev) => ({
                            ...prev,
                            processFlags: {
                              ...prev.processFlags,
                              requiresEmbroidery: e.target.checked,
                            },
                          }))
                        }
                        disabled={isReadOnly}
                      >
                        Requires Embroidery
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Checkbox
                        checked={bom.processFlags.jobWorkRequired}
                        onChange={(e) =>
                          setBOM((prev) => ({
                            ...prev,
                            processFlags: {
                              ...prev.processFlags,
                              jobWorkRequired: e.target.checked,
                            },
                          }))
                        }
                        disabled={isReadOnly}
                      >
                        Job Work Required
                      </Checkbox>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form layout="vertical">
                        <Form.Item label="Expected Process Loss %">
                          <InputNumber
                            value={bom.processFlags.expectedProcessLossPercent}
                            min={0}
                            max={100}
                            suffix="%"
                            disabled={isReadOnly}
                          />
                        </Form.Item>
                      </Form>
                    </Col>
                  </Row>
                </Card>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default BOMFormScreen;
