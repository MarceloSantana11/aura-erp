import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-2xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center mb-4 ring-8 ring-rose-50/50">
        <Icon className="w-7 h-7" />
      </div>

      <h3 className="app-card-title font-bold text-slate-900 text-base md:text-lg mb-1.5">
        {title}
      </h3>

      <p className="app-secondary text-slate-500 max-w-md text-xs md:text-sm leading-relaxed mb-6">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {primaryAction && (
            <Button
              variant="primary"
              icon={primaryAction.icon}
              onClick={primaryAction.onClick}
              fullWidthMobile
            >
              {primaryAction.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              variant="outline"
              icon={secondaryAction.icon}
              onClick={secondaryAction.onClick}
              fullWidthMobile
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
