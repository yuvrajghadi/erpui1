'use client';
import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  CloudOutlined, BarChartOutlined, TeamOutlined, ApiOutlined,
  DollarCircleOutlined, SafetyCertificateOutlined, SettingOutlined,
  CustomerServiceOutlined, RobotOutlined, GlobalOutlined, DatabaseOutlined,
  LineChartOutlined, AppstoreOutlined, AuditOutlined, FileSearchOutlined, ThunderboltOutlined
} from '@ant-design/icons';

// Enhanced ERP Features Data with more details
const erpFeatures = [
  { 
    icon: <CloudOutlined />, 
    title: "Cloud-Native Platform", 
    desc: "Scalable cloud infrastructure with 99.9% uptime guarantee",
    stats: "99.9% Uptime"
  },
  { 
    icon: <BarChartOutlined />, 
    title: "Real-Time Analytics", 
    desc: "Live business insights with customizable dashboards",
    stats: "Real-Time Data"
  },
  { 
    icon: <TeamOutlined />, 
    title: "Team Collaboration", 
    desc: "Enhanced productivity with integrated communication tools",
    stats: "50+ Tools"
  },
  { 
    icon: <ApiOutlined />, 
    title: "API Ecosystem", 
    desc: "Seamless integration with 1000+ business applications",
    stats: "1000+ Apps"
  },
  { 
    icon: <DollarCircleOutlined />, 
    title: "Smart Financial Suite", 
    desc: "AI-powered invoicing and automated financial workflows",
    stats: "AI-Powered"
  },
  { 
    icon: <SafetyCertificateOutlined />, 
    title: "Enterprise Security", 
    desc: "Bank-level encryption with SOC 2 compliance",
    stats: "SOC 2 Certified"
  },
  { 
    icon: <SettingOutlined />, 
    title: "Workflow Automation", 
    desc: "Custom process automation with drag-and-drop builder",
    stats: "No-Code Builder"
  },
  { 
    icon: <CustomerServiceOutlined />, 
    title: "24/7 Expert Support", 
    desc: "Round-the-clock assistance with dedicated success managers",
    stats: "24/7 Support"
  },
];

const aiFeatures = [
  { 
    icon: <RobotOutlined />, 
    title: "AI Assistant", 
    desc: "Intelligent virtual assistant for automated business operations",
    stats: "Smart Assistant"
  },
  { 
    icon: <GlobalOutlined />, 
    title: "Market Intelligence", 
    desc: "AI-driven market analysis and competitive insights",
    stats: "Market Insights"
  },
  { 
    icon: <DatabaseOutlined />, 
    title: "Intelligent Data", 
    desc: "Advanced data processing with machine learning algorithms",
    stats: "ML Powered"
  },
  { 
    icon: <LineChartOutlined />, 
    title: "Predictive Analytics", 
    desc: "Forecast business trends with 95% accuracy using AI",
    stats: "95% Accuracy"
  },
  { 
    icon: <AppstoreOutlined />, 
    title: "Smart Mobile Apps", 
    desc: "AI-enhanced mobile experience for business on-the-go",
    stats: "Mobile First"
  },
  { 
    icon: <AuditOutlined />, 
    title: "Risk Intelligence", 
    desc: "Proactive risk assessment with automated mitigation strategies",
    stats: "Auto Mitigation"
  },
  { 
    icon: <FileSearchOutlined />, 
    title: "Cognitive Search", 
    desc: "AI-powered intelligent search across all business documents",
    stats: "Instant Search"
  },
  { 
    icon: <ThunderboltOutlined />, 
    title: "Auto Optimization", 
    desc: "Self-optimizing system performance with machine learning",
    stats: "Self-Learning"
  },
];

type Feature = {
  icon: React.ReactElement;
  title: string;
  desc: string;
  stats: string;
};

