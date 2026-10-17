import type { MetricDefinition, MetricId, AtlasData } from './types';

/**
 * Metric definitions with labels, units, and directionality
 */
export const METRICS: Record<MetricId, MetricDefinition> = {
  egress_internet_gb: {
    label: 'Egress to Internet',
    unit: '$/GB',
    better: 'lower',
    description: 'Cost per GB of data transferred from cloud to internet',
  },
  egress_intra_gb: {
    label: 'Intra-Region Egress',
    unit: '$/GB',
    better: 'lower',
    description: 'Cost per GB of data transferred within same region',
  },
  function_gb_s: {
    label: 'Function Compute',
    unit: '$/GB-s',
    better: 'lower',
    description: 'Cost per GB-second of serverless function execution',
  },
  free_tier_reqs_m: {
    label: 'Free Tier',
    unit: 'M req/mo',
    better: 'higher',
    description: 'Monthly free serverless function requests (millions)',
  },
};

/**
 * Real cloud pricing data across regions
 * Sources: Official pricing pages as of October 2025
 * - AWS: https://aws.amazon.com/lambda/pricing/ and https://aws.amazon.com/ec2/pricing/on-demand/
 * - GCP: https://cloud.google.com/functions/pricing and https://cloud.google.com/vpc/network-pricing
 * - Azure: https://azure.microsoft.com/en-us/pricing/details/functions/
 * - Cloudflare: https://developers.cloudflare.com/workers/platform/pricing/
 */
