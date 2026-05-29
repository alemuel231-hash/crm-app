'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  options,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--sidenav-item)] mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:border-[#39379e] focus:ring-1 focus:ring-[#39379e] ${
          error ? 'border-[#fb764a]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-[#fb764a] mt-1">{error}</p>}
    </div>
  );
}
