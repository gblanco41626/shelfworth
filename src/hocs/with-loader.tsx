'use client';

import type { ComponentType, ReactNode } from 'react';

interface LoaderProps {
  isLoading: boolean
  error?: string | Error | null
  hasData?: boolean
  loadingComponent?: ReactNode
  errorComponent?: ReactNode
  emptyComponent?: ReactNode
  minHeight?: string
  className?: string
}

interface WithLoaderOptions {
  defaultLoadingComponent?: ReactNode
  defaultErrorComponent?: ReactNode
  defaultEmptyComponent?: ReactNode
  showEmptyState?: boolean
  minHeight?: string
  className?: string
}

export default function withLoader<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: WithLoaderOptions = {},
) {
  const {
    defaultLoadingComponent,
    defaultErrorComponent,
    defaultEmptyComponent,
    showEmptyState = false,
    minHeight = 'auto',
    className = '',
  } = options;

  return function LoaderWrappedComponent(props: T & LoaderProps) {
    const {
      isLoading,
      error,
      hasData = true,
      loadingComponent,
      errorComponent,
      emptyComponent,
      minHeight: propMinHeight = minHeight,
      className: propClassName = className,
      ...restProps
    } = props;

    const containerStyle = {
      minHeight: propMinHeight,
    };

    const containerClasses = `${propClassName} ${propMinHeight !== 'auto' ? 'flex items-center justify-center' : ''}`;

    // Error State
    if (error) {
      const ErrorComponent = errorComponent || defaultErrorComponent || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 text-sm">
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      );

      return (
        <div className={containerClasses} style={containerStyle}>
          {ErrorComponent}
        </div>
      );
    }

    // Loading State
    if (isLoading) {
      const LoadingComponent = loadingComponent || defaultLoadingComponent || (
        <div className="flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      );

      return (
        <div className={containerClasses} style={containerStyle}>
          {LoadingComponent}
        </div>
      );
    }

    // Empty State
    if (showEmptyState && !hasData) {
      const EmptyComponent = emptyComponent || defaultEmptyComponent || (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 mb-4 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data found</h3>
          <p className="text-gray-500 text-sm">There&apos;s nothing to display right now.</p>
        </div>
      );

      return (
        <div className={containerClasses} style={containerStyle}>
          {EmptyComponent}
        </div>
      );
    }

    // Render actual component
    return <WrappedComponent {...(restProps as unknown as T)} />;
  };
}
