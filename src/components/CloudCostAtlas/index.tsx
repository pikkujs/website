import React, { useState, useEffect } from 'react';
import RadialAtlas from './RadialAtlas';
import MetricChart from './MetricChart';
import type { ProviderId, MetricId } from './types';
import { METRICS, ATLAS_DATA } from './metricRegistry';

interface CloudCostAtlasProps {
  defaultMetric?: MetricId;
  showAllMetrics?: boolean;
}

export default function CloudCostAtlas({
  defaultMetric = 'egress_internet_gb',
  showAllMetrics = false,
}: CloudCostAtlasProps) {
  const [selectedProvider, setSelectedProvider] = useState<ProviderId | null>(null);
  const [hoveredProvider, setHoveredProvider] = useState<ProviderId | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricId>(defaultMetric);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProviderClick = (providerId: ProviderId) => {
    if (selectedProvider === providerId) {
      setSelectedProvider(null); // Deselect if clicking same provider
    } else {
      setSelectedProvider(providerId);
    }
  };

  const metricIds = Object.keys(METRICS) as MetricId[];

  if (!mounted) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 dark:bg-neutral-900 rounded-lg">
        <p>Loading Cloud Cost Atlas...</p>
      </div>
    );
  }

  return (
    <div className="my-8 w-full">
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Cloud Cost Atlas</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Interactive pricing comparison across providers
          </p>
        </div>

        {/* Desktop layout: side by side */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8">
          {/* Left: Radial diagram */}
          <div className="flex flex-col items-center">
            <RadialAtlas
              providers={ATLAS_DATA.providers}
              selectedProvider={selectedProvider}
              hoveredProvider={hoveredProvider}
              onProviderClick={handleProviderClick}
              onProviderHover={setHoveredProvider}
              width={500}
              height={500}
            />
          </div>

          {/* Right: Chart panel */}
          <div className="flex flex-col">
            {selectedProvider ? (
              <>
                {/* Metric selector tabs */}
                <div className="mb-4">
                  <div className="text-sm font-medium mb-2">Select Metric:</div>
                  <div className="flex flex-wrap gap-2">
                    {metricIds.map((metricId) => (
                      <button
                        key={metricId}
                        onClick={() => setSelectedMetric(metricId)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                          selectedMetric === metricId
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {METRICS[metricId].label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                {showAllMetrics ? (
                  <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
                    {metricIds.map((metricId) => (
                      <div key={metricId} className="border-b border-gray-200 dark:border-neutral-700 pb-4">
                        <MetricChart
                          metricId={metricId}
                          selectedProvider={selectedProvider}
                          height={250}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <MetricChart
                    metricId={selectedMetric}
                    selectedProvider={selectedProvider}
                    height={350}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-6xl mb-4">👈</div>
                  <h4 className="text-lg font-semibold mb-2">Select a Provider</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click on any cloud provider to see detailed pricing comparisons
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile layout: stacked */}
        <div className="lg:hidden">
          <div className="mb-6">
            <RadialAtlas
              providers={ATLAS_DATA.providers}
              selectedProvider={selectedProvider}
              hoveredProvider={hoveredProvider}
              onProviderClick={handleProviderClick}
              onProviderHover={setHoveredProvider}
              width={400}
              height={400}
            />
          </div>

          {selectedProvider && (
            <div className="mt-6">
              {/* Metric selector tabs */}
              <div className="mb-4">
                <div className="text-sm font-medium mb-2">Select Metric:</div>
                <div className="flex flex-wrap gap-2">
                  {metricIds.map((metricId) => (
                    <button
                      key={metricId}
                      onClick={() => setSelectedMetric(metricId)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                        selectedMetric === metricId
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {METRICS[metricId].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <MetricChart
                metricId={selectedMetric}
                selectedProvider={selectedProvider}
                height={300}
              />
            </div>
          )}
        </div>

        {/* Data sources footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-neutral-700">
          <details className="text-xs text-gray-600 dark:text-gray-400">
            <summary className="cursor-pointer font-medium hover:text-gray-800 dark:hover:text-gray-200">
              Data Sources (Updated {ATLAS_DATA.updatedAt})
            </summary>
            <ul className="mt-2 ml-4 space-y-1">
              {ATLAS_DATA.sources.map((source, i) => (
                <li key={i}>{source}</li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
}
