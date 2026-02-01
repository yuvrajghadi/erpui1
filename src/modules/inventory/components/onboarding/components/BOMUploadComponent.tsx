/**
 * BOM Upload Component
 * Special handling for BOM Header + BOM Lines
 */

'use client';

import React, { useState } from 'react';
import { Card, Steps, Button, Table, Tag, Alert, Space, Upload, message, Divider } from 'antd';
import { UploadOutlined, FileTextOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { BOMMaster } from '../types';

interface BOMLine {
  bomCode: string;
  lineNo: number;
  itemType: 'Fabric' | 'Trim' | 'Accessory';
  itemCode: string;
  itemName: string;
  quantity: number;
  uom: string;
  loss: number;
  netQuantity: number;
  processCode?: string;
}

interface BOMUploadComponentProps {
  onComplete: (header: BOMMaster, lines: BOMLine[]) => void;
}

const BOMUploadComponent: React.FC<BOMUploadComponentProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bomHeader, setBomHeader] = useState<BOMMaster | null>(null);
  const [bomLines, setBomLines] = useState<BOMLine[]>([]);
  const [headerValidation, setHeaderValidation] = useState<any[]>([]);
  const [lineValidation, setLineValidation] = useState<any[]>([]);

  const handleHeaderUpload = (file: any) => {
    // Mock header data
    const mockHeader: BOMMaster = {
      bomCode: 'BOM-ST401',
      style: 'ST-401',
      buyer: 'ABC Retail',
      season: 'Spring 2025',
      version: 'v1',
      status: 'Draft',
      createdDate: new Date().toISOString(),
    };

    setBomHeader(mockHeader);
    message.success('BOM Header uploaded successfully!');
    setCurrentStep(1);
    return false;
  };

  const handleLinesUpload = (file: any) => {
    // Mock BOM lines
    const mockLines: BOMLine[] = [
      {
        bomCode: 'BOM-ST401',
        lineNo: 1,
        itemType: 'Fabric',
        itemCode: 'FAB001',
        itemName: 'Cotton Fabric - Grey',
        quantity: 2.5,
        uom: 'Meter',
        loss: 5,
        netQuantity: 2.625,
        processCode: 'PROC001',
      },
      {
        bomCode: 'BOM-ST401',
        lineNo: 2,
        itemType: 'Trim',
        itemCode: 'TRIM001',
        itemName: 'Metal Button - Silver',
        quantity: 8,
        uom: 'Piece',
        loss: 2,
        netQuantity: 8.16,
      },
      {
        bomCode: 'BOM-ST401',
        lineNo: 3,
        itemType: 'Trim',
        itemCode: 'TRIM002',
        itemName: 'YKK Zipper - 5"',
        quantity: 1,
        uom: 'Piece',
        loss: 0,
        netQuantity: 1,
      },
    ];

    setBomLines(mockLines);

    // Validation
    const validation = mockLines.map(line => {
      const issues = [];
      // Check if material exists
      const materialExists = true; // Mock
      if (!materialExists) {
        issues.push('Material not found in master');
      }
      // Check UOM
      const uomValid = true;
      if (!uomValid) {
        issues.push('Invalid UOM');
      }
      return {
        lineNo: line.lineNo,
        itemCode: line.itemCode,
        issues: issues.length > 0 ? issues : ['Valid'],
        valid: issues.length === 0,
      };
    });

    setLineValidation(validation);
    message.success('BOM Lines uploaded successfully!');
    setCurrentStep(2);
    return false;
  };

  const handleValidateAndPreview = () => {
    // All validations passed
    const allValid = lineValidation.every(v => v.valid);
    if (!allValid) {
      message.error('Please fix validation errors before proceeding');
      return;
    }
    setCurrentStep(3);
  };

  const handlePublish = () => {
    if (bomHeader && bomLines.length > 0) {
      onComplete(bomHeader, bomLines);
      message.success('BOM published successfully!');
    }
  };

  const headerColumns = [
    { title: 'BOM Code', dataIndex: 'bomCode', key: 'bomCode', render: (text: string) => <Tag color="red">{text}</Tag> },
    { title: 'Style', dataIndex: 'style', key: 'style', render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Buyer', dataIndex: 'buyer', key: 'buyer' },
    { title: 'Season', dataIndex: 'season', key: 'season' },
    { title: 'Version', dataIndex: 'version', key: 'version', render: (text: string) => <Tag color="purple">{text}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (text: string) => <Tag color="warning">{text}</Tag> },
  ];

  const lineColumns = [
    { title: 'Line', dataIndex: 'lineNo', key: 'lineNo', width: 60, align: 'center' as const },
    { 
      title: 'Type', 
      dataIndex: 'itemType', 
      key: 'itemType', 
      width: 100,
      render: (type: string) => <Tag color={type === 'Fabric' ? 'blue' : 'green'}>{type}</Tag>,
    },
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', width: 120, render: (text: string) => <Tag>{text}</Tag> },
    { title: 'Item Name', dataIndex: 'itemName', key: 'itemName', width: 200 },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity', width: 80, align: 'right' as const },
    { title: 'UOM', dataIndex: 'uom', key: 'uom', width: 80 },
    { 
      title: 'Loss %', 
      dataIndex: 'loss', 
      key: 'loss', 
      width: 80, 
      align: 'right' as const,
      render: (val: number) => <Tag color={val > 0 ? 'warning' : 'success'}>{val}%</Tag>,
    },
    { 
      title: 'Net Qty', 
      dataIndex: 'netQuantity', 
      key: 'netQuantity', 
      width: 100, 
      align: 'right' as const,
      render: (val: number) => <span style={{ fontWeight: 600 }}>{val.toFixed(3)}</span>,
    },
    { title: 'Process', dataIndex: 'processCode', key: 'processCode', width: 100, render: (text?: string) => text ? <Tag color="orange">{text}</Tag> : '-' },
  ];

  const validationColumns = [
    { title: 'Line', dataIndex: 'lineNo', key: 'lineNo', width: 60 },
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', width: 120 },
    { 
      title: 'Validation', 
      dataIndex: 'issues', 
      key: 'issues',
      render: (issues: string[], record: any) => (
        record.valid ? (
          <Tag icon={<CheckCircleOutlined />} color="success">Valid</Tag>
        ) : (
          <Space direction="vertical" size="small">
            {issues.map((issue, idx) => (
              <Tag key={idx} icon={<WarningOutlined />} color="error">{issue}</Tag>
            ))}
          </Space>
        )
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      <Alert
        message="BOM Upload - Two-Step Process"
        description="Upload BOM Header first (Style, Buyer, Season), then upload BOM Lines (Materials, Quantities, Loss%). Both must be validated before publishing."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Steps
        current={currentStep}
        style={{ marginBottom: 24 }}
        items={[
          { title: 'Upload Header', icon: <FileTextOutlined /> },
          { title: 'Upload Lines', icon: <UploadOutlined /> },
          { title: 'Validate', icon: <CheckCircleOutlined /> },
          { title: 'Preview & Publish', icon: <CheckCircleOutlined /> },
        ]}
      />

      {/* Step 0: Upload Header */}
      {currentStep === 0 && (
        <Card title="Step 1: Upload BOM Header" bordered={false}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div>
              <p>Upload Excel with BOM header information:</p>
              <ul>
                <li>BOM Code (optional, will auto-generate)</li>
                <li>Style Number (required)</li>
                <li>Buyer Name</li>
                <li>Season</li>
                <li>Version (optional, defaults to v1)</li>
              </ul>
            </div>
            <Upload beforeUpload={handleHeaderUpload} accept=".xlsx,.xls" maxCount={1}>
              <Button icon={<UploadOutlined />} type="primary" size="large">
                Select BOM Header Excel
              </Button>
            </Upload>
            <Button type="link" onClick={() => message.info('Download template coming soon')}>
              Download Header Template
            </Button>
          </Space>
        </Card>
      )}

      {/* Step 1: Upload Lines */}
      {currentStep === 1 && bomHeader && (
        <div>
          <Card title="BOM Header Uploaded" bordered={false} style={{ marginBottom: 16 }}>
            <Table
              columns={headerColumns}
              dataSource={[bomHeader]}
              pagination={false}
              size="small"
              rowKey="bomCode"
            />
          </Card>

          <Card title="Step 2: Upload BOM Lines" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <p>Upload Excel with BOM line items:</p>
                <ul>
                  <li>Line Number</li>
                  <li>Item Type (Fabric/Trim/Accessory)</li>
                  <li>Item Code (must exist in respective master)</li>
                  <li>Quantity per garment</li>
                  <li>UOM (must match material master)</li>
                  <li>Expected Loss % (optional)</li>
                  <li>Process Code (optional)</li>
                </ul>
              </div>
              <Upload beforeUpload={handleLinesUpload} accept=".xlsx,.xls" maxCount={1}>
                <Button icon={<UploadOutlined />} type="primary" size="large">
                  Select BOM Lines Excel
                </Button>
              </Upload>
              <Button type="link" onClick={() => message.info('Download template coming soon')}>
                Download Lines Template
              </Button>
            </Space>
          </Card>
        </div>
      )}

      {/* Step 2: Validate */}
      {currentStep === 2 && bomLines.length > 0 && (
        <div>
          <Card title="BOM Lines Uploaded" bordered={false} style={{ marginBottom: 16 }}>
            <Table
              columns={lineColumns}
              dataSource={bomLines}
              pagination={false}
              size="small"
              rowKey="lineNo"
              scroll={{ x: 'max-content' }}
            />
          </Card>

          <Card title="Validation Results" bordered={false} style={{ marginBottom: 16 }}>
            <Table
              columns={validationColumns}
              dataSource={lineValidation}
              pagination={false}
              size="small"
              rowKey="lineNo"
            />
          </Card>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>Back to Lines Upload</Button>
              <Button 
                type="primary" 
                onClick={handleValidateAndPreview}
                disabled={!lineValidation.every(v => v.valid)}
              >
                Continue to Preview
              </Button>
            </Space>
          </div>
        </div>
      )}

      {/* Step 3: Preview & Publish */}
      {currentStep === 3 && (
        <div>
          <Alert
            message="BOM Ready to Publish"
            description={`BOM ${bomHeader?.bomCode} with ${bomLines.length} line items validated and ready.`}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Card title="BOM Header" bordered={false} style={{ marginBottom: 16 }}>
            <Table
              columns={headerColumns}
              dataSource={[bomHeader]}
              pagination={false}
              size="small"
              rowKey="bomCode"
            />
          </Card>

          <Card title={`BOM Lines (${bomLines.length} items)`} bordered={false} style={{ marginBottom: 16 }}>
            <Table
              columns={lineColumns}
              dataSource={bomLines}
              pagination={false}
              size="small"
              rowKey="lineNo"
              scroll={{ x: 'max-content' }}
              summary={() => {
                const totalFabric = bomLines.filter(l => l.itemType === 'Fabric').length;
                const totalTrim = bomLines.filter(l => l.itemType === 'Trim').length;
                const totalAccessory = bomLines.filter(l => l.itemType === 'Accessory').length;
                return (
                  <Table.Summary fixed>
                    <Table.Summary.Row style={{ background: 'var(--page-bg)', fontWeight: 600 }}>
                      <Table.Summary.Cell index={0} colSpan={2}>Summary:</Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={7}>
                        <Space>
                          <Tag color="blue">Fabric: {totalFabric}</Tag>
                          <Tag color="green">Trim: {totalTrim}</Tag>
                          <Tag color="orange">Accessory: {totalAccessory}</Tag>
                        </Space>
                      </Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              }
            />
          </Card>

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(2)}>Back</Button>
              <Button type="primary" size="large" onClick={handlePublish}>
                Publish BOM
              </Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  );
};

export default BOMUploadComponent;
