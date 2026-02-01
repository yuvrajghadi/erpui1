/**
 * BarcodePrintPreview Component
 * Preview and print barcode labels for fabric rolls
 */

'use client';

import React, { useState, useRef } from 'react';
import { Modal, Button, Radio, Space, Row, Col, Typography, Divider } from 'antd';
import { PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import BarcodeGenerator from './BarcodeGenerator';
import type { BarcodeData, BarcodeLabelSize, BarcodeFormat } from '../../types';
import './BarcodePrintPreview.scss';

const { Text } = Typography;

interface BarcodePrintPreviewProps {
  visible: boolean;
  barcodes: BarcodeData[];
  onClose: () => void;
  onPrintComplete?: (barcodeIds: string[]) => void;
}

const BarcodePrintPreview: React.FC<BarcodePrintPreviewProps> = ({
  visible,
  barcodes,
  onClose,
  onPrintComplete,
}) => {
  const [labelSize, setLabelSize] = useState<BarcodeLabelSize>('50x25');
  const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>('CODE128');
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
    
    // Callback after print
    if (onPrintComplete) {
      onPrintComplete(barcodes.map(b => b.rollBarcodeId));
    }
  };

  const getLabelDimensions = () => {
    if (labelSize === '50x25') {
      return { width: '50mm', height: '25mm' };
    }
    return { width: '75mm', height: '50mm' };
  };

  const dimensions = getLabelDimensions();

  return (
    <>
      <Modal
        title="Print Barcode Labels"
        open={visible}
        onCancel={onClose}
        width={900}
        footer={[
          <Button key="close" onClick={onClose} icon={<CloseOutlined />}>
            Close
          </Button>,
          <Button key="print" type="primary" onClick={handlePrint} icon={<PrinterOutlined />}>
            Print ({barcodes.length} labels)
          </Button>,
        ]}
        className="barcode-print-modal"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Print Settings */}
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Label Size:</Text>
              <div style={{ marginTop: 8 }}>
                <Radio.Group value={labelSize} onChange={(e) => setLabelSize(e.target.value)}>
                  <Radio value="50x25">50mm x 25mm (Small)</Radio>
                  <Radio value="75x50">75mm x 50mm (Large)</Radio>
                </Radio.Group>
              </div>
            </Col>
            <Col span={12}>
              <Text strong>Barcode Format:</Text>
              <div style={{ marginTop: 8 }}>
                <Radio.Group value={barcodeFormat} onChange={(e) => setBarcodeFormat(e.target.value)}>
                  <Radio value="CODE128">Code 128</Radio>
                  <Radio value="QR">QR Code</Radio>
                </Radio.Group>
              </div>
            </Col>
          </Row>

          <Divider style={{ margin: '12px 0' }} />

          {/* Preview Section */}
          <div style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid var(--color-d9d9d9)', padding: '16px', background: 'var(--page-bg)' }}>
            <div ref={printRef} className="barcode-labels-container">
              {barcodes.map((barcode, index) => (
                <div
                  key={barcode.rollBarcodeId}
                  className="barcode-label"
                  style={{
                    width: dimensions.width,
                    height: dimensions.height,
                    border: '1px dashed var(--color-999999)',
                    padding: labelSize === '50x25' ? '4mm' : '6mm',
                    marginBottom: '8px',
                    background: 'var(--color-ffffff)',
                    pageBreakAfter: 'always',
                    pageBreakInside: 'avoid',
                  }}
                >
                  <BarcodeLabel 
                    barcode={barcode} 
                    format={barcodeFormat} 
                    size={labelSize}
                  />
                </div>
              ))}
            </div>
          </div>
        </Space>
      </Modal>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .barcode-labels-container,
          .barcode-labels-container * {
            visibility: visible;
          }
          .barcode-labels-container {
            position: absolute;
            left: 0;
            top: 0;
          }
          .barcode-label {
            page-break-after: always;
            page-break-inside: avoid;
            margin: 0 !important;
            border: none !important;
          }
          @page {
            size: ${dimensions.width} ${dimensions.height};
            margin: 0;
          }
        }
      `}</style>
    </>
  );
};

// Individual Barcode Label Component
interface BarcodeLabelProps {
  barcode: BarcodeData;
  format: BarcodeFormat;
  size: BarcodeLabelSize;
}

const BarcodeLabel: React.FC<BarcodeLabelProps> = ({ barcode, format, size }) => {
  const isSmall = size === '50x25';
  const fontSize = isSmall ? '7px' : '9px';
  const titleSize = isSmall ? '8px' : '10px';

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Header */}
      <div style={{ fontSize: titleSize, fontWeight: 'bold', marginBottom: '2mm', textAlign: 'center', borderBottom: '1px solid var(--barcode-ink)', paddingBottom: '1mm' }}>
        FABRIC ROLL
      </div>

      {/* Barcode */}
      <div style={{ textAlign: 'center', margin: '2mm 0' }}>
        <BarcodeGenerator 
          data={barcode} 
          format={format}
          width={isSmall ? 1.5 : 2}
          height={isSmall ? 30 : 50}
          displayValue={false}
        />
      </div>

      {/* Details */}
      <div style={{ fontSize, lineHeight: isSmall ? '1.3' : '1.4', fontFamily: 'monospace' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1mm' }}>
          <div><strong>Fabric:</strong></div>
          <div>{barcode.fabricCode}</div>
          
          <div><strong>Lot:</strong></div>
          <div>{barcode.lotNumber}</div>
          
          <div><strong>Shade:</strong></div>
          <div>{barcode.shade}</div>
          
          <div><strong>GSM:</strong></div>
          <div>{barcode.gsmActual}</div>
          
          <div><strong>Qty:</strong></div>
          <div>{barcode.rollQty} {barcode.rollQtyUnit}</div>
          
          {barcode.rollNumber && (
            <>
              <div><strong>Roll:</strong></div>
              <div>{barcode.rollNumber}</div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: isSmall ? '6px' : '7px', marginTop: '1mm', paddingTop: '1mm', borderTop: '1px solid var(--color-cccccc)', textAlign: 'center' }}>
        <div><strong>Location:</strong> {barcode.locationDisplay || 'Not Assigned'}</div>
        <div style={{ marginTop: '0.5mm' }}><strong>ID:</strong> {barcode.rollBarcodeId}</div>
      </div>
    </div>
  );
};

export default BarcodePrintPreview;
