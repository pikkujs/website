import React from 'react';
import type { ProviderId, ProviderPricing } from './types';

interface RadialAtlasProps {
  providers: ProviderPricing[];
  selectedProvider: ProviderId | null;
  hoveredProvider: ProviderId | null;
  onProviderClick: (providerId: ProviderId) => void;
  onProviderHover: (providerId: ProviderId | null) => void;
  width?: number;
  height?: number;
}

/**
 * Calculate node positions in a circle around center
 */
function calculateNodePositions(
  count: number,
  centerX: number,
  centerY: number,
  radius: number
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  const angleStep = (2 * Math.PI) / count;
  const startAngle = -Math.PI / 2; // Start at top

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    positions.push({
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  }

  return positions;
}

export default function RadialAtlas({
  providers,
  selectedProvider,
  hoveredProvider,
  onProviderClick,
  onProviderHover,
  width = 600,
  height = 600,
}: RadialAtlasProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const nodeRadius = 50;
  const centerRadius = 60;

  const positions = calculateNodePositions(providers.length, centerX, centerY, radius);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="transition-all duration-300"
      role="img"
      aria-label="Cloud provider cost comparison radial diagram"
    >
      <defs>
        {/* Gradient for active connections */}
        <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.8" />
        </linearGradient>

        {/* Glow filter for hover effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle for center */}
      <circle
        cx={centerX}
        cy={centerY}
        r={centerRadius + 10}
        fill="var(--ifm-background-surface-color)"
        stroke="var(--ifm-color-emphasis-300)"
        strokeWidth="2"
        className="transition-all duration-300"
      />

      {/* Connection lines */}
      {providers.map((provider, index) => {
        const pos = positions[index];
        const isActive =
          selectedProvider === provider.id ||
          hoveredProvider === provider.id;

        return (
          <line
            key={`line-${provider.id}`}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            stroke={isActive ? 'url(#activeGradient)' : 'var(--ifm-color-emphasis-400)'}
            strokeWidth={isActive ? 3 : 1}
            strokeDasharray={isActive ? '0' : '5,5'}
            className="transition-all duration-300"
            opacity={isActive ? 1 : 0.3}
          />
        );
      })}

      {/* Center node (Pikku) */}
      <g className="cursor-default">
        <circle
          cx={centerX}
          cy={centerY}
          r={centerRadius}
          fill="#8B5CF6"
          className="transition-all duration-300"
        />
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-2xl font-bold fill-white select-none"
        >
          Pikku
        </text>
      </g>

      {/* Provider nodes */}
      {providers.map((provider, index) => {
        const pos = positions[index];
        const isActive =
          selectedProvider === provider.id ||
          hoveredProvider === provider.id;
        const isSelected = selectedProvider === provider.id;

        return (
          <g
            key={provider.id}
            onMouseEnter={() => onProviderHover(provider.id)}
            onMouseLeave={() => onProviderHover(null)}
            onClick={() => onProviderClick(provider.id)}
            className="cursor-pointer transition-transform duration-300"
            style={{
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transformOrigin: `${pos.x}px ${pos.y}px`,
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${provider.displayName} pricing`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onProviderClick(provider.id);
              }
            }}
          >
            {/* Node background */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={nodeRadius}
              fill="var(--ifm-background-surface-color)"
              stroke={isSelected ? provider.color : 'var(--ifm-color-emphasis-400)'}
              strokeWidth={isSelected ? 4 : 2}
              className="transition-all duration-300"
              filter={isActive ? 'url(#glow)' : undefined}
            />

            {/* Provider icon/logo placeholder */}
            <circle
              cx={pos.x}
              cy={pos.y - 10}
              r={20}
              fill={provider.color}
              opacity={0.9}
            />

            {/* Provider name */}
            <text
              x={pos.x}
              y={pos.y + 25}
              textAnchor="middle"
              className="text-sm font-semibold select-none"
              fill="var(--ifm-font-color-base)"
            >
              {provider.name}
            </text>

            {/* Hover/selection indicator */}
            {isActive && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius + 5}
                fill="none"
                stroke={provider.color}
                strokeWidth="2"
                opacity="0.5"
                className="animate-pulse"
              />
            )}
          </g>
        );
      })}

      {/* Instructions text */}
      <text
        x={centerX}
        y={height - 20}
        textAnchor="middle"
        className="text-xs"
        fill="var(--ifm-color-emphasis-600)"
      >
        {selectedProvider
          ? 'Click another provider to compare'
          : 'Click a provider to see pricing comparison'}
      </text>
    </svg>
  );
}
