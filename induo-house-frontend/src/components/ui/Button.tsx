'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:ring-blue-500 shadow-sm hover:shadow-md',
      secondary:
        'bg-slate-800 text-white hover:bg-slate-900 active:bg-slate-950 focus-visible:ring-slate-500 shadow-sm hover:shadow-md',
      outline:
        'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400 shadow-sm',
      ghost:
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
      danger:
        'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 focus-visible:ring-red-400 shadow-sm hover:shadow-md',
      white:
        'bg-white text-blue-600 hover:bg-blue-50 focus-visible:ring-blue-400 shadow-sm hover:shadow-md',
    };

    const sizes = {
      xs: 'px-2.5 py-1.5 text-xs gap-1',
      sm: 'px-3.5 py-2 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