export const ATLAS_DATA: AtlasData = {
  updatedAt: '2025-10-23',
  defaultRegion: 'us-east-1',
  providers: [
    {
      id: 'aws',
      name: 'AWS',
      displayName: 'Amazon Web Services',
      color: '#FF9900',
      logo: {
        light: '/img/providers/aws-light.svg',
        dark: '/img/providers/aws-dark.svg',
      },
      regions: {
        'us-east-1': {
          metrics: {
            egress_internet_gb: 0.09, // First 10TB/mo
            egress_intra_gb: 0.01, // Same AZ is free, different AZ
            function_gb_s: 0.0000166667, // $0.00001667/GB-s
            free_tier_reqs_m: 1.0, // 1M requests/month free tier
          },
          notes: ['100GB free egress/month', '400K GB-s compute free/month'],
        },
        'us-west-2': {
          metrics: {
            egress_internet_gb: 0.09,
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000166667,
            free_tier_reqs_m: 1.0,
          },
          notes: ['Same pricing as us-east-1'],
        },
        'eu-west-1': {
          metrics: {
            egress_internet_gb: 0.09,
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000166667,
            free_tier_reqs_m: 1.0,
          },
          notes: ['Ireland region, same pricing'],
        },
        'ap-southeast-1': {
          metrics: {
            egress_internet_gb: 0.12, // More expensive in Asia
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000166667,
            free_tier_reqs_m: 1.0,
          },
          notes: ['Singapore region, higher egress costs'],
        },
      },
    },
    {
      id: 'gcp',
      name: 'GCP',
      displayName: 'Google Cloud Platform',
      color: '#4285F4',
      logo: {
        light: '/img/providers/gcp-light.svg',
        dark: '/img/providers/gcp-dark.svg',
      },
      regions: {
        'us-central1': {
          metrics: {
            egress_internet_gb: 0.12, // Generally more expensive than AWS
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000025, // Cheaper compute
            free_tier_reqs_m: 2.0, // 2M requests/month free
          },
          notes: ['Only 1GB network egress free/month', 'Cheaper compute, pricier egress'],
        },
        'us-west1': {
          metrics: {
            egress_internet_gb: 0.12,
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000025,
            free_tier_reqs_m: 2.0,
          },
        },
        'europe-west1': {
          metrics: {
            egress_internet_gb: 0.12,
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000025,
            free_tier_reqs_m: 2.0,
          },
          notes: ['Belgium region'],
        },
        'asia-southeast1': {
          metrics: {
            egress_internet_gb: 0.15, // Even more expensive in Asia
            egress_intra_gb: 0.01,
            function_gb_s: 0.0000025,
            free_tier_reqs_m: 2.0,
          },
          notes: ['Singapore region, highest egress costs'],
        },
      },
    },
    {
      id: 'azure',
      name: 'Azure',
      displayName: 'Microsoft Azure',
      color: '#0078D4',
      logo: {
        light: '/img/providers/azure-light.svg',
        dark: '/img/providers/azure-dark.svg',
      },
      regions: {
        'eastus': {
          metrics: {
            egress_internet_gb: 0.087, // Slightly cheaper than AWS
            egress_intra_gb: 0.01,
            function_gb_s: 0.000016, // Similar to AWS
            free_tier_reqs_m: 1.0, // 1M executions/month free
          },
          notes: ['100GB free egress/month', '400K GB-s compute free/month'],
        },
        'westus2': {
          metrics: {
            egress_internet_gb: 0.087,
            egress_intra_gb: 0.01,
            function_gb_s: 0.000016,
            free_tier_reqs_m: 1.0,
          },
        },
        'northeurope': {
          metrics: {
            egress_internet_gb: 0.087,
            egress_intra_gb: 0.01,
            function_gb_s: 0.000016,
            free_tier_reqs_m: 1.0,
          },
          notes: ['Ireland region'],
        },
        'southeastasia': {
          metrics: {
            egress_internet_gb: 0.12, // Higher in Asia
            egress_intra_gb: 0.01,
            function_gb_s: 0.000016,
            free_tier_reqs_m: 1.0,
          },
          notes: ['Singapore region'],
        },
      },
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare',
      displayName: 'Cloudflare Workers',
      color: '#F38020',
      logo: {
        light: '/img/providers/cloudflare-light.svg',
        dark: '/img/providers/cloudflare-dark.svg',
      },
      regions: {
        global: {
          metrics: {
            egress_internet_gb: 0, // FREE! Major differentiator
            egress_intra_gb: 0, // Also free
            function_gb_s: 0.000012, // Estimated based on CPU time pricing
            free_tier_reqs_m: 0.1, // 100K requests/day on free plan = ~3M/month
          },
          notes: [
            'FREE unlimited egress',
            'Global edge network',
            'No regional pricing',
            'Paid plan: $5/10M requests',
          ],
        },
      },
    },
  ],
  sources: [
    'AWS Lambda Pricing - https://aws.amazon.com/lambda/pricing/',
    'AWS Data Transfer Pricing - https://aws.amazon.com/ec2/pricing/on-demand/',
    'GCP Cloud Functions Pricing - https://cloud.google.com/functions/pricing',
    'GCP Network Pricing - https://cloud.google.com/vpc/network-pricing',
    'Azure Functions Pricing - https://azure.microsoft.com/pricing/details/functions/',
    'Azure Bandwidth Pricing - https://azure.microsoft.com/pricing/details/bandwidth/',
    'Cloudflare Workers Pricing - https://developers.cloudflare.com/workers/platform/pricing/',
    'Pricing data collected October 2025',
  ],
};

/**
 * Get the default region for a provider
 */
export function getDefaultRegion(providerId: string): string {
  const provider = ATLAS_DATA.providers.find(p => p.id === providerId);
  if (!provider) return '';

  const regions = Object.keys(provider.regions);
  if (regions.includes(ATLAS_DATA.defaultRegion)) {
    return ATLAS_DATA.defaultRegion;
  }
  return regions[0] || '';
}

/**
 * Get pricing data for a specific provider/region/metric
 */
export function getMetricValue(
  providerId: string,
  region: string,
  metricId: MetricId
): number | undefined {
  const provider = ATLAS_DATA.providers.find(p => p.id === providerId);
  if (!provider) return undefined;

  const regionData = provider.regions[region];
  if (!regionData) return undefined;

  return regionData.metrics[metricId];
}
