import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from '@docusaurus/Link';
import { wireTypes, wireCategories, type WireCategory } from '../data/wireTypes';
import { Code2, Wrench, Shield, GitBranch, Scissors, Package } from 'lucide-react';

const coreEntries = [
  { id: 'function', label: 'Functions', description: 'One signature, every protocol', url: '/core/function', icon: Code2 },
  { id: 'services', label: 'Services', description: 'Injected toolbox with tree-shaking', url: '/core/services', icon: Wrench },
  { id: 'security', label: 'Security', description: 'Sessions, permissions & auth', url: '/core/security', icon: Shield },
  { id: 'versioning', label: 'Versioning', description: 'Contract hashing & CI enforcement', url: '/core/versioning', icon: GitBranch },
];

const deploymentEntries = [
  { id: 'treeshaking', label: 'Tree-Shaking', description: 'Filter & deploy only what you need', url: '/core/treeshaking', icon: Scissors },
  { id: 'built-in-services', label: 'Built-in Services', description: 'Every interface & provider', url: '/core/built-in-services', icon: Package },
];

export default function FeaturesMegaMenu(): React.ReactNode {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const grouped = wireCategories.reduce(
    (acc, cat) => {
      acc[cat] = wireTypes.filter((w) => w.category === cat);
      return acc;
    },
    {} as Record<WireCategory, typeof wireTypes>,
  );

  const clearDelay = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleEnter = () => {
    clearDelay();
    setOpen(true);
  };

  const handleLeave = () => {
    clearDelay();
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    },
    [open],
  );

  // Click outside
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, handleKeyDown]);

  // Cleanup timer
  useEffect(() => () => clearDelay(), []);

  return (
    <div
      className="mega-menu"
      ref={containerRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <a
        className="mega-menu-trigger navbar__item navbar__link"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        Features
        <span className="mega-menu-trigger-caret" />
      </a>

      <div className={`mega-menu-panel${open ? ' mega-menu-panel--open' : ''}`} role="menu">
        <div className="mega-menu-grid mega-menu-grid--5col">
          {/* Core column */}
          <div className="mega-menu-column">
            <div className="mega-menu-category-label">Core</div>
            {coreEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.id}
                  to={entry.url}
                  className="mega-menu-item"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <div className="mega-menu-icon-box">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="mega-menu-item-label">{entry.label}</div>
                    <div className="mega-menu-item-desc">{entry.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Wire columns */}
          {wireCategories.map((cat) => (
            <div key={cat} className="mega-menu-column">
              <div className="mega-menu-category-label">{cat}</div>
              {grouped[cat].map((wire) => {
                const Icon = wire.icon;
                return (
                  <Link
                    key={wire.id}
                    to={wire.url}
                    className="mega-menu-item"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                  >
                    <div className="mega-menu-icon-box">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="mega-menu-item-label">{wire.label}</div>
                      <div className="mega-menu-item-desc">{wire.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Deployment column */}
          <div className="mega-menu-column">
            <div className="mega-menu-category-label">Deployment</div>
            {deploymentEntries.map((entry) => {
              const Icon = entry.icon;
              return (
                <Link
                  key={entry.id}
                  to={entry.url}
                  className="mega-menu-item"
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <div className="mega-menu-icon-box">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="mega-menu-item-label">{entry.label}</div>
                    <div className="mega-menu-item-desc">{entry.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mega-menu-footer">
          <Link to="/features" onClick={() => setOpen(false)}>
            View all features →
          </Link>
        </div>
      </div>
    </div>
  );
}
