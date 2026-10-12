import React from 'react';
import Link from '@/components/site/Link';
import Image from '@/components/site/ThemedImage';

/** Reusable component for Pikku logo surrounded by icons */
export function PikkuCircularLayout({
  items,
  renderItem,
  logoSize = 180,
  radius = 180,
  animate = false,
  orbitRotate = false,
  className = '',
  minHeight = 400,
  centerOverlay,
  centerNode,
  showTrack = false,
}: {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  logoSize?: number;
  radius?: number;
  animate?: boolean;
  orbitRotate?: boolean;
  className?: string;
  minHeight?: number;
  centerOverlay?: React.ReactNode;
  centerNode?: React.ReactNode;
  showTrack?: boolean;
}) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ minHeight }}>
      {showTrack && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border border-neutral-700/30"
            style={{ width: radius * 2 + 64, height: radius * 2 + 64 }}
          />
        </div>
      )}

      <div className={`relative z-10 flex flex-col items-center ${animate ? 'animate-chameleon-enter' : ''}`}>
        {centerNode ?? (
          <Image
            sources={{ light: '/img/pikku.png', dark: '/img/pikku.png' }}
            width={logoSize}
            height={logoSize}
            className="mx-auto"
            style={{ objectFit: 'contain' }}
          />
        )}
        {centerOverlay && (
          <div className="mt-2 text-center">{centerOverlay}</div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative ${orbitRotate ? 'animate-orbit-rotate' : ''}`} style={{ width: '100%', height: '100%' }}>
          {items.map((item, index) => {
            const total = items.length;
            const angle = (index * 360) / total;
            const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
            const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

            return (
              <div
                key={index}
                className={`absolute ${animate ? 'animate-icon-fan-out' : ''}`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  ...(animate ? { animationDelay: `${index * 0.08 + 0.3}s` } : {}),
                }}
              >
                <div className={orbitRotate ? 'animate-orbit-counter-rotate' : ''}>
                  {renderItem(item, index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** The overview/developer pill now lives in the site navbar; kept so page code stays unchanged. */
export function NavbarPageToggle(_: { isDeveloperPage: boolean }) {
  return null;
}
