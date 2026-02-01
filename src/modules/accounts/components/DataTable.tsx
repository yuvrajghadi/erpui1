import React from 'react';
import { Table, Typography } from 'antd';
import type { TableProps } from 'antd';

const { Title } = Typography;

interface DataTableProps<T> extends Omit<TableProps<T>, 'title'> {
  title?: string;
  data: T[];
  columns: any[];
  loading?: boolean;
  emptyText?: string;
  onView?: (record: T) => void;
  onHistory?: (record: T) => void;
  onEdit?: (record: T) => void;
}

function DataTable<T extends object>({ 
  title, 
  data, 
  columns, 
  loading = false,
  emptyText = 'No data available',
  onView,
  onHistory,
  onEdit,
  ...restProps 
}: DataTableProps<T>) {
  return (
    <div className="data-table-container">
      {title && <Title level={5} style={{ marginBottom: 16 }}>{title}</Title>}
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ 
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false
        }}
        size="small"
        scroll={{ x: 'max-content' }}
        locale={{ emptyText }}
        {...restProps}
      />
    </div>
  );
}

export default DataTable;