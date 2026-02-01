/**
 * Variance Review - Compare system stock vs physical count
 */

'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Drawer, Row, Col, Tag, message, Tooltip, Modal, Progress, Select } from 'antd';
import { EyeOutlined, CheckOutlined, SearchOutlined, WarningOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface VarianceItem {
  id: string;
  warehouse: string;
  fabricItem: string;
  lotShade: string;
  systemQty: number;
  physicalQty: number;
  variance: number;
  variancePercent: number;
  status: 'Matched' | 'Excess' | 'Shortage';
  uom: string;
  locked?: boolean;
}

import physicalInventoryStore from '../../store/physicalInventoryStore';

const VarianceReview: React.FC = () => {
  
  const [currentRole, setCurrentRole] = useState<'store'|'manager'|'finance'>('store');
  const [data, setData] = useState<VarianceItem[]>([
    { id: '1', warehouse: 'Main Warehouse', fabricItem: 'Cotton Fabric - White', lotShade: 'LOT-2024-001', systemQty: 1000, physicalQty: 980, variance: -20, variancePercent: -2.0, status: 'Shortage', uom: 'kg', locked: false },
    { id: '2', warehouse: 'Main Warehouse', fabricItem: 'Polyester Blend', lotShade: 'LOT-2024-002', systemQty: 500, physicalQty: 505, variance: 5, variancePercent: 1.0, status: 'Excess', uom: 'kg', locked: false },
    { id: '3', warehouse: 'Store Room A', fabricItem: 'Silk Fabric', lotShade: 'LOT-2024-003', systemQty: 250, physicalQty: 250, variance: 0, variancePercent: 0, status: 'Matched', uom: 'kg', locked: false },
    { id: '4', warehouse: 'Store Room B', fabricItem: 'Denim - Blue', lotShade: 'LOT-2024-004', systemQty: 800, physicalQty: 750, variance: -50, variancePercent: -6.25, status: 'Shortage', uom: 'kg', locked: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<VarianceItem | null>(null);
  const [searchText, setSearchText] = useState('');
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [auditFor, setAuditFor] = useState<any>(null);

  const handleViewDetails = (record: VarianceItem) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const handleApproveAdjustment = (record: VarianceItem) => {
    // Direct approve flow: create draft -> submit -> approve -> post & lock
    if (record.status === 'Matched') { message.info('No adjustment required for matched items'); return; }
    const userStore = { name: 'Store Exec', dept: 'Stores' };
    const draft = physicalInventoryStore.createAdjustmentDraft({ warehouse: record.warehouse, item: record.fabricItem, lotShade: record.lotShade, qty: record.variance * -1, uom: record.uom, refNo: `VAR-${record.id}` }, userStore);
    physicalInventoryStore.submitAdjustment(draft.id, userStore);
    const approver = { name: 'Inventory Manager', dept: 'Inventory' };
    physicalInventoryStore.approveAdjustment(draft.id, approver);
    const finance = { name: 'Finance User', dept: 'Finance' };
    physicalInventoryStore.postAndLockAdjustment(draft.id, finance);
    // mark variance as locked by updating local state to prevent further edits
    setData(prev => prev.map(d => d.id === record.id ? { ...d, status: 'Matched', locked: true } : d));
    setAdjustments(physicalInventoryStore.listAdjustments());
    message.success(`Variance ${record.id} approved and adjustment posted (${draft.id})`);
  };

  const handleRejectAdjustment = (record: VarianceItem) => {
    // mark as no adjustment required; do not create ledger entries
    setData(prev => prev.map(d => d.id === record.id ? { ...d, status: 'Matched', locked: true } : d));
    message.info(`Variance ${record.id} rejected — no stock movement created`);
  };

  // Manual adjustment modal removed: adjustments are system-generated on Approve only

  React.useEffect(() => {
    setAdjustments(physicalInventoryStore.listAdjustments());
  }, []);

  const handleSubmitAdj = (id: string) => {
    try {
      const user = { name: 'Store Exec', dept: 'Stores' };
      physicalInventoryStore.submitAdjustment(id, user);
      setAdjustments(physicalInventoryStore.listAdjustments());
      message.success(`${id} submitted for approval`);
    } catch (e:any) { message.error(e.message || 'Error'); }
  };

  const handleApproveAdj = (id: string) => {
    try {
      const user = { name: 'Inventory Manager', dept: 'Inventory' };
      physicalInventoryStore.approveAdjustment(id, user);
      setAdjustments(physicalInventoryStore.listAdjustments());
      message.success(`${id} approved`);
    } catch (e:any) { message.error(e.message || 'Error'); }
  };

  const handlePostAdj = (id: string) => {
    try {
      const user = { name: 'Finance Admin', dept: 'Finance' };
      physicalInventoryStore.postAndLockAdjustment(id, user);
      setAdjustments(physicalInventoryStore.listAdjustments());
      message.success(`${id} posted & locked`);
    } catch (e:any) { message.error(e.message || 'Error'); }
  };

  const openAudit = (adj: any) => { setAuditFor(adj); setAuditModalVisible(true); };

  const columns: ColumnsType<VarianceItem> = [
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 150,
      fixed: 'left',
    },
    {
      title: 'Fabric / Item',
      dataIndex: 'fabricItem',
      key: 'fabricItem',
      width: 200,
    },
    {
      title: 'Lot / Shade',
      dataIndex: 'lotShade',
      key: 'lotShade',
      width: 140,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'System Qty',
      dataIndex: 'systemQty',
      key: 'systemQty',
      width: 120,
      align: 'right',
      render: (val, record) => `${val} ${record.uom}`,
    },
    {
      title: 'Physical Qty',
      dataIndex: 'physicalQty',
      key: 'physicalQty',
      width: 120,
      align: 'right',
      render: (val, record) => `${val} ${record.uom}`,
    },
    {
      title: 'Variance (+ / -)',
      dataIndex: 'variance',
      key: 'variance',
      width: 130,
      align: 'right',
      render: (val, record) => (
        <span style={{ color: val > 0 ? 'var(--color-52c41a)' : val < 0 ? 'var(--color-ff4d4f)' : 'var(--color-666666)', fontWeight: 'bold' }}>
          {val > 0 ? '+' : ''}{val} {record.uom}
        </span>
      ),
    },
    {
      title: 'Variance %',
      dataIndex: 'variancePercent',
      key: 'variancePercent',
      width: 110,
      align: 'right',
      render: (val) => (
        <span style={{ color: val > 0 ? 'var(--color-52c41a)' : val < 0 ? 'var(--color-ff4d4f)' : 'var(--color-666666)' }}>
          {val > 0 ? '+' : ''}{val.toFixed(2)}%
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const colorMap: Record<string, string> = { Matched: 'success', Excess: 'warning', Shortage: 'error' };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          </Tooltip>
          {record.status !== 'Matched' && !record.locked && (
            <>
              <Tooltip title="Approve">
                <Button type="text" size="small" icon={<CheckOutlined />} onClick={() => handleApproveAdjustment(record)} />
              </Tooltip>
              <Tooltip title="Reject">
                <Button type="text" size="small" icon={<WarningOutlined />} onClick={() => handleRejectAdjustment(record)} />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const stats = {
    matched: data.filter(d => d.status === 'Matched').length,
    excess: data.filter(d => d.status === 'Excess').length,
    shortage: data.filter(d => d.status === 'Shortage').length,
  };

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-52c41a)' }}>{stats.matched}</div>
              <div style={{ color: 'var(--color-595959)', marginTop: 8, fontSize: '13px', fontWeight: 600 }}>Matched Items</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-faad14)' }}>{stats.excess}</div>
              <div style={{ color: 'var(--color-595959)', marginTop: 8, fontSize: '13px', fontWeight: 600 }}>Excess Items</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-ff4d4f)' }}>{stats.shortage}</div>
              <div style={{ color: 'var(--color-595959)', marginTop: 8, fontSize: '13px', fontWeight: 600 }}>Shortage Items</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <Space>
            <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>Variance Review</span>
          </Space>
        }
        extra={
          <Space>
            <Select value={currentRole} onChange={(v) => setCurrentRole(v)} style={{ width: 160 }}>
              <Select.Option value="store">Store Executive</Select.Option>
              <Select.Option value="manager">Inventory Manager</Select.Option>
              <Select.Option value="finance">Finance / Admin</Select.Option>
            </Select>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Space>
        }
        style={{
          borderRadius: '12px',
          border: '2px solid var(--color-e8e8e8)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        headStyle={{
          borderBottom: '2px solid var(--color-f0f0f0)',
          background: 'linear-gradient(135deg, var(--page-bg) 0%, var(--table-header-bg) 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '16px 24px',
        }}
        bodyStyle={{ padding: '24px', background: 'var(--color-ffffff)' }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} items` }}
        />
      </Card>

        {/* spacer between Variance Review and Adjustment Register */}
        <div style={{ height: 24 }} />

        {/* Adjustment Register: show only posted/locked adjustments (system-generated, read-only) */}
      {adjustments.filter(a => a.postingStatus === 'Posted' || a.status === 'Locked').length > 0 && (
        <Card style={{ marginTop: 16 }} title={<strong>Adjustment Register</strong>} extra={<Button onClick={() => setAdjustments(physicalInventoryStore.listAdjustments())}>Refresh</Button>}>
          <Table
            size="small"
            dataSource={adjustments.filter(a => a.postingStatus === 'Posted' || a.status === 'Locked')}
            rowKey={(r:any)=>r.id}
            pagination={{pageSize:5}}
            columns={[
              { title: 'Adjustment ID', dataIndex: 'id', key: 'id' },
              { title: 'Reference No', dataIndex: 'refNo', key: 'refNo' },
              { title: 'Item Name', dataIndex: 'item', key: 'item' },
              { title: 'Lot / Shade', dataIndex: 'lotShade', key: 'lotShade' },
              { title: 'Warehouse', dataIndex: 'warehouse', key: 'warehouse' },
              { title: 'Type', key: 'type', render: (_:any, r:any) => (r.qty>0? 'Excess':'Shortage') },
              { title: 'Adj Qty', dataIndex: 'qty', key: 'qty', align: 'right', render: (q:number)=> q>0? `+${q}`:`${q}` },
              { title: 'Approved By', dataIndex: 'approvedBy', key: 'approvedBy', render: (v:any)=> v?.name || '-' },
              { title: 'Approved Date', dataIndex: 'approvedAt', key: 'approvedAt', render: (d:any)=> d? new Date(d).toLocaleString() : '-' },
              { title: 'Posting Status', dataIndex: 'postingStatus', key: 'postingStatus' },
              { title: 'Ledger Ref', dataIndex: 'ledgerRef', key: 'ledgerRef' },
              { title: 'Audit', key: 'audit', render: (_:any, r:any)=>(<Button size="small" onClick={()=>openAudit(r)}>View</Button>) }
            ]}
          />
        </Card>
      )}

      <Modal title={`Audit Trail - ${auditFor?.id || ''}`} open={auditModalVisible} onCancel={() => setAuditModalVisible(false)} footer={null} width={600}>
        {auditFor ? (
          <div>
            {auditFor.audit?.map((a:any, idx:number)=> (
              <div key={idx} style={{ padding: 8, borderBottom: '1px solid var(--color-f0f0f0)' }}>
                <div><strong>{a.action}</strong> by {a.by?.name || a.by} at {new Date(a.at).toLocaleString()}</div>
                {a.note && <div style={{ color: 'var(--color-666666)', marginTop: 6 }}>{a.note}</div>}
              </div>
            ))}
          </div>
        ) : null}
      </Modal>

      {/* View Details Drawer */}
      <Drawer
        className="inventory-drawer physical-inventory-drawer"
        title="Variance Details"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 600 : '100%'}
      >
        {selectedRecord && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card size="small" title="Item Information">
                  <Row gutter={[16, 8]}>
                    <Col span={12}><strong>Warehouse:</strong></Col>
                    <Col span={12}>{selectedRecord.warehouse}</Col>
                    <Col span={12}><strong>Fabric / Item:</strong></Col>
                    <Col span={12}>{selectedRecord.fabricItem}</Col>
                    <Col span={12}><strong>Lot / Shade:</strong></Col>
                    <Col span={12}><Tag color="purple">{selectedRecord.lotShade}</Tag></Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" title="Quantity Comparison">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '16px', background: 'var(--color-f0f2f5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedRecord.systemQty} {selectedRecord.uom}</div>
                        <div style={{ color: 'var(--color-666666)', marginTop: 4 }}>System Qty</div>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ textAlign: 'center', padding: '16px', background: 'var(--color-f0f2f5)', borderRadius: '8px' }}>
                        <div style={{ fontSize: 20, fontWeight: 'bold' }}>{selectedRecord.physicalQty} {selectedRecord.uom}</div>
                        <div style={{ color: 'var(--color-666666)', marginTop: 4 }}>Physical Qty</div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" title="Variance Analysis">
                  <Row gutter={[16, 8]}>
                    <Col span={12}><strong>Variance:</strong></Col>
                    <Col span={12}>
                      <span style={{ color: selectedRecord.variance > 0 ? 'var(--color-52c41a)' : selectedRecord.variance < 0 ? 'var(--color-ff4d4f)' : 'var(--color-666666)', fontWeight: 'bold' }}>
                        {selectedRecord.variance > 0 ? '+' : ''}{selectedRecord.variance} {selectedRecord.uom}
                      </span>
                    </Col>
                    <Col span={12}><strong>Variance %:</strong></Col>
                    <Col span={12}>
                      <span style={{ color: selectedRecord.variancePercent > 0 ? 'var(--color-52c41a)' : selectedRecord.variancePercent < 0 ? 'var(--color-ff4d4f)' : 'var(--color-666666)' }}>
                        {selectedRecord.variancePercent > 0 ? '+' : ''}{selectedRecord.variancePercent.toFixed(2)}%
                      </span>
                    </Col>
                    <Col span={12}><strong>Status:</strong></Col>
                    <Col span={12}>
                      <Tag color={selectedRecord.status === 'Matched' ? 'success' : selectedRecord.status === 'Excess' ? 'warning' : 'error'}>
                        {selectedRecord.status}
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Drawer>

      {/* Manual approval modal removed — adjustments are system-generated on Approve only */}
    </div>
  );
};

export default VarianceReview;
