'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProgressBarProps {
  isLoading: boolean;
}

const PageProgressBar: React.FC<PageProgressBarProps> = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((old) => {
          if (old >= 90) return old;
          const increment = Math.random() * 10;
          return Math.min(old + increment, 90);
        });
      }, 100);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 400);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {(isLoading || progress > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear', duration: 0.2 }}
            style={{
              height: 4,
              background: 'linear-gradient(90deg, #1677ff, #3b82f6)',
              boxShadow: '0 0 12px #1677ff88',
              borderRadius: 2,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageProgressBar; 