import React from 'react';
import WireProductPage from '../components/WireProductPage';
import { wireProductsById } from '@site/data/wire-products';

export default function WebsocketPage() {
  return <WireProductPage product={wireProductsById.websocket} />;
}
