import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/DocSidebarItem/Link';

// Extended props type to include customProps
interface ExtendedProps extends Props {
  item: Props['item'] & {
    customProps?: {
      transports?: string[];
    };
  };
}

import styles from './styles.module.css';

// Transport Icons Component
function TransportIcons({transports}: {transports?: string[]}) {
  if (!transports || transports.length === 0) {
    return null;
  }

  const icons: Record<string, React.ReactElement> = {
    http: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <path d="M2 4h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M5 7h6M5 9h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    websocket: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M5 6l3 3 3-3M11 10l-3-3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="8" r="1" fill="currentColor"/>
      </svg>
    ),
    sse: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M4 6h8M4 8h6M4 10h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M12 1l2 2-2 2M11 5V1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    cron: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 4v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="8" cy="8" r="0.5" fill="currentColor"/>
      </svg>
    ),
    mcp: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <path d="M8 1.5L13.5 5v6L8 14.5 2.5 11V5L8 1.5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="6" cy="6" r="1" fill="currentColor"/>
        <circle cx="10" cy="6" r="1" fill="currentColor"/>
        <path d="M5.5 9.5c0 1.5 1 2.5 2.5 2.5s2.5-1 2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    queue: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <rect x="1.5" y="4.5" width="13" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M4 7h2M4 9h3M10 7h2M10 9h2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
        <path d="M7 6v4" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    cli: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" style={{marginLeft: '4px'}}>
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M1.5 5.5h13" stroke="currentColor" strokeWidth="1"/>
        <path d="M4 8l2 1.5L4 11M7 11h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <span  className="ml-auto">
      {transports.map((transport) => icons[transport] || <div key="transport">-</div>)}
    </span>
  );
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: ExtendedProps): React.ReactElement {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item w-full',
        className,
      )}
      key={label}>
      <Link
        className={clsx(
          'menu__link w-full',
          !isInternalLink && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        {...props}
        style={{display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between'}}
        data-transports={item.customProps?.transports?.join(',') || ''}>
        <span className='flex-1'>{label}</span>
        <TransportIcons transports={item.customProps?.transports} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}