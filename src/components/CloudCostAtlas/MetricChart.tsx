import React, { useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import type { ApexOptions } from 'apexcharts';
import type { MetricId, ProviderId, ChartDataPoint } from './types';
import { METRICS, ATLAS_DATA, getMetricValue, getDefaultRegion } from './metricRegistry';

interface MetricChartProps {
  metricId: MetricId;
  selectedProvider: ProviderId | null;
  height?: number;
}

function formatValue(value: number, metricId: MetricId): string {
  const metric = METRICS[metricId];

  if (value === Infinity) return '∞';
  if (value === 0) return 'FREE';

  // Format based on unit
  if (metric.unit.includes('$/')) {
    if (value < 0.001) {
      return `$${(value * 1000000).toFixed(2)}µ`;
    }
    if (value < 1) {
      return `$${value.toFixed(4)}`;
    }
    return `$${value.toFixed(2)}`;
  }

  // For free tier (M req/mo)
  if (metric.unit.includes('M req')) {
    if (value === Infinity) return '∞';
    return `${value.toFixed(1)}M`;
  }

  return value.toString();
}

export default function MetricChart({
  metricId,
  selectedProvider,
  height = 300,
}: MetricChartProps) {
  const metric = METRICS[metricId];

  // Prepare chart data
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const data: ChartDataPoint[] = [];

    ATLAS_DATA.providers.forEach((provider) => {
      const region = getDefaultRegion(provider.id);
      const value = getMetricValue(provider.id, region, metricId);

      if (value !== undefined) {
        data.push({
          provider: provider.displayName,
          providerId: provider.id,
          value: value === Infinity ? 999999 : value, // Handle Infinity for sorting
          accent: provider.id === selectedProvider,
          color: provider.color,
        });
      }
    });

    // Sort: best values first (respecting metric.better direction)
    data.sort((a, b) => {
      if (metric.better === 'lower') {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });

    return data;
  }, [metricId, selectedProvider, metric.better]);

  // ApexCharts options
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 500,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        barHeight: '70%',
        dataLabels: {
          position: 'top',
        },
      },
    },
    colors: chartData.map((d) => d.color),
    dataLabels: {
      enabled: true,
      formatter: (val: any) => {
        const value = Number(val);
        return formatValue(value, metricId);
      },
      offsetX: 10,
      style: {
        fontSize: '12px',
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: chartData.map((d) => d.provider),
      labels: {
        formatter: (val: any) => formatValue(Number(val), metricId),
      },
      title: {
        text: metric.label,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => formatValue(val, metricId),
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: 'var(--ifm-color-emphasis-300)',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.15,
        },
      },
      active: {
        filter: {
          type: 'darken',
          value: 0.25,
        },
      },
    },
  };

  const series = [
    {
      name: metric.label,
      data: chartData.map((d) => d.value),
    },
  ];

  // Determine best provider
  const bestProvider = chartData[0];
  const bestText =
    metric.better === 'lower'
      ? `${bestProvider.provider} has the lowest cost`
      : `${bestProvider.provider} offers the highest value`;

  return (
    <div className="metric-chart-container">
      <div className="mb-3">
        <h4 className="text-lg font-semibold mb-1">{metric.label}</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          {metric.description}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">
            ✓ {bestText}
          </span>
        </div>
      </div>

      <BrowserOnly fallback={<div>Loading chart...</div>}>
        {() => {
          const Chart = require('react-apexcharts').default;
          return <Chart options={options} series={series} type="bar" height={height} />;
        }}
      </BrowserOnly>

      {/* Unit reference */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
        Unit: {metric.unit}
        {metric.better === 'higher' && ' (higher is better)'}
        {metric.better === 'lower' && ' (lower is better)'}
      </div>
    </div>
  );
}
