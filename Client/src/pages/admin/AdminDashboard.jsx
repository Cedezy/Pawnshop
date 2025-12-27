import React, { useEffect, useState } from "react";
import SidebarAdmin from "../../components/ui/SidebarAdmin";
import HeaderStaff from "../../components/ui/HeaderStaff";
import SkeletonDashboard from "../../components/ui/SkeletonDashboard";
import NotAllowed from "../../components/ui/NotAllowed";
import axios from "../../api/axios";
import { Settings, Shield } from "lucide-react";

const AdminDashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAdmin = async () => {
        try {
            const response = await axios.get("/user/me", {
                withCredentials: true,
            });

            if (response.data.user?.role !== "admin") {
                setAdmin(null);
            } else {
                setAdmin(response.data.user);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarAdmin />
            <div className="flex flex-col flex-1">
                <HeaderStaff />
                <main className="flex-1 overflow-y-auto px-6 py-8">
                    {loading && <SkeletonDashboard />}
                    {!loading && !admin && <NotAllowed />}
                    {!loading && admin && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            
                            {/* Welcome Section */}
                            <div className="bg-white rounded-lg p-8 shadow-sm">
                                <h1 className="text-3xl font-medium tracking-tighter text-gray-900 mb-2">
                                    Welcome Admin!
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Complete overview and control of your pawnshop operations
                                </p>
                            </div>

                            {/* Management Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            System Management
                                        </h2>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">Transaction Management</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Process pawns, renewals, and redemptions</p>
                                        </div>
                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">Customer Records</p>
                                            <p className="text-xs text-gray-500 mt-0.5">View and manage customer information</p>
                                        </div>
                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">Payment Processing</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Handle payments and financial transactions</p>
                                        </div>
                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">Reports & Analytics</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Generate business insights and reports</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <Shield className="w-5 h-5 text-red-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Administrative Tools
                                        </h2>
                                    </div>
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 "></div>
                                            <p>Manage staff accounts and access permissions for secure operations</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 "></div>
                                            <p>Configure interest rates, loan terms, and pawnshop policies</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 "></div>
                                            <p>Monitor system activity logs and audit trails for compliance</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 "></div>
                                            <p>Access backup and data management tools for system security</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 "></div>
                                            <p>Review and approve critical transactions requiring admin authorization</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;