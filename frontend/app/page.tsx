'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coffee, ShoppingCart, Users, Settings, ArrowRight, Star, Clock, Shield } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brown-600 to-brown-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Coffee className="h-16 w-16 mx-auto mb-6 text-brown-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Delicious Coffee, Easy Ordering
            </h1>
            <p className="text-xl md:text-2xl text-brown-100 mb-8 max-w-3xl mx-auto">
              Experience the perfect blend of great coffee and modern technology.
              Order ahead, skip the line, and enjoy your favorite drinks just the way you like them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                user?.role === 'admin' ? (
                  <>
                    <Link href="/admin">
                      <Button size="lg" className="bg-white text-brown-700 hover:bg-brown-50">
                        <Settings className="mr-2 h-5 w-5" />
                        Admin Dashboard
                      </Button>
                    </Link>
                    <Link href="/menu">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brown-700">
                        View Menu
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/menu">
                      <Button size="lg" className="bg-white text-brown-700 hover:bg-brown-50">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Order Now
                      </Button>
                    </Link>
                    <Link href="/orders">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brown-700">
                        My Orders
                      </Button>
                    </Link>
                  </>
                )
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-brown-700 hover:bg-brown-50">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/menu">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brown-700">
                      Browse Menu
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Cafe?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine exceptional coffee with cutting-edge technology to give you the best ordering experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-brown-100 rounded-full p-3 w-fit">
                  <Coffee className="h-8 w-8 text-brown-600" />
                </div>
                <CardTitle>Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Carefully selected beans from the best farms, roasted to perfection by our expert baristas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-blue-100 rounded-full p-3 w-fit">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Quick Service</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Order ahead and skip the line. Your drink will be ready when you arrive.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Secure Ordering</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Safe and secure payment processing with order tracking every step of the way.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 rounded-full p-3 w-fit">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Customer Rewards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Earn points with every order and enjoy exclusive member benefits.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get your favorite coffee in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brown-100 text-brown-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Menu</h3>
              <p className="text-gray-600">
                Explore our wide selection of coffee, pastries, and more. Customize your order just the way you like it.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brown-100 text-brown-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Place Order</h3>
              <p className="text-gray-600">
                Add items to your cart and checkout securely. Pay online and choose pickup time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-brown-100 text-brown-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Pickup & Enjoy</h3>
              <p className="text-gray-600">
                Skip the line and grab your order when it's ready. Enjoy your perfectly crafted coffee!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Customer Favorites
            </h2>
            <p className="text-lg text-gray-600">
              Try our most popular items loved by our customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Cappuccino', price: '$4.50', rating: 4.8, description: 'Rich espresso with steamed milk foam' },
              { name: 'Caramel Latte', price: '$5.50', rating: 4.9, description: 'Smooth latte with sweet caramel syrup' },
              { name: 'Blueberry Muffin', price: '$3.50', rating: 4.7, description: 'Fresh baked with real blueberries' },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge variant="secondary">{item.price}</Badge>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{item.rating}</span>
                    </div>
                    <Link href="/menu">
                      <Button size="sm">Order Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brown-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Your Coffee Fix?
          </h2>
          <p className="text-xl text-brown-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who enjoy great coffee and convenient ordering.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-brown-700 hover:bg-brown-50">
              Start Ordering
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}