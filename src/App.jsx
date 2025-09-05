import React from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Button } from './components/ui/button';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CompareProvider } from './contexts/CompareContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const ProductsPage = React.lazy(() => import('./pages/ProductsPage').then(module => ({ default: module.ProductsPage })));
const CategoriesPage = React.lazy(() => import('./pages/CategoriesPage').then(module => ({ default: module.CategoriesPage })));
const TrendingPage = React.lazy(() => import('./pages/TrendingPage').then(module => ({ default: module.TrendingPage })));
const BrandsPage = React.lazy(() => import('./pages/BrandsPage').then(module => ({ default: module.BrandsPage })));
const ProductDetailsPage = React.lazy(() => import('./pages/ProductDetailsPage').then(module => ({ default: module.ProductDetailsPage })));
const WishlistPage = React.lazy(() => import('./pages/WishlistPage').then(module => ({ default: module.WishlistPage })));
const CartPage = React.lazy(() => import('./pages/CartPage').then(module => ({ default: module.CartPage })));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage').then(module => ({ default: module.CheckoutPage })));
const OrderSuccessPage = React.lazy(() => import('./pages/OrderSuccessPage').then(module => ({ default: module.OrderSuccessPage })));
const ComparePage = React.lazy(() => import('./pages/ComparePage').then(module => ({ default: module.ComparePage })));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <CartProvider>
              <Router>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Main application routes */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      
                      {/* Auth routes - handled by overlay */}
                      <Route path="/login" element={<HomePage />} />
                      <Route path="/register" element={<HomePage />} />
                      
                      {/* Product routes */}
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/brands" element={<BrandsPage />} />
                      <Route path="/trending" element={<TrendingPage />} />
                      <Route path="/product/:id" element={<ProductDetailsPage />} />
                      
                      {/* Wishlist route */}
                      <Route path="/wishlist" element={<WishlistPage />} />
                      
                      {/* Compare route */}
                      <Route path="/compare" element={<ComparePage />} />
                      
                      {/* Cart route */}
                      <Route path="/cart" element={<CartPage />} />
                      
                      {/* Checkout routes */}
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/order-success" element={<OrderSuccessPage />} />
                      
                      {/* Protected admin routes */}
                      <Route path="/admin/*" element={
                        <ProtectedRoute roles={['admin']}>
                          <Routes>
                            <Route path="/dashboard" element={<AdminDashboard />} />
                            <Route path="*" element={<AdminDashboard />} />
                          </Routes>
                        </ProtectedRoute>
                      } />

                      {/* Protected seller routes */}
                      <Route path="/seller/*" element={
                        <ProtectedRoute roles={['admin', 'seller']}>
                          <div className="min-h-screen flex items-center justify-center">
                            <h1 className="text-2xl font-bold">Seller Dashboard Coming Soon</h1>
                          </div>
                        </ProtectedRoute>
                      } />

                      {/* Protected customer routes */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <div className="min-h-screen flex items-center justify-center">
                            <h1 className="text-2xl font-bold">User Profile Coming Soon</h1>
                          </div>
                        </ProtectedRoute>
                      } />
                    </Route>

                    {/* 404 route */}
                    <Route path="*" element={
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                          <p className="text-gray-600 mb-6">Page not found</p>
                          <Button onClick={() => window.history.back()}>
                            Go Back
                          </Button>
                        </div>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </Router>
            </CartProvider>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;