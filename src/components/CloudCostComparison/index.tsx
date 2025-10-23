import React, { useState, useEffect, useMemo } from 'react';
import type { ApexOptions } from 'apexcharts';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface CloudPricing {
  name: string;
  computePer1MRequests: number; // Cost per 1M requests
  memoryPricePerGBSecond: number; // Cost per GB-second
  egressPricePerGB: number; // Cost per GB egress
  egressFreeGB: number; // Free egress tier per month
  color: string;
}

const CLOUD_PROVIDERS: CloudPricing[] = [
  {
    name: 'AWS Lambda',
    computePer1MRequests: 0.20,
    memoryPricePerGBSecond: 0.0000166667,
    egressPricePerGB: 0.09, // $0.09/GB to internet
    egressFreeGB: 100, // 100GB free per month
    color: '#FF9900', // AWS Orange
  },
  {
    name: 'Google Cloud',
    computePer1MRequests: 0.40,
    memoryPricePerGBSecond: 0.0000025,
    egressPricePerGB: 0.12, // $0.12/GB (generally more expensive)
    egressFreeGB: 1, // Only 1GB free per month
    color: '#4285F4', // Google Blue
  },
  {
    name: 'Azure Functions',
    computePer1MRequests: 0.20,
    memoryPricePerGBSecond: 0.000016,
    egressPricePerGB: 0.087, // $0.087/GB
    egressFreeGB: 100, // 100GB free per month
    color: '#0078D4', // Azure Blue
  },
  {
    name: 'Cloudflare Workers',
    computePer1MRequests: 0.50, // $5 for 10M requests (no free tier at scale)
    memoryPricePerGBSecond: 0.000012, // Estimated based on CPU time
    egressPricePerGB: 0, // FREE egress - major differentiator!
    egressFreeGB: Infinity, // All egress is free
    color: '#F38020', // Cloudflare Orange
  },
];

// Workload: 512MB memory, 200ms average duration, 50KB average response
const WORKLOAD = {
  memoryMB: 512,
  durationMS: 200,
  avgResponseKB: 50, // Average response size
};

interface CostBreakdown {
  cpu: number;
  memory: number;
  egress: number;
  total: number;
}

function calculateCloudCost(
  requestsPerMonth: number,
  provider: CloudPricing,
  includeEgress: boolean = true,
  includeCPU: boolean = true,
  includeMemory: boolean = true
): CostBreakdown {
  const memoryGB = WORKLOAD.memoryMB / 1024;
  const durationSeconds = WORKLOAD.durationMS / 1000;

  // Compute costs
  const computeCost = includeCPU ? (requestsPerMonth / 1000000) * provider.computePer1MRequests : 0;
  const memoryCost = includeMemory ? requestsPerMonth * memoryGB * durationSeconds * provider.memoryPricePerGBSecond : 0;

  // Egress costs (assuming 50KB average response)
  const totalEgressGB = (requestsPerMonth * WORKLOAD.avgResponseKB) / (1024 * 1024);
  const billableEgressGB = Math.max(0, totalEgressGB - provider.egressFreeGB);
  const egressCost = includeEgress ? billableEgressGB * provider.egressPricePerGB : 0;

  return {
    cpu: computeCost,
    memory: memoryCost,
    egress: egressCost,
    total: computeCost + memoryCost + egressCost,
  };
}

function formatCost(cost: number): string {
  if (cost < 1) return `$${cost.toFixed(3)}`;
  if (cost < 100) return `$${cost.toFixed(2)}`;
  return `$${Math.round(cost)}`;
}

function formatRequests(requests: number): string {
  if (requests >= 1000000) return `${(requests / 1000000).toFixed(1)}M`;
  if (requests >= 1000) return `${(requests / 1000).toFixed(1)}K`;
  return requests.toString();
}

