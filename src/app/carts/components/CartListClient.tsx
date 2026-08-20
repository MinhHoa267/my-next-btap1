"use client";

import React, { useState, useMemo } from 'react';

import { Card, Button, Input } from './ui';
import { Cart } from './types';

interface Props {
  initialCarts: Cart[];
  renderModeText: string;
}

export default function CartListClient({ initialCarts, renderModeText }: Props) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'total' | 'discountedTotal' | 'totalProducts'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJson, setExpandedJson] = useState<Record<number, boolean>>({});

  const itemsPerPage = 5;

  const filteredCarts = useMemo(() => {
    return initialCarts.filter((cart) => {
      const matchId = cart.id.toString().includes(search.trim());
      const matchProduct = cart.products.some((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
      return matchId || matchProduct;
    });
  }, [initialCarts, search]);

  // Sắp xếp
  const sortedCarts = useMemo(() => {
    return [...filteredCarts].sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (sortOrder === 'asc') return valA - valB;
      return valB - valA;
    });
  }, [filteredCarts, sortBy, sortOrder]);

  // Phân trang
  const totalPages = Math.ceil(sortedCarts.length / itemsPerPage) || 1;
  const paginatedCarts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCarts.slice(start, start + itemsPerPage);
  }, [sortedCarts, currentPage]);

  const toggleJson = (id: number) => {
    setExpandedJson((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Carts — {renderModeText}</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search by cart id or product title..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-72"
        />

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded"
          >
            <option value="total">total</option>
            <option value="discountedTotal">discountedTotal</option>
            <option value="totalProducts">totalProducts</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded"
          >
            <option value="asc">asc</option>
            <option value="desc">desc</option>
          </select>
        </div>
      </div>

      {/* Info & Pagination Info */}
      <div className="text-sm text-gray-600">
        Showing {paginatedCarts.length} of {sortedCarts.length} carts (page {currentPage}/{totalPages})
      </div>

      {/* Cart Items List */}
      {paginatedCarts.length === 0 ? (
        <Card className="bg-yellow-50 border-yellow-200 text-yellow-800">
          No carts match your search.
        </Card>
      ) : (
        <div className="space-y-6">
          {paginatedCarts.map((cart) => {
            const savings = cart.total - cart.discountedTotal;
            const savingsPercent = cart.total > 0 ? (savings / cart.total) * 100 : 0;

            return (
              <Card key={cart.id} className="space-y-4">
                {/* Header Card */}
                <div className="flex flex-wrap justify-between items-center text-sm font-semibold border-b pb-2">
                  <div>
                    Cart #{cart.id} | total: {formatCurrency(cart.total)} | discountedTotal: {formatCurrency(cart.discountedTotal)} | totalProducts: {cart.totalProducts} | totalQuantity: {cart.totalQuantity} | userId: {cart.userId}
                  </div>
                  <div className="text-green-600 font-normal">
                    savings: {formatCurrency(savings)} ({savingsPercent.toFixed(1)}%)
                  </div>
                </div>

                {/* Table Responsive */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="p-2">id</th>
                        <th className="p-2">title</th>
                        <th className="p-2">price</th>
                        <th className="p-2">quantity</th>
                        <th className="p-2">discount%</th>
                        <th className="p-2">total</th>
                        <th className="p-2">discountedTotal</th>
                        <th className="p-2">thumbnail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.products.map((p) => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{p.id}</td>
                          <td className="p-2 font-medium">{p.title}</td>
                          <td className="p-2">{formatCurrency(p.price)}</td>
                          <td className="p-2">{p.quantity}</td>
                          <td className="p-2">{p.discountPercentage}%</td>
                          <td className="p-2">{formatCurrency(p.total)}</td>
                          <td className="p-2">{formatCurrency(p.discountedTotal)}</td>
                          <td className="p-2">
                            <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-cover rounded border" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Raw JSON Actions */}
                <div>
                  <Button onClick={() => toggleJson(cart.id)}>
                    {expandedJson[cart.id] ? 'Hide Raw JSON' : 'Show Raw JSON'}
                  </Button>
                  {expandedJson[cart.id] && (
                    <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto max-h-60">
                      {JSON.stringify(cart, null, 2)}
                    </pre>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} / {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
}