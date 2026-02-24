import React from 'react';
import WireProductPage from '../components/WireProductPage';
import { wireProductsById } from '@site/data/wire-products';

export default function TriggersPage() {
  return <WireProductPage product={wireProductsById.triggers} />;
}
