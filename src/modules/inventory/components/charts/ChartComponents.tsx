/**
 * Recharts wrapper components for Inventory Module
 * Clean, typed, and responsive Recharts components used by the inventory dashboard
 */

'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart as ReAreaChart,
  Area,
} from 'recharts';

export const colorSchemes = {
  primary: ['var(--color-1890ff)', 'var(--color-13c2c2)', 'var(--color-52c41a)', 'var(--color-faad14)', 'var(--color-f5222d)', 'var(--color-722ed1)', 'var(--color-eb2f96)', 'var(--color-fa541c)'],
  blue: ['var(--color-e6f7ff)', 'var(--color-bae7ff)', 'var(--color-91d5ff)', 'var(--color-69c0ff)', 'var(--color-40a9ff)', 'var(--color-1890ff)', 'var(--color-096dd9)', 'var(--color-0050b3)'],
  green: ['var(--color-f6ffed)', 'var(--color-d9f7be)', 'var(--color-b7eb8f)', 'var(--color-95de64)', 'var(--color-73d13d)', 'var(--color-52c41a)', 'var(--color-389e0d)', 'var(--color-237804)'],
  purple: ['var(--color-f9f0ff)', 'var(--color-efdbff)', 'var(--color-d3adf7)', 'var(--color-b37feb)', 'var(--color-9254de)', 'var(--color-722ed1)', 'var(--color-531dab)', 'var(--color-391085)'],
};

interface ChartComponentProps {
  data: any[];
  height?: number;
}

export const LineChart: React.FC<ChartComponentProps & { dataKey?: string; colors?: string[] }> = ({ data, height = 300, dataKey = 'value', colors = ['var(--color-1890ff)'] }) => {
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 250 : window.innerWidth < 1200 ? 300 : 350;
    }
    return height;
  };

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={colors[0]} strokeWidth={2} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChart: React.FC<ChartComponentProps & { keys?: string[]; colors?: string[] }> = ({ data, height = 300, keys = ['rawMaterial', 'wip', 'finished'], colors = ['var(--color-1890ff)', 'var(--color-faad14)', 'var(--color-52c41a)'] }) => {
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 250 : window.innerWidth < 1200 ? 300 : 350;
    }
    return height;
  };

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
        <ReAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((k, i) => (
            <Area key={k} type="monotone" dataKey={k} stackId="1" stroke={colors[i % colors.length]} fill={colors[i % colors.length]} />
          ))}
        </ReAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChart: React.FC<ChartComponentProps & { dataKey?: string; colors?: string[] }> = ({ data, height = 300, dataKey = 'value', colors = ['var(--color-1890ff)'] }) => {
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 250 : window.innerWidth < 1200 ? 300 : 350;
    }
    return height;
  };

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={colors[0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const HorizontalBarChart: React.FC<ChartComponentProps & { dataKey?: string; colors?: string[] }> = ({ data, height = 300, dataKey = 'count', colors = ['var(--color-8884d8)'] }) => {
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 250 : window.innerWidth < 1200 ? 300 : 350;
    }
    return height;
  };

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
        <ReBarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={colors[0]}>
            {data.map((entry, index) => {
              const key = entry?.id ?? entry?.name ?? `bar-${index}`;
              return <Cell key={String(key)} fill={colors[index % colors.length]} />;
            })}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChart: React.FC<ChartComponentProps & { nameKey?: string; valueKey?: string; colors?: string[] }> = ({ data, height = 300, nameKey = 'name', valueKey = 'value', colors = ['var(--color-1890ff)', 'var(--color-52c41a)', 'var(--color-faad14)', 'var(--color-cf1322)'] }) => {
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 250 : window.innerWidth < 1200 ? 300 : 350;
    }
    return height;
  };

  const getResponsiveRadius = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 60 : 80;
    }
    return 80;
  };

  return (
    <div style={{ width: '100%', position: 'relative', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <ResponsiveContainer width="100%" height={getResponsiveHeight()}>
        <RePieChart>
          <Tooltip />
          <Legend />
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} outerRadius={getResponsiveRadius()} label>
            {data.map((entry, index) => {
              const key = entry?.id ?? entry?.[nameKey] ?? `pie-${index}`;
              return <Cell key={String(key)} fill={colors[index % colors.length]} />;
            })}
          </Pie>
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default {
  LineChart,
  AreaChart,
  BarChart,
  HorizontalBarChart,
  PieChart,
};
