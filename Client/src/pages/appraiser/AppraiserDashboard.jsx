import React from "react";
import SidebarAppraiser from "../../components/ui/SidebarAppraiser";
import HeaderStaff from "../../components/ui/HeaderStaff";

const AppraiserDashboard = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <SidebarAppraiser />
            <div className="flex flex-col flex-1">
                <HeaderStaff />
                <main className="flex flex-col items-center justify-center mt-30 text-center px-6">
                    <div className="mb-6">
                        <span className="text-6xl">👋</span>
                    </div>

                    <h1 className="text-5xl text-gray-800 mb-2 tracking-tighter">
                        Welcome, Manager!
                    </h1>

                    <p className="text-gray-700 mb-6 max-w-4xl text-lg">
                        Manage your pawnshop efficiently. You can add and manage staff, track transactions, 
                        generate receipts, and monitor your business all in one place.
                    </p>

                    <p className="text-gray-500 text-sm mt-20 max-w-sm">
                        Use the sidebar to navigate through different sections and start managing your pawnshop.
                    </p>
                </main>
            </div>
        </div>
    );
};

export default AppraiserDashboard;
