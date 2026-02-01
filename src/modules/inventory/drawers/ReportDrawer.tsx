import React from 'react';
import { Form, Select, DatePicker, Radio, Checkbox, Row, Col, Divider, Card, Space } from 'antd';
import { FileTextOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined, TableOutlined } from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ReportDrawerProps {
  form?: any; // Optional form instance if controlled from parent
}

const ReportDrawer: React.FC<ReportDrawerProps> = ({ form }) => {
  return (
    <Form layout="vertical" form={form}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="reportType" label="Report Type" rules={[{ required: true, message: 'Please select report type' }]}>
            <Select placeholder="Select report type">
              <Option value="inventory">Inventory Status Report</Option>
              <Option value="movement">Inventory Movement Report</Option>
              <Option value="valuation">Inventory Valuation Report</Option>
              <Option value="aging">Inventory Aging Report</Option>
              <Option value="lowStock">Low Stock Report</Option>
              <Option value="transaction">Transaction History Report</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="dateRange" label="Date Range" rules={[{ required: true, message: 'Please select date range' }]}>
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="category" label="Category">
            <Select placeholder="Select category" mode="multiple" allowClear>
              <Option value="raw">Raw Materials</Option>
              <Option value="finished">Finished Goods</Option>
              <Option value="wip">Work in Progress</Option>
              <Option value="packaging">Packaging Materials</Option>
              <Option value="consumables">Consumables</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="location" label="Location">
            <Select placeholder="Select location" mode="multiple" allowClear>
              <Option value="main">Main Warehouse</Option>
              <Option value="production">Production Floor</Option>
              <Option value="dispatch">Dispatch Area</Option>
              <Option value="returns">Returns Department</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Report Options</Divider>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="groupBy" label="Group By">
            <Radio.Group>
              <Radio value="category">Category</Radio>
              <Radio value="location">Location</Radio>
              <Radio value="supplier">Supplier</Radio>
              <Radio value="none">No Grouping</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="sortBy" label="Sort By">
            <Select placeholder="Select sorting">
              <Option value="name_asc">Item Name (A-Z)</Option>
              <Option value="name_desc">Item Name (Z-A)</Option>
              <Option value="quantity_asc">Quantity (Low to High)</Option>
              <Option value="quantity_desc">Quantity (High to Low)</Option>
              <Option value="value_asc">Value (Low to High)</Option>
              <Option value="value_desc">Value (High to Low)</Option>
              <Option value="date_asc">Date (Oldest First)</Option>
              <Option value="date_desc">Date (Newest First)</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="includeFields" label="Include Fields">
            <Checkbox.Group style={{ width: '100%' }}>
              <Row gutter={[8, 8]}>
                <Col span={8}>
                  <Checkbox value="itemCode">Item Code</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="itemName">Item Name</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="category">Category</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="quantity">Quantity</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="unit">Unit</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="unitPrice">Unit Price</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="totalValue">Total Value</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="location">Location</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="supplier">Supplier</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="lastUpdated">Last Updated</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="minStock">Min Stock Level</Checkbox>
                </Col>
                <Col span={8}>
                  <Checkbox value="status">Status</Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Output Format</Divider>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="outputFormat" label="Select Output Format">
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="pdf">
                  <Space>
                    <FileTextOutlined /> PDF Document
                  </Space>
                </Radio>
                <Radio value="excel">
                  <Space>
                    <TableOutlined /> Excel Spreadsheet
                  </Space>
                </Radio>
                <Radio value="csv">
                  <Space>
                    <FileTextOutlined /> CSV File
                  </Space>
                </Radio>
                <Radio value="dashboard">
                  <Space>
                    <BarChartOutlined /> Interactive Dashboard
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Divider orientation="left">Visualization Options</Divider>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="visualizationType" label="Include Visualizations">
            <Checkbox.Group>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card hoverable size="small">
                    <Checkbox value="barChart">
                      <Space>
                        <BarChartOutlined style={{ fontSize: '24px', color: 'var(--color-1890ff)' }} />
                        <div>
                          <div>Bar Chart</div>
                          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>Compare quantities across items</div>
                        </div>
                      </Space>
                    </Checkbox>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable size="small">
                    <Checkbox value="pieChart">
                      <Space>
                        <PieChartOutlined style={{ fontSize: '24px', color: 'var(--color-52c41a)' }} />
                        <div>
                          <div>Pie Chart</div>
                          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>Show distribution by category</div>
                        </div>
                      </Space>
                    </Checkbox>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable size="small">
                    <Checkbox value="lineChart">
                      <Space>
                        <LineChartOutlined style={{ fontSize: '24px', color: 'var(--color-722ed1)' }} />
                        <div>
                          <div>Line Chart</div>
                          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>Track trends over time</div>
                        </div>
                      </Space>
                    </Checkbox>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card hoverable size="small">
                    <Checkbox value="table">
                      <Space>
                        <TableOutlined style={{ fontSize: '24px', color: 'var(--color-fa8c16)' }} />
                        <div>
                          <div>Data Table</div>
                          <div style={{ fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>Detailed tabular data</div>
                        </div>
                      </Space>
                    </Checkbox>
                  </Card>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item name="scheduleReport" label="Schedule Report" valuePropName="checked">
            <Checkbox>Schedule this report to run automatically</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default ReportDrawer;