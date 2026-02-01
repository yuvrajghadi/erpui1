import React from 'react';
import { Table, Typography, Tag, Space, Button, Tooltip, Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import { 
  EyeOutlined, 
  EditOutlined, 
  HistoryOutlined, 
  ReloadOutlined, 
  DownloadOutlined 
} from '@ant-design/icons';
import { formatNumber, formatCurrency, formatQuantity } from '../../../utilities/formatters';
import { useDeviceType } from '../utils';

const { Text } = Typography;

interface DataTableProps {
  title: string;
  columns: any[];
  dataSource: any[];
  loading?: boolean;
  pagination?: false | TablePaginationConfig;
  rowKey?: string;
  onView?: (record: any) => void;
  onEdit?: (record: any) => void;
  onHistory?: (record: any) => void;
  showActions?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  title,
  columns,
  dataSource,
  loading = false,
  pagination = { pageSize: 5 },
  rowKey = 'id',
  onView,
  onEdit,
  onHistory,
  showActions = true,
}) => {
  const deviceType = useDeviceType();
  // Add action column if showActions is true
  const tableColumns = showActions
    ? [
        ...columns,
        {
          title: 'Actions',
          key: 'actions',
          width: 120,
          align: 'center' as const,
          render: (text: string, record: any) => (
            <Space size="small">
              {onView && (
                deviceType === 'mobile' ? (
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />} 
                    size="small" 
                    onClick={() => onView(record)}
                    style={{ color: 'var(--color-1890ff)' }}
                  />
                ) : (
                  <Tooltip title="View Details">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      size="small" 
                      onClick={() => onView(record)}
                      style={{ color: 'var(--color-1890ff)' }}
                    />
                  </Tooltip>
                )
              )}
              {onEdit && (
                deviceType === 'mobile' ? (
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small" 
                    onClick={() => onEdit(record)}
                    style={{ color: 'var(--color-52c41a)' }}
                  />
                ) : (
                  <Tooltip title="Edit">
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      size="small" 
                      onClick={() => onEdit(record)}
                      style={{ color: 'var(--color-52c41a)' }}
                    />
                  </Tooltip>
                )
              )}
              {onHistory && (
                deviceType === 'mobile' ? (
                  <Button 
                    type="text" 
                    icon={<HistoryOutlined />} 
                    size="small" 
                    onClick={() => onHistory(record)}
                    style={{ color: 'var(--color-722ed1)' }}
                  />
                ) : (
                  <Tooltip title="View History">
                    <Button 
                      type="text" 
                      icon={<HistoryOutlined />} 
                      size="small" 
                      onClick={() => onHistory(record)}
                      style={{ color: 'var(--color-722ed1)' }}
                    />
                  </Tooltip>
                )
              )}
            </Space>
          ),
        },
      ]
    : columns;

  return (
    <div className="inventory-data-table">
      <Card 
        variant="outlined"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong style={{ fontSize: '16px', margin: 0 }}>
              {title}
            </Text>
            <Space>
              <Tooltip title="Refresh data">
                <Button type="text" icon={<ReloadOutlined />} size="small" />
              </Tooltip>
              <Tooltip title="Export data">
                <Button type="text" icon={<DownloadOutlined />} size="small" />
              </Tooltip>
            </Space>
          </div>
        }
        className="data-table-card"
      >
        <Table
          columns={tableColumns}
          dataSource={dataSource}
          loading={loading}
          pagination={pagination}
          rowKey={rowKey}
          size={deviceType === 'desktop' ? 'middle' : 'small'}
          className="enhanced-table"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

// Helper components for common table cell renderings
export const StatusTag: React.FC<{ status: string; text?: string }> = ({ 
  status, 
  text 
}) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case 'in-stock':
      case 'active':
      case 'completed':
      case 'approved':
        return { color: 'success', icon: '●' };
      case 'low-stock':
      case 'pending':
      case 'processing':
        return { color: 'warning', icon: '●' };
      case 'out-of-stock':
      case 'inactive':
      case 'rejected':
      case 'cancelled':
        return { color: 'error', icon: '●' };
      default:
        return { color: 'default', icon: '○' };
    }
  };

  const config = getStatusConfig();
  const displayText = text || status;

  return (
    <Tag color={config.color} style={{ borderRadius: '4px' }}>
      <span style={{ marginRight: '4px', fontSize: '10px' }}>{config.icon}</span>
      {displayText}
    </Tag>
  );
};

export const PriceCell: React.FC<{ value: number; currency?: string; decimals?: number }> = ({ 
  value, 
  currency = '$',
  decimals = 2
}) => {
  return (
    <Text>
      {formatCurrency(value, { decimals })}
    </Text>
  );
};

export const QuantityCell: React.FC<{ value: number; unit?: string; decimals?: number }> = ({ 
  value, 
  unit,
  decimals = 0
}) => {
  return (
    <Text>
      {formatQuantity(value, unit, decimals)}
    </Text>
  );
};

export const DateCell: React.FC<{ value: string | Date }> = ({ 
  value 
}) => {
  const date = typeof value === 'string' ? new Date(value) : value;
  
  // Format date in a stable way that doesn't depend on browser locale
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return (
    <Text>
      {`${year}-${month}-${day}`}
    </Text>
  );
};
