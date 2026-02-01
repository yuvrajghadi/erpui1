"use client";
import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Form,
  Row,
  Col,
  Select,
  InputNumber,
  Modal,
  Tag,
  Divider,
  message,
  Tooltip,
  Upload,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import type { FabricMaster } from "../../types";
import {
  FABRIC_TYPE_OPTIONS,
  CONSTRUCTION_OPTIONS,
  COMPOSITION_OPTIONS,
  UOM_OPTIONS,
  STATUS_OPTIONS,
} from "../../constants";
import { SAMPLE_FABRICS } from "../../data/sampleData";
import InventoryDrawer from "../../components/InventoryDrawer";
  import { generateSampleExcel } from '../../components/onboarding/utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';

const { Text } = Typography;

const FabricMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<FabricMaster[]>(SAMPLE_FABRICS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FabricMaster | null>(null);

  // Excel Upload Handler
  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const importedData: FabricMaster[] = jsonData.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        fabricCode: row['Fabric Code'] || `FAB-${String(data.length + index + 1).padStart(3, '0')}`,
        fabricType: row['Type'] || '',
        construction: row['Construction'] || '',
        composition: row['Composition'] || '',
        gsm: parseFloat(row['GSM']) || 0,
        width: parseFloat(row['Width (M)']) || 0,
        shrinkage: parseFloat(row['Shrinkage %']) || 0,
        defaultUOM: row['Default UOM'] || 'meter',
        shadeGroup: row['Shade Group'] || '',
        status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      setData([...data, ...importedData]);
      message.success(`${importedData.length} fabric records imported successfully`);
    } catch (error) {
      message.error('Failed to read Excel file');
      console.error(error);
    }
  };

  // Excel Sample Download Handler
  const handleDownloadSample = () => {
    generateSampleExcel('fabric');
    message.success('Sample Excel downloaded');
  };

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (record: FabricMaster) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Fabric",
      content: "Are you sure you want to delete this fabric?",
      onOk: () => {
        setData(data.filter((item) => item.id !== id));
        message.success("Fabric deleted successfully");
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id
              ? { ...item, ...values, updatedAt: new Date() }
              : item
          )
        );
        message.success("Fabric updated successfully");
      } else {
        const newFabric: FabricMaster = {
          ...values,
          id: Date.now().toString(),
          fabricCode: `FAB-${String(values.fabricType || "").toUpperCase().substring(0, 2)}-${String(data.length + 1).padStart(3, "0")}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as FabricMaster;
        setData([newFabric, ...data]);
        message.success("Fabric created successfully");
      }

      setDrawerVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Fabric Code",
      dataIndex: "fabricCode",
      key: "fabricCode",
      sorter: true,
      fixed: "left" as const,
      width: 130,
    },
    {
      title: "Type",
      dataIndex: "fabricType",
      key: "fabricType",
      width: 100,
      render: (type: string) => (
        <Tag color={type === "knitted" ? "blue" : "green"}>
          {String(type || "").charAt(0).toUpperCase() + String(type || "").slice(1)}
        </Tag>
      ),
    },
    {
      title: "Construction",
      dataIndex: "construction",
      key: "construction",
      width: 150,
    },
    {
      title: "Composition",
      dataIndex: "composition",
      key: "composition",
      width: 200,
    },
    {
      title: "GSM",
      dataIndex: "gsm",
      key: "gsm",
      width: 80,
      align: "right" as const,
      render: (gsm: number, record: FabricMaster) => (
        <span>
          {gsm} ±{record.gsmTolerance ?? 0}%
        </span>
      ),
    },
    {
      title: "Width (M)",
      dataIndex: "width",
      key: "width",
      width: 100,
      align: "right" as const,
      render: (width: number, record: FabricMaster) => (
        <span>
          {width} ±{record.widthTolerance ?? 0}%
        </span>
      ),
    },
    {
      title: "Shrinkage %",
      dataIndex: "shrinkage",
      key: "shrinkage",
      width: 100,
      align: "right" as const,
      render: (val: number) => (val ? `${val}%` : "-"),
    },
    {
      title: "Default UOM",
      dataIndex: "defaultUOM",
      key: "defaultUOM",
      width: 100,
      render: (uom: string) => String(uom || "").toUpperCase(),
    },
    {
      title: "Shade Group",
      dataIndex: "shadeGroup",
      key: "shadeGroup",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "active" ? "success" : "default"}>
          {String(status || "").charAt(0).toUpperCase() + String(status || "").slice(1)}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 100,
      render: (_: any, record: FabricMaster) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="fabric-master-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Fabric Master</span>
                <Space wrap>
                  <Input
                    placeholder="Search fabrics..."
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    allowClear
                  />
                  <Button icon={<ExportOutlined />}>Export</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Fabric
                  </Button>
                </Space>
              </Space>
            }
          >
            {/* Excel Upload/Download Section */}
            <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--page-bg)', borderRadius: 8 }}>
              <Space size="middle">
                <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={() => false}
                  onChange={(info) => { const file = info.file.originFileObj || info.file; if (file) handleFileSelect(file as File); }}>
                  <Button icon={<UploadOutlined />} size="large" style={{ minWidth: 160 }}>Upload Excel</Button>
                </Upload>
                <Button icon={<DownloadOutlined />} size="large" onClick={handleDownloadSample} style={{ minWidth: 180 }}>
                  Download Sample Excel
                </Button>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Download sample to understand the required format. Replace sample data with your actual factory data.
                </Text>
              </div>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              loading={loading}
              scroll={{ x: "max-content" }}
              pagination={{
                total: data.length,
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} fabrics`,
                responsive: true,
              }}
              rowClassName={(record) => {
                // Exception-first coloring: highlight issues, keep normal rows neutral
                if (record.status === "inactive") return "row-exception-inactive";
                return "";
              }}
            />
          </Card>
        </Col>
      </Row>

      <InventoryDrawer
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        title={editingRecord ? "Edit Fabric" : "Add New Fabric"}
        width={typeof window !== "undefined" && window.innerWidth > 768 ? 720 : "100%"}
        footer={
          <div style={{ textAlign: "right" }}>
            <Space>
              <Button
                icon={<CloseOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                loading={loading}
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
              >
                {editingRecord ? "Update" : "Create"}
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "active", gsmTolerance: 5, widthTolerance: 2 }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fabricType"
                label="Fabric Type"
                rules={[{ required: true, message: "Please select fabric type" }]}
              >
                <Select placeholder="Select type" options={FABRIC_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="construction"
                label="Construction"
                rules={[{ required: true, message: "Please select construction" }]}
              >
                <Select
                  placeholder="Select construction"
                  showSearch
                  options={CONSTRUCTION_OPTIONS.map((c) => ({ label: c, value: c }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="composition"
                label="Composition"
                rules={[{ required: true, message: "Please select composition" }]}
              >
                <Select
                  placeholder="Select composition"
                  showSearch
                  options={COMPOSITION_OPTIONS.map((c) => ({ label: c, value: c }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Technical Specifications</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="gsm"
                label="GSM"
                rules={[{ required: true, message: "Please enter GSM" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g., 180" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="gsmTolerance" label="GSM Tolerance (%)">
                <InputNumber min={0} max={20} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="width"
                label="Width (Meters)"
                rules={[{ required: true, message: "Please enter width" }]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: "100%" }}
                  placeholder="e.g., 1.8"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="widthTolerance" label="Width Tolerance (%)">
                <InputNumber min={0} max={10} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="shrinkage" label="Shrinkage (%)">
                <InputNumber min={0} max={20} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="defaultUOM"
                label="Default UOM"
                rules={[{ required: true, message: "Please select UOM" }]}
              >
                <Select placeholder="Select UOM" options={UOM_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="shadeGroup" label="Shade Group">
                <Input placeholder="e.g., SG-A" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: "Please select status" }]}
              >
                <Select placeholder="Select status" options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </InventoryDrawer>
    </div>
  );
};

export default FabricMasterScreen;
