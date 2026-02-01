"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
  Segmented,
  Switch,
  message,
} from "antd";
import {
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { DesignMaster } from "../../types";
import InventoryDrawer from "../../components/InventoryDrawer";

const { Text } = Typography;

const sampleDesigns: DesignMaster[] = [
  {
    id: "1",
    designCode: "DSN-001",
    designName: "Floral Repeat",
    repeatSize: "5cm x 5cm",
    colorPalette: ["Red", "Green", "Yellow"],
    season: "Spring",
    buyer: "ABC Retail",
    imageUrl: "",
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "2",
    designCode: "DSN-045",
    designName: "Geometric Grid",
    repeatSize: "10cm x 10cm",
    colorPalette: ["Blue", "Navy", "White"],
    season: "Autumn",
    buyer: "XYZ Apparel",
    imageUrl: "",
    status: "inactive",
    createdAt: new Date(),
  },
];

type ViewMode = "table" | "card";

const DesignMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<DesignMaster[]>(sampleDesigns);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DesignMaster | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [isMobile, setIsMobile] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit" | "view">("add");
  const isViewMode = drawerMode === "view";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setViewMode("card");
    }
  }, [isMobile]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        item.designCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.designName.toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [data, searchText, statusFilter]);

  const handleAdd = () => {
    setEditingRecord(null);
    setDrawerMode("add");
    form.resetFields();
    form.setFieldsValue({ status: true, colorPalette: [] });
    setDrawerVisible(true);
  };

  const handleEdit = (record: DesignMaster) => {
    setEditingRecord(record);
    setDrawerMode("edit");
    form.resetFields();
    form.setFieldsValue({
      ...record,
      status: record.status === "active",
    });
    setDrawerVisible(true);
  };

  const handleView = (record: DesignMaster) => {
    setEditingRecord(record);
    setDrawerMode("view");
    form.resetFields();
    form.setFieldsValue({
      ...record,
      status: record.status === "active",
    });
    setDrawerVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: DesignMaster = {
        id: editingRecord?.id || Date.now().toString(),
        designCode: values.designCode || `DSN-${String(data.length + 1).padStart(3, "0")}`,
        designName: values.designName,
        repeatSize: values.repeatSize,
        colorPalette: values.colorPalette || [],
        season: values.season,
        buyer: values.buyer,
        imageUrl: values.imageUrl,
        status: values.status ? "active" : "inactive",
        createdAt: editingRecord?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      if (editingRecord) {
        setData(data.map((d) => (d.id === editingRecord.id ? payload : d)));
        message.success("Design updated");
      } else {
        setData([payload, ...data]);
        message.success("Design created");
      }
      setDrawerVisible(false);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Design Code",
      dataIndex: "designCode",
      key: "designCode",
      width: 130,
    },
    {
      title: "Design Name",
      dataIndex: "designName",
      key: "designName",
      width: 200,
    },
    {
      title: "Repeat Size",
      dataIndex: "repeatSize",
      key: "repeatSize",
      width: 150,
    },
    {
      title: "Color Palette",
      dataIndex: "colorPalette",
      key: "colorPalette",
      width: 200,
      render: (palette: string[]) => (
        <Space wrap>
          {(palette || []).map((c, idx) => (
            <Tag key={`${c}-${idx}`}>{c}</Tag>
          ))}
        </Space>
      ),
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
      render: (_: any, record: DesignMaster) => (
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
    <div className="design-master-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Design Master</span>
                <Space wrap>
                  <Segmented
                    value={viewMode}
                    onChange={(val) => setViewMode(val as ViewMode)}
                    disabled={isMobile}
                    options={[
                      { label: "Table", value: "table" },
                      { label: "Card", value: "card" },
                    ]}
                  />
                  <Input
                    placeholder="Search designs..."
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
                    Add Design
                  </Button>
                </Space>
              </Space>
            }
          >
            {isMobile || viewMode === "card" ? (
              <Row gutter={[12, 12]}>
                {filteredData.map((d) => (
                  <Col xs={12} sm={8} md={6} key={d.id}>
                    <Card
                      hoverable
                      size="small"
                      cover={<div style={{ height: 120, background: "var(--color-f5f5f5)" }} />}
                    >
                      <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        <Space style={{ justifyContent: "space-between", width: "100%" }}>
                          <Text strong>{d.designName}</Text>
                          <Badge status={d.status === "active" ? "success" : "default"} />
                        </Space>
                        <Text type="secondary">{d.designCode}</Text>
                        <Space wrap>
                          {(d.colorPalette || []).slice(0, 3).map((c, idx) => (
                            <Tag key={`${d.id}-c-${idx}`}>{c}</Tag>
                          ))}
                        </Space>
                        <Space>
                          <Tooltip title="View">
                            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleView(d)} />
                          </Tooltip>
                          <Tooltip title="Edit">
                            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(d)} />
                          </Tooltip>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
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
                  showTotal: (total) => `Total ${total} designs`,
                  responsive: true,
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
            ? "View Design"
            : editingRecord
            ? "Edit Design"
            : "Add Design"
        }
        width={typeof window !== "undefined" && window.innerWidth > 768 ? 720 : "100%"}
        footer={
          <div style={{ textAlign: "right", background: "var(--card-bg)", padding: 12 }}>
            {isViewMode ? (
              <Space>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setDrawerVisible(false);
                    form.resetFields();
                  }}
                >
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
          initialValues={{ status: true, colorPalette: [] }}
          disabled={isViewMode}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="designCode" label="Design Code">
                <Input placeholder="Auto or custom" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="designName"
                label="Design Name"
                rules={[{ required: true, message: "Please enter name" }]}
              >
                <Input placeholder="Design name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="repeatSize" label="Repeat Size">
                <Input placeholder="e.g., 5cm x 5cm" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="colorPalette" label="Color Palette">
                <Select mode="tags" placeholder="Add colors" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="season" label="Season">
                <Input placeholder="Season" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="buyer" label="Buyer">
                <Input placeholder="Buyer" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Design Image" name="imageUrl">
                <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} showUploadList>
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
        </Form>
      </InventoryDrawer>
    </div>
  );
};

export default DesignMasterScreen;
