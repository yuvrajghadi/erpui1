'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Space, Tag, Tabs } from 'antd';

export interface FAQCategoryItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

export interface FAQCategoryFilterProps {
  categories: FAQCategoryItem[];
  selectedCategory: string;
  onCategoryChange: (categoryKey: string) => void;
}

const categoryVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200
    }
  }
};

const FAQCategoryFilter: React.FC<FAQCategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  // Ant Design Tabs for categories
  return (
    <div className="category-filter-tabs">
      <Tabs
        activeKey={selectedCategory}
        onChange={onCategoryChange}
        type="line"
        tabBarStyle={{
          marginBottom: 0,
          background: 'transparent',
          border: 'none',
          fontWeight: 600,
          fontSize: 16,
        }}
        items={categories.map(category => ({
          key: category.key,
          label: (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="category-icon" style={{ color: category.color, fontSize: 18 }}>{category.icon}</span>
              <span className="category-label" style={{ fontWeight: 600 }}>{category.label}</span>
              <span className="category-count" style={{
                background: selectedCategory === category.key ? category.color : '#94a3b8',
                color: 'white',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 6,
                minWidth: 20,
                textAlign: 'center',
                marginLeft: 4
              }}>{category.count}</span>
            </span>
          ),
        }))}
        className="faq-category-tabs"
        animated
      />
      <style jsx>{`
        .category-filter-tabs {
          margin-bottom: 20px;
        }
        .faq-category-tabs {
          width: 100%;
        }
        .category-icon {
          font-size: 18px;
        }
        .category-label {
          font-size: 15px;
        }
        .category-count {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 6px;
          min-width: 20px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .category-label {
            font-size: 13px;
          }
          .category-icon {
            font-size: 15px;
          }
          .category-count {
            font-size: 10px;
            padding: 1px 4px;
          }
        }
        @media (max-width: 480px) {
          .category-label {
            display: none;
          }
          .category-icon {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default FAQCategoryFilter;
