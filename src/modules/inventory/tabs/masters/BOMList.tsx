/**
 * BOM List Screen
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card, Table, Button, Space, Input, Select, Tag, Modal, message } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import type { BOMListItem, BOM } from '../../types/bom';
import { BOMStatus, BOMVersion } from '../../types/bom';
import { SAMPLE_BOM_LIST, SAMPLE_BOM_SH001 } from '../../data/bomData';
import BOMCreateDrawer from './drawers/BOMCreateDrawer';
import * as XLSX from 'xlsx';
import { generateSampleExcel } from '../../components/onboarding/utils/sampleExcelGenerator';
import ExcelUploadButtonGroup from '../../components/onboarding/components/ExcelUploadButtonGroup';

interface BOMListScreenProps {
  onCreateBOM?: () => void;
  onEditBOM?: (id: string) => void;
  onViewBOM?: (id: string) => void;
  onCopyBOM?: (id: string) => void;
}

const BOMListScreen: React.FC<BOMListScreenProps> = ({
  onCreateBOM,
  onEditBOM,
  onViewBOM,
  onCopyBOM,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filterStyle, setFilterStyle] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<BOMStatus | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingBOM, setEditingBOM] = useState<BOM | null>(null);
  const [bomList, setBOMList] = useState(SAMPLE_BOM_LIST);

  const filteredData = useMemo(() => {
    return bomList.filter((bom) => {
      const matchSearch =
        searchText === '' ||
        bom.bomCode.toLowerCase().includes(searchText.toLowerCase()) ||
        bom.style.toLowerCase().includes(searchText.toLowerCase());
      const matchStyle = !filterStyle || bom.style === filterStyle;
      const matchStatus = !filterStatus || bom.status === filterStatus;
      return matchSearch && matchStyle && matchStatus;
    });
  }, [searchText, filterStyle, filterStatus, bomList]);

  const handleSaveBOM = (bom: BOM) => {
    if (editingBOM) {
      // Update existing BOM (convert BOM to BOMListItem for list display)
      const updatedItem: BOMListItem = {
        id: bom.id,
        bomCode: bom.header.bomCode,
        style: bom.header.style,
        buyer: bom.header.buyer,
        season: bom.header.season,
        version: bom.header.bomVersion,
        status: bom.header.status,
        createdDate: bom.header.createdDate,
        createdBy: bom.header.createdBy,
      };
      setBOMList(bomList.map((item) => (item.bomCode === bom.header.bomCode ? updatedItem : item)));
      message.success('BOM updated successfully');
    } else {
      // Create new BOM (convert BOM to BOMListItem for list display)
      const newItem: BOMListItem = {
        id: bom.id,
        bomCode: bom.header.bomCode,
        style: bom.header.style,
        buyer: bom.header.buyer,
        season: bom.header.season,
        version: bom.header.bomVersion,
        status: bom.header.status,
        createdDate: bom.header.createdDate,
        createdBy: bom.header.createdBy,
      };
      setBOMList([newItem, ...bomList]);
      message.success('BOM created successfully');
    }
    setDrawerOpen(false);
    setEditingBOM(null);
  };

  const handleCopy = (id: string) => {
    message.success('BOM copied as new version');
    onCopyBOM?.(id);
  };


  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete BOM',
      content: 'Are you sure you want to delete this BOM?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success('BOM deleted');
      },
    });
  };

  const columns = [
    {
      title: 'BOM Code',
      dataIndex: 'bomCode',
      key: 'bomCode',
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      width: 100,
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      width: 120,
    },
    {
      title: 'Season',
      dataIndex: 'season',
      key: 'season',
      width: 120,
    },
    {
      title: 'Version',
      dataIndex: 'version',
      key: 'version',
      width: 80,
      render: (version: BOMVersion) => <Tag color="blue">{version}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: BOMStatus) => (
        <Tag color={status === BOMStatus.APPROVED ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 120,
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, record: BOMListItem) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onViewBOM?.(record.id)}
            title="View"
          />
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEditBOM?.(record.id)}
            disabled={record.status === BOMStatus.APPROVED}
            title={record.status === BOMStatus.APPROVED ? 'Approved BOMs are read-only' : 'Edit'}
          />
          <Button
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record.id)}
            title="Copy as new version"
          />
          <Button
            type="text"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const styles = Array.from(new Set(bomList.map((b) => b.style)));

  return (
    <div style={{ padding: '16px' }}>
      <Card
        title="BOM / Design Card Master"
        extra={
          <Space style={{ gap: '12px' }}>
            <Input.Search
              placeholder="Search BOM Code or Style..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '250px' }}
            />
            <Select
              placeholder="Filter by Style"
              allowClear
              value={filterStyle}
              onChange={setFilterStyle}
              style={{ width: '150px' }}
              options={styles.map((style) => ({ label: style, value: style }))}
            />
            <Select
              placeholder="Filter by Status"
              allowClear
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '150px' }}
              options={Object.values(BOMStatus).map((status) => ({ label: status, value: status }))}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingBOM(null);
                setDrawerOpen(true);
              }}
            >
              Create BOM
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ExcelUploadButtonGroup
            masterName="BOM"
            onFileSelect={async (file: File) => {
              try {
                const buf = await file.arrayBuffer();
                const wb = XLSX.read(buf);
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows: any[] = XLSX.utils.sheet_to_json(ws);
                console.log('Imported BOM rows:', rows);
                message.success(`${rows.length} rows read`);
              } catch (e) {
                message.error('Failed to read Excel');
              }
            }}
            onDownloadSample={() => { generateSampleExcel('bom'); message.success('Sample Excel downloaded'); }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 15 }}
          size="small"
        />
      </Card>

      {/* BOM Create Drawer */}
      <BOMCreateDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingBOM(null);
        }}
        onSave={handleSaveBOM}
        editBOM={editingBOM}
      />
    </div>
  );
};

export default BOMListScreen;
