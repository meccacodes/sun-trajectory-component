'use client'

import { FC } from 'react';
import styles from './SunTrajectory.module.css';

interface SunTrajectoryProps {
  sunriseTime: string; // Format: "HH:mm"
  sunsetTime: string;  // Format: "HH:mm"
}

const SunTrajectory: FC<SunTrajectoryProps> = ({ sunriseTime, sunsetTime }) => {
  // Convert times to numbers for calculation (hours since midnight)
  const getTimeInHours = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours + minutes / 60;
  };

  const sunriseHours = getTimeInHours(sunriseTime);
  const sunsetHours = getTimeInHours(sunsetTime);
  const currentTime = getTimeInHours(new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  }));

  // Calculate the current position of the sun
  const progress = Math.max(0, Math.min(1, 
    (currentTime - sunriseHours) / (sunsetHours - sunriseHours)
  ));

  // SVG dimensions and calculations
  const width = 400;
  const height = 200;
  const padding = 40;

  // Calculate control points for the quadratic curve
  const startX = padding;
  const startY = height - padding;
  const endX = width - padding;
  const endY = height - padding;
  const controlX = width / 2;
  const controlY = padding;

  // Calculate current sun position along the curve
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY - Math.sin(progress * Math.PI) * (startY - controlY);

  return (
    <div className={styles.container}>
      <svg 
        width={width} 
        height={height} 
        className={styles.svg}
      >
        {/* Sky gradient */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" className={styles.gradientStart} />
            <stop offset="100%" className={styles.gradientEnd} />
          </linearGradient>
        </defs>
        
        <rect 
          width={width} 
          height={height} 
          fill="url(#skyGradient)" 
        />
        
        {/* Sun trajectory path */}
        <path
          d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
          className={styles.trajectoryPath}
        />

        {/* Current sun position */}
        <circle
          cx={currentX}
          cy={currentY}
          r="15"
          className={styles.sun}
        >
          <animate
            attributeName="r"
            values="15;17;15"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Time labels */}
        <text 
          x={padding} 
          y={height - 10} 
          className={styles.timeLabel}
        >
          {sunriseTime}
        </text>
        <text 
          x={width - padding - 40} 
          y={height - 10} 
          className={styles.timeLabel}
        >
          {sunsetTime}
        </text>
      </svg>
    </div>
  );
};

export default SunTrajectory;