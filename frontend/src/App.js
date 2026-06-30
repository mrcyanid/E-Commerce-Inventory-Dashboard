import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import OrderList from './components/Orders/OrderList';
import Layout from './components/Layout/Layout';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Checking authentication...</p>
                </div>
            </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Toaster 
                    position="top-right"
                    toastOptions={{
                        duration: 2000, // Default 2 seconds for all toasts
                        style: {
                            background: '#363636',
                            color: '#fff',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        success: {
                            duration: 2000,
                            icon: '✅',
                            style: {
                                background: '#22c55e',
                                color: '#fff',
                            },
                        },
                        error: {
                            duration: 3000,
                            icon: '❌',
                            style: {
                                background: '#ef4444',
                                color: '#fff',
                            },
                        },
                    }}
                />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="/products" element={
                        <ProtectedRoute>
                            <Layout>
                                <ProductList />
                            </Layout>
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute>
                            <Layout>
                                <OrderList />
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;