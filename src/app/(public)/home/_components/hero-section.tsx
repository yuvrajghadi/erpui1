'use client';
import React, { useRef, useState, useEffect } from "react";
import { Button } from "antd";
import { motion, useInView, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

interface ERPService {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  borderColor: string;
  features?: string[];
}

interface ServiceCardProps {
  service: ERPService;
  index: number;
}

// ERP Services data with enhanced features
const erpServices = [
  {
    id: 1,
    title: "Financial Management",
    description: "Complete accounting, budgeting, and financial reporting with real-time analytics",
    icon: "💰",
    color: "from-emerald-500 to-cyan-500",
    borderColor: "border-emerald-500/30",
    features: ["Real-time Reporting", "Budget Planning", "Tax Management"]
  },
  {
    id: 2,
    title: "Human Resources",
    description: "Payroll, employee management, and HR analytics with AI-powered insights",
    icon: "👥",
    color: "from-blue-500 to-indigo-600",
    borderColor: "border-blue-500/30",
    features: ["Payroll Automation", "Performance Tracking", "Talent Management"]
  },
  {
    id: 3,
    title: "Supply Chain",
    description: "Inventory management and procurement automation with predictive analytics",
    icon: "📦",
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30",
    features: ["Smart Inventory", "Supplier Management", "Demand Forecasting"]
  },
  {
    id: 4,
    title: "Customer Relations",
    description: "CRM, sales tracking, and customer analytics with 360° customer view",
    icon: "🤝",
    color: "from-orange-500 to-red-500",
    borderColor: "border-orange-500/30",
    features: ["Lead Management", "Sales Pipeline", "Customer Analytics"]
  },
  {
    id: 5,
    title: "Project Management",
    description: "Resource planning and project tracking with collaborative tools",
    icon: "📊",
    color: "from-teal-500 to-green-500",
    borderColor: "border-teal-500/30",
    features: ["Resource Planning", "Time Tracking", "Team Collaboration"]
  },
  {
    id: 6,
    title: "Manufacturing",
    description: "Production planning and quality control with IoT integration",
    icon: "🏭",
    color: "from-indigo-500 to-purple-600",
    borderColor: "border-indigo-500/30",
    features: ["Production Planning", "Quality Control", "Equipment Monitoring"]
  }
];

// Stats data for social proof
const statsData = [
  { label: "Active Users", value: "50K+", icon: "👥" },
  { label: "Countries", value: "120+", icon: "🌍" },
  { label: "Uptime", value: "99.9%", icon: "⚡" },
  { label: "Satisfaction", value: "4.9/5", icon: "⭐" }
];

// Enhanced Animation variants
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  hover: {
    scale: 1.05,
    y: -12,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const serviceVariants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      duration: 0.6
    }
  }
};

const heroVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const statsVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={cardRef}
      variants={serviceVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.05,
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`service-card ${service.borderColor} group`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '20px',
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: '240px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Gradient overlay */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${service.color.split(' ')[1]}/10, ${service.color.split(' ')[3]}/5)`,
          borderRadius: '20px',
          zIndex: 1
        }}
        animate={isHovered ? { opacity: 1.5 } : { opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Icon */}
      <motion.div
        animate={isHovered ? { 
          rotate: 5,
          scale: 1.1,
          transition: { duration: 0.3 }
        } : {
          rotate: 0,
          scale: 1,
          transition: { duration: 0.3 }
        }}
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {service.icon}
      </motion.div>
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1 }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: '700',
          marginBottom: '12px',
          lineHeight: '1.3'
        }}>
          {service.title}
        </h3>
        <p style={{
          color: '#a1a1aa',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: '0 0 16px 0'
        }}>
          {service.description}
        </p>
        
        {/* Feature list with animation */}
        <AnimatePresence>
          {isHovered && service.features && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginTop: '12px' }}
            >
              {service.features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '12px',
                    color: '#d1d5db',
                    marginBottom: '4px'
                  }}
                >
                  <span style={{ marginRight: '8px', color: '#10b981' }}>✓</span>
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Enhanced hover glow effect */}
      <motion.div
        className="glow-effect"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${service.color.split(' ')[1]}/20, ${service.color.split(' ')[3]}/10)`,
          borderRadius: '20px',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          zIndex: 0
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Additional animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-16px',
          right: '-16px',
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
        animate={isHovered ? { scale: 1.2, opacity: 0.3 } : { scale: 1, opacity: 0.1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '-24px',
          left: '-24px',
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
        animate={isHovered ? { scale: 1.1, opacity: 0.2 } : { scale: 1, opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const statsRef = useRef(null);
  const [currentFeature, setCurrentFeature] = useState(0);
  const isInView = useInView(ref, { once: true });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Auto-rotate featured highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    "AI-Powered Analytics",
    "Real-time Collaboration", 
    "Cloud-Native Architecture"
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
    }
  };

  const backgroundX = useTransform(mouseX, [-1, 1], ['-2%', '2%']);
  const backgroundY = useTransform(mouseY, [-1, 1], ['-2%', '2%']);

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "120px 24px 60px 24px",
      }}
    >
      {/* Enhanced animated background */}
      <motion.div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          x: backgroundX,
          y: backgroundY
        }}
      />
      
      {/* Grid pattern overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
        opacity: 0.5
      }} />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="particle"
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'linear-gradient(45deg, #a855f7, #6366f1)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Main content */}
      <motion.div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 1400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Hero Content */}
        <motion.div variants={heroVariants} style={{ marginBottom: '80px' }}>
          {/* Badge */}
          <motion.div
            variants={serviceVariants}
            style={{
              marginBottom: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              borderRadius: '9999px',
              background: 'rgba(168, 85, 247, 0.1)',
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#d8b4fe',
              border: '1px solid rgba(168, 85, 247, 0.2)'
            }}
          >
            <span style={{ marginRight: '8px' }}>🚀</span>
            Trusted by 50,000+ businesses worldwide
          </motion.div>
          
          <motion.h1
            style={{
              color: "#ffffff",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.02em",
              textAlign: "center",
              margin: '0 0 24px 0',
              lineHeight: 1.1,
              maxWidth: '1000px',
              textShadow: '0 0 40px rgba(255,255,255,0.1)',
              y: y,
              opacity: opacity
            }}
            variants={serviceVariants}
          >
            End-to-End Textile & Garment{" "}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 200%',
            }}> 
              Smart ERP System
            </span>
          </motion.h1>
          
          {/* Dynamic feature highlight */}
          <motion.div
            style={{
              marginBottom: '24px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            variants={serviceVariants}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={currentFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#06b6d4'
                }}
              >
                ✨ {features[currentFeature]}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          variants={serviceVariants}
          style={{
            color: "#d1d5db",
            fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
            fontWeight: 400,
            textAlign: "center",
            margin: "0 auto 40px auto",
            maxWidth: 800,
            lineHeight: 1.7,
          }}
        >
          Streamline operations, boost productivity, and drive growth with our comprehensive 
          Enterprise Resource Planning solution designed for modern businesses. Experience the future of business management.
        </motion.p>
        
        {/* CTA Buttons */}
        <motion.div
          variants={serviceVariants}
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '48px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <Button
            size="large"
            type="primary"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #ec4899)",
              border: "none",
              fontWeight: 600,
              fontSize: 18,
              padding: "0 40px",
              borderRadius: 12,
              height: 56,
              color: "#fff",
              boxShadow: '0 20px 40px -10px rgba(124, 58, 237, 0.4)',
              minWidth: '180px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Start Free Trial
            <span style={{ marginLeft: '8px' }}>→</span>
          </Button>
          <Button
            size="large"
            style={{
              background: "transparent",
              border: "2px solid #a855f7",
              fontWeight: 500,
              fontSize: 18,
              padding: "0 40px",
              borderRadius: 12,
              height: 56,
              color: "#a855f7",
              backdropFilter: 'blur(10px)',
              minWidth: '180px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ marginRight: '8px' }}>▶</span>
            Watch Demo
          </Button>
        </motion.div>

        {/* Enhanced Responsive Stats Section */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'clamp(16px, 3vw, 32px)',
            marginBottom: 'clamp(48px, 8vw, 80px)',
            maxWidth: '1000px',
            margin: '0 auto clamp(48px, 8vw, 80px) auto',
            padding: '0 16px',
            width: '100%'
          }}
          className="stats-grid"
        >
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={statsVariants}
              whileHover={{
                scale: 1.05,
                y: -8,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              style={{
                textAlign: 'center',
                padding: 'clamp(20px, 4vw, 32px)',
                borderRadius: 'clamp(12px, 2vw, 20px)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                minHeight: 'clamp(120px, 15vw, 160px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              className="stat-card"
            >
              {/* Gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${
                  index === 0 ? 'rgba(168, 85, 247, 0.1)' :
                  index === 1 ? 'rgba(59, 130, 246, 0.1)' :
                  index === 2 ? 'rgba(16, 185, 129, 0.1)' :
                  'rgba(245, 158, 11, 0.1)'
                } 0%, transparent 100%)`,
                opacity: 0.6,
                pointerEvents: 'none'
              }} />
              
              {/* Icon with enhanced styling */}
              <motion.div 
                style={{ 
                  fontSize: 'clamp(28px, 6vw, 48px)', 
                  marginBottom: 'clamp(8px, 2vw, 16px)',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                  position: 'relative',
                  zIndex: 2
                }}
                whileHover={{
                  scale: 1.2,
                  rotate: [0, -10, 10, 0],
                  transition: { duration: 0.5 }
                }}
              >
                {stat.icon}
              </motion.div>
              
              {/* Value with gradient text */}
              <motion.div 
                style={{ 
                  fontSize: 'clamp(20px, 5vw, 32px)', 
                  fontWeight: 800, 
                  background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: 'clamp(4px, 1vw, 8px)',
                  position: 'relative',
                  zIndex: 2,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                {stat.value}
              </motion.div>
              
              {/* Label with improved typography */}
              <div style={{ 
                fontSize: 'clamp(12px, 2.5vw, 16px)', 
                color: '#d1d5db',
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                position: 'relative',
                zIndex: 2
              }}>
                {stat.label}
              </div>
              
              {/* Animated border accent */}
              <motion.div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: '60%',
                  height: '3px',
                  background: `linear-gradient(90deg, ${
                    index === 0 ? '#a855f7' :
                    index === 1 ? '#3b82f6' :
                    index === 2 ? '#10b981' :
                    '#f59e0b'
                  }, transparent)`,
                  borderRadius: '2px',
                  transform: 'translateX(-50%)',
                  opacity: 0.8
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: statsInView ? 1 : 0 }}
                transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          {erpServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={serviceVariants}
          style={{
            marginTop: '80px',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '48px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '16px'
          }}>
            Ready to revolutionize your business?
          </h2>
          <p style={{
            color: '#d1d5db',
            marginBottom: '32px',
            maxWidth: '600px',
            margin: '0 auto 32px auto',
            fontSize: '18px',
            lineHeight: 1.6
          }}>
            Join thousands of companies that have transformed their operations with our ERP solution.
          </p>
          <Button
            size="large"
            type="primary"
            style={{
              background: "linear-gradient(135deg, #059669, #0891b2)",
              border: "none",
              fontWeight: 600,
              fontSize: 16,
              padding: "0 32px",
              borderRadius: 12,
              height: 48,
              color: "#fff",
              boxShadow: '0 20px 40px -10px rgba(5, 150, 105, 0.4)'
            }}
          >
            Get Started Today
          </Button>
        </motion.div>
      </motion.div>

      <style jsx>{`
        /* Enhanced Responsive Stats Section Styles */
        .stats-grid {
          /* Mobile First Approach */
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        /* Small Mobile (320px+) */
        @media (min-width: 320px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .stat-card {
            min-height: 100px !important;
            padding: 16px 12px !important;
          }
        }
        
        /* Standard Mobile (375px+) */
        @media (min-width: 375px) {
          .stats-grid {
            gap: 16px;
          }
          .stat-card {
            min-height: 110px !important;
            padding: 18px 14px !important;
          }
        }
        
        /* Large Mobile (480px+) */
        @media (min-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .stat-card {
            min-height: 120px !important;
            padding: 20px 16px !important;
          }
        }
        
        /* Small Tablet (640px+) */
        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }
          .stat-card {
            min-height: 140px !important;
            padding: 24px 20px !important;
          }
        }
        
        /* Standard Tablet (768px+) */
        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 28px;
            max-width: 900px;
          }
          .stat-card {
            min-height: 150px !important;
            padding: 28px 24px !important;
          }
        }
        
        /* Large Tablet (1024px+) */
        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 32px;
            max-width: 1000px;
          }
          .stat-card {
            min-height: 160px !important;
            padding: 32px 28px !important;
          }
        }
        
        /* Desktop (1200px+) */
        @media (min-width: 1200px) {
          .stats-grid {
            gap: 36px;
          }
          .stat-card {
            min-height: 170px !important;
            padding: 36px 32px !important;
          }
        }
        
        /* Large Desktop (1600px+) */
        @media (min-width: 1600px) {
          .stats-grid {
            gap: 40px;
          }
          .stat-card {
            min-height: 180px !important;
            padding: 40px 36px !important;
          }
        }
        
        /* Landscape Mobile Orientation */
        @media (max-height: 500px) and (orientation: landscape) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 16px !important;
            margin-bottom: 32px !important;
          }
          .stat-card {
            min-height: 80px !important;
            padding: 12px 8px !important;
          }
        }
        
        /* Portrait Tablet Optimization */
        @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            max-width: 600px;
          }
          .stat-card {
            min-height: 180px !important;
            padding: 32px 24px !important;
          }
        }
        
        /* Touch Device Optimization */
        @media (hover: none) and (pointer: coarse) {
          .stat-card {
            transform: none !important;
            transition: background-color 0.3s ease !important;
          }
          .stat-card:active {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%) !important;
          }
        }
        
        /* High DPI Display Optimization */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .stat-card {
            border-width: 0.5px;
          }
        }
        
        /* Reduced Motion Preference */
        @media (prefers-reduced-motion: reduce) {
          .stat-card {
            transition: none !important;
          }
          .stat-card * {
            animation: none !important;
            transition: none !important;
          }
        }
        
        /* Service Cards Responsive Styles */
        @media (max-width: 768px) {
          .service-card {
            min-height: 200px !important;
            padding: 24px 20px !important;
          }
        }
        @media (max-width: 480px) {
          .service-card {
            min-height: 180px !important;
            padding: 20px 16px !important;
          }
        }
        
        /* Particle Effects */
        .particle {
          pointer-events: none;
          z-index: 1;
        }
        
        /* Stats Grid Container Responsive Behavior */
        .stats-grid {
          transition: all 0.3s ease;
        }
        
        /* Stat Card Hover Effects for Desktop */
        @media (hover: hover) and (pointer: fine) {
          .stat-card:hover {
            transform: translateY(-8px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }
      `}</style>
    </section>
  );
};
