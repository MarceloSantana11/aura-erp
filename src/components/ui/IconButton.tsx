import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  variant = 'outline',
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    sm: 'p-1.5 min-w-[36px] min-h-[36px]',
    md: 'p-2.5 min-w-[44px] min-h-[44px]',
    lg: 'p-3 min-w-[48px] min-h-[48px]',
  };

  const variantStyles = {
    primary: 'bg-rose-800 text-white hover:bg-rose-900 border border-rose-800',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900',
    outline: 'bg-white text-slate-600 hover:text-rose-800 hover:bg-rose-50/80 border border-slate-200',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100',
  };

  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center rounded-xl transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-800 touch-target select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      <Icon className="w-5 h-5 shrink-0" />
    </button>
  );
};
