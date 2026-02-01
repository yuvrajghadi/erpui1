/**
 * Onboarding Dashboard Component
 * WORLD-CLASS Textile ERP Onboarding Experience with Advanced Features
 */

'use client';

import React, { useState } from 'react';
import { Row, Col, Card, Progress, Statistic, Button, Modal, message, Tabs, Alert, Space } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  InboxOutlined,
  TagsOutlined,
  AppstoreOutlined,
  HomeOutlined,
  TeamOutlined,
  SettingOutlined,
  BgColorsOutlined,
  FileProtectOutlined,
  RocketOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import MasterCard from './components/MasterCard';
import EnhancedExcelUploadModal from './components/EnhancedExcelUploadModal';
import AuditLogViewer from './components/AuditLogViewer';
import BOMUploadComponent from './components/BOMUploadComponent';
import FabricMaster from './masters/FabricMaster';
import TrimAccessoriesMaster from './masters/TrimAccessoriesMaster';
import ShadeMaster from './masters/ShadeMaster';
import UOMMaster from './masters/UOMMaster';
import WarehouseZoneMaster from './masters/WarehouseZoneMaster';
import SupplierMaster from './masters/SupplierMaster';
import ProcessOperationMaster from './masters/ProcessOperationMaster';
import MaterialCategoryMaster from './masters/MaterialCategoryMaster';
import BOMMaster from './masters/BOMMaster';
import OpeningStockMaster from './masters/OpeningStockMaster';
import QualityMaster from '../../tabs/masters/QualityMaster';
import WidthMaster from '../../tabs/masters/WidthMaster';
import DesignMaster from '../../tabs/masters/DesignMaster';
import GradeMaster from '../../tabs/masters/GradeMaster';
import type { MasterCard as MasterCardType, OnboardingProgress, AuditLogEntry } from './types';
import './styles/OnboardingDashboard.scss';

interface OnboardingDashboardProps {
  onKPIClick?: (title: string, type: string, data: any) => void;
  onActionClick?: (title: string, type: string, data?: any) => void;
}

