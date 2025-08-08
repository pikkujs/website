import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

export function DocHeaderHero({ image, title }) {
  const { colorMode } = useColorMode();

  return (
    <div className='flex flex-row gap-8 items-center justify-center pb-4 my-4'>
      <img width={100} height={100} src={image.replace('light', colorMode)} alt={`Logo for ${title}`}  />
      <h1 className='text-5xl flex-1 max-w-fit'>{title}</h1>
    </div>
  );
}