const FeatureCard = ({ feature, isMobile = false }: { feature: Feature; isMobile?: boolean }) => (
  <div className="feature-card">
    <div className="icon-wrapper">
      {React.cloneElement(feature.icon, { style: { fontSize: isMobile ? '32px' : '36px' } })}
    </div>
    <h5 className="title">{feature.title}</h5>
    <p className="description">{feature.desc}</p>
    <style jsx>{`
      .feature-card {
        width: ${isMobile ? 'auto' : '280px'};
        min-height: ${isMobile ? '220px' : '240px'};
        background: rgba(30, 30, 40, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: ${isMobile ? '24px' : '28px'};
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        backdrop-filter: blur(12px) saturate(150%);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .feature-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
      }
      .icon-wrapper {
        width: ${isMobile ? '64px' : '72px'};
        height: ${isMobile ? '64px' : '72px'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        background: linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(162, 44, 175, 0.1));
        color: #fff;
        transition: all 0.3s ease;
      }
      .feature-card:hover .icon-wrapper {
        transform: scale(1.1) rotate(10deg);
        box-shadow: 0 0 30px rgba(56, 189, 248, 0.4);
      }
      .title {
        font-size: ${isMobile ? '18px' : '20px'};
        font-weight: 600;
        color: #fff;
        margin-bottom: 12px;
      }
      .description {
        font-size: ${isMobile ? '14px' : '15px'};
        color: rgba(255, 255, 255, 0.75);
        line-height: 1.6;
        min-height: ${isMobile ? 'auto' : '50px'};
      }
    `}</style>
  </div>
);

const ScrollingTrack = ({ features, duration = 40, reverse = false }: { features: Feature[]; duration?: number; reverse?: boolean }) => {
  const duplicatedFeatures = [...features, ...features];
  return (
    <div className="scrolling-track-container">
      <div className="scrolling-track">
        {duplicatedFeatures.map((feature, index) => (
          <div className="card-wrapper" key={`${feature.title}-${index}`}>
            <FeatureCard feature={feature} />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes scroll-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .scrolling-track-container {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
          mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
        }
        .scrolling-track {
          display: flex;
          width: max-content;
          animation-name: ${reverse ? 'scroll-reverse' : 'scroll'};
          animation-duration: ${duration}s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .card-wrapper {
          margin: 16px 12px;
        }
      `}</style>
    </div>
  );
};

export default function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <h2 className="section-title">
          Why Choose Our ERP?
        </h2>
        <p className="section-subtitle">
          The most advanced, flexible, and user-friendly ERP platform. Everything your business needs—nothing it doesn't.
        </p>

        {/* Desktop: Scrolling Animation */}
        <div className="desktop-scroller">
          <div className="mb-4">
            <ScrollingTrack features={erpFeatures} duration={50} />
          </div>
          <div>
            <ScrollingTrack features={aiFeatures} duration={60} reverse={true} />
          </div>
        </div>

        {/* Mobile: Static Grid */}
        <div className="mobile-grid">
          <h3 className="grid-title">Our Features</h3>
          <div className="grid">
            {erpFeatures.map((feature, index) => (
              <FeatureCard feature={feature} key={`erp-${index}`} isMobile={true} />
            ))}
          </div>
          <h3 className="grid-title">AI-Powered</h3>
          <div className="grid">
            {aiFeatures.map((feature, index) => (
              <FeatureCard feature={feature} key={`ai-${index}`} isMobile={true} />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .features-section {
          padding: 80px 0;
          position: relative;
          overflow: hidden;
          // background: #101014;
        }
        .container {
          max-width: 100%;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .section-title {
          text-align: center;
          font-size: 42px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 16px;
        }
        .section-subtitle {
          text-align: center;
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto 48px;
          padding: 0 20px;
        }
        
        .mobile-grid {
          display: none;
        }
        .grid-title {
          color: #fff;
          font-size: 28px;
          margin-top: 40px;
          margin-bottom: 24px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 16px;
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 60px 0;
          }
          .section-title {
            font-size: 32px;
          }
          .section-subtitle {
            font-size: 16px;
            margin-bottom: 32px;
          }
          .desktop-scroller {
            display: none;
          }
          .mobile-grid {
            display: block;
            padding: 0 20px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