const OnboardingDashboard: React.FC<OnboardingDashboardProps> = ({
  onKPIClick,
  onActionClick,
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<string>('');
  const [masterDetailOpen, setMasterDetailOpen] = useState(false);
  const [currentMasterView, setCurrentMasterView] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('masters');
  const [bomUploadOpen, setBomUploadOpen] = useState(false);

  // Audit logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      user: 'admin@company.com',
      action: 'import',
      masterType: 'Fabric',
      recordCount: 156,
      status: 'success',
      successCount: 156,
      errorCount: 0,
    },
    {
      id: '2',
      timestamp: new Date().toISOString(),
      user: 'admin@company.com',
      action: 'import',
      masterType: 'Shade',
      recordCount: 89,
      status: 'success',
      successCount: 89,
      errorCount: 0,
    },
  ]);

  // Mock master data with dependencies and mandatory flags
  const [masters, setMasters] = useState<MasterCardType[]>([
    {
      id: 'uom',
      title: 'UOM Master',
      description: 'Units of measurement and conversion factors',
      icon: <AppstoreOutlined />,
      status: 'completed',
      recordCount: 12,
      excelTemplate: 'uom_template.xlsx',
      color: 'var(--color-fa8c16)',
      isMandatory: true,
      dependencies: [],
    },
    {
      id: 'shade',
      title: 'Shade Master',
      description: 'Color codes and shade groups for fabric and garments',
      icon: <BgColorsOutlined />,
      status: 'completed',
      recordCount: 89,
      excelTemplate: 'shade_template.xlsx',
      color: 'var(--color-722ed1)',
      isMandatory: true,
      dependencies: [],
    },
    {
      id: 'category',
      title: 'Material Category',
      description: 'Organize materials into fabric, trim, accessory categories',
      icon: <AppstoreOutlined />,
      status: 'completed',
      recordCount: 8,
      excelTemplate: 'category_template.xlsx',
      color: 'var(--color-2f54eb)',
      isMandatory: true,
      dependencies: [],
    },
    {
      id: 'warehouse',
      title: 'Warehouse / Zone',
      description: 'Storage locations, zones, and bin management',
      icon: <HomeOutlined />,
      status: 'in-progress',
      recordCount: 20,
      excelTemplate: 'warehouse_template.xlsx',
      color: 'var(--color-13c2c2)',
      isMandatory: true,
      dependencies: [],
    },
    {
      id: 'supplier',
      title: 'Supplier Master',
      description: 'Fabric suppliers, trim vendors, and job work partners',
      icon: <TeamOutlined />,
      status: 'in-progress',
      recordCount: 28,
      excelTemplate: 'supplier_template.xlsx',
      color: 'var(--color-eb2f96)',
      isMandatory: false,
      dependencies: [],
    },
    {
      id: 'process',
      title: 'Process / Operation',
      description: 'Cutting, stitching, washing, finishing, and job work operations',
      icon: <SettingOutlined />,
      status: 'completed',
      recordCount: 18,
      excelTemplate: 'process_template.xlsx',
      color: 'var(--color-faad14)',
      isMandatory: false,
      dependencies: [],
    },
    {
      id: 'width',
      title: 'Width Master',
      description: 'Standard width options with unit conversion support',
      icon: <AppstoreOutlined />,
      status: 'in-progress',
      recordCount: 4,
      excelTemplate: 'width_template.xlsx',
      color: 'var(--color-2f54eb)',
      isMandatory: false,
      dependencies: [],
    },
    {
      id: 'grade',
      title: 'Grade Master',
      description: 'Quality grading rules with acceptance percentage',
      icon: <CheckCircleOutlined />,
      status: 'in-progress',
      recordCount: 3,
      excelTemplate: 'grade_template.xlsx',
      color: 'var(--color-52c41a)',
      isMandatory: false,
      dependencies: [],
    },
    {
      id: 'quality',
      title: 'Quality Master',
      description: 'Fabric quality definitions with GSM, blends, and widths',
      icon: <FileTextOutlined />,
      status: 'in-progress',
      recordCount: 6,
      excelTemplate: 'quality_template.xlsx',
      color: 'var(--color-1890ff)',
      isMandatory: false,
      dependencies: ['width', 'uom'],
    },
    {
      id: 'fabric',
      title: 'Fabric Master',
      description: 'Setup fabric types, construction, GSM, shrinkage, and shade groups',
      icon: <BgColorsOutlined />,
      status: 'completed',
      recordCount: 156,
      excelTemplate: 'fabric_template.xlsx',
      color: 'var(--color-1890ff)',
      isMandatory: true,
      dependencies: ['uom', 'shade', 'category'],
    },
    {
      id: 'design',
      title: 'Design Master',
      description: 'Design libraries with repeats, palettes, and seasons',
      icon: <BgColorsOutlined />,
      status: 'in-progress',
      recordCount: 5,
      excelTemplate: 'design_template.xlsx',
      color: 'var(--color-722ed1)',
      isMandatory: false,
      dependencies: [],
    },
    {
      id: 'trim',
      title: 'Trim & Accessories',
      description: 'Buttons, zippers, labels, threads, and packaging materials',
      icon: <TagsOutlined />,
      status: 'in-progress',
      recordCount: 45,
      excelTemplate: 'trim_template.xlsx',
      color: 'var(--color-52c41a)',
      isMandatory: true,
      dependencies: ['uom', 'supplier', 'category'],
    },
    {
      id: 'bom',
      title: 'BOM / Design Card',
      description: 'Style-wise bill of materials and design specifications',
      icon: <FileProtectOutlined />,
      status: 'in-progress',
      recordCount: 3,
      excelTemplate: 'bom_template.xlsx',
      color: 'var(--color-f5222d)',
      isMandatory: false,
      dependencies: ['fabric', 'trim', 'process'],
    },
    {
      id: 'opening-stock',
      title: 'Opening Stock',
      description: 'Import initial inventory balances for fabric, trim, and materials',
      icon: <InboxOutlined />,
      status: 'in-progress',
      recordCount: 50,
      excelTemplate: 'opening_stock_template.xlsx',
      color: 'var(--color-13c2c2)',
      isMandatory: false,
      dependencies: ['fabric', 'trim', 'warehouse', 'uom', 'shade'],
    },
  ]);

  // Calculate progress with mandatory tracking
  const mandatoryMasters = masters.filter(m => m.isMandatory);
  const mandatoryCompleted = mandatoryMasters.filter(m => m.status === 'completed').length;
  const canGoLive = mandatoryCompleted === mandatoryMasters.length;

  const progress: OnboardingProgress = {
    totalMasters: masters.length,
    completedMasters: masters.filter(m => m.status === 'completed').length,
    inProgressMasters: masters.filter(m => m.status === 'in-progress').length,
    totalRecords: masters.reduce((sum, m) => sum + m.recordCount, 0),
    mandatoryCompleted,
    mandatoryTotal: mandatoryMasters.length,
    canGoLive,
  };

  const completionPercent = Math.round((progress.completedMasters / progress.totalMasters) * 100);
  const mandatoryPercent = Math.round((mandatoryCompleted / mandatoryMasters.length) * 100);
  // Visual percentages for other KPI cards
  const recordsTarget = 1000; // adjustable visual target for records
  const totalRecordsPercent = Math.min(100, Math.round((progress.totalRecords / recordsTarget) * 100));
  const importTarget = 20; // adjustable visual target for number of imports
  const importHistoryPercent = Math.min(100, Math.round((auditLogs.length / importTarget) * 100));

  // System fields for each master (for column mapping)
  const getMasterFields = (masterId: string) => {
    const fieldsMap: Record<string, any[]> = {
      fabric: [
        { field: 'fabricCode', label: 'Fabric Code', required: false, synonyms: ['code', 'fabric_code', 'item_code'] },
        { field: 'type', label: 'Type', required: true, synonyms: ['fabric_type', 'category'] },
        { field: 'construction', label: 'Construction', required: true, synonyms: ['construction_type'] },
        { field: 'composition', label: 'Composition', required: true, synonyms: ['material', 'content'] },
        { field: 'gsm', label: 'GSM', required: true, synonyms: ['weight', 'fabric_weight'] },
        { field: 'widthM', label: 'Width (M)', required: true, synonyms: ['width', 'fabric_width'] },
        { field: 'shrinkagePercent', label: 'Shrinkage %', required: false, synonyms: ['shrinkage', 'shrink_percent'] },
        { field: 'defaultUOM', label: 'Default UOM', required: true, synonyms: ['uom', 'unit'] },
        { field: 'shadeGroup', label: 'Shade Group', required: false, synonyms: ['shade', 'color_group'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      trim: [
        { field: 'itemCode', label: 'Item Code', required: false, synonyms: ['code', 'trim_code'] },
        { field: 'itemName', label: 'Item Name', required: true, synonyms: ['name', 'trim_name', 'description'] },
        { field: 'category', label: 'Category', required: true, synonyms: ['type', 'item_category'] },
        { field: 'supplier', label: 'Supplier', required: false, synonyms: ['vendor', 'supplier_name'] },
        { field: 'defaultUOM', label: 'Default UOM', required: true, synonyms: ['uom', 'unit'] },
        { field: 'minStock', label: 'Min Stock', required: false, synonyms: ['minimum_stock', 'min_qty'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      uom: [
        { field: 'uomCode', label: 'UOM Code', required: false, synonyms: ['code', 'unit_code'] },
        { field: 'uomName', label: 'UOM Name', required: true, synonyms: ['name', 'unit_name', 'unit'] },
        { field: 'conversionBase', label: 'Conversion Base', required: false, synonyms: ['base_unit', 'conversion'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      shade: [
        { field: 'shadeCode', label: 'Shade Code', required: false, synonyms: ['code', 'color_code'] },
        { field: 'shadeName', label: 'Shade Name', required: true, synonyms: ['name', 'color', 'color_name'] },
        { field: 'shadeGroup', label: 'Shade Group', required: false, synonyms: ['group', 'color_group'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      warehouse: [
        { field: 'zoneCode', label: 'Zone Code', required: false, synonyms: ['code', 'warehouse_code', 'location_code'] },
        { field: 'zoneName', label: 'Zone Name', required: true, synonyms: ['name', 'warehouse_name', 'location'] },
        { field: 'description', label: 'Description', required: false, synonyms: ['desc', 'details'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      supplier: [
        { field: 'supplierCode', label: 'Supplier Code', required: false, synonyms: ['code', 'vendor_code'] },
        { field: 'supplierName', label: 'Supplier Name', required: true, synonyms: ['name', 'vendor_name', 'company'] },
        { field: 'contactPerson', label: 'Contact Person', required: false, synonyms: ['contact', 'person'] },
        { field: 'phone', label: 'Phone', required: false, synonyms: ['mobile', 'contact_no', 'telephone'] },
        { field: 'email', label: 'Email', required: false, synonyms: ['email_id', 'mail'] },
        { field: 'gstNumber', label: 'GST Number', required: false, synonyms: ['gst', 'gstin', 'tax_id'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      process: [
        { field: 'processCode', label: 'Process Code', required: false, synonyms: ['code', 'operation_code'] },
        { field: 'processName', label: 'Process Name', required: true, synonyms: ['name', 'operation', 'process'] },
        { field: 'isJobWork', label: 'Is Job Work', required: true, synonyms: ['jobwork', 'outsourced'] },
        { field: 'expectedLossPercent', label: 'Expected Loss %', required: false, synonyms: ['loss', 'loss_percent'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      category: [
        { field: 'categoryCode', label: 'Category Code', required: false, synonyms: ['code'] },
        { field: 'categoryName', label: 'Category Name', required: true, synonyms: ['name', 'category'] },
        { field: 'description', label: 'Description', required: false, synonyms: ['desc', 'details'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      'opening-stock': [
        { field: 'materialCode', label: 'Material Code', required: true, synonyms: ['item_code', 'code'] },
        { field: 'materialName', label: 'Material Name', required: true, synonyms: ['item_name', 'name'] },
        { field: 'lotNumber', label: 'Lot Number', required: false, synonyms: ['lot', 'batch'] },
        { field: 'shadeCode', label: 'Shade Code', required: false, synonyms: ['shade', 'color'] },
        { field: 'warehouseCode', label: 'Warehouse', required: true, synonyms: ['warehouse', 'location'] },
        { field: 'zoneCode', label: 'Zone', required: false, synonyms: ['zone', 'bin'] },
        { field: 'quantity', label: 'Quantity', required: true, synonyms: ['qty', 'stock'] },
        { field: 'uom', label: 'UOM', required: true, synonyms: ['unit'] },
        { field: 'rate', label: 'Rate', required: false, synonyms: ['price', 'cost'] },
        { field: 'value', label: 'Value', required: false, synonyms: ['amount', 'total'] },
      ],
      quality: [
        { field: 'qualityCode', label: 'Quality Code', required: false, synonyms: ['code', 'quality_code'] },
        { field: 'qualityName', label: 'Quality Name', required: true, synonyms: ['name', 'quality'] },
        { field: 'fabricType', label: 'Fabric Type', required: true, synonyms: ['type', 'fabric_type'] },
        { field: 'gsm', label: 'GSM', required: true, synonyms: ['weight', 'fabric_weight'] },
        { field: 'defaultWidthLabel', label: 'Default Width', required: true, synonyms: ['width', 'width_label'] },
        { field: 'defaultWidthUnit', label: 'Width Unit', required: false, synonyms: ['width_unit', 'unit'] },
        { field: 'defaultWidthMeters', label: 'Width (M)', required: false, synonyms: ['width_m', 'width_meter'] },
        { field: 'uom', label: 'UOM', required: true, synonyms: ['unit', 'default_uom'] },
        { field: 'warp', label: 'Warp', required: false, synonyms: ['warp_yarn'] },
        { field: 'weft', label: 'Weft', required: false, synonyms: ['weft_yarn'] },
        { field: 'construction', label: 'Construction', required: false, synonyms: ['construction_type'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      width: [
        { field: 'widthLabel', label: 'Width Label', required: true, synonyms: ['width', 'label'] },
        { field: 'unit', label: 'Unit', required: true, synonyms: ['unit', 'width_unit'] },
        { field: 'meters', label: 'Converted Meter', required: false, synonyms: ['meters', 'width_m'] },
        { field: 'description', label: 'Description', required: false, synonyms: ['desc', 'details'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      design: [
        { field: 'designCode', label: 'Design Code', required: false, synonyms: ['code', 'design_code'] },
        { field: 'designName', label: 'Design Name', required: true, synonyms: ['name', 'design'] },
        { field: 'repeatSize', label: 'Repeat Size', required: false, synonyms: ['repeat', 'size'] },
        { field: 'colorPalette', label: 'Color Palette', required: false, synonyms: ['colors', 'palette'] },
        { field: 'season', label: 'Season', required: false, synonyms: ['season_name'] },
        { field: 'buyer', label: 'Buyer', required: false, synonyms: ['customer'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
      grade: [
        { field: 'grade', label: 'Grade', required: true, synonyms: ['grade_name'] },
        { field: 'description', label: 'Description', required: false, synonyms: ['desc', 'details'] },
        { field: 'acceptancePercent', label: 'Acceptance %', required: false, synonyms: ['acceptance', 'acceptance_percent'] },
        { field: 'status', label: 'Status', required: false, synonyms: ['active_status', 'is_active'] },
      ],
    };
    return fieldsMap[masterId] || [];
  };

  const handleAddSingle = (masterId: string) => {
    setCurrentMasterView(masterId);
    setMasterDetailOpen(true);
  };

  const handleUploadExcel = (masterId: string) => {
    // Check if BOM - use special component
    if (masterId === 'bom') {
      setBomUploadOpen(true);
      return;
    }

    // Check dependencies
    const master = masters.find(m => m.id === masterId);
    if (master?.dependencies && master.dependencies.length > 0) {
      const incompleteDeps = master.dependencies.filter(depId => {
        const depMaster = masters.find(m => m.id === depId);
        return depMaster?.status !== 'completed';
      });

      if (incompleteDeps.length > 0) {
        const depNames = incompleteDeps.map(depId => 
          masters.find(m => m.id === depId)?.title
        ).join(', ');
        message.error(`Please complete dependencies first: ${depNames}`);
        return;
      }
    }

    setSelectedMaster(masterId);
    setUploadModalOpen(true);
  };

  const handleDownloadTemplate = (masterId: string) => {
    const master = masters.find(m => m.id === masterId);
    message.success(`Downloading ${master?.excelTemplate}...`);
    // In real implementation, trigger file download
  };

  const handlePublish = (data: any[]) => {
    // Update master status
    const updatedMasters = masters.map(m => {
      if (m.id === selectedMaster) {
        return {
          ...m,
          status: 'completed' as const,
          recordCount: m.recordCount + data.length,
        };
      }
      return m;
    });
    setMasters(updatedMasters);

    // Add to audit log
    const newLog: AuditLogEntry = {
      id: `${auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: 'admin@company.com',
      action: 'import',
      masterType: selectedMasterData?.title || '',
      recordCount: data.length,
      status: 'success',
      successCount: data.length,
      errorCount: 0,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleBOMPublish = (header: any, lines: any[]) => {
    const updatedMasters = masters.map(m => {
      if (m.id === 'bom') {
        return {
          ...m,
          status: 'completed' as const,
          recordCount: m.recordCount + 1,
        };
      }
      return m;
    });
    setMasters(updatedMasters);

    // Add to audit log
    const newLog: AuditLogEntry = {
      id: `${auditLogs.length + 1}`,
      timestamp: new Date().toISOString(),
      user: 'admin@company.com',
      action: 'import',
      masterType: 'BOM',
      recordCount: lines.length,
      status: 'success',
      successCount: lines.length,
      errorCount: 0,
    };
    setAuditLogs([newLog, ...auditLogs]);
    setBomUploadOpen(false);
  };

  const handleStartLive = () => {
    if (!canGoLive) {
      Modal.warning({
        title: 'Mandatory Masters Incomplete',
        content: (
          <div>
            <p>Please complete all mandatory masters before going live:</p>
            <ul>
              {mandatoryMasters
                .filter(m => m.status !== 'completed')
                .map(m => (
                  <li key={m.id}>{m.title}</li>
                ))}
            </ul>
          </div>
        ),
      });
      return;
    }

    Modal.confirm({
      title: 'Start Using ERP?',
      icon: <RocketOutlined />,
      content: (
        <div>
          <p>You're about to start using the ERP with:</p>
          <ul>
            <li><strong>{progress.totalRecords}</strong> master records</li>
            <li><strong>{progress.completedMasters}/{progress.totalMasters}</strong> masters completed</li>
            <li><strong>{mandatoryCompleted}/{mandatoryMasters.length}</strong> mandatory masters completed</li>
          </ul>
          <Alert
            message="You can continue adding data anytime!"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        </div>
      ),
      okText: 'Yes, Start Live!',
      okType: 'primary',
      onOk: () => {
        message.success('🎉 ERP is now LIVE! You can start creating GRNs and transactions.');
      },
    });
  };

  const handleStartWithZeroStock = () => {
    Modal.confirm({
      title: 'Start with Zero Stock?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>This will skip opening stock import and start with zero inventory.</p>
          <Alert
            message="Warning"
            description="You won't be able to import opening stock later. All stock will be built through GRNs."
            type="warning"
            showIcon
            style={{ marginTop: 12 }}
          />
          <p style={{ marginTop: 12 }}>Are you sure?</p>
        </div>
      ),
      okText: 'Yes, Start with Zero',
      okType: 'danger',
      onOk: () => {
        message.success('Starting ERP with zero stock. You can now create GRNs!');
      },
    });
  };

  const selectedMasterData = masters.find(m => m.id === selectedMaster);

  const tabItems = [
    {
      key: 'masters',
      label: (
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          <AppstoreOutlined /> Master Setup
        </span>
      ),
      children: (
        <div style={{ padding: '8px 0' }}>
          {/* Master Cards Grid */}
          <Row gutter={[16, 16]}>
            {masters.map(master => (
              <Col key={master.id} xs={24} sm={12} md={8} lg={6}>
                <MasterCard
                  master={master}
                  onAddSingle={() => handleAddSingle(master.id)}
                  onUploadExcel={() => handleUploadExcel(master.id)}
                  onDownloadTemplate={() => handleDownloadTemplate(master.id)}
                  onClick={() => {
                    setCurrentMasterView(master.id);
                    setMasterDetailOpen(true);
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>
      ),
    },
    {
      key: 'audit',
      label: (
        <span style={{ fontSize: 14, fontWeight: 500 }}>
          <HistoryOutlined /> Audit Log ({auditLogs.length})
        </span>
      ),
      children: <AuditLogViewer logs={auditLogs} />,
    },
  ];

  return (
    <div className="onboarding-dashboard">
      {/* Progress Overview - Beautiful Light Shade Banner */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24}>
          <Card
            style={{
              background: 'linear-gradient(135deg, var(--color-f0f5ff) 0%, var(--color-e6f7ff) 50%, var(--color-f9f0ff) 100%)',
              borderRadius: 12,
              border: '1px solid var(--color-e8e8e8)',
              overflow: 'hidden',
              position: 'relative' as const,
            }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            {/* Decorative Background Pattern */}
            <div style={{
              position: 'absolute' as const,
              top: -40,
              right: -40,
              width: 150,
              height: 150,
              background: 'radial-gradient(circle, rgba(24,144,255,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
            <div style={{
              position: 'absolute' as const,
              bottom: -20,
              left: -20,
              width: 100,
              height: 100,
              background: 'radial-gradient(circle, rgba(114,46,209,0.06) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />

            <div style={{ position: 'relative' as const, zIndex: 1 }}>
              <Row gutter={[16, 12]} align="middle">
                <Col xs={24} md={14}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, var(--color-1890ff) 0%, var(--color-722ed1) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <RocketOutlined style={{ fontSize: 20, color: 'var(--color-ffffff)' }} />
                      </div>
                      <div>
                        <h2 style={{ 
                          margin: 0, 
                          fontSize: 22, 
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, var(--color-1890ff) 0%, var(--color-722ed1) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                          Welcome to Textile ERP Onboarding
                        </h2>
                      </div>
                    </div>
                    <p style={{ 
                      color: 'var(--color-595959)', 
                      fontSize: 14, 
                      marginTop: 6, 
                      marginBottom: 12,
                      fontWeight: 500,
                      lineHeight: 1.5,
                    }}>
                      Setup your masters with Excel. Start working in <strong style={{ color: 'var(--color-1890ff)' }}>hours, not days</strong>.
                    </p>
                    {!canGoLive ? (
                      <div style={{
                        background: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid var(--color-ffc107)',
                        borderRadius: 6,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <ExclamationCircleOutlined style={{ color: 'var(--color-ffc107)', fontSize: 16 }} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-faad14)', fontSize: 13 }}>
                            {mandatoryCompleted}/{mandatoryMasters.length} Mandatory Masters Completed
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--color-8c8c8c)', marginTop: 2 }}>
                            Complete {mandatoryMasters.length - mandatoryCompleted} more to go live
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(82, 196, 26, 0.1)',
                        border: '1px solid var(--color-52c41a)',
                        borderRadius: 6,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <CheckCircleOutlined style={{ color: 'var(--color-52c41a)', fontSize: 16 }} />
                        <div style={{ fontWeight: 600, color: 'var(--color-52c41a)', fontSize: 13 }}>
                          All mandatory masters completed! Ready to go live 🎉
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
                <Col xs={24} md={10}>
                  <div style={{ textAlign: 'right' }}>
                    <Space size={8} style={{ justifyContent: 'flex-end' }}>
                      <Button
                        type="primary"
                        icon={<RocketOutlined />}
                        onClick={handleStartLive}
                        disabled={!canGoLive}
                        style={{
                          background: canGoLive 
                            ? 'linear-gradient(135deg, var(--color-1890ff) 0%, var(--color-722ed1) 100%)' 
                            : 'rgba(0,0,0,0.05)',
                          borderColor: 'transparent',
                          color: canGoLive ? 'var(--color-ffffff)' : 'rgba(0,0,0,0.25)',
                          minWidth: 160,
                          height: 36,
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        Start Using ERP Now
                      </Button>
                      <Button
                        onClick={handleStartWithZeroStock}
                        style={{
                          background: 'transparent',
                          color: 'var(--color-595959)',
                          border: '1px solid var(--color-d9d9d9)',
                          minWidth: 140,
                          height: 36,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        Start with Zero Stock
                      </Button>
                    </Space>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>

      {/* KPI Cards - Minimal Design */}
      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid var(--color-e8e8e8)',
              background: 'linear-gradient(135deg, var(--color-ffffff) 0%, var(--color-f0f5ff) 100%)',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-8c8c8c)' }}>Overall Progress</span>}
              value={completionPercent}
              suffix="%"
              valueStyle={{ color: 'var(--color-1890ff)', fontSize: 28, fontWeight: 700 }}
              prefix={<CheckCircleOutlined />}
            />
            <Progress
              percent={completionPercent}
              strokeColor={{
                '0%': 'var(--color-1890ff)',
                '100%': 'var(--color-36cfc9)',
              }}
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={6}
            />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-595959)', fontWeight: 500 }}>
              {progress.completedMasters}/{progress.totalMasters} masters done
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid var(--color-e8e8e8)',
              background: canGoLive 
                ? 'linear-gradient(135deg, var(--color-ffffff) 0%, var(--color-f6ffed) 100%)'
                : 'linear-gradient(135deg, var(--color-ffffff) 0%, var(--color-fff7e6) 100%)',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-8c8c8c)' }}>Mandatory Progress</span>}
              value={mandatoryPercent}
              suffix="%"
              valueStyle={{ 
                color: canGoLive ? 'var(--color-52c41a)' : 'var(--color-faad14)', 
                fontSize: 28, 
                fontWeight: 700 
              }}
              prefix={canGoLive ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
            />
            <Progress
              percent={mandatoryPercent}
              strokeColor={canGoLive ? 'var(--color-52c41a)' : 'var(--color-faad14)'}
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={6}
            />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-595959)', fontWeight: 500 }}>
              {mandatoryCompleted}/{mandatoryMasters.length} required masters
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid var(--color-e8e8e8)',
              background: 'linear-gradient(135deg, var(--color-ffffff) 0%, var(--color-f9f0ff) 100%)',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-8c8c8c)' }}>Total Records</span>}
              value={totalRecordsPercent}
              suffix="%"
              valueStyle={{ color: 'var(--color-722ed1)', fontSize: 28, fontWeight: 700 }}
              prefix={<FileTextOutlined />}
            />
            <Progress
              percent={totalRecordsPercent}
              strokeColor={{ '0%': 'var(--color-722ed1)', '100%': 'var(--color-9254de)' }}
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={6}
            />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-595959)', fontWeight: 500 }}>
              {progress.totalRecords} records (visual target {recordsTarget})
            </div>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card
            style={{
              borderRadius: 8,
              border: '1px solid var(--color-e8e8e8)',
              background: 'linear-gradient(135deg, var(--color-ffffff) 0%, var(--color-e6fffb) 100%)',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Statistic
              title={<span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-8c8c8c)' }}>Import History</span>}
              value={importHistoryPercent}
              suffix="%"
              valueStyle={{ color: 'var(--color-13c2c2)', fontSize: 28, fontWeight: 700 }}
              prefix={<HistoryOutlined />}
            />
            <Progress
              percent={importHistoryPercent}
              strokeColor={{ '0%': 'var(--color-13c2c2)', '100%': 'var(--color-36cfc9)' }}
              showInfo={false}
              style={{ marginTop: 8 }}
              strokeWidth={6}
            />
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--color-595959)', fontWeight: 500 }}>
              {auditLogs.length} imports (visual target {importTarget})
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Masters and Audit Log */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems}
        style={{
          marginTop: 16,
          background: 'transparent',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      />

      {/* Enhanced Excel Upload Modal */}
      <EnhancedExcelUploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        masterName={selectedMasterData?.title || ''}
        masterId={selectedMaster}
        systemFields={getMasterFields(selectedMaster)}
        completedMasters={masters.filter(m => m.status === 'completed').map(m => m.id)}
        onPublish={handlePublish}
      />

      {/* BOM Special Upload Modal */}
      <Modal
        title="BOM Upload - Header & Lines"
        open={bomUploadOpen}
        onCancel={() => setBomUploadOpen(false)}
        width={1200}
        footer={null}
        destroyOnClose
      >
        <BOMUploadComponent onComplete={handleBOMPublish} />
      </Modal>

      {/* Master Detail Modal */}
      <Modal
        title={masters.find(m => m.id === currentMasterView)?.title}
        open={masterDetailOpen}
        onCancel={() => setMasterDetailOpen(false)}
        width={1200}
        footer={null}
        destroyOnClose
      >
        {currentMasterView === 'fabric' && <FabricMaster />}
        {currentMasterView === 'trim' && <TrimAccessoriesMaster />}
        {currentMasterView === 'shade' && <ShadeMaster />}
        {currentMasterView === 'uom' && <UOMMaster />}
        {currentMasterView === 'warehouse' && <WarehouseZoneMaster />}
        {currentMasterView === 'supplier' && <SupplierMaster />}
        {currentMasterView === 'process' && <ProcessOperationMaster />}
        {currentMasterView === 'category' && <MaterialCategoryMaster />}
        {currentMasterView === 'bom' && <BOMMaster />}
        {currentMasterView === 'opening-stock' && <OpeningStockMaster />}
        {currentMasterView === 'quality' && <QualityMaster />}
        {currentMasterView === 'width' && <WidthMaster />}
        {currentMasterView === 'design' && <DesignMaster />}
        {currentMasterView === 'grade' && <GradeMaster />}
      </Modal>
    </div>
  );
};

export default OnboardingDashboard;
