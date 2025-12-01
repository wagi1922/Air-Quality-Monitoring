import React, { useState, useRef, useEffect } from 'react';

interface DataPoint {
  time: string;
  level: number;
}

interface LineChartProps {
  data: DataPoint[];
  unit?: string;
  color?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, unit = "", color = "#3B82F6" }) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const height = 300;
  const paddingX = 50;
  const paddingY = 40; 
  
  if (!data || data.length === 0) {
    return <div className="h-[300px] w-full flex items-center justify-center text-gray-400">Menunggu data...</div>;
  }

  const chartWidth = width - (paddingX * 2);
  const chartHeight = height - (paddingY * 2);

  const maxLevel = Math.max(...data.map(d => d.level));
  const minLevel = Math.min(...data.map(d => d.level));
  
  let yMax = maxLevel;
  let yMin = minLevel;
  
  if (yMax === yMin) {
    yMax = maxLevel + 1;
    yMin = maxLevel - 1;
  } else {
   
    const buffer = (maxLevel - minLevel) * 0.1;
    yMax = maxLevel + buffer;
    yMin = Math.max(0, minLevel - buffer);
  }

  const yRange = yMax - yMin;

  
  const getX = (index: number) => {
    if (data.length === 1) return paddingX + (0.5 * chartWidth);
    return paddingX + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (level: number) => {
    const normalizedY = (level - yMin) / yRange;
    return (height - paddingY) - (normalizedY * chartHeight);
  };

  const createPath = () => {
    if (data.length === 0) return "";

    if (data.length === 1) {
        const y = getY(data[0].level);
        return `M ${paddingX} ${y} L ${width - paddingX} ${y}`;
    }

    let path = `M ${getX(0)} ${getY(data[0].level)}`;
    for (let i = 1; i < data.length; i++) {
      const x = getX(i);
      const y = getY(data[i].level);
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1].level);
      
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = x - (x - prevX) / 2;
      const cp2y = y;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`;
    }
    return path;
  };

  const linePath = createPath();

  const createAreaPath = () => {
     if (data.length === 1) {
        const y = getY(data[0].level);
        return `M ${paddingX} ${y} L ${width - paddingX} ${y} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;
     }
     return `${linePath} L ${getX(data.length - 1)} ${height - paddingY} L ${getX(0)} ${height - paddingY} Z`;
  }

  return (
    <div ref={containerRef} className="w-full h-[300px]">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const val = yMin + (yRange * ratio);
          const yPos = (height - paddingY) - (ratio * chartHeight);
          
          const label = val % 1 === 0 ? val : val.toFixed(1);

          return (
            <g key={ratio}>
              <line 
                x1={paddingX} y1={yPos} 
                x2={width - paddingX} y2={yPos} 
                stroke="#e5e7eb" strokeDasharray="4 4" 
              />
              <text 
                x={paddingX - 10} y={yPos + 4} 
                textAnchor="end" fontSize="10" fill="#9ca3af"
              >
                {label}
              </text>
            </g>
          );
        })}

        <path d={createAreaPath()} fill="url(#chartGradient)" />

        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <g key={i} className="group">
            <circle
              cx={getX(i)}
              cy={getY(d.level)}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
              className="transition-all hover:r-6 cursor-pointer"
            />
            <foreignObject 
              x={getX(i) - 50} 
              y={getY(d.level) - 50} 
              width="100" 
              height="50" 
              className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-50">
                  <span className="font-bold">{d.time}</span>: {d.level} {unit}
                </div>
              </div>
            </foreignObject>
          </g>
        ))}

        {data.map((d, i) => {
          const step = data.length > 8 ? Math.ceil(data.length / 6) : 1;
          if (i % step !== 0 && i !== data.length - 1) return null;

          return (
            <text
              key={i}
              x={getX(i)}
              y={height - paddingY + 20}
              textAnchor="middle"
              fontSize="11"
              fill="#6b7280"
            >
              {d.time}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default LineChart;