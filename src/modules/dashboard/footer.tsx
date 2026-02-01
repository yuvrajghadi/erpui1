'use client';

import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter = () => {
  return <Footer style={{ textAlign: 'center' }}> ©{new Date().getFullYear()} Powered by The Original Software.</Footer>;
};

export default AppFooter;
