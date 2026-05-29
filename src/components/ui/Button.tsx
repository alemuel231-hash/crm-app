'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-offset-transparent';

  const variantStyles = {
    primary: 'bg-[#39379e] text-white hover:bg-[#2f2d8c] focus:ring-[#39379e]',
    secondary: 'bg-[#eff1fc] text-[#39379e] hover:bg-[#e0e1f7] focus:ring-[#39379e]',
    danger: 'bg-[#fb764a] text-white hover:bg-[#e86337] focus:ring-[#fb764a]',
    ghost: 'text-[#39379e] hover:bg-[#f8fafc] focus:ring-[#39379e]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
