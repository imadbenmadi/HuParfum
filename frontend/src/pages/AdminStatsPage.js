// Admin Stats Page - Dashboard Statistics

import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminStatsPage({ adminToken }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, [adminToken]);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost:5001/api/admin/dashboard/stats",
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );
            if (res.data.success) {
                setStats(res.data.stats);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-candle-white mb-8">
                لوحة التحكم
            </h2>

            {loading ? (
                <p className="text-center text-candle-yellow text-lg">
                    جاري التحميل...
                </p>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Orders */}
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                        <div className="text-blue-300 text-sm font-semibold mb-2">
                            إجمالي الطلبات
                        </div>
                        <div className="text-4xl font-bold text-blue-200">
                            {stats.total_orders}
                        </div>
                    </div>

                    {/* Today's Orders */}
                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                        <div className="text-yellow-300 text-sm font-semibold mb-2">
                            طلبات اليوم
                        </div>
                        <div className="text-4xl font-bold text-yellow-200">
                            {stats.today_orders}
                        </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                        <div className="text-orange-300 text-sm font-semibold mb-2">
                            طلبات جديدة
                        </div>
                        <div className="text-4xl font-bold text-orange-200">
                            {stats.pending_orders}
                        </div>
                    </div>

                    {/* Completed Orders */}
                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 rounded-xl p-6">
                        <div className="text-green-300 text-sm font-semibold mb-2">
                            طلبات مكتملة
                        </div>
                        <div className="text-4xl font-bold text-green-200">
                            {stats.completed_orders}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default AdminStatsPage;
