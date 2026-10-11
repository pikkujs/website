import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import { WiringIcon } from '@site/src/components/WiringIcons';
import type {Props} from '@theme/DocSidebarItem/Link';

// Extended props type to include customProps
interface ExtendedProps extends Props {
  item: Props['item'] & {
    customProps?: {
      wirings?: string[];
    };
  };
}

import styles from './styles.module.css';

// Wiring Icons Component
function SidebarWiringIcons({wirings}: {wirings?: string[]}) {
  if (!wirings || wirings.length === 0) {
    return null;
  }

  return (
    <span className="ml-auto flex items-center gap-1">
      {wirings.map((wiring) => (
        <WiringIcon key={wiring} wiringId={wiring} size={12} className="ml-1" />
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
        data-wirings={item.customProps?.wirings?.join(',') || ''}>
        <span className='flex-1'>{label}</span>
        <SidebarWiringIcons wirings={item.customProps?.wirings} />
        {!isInternalLink && <IconExternalLink />}
      </Link>
    </li>
  );
}