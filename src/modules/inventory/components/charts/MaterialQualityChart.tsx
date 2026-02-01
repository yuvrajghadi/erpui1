import React, { useState } from 'react';
import { Card, Typography, Radio, Space, Tooltip as AntTooltip, Progress, Divider, Row, Col } from 'antd';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { InfoCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Sample data for material quality
const qualityData = [
  { attribute: 'Durability', material: 85, benchmark: 80 },
  { attribute: 'Consistency', material: 92, benchmark: 85 },
  { attribute: 'Purity', material: 78, benchmark: 75 },
  { attribute: 'Color Retention', material: 90, benchmark: 85 },
  { attribute: 'Tensile Strength', material: 82, benchmark: 90 },
  { attribute: 'Defect Rate', material: 95, benchmark: 80 },
];

interface MaterialQualityChartProps {
  data?: typeof qualityData;
}

type TimeRange = 'month' | 'quarter' | 'year';

const MaterialQualityChart: React.FC<MaterialQualityChartProps> = ({
  data = qualityData,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isBetter = payload[0].value >= payload[1].value;
      
      return (
        <div className="custom-tooltip" style={{ 
          background: 'rgba(255, 255, 255, 0.95)', 
          padding: '10px', 
          border: '1px solid var(--color-dddddd)',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <Divider style={{ margin: '4px 0' }} />
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ margin: '4px 0', color: entry.color }}>
              {entry.name === 'material' ? 'Your Materials' : 'Industry Benchmark'}: <strong>{entry.value}%</strong>
            </p>
          ))}
          
          <div style={{ marginTop: '4px', borderTop: '1px dashed var(--color-cccccc)', paddingTop: '4px' }}>
            <p style={{ 
              margin: '4px 0',
              color: isBetter ? 'var(--color-52c41a)' : 'var(--color-f5222d)',
              display: 'flex',
              alignItems: 'center'
            }}>
              {isBetter ? (
                <><CheckCircleOutlined style={{ marginRight: '4px' }} /> {(payload[0].value - payload[1].value)}% above benchmark</>
              ) : (
                <><WarningOutlined style={{ marginRight: '4px' }} /> {(payload[1].value - payload[0].value)}% below benchmark</>
              )}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleTimeRangeChange = (e: any) => {
    setTimeRange(e.target.value);
  };

  // Calculate overall quality score
  const calculateQualityScore = () => {
    const materialSum = data.reduce((sum, item) => sum + item.material, 0);
    const benchmarkSum = data.reduce((sum, item) => sum + item.benchmark, 0);
    return {
      material: (materialSum / data.length).toFixed(1),
      benchmark: (benchmarkSum / data.length).toFixed(1),
      difference: (materialSum / data.length - benchmarkSum / data.length).toFixed(1)
    };
  };

  const qualityScore = calculateQualityScore();

  return (
    <Card 
      className="dashboard-card chart-card material-quality-chart"
      variant="outlined"
      style={{ 
        height: '100%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Title level={5} style={{ margin: 0 }}>Material Quality Assessment</Title>
        <Radio.Group 
          value={timeRange} 
          onChange={handleTimeRangeChange} 
          size="small"
          buttonStyle="solid"
        >
          <Radio.Button value="month">Month</Radio.Button>
          <Radio.Button value="quarter">Quarter</Radio.Button>
          <Radio.Button value="year">Year</Radio.Button>
        </Radio.Group>
      </div>
      <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
        Quality metrics for your raw materials vs industry benchmarks
      </Text>
      
      <div className="chart-container" style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis dataKey="attribute" tick={{ fill: 'var(--color-666666)', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Your Materials"
              dataKey="material"
              stroke="var(--color-1890ff)"
              fill="var(--color-1890ff)"
              fillOpacity={0.2}
            />
            <Radar
              name="Industry Benchmark"
              dataKey="benchmark"
              stroke="var(--color-faad14)"
              fill="var(--color-faad14)"
              fillOpacity={0.1}
            />
            <Legend wrapperStyle={{ lineHeight: '40px' }} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      
      <Divider style={{ margin: '16px 0 8px' }} />
      
      <Row gutter={16} align="middle">
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Your Score</Text>
            <div>
              <Text strong style={{ fontSize: '18px', color: 'var(--color-1890ff)' }}>
                {qualityScore.material}%
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Benchmark</Text>
            <div>
              <Text strong style={{ fontSize: '18px', color: 'var(--color-faad14)' }}>
                {qualityScore.benchmark}%
              </Text>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <AntTooltip title="Comparison against industry benchmark">
              <InfoCircleOutlined style={{ marginRight: '4px', color: 'var(--color-8c8c8c)' }} />
              <Text type="secondary">Performance</Text>
            </AntTooltip>
            <div>
              <Text 
                type={Number(qualityScore.difference) > 0 ? 'success' : 'danger'} 
                strong style={{ fontSize: '18px' }}
              >
                {Number(qualityScore.difference) > 0 ? '+' : ''}
                {qualityScore.difference}%
              </Text>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default MaterialQualityChart;
