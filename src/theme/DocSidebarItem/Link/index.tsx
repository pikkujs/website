import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import { TransportIcon } from '@site/src/components/TransportIcons';
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
function SidebarTransportIcons({transports}: {transports?: string[]}) {
  if (!transports || transports.length === 0) {
    return null;
  }

  return (
    <span className="ml-auto flex items-center gap-1">
      {transports.map((transport) => (
        <TransportIcon key={transport} transportId={transport} size={12} className="ml-1" />
      ))}
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
        <SidebarTransportIcons transports={item.customProps?.transports} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}