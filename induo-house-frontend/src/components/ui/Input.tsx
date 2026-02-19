'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900',
              'placeholder:text-slate-400',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
              'hover:border-slate-300',
              leftIcon && 'pl-10',
              error
                ? 'border-red-400 focus:ring-red-400/20 focus:border-red-400'
                : 'border-slate-200',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
