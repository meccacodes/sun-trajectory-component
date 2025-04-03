"use client";

import { FC, useEffect, useState } from 'react';
import styles from './SunTrajectory.module.css';

interface SunTrajectoryProps {
  sunriseTime: string; // Format: "HH:mm"
  sunsetTime: string;  // Format: "HH:mm"
}

const SunTrajectory: FC<SunTrajectoryProps> = ({ sunriseTime, sunsetTime }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

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

  const progress = Math.max(0, Math.min(1, 
    (currentTime - sunriseHours) / (sunsetHours - sunriseHours)
  ));

  // Padding calculation (5% of the smallest dimension)
  const padding = Math.min(dimensions.width, dimensions.height) * 0.05;

  // Calculate control points for the quadratic curve
  const startX = padding;
  const startY = dimensions.height - padding;
  const endX = dimensions.width - padding;
  const endY = dimensions.height - padding;
  const controlX = dimensions.width / 2;
  const controlY = padding;

  // Calculate current sun position along the curve
  const currentX = startX + (endX - startX) * progress;
  const currentY = startY - Math.sin(progress * Math.PI) * (startY - controlY);

  // Sun size (4% of the smallest dimension)
  const sunRadius = Math.min(dimensions.width, dimensions.height) * 0.04;
  
  // Font size (3% of the smallest dimension)
  const fontSize = Math.min(dimensions.width, dimensions.height) * 0.03;

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null; // Don't render until we have dimensions
  }

  return (
    <div className={styles.container}>
      <svg 
        width="100%" 
        height="100%" 
        className={styles.svg}
      >
        {/* Simple black background */}
        <rect 
          width="100%" 
          height="100%" 
          fill="#000000" 
        />
        
        {/* Sun trajectory path */}
        <path
          d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
          className={styles.trajectoryPath}
          strokeWidth={Math.max(2, dimensions.width * 0.002)}
        />

        {/* Current sun position */}
        <circle
          cx={currentX}
          cy={currentY}
          r={sunRadius}
          className={styles.sun}
        >
          <animate
            attributeName="r"
            values={`${sunRadius};${sunRadius * 1.1};${sunRadius}`}
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Time labels */}
        <text 
          x={padding}
          y={dimensions.height - padding / 2}
          className={styles.timeLabel}
          style={{ fontSize: `${fontSize}px` }}
        >
          {sunriseTime}
        </text>
        <text 
          x={dimensions.width - padding - (fontSize * 4)} 
          y={dimensions.height - padding / 2}
          className={styles.timeLabel}
          style={{ fontSize: `${fontSize}px` }}
        >
          {sunsetTime}
        </text>
      </svg>
    </div>
  );
};

export default SunTrajectory; 