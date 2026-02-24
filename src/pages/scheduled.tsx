import React from 'react';
import WireProductPage from '../components/WireProductPage';
import { wireProductsById } from '@site/data/wire-products';

export default function ScheduledPage() {
  return <WireProductPage product={wireProductsById.scheduled} />;
}
