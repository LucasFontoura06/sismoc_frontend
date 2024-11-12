import { LineChart } from '@mui/x-charts/LineChart';
import React, { useState, useEffect, useRef } from 'react';
import { CONSTANTES } from '@/common/constantes';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { useTheme } from '@mui/material/styles';

interface Mes {
    total: number;
}

interface SimpleAreaChartProps {
    textColor?: string;
    meses: Mes[];
}

const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({ meses }) => {
    const theme = useTheme();
    const textColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000';

    const xLabels = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
    ];

    const [data, setData] = useState<number[]>([]);
    const chartContainerRef = useRef<HTMLDivElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 300 });

    useEffect(() => {
        const chartData = meses.map((m) => m.total || 0);
        setData(chartData);
    }, [meses]);

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                setDimensions({
                    width: chartContainerRef.current.offsetWidth,
                    height: chartContainerRef.current.offsetHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }}>
            <LineChart
                width={dimensions.width}
                height={dimensions.height}
                series={[
                    {
                        data: data,
                        area: true,
                        showMark: false,
                        color: theme.palette.primary.main,
                    },
                ]}
                grid={{ 
                    vertical: false,
                    horizontal: true,
                }}
                xAxis={[{ 
                    scaleType: 'point', 
                    data: xLabels,
                }]}
                sx={{
                    [`.${axisClasses.root}`]: {
                        [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                            stroke: textColor,
                            strokeWidth: 1,
                        },
                        [`.${axisClasses.tickLabel}`]: {
                            fill: textColor,
                            fontSize: '0.75rem',
                        },
                    },
                    '.MuiLineChart-series': {
                        '& path': {
                            stroke: theme.palette.primary.main,
                            fill: `${theme.palette.primary.main}1A`,
                        },
                    },
                }}
            />
        </div>
    );
};

export default SimpleAreaChart;
