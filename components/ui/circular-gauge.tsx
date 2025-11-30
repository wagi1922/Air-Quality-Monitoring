import React from 'react';
import { Thermometer, ThermometerSun, ThermometerSnowflake } from 'lucide-react';

interface CircularGauge {
  value: number;
  size?: number;
}

const CircularGauge: React.FC<CircularGauge> = ({ value, size = 220 }) => {
    const radius = size / 2 - 25;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    const getStatus = (val: number) => {
      if (val >= 35) return "Panas";
      if (val <= 25) return "Dingin";
      return "Normal";
    };

    const getIcon = (val: number) => {
      if (val >= 35) {
        return <ThermometerSun className="w-5 h-5 text-blue-500" />;
      } else if (val <= 25) {
        return <ThermometerSnowflake className="w-5 h-5 text-blue-500" />;
      } else {
        return <Thermometer className="w-5 h-5 text-blue-500" />;
      }
    };

    return (
      <div className="flex items-center justify-center">
        <div className="relative animate-float">
          <svg width={size} height={size} className="transform -rotate-90">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="30%" stopColor="#3B82F6" />
                <stop offset="70%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                <stop offset="100%" stopColor="rgba(147, 197, 253, 0.05)" />
              </linearGradient>
            </defs>
            
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#backgroundGradient)"
              strokeWidth="18"
              fill="transparent"
            />
            
            {/* Progress circle with enhanced glow */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="18"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              filter="url(#glow)"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))',
              }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-900 mb-3 drop-shadow-sm">
                {value}℃
              </div>
              <div className="flex items-center justify-center space-x-2">
                {/* Render ikon secara dinamis */}
                {getIcon(value)}
                <span className={`text-sm font-medium ${
                  value >= 60 ? 'text-red-600' : value <= 25 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {getStatus(value)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CircularGauge;