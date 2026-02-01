
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Card,
  Input,
  Badge,
  Tag,
  Button,
  Collapse,
  Typography,
  Row,
  Col,
  Space,
  Divider
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  StarOutlined,
  PlusOutlined,
  MinusOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  SecurityScanOutlined,
  ApiOutlined,
  BookOutlined,
  DollarOutlined,
  SettingOutlined,
  BarChartOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// Types
interface FAQData {
  id: number;
  category: string;
  question: string;
  answer: string;
  icon: string;
  tags?: string[];
  priority?: 'high' | 'medium' | 'low';
}

interface CategoryData {
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

// FAQ Data
const faqData: FAQData[] = [
  {
    id: 1,
    category: "Implementation & Setup",
    question: "How long does it take to implement your ERP system?",
    answer: "Our ERP implementation typically takes 3-6 months depending on your organization size and complexity. We follow a proven methodology: Discovery & Planning (2-4 weeks), System Configuration (4-8 weeks), Data Migration (2-3 weeks), Testing & Training (3-4 weeks), and Go-Live Support (1 week). Our phased approach ensures minimal disruption to your operations, with core modules going live within 6-8 weeks.",
    icon: "🚀",
    tags: ["implementation", "timeline", "setup"],
    priority: "high"
  },
  {
    id: 2,
    category: "Data & Security",
    question: "How secure is our business data in your ERP system?",
    answer: "We employ enterprise-grade security with 256-bit AES encryption, multi-factor authentication, role-based access controls, and SOC 2 Type II compliance. Your data is backed up in real-time across multiple geographically distributed data centers with 99.99% uptime SLA. We also maintain ISO 27001 certification and conduct regular third-party security audits.",
    icon: "🔒",
    tags: ["security", "data protection", "compliance"],
    priority: "high"
  },
  {
    id: 3,
    category: "Integration",
    question: "Can your ERP integrate with our existing software and tools?",
    answer: "Absolutely! Our ERP platform offers 1000+ pre-built integrations including Salesforce, QuickBooks, Shopify, SAP, Oracle, Microsoft 365, and industry-specific tools. We provide REST APIs, webhooks, and real-time data synchronization. Our integration team can also develop custom connectors for unique requirements within 2-4 weeks.",
    icon: "🔗",
    tags: ["integration", "API", "connectivity"],
    priority: "high"
  },
  {
    id: 4,
    category: "Training & Support",
    question: "What kind of training and support do you provide?",
    answer: "We offer comprehensive training programs including live instructor-led sessions, interactive video tutorials, detailed documentation, and hands-on workshops. Our support includes 24/7 technical assistance via phone, chat, and email, plus dedicated Customer Success Managers for enterprise clients. We also provide quarterly business reviews and ongoing optimization consultations.",
    icon: "🎓",
    tags: ["training", "support", "onboarding"],
    priority: "medium"
  },
  {
    id: 5,
    category: "Pricing & ROI",
    question: "What's the typical ROI for implementing your ERP system?",
    answer: "Most clients achieve 200-300% ROI within the first 18 months. Key benefits include: 35% reduction in operational costs, 50% faster financial reporting, 40% improvement in inventory turnover, 60% reduction in manual data entry, improved compliance reducing audit costs by 25%, and enhanced decision-making leading to 15% revenue growth.",
    icon: "💰",
    tags: ["ROI", "benefits", "cost savings"],
    priority: "high"
  },
  {
    id: 6,
    category: "Customization",
    question: "Can the system be customized for our specific industry needs?",
    answer: "Yes! Our ERP platform is highly configurable with industry-specific modules for Manufacturing, Retail, Healthcare, Professional Services, Non-profit, and more. We offer custom workflows, automated business rules, personalized dashboards, industry-specific reporting, and can develop custom modules to match your unique processes without affecting core system updates.",
    icon: "⚙️",
    tags: ["customization", "industry-specific", "configuration"],
    priority: "medium"
  },
  {
    id: 7,
    category: "Scalability",
    question: "Will the system grow with our business?",
    answer: "Our cloud-native architecture scales automatically with your business growth. Whether you're adding users (from 10 to 10,000+), locations, transaction volume, or data storage, the system adapts seamlessly. We support horizontal and vertical scaling with auto-load balancing, and our pricing model grows with your usage to ensure cost-effectiveness at every stage.",
    icon: "📈",
    tags: ["scalability", "growth", "flexibility"],
    priority: "medium"
  },
  {
    id: 8,
    category: "Migration",
    question: "How do you handle data migration from our current system?",
    answer: "Our certified data migration specialists use automated ETL tools and proven methodologies to ensure 100% data accuracy and integrity. The process includes: Data Assessment & Mapping, Automated Extraction & Transformation, Multiple Test Migrations, Data Validation & Cleansing, and Final Migration with rollback capabilities. We guarantee zero data loss and provide complete audit trails.",
    icon: "🔄",
    tags: ["migration", "data transfer", "implementation"],
    priority: "medium"
  },
  {
    id: 9,
    category: "Implementation & Setup",
    question: "What happens if we need to customize workflows during implementation?",
    answer: "Our implementation methodology is designed to accommodate workflow customizations. During the Discovery phase, we map your current processes and identify optimization opportunities. Changes can be made throughout the configuration phase without impacting timelines. We use a change management process to track modifications and ensure they align with best practices.",
    icon: "🛠️",
    tags: ["workflows", "customization", "change management"],
    priority: "low"
  },
  {
    id: 10,
    category: "Data & Security",
    question: "Do you provide data backup and disaster recovery?",
    answer: "Yes, we provide comprehensive backup and disaster recovery services. Data is backed up every 15 minutes with point-in-time recovery capabilities. We maintain geographically distributed backup centers with RTO (Recovery Time Objective) of 4 hours and RPO (Recovery Point Objective) of 15 minutes. Our disaster recovery plan is tested quarterly and meets industry compliance standards.",
    icon: "☁️",
    tags: ["backup", "disaster recovery", "business continuity"],
    priority: "medium"
  },
  {
    id: 11,
    category: "Integration",
    question: "How do you handle real-time data synchronization?",
    answer: "Our platform uses event-driven architecture with real-time webhooks and APIs for instant data synchronization. We support both push and pull mechanisms, batch processing for large datasets, and conflict resolution algorithms. Data consistency is maintained across all integrated systems with automatic retry mechanisms and error handling for failed synchronizations.",
    icon: "⚡",
    tags: ["real-time", "synchronization", "data consistency"],
    priority: "low"
  },
  {
    id: 12,
    category: "Training & Support",
    question: "Do you provide ongoing training for new employees?",
    answer: "Absolutely! We offer continuous training programs including on-demand video libraries, monthly webinars, user certification programs, and new employee onboarding packages. Your team gets access to our Learning Management System with role-based training paths, progress tracking, and refresher courses. We also provide train-the-trainer programs for your internal champions.",
    icon: "📚",
    tags: ["ongoing training", "employee onboarding", "certification"],
    priority: "low"
  }
];

// Category data with icons and counts
const categoryData: CategoryData[] = [
  {
    key: 'All',
    label: 'All Questions',
    icon: <BookOutlined />,
    color: '#3b82f6',
    count: faqData.length
  },
  {
    key: 'Implementation & Setup',
    label: 'Implementation',
    icon: <RocketOutlined />,
    color: '#10b981',
    count: faqData.filter(faq => faq.category === 'Implementation & Setup').length
  },
  {
    key: 'Data & Security',
    label: 'Security',
    icon: <SecurityScanOutlined />,
    color: '#f59e0b',
    count: faqData.filter(faq => faq.category === 'Data & Security').length
  },
  {
    key: 'Integration',
    label: 'Integration',
    icon: <ApiOutlined />,
    color: '#8b5cf6',
    count: faqData.filter(faq => faq.category === 'Integration').length
  },
  {
    key: 'Training & Support',
    label: 'Support',
    icon: <BookOutlined />,
    color: '#06b6d4',
    count: faqData.filter(faq => faq.category === 'Training & Support').length
  },
  {
    key: 'Pricing & ROI',
    label: 'Pricing',
    icon: <DollarOutlined />,
    color: '#ef4444',
    count: faqData.filter(faq => faq.category === 'Pricing & ROI').length
  },
  {
    key: 'Customization',
    label: 'Customization',
    icon: <SettingOutlined />,
    color: '#84cc16',
    count: faqData.filter(faq => faq.category === 'Customization').length
  },
  {
    key: 'Scalability',
    label: 'Scalability',
    icon: <BarChartOutlined />,
    color: '#f97316',
    count: faqData.filter(faq => faq.category === 'Scalability').length
  },
  {
    key: 'Migration',
    label: 'Migration',
    icon: <SyncOutlined />,
    color: '#ec4899',
    count: faqData.filter(faq => faq.category === 'Migration').length
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const headerVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const categoryVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2
    }
  }
};

const searchVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// FAQ Item Component
const FAQItem: React.FC<{ faq: FAQData; isOpen: boolean; onToggle: () => void; index: number }> = ({
  faq,
  isOpen,
  onToggle,
  index
}) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Standard';
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="faq-item-wrapper"
    >
      <Card
        className="faq-card"
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)' 
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isOpen ? '#3b82f6' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: isOpen 
            ? '0 20px 40px rgba(59, 130, 246, 0.2), 0 8px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
            : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          marginBottom: '16px'
        }}
        styles={{
          body: {
            padding: 0,
            background: 'transparent'
          }
        }}
      >
        {/* Glow effect on open */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              zIndex: 1
            }}
          />
        )}

        {/* Question Header */}
        <div
          onClick={onToggle}
          style={{
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease'
          }}
          className="question-header"
        >
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div
              style={{
                fontSize: '24px',
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: isOpen 
                  ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' 
                  : 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
            >
              {faq.icon}
            </div>
            <div style={{ flex: 1 }}>
              <Title
                level={4}
                style={{
                  color: '#f1f5f9',
                  margin: '0 0 8px 0',
                  fontSize: '17px',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
                className="question-title"
              >
                {faq.question}
              </Title>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {faq.priority && (
                  <Tag
                    color={getPriorityColor(faq.priority)}
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      border: 'none',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {getPriorityText(faq.priority)}
                  </Tag>
                )}
                <Text
                  style={{
                    color: '#94a3b8',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}
                >
                  {faq.category}
                </Text>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isOpen 
                ? 'rgba(59, 130, 246, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: isOpen ? '#60a5fa' : '#94a3b8',
              transition: 'all 0.3s ease'
            }}
            className="toggle-icon"
          >
            <PlusOutlined style={{ fontSize: '14px' }} />
          </motion.div>
        </div>

        {/* Answer Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '0 24px 24px 24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Paragraph
                  style={{
                    color: '#e2e8f0',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    margin: '20px 0 16px 0',
                    fontWeight: 400
                  }}
                  className="answer-paragraph"
                >
                  {faq.answer}
                </Paragraph>

                {faq.tags && faq.tags.length > 0 && (
                  <div style={{ marginTop: '16px' }}>
                    <Text
                      style={{
                        color: '#cbd5e1',
                        fontSize: '13px',
                        fontWeight: 600,
                        marginBottom: '12px',
                        display: 'block',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                      className="tags-label"
                    >
                      Related Topics
                    </Text>
                    <Space wrap>
                      {faq.tags.map((tag, tagIndex) => (
                        <Tag
                          key={tagIndex}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: '#93c5fd',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '4px 8px'
                          }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}

                {/* Helpful Section */}
                <div
                  style={
                    {
                      marginTop: '20px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                  }
                >
                  <Text
                    style={{
                      color: '#cbd5e1',
                      fontSize: '14px',
                      fontWeight: 500,
                      marginBottom: '8px',
                      display: 'block'
                    }}
                    className="helpful-text"
                  >
                    Was this helpful?
                  </Text>
                  <Space>
                    <Button
                      size="small"
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#4ade80',
                        borderRadius: '8px'
                      }}
                    >
                      👍 Yes
                    </Button>
                    <Button
                      size="small"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        borderRadius: '8px'
                      }}
                    >
                      👎 No
                    </Button>
                  </Space>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Main FAQ Component
const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1])); // First item open by default
  
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate stats
  const popularFAQs = faqData.filter(faq => faq.priority === 'high').length;
  const totalFAQs = faqData.length;
  const categoriesCount = categoryData.length - 1; // Exclude 'All'

  const toggleItem = (id: number) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}
      />

      {/* Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header Section */}
          <motion.div
            ref={headerRef}
            variants={headerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <motion.div
              variants={statsVariants}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '50px',
                padding: '8px 20px',
                marginBottom: '24px'
              }}
            >
              <QuestionCircleOutlined style={{ color: '#60a5fa', fontSize: '16px' }} />
              <Text style={{ color: '#93c5fd', fontSize: '14px', fontWeight: '600' }}>
                {totalFAQs} Questions • {categoriesCount} Categories • {popularFAQs} Priority
              </Text>
            </motion.div>

            <Title
              level={1}
              style={{
                color: '#ffffff',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 700,
                margin: '0 0 24px 0',
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textAlign: 'center'
              }}
            >
              Frequently Asked Questions
            </Title>

            <Paragraph
              style={{
                color: '#cbd5e1',
                fontSize: '18px',
                lineHeight: 1.6,
                maxWidth: '600px',
                margin: '0 auto 40px auto',
                fontWeight: 400
              }}
            >
              Find answers to common questions about our ERP system, implementation process, and support services.
            </Paragraph>
          </motion.div>

          

          {/* Category Filters */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            style={{ marginBottom: '50px' }}
          >
            <Row justify="center">
              <Col span={24}>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {categoryData.map((category, index) => (
                    <motion.button
                      key={category.key}
                      variants={categoryVariants}
                      whileHover="hover"
                      onClick={() => setSelectedCategory(category.key)}
                      className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                        selectedCategory === category.key
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400'
                          : 'bg-white/8 text-gray-200 hover:bg-white/12 border border-white/20 hover:border-blue-400/50 hover:text-white'
                      }`}
                      style={{
                        backdropFilter: 'blur(10px)',
                        boxShadow: selectedCategory === category.key 
                          ? '0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
                          : '0 4px 16px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: selectedCategory === category.key 
                          ? '1px solid #3b82f6' 
                          : '1px solid rgba(255, 255, 255, 0.2)',
                        background: selectedCategory === category.key
                          ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                          : 'rgba(255, 255, 255, 0.08)',
                        color: selectedCategory === category.key ? '#ffffff' : '#e2e8f0',
                        padding: '12px 20px',
                        borderRadius: '50px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {category.icon}
                      {category.label}
                      {category.count > 0 && (
                        <Badge 
                          count={category.count} 
                          size="small" 
                          className="ml-2"
                          style={{ 
                            backgroundColor: selectedCategory === category.key ? 'rgba(255,255,255,0.25)' : '#3b82f6',
                            color: selectedCategory === category.key ? '#1e293b' : '#ffffff',
                            fontWeight: '600',
                            border: selectedCategory === category.key ? '1px solid rgba(255,255,255,0.3)' : 'none'
                          }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </Col>
            </Row>
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Row justify="center">
              <Col xs={24} lg={20} xl={16}>
                {filteredFAQs.length > 0 ? (
                  <div>
                    {filteredFAQs.map((faq, index) => (
                      <FAQItem
                        key={faq.id}
                        faq={faq}
                        isOpen={openItems.has(faq.id)}
                        onToggle={() => toggleItem(faq.id)}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <QuestionCircleOutlined
                      style={{
                        fontSize: '48px',
                        color: '#64748b',
                        marginBottom: '16px'
                      }}
                    />
                    <Title level={3} style={{ color: '#e2e8f0', marginBottom: '8px' }}>
                      No questions found
                    </Title>
                    <Paragraph style={{ color: '#94a3b8', fontSize: '16px' }}>
                      Try adjusting your search terms or category filter.
                    </Paragraph>
                  </motion.div>
                )}
              </Col>
            </Row>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 }}
            style={{ marginTop: '80px' }}
          >
            <Row justify="center">
              <Col xs={24} lg={20} xl={16} className="ant-col ant-col-xs-24 ant-col-lg-20 ant-col-xl-16">
                <Card
                  style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '20px',
                    backdropFilter: 'blur(20px)',
                    padding: '20px',
                    textAlign: 'center'
                  }}
                >
                  <Title level={3} style={{ color: '#ffffff', marginBottom: '16px' }}>
                    Still have questions?
                  </Title>
                  <Paragraph style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '24px' }}>
                    Can't find the answer you're looking for? Our support team is here to help.
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '48px',
                      padding: '0 32px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}
                  >
                    Contact Support
                  </Button>
                </Card>
              </Col>
            </Row>
          </motion.div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .modern-search .ant-input {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: #f8fafc !important;
          border-radius: 16px !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          padding: 12px 16px !important;
          backdrop-filter: blur(20px) !important;
        }
        
        .modern-search .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          font-weight: 400 !important;
        }
        
        .modern-search .ant-input:focus,
        .modern-search .ant-input:hover {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 8px 32px rgba(59, 130, 246, 0.1) !important;
          background: rgba(255, 255, 255, 0.12) !important;
        }
        
        .modern-search .ant-input-prefix {
          color: #60a5fa !important;
          margin-right: 12px !important;
        }
        
        .modern-search .ant-input-clear-icon {
          color: rgba(255, 255, 255, 0.6) !important;
          transition: all 0.2s ease !important;
        }
        
        .modern-search .ant-input-clear-icon:hover {
          color: #f87171 !important;
          transform: scale(1.1) !important;
        }
        
        .modern-search .ant-input-group-wrapper {
          border-radius: 16px !important;
        }
        
        .faq-card:hover {
          transform: translateY(-2px) !important;
        }
        
        .faq-card:hover .toggle-icon {
          color: #60a5fa !important;
        }
        
        .faq-card:hover .question-title {
          color: #ffffff !important;
        }
        
        .question-header:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .faq-item-wrapper {
            margin-bottom: 12px;
          }
          
          .question-header {
            padding: 20px !important;
          }
          
          .question-header > div:first-child {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 12px;
          }
          
          .question-header > div:first-child > div:first-child {
            margin-right: 0 !important;
            margin-bottom: 8px;
          }
        }
        
        @media (max-width: 576px) {
          .modern-search {
            margin-bottom: 20px;
          }
          
          .category-filters {
            justify-content: flex-start !important;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .category-filters::-webkit-scrollbar {
            height: 4px;
          }
          
          .category-filters::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }
          
          .category-filters::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 2px;
          }
          
          .category-filters::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.7);
          }
        }
      `}</style>
    </div>
  );
};

export default FAQSection;