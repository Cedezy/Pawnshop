import React, { useEffect, useState } from "react";
import SidebarManager from "../../components/ui/SidebarManager";
import HeaderStaff from "../../components/ui/HeaderStaff";
import SkeletonDashboard from "../../components/ui/SkeletonDashboard";
import NotAllowed from "../../components/ui/NotAllowed";
import axios from "../../api/axios";
import { Settings, Shield } from "lucide-react";

const ManagerDashboard = () => {
    const [manager, setManager] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchManager = async () => {
        try {
            const response = await axios.get("/user/me", {
                withCredentials: true,
            });

            if (response.data.user?.role !== "manager") {
                setManager(null);
            } else {
                setManager(response.data.user);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchManager();
    }, []);

    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarManager />
            <div className="flex flex-col flex-1">
                <HeaderStaff />
                <main className="flex-1 overflow-y-auto px-6 py-8">
                    {loading && <SkeletonDashboard />}
                    {!loading && !manager && <NotAllowed />}
                    {!loading && manager && (
                        <div className="max-w-6xl mx-auto space-y-6">
                            <div className="bg-white rounded-lg p-8 shadow-sm">
                                <h1 className="text-3xl font-medium tracking-tighter text-gray-900 mb-2">
                                    Welcome Manager!
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    You can view records, add customers, and create new pawn transactions
                                </p>

                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Settings className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Manager Access
                                        </h2>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">View Transactions</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                View pawn, renewal, and redemption records
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">Add Customers</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Register new customers into the system
                                            </p>
                                        </div>

                                        <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                            <p className="font-medium text-gray-900 text-sm">Add Pawn Transactions</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Create new pawn records for customers
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <Shield className="w-5 h-5 text-red-600" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Access Limitations
                                        </h2>
                                    </div>
                                    <div className="space-y-4 text-sm text-gray-600">
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                            <p>View system records and transaction history only</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                            <p>Add new customers to the pawnshop system</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                            <p>Create new pawn transactions for customers</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                            <p>No access to system settings, rates, or staff management</p>
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

export default ManagerDashboard;