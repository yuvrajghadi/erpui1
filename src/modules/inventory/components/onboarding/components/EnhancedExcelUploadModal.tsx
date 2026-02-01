/**
 * Enhanced Excel Upload Modal
 * Full Flow: Upload → Auto Map → Manual Fix → Validate → Conflict Resolution → Review → Publish
 */

'use client';

import React, { useState } from 'react';
import { Modal, Steps, Upload, Button, Table, Select, Alert, message, Space, Tag, Spin } from 'antd';
import { UploadOutlined, CheckCircleOutlined, FileExcelOutlined, WarningOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { ColumnMapping, ValidationIssue, ConflictItem } from '../types';
import ConflictResolutionScreen from './ConflictResolutionScreen';

interface EnhancedExcelUploadModalProps {
  open: boolean;
  onClose: () => void;
  masterName: string;
  masterId: string;
  systemFields: { field: string; label: string; required: boolean; synonyms?: string[] }[];
  dependencies?: string[];
  completedMasters?: string[];
  existingData?: any[]; // For conflict detection
  onPublish: (data: any[], auditInfo: { fileName: string; conflicts: number; skipped: number }) => void;
}

const EnhancedExcelUploadModal: React.FC<EnhancedExcelUploadModalProps> = ({
  open,
  onClose,
  masterName,
  masterId,
  systemFields,
  dependencies = [],
  completedMasters = [],
  existingData = [],
  onPublish,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [resolvedConflicts, setResolvedConflicts] = useState<ConflictItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check dependencies
  const missingDependencies = dependencies.filter(dep => !completedMasters.includes(dep));
  const hasDependencyBlock = missingDependencies.length > 0;

  const handleUpload = async (file: UploadFile) => {
    if (hasDependencyBlock) {
      message.error('Please complete required masters first');
      return false;
    }

    setIsProcessing(true);

    // Simulate Excel parsing
    setTimeout(() => {
      const mockColumns = getMockColumnsForMaster(masterId);
      const mockData = getMockDataForMaster(masterId);

      setExcelColumns(mockColumns);
      setExcelData(mockData);
      setFileList([file]);

      // Auto-map columns with synonyms
      const autoMappings = autoMapColumns(mockColumns, systemFields);
      setColumnMappings(autoMappings);

      setIsProcessing(false);
      message.success('File uploaded and columns auto-mapped!');
      setCurrentStep(1);
    }, 1500);

    return false;
  };

  const autoMapColumns = (
    excelCols: string[],
    systemFields: { field: string; label: string; required: boolean; synonyms?: string[] }[]
  ): ColumnMapping[] => {
    return excelCols.map(excelCol => {
      const normalizedExcel = excelCol.toLowerCase().trim();

      const matchedField = systemFields.find(sysField => {
        const normalizedLabel = sysField.label.toLowerCase();
        const synonyms = sysField.synonyms?.map(s => s.toLowerCase()) || [];

        return (
          normalizedLabel === normalizedExcel ||
          normalizedLabel.includes(normalizedExcel) ||
          normalizedExcel.includes(normalizedLabel) ||
          synonyms.some(syn => syn === normalizedExcel || normalizedExcel.includes(syn))
        );
      });

      return {
        excelColumn: excelCol,
        systemField: matchedField?.field || '',
        isRequired: matchedField?.required || false,
        autoMapped: !!matchedField,
        synonyms: matchedField?.synonyms,
      };
    });
  };

  const handleMappingValidation = () => {
    // Check required fields
    const missingRequired = systemFields
      .filter(f => f.required)
      .filter(f => !columnMappings.some(m => m.systemField === f.field && m.systemField !== ''));

    if (missingRequired.length > 0) {
      message.error(`Missing required fields: ${missingRequired.map(f => f.label).join(', ')}`);
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);

    // Simulate validation
    setTimeout(() => {
      const issues = validateData(excelData, columnMappings);
      setValidationIssues(issues);
      setIsProcessing(false);
      setCurrentStep(3);
    }, 1000);
  };

  const validateData = (data: any[], mappings: ColumnMapping[]): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    data.forEach((row, index) => {
      mappings.forEach(mapping => {
        if (mapping.isRequired && mapping.systemField) {
          const value = row[mapping.excelColumn];
          if (!value || String(value).trim() === '') {
            issues.push({
              row: index + 2, // +2 because Excel is 1-indexed and has header
              column: mapping.excelColumn,
              value: value,
              issue: `Required field '${mapping.excelColumn}' is empty (will use default if available)`,
              severity: 'warning',
            });
          }
        }
      });
    });

    return issues;
  };

  const handleConflictCheck = () => {
    setIsProcessing(true);

    // Simulate conflict detection
    setTimeout(() => {
      const detectedConflicts = detectConflicts(excelData, existingData, columnMappings);

      if (detectedConflicts.length > 0) {
        setConflicts(detectedConflicts);
        setCurrentStep(4);
        message.warning(`Found ${detectedConflicts.length} conflicts requiring resolution`);
      } else {
        setCurrentStep(5);
        message.success('No conflicts detected!');
      }

      setIsProcessing(false);
    }, 1000);
  };

  const detectConflicts = (newData: any[], existing: any[], mappings: ColumnMapping[]): ConflictItem[] => {
    // Mock conflict detection
    const conflicts: ConflictItem[] = [];

    // Example: Check if supplier names in Excel match existing
    if (masterId === 'fabric' || masterId === 'trim') {
      newData.forEach((row, index) => {
        const supplierValue = row['Supplier'] || row['Vendor'];
        if (supplierValue && !existing.some(e => e.supplierName === supplierValue)) {
          conflicts.push({
            rowIndex: index + 2,
            excelValue: supplierValue,
            field: 'Supplier',
            existingOptions: [
              { id: 'SUP001', label: 'Fabric Mills Ltd' },
              { id: 'SUP002', label: 'ABC Trims Pvt Ltd' },
              { id: 'SUP003', label: 'XYZ Suppliers' },
            ],
            suggestedMatch: 'SUP001',
          });
        }
      });
    }

    return conflicts.slice(0, 3); // Limit for demo
  };

  const handleConflictResolution = (resolved: ConflictItem[]) => {
    setResolvedConflicts(resolved);
    setCurrentStep(5);
    message.success('Conflicts resolved! Proceeding to review...');
  };

  const handlePublish = () => {
    const skippedRows = resolvedConflicts.filter(c => c.resolution === 'skip').length;
    const conflictCount = conflicts.length;

    onPublish(excelData, {
      fileName: fileList[0]?.name || 'unknown.xlsx',
      conflicts: conflictCount,
      skipped: skippedRows,
    });

    message.success(`${excelData.length - skippedRows} records published successfully!`);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(0);
    setFileList([]);
    setExcelData([]);
    setExcelColumns([]);
    setColumnMappings([]);
    setValidationIssues([]);
    setConflicts([]);
    setResolvedConflicts([]);
    setIsProcessing(false);
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
      title: 'Maps To System Field',
      dataIndex: 'systemField',
      key: 'systemField',
      width: 250,
      render: (_: any, record: ColumnMapping, index: number) => (
        <Select
          value={record.systemField}
          onChange={(value) => {
            const newMappings = [...columnMappings];
            newMappings[index].systemField = value;
            newMappings[index].autoMapped = false;
            setColumnMappings(newMappings);
          }}
          style={{ width: '100%' }}
          placeholder="Select field"
          showSearch
        >
          <Select.Option value="">-- Skip Column --</Select.Option>
          {systemFields.map(f => (
            <Select.Option key={f.field} value={f.field}>
              {f.label}
              {f.required && <Tag color="red" style={{ marginLeft: 4, fontSize: 11 }}>Required</Tag>}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 140,
      render: (_: any, record: ColumnMapping) => {
        if (!record.systemField) {
          return <Tag color="default">Skipped</Tag>;
        }
        return record.autoMapped ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Auto Mapped</Tag>
        ) : (
          <Tag color="warning">Manual</Tag>
        );
      },
    },
  ];

  const reviewColumns = [
    { title: 'Row', dataIndex: 'row', key: 'row', width: 70 },
    { title: 'Column', dataIndex: 'column', key: 'column', width: 140 },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 150,
      render: (val: any) => <code>{String(val)}</code>,
    },
    {
      title: 'Issue',
      dataIndex: 'issue',
      key: 'issue',
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

  const steps = [
    { title: 'Upload', icon: <UploadOutlined /> },
    { title: 'Map Columns', icon: <CheckCircleOutlined /> },
    { title: 'Validate', icon: <CheckCircleOutlined /> },
    { title: 'Fix Issues', icon: <CheckCircleOutlined /> },
    ...(conflicts.length > 0 ? [{ title: 'Resolve Conflicts', icon: <WarningOutlined /> }] : []),
    { title: 'Review', icon: <CheckCircleOutlined /> },
    { title: 'Publish', icon: <CheckCircleOutlined /> },
  ];

  return (
    <Modal
      title={`Import ${masterName}`}
      open={open}
      onCancel={handleClose}
      width={currentStep === 4 ? 1200 : 900}
      footer={null}
      destroyOnClose
    >
      {/* Dependency Warning */}
      {hasDependencyBlock && (
        <Alert
          message="Cannot Upload Yet"
          description={
            <div>
              <p>This master requires the following to be completed first:</p>
              <ul>
                {missingDependencies.map(dep => (
                  <li key={dep}>
                    <Tag color="error">{dep}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          closable
        />
      )}

      {/* Steps Progress */}
      {!hasDependencyBlock && (
        <Steps
          current={currentStep}
          style={{ marginBottom: 24 }}
          items={steps}
          size="small"
        />
      )}

      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <p style={{ marginTop: 16, color: 'var(--color-8c8c8c)' }}>Processing...</p>
        </div>
      )}

      {/* Step 0: Upload */}
      {!isProcessing && currentStep === 0 && !hasDependencyBlock && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Upload
            beforeUpload={handleUpload}
            fileList={fileList}
            accept=".xlsx,.xls,.csv"
            maxCount={1}
            disabled={hasDependencyBlock}
          >
            <Button icon={<UploadOutlined />} size="large" type="primary" disabled={hasDependencyBlock}>
              Select Excel File
            </Button>
          </Upload>
          <p style={{ marginTop: 16, color: 'var(--color-8c8c8c)' }}>
            Supported formats: .xlsx, .xls, .csv
          </p>
          <Button type="link" onClick={() => message.info('Template download coming soon')}>
            Download Template
          </Button>
        </div>
      )}

      {/* Step 1: Map Columns */}
      {!isProcessing && currentStep === 1 && (
        <>
          <Alert
            message="Auto-Mapping Complete"
            description={`Mapped ${columnMappings.filter(m => m.autoMapped).length}/${columnMappings.length} columns automatically. Review and adjust if needed.`}
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
            scroll={{ y: 400 }}
          />
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button type="primary" onClick={handleMappingValidation}>
                Continue to Validation
              </Button>
            </Space>
          </div>
        </>
      )}

      {/* Step 2: Auto Validate (Processing) - handled by isProcessing */}

      {/* Step 3: Fix Issues */}
      {!isProcessing && currentStep === 3 && (
        <>
          <Alert
            message={`${excelData.length} rows ready | ${validationIssues.length} warnings found`}
            description={
              validationIssues.length > 0
                ? 'These issues will be auto-corrected. Review them below.'
                : 'All validations passed!'
            }
            type={validationIssues.length > 0 ? 'warning' : 'success'}
            showIcon
            style={{ marginBottom: 16 }}
          />

          {validationIssues.length > 0 && (
            <Table
              columns={reviewColumns}
              dataSource={validationIssues}
              pagination={{ pageSize: 10 }}
              size="small"
              style={{ marginBottom: 16 }}
            />
          )}

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(1)}>Back to Mapping</Button>
              <Button type="primary" onClick={handleConflictCheck}>
                Check for Conflicts
              </Button>
            </Space>
          </div>
        </>
      )}

      {/* Step 4: Resolve Conflicts */}
      {!isProcessing && currentStep === 4 && conflicts.length > 0 && (
        <ConflictResolutionScreen
          conflicts={conflicts}
          onResolve={handleConflictResolution}
          onBack={() => setCurrentStep(3)}
          masterName={masterName}
        />
      )}

      {/* Step 5: Final Review */}
      {!isProcessing && currentStep === 5 && (
        <>
          <Alert
            message="Ready to Publish"
            description={
              <div>
                <p><strong>{excelData.length}</strong> total rows</p>
                <p><strong>{validationIssues.length}</strong> warnings (auto-corrected)</p>
                <p><strong>{conflicts.length}</strong> conflicts resolved</p>
                <p><strong>{resolvedConflicts.filter(c => c.resolution === 'skip').length}</strong> rows will be skipped</p>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setCurrentStep(conflicts.length > 0 ? 4 : 3)}>Back</Button>
              <Button type="primary" size="large" onClick={handlePublish}>
                Publish {excelData.length - resolvedConflicts.filter(c => c.resolution === 'skip').length} Records
              </Button>
            </Space>
          </div>
        </>
      )}
    </Modal>
  );
};

// Helper functions for mock data
const getMockColumnsForMaster = (masterId: string): string[] => {
  const columnMap: Record<string, string[]> = {
    fabric: ['Code', 'Type', 'Construction', 'Composition', 'GSM', 'Width', 'Shrinkage %', 'UOM', 'Supplier', 'Status'],
    trim: ['Item Code', 'Item Name', 'Category', 'Supplier', 'UOM', 'Min Stock', 'Status'],
    supplier: ['Supplier Name', 'Type', 'Contact Person', 'Phone', 'Email', 'GST', 'Payment Terms'],
    quality: ['Quality Code', 'Quality Name', 'Fabric Type', 'GSM', 'Default Width', 'UOM', 'Warp', 'Weft', 'Construction', 'Status'],
    width: ['Width Label', 'Unit', 'Converted Meter', 'Description', 'Status'],
    design: ['Design Code', 'Design Name', 'Repeat Size', 'Color Palette', 'Season', 'Buyer', 'Status'],
    grade: ['Grade', 'Description', 'Acceptance %', 'Status'],
  };
  return columnMap[masterId] || ['Code', 'Name', 'Type', 'Status'];
};

const getMockDataForMaster = (masterId: string): any[] => {
  const dataMap: Record<string, any[]> = {
    fabric: [
      { Code: 'FAB001', Type: 'Woven', Construction: 'Plain Weave', Composition: '100% Cotton', GSM: 180, Width: 1.6, 'Shrinkage %': 2.5, UOM: 'Meter', Supplier: 'Fabric Mills', Status: 'Active' },
      { Code: 'FAB002', Type: 'Knitted', Construction: 'Jersey', Composition: '95% Cotton 5% Elastane', GSM: 160, Width: 1.8, 'Shrinkage %': 3.0, UOM: 'Kg', Supplier: 'Textile Hub', Status: 'Active' },
      { Code: 'FAB003', Type: 'Woven', Construction: 'Twill', Composition: '80% Cotton 20% Poly', GSM: 220, Width: 1.5, 'Shrinkage %': 1.5, UOM: 'Meter', Supplier: 'ABC Textiles', Status: 'Active' },
    ],
    trim: [
      { 'Item Code': 'TRM001', 'Item Name': 'Button 18L', Category: 'Button', Supplier: 'Trim World', UOM: 'Pieces', 'Min Stock': 500, Status: 'Active' },
      { 'Item Code': 'TRM002', 'Item Name': 'Zipper 6"', Category: 'Zipper', Supplier: 'Zippers Inc', UOM: 'Pieces', 'Min Stock': 200, Status: 'Active' },
      { 'Item Code': 'TRM003', 'Item Name': 'Woven Label', Category: 'Label', Supplier: 'Label Co', UOM: 'Pieces', 'Min Stock': 1000, Status: 'Active' },
    ],
    supplier: [
      { 'Supplier Name': 'Fabric Mills Ltd', Type: 'Supplier', 'Contact Person': 'Rajesh', Phone: '9876543210', Email: 'rajesh@fabric.com', GST: '27ABCDE1234F1Z5', 'Payment Terms': '30 Days' },
      { 'Supplier Name': 'ABC Trims Pvt Ltd', Type: 'Supplier', 'Contact Person': 'Aisha', Phone: '9123456780', Email: 'aisha@trims.com', GST: '27XYZAB5678G2Z1', 'Payment Terms': '15 Days' },
      { 'Supplier Name': 'Quality Stitching House', Type: 'Job Worker', 'Contact Person': 'Amit', Phone: '9988776655', Email: 'amit@jobwork.com', GST: '27JOBWK9012H3Z7', 'Payment Terms': '7 Days' },
    ],
    quality: [
      { 'Quality Code': 'QLT-001', 'Quality Name': 'Cotton Poplin 40s', 'Fabric Type': 'Woven', GSM: 120, 'Default Width': '58"', UOM: 'Meter', Warp: '40s Cotton', Weft: '40s Cotton', Construction: 'Plain Weave', Status: 'Active' },
      { 'Quality Code': 'QLT-014', 'Quality Name': 'CVC Single Jersey', 'Fabric Type': 'Knitted', GSM: 180, 'Default Width': '60"', UOM: 'Kg', Warp: 'CVC', Weft: 'CVC', Construction: 'Single Jersey', Status: 'Active' },
      { 'Quality Code': 'QLT-021', 'Quality Name': 'Denim 3/1', 'Fabric Type': 'Woven', GSM: 320, 'Default Width': '44"', UOM: 'Meter', Warp: 'Ring Spun Cotton', Weft: 'Open End Cotton', Construction: '3/1 Twill', Status: 'Inactive' },
    ],
    width: [
      { 'Width Label': '44"', Unit: 'inch', 'Converted Meter': 1.12, Description: 'Narrow woven width', Status: 'Active' },
      { 'Width Label': '58"', Unit: 'inch', 'Converted Meter': 1.47, Description: 'Standard poplin width', Status: 'Active' },
      { 'Width Label': '150 cm', Unit: 'cm', 'Converted Meter': 1.5, Description: 'Metric standard', Status: 'Inactive' },
    ],
    design: [
      { 'Design Code': 'DSN-001', 'Design Name': 'Floral Repeat', 'Repeat Size': '5cm x 5cm', 'Color Palette': 'Red, Green, Yellow', Season: 'Spring', Buyer: 'ABC Retail', Status: 'Active' },
      { 'Design Code': 'DSN-045', 'Design Name': 'Geometric Grid', 'Repeat Size': '10cm x 10cm', 'Color Palette': 'Blue, Navy, White', Season: 'Autumn', Buyer: 'XYZ Apparel', Status: 'Inactive' },
      { 'Design Code': 'DSN-102', 'Design Name': 'Chevron', 'Repeat Size': '8cm x 8cm', 'Color Palette': 'Black, Grey', Season: 'Winter', Buyer: 'Fashion Hub', Status: 'Active' },
    ],
    grade: [
      { Grade: 'A', Description: 'Premium quality', 'Acceptance %': 98, Status: 'Active' },
      { Grade: 'B', Description: 'Standard quality', 'Acceptance %': 92, Status: 'Active' },
      { Grade: 'C', Description: 'Commercial quality', 'Acceptance %': 85, Status: 'Inactive' },
    ],
  };
  return dataMap[masterId] || [
    { Code: 'ITEM001', Name: 'Sample Item', Type: 'Type A', Status: 'Active' },
    { Code: 'ITEM002', Name: 'Sample Item 2', Type: 'Type B', Status: 'Active' },
    { Code: 'ITEM003', Name: 'Sample Item 3', Type: 'Type C', Status: 'Inactive' },
  ];
};

export default EnhancedExcelUploadModal;
