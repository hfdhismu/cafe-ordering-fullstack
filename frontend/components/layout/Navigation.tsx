'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Coffee,
  ShoppingCart,
  User,
  Settings,
  Package,
  BarChart3,
  LogOut,
  Menu,
} from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-brown-600" />
              <span className="text-xl font-bold text-gray-900">Cafe Orders</span>
            </Link>

            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-4 ml-10">
                <Link
                  href="/menu"
                  className="text-gray-700 hover:text-brown-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Menu
                </Link>

                {user?.role === 'admin' && (
                  <>
                    <Link
                      href="/admin/products"
                      className="text-gray-700 hover:text-brown-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <Package className="inline h-4 w-4 mr-1" />
                      Products
                    </Link>
                    <Link
                      href="/admin/orders"
                      className="text-gray-700 hover:text-brown-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      <BarChart3 className="inline h-4 w-4 mr-1" />
                      Orders
                    </Link>
                  </>
                )}

                {user?.role === 'customer' && (
                  <Link
                    href="/orders"
                    className="text-gray-700 hover:text-brown-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    My Orders
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'customer' && (
                  <Button variant="ghost" onClick={toggleCart} className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'} className="w-fit">
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;