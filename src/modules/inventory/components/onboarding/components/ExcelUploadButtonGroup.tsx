/**
 * Excel Upload Button Group Component
 * Consistent pattern for Excel-based master data & opening stock imports
 * For Textile & Garment ERP
 */

'use client';

import React, { useState } from 'react';
import { Button, Space, Typography, Upload, message } from 'antd';
import { UploadOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Text } = Typography;

interface ExcelUploadButtonGroupProps {
  masterName: string;
  onFileSelect: (file: File) => void;
  onDownloadSample: () => void;
  isOpeningData?: boolean;
  disabled?: boolean;
  accept?: string;
}

const ExcelUploadButtonGroup: React.FC<ExcelUploadButtonGroupProps> = ({
  masterName,
  onFileSelect,
  onDownloadSample,
  isOpeningData = false,
  disabled = false,
  accept = '.xlsx,.xls',
}) => {
  const [selectedFile, setSelectedFile] = useState<UploadFile | null>(null);

  const handleFileChange = (info: any) => {
    const uploadFile = info.file as UploadFile;

    // Try to obtain the native File object (originFileObj) when available.
    const nativeFile: File | undefined = (uploadFile as any)?.originFileObj as File | undefined;

    // Determine the file name and a File-like object to pass to parent.
    const fileName = uploadFile?.name || (nativeFile && nativeFile.name) || 'unknown-file';
    const fileToPass: File | undefined = nativeFile ?? ((uploadFile as unknown) as File);

    if (!fileToPass) {
      message.error('Could not read the selected file. Please try again.');
      return false;
    }

    // Validate file type by name
    const isExcel = fileName.toLowerCase().endsWith('.xlsx') || fileName.toLowerCase().endsWith('.xls');
    if (!isExcel) {
      message.error('Please upload an Excel file (.xlsx or .xls)');
      return false;
    }

    // Update UI and notify parent with a native File instance
    setSelectedFile(uploadFile);
    try {
      onFileSelect(fileToPass);
      message.success(`${fileName} selected successfully`);
    } catch (err) {
      message.error('Failed to process selected file');
    }

    return false; // Prevent auto upload
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {/* Button Group */}
        <Space size="middle">
          <Upload
            accept={accept}
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
            disabled={disabled}
          >
            <Button
              type="primary"
              icon={<UploadOutlined />}
              size="large"
              disabled={disabled}
              style={{
                minWidth: 160,
                height: 40,
                fontWeight: 600,
              }}
            >
              Upload Excel
            </Button>
          </Upload>

          <Button
            icon={<DownloadOutlined />}
            size="large"
            onClick={onDownloadSample}
            disabled={disabled}
            style={{
              minWidth: 180,
              height: 40,
              fontWeight: 500,
            }}
          >
            Download Sample Excel
          </Button>
        </Space>

        {/* Selected File Display */}
        {selectedFile && (
          <div style={{
            padding: '8px 12px',
            background: 'var(--color-f0f5ff)',
            border: '1px solid var(--color-d6e4ff)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            <FileExcelOutlined style={{ color: 'var(--color-1890ff)', fontSize: 16 }} />
            <Text style={{ color: 'var(--color-1890ff)', fontWeight: 500 }}>
              {selectedFile.name}
            </Text>
          </div>
        )}

        {/* Help Text */}
        <div style={{ 
          padding: '12px 16px',
          background: 'var(--page-bg)',
          border: '1px solid var(--color-e8e8e8)',
          borderRadius: 8,
        }}>
          <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
            <strong>📋 How to use:</strong>
          </Text>
          <Text type="secondary" style={{ fontSize: 13, display: 'block', lineHeight: 1.6 }}>
            Use the sample Excel to understand the format. Replace sample data with your actual factory data.
          </Text>
          
          {isOpeningData && (
            <div style={{
              marginTop: 12,
              padding: '8px 12px',
              background: 'var(--color-fff7e6)',
              border: '1px solid var(--color-ffd591)',
              borderRadius: 6,
            }}>
              <Text style={{ color: 'var(--color-faad14)', fontSize: 13, fontWeight: 600 }}>
                ⚠️ This is a one-time import. After confirmation, data will be locked.
              </Text>
            </div>
          )}
        </div>
      </Space>
    </div>
  );
};

export default ExcelUploadButtonGroup;
