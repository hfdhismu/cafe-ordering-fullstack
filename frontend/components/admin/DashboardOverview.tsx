'use client';

import React, { useEffect, useState } from 'react';
import { ordersAPI, productsAPI } from '@/lib/api';
import { OrderStats, Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Coffee,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          ordersAPI.getStats(),
          productsAPI.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        ]);

        setOrderStats(ordersData.data);
        setRecentProducts(productsData.data.products);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: orderStats?.totalOrders || 0,
      description: 'All time orders',
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      title: 'Total Revenue',
      value: `$${orderStats?.totalRevenue.toFixed(2) || '0.00'}`,
      description: 'All time revenue',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Pending Orders',
      value: orderStats?.ordersByStatus.pending || 0,
      description: 'Orders awaiting processing',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Completed Orders',
      value: orderStats?.ordersByStatus.completed || 0,
      description: 'Successfully completed',
      icon: CheckCircle,
      color: 'text-emerald-600',
    },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Order Status Distribution
            </CardTitle>
            <CardDescription>
              Current status of all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(orderStats?.ordersByStatus || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                  </div>
                  <Badge variant="secondary" className={statusColors[status as keyof typeof statusColors]}>
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Products
            </CardTitle>
            <CardDescription>
              Latest products added to the menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Coffee className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No products yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you might want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/admin/products/new"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-medium">Add New Product</p>
                <p className="text-sm text-gray-500">Add a new item to the menu</p>
              </div>
            </a>
            <a
              href="/admin/orders"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium">View Orders</p>
                <p className="text-sm text-gray-500">Manage customer orders</p>
              </div>
            </a>
            <a
              href="/admin/products"
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Coffee className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium">Manage Products</p>
                <p className="text-sm text-gray-500">Update menu items</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;