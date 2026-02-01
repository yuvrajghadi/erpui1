'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import PageProgressBar from './PageProgressBar';

interface ProgressBarContextType {
  startLoading: () => void;
  stopLoading: () => void;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const ProgressBarContext = createContext<ProgressBarContextType | undefined>(undefined);

export const useProgressBar = () => {
  const context = useContext(ProgressBarContext);
  if (!context) {
    throw new Error('useProgressBar must be used within a ProgressBarProvider');
  }
  return context;
};

export const ProgressBarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Start loading when component mounts
    startLoading();
    
    // Simulate initial page load
    const timer = setTimeout(() => {
      stopLoading();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setProgress(100);
    // Reset progress after animation completes
    setTimeout(() => setProgress(0), 400);
  };

  return (
    <ProgressBarContext.Provider value={{ progress, setProgress, startLoading, stopLoading }}>
      {children}
      <PageProgressBar isLoading={isLoading} />
    </ProgressBarContext.Provider>
  );
}; 