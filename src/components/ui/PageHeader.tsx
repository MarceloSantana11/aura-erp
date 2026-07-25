import React from 'react';
import { Button, ButtonVariant } from './Button';

export interface HeaderAction {
  label: string;
  icon?: React.ElementType;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  primaryAction?: HeaderAction;
  secondaryActions?: HeaderAction[];
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  primaryAction,
  secondaryActions = [],
  children,
}) => {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Description */}
        <div className="min-w-0 flex-1">
          {badge && (
            <span className="inline-block px-2.5 py-0.5 mb-1.5 text-[11px] font-bold text-rose-800 bg-rose-100 rounded-md tracking-wider uppercase">
              {badge}
            </span>
          )}
          <h1 className="app-page-title tracking-tight text-slate-900">{title}</h1>
          {description && (
            <p className="app-secondary mt-1 text-slate-500 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {(primaryAction || secondaryActions.length > 0) && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
            {secondaryActions.map((act, idx) => (
              <Button
                key={idx}
                variant={act.variant || 'outline'}
                icon={act.icon}
                onClick={act.onClick}
                disabled={act.disabled}
                size="md"
              >
                {act.label}
              </Button>
            ))}

            {primaryAction && (
              <Button
                variant={primaryAction.variant || 'primary'}
                icon={primaryAction.icon}
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                size="md"
                fullWidthMobile
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Optional Filters, Tabs, or Search Controls */}
      {children && <div className="pt-2">{children}</div>}
    </div>
  );
};