export default function CloudCostComparison() {
  const [currentLoad, setCurrentLoad] = useState(10000000); // 10M requests
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [includeEgress, setIncludeEgress] = useState(true);
  const [includeCPU, setIncludeCPU] = useState(true);
  const [includeMemory, setIncludeMemory] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate data points for the chart (log scale from 100K to 200M)
  const chartData = useMemo(() => {
    const points = 200;
    const min = Math.log10(100000); // 100K requests
    const max = Math.log10(200000000); // 200M requests
    const step = (max - min) / points;

    const data: Array<{
      requests: number;
      costs: Record<string, number>;
    }> = [];

    for (let i = 0; i <= points; i++) {
      const requests = Math.pow(10, min + step * i);
      const costs: Record<string, number> = {};

      CLOUD_PROVIDERS.forEach(provider => {
        costs[provider.name] = calculateCloudCost(requests, provider, includeEgress, includeCPU, includeMemory).total;
      });

      data.push({ requests, costs });
    }

    return data;
  }, [includeEgress, includeCPU, includeMemory]);

  // Current costs at selected load
  const currentCosts = useMemo(() => {
    const costs: Record<string, CostBreakdown> = {};
    CLOUD_PROVIDERS.forEach(provider => {
      costs[provider.name] = calculateCloudCost(currentLoad, provider, includeEgress, includeCPU, includeMemory);
    });
    return costs;
  }, [currentLoad, includeEgress, includeCPU, includeMemory]);

  // Determine cheapest provider
  const cheapest = useMemo(() => {
    let minCost = Infinity;
    let cheapestProvider = '';

    Object.entries(currentCosts).forEach(([provider, breakdown]) => {
      if (breakdown.total < minCost) {
        minCost = breakdown.total;
        cheapestProvider = provider;
      }
    });

    return cheapestProvider;
  }, [currentCosts]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentLoad((prev) => {
        const logMin = Math.log10(100000);
        const logMax = Math.log10(200000000);
        const logCurrent = Math.log10(prev);
        const logNext = logCurrent + (logMax - logMin) / 200;

        if (logNext >= logMax) {
          setIsPlaying(false);
          return Math.pow(10, logMin);
        }

        return Math.pow(10, logNext);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // ApexCharts options
  const options: ApexOptions = {
    chart: {
      type: 'line',
      animations: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
      background: 'transparent',
    },
    theme: {
      mode: 'light',
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: CLOUD_PROVIDERS.map(p => p.color),
    xaxis: {
      type: 'numeric',
      title: {
        text: 'Requests per Month',
      },
      labels: {
        formatter: (val: any) => formatRequests(Number(val)),
      },
      logarithmic: true,
    } as any,
    yaxis: {
      title: {
        text: 'Monthly Cost (USD)',
      },
      labels: {
        formatter: (val: any) => formatCost(val),
      },
      logarithmic: true,
    } as any,
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => formatCost(val),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    grid: {
      borderColor: '#e5e7eb',
    },
    annotations: {
      xaxis: [
        {
          x: currentLoad,
          borderColor: '#f59e0b',
          strokeDashArray: 4,
          label: {
            text: 'Current Load',
            style: {
              color: '#fff',
              background: '#f59e0b',
            },
          },
        },
      ],
    },
  };

  const series = CLOUD_PROVIDERS.map(provider => ({
    name: provider.name,
    data: chartData.map((d) => ({ x: d.requests, y: d.costs[provider.name] })),
  }));

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-neutral-900 rounded-lg">
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="my-8 w-full lg:w-2/3 lg:mx-auto">
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-2 text-center">
          Same Workload, Different Clouds
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
          512MB memory, 200ms duration, 50KB response
        </p>

        {/* Cost Component Toggles */}
        <div className="flex justify-center items-center gap-6 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeCPU}
              onChange={(e) => setIncludeCPU(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <span className="text-sm">CPU/Requests</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeMemory}
              onChange={(e) => setIncludeMemory(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <span className="text-sm">Memory</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeEgress}
              onChange={(e) => setIncludeEgress(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <span className="text-sm">Egress</span>
          </label>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <BrowserOnly fallback={<div>Loading chart...</div>}>
            {() => {
              const Chart = require('react-apexcharts').default;
              return <Chart options={options} series={series} type="line" height={400} />;
            }}
          </BrowserOnly>
        </div>

        {/* Load Control */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              Current Load: <span className="text-primary">{formatRequests(currentLoad)} requests/month</span>
            </label>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition text-sm"
            >
              {isPlaying ? '⏸ Pause' : '▶️ Play Animation'}
            </button>
          </div>
          <input
            type="range"
            min={Math.log10(100000)}
            max={Math.log10(200000000)}
            step={0.01}
            value={Math.log10(currentLoad)}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentLoad(Math.pow(10, parseFloat(e.target.value)));
            }}
            className="w-full"
          />
        </div>

        {/* Current Costs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {CLOUD_PROVIDERS.map((provider) => {
            const breakdown = currentCosts[provider.name];
            return (
              <div
                key={provider.name}
                className={`p-3 rounded-lg text-center flex flex-col ${
                  cheapest === provider.name
                    ? 'bg-green-100 dark:bg-green-900 border-2 border-green-500'
                    : 'bg-gray-100 dark:bg-neutral-800'
                }`}
              >
                <div className="text-xs font-medium mb-1">{provider.name}</div>
                <div className="text-lg font-bold">{formatCost(breakdown.total)}</div>
                {/* Cost breakdown */}
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-0.5 flex-grow">
                  {includeCPU && <div>CPU: {formatCost(breakdown.cpu)}</div>}
                  {includeMemory && <div>Mem: {formatCost(breakdown.memory)}</div>}
                  {includeEgress && <div>Egress: {formatCost(breakdown.egress)}</div>}
                </div>
                {/* Cheapest indicator at bottom */}
                <div className="mt-2 h-5">
                  {cheapest === provider.name && (
                    <div className="text-xs text-green-700 dark:text-green-300">✓ Cheapest</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Message */}
        <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg text-center">
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            The cheapest provider <strong>changes as you scale</strong>. Locked into one cloud?
          </div>
          <div className="text-base font-bold mb-2">
            You pay the "switching tax" — or stay on the expensive option.
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            With Pikku: <strong>same code, any cloud, no rewrites.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
