import React, { useState, useEffect, useMemo } from 'react';
import type { MetricId } from './types';
import { METRICS, ATLAS_DATA, getMetricValue, getDefaultRegion } from './metricRegistry';

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

export default function CloudCostAtlas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const metricIds = Object.keys(METRICS) as MetricId[];

  // Get provider data with all metrics
  const providerData = useMemo(() => {
    return ATLAS_DATA.providers.map((provider) => {
      const region = getDefaultRegion(provider.id);
      const metrics: Record<MetricId, number> = {} as Record<MetricId, number>;

      metricIds.forEach((metricId) => {
        const value = getMetricValue(provider.id, region, metricId);
        metrics[metricId] = value ?? 0;
      });

      return {
        id: provider.id,
        name: provider.name,
        displayName: provider.displayName,
        color: provider.color,
        metrics,
      };
    });
  }, [metricIds]);

  // Determine best provider for each metric
  const bestProviders = useMemo(() => {
    const best: Record<MetricId, string> = {} as Record<MetricId, string>;

    metricIds.forEach((metricId) => {
      const metric = METRICS[metricId];
      let bestValue = metric.better === 'lower' ? Infinity : -Infinity;
      let bestProviderId = '';

      providerData.forEach((provider) => {
        const value = provider.metrics[metricId];
        if (metric.better === 'lower' && value < bestValue) {
          bestValue = value;
          bestProviderId = provider.id;
        } else if (metric.better === 'higher' && value > bestValue) {
          bestValue = value;
          bestProviderId = provider.id;
        }
      });

      best[metricId] = bestProviderId;
    });

    return best;
  }, [providerData, metricIds]);

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
        <p>Loading Cloud Cost Atlas...</p>
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
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Cloud Provider Pricing Comparison
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--ifm-color-emphasis-700)' }}>
            Serverless and infrastructure pricing across major providers
          </p>
        </div>

        {/* Comparison table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--ifm-color-emphasis-300)' }}>
                <th style={{
                  textAlign: 'left',
                  padding: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}>
                  Metric
                </th>
                {providerData.map((provider) => (
                  <th key={provider.id} style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}>
                    {provider.displayName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metricIds.map((metricId, index) => {
                const metric = METRICS[metricId];
                return (
                  <tr
                    key={metricId}
                    style={{
                      borderBottom: '1px solid var(--ifm-color-emphasis-200)',
                      backgroundColor: index % 2 === 0 ? 'var(--ifm-color-emphasis-100)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{metric.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-emphasis-600)' }}>
                        {metric.unit}
                      </div>
                    </td>
                    {providerData.map((provider) => {
                      const value = provider.metrics[metricId];
                      const isBest = bestProviders[metricId] === provider.id;
                      return (
                        <td
                          key={provider.id}
                          style={{
                            textAlign: 'center',
                            padding: '0.75rem',
                            fontFamily: 'var(--ifm-font-family-monospace)',
                            fontSize: '0.875rem',
                            fontWeight: isBest ? 'bold' : 'normal',
                            backgroundColor: isBest ? 'var(--ifm-color-success-contrast-background)' : 'transparent',
                            color: isBest ? 'var(--ifm-color-success-darkest)' : 'inherit'
                          }}
                        >
                          {formatValue(value, metricId)}
                          {isBest && ' ✓'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footnotes */}
        <div style={{
          marginTop: '1.5rem',
          fontSize: '0.75rem',
          color: 'var(--ifm-color-emphasis-700)',
          lineHeight: '1.5'
        }}>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Pricing as of {ATLAS_DATA.updatedAt}.</strong> Green values with ✓ indicate
            best pricing for that metric.
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Sources:</strong> Based on data from{' '}
            <a
              href="https://cast.ai/blog/cloud-pricing-comparison/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              CAST AI Cloud Pricing Comparison (2025)
            </a>
            ,{' '}
            <a
              href="https://www.civo.com/cost-of-cloud-report-2024"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
            >
              Civo Cost of Cloud Report 2024
            </a>
            , and official provider pricing pages.
          </p>
          <p style={{ fontStyle: 'italic' }}>
            Note: Egress fees and hidden costs can significantly impact total cloud spend. Test
            thoroughly before committing to a provider.
          </p>
        </div>
      </div>
    </div>
  );
}
