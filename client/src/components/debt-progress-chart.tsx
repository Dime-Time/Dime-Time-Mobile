import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration } from "chart.js/auto";

interface DebtProgressChartProps {
  data: number[];
  labels: string[];
  className?: string;
  enableVariation?: boolean; // Only for demo/mock data
  freezeLast?: boolean; // Preserve real last value (default true)
}

export function DebtProgressChart({ data, labels, className = "", enableVariation = false, freezeLast = true }: DebtProgressChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  // Add deterministic realistic variation for demo/mock data only
  const addRealisticVariation = (originalData: number[], seed: string) => {
    if (!enableVariation) return originalData;
    
    // Simple seeded random function for deterministic results
    const seededRandom = (seedStr: string, index: number) => {
      const hash = (seedStr + index).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      return (Math.abs(hash) % 1000) / 1000;
    };
    
    // Process iteratively to maintain monotonic decrease
    const variedData = [...originalData];
    
    // Apply variation to middle points
    for (let index = 1; index < originalData.length - 1; index++) {
      const value = originalData[index];
      
      // Add realistic deterministic fluctuations (±8% variation)
      const random = seededRandom(seed, index);
      const variationPercent = (random - 0.5) * 0.16; // ±8% max
      const variation = value * variationPercent;
      
      // Ensure we don't go above the previous VARIED value to maintain downward trend
      const prevVariedValue = variedData[index - 1];
      const maxValue = prevVariedValue * 0.995; // At least 0.5% reduction from previous varied point
      
      variedData[index] = Math.max(Math.min(value + variation, maxValue), 0);
    }
    
    // If freezeLast is true, preserve the original last value and do a backward pass
    if (freezeLast) {
      // Keep the original last value intact
      variedData[variedData.length - 1] = originalData[originalData.length - 1];
      
      // Backward pass to ensure monotonicity without changing the last value
      for (let index = variedData.length - 2; index >= 0; index--) {
        if (variedData[index] < variedData[index + 1]) {
          // If we need to ensure non-increasing trend, adjust this point
          variedData[index] = Math.max(variedData[index], variedData[index + 1]);
        }
      }
    } else {
      // Original behavior for when we don't need to freeze the last point
      const lastIndex = variedData.length - 1;
      const secondToLastIndex = lastIndex - 1;
      if (secondToLastIndex >= 0 && variedData[lastIndex] > variedData[secondToLastIndex]) {
        variedData[lastIndex] = Math.min(variedData[lastIndex], variedData[secondToLastIndex] * 0.98);
      }
    }
    
    return variedData;
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Use canvas height for proper gradient scaling
    const canvasHeight = canvasRef.current.height || 400;
    
    // Create seed from labels for deterministic variation
    const seed = labels.join('-');
    const variedData = addRealisticVariation(data, seed);

    // Create gradient for the line using actual canvas height
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, 'hsl(271, 81%, 66%)');
    gradient.addColorStop(0.5, 'hsl(271, 81%, 56%)');
    gradient.addColorStop(1, 'hsl(271, 81%, 46%)');

    // Create gradient for the fill area using actual canvas height
    const fillGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    fillGradient.addColorStop(0, 'hsl(271, 81%, 66%, 0.2)');
    fillGradient.addColorStop(0.7, 'hsl(271, 81%, 66%, 0.1)');
    fillGradient.addColorStop(1, 'hsl(271, 81%, 66%, 0.05)');

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Total Debt',
          data: variedData,
          borderColor: gradient,
          backgroundColor: fillGradient,
          borderWidth: 3,
          tension: 0.3,
          cubicInterpolationMode: 'monotone',
          fill: true,
          pointBackgroundColor: 'hsl(271, 81%, 66%)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Total Debt: $${context.parsed.y.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: 'hsl(215, 16%, 47%)'
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'hsl(210, 40%, 95%)'
            },
            ticks: {
              color: 'hsl(215, 16%, 47%)',
              callback: function(value) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, labels, enableVariation, freezeLast]);

  return (
    <div className={`relative ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
