import React, { useState, useEffect, useMemo } from 'react';
import type { ApexOptions } from 'apexcharts';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface CloudPricing {
  name: string;
  computePer1MRequests: number; // Cost per 1M requests
  memoryPricePerGBSecond: number; // Cost per GB-second
  egressPricePerGB: number; // Cost per GB egress
  egressFreeGB: number; // Free egress tier per month
  freeRequestsPerMonth: number; // Free requests per month
  freeGBSecondsPerMonth: number; // Free GB-seconds per month
  color: string;
}

const CLOUD_PROVIDERS: CloudPricing[] = [
  {
    name: 'AWS Lambda',
    computePer1MRequests: 0.20,
    memoryPricePerGBSecond: 0.0000166667,
    egressPricePerGB: 0.09, // $0.09/GB to internet
    egressFreeGB: 100, // 100GB free per month
    freeRequestsPerMonth: 1000000, // 1M free requests per month
    freeGBSecondsPerMonth: 400000, // 400K GB-seconds per month
    color: '#FF9900', // AWS Orange
  },
  {
    name: 'Google Cloud',
    computePer1MRequests: 0.40,
    memoryPricePerGBSecond: 0.0000025,
    egressPricePerGB: 0.12, // $0.12/GB (generally more expensive)
    egressFreeGB: 1, // Only 1GB free per month
    freeRequestsPerMonth: 2000000, // 2M free requests per month
    freeGBSecondsPerMonth: 400000, // 400K GB-seconds per month
    color: '#4285F4', // Google Blue
  },
  {
    name: 'Azure Functions',
    computePer1MRequests: 0.20,
    memoryPricePerGBSecond: 0.000016,
    egressPricePerGB: 0.087, // $0.087/GB
    egressFreeGB: 100, // 100GB free per month
    freeRequestsPerMonth: 1000000, // 1M free executions per month
    freeGBSecondsPerMonth: 400000, // 400K GB-seconds per month
    color: '#0078D4', // Azure Blue
  },
  {
    name: 'Cloudflare Workers',
    computePer1MRequests: 0.50, // $5 for 10M requests (no free tier at scale)
    memoryPricePerGBSecond: 0.000012, // Estimated based on CPU time
    egressPricePerGB: 0, // FREE egress - major differentiator!
    egressFreeGB: Infinity, // All egress is free
    freeRequestsPerMonth: 100000, // 100K requests/day on free plan (~3M/month)
    freeGBSecondsPerMonth: 0, // No separate memory free tier
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
  includeMemory: boolean = true,
  includeFreeTiers: boolean = true
): CostBreakdown {
  const memoryGB = WORKLOAD.memoryMB / 1024;
  const durationSeconds = WORKLOAD.durationMS / 1000;

  // Apply free tier for requests
  const billableRequests = includeFreeTiers
    ? Math.max(0, requestsPerMonth - provider.freeRequestsPerMonth)
    : requestsPerMonth;

  // Compute costs
  const computeCost = includeCPU ? (billableRequests / 1000000) * provider.computePer1MRequests : 0;

  // Apply free tier for GB-seconds
  const totalGBSeconds = requestsPerMonth * memoryGB * durationSeconds;
  const billableGBSeconds = includeFreeTiers
    ? Math.max(0, totalGBSeconds - provider.freeGBSecondsPerMonth)
    : totalGBSeconds;
  const memoryCost = includeMemory ? billableGBSeconds * provider.memoryPricePerGBSecond : 0;

  // Egress costs (assuming 50KB average response)
  const totalEgressGB = (requestsPerMonth * WORKLOAD.avgResponseKB) / (1024 * 1024);
  const billableEgressGB = includeFreeTiers
    ? Math.max(0, totalEgressGB - provider.egressFreeGB)
    : totalEgressGB;
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
  const [includeFreeTiers, setIncludeFreeTiers] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate data points for the chart (log scale from 1K to 200M)
  const chartData = useMemo(() => {
    const points = 200;
    const min = Math.log10(1000); // 1K requests (near zero, log scale can't start at 0)
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
        costs[provider.name] = calculateCloudCost(requests, provider, includeEgress, includeCPU, includeMemory, includeFreeTiers).total;
      });

      data.push({ requests, costs });
    }

    return data;
  }, [includeEgress, includeCPU, includeMemory, includeFreeTiers]);

  // Current costs at selected load
  const currentCosts = useMemo(() => {
    const costs: Record<string, CostBreakdown> = {};
    CLOUD_PROVIDERS.forEach(provider => {
      costs[provider.name] = calculateCloudCost(currentLoad, provider, includeEgress, includeCPU, includeMemory, includeFreeTiers);
    });
    return costs;
  }, [currentLoad, includeEgress, includeCPU, includeMemory, includeFreeTiers]);

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
        const logMin = Math.log10(1000);
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
      zoom: {
        enabled: false,
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
            text: `Current: ${formatRequests(currentLoad)}`,
            orientation: 'horizontal',
            position: 'top',
            offsetY: -10,
            style: {
              color: '#fff',
              background: '#f59e0b',
              fontSize: '11px',
              padding: {
                left: 8,
                right: 8,
                top: 4,
                bottom: 4,
              },
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
      <div style={{
        width: '100%',
        height: '24rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--ifm-background-surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--ifm-color-emphasis-300)'
      }}>
        <p>Loading chart...</p>
      </div>
    );
  }

  return (
    <div style={{ margin: '2rem 0', width: '100%' }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--ifm-background-surface-color)',
        borderRadius: '8px',
        border: '1px solid var(--ifm-color-emphasis-300)',
        boxShadow: 'var(--ifm-global-shadow-lw)'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
          Same Workload, Different Clouds
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)', textAlign: 'center', marginBottom: '0.5rem' }}>
          512MB memory, 200ms duration, 50KB response
        </p>

        {/* Cost Component Toggles */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={includeCPU}
              onChange={(e) => setIncludeCPU(e.target.checked)}
              style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem' }}>CPU/Requests</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={includeMemory}
              onChange={(e) => setIncludeMemory(e.target.checked)}
              style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem' }}>Memory</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={includeEgress}
              onChange={(e) => setIncludeEgress(e.target.checked)}
              style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem' }}>Egress</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={includeFreeTiers}
              onChange={(e) => setIncludeFreeTiers(e.target.checked)}
              style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }}
            />
            <span style={{ fontSize: '0.875rem' }}>Include Free Tiers</span>
          </label>
        </div>

        {/* Load Control */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              Current Load: <span style={{ color: 'var(--ifm-color-primary)' }}>{formatRequests(currentLoad)} requests/month</span>
            </label>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'var(--ifm-color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              {isPlaying ? '⏸ Pause' : '▶️ Play Animation'}
            </button>
          </div>
          <input
            type="range"
            min={Math.log10(1000)}
            max={Math.log10(200000000)}
            step={0.01}
            value={Math.log10(currentLoad)}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentLoad(Math.pow(10, parseFloat(e.target.value)));
            }}
            style={{ width: '100%' }}
          />
        </div>

        {/* Chart and Cost Breakdown - Side by Side on Desktop */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Chart */}
          <div>
            <BrowserOnly fallback={<div>Loading chart...</div>}>
              {() => {
                const Chart = require('react-apexcharts').default;
                return <Chart options={options} series={series} type="line" height={400} />;
              }}
            </BrowserOnly>
          </div>

          {/* Current Costs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', alignContent: 'start' }}>
            {CLOUD_PROVIDERS.map((provider) => {
              const breakdown = currentCosts[provider.name];
              const isCheapest = cheapest === provider.name;
              return (
                <div
                  key={provider.name}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: isCheapest ? 'var(--ifm-color-success-contrast-background)' : 'var(--ifm-color-emphasis-100)',
                    border: isCheapest ? '2px solid var(--ifm-color-success)' : '1px solid var(--ifm-color-emphasis-300)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem' }}>{provider.name}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{formatCost(breakdown.total)}</div>
                  {/* Cost breakdown */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-700)', marginTop: '0.5rem', flexGrow: 1 }}>
                    {includeCPU && <div>CPU: {formatCost(breakdown.cpu)}</div>}
                    {includeMemory && <div>Mem: {formatCost(breakdown.memory)}</div>}
                    {includeEgress && <div>Egress: {formatCost(breakdown.egress)}</div>}
                  </div>
                  {/* Cheapest indicator at bottom */}
                  <div style={{ marginTop: '0.5rem', height: '1.25rem' }}>
                    {isCheapest && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-success-darkest)', fontWeight: 'bold' }}>✓ Cheapest</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
