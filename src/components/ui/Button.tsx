import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ElementType;
  fullWidthMobile?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  fullWidthMobile = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98] touch-target select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs min-h-[36px] gap-1.5',
    md: 'px-4 py-2.5 text-sm min-h-[44px] gap-2',
    lg: 'px-5 py-3 text-base min-h-[48px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-rose-800 hover:bg-rose-900 text-white shadow-xs hover:shadow-sm active:bg-rose-950 border border-rose-800',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow-sm active:bg-slate-950 border border-slate-900',
    outline:
      'bg-white hover:bg-rose-50/80 text-slate-700 hover:text-rose-900 border border-slate-200 hover:border-rose-200 shadow-2xs',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
    destructive:
      'bg-red-600 hover:bg-red-700 text-white shadow-xs border border-red-600',
  };

  const widthStyle = fullWidthMobile ? 'w-full sm:w-auto' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
