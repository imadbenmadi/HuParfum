// Main App component
// Router setup and global state management

import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import axios from "axios";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import APITester from "./pages/APITester";
import TestingHub from "./pages/TestingHub";

// Components
import { ToastContainer } from "./components/Toast";

// CSS
import "./App.css";

function App() {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [adminToken, setAdminToken] = useState(
        localStorage.getItem("adminToken")
    );

    // Check if user is logged in on mount
    useEffect(() => {
        if (token) {
            // Verify token and fetch user profile
            axios
                .get("http://localhost:5001/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    setToken(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    // Check if admin is logged in on mount
    useEffect(() => {
        if (adminToken) {
            // Admin token exists, set admin state
            const adminData = JSON.parse(
                localStorage.getItem("adminData") || "{}"
            );
            setAdmin(adminData);
        }
    }, [adminToken]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        setAdminToken(null);
        setAdmin(null);
    };

    if (loading) {
        return <div className="loading">جاري التحميل...</div>;
    }

    return (
        <Router>
            <ToastContainer />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/cart" element={<CartPage token={token} />} />
                <Route
                    path="/login"
                    element={
                        token ? (
                            <Navigate to="/my-orders" />
                        ) : (
                            <LoginPage setToken={setToken} setUser={setUser} />
                        )
                    }
                />
                <Route
                    path="/register"
                    element={
                        token ? <Navigate to="/my-orders" /> : <RegisterPage />
                    }
                />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* User Protected Routes */}
                <Route
                    path="/my-orders"
                    element={
                        token ? (
                            <MyOrdersPage
                                token={token}
                                user={user}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />
                <Route
                    path="/profile"
                    element={
                        token ? (
                            <UserProfilePage
                                token={token}
                                user={user}
                                onLogout={handleLogout}
                            />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin/login"
                    element={
                        adminToken ? (
                            <Navigate to="/admin/dashboard" />
                        ) : (
                            <AdminLoginPage
                                setAdminToken={setAdminToken}
                                setAdmin={setAdmin}
                            />
                        )
                    }
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        adminToken ? (
                            <AdminDashboardPage
                                admin={admin}
                                token={adminToken}
                                onLogout={handleAdminLogout}
                            />
                        ) : (
                            <Navigate to="/admin/login" />
                        )
                    }
                />

                {/* API Testing Routes */}
                <Route path="/api-tester" element={<APITester />} />
                <Route path="/testing" element={<TestingHub />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
