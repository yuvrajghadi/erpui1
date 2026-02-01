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
import type { GradeMaster } from "../../types";
import InventoryDrawer from "../../components/InventoryDrawer";

const { Text } = Typography;

const sampleGrades: GradeMaster[] = [
  {
    id: "1",
    grade: "A",
    description: "Premium quality",
    acceptancePercent: 98,
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "2",
    grade: "B",
    description: "Standard quality",
    acceptancePercent: 92,
    status: "active",
    createdAt: new Date(),
  },
  {
    id: "3",
    grade: "C",
    description: "Commercial quality",
    acceptancePercent: 85,
    status: "inactive",
    createdAt: new Date(),
  },
];

const GradeMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<GradeMaster[]>(sampleGrades);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GradeMaster | null>(null);
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
      const matchSearch =
        item.grade.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.description || "").toLowerCase().includes(searchText.toLowerCase());
      const matchStatus = statusFilter ? item.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [data, searchText, statusFilter]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: true, grade: "A" });
    setDrawerVisible(true);
  };

  const handleEdit = (record: GradeMaster) => {
    setEditingRecord(record);
    form.resetFields();
    form.setFieldsValue({
      grade: record.grade,
      description: record.description,
      acceptancePercent: record.acceptancePercent,
      status: record.status === "active",
    });
    setDrawerVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload: GradeMaster = {
        id: editingRecord?.id || Date.now().toString(),
        grade: values.grade,
        description: values.description,
        acceptancePercent: values.acceptancePercent,
        status: values.status ? "active" : "inactive",
        createdAt: editingRecord?.createdAt || new Date(),
        updatedAt: new Date(),
      };
      if (editingRecord) {
        setData(data.map((item) => (item.id === editingRecord.id ? payload : item)));
        message.success("Grade updated");
      } else {
        setData([payload, ...data]);
        message.success("Grade created");
      }
      setDrawerVisible(false);
      form.resetFields();
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      width: 120,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 220,
    },
    {
      title: "Acceptance %",
      dataIndex: "acceptancePercent",
      key: "acceptancePercent",
      width: 140,
      render: (val: number) => `${val}%`,
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
      render: (_: any, record: GradeMaster) => (
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
                message.success("Grade deleted");
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="grade-master-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space wrap style={{ width: "100%", justifyContent: "space-between" }}>
                <span>Grade Master</span>
                <Space wrap>
                  <Input
                    placeholder="Search grades..."
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
                    Add Grade
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
                        <Text strong>{record.grade}</Text>
                        <Badge status={record.status === "active" ? "success" : "default"} text={record.status === "active" ? "Active" : "Inactive"} />
                      </Space>
                      <Text type="secondary">{record.description}</Text>
                      <Text>{record.acceptancePercent}% acceptance</Text>
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
                              message.success("Grade deleted");
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
                  showTotal: (total) => `Total ${total} grades`,
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
        title={editingRecord ? "Edit Grade" : "Add Grade"}
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
          initialValues={{ status: true, grade: "A" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="grade" label="Grade Name" rules={[{ required: true, message: "Select grade" }]}>
                <Select
                  options={[
                    { label: "A", value: "A" },
                    { label: "B", value: "B" },
                    { label: "C", value: "C" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="acceptancePercent"
                label="Acceptance Threshold (%)"
                rules={[{ required: true, message: "Enter acceptance %" }]}
              >
                <InputNumber min={0} max={100} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="description" label="Description">
                <Input placeholder="Description" />
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

export default GradeMasterScreen;
