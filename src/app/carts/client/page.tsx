'use client';

import React, { useEffect, useState } from 'react';
import { Cart } from '../components/types';
import CartListClient from '../components/CartListClient';


export default function ClientCartsPage() {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://dummyjson.com/carts')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch carts');
        return res.json();
      })
      .then((data) => {
        setCarts(data.carts);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold border-b pb-4">Carts — Client-side Rendering (useEffect)</h1>
        <div className="p-4 text-gray-500 animate-pulse">Loading carts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
        <h2 className="font-bold">Runtime Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return <CartListClient initialCarts={carts} renderModeText="Client-side Rendering (useEffect)" />;
}