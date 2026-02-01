/**
 * BarcodeGenerator Component
 * Generates Code128 or QR barcodes for fabric rolls
 */

'use client';

import React from 'react';
import type { BarcodeData, BarcodeFormat } from '../../types';

interface BarcodeGeneratorProps {
  data: BarcodeData;
  format?: BarcodeFormat;
  width?: number;
  height?: number;
  displayValue?: boolean;
  className?: string;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  data,
  format = 'CODE128',
  width = 2,
  height = 80,
  displayValue = true,
  className = '',
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = React.useState<string>('');

  // Encode barcode data as string
  const encodeData = (barcodeData: BarcodeData): string => {
    // Format: BARCODEID|FABRIC|LOT|SHADE|GSM|QTY|LOCATION|GRN
    return [
      barcodeData.rollBarcodeId,
      barcodeData.fabricCode,
      barcodeData.lotNumber,
      barcodeData.shade,
      barcodeData.gsmActual,
      `${barcodeData.rollQty}${barcodeData.rollQtyUnit}`,
      barcodeData.locationDisplay || '',
      barcodeData.grnReference,
    ].join('|');
  };

  React.useEffect(() => {
    if (format === 'CODE128') {
      // For CODE128, we'll use a simple SVG-based rendering
      // In production, use a library like 'react-barcode' or 'jsbarcode'
      generateCode128SVG();
    } else {
      // For QR, generate QR code
      generateQRCode();
    }
  }, [data, format]);

  const generateCode128SVG = () => {
    // Simplified CODE128 representation
    // In production, use JsBarcode library
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simplified barcode pattern
    ctx.fillStyle = 'var(--barcode-ink)';
    const barcodeValue = data.rollBarcodeId;
    const barWidth = width;
    let x = 10;

    // Simplified bar pattern (alternating black/white)
    for (let i = 0; i < barcodeValue.length; i++) {
      const charCode = barcodeValue.charCodeAt(i);
      const pattern = charCode % 2 === 0 ? [1, 0, 1, 0, 1] : [0, 1, 0, 1, 0];
      
      pattern.forEach((bit) => {
        if (bit === 1) {
          ctx.fillRect(x, 10, barWidth, height);
        }
        x += barWidth;
      });
    }

    // Draw text below barcode if displayValue is true
    if (displayValue) {
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(barcodeValue, canvas.width / 2, height + 25);
    }
  };

  const generateQRCode = () => {
    // Simplified QR code generation
    // In production, use 'qrcode.react' or 'qrcode' library
    const encodedData = encodeData(data);
    
    // For demo, create a simple grid pattern based on data
    const canvas = document.createElement('canvas');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Background
    ctx.fillStyle = 'var(--color-ffffff)';
    ctx.fillRect(0, 0, size, size);

    // Simplified QR pattern (in production, use actual QR library)
    ctx.fillStyle = 'var(--barcode-ink)';
    const moduleSize = 5;
    const modules = size / moduleSize;

    // Generate pseudo-random pattern based on barcode ID
    const seed = data.rollBarcodeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    let random = seed;

    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        random = (random * 1103515245 + 12345) & 0x7fffffff;
        if (random % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    setQrDataUrl(canvas.toDataURL());
  };

  if (format === 'QR') {
    return (
      <div className={`barcode-qr ${className}`}>
        {qrDataUrl ? (
          <img src={qrDataUrl} alt="QR Code" style={{ width: '100%', maxWidth: '200px' }} />
        ) : (
          <div style={{ width: 200, height: 200, background: 'var(--color-f0f0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            QR Code
          </div>
        )}
        {displayValue && (
          <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '8px', fontFamily: 'monospace' }}>
            {data.rollBarcodeId}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`barcode-code128 ${className}`}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={120}
        style={{ border: '1px solid var(--color-dddddd)', background: 'var(--color-ffffff)' }}
      />
    </div>
  );
};

export default BarcodeGenerator;
