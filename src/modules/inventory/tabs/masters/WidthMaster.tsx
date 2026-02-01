"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Switch,
  message,
} from "antd";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { WidthMaster } from "../../types";
import InventoryDrawer from "../../components/InventoryDrawer";

const { Text } = Typography;

const sampleWidths: WidthMaster[] = [
  {
    id: "1",
    widthLabel: '44"',
    unit: "inch",
    meters: 1.12,
    description: "Narrow woven width",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "2",
    widthLabel: '58"',
    unit: "inch",
    meters: 1.47,
    description: "Standard poplin width",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "3",
    widthLabel: "150 cm",
    unit: "cm",
    meters: 1.5,
    description: "Metric standard",
    status: "inactive",
    createdAt: new Date(),
  },
];

const calcMeters = (value?: number, unit?: string) => {
  if (!value || !unit) return 0;
  if (unit === "inch") return Number((value * 0.0254).toFixed(2));
  if (unit === "cm") return Number((value / 100).toFixed(2));
  return 0;
};

const WidthMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<WidthMaster[]>(sampleWidths);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WidthMaster | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.widthLabel.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [data, searchText, statusFilter]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: true, unit: "inch" });
    setDrawerVisible(true);
  };

  const handleEdit = (record: WidthMaster) => {
    setEditingRecord(record);
    form.resetFields();
    const numeric = Number(record.widthLabel.replace(/[^\d.]/g, ""));
    form.setFieldsValue({
      widthValue: numeric || 0,
      unit: record.unit,
      meters: record.meters,
      description: record.description,
      status: record.status === "active",
    });
    setDrawerVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const label = values.unit === "inch" ? `${values.widthValue}"` : `${values.widthValue} cm`;
      const meters = calcMeters(values.widthValue, values.unit);
      const payload: WidthMaster = {
        id: editingRecord?.id || Date.now().toString(),
        widthLabel: label,
        unit: values.unit,
        meters,
        description: values.description,
        status: values.status ? "active" : "inactive",
        createdAt: editingRecord?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      if (editingRecord) {
        setData(data.map((item) => (item.id === editingRecord.id ? payload : item)));
        message.success("Width updated");
      } else {
        setData([payload, ...data]);
        message.success("Width created");
      }
      setDrawerVisible(false);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Width Label",
      dataIndex: "widthLabel",
      key: "widthLabel",
      width: 140,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 100,
      render: (unit: string) => (unit === "inch" ? "Inch" : "CM"),
    },
    {
      title: "Converted Meter",
      dataIndex: "meters",
      key: "meters",
      width: 140,
      render: (meters: number) => `${meters} m`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Badge status={status === "active" ? "success" : "default"} text={status === "active" ? "Active" : "Inactive"} />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 110,
      render: (_: any, record: WidthMaster) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                setData(data.filter((item) => item.id !== record.id));
                message.success("Width deleted");
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="width-master-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Width Master</span>
                <Space wrap>
                  <Input
                    placeholder="Search width..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
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
                  <Button icon={<FilterOutlined />}>Filters</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Width
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
                        <Text strong>{record.widthLabel}</Text>
                        <Badge status={record.status === "active" ? "success" : "default"} text={record.status === "active" ? "Active" : "Inactive"} />
                      </Space>
                      <Text type="secondary">{record.unit === "inch" ? "Inch" : "CM"}</Text>
                      <Text>{record.meters} m</Text>
                      <Space>
                        <Tooltip title="Edit">
                          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            type="link"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setData(data.filter((item) => item.id !== record.id));
                              message.success("Width deleted");
                            }}
                          />
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
                  showTotal: (total) => `Total ${total} widths`,
                  responsive: true,
                }}
                size="small"
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
        title={editingRecord ? "Edit Width" : "Add Width"}
        width={typeof window !== "undefined" && window.innerWidth > 768 ? 720 : "100%"}
        footer={
          <div style={{ textAlign: "right", background: "var(--card-bg)", padding: 12 }}>
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
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: true, unit: "inch" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="widthValue"
                label="Width Label"
                rules={[{ required: true, message: "Please enter width" }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} placeholder="e.g., 58" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="unit"
                label="Unit"
                rules={[{ required: true, message: "Please select unit" }]}
              >
                <Select
                  placeholder="Unit"
                  options={[
                    { label: "Inch", value: "inch" },
                    { label: "CM", value: "cm" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Converted Meter" shouldUpdate>
                {() => {
                  const widthValue = form.getFieldValue("widthValue");
                  const unit = form.getFieldValue("unit");
                  const meters = calcMeters(widthValue, unit);
                  return <InputNumber style={{ width: "100%" }} value={meters} readOnly />;
                }}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="description" label="Description">
                <Input placeholder="Description" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="status" label="Status" valuePropName="checked">
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Text type="secondary">Inch to meter conversion: inch × 0.0254</Text>
            </Col>
          </Row>
        </Form>
      </InventoryDrawer>
    </div>
  );
};

export default WidthMasterScreen;
