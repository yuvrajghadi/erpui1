'use client';

import React, { useState } from 'react';
import { Typography, Card, Button, Input, Space, Avatar, Row, Col, Radio } from 'antd';
import { CreditCardOutlined, QrcodeOutlined, PayCircleOutlined, AppleOutlined, BankOutlined, WalletOutlined } from '@ant-design/icons';
import Image from 'next/image';
import '../page.scss';
import CommonStepper from '@/components/shared/stepper/stepper';

const { Title, Text } = Typography;

export default function CompanyOnboardingForm() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const currentStep = 2; // Or 1, 2 — based on state or flow

  const handlePaymentMethodChange = (e: any) => {
    setPaymentMethod(e.target.value);
  };

  return (
    <section className="payment-section">
      <div className="common-stepper">
        <CommonStepper current={currentStep} verificationTimeLeft="24:00:00" />
      </div>

      <div className="min-h-screen bg-black/40 md:p-12 flex items-center justify-center onboard-main">
        <div className="md:w-1/2 flex justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-200 p-6 rounded-3xl shadow-xl h-full payment-banner"></div>
        
        <Card className="payment-banner-content w-full md:w-96 lg:w-1/3 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/90">
          <div className="text-center mb-10 bg-blue-100 rounded-lg shadow p-4">
            <Typography.Title level={4}>Select Payment Method</Typography.Title>

           {/* Payment Method Selection */}
           <Radio.Group
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            style={{ width: '100%' }}
          >
            <Row gutter={[16, 16]} justify="center" wrap={false}>
              <Col span={4}>
                <Radio.Button value="gpay" className="payment-radio-button">
                  <Avatar size={40} src="/gpay.png" />
                  <Text>Google Pay</Text>
                </Radio.Button>
              </Col>
              <Col span={4}>
                <Radio.Button value="phonepe" className="payment-radio-button">
                  <Avatar size={40} src="/phonepe.png" />
                  <Text>PhonePe</Text>
                </Radio.Button>
              </Col>
              <Col span={4}>
                <Radio.Button value="paytm" className="payment-radio-button">
                  <Avatar size={40} src="/paytm.png" />
                  <Text>Paytm</Text>
                </Radio.Button>
              </Col>
              <Col span={4}>
                <Radio.Button value="card" className="payment-radio-button">
                  <CreditCardOutlined style={{ fontSize: 24 }} />
                  <Text>Card</Text>
                </Radio.Button>
              </Col>
              <Col span={4}>
                <Radio.Button value="netbanking" className="payment-radio-button">
                  <span style={{ position: 'relative', width: 40, height: 40, display: 'inline-block' }}>
                    <Image
                      src="/assets/img/netbankingNew.png"
                      alt="Net Banking"
                      fill
                      sizes="40px"
                      style={{ objectFit: 'contain' }}
                    />
                  </span>
                  <Text>Net Banking</Text>
                </Radio.Button>
              </Col>
            </Row>
          </Radio.Group>

            {/* Payment Form (Card Payment as Default) */}
            {paymentMethod === 'card' && (
            <Card className="mt-6">
              <div className="flex justify-center mb-4">
                <Image
                  src="https://via.placeholder.com/150x80.png?text=VISA"
                  alt="Card Image"
                  width={150}
                  height={80}
                  unoptimized
                />
              </div>
              <Input placeholder="Card Number" maxLength={16} className="mb-3" />
              <Space className="w-full mb-3">
                <Input placeholder="Card Holder Name" className="w-1/2" />
                <Input placeholder="Expiry Date (MM/YY)" className="w-1/2" />
              </Space>
              <Input placeholder="CVV" maxLength={3} className="mb-3" />
              <Button type="primary" block size="large">
                Pay
              </Button>
            </Card>
          )}

             {/* UPI (GPay, PhonePe, Paytm) */}
          {(paymentMethod === 'gpay' || paymentMethod === 'phonepe' || paymentMethod === 'paytm') && (
            <Card className="mt-6">
              <Button type="primary" block size="large" icon={<QrcodeOutlined />} className="mt-4">
                Pay with {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}
              </Button>
            </Card>
          )}

          {/* Net Banking Option */}
          {paymentMethod === 'netbanking' && (
            <Card className="mt-6">
              <Button type="primary" block size="large" icon={<BankOutlined />} className="mt-4">
                Pay with Net Banking
              </Button>
            </Card>
          )}

          </div>
        </Card>
      </div>
    </section>
  );
}
