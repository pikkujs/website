import React from 'react';
import ReactDOM from 'react-dom';
import Link from '@docusaurus/Link';
import Image from '@theme/ThemedImage';
import { Code2 } from 'lucide-react';

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
            sources={{ light: 'img/pikku.png', dark: 'img/pikku.png' }}
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

/** Navbar pill that links between the overview and developer pages */
export function NavbarPageToggle({ isDeveloperPage }: { isDeveloperPage: boolean }) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const el = document.createElement('div');
    el.className = 'navbar__item navbar-dev-toggle';
    el.style.display = 'flex';
    el.style.alignItems = 'center';

    if (window.innerWidth < 997) {
      // Mobile: insert after logo in left navbar items
      const navLeft = document.querySelector('.navbar__items:not(.navbar__items--right)');
      if (!navLeft) return;
      navLeft.appendChild(el);
    } else {
      // Desktop: insert at start of right navbar items
      const navRight = document.querySelector('.navbar__items--right');
      if (!navRight) return;
      navRight.insertBefore(el, navRight.firstChild);
    }
    setContainer(el);

    return () => { el.remove(); };
  }, []);

  if (!container) return null;
  return ReactDOM.createPortal(
    <Link
      to={isDeveloperPage ? '/' : '/developers'}
      className="navbar-dev-pill"
      title={isDeveloperPage ? 'Back to the product overview' : 'The technical deep-dive, for engineers'}
    >
      <Code2 style={{ width: 14, height: 14, flexShrink: 0 }} />
      <span>{isDeveloperPage ? 'Overview' : 'For developers'}</span>
    </Link>,
    container
  );
}
