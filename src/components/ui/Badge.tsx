'use client';

import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    success: 'bg-[#57b78a]/15 text-[#57b78a]',
    warning: 'bg-[#e6a66f]/15 text-[#e6a66f]',
    danger: 'bg-[#fb764a]/15 text-[#fb764a]',
    info: 'bg-[#7fd1cd]/15 text-[#7fd1cd]',
    default: 'bg-[var(--hover-bg)] text-[var(--sidenav-item)]',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
