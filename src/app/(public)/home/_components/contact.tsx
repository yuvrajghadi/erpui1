'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Form, 
  Input, 
  Button, 
  message, 
  Card, 
  Row, 
  Col, 
  Typography, 
  Divider,
  Space 
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

export default function ContactUsSection() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      message.success('Thank you! We will contact you shortly.');
      form.resetFields();
    } catch (error) {
      message.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    message.info('Form has been reset.');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
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
        ease: 'easeOut'
      }
    }
  };

  const socialIconVariants = {
    hover: {
      scale: 1.2,
      y: -2,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <div
      id="contact"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '40px 20px',
      }}
    >

      <Row justify="center" align="middle" style={{ width: '100%', zIndex: 1 }}>
        <Col xs={24} sm={22} md={20} lg={16} xl={14} xxl={12}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <Card
                style={{
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: `
                    0 20px 40px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.2)
                  `,
                  overflow: 'hidden',
                  maxWidth: '600px',
                  margin: '0 auto',
                }}
                bodyStyle={{ padding: '48px' }}
              >
                <motion.div variants={itemVariants}>
                  <Title
                    level={1}
                    style={{
                      textAlign: 'center',
                      marginBottom: '8px',
                      color: '#ffffff',
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                    }}
                  >
                    Let's Connect
                  </Title>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Paragraph
                    style={{
                      textAlign: 'center',
                      fontSize: '18px',
                      color: '#cbd5e1',
                      marginBottom: '40px',
                      maxWidth: '500px',
                      margin: '0 auto 40px auto',
                    }}
                  >
                    Have questions or want to discuss your project? We'd love to hear from you. 
                    Send us a message and we'll respond as soon as possible.
                  </Paragraph>
                </motion.div>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  size="large"
                  requiredMark={false}
                >
                  <motion.div variants={itemVariants}>
                    <Form.Item
                      label="Full Name"
                      name="fullName"
                      rules={[
                        { required: true, message: 'Please enter your full name' },
                        { min: 2, message: 'Name must be at least 2 characters' }
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Enter your full name"
                        style={{
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#ffffff'
                        }}
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email address' },
                        { type: 'email', message: 'Please enter a valid email address' }
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Enter your email address"
                        style={{
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#ffffff'
                        }}
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Form.Item
                      label="Phone Number"
                      name="phone"
                      rules={[
                        { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number' }
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Enter your phone number (optional)"
                        style={{
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#ffffff'
                        }}
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Form.Item
                      label="Message"
                      name="message"
                      rules={[
                        { required: true, message: 'Please enter your message' },
                        { min: 10, message: 'Message must be at least 10 characters' },
                        { max: 500, message: 'Message cannot exceed 500 characters' }
                      ]}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Tell us about your project or ask any questions..."
                        showCount
                        maxLength={500}
                        style={{
                          borderRadius: '10px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#ffffff'
                        }}
                      />
                    </Form.Item>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Row gutter={16} style={{ marginTop: '24px' }}>
                      <Col xs={24} sm={12}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            block
                            style={{
                              height: '48px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.12)',
                              backdropFilter: 'blur(20px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#ffffff',
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            Send Message
                          </Button>
                        </motion.div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            ghost
                            onClick={onReset}
                            block
                            style={{
                              height: '48px',
                              borderRadius: '10px',
                              borderColor: 'rgba(255, 255, 255, 0.2)',
                              color: '#e2e8f0',
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            Reset
                          </Button>
                        </motion.div>
                      </Col>
                    </Row>
                  </motion.div>
                </Form>

                <motion.div variants={itemVariants}>
                  <Divider style={{ margin: '40px 0 24px 0', borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                  
                  <div style={{ textAlign: 'center' }}>
                    <Paragraph style={{ marginBottom: '16px', color: '#94a3b8' }}>
                      Follow us on social media
                    </Paragraph>
                    <Space size="large">
                      <motion.a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={socialIconVariants}
                        whileHover="hover"
                        style={{
                          fontSize: '24px',
                          color: '#0077b5',
                          display: 'inline-block',
                        }}
                        aria-label="LinkedIn"
                      >
                        <LinkedinOutlined />
                      </motion.a>
                      <motion.a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={socialIconVariants}
                        whileHover="hover"
                        style={{
                          fontSize: '24px',
                          color: '#1da1f2',
                          display: 'inline-block',
                        }}
                        aria-label="Twitter"
                      >
                        <TwitterOutlined />
                      </motion.a>
                      <motion.a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={socialIconVariants}
                        whileHover="hover"
                        style={{
                          fontSize: '24px',
                          color: '#e2e8f0',
                          display: 'inline-block',
                        }}
                        aria-label="GitHub"
                      >
                        <GithubOutlined />
                      </motion.a>
                    </Space>
                  </div>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      {/* Global Styles */}
      <style jsx global>{`
        .ant-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f8fafc !important;
          border-radius: 10px !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          padding: 12px 16px !important;
          backdrop-filter: blur(20px) !important;
        }
        
        .ant-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
          font-weight: 400 !important;
        }
        
        .ant-input:focus,
        .ant-input:hover {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 8px 32px rgba(59, 130, 246, 0.1) !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }
        
        .ant-input-prefix {
          color: #94a3b8 !important;
          margin-right: 12px !important;
        }
        
        .ant-form-item-label > label {
          color: #e2e8f0 !important;
          font-weight: 600 !important;
        }
        
        .ant-form-item-explain-error {
          color: #f87171 !important;
        }
        
        .ant-btn-primary {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
          border: none !important;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.3) !important;
        }
        
        .ant-btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4) !important;
        }
        
        .ant-btn-default {
          background: rgba(255, 255, 255, 0.08) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          color: #e2e8f0 !important;
          backdrop-filter: blur(20px) !important;
        }
        
        .ant-btn-default:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: #ffffff !important;
          transform: translateY(-1px) !important;
        }
        
        .ant-divider-horizontal {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          .ant-card-body {
            padding: 24px !important;
          }
          
          .ant-form-item {
            margin-bottom: 16px !important;
          }
        }
      `}</style>
    </div>
  );
};
