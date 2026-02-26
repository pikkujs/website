import React, { type ReactNode } from 'react';
import DropdownNavbarItemMobile from '@theme/NavbarItem/DropdownNavbarItem/Mobile';
import DropdownNavbarItemDesktop from '@theme/NavbarItem/DropdownNavbarItem/Desktop';
import type { Props } from '@theme/NavbarItem/DropdownNavbarItem';
import FeaturesMegaMenu from '@site/src/components/FeaturesMegaMenu';

export default function DropdownNavbarItem({
  mobile = false,
  ...props
}: Props): ReactNode {
  // Desktop "Features" dropdown → rich mega-menu
  if (props.label === 'Features' && !mobile) {
    return <FeaturesMegaMenu />;
  }

  const Comp = mobile ? DropdownNavbarItemMobile : DropdownNavbarItemDesktop;
  return <Comp {...props} />;
}
