"use client";

import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { CONSTANTES } from '@/common/constantes';
import React from 'react';

interface ArcDesignProps {
  textColor?: string;
  value: number;
  fill?: string;
}

const ArcDesign: React.FC<ArcDesignProps> = ({ value, fill = '#1975d1', textColor = '#FFFFFF' }) => {
  const settings = {
    width: 100,
    height: 150,
    color: fill,
    value: value,
    valuelabel: `${value}%`,
    min: 0,
    max: 100,
  };

  return (
    <Gauge
      {...settings}
      cornerRadius="50%"
      sx={{
        [`& .${gaugeClasses.valueText}`]: {
          stroke: textColor, 
          strokeWidth: 1.7, 
          fill: textColor, 
          fontSize: 20,
        },
        [`& .${gaugeClasses.valueArc}`]: {
          fill: fill,
        },
        [`& .${gaugeClasses.referenceArc}`]: {
          fill: (theme) => theme.palette.text.disabled,
        },
      }}
    />
  );
};

export default ArcDesign;
