import React from 'react';
import { Row, Col, Card, Statistic, Table, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip, Cell } from 'recharts';

interface DecisionViewProps {
  kpiData: any;
  leakageData: any[];
  styleProfitRiskData: any[];
  turnoverVelocityData: any[];
  onAction: (title: string, type: string, data: any) => void;
}

export const DecisionView: React.FC<DecisionViewProps> = ({
  kpiData,
  leakageData,
  styleProfitRiskData,
  turnoverVelocityData,
  onAction
}) => {
  return (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6}>
            <Card hoverable onClick={() => onAction('Raw Material Value Breakdown', 'fabricStock', [])}>
                <Statistic title="Raw Material Value" value={(kpiData.totalRawMaterialValue || 0) / 1000} prefix="₹" suffix="K" precision={0} />
            </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
            <Card hoverable onClick={() => onAction('WIP Value Breakdown', 'wip', [])}>
                <Statistic title="WIP Value" value={(kpiData.wipValue || 0) / 1000} prefix="₹" suffix="K" precision={0} />
            </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
            <Card hoverable onClick={() => onAction('FG Value Breakdown', 'fabricStock', [])}>
                 <Statistic title="FG Value" value={(kpiData.finishedGoodsValue || 0) / 1000} prefix="₹" suffix="K" precision={0} />
            </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
            <Card hoverable onClick={() => onAction('Dead Stock Details', 'deadStock', [])}>
                 <Statistic title="Dead/Blocked Stock" value={((kpiData.deadStockQty || 0) * 50) / 1000} prefix="₹" suffix="K" precision={0} valueStyle={{ color: 'var(--color-ff4d4f)' }} />
            </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={14}>
             <Card title="Leakage Heatmap" extra={<Button type="link" onClick={() => onAction('Leakage Analysis', 'leakage', leakageData)}>Analyze</Button>}>
                <Table 
                    dataSource={leakageData} 
                    rowKey="process"
                    pagination={false}
                    columns={[
                        { title: 'Process', dataIndex: 'process' },
                        { title: 'Loss %', dataIndex: 'loss', render: (val: number, rec: any) => <span style={{ color: rec.color }}>{val.toFixed(2)}%</span> }
                    ]}
                />
             </Card>
        </Col>
        <Col xs={24} lg={10}>
            <Card title="Inventory Turnover Velocity">
                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={turnoverVelocityData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="value">
                            {turnoverVelocityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
            <Card title="Style Profit Risk Analysis" extra={<Button type="link" onClick={() => onAction('Style Profit Risk', 'styleRisk', styleProfitRiskData)}>Full Report</Button>}>
                 <Table 
                    dataSource={styleProfitRiskData}
                    rowKey="style"
                    pagination={false}
                    columns={[
                        { title: 'Style', dataIndex: 'style' },
                        { title: 'Variance Risk', dataIndex: 'variance' }
                    ]}
                 />
            </Card>
        </Col>
      </Row>
    </>
  );
};