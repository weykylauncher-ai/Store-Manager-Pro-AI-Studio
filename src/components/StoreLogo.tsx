import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'mark' | 'full' | 'banner';
}

/**
 * Official Store Manager Pro Visual Identity (The Pivot Module)
 * Palette:
 * - Deep Navy: #07182B (Dominant field, 60%)
 * - Corporate Teal: #159EAA (Sparse focus action, 10%)
 * - Metallic Silver: #C5CDD5 (Structure & balance, 15%)
 * - Pure White: #FFFFFF (Clarity, 15%)
 */
export const StoreLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'mark',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  // SVG representation of the Pivot Module (3x3 grid)
  const LogoIcon = (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeMap[size]} ${className} shrink-0 drop-shadow-md`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Container subtle rounded block */}
      <rect width="100" height="100" rx="16" fill="#07182B" />

      {/* The 4 Interlocking Pivot Module Rectangles on a 3x3 proportional grid */}
      {/* 1. Top Horizontal Rectangle (Pure White #FFFFFF) */}
      <rect x="18" y="18" width="41" height="20" rx="2" fill="#FFFFFF" />

      {/* 2. Right Vertical Rectangle (Corporate Teal #159EAA) */}
      <rect x="62" y="18" width="20" height="41" rx="2" fill="#159EAA" />

      {/* 3. Bottom Horizontal Rectangle (Metallic Silver #C5CDD5) */}
      <rect x="41" y="62" width="41" height="20" rx="2" fill="#C5CDD5" />

      {/* 4. Left Vertical Rectangle (Metallic Silver #C5CDD5) */}
      <rect x="18" y="41" width="20" height="41" rx="2" fill="#C5CDD5" />
    </svg>
  );

  if (variant === 'mark') {
    return LogoIcon;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {LogoIcon}
      <div className="flex flex-col text-right">
        <span className="font-brand font-black tracking-wider text-white text-base leading-tight">
          STORE MANAGER
        </span>
        <span className="font-brand font-semibold tracking-[0.3em] text-[#159EAA] text-xs">
          P R O
        </span>
      </div>
    </div>
  );
};
