import React, { useState, useEffect } from "react";
import HeaderCustomer from "../../components/ui/HeaderCustomer";
import NotAllowed from "../../components/ui/NotAllowed";
import DashboardSkeleton from "../../components/ui/DashboardSkeleton";
import axios from "../../api/axios";

const CustomerDashboard = () => {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchCustomerData = async () => {
        setLoading(true);

        try{
            const response = await axios.get("/user/me", {
                withCredentials: true,
            });
            setCustomer(response.data.user);
        } 
        catch(err){
            console.log(err);
        }
        finally{
            setLoading(false);
        }
    };

     useEffect(() => {
        const fetchData = () => {
            fetchCustomerData();
        };
        fetchData();
    }, []);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <HeaderCustomer />
            <div className="flex-1 overflow-y-auto md:px-6 pb-4 md:pt-4">
                {loading && <DashboardSkeleton />}
                {!loading && !customer && <NotAllowed />}
                {!loading && customer && (
                    <div className="mx-auto md:max-w-7xl p-6 flex flex-col gap-6">
                        <div className="bg-white rounded-lg p-8 shadow-sm">
                            <h1 className="text-3xl font-medium tracking-tighter text-gray-900">
                                Welcome {customer.firstname} {customer.lastname}
                            </h1>

                            <p className="text-gray-600 text-sm mt-2">
                                View and manage your pawn transactions, payments, and account information.
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                                All records displayed are based on official pawnshop transactions.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Customer Services
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Active Pawn Transactions
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                View the status, maturity dates, and details of your current pawned items.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Payments and Redemption
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                Process payments or redeem pawned items in accordance with your agreement.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                Transaction Records
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                Review your completed pawn transactions and payment history.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Important Reminders
                                </h2>

                                <div className="space-y-4 text-sm text-gray-600">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                        <p>Monitor your due dates to avoid penalties or item forfeiture.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                        <p>Ensure your contact information is accurate and up to date.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                        <p>Contact customer support for questions regarding transactions.</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                                        <p>Review the terms and conditions of each pawn agreement carefully.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDashboard;
