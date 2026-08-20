import React from 'react';

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, disabled = false, className = "" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1.5 text-sm font-medium rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`px-3 py-1.5 text-sm rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className || ''}`}
  />
);