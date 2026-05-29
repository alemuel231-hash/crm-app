'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--sidenav-item)] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:border-[#39379e] focus:ring-1 focus:ring-[#39379e] ${
          error ? 'border-[#fb764a]' : ''
        } ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-[#fb764a] mt-1">{error}</p>}
      {helperText && <p className="text-sm text-[var(--text-muted)] mt-1">{helperText}</p>}
    </div>
  );
}
