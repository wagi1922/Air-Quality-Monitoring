import React from 'react';

interface DataPoint {
  time: string;
  level: number;
}

interface LineChartProps {
  data: DataPoint[];
  unit?: string; // Menambahkan prop opsional untuk satuan (default: "")
  color?: string; // Menambahkan prop opsional untuk warna grafik
}

const LineChart: React.FC<LineChartProps> = ({ data, unit = "", color = "#3B82F6" }) => {
  const width = 700;
  const height = 320;
  const padding = 80;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxLevel = Math.max(...data.map(d => d.level));
  const minLevel = Math.min(...data.map(d => d.level));
  // Mencegah pembagian dengan nol jika max dan min sama
  const range = (maxLevel - minLevel) || (maxLevel * 0.1) || 10; 

  // Create smooth curve path
  const createSmoothPath = (data: DataPoint[]) => {
    if (data.length < 2) return '';
    
    let path = '';
    for (let i = 0; i < data.length; i++) {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      // Menyesuaikan y agar tidak terlalu mepet ke atas/bawah
      const normalizedY = (data[i].level - minLevel) / range;
      const y = (height - padding) - (normalizedY * chartHeight);
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        const prevX = padding + ((i - 1) / (data.length - 1)) * chartWidth;
        const prevNormalizedY = (data[i - 1].level - minLevel) / range;
        const prevY = (height - padding) - (prevNormalizedY * chartHeight);
        
        const cpX1 = prevX + (x - prevX) / 3;
        const cpX2 = x - (x - prevX) / 3;
        path += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
      }
    }
    return path;
  };

  const smoothPath = createSmoothPath(data);

  return (
    <div className="w-full h-80 flex items-center justify-center overflow-x-auto">
      <svg 
        width={width} 
        height={height} 
        className="rounded-lg min-w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <filter id="chartLineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines & Y-axis Labels */}
        {[0, 25, 50, 75, 100].map((percentage) => {
          // Menghitung label Y-axis berdasarkan range data asli
          const value = minLevel + (range * (percentage / 100));
          const y = (height - padding) - ((percentage / 100) * chartHeight);
          
          return (
            <g key={percentage}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke={color}
                strokeOpacity="0.12"
                strokeDasharray="6,12"
                strokeWidth="1"
              />
              <text
                x={padding - 15}
                y={y + 5}
                textAnchor="end"
                fontSize="11"
                fill="#6B7280"
                fontFamily="Inter, Poppins, sans-serif"
                fontWeight="500"
              >
                {Math.round(value)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {data.filter((_, index) => index % 2 === 0).map((item, index) => {
          const x = padding + (index * 2 / (data.length - 1)) * chartWidth;
          return (
            <text
              key={index}
              x={x}
              y={height - padding + 30}
              textAnchor="middle"
              fontSize="12"
              fill="#6B7280"
              fontFamily="Inter, Poppins, sans-serif"
              fontWeight="500"
            >
              {item.time}
            </text>
          );
        })}

        {/* Area fill */}
        <path
          d={`${smoothPath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#chartAreaGradient)"
        />

        {/* Smooth line with enhanced glow */}
        <path
          d={smoothPath}
          fill="none"
          stroke={color}
          strokeWidth="4"
          filter="url(#chartLineGlow)"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`, // 80 is hex opacity
          }}
        />

        {/* Data points */}
        {data.map((item, index) => {
          // Recalculate y for points using the same logic as path
          const normalizedY = (item.level - minLevel) / range;
          const y = (height - padding) - (normalizedY * chartHeight);
          const x = padding + (index / (data.length - 1)) * chartWidth;
          
          return (
            <g key={index} className="group">
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={color}
                stroke="white"
                strokeWidth="3"
                className="transition-all duration-300 hover:r-8 cursor-pointer"
                style={{
                  filter: `drop-shadow(0 0 8px ${color}66)`,
                }}
              />
              {/* Tooltip sederhana saat hover */}
              <title>{`${item.time}: ${item.level} ${unit}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;