/**
 * Excel Upload Modal Component
 * 3-Step Upload: Upload → Map → Review & Publish
 */

'use client';

import React, { useState } from 'react';
import { Modal, Steps, Upload, Button, Table, Select, Alert, message, Space, Tag } from 'antd';
import { UploadOutlined, CheckCircleOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnMapping, ValidationIssue } from '../types';

interface ExcelUploadModalProps {
  open: boolean;
  onClose: () => void;
  masterName: string;
  systemFields: { field: string; label: string; required: boolean }[];
  onPublish: (data: any[]) => void;
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  open,
  onClose,
  masterName,
  systemFields,
  onPublish,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);

  const handleUpload = (file: UploadFile) => {
    // Mock Excel parsing
    const mockColumns = ['Code', 'Name', 'Type', 'Status', 'UOM', 'Category'];
    const mockData = [
      { Code: 'FAB001', Name: 'Cotton Fabric', Type: 'Woven', Status: 'Active', UOM: 'Meter', Category: 'Fabric' },
      { Code: '', Name: 'Polyester Blend', Type: 'Knitted', Status: 'Active', UOM: 'KG', Category: 'Fabric' },
      { Code: 'FAB003', Name: 'Denim', Type: 'Woven', Status: '', UOM: 'Meter', Category: 'Fabric' },
    ];

    setExcelColumns(mockColumns);
    setExcelData(mockData);
    setFileList([file]);

    // Auto-map columns
    const autoMappings = mockColumns.map(col => {
      const matchedField = systemFields.find(f => 
        f.label.toLowerCase().includes(col.toLowerCase()) || 
        col.toLowerCase().includes(f.label.toLowerCase())
      );
      return {
        excelColumn: col,
        systemField: matchedField?.field || '',
        isRequired: matchedField?.required || false,
        autoMapped: !!matchedField,
      };
    });

    setColumnMappings(autoMappings);
    message.success('File uploaded successfully!');
    setCurrentStep(1);
    return false;
  };

  const handleMapping = () => {
    // Validate mappings
    const missingRequired = systemFields
      .filter(f => f.required)
      .filter(f => !columnMappings.some(m => m.systemField === f.field));

    if (missingRequired.length > 0) {
      message.error(`Please map required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    // Mock validation
    const issues: ValidationIssue[] = [
      { row: 2, column: 'Code', value: '', issue: 'Missing code (will auto-generate)', severity: 'warning' },
      { row: 3, column: 'Status', value: '', issue: 'Missing status (will default to Active)', severity: 'warning' },
    ];

    setValidationIssues(issues);
    setCurrentStep(2);
  };

  const handlePublish = () => {
    onPublish(excelData);
    message.success(`${excelData.length} records published successfully!`);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setFileList([]);
    setExcelData([]);
    setExcelColumns([]);
    setColumnMappings([]);
    setValidationIssues([]);
    onClose();
  };

  const mappingColumns = [
    {
      title: 'Excel Column',
      dataIndex: 'excelColumn',
      key: 'excelColumn',
      width: 150,
      render: (text: string) => (
        <Tag color="blue" icon={<FileExcelOutlined />}>{text}</Tag>
      ),
    },
    {
      title: 'Maps To',
      dataIndex: 'systemField',
      key: 'systemField',
      width: 200,
      render: (_: any, record: ColumnMapping, index: number) => (
        <Select
          value={record.systemField}
          onChange={(value) => {
            const newMappings = [...columnMappings];
            newMappings[index].systemField = value;
            setColumnMappings(newMappings);
          }}
          style={{ width: '100%' }}
          placeholder="Select field"
        >
          <Select.Option value="">-- Skip --</Select.Option>
          {systemFields.map(f => (
            <Select.Option key={f.field} value={f.field}>
              {f.label} {f.required && <Tag color="red">Required</Tag>}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_: any, record: ColumnMapping) => (
        record.autoMapped ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Auto Mapped</Tag>
        ) : (
          <Tag color="default">Manual</Tag>
        )
      ),
    },
  ];

  const reviewColumns = [
    { title: 'Row', dataIndex: 'row', key: 'row', width: 60 },
    { title: 'Column', dataIndex: 'column', key: 'column', width: 120 },
    { title: 'Value', dataIndex: 'value', key: 'value', width: 150 },
    { 
      title: 'Issue', 
      dataIndex: 'issue', 
      key: 'issue', 
      width: 250,
      render: (text: string, record: ValidationIssue) => (
        <span style={{ color: record.severity === 'error' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity: string) => (
        <Tag color={severity === 'error' ? 'error' : 'warning'}>
          {severity.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <Modal
      title={`Upload ${masterName}`}
      open={open}
      onCancel={handleClose}
      width={900}
      footer={null}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        style={{ marginBottom: 24 }}
        items={[
          { title: 'Upload Excel', icon: <UploadOutlined /> },
          { title: 'Map Columns', icon: <CheckCircleOutlined /> },
          { title: 'Review & Publish', icon: <CheckCircleOutlined /> },
        ]}
      />

      {/* Step 1: Upload */}
      {currentStep === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Upload
            beforeUpload={handleUpload}
            fileList={fileList}
            accept=".xlsx,.xls,.csv"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />} size="large" type="primary">
              Select Excel File
            </Button>
          </Upload>
          <p style={{ marginTop: 16, color: 'var(--color-8c8c8c)' }}>
            Supported formats: .xlsx, .xls, .csv
          </p>
        </div>
      )}

      {/* Step 2: Map Columns */}
      {currentStep === 1 && (
        <>
          <Alert
            message="Auto-Mapping Complete"
            description="We've automatically mapped your columns. Review and adjust if needed."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={mappingColumns}
            dataSource={columnMappings}
            pagination={false}
            size="small"
            rowKey="excelColumn"
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button type="primary" onClick={handleMapping}>
                Continue to Review
              </Button>
            </Space>
          </div>
        </>
      )}

      {/* Step 3: Review & Publish */}
      {currentStep === 2 && (
        <>
          <Alert
            message={`${excelData.length} records ready to publish`}
            description={
              validationIssues.length > 0
                ? `${validationIssues.length} warnings found. These will be auto-corrected.`
                : 'All validations passed!'
            }
            type={validationIssues.some(i => i.severity === 'error') ? 'error' : 'info'}
            showIcon
            style={{ marginBottom: 16 }}
          />

          {validationIssues.length > 0 && (
            <Table
              columns={reviewColumns}
              dataSource={validationIssues}
              pagination={false}
              size="small"
              style={{ marginBottom: 16 }}
            />
          )}

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>Back</Button>
              <Button 
                type="primary" 
                onClick={handlePublish}
                disabled={validationIssues.some(i => i.severity === 'error')}
              >
                Publish {excelData.length} Records
              </Button>
            </Space>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ExcelUploadModal;
