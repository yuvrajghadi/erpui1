"use client";
import { useState, useEffect } from "react";
import { Alert, Flex, Spin } from 'antd';
import './loader.scss'; // Import the stylesheet

function Loader() {
  const delay: number  = 100;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after the specified delay
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <>
    <Flex gap="middle" vertical>
      {
        loading && (<div className="fullscreen-spinner">
          <Spin tip="Loading...">
            <Alert
              message="Loading content"
              description="Please wait while we load the latest data for you..."
              type="info"
              showIcon
            />
          </Spin>
        </div>) 
      }
    </Flex>
    </>
  );
}

export default Loader;
