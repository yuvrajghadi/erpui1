'use client';

import React from 'react';
import { Steps } from 'antd';
import './stepper.scss';
import {
  FileTextOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCardAlt } from '@fortawesome/free-solid-svg-icons';

const { Step } = Steps;

type CommonStepperProps = {
  current: number;
  verificationTimeLeft?: string; // e.g. '24:00:00'
};

const CommonStepper: React.FC<CommonStepperProps> = ({ current, verificationTimeLeft }) => {
  return (
    <Steps current={current} responsive className="mb-8">
      <Step
        title="Onboarding"
        description="Fill out the onboarding form"
        icon={<FileTextOutlined />}
      />
      <Step
        title="Verification"
        description="We are verifying your information"
        subTitle={verificationTimeLeft ? `Left ${verificationTimeLeft}` : ''}
        icon={<SafetyOutlined />}
      />
      <Step
        title="Payment"
        description="Complete your subscription payment"
        icon={<FontAwesomeIcon icon={faCreditCardAlt} />}
      />
      <Step
        title="Done"
        description="Company profile successfully created"
        icon={<CheckCircleOutlined />}
      />
    </Steps>
  );
};

export default CommonStepper;
