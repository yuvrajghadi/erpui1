/**
 * BarcodeScanInput Component
 * Handles barcode scanning via keyboard/USB scanner with auto-focus and validation
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Input, Tag, Space, Alert, Button, Tooltip } from 'antd';
import { 
  ScanOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  DeleteOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import type { BarcodeData } from '../../types';
import './BarcodeScanInput.scss';

interface BarcodeScanInputProps {
  onScan: (barcode: string) => Promise<BarcodeData | null>;
  onBarcodeAdded?: (barcode: BarcodeData) => void;
  onBarcodeRemoved?: (barcodeId: string) => void;
  scannedBarcodes?: BarcodeData[];
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  maxScans?: number;
  allowDuplicates?: boolean;
  validateBeforeAdd?: (barcode: BarcodeData) => { valid: boolean; message?: string };
  showScannedList?: boolean;
}

const BarcodeScanInput: React.FC<BarcodeScanInputProps> = ({
  onScan,
  onBarcodeAdded,
  onBarcodeRemoved,
  scannedBarcodes = [],
  placeholder = 'Scan barcode or type barcode ID...',
  autoFocus = true,
  disabled = false,
  maxScans,
  allowDuplicates = false,
  validateBeforeAdd,
  showScannedList = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRef = useRef<any>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Reset focus after scan
  useEffect(() => {
    if (!scanning && autoFocus && inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [scanning, autoFocus]);

  const handleScan = async (barcodeValue: string) => {
    if (!barcodeValue.trim()) return;

    setScanning(true);
    setError(null);
    setSuccess(null);

    try {
      // Check max scans limit
      if (maxScans && scannedBarcodes.length >= maxScans) {
        setError(`Maximum ${maxScans} barcodes allowed`);
        setInputValue('');
        setScanning(false);
        return;
      }

      // Check for duplicates
      if (!allowDuplicates && scannedBarcodes.some(b => b.rollBarcodeId === barcodeValue)) {
        setError(`Barcode ${barcodeValue} already scanned`);
        setInputValue('');
        setScanning(false);
        return;
      }

      // Fetch barcode data
      const barcodeData = await onScan(barcodeValue);

      if (!barcodeData) {
        setError(`Invalid or not found: ${barcodeValue}`);
        setInputValue('');
        setScanning(false);
        return;
      }

      // Custom validation
      if (validateBeforeAdd) {
        const validation = validateBeforeAdd(barcodeData);
        if (!validation.valid) {
          setError(validation.message || 'Validation failed');
          setInputValue('');
          setScanning(false);
          return;
        }
      }

      // Success
      setSuccess(`✓ ${barcodeData.fabricCode} - ${barcodeData.lotNumber} - ${barcodeData.rollQty} ${barcodeData.rollQtyUnit}`);
      if (onBarcodeAdded) {
        onBarcodeAdded(barcodeData);
      }
      setInputValue('');

      // Auto-clear success message
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error scanning barcode');
      console.error('Barcode scan error:', err);
    } finally {
      setScanning(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear previous timeout
    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    // Auto-submit after 100ms of no input (simulates barcode scanner behavior)
    if (value.length >= 8) { // Minimum barcode length
      scanTimeoutRef.current = setTimeout(() => {
        handleScan(value);
      }, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      handleScan(inputValue);
    }
  };

  const handleRemove = (barcodeId: string) => {
    if (onBarcodeRemoved) {
      onBarcodeRemoved(barcodeId);
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  return (
    <div className="barcode-scan-input">
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Scan Input */}
        <div className="scan-input-wrapper">
          <Input
            ref={inputRef}
            size="large"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled || scanning}
            prefix={<ScanOutlined spin={scanning} style={{ color: scanning ? 'var(--color-1890ff)' : 'var(--color-999999)' }} />}
            suffix={
              <Tooltip title="Use USB barcode scanner or type manually">
                <BarcodeOutlined style={{ color: 'var(--color-999999)' }} />
              </Tooltip>
            }
            className="scan-input"
          />
          {maxScans && (
            <div style={{ fontSize: '12px', color: 'var(--color-999999)', marginTop: '4px' }}>
              Scanned: {scannedBarcodes.length} / {maxScans}
            </div>
          )}
        </div>

        {/* Success Message */}
        {success && (
          <Alert
            message={success}
            type="success"
            icon={<CheckCircleOutlined />}
            closable
            onClose={() => setSuccess(null)}
            showIcon
          />
        )}

        {/* Error Message */}
        {error && (
          <Alert
            message={error}
            type="error"
            icon={<CloseCircleOutlined />}
            closable
            onClose={handleClearError}
            showIcon
          />
        )}

        {/* Scanned Barcodes List */}
        {showScannedList && scannedBarcodes.length > 0 && (
          <div className="scanned-barcodes-list">
            <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px', color: 'var(--color-666666)' }}>
              Scanned Barcodes ({scannedBarcodes.length}):
            </div>
            <Space size={[8, 8]} wrap>
              {scannedBarcodes.map((barcode) => (
                <Tag
                  key={barcode.rollBarcodeId}
                  color="blue"
                  closable
                  onClose={() => handleRemove(barcode.rollBarcodeId)}
                  icon={<CheckCircleOutlined />}
                  className="scanned-barcode-tag"
                >
                  <strong>{barcode.rollBarcodeId}</strong> | {barcode.fabricCode} | Lot: {barcode.lotNumber} | {barcode.rollQty} {barcode.rollQtyUnit}
                </Tag>
              ))}
            </Space>
          </div>
        )}
      </Space>
    </div>
  );
};

export default BarcodeScanInput;
