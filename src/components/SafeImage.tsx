import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ 
  src, 
  alt, 
  className, 
  fallbackText,
  ...props 
}) => {
  const [error, setError] = useState(false);

  // High-reliability curated SVG Data URIs for dishes if network fails
  const getFallbackGradient = (name: string = '') => {
    const charCode = name.charCodeAt(0) || 65;
    if (charCode % 4 === 0) return 'from-rose-900 to-amber-900';
    if (charCode % 4 === 1) return 'from-indigo-900 to-blue-900';
    if (charCode % 4 === 2) return 'from-emerald-900 to-teal-900';
    return 'from-purple-900 to-pink-900';
  };

  if (error || !src) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${getFallbackGradient(alt)} flex flex-col items-center justify-center p-3 text-center border border-white/10 ${className || ''}`}>
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-coral-300 mb-1">
          <Utensils className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold text-white truncate max-w-full px-2">
          {alt || fallbackText || 'Dish Photo'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
};

