import React from 'react';
import WireProductPage from '../components/WireProductPage';
import { wireProductsById } from '@site/data/wire-products';

export default function McpPage() {
  return <WireProductPage product={wireProductsById.mcp} />;
}
