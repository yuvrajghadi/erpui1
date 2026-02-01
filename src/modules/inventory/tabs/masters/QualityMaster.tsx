"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  Switch,
  message,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { BlendComponent, QualityMaster } from "../../types";
import { FABRIC_TYPE_OPTIONS, UOM_OPTIONS } from "../../constants";
import InventoryDrawer from "../../components/InventoryDrawer";

const { Text } = Typography;

const widthOptions = [
  { label: '44"', value: { label: '44"', unit: "inch", meters: 1.12 } },
  { label: '58"', value: { label: '58"', unit: "inch", meters: 1.47 } },
  { label: '60"', value: { label: '60"', unit: "inch", meters: 1.52 } },
  { label: "150 cm", value: { label: "150 cm", unit: "cm", meters: 1.5 } },
];

const sampleData: QualityMaster[] = [
  {
    id: "1",
    qualityCode: "QLT-WV-001",
    qualityName: "Cotton Poplin 40s",
    fabricType: "woven",
    gsm: 120,
    defaultWidthLabel: '58"',
    defaultWidthUnit: "inch",
    defaultWidthMeters: 1.47,
    uom: "meter",
    warp: "40s Cotton",
    weft: "40s Cotton",
    construction: "Plain Weave",
    status: "active",
    blend: [
      { fiber: "Cotton", percent: 100 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    qualityCode: "QLT-KN-014",
    qualityName: "CVC Single Jersey",
    fabricType: "knitted",
    gsm: 180,
    defaultWidthLabel: '60"',
    defaultWidthUnit: "inch",
    defaultWidthMeters: 1.52,
    uom: "kg",
    warp: "CVC",
    weft: "CVC",
    construction: "Single Jersey",
    status: "active",
    blend: [
      { fiber: "Cotton", percent: 60 },
      { fiber: "Polyester", percent: 40 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    qualityCode: "QLT-WV-021",
    qualityName: "Denim 3/1",
    fabricType: "woven",
    gsm: 320,
    defaultWidthLabel: '44"',
    defaultWidthUnit: "inch",
    defaultWidthMeters: 1.12,
    uom: "meter",
    warp: "Ring Spun Cotton",
    weft: "Open End Cotton",
    construction: "3/1 Twill",
    status: "inactive",
    blend: [
      { fiber: "Cotton", percent: 98 },
      { fiber: "Elastane", percent: 2 },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const QualityMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<QualityMaster[]>(sampleData);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<QualityMaster | null>(null);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit" | "view">("add");
  const [searchText, setSearchText] = useState("");
  const [fabricTypeFilter, setFabricTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [gsmMin, setGsmMin] = useState<number | null>(null);
  const [gsmMax, setGsmMax] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isViewMode = drawerMode === "view";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.qualityCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.qualityName.toLowerCase().includes(searchText.toLowerCase());
      const matchType = fabricTypeFilter ? item.fabricType === fabricTypeFilter : true;
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      const matchMin = gsmMin !== null ? item.gsm >= gsmMin : true;
      const matchMax = gsmMax !== null ? item.gsm <= gsmMax : true;
      return matchSearch && matchType && matchStatus && matchMin && matchMax;
    });
  }, [data, searchText, fabricTypeFilter, statusFilter, gsmMin, gsmMax]);

  const handleAdd = () => {
    setEditingRecord(null);
    setDrawerMode("add");
    const nextCode = `QLT-${String(data.length + 1).padStart(3, "0")}`;
    form.resetFields();
    form.setFieldsValue({
      qualityCode: nextCode,
      status: true,
      blend: [{ fiber: "Cotton", percent: 100 }],
    });
    setDrawerVisible(true);
  };

  const handleEdit = (record: QualityMaster) => {
    setEditingRecord(record);
    setDrawerMode("edit");
    form.resetFields();
    form.setFieldsValue({
      ...record,
      defaultWidth: {
        label: record.defaultWidthLabel,
        value: {
          label: record.defaultWidthLabel,
          unit: record.defaultWidthUnit,
          meters: record.defaultWidthMeters,
        },
      },
      status: record.status === "active",
    });
    setDrawerVisible(true);
  };

  const handleView = (record: QualityMaster) => {
    setEditingRecord(record);
    setDrawerMode("view");
    form.resetFields();
    form.setFieldsValue({
      ...record,
      defaultWidth: {
        label: record.defaultWidthLabel,
        value: {
          label: record.defaultWidthLabel,
          unit: record.defaultWidthUnit,
          meters: record.defaultWidthMeters,
        },
      },
      status: record.status === "active",
    });
    setDrawerVisible(true);
  };

  const blendTotal = (values?: BlendComponent[]) =>
    (values || []).reduce((sum, item) => sum + Number(item?.percent || 0), 0);

  const handleSubmit = async (values: any) => {
    const total = blendTotal(values.blend);
    if (total !== 100) {
      message.error("Blend composition must total 100%");
      return;
    }
    setLoading(true);
    try {
      const widthValue = values.defaultWidth?.value || values.defaultWidth;
      const statusValue = values.status ? "active" : "inactive";
      const payload: QualityMaster = {
        ...values,
        status: statusValue,
        defaultWidthLabel: widthValue?.label || values.defaultWidthLabel || '58"',
        defaultWidthUnit: widthValue?.unit || values.defaultWidthUnit || "inch",
        defaultWidthMeters: widthValue?.meters || values.defaultWidthMeters || 1.47,
      } as QualityMaster;
      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id ? { ...item, ...payload, updatedAt: new Date() } : item
          )
        );
        message.success("Quality updated");
      } else {
        const newRecord: QualityMaster = {
          ...payload,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setData([newRecord, ...data]);
        message.success("Quality created");
      }
      setDrawerVisible(false);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Quality Code",
      dataIndex: "qualityCode",
      key: "qualityCode",
      fixed: "left" as const,
      width: 130,
    },
    {
      title: "Quality Name",
      dataIndex: "qualityName",
      key: "qualityName",
      width: 200,
    },
    {
      title: "Fabric Type",
      dataIndex: "fabricType",
      key: "fabricType",
      width: 120,
      render: (type: string) => (
        <Tag color={type === "knitted" ? "blue" : "green"}>
          {type === "knitted" ? "Knit" : "Woven"}
        </Tag>
      ),
    },
    {
      title: "GSM",
      dataIndex: "gsm",
      key: "gsm",
      width: 90,
      render: (gsm: number) => <Tag color="cyan">{gsm}</Tag>,
    },
    {
      title: "Default Width",
      dataIndex: "defaultWidthLabel",
      key: "defaultWidthLabel",
      width: 120,
      render: (val: string) => <Tag color="geekblue">{val}</Tag>,
    },
    {
      title: "Blend Summary",
      dataIndex: "blend",
      key: "blend",
      width: 220,
      render: (blend: BlendComponent[]) =>
        blend
          .map((b) => `${b.fiber} ${b.percent}%`)
          .join(" / "),
    },
    {
      title: "UOM",
      dataIndex: "uom",
      key: "uom",
      width: 90,
      render: (uom: string) => uom.toUpperCase(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => (
        <Badge status={status === "active" ? "success" : "default"} text={status === "active" ? "Active" : "Inactive"} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      width: 110,
      render: (_: any, record: QualityMaster) => (
        <Space>
          <Tooltip title="View">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="quality-master-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Quality Master</span>
                <Space wrap>
                  <Input
                    placeholder="Search quality..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
                  />
                  <Select
                    placeholder="Fabric Type"
                    allowClear
                    style={{ width: 140 }}
                    options={FABRIC_TYPE_OPTIONS}
                    onChange={(value) => setFabricTypeFilter(value)}
                  />
                  <Select
                    placeholder="Status"
                    allowClear
                    style={{ width: 120 }}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                    onChange={(value) => setStatusFilter(value)}
                  />
                  <Space>
                    <InputNumber
                      placeholder="GSM Min"
                      min={0}
                      value={gsmMin ?? undefined}
                      onChange={(value) => setGsmMin(value ?? null)}
                      style={{ width: 110 }}
                    />
                    <InputNumber
                      placeholder="GSM Max"
                      min={0}
                      value={gsmMax ?? undefined}
                      onChange={(value) => setGsmMax(value ?? null)}
                      style={{ width: 110 }}
                    />
                  </Space>
                  <Button icon={<FilterOutlined />}>Filters</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Quality
                  </Button>
                </Space>
              </Space>
            }
          >
            {isMobile ? (
              <Space direction="vertical" style={{ width: "100%" }} size="middle">
                {filteredData.map((record) => (
                  <Card key={record.id} size="small">
                    <Space direction="vertical" style={{ width: "100%" }} size="small">
                      <Space style={{ justifyContent: "space-between", width: "100%" }}>
                        <Text strong>{record.qualityCode}</Text>
                        <Badge status={record.status === "active" ? "success" : "default"} text={record.status === "active" ? "Active" : "Inactive"} />
                      </Space>
                      <Text>{record.qualityName}</Text>
                      <Space wrap>
                        <Tag color={record.fabricType === "knitted" ? "blue" : "green"}>
                          {record.fabricType === "knitted" ? "Knit" : "Woven"}
                        </Tag>
                        <Tag color="cyan">{record.gsm} GSM</Tag>
                        <Tag color="geekblue">{record.defaultWidthLabel}</Tag>
                        <Tag>{record.uom.toUpperCase()}</Tag>
                      </Space>
                      <Text type="secondary">
                        {record.blend.map((b) => `${b.fiber} ${b.percent}%`).join(" / ")}
                      </Text>
                      <Space>
                        <Tooltip title="View">
                          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                        </Tooltip>
                        <Tooltip title="Edit">
                          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                        </Tooltip>
                      </Space>
                    </Space>
                  </Card>
                ))}
              </Space>
            ) : (
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
                loading={loading}
                scroll={{ x: "max-content" }}
                sticky
                pagination={{
                  total: filteredData.length,
                  pageSize: 20,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} qualities`,
                  responsive: true,
                }}
                expandable={{
                  expandedRowRender: (record) => (
                    <Descriptions size="small" column={2}>
                      <Descriptions.Item label="Warp">{record.warp || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Weft">{record.weft || "-"}</Descriptions.Item>
                      <Descriptions.Item label="Construction" span={2}>
                        {record.construction || "-"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Blend" span={2}>
                        <Space wrap>
                          {record.blend.map((b, index) => (
                            <Tag key={`${record.id}-${index}`}>{`${b.fiber} ${b.percent}%`}</Tag>
                          ))}
                        </Space>
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <InventoryDrawer
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        title={
          drawerMode === "view"
            ? "View Quality"
            : drawerMode === "edit"
            ? "Edit Quality"
            : "Add Quality"
        }
        width={typeof window !== "undefined" && window.innerWidth > 768 ? 720 : "100%"}
        footer={
          <div style={{ textAlign: "right", background: "var(--card-bg)", padding: 12 }}>
            {drawerMode === "view" ? (
              <Space>
                <Button icon={<CloseOutlined />} onClick={() => setDrawerVisible(false)}>
                  Close
                </Button>
              </Space>
            ) : (
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
                <Button type="primary" loading={loading} icon={<SaveOutlined />} onClick={() => form.submit()}>
                  {editingRecord ? "Update" : "Save"}
                </Button>
              </Space>
            )}
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: true, blend: [{ fiber: "Cotton", percent: 100 }] }}
          disabled={isViewMode}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="qualityCode" label="Quality Code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="qualityName"
                label="Quality Name"
                rules={[{ required: true, message: "Please enter quality name" }]}
              >
                <Input placeholder="e.g., Cotton Poplin 40s" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fabricType"
                label="Fabric Type"
                rules={[{ required: true, message: "Please select fabric type" }]}
              >
                <Select placeholder="Select fabric type" options={FABRIC_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="gsm"
                label="GSM"
                rules={[{ required: true, message: "Please enter GSM" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g., 180" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="defaultWidth"
                label="Default Width"
                rules={[{ required: true, message: "Please select width" }]}
              >
                <Select
                  placeholder="Select width"
                  options={widthOptions.map((opt) => ({ label: opt.label, value: opt.value }))}
                  labelInValue
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="uom"
                label="UOM"
                rules={[{ required: true, message: "Please select UOM" }]}
              >
                <Select placeholder="Select UOM" options={UOM_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="warp" label="Warp">
                <Input placeholder="e.g., 40s Cotton" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="weft" label="Weft">
                <Input placeholder="e.g., 40s Cotton" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="construction" label="Construction">
                <Input.TextArea rows={3} placeholder="Construction details" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Image Upload" name="imageUrl">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  showUploadList
                >
                  <UploadOutlined />
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="status" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Technical Composition</Divider>

          <Form.List name="blend">
            {(fields, { add, remove }) => (
              <Space direction="vertical" style={{ width: "100%" }} size="small">
                {fields.map((field) => (
                  <Row gutter={12} key={field.key} align="middle">
                    <Col xs={12} sm={10}>
                      <Form.Item
                        {...field}
                        name={[field.name, "fiber"]}
                        rules={[{ required: true, message: "Fiber type required" }]}
                      >
                        <Select
                          placeholder="Fiber Type"
                          options={[
                            { label: "Cotton", value: "Cotton" },
                            { label: "Polyester", value: "Polyester" },
                            { label: "Viscose", value: "Viscose" },
                            { label: "Nylon", value: "Nylon" },
                            { label: "Elastane", value: "Elastane" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, "percent"]}
                        rules={[{ required: true, message: "Percent required" }]}
                      >
                        <InputNumber min={0} max={100} style={{ width: "100%" }} placeholder="%" />
                      </Form.Item>
                    </Col>
                    <Col xs={4} sm={4}>
                      <Tooltip title="Remove">
                        <Button
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                          disabled={isViewMode}
                        />
                      </Tooltip>
                    </Col>
                  </Row>
                ))}
                <Button icon={<PlusOutlined />} onClick={() => add()} block disabled={isViewMode}>
                  Add Row
                </Button>
                <Form.Item shouldUpdate>
                  {() => {
                    const total = blendTotal(form.getFieldValue("blend"));
                    const isValid = total === 100;
                    return (
                      <Text type={isValid ? "success" : "danger"}>
                        Total Blend: {total}% {isValid ? "" : "(must be 100%)"}
                      </Text>
                    );
                  }}
                </Form.Item>
              </Space>
            )}
          </Form.List>
        </Form>
      </InventoryDrawer>
    </div>
  );
};

export default QualityMasterScreen;
