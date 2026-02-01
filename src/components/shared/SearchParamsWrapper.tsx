'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Custom hook that safely uses useSearchParams with Suspense boundary
 * This wrapper prevents the "deopted into client-side rendering" warning
 * 
 * Usage: Wrap your component that needs search params in SearchParamsProvider
 * and access params via the context or use the wrapped component pattern
 */

interface SearchParamsWrapperProps {
  children: (searchParams: URLSearchParams) => React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Internal component that uses useSearchParams
 */
const SearchParamsConsumer: React.FC<{ 
  children: (searchParams: URLSearchParams) => React.ReactNode 
}> = ({ children }) => {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
};

/**
 * Wrapper component that provides Suspense boundary for useSearchParams
 * Prevents CSR deopt warnings in Next.js 14+
 */
export const SearchParamsWrapper: React.FC<SearchParamsWrapperProps> = ({ 
  children, 
  fallback = null 
}) => {
  return (
    <Suspense fallback={fallback}>
      <SearchParamsConsumer>{children}</SearchParamsConsumer>
    </Suspense>
  );
};

/**
 * HOC to wrap a component that needs search params with Suspense
 */
export function withSearchParams<P extends object>(
  WrappedComponent: React.ComponentType<P & { searchParams: URLSearchParams }>
): React.FC<Omit<P, 'searchParams'>> {
  const WithSearchParams: React.FC<Omit<P, 'searchParams'>> = (props) => {
    return (
      <Suspense fallback={null}>
        <SearchParamsInjector {...(props as P)} WrappedComponent={WrappedComponent} />
      </Suspense>
    );
  };

  WithSearchParams.displayName = `WithSearchParams(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithSearchParams;
}

/**
 * Internal component for HOC pattern
 */
function SearchParamsInjector<P extends object>({ 
  WrappedComponent, 
  ...props 
}: P & { 
  WrappedComponent: React.ComponentType<P & { searchParams: URLSearchParams }> 
}) {
  const searchParams = useSearchParams();
  return <WrappedComponent {...(props as P)} searchParams={searchParams} />;
}

export default SearchParamsWrapper;
