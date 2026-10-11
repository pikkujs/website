export type ProviderId = 'aws' | 'gcp' | 'azure' | 'cloudflare';

export type MetricId =
  | 'egress_internet_gb'
  | 'egress_intra_gb'
  | 'function_gb_s'
  | 'free_tier_reqs_m';

export interface RegionPricing {
  metrics: Partial<Record<MetricId, number>>;
  notes?: string[];
}

export interface ProviderPricing {
  id: ProviderId;
  name: string;
  displayName: string;
  color: string;
  logo?: {
    light: string;
    dark: string;
  };
  regions: Record<string, RegionPricing>;
}

export interface AtlasData {
  updatedAt: string;
  defaultRegion: string;
  providers: ProviderPricing[];
  sources: string[];
}

export interface MetricDefinition {
  label: string;
  unit: string;
  better: 'lower' | 'higher';
  description: string;
}

export interface ChartDataPoint {
  provider: string;
  providerId: ProviderId;
  value: number;
  accent: boolean;
  color: string;
}
