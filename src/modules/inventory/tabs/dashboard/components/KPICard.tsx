import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  extra?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, prefix, suffix, extra, color, onClick }) => {
  const isStringPrefix = typeof prefix === 'string' || typeof prefix === 'number';
  const valueText = isStringPrefix ? `${prefix}${value}` : `${value}${suffix ? ' ' + suffix : ''}`;

  return (
    <div
      className="kpi-card"
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `6px solid ${color || 'var(--color-1890ff)'}`,
        background: `linear-gradient(90deg, ${color ? color + '14' : 'var(--color-00000008)'}, var(--color-ffffff))`,
        padding: 16,
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div className="kpi-title">{title}</div>
          <div className="kpi-value" style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{valueText}</span>
          </div>
          {extra}
        </div>
        <div style={{ marginLeft: 12, flex: '0 0 auto' }}>{!isStringPrefix ? prefix : null}</div>
      </div>
    </div>
  );
};

export default KPICard;